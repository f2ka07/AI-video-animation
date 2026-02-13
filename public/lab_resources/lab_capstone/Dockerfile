# Build from lab_resources directory.
# Build: docker build -t agentic-ai-capstone:latest -f lab_capstone/Dockerfile .

FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential curl && \
    rm -rf /var/lib/apt/lists/*

COPY pyproject.toml ./
COPY src ./src
COPY lab_capstone ./lab_capstone

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir .

ENV APP_MODULE="lab_capstone.app.api:app" \
    APP_PORT=8000

EXPOSE 8000

CMD ["sh", "-c", "uvicorn ${APP_MODULE} --host 0.0.0.0 --port ${APP_PORT}"]
