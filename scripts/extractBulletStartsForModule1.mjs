// Quick script to extract bulletStarts for module 1 using the extraction algorithm
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

// Load word timings
const timingsPath = join(ROOT, 'courses', 'agentic-ai-for-beginners', 'timings', 'module1.json');
const timings = JSON.parse(readFileSync(timingsPath, 'utf-8'));

// Bullet points from Module1.tsx
const bulletPoints = {
	'module-1-concept': [
		"Single-call inference: input in, output out, interaction ends",
		"No memory between interactions",
		"Cannot plan across multiple steps or use external tools",
		"Cannot verify outputs or adapt based on feedback",
		"Agentic AI: a system architecture that executes workflows"
	],
	'module-1-architecture': [
		"First, planning - decompose goals into subtasks",
		"Second, tools - APIs, code, search engines",
		"Third, memory - short-term and long-term retention",
		"Fourth, safety loops - guardrails and policy checks",
		"Fifth, human-in-the-loop - escalation and oversight"
	],
	'module-1-application': [
		"First, reliability - checkpoints, retries, and verification steps",
		"Second, traceability - audit trails for compliance",
		"Third, integration - connect to CRMs, ERPs, data warehouses",
		"Fourth, first-class tool integration - treats external tools as first-class citizens",
		"Fifth, new category of AI workload - executes workflows and manages processes"
	],
	'module-1-exam-mapping': [
		"Understand why the industry is shifting to agentic architectures",
		"Recognize limitations of single-call inference",
		"Vocabulary alignment: agent loop, tool use, grounding",
		"Conceptual foundation for certification terms",
		"Orientation layer for the rest of the course"
	],
	'module-1-recap': [
		"Prompting was the user interface, not the product",
		"Agents are architectures, not chatbots",
		"Enterprises need reliability, traceability, and integration",
		"NVIDIA is at the center of this transition",
		"This is the new baseline for AI systems"
	]
};

function normalizeWord(word) {
	return word.toLowerCase().replace(/[.,!?;:'"()\[\]{}]/g, "").trim();
}

function extractBulletStarts(words, points) {
	const starts = [];
	let lastFoundTime = 0;
	const ordinals = ["first", "second", "third", "fourth", "fifth"];

	for (let i = 0; i < points.length; i++) {
		const point = points[i];
		const pointLower = point.toLowerCase();
		let foundTime = null;

		// Strategy 1: Look for ordinal markers FIRST (most reliable)
		for (const ordinal of ordinals) {
			// Check if bullet contains this ordinal (at start, after comma, or anywhere)
			if (pointLower.includes(ordinal)) {
				for (let j = 0; j < words.length; j++) {
					const wordText = normalizeWord(words[j].text);
					// Match ordinal word exactly
					if (wordText === ordinal && words[j].start > lastFoundTime) {
						foundTime = words[j].start;
						break;
					}
				}
				if (foundTime !== null) break;
			}
		}

		// Strategy 2: Extract key distinctive words (skip common words like "the", "a", "is", etc.)
		if (foundTime === null) {
			const allWords = point.split(/\s+/).map(normalizeWord).filter(w => {
				// Filter out common words
				return w.length > 2 && !["the", "a", "an", "is", "are", "was", "were", "and", "or", "but", "to", "of", "in", "on", "at", "for", "with", "from"].includes(w);
			});
			
			// Try first 3-5 distinctive words
			const keyWords = allWords.slice(0, Math.min(5, allWords.length));
			
			if (keyWords.length >= 2) {
				// Try to find sequence of at least 2 key words
				for (let j = 0; j < words.length; j++) {
					let matchCount = 0;
					let firstMatchIndex = -1;
					
					// Look for key words in sequence (allow gaps for natural speech)
					for (let k = 0; k < keyWords.length && j + k < words.length; k++) {
						const wordText = normalizeWord(words[j + k].text);
						const keyWord = keyWords[k];
						
						// Match word or handle hyphenated words (e.g., "single-call" vs "single call")
						if (wordText === keyWord || 
						    wordText.includes(keyWord) || 
						    keyWord.includes(wordText) ||
						    wordText.replace(/-/g, "") === keyWord.replace(/-/g, "")) {
							if (firstMatchIndex === -1) firstMatchIndex = j + k;
							matchCount++;
						}
					}
					
					// If we matched at least 2 key words and it's after last found time
					if (matchCount >= 2 && firstMatchIndex >= 0 && words[firstMatchIndex].start > lastFoundTime) {
						foundTime = words[firstMatchIndex].start;
						break;
					}
				}
			}
		}

		if (foundTime !== null) {
			starts.push(foundTime);
			lastFoundTime = foundTime;
		} else {
			console.warn(`⚠ Could not find timing for bullet ${i + 1}: "${point.substring(0, 50)}..."`);
			if (starts.length > 0) {
				const avgGap = starts.length > 1 
					? (starts[starts.length - 1] - starts[0]) / (starts.length - 1)
					: 8;
				starts.push(starts[starts.length - 1] + avgGap);
				lastFoundTime = starts[starts.length - 1];
			} else {
				starts.push(0);
			}
		}
	}

	return starts;
}

const result = {};

for (const [slideName, points] of Object.entries(bulletPoints)) {
	const slideData = timings.slides[slideName];
	if (!slideData || !slideData.words) {
		console.warn(`⚠ No word timings for ${slideName}`);
		continue;
	}
	
	const starts = extractBulletStarts(slideData.words, points);
	result[slideName] = starts;
	
	console.log(`\n${slideName}:`);
	console.log(`  bulletStarts={[${starts.map(t => t.toFixed(2)).join(", ")}]}`);
}

const outputPath = join(ROOT, 'courses', 'agentic-ai-for-beginners', 'timings', 'module1-bulletStarts.json');
writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf-8');
console.log(`\n✅ Saved to ${outputPath}`);
