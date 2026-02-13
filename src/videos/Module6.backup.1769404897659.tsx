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
export const Module6: React.FC = () => {
	const { fps } = useVideoConfig();
	const crossFadeDuration = 0.3;
	const whooshDuration = 0.57;

	const audioFiles = {
		"module-6-title": staticFile("audio/agentic-ai-for-beginners/module6-module-6-title.wav"),
		"module-6-concept": staticFile("audio/agentic-ai-for-beginners/module6-module-6-concept.wav"),
		"module-6-architecture": staticFile("audio/agentic-ai-for-beginners/module6-module-6-architecture.wav"),
		"module-6-application": staticFile("audio/agentic-ai-for-beginners/module6-module-6-application.wav"),
		"module-6-exam-mapping": staticFile("audio/agentic-ai-for-beginners/module6-module-6-exam-mapping.wav"),
		"module-6-recap": staticFile("audio/agentic-ai-for-beginners/module6-module-6-recap.wav"),
		whoosh: staticFile("audio/whoosh.wav"),
	};

	const audioDurations = {
		"module-6-title": getAudioDuration("agentic-ai-for-beginners/module6-module-6-title"),
		"module-6-concept": getAudioDuration("agentic-ai-for-beginners/module6-module-6-concept"),
		"module-6-architecture": getAudioDuration("agentic-ai-for-beginners/module6-module-6-architecture"),
		"module-6-application": getAudioDuration("agentic-ai-for-beginners/module6-module-6-application"),
		"module-6-exam-mapping": getAudioDuration("agentic-ai-for-beginners/module6-module-6-exam-mapping"),
		"module-6-recap": getAudioDuration("agentic-ai-for-beginners/module6-module-6-recap"),
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

	const module_6_titleSlide = addSlide(audioDurations["module-6-title"]);
	const module_6_conceptSlide = addSlide(audioDurations["module-6-concept"]);
	const module_6_architectureSlide = addSlide(audioDurations["module-6-architecture"]);
	const module_6_applicationSlide = addSlide(audioDurations["module-6-application"]);
	const module_6_exam_mappingSlide = addSlide(audioDurations["module-6-exam-mapping"]);
	const module_6_recapSlide = addSlide(audioDurations["module-6-recap"], true, 0.5);

	return (
		<div
			style={{
				width: "100%",
			height: "100%",
			background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
			position: "relative",
		}}
		>
			{/* Enterprise and Industry Use Cases */}
			<Sequence
				from={module_6_titleSlide.start}
				durationInFrames={module_6_titleSlide.duration}
			>
				<Audio src={audioFiles["module-6-title"]} />
				<CrossFadeWrapper
					totalDuration={module_6_titleSlide.slideDuration}
					fadeInDuration={0.5}
					fadeOutDuration={crossFadeDuration}
			>
					<TitleSlide 
					title="Enterprise and Industry Use Cases" 
					subtitle="Module 6: Enterprise and Industry Use Cases"
					
					audioDuration={audioDurations["module-6-title"]}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={module_6_titleSlide.start + module_6_titleSlide.audioDuration * fps}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Concept */}
			<Sequence
				from={module_6_conceptSlide.start}
				durationInFrames={module_6_conceptSlide.duration}
			>
				<Audio src={audioFiles["module-6-concept"]} />
				<CrossFadeWrapper
					totalDuration={module_6_conceptSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"why do enterprises buy AI?"
					]}
					slideName="module-6-concept"
					
					
					audioDuration={audioDurations["module-6-concept"]}
			/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={module_6_conceptSlide.start + module_6_conceptSlide.audioDuration * fps}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={module_6_architectureSlide.start}
				durationInFrames={module_6_architectureSlide.duration}
			>
				<Audio src={audioFiles["module-6-architecture"]} />
				<CrossFadeWrapper
					totalDuration={module_6_architectureSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Robotics and Simulation."
					]}
					slideName="module-6-architecture"
					
					
					audioDuration={audioDurations["module-6-architecture"]}
			/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={module_6_architectureSlide.start + module_6_architectureSlide.audioDuration * fps}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Application */}
			<Sequence
				from={module_6_applicationSlide.start}
				durationInFrames={module_6_applicationSlide.duration}
			>
				<Audio src={audioFiles["module-6-application"]} />
				<CrossFadeWrapper
					totalDuration={module_6_applicationSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"Integration.",
					"Platform Standardization."
					]}
					slideName="module-6-application"
					
					
					audioDuration={audioDurations["module-6-application"]}
			/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={module_6_applicationSlide.start + module_6_applicationSlide.audioDuration * fps}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={module_6_exam_mappingSlide.start}
				durationInFrames={module_6_exam_mappingSlide.duration}
			>
				<Audio src={audioFiles["module-6-exam-mapping"]} />
				<CrossFadeWrapper
					totalDuration={module_6_exam_mappingSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"Is this knowledge management, customer ops, research, or document automation",
					"Understand the value drivers"
					]}
					slideName="module-6-exam-mapping"
					
					
					audioDuration={audioDurations["module-6-exam-mapping"]}
			/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={module_6_exam_mappingSlide.start + module_6_exam_mappingSlide.audioDuration * fps}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Recap */}
			<Sequence
				from={module_6_recapSlide.start}
				durationInFrames={module_6_recapSlide.duration}
			>
				<Audio src={audioFiles["module-6-recap"]} />
				<CrossFadeWrapper
					totalDuration={module_6_recapSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={0}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"Let's consolidate everything from this module",
					"Agentic AI is a business category, not just a technology"
					]}
					slideName="module-6-recap"
					
					
					audioDuration={audioDurations["module-6-recap"]}
			/>
				</CrossFadeWrapper>
			</Sequence>

		</div>
	);
};
