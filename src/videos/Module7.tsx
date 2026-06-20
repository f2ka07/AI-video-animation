import React from "react";
import { Sequence, useVideoConfig, Audio, staticFile } from "remotion";
import { getAudioDuration } from "../utils/audioDuration";
import { Module07Intro, Module07Diagram1, Module07Diagram2, Module07Diagram3, Module07Recap } from "../../courses/agentic-ai-for-beginners/course/remotion/scenes/module07";

// Auto-generated from course scene components - DO NOT EDIT MANUALLY
// Course: agentic-ai-for-beginners, Module: 7
export const Module7: React.FC = () => {
	const { fps } = useVideoConfig();

	const audioFiles = {
		"module7-module-7-application": staticFile("audio/agentic-ai-for-beginners/module7-module-7-application.wav"),
		"module7-module-7-architecture": staticFile("audio/agentic-ai-for-beginners/module7-module-7-architecture.wav"),
		"module7-module-7-concept": staticFile("audio/agentic-ai-for-beginners/module7-module-7-concept.wav"),
		"module7-module-7-exam-mapping": staticFile("audio/agentic-ai-for-beginners/module7-module-7-exam-mapping.wav"),
		"module7-module-7-recap": staticFile("audio/agentic-ai-for-beginners/module7-module-7-recap.wav"),
		"module7-module-7-title": staticFile("audio/agentic-ai-for-beginners/module7-module-7-title.wav"),
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

		{/* Module07Intro */}
		<Sequence
			from={0}
			durationInFrames={1056}
		>
			<Module07Intro
				durationInFrames={1056}
				cuePoints={[0, 45, 188, 369, 412, 420, 511, 977]}
			/>
			<Audio src={audioFiles["module7-module-7-title"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={1056} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module07Diagram1 */}
		<Sequence
			from={1074}
			durationInFrames={2215}
		>
			<Module07Diagram1
				durationInFrames={2215}
				cuePoints={[0, 102, 114, 179, 184, 386, 424, 496, 558, 640, 752, 812, 880, 970, 1040, 1131, 1149, 1320, 1368, 1436, 1481, 1544, 1618, 1689, 1746, 1835, 1925]}
			/>
			<Audio src={audioFiles["module7-module-7-concept"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={3289} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module07Diagram2 */}
		<Sequence
			from={3307}
			durationInFrames={2313}
		>
			<Module07Diagram2
				durationInFrames={2313}
				cuePoints={[0, 5, 103, 170, 243, 327, 377, 418, 488, 532, 656, 711, 768, 877, 930, 1014, 1079, 1129, 1230, 1301, 1347, 1430, 1544, 1603, 1684, 1775, 1882, 2035, 2051, 2159, 2219]}
			/>
			<Audio src={audioFiles["module7-module-7-architecture"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={5620} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module07Diagram3 */}
		<Sequence
			from={5638}
			durationInFrames={2098}
		>
			<Module07Diagram3
				durationInFrames={2098}
				cuePoints={[0, 147, 179, 236, 280, 355, 440, 530, 549, 633, 709, 774, 845, 901, 992, 1069, 1149, 1179, 1261, 1378, 1471, 1532, 1610, 1665, 1704, 1785, 1866]}
			/>
			<Audio src={audioFiles["module7-module-7-application"]} />
		</Sequence>

		{/* Transition */}
		<Sequence from={7736} durationInFrames={18}>
			<Audio src={audioFiles.whoosh} />
		</Sequence>

		{/* Module07Recap - module7-module-7-exam-mapping */}
		<Sequence
			from={7754}
			durationInFrames={1372}
		>
			<Module07Recap
				durationInFrames={1372}
				cuePoints={[0, 131, 326, 423, 506, 587, 1360, 1371, 1375, 1407, 1511, 1547, 1633, 1691, 1749, 1834, 1924, 2008, 2087, 2134, 2224, 2294]}
			/>
			<Audio src={audioFiles["module7-module-7-exam-mapping"]} />
		</Sequence>

		{/* Module07Recap - module7-module-7-recap */}
		<Sequence
			from={9126}
			durationInFrames={1128}
		>
			<Module07Recap
				durationInFrames={1128}
				cuePoints={[]}
			/>
			<Audio src={audioFiles["module7-module-7-recap"]} />
		</Sequence>
		</div>
	);
};
