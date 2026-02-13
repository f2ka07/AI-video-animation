// Align Module 1 script text with Whisper timings
// This fixes garbage Whisper transcriptions by using the original script text
// while preserving Whisper's timing information (which is usually accurate)

import * as fs from "fs";
import * as path from "path";
import { allModules } from "../src/videos/moduleContent";
import { loadModuleTimings, saveModuleTimings } from "./saveTimingsJson";

interface WordTiming {
	text: string;
	start: number;
	end: number;
}

/**
 * Normalize text for word splitting
 */
function normalizeText(text: string): string {
	return text
		.replace(/[""]/g, '"')
		.replace(/['']/g, "'")
		.replace(/…/g, "...")
		.replace(/—/g, "-")
		.replace(/–/g, "-");
}

/**
 * Split script into words
 */
function splitIntoWords(script: string): string[] {
	const normalized = normalizeText(script);
	const words: string[] = [];
	const tokens = normalized.match(/\S+/g) || [];

	for (const token of tokens) {
		// Handle punctuation at word boundaries
		const wordMatch = token.match(/^([\w'-]+)([.,!?;:])?$/i);
		if (wordMatch) {
			words.push(wordMatch[1].toLowerCase());
			// Optionally add punctuation as separate word
		} else {
			// Fallback: clean and add
			const cleaned = token.replace(/[^\w'-]/g, '').toLowerCase();
			if (cleaned.length > 0) {
				words.push(cleaned);
			}
		}
	}

	return words.filter((w) => w.length > 0);
}

/**
 * Align script words with Whisper timings proportionally
 * Even if Whisper text is garbage, the timings are usually accurate
 */
function alignWords(
	scriptWords: string[],
	whisperTimings: WordTiming[]
): WordTiming[] {
	if (whisperTimings.length === 0) {
		return [];
	}

	if (scriptWords.length === 0) {
		return whisperTimings;
	}

	// Get total duration from Whisper (this is usually accurate)
	const totalDuration = whisperTimings[whisperTimings.length - 1].end;

	// If counts are similar, do 1:1 mapping
	if (Math.abs(scriptWords.length - whisperTimings.length) <= 3) {
		const aligned: WordTiming[] = [];
		const maxLen = Math.max(scriptWords.length, whisperTimings.length);

		for (let i = 0; i < maxLen; i++) {
			const scriptWord = scriptWords[i] || scriptWords[scriptWords.length - 1];
			const whisperTiming =
				whisperTimings[i] || whisperTimings[whisperTimings.length - 1];

			aligned.push({
				text: scriptWord,
				start: whisperTiming.start,
				end: whisperTiming.end,
			});
		}

		return aligned;
	}

	// Otherwise, distribute script words proportionally across Whisper timings
	const aligned: WordTiming[] = [];
	const scriptWordCount = scriptWords.length;
	const whisperCount = whisperTimings.length;

	// Calculate timing intervals from Whisper
	const intervals: Array<{ start: number; end: number; duration: number }> = [];
	for (let i = 0; i < whisperTimings.length; i++) {
		const timing = whisperTimings[i];
		intervals.push({
			start: timing.start,
			end: timing.end,
			duration: timing.end - timing.start,
		});
	}

	// Distribute script words proportionally
	let scriptIndex = 0;

	for (let i = 0; i < intervals.length && scriptIndex < scriptWords.length; i++) {
		const interval = intervals[i];

		// Calculate how many script words should fit in this interval
		const remainingScriptWords = scriptWords.length - scriptIndex;
		const remainingIntervals = intervals.length - i;
		const wordsPerInterval = remainingScriptWords / remainingIntervals;

		const wordsInThisInterval = Math.ceil(wordsPerInterval);
		const actualWords = Math.min(wordsInThisInterval, remainingScriptWords);

		// Distribute words evenly within this interval
		for (let j = 0; j < actualWords && scriptIndex < scriptWords.length; j++) {
			const intervalDuration = interval.end - interval.start;
			const wordStart = interval.start + (intervalDuration * j) / actualWords;
			const wordEnd =
				interval.start + (intervalDuration * (j + 1)) / actualWords;

			aligned.push({
				text: scriptWords[scriptIndex],
				start: wordStart,
				end: wordEnd,
			});

			scriptIndex++;
		}
	}

	// Handle any remaining script words
	if (scriptIndex < scriptWords.length) {
		const lastTiming = whisperTimings[whisperTimings.length - 1];
		const remainingWords = scriptWords.length - scriptIndex;
		const extraDuration = 0.1; // Small duration for extra words

		for (let i = scriptIndex; i < scriptWords.length; i++) {
			aligned.push({
				text: scriptWords[i],
				start: lastTiming.end + (i - scriptIndex) * extraDuration,
				end: lastTiming.end + (i - scriptIndex + 1) * extraDuration,
			});
		}
	}

	return aligned;
}

/**
 * Align timings for Module 1
 */
async function alignModule1Timings() {
	const courseId = "agentic-ai-for-beginners";
	const moduleNumber = 1;

	console.log(
		`\nAligning Module 1 script text with Whisper timings...\n`
	);
	console.log(
		"This will replace garbage Whisper text with your original script text"
	);
	console.log("while preserving Whisper's timing information.\n");

	// Find Module 1
	const module1 = allModules.find(
		(m) => m.moduleNumber === 1 && m.courseId === courseId
	);

	if (!module1) {
		console.error(`Module 1 not found for course: ${courseId}`);
		process.exit(1);
	}

	// Load existing timings (with garbage Whisper text)
	const timings = loadModuleTimings(courseId, moduleNumber, module1.title);

	if (!timings.slides || Object.keys(timings.slides).length === 0) {
		console.error(
			"❌ No timings found. Run 'npm run extract-module1-timings' first to get Whisper timings."
		);
		process.exit(1);
	}

	console.log(`Found ${Object.keys(timings.slides).length} slides with timings\n`);

	let totalAligned = 0;

	// Process each slide
	for (const slide of module1.slides) {
		console.log(`Processing: ${slide.name}`);

		if (!slide.script || slide.script.trim().length === 0) {
			console.log(`  ⚠ Skipping: no script text\n`);
			continue;
		}

		const whisperTimings = timings.slides[slide.name]?.words;
		if (!whisperTimings || whisperTimings.length === 0) {
			console.log(`  ⚠ Skipping: no Whisper timings found\n`);
			continue;
		}

		// Split script into words
		const scriptWords = splitIntoWords(slide.script);
		console.log(`  Script words: ${scriptWords.length}`);
		console.log(`  Whisper words: ${whisperTimings.length}`);

		// Show first few Whisper words (to see the garbage)
		const firstWhisperWords = whisperTimings
			.slice(0, 5)
			.map((w) => w.text)
			.join(" ");
		console.log(`  Whisper text (garbage): "${firstWhisperWords}..."`);

		// Align words
		const alignedTimings = alignWords(scriptWords, whisperTimings);

		// Update timings
		timings.slides[slide.name].words = alignedTimings;
		saveModuleTimings(courseId, timings);

		// Show first few aligned words (should be correct now)
		const firstAlignedWords = alignedTimings
			.slice(0, 5)
			.map((w) => w.text)
			.join(" ");
		console.log(`  Aligned text (correct): "${firstAlignedWords}..."`);
		console.log(
			`  ✓ Aligned ${alignedTimings.length} words, duration: ${alignedTimings[alignedTimings.length - 1].end.toFixed(2)}s\n`
		);

		totalAligned++;
	}

	console.log(`\n✅ Alignment complete!`);
	console.log(`   Aligned ${totalAligned} slide(s)`);
	console.log(
		`\nTimings saved to: courses/${courseId}/timings/module${moduleNumber}.json`
	);
	console.log(
		"\nNext steps:"
	);
	console.log("  1. Review the aligned timings in the JSON file");
	console.log("  2. Test animations in Remotion studio");
	console.log("  3. Fine-tune if needed");
}

alignModule1Timings().catch(console.error);
