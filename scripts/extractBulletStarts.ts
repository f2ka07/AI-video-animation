// Extract 5 bullet start times from word timings
// Searches for "first", "second", "third", "fourth", "fifth" markers
// Or key phrases from bullet content if markers don't exist
// Usage: npx tsx scripts/extractBulletStarts.ts [moduleNumber] [courseId] [slideName]

import * as fs from "fs";
import * as path from "path";
import { loadModuleTimings, ModuleTimings } from "./saveTimingsJson";

interface WordTiming {
	text: string;
	start: number;
	end: number;
}

interface BulletConfig {
	slideName: string;
	points: string[];
	searchStrategy: "ordinal" | "keywords";
	keywords?: string[][]; // Keywords for each bullet if not using ordinals
}

// Known bullet configurations for Module 1
const module1BulletConfigs: Record<string, BulletConfig> = {
	"module-1-concept": {
		slideName: "module-1-concept",
		points: [
			"Single-call inference: input in, output out, interaction ends",
			"No memory between interactions",
			"Cannot plan across multiple steps or use external tools",
			"Cannot verify outputs or adapt based on feedback",
			"Agentic AI: a system architecture that executes workflows",
		],
		searchStrategy: "keywords",
		keywords: [
			["single-call", "inference"], // Bullet 1: "Single-call inference..."
			["no", "memory", "between"], // Bullet 2: "No memory between interactions"
			["cannot", "plan", "multiple", "steps"], // Bullet 3: "Cannot plan across multiple steps..."
			["cannot", "verify", "outputs"], // Bullet 4: "Cannot verify outputs..."
			["agentic", "ai", "system", "architecture"], // Bullet 5: "Agentic AI: a system architecture..."
		],
	},
	"module-1-architecture": {
		slideName: "module-1-architecture",
		points: [
			"First, planning - decompose goals into subtasks",
			"Second, tools - APIs, code, search engines",
			"Third, memory - short-term and long-term retention",
			"Fourth, safety loops - guardrails and policy checks",
			"Fifth, human-in-the-loop - escalation and oversight",
		],
		searchStrategy: "ordinal",
	},
	"module-1-application": {
		slideName: "module-1-application",
		points: [
			"First, reliability - checkpoints, retries, and verification steps",
			"Second, traceability - audit trails for compliance",
			"Third, integration - connect to CRMs, ERPs, data warehouses",
			"Fourth, first-class tool integration - treats external tools as first-class citizens",
			"Fifth, new category of AI workload - executes workflows and manages processes",
		],
		searchStrategy: "ordinal",
		keywords: [
			["first", "reliability"],
			["second", "traceability"],
			["third", "integration"],
			["fourth", "first-class", "tool", "integration"], // Fallback if "fourth" missing
			["fifth", "new", "category", "ai", "workload"], // Fallback if "fifth" missing
		],
	},
};

function findOrdinalMarker(words: WordTiming[], ordinal: "first" | "second" | "third" | "fourth" | "fifth"): number | null {
	for (const word of words) {
		if (word.text.toLowerCase() === ordinal) {
			return word.start;
		}
	}
	return null;
}

function findKeywords(words: WordTiming[], keywords: string[]): number | null {
	// Find the first occurrence where keywords appear in sequence (allowing gaps)
	const keywordLower = keywords.map(k => k.toLowerCase());
	
	// Try to find sequence of keywords
	for (let i = 0; i < words.length; i++) {
		let keywordIndex = 0;
		let foundStart: number | null = null;
		
		// Look for keywords in sequence starting from position i
		for (let j = i; j < words.length && keywordIndex < keywordLower.length; j++) {
			const wordLower = words[j].text.toLowerCase();
			
			// Check if this word matches current keyword (or is a partial match)
			if (wordLower === keywordLower[keywordIndex] || 
			    wordLower.includes(keywordLower[keywordIndex]) ||
			    keywordLower[keywordIndex].includes(wordLower)) {
				if (keywordIndex === 0) {
					foundStart = words[j].start;
				}
				keywordIndex++;
			}
			
			// If we've found enough keywords in a reasonable window (5 seconds), return
			if (foundStart !== null && words[j].start - foundStart > 5.0) {
				break;
			}
		}
		
		// If we found at least 2 keywords in sequence, return the start
		if (foundStart !== null && keywordIndex >= Math.min(2, keywords.length)) {
			return foundStart;
		}
	}
	
	// Fallback: find first occurrence of any keyword
	const keywordSet = new Set(keywords.map(k => k.toLowerCase()));
	for (const word of words) {
		if (keywordSet.has(word.text.toLowerCase())) {
			return word.start;
		}
	}
	
	return null;
}

