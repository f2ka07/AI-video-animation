// Extract word timings using curl (since it works reliably with Gentle)
// This is a workaround for FormData encoding issues with node-fetch

import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { module1Scripts } from "../src/videos/slideScripts";
import { saveWordTimings } from "./saveWordTimings";

const execAsync = promisify(exec);

interface WordTiming {
	text: string;
	start: number;
	end: number;
}

/**
 * Normalize script text for Gentle
 */
function normalizeScriptForGentle(script: string): string {
	return script
		.replace(/\bA W S\b/gi, "AWS")
		.replace(/\bdot\b/gi, ".")
		.replace(/\s+/g, " ")
		.trim();
}

/**
 * Extract word timings using curl (reliable method)
 */
async function extractWithGentleCurl(
	audioPath: string,
	script: string,
	gentleUrl: string = "http://localhost:8765"
): Promise<WordTiming[]> {
	const normalizedScript = normalizeScriptForGentle(script);
	
	// Escape script for shell (handle quotes and special chars)
	const escapedScript = normalizedScript.replace(/'/g, "'\"'\"'");
	
	// Use curl to send the request (this works reliably)
	const curlCommand = `curl -s -F "audio=@${audioPath}" -F "transcript=${escapedScript}" "${gentleUrl}/transcriptions?async=false"`;
	
	console.log(`   Running curl command...`);
	
	try {
		const { stdout, stderr } = await execAsync(curlCommand, {
			maxBuffer: 10 * 1024 * 1024, // 10MB buffer for large responses
		});
		
		if (stderr && !stderr.includes("Warning")) {
			console.error(`   curl stderr: ${stderr}`);
		}
		
		const data = JSON.parse(stdout);
		
		if (data.error) {
			throw new Error(`Gentle alignment error: ${data.error}`);
		}
		
		if (!data.words || !Array.isArray(data.words)) {
			throw new Error("No word timings in Gentle response");
		}
		
		const validWords = data.words.filter((w: any) => w.case !== "not-found-in-audio");
		
		if (validWords.length === 0) {
			throw new Error("No words could be aligned - script text likely doesn't match audio");
		}
		
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
		if (error.code === "ENOENT") {
			throw new Error("curl not found. Please install curl or use a different method.");
		}
		if (error.message.includes("JSON")) {
			throw new Error(`Invalid JSON response from Gentle: ${error.message}`);
		}
		throw error;
	}
}

/**
 * Main function
 */
async function extractAllWordTimings() {
	const audioDir = path.join(__dirname, "../public/audio");
	const slides = Object.entries(module1Scripts);
	const gentleUrl = process.env.GENTLE_URL || "http://localhost:8765";

	console.log("Extracting word timings using curl (reliable method)...\n");
	console.log(`Gentle URL: ${gentleUrl}\n`);

	// Check if Gentle is accessible
	try {
		await execAsync(`curl -s ${gentleUrl} > nul 2>&1`);
		console.log("✅ Gentle is accessible!\n");
	} catch {
		console.error("❌ Cannot connect to Gentle");
		console.error(`   Make sure it's running at ${gentleUrl}`);
		console.error("   Start with: npm run gentle-up\n");
		process.exit(1);
	}

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
			console.log(`   Processing (this may take 1-3 minutes per file)...`);
			
			const words = await extractWithGentleCurl(audioPath, script, gentleUrl);
			
			if (words.length === 0) {
				console.log(`⚠ No words extracted for ${slideName}`);
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
			continue;
		}
	}

	console.log("✅ Word timing extraction complete!");
	console.log("\nNext step: Run 'npm run map-phrases' to auto-map phrases to code lines\n");
}

extractAllWordTimings().catch(console.error);
