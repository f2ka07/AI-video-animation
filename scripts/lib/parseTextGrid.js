// Parse Praat TextGrid word intervals into { text, start, end } seconds.
// Supports long TextGrid (one line per interval) and short TextGrid (MFA 3.x default).

const SKIP_LABELS = new Set(['<eps>', '<unk>', 'sp', 'sil', '']);

function pushWord(words, text, start, end) {
	const label = text.trim();
	if (SKIP_LABELS.has(label)) {
		return;
	}
	words.push({ text: label, start, end });
}

function parseShortTextGridWords(content) {
	const words = [];
	const wordsTierStart = content.search(/name\s*=\s*"words"/i);
	if (wordsTierStart === -1) {
		return words;
	}

	const afterWords = content.slice(wordsTierStart);
	const nextTier = afterWords.search(/\n\s*item\s*\[\d+\]:/);
	const tierBody = nextTier === -1 ? afterWords : afterWords.slice(0, nextTier);

	const blockRe =
		/intervals\s*\[\d+\]:\s*\r?\n\s*xmin\s*=\s*([\d.]+)\s*\r?\n\s*xmax\s*=\s*([\d.]+)\s*\r?\n\s*text\s*=\s*"([^"]*)"/g;
	let match;
	while ((match = blockRe.exec(tierBody)) !== null) {
		pushWord(words, match[3], parseFloat(match[1]), parseFloat(match[2]));
	}
	return words;
}

function parseLongTextGridWords(content) {
	const words = [];
	const lines = content.split(/\r?\n/);
	let inWordTier = false;
	let inIntervals = false;

	for (const line of lines) {
		const trimmed = line.trim();

		if (/name\s*=\s*"words"/i.test(trimmed)) {
			inWordTier = true;
			inIntervals = false;
			continue;
		}

		if (inWordTier && /name\s*=\s*"/.test(trimmed) && !/name\s*=\s*"words"/i.test(trimmed)) {
			break;
		}

		if (inWordTier && trimmed === 'intervals: size =') {
			inIntervals = true;
			continue;
		}

		if (!inWordTier || !inIntervals) {
			continue;
		}

		const intervalMatch = trimmed.match(
			/^(\d+)\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s+"([^"]*)"/
		);
		if (!intervalMatch) {
			continue;
		}

		pushWord(words, intervalMatch[4], parseFloat(intervalMatch[2]), parseFloat(intervalMatch[3]));
	}

	return words;
}

function parseTextGrid(content) {
	let words = parseShortTextGridWords(content);
	if (words.length > 0) {
		return words;
	}

	words = parseLongTextGridWords(content);
	if (words.length > 0) {
		return words;
	}

	// Last resort: any quoted interval line in the file
	for (const line of content.split(/\r?\n/)) {
		const m = line.trim().match(/^(\d+)\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s+"([^"]+)"/);
		if (!m) continue;
		pushWord(words, m[4], parseFloat(m[2]), parseFloat(m[3]));
	}

	return words;
}

module.exports = { parseTextGrid };
