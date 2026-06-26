import { getAudioDurationOrEstimate } from "../utils/audioDuration";
import { expandSlidesWithSplits } from "../utils/expandSlidesWithSplits";
import { slideSplitsByCourse } from "../utils/slideSplitsData";
import type { ModuleContent, SlideContent } from "./moduleContent";

export const WHOOSH_DURATION_SECONDS = 0.57;
const STANDARD_SLIDE_BUFFER = 1.0;
const STANDARD_LAST_SLIDE_BUFFER = 1.2;
const SHORT_SLIDE_BUFFER = 0;
const SHORT_LAST_SLIDE_BUFFER = 0.15;

function isMultiAudioCodeSlide(slide: { type: string; scripts?: string[] }): boolean {
	return slide.type === "code" && !!slide.scripts && slide.scripts.length >= 1;
}

function getSlideBuffers(module: ModuleContent & { videoCategory?: string; outputPlatform?: string }): {
	slideBuffer: number;
	lastSlideBuffer: number;
} {
	const isMarketingPack = Boolean(module.outputPlatform);
	if (module.videoCategory === "short" || isMarketingPack) {
		return { slideBuffer: SHORT_SLIDE_BUFFER, lastSlideBuffer: SHORT_LAST_SLIDE_BUFFER };
	}
	return { slideBuffer: STANDARD_SLIDE_BUFFER, lastSlideBuffer: STANDARD_LAST_SLIDE_BUFFER };
}

export interface GenericSlideTimelineEntry {
	slide: SlideContent;
	audioDuration: number;
	slideDuration: number;
	whooshAfter: boolean;
}

export interface GenericModuleTimeline {
	slides: GenericSlideTimelineEntry[];
	totalDuration: number;
	fps: number;
	width: number;
	height: number;
}

export function buildGenericModuleTimeline(
	courseId: string,
	module: ModuleContent & { videoCategory?: string }
): GenericModuleTimeline {
	const moduleNumber = module.moduleNumber;
	const isShort = module.videoCategory === "short";
	const { slideBuffer, lastSlideBuffer } = getSlideBuffers(module);

	const getDur = (slideName: string, script?: string): number =>
		getAudioDurationOrEstimate(`${courseId}/module${moduleNumber}-${slideName}`, script);

	const getDurForSlide = (slideName: string): number => {
		const slide = module.slides.find((s) => s.name === slideName);
		if (slide && isMultiAudioCodeSlide(slide)) {
			let sum = 0;
			for (let i = 1; i <= slide.scripts!.length; i++) {
				sum += getAudioDurationOrEstimate(
					`${courseId}/module${moduleNumber}-${slideName}-${i}`,
					slide.scripts![i - 1]
				);
			}
			return sum;
		}
		return getDur(slideName, slide?.script);
	};

	const splits = slideSplitsByCourse[courseId] || {};
	const effectiveSegments = expandSlidesWithSplits(module.slides, splits, getDurForSlide);

	const slides: GenericSlideTimelineEntry[] = [];
	let totalDuration = 0;

	for (let i = 0; i < module.slides.length; i++) {
		const slide = module.slides[i];
		const segs = effectiveSegments.filter((s) => s.slideName === slide.name);
		const audioDuration = isMultiAudioCodeSlide(slide)
			? (slide.scripts as string[]).reduce(
					(sum, chunkScript, j) =>
						sum +
						getAudioDurationOrEstimate(
							`${courseId}/module${moduleNumber}-${slide.name}-${j + 1}`,
							chunkScript
						),
					0
			  )
			: segs.reduce((s, seg) => s + seg.segmentDurationSeconds, 0);
		const buf = i === module.slides.length - 1 ? lastSlideBuffer : slideBuffer;
		const slideDuration = audioDuration + buf;
		const whooshAfter = i < module.slides.length - 1;

		slides.push({ slide, audioDuration, slideDuration, whooshAfter });
		totalDuration += slideDuration;
		if (whooshAfter) {
			totalDuration += WHOOSH_DURATION_SECONDS;
		}
	}

	return {
		slides,
		totalDuration,
		fps: 30,
		width: isShort ? 1080 : 1920,
		height: isShort ? 1920 : 1080,
	};
}
