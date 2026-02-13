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
			durationInFrames={1872}
		>
			<Module05Intro
				durationInFrames={1872}
				cuePoints={[0, 83, 122, 247]}
			/>
		</Sequence>

		{/* Audio: module5-module-5-title */}
		<Sequence
			from={0}
			durationInFrames={1857}
		>
			<Audio src={audioFiles["module5-module-5-title"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={1872} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module05Diagram1 */}
		<Sequence
			from={1890}
			durationInFrames={5662}
		>
			<Module05Diagram1
				durationInFrames={5662}
				cuePoints={[0, 79, 143, 212, 290, 358, 432, 558, 629, 693, 761, 820, 944, 1016, 1090, 1172, 1234, 1308, 1361, 1420, 1491, 1546, 1600, 1671, 1721, 1788, 1864, 1929, 1976, 2046, 2158, 2242, 2293, 2366, 2441, 2506, 2605, 2659, 2725, 2799, 2874, 2951, 3030, 3090, 3150, 3217, 3277, 3370, 3450, 3507, 3592, 3744, 3832, 3942, 3993, 4067, 4147, 4243, 4294, 4351, 4464, 4548, 4606, 4661, 4759, 4812, 4896, 4960, 5069, 5160, 5255, 5347, 5402, 5523, 5583, 5619]}
			/>
		</Sequence>

		{/* Audio: module5-module-5-concept */}
		<Sequence
			from={1890}
			durationInFrames={5647}
		>
			<Audio src={audioFiles["module5-module-5-concept"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={7552} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module05Diagram2 */}
		<Sequence
			from={7570}
			durationInFrames={3933}
		>
			<Module05Diagram2
				durationInFrames={3933}
				cuePoints={[0, 67, 149, 227, 290, 391, 510, 623, 704, 786, 860, 945, 1016, 1101, 1180, 1260, 1343, 1450, 1517, 1575, 1684, 1792, 1867, 1919, 2000, 2067, 2131, 2215, 2281, 2320, 2382, 2488, 2547, 2710, 2816, 2943, 3058, 3165, 3266, 3357, 3422, 3475, 3525, 3597, 3707, 3797, 3888]}
			/>
		</Sequence>

		{/* Audio: module5-module-5-architecture */}
		<Sequence
			from={7570}
			durationInFrames={3918}
		>
			<Audio src={audioFiles["module5-module-5-architecture"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={11503} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module05Diagram3 */}
		<Sequence
			from={11521}
			durationInFrames={3625}
		>
			<Module05Diagram3
				durationInFrames={3625}
				cuePoints={[0, 132, 204, 242, 325, 340, 390, 400, 450, 1480, 1929, 2291, 2317, 2361, 2419, 2509, 2592, 2685, 2771, 2888, 2957, 3033, 3134, 3238, 3300, 3396, 3491, 3577]}
			/>
		</Sequence>

		{/* Audio: module5-module-5-application */}
		<Sequence
			from={11521}
			durationInFrames={3610}
		>
			<Audio src={audioFiles["module5-module-5-application"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={15146} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module05Recap */}
		<Sequence
			from={15164}
			durationInFrames={4623}
		>
			<Module05Recap
				durationInFrames={4623}
				cuePoints={[0, 41, 104, 193, 237, 313, 391, 451, 525, 600, 671, 770, 843, 928, 1040, 1138, 1263, 1335, 1412, 1454, 1516, 1584, 1666, 1802, 1895, 1952, 2041, 2151, 2236, 2336, 2436, 2542, 3380, 3391, 3516, 3581, 3699, 3820, 3908, 4362, 4388, 4454, 4553]}
			/>
		</Sequence>

		{/* Audio: module5-module-5-exam-mapping */}
		<Sequence
			from={15164}
			durationInFrames={2495}
		>
			<Audio src={audioFiles["module5-module-5-exam-mapping"]} />
		</Sequence>

		{/* Audio: module5-module-5-recap */}
		<Sequence
			from={17659}
			durationInFrames={2114}
		>
			<Audio src={audioFiles["module5-module-5-recap"]} />
		</Sequence>
		</div>
	);
};
