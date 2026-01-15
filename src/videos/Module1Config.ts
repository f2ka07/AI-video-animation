// Configuration for Module 1 video
// This makes it easy to adjust timing and content

import { getAudioDuration } from "../utils/audioDuration";

// Calculate total duration based on audio durations
// Pattern: audio plays fully, then whoosh (0.3s), then next slide (no gap)
const audioDurations = [
	getAudioDuration("module1-title"),
	getAudioDuration("module1-whyIaC"),
	getAudioDuration("module1-comparison"),
	getAudioDuration("module1-workflow"),
	getAudioDuration("module1-initCode"),
	getAudioDuration("module1-whyTypeScript"),
	getAudioDuration("module1-typescriptCode"),
	getAudioDuration("module1-summary"),
];

const whooshDuration = 0.3; // Whoosh transition duration
const totalDuration = audioDurations.reduce((sum, audioDur, index) => {
	const isLastSlide = index === audioDurations.length - 1;
	// Each slide: audio duration + whoosh (except last slide)
	const slideDuration = audioDur + (isLastSlide ? 0 : whooshDuration);
	console.log(`Slide ${index + 1}: ${audioDur}s audio + ${isLastSlide ? 0 : whooshDuration}s whoosh = ${slideDuration}s`);
	return sum + slideDuration;
}, 0);

console.log("Module1Config - Total duration:", totalDuration, "seconds");
console.log("Module1Config - Total frames (30fps):", totalDuration * 30);

export const Module1Config = {
	id: "module-1",
	title: "Module 1: Pulumi and IaC Fundamentals",
	fps: 30,
	width: 1920,
	height: 1080,
	totalDuration, // Total duration in seconds based on audio
};
