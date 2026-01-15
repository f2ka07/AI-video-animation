// Script to fix corrupted wordTimings.ts file
// Removes duplicate entries that were incorrectly added

import * as fs from "fs";
import * as path from "path";

const filePath = path.join(__dirname, "../src/utils/wordTimings.ts");
let content = fs.readFileSync(filePath, "utf-8");

// Remove duplicate entries that appear after closing brackets
// Pattern: ] }, followed by word entries that should be inside the array

// Split by slide entries
const lines = content.split("\n");
const fixedLines: string[] = [];
let inWordArray = false;
let slideName = "";

for (let i = 0; i < lines.length; i++) {
	const line = lines[i];
	
	// Detect start of word array
	if (line.match(/^\s*\w+:\s*\{\s*slideName:/)) {
		slideName = line.match(/(\w+):/)?.[1] || "";
		inWordArray = true;
		fixedLines.push(line);
		continue;
	}
	
	// Detect end of word array
	if (line.match(/^\s*\]\s*\},?\s*$/)) {
		fixedLines.push(line);
		inWordArray = false;
		
		// Skip any duplicate word entries that follow
		let j = i + 1;
		while (j < lines.length && lines[j].match(/^\s*\{ text:/)) {
			j++; // Skip duplicate entries
		}
		i = j - 1; // Continue from after duplicates
		continue;
	}
	
	// If we're in a word array, keep the line
	if (inWordArray) {
		fixedLines.push(line);
		continue;
	}
	
	// If we hit a lineMappings section, we're done with wordTimings
	if (line.includes("lineMappings")) {
		// Keep everything from here on
		fixedLines.push(...lines.slice(i));
		break;
	}
	
	// Keep other structural lines
	if (!line.match(/^\s*\{ text:/)) {
		fixedLines.push(line);
	}
}

fs.writeFileSync(filePath, fixedLines.join("\n"));
console.log("✓ Fixed wordTimings.ts - removed duplicate entries");
