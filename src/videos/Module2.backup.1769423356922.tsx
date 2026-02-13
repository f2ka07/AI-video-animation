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
			durationInFrames={1544}
		>
			<Module02Intro
				durationInFrames={1544}
				cuePoints={[0, 4, 8, 14, 21, 28, 30, 31, 39, 48, 57, 62, 67, 70, 73, 76, 212, 349]}
			/>
			<Audio src={audioFiles["module2-module-2-title"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={1544} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module02Diagram1 */}
		<Sequence
			from={1562}
			durationInFrames={2076}
		>
			<Module02Diagram1
				durationInFrames={2076}
				cuePoints={[0, 155, 202, 343, 834, 1125, 1175]}
			/>
			<Audio src={audioFiles["module2-module-2-concept"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={3638} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module02Diagram2 */}
		<Sequence
			from={3656}
			durationInFrames={6535}
		>
			<Module02Diagram2
				durationInFrames={6535}
				cuePoints={[0, 125, 180, 181, 548, 561, 608, 726, 745, 807, 873, 946, 1001, 1070, 1135, 1201, 1272, 1337, 1393, 1459, 1543, 1603, 1671, 1747, 1814, 1895, 1969, 2056, 2142, 2187, 2284, 2362, 2435, 2477, 2544, 2604, 2682, 2806, 2877, 2979, 3047, 3105, 3180, 3287, 3340, 3439, 3510, 3567, 3654, 3728, 3803, 3886, 3963, 4079, 4170, 4254, 4354, 4428, 4515, 4597, 4675, 4743, 4842, 4916, 5029, 5177, 5257, 5334, 5425, 5522, 5590, 5656, 5734, 5865, 5936, 5992, 6016, 6113, 6211, 6341, 6386, 6459, 6489]}
			/>
			<Audio src={audioFiles["module2-module-2-architecture"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={10191} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module02Diagram3 */}
		<Sequence
			from={10209}
			durationInFrames={2603}
		>
			<Module02Diagram3
				durationInFrames={2603}
				cuePoints={[0, 581, 899, 1807, 1822, 1841, 1892, 1924, 2013, 2023, 2054, 2089, 2091, 2110, 2130, 2191, 2270, 2306, 2328, 2341, 2378, 2397, 2432, 2468, 2499, 2522, 2550]}
			/>
			<Audio src={audioFiles["module2-module-2-application"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={12812} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module02Recap - module2-module-2-exam-mapping */}
		<Sequence
			from={12830}
			durationInFrames={2093}
		>
			<Module02Recap
				durationInFrames={2093}
				cuePoints={[0, 17, 396, 448, 469, 473, 474, 762, 772, 899, 1848, 1873, 1909, 1945, 1948, 1951, 2056, 2081, 2092, 2178, 2216, 2259, 2323, 2428, 2496, 2534, 2587, 2680, 2836, 2885, 2983, 3078, 3144, 3228, 3302, 3403, 3477, 3560, 3661, 3756, 3831, 3895]}
			/>
			<Audio src={audioFiles["module2-module-2-exam-mapping"]} />
		</Sequence>

		{/* Module02Recap - module2-module-2-recap */}
		<Sequence
			from={14923}
			durationInFrames={1953}
		>
			<Module02Recap
				durationInFrames={1953}
				cuePoints={[]}
			/>
			<Audio src={audioFiles["module2-module-2-recap"]} />
		</Sequence>
		</div>
	);
};
