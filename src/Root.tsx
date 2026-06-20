import React from "react";
import { Composition, Still } from "remotion";
import { ThumbnailStill } from "./compositions/ThumbnailStill";
import { secondsToFrames } from "./utils/calculateDuration";
import { Module1 } from "./videos/Module1";
import { Module2 } from "./videos/Module2";
import { Module3 } from "./videos/Module3";
import { Module4 } from "./videos/Module4";
import { Module5 } from "./videos/Module5";
import { Module6 } from "./videos/Module6";
import { Module7 } from "./videos/Module7";
import { Module8 } from "./videos/Module8";
import { Module9 } from "./videos/Module9";
import { Module10 } from "./videos/Module10";
import { Module11 } from "./videos/Module11";
import { Module12 } from "./videos/Module12";

// Scene-based modules for agentic-ai-for-beginners (SVG scenes - not GenericModule/Mermaid)
export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				key="module-1"
				id="module-1"
				component={Module1}
				durationInFrames={13521}
				fps={30}
				width={1920}
				height={1080}
			/>
			<Composition
				key="module-2"
				id="module-2"
				component={Module2}
				durationInFrames={16921}
				fps={30}
				width={1920}
				height={1080}
			/>
			<Composition
				key="module-3"
				id="module-3"
				component={Module3}
				durationInFrames={18901}
				fps={30}
				width={1920}
				height={1080}
			/>
			<Composition
				key="module-4"
				id="module-4"
				component={Module4}
				durationInFrames={20203}
				fps={30}
				width={1920}
				height={1080}
			/>
			<Composition
				key="module-5"
				id="module-5"
				component={Module5}
				durationInFrames={19818}
				fps={30}
				width={1920}
				height={1080}
			/>
			<Composition
				key="module-6"
				id="module-6"
				component={Module6}
				durationInFrames={19009}
				fps={30}
				width={1920}
				height={1080}
			/>
			<Composition
				key="module-7"
				id="module-7"
				component={Module7}
				durationInFrames={10254}
				fps={30}
				width={1920}
				height={1080}
			/>
			<Composition
				key="module-8"
				id="module-8"
				component={Module8}
				durationInFrames={11009}
				fps={30}
				width={1920}
				height={1080}
			/>
			<Composition
				key="module-9"
				id="module-9"
				component={Module9}
				durationInFrames={10486}
				fps={30}
				width={1920}
				height={1080}
			/>
			<Composition
				key="module-10"
				id="module-10"
				component={Module10}
				durationInFrames={11551}
				fps={30}
				width={1920}
				height={1080}
			/>
			<Composition
				key="module-11"
				id="module-11"
				component={Module11}
				durationInFrames={10302}
				fps={30}
				width={1920}
				height={1080}
			/>
			<Composition
				key="module-12"
				id="module-12"
				component={Module12}
				durationInFrames={11649}
				fps={30}
				width={1920}
				height={1080}
			/>
			<Still
				id="thumbnail"
				component={ThumbnailStill}
				width={1280}
				height={720}
				defaultProps={{ thumbnailText: "THUMBNAIL" }}
			/>
		</>
	);
};
