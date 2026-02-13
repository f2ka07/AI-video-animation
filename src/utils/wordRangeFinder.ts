// Utility for finding word ranges in word timing arrays

export interface WordTiming {
	text: string;
	start: number;
	end: number;
}

/**
 * Find word indices for a phrase in the words array
 * Used to map spoken phrases to their timing in the audio
 */
export function findWordRange(
	words: WordTiming[],
	phrase: string
): [number, number] | null {
	const phraseWords = phrase.toLowerCase().split(/\s+/);

	for (let i = 0; i <= words.length - phraseWords.length; i++) {
		const window = words
			.slice(i, i + phraseWords.length)
			.map((w) => w.text.toLowerCase())
			.join(" ");

		if (window === phraseWords.join(" ")) {
			return [i, i + phraseWords.length - 1];
		}
	}

	return null;
}
