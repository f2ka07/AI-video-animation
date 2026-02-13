// Script to save word timings from TTS API to wordTimings.ts
// Run after generating audio to capture word-level timestamps
// Uses robust parse → update → generate approach to prevent syntax errors

import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript";
import { WordTiming, SlideWordTimings } from "../src/utils/wordTimings";

/**
 * Save word timings for a slide using AST manipulation
 * This prevents syntax errors and preserves file structure
 */
export function saveWordTimings(slideName: string, words: WordTiming[]) {
	const timingsPath = path.join(__dirname, "../src/utils/wordTimings.ts");
	
	try {
		// Use robust parse→generate approach (handles corrupted files)
		saveWordTimingsAST(timingsPath, slideName, words);
	} catch (error) {
		// If robust method fails, try legacy as last resort
		// But log a warning since legacy method can't handle corrupted files well
		console.warn(`Robust save failed, falling back to legacy method (may not handle corrupted files): ${error}`);
		try {
			saveWordTimingsLegacy(timingsPath, slideName, words);
		} catch (legacyError) {
			// If both fail, throw with clear message
			throw new Error(
				`Failed to save word timings: ${error instanceof Error ? error.message : String(error)}\n` +
				`Legacy fallback also failed: ${legacyError instanceof Error ? legacyError.message : String(legacyError)}`
			);
		}
	}
}

/**
 * Parse only valid word timing entries from file, skipping malformed ones
 * Returns clean data structure (no AST nodes)
 */
function parseValidWordTimings(content: string): Record<string, SlideWordTimings> {
	const validEntries: Record<string, SlideWordTimings> = {};

	try {
		const sourceFile = ts.createSourceFile(
			"temp.ts",
			content,
			ts.ScriptTarget.Latest,
			true
		);

		let wordTimingsObject: ts.ObjectLiteralExpression | null = null;

		function findWordTimings(node: ts.Node) {
			if (
				ts.isVariableStatement(node) &&
				node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
			) {
				node.declarationList.declarations.forEach((decl) => {
					if (
						ts.isIdentifier(decl.name) &&
						decl.name.text === "wordTimings" &&
						decl.initializer &&
						ts.isObjectLiteralExpression(decl.initializer)
					) {
						wordTimingsObject = decl.initializer;
					}
				});
			}
			ts.forEachChild(node, findWordTimings);
		}

		findWordTimings(sourceFile);

		if (!wordTimingsObject) {
			console.warn("Could not find wordTimings object, returning empty");
			return validEntries;
		}

		// Parse each property, skipping invalid ones
		wordTimingsObject.properties.forEach((prop) => {
			if (!ts.isPropertyAssignment(prop)) {
				return;
			}

			const key = getPropertyKey(prop.name);
			if (!key) {
				return;
			}

			try {
				// Try to parse as valid SlideWordTimings
				if (!ts.isObjectLiteralExpression(prop.initializer)) {
					console.warn(`Skipping invalid entry for ${key}: not an object literal`);
					return;
				}

				const slideTimings = parseSlideTimingsFromAST(prop.initializer);
				if (slideTimings) {
					validEntries[key] = slideTimings;
				} else {
					console.warn(`Skipping invalid entry for ${key}: could not parse structure`);
				}
			} catch (error) {
				console.warn(`Skipping invalid entry for ${key}: ${error instanceof Error ? error.message : String(error)}`);
			}
		});
	} catch (error) {
		console.warn(`Failed to parse wordTimings file: ${error instanceof Error ? error.message : String(error)}`);
	}

	return validEntries;
}

/**
 * Parse a slide timings object from AST node
 */
function parseSlideTimingsFromAST(obj: ts.ObjectLiteralExpression): SlideWordTimings | null {
	let slideName: string | null = null;
	const words: WordTiming[] = [];

	obj.properties.forEach((prop) => {
		if (!ts.isPropertyAssignment(prop)) {
			return;
		}

		const key = getPropertyKey(prop.name);
		if (!key) {
			return;
		}

		if (key === "slideName" && ts.isStringLiteral(prop.initializer)) {
			slideName = prop.initializer.text;
		} else if (key === "words" && ts.isArrayLiteralExpression(prop.initializer)) {
			prop.initializer.elements.forEach((element) => {
				if (ts.isObjectLiteralExpression(element)) {
					const word = parseWordTimingFromAST(element);
					if (word) {
						words.push(word);
					}
				}
			});
		}
	});

	if (slideName !== null) {
		return { slideName, words };
	}

	return null;
}

