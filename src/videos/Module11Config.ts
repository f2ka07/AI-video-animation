// Configuration for Module 11 video
// Auto-generated from moduleContent.ts - DO NOT EDIT MANUALLY

import { getAudioDuration } from "../utils/audioDuration";

const audioDurations = [
	getAudioDuration("aws-pulumi/module11-title"),
	getAudioDuration("aws-pulumi/module11-vpcPeeringBasics"),
	getAudioDuration("aws-pulumi/module11-createVPCPeering"),
	getAudioDuration("aws-pulumi/module11-transitGatewayBasics"),
	getAudioDuration("aws-pulumi/module11-createTransitGateway"),
	getAudioDuration("aws-pulumi/module11-summary")
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

export const Module11Config = {
	id: "module-11",
	title: "Advanced Networking Patterns",
	fps: 30,
	width: 1920,
	height: 1080,
	totalDuration,
};
