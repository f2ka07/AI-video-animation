import os
import tempfile
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import whisper

app = FastAPI()

WHISPER_MODEL = os.getenv("WHISPER_MODEL", "base.en")
model = None
_model_loading = False

def get_model():
    global model, _model_loading
    if model is None and not _model_loading:
        _model_loading = True
        print(f"Loading Whisper model: {WHISPER_MODEL}")
        try:
            model = whisper.load_model(WHISPER_MODEL, device="cpu")
            print("Model loaded successfully")
        finally:
            _model_loading = False
    return model

@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    model = get_model()
    if not model:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name
        
        result = model.transcribe(tmp_path, word_timestamps=True)
        
        words = []
        if "segments" in result:
            for segment in result["segments"]:
                if "words" in segment:
                    for word_info in segment["words"]:
                        words.append({
                            "word": word_info["word"].strip(),
                            "start": word_info["start"],
                            "end": word_info["end"]
                        })
        
        os.unlink(tmp_path)
        
        return JSONResponse(content={
            "text": result["text"],
            "words": words
        })
    
    except Exception as e:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")

@app.get("/health")
async def health():
    return {"status": "ok", "model_loaded": get_model() is not None}
