// AI Course Planner - Generates moduleContent.ts structure from natural language
// Uses OpenAI GPT-4 to plan course slides with proper timing constraints
//
// Usage:
//   npm run plan-course -- "Create a course about Docker fundamentals"
//   npm run plan-course -- --structured (interactive mode)

import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";

// Udemy-quality: allow deeper explanations per slide
const MAX_WORDS_PER_SLIDE = 90;
const MAX_SECONDS_PER_SLIDE = 40;
const TARGET_WORDS_PER_SLIDE = 65; // 50-90 range for full explanations
const MIN_WORDS_PER_SLIDE_ERROR = 35; // Below this feels shallow

// Course length targets (Udemy-quality comprehensive courses)
const TARGET_COURSE_MINUTES = 60; // 1 hour minimum for comprehensive courses
const MIN_SLIDES_TOTAL = 120; // Minimum for comprehensive coverage
const TARGET_SLIDES_PER_MODULE = 14; // 10-18 slides per module for depth
const MIN_SLIDES_PER_MODULE_ERROR = 10; // Below this is too sparse

interface SlideContent {
	name: string;
	type: "title" | "content-two-card" | "content-single" | "code" | "comparison";
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
}

interface ModuleContent {
	moduleNumber: number;
	courseId: string;  // Course this module belongs to (for audio/video paths)
	title: string;
	subtitle: string;
	slides: SlideContent[];
}

interface PlannerInput {
	prompt?: string;
	title?: string;
	description?: string;
	targetAudience?: string;
	keyTopics?: string[];
	moduleCount?: number;
	slidesPerModule?: number;
}

interface PlannerOutput {
	courseName: string;
	courseId: string;
	modules: ModuleContent[];
}

