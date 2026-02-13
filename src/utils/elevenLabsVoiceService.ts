// ElevenLabs TTS service integration
// Used as final fallback when Minimax fails
//
// NOTE: API endpoint and request format based on ElevenLabs API v1
// Check: https://elevenlabs.io/docs/api-reference/text-to-speech for latest API structure

import { getVoiceForService } from "./voiceMapping";

interface VoiceOptions {
	prompt: string;
	voice?: string;
	format?: string;
}

interface WordTiming {
	text: string;
	start: number;
	end: number;
}

interface ElevenLabsResponse {
	audio?: ArrayBuffer;
	words?: Array<{
		word: string;
		start: number;
		end: number;
	}>;
}

export class ElevenLabsVoiceService {
	private apiKey: string;
	private apiUrl: string = "https://api.elevenlabs.io/v1/text-to-speech";
	private defaultVoiceId: string = "21m00Tcm4TlvDq8ikWAM"; // Rachel voice (default)

	constructor(apiKey: string) {
		if (!apiKey) {
			throw new Error("ELEVENLABS_API_KEY is required");
		}
		this.apiKey = apiKey;
	}

	async generateAudio(
		options: VoiceOptions
	): Promise<{ audioUrl: string; jobId: string; audioData?: string; words?: WordTiming[] }> {
		try {
			// Map voice name to ElevenLabs voice ID if needed
			const voiceId = this.getVoiceId(options.voice);

			const response = await fetch(`${this.apiUrl}/${voiceId}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"xi-api-key": this.apiKey,
				},
				body: JSON.stringify({
					text: options.prompt,
					model_id: "eleven_monolingual_v1",
					voice_settings: {
						stability: 0.5,
						similarity_boost: 0.75,
					},
				}),
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`ElevenLabs API request failed: ${response.status} - ${errorText}`);
			}

			// ElevenLabs returns audio as binary data
			const audioBuffer = await response.arrayBuffer();
			
			// Convert to base64
			const base64Audio = Buffer.from(audioBuffer).toString("base64");
			const dataUri = `data:audio/mp3;base64,${base64Audio}`;

			// Note: ElevenLabs doesn't provide word-level timings in standard API
			// Would need to use their streaming API or post-process with Whisper
			const words: WordTiming[] | undefined = undefined;

			return {
				audioUrl: "",
				audioData: dataUri,
				jobId: "elevenlabs-immediate",
				words,
			};
		} catch (error) {
			throw new Error(`ElevenLabs TTS error: ${error instanceof Error ? error.message : String(error)}`);
		}
	}

	private getVoiceId(voiceName?: string): string {
		// Use voice mapping to get the appropriate ElevenLabs voice ID
		if (voiceName) {
			// If voiceName is already a voice ID (long alphanumeric string), use it directly
			if (/^[a-zA-Z0-9]{20,}$/.test(voiceName)) {
				return voiceName;
			}
			
			// Otherwise, map the voice name to ElevenLabs voice ID
			return getVoiceForService(voiceName, "elevenlabs");
		}

		return this.defaultVoiceId;
	}
}
