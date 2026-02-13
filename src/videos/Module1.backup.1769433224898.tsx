import React from "react";
import { Sequence, useVideoConfig, Audio, staticFile } from "remotion";
import { TitleSlide } from "../components/TitleSlide";
import { AnimatedContentSlide } from "../components/AnimatedContentSlide";
import { AnimatedCodeSlide } from "../components/AnimatedCodeSlide";
import { AnimatedComparisonSlide } from "../components/AnimatedComparisonSlide";
import { SequentialBulletSlide } from "../components/SequentialBulletSlide";
import { CodeAndDiagram } from "../compositions/CodeAndDiagram";
import { CrossFadeWrapper } from "../components/CrossFadeWrapper";

// Auto-generated from moduleContent.ts - DO NOT EDIT MANUALLY
export const Module1: React.FC = () => {
	const { fps } = useVideoConfig();
	const crossFadeDuration = 0.3;
	const whooshDuration = 0.57;

	const audioFiles = {
		"module-1-title": staticFile("audio/agentic-ai-for-beginners/module1-module-1-title.wav"),
		"module-1-concept": staticFile("audio/agentic-ai-for-beginners/module1-module-1-concept.wav"),
		"module-1-architecture": staticFile("audio/agentic-ai-for-beginners/module1-module-1-architecture.wav"),
		"module-1-application": staticFile("audio/agentic-ai-for-beginners/module1-module-1-application.wav"),
		"module-1-exam-mapping": staticFile("audio/agentic-ai-for-beginners/module1-module-1-exam-mapping.wav"),
		"module-1-recap": staticFile("audio/agentic-ai-for-beginners/module1-module-1-recap.wav"),
		whoosh: staticFile("audio/whoosh.wav"),
	};

	};

	let currentFrame = 0;

		const start = currentFrame;
		if (!isLast) {
			currentFrame += (slideDuration + whooshDuration) * fps;
		} else {
			currentFrame += slideDuration * fps;
		}
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
			{/* The Agentic AI Transition */}
			<Sequence
				from={module_1_titleSlide.start}
				durationInFrames={module_1_titleSlide.duration}
			>
				<Audio src={audioFiles["module-1-title"]} />
				<CrossFadeWrapper
					totalDuration={module_1_titleSlide.slideDuration}
					fadeInDuration={0.5}
					fadeOutDuration={crossFadeDuration}
			>
					<TitleSlide 
					title="The Agentic AI Transition" 
					subtitle="Module 1: The Agentic AI Transition"
					
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Concept */}
			<Sequence
				from={module_1_conceptSlide.start}
				durationInFrames={module_1_conceptSlide.duration}
			>
				<Audio src={audioFiles["module-1-concept"]} />
				<CrossFadeWrapper
					totalDuration={module_1_conceptSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"from AI as interface, to AI as infrastructure."
					]}
					slideName="module-1-concept"
					
					
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={module_1_architectureSlide.start}
				durationInFrames={module_1_architectureSlide.duration}
			>
				<Audio src={audioFiles["module-1-architecture"]} />
				<CrossFadeWrapper
					totalDuration={module_1_architectureSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"What does an agentic system actually look like",
					"At the highest level, an agent is a pipeline with five core components",
					"This is where reasoning models earn their value"
					]}
					slideName="module-1-architecture"
					
					
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Application */}
			<Sequence
				from={module_1_applicationSlide.start}
				durationInFrames={module_1_applicationSlide.duration}
			>
				<Audio src={audioFiles["module-1-application"]} />
				<CrossFadeWrapper
					totalDuration={module_1_applicationSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"Why are enterprises making this transition now",
					"Three drivers dominate",
					"Single-call systems are brittle",
					"They can't recover from errors"
					]}
					slideName="module-1-application"
					
					
			/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={module_1_exam_mappingSlide.start}
				durationInFrames={module_1_exam_mappingSlide.duration}
			>
				<Audio src={audioFiles["module-1-exam-mapping"]} />
				<CrossFadeWrapper
					totalDuration={module_1_exam_mappingSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"You'll also need vocabulary alignment"
					]}
					slideName="module-1-exam-mapping"
					
					
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Recap */}
			<Sequence
				from={module_1_recapSlide.start}
				durationInFrames={module_1_recapSlide.duration}
			>
				<Audio src={audioFiles["module-1-recap"]} />
				<CrossFadeWrapper
					totalDuration={module_1_recapSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={0}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"Let's lock in the key points",
					"Prompting was never the product",
					"It was the user interface for early adoption"
					]}
					slideName="module-1-recap"
					
					
			/>
				</CrossFadeWrapper>
			</Sequence>

		</div>
	);
};
