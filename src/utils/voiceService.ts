// Voice service for generating audio using ResembleAI Chatterbox Turbo via RunPod

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

interface ChatterboxResponse {
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

export class VoiceService {
	private apiKey: string;
	private apiUrl: string = "https://api.runpod.ai/v2/chatterbox-turbo/run";

	constructor(apiKey: string) {
		if (!apiKey) {
			throw new Error("RESEMBLE_API_KEY is required");
		}
		this.apiKey = apiKey;
	}

	async generateAudio(
		options: VoiceOptions
	): Promise<{ audioUrl: string; jobId: string; audioData?: string; words?: WordTiming[] }> {
		const response = await fetch(this.apiUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.apiKey}`,
			},
			body: JSON.stringify({
				input: {
					prompt: options.prompt,
					voice: options.voice || "andy",
					format: options.format || "wav",
				},
			}),
		});

		if (!response.ok) {
			const error = await response.text();
			throw new Error(`API request failed: ${response.status} - ${error}`);
		}

		const data: ChatterboxResponse = await response.json();

		if (data.error) {
			throw new Error(`API error: ${data.error}`);
		}

		// Extract word timings if available
		const words = data.output?.words || data.output?.alignment || undefined;

		// Check if audio is returned immediately as base64
		if (data.output?.audio) {
			return {
				audioUrl: "", // Will be saved from base64
				audioData: data.output.audio,
				jobId: data.id || "immediate",
				words,
			};
		}

		// Check if audio URL is returned immediately
		if (data.output?.audio_url) {
			return {
				audioUrl: data.output.audio_url,
				jobId: data.id || "immediate",
				words,
			};
		}

		// If job ID is returned, poll for completion
		if (data.id) {
			const result = await this.pollForCompletion(data.id);
			return {
				audioUrl: result.audioUrl || "",
				audioData: result.audioData,
				jobId: data.id,
				words: result.words,
			};
		}

		throw new Error("No audio data, URL, or job ID returned from API");
	}

	private async pollForCompletion(
		jobId: string,
		maxAttempts = 60
	): Promise<{ audioUrl?: string; audioData?: string; words?: WordTiming[] }> {
		const pollUrl = `https://api.runpod.ai/v2/chatterbox-turbo/status/${jobId}`;

		for (let attempt = 0; attempt < maxAttempts; attempt++) {
			await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds

			const response = await fetch(pollUrl, {
				headers: {
					Authorization: `Bearer ${this.apiKey}`,
				},
			});

			if (!response.ok) {
				throw new Error(`Status check failed: ${response.status}`);
			}

			const data: ChatterboxResponse = await response.json();

			// Check various possible response formats
			if (data.status === "COMPLETED" || data.status === "COMPLETE") {
				const words = data.output?.words || data.output?.alignment || undefined;
				if (data.output?.audio) {
					return { audioData: data.output.audio, words };
				}
				if (data.output?.audio_url) {
					return { audioUrl: data.output.audio_url, words };
				}
			}

			if (data.status === "FAILED" || data.status === "FAILURE") {
				throw new Error(`Job failed: ${data.error || "Unknown error"}`);
			}

			// Still processing
			if (attempt < maxAttempts - 1) {
				console.log(`Waiting for job ${jobId}... (attempt ${attempt + 1}/${maxAttempts})`);
			}
		}

		throw new Error("Job did not complete within timeout");
	}
}
