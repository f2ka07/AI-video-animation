import React from "react";
import { Sequence, useVideoConfig, Audio, staticFile } from "remotion";
import { getAudioDuration } from "../utils/audioDuration";
import { Module06Intro } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module06/Module06Intro";
import { Module06Diagram1 } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module06/Module06Diagram1";
import { Module06Diagram2 } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module06/Module06Diagram2";
import { Module06Diagram3 } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module06/Module06Diagram3";
import { Module06Recap } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module06/Module06Recap";

// Auto-generated from course scene components - DO NOT EDIT MANUALLY
// Course: agentic-ai-for-beginners, Module: 6
export const Module6: React.FC = () => {
	const { fps } = useVideoConfig();

	const audioFiles = {
		"module6-module-6-application": staticFile("audio/agentic-ai-for-beginners/module6-module-6-application.wav"),
		"module6-module-6-architecture": staticFile("audio/agentic-ai-for-beginners/module6-module-6-architecture.wav"),
		"module6-module-6-concept": staticFile("audio/agentic-ai-for-beginners/module6-module-6-concept.wav"),
		"module6-module-6-exam-mapping": staticFile("audio/agentic-ai-for-beginners/module6-module-6-exam-mapping.wav"),
		"module6-module-6-recap": staticFile("audio/agentic-ai-for-beginners/module6-module-6-recap.wav"),
		"module6-module-6-title": staticFile("audio/agentic-ai-for-beginners/module6-module-6-title.wav"),
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

		{/* Module06Intro */}
		<Sequence
			from={0}
			durationInFrames={1688}
		>
			<Module06Intro
				durationInFrames={1688}
				cuePoints={[]}
			/>
			<Audio src={audioFiles["module6-module-6-title"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={1688} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module06Diagram1 */}
		<Sequence
			from={1706}
			durationInFrames={2663}
		>
			<Module06Diagram1
				durationInFrames={2663}
				cuePoints={[]}
			/>
			<Audio src={audioFiles["module6-module-6-concept"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={4369} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module06Diagram2 */}
		<Sequence
			from={4387}
			durationInFrames={5331}
		>
			<Module06Diagram2
				durationInFrames={5331}
				cuePoints={[]}
			/>
			<Audio src={audioFiles["module6-module-6-architecture"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={9718} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module06Diagram3 */}
		<Sequence
			from={9736}
			durationInFrames={4415}
		>
			<Module06Diagram3
				durationInFrames={4415}
				cuePoints={[]}
			/>
			<Audio src={audioFiles["module6-module-6-application"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={14151} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module06Recap */}
		<Sequence
			from={14169}
			durationInFrames={4734}
		>
			<Module06Recap
				durationInFrames={4734}
				cuePoints={[]}
			/>
			<Audio src={audioFiles["module6-module-6-exam-mapping"]} />
			<Audio src={audioFiles["module6-module-6-recap"]} />
		</Sequence>
		</div>
	);
};
