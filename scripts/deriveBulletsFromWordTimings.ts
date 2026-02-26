// Derive logical bullet points from word timings instead of artificial/manual bullets.
// Uses pause-based segmentation or slide splits to create phrases that align with narration.
//
// Run: npx tsx scripts/deriveBulletsFromWordTimings.ts [courseId] [moduleRange]
// Example: npx tsx scripts/deriveBulletsFromWordTimings.ts agentic-ai-for-beginners 1

import * as fs from "fs";
import * as path from "path";
import { allModules } from "../src/videos/moduleContent";
import type { SlideSplitsConfig, SlideSplitDef } from "../src/utils/expandSlidesWithSplits";
import { getAudioDuration } from "../src/utils/audioDuration";
import type { SlideContent } from "../src/videos/moduleContent";
import { loadTimings, findPhraseInWords } from "./utils/wordTimingUtils";
import type { WordTiming } from "./utils/wordTimingUtils";

const PAUSE_THRESHOLD_SEC = 0.45;
const MAX_BULLET_WORDS = 18;
const MIN_BULLET_WORDS = 4;

const TRAILING_FRAGMENT_WORDS = new Set([
	"this", "when", "and", "so", "but", "it", "the", "a", "an",
	"that", "which", "who", "what", "they", "we", "you", "i",
	"as", "to", "for", "in", "on", "or", "of",
]);

const INCOMPLETE_ENDINGS = new Set([
	"not", "is", "the", "to", "when", "that", "which", "or", "and", "for",
	"in", "at", "by", "with", "from", "into", "than", "if", "as",
]);

const STOPWORDS = new Set([
	"the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
	"of", "with", "by", "from", "as", "is", "are", "was", "were", "be",
	"been", "being", "have", "has", "had", "do", "does", "did", "will",
	"would", "could", "should", "may", "might", "must", "shall", "can",
	"need", "dare", "ought", "used", "it", "its", "this", "that", "these",
	"those", "i", "you", "he", "she", "we", "they", "what", "which", "who",
	"when", "where", "why", "how", "all", "each", "every", "both", "few",
	"more", "most", "other", "some", "such", "no", "nor", "not", "only",
	"own", "same", "so", "than", "too", "very", "just", "into", "through",
	"during", "before", "after", "above", "below", "between", "under",
	"lets", "four", "first", "second", "third", "fourth", "fifth",
	"theyre", "dont", "cant", "wont", "isnt", "arent", "wasnt", "werent",
]);

const MAX_KEY_WORDS_PER_PHRASE = 4;

function wordsToPhrase(words: WordTiming[], maxWords: number = MAX_BULLET_WORDS): string {
	const slice = words.slice(0, maxWords);
	let text = slice.map((w) => w.text).join(" ").trim();
	if (text.length > 120) text = text.slice(0, 117) + "...";
	return cleanPhrase(text);
}

function cleanPhrase(text: string): string {
	const words = text.split(/\s+/).filter((w) => w.length > 0);
	if (words.length <= 1) return text;
	while (words.length > 1 && TRAILING_FRAGMENT_WORDS.has(words[words.length - 1].toLowerCase())) {
		words.pop();
	}
	while (words.length > 1 && words[0][0] === words[0][0].toLowerCase()) {
		words.shift();
	}
	const result = words.join(" ").trim();
	return result.length >= 10 ? result : text;
}

