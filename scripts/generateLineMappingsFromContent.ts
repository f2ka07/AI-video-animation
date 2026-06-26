// Auto-generate line mappings for code slides from moduleContent.ts
// This analyzes code content and narration to create mappings automatically
// Updated to use JSON files for scalability

import * as fs from "fs";
import * as path from "path";
import { allModules } from "../src/videos/moduleContent";

/** Legacy: script as string -> scripts array; for phrase extraction use combined script */
function getScriptForPhraseExtraction(slide: { script?: string; scripts?: string[] }): string {
	if (slide.scripts && slide.scripts.length >= 1) return slide.scripts.join(" ");
	if (slide.script) return slide.script;
	return "";
}

/** Load code for a slide from content.json when moduleContent lacks it */
function getCodeFromContentJson(courseId: string, moduleNumber: number, slideName: string): string | undefined {
	const contentPath = path.join(__dirname, "../courses", courseId, "content.json");
	if (!fs.existsSync(contentPath)) return undefined;
	try {
		const plan = JSON.parse(fs.readFileSync(contentPath, "utf-8"));
		const mod = plan.modules?.find((m: any) => m.moduleNumber === moduleNumber);
		const slide = mod?.slides?.find((s: any) => s.name === slideName);
		return slide?.code;
	} catch {
		return undefined;
	}
}
import { findWordRange } from "../src/utils/wordRangeFinder";
import { extractLineMappingsFromWordTimings } from "./lib/extractLineMappingsFromWordTimings";
import { loadModuleTimings, saveModuleTimings } from "./saveTimingsJson";

interface LineMapping {
	id: string;
	line: number;
	wordRange: [number, number];
}

interface WordTiming {
	text: string;
	start: number;
	end: number;
}

interface SlideWordTimings {
	slideName: string;
	words: WordTiming[];
}

// Read word timings from course-specific JSON files
function getWordTimingsForModule(courseId: string, moduleNumber: number): Record<string, SlideWordTimings> {
	const timingsDir = path.join(__dirname, "../courses", courseId, "timings");
	const jsonPath = path.join(timingsDir, `module${moduleNumber}.json`);
	
	const wordTimings: Record<string, SlideWordTimings> = {};
	
	if (!fs.existsSync(jsonPath)) {
		console.log(`No timings file for module ${moduleNumber} in course ${courseId}`);
		return wordTimings;
	}
	
	try {
		const content = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
		if (content.slides) {
			for (const [slideName, slideData] of Object.entries(content.slides)) {
				const data = slideData as { words: WordTiming[] };
				wordTimings[slideName] = {
					slideName,
					words: data.words || [],
				};
			}
		}
	} catch (error) {
		console.error(`Failed to parse ${jsonPath}:`, error);
	}
	
	return wordTimings;
}

// Legacy: Read word timings from the old wordTimings.ts file
function getWordTimings(): Record<string, SlideWordTimings> {
	const timingsPath = path.join(__dirname, "../src/utils/wordTimings.ts");
	
	if (!fs.existsSync(timingsPath)) {
		return {};
	}
	
	const content = fs.readFileSync(timingsPath, "utf-8");
	
	const wordTimings: Record<string, SlideWordTimings> = {};
	
	// Extract word timings for each slide
	const slideMatches = content.matchAll(/(\w+):\s*\{\s*slideName:\s*"(\w+)",\s*words:\s*\[([\s\S]*?)\]\s*\}/g);
	
	for (const match of slideMatches) {
		const slideKey = match[1];
		const slideName = match[2];
		const wordsContent = match[3];
		
		const words: WordTiming[] = [];
		const wordMatches = wordsContent.matchAll(/\{\s*text:\s*"([^"]+)",\s*start:\s*([\d.]+),\s*end:\s*([\d.]+)\s*\}/g);
		
		for (const wordMatch of wordMatches) {
			words.push({
				text: wordMatch[1],
				start: parseFloat(wordMatch[2]),
				end: parseFloat(wordMatch[3]),
			});
		}
		
		wordTimings[slideKey] = { slideName, words };
	}
	
	return wordTimings;
}

/** Check if phrase appears in script (exact, or as substring of words) */
function phraseInScript(phrase: string, scriptLower: string): boolean {
	if (scriptLower.includes(phrase)) return true;
	// Relaxed: phrase words appear consecutively in script (handles "command-line" vs "command line")
	const phraseWords = phrase.split(/\s+/).filter(Boolean);
	if (phraseWords.length === 0) return false;
	const regex = new RegExp(phraseWords.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("\\b.*?\\b"), "i");
	return regex.test(scriptLower);
}

