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
		"module1-module-1-title-part01": staticFile("audio/agentic-ai-for-beginners/module1-module-1-title-part01.wav"),
		"module1-module-1-title-part02": staticFile("audio/agentic-ai-for-beginners/module1-module-1-title-part02.wav"),
		"module1-module-1-title-part03": staticFile("audio/agentic-ai-for-beginners/module1-module-1-title-part03.wav"),
		"module1-module-1-title-part04": staticFile("audio/agentic-ai-for-beginners/module1-module-1-title-part04.wav"),
		"module1-module-1-title-part05": staticFile("audio/agentic-ai-for-beginners/module1-module-1-title-part05.wav"),
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

		{/* Module01Intro - module1-module-1-title */}
		<Sequence
			from={0}
			durationInFrames={1286}
		>
			<Module01Intro
				durationInFrames={1286}
				cuePoints={[0, 214, 251, 568, 603]}
			/>
			<Audio src={audioFiles["module1-module-1-title"]} />
		</Sequence>

		{/* Module01Intro - module1-module-1-title-part01 */}
		<Sequence
			from={1286}
			durationInFrames={300}
		>
			<Module01Intro
				durationInFrames={300}
				cuePoints={[]}
			/>
			<Audio src={audioFiles["module1-module-1-title-part01"]} />
		</Sequence>

		{/* Module01Intro - module1-module-1-title-part02 */}
		<Sequence
			from={1586}
			durationInFrames={300}
		>
			<Module01Intro
				durationInFrames={300}
				cuePoints={[]}
			/>
			<Audio src={audioFiles["module1-module-1-title-part02"]} />
		</Sequence>

		{/* Module01Intro - module1-module-1-title-part03 */}
		<Sequence
			from={1886}
			durationInFrames={300}
		>
			<Module01Intro
				durationInFrames={300}
				cuePoints={[]}
			/>
			<Audio src={audioFiles["module1-module-1-title-part03"]} />
		</Sequence>

		{/* Module01Intro - module1-module-1-title-part04 */}
		<Sequence
			from={2186}
			durationInFrames={300}
		>
			<Module01Intro
				durationInFrames={300}
				cuePoints={[]}
			/>
			<Audio src={audioFiles["module1-module-1-title-part04"]} />
		</Sequence>

		{/* Module01Intro - module1-module-1-title-part05 */}
		<Sequence
			from={2486}
			durationInFrames={86}
		>
			<Module01Intro
				durationInFrames={86}
				cuePoints={[]}
			/>
			<Audio src={audioFiles["module1-module-1-title-part05"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={2572} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module01Diagram1 */}
		<Sequence
			from={2590}
			durationInFrames={2987}
		>
			<Module01Diagram1
				durationInFrames={2987}
				cuePoints={[187, 692, 693, 857, 1490, 1835, 1925, 1935, 2164, 2330, 2470, 2751, 2888]}
			/>
			<Audio src={audioFiles["module1-module-1-concept"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={5577} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module01Diagram2 */}
		<Sequence
			from={5595}
			durationInFrames={3540}
		>
			<Module01Diagram2
				durationInFrames={3540}
				cuePoints={[128, 170, 241, 389, 547, 584, 784, 786, 853, 1000, 1016, 1078, 1080, 1401, 1733, 1755, 1787, 1808, 1900, 2002, 2143, 2233, 2312, 2385, 2447, 2518, 2582, 2659, 2718, 2814, 2896, 2960, 3027, 3090, 3207, 3264, 3341, 3403, 3465]}
			/>
			<Audio src={audioFiles["module1-module-1-architecture"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={9135} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module01Diagram3 */}
		<Sequence
			from={9153}
			durationInFrames={2510}
		>
			<Module01Diagram3
				durationInFrames={2510}
				cuePoints={[0, 120, 165, 195, 237, 390, 561, 640, 1236, 1425, 1426, 1602, 1705, 1789, 1914, 1986, 2043, 2113, 2177, 2267, 2343, 2430]}
			/>
			<Audio src={audioFiles["module1-module-1-application"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={11663} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module01Recap - module1-module-1-exam-mapping */}
		<Sequence
			from={11681}
			durationInFrames={1349}
		>
			<Module01Recap
				durationInFrames={1349}
				cuePoints={[0, 39, 115, 189, 243, 313, 388, 451, 509, 613, 685, 778, 836, 918, 991, 1077, 1171, 1206, 1264, 1324, 2205, 2247]}
			/>
			<Audio src={audioFiles["module1-module-1-exam-mapping"]} />
		</Sequence>

		{/* Module01Recap - module1-module-1-recap */}
		<Sequence
			from={13030}
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