// Count words in a script
function countWords(text: string): number {
	return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

// Estimate speaking duration (seconds) from word count
function estimateDuration(text: string): number {
	const words = countWords(text);
	return Math.ceil(words / 2.5); // 2.5 words per second average
}

// Quality thresholds
const MIN_CODE_SLIDE_RATIO = 0.30; // At least 30% code slides for technical content
const MIN_WORDS_WARNING = 45; // Warning if below this (could use more detail)

// Validate scripts and content quality
function validateScripts(modules: ModuleContent[]): { valid: boolean; errors: string[]; warnings: string[]; stats: any } {
	const errors: string[] = [];
	const warnings: string[] = [];
	
	let totalSlides = 0;
	let totalWords = 0;
	let slidesUnderMinWords = 0;
	
	for (const mod of modules) {
		totalSlides += mod.slides.length;
		
		// Check minimum slides per module - ERROR if too few
		if (mod.slides.length < MIN_SLIDES_PER_MODULE_ERROR) {
			errors.push(
				`Module ${mod.moduleNumber}: Only ${mod.slides.length} slides (minimum: ${MIN_SLIDES_PER_MODULE_ERROR}). Break down topics into more slides.`
			);
		} else if (mod.slides.length < TARGET_SLIDES_PER_MODULE) {
			warnings.push(
				`Module ${mod.moduleNumber}: ${mod.slides.length} slides (target: ${TARGET_SLIDES_PER_MODULE}). Consider adding more depth.`
			);
		}
		
		// Check code slide ratio
		const codeSlides = mod.slides.filter(s => s.type === 'code' || s.type === 'code-diagram').length;
		const codeRatio = mod.slides.length > 0 ? codeSlides / mod.slides.length : 0;
		if (codeRatio < MIN_CODE_SLIDE_RATIO && mod.slides.length > 2) {
			warnings.push(
				`Module ${mod.moduleNumber}: Only ${codeSlides}/${mod.slides.length} code slides (${Math.round(codeRatio * 100)}%). Add more code examples.`
			);
		}
		
		for (const slide of mod.slides) {
			const words = countWords(slide.script);
			const duration = estimateDuration(slide.script);
			totalWords += words;
			
			// Check maximum words (warning - consider splitting into multiple slides)
			if (words > MAX_WORDS_PER_SLIDE) {
				warnings.push(
					`Module ${mod.moduleNumber}, "${slide.name}": ${words} words (max ${MAX_WORDS_PER_SLIDE}). Consider splitting into 2 slides.`
				);
			}
			
			// Check minimum words - ERROR if way too short (rushed content)
			if (words < MIN_WORDS_PER_SLIDE_ERROR && slide.type !== 'title') {
				errors.push(
					`Module ${mod.moduleNumber}, "${slide.name}": Only ${words} words (~${duration}s) - TOO SHORT, expand content`
				);
				slidesUnderMinWords++;
			} else if (words < MIN_WORDS_WARNING && slide.type !== 'title') {
				warnings.push(
					`Module ${mod.moduleNumber}, "${slide.name}": ${words} words (~${duration}s) - could use more detail`
				);
			}
		}
	}
	
	// Calculate course duration
	const avgWordsPerSlide = totalSlides > 0 ? totalWords / totalSlides : 0;
	const estimatedDurationSec = totalWords / 2.5; // 2.5 words per second
	const estimatedDurationMin = estimatedDurationSec / 60;
	
	// Check total course length
	if (totalSlides < MIN_SLIDES_TOTAL) {
		errors.push(
			`Course has only ${totalSlides} slides (~${Math.round(estimatedDurationMin)} min). Need at least ${MIN_SLIDES_TOTAL} slides for a comprehensive course.`
		);
	}
	
	if (estimatedDurationMin < TARGET_COURSE_MINUTES * 0.5) {
		errors.push(
			`Course is only ~${Math.round(estimatedDurationMin)} minutes. Target is ${TARGET_COURSE_MINUTES}+ minutes for professional content.`
		);
	} else if (estimatedDurationMin < TARGET_COURSE_MINUTES) {
		warnings.push(
			`Course is ~${Math.round(estimatedDurationMin)} minutes. Consider adding more content to reach ${TARGET_COURSE_MINUTES}+ minutes.`
		);
	}
	
	const stats = {
		totalSlides,
		totalWords,
		avgWordsPerSlide: Math.round(avgWordsPerSlide),
		estimatedDurationMin: Math.round(estimatedDurationMin),
		slidesUnderMinWords
	};
	
	return { valid: errors.length === 0, errors, warnings, stats };
}

// Build the system prompt for the LLM
function buildSystemPrompt(): string {
	return `You are an expert course content planner. Create UDEMY-QUALITY courses: comprehensive, beginner-friendly, and ready to publish with no further editing. The goal is a full learning experience that a complete beginner can follow and understand, not just narration over slides. Return valid JSON.

QUALITY TARGET:
- Output should be publishable as-is. No shallow placeholders.
- Every concept explained fully. Beginner with zero prior knowledge should understand.
- Depth over breadth. Split complex concepts across multiple slides. One idea per slide, fully explained.

SCRIPT LENGTH (per slide):
- Use 50-90 words per slide. Use as many as needed to explain completely.
- Maximum ${MAX_WORDS_PER_SLIDE} words. If a concept needs more, split into 2-3 slides.
- Each slide teaches ONE thing completely. Do NOT rush.

COURSE LENGTH:
- Target: 1+ hour total course (~${TARGET_COURSE_MINUTES} min)
- Each module: ${TARGET_SLIDES_PER_MODULE}+ slides (minimum ${MIN_SLIDES_PER_MODULE_ERROR})
- Total: ${MIN_SLIDES_TOTAL}+ slides for comprehensive coverage

SLIDE TYPES:
1. "title" - Module intro (what we'll learn, why it matters)
2. "content-two-card" - Explanation with bullet points (title, script, points[])
3. "code" - Code example WITH full explanation in script (title, script, code, language)
4. "code-diagram" - Code with visual (title, script, code, language, scene)
5. "comparison" - Two-column (title, script, leftTitle, leftItems[], rightTitle, rightItems[])

BULLET POINTS: Extract from script using EXACT phrases (3-8 words each). Max 4 per slide.

SLIDE STRUCTURE:
- 35%+ code slides for technical courses. Every concept needs working code.
- Pattern: Concept (with analogy) -> Code example -> Line-by-line explanation -> Tips/gotchas -> Next concept
- For code slides: ALWAYS include actual code in "code" field. No placeholders.
- Code slides: use multiple lines (with comments) when the script describes "first line", "next line", etc. Match script to code structure.

CONTENT DEPTH:
- Define every term before using it. Use analogies.
- After code: explain what each part does. Include "why" and "when to use".
- Mention common beginner mistakes.

MODULE TITLE AND SUBTITLE: No "Module 1" or numbers. Use topic title + descriptive subtitle.

OUTPUT FORMAT:
{
  "courseName": "Course Title",
  "courseId": "course-id-with-dashes",
  "modules": [
    {
      "moduleNumber": 1,
      "title": "Topic Title",
      "subtitle": "Descriptive one-liner",
      "slides": [
        {
          "name": "unique-slide-name",
          "type": "title|content-two-card|code|comparison",
          "script": "50-90 word narration. Explain fully.",
          "title": "Slide Title",
          "points": ["phrase from script", "another phrase"],
          "code": "actual code for code slides",
          "language": "python|javascript|bash|etc"
        }
      ]
    }
  ]
}

LAST SLIDE: Creative conclusion title (e.g. "The Big Takeaway"). No "Module Summary". Professor-level insight.

AUDIO / NARRATION OPTIMIZATION:
- Scripts will be spoken aloud (TTS or voiceover). Write for the ear, not the eye.
- Vary sentence length: mix short punchy sentences with longer explanatory ones. Avoid long run-ons.
- Hook the first sentence of each slide: start with the insight or question, not setup.
- Spell out acronyms on first use when it helps clarity (e.g., "RAG, or Retrieval-Augmented Generation").
- Use contractions (it's, we're, don't) - they sound more natural when spoken.
- Avoid tongue-twisters and dense jargon clusters. If technical, follow with plain-language restatement.
- End key slides with a clear takeaway phrase the listener can remember.

CRITICAL - AVOID:
- Shallow slides (under 40 words when concept needs more)
- Code slides without actual code
- Jargon without definition
- Assuming prior knowledge
- Fewer than ${MIN_SLIDES_PER_MODULE_ERROR} slides per module`;
}

// Build the user prompt
function buildUserPrompt(input: PlannerInput): string {
	if (input.prompt && !input.title) {
		// Simple prompt mode
		return `Create a Udemy-quality video course based on this request:

"${input.prompt}"

CRITICAL REQUIREMENTS:
- Generate 6-12 modules for thorough coverage
- Each module: ${TARGET_SLIDES_PER_MODULE}+ slides (minimum ${MIN_SLIDES_PER_MODULE_ERROR})
- Total: ${MIN_SLIDES_TOTAL}+ slides (comprehensive, ~1 hour)
- Each slide: 50-90 words. Use as many as needed to explain fully.
- Include plenty of code examples (at least 30% code slides)
- Break down every concept into multiple slides
- Explain EVERYTHING thoroughly - assume viewer knows nothing
- Make content feel complete, professional, and thorough

DO NOT create a short course. The course MUST be comprehensive enough to take 1+ hour to complete.`;
	}
	
	// Structured mode
	let prompt = `Create a COMPREHENSIVE video course (1+ hour) with the following specifications:\n\n`;
	
	if (input.title) prompt += `Title: ${input.title}\n`;
	if (input.description) prompt += `Description: ${input.description}\n`;
	if (input.targetAudience) prompt += `Target Audience: ${input.targetAudience}\n`;
	if (input.keyTopics?.length) prompt += `Key Topics to Cover:\n${input.keyTopics.map(t => `- ${t}`).join('\n')}\n`;
	if (input.moduleCount) prompt += `Number of Modules: ${input.moduleCount} (each with ${TARGET_SLIDES_PER_MODULE}+ slides)\n`;
	if (input.slidesPerModule) prompt += `Slides per Module: ${input.slidesPerModule} (minimum ${MIN_SLIDES_PER_MODULE_ERROR})\n`;
	
	prompt += `
CRITICAL - UDEMY QUALITY:
- Total slides: ${MIN_SLIDES_TOTAL}+ for comprehensive coverage
- Each module: ${TARGET_SLIDES_PER_MODULE}+ slides (minimum ${MIN_SLIDES_PER_MODULE_ERROR})
- Each script: 50-90 words. Use as many as needed to explain fully.
- Include actual code for every code slide. No placeholders.
- Depth over breadth. Assume zero prior knowledge.
- Course MUST take 1+ hour to complete`;
	
	return prompt;
}

// Model: gpt-4o for Udemy-quality comprehensive courses
const MODEL_MINI = "gpt-4o";
const MODEL_FULL = "gpt-4o"; // Same model; --full kept for CLI compatibility
let useFullModel = false;

// Call OpenAI API
async function callOpenAI(systemPrompt: string, userPrompt: string): Promise<string> {
	const apiKey = process.env.OPENAI_API_KEY;
	if (!apiKey) {
		throw new Error("OPENAI_API_KEY environment variable is required");
	}
	
	const model = useFullModel ? MODEL_FULL : MODEL_MINI;
	console.log(`\nCalling OpenAI ${model}...`);
	
	const response = await fetch("https://api.openai.com/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model,
			messages: [
				{ role: "system", content: systemPrompt },
				{ role: "user", content: userPrompt }
			],
			temperature: 0.6,
			max_completion_tokens: 16384,
			response_format: { type: "json_object" }
		})
	});
	
	if (!response.ok) {
		const error = await response.text();
		throw new Error(`OpenAI API error: ${response.status} - ${error}`);
	}
	
	const data = await response.json() as any;
	return data.choices[0].message.content;
}

