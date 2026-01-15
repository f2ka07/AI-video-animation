// Script to save word timings from TTS API to wordTimings.ts
// Run after generating audio to capture word-level timestamps

import * as fs from "fs";
import * as path from "path";
import { WordTiming } from "../src/utils/wordTimings";

interface SavedTiming {
	slideName: string;
	words: WordTiming[];
}

/**
 * Save word timings for a slide
 * This will update src/utils/wordTimings.ts with the actual TTS word timings
 */
export function saveWordTimings(slideName: string, words: WordTiming[]) {
	const timingsPath = path.join(__dirname, "../src/utils/wordTimings.ts");
	let content = fs.readFileSync(timingsPath, "utf-8");

	// Find the wordTimings object and update the specific slide
	const slideEntry = `\t${slideName}: { slideName: "${slideName}", words: [\n${words
		.map(
			(w) =>
				`\t\t{ text: "${w.text.replace(/"/g, '\\"')}", start: ${w.start}, end: ${w.end} }`
		)
		.join(",\n")}\n\t] }`;

	// Replace or add the slide entry
	const regex = new RegExp(
		`(\\t${slideName}:\\s*\\{[^}]*\\})`,
		"s"
	);

	if (regex.test(content)) {
		content = content.replace(regex, slideEntry);
	} else {
		// Add new entry before the closing brace
		content = content.replace(
			/(export const wordTimings: Record<string, SlideWordTimings> = \{[\s\S]*?)(\n\};)/,
			`$1${slideEntry},\n$2`
		);
	}

	fs.writeFileSync(timingsPath, content);
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
