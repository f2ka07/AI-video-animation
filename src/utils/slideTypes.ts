// Slide type definitions for reusable slide configurations
// This makes it easy to create consistent slides across modules

export type SlideType = "title" | "content-two-card" | "content-single" | "code" | "code-diagram" | "comparison" | "sequential-bullet";

export interface SlideConfig {
	type: SlideType;
	title: string;
	points?: string[];
	code?: string;
	language?: string;
	leftItems?: string[];
	rightItems?: string[];
	slideName: string;
	imageSrc?: string; // For two-card layout
}

// Slide type configurations
export const slideTypes = {
	// Two-card content slide (like slide 2 - whyIaC)
	"content-two-card": {
		component: "AnimatedContentSlide",
		layout: "two-card",
		hasImage: true,
	},
	// Single-column content slide
	"content-single": {
		component: "AnimatedContentSlide",
		layout: "single",
		hasImage: false,
	},
	// Code slide
	code: {
		component: "AnimatedCodeSlide",
		layout: "code",
		hasImage: false,
	},
	// Code slide with diagram
	"code-diagram": {
		component: "CodeAndDiagram",
		layout: "code-diagram",
		hasImage: false,
	},
	// Comparison slide
	comparison: {
		component: "AnimatedComparisonSlide",
		layout: "comparison",
		hasImage: false,
	},
	// Title slide
	title: {
		component: "TitleSlide",
		layout: "title",
		hasImage: false,
	},
	// Sequential bullet slide - shows one bullet at a time with transitions
	"sequential-bullet": {
		component: "SequentialBulletSlide",
		layout: "sequential",
		hasImage: false,
	},
};
