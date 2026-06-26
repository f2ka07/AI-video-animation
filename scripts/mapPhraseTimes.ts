// Map author bullet points to phrase times in word timings.
// Writes phraseTimes to courses/{courseId}/timings/moduleN.json.
// Run after: extract-timings. Ensures bullet highlights sync with narration.
//
// Usage: npx tsx scripts/mapPhraseTimes.ts [courseId] [moduleRange]
// Example: npx tsx scripts/mapPhraseTimes.ts mastering-firewalls-security-concepts all

import * as fs from "fs";
import * as path from "path";
import { allModules } from "../src/videos/moduleContent";
import { loadModuleTimings, saveModuleTimings } from "./saveTimingsJson";
import { findPhraseTimeWithFallback } from "./utils/wordTimingUtils";
import type { WordTiming } from "./utils/wordTimingUtils";

function parseModuleRange(input: string, courseId: string): number[] {
	const modules = allModules.filter((m) => m.courseId === courseId);
	if (input === "all" || !input) {
		return modules.map((m) => m.moduleNumber);
	}
	if (input.includes("-")) {
		const [a, b] = input.split("-").map(Number);
		return modules
			.filter((m) => m.moduleNumber >= a && m.moduleNumber <= b)
			.map((m) => m.moduleNumber);
	}
	const n = parseInt(input, 10);
	return isNaN(n) ? [] : [n];
}

function main() {
	const courseId = process.argv[2] || "";
	const moduleInput = process.argv[3] || "all";

	if (!courseId) {
		console.error("Usage: npx tsx scripts/mapPhraseTimes.ts <courseId> [moduleRange]");
		console.error("Example: npx tsx scripts/mapPhraseTimes.ts mastering-firewalls-security-concepts all");
		process.exit(1);
	}

	const moduleNumbers = parseModuleRange(moduleInput, courseId);
	if (moduleNumbers.length === 0) {
		console.error("No modules found for course:", courseId);
		process.exit(1);
	}

	console.log(`\nMapping phrase times for ${courseId} (modules ${moduleNumbers.join(", ")})\n`);

	let updated = 0;
	for (const moduleNumber of moduleNumbers) {
		const module = allModules.find(
			(m) => m.courseId === courseId && m.moduleNumber === moduleNumber
		);
		if (!module) continue;

		const data = loadModuleTimings(courseId, moduleNumber, module.title);
		if (!data.slides || Object.keys(data.slides).length === 0) {
			console.log(`  Module ${moduleNumber}: No timings (run extract-timings first)`);
			continue;
		}

		for (const slide of module.slides) {
			const slideType = slide.type;
			if (slideType === "content-single" || slideType === "content-two-card") {
			const points = slide.points || [];
			if (points.length === 0) continue;

			const slideData = data.slides[slide.name];
			if (!slideData?.words?.length) {
				console.log(`  Skip ${slide.name}: no word timings`);
				continue;
			}

			const words = slideData.words as WordTiming[];
			const matchPhrases =
				slide.useManualPoints === true &&
				Array.isArray(slide.keyPhrases) &&
				slide.keyPhrases.length === points.length
					? slide.keyPhrases
					: points;
			const phraseTimes: Array<{ start: number; end: number } | null> = [];
			let minFrom = 0;

			for (const point of matchPhrases) {
					const found = findPhraseTimeWithFallback(words, point, minFrom);
					if (found) {
						phraseTimes.push(found);
						minFrom = found.start + 0.1;
					} else {
						phraseTimes.push(null);
						console.log(`  ${slide.name}: no match for "${point.substring(0, 40)}..."`);
					}
				}

				if (phraseTimes.length === points.length) {
					(data.slides[slide.name] as { words: WordTiming[]; phraseTimes?: unknown }).phraseTimes =
						phraseTimes;
					updated++;
					console.log(`  ${slide.name}: ${phraseTimes.length} phraseTimes`);
				}
				continue;
			}

			if (slideType !== "comparison") continue;

			const leftItems = slide.leftItems || [];
			const rightItems = slide.rightItems || [];
			if (leftItems.length === 0 && rightItems.length === 0) continue;

			const slideData = data.slides[slide.name];
			if (!slideData?.words?.length) {
				console.log(`  Skip ${slide.name}: no word timings`);
				continue;
			}

			const words = slideData.words as WordTiming[];
			const cues = (slide as { comparisonCues?: { left?: string[]; right?: string[] } }).comparisonCues;
			const leftCues = cues?.left?.length === leftItems.length ? cues.left : leftItems;
			const rightCues = cues?.right?.length === rightItems.length ? cues.right : rightItems;

			const mapSide = (items: string[]) => {
				const phraseTimes: Array<{ start: number; end: number } | null> = [];
				for (const phrase of items) {
					const found = findPhraseTimeWithFallback(words, phrase, 0);
					if (found) {
						phraseTimes.push(found);
					} else {
						phraseTimes.push(null);
						console.log(`  ${slide.name}: no match for "${phrase.substring(0, 40)}..."`);
					}
				}
				return phraseTimes;
			};

			const leftPhraseTimes = mapSide(leftCues);
			const rightPhraseTimes = mapSide(rightCues);

			(data.slides[slide.name] as {
				words: WordTiming[];
				leftPhraseTimes?: unknown;
				rightPhraseTimes?: unknown;
			}).leftPhraseTimes = leftPhraseTimes;
			(data.slides[slide.name] as {
				words: WordTiming[];
				leftPhraseTimes?: unknown;
				rightPhraseTimes?: unknown;
			}).rightPhraseTimes = rightPhraseTimes;
			updated++;
			console.log(
				`  ${slide.name}: ${leftPhraseTimes.filter(Boolean).length}/${leftItems.length} left, ${rightPhraseTimes.filter(Boolean).length}/${rightItems.length} right phraseTimes`
			);
		}

		saveModuleTimings(courseId, data);
	}

	console.log(`\nUpdated ${updated} slide(s). Copy timings to public (Activate or Diagram Pipeline) for Remotion.\n`);
}

main();
