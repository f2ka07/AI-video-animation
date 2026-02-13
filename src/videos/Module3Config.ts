// Configuration for Module 3 video
// Auto-generated from moduleContent.ts - DO NOT EDIT MANUALLY

import { getAudioDuration } from "../utils/audioDuration";

const audioDurations = [
	getAudioDuration("agentic-ai-labs-deep-dive/module3-hook-advanced-agent-skills"),
	getAudioDuration("agentic-ai-labs-deep-dive/module3-lab-4-1-overview"),
	getAudioDuration("agentic-ai-labs-deep-dive/module3-lab-4-1-code"),
	getAudioDuration("agentic-ai-labs-deep-dive/module3-code-flow-lab-4-1"),
	getAudioDuration("agentic-ai-labs-deep-dive/module3-lab-4-1-in-practice-overview"),
	getAudioDuration("agentic-ai-labs-deep-dive/module3-lab-4-1-actual-code"),
	getAudioDuration("agentic-ai-labs-deep-dive/module3-lab-4-1-actual-flow"),
	getAudioDuration("agentic-ai-labs-deep-dive/module3-lab-5-1-overview"),
	getAudioDuration("agentic-ai-labs-deep-dive/module3-lab-5-1-code"),
	getAudioDuration("agentic-ai-labs-deep-dive/module3-code-flow-lab-5-1"),
	getAudioDuration("agentic-ai-labs-deep-dive/module3-lab-5-1-in-practice-overview"),
	getAudioDuration("agentic-ai-labs-deep-dive/module3-lab-5-1-actual-code"),
	getAudioDuration("agentic-ai-labs-deep-dive/module3-lab-5-1-actual-flow"),
	getAudioDuration("agentic-ai-labs-deep-dive/module3-lab-5-2-overview"),
	getAudioDuration("agentic-ai-labs-deep-dive/module3-lab-5-2-code"),
	getAudioDuration("agentic-ai-labs-deep-dive/module3-code-flow-lab-5-2"),
	getAudioDuration("agentic-ai-labs-deep-dive/module3-lab-6-1-overview"),
	getAudioDuration("agentic-ai-labs-deep-dive/module3-lab-6-1-code"),
	getAudioDuration("agentic-ai-labs-deep-dive/module3-code-flow-lab-6-1"),
	getAudioDuration("agentic-ai-labs-deep-dive/module3-lab-6-1-in-practice-overview"),
	getAudioDuration("agentic-ai-labs-deep-dive/module3-lab-6-1-actual-code"),
	getAudioDuration("agentic-ai-labs-deep-dive/module3-lab-6-1-actual-flow"),
	getAudioDuration("agentic-ai-labs-deep-dive/module3-advanced-skills-importance"),
	getAudioDuration("agentic-ai-labs-deep-dive/module3-conclusion-advanced-agent-skills")
];

const whooshDuration = 0.57;
const summaryBuffer = 0.5;
const totalDuration = audioDurations.reduce((sum, audioDur, index) => {
	const isLastSlide = index === audioDurations.length - 1;
	const slideDuration = audioDur + (isLastSlide ? summaryBuffer : 0);
	const whooshTime = isLastSlide ? 0 : whooshDuration;
	return sum + slideDuration + whooshTime;
}, 0);

export const Module3Config = {
	id: "module-3",
	title: "Mastering Advanced Agent Skills: Labs 4.1 to 6.1",
	fps: 30,
	width: 1920,
	height: 1080,
	totalDuration,
};
