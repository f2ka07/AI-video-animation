// Minimax Direct TTS service using official MiniMax API
// API: https://api.minimax.io/v1/t2a_v2 (NOT .chat domain)
// Uses v2 API format with Bearer auth

interface VoiceOptions {
	prompt: string;
	voice?: string;
	format?: string;
	speed?: number;
}

interface WordTiming {
	text: string;
	start: number;
	end: number;
}

interface MinimaxResponse {
	base_resp?: {
		status_code?: number;
		status_msg?: string;
	};
	status_code?: number;
	status_msg?: string;
	data?: {
		audio?: string; // hex encoded audio
		status?: number;
	};
	audio_file?: string;
	audio?: string;
	extra_info?: {
		audio_length?: number;
		audio_sample_rate?: number;
		audio_size?: number;
		word_count?: number;
	};
	trace_id?: string;
}

// Default Minimax voices available
export const MINIMAX_DEFAULT_VOICES = [
	{ id: "English_expressive_narrator", name: "Expressive Narrator (EN)", description: "Expressive English voice" },
	{ id: "male-qn-qingse", name: "Qingse (Male)", description: "Young male voice" },
	{ id: "male-qn-jingying", name: "Jingying (Male)", description: "Professional male" },
	{ id: "female-shaonv", name: "Shaonv (Female)", description: "Young female voice" },
	{ id: "female-yujie", name: "Yujie (Female)", description: "Mature female voice" },
	{ id: "presenter_male", name: "Presenter (Male)", description: "News presenter style" },
	{ id: "presenter_female", name: "Presenter (Female)", description: "News presenter style" },
	{ id: "audiobook_male_1", name: "Audiobook (Male)", description: "Storyteller voice" },
	{ id: "audiobook_female_1", name: "Audiobook (Female)", description: "Storyteller voice" },
];

export class MinimaxDirectService {
	private apiKey: string;
	// Use api.minimax.io (not .chat) for TTS
	private apiUrl: string = "https://api.minimax.io/v1/t2a_v2";

	constructor(apiKey: string) {
		if (!apiKey) {
			throw new Error("MINIMAX_API_KEY is required for Minimax Direct service");
		}
		this.apiKey = apiKey;
	}

	async generateAudio(
		options: VoiceOptions
	): Promise<{ audioUrl: string; jobId: string; audioData?: string; words?: WordTiming[] }> {
		try {
			// Use one voice per course for narrator consistency (see docs/code-slide-guidelines.md)
			const voiceId = options.voice || "English_expressive_narrator";
			const speed = options.speed || 1.0;

			// v2 API format per official docs
			const requestBody = {
				model: "speech-02-hd",
				text: options.prompt,
				stream: false,
				output_format: "hex",
				voice_setting: {
					voice_id: voiceId,
					speed: speed,
					vol: 1,
					pitch: 0,
				},
				audio_setting: {
					sample_rate: 32000,
					bitrate: 128000,
					format: "wav",
					channel: 1,
				},
			};

			console.log(`[MinimaxDirect] Generating audio with voice: ${voiceId}`);

			const response = await fetch(this.apiUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.apiKey}`,
				},
				body: JSON.stringify(requestBody),
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Minimax API request failed: ${response.status} - ${errorText}`);
			}

			const data: MinimaxResponse = await response.json();

			// Check for v2 API errors (multiple possible formats)
			if (data.status_code && data.status_code !== 0) {
				throw new Error(`Minimax API error: ${data.status_msg || "Unknown error"} (code: ${data.status_code})`);
			}
			if (data.base_resp?.status_code !== undefined && data.base_resp.status_code !== 0) {
				throw new Error(`Minimax API error: ${data.base_resp.status_msg || "Unknown error"}`);
			}

			// Try multiple audio field locations
			const audioHex = data.data?.audio || data.audio_file || data.audio;

			if (audioHex) {
				// Minimax returns hex-encoded audio
				const audioBuffer = Buffer.from(audioHex, "hex");
				const audioBase64 = audioBuffer.toString("base64");

				console.log(`[MinimaxDirect] Audio generated: ${audioBuffer.length} bytes`);

				return {
					audioUrl: "",
					audioData: audioBase64,
					jobId: data.trace_id || `minimax-direct-${Date.now()}`,
				};
			}

			throw new Error("No audio data returned from Minimax API");
		} catch (error) {
			throw new Error(`Minimax Direct TTS error: ${error instanceof Error ? error.message : String(error)}`);
		}
	}

	// Test a voice with a short sample
	async testVoice(voiceId: string): Promise<{ success: boolean; audioData?: string; error?: string }> {
		try {
			const result = await this.generateAudio({
				prompt: "This is a voice test. Hello, how does this voice sound to you?",
				voice: voiceId,
			});

			return {
				success: true,
				audioData: result.audioData,
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : String(error),
			};
		}
	}
}
