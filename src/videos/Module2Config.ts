// Configuration for Module 2 video
// Auto-generated from moduleContent.ts - DO NOT EDIT MANUALLY

import { getAudioDuration } from "../utils/audioDuration";

const audioDurations = [
	getAudioDuration("agentic-ai-labs-deep-dive/module2-hook-intermediate-agent-concepts"),
	getAudioDuration("agentic-ai-labs-deep-dive/module2-lab-2-1-overview"),
	getAudioDuration("agentic-ai-labs-deep-dive/module2-lab-2-1-code"),
	getAudioDuration("agentic-ai-labs-deep-dive/module2-code-flow-lab-2-1"),
	getAudioDuration("agentic-ai-labs-deep-dive/module2-lab-2-1-in-practice-overview"),
	getAudioDuration("agentic-ai-labs-deep-dive/module2-lab-2-1-actual-code"),
	getAudioDuration("agentic-ai-labs-deep-dive/module2-lab-2-1-actual-flow"),
	getAudioDuration("agentic-ai-labs-deep-dive/module2-lab-3-1-overview"),
	getAudioDuration("agentic-ai-labs-deep-dive/module2-lab-3-1-code"),
	getAudioDuration("agentic-ai-labs-deep-dive/module2-code-flow-lab-3-1"),
	getAudioDuration("agentic-ai-labs-deep-dive/module2-lab-3-1-in-practice-overview"),
	getAudioDuration("agentic-ai-labs-deep-dive/module2-lab-3-1-actual-code"),
	getAudioDuration("agentic-ai-labs-deep-dive/module2-lab-3-1-actual-flow"),
	getAudioDuration("agentic-ai-labs-deep-dive/module2-why-intermediate-matters"),
	getAudioDuration("agentic-ai-labs-deep-dive/module2-conclusion-intermediate-agent")
];

const whooshDuration = 0.57;
const summaryBuffer = 0.5;
const totalDuration = audioDurations.reduce((sum, audioDur, index) => {
	const isLastSlide = index === audioDurations.length - 1;
	const slideDuration = audioDur + (isLastSlide ? summaryBuffer : 0);
	const whooshTime = isLastSlide ? 0 : whooshDuration;
	return sum + slideDuration + whooshTime;
}, 0);

export const Module2Config = {
	id: "module-2",
	title: "Exploring Agentic AI Labs 2.1 and 3.1: Intermediate Agent Concepts",
	fps: 30,
	width: 1920,
	height: 1080,
	totalDuration,
};
