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
	const addSegment = (audioDuration: number, isLastInGroup: boolean, isLastInModule: boolean, buffer: number) => {
		const slideDuration = audioDuration + buffer;
		const start = currentFrame;
		currentFrame += slideDuration * fps + (isLastInGroup && !isLastInModule ? whooshDuration * fps : 0);
		return { start, duration: slideDuration * fps, slideDuration, audioDuration, buffer };
	};

	const seg0 = addSegment(55.83, true, false, 1);
	const seg1 = addSegment(10.06, false, false, 1);
	const seg2 = addSegment(9.88, false, false, 1);
	const seg3 = addSegment(10.28, false, false, 1);
	const seg4 = addSegment(10.04, false, false, 1);
	const seg5 = addSegment(9.74, false, false, 1);
	const seg6 = addSegment(10.01, false, false, 1);
	const seg7 = addSegment(10.04, false, false, 1);
	const seg8 = addSegment(9.84, false, false, 1);
	const seg9 = addSegment(10.59, false, false, 1);
	const seg10 = addSegment(9.35, false, false, 1);
	const seg11 = addSegment(10.40, false, false, 1);
	const seg12 = addSegment(10.09, false, false, 1);
	const seg13 = addSegment(0.24, true, false, 1);
	const seg14 = addSegment(10.40, false, false, 1);
	const seg15 = addSegment(9.62, false, false, 1);
	const seg16 = addSegment(9.78, false, false, 1);
	const seg17 = addSegment(10.50, false, false, 1);
	const seg18 = addSegment(9.90, false, false, 1);
	const seg19 = addSegment(10.26, false, false, 1);
	const seg20 = addSegment(9.02, false, false, 1);
	const seg21 = addSegment(10.60, false, false, 1);
	const seg22 = addSegment(10.28, false, false, 1);
	const seg23 = addSegment(10.02, false, false, 1);
	const seg24 = addSegment(9.20, false, false, 1);
	const seg25 = addSegment(9.22, false, false, 1);
	const seg26 = addSegment(11.34, false, false, 1);
	const seg27 = addSegment(10.08, false, false, 1);
	const seg28 = addSegment(9.94, false, false, 1);
	const seg29 = addSegment(9.26, false, false, 1);
	const seg30 = addSegment(11.02, false, false, 1);
	const seg31 = addSegment(9.92, false, false, 1);
	const seg32 = addSegment(10.42, false, false, 1);
	const seg33 = addSegment(8.98, false, false, 1);
	const seg34 = addSegment(10.72, false, false, 1);
	const seg35 = addSegment(5.78, true, false, 1);
	const seg36 = addSegment(9.58, false, false, 1);
	const seg37 = addSegment(10.50, false, false, 1);
	const seg38 = addSegment(10.39, false, false, 1);
	const seg39 = addSegment(9.60, false, false, 1);
	const seg40 = addSegment(10.05, false, false, 1);
	const seg41 = addSegment(10.50, false, false, 1);
	const seg42 = addSegment(9.39, false, false, 1);
	const seg43 = addSegment(9.95, false, false, 1);
	const seg44 = addSegment(9.18, false, false, 1);
	const seg45 = addSegment(11.12, false, false, 1);
	const seg46 = addSegment(9.79, false, false, 1);
	const seg47 = addSegment(10.68, false, false, 1);
	const seg48 = addSegment(9.12, true, false, 1);
	const seg49 = addSegment(10.09, false, false, 1);
	const seg50 = addSegment(10.27, false, false, 1);
	const seg51 = addSegment(9.75, false, false, 1);
	const seg52 = addSegment(10.32, false, false, 1);
	const seg53 = addSegment(9.54, false, false, 1);
	const seg54 = addSegment(10.22, false, false, 1);
	const seg55 = addSegment(10.02, false, false, 1);
	const seg56 = addSegment(4.03, true, false, 1);
	const seg57 = addSegment(9.98, false, false, 1);
	const seg58 = addSegment(9.65, false, false, 1);
	const seg59 = addSegment(10.56, false, false, 1);
	const seg60 = addSegment(10.16, false, false, 1);
	const seg61 = addSegment(10.36, false, false, 1);
	const seg62 = addSegment(9.62, false, false, 1);
	const seg63 = addSegment(10.12, false, false, 1);
	const seg64 = addSegment(0.26, true, true, 1.2);

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
				from={seg0.start}
				durationInFrames={seg0.duration}
			>
				<Audio src={audioFiles["module-4-title"]} />
				<CrossFadeWrapper
					totalDuration={seg0.slideDuration}
					fadeInDuration={0.5}
					fadeOutDuration={crossFadeDuration}
			>
					<TitleSlide 
					title="Workloads and Inference Pipelines" 
					subtitle="Workloads and Inference Pipelines"
					
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
				<Audio src={audioFiles["module-4-concept"]} />
				<CrossFadeWrapper
					totalDuration={seg1.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"Let's define our terms A workload is a sustained operational process that delivers value continuously It's not a"
					]}
					slideName="module-4-concept"
					audioDuration={seg1.audioDuration}
					moduleNumber={4}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg2.start}
				durationInFrames={seg2.duration}
			>
				<Audio src={audioFiles["module-4-concept"]} startFrom={Math.round(10.06 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg2.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"It's an ongoing function of the business In traditional software workloads are things like transaction processing dat..."
					]}
					slideName="module-4-concept"
					audioDuration={seg2.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={10.06}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg3.start}
				durationInFrames={seg3.duration}
			>
				<Audio src={audioFiles["module-4-concept"]} startFrom={Math.round(19.94 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg3.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"API services They run continuously They handle variable traffic They need to be reliable observable and scalable"
					]}
					slideName="module-4-concept"
					audioDuration={seg3.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={19.94}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg4.start}
				durationInFrames={seg4.duration}
			>
				<Audio src={audioFiles["module-4-concept"]} startFrom={Math.round(30.22 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg4.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"AI workloads are the same but with inference at the core An AI workload is a process"
					]}
					slideName="module-4-concept"
					audioDuration={seg4.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={30.22}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg5.start}
				durationInFrames={seg5.duration}
			>
				<Audio src={audioFiles["module-4-concept"]} startFrom={Math.round(40.26 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg5.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"It's not someone typing a prompt into a chat window It's a system"
					]}
					slideName="module-4-concept"
					audioDuration={seg5.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={40.26}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg6.start}
				durationInFrames={seg6.duration}
			>
				<Audio src={audioFiles["module-4-concept"]} startFrom={Math.round(50.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg6.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"The distinction matters because workloads have requirements tha..."
					]}
					slideName="module-4-concept"
					audioDuration={seg6.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={50.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg7.start}
				durationInFrames={seg7.duration}
			>
				<Audio src={audioFiles["module-4-concept"]} startFrom={Math.round(60.01 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg7.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"They need retry logic error handling and graceful degradation",
					"They can't just fail silently",
					"Workloads must"
					]}
					slideName="module-4-concept"
					audioDuration={seg7.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={60.01}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg8.start}
				durationInFrames={seg8.duration}
			>
				<Audio src={audioFiles["module-4-concept"]} startFrom={Math.round(70.05 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg8.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"Every inference call needs to be logged with inputs",
					"outputs latency and metadata"
					]}
					slideName="module-4-concept"
					audioDuration={seg8.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={70.05}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg9.start}
				durationInFrames={seg9.duration}
			>
				<Audio src={audioFiles["module-4-concept"]} startFrom={Math.round(79.89 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg9.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"When something goes wrong you need to diagnose it Workloads must be reproducible Given the same inputs"
					]}
					slideName="module-4-concept"
					audioDuration={seg9.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={79.89}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg10.start}
				durationInFrames={seg10.duration}
			>
				<Audio src={audioFiles["module-4-concept"]} startFrom={Math.round(90.48 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg10.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"This is harder with probabilistic models but it's still a design requirement Workloads must be"
					]}
					slideName="module-4-concept"
					audioDuration={seg10.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={90.48}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg11.start}
				durationInFrames={seg11.duration}
			>
				<Audio src={audioFiles["module-4-concept"]} startFrom={Math.round(99.83 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg11.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"Running inference isn't free",
					"At scale every millisecond of latency and every token of output has"
					]}
					slideName="module-4-concept"
					audioDuration={seg11.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={99.83}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg12.start}
				durationInFrames={seg12.duration}
			>
				<Audio src={audioFiles["module-4-concept"]} startFrom={Math.round(110.23 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg12.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"Workloads are designed to optimize that cost",
					"In short workloads are production Demos are prototypes"
					]}
					slideName="module-4-concept"
					audioDuration={seg12.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={110.23}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg13.start}
				durationInFrames={seg13.duration}
			>
				<Audio src={audioFiles["module-4-concept"]} startFrom={Math.round(120.32 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg13.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"In short workloads are production Demos are prototypes"
					]}
					slideName="module-4-concept"
					audioDuration={seg13.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={120.32}
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg13.start + seg13.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg14.start}
				durationInFrames={seg14.duration}
			>
				<Audio src={audioFiles["module-4-architecture"]} />
				<CrossFadeWrapper
					totalDuration={seg14.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Yes at the core of every AI workload is an inference pipeline",
					"This is the sequence of steps that takes a request from intake"
					]}
					slideName="module-4-architecture"
					audioDuration={seg14.audioDuration}
					moduleNumber={4}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg15.start}
				durationInFrames={seg15.duration}
			>
				<Audio src={audioFiles["module-4-architecture"]} startFrom={Math.round(10.40 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg15.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"For agentic systems the pipeline is more complex than for simple inference",
					"Let's walk through the full"
					]}
					slideName="module-4-architecture"
					audioDuration={seg15.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={10.40}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg16.start}
				durationInFrames={seg16.duration}
			>
				<Audio src={audioFiles["module-4-architecture"]} startFrom={Math.round(20.02 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg16.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"The pipeline begins when a request arrives This could be an API call",
					"a message from a queue"
					]}
					slideName="module-4-architecture"
					audioDuration={seg16.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={20.02}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg17.start}
				durationInFrames={seg17.duration}
			>
				<Audio src={audioFiles["module-4-architecture"]} startFrom={Math.round(29.80 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg17.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"or an event from another system",
					"The intake layer validates the request",
					"authenticates the caller and routes the request to the appropriate handler"
					]}
					slideName="module-4-architecture"
					audioDuration={seg17.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={29.80}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg18.start}
				durationInFrames={seg18.duration}
			>
				<Audio src={audioFiles["module-4-architecture"]} startFrom={Math.round(40.30 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg18.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Retrieval Before the model runs the system often needs to retrieve relevant context",
					"This might mean querying a vector database for similar documents"
					]}
					slideName="module-4-architecture"
					audioDuration={seg18.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={40.30}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg19.start}
				durationInFrames={seg19.duration}
			>
				<Audio src={audioFiles["module-4-architecture"]} startFrom={Math.round(50.20 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg19.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Retrieval provides the grounding that makes responses"
					]}
					slideName="module-4-architecture"
					audioDuration={seg19.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={50.20}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg20.start}
				durationInFrames={seg20.duration}
			>
				<Audio src={audioFiles["module-4-architecture"]} startFrom={Math.round(60.46 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg20.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Grounding Once context is retrieved",
					"it needs to be formatted and injected into the model's input",
					"This is grounding"
					]}
					slideName="module-4-architecture"
					audioDuration={seg20.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={60.46}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg21.start}
				durationInFrames={seg21.duration}
			>
				<Audio src={audioFiles["module-4-architecture"]} startFrom={Math.round(69.48 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg21.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Anchoring the model's response in specific facts and data",
					"rather than relying solely on parametric knowledge",
					"Grounding reduces hallucination"
					]}
					slideName="module-4-architecture"
					audioDuration={seg21.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={69.48}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg22.start}
				durationInFrames={seg22.duration}
			>
				<Audio src={audioFiles["module-4-architecture"]} startFrom={Math.round(80.08 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg22.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Planning For agentic workloads the next step is often planning",
					"The system decomposes"
					]}
					slideName="module-4-architecture"
					audioDuration={seg22.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={80.08}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg23.start}
				durationInFrames={seg23.duration}
			>
				<Audio src={audioFiles["module-4-architecture"]} startFrom={Math.round(90.36 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg23.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"request into subtasks determines the execution order and prepares the agent loop",
					"Planning may involve a separate model call or a structured planner module"
					]}
					slideName="module-4-architecture"
					audioDuration={seg23.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={90.36}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg24.start}
				durationInFrames={seg24.duration}
			>
				<Audio src={audioFiles["module-4-architecture"]} startFrom={Math.round(100.38 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg24.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Model inference This is where the language model runs The prepared prompt",
					"instructions"
					]}
					slideName="module-4-architecture"
					audioDuration={seg24.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={100.38}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg25.start}
				durationInFrames={seg25.duration}
			>
				<Audio src={audioFiles["module-4-architecture"]} startFrom={Math.round(109.58 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg25.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"The model generates output",
					"For agentic systems this happens multiple times per request"
					]}
					slideName="module-4-architecture"
					audioDuration={seg25.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={109.58}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg26.start}
				durationInFrames={seg26.duration}
			>
				<Audio src={audioFiles["module-4-architecture"]} startFrom={Math.round(118.80 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg26.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"as the agent iterates through its loop",
					"Tool execution If the model's output includes tool calls",
					"This might mean"
					]}
					slideName="module-4-architecture"
					audioDuration={seg26.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={118.80}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg27.start}
				durationInFrames={seg27.duration}
			>
				<Audio src={audioFiles["module-4-architecture"]} startFrom={Math.round(130.14 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg27.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"API running a code interpreter",
					"Tool execution is where the agent interacts with the world beyond text"
					]}
					slideName="module-4-architecture"
					audioDuration={seg27.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={130.14}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg28.start}
				durationInFrames={seg28.duration}
			>
				<Audio src={audioFiles["module-4-architecture"]} startFrom={Math.round(140.22 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg28.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Memory update After each step the pipeline updates the agent's memory",
					"Working memory holds the current context",
					"Long term memory"
					]}
					slideName="module-4-architecture"
					audioDuration={seg28.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={140.22}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg29.start}
				durationInFrames={seg29.duration}
			>
				<Audio src={audioFiles["module-4-architecture"]} startFrom={Math.round(150.16 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg29.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"may be updated with facts or outcomes that should persist",
					"Safety and policy Before returning output"
					]}
					slideName="module-4-architecture"
					audioDuration={seg29.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={150.16}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg30.start}
				durationInFrames={seg30.duration}
			>
				<Audio src={audioFiles["module-4-architecture"]} startFrom={Math.round(159.42 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg30.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"This includes content filtering policy enforcement and evaluation layers If the outpu..."
					]}
					slideName="module-4-architecture"
					audioDuration={seg30.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={159.42}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg31.start}
				durationInFrames={seg31.duration}
			>
				<Audio src={audioFiles["module-4-architecture"]} startFrom={Math.round(170.44 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg31.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Human in the loop For high stakes or low confidence cases",
					"the pipeline may pause and escalate to a human",
					"This step is optional"
					]}
					slideName="module-4-architecture"
					audioDuration={seg31.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={170.44}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg32.start}
				durationInFrames={seg32.duration}
			>
				<Audio src={audioFiles["module-4-architecture"]} startFrom={Math.round(180.36 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg32.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Output and evaluation Finally the response is returned to the caller",
					"The pipeline logs"
					]}
					slideName="module-4-architecture"
					audioDuration={seg32.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={180.36}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg33.start}
				durationInFrames={seg33.duration}
			>
				<Audio src={audioFiles["module-4-architecture"]} startFrom={Math.round(190.78 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg33.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Evaluation metrics are captured",
					"Latency token usage success rate"
					]}
					slideName="module-4-architecture"
					audioDuration={seg33.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={190.78}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg34.start}
				durationInFrames={seg34.duration}
			>
				<Audio src={audioFiles["module-4-architecture"]} startFrom={Math.round(199.76 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg34.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"That's the full pipeline",
					"From intake to output",
					"For agentic systems this pipeline runs every"
					]}
					slideName="module-4-architecture"
					audioDuration={seg34.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={199.76}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg35.start}
				durationInFrames={seg35.duration}
			>
				<Audio src={audioFiles["module-4-architecture"]} startFrom={Math.round(210.48 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg35.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"time the agent completes a loop iteration",
					"It's the backbone of production AI"
					]}
					slideName="module-4-architecture"
					audioDuration={seg35.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={210.48}
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg35.start + seg35.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg36.start}
				durationInFrames={seg36.duration}
			>
				<Audio src={audioFiles["module-4-application"]} />
				<CrossFadeWrapper
					totalDuration={seg36.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"Let's ground this in real examples Knowledge Automation An enterprise deploys an agent to answer employee questions a..."
					]}
					slideName="module-4-application"
					audioDuration={seg36.audioDuration}
					moduleNumber={4}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg37.start}
				durationInFrames={seg37.duration}
			>
				<Audio src={audioFiles["module-4-application"]} startFrom={Math.round(9.58 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg37.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"The pipeline retrieves relevant policy documents",
					"Each query runs through the full"
					]}
					slideName="module-4-application"
					audioDuration={seg37.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={9.58}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg38.start}
				durationInFrames={seg38.duration}
			>
				<Audio src={audioFiles["module-4-application"]} startFrom={Math.round(20.08 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg38.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"The system handles thousands of queries per day Customer Support",
					"A support agent receives tickets retrieves customer"
					]}
					slideName="module-4-application"
					audioDuration={seg38.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={20.08}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg39.start}
				durationInFrames={seg39.duration}
			>
				<Audio src={audioFiles["module-4-application"]} startFrom={Math.round(30.47 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg39.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"history formulates responses and routes complex cases to humans",
					"pipeline includes tool execution for CRM"
					]}
					slideName="module-4-application"
					audioDuration={seg39.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={30.47}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg40.start}
				durationInFrames={seg40.duration}
			>
				<Audio src={audioFiles["module-4-application"]} startFrom={Math.round(40.07 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg40.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"CRM updates and policy checks for compliance",
					"Analytics and Research An analyst requests a market summary The agent queries multiple"
					]}
					slideName="module-4-application"
					audioDuration={seg40.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={40.07}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg41.start}
				durationInFrames={seg41.duration}
			>
				<Audio src={audioFiles["module-4-application"]} startFrom={Math.round(50.12 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg41.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"The pipeline includes",
					"evaluation"
					]}
					slideName="module-4-application"
					audioDuration={seg41.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={50.12}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg42.start}
				durationInFrames={seg42.duration}
			>
				<Audio src={audioFiles["module-4-application"]} startFrom={Math.round(60.62 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg42.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"Document Workflows A legal team uses an agent to review contracts",
					"The pipeline retrieves relevant clauses compares"
					]}
					slideName="module-4-application"
					audioDuration={seg42.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={60.62}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg43.start}
				durationInFrames={seg43.duration}
			>
				<Audio src={audioFiles["module-4-application"]} startFrom={Math.round(70.01 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg43.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"Memory tracks previous reviews for consistency",
					"In every case"
					]}
					slideName="module-4-application"
					audioDuration={seg43.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={70.01}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg44.start}
				durationInFrames={seg44.duration}
			>
				<Audio src={audioFiles["module-4-application"]} startFrom={Math.round(79.96 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg44.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"the workload is a pipeline not a single call",
					"The enterprise need is continuous auditable and scalable inference"
					]}
					slideName="module-4-application"
					audioDuration={seg44.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={79.96}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg45.start}
				durationInFrames={seg45.duration}
			>
				<Audio src={audioFiles["module-4-application"]} startFrom={Math.round(89.14 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg45.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"Pipeline Constraints Every pipeline operates under constraints The three primary constraints are latency accuracy and..."
					]}
					slideName="module-4-application"
					audioDuration={seg45.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={89.14}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg46.start}
				durationInFrames={seg46.duration}
			>
				<Audio src={audioFiles["module-4-application"]} startFrom={Math.round(100.26 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg46.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"You rarely get to optimize for all three Faster inference may sacrifice accuracy Higher accuracy may increase cost"
					]}
					slideName="module-4-application"
					audioDuration={seg46.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={100.26}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg47.start}
				durationInFrames={seg47.duration}
			>
				<Audio src={audioFiles["module-4-application"]} startFrom={Math.round(110.05 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg47.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"Engineers think about these tradeoffs in terms of batching caching model selection and hardware ..."
					]}
					slideName="module-4-application"
					audioDuration={seg47.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={110.05}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg48.start}
				durationInFrames={seg48.duration}
			>
				<Audio src={audioFiles["module-4-application"]} startFrom={Math.round(120.73 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg48.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"Technical leaders think about them in terms of SLAs budget and business impact Both perspectives matter"
					]}
					slideName="module-4-application"
					audioDuration={seg48.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={120.73}
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg48.start + seg48.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg49.start}
				durationInFrames={seg49.duration}
			>
				<Audio src={audioFiles["module-4-exam-mapping"]} />
				<CrossFadeWrapper
					totalDuration={seg49.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"For the NVIDIA certification you need to understand the inference pipeline deeply Expect questions that test your kno..."
					]}
					slideName="module-4-exam-mapping"
					audioDuration={seg49.audioDuration}
					moduleNumber={4}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg50.start}
				durationInFrames={seg50.duration}
			>
				<Audio src={audioFiles["module-4-exam-mapping"]} startFrom={Math.round(10.09 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg50.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"What is grounding Where does tool execution occur You should be able to describe"
					]}
					slideName="module-4-exam-mapping"
					audioDuration={seg50.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={10.09}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg51.start}
				durationInFrames={seg51.duration}
			>
				<Audio src={audioFiles["module-4-exam-mapping"]} startFrom={Math.round(20.36 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg51.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"Understand the distinction between workloads and one off inference The exam tests whether you recognize that producti..."
					]}
					slideName="module-4-exam-mapping"
					audioDuration={seg51.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={20.36}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg52.start}
				durationInFrames={seg52.duration}
			>
				<Audio src={audioFiles["module-4-exam-mapping"]} startFrom={Math.round(30.11 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg52.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"Pay attention to pipeline constraints Questions may present scenarios and ask",
					"the tradeoff is this a latency"
					]}
					slideName="module-4-exam-mapping"
					audioDuration={seg52.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={30.11}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg53.start}
				durationInFrames={seg53.duration}
			>
				<Audio src={audioFiles["module-4-exam-mapping"]} startFrom={Math.round(40.43 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg53.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"problem a cost problem or an accuracy problem",
					"Know how retrieval and grounding work together",
					"This is a testable concept"
					]}
					slideName="module-4-exam-mapping"
					audioDuration={seg53.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={40.43}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg54.start}
				durationInFrames={seg54.duration}
			>
				<Audio src={audioFiles["module-4-exam-mapping"]} startFrom={Math.round(49.97 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg54.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"Retrieval fetches data Grounding integrates it into the model's input",
					"Both are necessary for accurate domain"
					]}
					slideName="module-4-exam-mapping"
					audioDuration={seg54.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={49.97}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg55.start}
				durationInFrames={seg55.duration}
			>
				<Audio src={audioFiles["module-4-exam-mapping"]} startFrom={Math.round(60.19 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg55.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"Finally understand the role of observability",
					"Workloads require logging metrics and evaluation"
					]}
					slideName="module-4-exam-mapping"
					audioDuration={seg55.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={60.19}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg56.start}
				durationInFrames={seg56.duration}
			>
				<Audio src={audioFiles["module-4-exam-mapping"]} startFrom={Math.round(70.21 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg56.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"The exam may ask about what should be captured"
					]}
					slideName="module-4-exam-mapping"
					audioDuration={seg56.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={70.21}
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg56.start + seg56.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg57.start}
				durationInFrames={seg57.duration}
			>
				<Audio src={audioFiles["module-4-recap"]} />
				<CrossFadeWrapper
					totalDuration={seg57.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"Let's consolidate Demos are not workloads Demos show a model doing something once Workloads are sustained operational..."
					]}
					slideName="module-4-recap"
					audioDuration={seg57.audioDuration}
					moduleNumber={4}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg58.start}
				durationInFrames={seg58.duration}
			>
				<Audio src={audioFiles["module-4-recap"]} startFrom={Math.round(9.98 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg58.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"The inference pipeline is the backbone..."
					]}
					slideName="module-4-recap"
					audioDuration={seg58.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={9.98}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg59.start}
				durationInFrames={seg59.duration}
			>
				<Audio src={audioFiles["module-4-recap"]} startFrom={Math.round(19.63 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg59.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"AI workload For agentic systems it includes intake retrieval grounding planning model inference tool execution"
					]}
					slideName="module-4-recap"
					audioDuration={seg59.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={19.63}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg60.start}
				durationInFrames={seg60.duration}
			>
				<Audio src={audioFiles["module-4-recap"]} startFrom={Math.round(30.19 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg60.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"Enterprises adopt agentic AI",
					"because their problems are workload shaped",
					"Human In The Loop"
					]}
					slideName="module-4-recap"
					audioDuration={seg60.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={30.19}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg61.start}
				durationInFrames={seg61.duration}
			>
				<Audio src={audioFiles["module-4-recap"]} startFrom={Math.round(40.35 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg61.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"Every pipeline operates under constraints",
					"latency accuracy"
					]}
					slideName="module-4-recap"
					audioDuration={seg61.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={40.35}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg62.start}
				durationInFrames={seg62.duration}
			>
				<Audio src={audioFiles["module-4-recap"]} startFrom={Math.round(50.71 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg62.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"Production systems are designed around these tradeoffs",
					"And for the certification you need to understand the pipeline as a system"
					]}
					slideName="module-4-recap"
					audioDuration={seg62.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={50.71}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg63.start}
				durationInFrames={seg63.duration}
			>
				<Audio src={audioFiles["module-4-recap"]} startFrom={Math.round(60.33 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg63.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"Know the stages Know the constraints Know how workloads differ from demos",
					"This is how AI works in production Now you know the architecture"
					]}
					slideName="module-4-recap"
					audioDuration={seg63.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={60.33}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg64.start}
				durationInFrames={seg64.duration}
			>
				<Audio src={audioFiles["module-4-recap"]} startFrom={Math.round(70.45 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg64.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={0}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"This is how AI works in production Now you know the architecture"
					]}
					slideName="module-4-recap"
					audioDuration={seg64.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={70.45}
		/>
				</CrossFadeWrapper>
			</Sequence>

		</div>
	);
};
