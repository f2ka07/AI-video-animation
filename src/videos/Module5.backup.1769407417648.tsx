import React from "react";
import { Sequence, useVideoConfig, Audio, staticFile } from "remotion";
import { getAudioDuration } from "../utils/audioDuration";
import { Module05Intro } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module05/Module05Intro";
import { Module05Diagram1 } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module05/Module05Diagram1";
import { Module05Diagram2 } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module05/Module05Diagram2";
import { Module05Diagram3 } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module05/Module05Diagram3";
import { Module05Recap } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module05/Module05Recap";

// Auto-generated from course scene components - DO NOT EDIT MANUALLY
// Course: agentic-ai-for-beginners, Module: 5
export const Module5: React.FC = () => {
	const { fps } = useVideoConfig();

	const audioFiles = {
		"module5-module-5-application": staticFile("audio/agentic-ai-for-beginners/module5-module-5-application.wav"),
		"module5-module-5-architecture": staticFile("audio/agentic-ai-for-beginners/module5-module-5-architecture.wav"),
		"module5-module-5-concept": staticFile("audio/agentic-ai-for-beginners/module5-module-5-concept.wav"),
		"module5-module-5-exam-mapping": staticFile("audio/agentic-ai-for-beginners/module5-module-5-exam-mapping.wav"),
		"module5-module-5-recap": staticFile("audio/agentic-ai-for-beginners/module5-module-5-recap.wav"),
		"module5-module-5-title": staticFile("audio/agentic-ai-for-beginners/module5-module-5-title.wav"),
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

		{/* Module05Intro */}
		<Sequence
			from={0}
			durationInFrames={1857}
		>
			<Module05Intro
				durationInFrames={1857}
				cuePoints={[]}
			/>
			<Audio src={audioFiles["module5-module-5-title"]} startFrom={0} />
		</Sequence>

		{/* Transition */}
		<Sequence from={1857} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module05Diagram1 */}
		<Sequence
			from={1875}
			durationInFrames={5647}
		>
			<Module05Diagram1
				durationInFrames={5647}
				cuePoints={[]}
			/>
			<Audio src={audioFiles["module5-module-5-concept"]} startFrom={0} />
		</Sequence>

		{/* Transition */}
		<Sequence from={7522} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module05Diagram2 */}
		<Sequence
			from={7540}
			durationInFrames={3918}
		>
			<Module05Diagram2
				durationInFrames={3918}
				cuePoints={[]}
			/>
			<Audio src={audioFiles["module5-module-5-architecture"]} startFrom={0} />
		</Sequence>

		{/* Transition */}
		<Sequence from={11458} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module05Diagram3 */}
		<Sequence
			from={11476}
			durationInFrames={3610}
		>
			<Module05Diagram3
				durationInFrames={3610}
				cuePoints={[]}
			/>
			<Audio src={audioFiles["module5-module-5-application"]} startFrom={0} />
		</Sequence>

		{/* Transition */}
		<Sequence from={15086} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module05Recap */}
		<Sequence
			from={15104}
			durationInFrames={4608}
		>
			<Module05Recap
				durationInFrames={4608}
				cuePoints={[]}
			/>
			<Audio src={audioFiles["module5-module-5-exam-mapping"]} startFrom={0} />
			<Audio src={audioFiles["module5-module-5-recap"]} startFrom={2495} />
		</Sequence>
		</div>
	);
};
