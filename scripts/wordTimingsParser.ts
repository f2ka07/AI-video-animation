// AST-based parser for wordTimings.ts
// Uses TypeScript compiler API to safely parse and modify the file

import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript";

export interface WordTiming {
	text: string;
	start: number;
	end: number;
}

export interface SlideWordTimings {
	slideName: string;
	words: WordTiming[];
}

/**
 * Parse wordTimings.ts file using TypeScript AST
 */
export function parseWordTimingsFile(filePath: string): Record<string, SlideWordTimings> {
	const content = fs.readFileSync(filePath, "utf-8");
	const sourceFile = ts.createSourceFile(
		filePath,
		content,
		ts.ScriptTarget.Latest,
		true
	);

	const wordTimings: Record<string, SlideWordTimings> = {};

	// Find the wordTimings export
	function visit(node: ts.Node) {
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
					parseWordTimingsObject(decl.initializer, wordTimings);
				}
			});
		}

		ts.forEachChild(node, visit);
	}

	visit(sourceFile);
	return wordTimings;
}

/**
 * Parse the wordTimings object literal
 */
function parseWordTimingsObject(
	obj: ts.ObjectLiteralExpression,
	result: Record<string, SlideWordTimings>
) {
	obj.properties.forEach((prop) => {
		if (ts.isPropertyAssignment(prop)) {
			const key = getPropertyKey(prop.name);
			if (key && ts.isObjectLiteralExpression(prop.initializer)) {
				const slideTimings = parseSlideTimings(prop.initializer);
				if (slideTimings) {
					result[key] = slideTimings;
				}
			}
		}
	});
}

/**
 * Parse a single slide's timings object
 */
function parseSlideTimings(
	obj: ts.ObjectLiteralExpression
): SlideWordTimings | null {
	let slideName: string | null = null;
	const words: WordTiming[] = [];

	obj.properties.forEach((prop) => {
		if (ts.isPropertyAssignment(prop)) {
			const key = getPropertyKey(prop.name);

			if (key === "slideName" && ts.isStringLiteral(prop.initializer)) {
				slideName = prop.initializer.text;
			} else if (key === "words" && ts.isArrayLiteralExpression(prop.initializer)) {
				prop.initializer.elements.forEach((elem) => {
					if (ts.isObjectLiteralExpression(elem)) {
						const word = parseWordTiming(elem);
						if (word) {
							words.push(word);
						}
					}
				});
			}
		}
	});

	if (slideName) {
		return { slideName, words };
	}

	return null;
}

/**
 * Parse a single word timing object
 */
