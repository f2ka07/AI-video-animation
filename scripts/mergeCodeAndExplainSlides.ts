// Merge code slides with their following explain slides:
// - Ensure bullets are reflected as comments in the code
// - Merge scripts (intro + walkthrough)
// - Remove explain slides from content.json

import * as fs from "fs";
import * as path from "path";

interface Slide {
	name: string;
	type: string;
	script?: string;
	scripts?: string[];
	title?: string;
	points?: string[];
	code?: string;
	language?: string;
	[key: string]: unknown;
}

interface Module {
	moduleNumber: number;
	title: string;
	subtitle: string;
	slides: Slide[];
}

interface ContentJson {
	courseName: string;
	courseId: string;
	modules: Module[];
	savedAt?: string;
}

function getCommentPrefix(language: string): string {
	const lang = (language || "python").toLowerCase();
	if (lang === "python" || lang === "ruby" || lang === "bash" || lang === "shell") return "#";
	return "//";
}

/**
 * Parse code into blocks: { comments: string[], codeLines: string[] }
 * A block is optional comment lines followed by code lines.
 */
function parseCodeBlocks(code: string, language: string): Array<{ comments: string[]; codeLines: string[] }> {
	const lines = code.split("\n");
	const prefix = getCommentPrefix(language);
	const blocks: Array<{ comments: string[]; codeLines: string[] }> = [];
	let i = 0;

	while (i < lines.length) {
		const comments: string[] = [];
		while (i < lines.length && lines[i].trim().startsWith(prefix)) {
			comments.push(lines[i]);
			i++;
		}
		while (i < lines.length && lines[i].trim() === "") {
			i++;
		}
		const codeLines: string[] = [];
		while (i < lines.length && lines[i].trim() !== "" && !lines[i].trim().startsWith(prefix)) {
			codeLines.push(lines[i]);
			i++;
		}
		while (i < lines.length && lines[i].trim() === "") {
			i++;
		}
		if (codeLines.length > 0 || comments.length > 0) {
			blocks.push({ comments, codeLines });
		}
	}
	return blocks;
}

/**
 * Ensure bullets are reflected as comments. Map bullets to blocks by order.
 * If a block has no comment, add the bullet as a comment.
 */
function mergeBulletsIntoCode(code: string, bullets: string[], language: string): string {
	if (!bullets || bullets.length === 0) return code;
	const prefix = getCommentPrefix(language);
	const blocks = parseCodeBlocks(code, language);

	let bulletIdx = 0;
	const result: string[] = [];
	for (const block of blocks) {
		if (block.codeLines.length === 0) {
			result.push(...block.comments);
			continue;
		}
		if (block.comments.length === 0 && bulletIdx < bullets.length) {
			const bullet = bullets[bulletIdx++];
			result.push(`${prefix} ${bullet}`);
		} else {
			result.push(...block.comments);
		}
		result.push(...block.codeLines);
		result.push("");
	}
	return result.join("\n").trimEnd();
}

function mergeScripts(codeScript: string, explainScript: string): string {
	const a = (codeScript || "").trim();
	const b = (explainScript || "").trim();
	if (!a) return b;
	if (!b) return a;
	if (a.endsWith(".")) return `${a} ${b}`;
	return `${a}. ${b}`;
}

function mergeCodeAndExplainSlides(courseId: string): void {
	const contentPath = path.join(__dirname, "../courses", courseId, "content.json");
	if (!fs.existsSync(contentPath)) {
		throw new Error(`Content not found: ${contentPath}`);
	}

	const content: ContentJson = JSON.parse(fs.readFileSync(contentPath, "utf-8"));
	let removedCount = 0;

	for (const mod of content.modules) {
		const newSlides: Slide[] = [];
		for (let i = 0; i < mod.slides.length; i++) {
			const slide = mod.slides[i];
			const next = i + 1 < mod.slides.length ? mod.slides[i + 1] : null;

			// Code slide followed by explain slide
			const isCodeFollowedByExplain =
				(slide.type === "code" || slide.type === "code-diagram") &&
				next &&
				next.type === "content-two-card" &&
				next.name.startsWith("explain-");

			if (isCodeFollowedByExplain && next && slide.code) {
				// Merge bullets into code as comments
				const bullets = next.points || [];
				const mergedCode = mergeBulletsIntoCode(
					slide.code,
					bullets,
					slide.language || "python"
				);
				// Merge scripts: code slide may have script (string) or scripts (array)
				const codeScriptText = slide.scripts?.length
					? slide.scripts.join(" ")
					: (slide.script ?? "");
				const mergedScript = mergeScripts(codeScriptText, next.script ?? "");
				// Use single script after merge (one audio per code slide)
				const { scripts: _scripts, ...rest } = slide;
				newSlides.push({
					...rest,
					code: mergedCode,
					script: mergedScript,
				});
				// Skip next (explain) slide
				i++;
				removedCount++;
			} else {
				newSlides.push(slide);
			}
		}
		mod.slides = newSlides;
	}

	content.savedAt = new Date().toISOString();
	fs.writeFileSync(contentPath, JSON.stringify(content, null, 2));
	console.log(`\nMerged ${removedCount} explain slide(s) into code slides.`);
	console.log(`Updated: ${contentPath}`);
}

const courseId = process.argv[2] || "comprehensive-wireless-networks";
mergeCodeAndExplainSlides(courseId);
