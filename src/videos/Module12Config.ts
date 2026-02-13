// Configuration for Module 12 video
// Auto-generated from moduleContent.ts - DO NOT EDIT MANUALLY

import { getAudioDuration } from "../utils/audioDuration";

const audioDurations = [
	getAudioDuration("module12-title"),
	getAudioDuration("module12-cicdBasics"),
	getAudioDuration("module12-githubActionsWorkflow"),
	getAudioDuration("module12-testingStrategies"),
	getAudioDuration("module12-securityBestPractices"),
	getAudioDuration("module12-productionChecklist"),
	getAudioDuration("module12-summary")
];

const whooshDuration = 0.57;
const summaryBuffer = 0.5;
const totalDuration = audioDurations.reduce((sum, audioDur, index) => {
	const isLastSlide = index === audioDurations.length - 1;
	const slideDuration = audioDur + (isLastSlide ? summaryBuffer : 0);
	const whooshTime = isLastSlide ? 0 : whooshDuration;
	return sum + slideDuration + whooshTime;
}, 0);

export const Module12Config = {
	id: "module-12",
	title: "CI/CD Integration and Best Practices",
	fps: 30,
	width: 1920,
	height: 1080,
	totalDuration,
};
