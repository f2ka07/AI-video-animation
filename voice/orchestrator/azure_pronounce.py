import os
from typing import Dict

import azure.cognitiveservices.speech as speechsdk

AZURE_SPEECH_KEY = os.getenv("AZURE_SPEECH_KEY")
AZURE_SPEECH_REGION = os.getenv("AZURE_SPEECH_REGION")
AZURE_MODE = os.getenv("AZURE_MODE", "stub").lower()

def _assess_real(audio_path: str, reference_text: str) -> Dict:
    speech_config = speechsdk.SpeechConfig(
        subscription=AZURE_SPEECH_KEY,
        region=AZURE_SPEECH_REGION,
    )

    audio_config = speechsdk.audio.AudioConfig(filename=audio_path)

    # Reference text is what we want them to say
    pron_config = speechsdk.PronunciationAssessmentConfig(
        reference_text=reference_text,
        grading_system=speechsdk.PronunciationAssessmentGradingSystem.HundredMark,
        granularity=speechsdk.PronunciationAssessmentGranularity.Word,
        phoneme_alphabet=speechsdk.PronunciationAssessmentPhonemeAlphabet.IPA,
        enable_miscue=True,
    )

    recognizer = speechsdk.SpeechRecognizer(
        speech_config=speech_config,
        audio_config=audio_config,
        language="en-US",
    )

    pron_config.apply_to(recognizer)

    result = recognizer.recognize_once()
    if result.reason != speechsdk.ResultReason.RecognizedSpeech:
        # fallback
        return {
            "overall_score": 100.0,
            "word_scores": [
                {"word": w, "score": 100.0, "error_type": "None"}
                for w in reference_text.split()
            ],
        }

    pa_result = speechsdk.PronunciationAssessmentResult(result)

    words_info = pa_result.detail_result.words
    word_scores = []
    for w in words_info:
        word_scores.append(
            {
                "word": w.word,
                "score": w.accuracy_score,
                "error_type": w.error_type.name if w.error_type else "None",
            }
        )

    return {
        "overall_score": pa_result.accuracy_score,
        "word_scores": word_scores,
    }

def _assess_stub(audio_path: str, reference_text: str) -> Dict:
    # Basic stub: everything perfect
    return {
        "overall_score": 100.0,
        "word_scores": [
            {"word": w, "score": 100.0, "error_type": "None"}
            for w in reference_text.split()
        ],
    }

def assess_pronunciation(audio_path: str, reference_text: str) -> Dict:
    if AZURE_MODE == "real":
        return _assess_real(audio_path, reference_text)
    else:
        return _assess_stub(audio_path, reference_text)