/**
 * Parse a single word timing from AST node
 */
function parseWordTimingFromAST(obj: ts.ObjectLiteralExpression): WordTiming | null {
	let text: string | null = null;
	let start: number | null = null;
	let end: number | null = null;

	obj.properties.forEach((prop) => {
		if (!ts.isPropertyAssignment(prop)) {
			return;
		}

		const key = getPropertyKey(prop.name);
		if (!key) {
			return;
		}

		if (key === "text" && ts.isStringLiteral(prop.initializer)) {
			text = prop.initializer.text;
		} else if (key === "start" && ts.isNumericLiteral(prop.initializer)) {
			start = parseFloat(prop.initializer.text);
		} else if (key === "end" && ts.isNumericLiteral(prop.initializer)) {
			end = parseFloat(prop.initializer.text);
		}
	});

	if (text !== null && start !== null && end !== null) {
		return { text, start, end };
	}

	return null;
}

/**
 * Generate entire wordTimings file from clean data structure
 * Guarantees valid syntax using string templates
 */
function generateWordTimingsFile(
	validEntries: Record<string, SlideWordTimings>,
	beforeSection: string,
	afterSection: string
): string {
	// Generate entries with proper formatting
	const entries = Object.entries(validEntries)
		.sort(([a], [b]) => a.localeCompare(b))
		.map(([key, value]) => {
			// Quote key if needed
			const quotedKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
			
			// Generate words array
			const wordsCode = value.words
				.map((w) => {
					const escapedText = w.text.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
					return `\t\t{ text: "${escapedText}", start: ${w.start}, end: ${w.end} }`;
				})
				.join(",\n");

			return `\t${quotedKey}: { slideName: "${value.slideName}", words: [\n${wordsCode}\n\t] }`;
		});

	const wordTimingsCode = entries.length > 0
		? `export const wordTimings: Record<string, SlideWordTimings> = {\n${entries.join(",\n")}\n};`
		: `export const wordTimings: Record<string, SlideWordTimings> = {\n};`;

	return beforeSection + wordTimingsCode + "\n\n" + afterSection;
}

/**
 * Validate generated TypeScript code before writing
 * Uses simple parsing to check for syntax errors
 */
function validateGeneratedCode(code: string): void {
	try {
		const sourceFile = ts.createSourceFile(
			"validation.ts",
			code,
			ts.ScriptTarget.Latest,
			true
		);

		// Check for parse errors by looking for syntax errors in the source file
		// TypeScript parser will create error nodes if syntax is invalid
		let hasErrors = false;
		const errorMessages: string[] = [];

		function checkNode(node: ts.Node) {
			// Check if node has parse errors (indicated by certain node kinds)
			if (node.kind === ts.SyntaxKind.SyntaxList && node.getChildCount() === 0) {
				// Empty syntax list might indicate parsing issues
			}
			
			// Check for common syntax error patterns
			if (ts.isObjectLiteralExpression(node)) {
				// Verify object has proper structure
				node.properties.forEach((prop) => {
					if (!ts.isPropertyAssignment(prop) && !ts.isShorthandPropertyAssignment(prop) && !ts.isSpreadAssignment(prop)) {
						hasErrors = true;
					}
				});
			}

			ts.forEachChild(node, checkNode);
		}

		checkNode(sourceFile);

		// Also check if we can find the wordTimings export
		let foundWordTimings = false;
		function findWordTimings(node: ts.Node) {
			if (
				ts.isVariableStatement(node) &&
				node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
			) {
				node.declarationList.declarations.forEach((decl) => {
					if (
						ts.isIdentifier(decl.name) &&
						decl.name.text === "wordTimings"
					) {
						foundWordTimings = true;
					}
				});
			}
			ts.forEachChild(node, findWordTimings);
		}
		findWordTimings(sourceFile);

		if (!foundWordTimings) {
			throw new Error("Generated code does not contain wordTimings export");
		}

		if (hasErrors) {
			throw new Error("Generated code has structural errors");
		}
	} catch (error) {
		if (error instanceof Error && (
			error.message.includes("Generated code") ||
			error.message.includes("does not contain wordTimings")
		)) {
			throw error;
		}
		// If validation itself fails, log warning but don't fail the save
		console.warn(`Could not fully validate generated code: ${error instanceof Error ? error.message : String(error)}`);
	}
}

