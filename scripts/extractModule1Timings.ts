// Extract word timings for Module 1 only using OpenAI Whisper API
// This is a focused script to test if Whisper is producing garbage timings

import * as fs from "fs";
import * as path from "path";
import OpenAI from "openai";
import { saveWhisperResponse, loadWhisperResponse, hasCachedResponse, WhisperResponse } from "./saveWhisperResponse";
import { saveSlideTimings } from "./saveTimingsJson";
import { allModules } from "../src/videos/moduleContent";

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
	openaiKey: string,
	slideName: string
): Promise<WhisperResponse> {
	// Check cache first
	if (hasCachedResponse(slideName)) {
		console.log(`   Using cached Whisper response for ${slideName}`);
		return loadWhisperResponse(slideName);
	}

	console.log(`   Calling OpenAI Whisper API for ${slideName} (this incurs costs)...`);

	const openai = new OpenAI({ apiKey: openaiKey });

	if (!fs.existsSync(audioPath)) {
		throw new Error(`Audio file not found: ${audioPath}`);
	}

	const file = fs.createReadStream(audioPath);
	const transcription = await openai.audio.transcriptions.create({
		file: file,
		model: "whisper-1",
		response_format: "verbose_json",
		timestamp_granularities: ["word"],
	});

	const response: WhisperResponse = {
		text: transcription.text,
		words: transcription.words || [],
	};

	saveWhisperResponse(slideName, response);
	console.log(`   ✓ Whisper response cached for ${slideName}`);
	return response;
}

/**
 * Step 2: Process cached Whisper response into WordTiming format
 */
function processWhisperResponse(response: WhisperResponse): WordTiming[] {
	if (!response.words || response.words.length === 0) {
		throw new Error("No word timings in Whisper response");
	}

	return response.words.map((w: any) => ({
		text: w.word || w.text || "",
		start: w.start || 0,
		end: w.end || 0,
	}));
}

/**
 * Main function - Extract word timings for Module 1 only
 */
async function extractModule1Timings() {
	const courseId = "agentic-ai-for-beginners";
	const moduleNumber = 1;
	const coursePath = path.join(__dirname, "..", "courses", courseId);

	// Get OpenAI API key
	const openaiKey = process.env.OPENAI_API_KEY;
	if (!openaiKey) {
		console.error("❌ OPENAI_API_KEY environment variable not set");
		console.error("   Set it with: $env:OPENAI_API_KEY='your-key' (PowerShell)");
		console.error("   Or: export OPENAI_API_KEY='your-key' (Bash)");
		process.exit(1);
	}

	console.log("Extracting word timings for Module 1 using OpenAI Whisper API...\n");
	console.log("This will:");
	console.log("  1. Call Whisper API for each slide's audio file");
	console.log("  2. Cache responses to avoid duplicate API calls");
	console.log("  3. Process responses into word timing format");
	console.log("  4. Save to module1.json\n");

	// Find Module 1 from module content
	const module1 = allModules.find(m => m.moduleNumber === 1 && m.courseId === courseId);
	
	if (!module1) {
		console.error(`Module 1 not found for course: ${courseId}`);
		process.exit(1);
	}

	const slides = module1.slides || [];
	
	if (slides.length === 0) {
		console.error("No slides found for Module 1");
		process.exit(1);
	}

	console.log(`Found ${slides.length} Module 1 slides:\n`);

	// Process each slide
	for (const slide of slides) {
		console.log(`Processing: ${slide.name}`);

		// Find audio file - audio files are named: module1-module-1-{slideName}.wav
		// Slide names are: module-1-{slideName}
		const audioPath = path.join(
			__dirname,
			"..",
			"public",
			"audio",
			courseId,
			`module${moduleNumber}-${slide.name}.wav`
		);

		if (!fs.existsSync(audioPath)) {
			console.log(`  ⚠ Audio file not found: ${audioPath}`);
			console.log(`  Skipping ${slide.name}\n`);
			continue;
		}

		try {
			// Step 1: Call Whisper API (or use cache)
			const whisperResponse = await callWhisperAPI(audioPath, openaiKey, slide.name);

			// Step 2: Process response
			const words = processWhisperResponse(whisperResponse);

			console.log(`  ✓ Extracted ${words.length} words`);
			console.log(`  First few words: ${words.slice(0, 5).map(w => w.text).join(" ")}...`);
			console.log(`  Duration: ${words[words.length - 1]?.end.toFixed(2)}s\n`);

			// Step 3: Save to module1.json
			saveSlideTimings(courseId, moduleNumber, slide.name, words, module1.title);

		} catch (error: any) {
			console.error(`  ❌ Error processing ${slide.name}:`, error.message);
			console.error(`  Run: npx tsx scripts/processCachedWhisperResponses.ts ${slide.name}\n`);
		}
	}

	console.log("\n✅ Module 1 word timing extraction complete!");
	console.log("\nNext steps:");
	console.log("  1. Review the generated timings in courses/agentic-ai-for-beginners/timings/module1.json");
	console.log("  2. If timings look correct, test animations in Remotion studio");
	console.log("  3. If timings are still wrong, check:");
	console.log("     - Audio file quality");
	console.log("     - Whisper API response format");
	console.log("     - Consider using alignScriptWithTimings.ts to align with script text");
}

extractModule1Timings().catch(console.error);
