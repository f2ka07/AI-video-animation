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
	const addSegment = (audioDuration: number, isLastInGroup: boolean, isLastInModule: boolean, buffer: number) => {
		const slideDuration = audioDuration + buffer;
		const start = currentFrame;
		currentFrame += slideDuration * fps + (isLastInGroup && !isLastInModule ? whooshDuration * fps : 0);
		return { start, duration: slideDuration * fps, slideDuration, audioDuration, buffer };
	};

	const seg0 = addSegment(57.30, true, false, 1);
	const seg1 = addSegment(10.14, false, false, 1);
	const seg2 = addSegment(9.92, false, false, 1);
	const seg3 = addSegment(9.96, false, false, 1);
	const seg4 = addSegment(9.94, false, false, 1);
	const seg5 = addSegment(10.34, false, false, 1);
	const seg6 = addSegment(9.24, false, false, 1);
	const seg7 = addSegment(10.70, false, false, 1);
	const seg8 = addSegment(3.83, true, false, 1);
	const seg9 = addSegment(10.56, false, false, 1);
	const seg10 = addSegment(9.76, false, false, 1);
	const seg11 = addSegment(9.68, false, false, 1);
	const seg12 = addSegment(10.15, false, false, 1);
	const seg13 = addSegment(10.00, false, false, 1);
	const seg14 = addSegment(9.95, false, false, 1);
	const seg15 = addSegment(9.83, false, false, 1);
	const seg16 = addSegment(8.93, false, false, 1);
	const seg17 = addSegment(11.85, false, false, 1);
	const seg18 = addSegment(9.41, false, false, 1);
	const seg19 = addSegment(8.16, false, false, 1);
	const seg20 = addSegment(11.61, false, false, 1);
	const seg21 = addSegment(10.29, false, false, 1);
	const seg22 = addSegment(8.51, false, false, 1);
	const seg23 = addSegment(11.33, false, false, 1);
	const seg24 = addSegment(10.08, false, false, 1);
	const seg25 = addSegment(10.29, false, false, 1);
	const seg26 = addSegment(9.41, false, false, 1);
	const seg27 = addSegment(10.08, false, false, 1);
	const seg28 = addSegment(10.30, false, false, 1);
	const seg29 = addSegment(9.84, false, false, 1);
	const seg30 = addSegment(9.78, false, false, 1);
	const seg31 = addSegment(10.20, false, false, 1);
	const seg32 = addSegment(10.05, false, false, 1);
	const seg33 = addSegment(9.95, false, false, 1);
	const seg34 = addSegment(5.22, true, false, 1);
	const seg35 = addSegment(9.45, false, false, 1);
	const seg36 = addSegment(10.63, false, false, 1);
	const seg37 = addSegment(9.73, false, false, 1);
	const seg38 = addSegment(10.34, false, false, 1);
	const seg39 = addSegment(9.83, false, false, 1);
	const seg40 = addSegment(10.01, false, false, 1);
	const seg41 = addSegment(10.00, false, false, 1);
	const seg42 = addSegment(10.29, false, false, 1);
	const seg43 = addSegment(9.74, false, false, 1);
	const seg44 = addSegment(9.94, false, false, 1);
	const seg45 = addSegment(0.84, true, false, 1);
	const seg46 = addSegment(10.16, false, false, 1);
	const seg47 = addSegment(9.27, false, false, 1);
	const seg48 = addSegment(9.83, false, false, 1);
	const seg49 = addSegment(10.60, false, false, 1);
	const seg50 = addSegment(10.50, false, false, 1);
	const seg51 = addSegment(9.42, false, false, 1);
	const seg52 = addSegment(10.28, false, false, 1);
	const seg53 = addSegment(4.21, true, false, 1);
	const seg54 = addSegment(9.83, false, false, 1);
	const seg55 = addSegment(10.23, false, false, 1);
	const seg56 = addSegment(10.59, false, false, 1);
	const seg57 = addSegment(9.92, false, false, 1);
	const seg58 = addSegment(9.54, false, false, 1);
	const seg59 = addSegment(9.93, false, false, 1);
	const seg60 = addSegment(2.36, true, true, 1.2);

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
				from={seg0.start}
				durationInFrames={seg0.duration}
			>
				<Audio src={audioFiles["module-3-title"]} />
				<CrossFadeWrapper
					totalDuration={seg0.slideDuration}
					fadeInDuration={0.5}
					fadeOutDuration={crossFadeDuration}
			>
					<TitleSlide 
					title="NVIDIA AI Platform Stack" 
					subtitle="NVIDIA AI Platform Stack"
					
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
				<Audio src={audioFiles["module-3-concept"]} />
				<CrossFadeWrapper
					totalDuration={seg1.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"Let's frame the problem before we introduce the solution",
					"Building AI systems at production scale is hard",
					"Not because the models are hard although they are"
					]}
					slideName="module-3-concept"
					audioDuration={seg1.audioDuration}
					moduleNumber={3}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg2.start}
				durationInFrames={seg2.duration}
			>
				<Audio src={audioFiles["module-3-concept"]} startFrom={Math.round(10.14 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg2.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"but because the infrastructure is complex",
					"You need GPUs You need software that extracts performance from those GPUs You need inference servers"
					]}
					slideName="module-3-concept"
					audioDuration={seg2.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={10.14}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg3.start}
				durationInFrames={seg3.duration}
			>
				<Audio src={audioFiles["module-3-concept"]} startFrom={Math.round(20.06 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg3.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"You need model deployment that's reliable and reproducible",
					"And you need integration surfaces that connect your"
					]}
					slideName="module-3-concept"
					audioDuration={seg3.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={20.06}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg4.start}
				durationInFrames={seg4.duration}
			>
				<Audio src={audioFiles["module-3-concept"]} startFrom={Math.round(30.02 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg4.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"AI to the rest of your enterprise",
					"Historically companies built this themselves",
					"They stitched together open source tools custom scripts and cloud services"
					]}
					slideName="module-3-concept"
					audioDuration={seg4.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={30.02}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg5.start}
				durationInFrames={seg5.duration}
			>
				<Audio src={audioFiles["module-3-concept"]} startFrom={Math.round(39.96 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg5.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"It worked but it was fragile",
					"Every layer was a potential failure point",
					"Every upgrade was a risk",
					"NVIDIA's response is to provide"
					]}
					slideName="module-3-concept"
					audioDuration={seg5.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={39.96}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg6.start}
				durationInFrames={seg6.duration}
			>
				<Audio src={audioFiles["module-3-concept"]} startFrom={Math.round(50.30 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg6.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"Not just hardware not just software A coherent platform where each layer is designed to work"
					]}
					slideName="module-3-concept"
					audioDuration={seg6.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={50.30}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg7.start}
				durationInFrames={seg7.duration}
			>
				<Audio src={audioFiles["module-3-concept"]} startFrom={Math.round(59.54 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg7.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"This is what we call the NVIDIA AI Platform Stack The goal is simple",
					"Reduce the complexity of deploying AI at scale",
					"Let engineers focus"
					]}
					slideName="module-3-concept"
					audioDuration={seg7.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={59.54}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg8.start}
				durationInFrames={seg8.duration}
			>
				<Audio src={audioFiles["module-3-concept"]} startFrom={Math.round(70.24 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg8.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"on applications not infrastructure plumbing"
					]}
					slideName="module-3-concept"
					audioDuration={seg8.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={70.24}
		/>
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
				<Audio src={audioFiles["module-3-architecture"]} />
				<CrossFadeWrapper
					totalDuration={seg9.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"The stack has five major layers Let's walk through each",
					"Layer 1 Hardware At the base is NVIDIA's GPU",
					"This includes the data center GPUs It and gRPC"
					]}
					slideName="module-3-architecture"
					audioDuration={seg9.audioDuration}
					moduleNumber={3}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg10.start}
				durationInFrames={seg10.duration}
			>
				<Audio src={audioFiles["module-3-architecture"]} startFrom={Math.round(10.56 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg10.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"H100 and the newer Blackwell architecture networking fabric like NVLink",
					"InfiniBand for multi GPU communication"
					]}
					slideName="module-3-architecture"
					audioDuration={seg10.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={10.56}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg11.start}
				durationInFrames={seg11.duration}
			>
				<Audio src={audioFiles["module-3-architecture"]} startFrom={Math.round(20.32 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg11.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"The hardware layer is purpose built for AI It's",
					"optimized for the"
					]}
					slideName="module-3-architecture"
					audioDuration={seg11.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={20.32}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg12.start}
				durationInFrames={seg12.duration}
			>
				<Audio src={audioFiles["module-3-architecture"]} startFrom={Math.round(30.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg12.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"GPUs to clusters with thousands"
					]}
					slideName="module-3-architecture"
					audioDuration={seg12.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={30.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg13.start}
				durationInFrames={seg13.duration}
			>
				<Audio src={audioFiles["module-3-architecture"]} startFrom={Math.round(40.15 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg13.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"For technical leaders it's about capital expenditure vendor ..."
					]}
					slideName="module-3-architecture"
					audioDuration={seg13.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={40.15}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg14.start}
				durationInFrames={seg14.duration}
			>
				<Audio src={audioFiles["module-3-architecture"]} startFrom={Math.round(50.15 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg14.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Layer 2 Acceleration On top of the hardware sits the acceleration layer",
					"This is where CUDA lives CUDA"
					]}
					slideName="module-3-architecture"
					audioDuration={seg14.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={50.15}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg15.start}
				durationInFrames={seg15.duration}
			>
				<Audio src={audioFiles["module-3-architecture"]} startFrom={Math.round(60.10 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg15.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"NVIDIA's parallel computing platform It's the software interface that lets developers write code that runs on GPUs"
					]}
					slideName="module-3-architecture"
					audioDuration={seg15.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={60.10}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg16.start}
				durationInFrames={seg16.duration}
			>
				<Audio src={audioFiles["module-3-architecture"]} startFrom={Math.round(69.93 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg16.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"CUDA is low level",
					"Most AI workloads don't use it directly Instead they use libraries built on CUDA"
					]}
					slideName="module-3-architecture"
					audioDuration={seg16.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={69.93}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg17.start}
				durationInFrames={seg17.duration}
			>
				<Audio src={audioFiles["module-3-architecture"]} startFrom={Math.round(78.86 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg17.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"cuDNN for deep learning primitives cuBLAS for linear algebra and most importantly TensorRT",
					"TensorRT is NVIDIA's inference optimization"
					]}
					slideName="module-3-architecture"
					audioDuration={seg17.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={78.86}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg18.start}
				durationInFrames={seg18.duration}
			>
				<Audio src={audioFiles["module-3-architecture"]} startFrom={Math.round(90.71 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg18.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"It takes a trained model and compiles it into a highly optimized execution graph The result is faster"
					]}
					slideName="module-3-architecture"
					audioDuration={seg18.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={90.71}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg19.start}
				durationInFrames={seg19.duration}
			>
				<Audio src={audioFiles["module-3-architecture"]} startFrom={Math.round(100.12 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg19.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"TensorRT is the engine that makes production inference economically viable"
					]}
					slideName="module-3-architecture"
					audioDuration={seg19.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={100.12}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg20.start}
				durationInFrames={seg20.duration}
			>
				<Audio src={audioFiles["module-3-architecture"]} startFrom={Math.round(108.28 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg20.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Layer 3 Inference Serving Once you have an optimized model you need to serve it That's where Triton"
					]}
					slideName="module-3-architecture"
					audioDuration={seg20.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={108.28}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg21.start}
				durationInFrames={seg21.duration}
			>
				<Audio src={audioFiles["module-3-architecture"]} startFrom={Math.round(119.89 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg21.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"It handles the mechanics of running models in production",
					"request batching model versioning multi",
					"model serving"
					]}
					slideName="module-3-architecture"
					audioDuration={seg21.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={119.89}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg22.start}
				durationInFrames={seg22.duration}
			>
				<Audio src={audioFiles["module-3-architecture"]} startFrom={Math.round(130.18 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg22.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"GPU scheduling and health monitoring Triton supports multiple model formats including TensorRT"
					]}
					slideName="module-3-architecture"
					audioDuration={seg22.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={130.18}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg23.start}
				durationInFrames={seg23.duration}
			>
				<Audio src={audioFiles["module-3-architecture"]} startFrom={Math.round(138.69 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg23.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"PyTorch TensorFlow and ONNX provides HTTP APIs out of the box And it integrates with Kubernetes"
					]}
					slideName="module-3-architecture"
					audioDuration={seg23.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={138.69}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg24.start}
				durationInFrames={seg24.duration}
			>
				<Audio src={audioFiles["module-3-architecture"]} startFrom={Math.round(150.02 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg24.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Kubernetes for orchestration For any serious production deployment Triton is the default starting point Layer 4",
					"Model and Runtime Surfaces This is where"
					]}
					slideName="module-3-architecture"
					audioDuration={seg24.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={150.02}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg25.start}
				durationInFrames={seg25.duration}
			>
				<Audio src={audioFiles["module-3-architecture"]} startFrom={Math.round(160.10 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg25.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"NeMo and NIM enter the picture",
					"NeMo is NVIDIA's framework for building customizing and training large language models",
					"It provides"
					]}
					slideName="module-3-architecture"
					audioDuration={seg25.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={160.10}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg26.start}
				durationInFrames={seg26.duration}
			>
				<Audio src={audioFiles["module-3-architecture"]} startFrom={Math.round(170.39 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg26.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"If you're training or customizing models"
					]}
					slideName="module-3-architecture"
					audioDuration={seg26.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={170.39}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg27.start}
				durationInFrames={seg27.duration}
			>
				<Audio src={audioFiles["module-3-architecture"]} startFrom={Math.round(179.80 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg27.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"NeMo is the toolkit NIM",
					"NVIDIA Inference Microservices is the deployment surface NIMs are pre packaged optimized containers"
					]}
					slideName="module-3-architecture"
					audioDuration={seg27.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={179.80}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg28.start}
				durationInFrames={seg28.duration}
			>
				<Audio src={audioFiles["module-3-architecture"]} startFrom={Math.round(189.88 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg28.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"that wrap a model with TensorRT",
					"TensorRT optimization and Triton serving You pull a NIM run it and you have a production ready inference"
					]}
					slideName="module-3-architecture"
					audioDuration={seg28.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={189.88}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg29.start}
				durationInFrames={seg29.duration}
			>
				<Audio src={audioFiles["module-3-architecture"]} startFrom={Math.round(200.18 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg29.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"No infrastructure configuration Just deploy",
					"NIMs are designed for agentic workloads They provide"
					]}
					slideName="module-3-architecture"
					audioDuration={seg29.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={200.18}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg30.start}
				durationInFrames={seg30.duration}
			>
				<Audio src={audioFiles["module-3-architecture"]} startFrom={Math.round(210.02 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg30.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"low latency high throughput inference with built in support for streaming function calling and tool use If you're"
					]}
					slideName="module-3-architecture"
					audioDuration={seg30.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={210.02}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg31.start}
				durationInFrames={seg31.duration}
			>
				<Audio src={audioFiles["module-3-architecture"]} startFrom={Math.round(219.80 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg31.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"NIMs are how you deploy the underlying models",
					"Layer 5 Application Layer At the top of the stack is the application layer This is where"
					]}
					slideName="module-3-architecture"
					audioDuration={seg31.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={219.80}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg32.start}
				durationInFrames={seg32.duration}
			>
				<Audio src={audioFiles["module-3-architecture"]} startFrom={Math.round(230.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg32.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"It's where you orchestrate NIMs with planning logic tool integrations memory systems and sa..."
					]}
					slideName="module-3-architecture"
					audioDuration={seg32.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={230.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg33.start}
				durationInFrames={seg33.duration}
			>
				<Audio src={audioFiles["module-3-architecture"]} startFrom={Math.round(240.05 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg33.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"NVIDIA provides blueprints and reference architectures but this layer is where your differentiation happens The stack..."
					]}
					slideName="module-3-architecture"
					audioDuration={seg33.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={240.05}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg34.start}
				durationInFrames={seg34.duration}
			>
				<Audio src={audioFiles["module-3-architecture"]} startFrom={Math.round(250.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg34.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"NIM is platform The application layer is where you build"
					]}
					slideName="module-3-architecture"
					audioDuration={seg34.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={250.00}
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg34.start + seg34.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg35.start}
				durationInFrames={seg35.duration}
			>
				<Audio src={audioFiles["module-3-application"]} />
				<CrossFadeWrapper
					totalDuration={seg35.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"Why does this stack matter for agentic",
					"AI Because agents are latency sensitive",
					"compute intensive and operationally complex"
					]}
					slideName="module-3-application"
					audioDuration={seg35.audioDuration}
					moduleNumber={3}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg36.start}
				durationInFrames={seg36.duration}
			>
				<Audio src={audioFiles["module-3-application"]} startFrom={Math.round(9.45 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg36.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"They make multiple model calls per user interaction",
					"They require fast inference for responsive loops And they need reliable deployment"
					]}
					slideName="module-3-application"
					audioDuration={seg36.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={9.45}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg37.start}
				durationInFrames={seg37.duration}
			>
				<Audio src={audioFiles["module-3-application"]} startFrom={Math.round(20.08 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg37.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"The NVIDIA stack addresses each of these TensorRT optimizes the model Triton handles serving"
					]}
					slideName="module-3-application"
					audioDuration={seg37.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={20.08}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg38.start}
				durationInFrames={seg38.duration}
			>
				<Audio src={audioFiles["module-3-application"]} startFrom={Math.round(29.81 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg38.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"NIM packages everything for deployment The result is infrastructure that can support agentic workloads without custom..."
					]}
					slideName="module-3-application"
					audioDuration={seg38.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={29.81}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg39.start}
				durationInFrames={seg39.duration}
			>
				<Audio src={audioFiles["module-3-application"]} startFrom={Math.round(40.15 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg39.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"Compare this to the alternative calling a third party API for every inference You're subject"
					]}
					slideName="module-3-application"
					audioDuration={seg39.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={40.15}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg40.start}
				durationInFrames={seg40.duration}
			>
				<Audio src={audioFiles["module-3-application"]} startFrom={Math.round(49.98 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg40.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"For enterprise workloads that require control compliance and cost predict..."
					]}
					slideName="module-3-application"
					audioDuration={seg40.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={49.98}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg41.start}
				durationInFrames={seg41.duration}
			>
				<Audio src={audioFiles["module-3-application"]} startFrom={Math.round(59.99 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg41.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"The NVIDIA stack gives you another option run the inference yourself on your infrastructure with tooling..."
					]}
					slideName="module-3-application"
					audioDuration={seg41.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={59.99}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg42.start}
				durationInFrames={seg42.duration}
			>
				<Audio src={audioFiles["module-3-application"]} startFrom={Math.round(69.99 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg42.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"For many enterprises that's the deciding factor From an engineer's perspective the stack reduces time to production"
					]}
					slideName="module-3-application"
					audioDuration={seg42.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={69.99}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg43.start}
				durationInFrames={seg43.duration}
			>
				<Audio src={audioFiles["module-3-application"]} startFrom={Math.round(80.28 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg43.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"You focus on the application logic From a technical leader's perspective the stack reduces risk"
					]}
					slideName="module-3-application"
					audioDuration={seg43.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={80.28}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg44.start}
				durationInFrames={seg44.duration}
			>
				<Audio src={audioFiles["module-3-application"]} startFrom={Math.round(90.02 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg44.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"You're building on a supported platform with a clear upgrade path and enterprise support",
					"You're not dependent on a fragile chain of open source"
					]}
					slideName="module-3-application"
					audioDuration={seg44.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={90.02}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg45.start}
				durationInFrames={seg45.duration}
			>
				<Audio src={audioFiles["module-3-application"]} startFrom={Math.round(99.96 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg45.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"You're not dependent on a fragile chain of open source"
					]}
					slideName="module-3-application"
					audioDuration={seg45.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={99.96}
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg45.start + seg45.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg46.start}
				durationInFrames={seg46.duration}
			>
				<Audio src={audioFiles["module-3-exam-mapping"]} />
				<CrossFadeWrapper
					totalDuration={seg46.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"For the certification exam you'll need to understand the platform stack at a conceptual level Expect questions about"
					]}
					slideName="module-3-exam-mapping"
					audioDuration={seg46.audioDuration}
					moduleNumber={3}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg47.start}
				durationInFrames={seg47.duration}
			>
				<Audio src={audioFiles["module-3-exam-mapping"]} startFrom={Math.round(10.16 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg47.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"What problem does Triton solve What is NIM",
					"You should understand the relationship between layers TensorRT"
					]}
					slideName="module-3-exam-mapping"
					audioDuration={seg47.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={10.16}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg48.start}
				durationInFrames={seg48.duration}
			>
				<Audio src={audioFiles["module-3-exam-mapping"]} startFrom={Math.round(19.43 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg48.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"Triton serves them NIM packages both for deployment That flow is testable Pay attention to deployment"
					]}
					slideName="module-3-exam-mapping"
					audioDuration={seg48.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={19.43}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg49.start}
				durationInFrames={seg49.duration}
			>
				<Audio src={audioFiles["module-3-exam-mapping"]} startFrom={Math.round(29.26 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg49.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"The exam may ask about on premises versus cloud versus edge deployment",
					"Understand the tradeoffs latency"
					]}
					slideName="module-3-exam-mapping"
					audioDuration={seg49.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={29.26}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg50.start}
				durationInFrames={seg50.duration}
			>
				<Audio src={audioFiles["module-3-exam-mapping"]} startFrom={Math.round(39.86 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg50.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"NIM is particularly important",
					"It's NVIDIA's primary interface for agentic deployment Know"
					]}
					slideName="module-3-exam-mapping"
					audioDuration={seg50.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={39.86}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg51.start}
				durationInFrames={seg51.duration}
			>
				<Audio src={audioFiles["module-3-exam-mapping"]} startFrom={Math.round(50.36 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg51.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"Finally understand"
					]}
					slideName="module-3-exam-mapping"
					audioDuration={seg51.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={50.36}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg52.start}
				durationInFrames={seg52.duration}
			>
				<Audio src={audioFiles["module-3-exam-mapping"]} startFrom={Math.round(59.78 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg52.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"why a unified stack matters",
					"The exam tests platform understanding not just component knowledge You should be able to articulate why"
					]}
					slideName="module-3-exam-mapping"
					audioDuration={seg52.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={59.78}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg53.start}
				durationInFrames={seg53.duration}
			>
				<Audio src={audioFiles["module-3-exam-mapping"]} startFrom={Math.round(70.06 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg53.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"enterprises choose an integrated platform over piecemeal solutions"
					]}
					slideName="module-3-exam-mapping"
					audioDuration={seg53.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={70.06}
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg53.start + seg53.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg54.start}
				durationInFrames={seg54.duration}
			>
				<Audio src={audioFiles["module-3-recap"]} />
				<CrossFadeWrapper
					totalDuration={seg54.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"Let's lock in the essentials NVIDIA is not just a GPU company It's a full stack AI platform"
					]}
					slideName="module-3-recap"
					audioDuration={seg54.audioDuration}
					moduleNumber={3}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg55.start}
				durationInFrames={seg55.duration}
			>
				<Audio src={audioFiles["module-3-recap"]} startFrom={Math.round(9.83 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg55.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"AI at scale The five layers are hardware"
					]}
					slideName="module-3-recap"
					audioDuration={seg55.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={9.83}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg56.start}
				durationInFrames={seg56.duration}
			>
				<Audio src={audioFiles["module-3-recap"]} startFrom={Math.round(20.06 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg56.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"Triton model surfaces with NeMo and NIM and the application layer where your agent lives"
					]}
					slideName="module-3-recap"
					audioDuration={seg56.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={20.06}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg57.start}
				durationInFrames={seg57.duration}
			>
				<Audio src={audioFiles["module-3-recap"]} startFrom={Math.round(30.65 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg57.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"high throughput and operationally stable infrastructure required for production loops",
					"NIMs are the deployment surface for agentic AI They package"
					]}
					slideName="module-3-recap"
					audioDuration={seg57.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={30.65}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg58.start}
				durationInFrames={seg58.duration}
			>
				<Audio src={audioFiles["module-3-recap"]} startFrom={Math.round(40.57 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg58.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"production",
					"And for the certification you need to understand the stack"
					]}
					slideName="module-3-recap"
					audioDuration={seg58.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={40.57}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg59.start}
				durationInFrames={seg59.duration}
			>
				<Audio src={audioFiles["module-3-recap"]} startFrom={Math.round(50.11 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg59.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"Know the layers Know the components Know why they matter",
					"This is the platform that AI runs"
					]}
					slideName="module-3-recap"
					audioDuration={seg59.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={50.11}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg60.start}
				durationInFrames={seg60.duration}
			>
				<Audio src={audioFiles["module-3-recap"]} startFrom={Math.round(60.04 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg60.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={0}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"Now you know how it works"
					]}
					slideName="module-3-recap"
					audioDuration={seg60.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={60.04}
		/>
				</CrossFadeWrapper>
			</Sequence>

		</div>
	);
};
