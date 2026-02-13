// Configuration for Module 9 video
// Auto-generated from moduleContent.ts - DO NOT EDIT MANUALLY

import { getAudioDuration } from "../utils/audioDuration";

const audioDurations = [
	getAudioDuration("module9-title"),
	getAudioDuration("module9-outputsBasics"),
	getAudioDuration("module9-createNetworkStack"),
	getAudioDuration("module9-createAppStack"),
	getAudioDuration("module9-stackDependencies"),
	getAudioDuration("module9-summary")
];

const whooshDuration = 0.57;
const summaryBuffer = 0.5;
const totalDuration = audioDurations.reduce((sum, audioDur, index) => {
	const isLastSlide = index === audioDurations.length - 1;
	const slideDuration = audioDur + (isLastSlide ? summaryBuffer : 0);
	const whooshTime = isLastSlide ? 0 : whooshDuration;
	return sum + slideDuration + whooshTime;
}, 0);

export const Module9Config = {
	id: "module-9",
	title: "Outputs and Stack References",
	fps: 30,
	width: 1920,
	height: 1080,
	totalDuration,
};
