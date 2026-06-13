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
				cuePoints={[1, 85, 153, 278, 332, 400, 460, 513, 601, 639, 692, 773, 832, 885, 928, 1007, 1069, 1161, 1253, 1313, 1434, 1489, 1602, 1682]}
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
				cuePoints={[0, 4, 42, 113, 183, 253, 297, 386, 462, 552, 622, 685, 764, 829, 903, 978, 1036, 1122, 1195, 1263, 1351, 1421, 1513, 1596, 1655, 1737, 1791, 1877, 1958, 2022, 2121, 2213, 2264, 2326, 2408, 2483, 2536, 2671, 2767, 2823, 2869, 2940, 3017, 3113, 3178, 3309, 3370, 3417, 3475, 3547, 3623, 3696, 3750, 3827, 3928, 4024, 4129, 4353, 4439, 4527, 4595, 4655, 4731, 4786, 4834, 4907, 5004, 5090, 5159, 5284, 5347, 5424, 5513, 5612, 5676, 5730, 5822, 5875, 5914, 5995, 6100, 6201, 6281, 6365, 6443, 6519, 6571, 6636, 6716, 6797, 6833, 6893, 6959, 7022, 7124, 7213, 7300, 7372, 7441, 7540, 7619]}
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
				cuePoints={[4, 44, 132, 231, 316, 374, 472, 537, 614, 675, 740, 847, 914, 1003, 1077, 1171, 1250, 1314, 1369, 1449, 1524, 1608, 1669, 1775, 1854, 1920, 1993, 2074, 2120, 2210, 2274, 2349, 2385, 2459, 2517, 2584, 2710, 2755, 2827, 2911, 2961]}
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
			durationInFrames={2229}
		>
			<Module03Recap
				durationInFrames={2229}
				cuePoints={[4, 61, 113, 181, 241, 293, 374, 426, 475, 527, 626, 695, 767, 824, 901, 972, 1063, 1206, 1320, 1422, 1519, 1591, 1662, 1767, 1854, 1943, 2036, 2064, 2143, 2232, 2291, 2344, 2400, 2484, 2544, 2582, 2639, 2690, 2773, 2876, 2934, 2988, 3036, 3116, 3191, 3271, 3338, 3408, 3491, 3598, 3657, 3725, 3787, 3858, 3914, 3961, 4057]}
			/>
			<Audio src={audioFiles["module3-module-3-exam-mapping"]} />
		</Sequence>

		{/* Module03Recap - module3-module-3-recap */}
		<Sequence
			from={16984}
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
