// Derive splitAt boundaries from script + word timings.
// Breaks the circular dependency: boundaries come from content, not from phraseTimes.
//
// Run after: extract-timings
// Run before: derive-bullets, sync-slide-splits
//
// Pipeline: extract-timings -> derive-boundaries-from-script -> derive-bullets -> sync-slide-splits

import * as fs from "fs";
import * as path from "path";
import { loadTimings, findAllPhraseOccurrences } from "./utils/wordTimingUtils";
import type { WordTiming } from "./utils/wordTimingUtils";
import { getAudioDuration } from "../src/utils/audioDuration";

/**
 * Extract topic-introducing phrases from script.
 * Focus on "The X" for key concepts and key nouns - avoid generic "The X" (too noisy).
 */
function extractTopicPhrases(script: string): string[] {
	const phrases: string[] = [];
	const seen = new Set<string>();
	const add = (p: string) => {
		const norm = p.trim().toLowerCase();
		if (norm.length >= 3 && !seen.has(norm)) {
			seen.add(norm);
			phrases.push(p.trim());
		}
	};

	// 1. "The X" only for known topic nouns (planner, executor, router, orchestrator)
	const topicNouns = ["planner", "executor", "router", "orchestrator"];
	for (const noun of topicNouns) {
		if (script.toLowerCase().includes("the " + noun)) {
			add("The " + noun);
		}
	}

	// 2. Key nouns that introduce sub-topics (minimal set to avoid noise)
	const keyNouns = ["RAG", "retries", "lives"];
	for (const noun of keyNouns) {
		if (script.toLowerCase().includes(noun.toLowerCase())) {
			add(noun);
		}
	}

	return phrases;
}

const MIN_GAP_SEC = 4;

/**
 * Collect all candidate boundary timestamps from phrases in words.
 * Returns sorted unique timestamps. Applies minimum gap to avoid intro clustering.
 */
function collectCandidateTimestamps(
	words: WordTiming[],
	phrases: string[],
	slideDuration: number
): number[] {
	const timestamps: number[] = [];

	for (const phrase of phrases) {
		const occurrences = findAllPhraseOccurrences(words, phrase, true);
		for (const occ of occurrences) {
			if (occ.startTime > 0) timestamps.push(occ.startTime);
		}
	}

	// Add last word end time for final boundary
	const lastWord = [...words].reverse().find((w) => (w?.end ?? 0) > 0);
	if (lastWord?.end) timestamps.push(lastWord.end);

	// Sort and deduplicate (within 0.3s)
	timestamps.sort((a, b) => a - b);
	const deduped: number[] = [];
	for (const t of timestamps) {
		if (deduped.length === 0 || t - deduped[deduped.length - 1] > 0.3) {
			deduped.push(t);
		}
	}

	// Apply minimum gap to avoid clustering in intro; ensures boundaries are spread
	const spaced: number[] = [];
	for (const t of deduped) {
		if (spaced.length === 0 || t - spaced[spaced.length - 1] >= MIN_GAP_SEC) {
			spaced.push(t);
		}
	}
	// Always include the last (slide end) if present
	if (deduped.length > 0 && spaced.length > 0 && spaced[spaced.length - 1] !== deduped[deduped.length - 1]) {
		spaced.push(deduped[deduped.length - 1]);
	}
	return spaced;
}

/**
 * Build splitAt from candidates. Need N-1 boundaries for N segments.
 * Skip first candidate (segment 0 start); use last candidate for final boundary when available.
 */
function buildSplitAt(
	candidates: number[],
	needed: number,
	slideDuration: number
): number[] {
	if (needed <= 0) return [];
	const rounded = candidates.map((t) => Math.round(t * 100) / 100);

	// Skip first candidate (intro/segment 0 start); take next (needed) boundaries
	let result: number[];
	if (rounded.length >= needed + 1) {
		result = rounded.slice(1, needed + 1);
		// Prefer last candidate (slide end) for final boundary
		if (needed > 0 && rounded.length > 0) {
			result[needed - 1] = rounded[rounded.length - 1];
		}
	} else if (rounded.length >= needed) {
		result = rounded.slice(0, needed);
	} else {
		result = [...rounded];
		while (result.length < needed) {
			const last = result[result.length - 1] ?? 0;
			const gap = (slideDuration - last) / (needed - result.length + 1);
			result.push(Math.round((last + Math.max(gap, 2)) * 100) / 100);
		}
		result = result.slice(0, needed);
	}
	return result;
}

