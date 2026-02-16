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

export const Module9: React.FC = () => {
	const { fps } = useVideoConfig();
	const crossFadeDuration = 0.3;
	const whooshDuration = 0.57;

	const audioFiles = {
		"module-9-title": staticFile("audio/agentic-ai-for-beginners/module9-module-9-title.wav"),
		"module-9-concept": staticFile("audio/agentic-ai-for-beginners/module9-module-9-concept.wav"),
		"module-9-architecture": staticFile("audio/agentic-ai-for-beginners/module9-module-9-architecture.wav"),
		"module-9-application": staticFile("audio/agentic-ai-for-beginners/module9-module-9-application.wav"),
		"module-9-exam-mapping": staticFile("audio/agentic-ai-for-beginners/module9-module-9-exam-mapping.wav"),
		"module-9-recap": staticFile("audio/agentic-ai-for-beginners/module9-module-9-recap.wav"),
		whoosh: staticFile("audio/whoosh.wav"),
	};

	const audioDurations = {
		"module-9-title": getAudioDuration("agentic-ai-for-beginners/module9-module-9-title"),
		"module-9-concept": getAudioDuration("agentic-ai-for-beginners/module9-module-9-concept"),
		"module-9-architecture": getAudioDuration("agentic-ai-for-beginners/module9-module-9-architecture"),
		"module-9-application": getAudioDuration("agentic-ai-for-beginners/module9-module-9-application"),
		"module-9-exam-mapping": getAudioDuration("agentic-ai-for-beginners/module9-module-9-exam-mapping"),
		"module-9-recap": getAudioDuration("agentic-ai-for-beginners/module9-module-9-recap"),
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

	const seg0 = addSegment(33.23, true, false, 1);
	const seg1 = addSegment(10.00, false, false, 1);
	const seg2 = addSegment(10.00, false, false, 1);
	const seg3 = addSegment(10.00, false, false, 1);
	const seg4 = addSegment(10.00, false, false, 1);
	const seg5 = addSegment(10.00, false, false, 1);
	const seg6 = addSegment(10.00, false, false, 1);
	const seg7 = addSegment(2.39, true, false, 1);
	const seg8 = addSegment(10.00, false, false, 1);
	const seg9 = addSegment(10.00, false, false, 1);
	const seg10 = addSegment(10.00, false, false, 1);
	const seg11 = addSegment(10.00, false, false, 1);
	const seg12 = addSegment(10.00, false, false, 1);
	const seg13 = addSegment(10.00, false, false, 1);
	const seg14 = addSegment(10.00, false, false, 1);
	const seg15 = addSegment(10.00, false, false, 1);
	const seg16 = addSegment(10.00, false, false, 1);
	const seg17 = addSegment(10.00, false, false, 1);
	const seg18 = addSegment(0.08, true, false, 1);
	const seg19 = addSegment(10.00, false, false, 1);
	const seg20 = addSegment(10.00, false, false, 1);
	const seg21 = addSegment(10.00, false, false, 1);
	const seg22 = addSegment(10.00, false, false, 1);
	const seg23 = addSegment(10.00, false, false, 1);
	const seg24 = addSegment(10.00, false, false, 1);
	const seg25 = addSegment(10.00, false, false, 1);
	const seg26 = addSegment(9.66, true, false, 1);
	const seg27 = addSegment(10.06, false, false, 1);
	const seg28 = addSegment(10.06, false, false, 1);
	const seg29 = addSegment(10.07, false, false, 1);
	const seg30 = addSegment(4.87, true, false, 1);
	const seg31 = addSegment(10.00, false, false, 1);
	const seg32 = addSegment(10.00, false, false, 1);
	const seg33 = addSegment(10.00, false, false, 1);
	const seg34 = addSegment(3.16, true, true, 1.2);

	return (
		<div
			style={{
				width: "100%",
			height: "100%",
			background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
			position: "relative",
		}}
		>
			{/* NVIDIA Inference Optimization */}
			<Sequence
				from={seg0.start}
				durationInFrames={seg0.duration}
			>
				<Audio src={audioFiles["module-9-title"]} />
				<CrossFadeWrapper
					totalDuration={seg0.slideDuration}
					fadeInDuration={0.5}
					fadeOutDuration={crossFadeDuration}
			>
					<TitleSlide 
					title="NVIDIA Inference Optimization" 
					subtitle="NVIDIA Inference Optimization"
					
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
				<Audio src={audioFiles["module-9-concept"]} />
				<CrossFadeWrapper
					totalDuration={seg1.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"Let's frame the problem Agents make multiple model calls per user interaction A single request might trigger five"
					]}
					slideName="module-9-concept"
					audioDuration={seg1.audioDuration}
					moduleNumber={9}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg2.start}
				durationInFrames={seg2.duration}
			>
				<Audio src={audioFiles["module-9-concept"]} startFrom={Math.round(10.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg2.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"calls as the agent plans retrieves acts and reflects",
					"Each call has latency Each call has cost"
					]}
					slideName="module-9-concept"
					audioDuration={seg2.audioDuration}
					moduleNumber={9}
					
					
					audioStartOffset={10.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg3.start}
				durationInFrames={seg3.duration}
			>
				<Audio src={audioFiles["module-9-concept"]} startFrom={Math.round(20.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg3.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"At scale small improvements compound",
					"A ten percent latency reduction across ten calls saves a second per request"
					]}
					slideName="module-9-concept"
					audioDuration={seg3.audioDuration}
					moduleNumber={9}
					
					
					audioStartOffset={20.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg4.start}
				durationInFrames={seg4.duration}
			>
				<Audio src={audioFiles["module-9-concept"]} startFrom={Math.round(30.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg4.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"A ten percent cost reduction across millions of requests saves real money",
					"GPU inference behaves differently from CPU"
					]}
					slideName="module-9-concept"
					audioDuration={seg4.audioDuration}
					moduleNumber={9}
					
					
					audioStartOffset={30.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg5.start}
				durationInFrames={seg5.duration}
			>
				<Audio src={audioFiles["module-9-concept"]} startFrom={Math.round(40.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg5.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"CPU GPUs are built for parallel computation They excel at batch processing run many requests together and throughput"
					]}
					slideName="module-9-concept"
					audioDuration={seg5.audioDuration}
					moduleNumber={9}
					
					
					audioStartOffset={40.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg6.start}
				durationInFrames={seg6.duration}
			>
				<Audio src={audioFiles["module-9-concept"]} startFrom={Math.round(50.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg6.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"So there's a tradeoff low latency with small"
					]}
					slideName="module-9-concept"
					audioDuration={seg6.audioDuration}
					moduleNumber={9}
					
					
					audioStartOffset={50.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg7.start}
				durationInFrames={seg7.duration}
			>
				<Audio src={audioFiles["module-9-concept"]} startFrom={Math.round(60.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg7.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"The right choice depends on your workload"
					]}
					slideName="module-9-concept"
					audioDuration={seg7.audioDuration}
					moduleNumber={9}
					
					
					audioStartOffset={60.00}
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg7.start + seg7.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg8.start}
				durationInFrames={seg8.duration}
			>
				<Audio src={audioFiles["module-9-architecture"]} />
				<CrossFadeWrapper
					totalDuration={seg8.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"How do Triton and TensorRT fit into this Triton Inference Server handles the mechanics of serving It manages"
					]}
					slideName="module-9-architecture"
					audioDuration={seg8.audioDuration}
					moduleNumber={9}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg9.start}
				durationInFrames={seg9.duration}
			>
				<Audio src={audioFiles["module-9-architecture"]} startFrom={Math.round(10.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg9.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Triton supports dynamic batching incoming requests are queued and batched together before inference You co..."
					]}
					slideName="module-9-architecture"
					audioDuration={seg9.audioDuration}
					moduleNumber={9}
					
					
					audioStartOffset={10.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg10.start}
				durationInFrames={seg10.duration}
			>
				<Audio src={audioFiles["module-9-architecture"]} startFrom={Math.round(20.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg10.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Triton finds the sweet spot Turn on batching",
					"The cost added latency from waiting"
					]}
					slideName="module-9-architecture"
					audioDuration={seg10.audioDuration}
					moduleNumber={9}
					
					
					audioStartOffset={20.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg11.start}
				durationInFrames={seg11.duration}
			>
				<Audio src={audioFiles["module-9-architecture"]} startFrom={Math.round(30.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg11.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"For agent workloads with variable arrival rates dynamic batching is often worth",
					"Triton also supports concurrent model execution"
					]}
					slideName="module-9-architecture"
					audioDuration={seg11.audioDuration}
					moduleNumber={9}
					
					
					audioStartOffset={30.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg12.start}
				durationInFrames={seg12.duration}
			>
				<Audio src={audioFiles["module-9-architecture"]} startFrom={Math.round(40.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg12.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Multiple models can run on the same GPU",
					"or requests can be distributed across multiple GPUs",
					"Concurrency increases throughput when you have multiple models for example"
					]}
					slideName="module-9-architecture"
					audioDuration={seg12.audioDuration}
					moduleNumber={9}
					
					
					audioStartOffset={40.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg13.start}
				durationInFrames={seg13.duration}
			>
				<Audio src={audioFiles["module-9-architecture"]} startFrom={Math.round(50.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg13.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"The tradeoff",
					"GPU memory Each model instance consumes memory"
					]}
					slideName="module-9-architecture"
					audioDuration={seg13.audioDuration}
					moduleNumber={9}
					
					
					audioStartOffset={50.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg14.start}
				durationInFrames={seg14.duration}
			>
				<Audio src={audioFiles["module-9-architecture"]} startFrom={Math.round(60.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg14.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"You need to balance concurrency with memory limits TensorRT optimizes",
					"It compiles the model into an optimized"
					]}
					slideName="module-9-architecture"
					audioDuration={seg14.audioDuration}
					moduleNumber={9}
					
					
					audioStartOffset={60.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg15.start}
				durationInFrames={seg15.duration}
			>
				<Audio src={audioFiles["module-9-architecture"]} startFrom={Math.round(70.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg15.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"The result faster inference lower latency and often lower memory use",
					"TensorRT is especially"
					]}
					slideName="module-9-architecture"
					audioDuration={seg15.audioDuration}
					moduleNumber={9}
					
					
					audioStartOffset={70.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg16.start}
				durationInFrames={seg16.duration}
			>
				<Audio src={audioFiles["module-9-architecture"]} startFrom={Math.round(80.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg16.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"performance",
					"The tradeoff compilation"
					]}
					slideName="module-9-architecture"
					audioDuration={seg16.audioDuration}
					moduleNumber={9}
					
					
					audioStartOffset={80.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg17.start}
				durationInFrames={seg17.duration}
			>
				<Audio src={audioFiles["module-9-architecture"]} startFrom={Math.round(90.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg17.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"You optimize for a specific GPU and batch size",
					"Change the target and you may need to recompile"
					]}
					slideName="module-9-architecture"
					audioDuration={seg17.audioDuration}
					moduleNumber={9}
					
					
					audioStartOffset={90.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg18.start}
				durationInFrames={seg18.duration}
			>
				<Audio src={audioFiles["module-9-architecture"]} startFrom={Math.round(100.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg18.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Change the target and you may need to recompile"
					]}
					slideName="module-9-architecture"
					audioDuration={seg18.audioDuration}
					moduleNumber={9}
					
					
					audioStartOffset={100.00}
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg18.start + seg18.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg19.start}
				durationInFrames={seg19.duration}
			>
				<Audio src={audioFiles["module-9-application"]} />
				<CrossFadeWrapper
					totalDuration={seg19.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"When does each technique help Batching",
					"Use it when throughput matters more than latency Batch size of four or eight often doubles throughput with modest"
					]}
					slideName="module-9-application"
					audioDuration={seg19.audioDuration}
					moduleNumber={9}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg20.start}
				durationInFrames={seg20.duration}
			>
				<Audio src={audioFiles["module-9-application"]} startFrom={Math.round(10.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg20.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"For background processing research pipelines or high volume APIs",
					"For real time chat where every millisecond"
					]}
					slideName="module-9-application"
					audioDuration={seg20.audioDuration}
					moduleNumber={9}
					
					
					audioStartOffset={10.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg21.start}
				durationInFrames={seg21.duration}
			>
				<Audio src={audioFiles["module-9-application"]} startFrom={Math.round(20.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg21.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"Concurrency Use it when you serve multiple",
					"models or concurrent users Run"
					]}
					slideName="module-9-application"
					audioDuration={seg21.audioDuration}
					moduleNumber={9}
					
					
					audioStartOffset={20.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg22.start}
				durationInFrames={seg22.duration}
			>
				<Audio src={audioFiles["module-9-application"]} startFrom={Math.round(30.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg22.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"GPU if memory allows Scale out to multiple GPUs",
					"GPU is saturated Monitor GPU"
					]}
					slideName="module-9-application"
					audioDuration={seg22.audioDuration}
					moduleNumber={9}
					
					
					audioStartOffset={30.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg23.start}
				durationInFrames={seg23.duration}
			>
				<Audio src={audioFiles["module-9-application"]} startFrom={Math.round(40.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg23.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"utilization if it's below eighty percent you have headroom for more",
					"TensorRT Use it when latency and cost are critical"
					]}
					slideName="module-9-application"
					audioDuration={seg23.audioDuration}
					moduleNumber={9}
					
					
					audioStartOffset={40.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg24.start}
				durationInFrames={seg24.duration}
			>
				<Audio src={audioFiles["module-9-application"]} startFrom={Math.round(50.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg24.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"The compilation step is one time The gains are permanent For agent workloads TensorRT can cut latency by twenty"
					]}
					slideName="module-9-application"
					audioDuration={seg24.audioDuration}
					moduleNumber={9}
					
					
					audioStartOffset={50.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg25.start}
				durationInFrames={seg25.duration}
			>
				<Audio src={audioFiles["module-9-application"]} startFrom={Math.round(60.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg25.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"Baseline first Measure latency throughput and cost before"
					]}
					slideName="module-9-application"
					audioDuration={seg25.audioDuration}
					moduleNumber={9}
					
					
					audioStartOffset={60.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg26.start}
				durationInFrames={seg26.duration}
			>
				<Audio src={audioFiles["module-9-application"]} startFrom={Math.round(70.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg26.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"Then turn on batching and compare Then add TensorRT",
					"The numbers will tell you what's worth"
					]}
					slideName="module-9-application"
					audioDuration={seg26.audioDuration}
					moduleNumber={9}
					
					
					audioStartOffset={70.00}
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg26.start + seg26.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg27.start}
				durationInFrames={seg27.duration}
			>
				<Audio src={audioFiles["module-9-exam-mapping"]} />
				<CrossFadeWrapper
					totalDuration={seg27.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"The NVIDIA certification will ask why GPU inference behaves differently from CPU and when optimization techniques imp..."
					]}
					slideName="module-9-exam-mapping"
					audioDuration={seg27.audioDuration}
					moduleNumber={9}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg28.start}
				durationInFrames={seg28.duration}
			>
				<Audio src={audioFiles["module-9-exam-mapping"]} startFrom={Math.round(10.06 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg28.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"TensorRT Triton GPU utilization"
					]}
					slideName="module-9-exam-mapping"
					audioDuration={seg28.audioDuration}
					moduleNumber={9}
					
					
					audioStartOffset={10.06}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg29.start}
				durationInFrames={seg29.duration}
			>
				<Audio src={audioFiles["module-9-exam-mapping"]} startFrom={Math.round(20.12 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg29.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"You'll need to explain the latency throughput tradeoff batching increases throughput but can add latency"
					]}
					slideName="module-9-exam-mapping"
					audioDuration={seg29.audioDuration}
					moduleNumber={9}
					
					
					audioStartOffset={20.12}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg30.start}
				durationInFrames={seg30.duration}
			>
				<Audio src={audioFiles["module-9-exam-mapping"]} startFrom={Math.round(30.19 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg30.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"TensorRT and Triton optimizations apply"
					]}
					slideName="module-9-exam-mapping"
					audioDuration={seg30.audioDuration}
					moduleNumber={9}
					
					
					audioStartOffset={30.19}
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg30.start + seg30.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg31.start}
				durationInFrames={seg31.duration}
			>
				<Audio src={audioFiles["module-9-recap"]} />
				<CrossFadeWrapper
					totalDuration={seg31.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"GPU inference excels at parallel",
					"Batching increases throughput the cost is latency Concurrency scales when you have multiple"
					]}
					slideName="module-9-recap"
					audioDuration={seg31.audioDuration}
					moduleNumber={9}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg32.start}
				durationInFrames={seg32.duration}
			>
				<Audio src={audioFiles["module-9-recap"]} startFrom={Math.round(10.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg32.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"TensorRT optimizes the model for lower latency and cost",
					"Measure first Then apply batching"
					]}
					slideName="module-9-recap"
					audioDuration={seg32.audioDuration}
					moduleNumber={9}
					
					
					audioStartOffset={10.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg33.start}
				durationInFrames={seg33.duration}
			>
				<Audio src={audioFiles["module-9-recap"]} startFrom={Math.round(20.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg33.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"TensorRT based on your workload",
					"For agents the combination of Triton batching TensorRT optimization"
					]}
					slideName="module-9-recap"
					audioDuration={seg33.audioDuration}
					moduleNumber={9}
					
					
					audioStartOffset={20.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg34.start}
				durationInFrames={seg34.duration}
			>
				<Audio src={audioFiles["module-9-recap"]} startFrom={Math.round(30.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg34.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={0}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"performance"
					]}
					slideName="module-9-recap"
					audioDuration={seg34.audioDuration}
					moduleNumber={9}
					
					
					audioStartOffset={30.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

		</div>
	);
};
