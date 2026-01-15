// Build animation cues from TTS word timings
// This replaces manual time guessing with exact TTS timestamps

import { AnimationCue } from "./animationCues";
import { WordTiming } from "./wordTimings";
import { lineMappings, LineMapping } from "./wordTimings";

/**
 * Build animation cues from word timings and line mappings
 * This uses exact TTS timestamps, making timing perfect
 */
export function buildCuesFromTimings(
	slideName: string,
	words: WordTiming[],
	mappings: LineMapping[]
): AnimationCue[] {
	if (!words.length || !mappings.length) {
		return []; // No timings available yet, return empty
	}

	return mappings.map((mapping) => {
		const [startIdx, endIdx] = mapping.wordRange;
		const startWord = words[startIdx];
		const endWord = words[endIdx];

		if (!startWord || !endWord) {
			console.warn(
				`Invalid wordRange [${startIdx}, ${endIdx}] for ${mapping.id} on slide ${slideName}. Words array has ${words.length} items.`
			);
			return null;
		}

		return {
			type: "highlight" as const,
			target: `line-${mapping.line}`,
			startTime: startWord.start,
			endTime: endWord.end,
			effect: "glow" as const,
		};
	}).filter((cue): cue is AnimationCue => cue !== null);
}

/**
 * Find word indices for a phrase in the words array
 * Helper function to automatically map phrases to word ranges
 */
export function findWordRange(
	words: WordTiming[],
	phrase: string
): [number, number] | null {
	const phraseWords = phrase.toLowerCase().split(/\s+/);
	const text = words.map((w) => w.text.toLowerCase()).join(" ");

	let startIdx = -1;
	for (let i = 0; i <= words.length - phraseWords.length; i++) {
		const window = words
			.slice(i, i + phraseWords.length)
			.map((w) => w.text.toLowerCase())
			.join(" ");

		if (window === phraseWords.join(" ")) {
			startIdx = i;
			return [i, i + phraseWords.length - 1];
		}
	}

	return null;
}

/**
 * Auto-populate line mappings by finding phrases in word timings
 */
export function autoMapLines(
	slideName: string,
	words: WordTiming[],
	phraseToLineMap: Record<string, number>
): LineMapping[] {
	const mappings: LineMapping[] = [];

	for (const [phrase, lineNumber] of Object.entries(phraseToLineMap)) {
		const wordRange = findWordRange(words, phrase);
		if (wordRange) {
			mappings.push({
				id: phrase.toLowerCase().replace(/\s+/g, "-"),
				line: lineNumber,
				wordRange,
			});
		} else {
			console.warn(`Could not find phrase "${phrase}" in words for ${slideName}`);
		}
	}

	return mappings;
}
