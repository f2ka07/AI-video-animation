/**
 * Helper script to generate SVG element mappings from word timings
 * 
 * Usage:
 *   npm run generate-svg-mappings -- --module 1 --slide "agentic-architecture" --diagram "agentic-architecture-high-level"
 * 
 * This will:
 * 1. Load the module timings JSON
 * 2. Search for trigger words in the narration
 * 3. Generate word range mappings for each SVG element
 * 4. Output TypeScript code you can paste into svgElementMappings.ts
 */

import * as fs from "fs";
import * as path from "path";

interface WordTiming {
	text: string;
	start: number;
	end: number;
}

interface ModuleTimings {
	moduleNumber: number;
	title: string;
	slides: Record<
		string,
		{
			words: WordTiming[];
		}
	>;
}

interface SvgElementMapping {
	elementId: string;
	wordRange: [number, number];
	animationType: string;
	emphasis?: string;
	triggerWords?: string[];
	animationDelay?: number;
}

function findWordRanges(
	words: WordTiming[],
	triggerWords: string[]
): [number, number] | null {
	let startIdx = -1;
	let endIdx = -1;

	for (let i = 0; i < words.length; i++) {
		const wordText = words[i].text.toLowerCase().trim();
		const matchesTrigger = triggerWords.some((trigger) =>
			wordText.includes(trigger.toLowerCase())
		);

		if (matchesTrigger) {
			if (startIdx === -1) {
				startIdx = i;
			}
			endIdx = i;
		}
	}

	if (startIdx === -1) {
		return null;
	}

	// Extend range to include context
	startIdx = Math.max(0, startIdx - 2); // 2 words before
	endIdx = Math.min(words.length - 1, endIdx + 5); // 5 words after

	return [startIdx, endIdx];
}

function generateMappings(
	moduleNumber: number,
	slideName: string,
	diagramName: string,
	elementConfigs: Array<{
		elementId: string;
		triggerWords: string[];
		animationType?: string;
		emphasis?: string;
	}>
): void {
	// Load timings
	const timingsPath = path.join(
		__dirname,
		"..",
		"courses",
		"agentic-ai-for-beginners",
		"timings",
		`module${moduleNumber}.json`
	);

	if (!fs.existsSync(timingsPath)) {
		console.error(`Timings file not found: ${timingsPath}`);
		process.exit(1);
	}

	const timingsData: ModuleTimings = JSON.parse(
		fs.readFileSync(timingsPath, "utf-8")
	);

	const slideData = timingsData.slides[slideName];
	if (!slideData) {
		console.error(`Slide "${slideName}" not found in timings`);
		console.log("Available slides:", Object.keys(timingsData.slides));
		process.exit(1);
	}

	const words = slideData.words;

	console.log(`\nGenerating mappings for: ${diagramName}`);
	console.log(`Slide: ${slideName}`);
	console.log(`Total words: ${words.length}\n`);

	const mappings: SvgElementMapping[] = [];

	for (const config of elementConfigs) {
		const wordRange = findWordRanges(words, config.triggerWords);

		if (!wordRange) {
			console.warn(
				`⚠️  No matches found for "${config.elementId}" with triggers: ${config.triggerWords.join(", ")}`
			);
			continue;
		}

		const [startIdx, endIdx] = wordRange;
		const startWord = words[startIdx];
		const endWord = words[endIdx];

		console.log(`✅ ${config.elementId}:`);
		console.log(`   Word range: [${startIdx}, ${endIdx}]`);
		console.log(
			`   Time range: ${startWord.start.toFixed(2)}s - ${endWord.end.toFixed(2)}s`
		);
		console.log(
			`   Text snippet: "${words
				.slice(startIdx, Math.min(startIdx + 5, endIdx))
				.map((w) => w.text)
				.join(" ")}..."`
		);
		console.log("");

		mappings.push({
			elementId: config.elementId,
			wordRange,
			animationType: config.animationType || "reveal",
			emphasis: config.emphasis || "medium",
			triggerWords: config.triggerWords,
		});
	}

	// Generate TypeScript code
	console.log("\n" + "=".repeat(80));
	console.log("COPY THIS INTO svgElementMappings.ts:\n");
	console.log(`"${diagramName}": [`);

	for (const mapping of mappings) {
		console.log("  {");
		console.log(`    elementId: "${mapping.elementId}",`);
		console.log(`    wordRange: [${mapping.wordRange[0]}, ${mapping.wordRange[1]}],`);
		console.log(`    animationType: "${mapping.animationType}",`);
		if (mapping.emphasis) {
			console.log(`    emphasis: "${mapping.emphasis}",`);
		}
		if (mapping.triggerWords) {
			console.log(
				`    triggerWords: [${mapping.triggerWords.map((t) => `"${t}"`).join(", ")}],`
			);
		}
		console.log("  },");
	}

	console.log("],");
	console.log("\n" + "=".repeat(80));
}

// Example usage - customize for your diagrams
if (require.main === module) {
	const args = process.argv.slice(2);
	const moduleArg = args.find((a) => a.startsWith("--module"));
	const slideArg = args.find((a) => a.startsWith("--slide"));
	const diagramArg = args.find((a) => a.startsWith("--diagram"));

	if (!moduleArg || !slideArg || !diagramArg) {
		console.log(`
Usage:
  npm run generate-svg-mappings -- --module 1 --slide "slide-name" --diagram "diagram-name"

Example:
  npm run generate-svg-mappings -- --module 1 --slide "agentic-architecture-high-level" --diagram "agentic-architecture-high-level"
		`);
		process.exit(1);
	}

	const moduleNumber = parseInt(moduleArg.split("=")[1]);
	const slideName = slideArg.split("=")[1];
	const diagramName = diagramArg.split("=")[1];

	// Define your SVG elements and their trigger words
	// Customize this for each diagram
	const elementConfigs = [
		{
			elementId: "planner",
			triggerWords: ["planning", "planner", "first", "goal", "decomposition"],
			animationType: "reveal",
			emphasis: "strong" as const,
		},
		{
			elementId: "tools",
			triggerWords: ["tools", "second", "APIs", "code", "search", "retrieval"],
			animationType: "highlight",
			emphasis: "strong" as const,
		},
		{
			elementId: "memory",
			triggerWords: ["memory", "third", "short-term", "long-term", "persists"],
			animationType: "reveal",
			emphasis: "medium" as const,
		},
		{
			elementId: "environment",
			triggerWords: [
				"fourth",
				"environment",
				"safety",
				"guardrails",
				"policy",
			],
			animationType: "reveal",
			emphasis: "strong" as const,
		},
		{
			elementId: "evaluator",
			triggerWords: [
				"fifth",
				"evaluator",
				"LLM",
				"reasoning",
				"human-in-the-loop",
			],
			animationType: "zoom",
			emphasis: "strong" as const,
		},
	];

	generateMappings(moduleNumber, slideName, diagramName, elementConfigs);
}

export { generateMappings, findWordRanges };
