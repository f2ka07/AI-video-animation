// Configuration for Module 10 video
// Auto-generated from moduleContent.ts - DO NOT EDIT MANUALLY

import { getAudioDuration } from "../utils/audioDuration";

const audioDurations = [
	getAudioDuration("aws-pulumi/module10-title"),
	getAudioDuration("aws-pulumi/module10-stackConfigBasics"),
	getAudioDuration("aws-pulumi/module10-createStackConfig"),
	getAudioDuration("aws-pulumi/module10-manageSecrets"),
	getAudioDuration("aws-pulumi/module10-deployMultipleEnvironments"),
	getAudioDuration("aws-pulumi/module10-summary")
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

export const Module10Config = {
	id: "module-10",
	title: "Multi-Environment Management",
	fps: 30,
	width: 1920,
	height: 1080,
	totalDuration,
};
