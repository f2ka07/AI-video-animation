import os
import tempfile
from typing import Optional

import wave

TTS_MODE = os.getenv("TTS_MODE", "stub").lower()
TTS_PROVIDER = os.getenv("TTS_PROVIDER", "elevenlabs")
TTS_API_KEY = os.getenv("TTS_API_KEY", "")

def _write_silent_wav(path: str, duration_s: float = 1.0, sample_rate: int = 16000):
    n_frames = int(duration_s * sample_rate)
    with wave.open(path, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)  # 16-bit
        wf.setframerate(sample_rate)
        wf.writeframes(b"\x00\x00" * n_frames)

def _tts_stub(text: str, style: str, prefer_user_voice: bool) -> str:
    tmp = tempfile.NamedTemporaryFile(suffix=".wav", delete=False)
    tmp.close()
    # 1 second silent wav so you can test end-to-end
    _write_silent_wav(tmp.name, duration_s=1.0)
    return tmp.name

def _tts_real(text: str, style: str, prefer_user_voice: bool) -> str:
    """
    Placeholder for real TTS provider.

    You'll:
      - call your vendor's API
      - write the returned audio bytes into a temp wav
      - return path
    """
    tmp = tempfile.NamedTemporaryFile(suffix=".wav", delete=False)
    tmp.close()
    # TODO: implement using ElevenLabs / OpenAI / Minimax
    # For now still silent, but separate path so you can evolve it.
    _write_silent_wav(tmp.name, duration_s=1.0)
    return tmp.name

def synthesize_tts(text: str, style: str, prefer_user_voice: bool = True) -> str:
    if TTS_MODE == "real":
        return _tts_real(text, style, prefer_user_voice)
    else:
        return _tts_stub(text, style, prefer_user_voice)
