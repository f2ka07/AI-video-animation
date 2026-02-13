import os
import base64
import requests
from typing import Dict, Optional

WHISPER_PROVIDER = os.getenv("WHISPER_PROVIDER", "local").lower()
WHISPER_URL = os.getenv("WHISPER_URL", "http://whisper-svc:9000/transcribe")
WHISPER_API_KEY = os.getenv("WHISPER_API_KEY", "")

def transcribe_local(audio_path: str) -> Dict:
    """Local Whisper service format"""
    with open(audio_path, "rb") as f:
        r = requests.post(WHISPER_URL, files={"file": ("audio.wav", f, "audio/wav")}, timeout=300)
    r.raise_for_status()
    return r.json()

def transcribe_huggingface(audio_path: str) -> Dict:
    """Hugging Face Inference API (free tier available)"""
    # Uses openai/whisper-large-v2 model (confirmed available via HF Inference API)
    # See: https://huggingface.co/docs/transformers/model_doc/whisper
    api_url = "https://api-inference.huggingface.co/models/openai/whisper-large-v2"
    headers = {}
    if WHISPER_API_KEY:
        headers["Authorization"] = f"Bearer {WHISPER_API_KEY}"
    
    with open(audio_path, "rb") as f:
        r = requests.post(api_url, headers=headers, files={"file": ("audio.wav", f, "audio/wav")}, timeout=300)
    
    # Check for 410 Gone - model endpoint doesn't exist
    if r.status_code == 410:
        raise requests.exceptions.HTTPError(
            f"410 Client Error: Model endpoint not available. The Hugging Face model may not be accessible via Inference API. "
            f"Consider using a different provider (whisperapi, runpod) or a different model.",
            response=r
        )
    
    # raise_for_status will raise HTTPError for 503, which will be caught by main.py retry logic
    # Don't handle 503 here - let main.py handle retries with exponential backoff
    r.raise_for_status()
    result = r.json()
    
    # Convert HF format to our format
    text = result.get("text", "")
    chunks = result.get("chunks", [])
    
    words = []
    for chunk in chunks:
        if "timestamp" in chunk:
            words.append({
                "word": chunk.get("text", "").strip(),
                "start": chunk["timestamp"][0] if isinstance(chunk["timestamp"], list) else chunk.get("start", 0),
                "end": chunk["timestamp"][1] if isinstance(chunk["timestamp"], list) else chunk.get("end", 0)
            })
    
    if not words and text:
        # Fallback: split text into words without timestamps
        for word in text.split():
            words.append({"word": word, "start": 0, "end": 0})
    
    return {"text": text, "words": words}

def _upload_file_for_url(audio_path: str) -> str:
    """Upload file to temporary storage and return URL (for RunPod)"""
    # Try multiple file hosting services for reliability
    services = [
        _upload_to_fileio,
        _upload_to_0x0,
    ]
    
    for service_func in services:
        try:
            url = service_func(audio_path)
            if url:
                print(f"DEBUG: Successfully uploaded file to temporary storage: {url}")
                return url
        except Exception as e:
            print(f"DEBUG: File upload to {service_func.__name__} failed: {str(e)}, trying next service...")
            continue
    
    raise ConnectionError("Failed to upload file to temporary storage. All services (file.io, 0x0.st) unavailable or blocked.")

def _upload_to_fileio(audio_path: str) -> str:
    """Upload to file.io"""
    with open(audio_path, "rb") as f:
        files = {"file": ("audio.wav", f, "audio/wav")}
        r = requests.post("https://file.io", files=files, timeout=60)
        r.raise_for_status()
        result = r.json()
        if result.get("success") and result.get("link"):
            return result["link"]
        raise ValueError(f"file.io upload failed: {result}")

def _upload_to_0x0(audio_path: str) -> str:
    """Upload to 0x0.st"""
    with open(audio_path, "rb") as f:
        files = {"file": ("audio.wav", f, "audio/wav")}
        r = requests.post("https://0x0.st", files=files, timeout=60)
        r.raise_for_status()
        url = r.text.strip()
        if url and url.startswith("http"):
            return url
        raise ValueError(f"0x0.st upload failed: {url}")

