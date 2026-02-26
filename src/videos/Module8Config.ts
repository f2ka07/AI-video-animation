// Configuration for Module 8 video
// Auto-generated from moduleContent.ts - DO NOT EDIT MANUALLY

import { getAudioDuration } from "../utils/audioDuration";

const audioDurations = [
	getAudioDuration("aws-pulumi/module8-title"),
	getAudioDuration("aws-pulumi/module8-rdsBasics"),
	getAudioDuration("aws-pulumi/module8-createDBSubnetGroup"),
	getAudioDuration("aws-pulumi/module8-createDBParameterGroup"),
	getAudioDuration("aws-pulumi/module8-createDBInstance"),
	getAudioDuration("aws-pulumi/module8-summary")
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

export const Module8Config = {
	id: "module-8",
	title: "RDS Database in Private Subnets",
	fps: 30,
	width: 1920,
	height: 1080,
	totalDuration,
};
