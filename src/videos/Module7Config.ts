// Configuration for Module 7 video
// Auto-generated from moduleContent.ts - DO NOT EDIT MANUALLY

import { getAudioDuration } from "../utils/audioDuration";

const audioDurations = [
	getAudioDuration("rag-for-code-search-codebase-like-cursor/module7-hook-case-studies"),
	getAudioDuration("rag-for-code-search-codebase-like-cursor/module7-case-study-cursor"),
	getAudioDuration("rag-for-code-search-codebase-like-cursor/module7-case-study-microsoft"),
	getAudioDuration("rag-for-code-search-codebase-like-cursor/module7-case-study-startup"),
	getAudioDuration("rag-for-code-search-codebase-like-cursor/module7-module7-wrap-up")
];

const whooshDuration = 0.57;
const summaryBuffer = 0.5;
const totalDuration = audioDurations.reduce((sum, audioDur, index) => {
	const isLastSlide = index === audioDurations.length - 1;
	const slideDuration = audioDur + (isLastSlide ? summaryBuffer : 0);
	const whooshTime = isLastSlide ? 0 : whooshDuration;
	return sum + slideDuration + whooshTime;
}, 0);

export const Module7Config = {
	id: "module-7",
	title: "Real-World RAG Case Studies for Code Search",
	fps: 30,
	width: 1920,
	height: 1080,
	totalDuration,
};
