// Map SVG elements to word timings for synchronized animations
// This ensures SVG elements animate exactly when they're discussed in narration

import { WordTiming } from "./wordTimings";

export type SvgAnimationType = "reveal" | "highlight" | "zoom" | "draw" | "fade-in";
export type EmphasisLevel = "strong" | "subtle" | "medium";

export interface SvgElementMapping {
	elementId: string; // SVG group id (e.g., "planner", "tools", "memory")
	wordRange: [number, number]; // [startWordIndex, endWordIndex] in words array
	animationType: SvgAnimationType;
	emphasis?: EmphasisLevel;
	// Optional: specific words that trigger this element (for fuzzy matching)
	triggerWords?: string[];
	// Optional: delay before animation starts (in seconds)
	animationDelay?: number;
	// Optional: duration of animation (in seconds, defaults to word range duration)
	animationDuration?: number;
}

// Mappings for each SVG diagram
// Key format: "{moduleNumber}-{diagramName}" or just "{diagramName}"
export const svgElementMappings: Record<string, SvgElementMapping[]> = {
	// Module 1: Agentic Architecture High Level
	"agentic-architecture-high-level": [
		{
			elementId: "planner",
			wordRange: [0, 0], // TODO: Map to actual word indices from module1.json
			animationType: "reveal",
			emphasis: "strong",
			triggerWords: ["planning", "planner", "first", "goal decomposition"],
			animationDelay: 0.2,
		},
		{
			elementId: "tools",
			wordRange: [0, 0], // TODO: Map to actual word indices
			animationType: "highlight",
			emphasis: "strong",
			triggerWords: ["tools", "second", "APIs", "code", "search"],
			animationDelay: 0.1,
		},
		{
			elementId: "memory",
			wordRange: [0, 0], // TODO: Map to actual word indices
			animationType: "reveal",
			emphasis: "medium",
			triggerWords: ["memory", "third", "short-term", "long-term"],
			animationDelay: 0.15,
		},
		{
			elementId: "environment",
			wordRange: [0, 0], // TODO: Map to actual word indices
			animationType: "reveal",
			emphasis: "strong",
			triggerWords: ["fourth", "environment", "safety", "guardrails", "policy"],
			animationDelay: 0.2,
		},
		{
			elementId: "evaluator",
			wordRange: [0, 0], // TODO: Map to actual word indices
			animationType: "zoom",
			emphasis: "strong",
			triggerWords: ["fifth", "evaluator", "LLM", "reasoning", "human-in-the-loop"],
			animationDelay: 0.1,
		},
	],

	// Module 2: Agent Components
	"agent-components": [
		{
			elementId: "planning",
			wordRange: [0, 0], // TODO: Map to actual word indices
			animationType: "reveal",
			emphasis: "strong",
			triggerWords: ["planning", "break", "goals", "subtasks"],
		},
		{
			elementId: "tools",
			wordRange: [0, 0], // TODO: Map to actual word indices
			animationType: "highlight",
			emphasis: "strong",
			triggerWords: ["tools", "APIs", "data retrieval", "code interpreters"],
		},
		{
			elementId: "memory",
			wordRange: [0, 0], // TODO: Map to actual word indices
			animationType: "reveal",
			emphasis: "medium",
			triggerWords: ["memory", "short-term", "long-term", "persists"],
		},
		{
			elementId: "retrieval",
			wordRange: [0, 0], // TODO: Map to actual word indices
			animationType: "reveal",
			emphasis: "medium",
			triggerWords: ["retrieval", "grounding", "vector", "search index"],
		},
		{
			elementId: "safety",
			wordRange: [0, 0], // TODO: Map to actual word indices
			animationType: "highlight",
			emphasis: "strong",
			triggerWords: ["safety", "policy", "filters", "guardrails"],
		},
		{
			elementId: "hitl",
			wordRange: [0, 0], // TODO: Map to actual word indices
			animationType: "reveal",
			emphasis: "strong",
			triggerWords: ["human-in-the-loop", "escalation", "oversight", "autonomy"],
		},
	],

	// Add more mappings as needed...
};

/**
 * Get mappings for a specific diagram
 */
export function getSvgMappings(diagramName: string): SvgElementMapping[] {
	return svgElementMappings[diagramName] || [];
}

/**
 * Find which elements should be active at a given time based on word timings
 */
export function getActiveElementsAtTime(
	currentTime: number,
	words: WordTiming[],
	mappings: SvgElementMapping[]
): {
	show: string[];
	highlight: string[];
	dim: string[];
} {
	if (!words.length || !mappings.length) {
		return { show: [], highlight: [], dim: [] };
	}

	// Find current word index
	let currentWordIndex = -1;
	for (let i = 0; i < words.length; i++) {
		if (currentTime >= words[i].start && currentTime <= words[i].end) {
			currentWordIndex = i;
			break;
		}
	}

	// If between words, use the last word
	if (currentWordIndex === -1) {
		for (let i = words.length - 1; i >= 0; i--) {
			if (currentTime >= words[i].start) {
				currentWordIndex = i;
				break;
			}
		}
	}

	const active: string[] = [];
	const highlighted: string[] = [];
	const allElementIds = new Set(mappings.map((m) => m.elementId));

	// Check each mapping
	for (const mapping of mappings) {
		const [startIdx, endIdx] = mapping.wordRange;
		const isActive =
			currentWordIndex >= startIdx && currentWordIndex <= endIdx;

		if (isActive) {
			active.push(mapping.elementId);
			if (mapping.emphasis === "strong") {
				highlighted.push(mapping.elementId);
			}
		}
	}

	// Dim elements that are not active
	const dimmed = Array.from(allElementIds).filter(
		(id) => !active.includes(id)
	);

	return {
		show: active.length > 0 ? active : Array.from(allElementIds), // Show all if nothing active
		highlight: highlighted,
		dim: dimmed,
	};
}

/**
 * Auto-generate mappings from trigger words (fuzzy matching fallback)
 * This can help create initial mappings when word ranges aren't manually set
 */
export function findWordRangesFromTriggers(
	words: WordTiming[],
	mapping: SvgElementMapping
): [number, number] | null {
	if (!mapping.triggerWords || mapping.triggerWords.length === 0) {
		return null;
	}

	let startIdx = -1;
	let endIdx = -1;

	// Find first occurrence of any trigger word
	for (let i = 0; i < words.length; i++) {
		const wordText = words[i].text.toLowerCase();
		const matchesTrigger = mapping.triggerWords.some((trigger) =>
			wordText.includes(trigger.toLowerCase())
		);

		if (matchesTrigger && startIdx === -1) {
			startIdx = i;
		}

		if (matchesTrigger) {
			endIdx = i;
		}
	}

	// Extend range to include surrounding context (2 words before, 5 words after)
	if (startIdx !== -1) {
		startIdx = Math.max(0, startIdx - 2);
		endIdx = Math.min(words.length - 1, endIdx + 5);
		return [startIdx, endIdx];
	}

	return null;
}
