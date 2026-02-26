// Activate a course for Remotion rendering
// This script:
// 1. Loads content.json from courses/{courseId}/
// 2. Generates moduleContent.ts from the content
// 3. Copies timings from courses/{courseId}/timings/ to public/timings/
// 4. Regenerates Remotion module components
// 5. Updates courses.json to mark this course as active

import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

interface CourseData {
	courses: Array<{
		id: string;
		title: string;
		description: string;
		moduleCount: number;
		status: "active" | "archived";
		archivedAt: string | null;
	}>;
	courseModuleMapping: Record<string, number[]>;
}

function readCoursesJson(): CourseData {
	const coursesPath = path.join(__dirname, "../courses.json");
	if (fs.existsSync(coursesPath)) {
		return JSON.parse(fs.readFileSync(coursesPath, "utf-8"));
	}
	return { courses: [], courseModuleMapping: {} };
}

function writeCoursesJson(data: CourseData): void {
	const coursesPath = path.join(__dirname, "../courses.json");
	fs.writeFileSync(coursesPath, JSON.stringify(data, null, 2));
}

function generateModuleContentTs(plan: any, courseId: string): string {
	const lines = [
		`// Auto-generated course content by activateCourse.ts`,
		`// Course: ${plan.courseName}`,
		`// Course ID: ${courseId}`,
		`// Activated: ${new Date().toISOString()}`,
		``,
		`export interface SlideContent {`,
		`	name: string;`,
		`	type: "title" | "content-two-card" | "content-single" | "code" | "code-diagram" | "comparison" | "mermaid" | "story-beat";`,
		`	script?: string;`,
		`	scripts?: string[];`,
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
		`	visibleLineRange?: [number, number];`,
		`	codeContext?: string;`,
		`	filePath?: string;`,
		`	beat?: string;`,
		`}`,
		``,
		`export interface ModuleContent {`,
		`	moduleNumber: number;`,
		`	courseId: string;`,
		`	title: string;`,
		`	subtitle: string;`,
		`	slides: SlideContent[];`,
		`}`,
		``
	];
	
	// Generate each module
	for (const mod of plan.modules) {
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
			if (slide.scripts) {
				lines.push(`			scripts: ${JSON.stringify(slide.scripts)},`);
			} else if (slide.script) {
				lines.push(`			script: ${JSON.stringify(slide.script)},`);
			}
			
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
			if (slide.mermaidSource) lines.push(`			mermaidSource: ${JSON.stringify(slide.mermaidSource)},`);
			if (slide.visibleLineRange) lines.push(`			visibleLineRange: ${JSON.stringify(slide.visibleLineRange)},`);
			if (slide.codeContext) lines.push(`			codeContext: ${JSON.stringify(slide.codeContext)},`);
			if (slide.filePath) lines.push(`			filePath: ${JSON.stringify(slide.filePath)},`);
			if (slide.beat) lines.push(`			beat: ${JSON.stringify(slide.beat)},`);

			lines.push(`		},`);
		}
		
		lines.push(`	]`);
		lines.push(`};`);
		lines.push(``);
	}
	
	// Generate allModules export
	const moduleNames = plan.modules.map((m: any) => `module${m.moduleNumber}Content`);
	lines.push(`export const allModules: ModuleContent[] = [`);
	lines.push(`	${moduleNames.join(',\n\t')}`);
	lines.push(`];`);
	
	return lines.join('\n');
}

