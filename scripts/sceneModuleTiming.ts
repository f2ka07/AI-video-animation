// Shared timing constants for scene-based Remotion modules.
// Module 1 (agentic-ai-for-beginners) is the reference implementation.

export const SCENE_MODULE_FPS = 30;
export const SCENE_BUFFER_SECONDS = 0.5;
export const LAST_TAIL_BUFFER_SECONDS = 1.5;
export const WHOOSH_DURATION_SECONDS = 0.57;

export const SCENE_MODULE_BENCHMARK = {
	courseId: "agentic-ai-for-beginners",
	moduleNumber: 1,
	moduleFolder: "module01",
} as const;

export function segmentDurationFrames(
	audioSeconds: number,
	isLastSegmentInModule: boolean,
	isMultiAudioSegment: boolean,
	fps: number = SCENE_MODULE_FPS
): number {
	const buffer = isLastSegmentInModule
		? LAST_TAIL_BUFFER_SECONDS
		: isMultiAudioSegment
			? 0
			: SCENE_BUFFER_SECONDS;
	return Math.ceil((audioSeconds + buffer) * fps);
}