/**
 * Extract key phrases from code that are mentioned in narration
 * Relaxed matching: comments, commands, keywords; synonyms for common terms
 */
function extractCodePhrases(code: string, script: string): Array<{ phrase: string; line: number }> {
	const lines = code.split("\n");
	const phrases: Array<{ phrase: string; line: number }> = [];
	const scriptLower = script.toLowerCase();
	const usedLines = new Set<number>();

	const addPhrase = (phrase: string, lineNum: number) => {
		if (!usedLines.has(lineNum) && phrase.length >= 2) {
			phrases.push({ phrase, line: lineNum });
			usedLines.add(lineNum);
		}
	};

	// Comment phrase synonyms (comment wording vs script wording)
	const synonymPairs: Array<[string, string[]]> = [
		["command", ["command", "command-line", "system command", "runs", "run"]],
		["decode", ["decode", "decodes", "decoded"]],
		["output", ["output", "outputs", "result"]],
		["print", ["print", "prints", "printing"]],
	];
	const tryPhraseWithSynonyms = (phrase: string, lineNum: number): boolean => {
		if (phraseInScript(phrase, scriptLower)) {
			addPhrase(phrase, lineNum);
			return true;
		}
		for (const [key, alts] of synonymPairs) {
			if (phrase.includes(key)) {
				for (const alt of alts) {
					if (scriptLower.includes(alt)) {
						addPhrase(phrase, lineNum);
						return true;
					}
				}
			}
		}
		return false;
	};

	// AWS resource name mappings (short name -> spoken phrase)
	const awsResourceNames: Record<string, string[]> = {
		"vpc": ["vpc"],
		"subnet": ["subnet", "subnets"],
		"eip": ["elastic ip"],
		"natgateway": ["nat gateway"],
		"routetable": ["route table"],
		"routetableassociation": ["route table association", "associate"],
		"internetgateway": ["internet gateway"],
		"securitygroup": ["security group"],
		"instance": ["instance", "instances"],
	};

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trim();
		const lineNum = i + 1;
		
		if (!line) continue;
		
		// Shell/Python comments (#) - extract key phrases, relaxed matching (min 3 chars)
		if (line.startsWith("#")) {
			const commentMatch = line.match(/#\s*-?\s*(.+)/);
			if (commentMatch) {
				const commentText = commentMatch[1].trim().toLowerCase();
				const words = commentText.split(/\s+/);
				for (let len = 4; len >= 1; len--) {
					for (let j = 0; j <= words.length - len; j++) {
						const phrase = words.slice(j, j + len).join(" ");
						if (phrase.length >= 3 && tryPhraseWithSynonyms(phrase, lineNum)) break;
						if (phrase.length >= 3 && phraseInScript(phrase, scriptLower)) {
							addPhrase(phrase, lineNum);
							break;
						}
					}
					if (usedLines.has(lineNum)) break;
				}
			}
			continue;
		}
		
		// TypeScript/JS comments (//) - relaxed matching
		if (line.startsWith("//")) {
			const commentMatch = line.match(/\/\/\s*(.+)/);
			if (commentMatch) {
				const commentText = commentMatch[1].trim().toLowerCase();
				const words = commentText.split(/\s+/);
				for (let len = 4; len >= 1; len--) {
					for (let j = 0; j <= words.length - len; j++) {
						const phrase = words.slice(j, j + len).join(" ");
						if (phrase.length >= 3 && tryPhraseWithSynonyms(phrase, lineNum)) break;
						if (phrase.length >= 3 && phraseInScript(phrase, scriptLower)) {
							addPhrase(phrase, lineNum);
							break;
						}
					}
					if (usedLines.has(lineNum)) break;
				}
			}
			continue;
		}

		// 1. Shell/Python commands (subprocess.run, nmcli, iwlist, etc.)
		const subprocessMatch = line.match(/subprocess\.run\s*\(\s*\[\s*['"](\w+)['"]/);
		if (subprocessMatch) {
			const cmd = subprocessMatch[1].toLowerCase();
			if (scriptLower.includes(cmd) || scriptLower.includes("command") || scriptLower.includes("system")) {
				addPhrase(cmd, lineNum);
			}
		}
		const commandMatch = line.match(/^(\w+(?:\s+\w+)?)/);
		if (commandMatch && !usedLines.has(lineNum)) {
			const command = commandMatch[1].toLowerCase();
			if (phraseInScript(command, scriptLower)) addPhrase(command, lineNum);
		}

		// 2. File names with extensions
		const fileMatch = line.match(/(\w+\.(?:ts|js|yaml|json|yml|tsx|jsx))/i);
		if (fileMatch) {
			const fileName = fileMatch[1].toLowerCase();
			const fileNamePhrase = fileName.replace(".", " dot ");
			if (scriptLower.includes(fileName) || scriptLower.includes(fileNamePhrase)) {
				addPhrase(fileNamePhrase, lineNum);
			}
		}

		// 3. AWS resource types (new aws.ec2.Vpc, new aws.ec2.Subnet, etc.)
		const awsResourceMatch = line.match(/new\s+aws\.(\w+)\.(\w+)/i);
		if (awsResourceMatch) {
			const resourceType = awsResourceMatch[2].toLowerCase();
			// Look up readable name for AWS resource
			const readableNames = awsResourceNames[resourceType] || [resourceType];
			for (const name of readableNames) {
				if (scriptLower.includes(name)) {
					addPhrase(name, lineNum);
					break;
				}
			}
		}

		// 4. Variable/const declarations
		const varMatch = line.match(/(?:const|let|var)\s+(\w+)\s*=/);
		if (varMatch) {
			const varName = varMatch[1].toLowerCase();
			// Convert camelCase to words: privateSubnet -> private subnet
			const varWords = varName.replace(/([A-Z])/g, " $1").trim().toLowerCase();
			if (scriptLower.includes(varWords) || scriptLower.includes(varName)) {
				addPhrase(varWords || varName, lineNum);
			}
		}

		// 5. Property names (key: value patterns)
		const propMatches = line.matchAll(/(\w+):\s*(?:[^,}]+)/g);
		for (const propMatch of propMatches) {
			const propName = propMatch[1].toLowerCase();
			// Skip common noise properties
			if (["id", "name", "type", "value", "key"].includes(propName)) continue;
			// Convert camelCase: cidrBlock -> cidr block
			const propWords = propName.replace(/([A-Z])/g, " $1").trim().toLowerCase();
			if (scriptLower.includes(propWords) && propWords.length > 3) {
				addPhrase(propWords, lineNum);
			} else if (scriptLower.includes(propName) && propName.length > 3) {
				addPhrase(propName, lineNum);
			}
		}

		// 6. String values that might be mentioned (availability zones, CIDR blocks, etc.)
		const stringMatches = line.matchAll(/"([^"]+)"|'([^']+)'/g);
		for (const strMatch of stringMatches) {
			const strValue = (strMatch[1] || strMatch[2]).toLowerCase();
			// Skip long strings and common noise
			if (strValue.length > 20 || strValue.length < 3) continue;
			if (scriptLower.includes(strValue)) {
				addPhrase(strValue, lineNum);
			}
		}

		// 7. Export statements
		if (line.startsWith("export")) {
			const exportMatch = line.match(/export\s+(?:const|let|var|function|class)\s+(\w+)/);
			if (exportMatch) {
				const exportName = exportMatch[1].toLowerCase();
				const exportWords = exportName.replace(/([A-Z])/g, " $1").trim().toLowerCase();
				if (scriptLower.includes(exportWords) || scriptLower.includes(exportName)) {
					addPhrase(exportWords || exportName, lineNum);
				}
			}
		}
	}

	return phrases;
}

/**
 * Generate line mappings for a code slide
 */
function generateLineMappings(
	slideName: string,
	code: string,
	script: string,
	wordTimings: Record<string, SlideWordTimings>
): LineMapping[] {
	const timings = wordTimings[slideName];
	if (!timings || !timings.words.length) {
		console.log(`⚠ ${slideName}: No word timings available, skipping`);
		return [];
	}

	const codeLineCount = code.split("\n").length;
	const fromNarration = extractLineMappingsFromWordTimings(timings.words, codeLineCount);
	const mappedLines = new Set(fromNarration.map((m) => m.line));
	for (const m of fromNarration) {
		console.log(
			`  ✓ Line ${m.line} → words[${m.wordRange[0]}-${m.wordRange[1]}] (from narration)`
		);
	}

	const phrases = extractCodePhrases(code, script);
	const mappings: LineMapping[] = [...fromNarration];

	for (const { phrase, line } of phrases) {
		if (mappedLines.has(line)) continue;
		// Try to find phrase in word timings
		const wordRange = findWordRange(timings.words, phrase);
		if (wordRange) {
			const id = phrase.toLowerCase().replace(/\s+/g, "-").replace(/\./g, "-");
			mappings.push({
				id,
				line,
				wordRange,
			});
			console.log(`  ✓ "${phrase}" → line ${line}, words[${wordRange[0]}-${wordRange[1]}]`);
		} else {
			// Try variations
			const variations = [
				phrase.replace(" dot ", "."),
				phrase.replace(".", " dot "),
				phrase.replace(/\s+/g, " "),
			];
			let found = false;
			for (const variation of variations) {
				const range = findWordRange(timings.words, variation);
				if (range) {
					const id = variation.toLowerCase().replace(/\s+/g, "-").replace(/\./g, "-");
					mappings.push({
						id,
						line,
						wordRange: range,
					});
					console.log(`  ✓ "${variation}" → line ${line}, words[${range[0]}-${range[1]}]`);
					found = true;
					break;
				}
			}
			if (!found) {
				console.log(`  ⚠ Could not find phrase "${phrase}" in word timings`);
			}
		}
	}

	return mappings;
}

/**
 * Update lineMappings in wordTimings.ts
 * This function is more robust and prevents syntax errors
 */
function updateLineMappingsFile(mappingsBySlide: Record<string, LineMapping[]>) {
	const timingsPath = path.join(__dirname, "../src/utils/wordTimings.ts");
	let content = fs.readFileSync(timingsPath, "utf-8");

	// Find the lineMappings section boundaries
	const lineMappingsStart = content.indexOf("export const lineMappings: Record<string, LineMapping[]> = {");
	
	if (lineMappingsStart === -1) {
		// lineMappings section doesn't exist - create it after wordTimings
		const wordTimingsEnd = content.indexOf("\n};", content.indexOf("export const wordTimings"));
		if (wordTimingsEnd === -1) {
			throw new Error("Could not find wordTimings closing brace");
		}
		
		const before = content.substring(0, wordTimingsEnd + 3); // Include };
		const after = content.substring(wordTimingsEnd + 3);
		
		const mappingStrings = Object.entries(mappingsBySlide)
			.filter(([_, mappings]) => mappings.length > 0)
			.map(([slideName, mappings]) => {
				const mappingEntries = mappings.map(
					(m) =>
						`\t\t{\n\t\t\tid: "${m.id}",\n\t\t\tline: ${m.line},\n\t\t\twordRange: [${m.wordRange[0]}, ${m.wordRange[1]}],\n\t\t}`
				);
				return `\t${slideName}: [\n${mappingEntries.join(",\n")}\n\t]`;
			});
		
		content = before + "\n\nexport const lineMappings: Record<string, LineMapping[]> = {\n" 
			+ mappingStrings.join(",\n") + "\n};\n" + after;
	} else {
		// lineMappings section exists - update it properly
		const lineMappingsEnd = content.indexOf("\n};", lineMappingsStart);
		if (lineMappingsEnd === -1) {
			throw new Error("Could not find lineMappings closing brace");
		}
		
		const beforeLineMappings = content.substring(0, lineMappingsStart);
		const lineMappingsSection = content.substring(lineMappingsStart, lineMappingsEnd);
		const afterLineMappings = content.substring(lineMappingsEnd);
		
		// Parse existing mappings and remove duplicates
		const existingMappings = new Set<string>();
		const lines = lineMappingsSection.split("\n");
		const newLines: string[] = [];
		let inMapping = false;
		let currentSlide: string | null = null;
		
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			
			// Keep the opening line
			if (line.includes("export const lineMappings")) {
				newLines.push(line);
				continue;
			}
			
			// Detect start of a mapping entry
			const mappingMatch = line.match(/^\s*([a-zA-Z0-9_-]+):\s*\[/);
			if (mappingMatch) {
				const slideName = mappingMatch[1];
				// If this is a slide we're updating, skip it (we'll add the new one)
				if (mappingsBySlide[slideName]) {
					inMapping = true;
					currentSlide = slideName;
					continue; // Skip this entry
				}
				// Otherwise, keep it
				if (!existingMappings.has(slideName)) {
					existingMappings.add(slideName);
					newLines.push(line);
					inMapping = true;
					currentSlide = slideName;
				} else {
					// Duplicate - skip it
					inMapping = true;
					currentSlide = slideName;
					continue;
				}
				continue;
			}
			
			// If we're skipping a mapping, skip until we find the closing ]
			if (inMapping && currentSlide && mappingsBySlide[currentSlide]) {
				if (line.match(/^\s*\]\s*,?\s*$/)) {
					inMapping = false;
					currentSlide = null;
				}
				continue; // Skip all lines in this mapping
			}
			
			// Detect end of mapping entry
			if (line.match(/^\s*\]\s*,?\s*$/)) {
				inMapping = false;
				currentSlide = null;
			}
			
			// Keep valid lines
			if (!inMapping || !mappingsBySlide[currentSlide || ""]) {
				newLines.push(line);
			}
		}
		
		// Build new mappings to add
		const newMappings: string[] = [];
		for (const [slideName, mappings] of Object.entries(mappingsBySlide)) {
			if (mappings.length === 0) {
				continue;
			}
			
			const mappingEntries = mappings.map(
				(m) =>
					`\t\t{\n\t\t\tid: "${m.id}",\n\t\t\tline: ${m.line},\n\t\t\twordRange: [${m.wordRange[0]}, ${m.wordRange[1]}],\n\t\t}`
			);
			newMappings.push(`\t${slideName}: [\n${mappingEntries.join(",\n")}\n\t]`);
		}
		
		// Rebuild the section
		let newSection = newLines.join("\n");
		// Remove trailing comma if present
		newSection = newSection.replace(/,\s*$/, "");
		// Add new mappings before closing brace
		if (newMappings.length > 0) {
			// Ensure last line before }; has a comma if there are existing entries
			if (newLines.length > 1 && !newSection.trim().endsWith(",")) {
				const lastLine = newLines[newLines.length - 1];
				if (lastLine.trim() && !lastLine.trim().endsWith(",") && !lastLine.includes("export const")) {
					newSection = newSection.replace(/\n([^\n]+)$/, ",\n$1");
				}
			}
			newSection = newSection + (newSection.trim().endsWith("export const lineMappings") ? "" : ",\n") 
				+ newMappings.join(",\n") + "\n};";
		} else {
			newSection = newSection + "\n};";
		}
		
		content = beforeLineMappings + newSection + afterLineMappings;
	}
	
	// Validate and fix common syntax errors before writing
	content = validateAndFixSyntax(content);
	
	fs.writeFileSync(timingsPath, content);
	console.log("\n✓ Updated lineMappings in wordTimings.ts");
}

