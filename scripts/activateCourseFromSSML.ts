// Activate a course from its SSML/script files into moduleContent.ts
// This bridges the course folder structure to the GUI workflow
//
// Usage:
//   npx tsx scripts/activateCourseFromSSML.ts <course-id>
//
// Example:
//   npx tsx scripts/activateCourseFromSSML.ts agentic-ai-for-beginners

import * as fs from "fs";
import * as path from "path";

interface Section {
	name: string;
	type: "title" | "content-single" | "content-two-card";
	script: string;
	title: string;
	points?: string[];
}

interface ModuleData {
	moduleNumber: number;
	title: string;
	subtitle: string;
	sections: Section[];
}

// Parse a module script file into sections
function parseModuleScript(content: string, moduleNumber: number): ModuleData {
	const lines = content.split("\n").map(l => l.replace(/\r/g, "")); // Handle CRLF
	let title = "";
	let subtitle = "";
	const sections: Section[] = [];

	// Extract title - search first few lines for "Module XX: Title"
	for (let i = 0; i < Math.min(5, lines.length); i++) {
		const line = lines[i].trim();
		const match = line.match(/Module\s*\d+\s*:\s*(.+)/i);
		if (match) {
			title = match[1].trim();
			break;
		}
	}

	// Legacy fallback
	const titleMatch = title ? null : lines[0]?.match(/^Module\s+\d+:\s*(.+)$/i);
	if (titleMatch) {
		title = titleMatch[1].trim();
	}

	// Find sections marked with [SECTION_NAME]
	let currentSection: { name: string; content: string[] } | null = null;
	const sectionPattern = /^\[([A-Z][A-Z\s]+)\]$/;

	for (const line of lines) {
		const trimmedLine = line.trim();
		const sectionMatch = trimmedLine.match(sectionPattern);
		
		if (sectionMatch) {
			// Save previous section
			if (currentSection && currentSection.content.length > 0) {
				sections.push(createSection(currentSection, moduleNumber, sections.length));
			}
			currentSection = {
				name: sectionMatch[1].trim(),
				content: [],
			};
		} else if (currentSection) {
			// Skip empty lines, separators, and metadata
			if (trimmedLine && 
				!trimmedLine.startsWith("---") && 
				!trimmedLine.startsWith("Metadata") &&
				!trimmedLine.match(/^(Target Runtime|Script Length|Voice|Word Count):/i) &&
				!trimmedLine.match(/^Module\s+\d+:/i)) {
				currentSection.content.push(trimmedLine);
			}
		}
	}

	// Don't forget last section
	if (currentSection && currentSection.content.length > 0) {
		sections.push(createSection(currentSection, moduleNumber, sections.length));
	}

	// If no sections found, create one from all content
	if (sections.length === 0) {
		const allContent = lines
			.filter(l => l.trim() && !l.match(/^(Module|Metadata|Target|Script|Voice|Word|---|\[)/i))
			.map(l => l.trim());
		if (allContent.length > 0) {
			sections.push({
				name: `module-${moduleNumber}-content`,
				type: "content-single",
				script: allContent.join(" "),
				title: "Content",
			});
		}
	}

	// Create title slide as first section
	const introSection = sections.find(s => s.name.toLowerCase().includes("intro"));
	const titleSlide: Section = {
		name: `module-${moduleNumber}-title`,
		type: "title",
		script: introSection?.script || sections[0]?.script || `Welcome to Module ${moduleNumber}: ${title}`,
		title: title,
		points: extractKeyPoints(sections.slice(0, 3)),
	};

	subtitle = `Module ${moduleNumber}: ${title}`;

	// Remove intro section if we used it for title, keep others
	const contentSections = sections.filter(s => !s.name.toLowerCase().includes("intro"));

	return {
		moduleNumber,
		title,
		subtitle,
		sections: [titleSlide, ...contentSections],
	};
}

function createSection(
	section: { name: string; content: string[] },
	moduleNumber: number,
	index: number
): Section {
	const script = section.content.join(" ").replace(/\s+/g, " ").trim();
	const sectionName = section.name.toLowerCase().replace(/\s+/g, "-");
	const name = `module-${moduleNumber}-${sectionName}`;

	// Extract bullet points from content
	const points = extractPointsFromContent(section.content);

	return {
		name,
		type: points.length > 0 ? "content-single" : "content-single",
		script,
		title: formatSectionTitle(section.name),
		points: points.length > 0 ? points : undefined,
	};
}

function formatSectionTitle(name: string): string {
	return name
		.toLowerCase()
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

function extractKeyPoints(sections: Section[]): string[] {
	const points: string[] = [];
	for (const section of sections) {
		if (section.points) {
			points.push(...section.points.slice(0, 2));
		}
	}
	return points.slice(0, 4);
}

function extractPointsFromContent(content: string[]): string[] {
	const points: string[] = [];
	for (const line of content) {
		// Look for sentences that could be key points
		if (line.includes(":") && line.length < 100) {
			const parts = line.split(":");
			if (parts.length === 2 && parts[1].trim().length > 10) {
				points.push(parts[1].trim().substring(0, 60));
			}
		}
	}
	// If no explicit points, extract first few sentences
	if (points.length === 0) {
		const fullText = content.join(" ");
		const sentences = fullText.split(/[.!?]+/).filter((s) => s.trim().length > 20);
		for (let i = 0; i < Math.min(4, sentences.length); i++) {
			const sentence = sentences[i].trim();
			if (sentence.length > 10 && sentence.length < 80) {
				points.push(sentence);
			}
		}
	}
	return points.slice(0, 4);
}

// Generate moduleContent.ts code
function generateModuleContentTS(courseId: string, courseName: string, modules: ModuleData[]): string {
	const lines: string[] = [];

	lines.push(`// Auto-generated course content from SSML pipeline`);
	lines.push(`// Course: ${courseName}`);
	lines.push(`// Generated: ${new Date().toISOString()}`);
	lines.push(``);
	lines.push(`export interface SlideContent {`);
	lines.push(`	name: string;`);
	lines.push(`	type: "title" | "content-two-card" | "content-single" | "code" | "code-diagram" | "comparison";`);
	lines.push(`	script: string;`);
	lines.push(`	title?: string;`);
	lines.push(`	subtitle?: string;`);
	lines.push(`	points?: string[];`);
	lines.push(`	code?: string;`);
	lines.push(`	language?: string;`);
	lines.push(`	imageSrc?: string;`);
	lines.push(`	animation?: "git-machine" | "none";`);
	lines.push(`	leftTitle?: string;`);
	lines.push(`	leftItems?: string[];`);
	lines.push(`	rightTitle?: string;`);
	lines.push(`	rightItems?: string[];`);
	lines.push(`	scene?: string;`);
	lines.push(`}`);
	lines.push(``);
	lines.push(`export interface ModuleContent {`);
	lines.push(`	moduleNumber: number;`);
	lines.push(`	courseId: string;`);
	lines.push(`	title: string;`);
	lines.push(`	subtitle: string;`);
	lines.push(`	slides: SlideContent[];`);
	lines.push(`}`);
	lines.push(``);

	const moduleNames: string[] = [];

	for (const module of modules) {
		const varName = `module${module.moduleNumber}Content`;
		moduleNames.push(varName);

		lines.push(`export const ${varName}: ModuleContent = {`);
		lines.push(`	moduleNumber: ${module.moduleNumber},`);
		lines.push(`	courseId: "${courseId}",`);
		lines.push(`	title: ${JSON.stringify(module.title)},`);
		lines.push(`	subtitle: ${JSON.stringify(module.subtitle)},`);
		lines.push(`	slides: [`);

		for (const section of module.sections) {
			lines.push(`		{`);
			lines.push(`			name: ${JSON.stringify(section.name)},`);
			lines.push(`			type: ${JSON.stringify(section.type)},`);
			lines.push(`			script: ${JSON.stringify(section.script)},`);
			lines.push(`			title: ${JSON.stringify(section.title)},`);
			if (section.points && section.points.length > 0) {
				lines.push(`			points: [`);
				for (const point of section.points) {
					lines.push(`				${JSON.stringify(point)},`);
				}
				lines.push(`			],`);
			}
			lines.push(`		},`);
		}

		lines.push(`	],`);
		lines.push(`};`);
		lines.push(``);
	}

	lines.push(`export const allModules: ModuleContent[] = [`);
	lines.push(`	${moduleNames.join(",\n\t")}`);
	lines.push(`];`);

	return lines.join("\n");
}

// Main function
async function activateCourse(courseId: string): Promise<void> {
	const coursePath = path.join(__dirname, "../courses", courseId);
	const scriptsDir = path.join(coursePath, "course/scripts");
	const outputPath = path.join(__dirname, "../src/videos/moduleContent.ts");

	// Validate course exists
	if (!fs.existsSync(coursePath)) {
		console.error(`Course not found: ${courseId}`);
		console.error(`Expected path: ${coursePath}`);
		process.exit(1);
	}

	// Check for scripts directory
	if (!fs.existsSync(scriptsDir)) {
		console.error(`Scripts directory not found: ${scriptsDir}`);
		process.exit(1);
	}

	// Find all module script files
	const scriptFiles = fs.readdirSync(scriptsDir).filter((f) => f.match(/^module\d+\.txt$/));
	scriptFiles.sort((a, b) => {
		const numA = parseInt(a.match(/\d+/)?.[0] || "0");
		const numB = parseInt(b.match(/\d+/)?.[0] || "0");
		return numA - numB;
	});

	if (scriptFiles.length === 0) {
		console.error(`No module scripts found in: ${scriptsDir}`);
		process.exit(1);
	}

	console.log(`\nActivating course: ${courseId}`);
	console.log(`Found ${scriptFiles.length} module scripts\n`);

	// Parse all modules
	const modules: ModuleData[] = [];
	let courseName = courseId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

	for (const file of scriptFiles) {
		const moduleNumber = parseInt(file.match(/\d+/)?.[0] || "0");
		const content = fs.readFileSync(path.join(scriptsDir, file), "utf-8");
		const moduleData = parseModuleScript(content, moduleNumber);
		modules.push(moduleData);

		console.log(`  Module ${moduleNumber}: ${moduleData.title} (${moduleData.sections.length} sections)`);

		// Use first module title to infer course name
		if (moduleNumber === 1 && moduleData.title.includes("Agentic")) {
			courseName = "Agentic AI for Beginners";
		}
	}

	// Backup existing moduleContent.ts
	if (fs.existsSync(outputPath)) {
		const backupPath = outputPath.replace(".ts", `.backup.${Date.now()}.ts`);
		fs.copyFileSync(outputPath, backupPath);
		console.log(`\nBacked up existing file to: ${path.basename(backupPath)}`);
	}

	// Generate new moduleContent.ts
	const code = generateModuleContentTS(courseId, courseName, modules);
	fs.writeFileSync(outputPath, code);

	console.log(`\nWritten: ${outputPath}`);
	console.log(`\nCourse "${courseName}" is now active in the GUI!`);
	console.log(`\nNext steps:`);
	console.log(`  1. Refresh the GUI in your browser`);
	console.log(`  2. Select "${courseName}" from the course dropdown`);
	console.log(`  3. Use Video Processing to generate audio`);
}

// Parse CLI args
const courseId = process.argv[2];

if (!courseId || courseId === "--help") {
	console.log(`
Usage: npx tsx scripts/activateCourseFromSSML.ts <course-id>

Example:
  npx tsx scripts/activateCourseFromSSML.ts agentic-ai-for-beginners

This script:
  1. Reads module scripts from courses/<course-id>/course/scripts/
  2. Converts them to moduleContent.ts format
  3. Activates the course in the GUI
`);
	process.exit(0);
}

activateCourse(courseId);
