import React from "react";
import { Composition, Still } from "remotion";
import { GenericModule } from "./videos/GenericModule";
import { ThumbnailStill } from "./compositions/ThumbnailStill";
import { getModuleConfig } from "./videos/GenericModuleConfig";
import { allModules } from "./videos/moduleContent";
import { secondsToFrames } from "./utils/calculateDuration";

// Content-driven: GenericModule compositions from moduleContent.ts
export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				key="module-1"
				id="module-1"
				component={GenericModule}
				defaultProps={{ courseId: "introduction-to-computer-networks", moduleNumber: 1 }}
				durationInFrames={secondsToFrames(getModuleConfig("introduction-to-computer-networks", 1).totalDuration, getModuleConfig("introduction-to-computer-networks", 1).fps)}
				fps={getModuleConfig("introduction-to-computer-networks", 1).fps}
				width={getModuleConfig("introduction-to-computer-networks", 1).width}
				height={getModuleConfig("introduction-to-computer-networks", 1).height}
			/>
			<Composition
				key="module-2"
				id="module-2"
				component={GenericModule}
				defaultProps={{ courseId: "introduction-to-computer-networks", moduleNumber: 2 }}
				durationInFrames={secondsToFrames(getModuleConfig("introduction-to-computer-networks", 2).totalDuration, getModuleConfig("introduction-to-computer-networks", 2).fps)}
				fps={getModuleConfig("introduction-to-computer-networks", 2).fps}
				width={getModuleConfig("introduction-to-computer-networks", 2).width}
				height={getModuleConfig("introduction-to-computer-networks", 2).height}
			/>
			<Composition
				key="module-3"
				id="module-3"
				component={GenericModule}
				defaultProps={{ courseId: "introduction-to-computer-networks", moduleNumber: 3 }}
				durationInFrames={secondsToFrames(getModuleConfig("introduction-to-computer-networks", 3).totalDuration, getModuleConfig("introduction-to-computer-networks", 3).fps)}
				fps={getModuleConfig("introduction-to-computer-networks", 3).fps}
				width={getModuleConfig("introduction-to-computer-networks", 3).width}
				height={getModuleConfig("introduction-to-computer-networks", 3).height}
			/>
			<Composition
				key="module-4"
				id="module-4"
				component={GenericModule}
				defaultProps={{ courseId: "introduction-to-computer-networks", moduleNumber: 4 }}
				durationInFrames={secondsToFrames(getModuleConfig("introduction-to-computer-networks", 4).totalDuration, getModuleConfig("introduction-to-computer-networks", 4).fps)}
				fps={getModuleConfig("introduction-to-computer-networks", 4).fps}
				width={getModuleConfig("introduction-to-computer-networks", 4).width}
				height={getModuleConfig("introduction-to-computer-networks", 4).height}
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
