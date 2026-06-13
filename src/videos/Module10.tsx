import React from "react";
import { Sequence, useVideoConfig, Audio, staticFile } from "remotion";
import { getAudioDuration } from "../utils/audioDuration";
import { Module10Intro } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module10/Module10Intro";
import { Module10Diagram1 } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module10/Module10Diagram1";
import { Module10Diagram2 } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module10/Module10Diagram2";
import { Module10Diagram3 } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module10/Module10Diagram3";
import { Module10Recap } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module10/Module10Recap";

// Auto-generated from course scene components - DO NOT EDIT MANUALLY
// Course: agentic-ai-for-beginners, Module: 10
export const Module10: React.FC = () => {
	const { fps } = useVideoConfig();

	const audioFiles = {
		"module10-module-10-application": staticFile("audio/agentic-ai-for-beginners/module10-module-10-application.wav"),
		"module10-module-10-architecture": staticFile("audio/agentic-ai-for-beginners/module10-module-10-architecture.wav"),
		"module10-module-10-concept": staticFile("audio/agentic-ai-for-beginners/module10-module-10-concept.wav"),
		"module10-module-10-exam-mapping": staticFile("audio/agentic-ai-for-beginners/module10-module-10-exam-mapping.wav"),
		"module10-module-10-recap": staticFile("audio/agentic-ai-for-beginners/module10-module-10-recap.wav"),
		"module10-module-10-title": staticFile("audio/agentic-ai-for-beginners/module10-module-10-title.wav"),
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

		{/* Module10Intro */}
		<Sequence
			from={0}
			durationInFrames={1076}
		>
			<Module10Intro
				durationInFrames={1076}
				cuePoints={[1, 53, 166, 264, 300, 360, 431, 477, 548, 615, 683, 750, 833, 898, 979]}
			/>
			<Audio src={audioFiles["module10-module-10-title"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={1076} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module10Diagram1 */}
		<Sequence
			from={1094}
			durationInFrames={3173}
		>
			<Module10Diagram1
				durationInFrames={3173}
				cuePoints={[0, 4, 72, 156, 228, 302, 356, 416, 495, 552, 617, 696, 745, 926, 1039, 1146, 1195, 1330, 1409, 1484, 1565, 1673, 1737, 1781, 1846, 1903, 2000, 2085, 2171, 2231, 2292, 2375, 2450, 2512, 2619, 2677, 2749, 2811, 2870, 2955, 3017, 3120]}
			/>
			<Audio src={audioFiles["module10-module-10-concept"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={4267} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module10Diagram2 */}
		<Sequence
			from={4285}
			durationInFrames={2608}
		>
			<Module10Diagram2
				durationInFrames={2608}
				cuePoints={[4, 44, 143, 185, 229, 301, 385, 474, 540, 616, 706, 761, 810, 872, 932, 1020, 1079, 1152, 1205, 1309, 1375, 1443, 1508, 1543, 1608, 1661, 1728, 1815, 1874, 1930, 1986, 2047, 2108, 2163, 2252, 2336, 2376, 2438, 2503, 2572]}
			/>
			<Audio src={audioFiles["module10-module-10-architecture"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={6893} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module10Diagram3 */}
		<Sequence
			from={6911}
			durationInFrames={2377}
		>
			<Module10Diagram3
				durationInFrames={2377}
				cuePoints={[3, 27, 81, 155, 211, 301, 365, 425, 485, 594, 680, 772, 872, 954, 1018, 1114, 1169, 1233, 1327, 1413, 1479, 1556, 1625, 1671, 1722, 1767, 1832, 1894, 1963, 2044, 2082, 2130, 2195, 2296]}
			/>
			<Audio src={audioFiles["module10-module-10-application"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={9288} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module10Recap - module10-module-10-exam-mapping */}
		<Sequence
			from={9306}
			durationInFrames={983}
		>
			<Module10Recap
				durationInFrames={983}
				cuePoints={[4, 60, 115, 162, 259, 388, 524, 616, 740, 774, 837, 904, 963, 987, 1106, 1230, 1328, 1430, 1521, 1605, 1681, 1738, 1782, 1864, 1916, 2026, 2103, 2166]}
			/>
			<Audio src={audioFiles["module10-module-10-exam-mapping"]} />
		</Sequence>

		{/* Module10Recap - module10-module-10-recap */}
		<Sequence
			from={10289}
			durationInFrames={1217}
		>
			<Module10Recap
				durationInFrames={1217}
				cuePoints={[]}
			/>
			<Audio src={audioFiles["module10-module-10-recap"]} />
		</Sequence>
		</div>
	);
};