function buildImportantWordsFromSlide(slide: SlideContent): Set<string> {
	const important = new Set<string>();
	const add = (s: string) => {
		const t = s.trim().toLowerCase().replace(/[.,!?;:'"()[\]]/g, "");
		if (t.length < 2 || STOPWORDS.has(t)) return;
		if (t.length >= 4 || (t.length <= 5 && /^[a-z0-9]+$/.test(t))) important.add(t);
	};
	const addPhrase = (phrase: string) => {
		phrase.split(/\s+/).forEach(add);
		phrase.split("-").filter((p) => p.length >= 4).forEach(add);
	};

	const manualPhrases = slide.keyPhrases ?? [];
	const autoPhrases = extractKeyPhrasesFromScript(slide.script ?? "");
	for (const p of [...manualPhrases, ...autoPhrases]) {
		addPhrase(p);
	}
	if (slide.title) addPhrase(slide.title);

	return important;
}

function extractKeyWords(phrase: string, importantWords?: Set<string>): string[] {
	const phraseWords = phrase.split(/\s+/).filter((w) => w.length > 0);
	const seen = new Set<string>();
	const result: string[] = [];

	if (importantWords && importantWords.size > 0) {
		for (const w of phraseWords) {
			const clean = w.replace(/[.,!?;:'"()[\]]/g, "");
			const lower = clean.toLowerCase();
			if (lower.length < 2) continue;
			if (seen.has(lower)) continue;
			if (importantWords.has(lower)) {
				seen.add(lower);
				result.push(clean);
				if (result.length >= MAX_KEY_WORDS_PER_PHRASE) return result;
			}
		}
		const phraseLower = phrase.toLowerCase();
		for (const kw of importantWords) {
			if (result.length >= MAX_KEY_WORDS_PER_PHRASE) break;
			if (phraseLower.includes(kw) && !seen.has(kw)) {
				seen.add(kw);
				const idx = phraseLower.indexOf(kw);
				const asInPhrase = phrase.slice(idx, idx + kw.length);
				result.push(asInPhrase || kw.replace(/\b\w/g, (c) => c.toUpperCase()));
			}
		}
	}

	for (const w of phraseWords) {
		if (result.length >= MAX_KEY_WORDS_PER_PHRASE) break;
		const clean = w.replace(/[.,!?;:'"()[\]]/g, "");
		const lower = clean.toLowerCase();
		if (lower.length < 2) continue;
		if (STOPWORDS.has(lower)) continue;
		if (seen.has(lower)) continue;
		const isAcronym = /^[A-Z0-9]+$/i.test(clean) && clean.length <= 5;
		const isLongEnough = lower.length >= 5;
		if (!isLongEnough && !isAcronym) continue;
		seen.add(lower);
		result.push(w);
	}
	return result;
}

/**
 * Segment words by pauses (gaps between words).
 * Returns array of word groups, each becomes a bullet.
 */
function endsWithIncomplete(phrase: string): boolean {
	const words = phrase.trim().split(/\s+/).filter((w) => w.length > 0);
	if (words.length === 0) return false;
	const last = words[words.length - 1].toLowerCase().replace(/[.,!?;:'"()[\]]/g, "");
	return INCOMPLETE_ENDINGS.has(last);
}

function completeFromScript(phrase: string, script: string): string | null {
	if (!script || !phrase) return null;
	const words = phrase.trim().split(/\s+/).filter((w) => w.length > 0);
	if (words.length < 2) return null;
	const last = words[words.length - 1].toLowerCase().replace(/[.,!?;:'"()[\]]/g, "");
	if (!INCOMPLETE_ENDINGS.has(last)) return null;
	const lastTwo = words.slice(-2).map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
	const re = new RegExp(
		lastTwo[0] + "\\s*[,.]?\\s*" + lastTwo[1] + "\\s*[,.]?\\s*([a-zA-Z0-9'-]+)",
		"i"
	);
	const m = script.match(re);
	return m ? `${phrase} ${m[1]}`.trim() : null;
}

function mergeIncompletePhrases(groups: WordTiming[][]): WordTiming[][] {
	if (groups.length <= 1) return groups;
	const result: WordTiming[][] = [];
	let i = 0;
	while (i < groups.length) {
		let combined = [...groups[i]];
		const phrase = wordsToPhrase(combined);
		const lastWord = phrase.trim().split(/\s+/).pop()?.toLowerCase().replace(/[.,!?;:'"()[\]]/g, "") ?? "";
		if (lastWord === "not" && i + 1 < groups.length && groups[i + 1].length > 0) {
			combined = [...combined, groups[i + 1][0]];
			groups[i + 1] = groups[i + 1].slice(1);
			if (groups[i + 1].length === 0) i++;
		}
		while (
			i + 1 < groups.length &&
			endsWithIncomplete(wordsToPhrase(combined)) &&
			combined.length + groups[i + 1].length <= 20
		) {
			combined = [...combined, ...groups[i + 1]];
			i++;
		}
		result.push(combined);
		i++;
	}
	return result;
}

function segmentByPauses(words: WordTiming[]): WordTiming[][] {
	if (words.length === 0) return [];
	const groups: WordTiming[][] = [];
	let current: WordTiming[] = [words[0]];
	for (let i = 1; i < words.length; i++) {
		const gap = words[i].start - words[i - 1].end;
		if (gap >= PAUSE_THRESHOLD_SEC && current.length >= MIN_BULLET_WORDS) {
			groups.push(current);
			current = [words[i]];
		} else {
			current.push(words[i]);
		}
	}
	if (current.length > 0) groups.push(current);
	return groups;
}

function extractKeyPhrasesFromScript(script: string): string[] {
	const phrases = new Set<string>();
	const add = (s: string) => {
		const t = s.trim().replace(/\s+/g, " ").replace(/[.,;:!?]+$/, "");
		if (t.length >= 4 && t.length <= 50) phrases.add(t);
	};

	const quoted = script.match(/["""]([^"""]{2,40})["""]/g);
	if (quoted) for (const m of quoted) add(m.replace(/["""]/g, ""));

	const called = script.match(/(?:called|known as|referred to as)\s+([a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*(?:\s+[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*)*)/gi);
	if (called) for (const m of called) add(m.replace(/^(?:called|known as|referred to as)\s+/i, "").replace(/[.,]+\s*$/, "").trim());

	const termsLike = script.match(/terms?\s+(?:like|such as)\s+([^.]+?)(?:\.|$)/gi);
	if (termsLike) {
		for (const m of termsLike) {
			const inner = m.replace(/^terms?\s+(?:like|such as)\s+/i, "").replace(/\.\s*$/, "");
			inner.split(/,\s*(?:and\s+)?/).forEach((p) => add(p.replace(/["""]/g, "").trim()));
		}
	}

	const hyphenated = script.match(/\b[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)+\b/g);
	if (hyphenated) {
		for (const m of hyphenated) {
			const parts = m.split("-");
			if (parts.length >= 3) add(m);
		}
	}

	const result = Array.from(phrases);
	return result.filter((p) => !result.some((q) => q !== p && q.toLowerCase().includes(p.toLowerCase())));
}

/**
 * Segment words by time boundaries (from slide splits).
 */
function segmentByTimeBoundaries(
	words: WordTiming[],
	boundaries: number[]
): WordTiming[][] {
	if (boundaries.length < 2) return [];
	const groups: WordTiming[][] = [];
	for (let j = 0; j < boundaries.length - 1; j++) {
		const startSec = boundaries[j];
		const endSec = boundaries[j + 1];
		const segWords = words.filter((w) => w.start >= startSec && w.start < endSec);
		groups.push(segWords);
	}
	return groups;
}

function derivePointsForSlide(
	slide: SlideContent,
	words: WordTiming[],
	splits: { splitAt: number[]; segments?: { points?: string[] }[] } | undefined,
	getDuration: (name: string) => number
): { points: string[]; segmentPoints?: string[][]; segmentKeyWords?: string[][]; segmentPhraseTimes?: { start: number; end: number }[][] } {
	if (!words || words.length === 0) return { points: slide.points || [] };

	if (splits && splits.splitAt && splits.splitAt.length >= 1) {
		const fullDur = getDuration(slide.name);
		const boundaries = [0, ...splits.splitAt, fullDur];
		const groups = segmentByTimeBoundaries(words, boundaries);
		let segmentPoints = groups.map((g) => {
			let subGroups = segmentByPauses(g);
			// Merge fragments (< 5 words) into the next group so bullets are complete
			const merged: WordTiming[][] = [];
			let pending: WordTiming[] = [];
			for (const sg of subGroups) {
				if (pending.length > 0 && sg.length >= 5) {
					merged.push([...pending, ...sg]);
					pending = [];
				} else if (sg.length < 5) {
					pending.push(...sg);
				} else {
					if (pending.length > 0) {
						merged.push([...pending]);
						pending = [];
					}
					merged.push([...sg]);
				}
			}
			if (pending.length > 0) merged.push(pending);
			const mergedComplete = mergeIncompletePhrases(merged);
			const phrases = mergedComplete
				.map((sg) => wordsToPhrase(sg))
				.filter((p) => p.length >= 10);
			return { phrases, merged: mergedComplete };
		});
		const rawTimes = segmentPoints.map(({ merged }) =>
			merged
				.filter((sg) => wordsToPhrase(sg).length >= 10)
				.map((sg) => {
					const firstWithStart = sg.find((w) => (w?.start ?? 0) > 0);
					const lastWithEnd = [...sg].reverse().find((w) => (w?.end ?? 0) > 0);
					const start = firstWithStart?.start ?? sg[0]?.start ?? 0;
					const end = lastWithEnd?.end ?? sg[sg.length - 1]?.end ?? 0;
					return { start, end };
				})
		);
		const segmentPhraseTimes = rawTimes.map((times) => {
			return times.map((t, i) => {
				let end = t.end;
				if (end <= t.start || (end - t.start < 0.5 && i + 1 < times.length)) {
					end = i + 1 < times.length ? times[i + 1].start : t.start + 2;
				}
				return { start: t.start, end };
			});
		});
		segmentPoints = segmentPoints.map(({ phrases }, segIdx) => {
			if (phrases.length > 0) return phrases;
			const segWords = groups[segIdx];
			if (segWords && segWords.length > 0) {
				return [wordsToPhrase(segWords)];
			}
			return phrases;
		}) as string[][];

		const manualPhrases = slide.keyPhrases ?? [];
		const autoPhrases = extractKeyPhrasesFromScript(slide.script ?? "");
		const keyPhrases = [...new Set([...manualPhrases, ...autoPhrases])];
		if (keyPhrases.length > 0) {
			for (const phrase of keyPhrases) {
				const found = findPhraseInWords(words, phrase);
				if (!found) continue;
				const midTime = (words[found.startIdx].start + words[found.endIdx].end) / 2;
				let segIdx = -1;
				for (let j = 0; j < boundaries.length - 1; j++) {
					if (midTime >= boundaries[j] && midTime < boundaries[j + 1]) {
						segIdx = j;
						break;
					}
				}
				if (segIdx < 0 || segIdx >= segmentPoints.length) continue;
				const displayPhrase = phrase.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
				const existing = segmentPoints[segIdx];
				if (existing.some((p) => p.toLowerCase().includes(displayPhrase.toLowerCase()))) continue;
				segmentPoints[segIdx] = [...existing, displayPhrase];
				const injStart = words[found.startIdx].start;
				const injEnd = words[found.endIdx].end;
				segmentPhraseTimes[segIdx] = [...(segmentPhraseTimes[segIdx] ?? []), { start: injStart, end: injEnd }];
			}
		}

		const script = slide.script ?? "";
		for (let segIdx = 0; segIdx < segmentPoints.length; segIdx++) {
			segmentPoints[segIdx] = segmentPoints[segIdx].map((p) => {
				const completed = completeFromScript(p, script);
				return completed ?? p;
			});
		}
		const importantWords = buildImportantWordsFromSlide(slide);
		const segmentKeyWords = segmentPoints.map((pts) =>
			pts.map((p) => extractKeyWords(p, importantWords))
		);
		const points = segmentPoints.flat();
		return {
			points: points.length >= 1 ? points : [wordsToPhrase(words.slice(0, 8))],
			segmentPoints,
			segmentKeyWords,
			segmentPhraseTimes,
		};
	}

	const groups = segmentByPauses(words);
	const points = groups.map((g) => wordsToPhrase(g)).filter((p) => p.length >= 10);
	return {
		points: points.length >= 1 ? points : [wordsToPhrase(words.slice(0, 8))],
	};
}

function main() {
	const courseId = process.argv[2] || "agentic-ai-for-beginners";
	const moduleInput = process.argv[3] || "all";

	const modules = allModules.filter((m) => m.courseId === courseId);
	if (modules.length === 0) {
		console.error("No modules found for course:", courseId);
		process.exit(1);
	}

	let moduleNumbers: number[];
	if (moduleInput === "all") {
		moduleNumbers = modules.map((m) => m.moduleNumber);
	} else if (moduleInput.includes("-")) {
		const [a, b] = moduleInput.split("-").map(Number);
		moduleNumbers = modules.filter((m) => m.moduleNumber >= a && m.moduleNumber <= b).map((m) => m.moduleNumber);
	} else {
		moduleNumbers = [parseInt(moduleInput, 10)].filter((n) => !isNaN(n));
	}

	const splitsPath = path.join(__dirname, "../courses", courseId, "slide-splits.json");
	let rawSplits: Record<string, SlideSplitDef & { _comment?: string }> = {};
	if (fs.existsSync(splitsPath)) {
		rawSplits = JSON.parse(fs.readFileSync(splitsPath, "utf-8"));
	}
	const splits: SlideSplitsConfig = {};
	for (const [key, val] of Object.entries(rawSplits)) {
		if (key.startsWith("_")) continue;
		const v = val as SlideSplitDef;
		if (v && Array.isArray(v.splitAt) && v.splitAt.length >= 1) {
			splits[key] = v;
		}
	}

	const contentPath = path.join(__dirname, "../courses", courseId, "content.json");

	if (!fs.existsSync(contentPath)) {
		console.error("content.json not found. Activate the course first.");
		process.exit(1);
	}

	const content = JSON.parse(fs.readFileSync(contentPath, "utf-8"));
	let updated = 0;

	for (const moduleNumber of moduleNumbers) {
		const timings = loadTimings(moduleNumber);
		if (!timings) {
			console.log(`Module ${moduleNumber}: No timings (run extract-timings first)`);
			continue;
		}

		const mod = content.modules?.find((m: any) => m.moduleNumber === moduleNumber);
		if (!mod) continue;

		const getDur = (name: string) => getAudioDuration(`${courseId}/module${moduleNumber}-${name}`);

		for (const slide of mod.slides || []) {
			if (slide.type !== "content-single" && slide.type !== "content-two-card" && slide.type !== "story-beat") continue;

			const slideWords = timings[slide.name]?.words;
			if (!slideWords || slideWords.length === 0) {
				console.log(`  Skip ${slide.name}: no word timings`);
				continue;
			}

			const splitDef = splits[slide.name];
			const { points, segmentPoints, segmentKeyWords, segmentPhraseTimes } = derivePointsForSlide(slide, slideWords, splitDef, getDur);

			if (points.length > 0) {
				slide.points = points;
				updated++;
				if (segmentPoints && splitDef) {
					splitDef.segments = segmentPoints.map((pts, i) => {
						const existing = splitDef.segments?.[i];
						const seg: Record<string, unknown> = {
							points: pts,
							keyWords: segmentKeyWords?.[i]?.length ? segmentKeyWords[i] : undefined,
							phraseTimes: segmentPhraseTimes?.[i],
						};
						if (existing?.mermaidSource) seg.mermaidSource = existing.mermaidSource;
						return seg;
					});
				}
				console.log(`  ${slide.name}: ${points.length} bullets (from word timings)${segmentPoints ? `, ${segmentPoints.length} segments` : ""}`);
			}
		}
	}

	if (updated > 0) {
		fs.writeFileSync(contentPath, JSON.stringify(content, null, 2), "utf-8");
		fs.writeFileSync(splitsPath, JSON.stringify(rawSplits, null, 2), "utf-8");
		try {
			require("child_process").execSync("npx tsx scripts/syncSlideSplitsToTs.ts", {
				cwd: path.join(__dirname, ".."),
				stdio: "pipe",
			});
		} catch (e) {
			console.warn("sync-slide-splits failed:", (e as Error).message);
		}
		console.log(`\nUpdated content.json and slide-splits.json. Run activate to sync to moduleContent.`);
	} else {
		console.log("\nNo slides updated. Ensure extract-timings has run.");
	}
}

main();
