// Map spoken "Line N" / "Lines X through Y" in word timings to code line highlights.
// Uses the audio transcript (not content.json script) so highlights match what viewers hear.

import type { WordTiming } from "../../src/utils/wordRangeFinder";

export interface LineMappingFromTimings {
	id: string;
	line: number;
	wordRange: [number, number];
}

const SPOKEN_NUM: Record<string, number> = {
	one: 1,
	two: 2,
	three: 3,
	four: 4,
	five: 5,
	six: 6,
	seven: 7,
	eight: 8,
	nine: 9,
	ten: 10,
	eleven: 11,
	twelve: 12,
	thirteen: 13,
	fourteen: 14,
	fifteen: 15,
	sixteen: 16,
	seventeen: 17,
	eighteen: 18,
};

function normalizeToken(text: string): string {
	return text.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function parseSpokenLineNumber(text: string): number | null {
	const t = normalizeToken(text);
	if (/^\d+$/.test(t)) {
		const n = parseInt(t, 10);
		return Number.isFinite(n) ? n : null;
	}
	return SPOKEN_NUM[t] ?? null;
}

function isLineMarker(text: string): boolean {
	const t = normalizeToken(text);
	return t === "line" || t === "lines";
}

function findNextLineMarkerIndex(words: WordTiming[], startIdx: number): number {
	for (let j = startIdx; j < words.length; j++) {
		if (isLineMarker(words[j].text)) return j;
	}
	return words.length;
}

/**
 * When the narrator says "Line six" or "Lines two through five", map those code lines
 * to the word-timing window for that phrase (until the next line reference).
 */
export function extractLineMappingsFromWordTimings(
	words: WordTiming[],
	codeLineCount: number
): LineMappingFromTimings[] {
	if (!words.length || codeLineCount < 1) return [];

	const byLine = new Map<number, [number, number]>();

	const assignRange = (codeLine: number, wordRange: [number, number]) => {
		if (codeLine < 1 || codeLine > codeLineCount) return;
		if (!byLine.has(codeLine)) {
			byLine.set(codeLine, wordRange);
		}
	};

	for (let i = 0; i < words.length; i++) {
		if (!isLineMarker(words[i].text)) continue;

		const startNum = words[i + 1] ? parseSpokenLineNumber(words[i + 1].text) : null;
		if (startNum == null) continue;

		let endNum = startNum;
		if (
			normalizeToken(words[i + 2]?.text ?? "") === "through" &&
			words[i + 3]
		) {
			const throughNum = parseSpokenLineNumber(words[i + 3].text);
			if (throughNum != null) {
				endNum = Math.max(startNum, throughNum);
			}
		}

		const nextMarker = findNextLineMarkerIndex(words, i + 1);
		const endWordIdx = Math.max(i, nextMarker - 1);
		const wordRange: [number, number] = [i, endWordIdx];

		for (let codeLine = startNum; codeLine <= endNum; codeLine++) {
			assignRange(codeLine, wordRange);
		}
	}

	return Array.from(byLine.entries())
		.sort(([a], [b]) => a - b)
		.map(([line, wordRange]) => ({
			id: `line-${line}`,
			line,
			wordRange,
		}));
}
