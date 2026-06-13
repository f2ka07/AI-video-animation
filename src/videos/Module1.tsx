import React from "react";
import { Sequence, useVideoConfig, Audio, staticFile } from "remotion";
import { getAudioDuration } from "../utils/audioDuration";
import { Module01Intro } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module01/Module01Intro";
import { Module01Diagram1 } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module01/Module01Diagram1";
import { Module01Diagram2 } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module01/Module01Diagram2";
import { Module01Diagram3 } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module01/Module01Diagram3";
import { Module01Recap } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module01/Module01Recap";

// Auto-generated from course scene components - DO NOT EDIT MANUALLY
// Course: agentic-ai-for-beginners, Module: 1
export const Module1: React.FC = () => {
	const { fps } = useVideoConfig();

	const audioFiles = {
		"module1-module-1-application": staticFile("audio/agentic-ai-for-beginners/module1-module-1-application.wav"),
		"module1-module-1-architecture": staticFile("audio/agentic-ai-for-beginners/module1-module-1-architecture.wav"),
		"module1-module-1-concept": staticFile("audio/agentic-ai-for-beginners/module1-module-1-concept.wav"),
		"module1-module-1-exam-mapping": staticFile("audio/agentic-ai-for-beginners/module1-module-1-exam-mapping.wav"),
		"module1-module-1-recap": staticFile("audio/agentic-ai-for-beginners/module1-module-1-recap.wav"),
		"module1-module-1-title": staticFile("audio/agentic-ai-for-beginners/module1-module-1-title.wav"),
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

		{/* Module01Intro */}
		<Sequence
			from={0}
			durationInFrames={1302}
		>
			<Module01Intro
				durationInFrames={1302}
				cuePoints={[4, 51, 83, 139, 200, 269, 331, 376, 487, 560, 629, 712, 763, 840, 888, 950, 1029, 1077, 1116, 1163, 1218]}
			/>
			<Audio src={audioFiles["module1-module-1-title"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={1302} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module01Diagram1 */}
		<Sequence
			from={1320}
			durationInFrames={2987}
		>
			<Module01Diagram1
				durationInFrames={2987}
				cuePoints={[2, 52, 119, 188, 245, 291, 362, 456, 528, 629, 703, 815, 890, 974, 1055, 1122, 1192, 1243, 1325, 1388, 1449, 1500, 1602, 1657, 1758, 1826, 1892, 1968, 2051, 2143, 2234, 2311, 2403, 2480, 2593, 2686, 2777, 2859]}
			/>
			<Audio src={audioFiles["module1-module-1-concept"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={4307} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module01Diagram2 */}
		<Sequence
			from={4325}
			durationInFrames={3540}
		>
			<Module01Diagram2
				durationInFrames={3540}
				cuePoints={[128, 171, 174, 176, 179, 213, 241, 389, 556, 601, 646, 691, 853, 1002, 1016, 1096, 1141, 1401, 1733, 1734, 1755, 1791, 1808, 1900, 2002, 2143, 2233, 2312, 2385, 2447, 2518, 2589, 2659, 2718, 2814, 2896, 2960, 3027, 3090, 3207, 3264, 3341, 3403, 3465]}
			/>
			<Audio src={audioFiles["module1-module-1-architecture"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={7865} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module01Diagram3 */}
		<Sequence
			from={7883}
			durationInFrames={2510}
		>
			<Module01Diagram3
				durationInFrames={2510}
				cuePoints={[0, 77, 120, 162, 165, 166, 195, 238, 240, 347, 390, 490, 561, 571, 658, 878, 1254, 1403, 1426, 1577, 1681, 1789, 1896, 1965, 2035, 2105, 2163, 2259, 2330, 2416]}
			/>
			<Audio src={audioFiles["module1-module-1-application"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={10393} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module01Recap - module1-module-1-exam-mapping */}
		<Sequence
			from={10411}
			durationInFrames={1349}
		>
			<Module01Recap
				durationInFrames={1349}
				cuePoints={[4, 40, 125, 193, 247, 315, 420, 456, 537, 622, 698, 779, 861, 921, 993, 1094, 1171, 1228, 1268, 2205, 2216, 2226, 2237, 2247, 2292, 2337, 2382, 2427, 2472, 2517, 2562, 2607, 2652, 2697, 2742, 2787, 2832, 2877, 2922, 2967, 3012, 3057, 3102]}
			/>
			<Audio src={audioFiles["module1-module-1-exam-mapping"]} />
		</Sequence>

		{/* Module01Recap - module1-module-1-recap */}
		<Sequence
			from={11760}
			durationInFrames={1716}
		>
			<Module01Recap
				durationInFrames={1716}
				cuePoints={[]}
			/>
			<Audio src={audioFiles["module1-module-1-recap"]} />
		</Sequence>
		</div>
	);
};
