// Configuration for Module 4 video
// Auto-generated from moduleContent.ts - DO NOT EDIT MANUALLY

import { getAudioDuration } from "../utils/audioDuration";

const audioDurations = [
	getAudioDuration("agentic-ai-labs-deep-dive/module4-hook-learning-planning"),
	getAudioDuration("agentic-ai-labs-deep-dive/module4-lab-7-1-overview"),
	getAudioDuration("agentic-ai-labs-deep-dive/module4-lab-7-1-code"),
	getAudioDuration("agentic-ai-labs-deep-dive/module4-code-flow-lab-7-1"),
	getAudioDuration("agentic-ai-labs-deep-dive/module4-lab-7-1-in-practice-overview"),
	getAudioDuration("agentic-ai-labs-deep-dive/module4-lab-7-1-actual-code"),
	getAudioDuration("agentic-ai-labs-deep-dive/module4-lab-7-1-actual-flow"),
	getAudioDuration("agentic-ai-labs-deep-dive/module4-lab-8-1-overview"),
	getAudioDuration("agentic-ai-labs-deep-dive/module4-lab-8-1-code"),
	getAudioDuration("agentic-ai-labs-deep-dive/module4-code-flow-lab-8-1"),
	getAudioDuration("agentic-ai-labs-deep-dive/module4-lab-8-1-in-practice-overview"),
	getAudioDuration("agentic-ai-labs-deep-dive/module4-lab-8-1-actual-code"),
	getAudioDuration("agentic-ai-labs-deep-dive/module4-lab-8-1-actual-flow"),
	getAudioDuration("agentic-ai-labs-deep-dive/module4-lab-9-1-overview"),
	getAudioDuration("agentic-ai-labs-deep-dive/module4-lab-9-1-code"),
	getAudioDuration("agentic-ai-labs-deep-dive/module4-code-flow-lab-9-1"),
	getAudioDuration("agentic-ai-labs-deep-dive/module4-lab-9-1-in-practice-overview"),
	getAudioDuration("agentic-ai-labs-deep-dive/module4-lab-9-1-actual-code"),
	getAudioDuration("agentic-ai-labs-deep-dive/module4-lab-9-1-actual-flow"),
	getAudioDuration("agentic-ai-labs-deep-dive/module4-why-learn-plan-goal"),
	getAudioDuration("agentic-ai-labs-deep-dive/module4-conclusion-learning-planning")
];

const whooshDuration = 0.57;
const summaryBuffer = 0.5;
const totalDuration = audioDurations.reduce((sum, audioDur, index) => {
	const isLastSlide = index === audioDurations.length - 1;
	const slideDuration = audioDur + (isLastSlide ? summaryBuffer : 0);
	const whooshTime = isLastSlide ? 0 : whooshDuration;
	return sum + slideDuration + whooshTime;
}, 0);

export const Module4Config = {
	id: "module-4",
	title: "Agentic AI Labs 7.1 to 9.1: Learning and Planning",
	fps: 30,
	width: 1920,
	height: 1080,
	totalDuration,
};
