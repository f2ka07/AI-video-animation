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
export const Module5: React.FC = () => {
	const { fps } = useVideoConfig();
	const crossFadeDuration = 0.3;
	const whooshDuration = 0.57;

	const audioFiles = {
		"module-5-title": staticFile("audio/agentic-ai-for-beginners/module5-module-5-title.wav"),
		"module-5-concept": staticFile("audio/agentic-ai-for-beginners/module5-module-5-concept.wav"),
		"module-5-architecture": staticFile("audio/agentic-ai-for-beginners/module5-module-5-architecture.wav"),
		"module-5-application": staticFile("audio/agentic-ai-for-beginners/module5-module-5-application.wav"),
		"module-5-exam-mapping": staticFile("audio/agentic-ai-for-beginners/module5-module-5-exam-mapping.wav"),
		"module-5-recap": staticFile("audio/agentic-ai-for-beginners/module5-module-5-recap.wav"),
		whoosh: staticFile("audio/whoosh.wav"),
	};

	const audioDurations = {
		"module-5-title": getAudioDuration("agentic-ai-for-beginners/module5-module-5-title"),
		"module-5-concept": getAudioDuration("agentic-ai-for-beginners/module5-module-5-concept"),
		"module-5-architecture": getAudioDuration("agentic-ai-for-beginners/module5-module-5-architecture"),
		"module-5-application": getAudioDuration("agentic-ai-for-beginners/module5-module-5-application"),
		"module-5-exam-mapping": getAudioDuration("agentic-ai-for-beginners/module5-module-5-exam-mapping"),
		"module-5-recap": getAudioDuration("agentic-ai-for-beginners/module5-module-5-recap"),
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

	const module_5_titleSlide = addSlide(audioDurations["module-5-title"]);
	const module_5_conceptSlide = addSlide(audioDurations["module-5-concept"]);
	const module_5_architectureSlide = addSlide(audioDurations["module-5-architecture"]);
	const module_5_applicationSlide = addSlide(audioDurations["module-5-application"]);
	const module_5_exam_mappingSlide = addSlide(audioDurations["module-5-exam-mapping"]);
	const module_5_recapSlide = addSlide(audioDurations["module-5-recap"], true, 0.5);

	return (
		<div
			style={{
				width: "100%",
			height: "100%",
			background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
			position: "relative",
		}}
		>
			{/* Deployment and Integration Models */}
			<Sequence
				from={module_5_titleSlide.start}
				durationInFrames={module_5_titleSlide.duration}
			>
				<Audio src={audioFiles["module-5-title"]} />
				<CrossFadeWrapper
					totalDuration={module_5_titleSlide.slideDuration}
					fadeInDuration={0.5}
					fadeOutDuration={crossFadeDuration}
			>
					<TitleSlide 
					title="Deployment and Integration Models" 
					subtitle="Module 5: Deployment and Integration Models"
					
					audioDuration={audioDurations["module-5-title"]}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={module_5_titleSlide.start + module_5_titleSlide.audioDuration * fps}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Concept */}
			<Sequence
				from={module_5_conceptSlide.start}
				durationInFrames={module_5_conceptSlide.duration}
			>
				<Audio src={audioFiles["module-5-concept"]} />
				<CrossFadeWrapper
					totalDuration={module_5_conceptSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"Vendor-Hosted AI."
					]}
					slideName="module-5-concept"
					
					
					audioDuration={audioDurations["module-5-concept"]}
			/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={module_5_conceptSlide.start + module_5_conceptSlide.audioDuration * fps}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={module_5_architectureSlide.start}
				durationInFrames={module_5_architectureSlide.duration}
			>
				<Audio src={audioFiles["module-5-architecture"]} />
				<CrossFadeWrapper
					totalDuration={module_5_architectureSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Deployment is only half the challenge",
					"The other half is integration",
					"An agentic system that can't connect to enterprise data and tools is useless",
					"Integration surfaces are the interfaces that make that connection possible"
					]}
					slideName="module-5-architecture"
					
					
					audioDuration={audioDurations["module-5-architecture"]}
			/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={module_5_architectureSlide.start + module_5_architectureSlide.audioDuration * fps}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Application */}
			<Sequence
				from={module_5_applicationSlide.start}
				durationInFrames={module_5_applicationSlide.duration}
			>
				<Audio src={audioFiles["module-5-application"]} />
				<CrossFadeWrapper
					totalDuration={module_5_applicationSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"Let's connect deployment and integration to business drivers",
					"Startups and innovation teams choose SaaS because it's fast",
					"You can have a working prototype in days",
					"The tradeoff is that you're locked into the vendor's capabilities and pricing"
					]}
					slideName="module-5-application"
					
					
					audioDuration={audioDurations["module-5-application"]}
			/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={module_5_applicationSlide.start + module_5_applicationSlide.audioDuration * fps}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={module_5_exam_mappingSlide.start}
				durationInFrames={module_5_exam_mappingSlide.duration}
			>
				<Audio src={audioFiles["module-5-exam-mapping"]} />
				<CrossFadeWrapper
					totalDuration={module_5_exam_mappingSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"If a scenario describes data sovereignty, the answer is likely on-premises",
					"If it describes rapid iteration, the answer is likely SaaS"
					]}
					slideName="module-5-exam-mapping"
					
					
					audioDuration={audioDurations["module-5-exam-mapping"]}
			/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={module_5_exam_mappingSlide.start + module_5_exam_mappingSlide.audioDuration * fps}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Recap */}
			<Sequence
				from={module_5_recapSlide.start}
				durationInFrames={module_5_recapSlide.duration}
			>
				<Audio src={audioFiles["module-5-recap"]} />
				<CrossFadeWrapper
					totalDuration={module_5_recapSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={0}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"Let's lock in the key points",
					"Deployment models define where your AI runs",
					"SaaS is fastest but least controlled",
					"Cloud offers flexibility and scale"
					]}
					slideName="module-5-recap"
					
					
					audioDuration={audioDurations["module-5-recap"]}
			/>
				</CrossFadeWrapper>
			</Sequence>

		</div>
	);
};
