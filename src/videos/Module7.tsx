import React from "react";
import { Sequence, useVideoConfig, Audio, staticFile } from "remotion";
import { TitleSlide } from "../components/TitleSlide";
import { AnimatedContentSlide } from "../components/AnimatedContentSlide";
import { AnimatedCodeSlide } from "../components/AnimatedCodeSlide";
import { BulletsAndCodeSlide } from "../components/BulletsAndCodeSlide";
import { AnimatedComparisonSlide } from "../components/AnimatedComparisonSlide";
import { SequentialBulletSlide } from "../components/SequentialBulletSlide";
import { CodeAndDiagram } from "../compositions/CodeAndDiagram";
import { CrossFadeWrapper } from "../components/CrossFadeWrapper";
import { getAudioDuration } from "../utils/audioDuration";

// Auto-generated from moduleContent.ts - DO NOT EDIT MANUALLY

export const Module7: React.FC = () => {
	const { fps } = useVideoConfig();
	const crossFadeDuration = 0.3;
	const whooshDuration = 0.57;

	const audioFiles = {
		"module-7-title": staticFile("audio/agentic-ai-for-beginners/module7-module-7-title.wav"),
		"module-7-concept": staticFile("audio/agentic-ai-for-beginners/module7-module-7-concept.wav"),
		"module-7-architecture": staticFile("audio/agentic-ai-for-beginners/module7-module-7-architecture.wav"),
		"module-7-application": staticFile("audio/agentic-ai-for-beginners/module7-module-7-application.wav"),
		"module-7-exam-mapping": staticFile("audio/agentic-ai-for-beginners/module7-module-7-exam-mapping.wav"),
		"module-7-recap": staticFile("audio/agentic-ai-for-beginners/module7-module-7-recap.wav"),
		whoosh: staticFile("audio/whoosh.wav"),
	};

	const audioDurations = {
		"module-7-title": getAudioDuration("agentic-ai-for-beginners/module7-module-7-title"),
		"module-7-concept": getAudioDuration("agentic-ai-for-beginners/module7-module-7-concept"),
		"module-7-architecture": getAudioDuration("agentic-ai-for-beginners/module7-module-7-architecture"),
		"module-7-application": getAudioDuration("agentic-ai-for-beginners/module7-module-7-application"),
		"module-7-exam-mapping": getAudioDuration("agentic-ai-for-beginners/module7-module-7-exam-mapping"),
		"module-7-recap": getAudioDuration("agentic-ai-for-beginners/module7-module-7-recap"),
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
	const addSegment = (audioDuration: number, isLastInGroup: boolean, isLastInModule: boolean, buffer: number) => {
		const slideDuration = audioDuration + buffer;
		const start = currentFrame;
		currentFrame += slideDuration * fps + (isLastInGroup && !isLastInModule ? whooshDuration * fps : 0);
		return { start, duration: slideDuration * fps, slideDuration, audioDuration, buffer };
	};

	const seg0 = addSegment(34.68, true, false, 1);
	const seg1 = addSegment(12.87, false, false, 1);
	const seg2 = addSegment(8.34, false, false, 1);
	const seg3 = addSegment(16.49, false, false, 1);
	const seg4 = addSegment(4.90, false, false, 1);
	const seg5 = addSegment(11.35, false, false, 1);
	const seg6 = addSegment(6.48, false, false, 1);
	const seg7 = addSegment(4.89, false, false, 1);
	const seg8 = addSegment(7.99, true, false, 1);
	const seg9 = addSegment(9.96, false, false, 1);
	const seg10 = addSegment(9.83, false, false, 1);
	const seg11 = addSegment(10.15, false, false, 1);
	const seg12 = addSegment(10.40, false, false, 1);
	const seg13 = addSegment(10.07, false, false, 1);
	const seg14 = addSegment(9.54, false, false, 1);
	const seg15 = addSegment(3.68, false, false, 1);
	const seg16 = addSegment(12.95, true, false, 1);
	const seg17 = addSegment(10.46, false, false, 1);
	const seg18 = addSegment(4.32, false, false, 1);
	const seg19 = addSegment(15.26, false, false, 1);
	const seg20 = addSegment(9.82, false, false, 1);
	const seg21 = addSegment(10.32, false, false, 1);
	const seg22 = addSegment(13.72, false, false, 1);
	const seg23 = addSegment(5.52, true, false, 1);
	const seg24 = addSegment(9.88, false, false, 1);
	const seg25 = addSegment(10.36, false, false, 1);
	const seg26 = addSegment(0.59, false, false, 1);
	const seg27 = addSegment(19.17, false, false, 1);
	const seg28 = addSegment(5.71, true, false, 1);
	const seg29 = addSegment(36.09, true, true, 1.2);

	return (
		<div
			style={{
				width: "100%",
			height: "100%",
			background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
			position: "relative",
		}}
		>
			{/* Agent Architecture Deep Dive */}
			<Sequence
				from={seg0.start}
				durationInFrames={seg0.duration}
			>
				<Audio src={audioFiles["module-7-title"]} />
				<CrossFadeWrapper
					totalDuration={seg0.slideDuration}
					fadeInDuration={0.5}
					fadeOutDuration={crossFadeDuration}
			>
					<TitleSlide 
					title="Agent Architecture Deep Dive" 
					subtitle="Agent Architecture Deep Dive"
					
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg0.start + seg0.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg1.start}
				durationInFrames={seg1.duration}
			>
				<Audio src={audioFiles["module-7-concept"]} />
				<CrossFadeWrapper
					totalDuration={seg1.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg2.start}
				durationInFrames={seg2.duration}
			>
				<Audio src={audioFiles["module-7-concept"]} startFrom={Math.round(12.87 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg2.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg3.start}
				durationInFrames={seg3.duration}
			>
				<Audio src={audioFiles["module-7-concept"]} startFrom={Math.round(21.21 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg3.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg4.start}
				durationInFrames={seg4.duration}
			>
				<Audio src={audioFiles["module-7-concept"]} startFrom={Math.round(37.70 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg4.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg5.start}
				durationInFrames={seg5.duration}
			>
				<Audio src={audioFiles["module-7-concept"]} startFrom={Math.round(42.60 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg5.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg6.start}
				durationInFrames={seg6.duration}
			>
				<Audio src={audioFiles["module-7-concept"]} startFrom={Math.round(53.95 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg6.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg7.start}
				durationInFrames={seg7.duration}
			>
				<Audio src={audioFiles["module-7-concept"]} startFrom={Math.round(60.43 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg7.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg8.start}
				durationInFrames={seg8.duration}
			>
				<Audio src={audioFiles["module-7-concept"]} startFrom={Math.round(65.32 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg8.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg8.start + seg8.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg9.start}
				durationInFrames={seg9.duration}
			>
				<Audio src={audioFiles["module-7-architecture"]} />
				<CrossFadeWrapper
					totalDuration={seg9.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg10.start}
				durationInFrames={seg10.duration}
			>
				<Audio src={audioFiles["module-7-architecture"]} startFrom={Math.round(9.96 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg10.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg11.start}
				durationInFrames={seg11.duration}
			>
				<Audio src={audioFiles["module-7-architecture"]} startFrom={Math.round(19.79 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg11.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg12.start}
				durationInFrames={seg12.duration}
			>
				<Audio src={audioFiles["module-7-architecture"]} startFrom={Math.round(29.94 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg12.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg13.start}
				durationInFrames={seg13.duration}
			>
				<Audio src={audioFiles["module-7-architecture"]} startFrom={Math.round(40.34 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg13.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg14.start}
				durationInFrames={seg14.duration}
			>
				<Audio src={audioFiles["module-7-architecture"]} startFrom={Math.round(50.41 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg14.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg15.start}
				durationInFrames={seg15.duration}
			>
				<Audio src={audioFiles["module-7-architecture"]} startFrom={Math.round(59.95 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg15.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg16.start}
				durationInFrames={seg16.duration}
			>
				<Audio src={audioFiles["module-7-architecture"]} startFrom={Math.round(63.63 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg16.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg16.start + seg16.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg17.start}
				durationInFrames={seg17.duration}
			>
				<Audio src={audioFiles["module-7-application"]} />
				<CrossFadeWrapper
					totalDuration={seg17.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"How do architectural choices affect reliability Single agent systems fail",
					"If the model gets stuck the whole loop stops You need robust stop conditions critical detect"
					]}
					slideName="module-7-application"
					audioDuration={seg17.audioDuration}
					moduleNumber={7}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg18.start}
				durationInFrames={seg18.duration}
			>
				<Audio src={audioFiles["module-7-application"]} startFrom={Math.round(10.46 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg18.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"max step limits and fallbacks",
					"Anti loop guards are"
					]}
					slideName="module-7-application"
					audioDuration={seg18.audioDuration}
					moduleNumber={7}
					
					
					audioStartOffset={10.46}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg19.start}
				durationInFrames={seg19.duration}
			>
				<Audio src={audioFiles["module-7-application"]} startFrom={Math.round(14.78 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg19.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"agent is repeating and either escalate or terminate",
					"Multi agent systems fail in parts One agent can fail while others continue But you need handoff contracts"
					]}
					slideName="module-7-application"
					audioDuration={seg19.audioDuration}
					moduleNumber={7}
					
					
					audioStartOffset={14.78}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg20.start}
				durationInFrames={seg20.duration}
			>
				<Audio src={audioFiles["module-7-application"]} startFrom={Math.round(30.04 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg20.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"Schema enforcement at boundaries prevents cascading",
					"And you need a strategy for partial failure retry"
					]}
					slideName="module-7-application"
					audioDuration={seg20.audioDuration}
					moduleNumber={7}
					
					
					audioStartOffset={30.04}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg21.start}
				durationInFrames={seg21.duration}
			>
				<Audio src={audioFiles["module-7-application"]} startFrom={Math.round(39.86 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg21.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"escalation",
					"Event driven patterns synchronous loop",
					"A queue decouples"
					]}
					slideName="module-7-application"
					audioDuration={seg21.audioDuration}
					moduleNumber={7}
					
					
					audioStartOffset={39.86}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg22.start}
				durationInFrames={seg22.duration}
			>
				<Audio src={audioFiles["module-7-application"]} startFrom={Math.round(50.18 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg22.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"State machines track where each request",
					"This batching backpressure and horizontal scaling When you outgrow a single process",
					"events and queues are the path"
					]}
					slideName="module-7-application"
					audioDuration={seg22.audioDuration}
					moduleNumber={7}
					
					
					audioStartOffset={50.18}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg23.start}
				durationInFrames={seg23.duration}
			>
				<Audio src={audioFiles["module-7-application"]} startFrom={Math.round(63.90 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg23.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"Events and queues → path to batching, backpressure, scaling"
					]}
					slideName="module-7-application"
					audioDuration={seg23.audioDuration}
					moduleNumber={7}
					
					
					audioStartOffset={63.90}
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg23.start + seg23.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg24.start}
				durationInFrames={seg24.duration}
			>
				<Audio src={audioFiles["module-7-exam-mapping"]} />
				<CrossFadeWrapper
					totalDuration={seg24.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"For the NVIDIA certification you'll need to recognize planner executor patterns single versus multi agent tradeoffs a...",
					"Your answer should reference reliability specialization and coordination ..."
					]}
					slideName="module-7-exam-mapping"
					audioDuration={seg24.audioDuration}
					moduleNumber={7}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg25.start}
				durationInFrames={seg25.duration}
			>
				<Audio src={audioFiles["module-7-exam-mapping"]} startFrom={Math.round(9.88 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg25.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"Scenario questions will describe"
					]}
					slideName="module-7-exam-mapping"
					audioDuration={seg25.audioDuration}
					moduleNumber={7}
					
					
					audioStartOffset={9.88}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg26.start}
				durationInFrames={seg26.duration}
			>
				<Audio src={audioFiles["module-7-exam-mapping"]} startFrom={Math.round(20.24 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg26.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"a workload"
					]}
					slideName="module-7-exam-mapping"
					audioDuration={seg26.audioDuration}
					moduleNumber={7}
					
					
					audioStartOffset={20.24}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg27.start}
				durationInFrames={seg27.duration}
			>
				<Audio src={audioFiles["module-7-exam-mapping"]} startFrom={Math.round(20.83 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg27.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"Answer → reliability, specialization, coordination complexity"
					]}
					slideName="module-7-exam-mapping"
					audioDuration={seg27.audioDuration}
					moduleNumber={7}
					
					
					audioStartOffset={20.83}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg28.start}
				durationInFrames={seg28.duration}
			>
				<Audio src={audioFiles["module-7-exam-mapping"]} startFrom={Math.round(40.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg28.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"Key terms → planner, executor, router, orchestrator",
					"Key terms → single-agent, multi-agent, event-driven",
					"Scenario questions → workload described, which architecture fits",
					"Answer → reliability, specialization, coordination complexity"
					]}
					slideName="module-7-exam-mapping"
					audioDuration={seg28.audioDuration}
					moduleNumber={7}
					
					
					audioStartOffset={40.00}
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg28.start + seg28.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg29.start}
				durationInFrames={seg29.duration}
			>
				<Audio src={audioFiles["module-7-recap"]} />
				<CrossFadeWrapper
					totalDuration={seg29.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={0}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"Planner → structures work; Executor → does it; Router → directs; Orchestrator → runs loop",
					"Single-agent → coherent, sequential tasks",
					"Multi-agent → specialized, parallel, fault-isolated",
					"Event-driven → queues, batching, decoupling",
					"Add guards → stop conditions, max steps, fallbacks"
					]}
					slideName="module-7-recap"
					audioDuration={seg29.audioDuration}
					moduleNumber={7}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

		</div>
	);
};
