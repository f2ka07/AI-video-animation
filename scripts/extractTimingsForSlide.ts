// Extract word timings for a single slide using OpenAI Whisper API
// Usage: tsx scripts/extractTimingsForSlide.ts <moduleNumber> <slideName>

import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import OpenAI from "openai";
import { allModules } from "../src/videos/moduleContent";
import { saveSlideTimings } from "./saveTimingsJson";
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
 * This step incurs API costs - results are cached to avoid re-calling
 */
async function callWhisperAPI(
	audioPath: string,
	apiKey: string,
	slideName: string
): Promise<WhisperResponse> {
	// Check cache first
	if (hasCachedResponse(slideName)) {
		console.log(`   Using cached API response for ${slideName}`);
		const cached = loadWhisperResponse(slideName);
		if (cached) {
			return cached;
		}
	}

	console.log(`   Calling OpenAI Whisper API (this incurs costs)...`);
	
	const openai = new OpenAI({
		apiKey: apiKey,
	});

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

	// Save raw response to cache
	const response: WhisperResponse = {
		text: resp.text || "",
		duration: resp.duration || 0,
		words: resp.words || [],
		segments: resp.segments || [],
	};

	const cachePath = saveWhisperResponse(slideName, response);
	console.log(`   ✓ Saved API response to cache: ${path.basename(cachePath)}`);
	
	return response;
}

/**
 * Step 2: Process cached Whisper response into WordTiming format
 * This step is free - it just processes the cached data
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

async function extractSlideTimings(moduleNumber: number, slideName: string) {
	const baseAudioDir = path.join(__dirname, "../public/audio");
	const openaiKey = process.env.OPENAI_API_KEY;

	if (!openaiKey) {
		throw new Error("OPENAI_API_KEY is required. Please add it to .env file in the project root: OPENAI_API_KEY=your_key_here");
	}

	// Find the module and slide
	const module = allModules.find(m => m.moduleNumber === moduleNumber);
	if (!module) {
		throw new Error(`Module ${moduleNumber} not found`);
	}

	const slide = module.slides.find(s => s.name === slideName);
	if (!slide) {
		throw new Error(`Slide "${slideName}" not found in Module ${moduleNumber}`);
	}

	// Use course-specific audio directory
	const courseId = module.courseId || 'default';
	const audioDir = path.join(baseAudioDir, courseId);
	const audioPath = path.join(audioDir, `module${moduleNumber}-${slideName}.wav`);
	
	if (!fs.existsSync(audioPath)) {
		throw new Error(`Audio file not found: ${audioPath}`);
	}

	console.log(`Extracting word timings for Module ${moduleNumber}, Slide: ${slideName}`);
	console.log(`   Audio: ${path.basename(audioPath)}`);
	console.log(`   Script length: ${slide.script.length} characters`);

	try {
		// Step 1: Call API and save to cache (or use cached response)
		const whisperResponse = await callWhisperAPI(audioPath, openaiKey, slideName);
		
		// Step 2: Process cached response into WordTiming format
		const words = processWhisperResponse(whisperResponse);
		
		if (words.length === 0) {
			throw new Error("No words extracted");
		}
		
		// Step 3: Save to course-specific timing file
		saveSlideTimings(courseId, moduleNumber, slideName, words, module.title);
		console.log(`   Saved to courses/${courseId}/timings/module${moduleNumber}.json`);
		console.log(`✅ Processed ${words.length} words for ${slideName}`);
		console.log(`   Duration: ${words[words.length - 1].end.toFixed(2)}s`);
	} catch (error: any) {
		console.error(`\n✗ Failed:`, error.message);
		console.error(`\n   Note: API response was saved to cache, so you can retry processing without calling the API again.`);
		throw error;
	}
}

// Get arguments from command line
const moduleNumber = parseInt(process.argv[2], 10);
const slideName = process.argv[3];

if (Number.isNaN(moduleNumber) || !slideName) {
	console.error("Usage: tsx scripts/extractTimingsForSlide.ts <moduleNumber> <slideName>");
	process.exit(1);
}

extractSlideTimings(moduleNumber, slideName).catch((error) => {
	console.error(error);
	process.exit(1);
});
