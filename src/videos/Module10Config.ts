// Configuration for Module 10 video
// Auto-generated from moduleContent.ts - DO NOT EDIT MANUALLY

import { getAudioDuration } from "../utils/audioDuration";

const audioDurations = [
	getAudioDuration("module10-title"),
	getAudioDuration("module10-stackConfigBasics"),
	getAudioDuration("module10-createStackConfig"),
	getAudioDuration("module10-manageSecrets"),
	getAudioDuration("module10-deployMultipleEnvironments"),
	getAudioDuration("module10-summary")
];

const whooshDuration = 0.57;
const summaryBuffer = 0.5;
const totalDuration = audioDurations.reduce((sum, audioDur, index) => {
	const isLastSlide = index === audioDurations.length - 1;
	const slideDuration = audioDur + (isLastSlide ? summaryBuffer : 0);
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
