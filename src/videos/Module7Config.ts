// Configuration for Module 7 video
// Auto-generated from moduleContent.ts - DO NOT EDIT MANUALLY

import { getAudioDuration } from "../utils/audioDuration";

const audioDurations = [
	getAudioDuration("aws-pulumi/module7-title"),
	getAudioDuration("aws-pulumi/module7-albBasics"),
	getAudioDuration("aws-pulumi/module7-createTargetGroup"),
	getAudioDuration("aws-pulumi/module7-createLoadBalancer"),
	getAudioDuration("aws-pulumi/module7-registerTargets"),
	getAudioDuration("aws-pulumi/module7-createListener"),
	getAudioDuration("aws-pulumi/module7-summary")
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

export const Module7Config = {
	id: "module-7",
	title: "Application Load Balancer",
	fps: 30,
	width: 1920,
	height: 1080,
	totalDuration,
};
