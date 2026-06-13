import type { WordTiming } from "./timingsLoader";

const ORDINALS = ["first", "second", "third", "fourth", "fifth"];
const STOP_WORDS = new Set([
	"a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with",
	"by", "from", "as", "is", "are", "was", "were", "be", "been", "being", "have", "has",
	"had", "do", "does", "did", "will", "would", "could", "should", "may", "might", "must",
	"can", "that", "this", "these", "those", "it", "its", "they", "them", "their", "we",
	"you", "your", "not", "no", "nor", "so", "if", "then", "than", "into", "via", "one",
]);

function normalizeWord(word: string): string {
	return word.toLowerCase().replace(/[.,!?;:'"()[\]{}]/g, "").trim();
}

function splitTokenParts(token: string): string[] {
	const normalized = normalizeWord(token);
	if (!normalized) return [];
	if (normalized.includes("-")) {
		return normalized.split("-").filter(Boolean);
	}
	return [normalized];
}

function extractWordGroups(point: string): string[][] {
	const allWords = point.split(/\s+/).map(normalizeWord).filter((w) => w.length > 0);
	const groups: string[][] = [];
	if (allWords.length >= 3) groups.push(allWords.slice(0, 3));
	else if (allWords.length > 0) groups.push(allWords);
	if (allWords.length >= 6) groups.push(allWords.slice(3, 6));
	else if (allWords.length > 3) groups.push(allWords.slice(3));
	if (allWords.length >= 9) groups.push(allWords.slice(6, 9));
	else if (allWords.length > 6) groups.push(allWords.slice(6));
	if (allWords.length >= 4 && ORDINALS.includes(allWords[0])) {
		groups.push(allWords.slice(1, 4));
	}
	return groups;
}

function extractKeywords(point: string): string[] {
	return point
		.split(/\s+/)
		.map(normalizeWord)
		.flatMap((token) => splitTokenParts(token))
		.filter((w) => w.length >= 4 && !STOP_WORDS.has(w));
}

function matchGroupAt(words: WordTiming[], startIndex: number, group: string[]): boolean {
	let wi = startIndex;
	for (const groupWord of group) {
		const parts = splitTokenParts(groupWord);
		for (const part of parts) {
			if (wi >= words.length) return false;
			const wordText = normalizeWord(words[wi].text);
			if (
				wordText !== part &&
				!wordText.startsWith(part) &&
				!part.startsWith(wordText)
			) {
				return false;
			}
			wi++;
		}
	}
	return true;
}

function findWordGroupTime(
	words: WordTiming[],
	wordGroup: string[],
	minStartTime: number
): number | null {
	if (wordGroup.length === 0) return null;
	for (let i = 0; i < words.length; i++) {
		if (words[i].start <= minStartTime) continue;
		if (matchGroupAt(words, i, wordGroup)) {
			return words[i].start;
		}
	}
	return null;
}

function findKeywordTime(
	words: WordTiming[],
	keywords: string[],
	minStartTime: number
): number | null {
	if (keywords.length === 0) return null;

	for (let size = Math.min(3, keywords.length); size >= 1; size--) {
		for (let i = 0; i <= keywords.length - size; i++) {
			const slice = keywords.slice(i, i + size);
			const time = findWordGroupTime(words, slice, minStartTime);
			if (time !== null) return time;
		}
	}

	for (const keyword of keywords) {
		for (let i = 0; i < words.length; i++) {
			if (words[i].start <= minStartTime) continue;
			const wordText = normalizeWord(words[i].text);
			if (wordText === keyword || wordText.includes(keyword) || keyword.includes(wordText)) {
				return words[i].start;
			}
		}
	}

	return null;
}

function findOrdinalTime(
	words: WordTiming[],
	pointLower: string,
	lastFoundTime: number
): number | null {
	for (const ordinal of ORDINALS) {
		if (
			pointLower.startsWith(ordinal) ||
			pointLower.includes(`, ${ordinal}`) ||
			pointLower.includes(` ${ordinal},`)
		) {
			for (let j = 0; j < words.length; j++) {
				const wordText = normalizeWord(words[j].text);
				if (wordText === ordinal && words[j].start > lastFoundTime) {
					return words[j].start;
				}
			}
		}
	}
	return null;
}

/**
 * Match trigger words in narration order (same strategy as diagram phase triggers).
 */
export function computeBulletStartsFromTriggerWords(
	words: WordTiming[],
	triggerWordLists: string[][]
): number[] | null {
	if (triggerWordLists.length === 0 || words.length === 0) return null;

	const validWords = words.filter((w) => w && typeof w.end === "number" && w.end > 0.05);
	if (validWords.length === 0) return null;

	const starts: number[] = [];
	let minStart = 0;

	for (const triggers of triggerWordLists) {
		if (!triggers?.length) return null;
		const lower = triggers.map((w) => w.toLowerCase());
		const minSearch = starts.length === 0 ? 0 : minStart + 0.05;
		const hit = validWords.find((w) => {
			if (w.start < minSearch) return false;
			const text = (w.text || "").toLowerCase();
			return lower.some((trigger) => text === trigger || text.includes(trigger));
		});
		if (!hit) return null;
		starts.push(hit.start);
		minStart = hit.start;
	}

	return starts;
}

/**
 * Map each bullet point to the word-timing second when that phrase begins in narration.
 * Returns null if any bullet cannot be matched (caller should fall back to even spacing).
 */
export function computeBulletStarts(
	words: WordTiming[],
	points: string[]
): number[] | null {
	if (points.length === 0 || words.length === 0) return null;

	const validWords = words.filter((w) => w && typeof w.end === "number" && w.end > 0.05);
	if (validWords.length === 0) return null;

	const starts: number[] = [];
	let lastFoundTime = 0;

	for (let i = 0; i < points.length; i++) {
		const point = points[i];
		const wordGroups = extractWordGroups(point);
		const pointLower = point.toLowerCase();
		let foundTime: number | null = findOrdinalTime(validWords, pointLower, lastFoundTime);

		if (foundTime === null) {
			for (const group of wordGroups) {
				const time = findWordGroupTime(validWords, group, lastFoundTime);
				if (time !== null && time > lastFoundTime) {
					foundTime = time;
					break;
				}
			}
		}

		if (foundTime === null) {
			foundTime = findKeywordTime(validWords, extractKeywords(point), lastFoundTime);
		}

		if (foundTime === null || foundTime <= lastFoundTime) {
			return null;
		}

		starts.push(foundTime);
		lastFoundTime = foundTime;
	}

	return starts;
}
