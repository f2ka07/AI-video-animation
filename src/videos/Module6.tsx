import React from "react";
import { Sequence, useVideoConfig, Audio, staticFile } from "remotion";
import { getAudioDuration } from "../utils/audioDuration";
import { Module06Intro, Module06Diagram1, Module06Diagram2, Module06Diagram3, Module06Recap } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module06";

// Auto-generated from course scene components - DO NOT EDIT MANUALLY
// Course: agentic-ai-for-beginners, Module: 6
export const Module6: React.FC = () => {
	const { fps } = useVideoConfig();

	const audioFiles = {
		"module6-module-6-application": staticFile("audio/agentic-ai-for-beginners/module6-module-6-application.wav"),
		"module6-module-6-architecture": staticFile("audio/agentic-ai-for-beginners/module6-module-6-architecture.wav"),
		"module6-module-6-concept": staticFile("audio/agentic-ai-for-beginners/module6-module-6-concept.wav"),
		"module6-module-6-exam-mapping": staticFile("audio/agentic-ai-for-beginners/module6-module-6-exam-mapping.wav"),
		"module6-module-6-recap": staticFile("audio/agentic-ai-for-beginners/module6-module-6-recap.wav"),
		"module6-module-6-title": staticFile("audio/agentic-ai-for-beginners/module6-module-6-title.wav"),
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

		{/* Module06Intro */}
		<Sequence
			from={0}
			durationInFrames={1703}
		>
			<Module06Intro
				durationInFrames={1703}
				cuePoints={[3, 69, 169, 272, 317, 398, 463, 528, 626, 714, 770, 867, 916, 980, 1052, 1121, 1171, 1225, 1281, 1340, 1396, 1470, 1505, 1595, 1651]}
			/>
			<Audio src={audioFiles["module6-module-6-title"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={1703} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module06Diagram1 */}
		<Sequence
			from={1721}
			durationInFrames={2678}
		>
			<Module06Diagram1
				durationInFrames={2678}
				cuePoints={[0, 46, 122, 210, 271, 345, 428, 498, 585, 679, 769, 879, 947, 1065, 1157, 1267, 1391, 1483, 1587, 1642, 1712, 1811, 1913, 2005, 2050, 2123, 2221, 2296, 2350, 2424, 2485, 2555, 2605]}
			/>
			<Audio src={audioFiles["module6-module-6-concept"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={4399} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module06Diagram2 */}
		<Sequence
			from={4417}
			durationInFrames={5346}
		>
			<Module06Diagram2
				durationInFrames={5346}
				cuePoints={[4, 33, 102, 172, 276, 360, 445, 520, 581, 645, 723, 797, 874, 947, 1022, 1098, 1234, 1310, 1391, 1503, 1609, 1662, 1733, 1837, 1914, 1974, 2064, 2192, 2291, 2394, 2455, 2510, 2579, 2681, 2776, 2841, 2917, 3060, 3121, 3233, 3296, 3396, 3492, 3584, 3644, 3722, 3822, 3883, 3954, 4048, 4139, 4220, 4298, 4348, 4476, 4574, 4640, 4707, 4794, 4869, 4941, 5010, 5096, 5175, 5245, 5307]}
			/>
			<Audio src={audioFiles["module6-module-6-architecture"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={9763} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module06Diagram3 */}
		<Sequence
			from={9781}
			durationInFrames={4430}
		>
			<Module06Diagram3
				durationInFrames={4430}
				cuePoints={[0, 4, 84, 158, 229, 347, 453, 498, 576, 633, 675, 761, 838, 943, 1036, 1152, 1221, 1272, 1374, 1442, 1510, 1596, 1687, 1762, 1834, 1899, 2040, 2120, 2211, 2312, 2491, 2635, 2710, 2784, 2842, 2897, 2975, 3035, 3107, 3192, 3282, 3359, 3421, 3508, 3587, 3693, 3800, 3878, 3958, 4015, 4082, 4140, 4206, 4275, 4336]}
			/>
			<Audio src={audioFiles["module6-module-6-application"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={14211} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module06Recap - module6-module-6-exam-mapping */}
		<Sequence
			from={14229}
			durationInFrames={2309}
		>
			<Module06Recap
				durationInFrames={2309}
				cuePoints={[3, 63, 135, 213, 312, 381, 459, 531, 633, 705, 774, 826, 931, 1085, 1146, 1205, 1325, 1391, 1480, 1593, 1652, 1742, 1802, 1905, 1999, 2070, 2149, 2244, 2308, 2388, 2454, 2529, 2604, 2763, 2897, 2978, 3086, 3177, 3246, 3341, 3440, 3570, 3666, 3711, 3832, 3935, 4014, 4083, 4146, 4211, 4269, 4329, 4410, 4481, 4533, 4605, 4656, 4711]}
			/>
			<Audio src={audioFiles["module6-module-6-exam-mapping"]} />
		</Sequence>

		{/* Module06Recap - module6-module-6-recap */}
		<Sequence
			from={16538}
			durationInFrames={2471}
		>
			<Module06Recap
				durationInFrames={2471}
				cuePoints={[]}
			/>
			<Audio src={audioFiles["module6-module-6-recap"]} />
		</Sequence>
		</div>
	);
};
