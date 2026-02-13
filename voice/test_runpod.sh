#!/bin/bash
# Test RunPod API directly with a URL (matching the curl example)

# Example from user's curl - using a public audio URL
AUDIO_URL="https://d1q70pf5vjeyhc.cloudfront.net/predictions/f981a3dca8204b14ab24151fa0532c26/1.mp3"

# Read API key from .env if available
if [ -f .env ]; then
    export $(grep -v '^#' .env | grep WHISPER_API_KEY | xargs)
fi

# Test RunPod API
curl -X POST "https://api.runpod.ai/v2/whisper-v3-large/run" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer ${WHISPER_API_KEY}" \
    -d "{\"input\":{\"prompt\":\"\",\"audio\":\"${AUDIO_URL}\"}}"