function main() {
	const args = process.argv.slice(2);
	const courseId = args.find((a) => !a.startsWith("--")) ?? "";
	const slideFilter = args.includes("--slide") ? args[args.indexOf("--slide") + 1] : undefined;
	const moduleFilter = args.includes("--module")
		? parseInt(args[args.indexOf("--module") + 1], 10)
		: undefined;
	if (moduleFilter !== undefined && isNaN(moduleFilter)) {
		console.error("--module requires a valid number");
		process.exit(1);
	}
	const dryRun = args.includes("--dry-run");

	if (!courseId) {
		console.error("Usage: npx tsx scripts/deriveBoundariesFromScript.ts <courseId> [--module N] [--slide <name>] [--dry-run]");
		process.exit(1);
	}

	const splitsPath = path.join(__dirname, "../courses", courseId, "slide-splits.json");
	const contentPath = path.join(__dirname, "../courses", courseId, "content.json");
	if (!fs.existsSync(splitsPath) || !fs.existsSync(contentPath)) {
		console.error("slide-splits.json or content.json not found for", courseId);
		process.exit(1);
	}

	const content = JSON.parse(fs.readFileSync(contentPath, "utf-8"));
	const splits: Record<string, { splitAt: number[]; segments?: unknown[] }> = JSON.parse(
		fs.readFileSync(splitsPath, "utf-8")
	);
	let updated = 0;

	for (const mod of content.modules || []) {
		if (moduleFilter !== undefined && mod.moduleNumber !== moduleFilter) continue;
		const timings = loadTimings(mod.moduleNumber);
		if (!timings) continue;

		const getDur = (name: string) =>
			getAudioDuration(`${courseId}/module${mod.moduleNumber}-${name}`);

		for (const slide of mod.slides || []) {
			if (slideFilter && slide.name !== slideFilter) continue;
			const script = slide.script?.trim();
			if (!script) continue;

			const slideWords = timings[slide.name]?.words;
			if (!slideWords?.length) continue;

			const splitDef = splits[slide.name];
			if (!splitDef?.splitAt) continue;

			const nSeg = splitDef.splitAt.length + 1;
			const needed = nSeg - 1;
			if (needed <= 0) continue;

			let slideDuration: number;
			try {
				slideDuration = getDur(slide.name);
			} catch {
				slideDuration = 80;
			}

			const phrases = extractTopicPhrases(script);
			const candidates = collectCandidateTimestamps(slideWords, phrases, slideDuration);

			// Only update when we have enough phrase-based candidates; skip to avoid bad interpolations
			if (candidates.length < needed) continue;

			const newSplitAt = buildSplitAt(candidates, needed, slideDuration);
			if (newSplitAt.length === 0) continue;

			// Ensure monotonic
			for (let i = 1; i < newSplitAt.length; i++) {
				if (newSplitAt[i] <= newSplitAt[i - 1]) {
					newSplitAt[i] = newSplitAt[i - 1] + 0.5;
				}
			}

			const oldStr = JSON.stringify(splitDef.splitAt);
			const newStr = JSON.stringify(newSplitAt);
			if (oldStr !== newStr) {
				console.log(`  ${slide.name}: ${oldStr}`);
				console.log(`    -> ${newStr}`);
				if (!dryRun) {
					splitDef.splitAt = newSplitAt;
					updated++;
				}
			}
		}
	}

	if (updated > 0 && !dryRun) {
		fs.writeFileSync(splitsPath, JSON.stringify(splits, null, 2), "utf-8");
		console.log(`\nUpdated ${updated} slide(s). Run: npm run derive-bullets, then npm run sync-slide-splits`);
	} else if (dryRun) {
		console.log("\n[dry-run] No file changes");
	} else if (updated === 0) {
		console.log("\nNo changes needed.");
	}
}

main();
