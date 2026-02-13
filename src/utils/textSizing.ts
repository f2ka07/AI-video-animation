// Text measurement utilities for dynamic font sizing
// Used to calculate optimal font sizes based on available space

/**
 * Measure text dimensions using canvas
 * Returns width and height in pixels
 */
export function measureText(
	text: string,
	fontSize: number,
	fontFamily: string = "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
	lineHeight: number = 1.5,
	maxWidth?: number
): { width: number; height: number; lines: number } {
	// Create a canvas element for measurement
	// Note: In Remotion, we can't use DOM canvas, so we'll use estimation
	// For accurate measurement, we'd need to use React's layout measurement or a library

	// Estimation based on character width and line height
	const avgCharWidth = fontSize * 0.6; // Average character width is ~60% of font size
	const words = text.split(/\s+/);
	let currentLineWidth = 0;
	let lines = 1;
	let maxLineWidth = 0;

	for (const word of words) {
		const wordWidth = word.length * avgCharWidth;
		const spaceWidth = avgCharWidth * 0.3; // Space is narrower

		if (maxWidth && currentLineWidth + wordWidth > maxWidth && currentLineWidth > 0) {
			// Word doesn't fit, wrap to next line
			lines++;
			currentLineWidth = wordWidth;
		} else {
			currentLineWidth += (currentLineWidth > 0 ? spaceWidth : 0) + wordWidth;
		}

		maxLineWidth = Math.max(maxLineWidth, currentLineWidth);
	}

	const height = lines * fontSize * lineHeight;
	const width = maxWidth ? Math.min(maxLineWidth, maxWidth) : maxLineWidth;

	return { width, height, lines };
}

/**
 * Calculate optimal font size to fit text in available space
 */
export function calculateOptimalFontSize(
	text: string,
	availableWidth: number,
	availableHeight: number,
	maxFontSize: number = 72,
	minFontSize: number = 12,
	fontFamily?: string,
	lineHeight?: number
): { fontSize: number; actualHeight: number; lines: number } {
	let fontSize = maxFontSize;
	let bestFit: { fontSize: number; actualHeight: number; lines: number } | null = null;

	// Binary search for optimal font size
	let low = minFontSize;
	let high = maxFontSize;
	const tolerance = 0.5;

	while (high - low > tolerance) {
		fontSize = (low + high) / 2;
		const measurement = measureText(text, fontSize, fontFamily, lineHeight, availableWidth);

		if (measurement.height <= availableHeight && measurement.width <= availableWidth) {
			// Text fits, try larger font
			bestFit = { fontSize, actualHeight: measurement.height, lines: measurement.lines };
			low = fontSize;
		} else {
			// Text doesn't fit, try smaller font
			high = fontSize;
		}
	}

	// Use the best fit we found, or fall back to minimum
	if (bestFit) {
		return bestFit;
	}

	// If no fit found, use minimum size and return actual measurements
	const minMeasurement = measureText(text, minFontSize, fontFamily, lineHeight, availableWidth);
	return {
		fontSize: minFontSize,
		actualHeight: minMeasurement.height,
		lines: minMeasurement.lines,
	};
}

/** Absolute minimum font size - used when content must fit (e.g. video, no scroll) */
const ABSOLUTE_MIN_FONT_SIZE = 8;

/**
 * Calculate font size for multiple text elements (e.g., bullet points)
 * Ensures all elements fit within available space. Uses lower min when needed
 * so content is never trimmed at the end (critical for video).
 */
export function calculateFontSizeForMultiple(
	texts: string[],
	availableWidth: number,
	availableHeight: number,
	maxFontSize: number = 38,
	minFontSize: number = 12,
	fontFamily?: string,
	lineHeight?: number,
	gap: number = 24
): { fontSize: number; totalHeight: number } {
	let fontSize = maxFontSize;
	let bestFit: { fontSize: number; totalHeight: number } | null = null;

	// Binary search: allow going below minFontSize so content always fits (no trimming)
	const effectiveMin = Math.min(minFontSize, ABSOLUTE_MIN_FONT_SIZE);
	let low = effectiveMin;
	let high = maxFontSize;
	const tolerance = 0.5;

	while (high - low > tolerance) {
		fontSize = (low + high) / 2;
		let totalHeight = 0;

		for (const text of texts) {
			const measurement = measureText(text, fontSize, fontFamily, lineHeight, availableWidth);
			totalHeight += measurement.height + gap;
		}

		// Remove last gap
		totalHeight -= gap;

		if (totalHeight <= availableHeight) {
			// All texts fit, try larger font
			bestFit = { fontSize, totalHeight };
			low = fontSize;
		} else {
			// Doesn't fit, try smaller font
			high = fontSize;
		}
	}

	// Use the best fit we found, or scale down so content always fits (no trimming)
	if (bestFit) {
		return bestFit;
	}

	// At effective minimum, content may still overflow - scale down to fit
	let totalHeight = 0;
	for (const text of texts) {
		const measurement = measureText(text, effectiveMin, fontFamily, lineHeight, availableWidth);
		totalHeight += measurement.height + gap;
	}
	totalHeight -= gap;

	let finalFontSize = effectiveMin;
	if (totalHeight > availableHeight && totalHeight > 0) {
		const scale = availableHeight / totalHeight;
		finalFontSize = Math.max(6, effectiveMin * scale);
		// Recompute totalHeight at scaled font
		totalHeight = 0;
		for (const text of texts) {
			const measurement = measureText(text, finalFontSize, fontFamily, lineHeight, availableWidth);
			totalHeight += measurement.height + gap;
		}
		totalHeight -= gap;
	}

	return {
		fontSize: finalFontSize,
		totalHeight,
	};
}

/**
 * Truncate text with ellipsis if it exceeds max length
 */
export function truncateText(text: string, maxLength: number): string {
	if (text.length <= maxLength) {
		return text;
	}
	return text.substring(0, maxLength - 3) + "...";
}

/**
 * Wrap text to fit within max width (approximate)
 */
export function wrapText(text: string, maxWidth: number, fontSize: number): string[] {
	const avgCharWidth = fontSize * 0.6;
	const words = text.split(/\s+/);
	const lines: string[] = [];
	let currentLine = "";

	for (const word of words) {
		const wordWidth = word.length * avgCharWidth;
		const testLine = currentLine ? `${currentLine} ${word}` : word;
		const testWidth = testLine.length * avgCharWidth;

		if (testWidth <= maxWidth) {
			currentLine = testLine;
		} else {
			if (currentLine) {
				lines.push(currentLine);
			}
			currentLine = word;
		}
	}

	if (currentLine) {
		lines.push(currentLine);
	}

	return lines;
}
