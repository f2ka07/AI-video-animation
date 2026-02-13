// Configuration for Module 11 video
// Auto-generated from moduleContent.ts - DO NOT EDIT MANUALLY

import { getAudioDuration } from "../utils/audioDuration";

const audioDurations = [
	getAudioDuration("module11-title"),
	getAudioDuration("module11-vpcPeeringBasics"),
	getAudioDuration("module11-createVPCPeering"),
	getAudioDuration("module11-transitGatewayBasics"),
	getAudioDuration("module11-createTransitGateway"),
	getAudioDuration("module11-summary")
];

const whooshDuration = 0.57;
const summaryBuffer = 0.5;
const totalDuration = audioDurations.reduce((sum, audioDur, index) => {
	const isLastSlide = index === audioDurations.length - 1;
	const slideDuration = audioDur + (isLastSlide ? summaryBuffer : 0);
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
