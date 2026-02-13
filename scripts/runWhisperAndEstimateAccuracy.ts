/**
 * Run Whisper on module-1 audio 1 (module-1-title) and estimate accuracy.
 * - Calls Whisper API (bypasses cache for a fresh run)
 * - Validates timing quality (duplicates, zero-duration, etc.)
 * - Compares transcript vs reference script (word-level match, simple WER)
 *
 * Usage: npx tsx scripts/runWhisperAndEstimateAccuracy.ts
 */

import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import OpenAI from "openai";
import { saveWhisperResponse } from "./saveWhisperResponse";
import { validateSlideTimings, type SlideValidation } from "./validateWordTimingsQuality";
import { saveSlideTimings } from "./saveTimingsJson";

dotenv.config({ path: path.join(__dirname, "../.env") });

const COURSE_ID = "agentic-ai-for-beginners";
const MODULE_NUMBER = 1;
const SLIDE_NAME = "module-1-title";
const AUDIO_PATH = path.join(
	__dirname,
	"../public/audio/agentic-ai-for-beginners/module1-module-1-title.wav"
);
const SCRIPT_PATH = path.join(
	__dirname,
	"../courses/agentic-ai-for-beginners/course/scripts/module01.txt"
);

function loadReferenceScript(): string {
	const raw = fs.readFileSync(SCRIPT_PATH, "utf-8");
	const start = raw.indexOf("[CINEMATIC INTRO]");
	if (start === -1) throw new Error("CINEMATIC INTRO not found");
	const after = raw.slice(start + "[CINEMATIC INTRO]".length);
	const end = after.indexOf("\n---");
	const section = (end >= 0 ? after.slice(0, end) : after).trim();
	return section;
}

function normalizeForCompare(s: string): string[] {
	return s
		.toLowerCase()
		.replace(/[.,!?;:'"\[\]()]/g, " ")
		.replace(/\s+/g, " ")
		.trim()
		.split(" ")
		.filter((w) => w.length > 0);
}

/**
 * Simple word-level comparison: sequential match, count same vs different.
 * matchRate = matched / ref length, WER ≈ (sub + ins + del) / ref length.
 */
function wordMatchRate(reference: string[], hypothesis: string[]): { matchRate: number; wer: number } {
	let r = 0;
	let h = 0;
	let matches = 0;
	let substitutions = 0;
	let insertions = 0;
	let deletions = 0;

	while (r < reference.length || h < hypothesis.length) {
		const ref = reference[r];
		const hyp = hypothesis[h];

		if (r >= reference.length) {
			insertions++;
			h++;
			continue;
		}
		if (h >= hypothesis.length) {
			deletions++;
			r++;
			continue;
		}

		if (ref === hyp) {
			matches++;
			r++;
			h++;
			continue;
		}

		// Try align next: ref "we've" vs hyp "we" "ve"
		const nextHyp = hypothesis[h + 1];
		if (nextHyp !== undefined) {
			const combined = hyp + (hyp.endsWith("'") ? "" : "'") + nextHyp;
			const combined2 = hyp + nextHyp;
			if (ref === combined || ref === combined2) {
				matches++;
				r++;
				h += 2;
				continue;
			}
		}
		const nextRef = reference[r + 1];
		if (nextRef !== undefined && hyp === ref + nextRef) {
			matches += 2;
			r += 2;
			h++;
			continue;
		}

		substitutions++;
		r++;
		h++;
	}

	const n = reference.length;
	const wer = n > 0 ? (substitutions + insertions + deletions) / n : 0;
	const matchRate = n > 0 ? Math.min(1, matches / n) : 0;
	return { matchRate, wer };
}

async function main() {
	const apiKey = process.env.OPENAI_API_KEY;
	if (!apiKey) {
		console.error("OPENAI_API_KEY is required. Set it in .env");
		process.exit(1);
	}

	if (!fs.existsSync(AUDIO_PATH)) {
		console.error("Audio not found:", AUDIO_PATH);
		process.exit(1);
	}

	console.log("=".repeat(70));
	console.log("Whisper on Module 1 Audio 1 (module-1-title) – Accuracy Estimation");
	console.log("=".repeat(70));
	console.log("\n1. Calling Whisper API (fresh run, cache bypassed)...\n");

	const openai = new OpenAI({ apiKey });
	const fileStream = fs.createReadStream(AUDIO_PATH);
	const resp = await openai.audio.transcriptions.create({
		model: "whisper-1",
		file: fileStream as any,
		response_format: "verbose_json",
		timestamp_granularities: ["word"],
	});

	const whisper = {
		text: resp.text || "",
		duration: resp.duration || 0,
		words: (resp.words || []).map((w: any) => ({ word: w.word, start: w.start, end: w.end })),
	};
	saveWhisperResponse(SLIDE_NAME, whisper);

	const words = whisper.words.map((w) => ({ text: w.word, start: w.start, end: w.end }));
	saveSlideTimings(COURSE_ID, MODULE_NUMBER, SLIDE_NAME, words, "The Agentic AI Transition");

	console.log("   Transcript:", whisper.text.slice(0, 120) + (whisper.text.length > 120 ? "..." : ""));
	console.log("   Words:", words.length);
	console.log("   Duration (Whisper):", (whisper.duration || 0).toFixed(2), "s\n");

	console.log("2. Timing quality validation...\n");
	const validation: SlideValidation = validateSlideTimings(SLIDE_NAME, words);
	console.log(`   Slide: ${validation.slideName}`);
	console.log(`   Total words: ${validation.totalWords}`);
	console.log(`   Duplicate timestamps: ${validation.duplicateCount}`);
	console.log(`   Zero duration: ${validation.zeroDurationCount}`);
	console.log(`   Unrealistic duration (>3s): ${validation.unrealisticDurationCount}`);
	console.log(`   Quality score: ${validation.qualityScore.toFixed(1)}%`);
	if (validation.issues.length > 0) {
		const sample = validation.issues.slice(0, 5);
		console.log("   Sample issues:");
		for (const i of sample) {
			console.log(`     [${i.type}] "${i.word}" – ${i.message}`);
		}
		if (validation.issues.length > 5) {
			console.log(`     ... and ${validation.issues.length - 5} more`);
		}
	}
	console.log("");

	console.log("3. Transcript vs reference script...\n");
	const referenceScript = loadReferenceScript();
	const refWords = normalizeForCompare(referenceScript);
	const hypWords = normalizeForCompare(whisper.text);
	const { matchRate, wer } = wordMatchRate(refWords, hypWords);

	console.log("   Reference (excerpt):", referenceScript.slice(0, 100) + "...");
	console.log("   Reference word count:", refWords.length);
	console.log("   Hypothesis word count:", hypWords.length);
	console.log("   Word match rate (vs reference):", (matchRate * 100).toFixed(1) + "%");
	console.log("   Simple WER (approximate):", (wer * 100).toFixed(1) + "%");
	console.log("");

	console.log("=".repeat(70));
	console.log("Summary");
	console.log("=".repeat(70));
	console.log(`   Timing quality: ${validation.qualityScore.toFixed(1)}%`);
	console.log(`   Transcript match: ${(matchRate * 100).toFixed(1)}%`);
	console.log(`   Overall accuracy (product): ${((validation.qualityScore / 100) * matchRate * 100).toFixed(1)}%`);
	console.log("");
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
