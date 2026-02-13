// Extract word timings for Module 2 code slides using OpenAI Whisper API
// This will add word timings and enable code highlighting

import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import OpenAI from "openai";
import { allModules } from "../src/videos/moduleContent";
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
 * Main function - Extract word timings for Module 2 code slides
 */
async function extractModule2WordTimings() {
	const audioDir = path.join(__dirname, "../public/audio");
	const openaiKey = process.env.OPENAI_API_KEY;

	if (!openaiKey) {
		console.error("❌ OPENAI_API_KEY is required");
		console.error("\nPlease add your OpenAI API key to .env file in the project root:");
		console.error("  OPENAI_API_KEY=your_key_here");
		process.exit(1);
	}

	// Get Module 2 from allModules
	const module2 = allModules.find(m => m.moduleNumber === 2);
	if (!module2) {
		console.error("❌ Module 2 not found in moduleContent.ts");
		process.exit(1);
	}

	// Filter to only code slides
	const codeSlides = module2.slides.filter(slide => slide.type === "code");

	if (codeSlides.length === 0) {
		console.log("⚠ No code slides found in Module 2");
		process.exit(0);
	}

	console.log("Extracting word timings for Module 2 code slides using OpenAI Whisper API...\n");
	console.log(`Found ${codeSlides.length} code slides to process\n`);

	for (const slide of codeSlides) {
		const audioPath = path.join(audioDir, `module2-${slide.name}.wav`);
		if (!fs.existsSync(audioPath)) {
			console.log(`⚠ Skipping ${slide.name}: audio file not found`);
			continue;
		}

		try {
			console.log(`Processing ${slide.name}...`);
			console.log(`   Audio: ${path.basename(audioPath)}`);
			console.log(`   Script length: ${slide.script.length} characters`);
			
			// Step 1: Call API and cache response
			const whisperResponse = await callWhisperAPI(audioPath, openaiKey, slide.name);
			
			// Step 2: Process cached response
			const words = processWhisperResponse(whisperResponse);
			
			if (words.length === 0) {
				console.log(`⚠ No words extracted for ${slide.name}`);
				continue;
			}
			
			// Step 3: Save to wordTimings.ts
			saveWordTimings(slide.name, words);
			console.log(`✓ Processed ${words.length} words for ${slide.name}`);
			console.log(`   Duration: ${words[words.length - 1].end.toFixed(2)}s\n`);
		} catch (error: any) {
			console.error(`\n✗ Failed for ${slide.name}:`, error.message);
			console.error(`\n   Note: API response was saved to cache, so you can retry processing without calling the API again.`);
			console.error(`   Run: npx tsx scripts/processCachedWhisperResponses.ts ${slide.name}\n`);
			continue;
		}
	}

	console.log("✅ Word timing extraction complete for Module 2!");
	console.log("\nNext step: Add line mappings to src/utils/wordTimings.ts for code highlighting\n");
}

extractModule2WordTimings().catch(console.error);
