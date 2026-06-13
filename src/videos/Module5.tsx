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
				cuePoints={[4, 57, 131, 189, 238, 324, 395, 509, 579, 644, 699, 802, 852, 936, 1031, 1100, 1152, 1223, 1292, 1365, 1446, 1528, 1595, 1682, 1769, 1797]}
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
				cuePoints={[0, 79, 143, 212, 290, 358, 432, 558, 629, 693, 761, 820, 944, 1016, 1090, 1172, 1234, 1308, 1361, 1420, 1491, 1546, 1600, 1671, 1721, 1788, 1864, 1929, 1976, 2046, 2158, 2242, 2293, 2366, 2441, 2506, 2605, 2659, 2725, 2799, 2874, 2951, 3030, 3090, 3150, 3217, 3277, 3370, 3450, 3507, 3592, 3744, 3832, 3942, 3993, 4067, 4147, 4243, 4294, 4351, 4464, 4548, 4606, 4661, 4759, 4812, 4896, 4960, 5069, 5160, 5255, 5347, 5402, 5523, 5583, 5619]}
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
				cuePoints={[0, 67, 149, 227, 290, 391, 510, 623, 704, 786, 860, 945, 1016, 1101, 1180, 1260, 1343, 1450, 1517, 1575, 1684, 1792, 1867, 1919, 2000, 2067, 2131, 2215, 2281, 2320, 2382, 2488, 2547, 2710, 2816, 2943, 3058, 3165, 3266, 3357, 3422, 3475, 3525, 3597, 3707, 3797, 3888]}
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
				cuePoints={[4, 93, 176, 259, 330, 362, 433, 498, 588, 653, 732, 788, 865, 945, 1011, 1067, 1126, 1180, 1257, 1310, 1366, 1443, 1541, 1618, 1708, 1766, 1800, 1869, 1939, 2068, 2178, 2243, 2351, 2409, 2480, 2575, 2684, 2781, 2875, 2969, 3036, 3147, 3244, 3310, 3396, 3487, 3580]}
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
				cuePoints={[0, 41, 104, 193, 237, 313, 391, 451, 525, 600, 671, 770, 843, 928, 1040, 1138, 1263, 1335, 1412, 1454, 1516, 1584, 1666, 1802, 1895, 1952, 2041, 2151, 2236, 2336, 2436, 2499, 2537, 2635, 2700, 2791, 2877, 2967, 3039, 3101, 3185, 3245, 3328, 3412, 3499, 3601, 3700, 3783, 3856, 3938, 3996, 4055, 4144, 4207, 4241, 4317, 4374, 4433, 4494, 4575]}
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
