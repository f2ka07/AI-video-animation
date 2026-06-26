// Minimax TTS service integration via RunPod
// Used for audio > 10 seconds or as fallback when RunPod/Chatterbox fails
// API endpoint: https://api.runpod.ai/v2/minimax-speech-02-hd/run

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

interface MinimaxRunPodResponse {
	id?: string;
	status?: string;
	output?: {
		audio?: string; // base64 encoded audio
		audio_url?: string;
		words?: WordTiming[]; // Word-level timings if available
		alignment?: WordTiming[]; // Alternative field name for word timings
	};
	error?: string;
}

export class MinimaxVoiceService {
	private apiKey: string;
	private apiUrl: string = "https://api.runpod.ai/v2/minimax-speech-02-hd/run";

	constructor(apiKey: string) {
		if (!apiKey) {
			throw new Error("RUNPOD_API_KEY or RESEMBLE_API_KEY is required for Minimax (accessed via RunPod)");
		}
		this.apiKey = apiKey;
	}

	async generateAudio(
		options: VoiceOptions
	): Promise<{ audioUrl: string; jobId: string; audioData?: string; words?: WordTiming[] }> {
		try {
			// Map voice to Minimax voice ID, or use voice directly if it looks like a Minimax voice ID
			const voiceId = options.voice && options.voice.includes("_") 
				? options.voice // Already a Minimax voice ID (e.g., "Wise_Woman")
				: getVoiceForService(options.voice || "francis", "minimax");
			
			const response = await fetch(this.apiUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.apiKey}`,
				},
				body: JSON.stringify({
					input: {
						prompt: options.prompt,
						voice_id: voiceId,
						speed: 1,
						volume: 1,
						pitch: 0,
						emotion: "happy",
						english_normalization: false,
					},
				}),
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Minimax (RunPod) API request failed: ${response.status} - ${errorText}`);
			}

			const data: MinimaxRunPodResponse = await response.json();

			// Check for errors first - don't proceed if there's an error
			if (data.error) {
				throw new Error(`Minimax (RunPod) API error: ${data.error}`);
			}

			// Check if job failed immediately
			if (data.status === "FAILED" || data.status === "FAILURE") {
				throw new Error(`Minimax job failed: ${data.error || "Unknown error"}`);
			}

			// Extract word timings if available
			const words = data.output?.words || data.output?.alignment || undefined;

			// Check if audio is returned immediately as base64
			if (data.output?.audio) {
				return {
					audioUrl: "",
					audioData: data.output.audio,
					jobId: data.id || "minimax-immediate",
					words,
				};
			}

			// Check if audio URL is returned immediately
			if (data.output?.audio_url) {
				return {
					audioUrl: data.output.audio_url,
					jobId: data.id || "minimax-immediate",
					words,
				};
			}

			// If job ID is returned and status indicates it's processing, poll for completion
			if (data.id && (data.status === "IN_QUEUE" || data.status === "IN_PROGRESS" || !data.status)) {
				const result = await this.pollForCompletion(data.id);
				return {
					audioUrl: result.audioUrl || "",
					audioData: result.audioData,
					jobId: data.id,
					words: result.words,
				};
			}

			// If we have a job ID but status is already COMPLETED, check output again
			if (data.id && (data.status === "COMPLETED" || data.status === "COMPLETE")) {
				// Should have been caught above, but if not, try polling once
				const result = await this.pollForCompletion(data.id);
				return {
					audioUrl: result.audioUrl || "",
					audioData: result.audioData,
					jobId: data.id,
					words: result.words,
				};
			}

			throw new Error(`No audio data, URL, or valid job ID returned from Minimax (RunPod) API. Status: ${data.status || "unknown"}`);
		} catch (error) {
			throw new Error(`Minimax TTS error: ${error instanceof Error ? error.message : String(error)}`);
		}
	}

	private async pollForCompletion(
		jobId: string,
		maxAttempts = 30 // Reduced from 60 to 30 (1 minute max instead of 2 minutes)
	): Promise<{ audioUrl?: string; audioData?: string; words?: WordTiming[] }> {
		const pollUrl = `https://api.runpod.ai/v2/minimax-speech-02-hd/status/${jobId}`;

		for (let attempt = 0; attempt < maxAttempts; attempt++) {
			// Wait before checking (except first attempt)
			if (attempt > 0) {
				await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
			}

			const response = await fetch(pollUrl, {
				headers: {
					Authorization: `Bearer ${this.apiKey}`,
				},
			});

			if (!response.ok) {
				// If 404 or similar, job might not exist
				if (response.status === 404) {
					throw new Error(`Job ${jobId} not found. It may have failed or been deleted.`);
				}
				throw new Error(`Status check failed: ${response.status}`);
			}

			const data: MinimaxRunPodResponse = await response.json();

			// Check for errors in response
			if (data.error) {
				throw new Error(`Job error: ${data.error}`);
			}

			// Check various possible response formats
			if (data.status === "COMPLETED" || data.status === "COMPLETE") {
				const words = data.output?.words || data.output?.alignment || undefined;
				if (data.output?.audio) {
					return { audioData: data.output.audio, words };
				}
				if (data.output?.audio_url) {
					return { audioUrl: data.output.audio_url, words };
				}
				// If status is COMPLETED but no audio, something went wrong
				throw new Error(`Job completed but no audio data returned. Status: ${data.status}`);
			}

			if (data.status === "FAILED" || data.status === "FAILURE") {
				throw new Error(`Job failed: ${data.error || "Unknown error"}`);
			}

			// Still processing - log progress
			if (attempt < maxAttempts - 1) {
				console.log(`[Minimax] Waiting for job ${jobId}... (attempt ${attempt + 1}/${maxAttempts}, status: ${data.status || "unknown"})`);
			}
		}

		throw new Error(`Minimax job ${jobId} did not complete within ${maxAttempts * 2} seconds (${maxAttempts} attempts)`);
	}
}
