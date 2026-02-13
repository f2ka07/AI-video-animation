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
export const Module4: React.FC = () => {
	const { fps } = useVideoConfig();
	const crossFadeDuration = 0.3;
	const whooshDuration = 0.57;

	const audioFiles = {
		"module-4-title": staticFile("audio/agentic-ai-for-beginners/module4-module-4-title.wav"),
		"module-4-concept": staticFile("audio/agentic-ai-for-beginners/module4-module-4-concept.wav"),
		"module-4-architecture": staticFile("audio/agentic-ai-for-beginners/module4-module-4-architecture.wav"),
		"module-4-application": staticFile("audio/agentic-ai-for-beginners/module4-module-4-application.wav"),
		"module-4-exam-mapping": staticFile("audio/agentic-ai-for-beginners/module4-module-4-exam-mapping.wav"),
		"module-4-recap": staticFile("audio/agentic-ai-for-beginners/module4-module-4-recap.wav"),
		whoosh: staticFile("audio/whoosh.wav"),
	};

	const audioDurations = {
		"module-4-title": getAudioDuration("agentic-ai-for-beginners/module4-module-4-title"),
		"module-4-concept": getAudioDuration("agentic-ai-for-beginners/module4-module-4-concept"),
		"module-4-architecture": getAudioDuration("agentic-ai-for-beginners/module4-module-4-architecture"),
		"module-4-application": getAudioDuration("agentic-ai-for-beginners/module4-module-4-application"),
		"module-4-exam-mapping": getAudioDuration("agentic-ai-for-beginners/module4-module-4-exam-mapping"),
		"module-4-recap": getAudioDuration("agentic-ai-for-beginners/module4-module-4-recap"),
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

	const module_4_titleSlide = addSlide(audioDurations["module-4-title"]);
	const module_4_conceptSlide = addSlide(audioDurations["module-4-concept"]);
	const module_4_architectureSlide = addSlide(audioDurations["module-4-architecture"]);
	const module_4_applicationSlide = addSlide(audioDurations["module-4-application"]);
	const module_4_exam_mappingSlide = addSlide(audioDurations["module-4-exam-mapping"]);
	const module_4_recapSlide = addSlide(audioDurations["module-4-recap"], true, 0.5);

	return (
		<div
			style={{
				width: "100%",
			height: "100%",
			background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
			position: "relative",
		}}
		>
			{/* Workloads and Inference Pipelines */}
			<Sequence
				from={module_4_titleSlide.start}
				durationInFrames={module_4_titleSlide.duration}
			>
				<Audio src={audioFiles["module-4-title"]} />
				<CrossFadeWrapper
					totalDuration={module_4_titleSlide.slideDuration}
					fadeInDuration={0.5}
					fadeOutDuration={crossFadeDuration}
			>
					<TitleSlide 
					title="Workloads and Inference Pipelines" 
					subtitle="Module 4: Workloads and Inference Pipelines"
					
					audioDuration={audioDurations["module-4-title"]}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={module_4_titleSlide.start + module_4_titleSlide.audioDuration * fps}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Concept */}
			<Sequence
				from={module_4_conceptSlide.start}
				durationInFrames={module_4_conceptSlide.duration}
			>
				<Audio src={audioFiles["module-4-concept"]} />
				<CrossFadeWrapper
					totalDuration={module_4_conceptSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"Let's define our terms",
					"A workload is a sustained, operational process that delivers value continuously",
					"It's not a one-time request",
					"It's an ongoing function of the business"
					]}
					slideName="module-4-concept"
					
					
					audioDuration={audioDurations["module-4-concept"]}
			/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={module_4_conceptSlide.start + module_4_conceptSlide.audioDuration * fps}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={module_4_architectureSlide.start}
				durationInFrames={module_4_architectureSlide.duration}
			>
				<Audio src={audioFiles["module-4-architecture"]} />
				<CrossFadeWrapper
					totalDuration={module_4_architectureSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"At the core of every AI workload is an inference pipeline",
					"This is the sequence of steps that takes a request from intake to output",
					"For agentic systems, the pipeline is more complex than for simple inference",
					"Let's walk through the full sequence"
					]}
					slideName="module-4-architecture"
					
					
					audioDuration={audioDurations["module-4-architecture"]}
			/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={module_4_architectureSlide.start + module_4_architectureSlide.audioDuration * fps}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Application */}
			<Sequence
				from={module_4_applicationSlide.start}
				durationInFrames={module_4_applicationSlide.duration}
			>
				<Audio src={audioFiles["module-4-application"]} />
				<CrossFadeWrapper
					totalDuration={module_4_applicationSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"Let's ground this in real examples",
					"Each query runs through the full pipeline"
					]}
					slideName="module-4-application"
					
					
					audioDuration={audioDurations["module-4-application"]}
			/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={module_4_applicationSlide.start + module_4_applicationSlide.audioDuration * fps}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={module_4_exam_mappingSlide.start}
				durationInFrames={module_4_exam_mappingSlide.duration}
			>
				<Audio src={audioFiles["module-4-exam-mapping"]} />
				<CrossFadeWrapper
					totalDuration={module_4_exam_mappingSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"Expect questions that test your knowledge of pipeline stages",
					"What happens during retrieval",
					"Where does tool execution occur"
					]}
					slideName="module-4-exam-mapping"
					
					
					audioDuration={audioDurations["module-4-exam-mapping"]}
			/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={module_4_exam_mappingSlide.start + module_4_exam_mappingSlide.audioDuration * fps}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Recap */}
			<Sequence
				from={module_4_recapSlide.start}
				durationInFrames={module_4_recapSlide.duration}
			>
				<Audio src={audioFiles["module-4-recap"]} />
				<CrossFadeWrapper
					totalDuration={module_4_recapSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={0}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"Demos are not workloads",
					"Demos show a model doing something once",
					"The inference pipeline is the backbone of every AI workload"
					]}
					slideName="module-4-recap"
					
					
					audioDuration={audioDurations["module-4-recap"]}
			/>
				</CrossFadeWrapper>
			</Sequence>

		</div>
	);
};
