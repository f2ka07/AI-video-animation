// Utility to estimate audio duration from text
// Used to determine which TTS service to use and whether chunking is needed

/**
 * Estimate audio duration in seconds from text
 * Uses average speaking rate: ~150 words per minute = 2.5 words per second
 * Average characters per word: ~5 (including spaces)
 */
export function estimateAudioDuration(text: string): number {
	if (!text || text.trim().length === 0) {
		return 0;
	}

	// Method 1: Word-based estimation (more accurate)
	const words = text.trim().split(/\s+/).filter((w) => w.length > 0);
	const wordCount = words.length;
	
	// Average speaking rate: 150 words per minute = 2.5 words per second
	const wordsPerSecond = 2.5;
	const estimatedSeconds = wordCount / wordsPerSecond;

	// Method 2: Character-based estimation (fallback)
	const charCount = text.length;
	// Average: ~12.5 characters per second (at 150 WPM, ~5 chars/word)
	const charsPerSecond = 12.5;
	const charBasedSeconds = charCount / charsPerSecond;

	// Use the average of both methods for better accuracy
	const averageSeconds = (estimatedSeconds + charBasedSeconds) / 2;

	// Add small buffer (10%) to account for pauses and natural speech patterns
	return averageSeconds * 1.1;
}

/**
 * Check if audio should use Minimax instead of RunPod
 * RunPod has quality issues for audio > 10 seconds
 */
export function shouldUseMinimax(text: string): boolean {
	const estimatedDuration = estimateAudioDuration(text);
	return estimatedDuration > 10;
}

/**
 * Split text into chunks at sentence boundaries
 * Attempts to keep chunks under maxDuration seconds
 */
export function chunkTextAtSentences(
	text: string,
	maxDuration: number = 10
): string[] {
	if (!text || text.trim().length === 0) {
		return [];
	}

	const estimatedDuration = estimateAudioDuration(text);
	if (estimatedDuration <= maxDuration) {
		return [text];
	}

	// Split by sentence boundaries (., !, ?, followed by space or end)
	const sentences = text.match(/[^.!?]+[.!?]+(?:\s+|$)/g) || [text];
	
	if (sentences.length === 0) {
		return [text];
	}

	const chunks: string[] = [];
	let currentChunk = "";

	for (const sentence of sentences) {
		const testChunk = currentChunk ? `${currentChunk} ${sentence}` : sentence;
		const chunkDuration = estimateAudioDuration(testChunk);

		if (chunkDuration <= maxDuration) {
			currentChunk = testChunk;
		} else {
			// Current chunk is full, save it and start new one
			if (currentChunk) {
				chunks.push(currentChunk.trim());
			}
			currentChunk = sentence;
		}
	}

	// Add remaining chunk
	if (currentChunk) {
		chunks.push(currentChunk.trim());
	}

	return chunks.length > 0 ? chunks : [text];
}
