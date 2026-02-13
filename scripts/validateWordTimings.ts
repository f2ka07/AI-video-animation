// Validation script to check wordTimings.ts for syntax errors
// Can be run before any write operations to prevent errors

import * as fs from "fs";
import * as path from "path";

const filePath = path.join(__dirname, "../src/utils/wordTimings.ts");

export function validateWordTimingsFile(): { valid: boolean; errors: string[] } {
	const errors: string[] = [];
	
	if (!fs.existsSync(filePath)) {
		return { valid: false, errors: ["File does not exist"] };
	}
	
	const content = fs.readFileSync(filePath, "utf-8");
	
	// Check 1: wordTimings object exists
	const wordTimingsStart = content.indexOf("export const wordTimings: Record<string, SlideWordTimings> = {");
	if (wordTimingsStart === -1) {
		errors.push("wordTimings object not found");
		return { valid: false, errors };
	}
	
	// Check 2: lineMappings object exists (optional but should be present)
	const lineMappingsStart = content.indexOf("export const lineMappings: Record<string, LineMapping[]> = {");
	
	// Check 3: wordTimings closes before lineMappings
	if (lineMappingsStart !== -1) {
		const wordTimingsEnd = content.lastIndexOf("\n};", lineMappingsStart);
		if (wordTimingsEnd === -1 || wordTimingsEnd < wordTimingsStart) {
			errors.push("wordTimings does not close properly before lineMappings");
		}
	}
	
	// Check 4: No duplicate closing braces
	if (content.match(/;\s*\}\s*;(\s*\}\s*;)+/)) {
		errors.push("Duplicate closing braces found (};};)");
	}
	
	// Check 5: No line mappings in wordTimings section
	if (lineMappingsStart !== -1) {
		const wordTimingsSection = content.substring(wordTimingsStart, lineMappingsStart);
		if (wordTimingsSection.match(/[a-zA-Z0-9_-]+:\s*\[\s*\{[^}]*id:[^}]*\}/)) {
			errors.push("Line mappings found in wordTimings section");
		}
	}
	
	// Check 6: No word timings in lineMappings section
	if (lineMappingsStart !== -1) {
		const lineMappingsSection = content.substring(lineMappingsStart);
		if (lineMappingsSection.match(/slideName:\s*"[^"]+"\s*,\s*words:\s*\[/)) {
			errors.push("Word timings found in lineMappings section");
		}
	}
	
	return { valid: errors.length === 0, errors };
}

if (require.main === module) {
	const result = validateWordTimingsFile();
	if (result.valid) {
		console.log("✓ wordTimings.ts is valid");
		process.exit(0);
	} else {
		console.error("✗ wordTimings.ts has errors:");
		result.errors.forEach(err => console.error(`  - ${err}`));
		console.error("\nRun: npx tsx scripts/fixWordTimingsFile.ts");
		process.exit(1);
	}
}
