// Pure function to expand slides into segments when splits are defined
// Used by both generateModulesFromContent (Node) and GenericModule (browser)

import type { SlideContent } from "../videos/moduleContent";

export interface PhraseTime {
	start: number;
	end: number;
}

export interface SegmentDef {
	points?: string[];
	keyWords?: string[][];
	phraseTimes?: PhraseTime[];
	mermaidSource?: string;
}

export interface SlideSplitDef {
	splitAt: number[];
	segments?: SegmentDef[];
}

export type SlideSplitsConfig = Record<string, SlideSplitDef>;

export interface EffectiveSegment {
	slideName: string;
	segmentIndex: number;
	segmentStartSeconds: number;
	segmentDurationSeconds: number;
	points: string[];
	keyWords?: string[][];
	phraseTimes?: PhraseTime[];
	mermaidSource?: string;
	isLastInGroup: boolean;
	isLastInModule: boolean;
	slide: SlideContent;
}

export function expandSlidesWithSplits(
	slides: SlideContent[],
	splits: SlideSplitsConfig,
	getAudioDuration: (slideName: string) => number
): EffectiveSegment[] {
	const result: EffectiveSegment[] = [];
	for (let i = 0; i < slides.length; i++) {
		const slide = slides[i];
		const splitDef = splits[slide.name];
		const isLastSlideOfModule = i === slides.length - 1;
		const canSplit = (slide.type === "content-single" || slide.type === "content-two-card" || slide.type === "mermaid");

		if (!canSplit || !splitDef || !splitDef.splitAt || splitDef.splitAt.length < 1) {
			const fullDur = getAudioDuration(slide.name);
			result.push({
				slideName: slide.name,
				segmentIndex: 0,
				segmentStartSeconds: 0,
				segmentDurationSeconds: fullDur,
				points: slide.points || [],
				isLastInGroup: true,
				isLastInModule: isLastSlideOfModule,
				slide,
			});
			continue;
		}

		const fullDur = getAudioDuration(slide.name);
		const boundaries = [0, ...splitDef.splitAt, fullDur];
		const segmentDurations: number[] = [];
		for (let j = 0; j < boundaries.length - 1; j++) {
			segmentDurations.push(boundaries[j + 1] - boundaries[j]);
		}

		const origPoints = slide.points || [];
		const segDefs = splitDef.segments;
		const nSeg = segmentDurations.length;

		for (let j = 0; j < nSeg; j++) {
			let points: string[];
			let keyWords: string[][] | undefined;
			let phraseTimes: PhraseTime[] | undefined;
			let mermaidSource: string | undefined;
			if (segDefs && segDefs[j] && Array.isArray(segDefs[j].points) && segDefs[j].points!.length > 0) {
				points = segDefs[j].points!;
				keyWords = segDefs[j].keyWords;
				phraseTimes = segDefs[j].phraseTimes;
				mermaidSource = segDefs[j].mermaidSource;
			} else {
				const ptsPerSeg = Math.floor(origPoints.length / nSeg);
				const remainder = origPoints.length % nSeg;
				const startIdx = j * ptsPerSeg + Math.min(j, remainder);
				const count = ptsPerSeg + (j < remainder ? 1 : 0);
				points = origPoints.slice(startIdx, startIdx + count);
				if (points.length === 0 && origPoints.length > 0) {
					points = origPoints;
				}
				if (points.length === 0 && slide.script && slide.script.trim().length > 0) {
					points = [slide.script.trim().slice(0, 120) + (slide.script.length > 120 ? "..." : "")];
				}
			}

			if (slide.type === "mermaid" && segDefs?.[j]) {
				mermaidSource = segDefs[j].mermaidSource ?? mermaidSource;
			}
			result.push({
				slideName: slide.name,
				segmentIndex: j,
				segmentStartSeconds: boundaries[j],
				segmentDurationSeconds: segmentDurations[j],
				points,
				keyWords,
				phraseTimes,
				mermaidSource,
				isLastInGroup: j === nSeg - 1,
				isLastInModule: isLastSlideOfModule && j === nSeg - 1,
				slide,
			});
		}
	}
	return result;
}
