// Script to fix corrupted wordTimings.ts file
// Removes duplicate entries and fixes syntax errors

import * as fs from "fs";
import * as path from "path";

const filePath = path.join(__dirname, "../src/utils/wordTimings.ts");
let content = fs.readFileSync(filePath, "utf-8");

console.log("Fixing wordTimings.ts file...\n");

// Find wordTimings object boundaries
const wordTimingsStart = content.indexOf("export const wordTimings: Record<string, SlideWordTimings> = {");
const lineMappingsStart = content.indexOf("export const lineMappings: Record<string, LineMapping[]> = {");

if (wordTimingsStart === -1) {
	throw new Error("Could not find wordTimings object");
}

// Find wordTimings end - it should be before lineMappings (if lineMappings exists)
let wordTimingsEnd: number;
if (lineMappingsStart !== -1) {
	// lineMappings exists - wordTimings should end before it
	const searchEnd = lineMappingsStart;
	wordTimingsEnd = content.lastIndexOf("\n};", searchEnd);
	if (wordTimingsEnd === -1 || wordTimingsEnd < wordTimingsStart) {
		// Try to find it differently
		wordTimingsEnd = content.indexOf("\n};", wordTimingsStart);
		if (wordTimingsEnd === -1 || wordTimingsEnd > lineMappingsStart) {
			// Malformed - try to fix by finding the last }; before lineMappings
			const beforeMappings = content.substring(wordTimingsStart, lineMappingsStart);
			const lastBrace = beforeMappings.lastIndexOf("\n};");
			if (lastBrace !== -1) {
				wordTimingsEnd = wordTimingsStart + lastBrace;
			} else {
				throw new Error("Could not find wordTimings closing brace");
			}
		}
	}
} else {
	// No lineMappings - find the closing normally
	wordTimingsEnd = content.indexOf("\n};", wordTimingsStart);
	if (wordTimingsEnd === -1) {
		throw new Error("Could not find wordTimings closing brace");
	}
}

const beforeWordTimings = content.substring(0, wordTimingsStart);
const wordTimingsSection = content.substring(wordTimingsStart, wordTimingsEnd);
const afterWordTimings = content.substring(wordTimingsEnd);

// Parse and rebuild wordTimings properly
const lines = wordTimingsSection.split("\n");
const fixedLines: string[] = [];
const seenSlides = new Set<string>();
let currentSlide: string | null = null;
let inWordArray = false;
let wordArrayLines: string[] = [];

function flushCurrentSlide() {
	if (currentSlide && wordArrayLines.length > 0) {
		// currentSlide is already added to fixedLines when we detect it
		fixedLines.push(...wordArrayLines);
		fixedLines.push("\t] },");
	}
	currentSlide = null;
	wordArrayLines = [];
	inWordArray = false;
}

