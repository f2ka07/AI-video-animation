// Manual bullet start time extraction helper
// This script helps you identify the correct bulletStarts by analyzing the narration
// Usage: npx tsx scripts/manualBulletStarts.ts [moduleNumber] [courseId] [slideName]

import * as fs from "fs";
import * as path from "path";
import { loadModuleTimings } from "./saveTimingsJson";

interface WordTiming {
	text: string;
	start: number;
	end: number;
}

// Manual timestamps extracted by listening to audio
// Format: { slideName: [bullet1, bullet2, bullet3, bullet4, bullet5] }
// 
// TO SET THESE:
// 1. Open the audio file in an audio player (VLC, Audacity, etc.)
// 2. Play the audio and note the timestamp (in seconds) when each bullet is mentioned
// 3. Add the timestamps below, then re-run this script
const manualBulletStarts: Record<string, number[]> = {
	// Example (replace with actual timestamps from listening):
	// "module-1-concept": [28.58, 51.34, 61.63, 64.52, 72.17],
};

function findPhraseInTimings(words: WordTiming[], phrase: string): number | null {
	const phraseWords = phrase.toLowerCase().split(/\s+/).filter(w => w.length > 0);
	
	// Find where the phrase starts by looking for the first word
	for (let i = 0; i < words.length; i++) {
		if (words[i].text.toLowerCase() === phraseWords[0]) {
			// Check if subsequent words match
			let match = true;
			for (let j = 1; j < phraseWords.length && i + j < words.length; j++) {
				if (words[i + j].text.toLowerCase() !== phraseWords[j]) {
					match = false;
					break;
				}
			}
			if (match) {
				return words[i].start;
			}
		}
	}
	return null;
}

function suggestBulletStarts(
	slideName: string,
	words: WordTiming[],
	points: string[]
): number[] {
	const starts: number[] = [];
	
	for (const point of points) {
		// Extract key phrase from bullet point (first 3-5 words)
		const wordsInPoint = point.split(/\s+/).filter(w => w.length > 0);
		const keyPhrase = wordsInPoint.slice(0, Math.min(5, wordsInPoint.length)).join(" ");
		
		const time = findPhraseInTimings(words, keyPhrase);
		if (time !== null) {
			starts.push(time);
		} else {
			// Try with just the first significant word
			const firstWord = wordsInPoint.find(w => w.length > 2 && !["the", "a", "an", "is", "are"].includes(w.toLowerCase()));
			if (firstWord) {
				const fallbackTime = findPhraseInTimings(words, firstWord);
				if (fallbackTime !== null) {
					starts.push(fallbackTime);
				} else {
					console.warn(`⚠ Could not find phrase: "${keyPhrase}"`);
					starts.push(0); // Placeholder
				}
			}
		}
	}
	
	return starts;
}

function analyzeSlide(courseId: string, moduleNumber: number, slideName: string): void {
	console.log(`\n🔍 Analyzing ${slideName} for bullet start times...\n`);

	const timings = loadModuleTimings(courseId, moduleNumber);
	if (!timings || !timings.slides[slideName]) {
		console.error(`❌ No timings found for ${slideName}`);
		return;
	}

	const words = timings.slides[slideName].words;
	if (!words || words.length === 0) {
		console.error(`❌ No word timings found for ${slideName}`);
		return;
	}

	// Get bullet points from Module1.tsx (hardcoded for now)
	const bulletPoints: Record<string, string[]> = {
		"module-1-concept": [
			"Single-call inference: input in, output out, interaction ends",
			"No memory between interactions",
			"Cannot plan across multiple steps or use external tools",
			"Cannot verify outputs or adapt based on feedback",
			"Agentic AI: a system architecture that executes workflows",
		],
		"module-1-architecture": [
			"First, planning - decompose goals into subtasks",
			"Second, tools - APIs, code, search engines",
			"Third, memory - short-term and long-term retention",
			"Fourth, safety loops - guardrails and policy checks",
			"Fifth, human-in-the-loop - escalation and oversight",
		],
		"module-1-application": [
			"First, reliability - checkpoints, retries, and verification steps",
			"Second, traceability - audit trails for compliance",
			"Third, integration - connect to CRMs, ERPs, data warehouses",
			"Fourth, first-class tool integration - treats external tools as first-class citizens",
			"Fifth, new category of AI workload - executes workflows and manages processes",
		],
	};

	const points = bulletPoints[slideName];
	if (!points) {
		console.error(`❌ No bullet points configured for ${slideName}`);
		return;
	}

	console.log("=".repeat(80));
	console.log("BULLET POINTS AND SUGGESTED TIMINGS");
	console.log("=".repeat(80));
	console.log(`\nAudio duration: ${words[words.length - 1].end.toFixed(2)}s\n`);

	const suggested = suggestBulletStarts(slideName, words, points);
	const manual = manualBulletStarts[slideName];

	console.log("Suggested timings (from word timings - may be inaccurate):");
	for (let i = 0; i < points.length; i++) {
		console.log(`  ${i + 1}. [${suggested[i].toFixed(2)}s] ${points[i]}`);
	}

	if (manual && manual.length === 5) {
		console.log("\n" + "=".repeat(80));
		console.log("MANUAL TIMINGS (if set):");
		for (let i = 0; i < points.length; i++) {
			console.log(`  ${i + 1}. [${manual[i].toFixed(2)}s] ${points[i]}`);
		}
		console.log(`\n  Code: bulletStarts={[${manual.map(t => t.toFixed(2)).join(", ")}]}`);
	} else {
		console.log("\n" + "=".repeat(80));
		console.log("TO SET MANUAL TIMINGS:");
		console.log("=".repeat(80));
		console.log("\n1. Open the audio file:");
		console.log(`   public/audio/agentic-ai-for-beginners/module${moduleNumber}-${slideName}.wav`);
		console.log("\n2. Listen to the narration and note when each bullet is mentioned");
		console.log("\n3. Edit this script and add to manualBulletStarts:");
		console.log(`   "${slideName}": [time1, time2, time3, time4, time5],`);
		console.log("\n4. Re-run this script to see the manual timings");
	}

	console.log("\n" + "=".repeat(80));
	console.log("WORD TIMING SAMPLES (for reference):");
	console.log("=".repeat(80));
	
	// Show first 20 words and last 10 words
	console.log("\nFirst 20 words:");
	for (let i = 0; i < Math.min(20, words.length); i++) {
		console.log(`  [${words[i].start.toFixed(2)}s] "${words[i].text}"`);
	}
	
	if (words.length > 20) {
		console.log("\n... (middle words omitted) ...\n");
		console.log("Last 10 words:");
		for (let i = Math.max(20, words.length - 10); i < words.length; i++) {
			console.log(`  [${words[i].start.toFixed(2)}s] "${words[i].text}"`);
		}
	}
}

// Main
const moduleNumber = process.argv[2] ? parseInt(process.argv[2]) : 1;
const courseId = process.argv[3] || "agentic-ai-for-beginners";
const slideName = process.argv[4] || "module-1-concept";

analyzeSlide(courseId, moduleNumber, slideName);
