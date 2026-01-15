// Helper script to automatically map phrases to word ranges
// Run after word timings are saved to automatically update lineMappings

import * as fs from "fs";
import * as path from "path";

// Import types only (avoid runtime import issues)
interface WordTiming {
	text: string;
	start: number;
	end: number;
}

interface SlideWordTimings {
	slideName: string;
	words: WordTiming[];
}

// Read word timings from the file directly
function getWordTimings(): Record<string, SlideWordTimings> {
	const timingsPath = path.join(__dirname, "../src/utils/wordTimings.ts");
	const content = fs.readFileSync(timingsPath, "utf-8");
	
	// Parse the wordTimings object from the file
	// This is a simple parser - in production you might want a more robust solution
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

function findWordRange(words: WordTiming[], phrase: string): [number, number] | null {
	const phraseWords = phrase.toLowerCase().split(/\s+/);
	
	for (let i = 0; i <= words.length - phraseWords.length; i++) {
		const window = words
			.slice(i, i + phraseWords.length)
			.map((w) => w.text.toLowerCase())
			.join(" ");

		if (window === phraseWords.join(" ")) {
			return [i, i + phraseWords.length - 1];
		}
	}

	return null;
}

// Phrase-to-line mappings for each slide
// These are the phrases we want to highlight and which lines they correspond to
const phraseMappings: Record<string, Record<string, number>> = {
	initCode: {
		"pulumi new typescript": 2, // Audio says "typescript" not "aws-typescript"
		"index ts": 5, // Audio says "index ts" not "index dot ts"
		"pulumi yaml": 6, // Audio says "pulumi yaml" not "pulumi dot yaml"
		"pulumi dev yaml": 7, // Audio says "pulumi dev yaml" not "pulumi dot dev dot yaml"
		"package json": 8, // Audio says "package json" not "package dot json"
	},
	typescriptCode: {
		"we import": 1, // "We import the AWS library"
		"create a vpc": 4,
		"cidr block": 5,
		"enable hostnames": 6, // Audio says "enable hostnames" not "dns hostnames"
		"dns support": 7,
		"organizational tags": 8,
		"export the vpc": 15,
	},
	workflow: {
		"pulumi creates": 1, // Audio says "pulumi creates your project" for init
		"pulumi preview": 2,
		"pulumi up": 3,
		"pulumi destroy": 4,
		"pulumi config": 5,
	},
};

function updateLineMappings() {
	const timingsPath = path.join(__dirname, "../src/utils/wordTimings.ts");
	let content = fs.readFileSync(timingsPath, "utf-8");
	const wordTimings = getWordTimings();

	console.log("Auto-mapping phrases to word ranges...\n");

	for (const [slideName, phrases] of Object.entries(phraseMappings)) {
		const timings = wordTimings[slideName];
		if (!timings || !timings.words.length) {
			console.log(`⚠ ${slideName}: No word timings available yet`);
			console.log(`   Run 'npm run generate-audio' first to get word timings.\n`);
			continue;
		}

		const mappings: string[] = [];
		for (const [phrase, lineNumber] of Object.entries(phrases)) {
			const wordRange = findWordRange(timings.words, phrase);
			if (wordRange) {
				const id = phrase.toLowerCase().replace(/\s+/g, "-").replace(/\./g, "-");
				mappings.push(
					`\t\t{\n\t\t\tid: "${id}",\n\t\t\tline: ${lineNumber},\n\t\t\twordRange: [${wordRange[0]}, ${wordRange[1]}],\n\t\t}`
				);
				console.log(`✓ ${slideName}: "${phrase}" → line ${lineNumber}, words[${wordRange[0]}-${wordRange[1]}]`);
			} else {
				console.log(`✗ ${slideName}: Could not find phrase "${phrase}"`);
			}
		}

		// Update the lineMappings in the file
		const mappingRegex = new RegExp(
			`(${slideName}:\\s*\\[[\\s\\S]*?\\])`,
			"m"
		);

		const newMapping = `${slideName}: [\n${mappings.join(",\n")}\n\t],`;

		if (mappingRegex.test(content)) {
			content = content.replace(mappingRegex, newMapping);
		}
	}

	fs.writeFileSync(timingsPath, content);
	console.log("\n✓ Updated lineMappings in wordTimings.ts");
}

updateLineMappings();
