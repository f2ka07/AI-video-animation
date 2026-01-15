// Animation cues synchronized with narration
// Uses TTS word timings as source of truth for perfect synchronization

import { WordTiming } from "./wordTimings";
import { buildCuesFromTimings } from "./buildCuesFromTimings";
import { lineMappings } from "./wordTimings";
import { wordTimings } from "./wordTimings";

export interface AnimationCue {
	startTime: number; // seconds from start of audio
	endTime: number; // seconds from start of audio
	type: "highlight" | "callout" | "fade";
	target: string; // line number, word, or element ID
	effect?: "glow" | "scale" | "pulse" | "arrow";
}

// Cache for built cues (computed from word timings)
const cueCache: Record<string, AnimationCue[]> = {};

// Fallback manual cues (used when word timings aren't available yet)
const fallbackCues: Record<string, AnimationCue[]> = {
	initCode: [
		{ startTime: 2.5, endTime: 4.5, type: "highlight", target: "line-2", effect: "glow" },
		{ startTime: 5.0, endTime: 7.0, type: "highlight", target: "line-5", effect: "glow" },
		{ startTime: 7.0, endTime: 9.0, type: "highlight", target: "line-6", effect: "glow" },
		{ startTime: 9.0, endTime: 11.0, type: "highlight", target: "line-7", effect: "glow" },
		{ startTime: 11.0, endTime: 13.0, type: "highlight", target: "line-8", effect: "glow" },
	],
	typescriptCode: [
		{ startTime: 2.0, endTime: 4.0, type: "highlight", target: "line-1", effect: "glow" },
		{ startTime: 4.5, endTime: 6.5, type: "highlight", target: "line-4", effect: "glow" },
		{ startTime: 6.5, endTime: 8.5, type: "highlight", target: "line-5", effect: "glow" },
		{ startTime: 8.5, endTime: 10.0, type: "highlight", target: "line-6", effect: "glow" },
		{ startTime: 10.0, endTime: 11.5, type: "highlight", target: "line-7", effect: "glow" },
		{ startTime: 11.5, endTime: 13.5, type: "highlight", target: "line-8", effect: "glow" },
		{ startTime: 15.0, endTime: 17.0, type: "highlight", target: "line-15", effect: "glow" },
	],
	workflow: [
		{ startTime: 5, endTime: 7, type: "highlight", target: "line-1", effect: "glow" },
		{ startTime: 7, endTime: 9, type: "highlight", target: "line-2", effect: "glow" },
		{ startTime: 9, endTime: 11, type: "highlight", target: "line-3", effect: "glow" },
		{ startTime: 11, endTime: 13, type: "highlight", target: "line-4", effect: "glow" },
		{ startTime: 13, endTime: 15, type: "highlight", target: "line-5", effect: "glow" },
	],
};

/**
 * Get active cues at a specific time
 * Uses word timings if available, falls back to manual cues
 */
export function getActiveCues(slideName: string, currentTime: number): AnimationCue[] {
	// Build cues from word timings if available
	if (!cueCache[slideName]) {
		const timings = wordTimings[slideName];
		const mappings = lineMappings[slideName];

		if (timings?.words.length && mappings?.length) {
			// Use TTS word timings - perfect sync!
			cueCache[slideName] = buildCuesFromTimings(slideName, timings.words, mappings);
		} else {
			// Fallback to manual cues until word timings are available
			cueCache[slideName] = fallbackCues[slideName] || [];
		}
	}

	return cueCache[slideName].filter(
		(cue) => currentTime >= cue.startTime && currentTime <= cue.endTime
	);
}

/**
 * Clear cue cache (call this when word timings are updated)
 */
export function clearCueCache(slideName?: string) {
	if (slideName) {
		delete cueCache[slideName];
	} else {
		Object.keys(cueCache).forEach((key) => delete cueCache[key]);
	}
}

// Helper to check if a line should be highlighted
export function isLineHighlighted(slideName: string, lineNumber: number, currentTime: number): boolean {
	const activeCues = getActiveCues(slideName, currentTime);
	return activeCues.some(cue => {
		if (cue.type !== "highlight") return false;
		const targetLine = parseInt(cue.target.replace("line-", ""));
		return targetLine === lineNumber;
	});
}
