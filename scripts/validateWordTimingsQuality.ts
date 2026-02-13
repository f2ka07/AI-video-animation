// Validate word timings quality - detect Whisper transcription issues
// Checks for duplicate timestamps, zero durations, unrealistic durations, etc.
// Usage: npx tsx scripts/validateWordTimingsQuality.ts [moduleNumber] [courseId]

import * as fs from "fs";
import * as path from "path";
import { loadModuleTimings, ModuleTimings } from "./saveTimingsJson";

interface ValidationIssue {
	type: "duplicate_timestamp" | "zero_duration" | "unrealistic_duration" | "backwards_time" | "gap_too_large";
	slideName: string;
	wordIndex: number;
	word: string;
	start: number;
	end: number;
	message: string;
}

export interface SlideValidation {
	slideName: string;
	issues: ValidationIssue[];
	totalWords: number;
	duplicateCount: number;
	zeroDurationCount: number;
	unrealisticDurationCount: number;
	backwardsTimeCount: number;
	qualityScore: number;
}

export function validateSlideTimings(slideName: string, words: Array<{ text: string; start: number; end: number }>): SlideValidation {
	const issues: ValidationIssue[] = [];
	let duplicateCount = 0;
	let zeroDurationCount = 0;
	let unrealisticDurationCount = 0;
	let backwardsTimeCount = 0;

	for (let i = 0; i < words.length; i++) {
		const word = words[i];
		const duration = word.end - word.start;

		// Check for zero or negative duration
		if (duration <= 0) {
			issues.push({
				type: "zero_duration",
				slideName,
				wordIndex: i,
				word: word.text,
				start: word.start,
				end: word.end,
				message: `Zero or negative duration: ${duration.toFixed(4)}s`,
			});
			zeroDurationCount++;
		}

		// Check for backwards time (end before start)
		if (word.end < word.start) {
			issues.push({
				type: "backwards_time",
				slideName,
				wordIndex: i,
				word: word.text,
				start: word.start,
				end: word.end,
				message: `End time (${word.end}) is before start time (${word.start})`,
			});
			backwardsTimeCount++;
		}

		// Check for unrealistic duration (too long for a single word)
		if (duration > 3.0) {
			issues.push({
				type: "unrealistic_duration",
				slideName,
				wordIndex: i,
				word: word.text,
				start: word.start,
				end: word.end,
				message: `Unrealistic duration: ${duration.toFixed(2)}s for word "${word.text}"`,
			});
			unrealisticDurationCount++;
		}

		// Check for duplicate timestamps (same start/end as previous word)
		if (i > 0) {
			const prevWord = words[i - 1];
			if (Math.abs(word.start - prevWord.start) < 0.001 && Math.abs(word.end - prevWord.end) < 0.001) {
				issues.push({
					type: "duplicate_timestamp",
					slideName,
					wordIndex: i,
					word: word.text,
					start: word.start,
					end: word.end,
					message: `Duplicate timestamp with previous word "${prevWord.text}" (${word.start.toFixed(3)}s)`,
				});
				duplicateCount++;
			}
		}

		// Check for large gaps (missing words)
		if (i > 0) {
			const prevWord = words[i - 1];
			const gap = word.start - prevWord.end;
			if (gap > 2.0) {
				issues.push({
					type: "gap_too_large",
					slideName,
					wordIndex: i,
					word: word.text,
					start: word.start,
					end: word.end,
					message: `Large gap: ${gap.toFixed(2)}s between "${prevWord.text}" and "${word.text}"`,
				});
			}
		}
	}

	// Calculate quality score (0-100)
	const totalIssues = issues.length;
	const qualityScore = Math.max(0, 100 - (totalIssues / words.length) * 100);

	return {
		slideName,
		issues,
		totalWords: words.length,
		duplicateCount,
		zeroDurationCount,
		unrealisticDurationCount,
		backwardsTimeCount,
		qualityScore,
	};
}