/**
 * Validate and fix common syntax errors in wordTimings.ts
 */
function validateAndFixSyntax(content: string): string {
	// Fix 1: Remove duplicate closing braces (};}; or };};};)
	content = content.replace(/;\s*\}\s*;(\s*\}\s*;)+/g, '};');
	
	// Fix 2: Ensure wordTimings closes before lineMappings
	const wordTimingsStart = content.indexOf("export const wordTimings");
	const lineMappingsStart = content.indexOf("export const lineMappings");
	
	if (wordTimingsStart !== -1 && lineMappingsStart !== -1) {
		const beforeMappings = content.substring(0, lineMappingsStart);
		const afterMappings = content.substring(lineMappingsStart);
		
		// Find the last }; before lineMappings (should be wordTimings closing)
		const lastBrace = beforeMappings.lastIndexOf("\n};");
		if (lastBrace !== -1) {
			const before = content.substring(0, lastBrace);
			const between = content.substring(lastBrace, lineMappingsStart);
			// Remove any extra }; patterns between wordTimings and lineMappings
			const cleanedBetween = between.replace(/;\s*\}\s*;(\s*\}\s*;)+/g, '').trim();
			content = before + "\n};" + (cleanedBetween ? "\n" + cleanedBetween : "") + "\n" + afterMappings;
		}
	}
	
	// Fix 3: Remove orphaned entries in wrong sections
	// Remove line mapping entries that appear in wordTimings section
	if (wordTimingsStart !== -1 && lineMappingsStart !== -1) {
		const wordTimingsSection = content.substring(wordTimingsStart, lineMappingsStart);
		// Remove any line mapping patterns from wordTimings section
		const cleanedWordTimings = wordTimingsSection.replace(/\s*[a-zA-Z0-9_-]+:\s*\[\s*\{[^}]*id:[^}]*\}[^\]]*\]\s*,?\s*/g, '');
		content = content.substring(0, wordTimingsStart) + cleanedWordTimings + content.substring(lineMappingsStart);
	}
	
	return content;
}

