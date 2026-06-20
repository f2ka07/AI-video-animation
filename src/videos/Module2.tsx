import React from "react";
import { Sequence, useVideoConfig, Audio, staticFile } from "remotion";
import { getAudioDuration } from "../utils/audioDuration";
import { Module02Intro, Module02Diagram1, Module02Diagram2, Module02Diagram3, Module02Recap } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module02";

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
				cuePoints={[4, 58, 113, 212, 312, 387, 454, 591, 624, 688, 782, 846, 933, 1006, 1067, 1118, 1182, 1231, 1299, 1339, 1395, 1435, 1501]}
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
				cuePoints={[4, 64, 103, 153, 213, 251, 306, 372, 436, 522, 577, 614, 695, 739, 838, 945, 1006, 1096, 1156, 1237, 1341, 1401, 1455, 1508, 1610, 1650, 1724, 1777, 1857, 1929, 2007]}
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
				cuePoints={[0, 4, 59, 138, 189, 264, 333, 380, 478, 558, 599, 688, 756, 826, 893, 967, 1040, 1090, 1152, 1236, 1299, 1362, 1418, 1494, 1561, 1634, 1701, 1785, 1845, 1920, 2003, 2079, 2149, 2230, 2315, 2386, 2458, 2507, 2571, 2641, 2735, 2824, 2927, 2991, 3059, 3154, 3216, 3295, 3383, 3457, 3539, 3597, 3671, 3751, 3833, 4016, 4104, 4195, 4295, 4383, 4471, 4545, 4632, 4707, 4804, 4856, 4956, 5083, 5209, 5282, 5360, 5473, 5538, 5615, 5690, 5771, 5899, 5960, 6001, 6049, 6128, 6260, 6347, 6419, 6461]}
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
				cuePoints={[2, 72, 127, 222, 289, 342, 425, 505, 576, 643, 714, 762, 845, 943, 1011, 1099, 1150, 1236, 1296, 1388, 1475, 1528, 1595, 1657, 1731, 1850, 1955, 2035, 2109, 2213, 2331, 2385, 2449, 2507, 2560]}
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
				cuePoints={[4, 66, 156, 220, 287, 351, 413, 479, 617, 671, 783, 841, 899, 970, 1048, 1097, 1127, 1211, 1297, 1380, 1484, 1580, 1660, 1770, 1873, 1975, 2072, 2092, 2178, 2216, 2259, 2323, 2428, 2496, 2534, 2587, 2680, 2836, 2885, 2983, 3078, 3144, 3228, 3302, 3403, 3477, 3560, 3661, 3756, 3831, 3895, 3979]}
			/>
			<Audio src={audioFiles["module2-module-2-exam-mapping"]} />
		</Sequence>

		{/* Module02Recap - module2-module-2-recap */}
		<Sequence
			from={14923}
			durationInFrames={1998}
		>
			<Module02Recap
				durationInFrames={1998}
				cuePoints={[]}
			/>
			<Audio src={audioFiles["module2-module-2-recap"]} />
		</Sequence>
		</div>
	);
};
