import React from "react";
import { Sequence, useVideoConfig, Audio, staticFile } from "remotion";
import { getAudioDuration } from "../utils/audioDuration";
import { Module12Intro } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module12/Module12Intro";
import { Module12Diagram1 } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module12/Module12Diagram1";
import { Module12Diagram2 } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module12/Module12Diagram2";
import { Module12Diagram3 } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module12/Module12Diagram3";
import { Module12Recap } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module12/Module12Recap";

// Auto-generated from course scene components - DO NOT EDIT MANUALLY
// Course: agentic-ai-for-beginners, Module: 12
export const Module12: React.FC = () => {
	const { fps } = useVideoConfig();

	const audioFiles = {
		"module12-module-12-application": staticFile("audio/agentic-ai-for-beginners/module12-module-12-application.wav"),
		"module12-module-12-architecture": staticFile("audio/agentic-ai-for-beginners/module12-module-12-architecture.wav"),
		"module12-module-12-concept": staticFile("audio/agentic-ai-for-beginners/module12-module-12-concept.wav"),
		"module12-module-12-exam-mapping": staticFile("audio/agentic-ai-for-beginners/module12-module-12-exam-mapping.wav"),
		"module12-module-12-recap": staticFile("audio/agentic-ai-for-beginners/module12-module-12-recap.wav"),
		"module12-module-12-title": staticFile("audio/agentic-ai-for-beginners/module12-module-12-title.wav"),
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

		{/* Module12Intro */}
		<Sequence
			from={0}
			durationInFrames={971}
		>
			<Module12Intro
				durationInFrames={971}
				cuePoints={[4, 60, 124, 186, 248, 326, 399, 488, 515, 597, 687, 744, 822, 898]}
			/>
			<Audio src={audioFiles["module12-module-12-title"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={971} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module12Diagram1 */}
		<Sequence
			from={989}
			durationInFrames={2934}
		>
			<Module12Diagram1
				durationInFrames={2934}
				cuePoints={[4, 68, 117, 197, 264, 367, 419, 499, 562, 647, 718, 790, 905, 975, 1069, 1157, 1221, 1260, 1350, 1466, 1563, 1639, 1710, 1770, 1817, 1889, 1951, 2026, 2094, 2172, 2254, 2325, 2392, 2473, 2600, 2667, 2751, 2835]}
			/>
			<Audio src={audioFiles["module12-module-12-concept"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={3923} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module12Diagram2 */}
		<Sequence
			from={3941}
			durationInFrames={3324}
		>
			<Module12Diagram2
				durationInFrames={3324}
				cuePoints={[3, 48, 106, 192, 260, 332, 394, 472, 578, 647, 685, 775, 850, 911, 997, 1067, 1164, 1227, 1275, 1337, 1471, 1530, 1578, 1648, 1705, 1763, 1826, 1914, 1995, 2060, 2137, 2256, 2315, 2414, 2505, 2576, 2688, 2766, 2805, 2883, 2963, 3042, 3090, 3179, 3277]}
			/>
			<Audio src={audioFiles["module12-module-12-architecture"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={7265} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module12Diagram3 */}
		<Sequence
			from={7283}
			durationInFrames={2241}
		>
			<Module12Diagram3
				durationInFrames={2241}
				cuePoints={[3, 34, 165, 253, 342, 447, 513, 591, 668, 758, 820, 891, 961, 1063, 1164, 1211, 1266, 1356, 1447, 1517, 1605, 1661, 1734, 1787, 1874, 1923, 1999, 2062, 2152]}
			/>
			<Audio src={audioFiles["module12-module-12-application"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={9524} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module12Recap - module12-module-12-exam-mapping */}
		<Sequence
			from={9542}
			durationInFrames={937}
		>
			<Module12Recap
				durationInFrames={937}
				cuePoints={[4, 57, 145, 222, 342, 396, 493, 642, 696, 785, 855, 936, 940, 1029, 1135, 1213, 1286, 1375, 1432, 1486, 1739, 1848, 1933, 2009]}
			/>
			<Audio src={audioFiles["module12-module-12-exam-mapping"]} />
		</Sequence>

		{/* Module12Recap - module12-module-12-recap */}
		<Sequence
			from={10479}
			durationInFrames={1125}
		>
			<Module12Recap
				durationInFrames={1125}
				cuePoints={[]}
			/>
			<Audio src={audioFiles["module12-module-12-recap"]} />
		</Sequence>
		</div>
	);
};
