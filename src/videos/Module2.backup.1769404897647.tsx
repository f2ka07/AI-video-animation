import React from "react";
import { Sequence, useVideoConfig, Audio, staticFile } from "remotion";
import { TitleSlide } from "../components/TitleSlide";
import { AnimatedContentSlide } from "../components/AnimatedContentSlide";
import { AnimatedCodeSlide } from "../components/AnimatedCodeSlide";
import { AnimatedComparisonSlide } from "../components/AnimatedComparisonSlide";
import { CodeAndDiagram } from "../compositions/CodeAndDiagram";
import { CrossFadeWrapper } from "../components/CrossFadeWrapper";
import { getAudioDuration } from "../utils/audioDuration";

// Auto-generated from moduleContent.ts - DO NOT EDIT MANUALLY
export const Module2: React.FC = () => {
	const { fps } = useVideoConfig();
	const crossFadeDuration = 0.3;
	const whooshDuration = 0.57;

	const audioFiles = {
		"module-2-title": staticFile("audio/agentic-ai-for-beginners/module2-module-2-title.wav"),
		"module-2-concept": staticFile("audio/agentic-ai-for-beginners/module2-module-2-concept.wav"),
		"module-2-architecture": staticFile("audio/agentic-ai-for-beginners/module2-module-2-architecture.wav"),
		"module-2-application": staticFile("audio/agentic-ai-for-beginners/module2-module-2-application.wav"),
		"module-2-exam-mapping": staticFile("audio/agentic-ai-for-beginners/module2-module-2-exam-mapping.wav"),
		"module-2-recap": staticFile("audio/agentic-ai-for-beginners/module2-module-2-recap.wav"),
		whoosh: staticFile("audio/whoosh.wav"),
	};

	const audioDurations = {
		"module-2-title": getAudioDuration("agentic-ai-for-beginners/module2-module-2-title"),
		"module-2-concept": getAudioDuration("agentic-ai-for-beginners/module2-module-2-concept"),
		"module-2-architecture": getAudioDuration("agentic-ai-for-beginners/module2-module-2-architecture"),
		"module-2-application": getAudioDuration("agentic-ai-for-beginners/module2-module-2-application"),
		"module-2-exam-mapping": getAudioDuration("agentic-ai-for-beginners/module2-module-2-exam-mapping"),
		"module-2-recap": getAudioDuration("agentic-ai-for-beginners/module2-module-2-recap"),
	};

	let currentFrame = 0;

	const addSlide = (audioDuration: number, isLast: boolean = false, buffer: number = 0) => {
		const slideDuration = audioDuration + buffer;
		const start = currentFrame;
		if (!isLast) {
			currentFrame += (slideDuration + whooshDuration) * fps;
		} else {
			currentFrame += slideDuration * fps;
		}
		return { start, duration: slideDuration * fps, slideDuration, audioDuration, buffer };
	};

	const module_2_titleSlide = addSlide(audioDurations["module-2-title"]);
	const module_2_conceptSlide = addSlide(audioDurations["module-2-concept"]);
	const module_2_architectureSlide = addSlide(audioDurations["module-2-architecture"]);
	const module_2_applicationSlide = addSlide(audioDurations["module-2-application"]);
	const module_2_exam_mappingSlide = addSlide(audioDurations["module-2-exam-mapping"]);
	const module_2_recapSlide = addSlide(audioDurations["module-2-recap"], true, 0.5);

	return (
		<div
			style={{
				width: "100%",
			height: "100%",
			background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
			position: "relative",
		}}
		>
			{/* Agent Fundamentals */}
			<Sequence
				from={module_2_titleSlide.start}
				durationInFrames={module_2_titleSlide.duration}
			>
				<Audio src={audioFiles["module-2-title"]} />
				<CrossFadeWrapper
					totalDuration={module_2_titleSlide.slideDuration}
					fadeInDuration={0.5}
					fadeOutDuration={crossFadeDuration}
			>
					<TitleSlide 
					title="Agent Fundamentals" 
					subtitle="Module 2: Agent Fundamentals"
					
					audioDuration={audioDurations["module-2-title"]}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={module_2_titleSlide.start + module_2_titleSlide.audioDuration * fps}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Concept */}
			<Sequence
				from={module_2_conceptSlide.start}
				durationInFrames={module_2_conceptSlide.duration}
			>
				<Audio src={audioFiles["module-2-concept"]} />
				<CrossFadeWrapper
					totalDuration={module_2_conceptSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"Let's define the term clearly",
					"The key word is \"loop"
					]}
					slideName="module-2-concept"
					
					
					audioDuration={audioDurations["module-2-concept"]}
			/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={module_2_conceptSlide.start + module_2_conceptSlide.audioDuration * fps}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={module_2_architectureSlide.start}
				durationInFrames={module_2_architectureSlide.duration}
			>
				<Audio src={audioFiles["module-2-architecture"]} />
				<CrossFadeWrapper
					totalDuration={module_2_architectureSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"There are six core components in a production agentic architecture",
					"You've seen a preview in Module 01"
					]}
					slideName="module-2-architecture"
					
					
					audioDuration={audioDurations["module-2-architecture"]}
			/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={module_2_architectureSlide.start + module_2_architectureSlide.audioDuration * fps}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Application */}
			<Sequence
				from={module_2_applicationSlide.start}
				durationInFrames={module_2_applicationSlide.duration}
			>
				<Audio src={audioFiles["module-2-application"]} />
				<CrossFadeWrapper
					totalDuration={module_2_applicationSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"Now let's connect this to how real work gets done",
					"Consider a support automation workflow",
					"A customer submits a ticket"
					]}
					slideName="module-2-application"
					
					
					audioDuration={audioDurations["module-2-application"]}
			/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={module_2_applicationSlide.start + module_2_applicationSlide.audioDuration * fps}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={module_2_exam_mappingSlide.start}
				durationInFrames={module_2_exam_mappingSlide.duration}
			>
				<Audio src={audioFiles["module-2-exam-mapping"]} />
				<CrossFadeWrapper
					totalDuration={module_2_exam_mappingSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"The answer is the loop: planning, acting, observing, adapting",
					"You need to recognize the six components and understand their roles"
					]}
					slideName="module-2-exam-mapping"
					
					
					audioDuration={audioDurations["module-2-exam-mapping"]}
			/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={module_2_exam_mappingSlide.start + module_2_exam_mappingSlide.audioDuration * fps}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Recap */}
			<Sequence
				from={module_2_recapSlide.start}
				durationInFrames={module_2_recapSlide.duration}
			>
				<Audio src={audioFiles["module-2-recap"]} />
				<CrossFadeWrapper
					totalDuration={module_2_recapSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={0}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"Let's consolidate what we covered",
					"An agent is a system that wraps a language model in a control loop",
					"That loop enables planning, action, observation, and adaptation",
					"It's what transforms a model from a responder into a worker"
					]}
					slideName="module-2-recap"
					
					
					audioDuration={audioDurations["module-2-recap"]}
			/>
				</CrossFadeWrapper>
			</Sequence>

		</div>
	);
};
