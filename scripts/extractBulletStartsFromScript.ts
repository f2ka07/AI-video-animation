// Extract bulletStarts by analyzing the narration script text
// This is more reliable than Whisper when word timings are corrupted
// 
// How it works:
// 1. Find where each bullet point's content appears in the script
// 2. Calculate timing based on word position and audio duration
// 3. Use average speaking rate to estimate timestamps

import * as fs from "fs";
import * as path from "path";

// Slide configurations with bullets and durations
const slideConfigs = [
	{
		name: "module-1-concept",
		sectionName: "CONCEPT",
		durationInFrames: 2987,
		bullets: [
			"Single-call inference: input in, output out, interaction ends",
			"No memory between interactions",
			"Cannot plan across multiple steps or use external tools",
			"Cannot verify outputs or adapt based on feedback",
			"Agentic AI: a system architecture that executes workflows",
		],
	},
	{
		name: "module-1-architecture",
		sectionName: "ARCHITECTURE",
		durationInFrames: 3540,
		bullets: [
			"First, planning - decompose goals into subtasks",
			"Second, tools - APIs, code, search engines",
			"Third, memory - short-term and long-term retention",
			"Fourth, safety loops - guardrails and policy checks",
			"Fifth, human-in-the-loop - escalation and oversight",
		],
	},
	{
		name: "module-1-application",
		sectionName: "APPLICATION",
		durationInFrames: 2510,
		bullets: [
			"First, reliability - checkpoints, retries, and verification steps",
			"Second, traceability - audit trails for compliance",
			"Third, integration - connect to CRMs, ERPs, data warehouses",
			"Fourth, first-class tool integration - treats external tools as first-class citizens",
			"Fifth, new category of AI workload - executes workflows and manages processes",
		],
	},
];

interface BulletTiming {
	bulletIndex: number;
	wordPosition: number;
	estimatedTime: number;
	phrase: string;
}

/**
 * Normalize text for matching (lowercase, remove punctuation)
 */
