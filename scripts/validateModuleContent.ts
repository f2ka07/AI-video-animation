// Validate moduleContent.ts for missing required properties
// Checks all slides to ensure they have required data for their type

import * as fs from "fs";
import * as path from "path";

const CONTENT_PATH = path.join(__dirname, "../src/videos/moduleContent.ts");

interface Issue {
	module: number;
	slide: string;
	type: string;
	missing: string[];
}

function main() {
	console.log("Validating moduleContent.ts for missing properties...\n");

	const content = fs.readFileSync(CONTENT_PATH, "utf-8");
	const issues: Issue[] = [];
	const moduleIssues: string[] = [];

	// Find all module exports and check for courseId
	const moduleBlockRegex = /export const module(\d+)Content[\s\S]*?moduleNumber:\s*\d+[\s\S]*?slides:\s*\[/g;
	let blockMatch;
	
	while ((blockMatch = moduleBlockRegex.exec(content)) !== null) {
		const moduleNum = parseInt(blockMatch[1]);
		const blockText = blockMatch[0];
		
		// Check if courseId is present
		if (!blockText.includes("courseId:")) {
			moduleIssues.push(`Module ${moduleNum}: Missing 'courseId' - audio paths will default to 'default/' folder`);
		}
	}
	
	if (moduleIssues.length > 0) {
		console.log("MODULE-LEVEL ISSUES:");
		console.log("=".repeat(70));
		moduleIssues.forEach(issue => console.log(`  ${issue}`));
		console.log("=".repeat(70) + "\n");
	}

	// Find all module exports
	const moduleRegex = /export const module(\d+)Content[\s\S]*?slides:\s*\[([\s\S]*?)\]\s*\}/g;
	let moduleMatch;

	while ((moduleMatch = moduleRegex.exec(content)) !== null) {
		const moduleNum = parseInt(moduleMatch[1]);
		const slidesContent = moduleMatch[2];

		// Parse individual slides - use bracket counting for proper extraction
		const slides = extractSlides(slidesContent);

		for (const slideText of slides) {
			const nameMatch = slideText.match(/name:\s*"([^"]+)"/);
			const typeMatch = slideText.match(/type:\s*"([^"]+)"/);

			if (!nameMatch || !typeMatch) continue;

			const slideName = nameMatch[1];
			const slideType = typeMatch[1];
			const missing: string[] = [];

			// Check required properties based on type
			switch (slideType) {
				case "code":
					if (!slideText.includes("code:")) {
						missing.push("code");
					}
					break;

				case "comparison":
					if (!slideText.includes("leftItems:")) missing.push("leftItems");
					if (!slideText.includes("rightItems:")) missing.push("rightItems");
					if (!slideText.includes("leftTitle:")) missing.push("leftTitle");
					if (!slideText.includes("rightTitle:")) missing.push("rightTitle");
					break;

				case "content-two-card":
				case "content-single":
					// points is optional for these, but if they have none, content might be empty
					break;
			}

			if (missing.length > 0) {
				issues.push({ module: moduleNum, slide: slideName, type: slideType, missing });
			}
		}
	}

	// Report issues
	if (issues.length === 0 && moduleIssues.length === 0) {
		console.log("All modules and slides have required properties.");
	} else {
		if (issues.length > 0) {
			console.log(`Found ${issues.length} slides with missing properties:\n`);
			console.log("-".repeat(70));

			for (const issue of issues) {
				console.log(`Module ${issue.module}: ${issue.slide} (${issue.type})`);
				console.log(`  Missing: ${issue.missing.join(", ")}`);
			}

			console.log("-".repeat(70));
		}
		
		const totalIssues = issues.length + moduleIssues.length;
		console.log(`\nTotal issues: ${totalIssues}`);
	}

	return { slideIssues: issues, moduleIssues };
}

function extractSlides(slidesContent: string): string[] {
	const slides: string[] = [];
	let depth = 0;
	let currentSlide = "";
	let inBacktick = false;
	let inString = false;

	for (let i = 0; i < slidesContent.length; i++) {
		const char = slidesContent[i];
		const prevChar = i > 0 ? slidesContent[i - 1] : "";

		// Track backticks (for template literals)
		if (char === "`" && prevChar !== "\\") {
			inBacktick = !inBacktick;
			if (depth > 0) currentSlide += char;
			continue;
		}

		// Track double quotes (for strings)
		if (char === '"' && prevChar !== "\\" && !inBacktick) {
			inString = !inString;
			if (depth > 0) currentSlide += char;
			continue;
		}

		// Skip brace counting inside strings or backticks
		if (inBacktick || inString) {
			if (depth > 0) currentSlide += char;
			continue;
		}

		if (char === "{") {
			if (depth === 0) {
				currentSlide = "{";
			} else {
				currentSlide += char;
			}
			depth++;
		} else if (char === "}") {
			currentSlide += char;
			depth--;
			if (depth === 0) {
				slides.push(currentSlide.trim());
				currentSlide = "";
			}
		} else {
			if (depth > 0) {
				currentSlide += char;
			}
		}
	}

	return slides;
}

const result = main();
const hasIssues = result.slideIssues.length > 0 || result.moduleIssues.length > 0;
process.exit(hasIssues ? 1 : 0);