// Parse and validate the LLM response
function parseResponse(jsonString: string): PlannerOutput {
	try {
		const parsed = JSON.parse(jsonString);
		
		if (!parsed.courseName || !parsed.courseId || !parsed.modules) {
			throw new Error("Invalid response structure: missing courseName, courseId, or modules");
		}
		
		// Validate each module and fix backslash issues
		for (const mod of parsed.modules) {
			if (!mod.moduleNumber || !mod.title || !mod.slides) {
				throw new Error(`Invalid module structure in module ${mod.moduleNumber}`);
			}
			
			for (const slide of mod.slides) {
				if (!slide.name || !slide.type || !slide.script) {
					throw new Error(`Invalid slide structure in module ${mod.moduleNumber}`);
				}
				
				// Fix improperly escaped backslashes in scripts
				if (slide.script) {
					slide.script = slide.script.replace(/\\(?![nrt"\\])/g, '\\\\');
				}
				
				// Warn about potentially truncated scripts
				const scriptText = slide.script || '';
				if (scriptText.endsWith('\\')) {
					console.warn(`Warning: Script in module ${mod.moduleNumber}, slide "${slide.name}" may be truncated (ends with backslash)`);
				}
				
				const words = countWords(scriptText);
				if (words < 20 && slide.type !== 'title') {
					console.warn(`Warning: Script in module ${mod.moduleNumber}, slide "${slide.name}" is very short (${words} words)`);
				}
			}
		}
		
		return parsed as PlannerOutput;
	} catch (e: any) {
		throw new Error(`Failed to parse LLM response: ${e.message}`);
	}
}

// Generate moduleContent.ts code
function generateModuleContentCode(output: PlannerOutput, courseId: string): string {
	const lines: string[] = [
		`// Auto-generated course content by AI Planner`,
		`// Course: ${output.courseName}`,
		`// Generated: ${new Date().toISOString()}`,
		``,
		`export interface SlideContent {`,
		`	name: string;`,
		`	type: "title" | "content-two-card" | "content-single" | "code" | "code-diagram" | "comparison";`,
		`	script: string;`,
		`	title?: string;`,
		`	subtitle?: string;`,
		`	points?: string[];`,
		`	code?: string;`,
		`	language?: string;`,
		`	imageSrc?: string;`,
		`	leftTitle?: string;`,
		`	leftItems?: string[];`,
		`	rightTitle?: string;`,
		`	rightItems?: string[];`,
		`	scene?: string;`,
		`}`,
		``,
		`export interface ModuleContent {`,
		`	moduleNumber: number;`,
		`	courseId: string;  // Course this module belongs to (for audio/video paths)`,
		`	title: string;`,
		`	subtitle: string;`,
		`	slides: SlideContent[];`,
		`}`,
		``
	];
	
	// Generate each module
	for (const mod of output.modules) {
		lines.push(`export const module${mod.moduleNumber}Content: ModuleContent = {`);
		lines.push(`	moduleNumber: ${mod.moduleNumber},`);
		lines.push(`	courseId: ${JSON.stringify(courseId)},`);
		lines.push(`	title: ${JSON.stringify(mod.title)},`);
		lines.push(`	subtitle: ${JSON.stringify(mod.subtitle)},`);
		lines.push(`	slides: [`);
		
		for (const slide of mod.slides) {
			lines.push(`		{`);
			lines.push(`			name: ${JSON.stringify(slide.name)},`);
			lines.push(`			type: ${JSON.stringify(slide.type)},`);
			lines.push(`			script: ${JSON.stringify(slide.script)},`);
			
			if (slide.title) lines.push(`			title: ${JSON.stringify(slide.title)},`);
			if (slide.subtitle) lines.push(`			subtitle: ${JSON.stringify(slide.subtitle)},`);
			if (slide.points) lines.push(`			points: ${JSON.stringify(slide.points)},`);
			if (slide.code) lines.push(`			code: ${JSON.stringify(slide.code)},`);
			if (slide.language) lines.push(`			language: ${JSON.stringify(slide.language)},`);
			if (slide.imageSrc) lines.push(`			imageSrc: ${JSON.stringify(slide.imageSrc)},`);
			if (slide.leftTitle) lines.push(`			leftTitle: ${JSON.stringify(slide.leftTitle)},`);
			if (slide.leftItems) lines.push(`			leftItems: ${JSON.stringify(slide.leftItems)},`);
			if (slide.rightTitle) lines.push(`			rightTitle: ${JSON.stringify(slide.rightTitle)},`);
			if (slide.rightItems) lines.push(`			rightItems: ${JSON.stringify(slide.rightItems)},`);
			
			lines.push(`		},`);
		}
		
		lines.push(`	]`);
		lines.push(`};`);
		lines.push(``);
	}
	
	// Generate allModules export
	const moduleNames = output.modules.map(m => `module${m.moduleNumber}Content`);
	lines.push(`export const allModules: ModuleContent[] = [`);
	lines.push(`	${moduleNames.join(',\n\t')}`);
	lines.push(`];`);
	
	return lines.join('\n');
}

// Update courses.json with the new course
function updateCoursesJson(output: PlannerOutput): void {
	const coursesPath = path.join(__dirname, '..', 'courses.json');
	let coursesData: any = { courses: [], courseModuleMapping: {} };
	
	if (fs.existsSync(coursesPath)) {
		coursesData = JSON.parse(fs.readFileSync(coursesPath, 'utf-8'));
	}
	
	// Check if course already exists
	const existingIndex = coursesData.courses.findIndex((c: any) => c.id === output.courseId);
	
	const courseEntry = {
		id: output.courseId,
		title: output.courseName,
		description: `AI-generated course: ${output.courseName}`,
		moduleCount: output.modules.length,
		status: 'active',
		archivedAt: null
	};
	
	if (existingIndex >= 0) {
		coursesData.courses[existingIndex] = courseEntry;
	} else {
		coursesData.courses.push(courseEntry);
	}
	
	// Update module mapping
	coursesData.courseModuleMapping[output.courseId] = output.modules.map(m => m.moduleNumber);
	
	fs.writeFileSync(coursesPath, JSON.stringify(coursesData, null, 2));
	console.log(`Updated courses.json with "${output.courseName}"`);
}

// Main planning function
export async function planCourse(input: PlannerInput): Promise<PlannerOutput> {
	const systemPrompt = buildSystemPrompt();
	const userPrompt = buildUserPrompt(input);
	
	console.log("Planning course with input:");
	console.log(input.prompt || input.title || "Structured input");
	
	const response = await callOpenAI(systemPrompt, userPrompt);
	const output = parseResponse(response);
	
	// Validate scripts and content quality
	const validation = validateScripts(output.modules);
	
	// Print summary first
	console.log("\n" + "=".repeat(60));
	console.log("COURSE PLAN GENERATED");
	console.log("=".repeat(60));
	console.log(`Course: ${output.courseName}`);
	console.log(`ID: ${output.courseId}`);
	console.log(`Modules: ${output.modules.length}`);
	
	for (const mod of output.modules) {
		console.log(`  Module ${mod.moduleNumber}: ${mod.title} (${mod.slides.length} slides)`);
	}
	
	console.log("");
	console.log(`DURATION STATS:`);
	console.log(`  Total Slides: ${validation.stats.totalSlides}`);
	console.log(`  Total Words: ${validation.stats.totalWords}`);
	console.log(`  Avg Words/Slide: ${validation.stats.avgWordsPerSlide}`);
	console.log(`  Est. Duration: ~${validation.stats.estimatedDurationMin} minutes`);
	console.log("=".repeat(60));
	
	if (validation.warnings.length > 0) {
		console.log("\nQUALITY SUGGESTIONS:");
		validation.warnings.forEach(w => console.log(`  - ${w}`));
	}
	
	if (!validation.valid) {
		console.warn("\n" + "!".repeat(60));
		console.warn("ERRORS - COURSE NEEDS MORE CONTENT:");
		console.warn("!".repeat(60));
		validation.errors.forEach(e => console.warn(`  - ${e}`));
		console.warn("\nThis plan will produce a LOW QUALITY course. Re-generate with more slides and longer scripts.");
	}
	
	return output;
}

// CLI interface
async function main() {
	const args = process.argv.slice(2);
	
	if (args.includes('--help') || args.includes('-h')) {
		console.log(`
AI Course Planner - Generate course content from natural language

Usage:
  npm run plan-course -- "Your course idea"
  npm run plan-course -- --structured
  npm run plan-course -- --title "Title" --topics "Topic1,Topic2"

Options:
  --structured       Interactive mode with prompts
  --title <title>    Course title
  --description <d>  Course description
  --topics <t1,t2>   Comma-separated key topics
  --modules <n>      Number of modules (default: auto)
  --output <path>    Output path (default: src/videos/moduleContent.ts)
  --preview          Preview only, don't write files
  --full             Use full model (same as default: gpt-4o for Udemy quality)
`);
		process.exit(0);
	}
	
	let input: PlannerInput = {};
	let outputPath = path.join(__dirname, '..', 'src', 'videos', 'moduleContent.ts');
	let preview = false;
	
	// Parse arguments
	for (let i = 0; i < args.length; i++) {
		const arg = args[i];
		
		if (arg === '--structured') {
			// Interactive mode
			const rl = readline.createInterface({
				input: process.stdin,
				output: process.stdout
			});
			
			const question = (q: string): Promise<string> => new Promise(r => rl.question(q, r));
			
			input.title = await question('Course title: ');
			input.description = await question('Course description: ');
			input.targetAudience = await question('Target audience: ');
			const topics = await question('Key topics (comma-separated): ');
			input.keyTopics = topics.split(',').map(t => t.trim()).filter(t => t);
			const modules = await question('Number of modules (or press Enter for auto): ');
			if (modules) input.moduleCount = parseInt(modules);
			
			rl.close();
		} else if (arg === '--title' && args[i + 1]) {
			input.title = args[++i];
		} else if (arg === '--description' && args[i + 1]) {
			input.description = args[++i];
		} else if (arg === '--topics' && args[i + 1]) {
			input.keyTopics = args[++i].split(',').map(t => t.trim());
		} else if (arg === '--modules' && args[i + 1]) {
			input.moduleCount = parseInt(args[++i]);
		} else if (arg === '--output' && args[i + 1]) {
			outputPath = args[++i];
		} else if (arg === '--preview') {
			preview = true;
		} else if (arg === '--full') {
			useFullModel = true;
		} else if (!arg.startsWith('--')) {
			input.prompt = arg;
		}
	}
	
	if (!input.prompt && !input.title) {
		console.error('Error: Please provide a course prompt or use --structured mode');
		process.exit(1);
	}
	
	try {
		const output = await planCourse(input);
		const code = generateModuleContentCode(output, output.courseId);
		
		if (preview) {
			console.log("\n--- PREVIEW (not saved) ---\n");
			console.log(code.substring(0, 2000) + "\n...(truncated)");
		} else {
			// Backup existing file
			if (fs.existsSync(outputPath)) {
				const backupPath = outputPath.replace('.ts', `.backup.${Date.now()}.ts`);
				fs.copyFileSync(outputPath, backupPath);
				console.log(`Backed up existing file to ${path.basename(backupPath)}`);
			}
			
			fs.writeFileSync(outputPath, code);
			console.log(`\nWritten to: ${outputPath}`);
			
			// Update courses.json
			updateCoursesJson(output);
			
			console.log(`\nNext steps:`);
			console.log(`  1. Review and edit: ${outputPath}`);
			console.log(`  2. npm run generate-modules`);
			console.log(`  3. npm run gui (or follow the processing wizard)`);
		}
	} catch (error: any) {
		console.error('Error:', error.message);
		process.exit(1);
	}
}

// Run if called directly
if (require.main === module) {
	main();
}
