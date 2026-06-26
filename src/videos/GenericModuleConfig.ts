// Runtime config for GenericModule - computes totalDuration, fps, dimensions
// Used when registering GenericModule compositions

import { allModules } from "./moduleContent";
import { buildGenericModuleTimeline } from "./genericModuleTimeline";
import type { ModuleContent } from "./moduleContent";

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

	const timeline = buildGenericModuleTimeline(courseId, module);

	return {
		id: `module-${moduleNumber}`,
		title: module.title,
		fps: timeline.fps,
		width: timeline.width,
		height: timeline.height,
		totalDuration: timeline.totalDuration,
	};
}
