// Format code for slides: split long lines syntactically
// Python: parentheses continuation, intermediate variables for long chains
// TypeScript/JS: same rules

import * as fs from "fs";
import * as path from "path";

const MAX_LINE_LENGTH = 80;

function formatPythonCode(code: string): string {
	const lines = code.split("\n");
	const result: string[] = [];

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];

		if (line.length <= MAX_LINE_LENGTH) {
			result.push(line);
			continue;
		}

		// subprocess.run with long args - wrap inside ()
		const subprocessMatch = line.match(
			/^(\s*)(\w+)\s*=\s*subprocess\.run\s*\(\s*(\[.*?\])\s*,?\s*(.*?)\s*\)\s*$/
		);
		if (subprocessMatch) {
			const [, baseIndent, varName, args, rest] = subprocessMatch;
			const extraIndent = (baseIndent ?? "") + "    ";
			result.push(`${baseIndent}${varName} = subprocess.run(`);
			result.push(`${extraIndent}${args.trim()},`);
			const restTrimmed = rest.trim();
			if (restTrimmed) {
				result.push(`${extraIndent}${restTrimmed}`);
			}
			result.push(`${baseIndent})`);
			continue;
		}

		// Long chain: result.stdout.strip().split(...) -> use intermediate var
		const stripSplitMatch = line.match(
			/^(\s*)(\w+)\s*=\s*(\w+)\.(stdout|stderr)\.strip\(\)\.split\s*\([^)]+\)\s*$/
		);
		if (stripSplitMatch && line.length > MAX_LINE_LENGTH) {
			const [, baseIndent, lhsVar, obj, stream] = stripSplitMatch;
			const splitArg = line.match(/\.split\s*\(([^)]+)\)\s*$/)?.[1] ?? "'\\n'";
			result.push(`${baseIndent}output = ${obj}.${stream}.strip()`);
			result.push(`${baseIndent}${lhsVar} = output.split(${splitArg.trim()})`);
			continue;
		}

		// result.stdout.decode().split(...) -> intermediate var
		const decodeSplitMatch = line.match(
			/^(\s*)(\w+)\s*=\s*(\w+)\.(stdout|stderr)\.decode\(\)\.split\s*\([^)]+\)\s*$/
		);
		if (decodeSplitMatch && line.length > MAX_LINE_LENGTH) {
			const [, baseIndent, lhsVar, obj, stream] = decodeSplitMatch;
			const splitArg = line.match(/\.split\s*\(([^)]+)\)\s*$/)?.[1] ?? "'\\n'";
			result.push(`${baseIndent}output = ${obj}.${stream}.decode()`);
			result.push(`${baseIndent}${lhsVar} = output.split(${splitArg.trim()})`);
			continue;
		}

		// Long list/array literal - wrap at commas
		if (line.includes("[") && line.includes("]")) {
			const assignMatch = line.match(/^(\s*)(\w+)\s*=\s*(\[.*\])\s*$/);
			if (assignMatch) {
				const [, baseIndent, varName, arr] = assignMatch;
				const extraIndent = (baseIndent ?? "") + "    ";
				const inner = arr.slice(1, -1);
				const parts = inner.split(/,\s*(?![^[\]]*\])/).filter(Boolean);
				if (parts.length >= 2 && line.length > MAX_LINE_LENGTH) {
					result.push(`${baseIndent}${varName} = [`);
					for (let p = 0; p < parts.length; p++) {
						const comma = p < parts.length - 1 ? "," : "";
						result.push(`${extraIndent}${parts[p].trim()}${comma}`);
					}
					result.push(`${baseIndent}]`);
					continue;
				}
			}
		}

		result.push(line);
	}

	return result.join("\n");
}

function formatTypeScriptCode(code: string): string {
	const lines = code.split("\n");
	const result: string[] = [];
	for (const line of lines) {
		result.push(line);
	}
	return result.join("\n");
}

export function formatCode(code: string, language: string): string {
	const lang = (language || "python").toLowerCase();
	if (lang === "python" || lang === "py") {
		return formatPythonCode(code);
	}
	if (lang === "typescript" || lang === "javascript" || lang === "ts" || lang === "js") {
		return formatTypeScriptCode(code);
	}
	return code;
}

/**
 * Format code in content.json for a course
 */
export function formatContentJsonCode(contentPath: string): void {
	if (!fs.existsSync(contentPath)) {
		throw new Error(`Content file not found: ${contentPath}`);
	}

	const content = JSON.parse(fs.readFileSync(contentPath, "utf-8"));
	let changed = false;

	for (const mod of content.modules || []) {
		for (const slide of mod.slides || []) {
			if ((slide.type === "code" || slide.type === "code-diagram") && slide.code) {
				const lang = slide.language || "python";
				const formatted = formatCode(slide.code, lang);
				if (formatted !== slide.code) {
					slide.code = formatted;
					changed = true;
					console.log(`  Formatted: ${slide.name}`);
				}
			}
		}
	}

	if (changed) {
		fs.writeFileSync(contentPath, JSON.stringify(content, null, 2));
		console.log(`Updated: ${contentPath}`);
	} else {
		console.log("No changes needed");
	}
}

// CLI
if (require.main === module) {
	const contentPath =
		process.argv[2] ||
		path.join(__dirname, "../courses/comprehensive-wireless-networks/content.json");
	formatContentJsonCode(contentPath);
}
