import React from "react";
import { Sequence, useVideoConfig, Audio, staticFile } from "remotion";
import { getAudioDuration } from "../utils/audioDuration";
import { Module03Intro } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module03/Module03Intro";
import { Module03Diagram1 } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module03/Module03Diagram1";
import { Module03Diagram2 } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module03/Module03Diagram2";
import { Module03Diagram3 } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module03/Module03Diagram3";
import { Module03Recap } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module03/Module03Recap";

// Auto-generated from course scene components - DO NOT EDIT MANUALLY
// Course: agentic-ai-for-beginners, Module: 3
export const Module3: React.FC = () => {
	const { fps } = useVideoConfig();

	const audioFiles = {
		"module3-module-3-application": staticFile("audio/agentic-ai-for-beginners/module3-module-3-application.wav"),
		"module3-module-3-architecture": staticFile("audio/agentic-ai-for-beginners/module3-module-3-architecture.wav"),
		"module3-module-3-concept": staticFile("audio/agentic-ai-for-beginners/module3-module-3-concept.wav"),
		"module3-module-3-exam-mapping": staticFile("audio/agentic-ai-for-beginners/module3-module-3-exam-mapping.wav"),
		"module3-module-3-recap": staticFile("audio/agentic-ai-for-beginners/module3-module-3-recap.wav"),
		"module3-module-3-title": staticFile("audio/agentic-ai-for-beginners/module3-module-3-title.wav"),
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

		{/* Module03Intro */}
		<Sequence
			from={0}
			durationInFrames={1719}
		>
			<Module03Intro
				durationInFrames={1719}
				cuePoints={[]}
			/>
			<Audio src={audioFiles["module3-module-3-title"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={1719} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module03Diagram1 */}
		<Sequence
			from={1737}
			durationInFrames={2223}
		>
			<Module03Diagram1
				durationInFrames={2223}
				cuePoints={[]}
			/>
			<Audio src={audioFiles["module3-module-3-concept"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={3960} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module03Diagram2 */}
		<Sequence
			from={3978}
			durationInFrames={7657}
		>
			<Module03Diagram2
				durationInFrames={7657}
				cuePoints={[]}
			/>
			<Audio src={audioFiles["module3-module-3-architecture"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={11635} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module03Diagram3 */}
		<Sequence
			from={11653}
			durationInFrames={3024}
		>
			<Module03Diagram3
				durationInFrames={3024}
				cuePoints={[]}
			/>
			<Audio src={audioFiles["module3-module-3-application"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={14677} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module03Recap */}
		<Sequence
			from={14695}
			durationInFrames={4100}
		>
			<Module03Recap
				durationInFrames={4100}
				cuePoints={[]}
			/>
			<Audio src={audioFiles["module3-module-3-exam-mapping"]} />
			<Audio src={audioFiles["module3-module-3-recap"]} />
		</Sequence>
		</div>
	);
};
