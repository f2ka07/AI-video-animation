// Configuration for Module 1 video
// Auto-generated from moduleContent.ts - DO NOT EDIT MANUALLY

import { getAudioDuration } from "../utils/audioDuration";

const audioDurations = [
	getAudioDuration("agentic-ai-labs-deep-dive/module1-hook-intro-agentic-ai"),
	getAudioDuration("agentic-ai-labs-deep-dive/module1-environment-smoke-test-overview"),
	getAudioDuration("agentic-ai-labs-deep-dive/module1-explanation-environment-smoke-test"),
	getAudioDuration("agentic-ai-labs-deep-dive/module1-environment-smoke-test-code"),
	getAudioDuration("agentic-ai-labs-deep-dive/module1-code-flow-environment-smoke-test"),
	getAudioDuration("agentic-ai-labs-deep-dive/module1-lab-1-1-in-practice-overview"),
	getAudioDuration("agentic-ai-labs-deep-dive/module1-lab-1-1-actual-code"),
	getAudioDuration("agentic-ai-labs-deep-dive/module1-lab-1-1-actual-flow"),
	getAudioDuration("agentic-ai-labs-deep-dive/module1-minimal-acting-agent-intro"),
	getAudioDuration("agentic-ai-labs-deep-dive/module1-explanation-minimal-acting-agent"),
	getAudioDuration("agentic-ai-labs-deep-dive/module1-minimal-acting-agent-code"),
	getAudioDuration("agentic-ai-labs-deep-dive/module1-code-flow-minimal-acting-agent"),
	getAudioDuration("agentic-ai-labs-deep-dive/module1-lab-1-2-in-practice-overview"),
	getAudioDuration("agentic-ai-labs-deep-dive/module1-lab-1-2-actual-code"),
	getAudioDuration("agentic-ai-labs-deep-dive/module1-lab-1-2-actual-flow"),
	getAudioDuration("agentic-ai-labs-deep-dive/module1-why-start-simple"),
	getAudioDuration("agentic-ai-labs-deep-dive/module1-big-takeaway-agentic-ai-start")
];

const whooshDuration = 0.57;
const summaryBuffer = 0.5;
const totalDuration = audioDurations.reduce((sum, audioDur, index) => {
	const isLastSlide = index === audioDurations.length - 1;
	const slideDuration = audioDur + (isLastSlide ? summaryBuffer : 0);
	const whooshTime = isLastSlide ? 0 : whooshDuration;
	return sum + slideDuration + whooshTime;
}, 0);

export const Module1Config = {
	id: "module-1",
	title: "Getting Started with Agentic AI Labs",
	fps: 30,
	width: 1920,
	height: 1080,
	totalDuration,
};
