// Unified voice service with provider selection
// When a provider is specified: uses ONLY that provider (no fallback) for voice consistency
// When no provider specified: uses automatic selection with fallback chain

import { VoiceService } from "./voiceService";
import { MinimaxVoiceService } from "./minimaxVoiceService";
import { MinimaxDirectService } from "./minimaxDirectService";
import { ElevenLabsVoiceService } from "./elevenLabsVoiceService";
import { estimateAudioDuration, shouldUseMinimax, chunkTextAtSentences } from "./audioLengthEstimation";
import { validateAudioQuality, isLikelyDistorted } from "./audioQualityValidation";
import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

interface VoiceOptions {
	prompt: string;
	voice?: string;
	format?: string;
	provider?: "runpod" | "minimax" | "elevenlabs" | "openai";
}

interface WordTiming {
	text: string;
	start: number;
	end: number;
}

interface AudioResult {
	audioUrl: string;
	jobId: string;
	audioData?: string;
	words?: WordTiming[];
	serviceUsed: "runpod" | "minimax" | "elevenlabs" | "openai";
}

export class UnifiedVoiceService {
	private runpodService?: VoiceService;
	private minimaxService?: MinimaxVoiceService;
	private minimaxDirectService?: MinimaxDirectService;
	private elevenLabsService?: ElevenLabsVoiceService;
	private openaiKey?: string;

	constructor() {
		// Initialize services if API keys are available
		const runpodKey = process.env.RESEMBLE_API_KEY || process.env.RUNPOD_API_KEY;
		const minimaxKey = process.env.MINIMAX_API_KEY;
		const elevenLabsKey = process.env.ELEVENLABS_API_KEY;
		this.openaiKey = process.env.OPENAI_API_KEY;

		if (runpodKey) {
			this.runpodService = new VoiceService(runpodKey);
			// Also initialize RunPod-based Minimax as fallback
			this.minimaxService = new MinimaxVoiceService(runpodKey);
		}

		// Use direct Minimax API if key is available (preferred over RunPod)
		if (minimaxKey) {
			this.minimaxDirectService = new MinimaxDirectService(minimaxKey);
		}

		if (elevenLabsKey) {
			this.elevenLabsService = new ElevenLabsVoiceService(elevenLabsKey);
		}
	}

	/**
	 * Generate audio with the specified provider
	 * NO FALLBACK: If a provider is specified, use ONLY that provider to maintain voice consistency
	 */
	async generateAudio(options: VoiceOptions): Promise<AudioResult> {
		const estimatedDuration = estimateAudioDuration(options.prompt);

		// If a specific provider is requested, use ONLY that provider (no fallback)
		if (options.provider) {
			console.log(`[UnifiedVoiceService] Using ONLY provider: ${options.provider} (no fallback for voice consistency)`);
			
			// Use single provider without fallback chain
			return this.generateWithSingleProvider(options.provider, options);
		}

		// No provider specified - use automatic selection with fallback (legacy behavior)
		// Priority: OpenAI (most reliable) > Minimax (for long audio) > RunPod > ElevenLabs
		const useMinimax = shouldUseMinimax(options.prompt);
		
		if (this.openaiKey) {
			console.log(`[UnifiedVoiceService] Estimated ${estimatedDuration.toFixed(2)}s - trying OpenAI first (most reliable)`);
			return this.tryGenerateWithFallback(options, ["openai", "minimax", "runpod", "elevenlabs"]);
		} else if (useMinimax && this.minimaxService && this.runpodService) {
			console.log(`[UnifiedVoiceService] Estimated ${estimatedDuration.toFixed(2)}s - trying Minimax first (long audio)`);
			return this.tryGenerateWithFallback(options, ["minimax", "runpod", "elevenlabs"]);
		} else if (this.runpodService) {
			console.log(`[UnifiedVoiceService] Estimated ${estimatedDuration.toFixed(2)}s - trying RunPod first`);
			return this.tryGenerateWithFallback(options, ["runpod", "minimax", "elevenlabs"]);
		} else if (this.minimaxService) {
			console.log(`[UnifiedVoiceService] No RunPod key - using Minimax`);
			return this.tryGenerateWithFallback(options, ["minimax", "elevenlabs"]);
		} else if (this.elevenLabsService) {
			console.log(`[UnifiedVoiceService] Only ElevenLabs available`);
			return this.tryGenerateWithFallback(options, ["elevenlabs"]);
		} else {
			throw new Error("No TTS service API keys configured. Set OPENAI_API_KEY, RESEMBLE_API_KEY, MINIMAX_API_KEY, or ELEVENLABS_API_KEY");
		}
	}

