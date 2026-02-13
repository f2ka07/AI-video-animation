import os
import tempfile
import requests
import uuid
from pathlib import Path
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import FileResponse

from azure_pronounce import assess_pronunciation
from tts_engine import synthesize_tts
from text_fix import fix_text
from whisper_client import transcribe

app = FastAPI()

WHISPER_URL = os.getenv("WHISPER_URL", "http://whisper-svc:9000/transcribe")
DEFAULT_STYLE = os.getenv("DEFAULT_STYLE", "instructor")
PUBLIC_URL = os.getenv("PUBLIC_URL", "")  # RunPod public endpoint (e.g., https://xxx-xxx-xxx.runpod.net)

# Directory for temporary file storage (RunPod provides this)
STORAGE_DIR = Path("/tmp/audio_files")
STORAGE_DIR.mkdir(exist_ok=True)

@app.get("/files/{file_id}")
async def serve_file(file_id: str):
    """Serve audio files publicly for RunPod Whisper API"""
    file_path = STORAGE_DIR / file_id
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path, media_type="audio/wav")

@app.post("/process-chunk")
async def process_chunk(file: UploadFile = File(...), style: str = DEFAULT_STYLE):
    # 1. Save uploaded audio to temporary storage (RunPod provides this)
    file_id = str(uuid.uuid4()) + ".wav"
    audio_path = STORAGE_DIR / file_id
    with open(audio_path, "wb") as f:
        f.write(await file.read())

    try:
        # 2. Whisper (with retry for transient crashes)
        # If using RunPod provider, convert local path to public URL
        whisper_audio_path = str(audio_path)
        if os.getenv("WHISPER_PROVIDER", "local").lower() == "runpod" and PUBLIC_URL:
            # Use public URL for RunPod - it can access our file endpoint
            whisper_audio_path = f"{PUBLIC_URL}/files/{file_id}"
        
        whisper_result = None
        max_retries = 3
        for attempt in range(max_retries):
            try:
                whisper_result = transcribe(whisper_audio_path)
                break
            except requests.exceptions.HTTPError as e:
                # HTTP errors (503, rate limits, etc.) - show actual status code
                status_code = e.response.status_code if hasattr(e, 'response') and e.response else 503
                detail_msg = f"Whisper API error (HTTP {status_code})"
                if status_code == 503:
                    # Model loading or rate limit - retry with longer waits (HF free tier can take 30-60s)
                    if attempt < max_retries - 1:
                        wait_time = (attempt + 1) * 20  # Longer waits: 20s, 40s, 60s
                        print(f"DEBUG: Whisper API unavailable (attempt {attempt + 1}/{max_retries}), waiting {wait_time}s (model may be loading)...")
                        import time
                        time.sleep(wait_time)
                        continue
                raise HTTPException(status_code=503, detail=f"{detail_msg}: {str(e)}")
            except (requests.exceptions.ConnectionError, requests.exceptions.ChunkedEncodingError) as e:
                if attempt < max_retries - 1:
                    print(f"DEBUG: Whisper connection error (attempt {attempt + 1}/{max_retries}): {type(e).__name__}: {str(e)}")
                    import time
                    time.sleep(1)
                    continue
                raise HTTPException(status_code=503, detail=f"Whisper service unavailable after {max_retries} attempts: {type(e).__name__}: {str(e)}")
            except requests.exceptions.Timeout as e:
                raise HTTPException(status_code=504, detail=f"Whisper service timeout: {str(e)}")
        
        if whisper_result is None:
            raise HTTPException(status_code=503, detail="Failed to get response from Whisper service")

        words = whisper_result.get("words", [])
        reference_text = " ".join(w["word"] for w in words).strip()

        if not reference_text:
            return FileResponse(audio_path, media_type="audio/wav", filename="original.wav")

        # 3. Azure Pronunciation
        assessment = assess_pronunciation(
            audio_path=str(audio_path),
            reference_text=reference_text,
        )

        overall_score = assessment.get("overall_score", 100.0)
        word_scores = assessment.get("word_scores", [])
        
        print(f"DEBUG: overall_score={overall_score}, type={type(overall_score)}")

        # Threshold tweakable
        if overall_score >= 90:
            print(f"DEBUG: Score {overall_score} >= 90, returning original audio")
            return FileResponse(audio_path, media_type="audio/wav", filename="original.wav")
        
        print(f"DEBUG: Score {overall_score} < 90, generating TTS")

        # 4. Fix / normalize text
        corrected_text = fix_text(reference_text, word_scores)

        # 5. TTS
        out_path = synthesize_tts(
            text=corrected_text,
            style=style,
            prefer_user_voice=True,
        )

        return FileResponse(out_path, media_type="audio/wav", filename="fixed.wav")
    
    except HTTPException:
        # Re-raise HTTPException to let FastAPI handle it properly
        if audio_path.exists():
            audio_path.unlink()
        raise
    except requests.RequestException as e:
        if audio_path.exists():
            audio_path.unlink()
        raise HTTPException(status_code=503, detail=f"Whisper service error: {str(e)}")
    except Exception as e:
        if audio_path.exists():
            audio_path.unlink()
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")

@app.get("/health")
async def health():
    return {"status": "ok"}
