// Shared utilities for word timing operations.
// Used by deriveBulletsFromWordTimings and deriveBoundariesFromScript.

import * as fs from "fs";
import * as path from "path";

export interface WordTiming {
	text: string;
	start: number;
	end: number;
}

export function loadTimings(moduleNumber: number): Record<string, { words: WordTiming[] }> | null {
	const p = path.join(__dirname, "../../public/timings", `module${moduleNumber}.json`);
	if (!fs.existsSync(p)) return null;
	try {
		const data = JSON.parse(fs.readFileSync(p, "utf-8"));
		return data.slides || null;
	} catch {
		return null;
	}
}

/**
 * Find first occurrence of phrase in words. Returns start/end word indices or null.
 */
export function findPhraseInWords(
	words: WordTiming[],
	phrase: string
): { startIdx: number; endIdx: number } | null {
	const phraseWords = phrase
		.toLowerCase()
		.replace(/-/g, " ")
		.split(/\s+/)
		.filter((w) => w.length > 0);
	if (phraseWords.length === 0) return null;
	for (let i = 0; i <= words.length - phraseWords.length; i++) {
		let matched = true;
		for (let j = 0; j < phraseWords.length; j++) {
			const w = words[i + j].text.toLowerCase().replace(/[.,!?;:'"()[\]]/g, "");
			const p = phraseWords[j];
			if (w !== p && !w.includes(p) && !p.includes(w)) {
				matched = false;
				break;
			}
		}
		if (matched) {
			return { startIdx: i, endIdx: i + phraseWords.length - 1 };
		}
	}
	return null;
}

/**
 * Find phrase time with fallback to shorter matches. Tries full phrase, then first 3, 2, 1 words.
 * Used when author bullets are condensed (e.g. "Based on IP, port, protocol" vs transcript
 * "based on factors like IP address, port number, and protocol").
 */
export function findPhraseTimeWithFallback(
	words: WordTiming[],
	phrase: string,
	minStartFrom: number = 0
): { start: number; end: number } | null {
	const phraseWords = phrase
		.toLowerCase()
		.replace(/-/g, " ")
		.split(/\s+/)
		.filter((w) => w.length >= 2);
	if (phraseWords.length === 0) return null;
	for (let len = Math.min(phraseWords.length, 5); len >= 1; len--) {
		const subPhrase = phraseWords.slice(0, len).join(" ");
		const found = findPhraseInWords(words, subPhrase);
		if (!found) continue;
		const startWord = words[found.startIdx];
		const endWord = words[found.endIdx];
		if (!startWord || !endWord) continue;
		if (startWord.start < minStartFrom) continue;
		const endIdx = Math.min(found.endIdx + 5, words.length - 1);
		const end = words[endIdx]?.end ?? endWord.end;
		return { start: startWord.start, end };
	}
	return null;
}

/**
 * Find all occurrences of phrase in words. Returns array of { startIdx, endIdx, startTime }.
 * @param exact - if true, require exact word match (no fuzzy); reduces false positives
 */
export function findAllPhraseOccurrences(
	words: WordTiming[],
	phrase: string,
	exact = false
): { startIdx: number; endIdx: number; startTime: number }[] {
	const results: { startIdx: number; endIdx: number; startTime: number }[] = [];
	const phraseWords = phrase
		.toLowerCase()
		.replace(/-/g, " ")
		.split(/\s+/)
		.filter((w) => w.length > 0);
	if (phraseWords.length === 0) return [];
	for (let i = 0; i <= words.length - phraseWords.length; i++) {
		let matched = true;
		for (let j = 0; j < phraseWords.length; j++) {
			const w = words[i + j].text.toLowerCase().replace(/[.,!?;:'"()[\]]/g, "");
			const p = phraseWords[j];
			if (exact ? w !== p : w !== p && !w.includes(p) && !p.includes(w)) {
				matched = false;
				break;
			}
		}
		if (matched) {
			const w = words[i];
			const startTime = w?.start ?? 0;
			if (startTime > 0) {
				results.push({ startIdx: i, endIdx: i + phraseWords.length - 1, startTime });
			}
		}
	}
	return results;
}
