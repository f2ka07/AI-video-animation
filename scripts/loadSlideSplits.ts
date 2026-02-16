// Load slide-splits.json - defines which slides to split into segments (after audio generation)
// Used by generateModulesFromContent during Finalize

import * as fs from "fs";
import * as path from "path";
import {
	expandSlidesWithSplits as expandSlides,
	SlideSplitsConfig,
	SlideSplitDef,
	SegmentDef,
	EffectiveSegment,
} from "../src/utils/expandSlidesWithSplits";
import type { SlideContent } from "../src/videos/moduleContent";

export type { SlideSplitDef, SegmentDef, SlideSplitsConfig, EffectiveSegment };

export function loadSlideSplits(courseId: string): SlideSplitsConfig {
	const p = path.join(__dirname, "../courses", courseId, "slide-splits.json");
	if (!fs.existsSync(p)) return {};
	try {
		const raw = JSON.parse(fs.readFileSync(p, "utf-8"));
		const result: SlideSplitsConfig = {};
		for (const [key, val] of Object.entries(raw)) {
			if (key.startsWith("_")) continue;
			const v = val as SlideSplitDef;
			if (v && Array.isArray(v.splitAt) && v.splitAt.length >= 1) {
				result[key] = v;
			}
		}
		return result;
	} catch {
		return {};
	}
}

export function expandSlidesWithSplits(
	slides: SlideContent[],
	splits: SlideSplitsConfig,
	getAudioDuration: (slideName: string) => number
): EffectiveSegment[] {
	return expandSlides(slides, splits, getAudioDuration);
}
