import React from "react";
import { Sequence, useVideoConfig, Audio, staticFile } from "remotion";
import { getAudioDuration } from "../utils/audioDuration";
import { Module08Intro } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module08/Module08Intro";
import { Module08Diagram1 } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module08/Module08Diagram1";
import { Module08Diagram2 } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module08/Module08Diagram2";
import { Module08Diagram3 } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module08/Module08Diagram3";
import { Module08Recap } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module08/Module08Recap";

// Auto-generated from course scene components - DO NOT EDIT MANUALLY
// Course: agentic-ai-for-beginners, Module: 8
export const Module8: React.FC = () => {
	const { fps } = useVideoConfig();

	const audioFiles = {
		"module8-module-8-application": staticFile("audio/agentic-ai-for-beginners/module8-module-8-application.wav"),
		"module8-module-8-architecture": staticFile("audio/agentic-ai-for-beginners/module8-module-8-architecture.wav"),
		"module8-module-8-concept": staticFile("audio/agentic-ai-for-beginners/module8-module-8-concept.wav"),
		"module8-module-8-exam-mapping": staticFile("audio/agentic-ai-for-beginners/module8-module-8-exam-mapping.wav"),
		"module8-module-8-recap": staticFile("audio/agentic-ai-for-beginners/module8-module-8-recap.wav"),
		"module8-module-8-title": staticFile("audio/agentic-ai-for-beginners/module8-module-8-title.wav"),
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

		{/* Module08Intro */}
		<Sequence
			from={0}
			durationInFrames={840}
		>
			<Module08Intro
				durationInFrames={840}
				cuePoints={[3, 58, 99, 175, 237, 315, 391, 439, 507, 562, 626, 719, 777]}
			/>
			<Audio src={audioFiles["module8-module-8-title"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={840} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module08Diagram1 */}
		<Sequence
			from={858}
			durationInFrames={2310}
		>
			<Module08Diagram1
				durationInFrames={2310}
				cuePoints={[4, 46, 105, 151, 206, 251, 375, 447, 570, 632, 701, 768, 828, 905, 987, 1074, 1117, 1186, 1274, 1337, 1391, 1445, 1497, 1542, 1604, 1705, 1783, 1833, 1905, 1975, 2057, 2121, 2229]}
			/>
			<Audio src={audioFiles["module8-module-8-concept"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={3168} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module08Diagram2 */}
		<Sequence
			from={3186}
			durationInFrames={3206}
		>
			<Module08Diagram2
				durationInFrames={3206}
				cuePoints={[1, 50, 138, 193, 268, 345, 451, 520, 576, 675, 734, 818, 865, 930, 995, 1069, 1151, 1213, 1292, 1346, 1435, 1478, 1539, 1604, 1682, 1751, 1811, 1876, 1955, 2028, 2070, 2157, 2217, 2294, 2410, 2470, 2571, 2623, 2718, 2784, 2834, 2930, 3013, 3105]}
			/>
			<Audio src={audioFiles["module8-module-8-architecture"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={6392} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module08Diagram3 */}
		<Sequence
			from={6410}
			durationInFrames={2436}
		>
			<Module08Diagram3
				durationInFrames={2436}
				cuePoints={[1, 45, 128, 189, 266, 363, 417, 485, 584, 621, 705, 787, 880, 974, 1033, 1093, 1172, 1232, 1282, 1352, 1445, 1528, 1608, 1684, 1761, 1837, 1889, 1930, 2005, 2080, 2129, 2225, 2307]}
			/>
			<Audio src={audioFiles["module8-module-8-application"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={8846} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module08Recap - module8-module-8-exam-mapping */}
		<Sequence
			from={8864}
			durationInFrames={1035}
		>
			<Module08Recap
				durationInFrames={1035}
				cuePoints={[4, 69, 151, 242, 350, 427, 523, 612, 683, 726, 824, 897, 989, 1038, 1130, 1251, 1361, 1430, 1520, 1610, 1730, 1840, 1929, 1994, 2047]}
			/>
			<Audio src={audioFiles["module8-module-8-exam-mapping"]} />
		</Sequence>

		{/* Module08Recap - module8-module-8-recap */}
		<Sequence
			from={9899}
			durationInFrames={1065}
		>
			<Module08Recap
				durationInFrames={1065}
				cuePoints={[]}
			/>
			<Audio src={audioFiles["module8-module-8-recap"]} />
		</Sequence>
		</div>
	);
};