/**
 * Main function - now saves to course-specific JSON files
 */
function generateLineMappingsFromContent(moduleRange?: string) {
	console.log("Auto-generating line mappings for code slides...\n");
	console.log("Saving to: courses/{courseId}/timings/module{N}.json\n");

	// Parse module range
	let modulesToProcess = allModules;
	if (moduleRange && moduleRange !== "all") {
		const moduleNumbers = moduleRange.split(",").map((n) => parseInt(n.trim()));
		modulesToProcess = allModules.filter((m) => moduleNumbers.includes(m.moduleNumber));
	}

	let totalMappings = 0;

	for (const module of modulesToProcess) {
		console.log(`\n=== Module ${module.moduleNumber}: ${module.title} ===`);

		// Use course-specific directory
		const courseId = module.courseId || 'default';
		
		// Load word timings from course-specific JSON
		const wordTimings = getWordTimingsForModule(courseId, module.moduleNumber);
		
		if (Object.keys(wordTimings).length === 0) {
			console.log("  No word timings found - run extract-timings first");
			continue;
		}

		// Process code slides, code-diagram slides, and explain slides (that follow code)
		const codeSlides = module.slides.filter((slide) => slide.type === "code" || slide.type === "code-diagram");
		const explainSlides: Array<{ slide: typeof module.slides[0]; prevSlide: typeof module.slides[0] }> = [];
		for (let idx = 0; idx < module.slides.length; idx++) {
			const slide = module.slides[idx];
			if (slide.type !== "content-two-card" || !slide.name.startsWith("explain-")) continue;
			const prevSlide = idx > 0 ? module.slides[idx - 1] : null;
			if (prevSlide && (prevSlide.type === "code" || prevSlide.type === "code-diagram")) {
				explainSlides.push({ slide, prevSlide });
			}
		}

		if (codeSlides.length === 0 && explainSlides.length === 0) {
			console.log("  No code or explain slides found");
			continue;
		}

		const mappingsBySlide: Record<string, LineMapping[]> = {};

		for (const slide of codeSlides) {
			const code = slide.code || getCodeFromContentJson(courseId, module.moduleNumber, slide.name);
			if (!code) {
				console.log(`\nSkipping ${slide.name}: no code in moduleContent or content.json`);
				continue;
			}

			console.log(`\nProcessing ${slide.name}...`);
			const script = getScriptForPhraseExtraction(slide);
			const mappings = generateLineMappings(slide.name, code, script, wordTimings);
			if (mappings.length > 0) {
				mappingsBySlide[slide.name] = mappings;
				console.log(`  Generated ${mappings.length} line mappings`);
				totalMappings += mappings.length;
			}
		}

		for (const { slide, prevSlide } of explainSlides) {
			const code = prevSlide.code || getCodeFromContentJson(courseId, module.moduleNumber, prevSlide.name);
			if (!code) {
				console.log(`\nSkipping explain ${slide.name}: no code from previous slide`);
				continue;
			}

			console.log(`\nProcessing explain slide ${slide.name} (code from ${prevSlide.name})...`);
			const script = getScriptForPhraseExtraction(slide);
			const mappings = generateLineMappings(slide.name, code, script, wordTimings);
			if (mappings.length > 0) {
				mappingsBySlide[slide.name] = mappings;
				console.log(`  Generated ${mappings.length} line mappings`);
				totalMappings += mappings.length;
			}
		}

		// Save to course-specific module JSON file
		if (Object.keys(mappingsBySlide).length > 0) {
			const moduleData = loadModuleTimings(courseId, module.moduleNumber, module.title);
			moduleData.lineMappings = { ...moduleData.lineMappings, ...mappingsBySlide };
			saveModuleTimings(courseId, moduleData);
		}
	}

	if (totalMappings > 0) {
		console.log(`\n✅ Line mapping generation complete! Generated ${totalMappings} mappings.`);
	} else {
		console.log("\n⚠ No line mappings generated. Make sure word timings are extracted first.");
	}
}

const moduleRange = process.argv[2];
generateLineMappingsFromContent(moduleRange);
