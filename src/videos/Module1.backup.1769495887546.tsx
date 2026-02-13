import React from "react";
import { Sequence, useVideoConfig, Audio, staticFile } from "remotion";
import { getAudioDuration } from "../utils/audioDuration";
import { Module01Intro } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module01/Module01Intro";
import { Module01Diagram1 } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module01/Module01Diagram1";
import { Module01Diagram2 } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module01/Module01Diagram2";
import { Module01Diagram3 } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module01/Module01Diagram3";
import { Module01Recap } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module01/Module01Recap";

// Course: agentic-ai-for-beginners, Module: 1 — uses scene components (Intro, Diagram1–3, Recap)
export const Module1: React.FC = () => {
	const { fps } = useVideoConfig();
	const whooshFrames = Math.ceil(0.57 * fps);
	const introDuration = getAudioDuration("agentic-ai-for-beginners/module1-module-1-title");
	const introFrames = Math.ceil((introDuration + 0.5) * fps);
	const diagram1Frames = Math.ceil((getAudioDuration("agentic-ai-for-beginners/module1-module-1-concept") + 0.5) * fps);
	const diagram2Frames = Math.ceil((getAudioDuration("agentic-ai-for-beginners/module1-module-1-architecture") + 0.5) * fps);
	const diagram3Frames = Math.ceil((getAudioDuration("agentic-ai-for-beginners/module1-module-1-application") + 0.5) * fps);
	const recapExamFrames = Math.ceil((getAudioDuration("agentic-ai-for-beginners/module1-module-1-exam-mapping") + 0.5) * fps);
	const recapFrames = Math.ceil((getAudioDuration("agentic-ai-for-beginners/module1-module-1-recap") + 0.5) * fps);

	let from = 0;
	const next = (n: number) => {
		const start = from;
		from += n;
		return start;
	};

	const audioFiles = {
		"module1-module-1-application": staticFile("audio/agentic-ai-for-beginners/module1-module-1-application.wav"),
		"module1-module-1-architecture": staticFile("audio/agentic-ai-for-beginners/module1-module-1-architecture.wav"),
		"module1-module-1-concept": staticFile("audio/agentic-ai-for-beginners/module1-module-1-concept.wav"),
		"module1-module-1-exam-mapping": staticFile("audio/agentic-ai-for-beginners/module1-module-1-exam-mapping.wav"),
		"module1-module-1-recap": staticFile("audio/agentic-ai-for-beginners/module1-module-1-recap.wav"),
		"module1-module-1-title": staticFile("audio/agentic-ai-for-beginners/module1-module-1-title.wav"),
		whoosh: staticFile("audio/whoosh.wav"),
	};

	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
				position: "relative",
			}}
		>

		{/* Module01Intro */}
		<Sequence from={next(introFrames)} durationInFrames={introFrames}>
			<Module01Intro durationInFrames={introFrames} cuePoints={[]} />
			<Audio src={audioFiles["module1-module-1-title"]} />
		</Sequence>

		<Sequence from={next(whooshFrames)} durationInFrames={whooshFrames}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module01Diagram1 */}
		<Sequence from={next(diagram1Frames)} durationInFrames={diagram1Frames}>
			<Module01Diagram1 durationInFrames={diagram1Frames} cuePoints={[]} />
			<Audio src={audioFiles["module1-module-1-concept"]} />
		</Sequence>

		<Sequence from={next(whooshFrames)} durationInFrames={whooshFrames}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module01Diagram2 */}
		<Sequence from={next(diagram2Frames)} durationInFrames={diagram2Frames}>
			<Module01Diagram2 durationInFrames={diagram2Frames} cuePoints={[]} />
			<Audio src={audioFiles["module1-module-1-architecture"]} />
		</Sequence>

		<Sequence from={next(whooshFrames)} durationInFrames={whooshFrames}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module01Diagram3 */}
		<Sequence from={next(diagram3Frames)} durationInFrames={diagram3Frames}>
			<Module01Diagram3 durationInFrames={diagram3Frames} cuePoints={[]} />
			<Audio src={audioFiles["module1-module-1-application"]} />
		</Sequence>

		<Sequence from={next(whooshFrames)} durationInFrames={whooshFrames}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module01Recap - exam-mapping */}
		<Sequence from={next(recapExamFrames)} durationInFrames={recapExamFrames}>
			<Module01Recap durationInFrames={recapExamFrames} cuePoints={[]} />
			<Audio src={audioFiles["module1-module-1-exam-mapping"]} />
		</Sequence>

		{/* Module01Recap - recap */}
		<Sequence from={next(recapFrames)} durationInFrames={recapFrames}>
			<Module01Recap durationInFrames={recapFrames} cuePoints={[]} />
			<Audio src={audioFiles["module1-module-1-recap"]} />
		</Sequence>
		</div>
	);
};