function validateModule(courseId: string, moduleNumber: number): void {
	console.log(`\n🔍 Validating word timings for ${courseId} - Module ${moduleNumber}...\n`);

	const timings = loadModuleTimings(courseId, moduleNumber);
	if (!timings) {
		console.error(`❌ No timings found for module ${moduleNumber}`);
		return;
	}

	const slideValidations: SlideValidation[] = [];
	let totalIssues = 0;
	let totalWords = 0;

	for (const [slideName, slideData] of Object.entries(timings.slides)) {
		if (!slideData.words || slideData.words.length === 0) {
			console.log(`⚠ Skipping ${slideName}: no words found`);
			continue;
		}

		const validation = validateSlideTimings(slideName, slideData.words);
		slideValidations.push(validation);
		totalIssues += validation.issues.length;
		totalWords += validation.totalWords;
	}

	// Print summary
	console.log("=".repeat(80));
	console.log("VALIDATION SUMMARY");
	console.log("=".repeat(80));
	console.log(`Total slides: ${slideValidations.length}`);
	console.log(`Total words: ${totalWords}`);
	console.log(`Total issues: ${totalIssues}`);
	console.log(`Overall quality: ${((totalWords - totalIssues) / totalWords * 100).toFixed(1)}%\n`);

	// Print per-slide details
	for (const validation of slideValidations) {
		if (validation.issues.length === 0) {
			console.log(`✅ ${validation.slideName}: ${validation.totalWords} words, quality score: ${validation.qualityScore.toFixed(1)}%`);
		} else {
			console.log(`\n❌ ${validation.slideName}: ${validation.issues.length} issues (${validation.qualityScore.toFixed(1)}% quality)`);
			console.log(`   Total words: ${validation.totalWords}`);
			console.log(`   - Duplicate timestamps: ${validation.duplicateCount}`);
			console.log(`   - Zero duration: ${validation.zeroDurationCount}`);
			console.log(`   - Unrealistic duration (>3s): ${validation.unrealisticDurationCount}`);
			console.log(`   - Backwards time: ${validation.backwardsTimeCount}`);

			// Show first 10 issues
			const sampleIssues = validation.issues.slice(0, 10);
			console.log(`\n   Sample issues:`);
			for (const issue of sampleIssues) {
				console.log(`   [${issue.type}] Word ${issue.wordIndex}: "${issue.word}" - ${issue.message}`);
			}
			if (validation.issues.length > 10) {
				console.log(`   ... and ${validation.issues.length - 10} more issues`);
			}
		}
	}

	// Recommendations
	console.log("\n" + "=".repeat(80));
	console.log("RECOMMENDATIONS");
	console.log("=".repeat(80));

	const problematicSlides = slideValidations.filter(v => v.issues.length > v.totalWords * 0.1);
	if (problematicSlides.length > 0) {
		console.log(`\n⚠ ${problematicSlides.length} slide(s) have significant timing issues (>10% of words):`);
		for (const slide of problematicSlides) {
			console.log(`   - ${slide.slideName}: ${slide.issues.length} issues (${(slide.issues.length / slide.totalWords * 100).toFixed(1)}% of words)`);
		}
		console.log("\n💡 Options to fix:");
		console.log("   1. Re-run Whisper API with better audio quality");
		console.log("   2. Use alignScriptWithTimings.ts to align with original script text");
		console.log("   3. Manually correct timings in the JSON file");
		console.log("   4. Try a different transcription service (e.g., Google Speech-to-Text)");
	} else {
		console.log("\n✅ All slides have acceptable timing quality (<10% issues)");
	}
}

// Main
if (require.main === module) {
	const moduleNumber = process.argv[2] ? parseInt(process.argv[2]) : 1;
	const courseId = process.argv[3] || "agentic-ai-for-beginners";
	validateModule(courseId, moduleNumber);
}
