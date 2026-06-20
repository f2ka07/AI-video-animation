// Extract word timings for any module from moduleContent.ts using Gentle forced alignment
// This is a Gentle-based alternative to extractWordTimingsFromContent.ts (which uses Whisper)

import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import FormData from "form-data";
import fetch from "node-fetch";
import { allModules } from "../src/videos/moduleContent";
import { saveSlideTimings, loadModuleTimings } from "./saveTimingsJson";
import { parseModuleContent, ModuleContent } from "./parseModuleContent";
import { validateSlideTimings } from "./validateWordTimingsQuality";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const {
	resolveGentleUrl,
	formatGentleConnectionHelp,
} = require("./lib/resolveGentleUrl.js");

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

let activeGentleUrl = "";

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
 * Call Gentle API for forced alignment
 */
async function callGentleAPI(
	audioPath: string,
	transcript: string,
	slideName: string
): Promise<WordTiming[]> {
	console.log(`   Calling Gentle API (this may take 1-3 minutes)...`);
	
	if (!fs.existsSync(audioPath)) {
		throw new Error(`Audio file not found: ${audioPath}`);
	}

	// Prepare form data
	const form = new FormData();
	form.append("audio", fs.createReadStream(audioPath));
	form.append("transcript", transcript);

	// Call Gentle API
	let response;
	try {
		response = await fetch(`${activeGentleUrl}/transcriptions?async=false`, {
			method: "POST",
			body: form,
			headers: form.getHeaders(),
		});
	} catch (error: any) {
		throw new Error(`Cannot connect to Gentle server at ${activeGentleUrl}: ${error.message}`);
	}

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Gentle API error (${response.status}): ${errorText}`);
	}

	const result = await response.json();

	// Convert Gentle format to WordTiming format
	// Gentle returns: { words: [{ word, start, end, case, ... }] }
	const words = (result.words || [])
		.filter((w: any) => w.word !== null && w.start !== null && w.end !== null)
		.map((w: any) => ({
			text: w.word,
			start: typeof w.start === 'number' ? w.start : parseFloat(w.start) || 0,
			end: typeof w.end === 'number' ? w.end : parseFloat(w.end) || 0,
		}));

	return words;
}

/**
 * Calculate transcript match rate between actual transcript and expected script
 * Returns a value between 0 and 1 (1 = perfect match)
 */
function calculateTranscriptMatch(transcript: string, script: string): number {
	// Normalize both texts for comparison
	const normalize = (text: string): string[] => {
		return text
			.toLowerCase()
			.replace(/[^\w\s]/g, " ")
			.split(/\s+/)
			.filter(w => w.length > 0);
	};

	const transcriptWords = normalize(transcript);
	const scriptWords = normalize(script);

	if (scriptWords.length === 0) return 1.0; // Can't compare empty script

	// Simple word overlap calculation
	let matches = 0;
	let transcriptIndex = 0;

	for (const scriptWord of scriptWords) {
		// Look for this word in the transcript (allowing for some flexibility)
		let found = false;
		for (let i = transcriptIndex; i < Math.min(transcriptIndex + 5, transcriptWords.length); i++) {
			if (transcriptWords[i] === scriptWord) {
				matches++;
				transcriptIndex = i + 1;
				found = true;
				break;
			}
		}
		if (!found) {
			// Try fuzzy match (first 3 chars)
			for (let i = transcriptIndex; i < Math.min(transcriptIndex + 5, transcriptWords.length); i++) {
				if (transcriptWords[i].slice(0, 3) === scriptWord.slice(0, 3)) {
					matches++;
					transcriptIndex = i + 1;
					break;
				}
			}
		}
	}

	return matches / scriptWords.length;
}

/**
 * Load modules from script files (fallback when content.json doesn't exist)
 * For courses like agentic-ai-for-beginners that use Remotion scenes
 */
async function loadModulesFromScripts(courseId: string): Promise<Array<ModuleContent & { courseId: string }>> {
	const scriptsDir = path.join(__dirname, "../courses", courseId, "course/scripts");
	if (!fs.existsSync(scriptsDir)) {
		return [];
	}

	const scriptFiles = fs.readdirSync(scriptsDir)
		.filter(f => f.match(/^module\d+\.txt$/i))
		.sort((a, b) => {
			const numA = parseInt(a.match(/\d+/)?.[0] || "0");
			const numB = parseInt(b.match(/\d+/)?.[0] || "0");
			return numA - numB;
		});

	if (scriptFiles.length === 0) {
		return [];
	}

	const modules: Array<ModuleContent & { courseId: string }> = [];

	// Slide name mapping based on script sections
	const sectionToSlideName: Record<string, string> = {
		"CINEMATIC INTRO": "module-{N}-title",
		"CONCEPT": "module-{N}-concept",
		"ARCHITECTURE": "module-{N}-architecture",
		"APPLICATION": "module-{N}-application",
		"EXAM MAPPING": "module-{N}-exam-mapping",
		"RECAP": "module-{N}-recap",
	};

	for (const file of scriptFiles) {
		const moduleNumber = parseInt(file.match(/\d+/)?.[0] || "0");
		if (moduleNumber === 0) continue;

		const scriptPath = path.join(scriptsDir, file);
		const content = fs.readFileSync(scriptPath, "utf-8");

		const slides: Array<{ name: string; type: string; script: string; title?: string }> = [];

		// Parse sections from script
		const sectionRegex = /\[([^\]]+)\]\s*\n([\s\S]*?)(?=\n---|\n\[|$)/g;
		let match;
		while ((match = sectionRegex.exec(content)) !== null) {
			const sectionName = match[1].trim();
			const sectionText = match[2].trim();

			if (!sectionText) continue;

			const slideNameTemplate = sectionToSlideName[sectionName];
			if (!slideNameTemplate) continue;

			const slideName = slideNameTemplate.replace("{N}", moduleNumber.toString());
			const slideType = sectionName === "CINEMATIC INTRO" ? "title" : "content-two-card";

			slides.push({
				name: slideName,
				type: slideType,
				script: sectionText,
				title: sectionName === "CINEMATIC INTRO" ? `Module ${moduleNumber} Title` : sectionName,
			});
		}

		if (slides.length > 0) {
			// Extract module title from first line or section
			const firstLine = content.split("\n")[0];
			const titleMatch = firstLine.match(/Module\s+\d+:\s*(.+)/i);
			const title = titleMatch ? titleMatch[1].trim() : `Module ${moduleNumber}`;

			modules.push({
				moduleNumber,
				courseId,
				title,
				subtitle: `Module ${moduleNumber}`,
				slides: slides as any,
			});
		}
	}

	return modules;
}

/**
 * Main function - Extract word timings for specified modules using Gentle forced alignment
 */
async function extractWordTimingsFromContentGentle(moduleRange?: string, courseIdFilter?: string) {
	const baseAudioDir = path.join(__dirname, "../public/audio");

	const gentleResolution = await resolveGentleUrl();
	if (!gentleResolution.url) {
		console.error(`❌ ${formatGentleConnectionHelp(gentleResolution.tried)}`);
		process.exit(1);
	}
	activeGentleUrl = gentleResolution.url;
	if (gentleResolution.fallback && gentleResolution.configuredUrl) {
		console.log(
			`Gentle not reachable at ${gentleResolution.configuredUrl}; using ${activeGentleUrl}\n`
		);
	}

	// Load modules - try from moduleContent.ts first, then from course's content.json
	let filteredModules: Array<ModuleContent & { courseId?: string }> = [];
	
	if (courseIdFilter) {
		// First try: filter from moduleContent.ts
		filteredModules = allModules.filter((m) => m.courseId === courseIdFilter);
		
		// If not found in moduleContent.ts, try loading from course's content.json
		if (filteredModules.length === 0) {
			const contentJsonPath = path.join(__dirname, "../courses", courseIdFilter, "content.json");
			if (fs.existsSync(contentJsonPath)) {
				console.log(`   Course not in moduleContent.ts, loading from content.json...`);
				const modulesFromJson = parseModuleContent(contentJsonPath);
				// Add courseId to each module
				filteredModules = modulesFromJson.map(m => ({ ...m, courseId: courseIdFilter }));
				console.log(`   Loaded ${filteredModules.length} module(s) from content.json`);
			} else {
				// Try loading from scripts (for courses like agentic-ai-for-beginners that use Remotion scenes)
				const scriptsDir = path.join(__dirname, "../courses", courseIdFilter, "course/scripts");
				if (fs.existsSync(scriptsDir)) {
					console.log(`   Course not in moduleContent.ts or content.json, loading from scripts...`);
					console.log(`   ⚠ Note: moduleContent.ts currently contains: ${[...new Set(allModules.map(m => m.courseId))].join(", ") || "no modules"}`);
					console.log(`   💡 To activate this course: npx tsx scripts/activateCourseFromSSML.ts ${courseIdFilter}\n`);
					
					// Try to load modules from scripts (basic fallback)
					filteredModules = await loadModulesFromScripts(courseIdFilter);
					if (filteredModules.length === 0) {
						console.error(`❌ Could not load modules from scripts.`);
						console.error(`   Scripts directory exists but no valid module scripts found.`);
						console.error(`   Please activate the course first: npx tsx scripts/activateCourseFromSSML.ts ${courseIdFilter}`);
						process.exit(1);
					}
					console.log(`   ✓ Loaded ${filteredModules.length} module(s) from script files`);
				} else {
					console.error(`❌ No modules found for course: ${courseIdFilter}`);
					console.error(`   - Not in moduleContent.ts`);
					console.error(`   - content.json not found at: ${contentJsonPath}`);
					console.error(`   - Scripts directory not found at: ${scriptsDir}`);
					console.error(`   Available courses in moduleContent.ts: ${[...new Set(allModules.map(m => m.courseId))].join(", ")}`);
					console.error(`\n💡 To fix this:`);
					console.error(`   1. Activate the course: npx tsx scripts/activateCourseFromSSML.ts ${courseIdFilter}`);
					console.error(`   2. Or ensure content.json exists at: ${contentJsonPath}`);
					process.exit(1);
				}
			}
		} else {
			console.log(`   Found ${filteredModules.length} module(s) in moduleContent.ts for course: ${courseIdFilter}`);
		}
	} else {
		// No course filter - use all modules from moduleContent.ts
		filteredModules = allModules;
	}

	let modulesToProcess = filteredModules;
	if (moduleRange) {
		try {
			const moduleNumbers = parseModuleRange(moduleRange);
			modulesToProcess = filteredModules.filter((m) => moduleNumbers.includes(m.moduleNumber));
			if (modulesToProcess.length === 0) {
				throw new Error(`No modules found for: ${moduleRange}${courseIdFilter ? ` in course ${courseIdFilter}` : ""}`);
			}
		} catch (error: any) {
			console.error(`❌ Error: ${error.message}`);
			console.error("\nUsage:");
			console.error("  tsx scripts/extractWordTimingsFromContentGentle.ts [module-range] [courseId]");
			console.error("\nExamples:");
			console.error("  tsx scripts/extractWordTimingsFromContentGentle.ts 1 agentic-ai-for-beginners");
			console.error("  tsx scripts/extractWordTimingsFromContentGentle.ts 1-3 agentic-ai-for-beginners");
			console.error("  tsx scripts/extractWordTimingsFromContentGentle.ts all agentic-ai-for-beginners");
			process.exit(1);
		}
	}

	console.log("Extracting word timings using Gentle forced alignment...\n");
	console.log(`Gentle URL: ${activeGentleUrl}`);
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
			const audioPath = path.join(audioDir, `module${module.moduleNumber}-${slide.name}.wav`);
			if (!fs.existsSync(audioPath)) {
				console.log(`⚠ Skipping ${slide.name}: audio file not found`);
				totalSkipped++;
				continue;
			}

			// Check if timings already exist for this slide
			const existingSlideTimings = existingTimings.slides[slide.name];
			if (existingSlideTimings && existingSlideTimings.words && existingSlideTimings.words.length > 0) {
				// Validate quality of existing timings
				const validation = validateSlideTimings(slide.name, existingSlideTimings.words);
				const qualityScore = validation.qualityScore;
				
				// Also check transcript accuracy if script is available
				let transcriptMatch = 1.0; // Default to 100% if no script
				if (slide.script && slide.script.trim().length > 0) {
					const transcriptText = existingSlideTimings.words.map(w => w.text).join(" ");
					transcriptMatch = calculateTranscriptMatch(transcriptText, slide.script);
				}
				
				// Combined quality: structural quality AND transcript accuracy
				// Both must be good (>= 80%) to skip
				const combinedQuality = (qualityScore / 100) * transcriptMatch * 100;
				
				if (qualityScore >= 80 && transcriptMatch >= 0.8) {
					console.log(`⏭ Skipping ${slide.name}: timings already exist with good quality (${existingSlideTimings.words.length} words, structural: ${qualityScore.toFixed(1)}%, transcript match: ${(transcriptMatch * 100).toFixed(1)}%)`);
					totalSkipped++;
					continue;
				}
				
				// Quality is poor - re-extract with Gentle
				console.log(`⚠ Re-extracting ${slide.name}: existing timings have poor quality`);
				console.log(`   Structural quality: ${qualityScore.toFixed(1)}%`);
				if (slide.script) {
					console.log(`   Transcript match: ${(transcriptMatch * 100).toFixed(1)}%`);
				}
				console.log(`   Issues: ${validation.duplicateCount} duplicates, ${validation.zeroDurationCount} zero durations, ${validation.unrealisticDurationCount} unrealistic durations`);
			}

			// Check if slide has script text (required for Gentle)
			if (!slide.script || slide.script.trim().length === 0) {
				console.log(`⚠ Skipping ${slide.name}: no script text (required for Gentle)`);
				totalSkipped++;
				continue;
			}

			try {
				console.log(`Processing ${slide.name}...`);
				console.log(`   Audio: ${path.basename(audioPath)}`);
				console.log(`   Script length: ${slide.script.length} characters`);
				
				// Call Gentle API
				const words = await callGentleAPI(audioPath, slide.script, slide.name);
				
				if (words.length === 0) {
					console.log(`⚠ No words extracted for ${slide.name}`);
					totalSkipped++;
					continue;
				}
				
				// Save to course-specific timing file
				saveSlideTimings(courseId, module.moduleNumber, slide.name, words, module.title);
				console.log(`✓ Processed ${words.length} words for ${slide.name}`);
				console.log(`   Saved to: courses/${courseId}/timings/module${module.moduleNumber}.json`);
				const lastWord = words[words.length - 1];
				if (lastWord && lastWord.end !== undefined) {
					console.log(`   Duration: ${lastWord.end.toFixed(2)}s\n`);
				} else {
					console.log(`   Duration: N/A (no end time)\n`);
				}
				
				// Automatically extract bulletStarts for slides with bullet points
				if (slide.points && slide.points.length >= 5) {
					try {
						const { extractModuleBulletStarts } = await import("./extractBulletStartsFromTimings");
						extractModuleBulletStarts(courseId, module.moduleNumber);
						console.log(`   ✓ Extracted bulletStarts for ${slide.name}\n`);
					} catch (error: any) {
						console.warn(`   ⚠ Could not extract bulletStarts: ${error.message}\n`);
					}
				}
				totalProcessed++;
			} catch (error: any) {
				console.error(`\n✗ Failed for ${slide.name}:`, error.message);
				console.error(`   Make sure Gentle is running and accessible at ${activeGentleUrl}\n`);
				totalSkipped++;
				continue;
			}
		}
	}

	console.log("\n✅ Word timing extraction complete!");
	console.log(`   Processed: ${totalProcessed} slides (new timings)`);
	console.log(`   Skipped: ${totalSkipped} slides`);
	console.log(`   Saved to: courses/{courseId}/timings/module*.json (per-course, per-module)`);
	if (totalProcessed === 0 && totalSkipped > 0) {
		console.log(`\n💡 All slides already have timings! No API calls were made.`);
	}

	// Automatically extract bullet start times for slides with bullet points
	console.log("\n🔍 Extracting bullet start times...");
	for (const module of modulesToProcess) {
		const courseId = module.courseId || "default";
		const moduleNumber = module.moduleNumber;
		if (typeof moduleNumber !== "number" || isNaN(moduleNumber) || !courseId || courseId === "all") {
			console.warn(`⚠ Skipping bullet extraction: invalid module (courseId=${courseId}, moduleNumber=${moduleNumber})`);
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
const courseId = process.argv[3];
extractWordTimingsFromContentGentle(moduleRange, courseId).catch(console.error);
