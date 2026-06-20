import React from "react";
import { Sequence, useVideoConfig, Audio, staticFile } from "remotion";
import { getAudioDuration } from "../utils/audioDuration";
import { Module09Intro, Module09Diagram1, Module09Diagram2, Module09Diagram3, Module09Recap } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module09";

// Auto-generated from course scene components - DO NOT EDIT MANUALLY
// Course: agentic-ai-for-beginners, Module: 9
export const Module9: React.FC = () => {
	const { fps } = useVideoConfig();

	const audioFiles = {
		"module9-module-9-application": staticFile("audio/agentic-ai-for-beginners/module9-module-9-application.wav"),
		"module9-module-9-architecture": staticFile("audio/agentic-ai-for-beginners/module9-module-9-architecture.wav"),
		"module9-module-9-concept": staticFile("audio/agentic-ai-for-beginners/module9-module-9-concept.wav"),
		"module9-module-9-exam-mapping": staticFile("audio/agentic-ai-for-beginners/module9-module-9-exam-mapping.wav"),
		"module9-module-9-recap": staticFile("audio/agentic-ai-for-beginners/module9-module-9-recap.wav"),
		"module9-module-9-title": staticFile("audio/agentic-ai-for-beginners/module9-module-9-title.wav"),
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

		{/* Module09Intro */}
		<Sequence
			from={0}
			durationInFrames={1012}
		>
			<Module09Intro
				durationInFrames={1012}
				cuePoints={[4, 67, 132, 246, 298, 356, 426, 506, 580, 657, 739, 807, 892, 972]}
			/>
			<Audio src={audioFiles["module9-module-9-title"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={1012} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module09Diagram1 */}
		<Sequence
			from={1030}
			durationInFrames={1887}
		>
			<Module09Diagram1
				durationInFrames={1887}
				cuePoints={[4, 69, 123, 197, 267, 350, 447, 548, 608, 717, 807, 879, 943, 1012, 1115, 1220, 1295, 1365, 1453, 1506, 1568, 1617, 1680, 1749, 1810, 1846]}
			/>
			<Audio src={audioFiles["module9-module-9-concept"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={2917} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module09Diagram2 */}
		<Sequence
			from={2935}
			durationInFrames={3018}
		>
			<Module09Diagram2
				durationInFrames={3018}
				cuePoints={[3, 55, 121, 176, 255, 339, 427, 483, 557, 611, 656, 726, 774, 835, 896, 973, 1050, 1106, 1170, 1236, 1289, 1342, 1430, 1470, 1535, 1590, 1645, 1741, 1820, 1884, 1983, 2046, 2121, 2228, 2322, 2423, 2507, 2560, 2662, 2763, 2829, 2911, 2962]}
			/>
			<Audio src={audioFiles["module9-module-9-architecture"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={5953} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module09Diagram3 */}
		<Sequence
			from={5971}
			durationInFrames={2405}
		>
			<Module09Diagram3
				durationInFrames={2405}
				cuePoints={[4, 63, 132, 200, 241, 300, 392, 471, 548, 598, 677, 757, 810, 894, 956, 1037, 1098, 1147, 1246, 1302, 1383, 1454, 1507, 1577, 1636, 1711, 1770, 1849, 1930, 2038, 2138, 2203, 2283, 2346]}
			/>
			<Audio src={audioFiles["module9-module-9-application"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={8376} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module09Recap - module9-module-9-exam-mapping */}
		<Sequence
			from={8394}
			durationInFrames={1052}
		>
			<Module09Recap
				durationInFrames={1052}
				cuePoints={[0, 62, 134, 209, 296, 396, 557, 660, 725, 820, 891, 939, 1056, 1156, 1252, 1317, 1360, 1451, 1505, 1606, 1711, 1793, 1861, 1963, 2007]}
			/>
			<Audio src={audioFiles["module9-module-9-exam-mapping"]} />
		</Sequence>

		{/* Module09Recap - module9-module-9-recap */}
		<Sequence
			from={9446}
			durationInFrames={1040}
		>
			<Module09Recap
				durationInFrames={1040}
				cuePoints={[]}
			/>
			<Audio src={audioFiles["module9-module-9-recap"]} />
		</Sequence>
		</div>
	);
};
