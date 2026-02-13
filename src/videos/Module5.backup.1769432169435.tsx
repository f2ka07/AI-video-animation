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
				cuePoints={[0, 16, 26, 37, 71, 81, 83, 85, 101, 122, 202, 216, 223, 237, 247, 265, 300]}
			/>
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
				cuePoints={[0, 79, 143, 212, 290, 358, 432, 558, 629, 693, 761, 820, 944, 1016, 1090, 1172, 1234, 1308, 1361, 1420, 1491, 1546, 1600, 1671, 1721, 1788, 1864, 1929, 1976, 2046, 2158, 2242, 2293, 2366, 2441, 2506, 2605, 2659, 2725, 2799, 2874, 2951, 3030, 3090, 3150, 3217, 3277, 3370, 3450, 3507, 3592, 3744, 3832, 3942, 3993, 4067, 4147, 4243, 4294, 4351, 4464, 4548, 4606, 4661, 4759, 4812, 4896, 4960, 5069, 5160, 5255, 5347, 5402]}
			/>
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
				cuePoints={[0, 67, 149, 227, 290, 391, 510, 623, 704, 786, 860, 945, 1016, 1101, 1180, 1260, 1343, 1450, 1517, 1575, 1684, 1792, 1867, 1919, 2000, 2067, 2131, 2215, 2281, 2320, 2382, 2488, 2547, 2710, 2816, 2943, 3058, 3165, 3266, 3357, 3422, 3475, 3525, 3597, 3707, 3797]}
			/>
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
				cuePoints={[0, 55, 132, 159, 204, 229, 242, 289, 325, 340, 390, 395, 400, 450, 497, 1480, 1524, 1929, 2228, 2291, 2317, 2323, 2361, 2402, 2419, 2439, 2509, 2559, 2592, 2665, 2760, 2858, 2945, 3033, 3107, 3227, 3300, 3382, 3470, 3558]}
			/>
			<Audio src={audioFiles["module5-module-5-application"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={15146} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module05Recap - module5-module-5-exam-mapping */}
		<Sequence
			from={15164}
			durationInFrames={2495}
		>
			<Module05Recap
				durationInFrames={2495}
				cuePoints={[0, 41, 104, 193, 237, 313, 391, 451, 525, 600, 671, 770, 843, 928, 1040, 1138, 1263, 1335, 1412, 1454, 1516, 1584, 1666, 1802, 1895, 1952, 2041, 2151, 2236, 2336, 2436, 2542, 2550, 2552, 3380, 3386, 3388, 3391, 3393, 3453, 3516, 3529, 3561, 3581, 3610, 3661, 3699, 3746, 3777, 3834, 3886, 3951, 4272, 4385, 4387, 4391, 4443, 4454, 4468]}
			/>
			<Audio src={audioFiles["module5-module-5-exam-mapping"]} />
		</Sequence>

		{/* Module05Recap - module5-module-5-recap */}
		<Sequence
			from={17659}
			durationInFrames={2114}
		>
			<Module05Recap
				durationInFrames={2114}
				cuePoints={[]}
			/>
			<Audio src={audioFiles["module5-module-5-recap"]} />
		</Sequence>
		</div>
	);
};
