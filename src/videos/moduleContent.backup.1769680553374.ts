// Auto-generated course content by AI Planner
// Course: AI Developer Boost Shorts
// Generated: 2026-01-29T09:46:07.337Z

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
	courseId: "ai-developer-boost-shorts",
	title: "AI Tools Are Creating 10x Developers",
	subtitle: "Here’s why coders are leveling up faster than ever",
	videoCategory: "short",
	slides: [
		{
			name: "hook-ai-boost",
			type: "title",
			script: "AI is turning regular devs into 10x coders overnight.",
			title: "AI Tools = 10x Developers",
		},
		{
			name: "speed-vs-brainpower",
			type: "content-two-card",
			script: "Speed alone won’t cut it. AI amps your brainpower too.",
			title: "Speed vs Brainpower",
			points: ["Write code faster","Debug instantly","Get smarter","Solve complex bugs"],
		},
		{
			name: "copy-paste-just-begun",
			type: "content-two-card",
			script: "Copy-paste is old news. AI generates smart code you understand.",
			title: "Copy-Paste? Nah",
			points: ["AI writes context","Learns your style","Suggests fixes","Boosts creativity"],
		},
		{
			name: "collaboration-level-up",
			type: "content-two-card",
			script: "AI is your new teammate. Collaborate with code suggestions in real-time.",
			title: "Your AI Teammate",
			points: ["Instant suggestions","Better code reviews","Faster merges","Less burnout"],
		},
		{
			name: "final-cta",
			type: "title",
			script: "Want to be a 10x dev? Start using AI tools today. Follow now!",
			title: "Try AI. Be 10x.",
		},
	]
};

export const allModules: ModuleContent[] = [
	module1Content
];