	/** Provider character limits per API docs (use chunking when exceeded) */
	private static readonly PROVIDER_CHAR_LIMITS: Record<string, number> = {
		openai: 4096,
		minimax: 10000,   // Minimax T2A HTTP: "Must be less than 10,000 characters"
		elevenlabs: 5000, // eleven_monolingual_v1 model limit
		runpod: 10000,    // assume similar to Minimax
	};

	/**
	 * Generate audio with a single provider only - NO FALLBACK
	 * This ensures voice consistency across all audio files
	 */
	private async generateWithSingleProvider(
		provider: "runpod" | "minimax" | "elevenlabs" | "openai",
		options: VoiceOptions
	): Promise<AudioResult> {
		console.log(`[UnifiedVoiceService] Attempting ${provider} (strict mode, no fallback)...`);

		// Use chunking when script exceeds provider limit (avoids truncated audio)
		const limit = UnifiedVoiceService.PROVIDER_CHAR_LIMITS[provider] ?? 4096;
		const estimatedDuration = estimateAudioDuration(options.prompt);
		const needsChunking = options.prompt.length > limit || (provider === "openai" && estimatedDuration > 30);

		if (needsChunking) {
			const maxChunkSeconds = provider === "openai" ? 25 : 30;
			const maxChars = Math.floor(limit * 0.9); // safe margin
			const maxChunkDuration = Math.min(maxChunkSeconds, (maxChars / 12.5)); // ~12.5 chars/sec
			console.log(`[UnifiedVoiceService] Script exceeds ${provider} limit (${options.prompt.length} chars, ~${estimatedDuration.toFixed(1)}s) - using chunking`);
			return this.generateAudioWithChunking({ ...options, provider }, Math.max(10, maxChunkDuration));
		}
		
		try {
			const result = await this.generateWithService(provider, options);
			return {
				...result,
				serviceUsed: provider,
			};
		} catch (error) {
			const errorMsg = error instanceof Error ? error.message : String(error);
			// No fallback - throw immediately with clear message
			throw new Error(
				`${provider} TTS failed: ${errorMsg}\n` +
				`No fallback attempted to maintain voice consistency. ` +
				`Fix the ${provider} configuration or choose a different provider.`
			);
		}
	}

	/**
	 * Try generating audio with fallback chain
	 */
	private async tryGenerateWithFallback(
		options: VoiceOptions,
		serviceChain: Array<"runpod" | "minimax" | "elevenlabs" | "openai">
	): Promise<AudioResult> {
		const errors: string[] = [];

		const estimatedDuration = estimateAudioDuration(options.prompt);
		
		for (const serviceName of serviceChain) {
			try {
				console.log(`[UnifiedVoiceService] Attempting ${serviceName}...`);
				
				// Warn if falling back to RunPod for long audio (may have distortion)
				if (serviceName === "runpod" && estimatedDuration > 10 && errors.length > 0) {
					console.warn(`[UnifiedVoiceService] Warning: Falling back to RunPod for ${estimatedDuration.toFixed(2)}s audio. Audio may be distorted.`);
				}
				
				const result = await this.generateWithService(serviceName, options);

				// Validate audio quality if we have a file path
				// Note: For base64 audio, we'd need to save it first to validate
				// For now, we'll trust the service if it returns successfully

				return {
					...result,
					serviceUsed: serviceName,
				};
			} catch (error) {
				const errorMsg = error instanceof Error ? error.message : String(error);
				errors.push(`${serviceName}: ${errorMsg}`);
				console.warn(`[UnifiedVoiceService] ${serviceName} failed: ${errorMsg}`);

				// Continue to next service in chain
				continue;
			}
		}

		// All services failed
		throw new Error(
			`All TTS services failed:\n${errors.map((e) => `  - ${e}`).join("\n")}`
		);
	}

