import React from "react";
import { Sequence, useVideoConfig, Audio, staticFile } from "remotion";
import { getAudioDuration } from "../utils/audioDuration";
import { Module04Intro } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module04/Module04Intro";
import { Module04Diagram1 } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module04/Module04Diagram1";
import { Module04Diagram2 } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module04/Module04Diagram2";
import { Module04Diagram3 } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module04/Module04Diagram3";
import { Module04Recap } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module04/Module04Recap";

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
			durationInFrames={1675}
		>
			<Module04Intro
				durationInFrames={1675}
				cuePoints={[0, 63, 139, 184, 237, 293, 354]}
			/>
			<Audio src={audioFiles["module4-module-4-title"]} startFrom={0} />
		</Sequence>

		{/* Transition */}
		<Sequence from={1675} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module04Diagram1 */}
		<Sequence
			from={1693}
			durationInFrames={3617}
		>
			<Module04Diagram1
				durationInFrames={3617}
				cuePoints={[0, 8, 24, 79, 164, 256, 316, 383, 467, 535, 625, 721, 795, 895, 968, 1018, 1065, 1132, 1258, 1333, 1383, 1428, 1516, 1557, 1613, 1685, 1785, 1849, 1938, 2025, 2111, 2203, 2307, 2416, 2486, 2557, 2625, 2690, 2774, 2861, 2969, 3071, 3176, 3246, 3307, 3377, 3465, 3571]}
			/>
			<Audio src={audioFiles["module4-module-4-concept"]} startFrom={0} />
		</Sequence>

		{/* Transition */}
		<Sequence from={5310} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module04Diagram2 */}
		<Sequence
			from={5328}
			durationInFrames={6488}
		>
			<Module04Diagram2
				durationInFrames={6488}
				cuePoints={[0, 41, 117, 190, 266, 341, 438, 496, 578, 638, 725, 790, 870, 922, 994, 1061, 1144, 1182, 1279, 1328, 1403, 1446, 1528, 1566, 1622, 1702, 1813, 1882, 1934, 2008, 2120, 2170, 2254, 2317, 2422, 2524, 2593, 2679, 2780, 2836, 2892, 2941, 2995, 3075, 3133, 3221, 3310, 3358, 3484, 3549, 3624, 3725, 3781, 3870, 3922, 3990, 4080, 4135, 4171, 4279, 4344, 4417, 4488, 4543, 4618, 4747, 4818, 4886, 4972, 5039, 5099, 5170, 5206, 5284, 5338, 5393, 5499, 5603, 5658, 5746, 5845, 5973, 6063, 6116, 6225, 6295, 6350, 6420]}
			/>
			<Audio src={audioFiles["module4-module-4-architecture"]} startFrom={0} />
		</Sequence>

		{/* Transition */}
		<Sequence from={11816} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module04Diagram3 */}
		<Sequence
			from={11834}
			durationInFrames={3896}
		>
			<Module04Diagram3
				durationInFrames={3896}
				cuePoints={[98, 177, 232, 403, 481, 538, 598, 671, 736, 793, 1036, 1088, 1120, 1175, 1261, 1756, 1882, 1891, 2660, 2679, 2807, 3001, 3520, 3562, 3564]}
			/>
			<Audio src={audioFiles["module4-module-4-application"]} startFrom={0} />
		</Sequence>

		{/* Transition */}
		<Sequence from={15730} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module04Recap */}
		<Sequence
			from={15748}
			durationInFrames={4348}
		>
			<Module04Recap
				durationInFrames={4348}
				cuePoints={[0, 123, 155, 260, 309, 356, 359, 517, 558, 1479, 1605, 1725, 1867, 1980, 2024, 2178, 2224, 2226, 3041, 3044, 3045, 3157, 3230, 3328, 3396, 3465, 3551, 3642, 3789, 3851, 3905, 3978, 4035, 4090, 4158, 4230, 4303]}
			/>
			<Audio src={audioFiles["module4-module-4-exam-mapping"]} startFrom={0} />
			<Audio src={audioFiles["module4-module-4-recap"]} startFrom={2227} />
		</Sequence>
		</div>
	);
};
