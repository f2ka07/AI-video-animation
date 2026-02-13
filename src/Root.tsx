import React from "react";
import { Composition } from "remotion";
import { Module1 } from "./videos/Module1";
import { Module1Config } from "./videos/Module1Config";
import { Module2 } from "./videos/Module2";
import { Module2Config } from "./videos/Module2Config";
import { Module3 } from "./videos/Module3";
import { Module3Config } from "./videos/Module3Config";
import { Module4 } from "./videos/Module4";
import { Module4Config } from "./videos/Module4Config";
import { Module5 } from "./videos/Module5";
import { Module5Config } from "./videos/Module5Config";
import { secondsToFrames } from "./utils/calculateDuration";

// Auto-generated from moduleContent.ts - DO NOT EDIT MANUALLY
export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id={Module1Config.id}
				component={Module1}
				durationInFrames={secondsToFrames(Module1Config.totalDuration, Module1Config.fps)}
				fps={Module1Config.fps}
				width={Module1Config.width}
				height={Module1Config.height}
			/>
			<Composition
				id={Module2Config.id}
				component={Module2}
				durationInFrames={secondsToFrames(Module2Config.totalDuration, Module2Config.fps)}
				fps={Module2Config.fps}
				width={Module2Config.width}
				height={Module2Config.height}
			/>
			<Composition
				id={Module3Config.id}
				component={Module3}
				durationInFrames={secondsToFrames(Module3Config.totalDuration, Module3Config.fps)}
				fps={Module3Config.fps}
				width={Module3Config.width}
				height={Module3Config.height}
			/>
			<Composition
				id={Module4Config.id}
				component={Module4}
				durationInFrames={secondsToFrames(Module4Config.totalDuration, Module4Config.fps)}
				fps={Module4Config.fps}
				width={Module4Config.width}
				height={Module4Config.height}
			/>
			<Composition
				id={Module5Config.id}
				component={Module5}
				durationInFrames={secondsToFrames(Module5Config.totalDuration, Module5Config.fps)}
				fps={Module5Config.fps}
				width={Module5Config.width}
				height={Module5Config.height}
			/>
		</>
	);
};