	/**
	 * Generate audio with a specific service
	 */
	private async generateWithService(
		serviceName: "runpod" | "minimax" | "elevenlabs" | "openai",
		options: VoiceOptions
	): Promise<{ audioUrl: string; jobId: string; audioData?: string; words?: WordTiming[] }> {
		switch (serviceName) {
			case "openai":
				if (!this.openaiKey) {
					throw new Error("OpenAI API key not configured (OPENAI_API_KEY)");
				}
				return this.generateWithOpenAI(options, false);

			case "runpod":
				if (!this.runpodService) {
					throw new Error("RunPod service not initialized");
				}
				return this.runpodService.generateAudio(options);

			case "minimax":
				// Prefer direct Minimax API over RunPod proxy
				if (this.minimaxDirectService) {
					return this.minimaxDirectService.generateAudio(options);
				}
				if (this.minimaxService) {
					console.log("[UnifiedVoiceService] Using RunPod-based Minimax (direct API not configured)");
					return this.minimaxService.generateAudio(options);
				}
				throw new Error("Minimax service not initialized. Set MINIMAX_API_KEY for direct API.");

			case "elevenlabs":
				if (!this.elevenLabsService) {
					throw new Error("ElevenLabs service not initialized");
				}
				return this.elevenLabsService.generateAudio(options);

			default:
				throw new Error(`Unknown service: ${serviceName}`);
		}
	}