async function activateCourse(courseId: string) {
	console.log(`\nActivating course: ${courseId}\n`);
	
	const courseDir = path.join(__dirname, "../courses", courseId);
	const contentJsonPath = path.join(courseDir, "content.json");
	const timingsDir = path.join(courseDir, "timings");
	const publicTimingsDir = path.join(__dirname, "../public/timings");
	
	// Step 1: Check course exists
	if (!fs.existsSync(contentJsonPath)) {
		throw new Error(`Course not found: ${courseId}\n  Expected: ${contentJsonPath}`);
	}
	
	console.log("Step 1: Loading content.json...");
	const plan = JSON.parse(fs.readFileSync(contentJsonPath, "utf-8"));
	console.log(`  Loaded: ${plan.courseName} (${plan.modules?.length || 0} modules)`);
	
	// Step 2: Generate moduleContent.ts
	console.log("\nStep 2: Generating moduleContent.ts...");
	const moduleContentPath = path.join(__dirname, "../src/videos/moduleContent.ts");
	
	// Backup existing file
	if (fs.existsSync(moduleContentPath)) {
		const backupPath = moduleContentPath.replace('.ts', `.backup.${Date.now()}.ts`);
		fs.copyFileSync(moduleContentPath, backupPath);
		console.log(`  Backed up to: ${path.basename(backupPath)}`);
	}
	
	const code = generateModuleContentTs(plan, courseId);
	fs.writeFileSync(moduleContentPath, code);
	console.log(`  Written: src/videos/moduleContent.ts`);
	
	// Step 3: Copy timings to public/timings/
	console.log("\nStep 3: Copying timings to public/timings/...");
	
	// Clear existing timings
	if (fs.existsSync(publicTimingsDir)) {
		const existingFiles = fs.readdirSync(publicTimingsDir).filter(f => f.endsWith('.json'));
		for (const file of existingFiles) {
			fs.unlinkSync(path.join(publicTimingsDir, file));
		}
		console.log(`  Cleared ${existingFiles.length} existing timing files`);
	} else {
		fs.mkdirSync(publicTimingsDir, { recursive: true });
	}
	
	// Copy course timings
	if (fs.existsSync(timingsDir)) {
		const timingFiles = fs.readdirSync(timingsDir).filter(f => f.endsWith('.json'));
		for (const file of timingFiles) {
			fs.copyFileSync(
				path.join(timingsDir, file),
				path.join(publicTimingsDir, file)
			);
		}
		console.log(`  Copied ${timingFiles.length} timing files from courses/${courseId}/timings/`);
	} else {
		console.log(`  No timings directory found (courses/${courseId}/timings/)`);
		console.log(`  Run timing extraction after generating audio`);
	}
	
	// Step 3.5: Align diagram phases to narration (generate animation specs, copy SVGs)
	console.log("\nStep 3.5: Aligning diagram phases (generate animation specs, copy SVGs)...");
	try {
		execSync(`npx tsx scripts/generateAnimationSpecs.ts ${courseId}`, {
			cwd: path.join(__dirname, ".."),
			stdio: "inherit"
		});
		execSync(`npx tsx scripts/copySvgsToPublic.ts ${courseId}`, {
			cwd: path.join(__dirname, ".."),
			stdio: "inherit"
		});
		console.log("  Diagram phases aligned");
	} catch (error) {
		console.warn("  Align diagram phases skipped or failed:", (error as Error)?.message ?? error);
	}
	
	// Step 4: Regenerate Remotion modules
	console.log("\nStep 4: Regenerating Remotion modules...");
	try {
		execSync("npx tsx scripts/generateModulesFromContent.ts", {
			cwd: path.join(__dirname, ".."),
			stdio: "inherit"
		});
	} catch (error) {
		console.error("  Failed to regenerate modules:", error);
		throw error;
	}
	
	// Step 5: Update courses.json to mark as active
	console.log("\nStep 5: Updating courses.json...");
	const coursesData = readCoursesJson();
	
	// Mark all other courses as not the "current" one (optional: could add a currentCourse field)
	const courseIndex = coursesData.courses.findIndex(c => c.id === courseId);
	if (courseIndex >= 0) {
		// Ensure the course is active (not archived)
		if (coursesData.courses[courseIndex].status === 'archived') {
			coursesData.courses[courseIndex].status = 'active';
			coursesData.courses[courseIndex].archivedAt = null;
			console.log(`  Restored course from archive`);
		}
	} else {
		// Add course if not in list
		coursesData.courses.push({
			id: courseId,
			title: plan.courseName,
			description: plan.description || `Course: ${plan.courseName}`,
			moduleCount: plan.modules?.length || 0,
			status: 'active',
			archivedAt: null
		});
		coursesData.courseModuleMapping[courseId] = plan.modules?.map((m: any) => m.moduleNumber) || [];
		console.log(`  Added course to courses.json`);
	}
	
	writeCoursesJson(coursesData);
	console.log(`  courses.json updated`);

	// Step 6: Update .gitignore to track only this course's audio
	console.log("\nStep 6: Updating .gitignore (audio exception)...");
	const gitignorePath = path.join(__dirname, "../.gitignore");
	if (fs.existsSync(gitignorePath)) {
		let content = fs.readFileSync(gitignorePath, "utf-8");
		const newLine = `!public/audio/${courseId}/`;
		const replaced = content.replace(
			/!public\/audio\/[a-z0-9-]+\//,
			newLine
		);
		if (replaced === content && !content.includes(newLine)) {
			content = content.replace(
				/(!public\/audio\/whoosh\.wav)/,
				`$1\n${newLine}`
			);
		} else {
			content = replaced;
		}
		fs.writeFileSync(gitignorePath, content);
		console.log(`  .gitignore: now tracking public/audio/${courseId}/`);
	}

	console.log(`\n========================================`);
	console.log(`Course "${courseId}" is now active!`);
	console.log(`========================================\n`);
	console.log(`Next steps:`);
	console.log(`  1. Restart Remotion Studio: npm start`);
	console.log(`  2. Restart GUI Server: node gui-server.js`);
	console.log(`  3. Refresh browser and select the course\n`);
}

// CLI usage
const courseId = process.argv[2];

if (!courseId) {
	console.error("Usage: npx tsx scripts/activateCourse.ts <courseId>");
	console.error("\nExample:");
	console.error("  npx tsx scripts/activateCourse.ts securing-websites-with-ssl");
	console.error("\nAvailable courses:");
	
	const coursesDir = path.join(__dirname, "../courses");
	if (fs.existsSync(coursesDir)) {
		const courses = fs.readdirSync(coursesDir).filter(f => 
			fs.statSync(path.join(coursesDir, f)).isDirectory()
		);
		for (const course of courses) {
			const hasContent = fs.existsSync(path.join(coursesDir, course, "content.json"));
			console.error(`  - ${course}${hasContent ? "" : " (no content.json)"}`);
		}
	}
	
	process.exit(1);
}

activateCourse(courseId).catch(error => {
	console.error("\nFailed to activate course:", error.message);
	process.exit(1);
});