function parseWordTiming(obj: ts.ObjectLiteralExpression): WordTiming | null {
	let text: string | null = null;
	let start: number | null = null;
	let end: number | null = null;

	obj.properties.forEach((prop) => {
		if (ts.isPropertyAssignment(prop)) {
			const key = getPropertyKey(prop.name);

			if (key === "text" && ts.isStringLiteral(prop.initializer)) {
				text = prop.initializer.text;
			} else if (key === "start" && ts.isNumericLiteral(prop.initializer)) {
				start = parseFloat(prop.initializer.text);
			} else if (key === "end" && ts.isNumericLiteral(prop.initializer)) {
				end = parseFloat(prop.initializer.text);
			}
		}
	});

	if (text !== null && start !== null && end !== null) {
		return { text, start, end };
	}

	return null;
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
 * Update wordTimings.ts file using AST manipulation
 */
export function updateWordTimingsFile(
	filePath: string,
	slideName: string,
	words: WordTiming[]
): void {
	const content = fs.readFileSync(filePath, "utf-8");
	const sourceFile = ts.createSourceFile(
		filePath,
		content,
		ts.ScriptTarget.Latest,
		true
	);

	// Find the wordTimings export
	let wordTimingsNode: ts.ObjectLiteralExpression | null = null;

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
					wordTimingsNode = decl.initializer;
				}
			});
		}

		ts.forEachChild(node, findWordTimings);
	}

	findWordTimings(sourceFile);

	if (!wordTimingsNode) {
		throw new Error("Could not find wordTimings object in file");
	}

	// Check if slide already exists
	const existingProps = wordTimingsNode.properties.filter((prop) => {
		if (ts.isPropertyAssignment(prop)) {
			const key = getPropertyKey(prop.name);
			return key === slideName;
		}
		return false;
	});

	// Create new slide entry
	const slideEntry = createSlideEntry(slideName, words);

	// Remove existing entry if it exists
	const newProperties = wordTimingsNode.properties.filter((prop) => {
		if (ts.isPropertyAssignment(prop)) {
			const key = getPropertyKey(prop.name);
			return key !== slideName;
		}
		return true;
	});

	// Add new entry
	const newSlideProp = ts.factory.createPropertyAssignment(
		slideName.includes("-") || /^\d/.test(slideName)
			? ts.factory.createStringLiteral(slideName)
			: ts.factory.createIdentifier(slideName),
		slideEntry
	);

	newProperties.push(newSlideProp);

	// Create new object literal
	const newWordTimings = ts.factory.updateObjectLiteralExpression(
		wordTimingsNode,
		newProperties
	);

	// Recreate the variable declaration
	const newDecl = ts.factory.createVariableDeclaration(
		"wordTimings",
		undefined,
		ts.factory.createTypeReferenceNode("Record<string, SlideWordTimings>", undefined),
		newWordTimings
	);

	const newVarStmt = ts.factory.createVariableStatement(
		[ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
		ts.factory.createVariableDeclarationList([newDecl], ts.NodeFlags.Const)
	);

	// Generate new file content
	const printer = ts.createPrinter({
		newLine: ts.NewLineKind.LineFeed,
		removeComments: false,
	});

	// We need to replace the entire export statement
	// For now, we'll use a simpler approach: regenerate the entire wordTimings section
	const beforeWordTimings = content.substring(
		0,
		content.indexOf("export const wordTimings")
	);
	const afterWordTimings = content.substring(
		content.indexOf("export const lineMappings") !== -1
			? content.indexOf("export const lineMappings")
			: content.length
	);

	// Generate the new wordTimings section
	const newWordTimingsContent = printer.printNode(
		ts.EmitHint.Unspecified,
		newVarStmt,
		sourceFile
	);

	// Format the new content properly
	const formattedContent = formatWordTimingsSection(newWordTimingsContent, words);

	const newContent = beforeWordTimings + formattedContent + "\n\n" + afterWordTimings;

	fs.writeFileSync(filePath, newContent, "utf-8");
}

/**
 * Create a slide entry AST node
 */
function createSlideEntry(slideName: string, words: WordTiming[]): ts.ObjectLiteralExpression {
	const wordElements = words.map((word) =>
		ts.factory.createObjectLiteralExpression([
			ts.factory.createPropertyAssignment("text", ts.factory.createStringLiteral(word.text)),
			ts.factory.createPropertyAssignment("start", ts.factory.createNumericLiteral(word.start.toString())),
			ts.factory.createPropertyAssignment("end", ts.factory.createNumericLiteral(word.end.toString())),
		])
	);

	return ts.factory.createObjectLiteralExpression([
		ts.factory.createPropertyAssignment("slideName", ts.factory.createStringLiteral(slideName)),
		ts.factory.createPropertyAssignment("words", ts.factory.createArrayLiteralExpression(wordElements)),
	]);
}

/**
 * Format the wordTimings section with proper indentation
 */
function formatWordTimingsSection(content: string, words: WordTiming[]): string {
	// Simple formatting - in production, you might want to use a formatter like Prettier
	// For now, we'll use a basic approach
	return content
		.replace(/\{/g, "{\n\t\t")
		.replace(/\}/g, "\n\t}")
		.replace(/,\s*([}\]])/g, "$1")
		.replace(/\s+/g, " ")
		.replace(/\t/g, "\t");
}