	/**
	 * Generate audio with OpenAI TTS API
	 * OpenAI TTS has a 4096 character limit - automatically use chunking for longer text
	 */
	private async generateWithOpenAI(
		options: VoiceOptions,
		skipChunking: boolean = false
	): Promise<{ audioUrl: string; jobId: string; audioData?: string; words?: WordTiming[] }> {
		// OpenAI TTS API limit: 4096 characters (~5 minutes of audio)
		// If text exceeds this, use chunking to split and concatenate
		// Skip chunking if already in chunking mode (prevents recursion)
		if (!skipChunking) {
			const OPENAI_CHAR_LIMIT = 4096;
			const estimatedDuration = estimateAudioDuration(options.prompt);
			
			// Use chunking if text is too long (either by character count or estimated duration > 30s)
			if (options.prompt.length > OPENAI_CHAR_LIMIT || estimatedDuration > 30) {
				console.log(`[OpenAI] Text exceeds limit (${options.prompt.length} chars, ~${estimatedDuration.toFixed(1)}s) - using chunking`);
				// Use chunking with 25 second max per chunk (safe margin below 30s)
				return this.generateAudioWithChunking({
					...options,
					provider: "openai"
				}, 25);
			}
		}
		
		const voice = options.voice || "onyx";
		// Map common voice names to OpenAI voices
		const openaiVoice = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"].includes(voice)
			? voice
			: "onyx"; // Default to onyx if not a valid OpenAI voice

		const response = await fetch("https://api.openai.com/v1/audio/speech", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.openaiKey}`,
			},
			body: JSON.stringify({
				model: "tts-1-hd",
				voice: openaiVoice,
				input: options.prompt,
				response_format: "wav",
			}),
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`OpenAI TTS error: ${errorText}`);
		}

		const arrayBuffer = await response.arrayBuffer();
		const audioData = Buffer.from(arrayBuffer).toString("base64");

		return {
			audioUrl: "",
			jobId: `openai-${Date.now()}`,
			audioData,
		};
	}

	/**
	 * Generate audio with chunking support for very long content
	 * Splits text into chunks, generates each, then concatenates
	 */
	async generateAudioWithChunking(
		options: VoiceOptions,
		maxChunkDuration: number = 30
	): Promise<AudioResult> {
		const provider = options.provider || "openai";
		const charLimit = UnifiedVoiceService.PROVIDER_CHAR_LIMITS[provider] ?? 4096;
		let chunks = chunkTextAtSentences(options.prompt, maxChunkDuration);

		// Further split chunks that exceed provider character limit
		const finalChunks: string[] = [];
		for (const chunk of chunks) {
			if (chunk.length > charLimit) {
				const sentences = chunk.match(/[^.!?]+[.!?]+(?:\s+|$)/g) || [chunk];
				let currentChunk = "";
				for (const sentence of sentences) {
					if ((currentChunk + sentence).length > charLimit && currentChunk) {
						finalChunks.push(currentChunk.trim());
						currentChunk = sentence;
					} else {
						currentChunk += (currentChunk ? " " : "") + sentence;
					}
				}
				if (currentChunk.trim()) {
					finalChunks.push(currentChunk.trim());
				}
			} else {
				finalChunks.push(chunk);
			}
		}
		chunks = finalChunks;

		if (chunks.length === 1) {
			// Single chunk after splitting - should be under limits, generate directly without chunking
			const provider = options.provider || "openai";
			const result = await this.generateWithSingleProvider(provider, options);
			return {
				...result,
				serviceUsed: provider
			};
		}

		console.log(`[UnifiedVoiceService] Splitting into ${chunks.length} chunks...`);

		// Generate audio for each chunk
		const chunkResults: Array<{ audioData: string; words?: WordTiming[]; duration: number }> = [];
		let totalOffset = 0;

		for (let i = 0; i < chunks.length; i++) {
			const chunk = chunks[i];
			console.log(`[UnifiedVoiceService] Generating chunk ${i + 1}/${chunks.length}...`);

			// Generate each chunk directly using the service (skip chunking to prevent recursion)
			const provider = options.provider || "openai";
			let chunkResult;
			
			if (provider === "openai") {
				// Call generateWithOpenAI directly with skipChunking=true to prevent recursion
				chunkResult = await this.generateWithOpenAI({
					...options,
					prompt: chunk,
				}, true); // skipChunking = true
			} else {
				// For other providers, use generateWithSingleProvider
				chunkResult = await this.generateWithSingleProvider(provider, {
					...options,
					prompt: chunk,
				});
			}
			
			const result = {
				...chunkResult,
				serviceUsed: provider
			};

			// Save chunk audio to temporary file
			const tempDir = path.join(__dirname, "../../temp-audio");
			if (!fs.existsSync(tempDir)) {
				fs.mkdirSync(tempDir, { recursive: true });
			}

			const chunkPath = path.join(tempDir, `chunk-${i}.wav`);
			await this.saveAudioToFile(result.audioData || "", chunkPath);

			// Adjust word timings with offset
			const adjustedWords = result.words?.map((w) => ({
				...w,
				start: w.start + totalOffset,
				end: w.end + totalOffset,
			}));

			chunkResults.push({
				audioData: result.audioData || "",
				words: adjustedWords,
				duration: estimateAudioDuration(chunk),
			});

			totalOffset += estimateAudioDuration(chunk);
		}

		// Concatenate audio chunks using ffmpeg
		let finalAudioData = chunkResults[0]?.audioData || "";
		
		if (chunkResults.length > 1) {
			console.log(`[UnifiedVoiceService] Concatenating ${chunkResults.length} audio chunks (total estimated: ~${totalOffset.toFixed(1)}s)...`);
			
			try {
				// Verify all chunk files exist before concatenation
				for (let i = 0; i < chunkResults.length; i++) {
					const chunkPath = path.join(tempDir, `chunk-${i}.wav`);
					if (!fs.existsSync(chunkPath)) {
						throw new Error(`Chunk file ${i} missing: ${chunkPath}`);
					}
					const stats = fs.statSync(chunkPath);
					if (stats.size === 0) {
						throw new Error(`Chunk file ${i} is empty: ${chunkPath}`);
					}
					console.log(`[UnifiedVoiceService] Chunk ${i + 1}: ${(stats.size / 1024).toFixed(1)}KB`);
				}
				
				// Create a file list for ffmpeg concat
				const fileListPath = path.join(tempDir, "concat-list.txt");
				const fileListContent = chunkResults.map((_, i) => {
					const chunkPath = path.join(tempDir, `chunk-${i}.wav`).replace(/\\/g, '/');
					return `file '${chunkPath}'`;
				}).join('\n');
				fs.writeFileSync(fileListPath, fileListContent);
				
				// Concatenate using ffmpeg
				const outputPath = path.join(tempDir, "concatenated.wav");
				console.log(`[UnifiedVoiceService] Running ffmpeg concatenation...`);
				execSync(
					`ffmpeg -y -f concat -safe 0 -i "${fileListPath}" -c copy "${outputPath}"`,
					{ encoding: 'utf-8', stdio: 'pipe' }
				);
				
				// Verify concatenated file exists and has content
				if (!fs.existsSync(outputPath)) {
					throw new Error('Concatenated file was not created');
				}
				const concatStats = fs.statSync(outputPath);
				if (concatStats.size === 0) {
					throw new Error('Concatenated file is empty');
				}
				
				// Read concatenated audio and convert to base64
				const concatenatedBuffer = fs.readFileSync(outputPath);
				finalAudioData = concatenatedBuffer.toString('base64');
				
				console.log(`[UnifiedVoiceService] Successfully concatenated ${chunkResults.length} chunks into ${(concatStats.size / 1024).toFixed(1)}KB file`);
				
				// Clean up temporary files
				try {
					fs.unlinkSync(fileListPath);
					fs.unlinkSync(outputPath);
					chunkResults.forEach((_, i) => {
						const chunkPath = path.join(tempDir, `chunk-${i}.wav`);
						if (fs.existsSync(chunkPath)) fs.unlinkSync(chunkPath);
					});
				} catch (cleanupError) {
					console.warn('[UnifiedVoiceService] Could not clean up temp files:', cleanupError);
				}
			} catch (concatError) {
				console.error(`[UnifiedVoiceService] Failed to concatenate chunks:`, concatError);
				throw new Error(
					`Audio concatenation failed: ${concatError.message}. ` +
					`${chunkResults.length} chunks were generated but ffmpeg could not concatenate them. ` +
					`Install ffmpeg and ensure it is on PATH to generate full-length audio for long scripts.`
				);
			}
		}

		// Merge all word timings
		const allWords: WordTiming[] = [];
		chunkResults.forEach((chunk) => {
			if (chunk.words) {
				allWords.push(...chunk.words);
			}
		});

		return {
			audioUrl: "",
			audioData: finalAudioData,
			jobId: `chunked-${Date.now()}`,
			words: allWords.length > 0 ? allWords : undefined,
			serviceUsed: options.provider || "openai",
		};
	}

	/**
	 * Save base64 audio data to file
	 */
	private async saveAudioToFile(audioData: string, filePath: string): Promise<void> {
		// Handle data URI format: data:audio/wav;base64,...
		const base64Data = audioData.includes(",") ? audioData.split(",")[1] : audioData;
		const buffer = Buffer.from(base64Data, "base64");
		fs.writeFileSync(filePath, buffer);
	}
}
