import React from "react";
import { Composition } from "remotion";
import { Module1 } from "./videos/Module1";
import { Module1Config } from "./videos/Module1Config";
import { secondsToFrames } from "./utils/calculateDuration";

export const RemotionRoot: React.FC = () => {
	// Total duration includes all audio + whoosh transitions (calculated in Module1Config)
	const totalDuration = Module1Config.totalDuration;
	const durationInFrames = secondsToFrames(totalDuration, Module1Config.fps);
	
	console.log("=== RemotionRoot Composition Setup ===");
	console.log("Total duration:", totalDuration, "seconds");
	console.log("Duration in frames:", durationInFrames);
	console.log("FPS:", Module1Config.fps);
	
	return (
		<>
			<Composition
				id={Module1Config.id}
				component={Module1}
				durationInFrames={durationInFrames}
				fps={Module1Config.fps}
				width={Module1Config.width}
				height={Module1Config.height}
			/>
		</>
	);
};
