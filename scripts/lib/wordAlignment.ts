// Align forced-alignment word timings to the canonical slide script text.
// Shared by Gentle, MFA, Whisper post-processing, and alignScriptWithTimings.ts

export interface WordTiming {
	text: string;
	start: number;
	end: number;
}

export function normalizeText(text: string): string {
	return text
		.replace(/[""]/g, '"')
		.replace(/['']/g, "'")
		.replace(/…/g, "...")
		.replace(/—/g, "-")
		.replace(/–/g, "-");
}

export function splitIntoWords(script: string): string[] {
	const normalized = normalizeText(script);
	const words: string[] = [];
	const tokens = normalized.match(/\S+/g) || [];

	for (const token of tokens) {
		const wordMatch = token.match(/^([\w'-]+)([.,!?;:])?$/i);
		if (wordMatch) {
			words.push(wordMatch[1]);
		} else {
			words.push(token.replace(/[^\w'-]/g, ""));
		}
	}

	return words.filter((w) => w.length > 0);
}

export function alignWords(scriptWords: string[], sourceTimings: WordTiming[]): WordTiming[] {
	if (sourceTimings.length === 0) {
		return [];
	}

	if (scriptWords.length === 0) {
		return sourceTimings;
	}

	const totalDuration = sourceTimings[sourceTimings.length - 1].end;

	if (Math.abs(scriptWords.length - sourceTimings.length) <= 2) {
		const aligned: WordTiming[] = [];
		const maxLen = Math.max(scriptWords.length, sourceTimings.length);

		for (let i = 0; i < maxLen; i++) {
			const scriptWord = scriptWords[i] || scriptWords[scriptWords.length - 1];
			const sourceTiming = sourceTimings[i] || sourceTimings[sourceTimings.length - 1];

			aligned.push({
				text: scriptWord,
				start: sourceTiming.start,
				end: sourceTiming.end,
			});
		}

		return aligned;
	}

	const aligned: WordTiming[] = [];
	const intervals: Array<{ start: number; end: number }> = sourceTimings.map((timing) => ({
		start: timing.start,
		end: timing.end,
	}));

	let scriptIndex = 0;

	for (let i = 0; i < intervals.length && scriptIndex < scriptWords.length; i++) {
		const interval = intervals[i];
		const remainingScriptWords = scriptWords.length - scriptIndex;
		const remainingIntervals = intervals.length - i;
		const wordsForInterval = Math.max(1, Math.round(remainingScriptWords / remainingIntervals));

		for (let j = 0; j < wordsForInterval && scriptIndex < scriptWords.length; j++) {
			const progress = j / wordsForInterval;
			const nextProgress = (j + 1) / wordsForInterval;
			const start = interval.start + (interval.end - interval.start) * progress;
			const end = interval.start + (interval.end - interval.start) * nextProgress;

			aligned.push({
				text: scriptWords[scriptIndex],
				start,
				end,
			});
			scriptIndex++;
		}
	}

	while (scriptIndex < scriptWords.length) {
		const lastTiming = sourceTimings[sourceTimings.length - 1];
		const lastAligned = aligned[aligned.length - 1];
		const start = lastAligned ? lastAligned.end : lastTiming.end;
		aligned.push({
			text: scriptWords[scriptIndex],
			start,
			end: Math.max(start + 0.05, totalDuration),
		});
		scriptIndex++;
	}

	return aligned;
}

export function alignTimingsToScript(script: string, sourceTimings: WordTiming[]): WordTiming[] {
	return alignWords(splitIntoWords(script), sourceTimings);
}
