import React from "react";
import { Sequence, useVideoConfig, Audio, staticFile } from "remotion";
import { getAudioDuration } from "../utils/audioDuration";
import { Module01Intro } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module01/Module01Intro";
import { Module01Diagram1 } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module01/Module01Diagram1";
import { Module01Diagram2 } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module01/Module01Diagram2";
import { Module01Diagram3 } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module01/Module01Diagram3";
import { Module01Recap } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module01/Module01Recap";

// Auto-generated from course scene components - DO NOT EDIT MANUALLY
// Course: agentic-ai-for-beginners, Module: 1
export const Module1: React.FC = () => {
	const { fps } = useVideoConfig();

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
		<Sequence
			from={0}
			durationInFrames={1286}
		>
			<Module01Intro
				durationInFrames={1286}
				cuePoints={[]}
			/>
			<Audio src={audioFiles["module1-module-1-title"]} startFrom={0} />
		</Sequence>

		{/* Transition */}
		<Sequence from={1286} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module01Diagram1 */}
		<Sequence
			from={1304}
			durationInFrames={2972}
		>
			<Module01Diagram1
				durationInFrames={2972}
				cuePoints={[]}
			/>
			<Audio src={audioFiles["module1-module-1-concept"]} startFrom={0} />
		</Sequence>

		{/* Transition */}
		<Sequence from={4276} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module01Diagram2 */}
		<Sequence
			from={4294}
			durationInFrames={3525}
		>
			<Module01Diagram2
				durationInFrames={3525}
				cuePoints={[]}
			/>
			<Audio src={audioFiles["module1-module-1-architecture"]} startFrom={0} />
		</Sequence>

		{/* Transition */}
		<Sequence from={7819} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module01Diagram3 */}
		<Sequence
			from={7837}
			durationInFrames={2495}
		>
			<Module01Diagram3
				durationInFrames={2495}
				cuePoints={[]}
			/>
			<Audio src={audioFiles["module1-module-1-application"]} startFrom={0} />
		</Sequence>

		{/* Transition */}
		<Sequence from={10332} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module01Recap */}
		<Sequence
			from={10350}
			durationInFrames={3065}
		>
			<Module01Recap
				durationInFrames={3065}
				cuePoints={[]}
			/>
			<Audio src={audioFiles["module1-module-1-exam-mapping"]} startFrom={0} />
			<Audio src={audioFiles["module1-module-1-recap"]} startFrom={1349} />
		</Sequence>
		</div>
	);
};
