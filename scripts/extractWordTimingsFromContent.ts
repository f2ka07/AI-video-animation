// Extract word timings for any module from moduleContent.ts using OpenAI Whisper API
// This replaces the hardcoded module1-only scripts

import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import OpenAI from "openai";
import { allModules } from "../src/videos/moduleContent";
import { saveSlideTimings, loadModuleTimings } from "./saveTimingsJson";
import { saveWhisperResponse, loadWhisperResponse, hasCachedResponse, WhisperResponse } from "./saveWhisperResponse";

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, "../.env") });

// When stdout is piped (e.g. from gui-server), Node buffers output. Force line-by-line flush
// so the parent receives progress in real time for GUI feedback.
if (!process.stdout.isTTY && (process.stdout as any)._handle?.setBlocking) {
	(process.stdout as any)._handle.setBlocking(true);
}

interface WordTiming {
	text: string;
	start: number;
	end: number;
}

/** Legacy: script as string -> scripts array */
function getScripts(slide: { script?: string; scripts?: string[] }): string[] {
	if (slide.scripts && slide.scripts.length >= 1) return slide.scripts;
	if (slide.script) return [slide.script];
	return [];
}

function isMultiAudioCodeSlide(slide: { type: string; scripts?: string[] }): boolean {
	return slide.type === "code" && slide.scripts && slide.scripts.length > 1;
}

