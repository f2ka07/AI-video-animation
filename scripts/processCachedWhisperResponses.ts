// Process cached Whisper API responses into wordTimings.ts
// This script processes already-saved API responses without calling the API again
// Usage: tsx scripts/processCachedWhisperResponses.ts [slideName]

import * as fs from "fs";
import * as path from "path";
import { loadWhisperResponse, WhisperResponse } from "./saveWhisperResponse";
import { saveWordTimings } from "./saveWordTimings";

interface WordTiming {
	text: string;
	start: number;
	end: number;
}

/**
 * Process cached Whisper response into WordTiming format
 */
function processWhisperResponse(response: WhisperResponse): WordTiming[] {
	if (!response.words || !Array.isArray(response.words)) {
		throw new Error("No word timings in Whisper response - check response format");
	}

	return response.words.map((w: any) => ({
		text: w.word,
		start: w.start,
		end: w.end,
	}));
}

/**
 * Process a single cached response
 */
function processCachedSlide(slideName: string): void {
	const cached = loadWhisperResponse(slideName);
	
	if (!cached) {
		console.error(`❌ No cached response found for ${slideName}`);
		console.error(`   Run extractTimingsForSlide.ts first to call the API and cache the response.`);
		return;
	}

	console.log(`Processing cached response for ${slideName}...`);
	
	try {
		const words = processWhisperResponse(cached);
		
		if (words.length === 0) {
			console.error(`⚠ No words found in cached response for ${slideName}`);
			return;
		}
		
		saveWordTimings(slideName, words);
		console.log(`✅ Processed ${words.length} words for ${slideName}`);
		console.log(`   Duration: ${words[words.length - 1].end.toFixed(2)}s`);
	} catch (error: any) {
		console.error(`✗ Failed to process ${slideName}:`, error.message);
		throw error;
	}
}

/**
 * Process all cached responses
 */
function processAllCached(): void {
	const cacheDir = path.join(__dirname, "../public/whisper-cache");
	
	if (!fs.existsSync(cacheDir)) {
		console.error("❌ Cache directory not found. No cached responses to process.");
		return;
	}

	const files = fs.readdirSync(cacheDir).filter(f => f.endsWith(".json"));
	
	if (files.length === 0) {
		console.log("No cached responses found.");
		return;
	}

	console.log(`Found ${files.length} cached response(s) to process...\n`);

	let successCount = 0;
	let failCount = 0;

	for (const file of files) {
		const slideName = path.basename(file, ".json");
		try {
			processCachedSlide(slideName);
			successCount++;
		} catch (error) {
			failCount++;
		}
		console.log("");
	}

	console.log(`\n✅ Processed: ${successCount}`);
	if (failCount > 0) {
		console.log(`❌ Failed: ${failCount}`);
	}
}

// Main
const slideName = process.argv[2];

if (slideName) {
	// Process single slide
	processCachedSlide(slideName);
} else {
	// Process all cached responses
	processAllCached();
}
