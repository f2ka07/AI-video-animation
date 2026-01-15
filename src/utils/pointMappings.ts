// Map bullet points to word timings for AnimatedContentSlide
// This ensures perfect sync between speech and bullet point highlights

import { WordTiming } from "./wordTimings";

export interface PointMapping {
	id: string;
	pointIndex: number; // 0-based index of the bullet point
	wordRange: [number, number]; // [startWordIndex, endWordIndex] in words array
}

// Mappings for each slide - maps bullet points to word ranges
// These should be updated based on actual narration content
export const pointMappings: Record<string, PointMapping[]> = {
	whyIaC: [
		// "Repeatable and consistent deployments"
		{ id: "repeatable", pointIndex: 0, wordRange: [7, 18] }, // "One" to "drift"
		// "Version control for infrastructure changes"
		{ id: "version-control", pointIndex: 1, wordRange: [19, 29] }, // "Two" to "production"
		// "Automated provisioning and teardown"
		{ id: "automation", pointIndex: 2, wordRange: [30, 38] }, // "Three" to "work"
		// "Reduced human error and faster recovery"
		{ id: "reduced-error", pointIndex: 3, wordRange: [39, 47] }, // "Four" to "incidents"
		// "Documentation as executable code"
		{ id: "documentation", pointIndex: 4, wordRange: [48, 54] }, // "And" to "execute"
	],
	workflow: [
		// "pulumi init - Initialize a new project"
		{ id: "pulumi-init", pointIndex: 0, wordRange: [8, 12] }, // "Initialize" to "project"
		// "pulumi preview - See planned changes"
		{ id: "pulumi-preview", pointIndex: 1, wordRange: [13, 16] }, // "Preview" to "changes"
		// "pulumi up - Deploy infrastructure"
		{ id: "pulumi-up", pointIndex: 2, wordRange: [17, 20] }, // "Apply" to "A W S"
		// "pulumi destroy - Remove all resources"
		{ id: "pulumi-destroy", pointIndex: 3, wordRange: [21, 24] }, // "pulumi" to "down"
		// "pulumi config - Manage configuration"
		{ id: "pulumi-config", pointIndex: 4, wordRange: [25, 27] }, // "And" to "settings"
	],
	whyTypeScript: [
		// "Type safety catches errors before deployment"
		{ id: "type-safety", pointIndex: 0, wordRange: [2, 7] }, // "Type" to "deployment"
		// "Excellent IDE autocomplete and IntelliSense"
		{ id: "intellisense", pointIndex: 1, wordRange: [8, 11] }, // "IntelliSense" to "authoring"
		// "Rich ecosystem of AWS SDK and libraries"
		{ id: "ecosystem", pointIndex: 2, wordRange: [12, 18] }, // "The" to "SDKs"
		// "Familiar to many developers"
		{ id: "familiar", pointIndex: 3, wordRange: [19, 24] }, // "It" to "engineers"
		// "Easy to test and refactor"
		{ id: "easy-test", pointIndex: 4, wordRange: [25, 32] }, // "And" to "refactor"
	],
	summary: [
		// "IaC provides repeatable, version-controlled infrastructure"
		{ id: "iac-provides", pointIndex: 0, wordRange: [3, 12] }, // "Infrastructure" to "infrastructure"
		// "Pulumi offers better developer experience than traditional tools"
		{ id: "pulumi-offers", pointIndex: 1, wordRange: [13, 20] }, // "Pulumi" to "tools"
		// "TypeScript brings type safety to infrastructure code"
		{ id: "typescript-brings", pointIndex: 2, wordRange: [21, 27] }, // "TypeScript" to "code"
		// "Pulumi workflow: init, preview, up, destroy, config"
		{ id: "workflow", pointIndex: 3, wordRange: [28, 35] }, // "And" to "config"
		// "Next: Project setup and AWS credentials"
		{ id: "next", pointIndex: 4, wordRange: [36, 40] }, // "In" to "deployment"
	],
};

/**
 * Get highlight time for a bullet point based on word timings
 */
export function getPointHighlightTime(
	slideName: string,
	pointIndex: number,
	words: WordTiming[]
): { start: number; end: number } | null {
	const mappings = pointMappings[slideName];
	if (!mappings || !words.length) return null;

	const mapping = mappings.find((m) => m.pointIndex === pointIndex);
	if (!mapping) return null;

	const [startIdx, endIdx] = mapping.wordRange;
	const startWord = words[startIdx];
	const endWord = words[endIdx];

	if (!startWord || !endWord) {
		console.warn(
			`Invalid wordRange [${startIdx}, ${endIdx}] for point ${pointIndex} on slide ${slideName}`
		);
		return null;
	}

	return {
		start: startWord.start,
		end: endWord.end,
	};
}
