// Extract word timings from existing audio files using speech recognition
// This solves the problem when TTS API doesn't provide word timings

import * as fs from "fs";
import * as path from "path";
import { module1Scripts } from "../src/videos/slideScripts";
import { saveWordTimings } from "./saveWordTimings";

// Use node-fetch for Node.js compatibility
let fetch: any;
try {
	// Try built-in fetch first (Node 18+)
	fetch = globalThis.fetch;
	if (!fetch) {
		fetch = require("node-fetch");
	}
} catch {
	// Fallback
	fetch = require("node-fetch");
}

interface WordTiming {
	text: string;
	start: number;
	end: number;
}

/**
 * Option 1: Use OpenAI Whisper API (requires API key)
 * More accurate, but costs money
 */
async function extractWithWhisperAPI(
	audioPath: string,
	apiKey: string
): Promise<WordTiming[]> {
	// Use form-data package for Node.js
	const FormData = require("form-data");
	
	const formData = new FormData();
	formData.append("file", fs.createReadStream(audioPath));
	formData.append("model", "whisper-1");
	formData.append("response_format", "verbose_json");
	formData.append("timestamp_granularities[]", "word");

	const headers: any = {
		Authorization: `Bearer ${apiKey}`,
	};
	
	// Add form-data headers if available
	if (formData.getHeaders) {
		Object.assign(headers, formData.getHeaders());
	}

	const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
		method: "POST",
		headers,
		body: formData,
	});

	if (!response.ok) {
		throw new Error(`Whisper API error: ${response.statusText}`);
	}

	const data = await response.json();
	
	// Whisper returns words with start/end times
	if (data.words && Array.isArray(data.words)) {
		return data.words.map((w: any) => ({
			text: w.word,
			start: w.start,
			end: w.end,
		}));
	}

	throw new Error("No word timings in Whisper response");
}

/**
 * Option 2: Use Web Speech API (browser-based, free)
 * Less accurate but free - requires running in browser
 */
function generateBrowserScript() {
	return `
// Run this in browser console on a page with your audio files
// Or use the HTML tool at public/extract-timings.html

async function extractWordTimings(audioFile, script) {
	const audio = new Audio(audioFile);
	const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
	
	recognition.continuous = true;
	recognition.interimResults = false;
	
	return new Promise((resolve) => {
		const words = [];
		recognition.onresult = (event) => {
			for (let i = event.resultIndex; i < event.results.length; i++) {
				const result = event.results[i];
				if (result.isFinal) {
					words.push({
						text: result[0].transcript,
						start: result[0].timestamp,
						end: result[0].timestamp + result[0].duration,
					});
				}
			}
		};
		
		recognition.onend = () => resolve(words);
		audio.play();
		recognition.start();
	});
}
	`;
}

/**
 * Normalize script text for Gentle
 * Gentle is very sensitive to exact text matching
 */
function normalizeScriptForGentle(script: string): string {
	return script
		// Replace "A W S" with "AWS" (Gentle will recognize it better)
		.replace(/\bA W S\b/gi, "AWS")
		// Replace "dot" with "." for file extensions
		.replace(/\bdot\b/gi, ".")
		// Normalize whitespace
		.replace(/\s+/g, " ")
		.trim();
}

/**
 * Option 3: Use forced alignment with Gentle (requires Gentle server)
 * Most accurate for matching known scripts to audio
 */
