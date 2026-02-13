// Auto-generated course content from SSML pipeline
// Course: Agentic Ai For Beginners
// Generated: 2026-01-26T02:00:41.995Z

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
	animation?: "git-machine" | "none";
	leftTitle?: string;
	leftItems?: string[];
	rightTitle?: string;
	rightItems?: string[];
	scene?: string;
}

export interface ModuleContent {
	moduleNumber: number;
	courseId: string;
	title: string;
	subtitle: string;
	slides: SlideContent[];
}

export const module1Content: ModuleContent = {
	moduleNumber: 1,
	courseId: "agentic-ai-for-beginners",
	title: "",
	subtitle: "Module 1: ",
	slides: [
		{
			name: "module-1-title",
			type: "title",
			script: "Welcome to Module 1: ",
			title: "",
		},
	],
};

export const module2Content: ModuleContent = {
	moduleNumber: 2,
	courseId: "agentic-ai-for-beginners",
	title: "",
	subtitle: "Module 2: ",
	slides: [
		{
			name: "module-2-title",
			type: "title",
			script: "Welcome to Module 2: ",
			title: "",
		},
	],
};

export const module3Content: ModuleContent = {
	moduleNumber: 3,
	courseId: "agentic-ai-for-beginners",
	title: "",
	subtitle: "Module 3: ",
	slides: [
		{
			name: "module-3-title",
			type: "title",
			script: "Welcome to Module 3: ",
			title: "",
		},
	],
};

export const module4Content: ModuleContent = {
	moduleNumber: 4,
	courseId: "agentic-ai-for-beginners",
	title: "",
	subtitle: "Module 4: ",
	slides: [
		{
			name: "module-4-title",
			type: "title",
			script: "Welcome to Module 4: ",
			title: "",
		},
	],
};

export const module5Content: ModuleContent = {
	moduleNumber: 5,
	courseId: "agentic-ai-for-beginners",
	title: "",
	subtitle: "Module 5: ",
	slides: [
		{
			name: "module-5-title",
			type: "title",
			script: "Welcome to Module 5: ",
			title: "",
		},
	],
};

export const module6Content: ModuleContent = {
	moduleNumber: 6,
	courseId: "agentic-ai-for-beginners",
	title: "",
	subtitle: "Module 6: ",
	slides: [
		{
			name: "module-6-title",
			type: "title",
			script: "Welcome to Module 6: ",
			title: "",
		},
	],
};

export const allModules: ModuleContent[] = [
	module1Content,
	module2Content,
	module3Content,
	module4Content,
	module5Content,
	module6Content
];