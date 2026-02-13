// Configuration for Module 5 video
// Auto-generated from moduleContent.ts - DO NOT EDIT MANUALLY

import { getAudioDuration } from "../utils/audioDuration";

const audioDurations = [
	getAudioDuration("agentic-ai-labs-deep-dive/module5-hook-final-labs-capstone"),
	getAudioDuration("agentic-ai-labs-deep-dive/module5-lab-10-1-overview"),
	getAudioDuration("agentic-ai-labs-deep-dive/module5-lab-10-1-code"),
	getAudioDuration("agentic-ai-labs-deep-dive/module5-code-flow-lab-10-1"),
	getAudioDuration("agentic-ai-labs-deep-dive/module5-lab-10-1-in-practice-overview"),
	getAudioDuration("agentic-ai-labs-deep-dive/module5-lab-10-1-actual-code"),
	getAudioDuration("agentic-ai-labs-deep-dive/module5-lab-10-1-actual-flow"),
	getAudioDuration("agentic-ai-labs-deep-dive/module5-lab-10-2-overview"),
	getAudioDuration("agentic-ai-labs-deep-dive/module5-lab-10-2-code"),
	getAudioDuration("agentic-ai-labs-deep-dive/module5-code-flow-lab-10-2"),
	getAudioDuration("agentic-ai-labs-deep-dive/module5-lab-10-2-in-practice-overview"),
	getAudioDuration("agentic-ai-labs-deep-dive/module5-lab-10-2-actual-code"),
	getAudioDuration("agentic-ai-labs-deep-dive/module5-lab-10-2-actual-flow"),
	getAudioDuration("agentic-ai-labs-deep-dive/module5-lab-10-3-overview"),
	getAudioDuration("agentic-ai-labs-deep-dive/module5-lab-10-3-code"),
	getAudioDuration("agentic-ai-labs-deep-dive/module5-code-flow-lab-10-3"),
	getAudioDuration("agentic-ai-labs-deep-dive/module5-lab-10-3-in-practice-overview"),
	getAudioDuration("agentic-ai-labs-deep-dive/module5-lab-10-3-actual-code"),
	getAudioDuration("agentic-ai-labs-deep-dive/module5-lab-10-3-actual-flow"),
	getAudioDuration("agentic-ai-labs-deep-dive/module5-capstone-overview"),
	getAudioDuration("agentic-ai-labs-deep-dive/module5-capstone-code"),
	getAudioDuration("agentic-ai-labs-deep-dive/module5-code-flow-capstone"),
	getAudioDuration("agentic-ai-labs-deep-dive/module5-capstone-in-practice-overview"),
	getAudioDuration("agentic-ai-labs-deep-dive/module5-capstone-actual-code"),
	getAudioDuration("agentic-ai-labs-deep-dive/module5-capstone-actual-flow"),
	getAudioDuration("agentic-ai-labs-deep-dive/module5-final-thoughts"),
	getAudioDuration("agentic-ai-labs-deep-dive/module5-final-big-takeaway")
];

const whooshDuration = 0.57;
const summaryBuffer = 0.5;
const totalDuration = audioDurations.reduce((sum, audioDur, index) => {
	const isLastSlide = index === audioDurations.length - 1;
	const slideDuration = audioDur + (isLastSlide ? summaryBuffer : 0);
	const whooshTime = isLastSlide ? 0 : whooshDuration;
	return sum + slideDuration + whooshTime;
}, 0);

export const Module5Config = {
	id: "module-5",
	title: "Final Labs and Capstone: Mastery of Agentic AI",
	fps: 30,
	width: 1920,
	height: 1080,
	totalDuration,
};
