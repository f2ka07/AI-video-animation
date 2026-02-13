// Fix common Whisper word timing issues:
// - Duplicate timestamps (multiple words with same start/end)
// - Zero duration words (start === end)
// - Unrealistic durations (too long or too short)
// - Large gaps between words
//
// Usage: npx tsx scripts/fixWordTimingsIssues.ts [moduleNumber] [courseId] [--dry-run]

import * as fs from "fs";
import * as path from "path";
import { loadModuleTimings, saveModuleTimings, ModuleTimings } from "./saveTimingsJson";

interface WordTiming {
	text: string;
	start: number;
	end: number;
}

function fixWordTimings(words: WordTiming[]): WordTiming[] {
	if (words.length === 0) return words;

	const fixed: WordTiming[] = [];
	let lastValidEnd = 0;

	for (let i = 0; i < words.length; i++) {
		const word = words[i];
		const duration = word.end - word.start;

		// Detect issues
		const hasZeroDuration = duration <= 0;
		const hasDuplicateTimestamp = i > 0 && Math.abs(word.start - words[i - 1].start) < 0.001;
		const hasUnrealisticDuration = duration > 3.0;
		const hasLargeGap = i > 0 && (word.start - lastValidEnd) > 2.0;

		// Fix strategy: interpolate timings for problematic words
		if (hasZeroDuration || hasDuplicateTimestamp || hasUnrealisticDuration) {
			// Find the next valid word to interpolate between
			let nextValidIndex = i + 1;
			while (nextValidIndex < words.length) {
				const nextWord = words[nextValidIndex];
				const nextDuration = nextWord.end - nextWord.start;
				if (nextDuration > 0 && nextDuration <= 3.0 && nextWord.start > word.start) {
					break;
				}
				nextValidIndex++;
			}

			// Calculate interpolated timing
			const startTime = lastValidEnd > 0 ? lastValidEnd : word.start;
			let endTime: number;

			if (nextValidIndex < words.length) {
				// Interpolate between lastValidEnd and nextValidWord.start
				const wordsToFill = nextValidIndex - i;
				const timeSpan = words[nextValidIndex].start - startTime;
				const avgDuration = Math.min(0.3, timeSpan / (wordsToFill + 1));
				endTime = startTime + avgDuration;
			} else {
				// Use average word duration (0.3s) or maintain original if reasonable
				endTime = startTime + Math.min(0.3, duration > 0 ? duration : 0.3);
			}

			fixed.push({
				text: word.text,
				start: startTime,
				end: endTime,
			});

			lastValidEnd = endTime;
		} else {
			// Word is fine, use as-is
			fixed.push(word);
			lastValidEnd = word.end;
		}
	}

	// Second pass: ensure monotonic progression
	for (let i = 1; i < fixed.length; i++) {
		if (fixed[i].start < fixed[i - 1].end) {
			fixed[i].start = fixed[i - 1].end;
		}
		if (fixed[i].end <= fixed[i].start) {
			fixed[i].end = fixed[i].start + 0.1;
		}
	}

	return fixed;
}

function fixModuleTimings(courseId: string, moduleNumber: number, dryRun: boolean = false): void {
	console.log(`\n${dryRun ? "🔍 [DRY RUN] Analyzing" : "🔧 Fixing"} word timings for ${courseId} - Module ${moduleNumber}...\n`);

	const timings = loadModuleTimings(courseId, moduleNumber);
	if (!timings) {
		console.error(`❌ No timings found for module ${moduleNumber}`);
		return;
	}

	const fixedTimings: ModuleTimings = {
		...timings,
		slides: {},
	};

	let totalFixed = 0;
	let totalWords = 0;

	for (const [slideName, slideData] of Object.entries(timings.slides)) {
		if (!slideData.words || slideData.words.length === 0) {
			fixedTimings.slides[slideName] = slideData;
			continue;
		}

		const originalWords = slideData.words;
		const fixedWords = fixWordTimings(originalWords);

		// Count fixes
		let fixes = 0;
		for (let i = 0; i < originalWords.length; i++) {
			const orig = originalWords[i];
			const fixed = fixedWords[i];
			if (Math.abs(orig.start - fixed.start) > 0.001 || Math.abs(orig.end - fixed.end) > 0.001) {
				fixes++;
			}
		}

		if (fixes > 0) {
			console.log(`${dryRun ? "Would fix" : "Fixed"} ${slideName}: ${fixes} words corrected (${originalWords.length} total)`);
			totalFixed += fixes;
		} else {
			console.log(`✓ ${slideName}: No issues found (${originalWords.length} words)`);
		}

		totalWords += originalWords.length;
		fixedTimings.slides[slideName] = { words: fixedWords };
	}

	console.log(`\n${"=".repeat(80)}`);
	console.log(`${dryRun ? "ANALYSIS" : "FIX"} SUMMARY`);
	console.log(`${"=".repeat(80)}`);
	console.log(`Total words: ${totalWords}`);
	console.log(`${dryRun ? "Issues found" : "Words fixed"}: ${totalFixed} (${((totalFixed / totalWords) * 100).toFixed(1)}%)`);

	if (!dryRun && totalFixed > 0) {
		saveModuleTimings(courseId, fixedTimings);
		console.log(`\n✅ Fixed timings saved to: courses/${courseId}/timings/module${moduleNumber}.json`);
	} else if (dryRun) {
		console.log(`\n💡 Run without --dry-run to apply fixes`);
	} else {
		console.log(`\n✅ No fixes needed - timings are already good!`);
	}
}

// Main
const args = process.argv.slice(2);
const moduleNumber = args[0] ? parseInt(args[0]) : 1;
const courseId = args[1] || "agentic-ai-for-beginners";
const dryRun = args.includes("--dry-run");

fixModuleTimings(courseId, moduleNumber, dryRun);
