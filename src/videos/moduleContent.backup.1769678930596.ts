// Auto-generated course content by AI Planner
// Course: Clawdbot Shorts
// Generated: 2026-01-29T09:12:41.521Z

export interface SlideContent {
	name: string;
	type: "title" | "content-two-card" | "content-single" | "code" | "code-diagram" | "comparison";
	script: string;
	title?: string;
	subtitle?: string;
	points?: string[];
	code?: string;
	language?: string;
	imageSrc?: string;
	leftTitle?: string;
	leftItems?: string[];
	rightTitle?: string;
	rightItems?: string[];
	scene?: string;
}

export interface ModuleContent {
	moduleNumber: number;
	courseId: string;  // Course this module belongs to (for audio/video paths)
	title: string;
	subtitle: string;
	slides: SlideContent[];
	videoCategory?: "standard" | "short"; // "short" = portrait 1080x1920, 5s per slide
}

export const module1Content: ModuleContent = {
	moduleNumber: 1,
	courseId: "clawdbot-shorts",
	title: "We Built Clawdbot Too Early",
	subtitle: "The hype was real. The timing? Not so much.",
	videoCategory: "short",
	slides: [
		{
			name: "hook-early-launch",
			type: "title",
			script: "Built Clawdbot too early? Here’s why it slowed everything down.",
			title: "Why Too Early Kills Innovation",
		},
		{
			name: "tech-wasnt-ready",
			type: "content-two-card",
			script: "Tech wasn’t ready. Expectations were sky-high. Reality hit hard.",
			title: "Early Tech Problems",
			points: ["Unstable AI models","Limited data access","Slow cloud servers","No user feedback"],
		},
		{
			name: "market-not-ready",
			type: "content-two-card",
			script: "Market wasn’t ready. Users didn’t know what to do with it.",
			title: "Market Missed the Memo",
			points: ["No clear use cases","Low adoption rates","Confused early users","Hype > value"],
		},
		{
			name: "lesson-learned",
			type: "title",
			script: "Sometimes being first means being forgotten. Timing beats tech.",
			title: "Timing > First",
		},
		{
			name: "cta-follow",
			type: "title",
			script: "Built too soon? Learn from it. Follow for more startup truths.",
			title: "Try again. Follow for more.",
		},
	]
};

export const allModules: ModuleContent[] = [
	module1Content
];