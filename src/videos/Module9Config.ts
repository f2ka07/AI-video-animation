// Configuration for Module 9 video
// Auto-generated from moduleContent.ts - DO NOT EDIT MANUALLY

import { getAudioDuration } from "../utils/audioDuration";

const audioDurations = [
	getAudioDuration("aws-pulumi/module9-title"),
	getAudioDuration("aws-pulumi/module9-outputsBasics"),
	getAudioDuration("aws-pulumi/module9-createNetworkStack"),
	getAudioDuration("aws-pulumi/module9-createAppStack"),
	getAudioDuration("aws-pulumi/module9-stackDependencies"),
	getAudioDuration("aws-pulumi/module9-summary")
];

const whooshDuration = 0.57;
const slideBuffer = 1.0;
const lastSlideBuffer = 1.2;
const totalDuration = audioDurations.reduce((sum, audioDur, index) => {
	const isLastSlide = index === audioDurations.length - 1;
	const slideDuration = audioDur + (isLastSlide ? lastSlideBuffer : slideBuffer);
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
