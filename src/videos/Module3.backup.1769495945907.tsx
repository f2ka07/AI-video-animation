import React from "react";
import { Sequence, useVideoConfig, Audio, staticFile } from "remotion";
import { getAudioDuration } from "../utils/audioDuration";
import { Module03Intro } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module03/Module03Intro";
import { Module03Diagram1 } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module03/Module03Diagram1";
import { Module03Diagram2 } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module03/Module03Diagram2";
import { Module03Diagram3 } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module03/Module03Diagram3";
import { Module03Recap } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module03/Module03Recap";

// Auto-generated from course scene components - DO NOT EDIT MANUALLY
// Course: agentic-ai-for-beginners, Module: 3
export const Module3: React.FC = () => {
	const { fps } = useVideoConfig();

	const audioFiles = {
		"module3-module-3-application": staticFile("audio/agentic-ai-for-beginners/module3-module-3-application.wav"),
		"module3-module-3-architecture": staticFile("audio/agentic-ai-for-beginners/module3-module-3-architecture.wav"),
		"module3-module-3-concept": staticFile("audio/agentic-ai-for-beginners/module3-module-3-concept.wav"),
		"module3-module-3-exam-mapping": staticFile("audio/agentic-ai-for-beginners/module3-module-3-exam-mapping.wav"),
		"module3-module-3-recap": staticFile("audio/agentic-ai-for-beginners/module3-module-3-recap.wav"),
		"module3-module-3-title": staticFile("audio/agentic-ai-for-beginners/module3-module-3-title.wav"),
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

		{/* Module03Intro */}
		<Sequence
			from={0}
			durationInFrames={1734}
		>
			<Module03Intro
				durationInFrames={1734}
				cuePoints={[0, 19, 36, 74, 303, 345, 386, 387]}
			/>
			<Audio src={audioFiles["module3-module-3-title"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={1734} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module03Diagram1 */}
		<Sequence
			from={1752}
			durationInFrames={2238}
		>
			<Module03Diagram1
				durationInFrames={2238}
				cuePoints={[0, 52, 115, 184, 252, 295, 354, 442, 511, 570, 620, 677, 748, 837, 910, 946, 1035, 1105, 1177, 1240, 1302, 1375, 1454, 1508, 1589, 1655, 1726, 1772, 1814, 1877, 1931, 2035, 2092, 2175]}
			/>
			<Audio src={audioFiles["module3-module-3-concept"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={3990} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module03Diagram2 */}
		<Sequence
			from={4008}
			durationInFrames={7672}
		>
			<Module03Diagram2
				durationInFrames={7672}
				cuePoints={[0, 40, 56, 107, 139, 181, 241, 274, 369, 390, 401, 439, 454, 491, 516, 557, 608, 621, 634, 656, 688, 766, 808, 828, 973, 1015, 1026, 1096, 1733, 1741, 1761, 1818, 7263, 7305, 7322, 7347, 7404, 7409, 7425, 7456, 7473, 7610]}
			/>
			<Audio src={audioFiles["module3-module-3-architecture"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={11680} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module03Diagram3 */}
		<Sequence
			from={11698}
			durationInFrames={3039}
		>
			<Module03Diagram3
				durationInFrames={3039}
				cuePoints={[0, 75, 140, 260, 266, 587, 588, 683, 699, 851, 951, 1030, 1122, 1206, 1263, 1327, 1417, 1459, 1551, 1620, 1712, 1783, 1865, 1933, 2004, 2080, 2148, 2216, 2284, 2354, 2406, 2466, 2548, 2616, 2728, 2772, 2839, 2920, 2971]}
			/>
			<Audio src={audioFiles["module3-module-3-application"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={14737} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module03Recap - module3-module-3-exam-mapping */}
		<Sequence
			from={14755}
			durationInFrames={2228}
		>
			<Module03Recap
				durationInFrames={2228}
				cuePoints={[123, 169, 170, 172, 176, 347, 446, 493, 495, 685, 697, 796, 891, 995, 1203, 1317, 1466, 1527, 1618, 1771, 1849, 1878, 1920, 2029, 2083, 2117, 2200, 2227, 2287, 2296, 2318, 2353, 3053, 3074, 3075, 3671, 3791, 3822, 3825, 3827, 3829, 3832, 3841, 3844, 3847, 3972, 4020, 4051, 4076, 4086]}
			/>
			<Audio src={audioFiles["module3-module-3-exam-mapping"]} />
		</Sequence>

		{/* Module03Recap - module3-module-3-recap */}
		<Sequence
			from={16983}
			durationInFrames={1872}
		>
			<Module03Recap
				durationInFrames={1872}
				cuePoints={[]}
			/>
			<Audio src={audioFiles["module3-module-3-recap"]} />
		</Sequence>
		</div>
	);
};
