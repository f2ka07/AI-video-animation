// Script to generate audio files for all slides
// Run with: npm run generate-audio

import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { VoiceService } from "../src/utils/voiceService";
import { module1Scripts } from "../src/videos/slideScripts";
import { saveWordTimings, generateMappingHelper } from "./saveWordTimings";

// Load environment variables from .env file
const envPath = path.join(__dirname, "../.env");
dotenv.config({ path: envPath });

// Debug: Check if .env file exists
if (!fs.existsSync(envPath)) {
	console.warn(`Warning: .env file not found at ${envPath}`);
	console.warn("Make sure your .env file is in the project root directory.");
}

async function downloadAudio(url: string, outputPath: string): Promise<void> {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Failed to download audio: ${response.status}`);
	}
	const buffer = await response.arrayBuffer();
	fs.writeFileSync(outputPath, Buffer.from(buffer));
	console.log(`Downloaded: ${outputPath}`);
}

function saveBase64Audio(base64Data: string, outputPath: string): void {
	// Remove data URL prefix if present (e.g., "data:audio/wav;base64,")
	const base64 = base64Data.includes(",") 
		? base64Data.split(",")[1] 
		: base64Data;
	
	const buffer = Buffer.from(base64, "base64");
	fs.writeFileSync(outputPath, buffer);
	console.log(`Saved: ${outputPath}`);
}

async function generateAllAudio() {
	// Try multiple possible environment variable names
	const apiKey = 
		process.env.RESEMBLE_API_KEY || 
		process.env.MINIMAX_API_KEY || 
		process.env.RUNPOD_API_KEY ||
		process.env.API_KEY;
	
	if (!apiKey) {
		console.error("Error: API key not found in environment variables.");
		console.error("Please set one of the following in your .env file:");
		console.error("  RESEMBLE_API_KEY=your_key_here");
		console.error("  MINIMAX_API_KEY=your_key_here");
		console.error("  RUNPOD_API_KEY=your_key_here");
		console.error("\nMake sure your .env file is in the project root.");
		throw new Error("API key environment variable is required");
	}
	
	console.log(`Using API key: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}\n`);

	const voiceService = new VoiceService(apiKey);
	const outputDir = path.join(__dirname, "../public/audio");
	
	// Ensure output directory exists
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}

	const slides = Object.entries(module1Scripts);
	console.log(`Generating audio for ${slides.length} slides...\n`);

	for (const [slideName, script] of slides) {
		console.log(`Generating audio for: ${slideName}`);
		console.log(`Script: ${script.substring(0, 100)}...\n`);

		try {
			const result = await voiceService.generateAudio({
				prompt: script,
				voice: "andy",
				format: "wav",
			});

			const outputPath = path.join(outputDir, `module1-${slideName}.wav`);
			
			if (result.audioData) {
				// Save base64 audio data
				saveBase64Audio(result.audioData, outputPath);
			} else if (result.audioUrl) {
				// Download from URL
				await downloadAudio(result.audioUrl, outputPath);
			} else {
				throw new Error("No audio data or URL returned");
			}

			// Save word timings if available
			if (result.words && result.words.length > 0) {
				saveWordTimings(slideName, result.words);
				generateMappingHelper(slideName, result.words);
			} else {
				console.log(`⚠ No word timings available for ${slideName}`);
				console.log("   You'll need to manually map phrases to word ranges.\n");
			}
			
			console.log(`✓ Completed: ${slideName}\n`);
		} catch (error) {
			console.error(`✗ Failed for ${slideName}:`, error);
			throw error;
		}
	}

	console.log("All audio files generated successfully!");
}

generateAllAudio().catch(console.error);
