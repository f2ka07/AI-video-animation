import React from "react";
import { Sequence, useVideoConfig, Audio, staticFile } from "remotion";
import { getAudioDuration } from "../utils/audioDuration";
import { Module11Intro } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module11/Module11Intro";
import { Module11Diagram1 } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module11/Module11Diagram1";
import { Module11Diagram2 } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module11/Module11Diagram2";
import { Module11Diagram3 } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module11/Module11Diagram3";
import { Module11Recap } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module11/Module11Recap";

// Auto-generated from course scene components - DO NOT EDIT MANUALLY
// Course: agentic-ai-for-beginners, Module: 11
export const Module11: React.FC = () => {
	const { fps } = useVideoConfig();

	const audioFiles = {
		"module11-module-11-application": staticFile("audio/agentic-ai-for-beginners/module11-module-11-application.wav"),
		"module11-module-11-architecture": staticFile("audio/agentic-ai-for-beginners/module11-module-11-architecture.wav"),
		"module11-module-11-concept": staticFile("audio/agentic-ai-for-beginners/module11-module-11-concept.wav"),
		"module11-module-11-exam-mapping": staticFile("audio/agentic-ai-for-beginners/module11-module-11-exam-mapping.wav"),
		"module11-module-11-recap": staticFile("audio/agentic-ai-for-beginners/module11-module-11-recap.wav"),
		"module11-module-11-title": staticFile("audio/agentic-ai-for-beginners/module11-module-11-title.wav"),
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

		{/* Module11Intro */}
		<Sequence
			from={0}
			durationInFrames={824}
		>
			<Module11Intro
				durationInFrames={824}
				cuePoints={[4, 58, 135, 183, 237, 258, 328, 379, 433, 517, 636, 713, 780]}
			/>
			<Audio src={audioFiles["module11-module-11-title"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={824} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module11Diagram1 */}
		<Sequence
			from={842}
			durationInFrames={2161}
		>
			<Module11Diagram1
				durationInFrames={2161}
				cuePoints={[4, 36, 104, 135, 185, 264, 304, 402, 458, 597, 681, 753, 860, 906, 978, 1044, 1109, 1198, 1276, 1307, 1394, 1472, 1546, 1630, 1697, 1770, 1857, 1913, 1973, 2034, 2100]}
			/>
			<Audio src={audioFiles["module11-module-11-concept"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={3003} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module11Diagram2 */}
		<Sequence
			from={3021}
			durationInFrames={2498}
		>
			<Module11Diagram2
				durationInFrames={2498}
				cuePoints={[0, 4, 56, 138, 216, 346, 423, 488, 576, 662, 762, 837, 912, 968, 1031, 1095, 1153, 1229, 1286, 1488, 1560, 1640, 1724, 1797, 1879, 1944, 2016, 2105, 2154, 2202, 2264, 2332, 2420]}
			/>
			<Audio src={audioFiles["module11-module-11-architecture"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={5519} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module11Diagram3 */}
		<Sequence
			from={5537}
			durationInFrames={2998}
		>
			<Module11Diagram3
				durationInFrames={2998}
				cuePoints={[0, 2, 46, 147, 196, 274, 346, 413, 522, 602, 687, 772, 849, 934, 1036, 1106, 1212, 1287, 1406, 1483, 1567, 1632, 1717, 1809, 1874, 1955, 2000, 2083, 2178, 2247, 2328, 2392, 2452, 2545, 2613, 2653, 2733]}
			/>
			<Audio src={audioFiles["module11-module-11-application"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={8535} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module11Recap - module11-module-11-exam-mapping */}
		<Sequence
			from={8553}
			durationInFrames={810}
		>
			<Module11Recap
				durationInFrames={810}
				cuePoints={[1, 45, 154, 249, 376, 521, 613, 665, 747, 814, 940, 1042, 1112, 1222, 1292, 1367, 1429, 1513, 1595, 1644]}
			/>
			<Audio src={audioFiles["module11-module-11-exam-mapping"]} />
		</Sequence>

		{/* Module11Recap - module11-module-11-recap */}
		<Sequence
			from={9363}
			durationInFrames={894}
		>
			<Module11Recap
				durationInFrames={894}
				cuePoints={[]}
			/>
			<Audio src={audioFiles["module11-module-11-recap"]} />
		</Sequence>
		</div>
	);
};