def transcribe_runpod(audio_path: str) -> Dict:
    """RunPod Whisper API format - expects audio URL"""
    api_url = WHISPER_URL or "https://api.runpod.ai/v2/whisper-v3-large/run"
    
    # RunPod requires audio to be accessible via URL
    # If audio_path is already a URL, use it directly
    # Otherwise, upload to temporary storage first
    if audio_path.startswith("http://") or audio_path.startswith("https://"):
        audio_url = audio_path
    else:
        # Upload file to get URL
        audio_url = _upload_file_for_url(audio_path)
    
    headers = {
        "Content-Type": "application/json",
    }
    if WHISPER_API_KEY:
        headers["Authorization"] = f"Bearer {WHISPER_API_KEY}"
    
    payload = {
        "input": {
            "prompt": "",
            "audio": audio_url
        }
    }
    
    r = requests.post(api_url, json=payload, headers=headers, timeout=300)
    r.raise_for_status()
    result = r.json()
    
    # RunPod returns job ID, need to poll for results
    if "id" in result:
        # Job submitted, poll for results
        job_id = result["id"]
        # Correct polling endpoint: {base_url}/status/{job_id}
        base_url = api_url.rsplit("/", 1)[0]  # Remove "/run" from URL
        status_url = f"{base_url}/status/{job_id}"
        import time
        for _ in range(60):  # Poll for up to 60 seconds
            time.sleep(2)
            status_r = requests.get(status_url, headers=headers, timeout=300)
            status_r.raise_for_status()
            status_result = status_r.json()
            status = status_result.get("status", "")
            if status == "COMPLETED":
                result = status_result
                break
            elif status in ["FAILED", "TIMED_OUT"]:
                raise RuntimeError(f"RunPod job {job_id} failed with status: {status}")
    
    # Convert RunPod format to our format
    # Text is in output.result (or output.text as fallback)
    output = result.get("output", {})
    text = output.get("result", "") or output.get("text", "") or result.get("text", "")
    
    words = []
    # RunPod may return segments with timestamps
    segments = result.get("segments", []) or result.get("output", {}).get("segments", [])
    for segment in segments:
        if "words" in segment:
            words.extend(segment["words"])
        elif "text" in segment:
            words.append({
                "word": segment["text"].strip(),
                "start": segment.get("start", 0),
                "end": segment.get("end", 0)
            })
    
    if not words and text:
        # Fallback: split text into words
        for word in text.split():
            words.append({"word": word, "start": 0, "end": 0})
    
    return {"text": text, "words": words}

def transcribe_whisperapi(audio_path: str) -> Dict:
    """WhisperAPI.com format (5 free credits)"""
    api_url = "https://api.whisperapi.com/transcribe"
    
    headers = {}
    if WHISPER_API_KEY:
        headers["Authorization"] = f"Bearer {WHISPER_API_KEY}"
    
    with open(audio_path, "rb") as f:
        files = {"file": ("audio.wav", f, "audio/wav")}
        r = requests.post(api_url, files=files, headers=headers, timeout=300)
    
    r.raise_for_status()
    result = r.json()
    
    # Convert WhisperAPI format to our format
    text = result.get("text", "")
    words = result.get("words", [])
    
    if not words and text:
        # Fallback
        for word in text.split():
            words.append({"word": word, "start": 0, "end": 0})
    
    return {"text": text, "words": words}

def transcribe(audio_path: str) -> Dict:
    """Main transcription function - routes to appropriate provider"""
    provider_funcs = {
        "local": transcribe_local,
        "huggingface": transcribe_huggingface,
        "runpod": transcribe_runpod,
        "whisperapi": transcribe_whisperapi,
    }
    
    func = provider_funcs.get(WHISPER_PROVIDER, transcribe_local)
    return func(audio_path)
