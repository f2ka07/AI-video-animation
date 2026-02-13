// Configuration for Module 8 video
// Auto-generated from moduleContent.ts - DO NOT EDIT MANUALLY

import { getAudioDuration } from "../utils/audioDuration";

const audioDurations = [
	getAudioDuration("module8-title"),
	getAudioDuration("module8-rdsBasics"),
	getAudioDuration("module8-createDBSubnetGroup"),
	getAudioDuration("module8-createDBParameterGroup"),
	getAudioDuration("module8-createDBInstance"),
	getAudioDuration("module8-summary")
];

const whooshDuration = 0.57;
const summaryBuffer = 0.5;
const totalDuration = audioDurations.reduce((sum, audioDur, index) => {
	const isLastSlide = index === audioDurations.length - 1;
	const slideDuration = audioDur + (isLastSlide ? summaryBuffer : 0);
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
