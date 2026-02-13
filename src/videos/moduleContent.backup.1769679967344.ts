// Auto-generated course content by AI Planner
// Course: AI Solo Hustle Shorts
// Generated: 2026-01-29T09:32:45.150Z

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
	courseId: "ai-solo-hustle-shorts",
	title: "The Next Billion Dollar Startup Is One Person + AI",
	subtitle: "Here’s why solo founders are about to dominate",
	videoCategory: "short",
	slides: [
		{
			name: "hook-slide",
			type: "title",
			script: "Why the next billion dollar startup needs zero cofounders",
			title: "One Person + AI = $$$",
		},
		{
			name: "solo-power",
			type: "content-two-card",
			script: "Solo founders + AI tools crush old team limits",
			title: "Solo Founder Advantages",
			points: ["Move faster","Cut costs","Automate everything","Scale alone"],
		},
		{
			name: "ai-scale",
			type: "content-two-card",
			script: "AI turns one brain into a hundred doing the work",
			title: "AI Powers Solo Scale",
			points: ["Instant research","Code in seconds","Marketing autopilot","24/7 productivity"],
		},
		{
			name: "bold-claim",
			type: "title",
			script: "Forget teams. AI-fueled solos will rewrite startup rules.",
			title: "Solo + AI = Startup Revolution",
		},
		{
			name: "cta-slide",
			type: "title",
			script: "Want to build solo? Start now. AI’s your secret weapon.",
			title: "Try It. Follow for More.",
		},
	]
};

export const allModules: ModuleContent[] = [
	module1Content
];