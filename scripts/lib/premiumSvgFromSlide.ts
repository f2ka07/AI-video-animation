// Visual-only diagram SVG from slide metadata — right panel never duplicates bullets

import { visualForSlideName } from "./premiumVisualArchetypes";
import type { VisualResult } from "./premiumVisualArchetypes";
import { MODULE01_COURSE1_VISUALS } from "./module01Course1Visuals";
import { MODULE02_COURSE1_VISUALS } from "./module02Course1Visuals";
import { MODULE03_COURSE1_VISUALS } from "./module03Course1Visuals";
import { MODULE04_COURSE1_VISUALS } from "./module04Course1Visuals";
import { MODULE05_COURSE1_VISUALS } from "./module05Course1Visuals";
import { MODULE01_COURSE3_VISUALS } from "./module01Course3Visuals";
import { MODULE02_COURSE3_VISUALS } from "./module02Course3Visuals";
import { MODULE03_COURSE3_VISUALS } from "./module03Course3Visuals";
import { MODULE04_COURSE3_VISUALS } from "./module04Course3Visuals";
import { MODULE05_COURSE3_VISUALS } from "./module05Course3Visuals";
import { MODULE01_COURSE4_VISUALS } from "./module01Course4Visuals";
import { MODULE02_COURSE4_VISUALS } from "./module02Course4Visuals";
import { MODULE03_COURSE4_VISUALS } from "./module03Course4Visuals";
import { MODULE04_COURSE4_VISUALS } from "./module04Course4Visuals";
import { MODULE05_COURSE4_VISUALS } from "./module05Course4Visuals";

const COURSE1_MODULE_VISUALS: Record<number, Record<string, () => import("./premiumVisualArchetypes").VisualResult>> = {
	1: MODULE01_COURSE1_VISUALS,
	2: MODULE02_COURSE1_VISUALS,
	3: MODULE03_COURSE1_VISUALS,
	4: MODULE04_COURSE1_VISUALS,
	5: MODULE05_COURSE1_VISUALS,
};

const COURSE3_MODULE_VISUALS: Record<number, Record<string, () => import("./premiumVisualArchetypes").VisualResult>> = {
	1: MODULE01_COURSE3_VISUALS,
	2: MODULE02_COURSE3_VISUALS,
	3: MODULE03_COURSE3_VISUALS,
	4: MODULE04_COURSE3_VISUALS,
	5: MODULE05_COURSE3_VISUALS,
};

const COURSE4_MODULE_VISUALS: Record<number, Record<string, () => import("./premiumVisualArchetypes").VisualResult>> = {
	1: MODULE01_COURSE4_VISUALS,
	2: MODULE02_COURSE4_VISUALS,
	3: MODULE03_COURSE4_VISUALS,
	4: MODULE04_COURSE4_VISUALS,
	5: MODULE05_COURSE4_VISUALS,
};

export interface ContentSlide {
	name: string;
	type: string;
	title?: string;
	subtitle?: string;
	script?: string;
	points?: string[];
	leftTitle?: string;
	leftItems?: string[];
	rightTitle?: string;
	rightItems?: string[];
	beat?: string;
	keyPhrases?: string[];
}

export interface SlideVisualOutput extends VisualResult {
	svgFileName: string;
}

export function premiumVisualFromSlide(
	slide: ContentSlide,
	options?: { courseId?: string; moduleNumber?: number }
): SlideVisualOutput {
	const ariaLabel = slide.title ?? slide.name.replace(/-/g, " ");
	let visual: VisualResult;

	if (options?.courseId === "network-automation-program-networks" && options?.moduleNumber) {
		const moduleVisuals = COURSE1_MODULE_VISUALS[options.moduleNumber];
		if (moduleVisuals?.[slide.name]) {
			visual = moduleVisuals[slide.name]();
		} else {
			visual = visualForSlideName(slide.name, slide.type);
		}
	} else if (options?.courseId === "network-operations-automated-networks" && options?.moduleNumber) {
		const moduleVisuals = COURSE3_MODULE_VISUALS[options.moduleNumber];
		if (moduleVisuals?.[slide.name]) {
			visual = moduleVisuals[slide.name]();
		} else {
			visual = visualForSlideName(slide.name, slide.type);
		}
	} else if (options?.courseId === "ai-in-automation-networks" && options?.moduleNumber) {
		const moduleVisuals = COURSE4_MODULE_VISUALS[options.moduleNumber];
		if (moduleVisuals?.[slide.name]) {
			visual = moduleVisuals[slide.name]();
		} else {
			visual = visualForSlideName(slide.name, slide.type);
		}
	} else {
		visual = visualForSlideName(slide.name, slide.type);
	}

	return {
		...visual,
		svgFileName: `${slide.name}.svg`,
	};
}
