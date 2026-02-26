// Extract 60-second short clips from a long-form module
// Identifies windows that start with strong hooks (title, story-beat) and contain 3-5 coherent slides
//
// Usage:
//   npx tsx scripts/extractShortsFromModule.ts <module-number> [--course=courseId] [--target=60] [--max-clips=3]
//
// Output: manifest JSON with suggested clip ranges (slide indices, start/end seconds)
// Use this to manually create short modules or as input for a GUI "Generate clip" feature

import * as fs from "fs";
import * as path from "path";
import { allModules } from "../src/videos/moduleContent";
import { getAudioDurationOrEstimate } from "../src/utils/audioDuration";

const WHOOSH_DURATION = 0.57;

interface SlideBoundary {
	slideIndex: number;
	slideName: string;
	slideType: string;
	beat?: string;
	startSeconds: number;
	endSeconds: number;
	durationSeconds: number;
}

interface ClipCandidate {
	startSlideIndex: number;
	endSlideIndex: number;
	startSeconds: number;
	endSeconds: number;
	durationSeconds: number;
	slideCount: number;
	slides: { name: string; type: string; beat?: string }[];
	hookStrength: "strong" | "medium" | "weak";
}

function getActiveCourseId(): string {
	const moduleContentPath = path.join(__dirname, "../src/videos/moduleContent.ts");
	if (!fs.existsSync(moduleContentPath)) return "default";
	const content = fs.readFileSync(moduleContentPath, "utf-8");
	const match = content.match(/\/\/\s*Course ID:\s*([a-zA-Z0-9_-]+)/);
	if (match) return match[1];
	const courseIdMatch = content.match(/courseId:\s*["']([a-zA-Z0-9_-]+)["']/);
	return courseIdMatch ? courseIdMatch[1] : "default";
}

function buildSlideBoundaries(
	module: { moduleNumber: number; courseId: string; slides: Array<{ name: string; type: string; beat?: string; script?: string; scripts?: string[] }> }
): SlideBoundary[] {
	const courseId = module.courseId || "default";
	const boundaries: SlideBoundary[] = [];
	let currentStart = 0;

	for (let i = 0; i < module.slides.length; i++) {
		const slide = module.slides[i];
		const scripts = slide.scripts && slide.scripts.length >= 1 ? slide.scripts : slide.script ? [slide.script] : [];
		const script = scripts[0] || "";

		let duration: number;
		if (slide.scripts && slide.scripts.length > 1) {
			const pathBase = `${courseId}/module${module.moduleNumber}-${slide.name}`;
			duration = 0;
			for (let j = 0; j < slide.scripts.length; j++) {
				try {
					duration += getAudioDurationOrEstimate(`${pathBase}-${j + 1}`, slide.scripts[j]);
				} catch {
					duration += (slide.scripts[j]?.split(/\s+/).length || 0) / 2.5;
				}
			}
		} else {
			try {
				duration = getAudioDurationOrEstimate(`${courseId}/module${module.moduleNumber}-${slide.name}`, script);
			} catch {
				duration = (script.split(/\s+/).length || 0) / 2.5;
			}
		}

		boundaries.push({
			slideIndex: i,
			slideName: slide.name,
			slideType: slide.type,
			beat: (slide as { beat?: string }).beat,
			startSeconds: currentStart,
			endSeconds: currentStart + duration,
			durationSeconds: duration,
		});

		currentStart += duration + WHOOSH_DURATION;
	}

	return boundaries;
}

function scoreHookStrength(slide: SlideBoundary): "strong" | "medium" | "weak" {
	if (slide.slideType === "title") return "strong";
	if (slide.slideType === "story-beat" && slide.beat === "pattern-interrupt") return "strong";
	if (slide.slideType === "story-beat") return "medium";
	if (slide.slideIndex === 0) return "medium";
	return "weak";
}

function findClipCandidates(
	boundaries: SlideBoundary[],
	targetSeconds: number,
	maxClips: number
): ClipCandidate[] {
	const candidates: ClipCandidate[] = [];

	for (let startIdx = 0; startIdx < boundaries.length; startIdx++) {
		const startBoundary = boundaries[startIdx];
		const hookStrength = scoreHookStrength(startBoundary);

		let cumulativeEnd = startBoundary.endSeconds;
		let endIdx = startIdx;
		let whooshTotal = 0;

		while (endIdx < boundaries.length - 1 && cumulativeEnd + whooshTotal < targetSeconds + 5) {
			endIdx++;
			whooshTotal += WHOOSH_DURATION;
			cumulativeEnd = boundaries[endIdx].endSeconds;
		}

		const clipStart = startBoundary.startSeconds;
		const clipEnd = boundaries[endIdx].endSeconds;
		const duration = clipEnd - clipStart;

		if (duration >= targetSeconds - 10 && duration <= targetSeconds + 15 && endIdx - startIdx >= 2) {
			candidates.push({
				startSlideIndex: startIdx,
				endSlideIndex: endIdx,
				startSeconds: clipStart,
				endSeconds: clipEnd,
				durationSeconds: duration,
				slideCount: endIdx - startIdx + 1,
				slides: boundaries.slice(startIdx, endIdx + 1).map((b) => ({
					name: b.slideName,
					type: b.slideType,
					beat: b.beat,
				})),
				hookStrength,
			});
		}
	}

	// Prefer strong hooks, then by slide count (3-5 ideal)
	return candidates
		.sort((a, b) => {
			const strengthOrder = { strong: 0, medium: 1, weak: 2 };
			if (strengthOrder[a.hookStrength] !== strengthOrder[b.hookStrength]) {
				return strengthOrder[a.hookStrength] - strengthOrder[b.hookStrength];
			}
			const aIdeal = Math.abs(a.slideCount - 4);
			const bIdeal = Math.abs(b.slideCount - 4);
			return aIdeal - bIdeal;
		})
		.slice(0, maxClips);
}

function main(): void {
	const args = process.argv.slice(2);
	const moduleArg = args.find((a) => !a.startsWith("--"));
	const courseArg = args.find((a) => a.startsWith("--course="));
	const targetArg = args.find((a) => a.startsWith("--target="));
	const maxClipsArg = args.find((a) => a.startsWith("--max-clips="));

	const moduleNumber = moduleArg ? parseInt(moduleArg, 10) : null;
	const courseId = courseArg ? courseArg.split("=")[1] : getActiveCourseId();
	const targetSeconds = targetArg ? parseInt(targetArg.split("=")[1], 10) : 60;
	const maxClips = maxClipsArg ? parseInt(maxClipsArg.split("=")[1], 10) : 3;

	if (!moduleNumber || isNaN(moduleNumber)) {
		console.error("Usage: npx tsx scripts/extractShortsFromModule.ts <module-number> [--course=courseId] [--target=60] [--max-clips=3]");
		process.exit(1);
	}

	const module = allModules.find((m) => m.moduleNumber === moduleNumber && (m.courseId === courseId || !courseId));
	if (!module) {
		console.error(`Module ${moduleNumber} not found for course ${courseId}`);
		process.exit(1);
	}

	const boundaries = buildSlideBoundaries(module);
	const candidates = findClipCandidates(boundaries, targetSeconds, maxClips);

	const manifest = {
		courseId,
		sourceModule: moduleNumber,
		sourceTitle: module.title,
		targetSeconds,
		slideBoundaries: boundaries.map((b) => ({
			index: b.slideIndex,
			name: b.slideName,
			type: b.slideType,
			beat: b.beat,
			startSeconds: Math.round(b.startSeconds * 10) / 10,
			endSeconds: Math.round(b.endSeconds * 10) / 10,
		})),
		clipCandidates: candidates.map((c) => ({
			startSlideIndex: c.startSlideIndex,
			endSlideIndex: c.endSlideIndex,
			startSeconds: Math.round(c.startSeconds * 10) / 10,
			endSeconds: Math.round(c.endSeconds * 10) / 10,
			durationSeconds: Math.round(c.durationSeconds * 10) / 10,
			slideCount: c.slideCount,
			slides: c.slides,
			hookStrength: c.hookStrength,
		})),
	};

	const outputPath = path.join(__dirname, "../courses", courseId, `extract-shorts-module${moduleNumber}.json`);
	fs.mkdirSync(path.dirname(outputPath), { recursive: true });
	fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));

	console.log(`\nExtract shorts manifest written to: ${outputPath}`);
	console.log(`Found ${candidates.length} clip candidate(s) of ~${targetSeconds}s from module ${moduleNumber}`);
	for (const c of candidates) {
		console.log(`  - Slides ${c.startSlideIndex}-${c.endSlideIndex} (${c.slideCount} slides, ${c.durationSeconds.toFixed(1)}s, hook: ${c.hookStrength})`);
	}
}

main();
