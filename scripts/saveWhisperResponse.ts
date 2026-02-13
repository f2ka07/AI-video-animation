// Save raw Whisper API response to cache
// This avoids calling the API again if processing fails

import * as fs from "fs";
import * as path from "path";

export interface WhisperResponse {
	text: string;
	duration: number;
	words: Array<{
		word: string;
		start: number;
		end: number;
	}>;
	segments?: Array<{
		id: number;
		start: number;
		end: number;
		text: string;
	}>;
}

const CACHE_DIR = path.join(__dirname, "../public/whisper-cache");

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
	fs.mkdirSync(CACHE_DIR, { recursive: true });
}

/**
 * Save raw Whisper API response to cache file
 */
export function saveWhisperResponse(
	slideName: string,
	response: WhisperResponse
): string {
	const cachePath = path.join(CACHE_DIR, `${slideName}.json`);
	fs.writeFileSync(cachePath, JSON.stringify(response, null, 2));
	return cachePath;
}

/**
 * Load cached Whisper API response
 */
export function loadWhisperResponse(slideName: string): WhisperResponse | null {
	const cachePath = path.join(CACHE_DIR, `${slideName}.json`);
	if (!fs.existsSync(cachePath)) {
		return null;
	}
	const content = fs.readFileSync(cachePath, "utf-8");
	return JSON.parse(content);
}

/**
 * Check if cached response exists
 */
export function hasCachedResponse(slideName: string): boolean {
	const cachePath = path.join(CACHE_DIR, `${slideName}.json`);
	return fs.existsSync(cachePath);
}
