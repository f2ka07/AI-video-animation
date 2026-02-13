// Extract word timings using OpenAI Whisper API
// This script extracts word timings for all Module 1 slides

import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import OpenAI from "openai";
import { module1Scripts } from "../src/videos/slideScripts";
import { saveWordTimings } from "./saveWordTimings";
import { saveWhisperResponse, loadWhisperResponse, hasCachedResponse, WhisperResponse } from "./saveWhisperResponse";

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, "../.env") });

interface WordTiming {
	text: string;
	start: number;
	end: number;
}

/**
 * Step 1: Call OpenAI Whisper API and save raw response to cache
 */
async function callWhisperAPI(
	audioPath: string,
	apiKey: string,
	slideName: string
): Promise<WhisperResponse> {
	if (hasCachedResponse(slideName)) {
		console.log(`   Using cached API response`);
		const cached = loadWhisperResponse(slideName);
		if (cached) return cached;
	}

	console.log(`   Calling OpenAI Whisper API (this incurs costs)...`);
	
	const openai = new OpenAI({ apiKey: apiKey });
	const resolved = path.resolve(audioPath);

	if (!fs.existsSync(resolved)) {
		throw new Error(`Audio file not found: ${resolved}`);
	}

	const fileStream = fs.createReadStream(resolved);
	const resp = await openai.audio.transcriptions.create({
		model: "whisper-1",
		file: fileStream as any,
		response_format: "verbose_json",
		timestamp_granularities: ["word"],
	});

	const response: WhisperResponse = {
		text: resp.text || "",
		duration: resp.duration || 0,
		words: resp.words || [],
		segments: resp.segments || [],
	};

	saveWhisperResponse(slideName, response);
	console.log(`   ✓ Saved API response to cache`);
	
	return response;
}

/**
 * Step 2: Process cached Whisper response into WordTiming format
 */
function processWhisperResponse(response: WhisperResponse): WordTiming[] {
	if (!response.words || !Array.isArray(response.words)) {
		throw new Error("No word timings in Whisper response");
	}
	return response.words.map((w: any) => ({
		text: w.word,
		start: w.start,
		end: w.end,
	}));
}

/**
 * Main function
 */
async function extractAllWordTimings() {
	const audioDir = path.join(__dirname, "../public/audio");
	const slides = Object.entries(module1Scripts);
	const openaiKey = process.env.OPENAI_API_KEY;

	if (!openaiKey) {
		console.error("❌ OPENAI_API_KEY is required");
		console.error("\nPlease add your OpenAI API key to .env file in the project root:");
		console.error("  OPENAI_API_KEY=your_key_here");
		process.exit(1);
	}

	console.log("Extracting word timings using OpenAI Whisper API...\n");

	for (const [slideName, script] of slides) {
		const audioPath = path.join(audioDir, `module1-${slideName}.wav`);
		if (!fs.existsSync(audioPath)) {
			console.log(`⚠ Skipping ${slideName}: audio file not found`);
			continue;
		}

		try {
			console.log(`Processing ${slideName}...`);
			console.log(`   Audio: ${path.basename(audioPath)}`);
			console.log(`   Script length: ${script.length} characters`);
			
			// Step 1: Call API and cache response
			const whisperResponse = await callWhisperAPI(audioPath, openaiKey, slideName);
			
			// Step 2: Process cached response
			const words = processWhisperResponse(whisperResponse);
			
			if (words.length === 0) {
				console.log(`⚠ No words extracted for ${slideName}`);
				continue;
			}
			
			// Step 3: Save to wordTimings.ts
			saveWordTimings(slideName, words);
			console.log(`✓ Processed ${words.length} words for ${slideName}`);
			console.log(`   Duration: ${words[words.length - 1].end.toFixed(2)}s\n`);
		} catch (error: any) {
			console.error(`\n✗ Failed for ${slideName}:`, error.message);
			console.error(`\n   Note: API response was saved to cache, so you can retry processing without calling the API again.`);
			console.error(`   Run: npx tsx scripts/processCachedWhisperResponses.ts ${slideName}\n`);
			continue;
		}
	}

	console.log("✅ Word timing extraction complete!");
	console.log("\nNext step: Run 'npm run map-phrases' to auto-map phrases to code lines\n");
}

extractAllWordTimings().catch(console.error);
