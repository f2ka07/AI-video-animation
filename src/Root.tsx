import React from "react";
import { Composition } from "remotion";
import { GenericModule } from "./videos/GenericModule";
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
				defaultProps={{ courseId: "agentic-ai-for-beginners", moduleNumber: 1 }}
				durationInFrames={secondsToFrames(getModuleConfig("agentic-ai-for-beginners", 1).totalDuration, getModuleConfig("agentic-ai-for-beginners", 1).fps)}
				fps={getModuleConfig("agentic-ai-for-beginners", 1).fps}
				width={getModuleConfig("agentic-ai-for-beginners", 1).width}
				height={getModuleConfig("agentic-ai-for-beginners", 1).height}
			/>
			<Composition
				key="module-2"
				id="module-2"
				component={GenericModule}
				defaultProps={{ courseId: "agentic-ai-for-beginners", moduleNumber: 2 }}
				durationInFrames={secondsToFrames(getModuleConfig("agentic-ai-for-beginners", 2).totalDuration, getModuleConfig("agentic-ai-for-beginners", 2).fps)}
				fps={getModuleConfig("agentic-ai-for-beginners", 2).fps}
				width={getModuleConfig("agentic-ai-for-beginners", 2).width}
				height={getModuleConfig("agentic-ai-for-beginners", 2).height}
			/>
			<Composition
				key="module-3"
				id="module-3"
				component={GenericModule}
				defaultProps={{ courseId: "agentic-ai-for-beginners", moduleNumber: 3 }}
				durationInFrames={secondsToFrames(getModuleConfig("agentic-ai-for-beginners", 3).totalDuration, getModuleConfig("agentic-ai-for-beginners", 3).fps)}
				fps={getModuleConfig("agentic-ai-for-beginners", 3).fps}
				width={getModuleConfig("agentic-ai-for-beginners", 3).width}
				height={getModuleConfig("agentic-ai-for-beginners", 3).height}
			/>
			<Composition
				key="module-4"
				id="module-4"
				component={GenericModule}
				defaultProps={{ courseId: "agentic-ai-for-beginners", moduleNumber: 4 }}
				durationInFrames={secondsToFrames(getModuleConfig("agentic-ai-for-beginners", 4).totalDuration, getModuleConfig("agentic-ai-for-beginners", 4).fps)}
				fps={getModuleConfig("agentic-ai-for-beginners", 4).fps}
				width={getModuleConfig("agentic-ai-for-beginners", 4).width}
				height={getModuleConfig("agentic-ai-for-beginners", 4).height}
			/>
			<Composition
				key="module-5"
				id="module-5"
				component={GenericModule}
				defaultProps={{ courseId: "agentic-ai-for-beginners", moduleNumber: 5 }}
				durationInFrames={secondsToFrames(getModuleConfig("agentic-ai-for-beginners", 5).totalDuration, getModuleConfig("agentic-ai-for-beginners", 5).fps)}
				fps={getModuleConfig("agentic-ai-for-beginners", 5).fps}
				width={getModuleConfig("agentic-ai-for-beginners", 5).width}
				height={getModuleConfig("agentic-ai-for-beginners", 5).height}
			/>
			<Composition
				key="module-6"
				id="module-6"
				component={GenericModule}
				defaultProps={{ courseId: "agentic-ai-for-beginners", moduleNumber: 6 }}
				durationInFrames={secondsToFrames(getModuleConfig("agentic-ai-for-beginners", 6).totalDuration, getModuleConfig("agentic-ai-for-beginners", 6).fps)}
				fps={getModuleConfig("agentic-ai-for-beginners", 6).fps}
				width={getModuleConfig("agentic-ai-for-beginners", 6).width}
				height={getModuleConfig("agentic-ai-for-beginners", 6).height}
			/>
			<Composition
				key="module-7"
				id="module-7"
				component={GenericModule}
				defaultProps={{ courseId: "agentic-ai-for-beginners", moduleNumber: 7 }}
				durationInFrames={secondsToFrames(getModuleConfig("agentic-ai-for-beginners", 7).totalDuration, getModuleConfig("agentic-ai-for-beginners", 7).fps)}
				fps={getModuleConfig("agentic-ai-for-beginners", 7).fps}
				width={getModuleConfig("agentic-ai-for-beginners", 7).width}
				height={getModuleConfig("agentic-ai-for-beginners", 7).height}
			/>
			<Composition
				key="module-8"
				id="module-8"
				component={GenericModule}
				defaultProps={{ courseId: "agentic-ai-for-beginners", moduleNumber: 8 }}
				durationInFrames={secondsToFrames(getModuleConfig("agentic-ai-for-beginners", 8).totalDuration, getModuleConfig("agentic-ai-for-beginners", 8).fps)}
				fps={getModuleConfig("agentic-ai-for-beginners", 8).fps}
				width={getModuleConfig("agentic-ai-for-beginners", 8).width}
				height={getModuleConfig("agentic-ai-for-beginners", 8).height}
			/>
			<Composition
				key="module-9"
				id="module-9"
				component={GenericModule}
				defaultProps={{ courseId: "agentic-ai-for-beginners", moduleNumber: 9 }}
				durationInFrames={secondsToFrames(getModuleConfig("agentic-ai-for-beginners", 9).totalDuration, getModuleConfig("agentic-ai-for-beginners", 9).fps)}
				fps={getModuleConfig("agentic-ai-for-beginners", 9).fps}
				width={getModuleConfig("agentic-ai-for-beginners", 9).width}
				height={getModuleConfig("agentic-ai-for-beginners", 9).height}
			/>
			<Composition
				key="module-10"
				id="module-10"
				component={GenericModule}
				defaultProps={{ courseId: "agentic-ai-for-beginners", moduleNumber: 10 }}
				durationInFrames={secondsToFrames(getModuleConfig("agentic-ai-for-beginners", 10).totalDuration, getModuleConfig("agentic-ai-for-beginners", 10).fps)}
				fps={getModuleConfig("agentic-ai-for-beginners", 10).fps}
				width={getModuleConfig("agentic-ai-for-beginners", 10).width}
				height={getModuleConfig("agentic-ai-for-beginners", 10).height}
			/>
			<Composition
				key="module-11"
				id="module-11"
				component={GenericModule}
				defaultProps={{ courseId: "agentic-ai-for-beginners", moduleNumber: 11 }}
				durationInFrames={secondsToFrames(getModuleConfig("agentic-ai-for-beginners", 11).totalDuration, getModuleConfig("agentic-ai-for-beginners", 11).fps)}
				fps={getModuleConfig("agentic-ai-for-beginners", 11).fps}
				width={getModuleConfig("agentic-ai-for-beginners", 11).width}
				height={getModuleConfig("agentic-ai-for-beginners", 11).height}
			/>
			<Composition
				key="module-12"
				id="module-12"
				component={GenericModule}
				defaultProps={{ courseId: "agentic-ai-for-beginners", moduleNumber: 12 }}
				durationInFrames={secondsToFrames(getModuleConfig("agentic-ai-for-beginners", 12).totalDuration, getModuleConfig("agentic-ai-for-beginners", 12).fps)}
				fps={getModuleConfig("agentic-ai-for-beginners", 12).fps}
				width={getModuleConfig("agentic-ai-for-beginners", 12).width}
				height={getModuleConfig("agentic-ai-for-beginners", 12).height}
			/>
		</>
	);
};