function extractBulletStarts(
	words: WordTiming[],
	config: BulletConfig
): number[] {
	const starts: number[] = [];

	if (config.searchStrategy === "ordinal") {
		// Search for "first", "second", "third", "fourth", "fifth"
		const ordinals: Array<"first" | "second" | "third" | "fourth" | "fifth"> = [
			"first",
			"second",
			"third",
			"fourth",
			"fifth",
		];

		for (let i = 0; i < ordinals.length; i++) {
			const ordinal = ordinals[i];
			let time = findOrdinalMarker(words, ordinal);
			
			// Fallback to keywords if ordinal not found
			if (time === null && config.keywords && config.keywords[i]) {
				console.warn(`⚠ Could not find "${ordinal}" marker, trying keywords...`);
				time = findKeywords(words, config.keywords[i]);
			}
			
			if (time !== null) {
				starts.push(time);
			} else {
				console.warn(`⚠ Could not find "${ordinal}" marker or keywords for bullet ${i + 1} in ${config.slideName}`);
			}
		}
	} else if (config.searchStrategy === "keywords" && config.keywords) {
		// Search for keywords from each bullet
		for (let i = 0; i < config.keywords.length; i++) {
			const keywords = config.keywords[i];
			const time = findKeywords(words, keywords);
			if (time !== null) {
				starts.push(time);
			} else {
				console.warn(
					`⚠ Could not find keywords for bullet ${i + 1} in ${config.slideName}: ${keywords.join(", ")}`
				);
			}
		}
	}

	return starts;
}

function extractModuleBulletStarts(courseId: string, moduleNumber: number, slideName?: string): void {
	console.log(`\n🔍 Extracting bullet start times for ${courseId} - Module ${moduleNumber}...\n`);

	const timings = loadModuleTimings(courseId, moduleNumber);
	if (!timings) {
		console.error(`❌ No timings found for module ${moduleNumber}`);
		return;
	}

	const slidesToProcess = slideName
		? [slideName]
		: Object.keys(timings.slides).filter(name => module1BulletConfigs[name]);

	if (slidesToProcess.length === 0) {
		console.error(`❌ No slides found to process`);
		return;
	}

	console.log("=".repeat(80));
	console.log("BULLET START TIMES");
	console.log("=".repeat(80));

	for (const slideName of slidesToProcess) {
		const slideData = timings.slides[slideName];
		if (!slideData || !slideData.words || slideData.words.length === 0) {
			console.log(`\n⚠ ${slideName}: No word timings found`);
			continue;
		}

		const config = module1BulletConfigs[slideName];
		if (!config) {
			console.log(`\n⚠ ${slideName}: No bullet configuration found`);
			continue;
		}

		const bulletStarts = extractBulletStarts(slideData.words, config);

		console.log(`\n📌 ${slideName}:`);
		console.log(`   Found ${bulletStarts.length} bullet start times:`);
		console.log(`   bulletStarts = [${bulletStarts.map(t => t.toFixed(2)).join(", ")}]`);

		if (bulletStarts.length !== 5) {
			console.warn(`   ⚠ Expected 5 bullets, found ${bulletStarts.length}`);
		}

		// Show bullet points with their timings
		console.log(`\n   Bullets:`);
		for (let i = 0; i < Math.min(bulletStarts.length, config.points.length); i++) {
			console.log(`   ${i + 1}. [${bulletStarts[i].toFixed(2)}s] ${config.points[i]}`);
		}

		// Generate code snippet
		console.log(`\n   Code snippet for Module1.tsx:`);
		console.log(`   bulletStarts={[${bulletStarts.map(t => t.toFixed(2)).join(", ")}]}`);
	}
}

// Main
const moduleNumber = process.argv[2] ? parseInt(process.argv[2]) : 1;
const courseId = process.argv[3] || "agentic-ai-for-beginners";
const slideName = process.argv[4];

extractModuleBulletStarts(courseId, moduleNumber, slideName);
