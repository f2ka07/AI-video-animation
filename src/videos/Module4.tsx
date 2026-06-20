import React from "react";
import { Sequence, useVideoConfig, Audio, staticFile } from "remotion";
import { getAudioDuration } from "../utils/audioDuration";
import { Module04Intro, Module04Diagram1, Module04Diagram2, Module04Diagram3, Module04Recap } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module04";

// Auto-generated from course scene components - DO NOT EDIT MANUALLY
// Course: agentic-ai-for-beginners, Module: 4
export const Module4: React.FC = () => {
	const { fps } = useVideoConfig();

	const audioFiles = {
		"module4-module-4-application": staticFile("audio/agentic-ai-for-beginners/module4-module-4-application.wav"),
		"module4-module-4-architecture": staticFile("audio/agentic-ai-for-beginners/module4-module-4-architecture.wav"),
		"module4-module-4-concept": staticFile("audio/agentic-ai-for-beginners/module4-module-4-concept.wav"),
		"module4-module-4-exam-mapping": staticFile("audio/agentic-ai-for-beginners/module4-module-4-exam-mapping.wav"),
		"module4-module-4-recap": staticFile("audio/agentic-ai-for-beginners/module4-module-4-recap.wav"),
		"module4-module-4-title": staticFile("audio/agentic-ai-for-beginners/module4-module-4-title.wav"),
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

		{/* Module04Intro */}
		<Sequence
			from={0}
			durationInFrames={1690}
		>
			<Module04Intro
				durationInFrames={1690}
				cuePoints={[4, 56, 145, 195, 293, 341, 417, 466, 523, 604, 670, 770, 874, 903, 966, 1016, 1059, 1123, 1211, 1261, 1338, 1381, 1482, 1524, 1592]}
			/>
			<Audio src={audioFiles["module4-module-4-title"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={1690} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module04Diagram1 */}
		<Sequence
			from={1708}
			durationInFrames={3632}
		>
			<Module04Diagram1
				durationInFrames={3632}
				cuePoints={[1, 75, 163, 269, 301, 376, 434, 516, 610, 713, 787, 879, 953, 1011, 1055, 1105, 1228, 1326, 1376, 1420, 1493, 1547, 1607, 1676, 1761, 1838, 1928, 2012, 2101, 2192, 2243, 2408, 2479, 2549, 2614, 2677, 2763, 2852, 2944, 3058, 3147, 3240, 3299, 3364, 3459, 3554]}
			/>
			<Audio src={audioFiles["module4-module-4-concept"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={5340} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module04Diagram2 */}
		<Sequence
			from={5358}
			durationInFrames={6503}
		>
			<Module04Diagram2
				durationInFrames={6503}
				cuePoints={[0, 41, 117, 190, 266, 341, 438, 496, 578, 638, 725, 790, 870, 922, 994, 1061, 1144, 1182, 1279, 1328, 1403, 1446, 1528, 1566, 1622, 1702, 1813, 1882, 1934, 2008, 2120, 2170, 2254, 2317, 2422, 2524, 2593, 2679, 2780, 2836, 2892, 2941, 2995, 3075, 3133, 3221, 3310, 3358, 3484, 3549, 3624, 3725, 3781, 3870, 3922, 3990, 4080, 4135, 4171, 4279, 4344, 4417, 4488, 4543, 4618, 4747, 4818, 4886, 4972, 5039, 5099, 5170, 5206, 5284, 5338, 5393, 5499, 5603, 5658, 5746, 5845, 5973, 6063, 6116, 6225, 6295, 6350, 6420]}
			/>
			<Audio src={audioFiles["module4-module-4-architecture"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={11861} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module04Diagram3 */}
		<Sequence
			from={11879}
			durationInFrames={3911}
		>
			<Module04Diagram3
				durationInFrames={3911}
				cuePoints={[4, 71, 165, 211, 300, 377, 449, 521, 590, 652, 728, 819, 930, 1053, 1132, 1202, 1278, 1380, 1430, 1504, 1593, 1662, 1761, 1850, 1932, 1975, 2061, 2159, 2226, 2319, 2407, 2459, 2525, 2623, 2749, 2860, 2934, 3018, 3070, 3139, 3227, 3310, 3403, 3473, 3585, 3670, 3714, 3834]}
			/>
			<Audio src={audioFiles["module4-module-4-application"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={15790} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module04Recap - module4-module-4-exam-mapping */}
		<Sequence
			from={15808}
			durationInFrames={2228}
		>
			<Module04Recap
				durationInFrames={2228}
				cuePoints={[2, 66, 125, 216, 266, 357, 426, 497, 545, 625, 702, 772, 834, 906, 987, 1063, 1123, 1188, 1246, 1309, 1393, 1458, 1561, 1653, 1729, 1826, 1937, 2055, 2133, 2172, 2231, 2310, 2378, 2453, 2546, 2677, 2754, 2806, 2877, 2990, 3106, 3215, 3310, 3387, 3450, 3545, 3632, 3760, 3840, 3905, 3960, 4020, 4089, 4164, 4228, 4300]}
			/>
			<Audio src={audioFiles["module4-module-4-exam-mapping"]} />
		</Sequence>

		{/* Module04Recap - module4-module-4-recap */}
		<Sequence
			from={18036}
			durationInFrames={2167}
		>
			<Module04Recap
				durationInFrames={2167}
				cuePoints={[]}
			/>
			<Audio src={audioFiles["module4-module-4-recap"]} />
		</Sequence>
		</div>
	);
};
