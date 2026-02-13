FROM python:3.11-slim

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir fastapi uvicorn[standard] python-multipart requests azure-cognitiveservices-speech

WORKDIR /app

COPY main.py .
COPY azure_pronounce.py .
COPY tts_engine.py .
COPY text_fix.py .
COPY whisper_client.py .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--timeout-keep-alive", "600", "--timeout-graceful-shutdown", "30"]