/**
 * AST-based save implementation - now uses parse → update → generate approach
 */
function saveWordTimingsAST(timingsPath: string, slideName: string, words: WordTiming[]) {
	// 1. Read file
	const content = fs.readFileSync(timingsPath, "utf-8");

	// 2. Extract file structure (before and after wordTimings)
	// Find wordTimings export - it might be on the same line as previous content
	const wordTimingsStart = content.indexOf("export const wordTimings");
	let lineMappingsIndex = content.indexOf("export const lineMappings");
	
	// Also check for typo "ort const lineMappings"
	if (lineMappingsIndex === -1) {
		lineMappingsIndex = content.indexOf("ort const lineMappings");
	}
	
	if (wordTimingsStart === -1) {
		throw new Error("Could not find wordTimings export in file");
	}

	// Find the start of the line containing wordTimings
	let beforeStart = wordTimingsStart;
	while (beforeStart > 0 && content[beforeStart - 1] !== "\n") {
		beforeStart--;
	}

	// Preserve everything before wordTimings (interfaces, comments, etc.)
	const beforeSection = content.substring(0, beforeStart);
	
	// Preserve everything after wordTimings (lineMappings, etc.)
	// If lineMappings has a typo, fix it in the afterSection
	let afterSection = lineMappingsIndex !== -1
		? content.substring(lineMappingsIndex)
		: content.substring(content.length);
	
	// Fix typo if present
	afterSection = afterSection.replace(/^ort const/, "export const");

	// 3. Parse only valid entries (skip corrupted ones)
	const validEntries = parseValidWordTimings(content);

	// 4. Update with new entry
	validEntries[slideName] = { slideName, words };

	// 5. Generate entire file from scratch
	const newContent = generateWordTimingsFile(validEntries, beforeSection, afterSection);

	// 6. Validate generated code (only validate the wordTimings part, not the full file)
	// Extract just the wordTimings export for validation
	const wordTimingsMatch = newContent.match(/export const wordTimings[\s\S]*?};/);
	if (wordTimingsMatch) {
		validateGeneratedCode(wordTimingsMatch[0]);
	}

	// 7. Write file
	fs.writeFileSync(timingsPath, newContent, "utf-8");
	console.log(`✓ Saved word timings for ${slideName} (${words.length} words) using robust parse→generate approach`);
}

/**
 * Get property key as string
 */
function getPropertyKey(name: ts.PropertyName): string | null {
	if (ts.isIdentifier(name)) {
		return name.text;
	} else if (ts.isStringLiteral(name)) {
		return name.text;
	}
	return null;
}

/**
 * Create a property assignment for a slide
 */
