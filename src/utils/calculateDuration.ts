// Utility to calculate total video duration from slide configuration
// This helps ensure videos meet the target runtime (6-12 minutes per module)

export interface SlideConfig {
	duration?: number; // in seconds, defaults to 8 for content, 1 for transitions
	type: "title" | "content" | "code" | "comparison" | "transition";
}

export const calculateVideoDuration = (
	slides: SlideConfig[],
	defaultContentDuration = 8,
	defaultTransitionDuration = 1
): number => {
	return slides.reduce((total, slide) => {
		if (slide.duration) {
			return total + slide.duration;
		}
		if (slide.type === "transition") {
			return total + defaultTransitionDuration;
		}
		return total + defaultContentDuration;
	}, 0);
};

// Helper to convert seconds to frames at given FPS
export const secondsToFrames = (seconds: number, fps: number): number => {
	return Math.ceil(seconds * fps);
};
