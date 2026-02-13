import React from "react";
import { Sequence, useVideoConfig, Audio, staticFile } from "remotion";
import { getAudioDuration } from "../utils/audioDuration";
import { Module06Intro } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module06/Module06Intro";
import { Module06Diagram1 } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module06/Module06Diagram1";
import { Module06Diagram2 } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module06/Module06Diagram2";
import { Module06Diagram3 } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module06/Module06Diagram3";
import { Module06Recap } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module06/Module06Recap";

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
				cuePoints={[0, 20, 879, 899, 1013, 1112, 1163, 1339]}
			/>
			<Audio src={audioFiles["module6-module-6-title"]} startFrom={0} />
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
			<Audio src={audioFiles["module6-module-6-concept"]} startFrom={0} />
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
				cuePoints={[0, 207, 461, 493, 634, 681, 828, 946, 1026, 1071, 1081, 1422, 1510, 1652, 1684, 1737, 1847, 2052, 2208, 2339, 2530, 2552, 2751, 2812, 2905, 3033, 3255, 3309, 3612, 4311, 4319, 4355, 5184, 5216, 5242]}
			/>
			<Audio src={audioFiles["module6-module-6-architecture"]} startFrom={0} />
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
				cuePoints={[328, 769, 3599, 3628, 3742, 3834, 3915, 3977, 4034, 4096, 4150, 4226, 4304, 4364]}
			/>
			<Audio src={audioFiles["module6-module-6-application"]} startFrom={0} />
		</Sequence>

		{/* Transition */}
		<Sequence from={14211} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module06Recap */}
		<Sequence
			from={14229}
			durationInFrames={4749}
		>
			<Module06Recap
				durationInFrames={4749}
				cuePoints={[0, 9, 12, 88, 165, 253, 334, 412, 490, 577, 652, 757, 802, 864, 998, 1101, 1171, 1247, 1351, 1410, 1553, 1624, 1698, 1772, 1864, 1953, 2025, 2107, 2181, 2272, 2308, 2388, 2454, 2529, 2603, 2762, 2897, 2978, 3085, 3177, 3246, 3340, 3439, 3570, 3666, 3711, 3832, 3935, 4014, 4082, 4145, 4211, 4269, 4329, 4410, 4481, 4533, 4605, 4656, 4711]}
			/>
			<Audio src={audioFiles["module6-module-6-exam-mapping"]} startFrom={0} />
			<Audio src={audioFiles["module6-module-6-recap"]} startFrom={2308} />
		</Sequence>
		</div>
	);
};
