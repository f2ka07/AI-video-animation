// Save word timings using AST-based approach
// This replaces the fragile string manipulation with TypeScript AST parsing

import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript";
import { WordTiming } from "../src/utils/wordTimings";

/**
 * Save word timings for a slide using AST manipulation
 * This prevents syntax errors and preserves file structure
 */
export function saveWordTimings(slideName: string, words: WordTiming[]) {
	const timingsPath = path.join(__dirname, "../src/utils/wordTimings.ts");
	const content = fs.readFileSync(timingsPath, "utf-8");

	// Parse the file
	const sourceFile = ts.createSourceFile(
		timingsPath,
		content,
		ts.ScriptTarget.Latest,
		true
	);

	// Find the wordTimings export
	let wordTimingsObject: ts.ObjectLiteralExpression | null = null;
	let wordTimingsStart = -1;
	let wordTimingsEnd = -1;

	function findWordTimings(node: ts.Node, depth: number = 0) {
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
					wordTimingsStart = node.getFullStart();
					wordTimingsEnd = node.getEnd();
				}
			});
		}

		ts.forEachChild(node, (child) => findWordTimings(child, depth + 1));
	}

	findWordTimings(sourceFile);

	if (!wordTimingsObject) {
		throw new Error("Could not find wordTimings object in file");
	}

	// Get existing properties
	const existingProps = wordTimingsObject.properties.filter((prop) => {
		if (ts.isPropertyAssignment(prop)) {
			const key = getPropertyKey(prop.name);
			return key !== slideName;
		}
		return true;
	});

	// Create new slide entry
	const newSlideProp = createSlideProperty(slideName, words);

	// Add new property
	const newProperties = [...existingProps, newSlideProp];

	// Create updated object literal
	const updatedObject = ts.factory.updateObjectLiteralExpression(
		wordTimingsObject,
		newProperties
	);

	// Create updated variable declaration
	const varDecl = ts.factory.createVariableDeclaration(
		"wordTimings",
		undefined,
		ts.factory.createTypeReferenceNode("Record<string, SlideWordTimings>", undefined),
		updatedObject
	);

	const varStmt = ts.factory.createVariableStatement(
		[ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
		ts.factory.createVariableDeclarationList([varDecl], ts.NodeFlags.Const)
	);

	// Generate new code
	const printer = ts.createPrinter({
		newLine: ts.NewLineKind.LineFeed,
		removeComments: false,
	});

	const newWordTimingsCode = printer.printNode(
		ts.EmitHint.Unspecified,
		varStmt,
		sourceFile
	);

	// Find where to insert (before lineMappings or at end)
	const lineMappingsIndex = content.indexOf("export const lineMappings");
	const beforeSection = lineMappingsIndex !== -1
		? content.substring(0, wordTimingsStart)
		: content.substring(0, wordTimingsStart);
	const afterSection = lineMappingsIndex !== -1
		? content.substring(lineMappingsIndex)
		: content.substring(wordTimingsEnd);

	// Format the new code with proper indentation
	const formattedCode = formatCode(newWordTimingsCode);

	const newContent = beforeSection + formattedCode + "\n\n" + afterSection;

	fs.writeFileSync(timingsPath, newContent, "utf-8");
	console.log(`✓ Saved word timings for ${slideName} (${words.length} words) using AST`);
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
