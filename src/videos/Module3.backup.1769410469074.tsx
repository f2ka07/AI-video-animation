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
				cuePoints={[0, 345, 386, 387]}
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
				cuePoints={[0, 40, 139, 181, 241, 274, 401, 491, 621, 634, 766, 973, 1096, 1733, 1761, 7305, 7404, 7473]}
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
				cuePoints={[0, 140, 219, 260, 266, 588, 646, 683, 710, 912, 1002, 1078, 1174, 1249, 1311, 1369, 1438, 1502, 1573, 1662, 1733, 1843, 1895, 1977, 2058, 2113, 2187, 2270, 2334, 2375, 2438, 2502, 2570, 2673, 2740, 2807, 2909, 2959, 3000]}
			/>
			<Audio src={audioFiles["module3-module-3-application"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={14737} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module03Recap */}
		<Sequence
			from={14755}
			durationInFrames={4115}
		>
			<Module03Recap
				durationInFrames={4115}
				cuePoints={[123, 170, 172, 176, 336, 423, 492, 493, 495, 685, 697, 796, 891, 926, 1068, 1317, 1466, 1527, 1530, 1731, 1849, 1874, 1920, 1989, 2049, 2101, 2181, 2227, 2353, 3074, 3671, 3827, 3841, 3970, 4072]}
			/>
		</Sequence>

		{/* Audio: module3-module-3-exam-mapping */}
		<Sequence
			from={14755}
			durationInFrames={2228}
		>
			<Audio src={audioFiles["module3-module-3-exam-mapping"]} />
		</Sequence>

		{/* Audio: module3-module-3-recap */}
		<Sequence
			from={16983}
			durationInFrames={1872}
		>
			<Audio src={audioFiles["module3-module-3-recap"]} />
		</Sequence>
		</div>
	);
};
