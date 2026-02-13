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
export const Module3: React.FC = () => {
	const { fps } = useVideoConfig();
	const crossFadeDuration = 0.3;
	const whooshDuration = 0.57;

	const audioFiles = {
		"module-3-title": staticFile("audio/agentic-ai-for-beginners/module3-module-3-title.wav"),
		"module-3-concept": staticFile("audio/agentic-ai-for-beginners/module3-module-3-concept.wav"),
		"module-3-architecture": staticFile("audio/agentic-ai-for-beginners/module3-module-3-architecture.wav"),
		"module-3-application": staticFile("audio/agentic-ai-for-beginners/module3-module-3-application.wav"),
		"module-3-exam-mapping": staticFile("audio/agentic-ai-for-beginners/module3-module-3-exam-mapping.wav"),
		"module-3-recap": staticFile("audio/agentic-ai-for-beginners/module3-module-3-recap.wav"),
		whoosh: staticFile("audio/whoosh.wav"),
	};

	const audioDurations = {
		"module-3-title": getAudioDuration("agentic-ai-for-beginners/module3-module-3-title"),
		"module-3-concept": getAudioDuration("agentic-ai-for-beginners/module3-module-3-concept"),
		"module-3-architecture": getAudioDuration("agentic-ai-for-beginners/module3-module-3-architecture"),
		"module-3-application": getAudioDuration("agentic-ai-for-beginners/module3-module-3-application"),
		"module-3-exam-mapping": getAudioDuration("agentic-ai-for-beginners/module3-module-3-exam-mapping"),
		"module-3-recap": getAudioDuration("agentic-ai-for-beginners/module3-module-3-recap"),
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

	const module_3_titleSlide = addSlide(audioDurations["module-3-title"]);
	const module_3_conceptSlide = addSlide(audioDurations["module-3-concept"]);
	const module_3_architectureSlide = addSlide(audioDurations["module-3-architecture"]);
	const module_3_applicationSlide = addSlide(audioDurations["module-3-application"]);
	const module_3_exam_mappingSlide = addSlide(audioDurations["module-3-exam-mapping"]);
	const module_3_recapSlide = addSlide(audioDurations["module-3-recap"], true, 0.5);

	return (
		<div
			style={{
				width: "100%",
			height: "100%",
			background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
			position: "relative",
		}}
		>
			{/* NVIDIA AI Platform Stack */}
			<Sequence
				from={module_3_titleSlide.start}
				durationInFrames={module_3_titleSlide.duration}
			>
				<Audio src={audioFiles["module-3-title"]} />
				<CrossFadeWrapper
					totalDuration={module_3_titleSlide.slideDuration}
					fadeInDuration={0.5}
					fadeOutDuration={crossFadeDuration}
			>
					<TitleSlide 
					title="NVIDIA AI Platform Stack" 
					subtitle="Module 3: NVIDIA AI Platform Stack"
					
					audioDuration={audioDurations["module-3-title"]}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={module_3_titleSlide.start + module_3_titleSlide.audioDuration * fps}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Concept */}
			<Sequence
				from={module_3_conceptSlide.start}
				durationInFrames={module_3_conceptSlide.duration}
			>
				<Audio src={audioFiles["module-3-concept"]} />
				<CrossFadeWrapper
					totalDuration={module_3_conceptSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"Let's frame the problem before we introduce the solution",
					"Building AI systems at production scale is hard",
					"You need software that extracts performance from those GPUs"
					]}
					slideName="module-3-concept"
					
					
					audioDuration={audioDurations["module-3-concept"]}
			/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={module_3_conceptSlide.start + module_3_conceptSlide.audioDuration * fps}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={module_3_architectureSlide.start}
				durationInFrames={module_3_architectureSlide.duration}
			>
				<Audio src={audioFiles["module-3-architecture"]} />
				<CrossFadeWrapper
					totalDuration={module_3_architectureSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Acceleration.",
					"Inference Serving.",
					"Model and Runtime Surfaces.",
					"Application Layer."
					]}
					slideName="module-3-architecture"
					
					
					audioDuration={audioDurations["module-3-architecture"]}
			/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={module_3_architectureSlide.start + module_3_architectureSlide.audioDuration * fps}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Application */}
			<Sequence
				from={module_3_applicationSlide.start}
				durationInFrames={module_3_applicationSlide.duration}
			>
				<Audio src={audioFiles["module-3-application"]} />
				<CrossFadeWrapper
					totalDuration={module_3_applicationSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"Why does this stack matter for agentic AI",
					"They make multiple model calls per user interaction",
					"They require fast inference for responsive loops"
					]}
					slideName="module-3-application"
					
					
					audioDuration={audioDurations["module-3-application"]}
			/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={module_3_applicationSlide.start + module_3_applicationSlide.audioDuration * fps}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={module_3_exam_mappingSlide.start}
				durationInFrames={module_3_exam_mappingSlide.duration}
			>
				<Audio src={audioFiles["module-3-exam-mapping"]} />
				<CrossFadeWrapper
					totalDuration={module_3_exam_mappingSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"Expect questions about the role of each layer",
					"What does TensorRT do",
					"What problem does Triton solve"
					]}
					slideName="module-3-exam-mapping"
					
					
					audioDuration={audioDurations["module-3-exam-mapping"]}
			/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={module_3_exam_mappingSlide.start + module_3_exam_mappingSlide.audioDuration * fps}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Recap */}
			<Sequence
				from={module_3_recapSlide.start}
				durationInFrames={module_3_recapSlide.duration}
			>
				<Audio src={audioFiles["module-3-recap"]} />
				<CrossFadeWrapper
					totalDuration={module_3_recapSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={0}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"Let's lock in the essentials",
					"NVIDIA is not just a GPU company",
					"It's a full-stack AI platform provider"
					]}
					slideName="module-3-recap"
					
					
					audioDuration={audioDurations["module-3-recap"]}
			/>
				</CrossFadeWrapper>
			</Sequence>

		</div>
	);
};