async function extractWithGentle(
	audioPath: string,
	script: string,
	gentleUrl: string = "http://localhost:8765"
): Promise<WordTiming[]> {
	const FormData = require("form-data");
	
	// Normalize script for better matching
	const normalizedScript = normalizeScriptForGentle(script);
	
	console.log(`   Normalized script: ${normalizedScript.substring(0, 100)}...`);
	
	const formData = new FormData();
	
	// Use buffer approach - curl reads the file into memory first
	// This is more reliable than streams for Gentle
	const audioBuffer = fs.readFileSync(audioPath);
	
	// Append audio as buffer with filename (matches curl's -F "audio=@file")
	formData.append("audio", audioBuffer, {
		filename: path.basename(audioPath),
		contentType: "audio/wav",
	});
	
	formData.append("transcript", normalizedScript);

	// Get headers - FormData will set Content-Type with boundary
	const headers = formData.getHeaders();

	try {
		// Gentle API endpoint
		const url = `${gentleUrl}/transcriptions?async=false`;
		
		console.log(`   Sending to: ${url}`);
		
		const response = await fetch(url, {
			method: "POST",
			body: formData,
			headers,
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error(`   Gentle response status: ${response.status}`);
			console.error(`   Response body: ${errorText.substring(0, 500)}`);
			
			// Try to parse as JSON for more details
			try {
				const errorData = JSON.parse(errorText);
				if (errorData.error) {
					throw new Error(`Gentle error: ${errorData.error}`);
				}
			} catch {
				// Not JSON, use raw text
			}
			
			throw new Error(`Gentle API error: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		
		// Check for errors in response
		if (data.error) {
			throw new Error(`Gentle alignment error: ${data.error}`);
		}
		
		if (!data.words || !Array.isArray(data.words)) {
			console.error(`   Gentle response structure:`, JSON.stringify(data, null, 2).substring(0, 500));
			throw new Error("No word timings in Gentle response - check script matches audio");
		}
		
		const validWords = data.words.filter((w: any) => w.case !== "not-found-in-audio");
		
		if (validWords.length === 0) {
			console.error(`   All words were marked as "not-found-in-audio"`);
			console.error(`   This usually means the script text doesn't match what's spoken`);
			console.error(`   Original script: ${script.substring(0, 200)}...`);
			console.error(`   Normalized: ${normalizedScript.substring(0, 200)}...`);
			throw new Error("No words could be aligned - script text likely doesn't match audio");
		}
		
		// Warn about missing words
		const missingCount = data.words.length - validWords.length;
		if (missingCount > 0) {
			console.log(`   ⚠ ${missingCount} words couldn't be aligned (will be skipped)`);
		}
		
		return validWords.map((w: any) => ({
			text: w.word,
			start: w.start,
			end: w.end,
		}));
	} catch (error: any) {
		if (error.message.includes("fetch")) {
			throw new Error(`Cannot connect to Gentle at ${gentleUrl}. Make sure it's running: npm run check-gentle`);
		}
		throw error;
	}
}

/**
 * Main function to extract word timings for all slides
 */
async function extractAllWordTimings() {
	const audioDir = path.join(__dirname, "../public/audio");
	const slides = Object.entries(module1Scripts);

	console.log("Extracting word timings from audio files...\n");
	console.log("Choose your method:\n");
	console.log("1. OpenAI Whisper API (most accurate, requires API key)");
	console.log("2. Gentle forced alignment (free, requires local Gentle server)");
	console.log("3. Browser-based Web Speech API (free, less accurate)\n");

	// Check for OpenAI API key
	const openaiKey = process.env.OPENAI_API_KEY;
	
	// Parse arguments - handle both direct args and npm script args
	const args = process.argv.slice(2);
	const useWhisper = openaiKey && (args.includes("--whisper") || args.some(a => a.includes("whisper")));
	const useGentle = args.includes("--gentle") || args.some(a => a.includes("gentle"));

	if (useWhisper && openaiKey) {
		console.log("Using OpenAI Whisper API...\n");
		for (const [slideName, script] of slides) {
			const audioPath = path.join(audioDir, `module1-${slideName}.wav`);
			if (!fs.existsSync(audioPath)) {
				console.log(`⚠ Skipping ${slideName}: audio file not found`);
				continue;
			}

			try {
				console.log(`Processing ${slideName}...`);
				const words = await extractWithWhisperAPI(audioPath, openaiKey);
				saveWordTimings(slideName, words);
				console.log(`✓ Extracted ${words.length} words for ${slideName}\n`);
			} catch (error) {
				console.error(`✗ Failed for ${slideName}:`, error);
			}
		}
	} else if (useGentle) {
		const gentleUrl = process.env.GENTLE_URL || "http://localhost:8765";
		console.log(`Using Gentle (open source forced alignment) at ${gentleUrl}...\n`);
		
		// Check if Gentle is accessible
		try {
			const checkResponse = await fetch(gentleUrl);
			if (!checkResponse.ok) {
				throw new Error(`Gentle returned status ${checkResponse.status}`);
			}
		} catch (error: any) {
			console.error("❌ Cannot connect to Gentle server");
			console.error(`   Error: ${error.message}\n`);
			console.log("Please start Gentle first:\n");
			console.log("   # Using Docker:");
			console.log("   docker run -d -p 8765:8765 --name gentle lowerquality/gentle\n");
			console.log("   # Or using docker-compose:");
			console.log("   npm run gentle-up\n");
			console.log("   # Then check it's running:");
			console.log("   npm run check-gentle\n");
			process.exit(1);
		}
		
		console.log("✅ Gentle is accessible!\n");
		
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
				
				const words = await extractWithGentle(audioPath, script, gentleUrl);
				
				if (words.length === 0) {
					console.log(`⚠ No words extracted for ${slideName} - check script matches audio`);
					continue;
				}
				
				saveWordTimings(slideName, words);
				console.log(`✓ Extracted ${words.length} words for ${slideName}`);
				console.log(`   Duration: ${words[words.length - 1].end.toFixed(2)}s\n`);
			} catch (error: any) {
				console.error(`\n✗ Failed for ${slideName}:`, error.message);
				console.error(`\n   Troubleshooting:`);
				console.error(`   1. Check script matches audio exactly`);
				console.error(`   2. Verify audio is WAV format`);
				console.error(`   3. Check Gentle logs: docker logs gentle-alignment`);
				console.error(`   4. Try shorter script segment first\n`);
				
				// Continue with other slides even if one fails
				continue;
			}
		}
		
		console.log("✅ Word timing extraction complete!");
		console.log("\nNext step: Run 'npm run map-phrases' to auto-map phrases to code lines\n");
	} else {
		console.log("No method specified. Usage:\n");
		console.log("  # Option 1: OpenAI Whisper (requires OPENAI_API_KEY)");
		console.log("  OPENAI_API_KEY=your_key npm run extract-timings -- --whisper\n");
		console.log("  # Option 2: Gentle (open source, recommended for open source projects)");
		console.log("  # First, start Gentle:");
		console.log("  npm run gentle-up        # or: docker-compose up -d");
		console.log("  npm run check-gentle     # verify it's running");
		console.log("  # Then extract:");
		console.log("  npm run extract-timings -- --gentle\n");
		console.log("  # Option 3: Browser-based (see public/extract-timings.html)");
		console.log("  Open public/extract-timings.html in your browser\n");
	}
}

extractAllWordTimings().catch(console.error);
