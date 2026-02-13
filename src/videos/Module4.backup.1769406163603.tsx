import React from "react";
import { Sequence, useVideoConfig, Audio, staticFile } from "remotion";
import { getAudioDuration } from "../utils/audioDuration";
import { Module04Intro } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module04/Module04Intro";
import { Module04Diagram1 } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module04/Module04Diagram1";
import { Module04Diagram2 } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module04/Module04Diagram2";
import { Module04Diagram3 } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module04/Module04Diagram3";
import { Module04Recap } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module04/Module04Recap";

// Auto-generated from course scene components - DO NOT EDIT MANUALLY
// Course: agentic-ai-for-beginners, Module: 4
export const Module4: React.FC = () => {
	const { fps } = useVideoConfig();

	const audioFiles = {
		"module4-module-4-application": staticFile("audio/agentic-ai-for-beginners/module4-module-4-application.wav"),
		"module4-module-4-architecture": staticFile("audio/agentic-ai-for-beginners/module4-module-4-architecture.wav"),
		"module4-module-4-concept": staticFile("audio/agentic-ai-for-beginners/module4-module-4-concept.wav"),
		"module4-module-4-exam-mapping": staticFile("audio/agentic-ai-for-beginners/module4-module-4-exam-mapping.wav"),
		"module4-module-4-recap": staticFile("audio/agentic-ai-for-beginners/module4-module-4-recap.wav"),
		"module4-module-4-title": staticFile("audio/agentic-ai-for-beginners/module4-module-4-title.wav"),
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

		{/* Module04Intro */}
		<Sequence
			from={0}
			durationInFrames={1675}
		>
			<Module04Intro
				durationInFrames={1675}
				cuePoints={[]}
			/>
			<Audio src={audioFiles["module4-module-4-title"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={1675} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module04Diagram1 */}
		<Sequence
			from={1693}
			durationInFrames={3617}
		>
			<Module04Diagram1
				durationInFrames={3617}
				cuePoints={[]}
			/>
			<Audio src={audioFiles["module4-module-4-concept"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={5310} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module04Diagram2 */}
		<Sequence
			from={5328}
			durationInFrames={6488}
		>
			<Module04Diagram2
				durationInFrames={6488}
				cuePoints={[]}
			/>
			<Audio src={audioFiles["module4-module-4-architecture"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={11816} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module04Diagram3 */}
		<Sequence
			from={11834}
			durationInFrames={3896}
		>
			<Module04Diagram3
				durationInFrames={3896}
				cuePoints={[]}
			/>
			<Audio src={audioFiles["module4-module-4-application"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={15730} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module04Recap */}
		<Sequence
			from={15748}
			durationInFrames={4348}
		>
			<Module04Recap
				durationInFrames={4348}
				cuePoints={[]}
			/>
			<Audio src={audioFiles["module4-module-4-exam-mapping"]} />
			<Audio src={audioFiles["module4-module-4-recap"]} />
		</Sequence>
		</div>
	);
};