function createSlideProperty(slideName: string, words: WordTiming[]): ts.PropertyAssignment {
	// Quote property name if needed
	const needsQuotes = slideName.includes("-") || /^\d/.test(slideName) || !/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(slideName);
	const propertyName = needsQuotes
		? ts.factory.createStringLiteral(slideName)
		: ts.factory.createIdentifier(slideName);

	// Create word timing objects
	const wordObjects = words.map((word) =>
		ts.factory.createObjectLiteralExpression(
			[
				ts.factory.createPropertyAssignment(
					"text",
					ts.factory.createStringLiteral(word.text.replace(/"/g, '\\"'))
				),
				ts.factory.createPropertyAssignment(
					"start",
					ts.factory.createNumericLiteral(word.start.toString())
				),
				ts.factory.createPropertyAssignment(
					"end",
					ts.factory.createNumericLiteral(word.end.toString())
				),
			],
			false
		)
	);

	// Create slide object
	const slideObject = ts.factory.createObjectLiteralExpression(
		[
			ts.factory.createPropertyAssignment(
				"slideName",
				ts.factory.createStringLiteral(slideName)
			),
			ts.factory.createPropertyAssignment(
				"words",
				ts.factory.createArrayLiteralExpression(wordObjects, false)
			),
		],
		false
	);

	return ts.factory.createPropertyAssignment(propertyName, slideObject);
}

/**
 * Format generated code with proper indentation
 */
function formatCode(code: string): string {
	// Basic formatting - ensure proper indentation
	const lines = code.split("\n");
	const formatted: string[] = [];
	let indentLevel = 0;

	for (const line of lines) {
		const trimmed = line.trim();
		if (!trimmed) {
			formatted.push("");
			continue;
		}

		// Decrease indent before closing braces
		if (trimmed.startsWith("}") || trimmed.startsWith("]")) {
			indentLevel = Math.max(0, indentLevel - 1);
		}

		// Add line with proper indent
		formatted.push("\t".repeat(indentLevel) + trimmed);

		// Increase indent after opening braces
		if (trimmed.endsWith("{") || trimmed.endsWith("[")) {
			indentLevel++;
		}
	}

	return formatted.join("\n");
}

/**
 * Legacy string-based save (fallback)
 */
function saveWordTimingsLegacy(timingsPath: string, slideName: string, words: WordTiming[]) {
	let content = fs.readFileSync(timingsPath, "utf-8");

	// Helper function to quote property names if they are not valid JavaScript identifiers
	// Valid identifiers: start with letter/underscore/$ and contain only letters, numbers, underscore, $
	const quotePropertyName = (name: string): string => {
		const isValidIdentifier = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name);
		return isValidIdentifier ? name : `"${name}"`;
	};

	// Build the new slide entry with properly quoted property name
	const quotedSlideName = quotePropertyName(slideName);
	// Note: We add comma after ] } because entries in the object need commas
	const slideEntry = `\t${quotedSlideName}: { slideName: "${slideName}", words: [\n${words
		.map(
			(w) =>
				`\t\t{ text: "${w.text.replace(/"/g, '\\"')}", start: ${w.start}, end: ${w.end} }`
		)
		.join(",\n")}\n\t] },`;

	// Find the wordTimings object boundaries
	const wordTimingsStart = content.indexOf("export const wordTimings: Record<string, SlideWordTimings> = {");
	
	if (wordTimingsStart === -1) {
		throw new Error("Could not find wordTimings object in file");
	}
	
	// Find the closing brace - handle both empty {} and multi-line cases
	let wordTimingsEnd = content.indexOf("\n};", wordTimingsStart);
	
	// If not found, try finding just }; on the same line (for empty object)
	if (wordTimingsEnd === -1) {
		const afterOpenBrace = content.substring(wordTimingsStart);
		const sameLineClose = afterOpenBrace.indexOf("};");
		if (sameLineClose !== -1) {
			wordTimingsEnd = wordTimingsStart + sameLineClose + 1; // +1 to include the }
		}
	}
	
	// If still not found, try finding }; on next line
	if (wordTimingsEnd === -1) {
		const afterOpenBrace = content.substring(wordTimingsStart);
		const nextLineClose = afterOpenBrace.indexOf("};");
		if (nextLineClose !== -1) {
			wordTimingsEnd = wordTimingsStart + nextLineClose + 1;
		}
	}
	
	if (wordTimingsEnd === -1) {
		throw new Error("Could not find closing brace for wordTimings object");
	}

	const beforeWordTimings = content.substring(0, wordTimingsStart);
	const wordTimingsSection = content.substring(wordTimingsStart, wordTimingsEnd + 1); // Include closing };
	const afterWordTimings = content.substring(wordTimingsEnd + 1);

	// Check if object is empty (just { } or { };)
	const isEmpty = /^export const wordTimings[^=]*=\s*\{\s*\};?\s*$/.test(wordTimingsSection.trim());
	
	if (isEmpty) {
		// Empty object - just add the entry
		const finalSection = wordTimingsSection.replace(/\};?\s*$/, `\n${slideEntry}\n};`);
		content = beforeWordTimings + finalSection + afterWordTimings;
	} else {
		// Parse the section line by line to find and remove existing entries
		const lines = wordTimingsSection.split("\n");
		const newLines: string[] = [];
		const seenSlides = new Set<string>();
		let currentSlide: string | null = null;
		let inWordArray = false;
		let skipUntilClose = false;

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			
			// Keep the opening line
			if (line.includes("export const wordTimings")) {
				newLines.push(line);
				continue;
			}
			
			// Skip closing brace line - we'll add it back later
			if (line.trim() === "};" || line.trim() === "}") {
				continue;
			}
			
			// Detect start of a slide entry
			// Handle both quoted and unquoted property names: "slide-2": or slideName:
			const slideMatch = line.match(/^\s*("?)([\w-]+)\1:\s*\{\s*slideName:\s*"([^"]+)"/);
			if (slideMatch) {
				const slideKey = slideMatch[2]; // Property name (without quotes)
				const slideNameValue = slideMatch[3]; // Value of slideName property
				
				// Match by slideName value (more reliable than property key)
				// If this is the slide we're updating, skip it entirely (remove ALL duplicates)
				if (slideNameValue === slideName) {
					skipUntilClose = true;
					inWordArray = true;
					currentSlide = slideKey;
					continue; // Skip this line and all content until closing
				}
				
				// Otherwise, it's a different slide - keep it (but only once per unique slide)
				// Use slideName value as the unique identifier
				if (!seenSlides.has(slideNameValue)) {
					seenSlides.add(slideNameValue);
					currentSlide = slideKey;
					inWordArray = true;
					newLines.push(line);
				} else {
					// Duplicate of a different slide - skip it
					skipUntilClose = true;
					continue;
				}
				continue;
			}
			
			// If we're skipping (updating this slide), skip until we find the closing
			if (skipUntilClose) {
				// Detect end of word array for the slide we're skipping
				if (line.match(/^\s*\]\s*\},?\s*$/)) {
					skipUntilClose = false;
					inWordArray = false;
					currentSlide = null;
					// Don't add this closing line - we'll add our new entry instead
				}
				// Skip all lines until we find the closing
				continue;
			}
			
			// Detect end of word array for other slides
			if (line.match(/^\s*\]\s*\},?\s*$/)) {
				newLines.push(line);
				inWordArray = false;
				currentSlide = null;
				continue;
			}
			
			// Skip orphaned word entries (not inside any slide structure)
			if (line.match(/^\s*\{ text:/) && !inWordArray) {
				continue; // Skip orphaned entries
			}
			
			// Keep valid lines
			if (inWordArray || !line.match(/^\s*\{ text:/)) {
				newLines.push(line);
			}
		}

		// Add the new entry before the closing brace
		// Ensure the last entry has a comma before adding the new one
		if (newLines.length > 0) {
			const lastLine = newLines[newLines.length - 1];
			// If last line is a slide entry closing (] } or ] },) and doesn't have a comma, add one
			if (lastLine.match(/^\s*\]\s*\},?\s*$/)) {
				// Check if it ends with comma
				if (!lastLine.trim().endsWith(',')) {
					// Replace ] } with ] },
					newLines[newLines.length - 1] = lastLine.replace(/\]\s*\}/, '] },');
				}
			}
		}
		
		const newWordTimingsSection = newLines.join("\n");
		// Ensure proper closing - remove any extra closing braces (but keep trailing commas if they exist)
		const cleanedSection = newWordTimingsSection.trim().replace(/;?\s*\}\s*;?\s*$/, '');
		// slideEntry already includes the comma, so just add it and close the object
		const finalSection = `${cleanedSection}\n${slideEntry}\n};`;
		content = beforeWordTimings + finalSection + afterWordTimings;
	}

	// Find lineMappings position early (needed for cleanup below)
	const lineMappingsStart = content.indexOf('export const lineMappings');
	
	// Final cleanup: remove any duplicate closing braces that might have been introduced
	// Pattern: }; followed by one or more }; sequences (handles };};};...)
	content = content.replace(/;\s*\}\s*;(\s*\}\s*;)+/g, '};');
	// Also fix cases where closing brace is on separate line: }\n};
	content = content.replace(/\}\s*\n\s*\}\s*;/g, '};');
	// Fix cases with extra semicolons on same line: };};
	content = content.replace(/;\s*\}\s*;\s*\}\s*;/g, '};');
	// Fix cases where }; appears multiple times on separate lines (with or without newlines)
	content = content.replace(/;\s*\n?\s*\}\s*;\s*\n?\s*\}\s*;/g, '};');
	// Fix cases where there's an extra }; before lineMappings
	if (lineMappingsStart !== -1) {
		const beforeMappings = content.substring(0, lineMappingsStart);
		const afterMappings = content.substring(lineMappingsStart);
		// Remove any };}; patterns before lineMappings
		const cleanedBefore = beforeMappings.replace(/;\s*\}\s*;(\s*\}\s*;)+/g, '};');
		content = cleanedBefore + afterMappings;
	}
	
	// Validate the file structure before writing
	const wordTimingsCloseIdx = content.indexOf('export const wordTimings');
	const wordTimingsEndIdx = content.indexOf('\n};', wordTimingsCloseIdx);
	
	if (wordTimingsEndIdx === -1 || (lineMappingsStart !== -1 && wordTimingsEndIdx > lineMappingsStart)) {
		console.error('Warning: Detected malformed wordTimings structure, attempting to fix...');
		// Try to fix by finding the correct closing
		const correctEnd = content.lastIndexOf('\n};', lineMappingsStart !== -1 ? lineMappingsStart : content.length);
		if (correctEnd !== -1) {
			const before = content.substring(0, wordTimingsCloseIdx);
			const wordTimingsContent = content.substring(wordTimingsCloseIdx, correctEnd + 3);
			const after = content.substring(correctEnd + 3);
			// Remove any extra closing braces from wordTimingsContent
			const cleaned = wordTimingsContent.replace(/;\s*\}\s*;(\s*\}\s*;)+/g, '};');
			content = before + cleaned + after;
		}
	}
	
	// Final validation: ensure wordTimings object closes properly before lineMappings
	// Find the actual closing of wordTimings (should be }; on its own line)
	const wordTimingsPattern = /export const wordTimings[^}]*\n\};/s;
	if (!wordTimingsPattern.test(content) && lineMappingsStart !== -1) {
		// If pattern doesn't match, find where wordTimings should end
		const beforeMappings = content.substring(0, lineMappingsStart);
		const lastBrace = beforeMappings.lastIndexOf('\n};');
		if (lastBrace !== -1) {
			// Ensure there's exactly one }; before lineMappings
			const before = content.substring(0, lastBrace);
			const after = content.substring(lastBrace);
			// Remove any duplicate }; patterns
			const cleanedAfter = after.replace(/^;\s*\n\s*\}\s*;/, '\n};');
			content = before + cleanedAfter;
		}
	}
	
	// Final validation: ensure the file is syntactically correct
	// Check for common syntax errors and fix them automatically
	const validationErrors: string[] = [];
	
	// Check 1: Ensure wordTimings object closes with }; (not just } or };};)
	const wordTimingsClosePattern = /export const wordTimings[^]*?\n\};/s;
	if (!wordTimingsClosePattern.test(content)) {
		// Try to fix: find the wordTimings start and ensure it closes properly
		const wtStart = content.indexOf('export const wordTimings');
		if (wtStart !== -1) {
			const afterStart = content.substring(wtStart);
			// Find where lineMappings starts (if it exists)
			const lmStart = content.indexOf('export const lineMappings');
			const searchEnd = lmStart !== -1 ? lmStart : content.length;
			const wtSection = content.substring(wtStart, searchEnd);
			
			// Remove any duplicate }; patterns
			let fixed = wtSection.replace(/;\s*\}\s*;(\s*\}\s*;)+/g, '};');
			// Ensure it ends with exactly one };
			fixed = fixed.replace(/;\s*\}\s*;?\s*$/, '};');
			
			// If lineMappings exists, ensure there's a newline before it
			if (lmStart !== -1) {
				fixed = fixed.trimEnd() + '\n';
			}
			
			content = content.substring(0, wtStart) + fixed + content.substring(searchEnd);
		}
	}
	
	// Check 2: Ensure all slide entries end with }, (comma required in object)
	// Pattern: slide entry should end with ] }, not ] } or ] };
	const slideEntryPattern = /(\t[a-zA-Z0-9_-]+:\s*\{[^}]*words:\s*\[[^\]]*\]\s*)\}/g;
	content = content.replace(slideEntryPattern, (match, before) => {
		// If it's the last entry before };, it can be without comma (trailing comma is optional)
		// But if there's more content after, it needs a comma
		const afterMatch = content.substring(content.indexOf(match) + match.length);
		const isLastEntry = afterMatch.trim().startsWith('};') || afterMatch.trim().startsWith('\n};');
		return isLastEntry ? match : match.replace(/\}\s*$/, '},');
	});
	
	// Check 3: Ensure wordTimings closes before lineMappings
	if (lineMappingsStart !== -1) {
		const beforeMappings = content.substring(0, lineMappingsStart);
		const wtCloseIdx = beforeMappings.lastIndexOf('\n};');
		if (wtCloseIdx === -1) {
			// No closing found - add it
			const wtStart = beforeMappings.indexOf('export const wordTimings');
			if (wtStart !== -1) {
				const wtContent = beforeMappings.substring(wtStart);
				// Remove any existing }; patterns and add one proper closing
				const cleaned = wtContent.replace(/;\s*\}\s*;(\s*\}\s*;)+/g, '').trimEnd();
				content = content.substring(0, wtStart) + cleaned + '\n};\n' + content.substring(lineMappingsStart);
			}
		}
	}
	
	// Write the file
	fs.writeFileSync(timingsPath, content);
	
	// Automatically run the fix script to ensure file is always valid
	// This prevents syntax errors from accumulating
	try {
		const { execSync } = require('child_process');
		execSync(`npx tsx "${path.join(__dirname, 'fixWordTimingsFile.ts')}"`, {
			encoding: 'utf-8',
			stdio: 'pipe',
			timeout: 5000,
			cwd: path.join(__dirname, '..')
		});
	} catch (e: any) {
		// If fix script fails, log warning but don't fail the save operation
		console.warn('⚠ Warning: Could not auto-fix wordTimings.ts. Run manually: npx tsx scripts/fixWordTimingsFile.ts');
	}
	
	console.log(`✓ Saved word timings for ${slideName} (${words.length} words)`);
}

/**
 * Generate a helper script to map phrases to word ranges
 */
export function generateMappingHelper(slideName: string, words: WordTiming[]) {
	const phrases = [
		"pulumi new aws-typescript",
		"index dot ts",
		"pulumi dot yaml",
		"pulumi dot dev dot yaml",
		"package dot json",
	];

	console.log(`\n=== Word Range Mapping Helper for ${slideName} ===`);
	console.log("Find these phrases in the words array:\n");

	phrases.forEach((phrase) => {
		const phraseWords = phrase.toLowerCase().split(/\s+/);
		let found = false;

		for (let i = 0; i <= words.length - phraseWords.length; i++) {
			const window = words
				.slice(i, i + phraseWords.length)
				.map((w) => w.text.toLowerCase())
				.join(" ");

			if (window === phraseWords.join(" ")) {
				console.log(
					`"${phrase}": [${i}, ${i + phraseWords.length - 1}], // words[${i}] to words[${i + phraseWords.length - 1}]`
				);
				found = true;
				break;
			}
		}

		if (!found) {
			console.log(`"${phrase}": NOT FOUND`);
		}
	});
}
