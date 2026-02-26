// Configuration for Module 12 video
// Auto-generated from moduleContent.ts - DO NOT EDIT MANUALLY

import { getAudioDuration } from "../utils/audioDuration";

const audioDurations = [
	getAudioDuration("aws-pulumi/module12-title"),
	getAudioDuration("aws-pulumi/module12-cicdBasics"),
	getAudioDuration("aws-pulumi/module12-githubActionsWorkflow"),
	getAudioDuration("aws-pulumi/module12-testingStrategies"),
	getAudioDuration("aws-pulumi/module12-securityBestPractices"),
	getAudioDuration("aws-pulumi/module12-productionChecklist"),
	getAudioDuration("aws-pulumi/module12-summary")
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

export const Module12Config = {
	id: "module-12",
	title: "CI/CD Integration and Best Practices",
	fps: 30,
	width: 1920,
	height: 1080,
	totalDuration,
};
