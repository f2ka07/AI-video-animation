// Build staggered animation.json phases from visual group IDs

export interface AnimationPhase {
	start: number;
	end: number;
	show: string[];
	dim: string[];
	highlight: string[];
}

export interface AnimationSpec {
	diagram: string;
	phases: AnimationPhase[];
}

/** Progressive reveal: each group appears and becomes highlighted in turn. */
export function buildStaggeredPhases(
	groupIds: string[],
	totalSeconds = 12,
	alwaysShow: string[] = ["viz-main"]
): AnimationPhase[] {
	if (groupIds.length === 0) {
		return [{ start: 0, end: totalSeconds, show: alwaysShow, dim: [], highlight: [] }];
	}

	const step = totalSeconds / groupIds.length;
	const phases: AnimationPhase[] = [];

	for (let i = 0; i < groupIds.length; i++) {
		const shown = [...alwaysShow, ...groupIds.slice(0, i + 1)];
		const dim = i > 0 ? groupIds.slice(0, i) : [];
		phases.push({
			start: i * step,
			end: totalSeconds,
			show: shown,
			dim,
			highlight: [groupIds[i]],
		});
	}

	return phases;
}

export function writeAnimationSpec(svgFileName: string, groupIds: string[]): AnimationSpec {
	return {
		diagram: svgFileName,
		phases: buildStaggeredPhases(groupIds),
	};
}
