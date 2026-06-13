// Automatically extract bulletStarts from word timings
// This integrates with the GUI timing system to automatically generate bulletStarts
// Usage: Called automatically after word timings are extracted

import * as fs from "fs";
import * as path from "path";
import { loadModuleTimings, saveModuleTimings, ModuleTimings } from "./saveTimingsJson";
import { parseModuleContent } from "./parseModuleContent";
import { computeBulletStarts } from "../src/utils/computeBulletStarts";

/**
 * Load bullet points from generated ModuleN.tsx (for courses without content.json)
 * Parses StickTeacherBulletSlide props: slideName and points
 */
function loadBulletPointsFromModuleTsx(moduleNumber: number): Record<string, string[]> {
	const modulePath = path.join(__dirname, "../src/videos", `Module${moduleNumber}.tsx`);
	if (!fs.existsSync(modulePath)) {
		return {};
	}
	const content = fs.readFileSync(modulePath, "utf-8");
	const result: Record<string, string[]> = {};

	// Find StickTeacherBulletSlide blocks (from opening tag to />)
	const blockRegex = /<StickTeacherBulletSlide[\s\S]*?\/>/g;
	let block;
	while ((block = blockRegex.exec(content)) !== null) {
		const blockStr = block[0];
		const slideNameMatch = blockStr.match(/slideName=["']([^"']+)["']/);
		// points={[ "..." , ... ]} in JSX. Use double-quote-only so "they're" etc. are not split.
		const pointsMatch = blockStr.match(/points=\{\s*\[\s*([\s\S]*?)\]\s*\}\s*bulletStarts/);
		if (!slideNameMatch || !pointsMatch) continue;
		const slideName = slideNameMatch[1];
		const pointsBlock = pointsMatch[1];
		const points: string[] = [];
		const re = /"([^"\\]*(?:\\.[^"\\]*)*)"/g;
		let m;
		while ((m = re.exec(pointsBlock)) !== null) {
			points.push(m[1].replace(/\\"/g, '"'));
		}
		if (slideName && points.length >= 5) {
			result[slideName] = points.slice(0, 5);
		}
	}
	return result;
}

/**
 * Load module with bullet slides from script files + ModuleN.tsx (for courses like agentic-ai-for-beginners)
 */
function loadModuleFromScriptsAndTsx(courseId: string, moduleNumber: number): { slides: Array<{ name: string; script: string; points?: string[] }> } | null {
	const scriptsDir = path.join(__dirname, "../courses", courseId, "course/scripts");
	const scriptFile = `module${moduleNumber.toString().padStart(2, "0")}.txt`;
	const scriptPath = path.join(scriptsDir, scriptFile);
	if (!fs.existsSync(scriptPath)) {
		return null;
	}

	const sectionToSlideName: Record<string, string> = {
		"CINEMATIC INTRO": "module-{N}-title",
		"CONCEPT": "module-{N}-concept",
		"ARCHITECTURE": "module-{N}-architecture",
		"APPLICATION": "module-{N}-application",
		"EXAM MAPPING": "module-{N}-exam-mapping",
		"RECAP": "module-{N}-recap",
	};

	const scriptContent = fs.readFileSync(scriptPath, "utf-8");
	const slides: Array<{ name: string; script: string; points?: string[] }> = [];
	const sectionRegex = /\[([^\]]+)\]\s*\n([\s\S]*?)(?=\n---|\n\[|$)/g;
	let match;
	while ((match = sectionRegex.exec(scriptContent)) !== null) {
		const sectionName = match[1].trim();
		const sectionText = match[2].trim();
		if (!sectionText) continue;
		const slideNameTemplate = sectionToSlideName[sectionName];
		if (!slideNameTemplate) continue;
		const slideName = slideNameTemplate.replace("{N}", moduleNumber.toString());
		slides.push({ name: slideName, script: sectionText });
	}

	const pointsFromTsx = loadBulletPointsFromModuleTsx(moduleNumber);
	for (const slide of slides) {
		if (pointsFromTsx[slide.name]) {
			slide.points = pointsFromTsx[slide.name];
		}
	}
	return { slides };
}

interface WordTiming {
	text: string;
	start: number;
	end: number;
}

/**
 * Find when a phrase appears in word timings using fuzzy matching
 */
function findPhraseTime(words: WordTiming[], phrase: string, startFrom: number = 0): number | null {
	const phraseWords = phrase
		.toLowerCase()
		.split(/\s+/)
		.filter(w => w.length > 0)
		.map(w => w.replace(/[.,!?;:]/g, "")); // Remove punctuation

	if (phraseWords.length === 0) return null;

	// Find starting position
	let searchStart = 0;
	for (let i = 0; i < words.length; i++) {
		if (words[i].start >= startFrom) {
			searchStart = i;
			break;
		}
	}

	// Try to find the phrase starting from searchStart
	for (let i = searchStart; i < words.length; i++) {
		let matchedWords = 0;
		let phraseIndex = 0;

		// Check if words starting from i match the phrase
		for (let j = i; j < words.length && phraseIndex < phraseWords.length; j++) {
			const wordText = words[j].text.toLowerCase().replace(/[.,!?;:]/g, "");
			
			// Check for exact match or partial match (for compound words like "single-call")
			if (wordText === phraseWords[phraseIndex] || 
			    wordText.includes(phraseWords[phraseIndex]) ||
			    phraseWords[phraseIndex].includes(wordText)) {
				if (matchedWords === 0) {
					// This is the start of the phrase
					return words[j].start;
				}
				matchedWords++;
				phraseIndex++;
			} else if (matchedWords > 0) {
				// We started matching but this word doesn't match - reset
				break;
			}
		}

		// If we matched at least 2 words (or all words if phrase is short), return
		if (matchedWords >= Math.min(2, phraseWords.length)) {
			return words[i].start;
		}
	}

	return null;
}

/**
 * Extract bullet start times from word timings.
 * Single strategy: ordinals first, else first >=3-word phrase in transcript (after previous bullet).
 * No estimates or fallbacks; see docs/bullet-pointing-algorithm.md.
 */
export type BulletStrategy = "ordinal" | "phrase";

function extractBulletStarts(
	words: WordTiming[],
	points: string[],
	_script?: string
): { starts: number[]; strategies: BulletStrategy[] } | null {
	const starts = computeBulletStarts(words, points);
	if (!starts) {
		console.error(
			`Could not match all bullet points to word timings (${points.length} points). ` +
				`Author bullets to match Gentle word timings.`
		);
		return null;
	}
	return { starts, strategies: starts.map(() => "phrase" as BulletStrategy) };
}

/**
 * Extract bulletStarts for all slides in a module and save to a separate file
 */
/** Module shape used for bullet extraction (slides with optional points) */
export interface ModuleForBullets {
	slides: Array<{ name: string; script?: string; points?: string[] }>;
}

/**
 * Load module content for bullet extraction.
 * Tries content.json, then moduleContent.ts, then scripts + ModuleN.tsx.
 */
export function getModuleContentForBullets(courseId: string, moduleNumber: number): ModuleForBullets | null {
	let module: ModuleForBullets | null = null;

	const contentPath = path.join(__dirname, "../courses", courseId, "content.json");
	if (fs.existsSync(contentPath)) {
		const modules = parseModuleContent(contentPath);
		const m = modules.find((x: any) => x.moduleNumber === moduleNumber);
		module = m ? { slides: m.slides } : null;
	}

	if (!module) {
		try {
			const { allModules } = require("../src/videos/moduleContent");
			const filtered = allModules.filter((m: any) => m.courseId === courseId && m.moduleNumber === moduleNumber);
			module = filtered.length > 0 ? { slides: filtered[0].slides } : null;
		} catch {
			// moduleContent.ts may not export allModules or course not activated
		}
	}

	if (!module) {
		module = loadModuleFromScriptsAndTsx(courseId, moduleNumber);
	}

	// Always enrich with points from ModuleN.tsx when a slide has none (e.g. from moduleContent or content.json without points)
	if (module && module.slides.length > 0) {
		const pointsFromTsx = loadBulletPointsFromModuleTsx(moduleNumber);
		for (const slide of module.slides) {
			if (pointsFromTsx[slide.name] && (!slide.points || slide.points.length < 5)) {
				slide.points = pointsFromTsx[slide.name];
			}
		}
	}

	return module && module.slides.length > 0 ? module : null;
}

export function extractModuleBulletStarts(courseId: string, moduleNumber: number): void {
	const module = getModuleContentForBullets(courseId, moduleNumber);

	if (!module || !module.slides || module.slides.length === 0) {
		console.error(`❌ No module content found for ${courseId} module ${moduleNumber}`);
		console.error(`   Try: content.json, moduleContent.ts, or course/scripts + Module${moduleNumber}.tsx`);
		return;
	}

	// Load word timings
	const timings = loadModuleTimings(courseId, moduleNumber);
	if (!timings) {
		console.error(`❌ No word timings found for module ${moduleNumber}`);
		return;
	}

	const bulletStartsData: Record<string, number[]> = {};

	// Process each slide
	for (const slide of module.slides) {
		const slideData = timings.slides[slide.name];
		if (!slideData || !slideData.words || slideData.words.length === 0) {
			console.log(`⚠ Skipping ${slide.name}: No word timings`);
			continue;
		}

		// Only process slides with bullet points (StickTeacherBulletSlide)
		if (!slide.points || slide.points.length === 0) {
			continue;
		}

		// Ensure we have exactly 5 bullets (required for StickTeacherBulletSlide)
		// If we have fewer than 5, pad with empty strings (will be handled by fallback logic)
		const points = slide.points.length >= 5
			? slide.points.slice(0, 5)
			: slide.points.concat(Array(5 - slide.points.length).fill(""));

		const out = extractBulletStarts(slideData.words, points, slide.script);
		if (out === null) {
			console.log(`✗ Skipped ${slide.name}: extraction failed (no estimate fallback).`);
			continue;
		}
		const { starts, strategies } = out;
		bulletStartsData[slide.name] = starts;
		console.log(`✓ ${slide.name}: [${starts.map(t => t.toFixed(2)).join(", ")}]`);
		console.log(`  strategies: ${strategies.join(", ")} (ordinal=ordinal match, phrase=word-group match)`);
	}

	// Save to a separate file for easy access
	const bulletStartsPath = path.join(
		__dirname,
		"../courses",
		courseId,
		"timings",
		`module${moduleNumber}-bulletStarts.json`
	);

	fs.mkdirSync(path.dirname(bulletStartsPath), { recursive: true });
	fs.writeFileSync(bulletStartsPath, JSON.stringify(bulletStartsData, null, 2), "utf-8");

	console.log(`\n✅ Saved bullet start times to: ${bulletStartsPath}`);
	console.log(`\nTo use in Module${moduleNumber}.tsx, copy the values:`);
	for (const [slideName, starts] of Object.entries(bulletStartsData)) {
		console.log(`  ${slideName}: bulletStarts={[${starts.map(t => t.toFixed(2)).join(", ")}]}`);
	}
}

// Main - when run standalone: tsx extractBulletStartsFromTimings.ts [courseId] [moduleNumber]
const courseId = process.argv[2] || "agentic-ai-for-beginners";
const moduleNumArg = process.argv[3];
const moduleNumber = moduleNumArg ? parseInt(moduleNumArg, 10) : 1;

if (courseId === "all" || isNaN(moduleNumber)) {
	// Run for all modules from moduleContent when "all" or invalid args
	const { allModules } = require("../src/videos/moduleContent");
	for (const m of allModules) {
		if (m.courseId && typeof m.moduleNumber === "number" && !isNaN(m.moduleNumber)) {
			extractModuleBulletStarts(m.courseId, m.moduleNumber);
		}
	}
} else {
	extractModuleBulletStarts(courseId, moduleNumber);
}
