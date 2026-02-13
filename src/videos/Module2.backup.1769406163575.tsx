import React from "react";
import { Sequence, useVideoConfig, Audio, staticFile } from "remotion";
import { getAudioDuration } from "../utils/audioDuration";
import { Module02Intro } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module02/Module02Intro";
import { Module02Diagram1 } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module02/Module02Diagram1";
import { Module02Diagram2 } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module02/Module02Diagram2";
import { Module02Diagram3 } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module02/Module02Diagram3";
import { Module02Recap } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module02/Module02Recap";

// Auto-generated from course scene components - DO NOT EDIT MANUALLY
// Course: agentic-ai-for-beginners, Module: 2
export const Module2: React.FC = () => {
	const { fps } = useVideoConfig();

	const audioFiles = {
		"module2-module-2-application": staticFile("audio/agentic-ai-for-beginners/module2-module-2-application.wav"),
		"module2-module-2-architecture": staticFile("audio/agentic-ai-for-beginners/module2-module-2-architecture.wav"),
		"module2-module-2-concept": staticFile("audio/agentic-ai-for-beginners/module2-module-2-concept.wav"),
		"module2-module-2-exam-mapping": staticFile("audio/agentic-ai-for-beginners/module2-module-2-exam-mapping.wav"),
		"module2-module-2-recap": staticFile("audio/agentic-ai-for-beginners/module2-module-2-recap.wav"),
		"module2-module-2-title": staticFile("audio/agentic-ai-for-beginners/module2-module-2-title.wav"),
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

		{/* Module02Intro */}
		<Sequence
			from={0}
			durationInFrames={1529}
		>
			<Module02Intro
				durationInFrames={1529}
				cuePoints={[]}
			/>
			<Audio src={audioFiles["module2-module-2-title"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={1529} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module02Diagram1 */}
		<Sequence
			from={1547}
			durationInFrames={2061}
		>
			<Module02Diagram1
				durationInFrames={2061}
				cuePoints={[]}
			/>
			<Audio src={audioFiles["module2-module-2-concept"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={3608} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module02Diagram2 */}
		<Sequence
			from={3626}
			durationInFrames={6520}
		>
			<Module02Diagram2
				durationInFrames={6520}
				cuePoints={[]}
			/>
			<Audio src={audioFiles["module2-module-2-architecture"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={10146} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module02Diagram3 */}
		<Sequence
			from={10164}
			durationInFrames={2588}
		>
			<Module02Diagram3
				durationInFrames={2588}
				cuePoints={[]}
			/>
			<Audio src={audioFiles["module2-module-2-application"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={12752} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module02Recap */}
		<Sequence
			from={12770}
			durationInFrames={4046}
		>
			<Module02Recap
				durationInFrames={4046}
				cuePoints={[]}
			/>
			<Audio src={audioFiles["module2-module-2-exam-mapping"]} />
			<Audio src={audioFiles["module2-module-2-recap"]} />
		</Sequence>
		</div>
	);
};
