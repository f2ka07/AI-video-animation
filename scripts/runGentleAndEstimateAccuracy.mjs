/**
 * Run Gentle forced alignment on module-1 audio 1 (module-1-title) and estimate accuracy.
 * Compares with Whisper results.
 * 
 * Gentle must be running (typically http://localhost:8765 via Docker).
 * Usage: node scripts/runGentleAndEstimateAccuracy.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import FormData from "form-data";

const fetch = globalThis.fetch?.bind(globalThis);
if (typeof fetch !== "function") {
	throw new Error("Global fetch is not available. Use Node.js 18 or newer.");
}
import {
	resolveGentleUrl,
	formatGentleConnectionHelp,
} from "./lib/resolveGentleUrl.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

function loadEnv() {
	const p = path.join(ROOT, ".env");
	if (!fs.existsSync(p)) return;
	const raw = fs.readFileSync(p, "utf-8");
	for (const line of raw.split("\n")) {
		const m = line.match(/^\s*([^#=]+)=(.*)$/);
		if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
	}
}

const COURSE_ID = "agentic-ai-for-beginners";
const MODULE_NUMBER = 1;
const SLIDE_NAME = "module-1-title";
const AUDIO_PATH = path.join(ROOT, "public/audio/agentic-ai-for-beginners/module1-module-1-title.wav");
const SCRIPT_PATH = path.join(ROOT, "courses/agentic-ai-for-beginners/course/scripts/module01.txt");
const CACHE_PATH = path.join(ROOT, "public/gentle-cache", SLIDE_NAME + ".json");
const TIMINGS_PATH = path.join(ROOT, "courses", COURSE_ID, "timings", `module${MODULE_NUMBER}.json`);

function loadReferenceScript() {
	const raw = fs.readFileSync(SCRIPT_PATH, "utf-8");
	const start = raw.indexOf("[CINEMATIC INTRO]");
	if (start === -1) throw new Error("CINEMATIC INTRO not found");
	const after = raw.slice(start + "[CINEMATIC INTRO]".length);
	const end = after.indexOf("\n---");
	const section = (end >= 0 ? after.slice(0, end) : after).trim();
	return section;
}

function normalizeForCompare(s) {
	return s
		.toLowerCase()
		.replace(/[.,!?;:'"\[\]()]/g, " ")
		.replace(/\s+/g, " ")
		.trim()
		.split(" ")
		.filter((w) => w.length > 0);
}

function wordMatchRate(reference, hypothesis) {
	let r = 0, h = 0, matches = 0, substitutions = 0, insertions = 0, deletions = 0;
	while (r < reference.length || h < hypothesis.length) {
		const ref = reference[r], hyp = hypothesis[h];
		if (r >= reference.length) { insertions++; h++; continue; }
		if (h >= hypothesis.length) { deletions++; r++; continue; }
		if (ref === hyp) { matches++; r++; h++; continue; }
		const nextHyp = hypothesis[h + 1];
		if (nextHyp !== undefined) {
			const combined = hyp + (hyp.endsWith("'") ? "" : "'") + nextHyp;
			const combined2 = hyp + nextHyp;
			if (ref === combined || ref === combined2) { matches++; r++; h += 2; continue; }
		}
		const nextRef = reference[r + 1];
		if (nextRef !== undefined && hyp === ref + nextRef) { matches += 2; r += 2; h++; continue; }
		substitutions++; r++; h++;
	}
	const n = reference.length;
	const wer = n > 0 ? (substitutions + insertions + deletions) / n : 0;
	const matchRate = n > 0 ? Math.min(1, matches / n) : 0;
	return { matchRate, wer };
}

function validateSlideTimings(slideName, words) {
	const issues = [];
	let duplicateCount = 0, zeroDurationCount = 0, unrealisticDurationCount = 0, backwardsTimeCount = 0;
	for (let i = 0; i < words.length; i++) {
		const w = words[i];
		const duration = w.end - w.start;
		if (duration <= 0) {
			issues.push({ type: "zero_duration", word: w.text, message: `Zero/neg duration: ${duration.toFixed(4)}s` });
			zeroDurationCount++;
		}
		if (w.end < w.start) backwardsTimeCount++;
		if (duration > 3.0) {
			issues.push({ type: "unrealistic_duration", word: w.text, message: `Duration ${duration.toFixed(2)}s` });
			unrealisticDurationCount++;
		}
		if (i > 0) {
			const prev = words[i - 1];
			if (Math.abs(w.start - prev.start) < 0.001 && Math.abs(w.end - prev.end) < 0.001) {
				issues.push({ type: "duplicate_timestamp", word: w.text, message: `Same as "${prev.text}"` });
				duplicateCount++;
			}
		}
	}
	const qualityScore = Math.max(0, 100 - (issues.length / words.length) * 100);
	return {
		slideName,
		issues,
		totalWords: words.length,
		duplicateCount,
		zeroDurationCount,
		unrealisticDurationCount,
		backwardsTimeCount,
		qualityScore,
	};
}

async function callGentle() {
	loadEnv();
	if (!fs.existsSync(AUDIO_PATH)) {
		console.error("Audio not found:", AUDIO_PATH);
		process.exit(1);
	}

	const gentleResolution = await resolveGentleUrl();
	if (!gentleResolution.url) {
		console.error(`❌ ${formatGentleConnectionHelp(gentleResolution.tried)}`);
		process.exit(1);
	}
	const gentleUrl = gentleResolution.url;
	if (gentleResolution.fallback && gentleResolution.configuredUrl) {
		console.log(
			`   Gentle not reachable at ${gentleResolution.configuredUrl}; using ${gentleUrl}`
		);
	}
	
	const referenceScript = loadReferenceScript();
	console.log("   Reference script length:", referenceScript.length, "chars");
	console.log("   Gentle URL:", gentleUrl);
	console.log("   (This may take 1-3 minutes for ~43s audio)\n");
	
	// Prepare form data
	const form = new FormData();
	form.append("audio", fs.createReadStream(AUDIO_PATH));
	form.append("transcript", referenceScript);
	
	// Call Gentle API
	const startTime = Date.now();
	let response;
	try {
		response = await fetch(`${gentleUrl}/transcriptions?async=false`, {
			method: "POST",
			body: form,
			headers: form.getHeaders(),
		});
	} catch (error) {
		console.error(`❌ ${formatGentleConnectionHelp(gentleResolution.tried)}`);
		console.error("   Error:", error.message);
		throw error;
	}
	
	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Gentle API error (${response.status}): ${errorText}`);
	}
	
	const result = await response.json();
	const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
	console.log(`   ✓ Gentle completed in ${elapsed}s\n`);
	
	// Convert Gentle format to our WordTiming format
	// Gentle returns: { words: [{ word, start, end, case, ... }] }
	const words = (result.words || [])
		.filter(w => w.word !== null && w.start !== null && w.end !== null)
		.map(w => ({
			text: w.word,
			start: w.start,
			end: w.end,
		}));
	
	const text = words.map(w => w.text).join(" ");
	const duration = words.length > 0 ? words[words.length - 1].end : 0;
	
	return { text, duration, words, raw: result };
}

function saveResults(text, duration, words, raw) {
	fs.mkdirSync(path.dirname(CACHE_PATH), { recursive: true });
	fs.writeFileSync(CACHE_PATH, JSON.stringify({ text, duration, words, raw }, null, 2));
	
	let timings = { moduleNumber: MODULE_NUMBER, title: "The Agentic AI Transition", slides: {}, lineMappings: {} };
	if (fs.existsSync(TIMINGS_PATH)) {
		timings = JSON.parse(fs.readFileSync(TIMINGS_PATH, "utf-8"));
	}
	timings.slides[SLIDE_NAME] = { words };
	fs.mkdirSync(path.dirname(TIMINGS_PATH), { recursive: true });
	fs.writeFileSync(TIMINGS_PATH, JSON.stringify(timings, null, 2));
}

function loadWhisperResults() {
	const whisperCache = path.join(ROOT, "public/whisper-cache", SLIDE_NAME + ".json");
	if (!fs.existsSync(whisperCache)) return null;
	const data = JSON.parse(fs.readFileSync(whisperCache, "utf-8"));
	return {
		text: data.text || "",
		words: (data.words || []).map(w => ({ text: w.word, start: w.start, end: w.end })),
	};
}

async function main() {
	loadEnv();
	console.log("=".repeat(70));
	console.log("Gentle Forced Alignment on Module 1 Audio 1 (module-1-title)");
	console.log("=".repeat(70));
	console.log("\n1. Calling Gentle API...\n");

	const { text, duration, words } = await callGentle();
	saveResults(text, duration, words, null);

	console.log("   Transcript:", text.slice(0, 120) + (text.length > 120 ? "..." : ""));
	console.log("   Words:", words.length);
	console.log("   Duration:", duration.toFixed(2), "s\n");

	console.log("2. Timing quality validation...\n");
	const validation = validateSlideTimings(SLIDE_NAME, words);
	console.log("   Slide:", validation.slideName);
	console.log("   Total words:", validation.totalWords);
	console.log("   Duplicate timestamps:", validation.duplicateCount);
	console.log("   Zero duration:", validation.zeroDurationCount);
	console.log("   Unrealistic duration (>3s):", validation.unrealisticDurationCount);
	console.log("   Quality score:", validation.qualityScore.toFixed(1) + "%");
	if (validation.issues.length > 0) {
		validation.issues.slice(0, 5).forEach((i) => console.log(`     [${i.type}] "${i.word}" – ${i.message}`));
		if (validation.issues.length > 5) console.log("     ... and", validation.issues.length - 5, "more");
	}
	console.log("");

	console.log("3. Transcript vs reference script...\n");
	const referenceScript = loadReferenceScript();
	const refWords = normalizeForCompare(referenceScript);
	const hypWords = normalizeForCompare(text);
	const { matchRate, wer } = wordMatchRate(refWords, hypWords);

	console.log("   Reference (excerpt):", referenceScript.slice(0, 100) + "...");
	console.log("   Reference word count:", refWords.length);
	console.log("   Hypothesis word count:", hypWords.length);
	console.log("   Word match rate (vs reference):", (matchRate * 100).toFixed(1) + "%");
	console.log("   Simple WER (approx):", (wer * 100).toFixed(1) + "%");
	console.log("");

	// Compare with Whisper if available
	const whisper = loadWhisperResults();
	let whisperValidation = null;
	let whisperMatch = null;
	if (whisper) {
		console.log("4. Comparison with Whisper...\n");
		whisperValidation = validateSlideTimings(SLIDE_NAME + "-whisper", whisper.words);
		const whisperHypWords = normalizeForCompare(whisper.text);
		whisperMatch = wordMatchRate(refWords, whisperHypWords);
		
		console.log("   Gentle quality score:", validation.qualityScore.toFixed(1) + "%");
		console.log("   Whisper quality score:", whisperValidation.qualityScore.toFixed(1) + "%");
		console.log("   Gentle transcript match:", (matchRate * 100).toFixed(1) + "%");
		console.log("   Whisper transcript match:", (whisperMatch.matchRate * 100).toFixed(1) + "%");
		console.log("");
	}

	console.log("=".repeat(70));
	console.log("Summary");
	console.log("=".repeat(70));
	console.log("   Timing quality:", validation.qualityScore.toFixed(1) + "%");
	console.log("   Transcript match:", (matchRate * 100).toFixed(1) + "%");
	console.log("   Overall (product):", ((validation.qualityScore / 100) * matchRate * 100).toFixed(1) + "%");
	if (whisper && whisperValidation && whisperMatch) {
		console.log("\n   vs Whisper:");
		console.log("   - Timing quality:", whisperValidation.qualityScore.toFixed(1) + "% →", validation.qualityScore.toFixed(1) + "%");
		console.log("   - Transcript match:", (whisperMatch.matchRate * 100).toFixed(1) + "% →", (matchRate * 100).toFixed(1) + "%");
	}
	console.log("");
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
