FROM python:3.11-slim

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    ffmpeg \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install heavy dependencies first (torch, whisper) - these change rarely
RUN pip install --no-cache-dir \
    torch \
    torchaudio \
    openai-whisper

# Install web framework dependencies - these change more often
# Separate layer so changes here don't invalidate torch cache
RUN pip install --no-cache-dir \
    fastapi \
    uvicorn[standard] \
    python-multipart

WORKDIR /app

COPY main.py .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "9000"]
