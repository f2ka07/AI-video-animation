#!/usr/bin/env python3
"""Test RunPod integration directly"""
import os
import sys
sys.path.insert(0, 'orchestrator')

# Set environment variables from .env if it exists
if os.path.exists('.env'):
    with open('.env', 'r') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                os.environ[key] = value

from whisper_client import transcribe_runpod

# Test with sample MP3 URL (bypasses file upload)
sample_url = "https://d1q70pf5vjeyhc.cloudfront.net/predictions/f981a3dca8204b14ab24151fa0532c26/1.mp3"

print(f"Testing RunPod integration with sample URL: {sample_url}")
print("-" * 60)

try:
    result = transcribe_runpod(sample_url)
    print("\n✅ SUCCESS!")
    print(f"Text: {result.get('text', '')}")
    print(f"Words: {len(result.get('words', []))} words")
    if result.get('words'):
        print(f"First few words: {result['words'][:5]}")
except Exception as e:
    print(f"\n❌ ERROR: {type(e).__name__}: {str(e)}")
    import traceback
    traceback.print_exc()