function parseModuleRange(input: string): number[] {
	if (input === "all" || !input) {
		return allModules.map((m) => m.moduleNumber);
	}

	const modules: number[] = [];
	const parts = input.split(",");

	for (const part of parts) {
		const trimmed = part.trim();
		if (trimmed.includes("-")) {
			const [start, end] = trimmed.split("-").map((n) => parseInt(n.trim()));
			if (isNaN(start) || isNaN(end)) {
				throw new Error(`Invalid range: ${trimmed}`);
			}
			for (let i = start; i <= end; i++) {
				modules.push(i);
			}
		} else {
			const num = parseInt(trimmed);
			if (isNaN(num)) {
				throw new Error(`Invalid module number: ${trimmed}`);
			}
			modules.push(num);
		}
	}

	return [...new Set(modules)].sort((a, b) => a - b);
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
 * Main function - Extract word timings for specified modules using OpenAI Whisper API
 */
async function extractWordTimingsFromContent(moduleRange?: string) {
	const baseAudioDir = path.join(__dirname, "../public/audio");
	const openaiKey = process.env.OPENAI_API_KEY;

	if (!openaiKey) {
		console.error("❌ OPENAI_API_KEY is required");
		console.error("\nPlease add your OpenAI API key to .env file in the project root:");
		console.error("  OPENAI_API_KEY=your_key_here");
		process.exit(1);
	}

	let modulesToProcess = allModules;
	if (moduleRange) {
		try {
			const moduleNumbers = parseModuleRange(moduleRange);
			modulesToProcess = allModules.filter((m) => moduleNumbers.includes(m.moduleNumber));
			if (modulesToProcess.length === 0) {
				throw new Error(`No modules found for: ${moduleRange}`);
			}
		} catch (error: any) {
			console.error(`❌ Error: ${error.message}`);
			console.error("\nUsage:");
			console.error("  tsx scripts/extractWordTimingsFromContent.ts [module-range]");
			console.error("\nExamples:");
			console.error("  tsx scripts/extractWordTimingsFromContent.ts 1        # Module 1 only");
			console.error("  tsx scripts/extractWordTimingsFromContent.ts 1-3     # Modules 1, 2, 3");
			console.error("  tsx scripts/extractWordTimingsFromContent.ts 1,3,5  # Modules 1, 3, 5");
			console.error("  tsx scripts/extractWordTimingsFromContent.ts all     # All modules (default)");
			process.exit(1);
		}
	}

	console.log("Extracting word timings using OpenAI Whisper API...\n");
	console.log(`Processing ${modulesToProcess.length} module(s)...\n`);

	let totalProcessed = 0;
	let totalSkipped = 0;

	for (const module of modulesToProcess) {
		console.log(`\n=== Module ${module.moduleNumber}: ${module.title} ===`);
		
		// Use course-specific audio directory
		const courseId = module.courseId || 'default';
		const audioDir = path.join(baseAudioDir, courseId);
		
		// Load existing timings to check what's already done
		const existingTimings = loadModuleTimings(courseId, module.moduleNumber, module.title);
		
		// Process all slides (not just code slides, since content slides also need word timings)
		for (const slide of module.slides) {
			const scripts = getScripts(slide);

			if (isMultiAudioCodeSlide(slide)) {
				// Multi-audio code slide: extract per chunk, merge with offsets, save under base name
				const chunkCount = slide.scripts!.length;
				let offsetSeconds = 0;
				const mergedWords: WordTiming[] = [];
				let allChunksPresent = true;

				for (let i = 0; i < chunkCount; i++) {
					const chunkKey = `${slide.name}-${i + 1}`;
					const audioPath = path.join(audioDir, `module${module.moduleNumber}-${chunkKey}.wav`);
					if (!fs.existsSync(audioPath)) {
						console.log(`  Skipping ${slide.name}: chunk ${i + 1} audio not found (${path.basename(audioPath)})`);
						allChunksPresent = false;
						break;
					}
				}

				if (!allChunksPresent) {
					totalSkipped++;
					continue;
				}

				const existingSlideTimings = existingTimings.slides[slide.name];
				if (existingSlideTimings?.words?.length) {
					console.log(`  Skipping ${slide.name}: merged timings already exist`);
					totalSkipped++;
					continue;
				}

				try {
					for (let i = 0; i < chunkCount; i++) {
						const chunkKey = `${slide.name}-${i + 1}`;
						const audioPath = path.join(audioDir, `module${module.moduleNumber}-${chunkKey}.wav`);
						console.log(`  Processing ${slide.name} chunk ${i + 1}/${chunkCount}...`);

						const whisperResponse = await callWhisperAPI(audioPath, openaiKey, chunkKey);
						const chunkWords = processWhisperResponse(whisperResponse);

						for (const w of chunkWords) {
							mergedWords.push({
								text: w.text,
								start: w.start + offsetSeconds,
								end: w.end + offsetSeconds,
							});
						}
						const chunkDuration = chunkWords.length > 0 ? chunkWords[chunkWords.length - 1].end : 0;
						offsetSeconds += chunkDuration;
					}

					if (mergedWords.length === 0) {
						totalSkipped++;
						continue;
					}

					saveSlideTimings(courseId, module.moduleNumber, slide.name, mergedWords, module.title);
					console.log(`  Processed ${slide.name}: ${mergedWords.length} words (merged from ${chunkCount} chunks)`);
					totalProcessed++;
				} catch (error: any) {
					console.error(`  Failed for ${slide.name}:`, error.message);
					totalSkipped++;
				}
				continue;
			}

			// Single-audio slide (legacy or non-code)
			const audioPath = path.join(audioDir, `module${module.moduleNumber}-${slide.name}.wav`);
			if (!fs.existsSync(audioPath)) {
				console.log(`  Skipping ${slide.name}: audio file not found`);
				totalSkipped++;
				continue;
			}

			const existingSlideTimings = existingTimings.slides[slide.name];
			if (existingSlideTimings?.words?.length) {
				console.log(`  Skipping ${slide.name}: timings already exist (${existingSlideTimings.words.length} words)`);
				totalSkipped++;
				continue;
			}

			try {
				console.log(`Processing ${slide.name}...`);
				console.log(`   Audio: ${path.basename(audioPath)}`);
				console.log(`   Script length: ${scripts[0]?.length ?? 0} characters`);

				const whisperResponse = await callWhisperAPI(audioPath, openaiKey, slide.name);
				const words = processWhisperResponse(whisperResponse);

				if (words.length === 0) {
					console.log(`  No words extracted for ${slide.name}`);
					totalSkipped++;
					continue;
				}

				saveSlideTimings(courseId, module.moduleNumber, slide.name, words, module.title);
				console.log(`  Processed ${words.length} words for ${slide.name}`);
				console.log(`   Duration: ${words[words.length - 1].end.toFixed(2)}s\n`);
				totalProcessed++;
			} catch (error: any) {
				console.error(`\n  Failed for ${slide.name}:`, error.message);
				console.error(`   Run: npx tsx scripts/processCachedWhisperResponses.ts ${slide.name}\n`);
				totalSkipped++;
			}
		}
	}

	console.log("\n✅ Word timing extraction complete!");
	console.log(`   Processed: ${totalProcessed} slides (new timings)`);
	console.log(`   Skipped: ${totalSkipped} slides (${totalSkipped - totalProcessed} already had timings, ${totalProcessed > 0 ? totalSkipped - (totalSkipped - totalProcessed) : totalSkipped} missing audio/invalid)`);
	console.log(`   Saved to: courses/{courseId}/timings/module*.json (per-course, per-module)`);
	if (totalProcessed === 0 && totalSkipped > 0) {
		console.log(`\n💡 All slides already have timings! No API calls were made (cost saved).`);
	}

	// Map author bullet points to phrase times (ensures bullet highlights sync with narration)
	console.log("\nMapping phrase times for bullet sync...");
	const courseIds = [...new Set(modulesToProcess.map((m) => m.courseId || "default"))];
	for (const courseId of courseIds) {
		if (courseId === "all") continue;
		try {
			const { execSync } = await import("child_process");
			execSync(`npx tsx scripts/mapPhraseTimes.ts ${courseId} all`, {
				cwd: path.join(__dirname, ".."),
				stdio: "pipe",
			});
		} catch (error: any) {
			console.warn(`⚠ Failed to map phrase times for ${courseId}: ${error.message}`);
		}
	}

	// Automatically extract bullet start times for slides with bullet points
	console.log("\nExtracting bullet start times...");
	for (const module of modulesToProcess) {
		const courseId = module.courseId || "default";
		const moduleNumber = module.moduleNumber;
		if (typeof moduleNumber !== "number" || isNaN(moduleNumber) || !courseId || courseId === "all") {
			continue;
		}
		try {
			const bulletExtractor = await import("./extractBulletStartsFromTimings");
			bulletExtractor.extractModuleBulletStarts(courseId, moduleNumber);
		} catch (error: any) {
			console.warn(`⚠ Failed to extract bullet starts for module ${moduleNumber}: ${error.message}`);
		}
	}

	console.log("\nNext step: Activate the course to copy timings for Remotion\n");
}

const moduleRange = process.argv[2];
extractWordTimingsFromContent(moduleRange).catch(console.error);
