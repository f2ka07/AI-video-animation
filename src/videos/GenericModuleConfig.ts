// Runtime config for GenericModule - computes totalDuration, fps, dimensions
// Used when registering GenericModule compositions

import { getAudioDuration } from "../utils/audioDuration";
import { allModules } from "./moduleContent";
import { expandSlidesWithSplits } from "../utils/expandSlidesWithSplits";
import { slideSplitsByCourse } from "../utils/slideSplitsData";
import type { ModuleContent } from "./moduleContent";

function isMultiAudioCodeSlide(slide: { type: string; scripts?: string[] }): boolean {
	return slide.type === "code" && !!slide.scripts && slide.scripts.length >= 1;
}

export interface GenericModuleConfigResult {
	id: string;
	title: string;
	fps: number;
	width: number;
	height: number;
	totalDuration: number;
}

export function getModuleConfig(
	courseId: string,
	moduleNumber: number
): GenericModuleConfigResult {
	const module = allModules.find(
		(m) => m.courseId === courseId && m.moduleNumber === moduleNumber
	) as (ModuleContent & { videoCategory?: string }) | undefined;

	if (!module) {
		throw new Error(`Module not found: ${courseId} / ${moduleNumber}`);
	}

	const whooshDuration = 0.57;
	const slideBuffer = 1.0;
	const lastSlideBuffer = 1.2;

	const isShort = module.videoCategory === "short";

	if (isShort) {
		const slideDuration = 5;
		const totalSlides = module.slides.length;
		const totalDuration =
			totalSlides * slideDuration + (totalSlides - 1) * whooshDuration;
		return {
			id: `module-${moduleNumber}`,
			title: module.title,
			fps: 30,
			width: 1080,
			height: 1920,
			totalDuration,
		};
	}

	const getDur = (slideName: string): number =>
		getAudioDuration(`${courseId}/module${moduleNumber}-${slideName}`);

	const getDurForSlide = (slideName: string): number => {
		const slide = module.slides.find((s) => s.name === slideName);
		if (slide && isMultiAudioCodeSlide(slide)) {
			let sum = 0;
			for (let i = 1; i <= slide.scripts!.length; i++) {
				sum += getAudioDuration(
					`${courseId}/module${moduleNumber}-${slideName}-${i}`
				);
			}
			return sum;
		}
		return getDur(slideName);
	};

	const splits = slideSplitsByCourse[courseId] || {};
	const effectiveSegments = expandSlidesWithSplits(module.slides, splits, getDurForSlide);

	// One whoosh per slide (between slides), not between segments
	let totalDuration = 0;
	for (let i = 0; i < module.slides.length; i++) {
		const slide = module.slides[i];
		const segs = effectiveSegments.filter((s) => s.slideName === slide.name);
		const fullDur = isMultiAudioCodeSlide(slide)
			? (slide.scripts as string[]).reduce(
					(sum, _, j) =>
						sum +
						getAudioDuration(
							`${courseId}/module${moduleNumber}-${slide.name}-${j + 1}`
						),
					0
			  )
			: segs.reduce((s, seg) => s + seg.segmentDurationSeconds, 0);
		const buf = i === module.slides.length - 1 ? lastSlideBuffer : slideBuffer;
		totalDuration += fullDur + buf;
		if (i < module.slides.length - 1) totalDuration += whooshDuration;
	}

	return {
		id: `module-${moduleNumber}`,
		title: module.title,
		fps: 30,
		width: 1920,
		height: 1080,
		totalDuration,
	};
}