for (let i = 0; i < lines.length; i++) {
	const line = lines[i];
	
	// Skip the opening line (already in beforeWordTimings)
	if (line.includes("export const wordTimings")) {
		fixedLines.push(line);
		continue;
	}
	
	// Detect start of a new slide entry
	// Handle both quoted and unquoted property names: "slide-2": or slideName:
	const slideMatch = line.match(/^\s*("?)([\w-]+)\1:\s*\{\s*slideName:\s*"([^"]+)"/);
	if (slideMatch) {
		flushCurrentSlide();
		const slideKey = slideMatch[2]; // Property name (without quotes)
		const slideNameValue = slideMatch[3]; // Value of slideName property
		// Use slideName value as unique identifier (more reliable)
		if (!seenSlides.has(slideNameValue)) {
			seenSlides.add(slideNameValue);
			currentSlide = slideKey;
			inWordArray = true;
			wordArrayLines = [];
			// Rebuild the line with proper quoting if needed
			const needsQuotes = /[-\s]/.test(slideKey) || /^\d/.test(slideKey);
			const quotedKey = needsQuotes ? `"${slideKey}"` : slideKey;
			fixedLines.push(`\t${quotedKey}: { slideName: "${slideNameValue}", words: [`);
		}
		continue;
	}
	
	// Detect end of word array
	if (line.match(/^\s*\]/)) {
		// Check if it's just ] or ] },
		if (line.match(/^\s*\]\s*\},?\s*$/)) {
			// This is the closing of a slide entry
			if (inWordArray && currentSlide) {
				wordArrayLines.push("\t]");
			}
			flushCurrentSlide();
			continue;
		} else if (line.match(/^\s*\]\s*$/)) {
			// Just closing bracket - might be part of array
			if (inWordArray && currentSlide) {
				wordArrayLines.push(line);
			}
			continue;
		}
	}
	
	// If we're in a word array, collect the lines
	if (inWordArray && currentSlide) {
		// Only add valid word entries
		if (line.match(/^\s*\{ text:/)) {
			wordArrayLines.push(line);
		}
		continue;
	}
	
	// Skip orphaned word entries (not inside any slide)
	if (line.match(/^\s*\{ text:/)) {
		continue; // Skip orphaned entries
	}
}

// Flush any remaining slide
flushCurrentSlide();

// Rebuild the section - ensure proper closing
let newWordTimingsSection = fixedLines.join("\n");
// Remove any trailing commas or extra closing braces
newWordTimingsSection = newWordTimingsSection.replace(/,\s*$/, '');
// Ensure it ends with proper closing
if (!newWordTimingsSection.trim().endsWith('};')) {
	newWordTimingsSection = newWordTimingsSection + "\n};";
}

// Also fix lineMappings section - remove syntax errors
let afterSection = afterWordTimings;
if (lineMappingsStart !== -1) {
	const lineMappingsEnd = content.indexOf("\n};", lineMappingsStart);
	if (lineMappingsEnd !== -1) {
		const beforeLineMappings = content.substring(wordTimingsEnd, lineMappingsStart);
		const lineMappingsSection = content.substring(lineMappingsStart, lineMappingsEnd);
		const afterLineMappings = content.substring(lineMappingsEnd);
		
		// Fix syntax errors in lineMappings (remove ],, and orphaned })
		let fixedLineMappings = lineMappingsSection
			.replace(/\]\s*\]/g, "]") // Remove double closing brackets
			.replace(/\]\s*,\s*,/g, "],") // Remove double commas
			.replace(/\]\s*,\s*\n\s*\}\s*\n\s*\]/g, "\n\t]") // Remove orphaned closing braces
			.replace(/,\s*\n\s*\}\s*\n\s*\];/g, "\n};") // Fix trailing issues
			.replace(/\]\s*,\s*\n\s*\}\s*$/gm, "\n\t]") // Fix orphaned braces at end of mappings
			.replace(/,\s*$/gm, ","); // Ensure proper comma placement
		
		afterSection = beforeLineMappings + fixedLineMappings + afterLineMappings;
	}
}

// Final cleanup: remove any duplicate closing braces
let finalContent = beforeWordTimings + newWordTimingsSection + afterSection;
// Remove patterns like };}; or };};}; (multiple closing braces)
finalContent = finalContent.replace(/;\s*\}\s*;(\s*\}\s*;)+/g, '};');
// Remove cases where }; appears on separate lines: }\n};
finalContent = finalContent.replace(/\}\s*\n\s*\}\s*;/g, '};');
// Remove double closing braces in arrays
finalContent = finalContent.replace(/\]\s*\]/g, "]");
// Remove double commas
finalContent = finalContent.replace(/,\s*,\s*/g, ",");
// Ensure wordTimings closes properly before lineMappings
if (lineMappingsStart !== -1) {
	const beforeMappings = finalContent.substring(0, lineMappingsStart);
	const afterMappings = finalContent.substring(lineMappingsStart);
	// Remove any extra }; before lineMappings
	const cleanedBefore = beforeMappings.replace(/;\s*\}\s*;(\s*\}\s*;)+/g, '};');
	finalContent = cleanedBefore + afterMappings;
}

content = finalContent;

fs.writeFileSync(filePath, content);
console.log("✓ Fixed wordTimings.ts - removed duplicates and syntax errors");
console.log(`   Processed ${seenSlides.size} unique slides`);