function normalizeText(text: string): string {
	return text
		.toLowerCase()
		.replace(/[.,!?;:'"]/g, "")
		.replace(/\s+/g, " ")
		.trim();
}

/**
 * Find where a phrase appears in the script (by word position)
 */
function findPhrasePosition(scriptWords: string[], phraseWords: string[], startFrom: number = 0): number {
	for (let i = startFrom; i < scriptWords.length - phraseWords.length + 1; i++) {
		let match = true;
		for (let j = 0; j < phraseWords.length; j++) {
			// Allow partial matches for compound words
			if (!scriptWords[i + j].includes(phraseWords[j]) && 
			    !phraseWords[j].includes(scriptWords[i + j])) {
				match = false;
				break;
			}
		}
		if (match) {
			return i;
		}
	}
	return -1;
}

/**
 * Extract key search phrases from a bullet point
 */
function extractKeyPhrases(bullet: string): string[][] {
	const normalized = normalizeText(bullet);
	const words = normalized.split(" ").filter(w => w.length > 0);
	
	const phrases: string[][] = [];
	
	// Strategy 0: If bullet starts with ordinal, prioritize finding that ordinal
	const ordinals = ["first", "second", "third", "fourth", "fifth"];
	const firstWord = words[0]?.toLowerCase();
	if (ordinals.includes(firstWord)) {
		phrases.push([firstWord]); // Just search for the ordinal
	}
	
	// Strategy 1: First 2-3 significant words
	const significantWords = words.filter(w => 
		w.length > 2 && 
		!["the", "a", "an", "is", "are", "and", "or", "but", "for", "with", "to", "of", "in", "on"].includes(w)
	);
	
	if (significantWords.length >= 2) {
		phrases.push(significantWords.slice(0, 3));
	}
	
	// Strategy 2: First 3 words of the bullet
	if (words.length >= 3) {
		phrases.push(words.slice(0, 3));
	}
	
	// Strategy 3: Single distinctive word
	const distinctiveWords = significantWords.filter(w => w.length > 5);
	for (const word of distinctiveWords.slice(0, 2)) {
		phrases.push([word]);
	}
	
	return phrases;
}

/**
 * Calculate bulletStarts from script and bullet points
 */
export function calculateBulletStarts(
	script: string,
	bullets: string[],
	audioDurationSeconds: number
): number[] {
	const scriptNormalized = normalizeText(script);
	const scriptWords = scriptNormalized.split(" ").filter(w => w.length > 0);
	const totalWords = scriptWords.length;
	const secondsPerWord = audioDurationSeconds / totalWords;
	
	console.log(`Script: ${totalWords} words, ${audioDurationSeconds.toFixed(2)}s audio`);
	console.log(`Speaking rate: ${(totalWords / audioDurationSeconds * 60).toFixed(0)} words/minute`);
	console.log(`Seconds per word: ${secondsPerWord.toFixed(3)}s\n`);
	
	const starts: number[] = [];
	let lastPosition = 0;
	
	for (let i = 0; i < bullets.length; i++) {
		const bullet = bullets[i];
		const keyPhrases = extractKeyPhrases(bullet);
		
		let foundPosition = -1;
		let matchedPhrase = "";
		
		// Try each key phrase
		for (const phrase of keyPhrases) {
			const position = findPhrasePosition(scriptWords, phrase, lastPosition);
			if (position >= 0 && position >= lastPosition) {
				foundPosition = position;
				matchedPhrase = phrase.join(" ");
				break;
			}
		}
		
		// Fallback: if not found after lastPosition, search from beginning
		if (foundPosition < 0) {
			for (const phrase of keyPhrases) {
				const position = findPhrasePosition(scriptWords, phrase, 0);
				if (position >= 0) {
					foundPosition = position;
					matchedPhrase = phrase.join(" ");
					break;
				}
			}
		}
		
		// Calculate time
		let startTime: number;
		if (foundPosition >= 0) {
			startTime = foundPosition * secondsPerWord;
			lastPosition = foundPosition + 1;
			console.log(`Bullet ${i + 1}: Found "${matchedPhrase}" at word ${foundPosition} -> ${startTime.toFixed(2)}s`);
		} else {
			// Fallback: estimate based on position in bullet list
			const estimatedPosition = (i / bullets.length) * totalWords * 0.8; // 80% of script for bullets
			startTime = estimatedPosition * secondsPerWord;
			console.log(`Bullet ${i + 1}: Not found, estimated at ${startTime.toFixed(2)}s`);
		}
		
		starts.push(startTime);
	}
	
	// Ensure starts are monotonically increasing
	for (let i = 1; i < starts.length; i++) {
		if (starts[i] <= starts[i - 1]) {
			starts[i] = starts[i - 1] + 2; // Minimum 2 second gap
		}
	}
	
	return starts;
}

/**
 * Load narration script from file
 */
function loadNarrationScript(courseId: string, moduleNumber: number, slideName: string): string | null {
	// Try to find the script in the course scripts folder
	const scriptPath = path.join(
		__dirname, 
		"../courses", 
		courseId, 
		"course/scripts", 
		`module${String(moduleNumber).padStart(2, "0")}.txt`
	);
	
	if (!fs.existsSync(scriptPath)) {
		return null;
	}
	
	const content = fs.readFileSync(scriptPath, "utf-8");
	
	// Extract the section for this slide
	// Scripts are organized by [CONCEPT], [ARCHITECTURE], [APPLICATION] etc.
	// Get section name from slide name or from slideConfigs
	const sectionMap: Record<string, string> = {
		"module-1-concept": "CONCEPT",
		"module-1-architecture": "ARCHITECTURE",
		"module-1-application": "APPLICATION",
	};
	
	let sectionName = sectionMap[slideName];
	
	// Also check slideConfigs for section name
	if (!sectionName) {
		const config = slideConfigs.find(c => c.name === slideName);
		sectionName = config?.sectionName || null;
	}
	
	if (!sectionName) {
		return null;
	}
	
	// Find the section
	const sectionMarker = `[${sectionName}]`;
	const sectionStart = content.indexOf(sectionMarker);
	if (sectionStart === -1) {
		return null;
	}
	
	// Skip past the section marker
	const contentStart = sectionStart + sectionMarker.length;
	
	// Find the next "---" which marks the end of this section
	const afterSection = content.slice(contentStart);
	const nextDivider = afterSection.indexOf("\n---");
	
	const sectionEnd = nextDivider >= 0 
		? contentStart + nextDivider
		: content.length;
	
	const sectionContent = content.slice(contentStart, sectionEnd).trim();
	return sectionContent;
}

// Manual test
if (require.main === module) {
	const fps = 30;
	const courseId = "agentic-ai-for-beginners";
	const moduleNumber = 1;
	
	console.log("=".repeat(80));
	console.log("CALCULATING BULLET STARTS FROM SCRIPT FOR ALL SLIDES");
	console.log("=".repeat(80));
	
	for (const config of slideConfigs) {
		const script = loadNarrationScript(courseId, moduleNumber, config.name);
		
		if (!script) {
			console.log(`\n[SKIP] ${config.name}: Could not load script`);
			continue;
		}
		
		console.log(`\n${"=".repeat(80)}`);
		console.log(`SLIDE: ${config.name}`);
		console.log(`${"=".repeat(80)}`);
		console.log(`\nScript excerpt: ${script.slice(0, 150)}...\n`);
		
		const audioDuration = config.durationInFrames / fps;
		const starts = calculateBulletStarts(script, config.bullets, audioDuration);
		
		console.log(`\nRESULT for ${config.name}:`);
		console.log(`bulletStarts={[${starts.map(t => t.toFixed(2)).join(", ")}]}`);
	}
	
	console.log("\n" + "=".repeat(80));
	console.log("DONE - Copy these values into Module1.tsx");
	console.log("=".repeat(80));
}
