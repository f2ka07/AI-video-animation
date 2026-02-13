// Configuration for Module 6 video
// Auto-generated from moduleContent.ts - DO NOT EDIT MANUALLY

import { getAudioDuration } from "../utils/audioDuration";

const audioDurations = [
	getAudioDuration("rag-for-code-search-codebase-like-cursor/module6-hook-scaling-rag"),
	getAudioDuration("rag-for-code-search-codebase-like-cursor/module6-index-sharding-techniques"),
	getAudioDuration("rag-for-code-search-codebase-like-cursor/module6-caching-results"),
	getAudioDuration("rag-for-code-search-codebase-like-cursor/module6-multi-user-access-control"),
	getAudioDuration("rag-for-code-search-codebase-like-cursor/module6-monitoring-and-alerting"),
	getAudioDuration("rag-for-code-search-codebase-like-cursor/module6-module6-wrap-up")
];

const whooshDuration = 0.57;
const summaryBuffer = 0.5;
const totalDuration = audioDurations.reduce((sum, audioDur, index) => {
	const isLastSlide = index === audioDurations.length - 1;
	const slideDuration = audioDur + (isLastSlide ? summaryBuffer : 0);
	const whooshTime = isLastSlide ? 0 : whooshDuration;
	return sum + slideDuration + whooshTime;
}, 0);

export const Module6Config = {
	id: "module-6",
	title: "Scaling RAG Systems for Large Codebases and Teams",
	fps: 30,
	width: 1920,
	height: 1080,
	totalDuration,
};
