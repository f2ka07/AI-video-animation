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
	const addSegment = (audioDuration: number, isLastInGroup: boolean, isLastInModule: boolean, buffer: number) => {
		const slideDuration = audioDuration + buffer;
		const start = currentFrame;
		currentFrame += slideDuration * fps + (isLastInGroup && !isLastInModule ? whooshDuration * fps : 0);
		return { start, duration: slideDuration * fps, slideDuration, audioDuration, buffer };
	};

	const seg0 = addSegment(50.95, true, false, 1);
	const seg1 = addSegment(10.07, false, false, 1);
	const seg2 = addSegment(9.92, false, false, 1);
	const seg3 = addSegment(9.28, false, false, 1);
	const seg4 = addSegment(10.71, false, false, 1);
	const seg5 = addSegment(10.15, false, false, 1);
	const seg6 = addSegment(9.84, false, false, 1);
	const seg7 = addSegment(8.70, true, false, 1);
	const seg8 = addSegment(10.08, false, false, 1);
	const seg9 = addSegment(10.74, false, false, 1);
	const seg10 = addSegment(9.48, false, false, 1);
	const seg11 = addSegment(9.76, false, false, 1);
	const seg12 = addSegment(10.05, false, false, 1);
	const seg13 = addSegment(10.01, false, false, 1);
	const seg14 = addSegment(10.16, false, false, 1);
	const seg15 = addSegment(9.81, false, false, 1);
	const seg16 = addSegment(9.97, false, false, 1);
	const seg17 = addSegment(10.24, false, false, 1);
	const seg18 = addSegment(9.91, false, false, 1);
	const seg19 = addSegment(10.50, false, false, 1);
	const seg20 = addSegment(10.11, false, false, 1);
	const seg21 = addSegment(9.64, false, false, 1);
	const seg22 = addSegment(9.74, false, false, 1);
	const seg23 = addSegment(9.85, false, false, 1);
	const seg24 = addSegment(10.20, false, false, 1);
	const seg25 = addSegment(10.08, false, false, 1);
	const seg26 = addSegment(10.41, false, false, 1);
	const seg27 = addSegment(9.32, false, false, 1);
	const seg28 = addSegment(10.77, false, false, 1);
	const seg29 = addSegment(6.49, true, false, 1);
	const seg30 = addSegment(10.32, false, false, 1);
	const seg31 = addSegment(9.57, false, false, 1);
	const seg32 = addSegment(10.28, false, false, 1);
	const seg33 = addSegment(10.34, false, false, 1);
	const seg34 = addSegment(9.93, false, false, 1);
	const seg35 = addSegment(9.47, false, false, 1);
	const seg36 = addSegment(9.74, false, false, 1);
	const seg37 = addSegment(10.46, false, false, 1);
	const seg38 = addSegment(6.15, true, false, 1);
	const seg39 = addSegment(10.74, false, false, 1);
	const seg40 = addSegment(9.00, false, false, 1);
	const seg41 = addSegment(10.92, false, false, 1);
	const seg42 = addSegment(9.31, false, false, 1);
	const seg43 = addSegment(10.27, false, false, 1);
	const seg44 = addSegment(10.00, false, false, 1);
	const seg45 = addSegment(9.50, true, false, 1);
	const seg46 = addSegment(9.74, false, false, 1);
	const seg47 = addSegment(8.68, false, false, 1);
	const seg48 = addSegment(11.90, false, false, 1);
	const seg49 = addSegment(10.02, false, false, 1);
	const seg50 = addSegment(9.36, false, false, 1);
	const seg51 = addSegment(9.68, false, false, 1);
	const seg52 = addSegment(5.72, true, true, 1.2);

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
				from={seg0.start}
				durationInFrames={seg0.duration}
			>
				<Audio src={audioFiles["module-2-title"]} />
				<CrossFadeWrapper
					totalDuration={seg0.slideDuration}
					fadeInDuration={0.5}
					fadeOutDuration={crossFadeDuration}
			>
					<TitleSlide 
					title="Agent Fundamentals" 
					subtitle="Agent Fundamentals"
					
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
				<Audio src={audioFiles["module-2-concept"]} />
				<CrossFadeWrapper
					totalDuration={seg1.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"Let's define the term clearly",
					"An agent is a system that uses a language model as its reasoning core but wraps that model",
					"Loop"
					]}
					slideName="module-2-concept"
					audioDuration={seg1.audioDuration}
					moduleNumber={2}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg2.start}
				durationInFrames={seg2.duration}
			>
				<Audio src={audioFiles["module-2-concept"]} startFrom={Math.round(10.07 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg2.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"The key word is loop",
					"In single call inference you make one request get one response and you're done"
					]}
					slideName="module-2-concept"
					audioDuration={seg2.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={10.07}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg3.start}
				durationInFrames={seg3.duration}
			>
				<Audio src={audioFiles["module-2-concept"]} startFrom={Math.round(19.99 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg3.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"The model has no awareness of what came before or what comes next Every interaction is isolated"
					]}
					slideName="module-2-concept"
					audioDuration={seg3.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={19.99}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg4.start}
				durationInFrames={seg4.duration}
			>
				<Audio src={audioFiles["module-2-concept"]} startFrom={Math.round(29.27 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg4.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"agentic systems the model operates inside a cycle",
					"It receives a goal It plans steps to that goal"
					]}
					slideName="module-2-concept"
					audioDuration={seg4.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={29.27}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg5.start}
				durationInFrames={seg5.duration}
			>
				<Audio src={audioFiles["module-2-concept"]} startFrom={Math.round(39.98 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg5.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"It observes",
					"And then it decides what to do next This cycle repeats until goal"
					]}
					slideName="module-2-concept"
					audioDuration={seg5.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={39.98}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg6.start}
				durationInFrames={seg6.duration}
			>
				<Audio src={audioFiles["module-2-concept"]} startFrom={Math.round(50.13 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg6.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"is complete the task is escalated",
					"or the system hits a defined stopping condition",
					"This is the agent loop It's the foundational"
					]}
					slideName="module-2-concept"
					audioDuration={seg6.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={50.13}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg7.start}
				durationInFrames={seg7.duration}
			>
				<Audio src={audioFiles["module-2-concept"]} startFrom={Math.round(59.97 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg7.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"But the loop alone isn't enough To be useful",
					"components"
					]}
					slideName="module-2-concept"
					audioDuration={seg7.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={59.97}
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
				<Audio src={audioFiles["module-2-architecture"]} />
				<CrossFadeWrapper
					totalDuration={seg8.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"There are six core components in a production agentic architecture You've seen a preview in Module 01 Now"
					]}
					slideName="module-2-architecture"
					audioDuration={seg8.audioDuration}
					moduleNumber={2}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg9.start}
				durationInFrames={seg9.duration}
			>
				<Audio src={audioFiles["module-2-architecture"]} startFrom={Math.round(10.08 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg9.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"This is the agent's ability to break a complex goal into smaller subtasks sequence them logically and adjust"
					]}
					slideName="module-2-architecture"
					audioDuration={seg9.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={10.08}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg10.start}
				durationInFrames={seg10.duration}
			>
				<Audio src={audioFiles["module-2-architecture"]} startFrom={Math.round(20.82 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg10.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Planning can be explicit using a structured planner module or implicit",
					"where the language model itself reasons through the steps"
					]}
					slideName="module-2-architecture"
					audioDuration={seg10.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={20.82}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg11.start}
				durationInFrames={seg11.duration}
			>
				<Audio src={audioFiles["module-2-architecture"]} startFrom={Math.round(30.30 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg11.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"In practice most production agents use a hybrid approach a structured planner for high level orchestration with the"
					]}
					slideName="module-2-architecture"
					audioDuration={seg11.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={30.30}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg12.start}
				durationInFrames={seg12.duration}
			>
				<Audio src={audioFiles["module-2-architecture"]} startFrom={Math.round(40.06 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg12.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Tool Use An agent without tools is just a chatbot with a loop Tools"
					]}
					slideName="module-2-architecture"
					audioDuration={seg12.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={40.06}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg13.start}
				durationInFrames={seg13.duration}
			>
				<Audio src={audioFiles["module-2-architecture"]} startFrom={Math.round(50.11 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg13.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"This includes APIs",
					"for retrieving data code interpreters for executing logic search engines for grounding"
					]}
					slideName="module-2-architecture"
					audioDuration={seg13.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={50.11}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg14.start}
				durationInFrames={seg14.duration}
			>
				<Audio src={audioFiles["module-2-architecture"]} startFrom={Math.round(60.12 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg14.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"CRMs Tool use is what"
					]}
					slideName="module-2-architecture"
					audioDuration={seg14.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={60.12}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg15.start}
				durationInFrames={seg15.duration}
			>
				<Audio src={audioFiles["module-2-architecture"]} startFrom={Math.round(70.28 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg15.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"It's the bridge between reasoning and reality Memory",
					"Agents need to remember Short term memory often called working"
					]}
					slideName="module-2-architecture"
					audioDuration={seg15.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={70.28}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg16.start}
				durationInFrames={seg16.duration}
			>
				<Audio src={audioFiles["module-2-architecture"]} startFrom={Math.round(80.09 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg16.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"memory holds the context for the current task what's been done what's pending what results have been observed",
					"Working Memory"
					]}
					slideName="module-2-architecture"
					audioDuration={seg16.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={80.09}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg17.start}
				durationInFrames={seg17.duration}
			>
				<Audio src={audioFiles["module-2-architecture"]} startFrom={Math.round(90.06 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg17.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"It stores facts preferences and history that inform future behavior",
					"Without memory agents would be stateless"
					]}
					slideName="module-2-architecture"
					audioDuration={seg17.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={90.06}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg18.start}
				durationInFrames={seg18.duration}
			>
				<Audio src={audioFiles["module-2-architecture"]} startFrom={Math.round(100.30 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg18.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"They'd forget what they just did They'd repeat mistakes",
					"They'd lose track of goals",
					"Retrieval and Grounding This is how"
					]}
					slideName="module-2-architecture"
					audioDuration={seg18.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={100.30}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg19.start}
				durationInFrames={seg19.duration}
			>
				<Audio src={audioFiles["module-2-architecture"]} startFrom={Math.round(110.21 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg19.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Retrieval typically involves a vector database or search index that lets the agent find"
					]}
					slideName="module-2-architecture"
					audioDuration={seg19.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={110.21}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg20.start}
				durationInFrames={seg20.duration}
			>
				<Audio src={audioFiles["module-2-architecture"]} startFrom={Math.round(120.71 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg20.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Grounding means the agent's responses are anchored in retrieved facts not just"
					]}
					slideName="module-2-architecture"
					audioDuration={seg20.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={120.71}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg21.start}
				durationInFrames={seg21.duration}
			>
				<Audio src={audioFiles["module-2-architecture"]} startFrom={Math.round(130.82 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg21.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"This reduces hallucination and increases accuracy especially in domain specific applications Safety and Policy"
					]}
					slideName="module-2-architecture"
					audioDuration={seg21.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={130.82}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg22.start}
				durationInFrames={seg22.duration}
			>
				<Audio src={audioFiles["module-2-architecture"]} startFrom={Math.round(140.46 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg22.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Production agents must operate within guardrails",
					"This includes content filters that block harmful outputs policy engines"
					]}
					slideName="module-2-architecture"
					audioDuration={seg22.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={140.46}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg23.start}
				durationInFrames={seg23.duration}
			>
				<Audio src={audioFiles["module-2-architecture"]} startFrom={Math.round(150.20 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg23.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"expectatio..."
					]}
					slideName="module-2-architecture"
					audioDuration={seg23.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={150.20}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg24.start}
				durationInFrames={seg24.duration}
			>
				<Audio src={audioFiles["module-2-architecture"]} startFrom={Math.round(160.05 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg24.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"It's a core architectural layer In enterprise contexts policy enforcement often involves"
					]}
					slideName="module-2-architecture"
					audioDuration={seg24.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={160.05}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg25.start}
				durationInFrames={seg25.duration}
			>
				<Audio src={audioFiles["module-2-architecture"]} startFrom={Math.round(170.25 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg25.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Human in the Loop Not every decision should be automated Agentic"
					]}
					slideName="module-2-architecture"
					audioDuration={seg25.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={170.25}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg26.start}
				durationInFrames={seg26.duration}
			>
				<Audio src={audioFiles["module-2-architecture"]} startFrom={Math.round(180.33 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg26.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"systems need mechanisms for escalation moments where the agent pauses presents its state and requests human input",
					"This is critical"
					]}
					slideName="module-2-architecture"
					audioDuration={seg26.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={180.33}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg27.start}
				durationInFrames={seg27.duration}
			>
				<Audio src={audioFiles["module-2-architecture"]} startFrom={Math.round(190.74 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg27.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Human in the loop"
					]}
					slideName="module-2-architecture"
					audioDuration={seg27.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={190.74}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg28.start}
				durationInFrames={seg28.duration}
			>
				<Audio src={audioFiles["module-2-architecture"]} startFrom={Math.round(200.06 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg28.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"These six components planning tools memory retrieval safet..."
					]}
					slideName="module-2-architecture"
					audioDuration={seg28.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={200.06}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg29.start}
				durationInFrames={seg29.duration}
			>
				<Audio src={audioFiles["module-2-architecture"]} startFrom={Math.round(210.83 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg29.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"If any one is missing the system is incomplete"
					]}
					slideName="module-2-architecture"
					audioDuration={seg29.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={210.83}
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg29.start + seg29.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg30.start}
				durationInFrames={seg30.duration}
			>
				<Audio src={audioFiles["module-2-application"]} />
				<CrossFadeWrapper
					totalDuration={seg30.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"Now let's connect this to how real work gets done Consider a support automation workflow A customer submits"
					]}
					slideName="module-2-application"
					audioDuration={seg30.audioDuration}
					moduleNumber={2}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg31.start}
				durationInFrames={seg31.duration}
			>
				<Audio src={audioFiles["module-2-application"]} startFrom={Math.round(10.32 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg31.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"CRM identifies relevant knowledge base articles fo..."
					]}
					slideName="module-2-application"
					audioDuration={seg31.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={10.32}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg32.start}
				durationInFrames={seg32.duration}
			>
				<Audio src={audioFiles["module-2-application"]} startFrom={Math.round(19.89 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg32.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"That's not one call That's a loop with multiple tool"
					]}
					slideName="module-2-application"
					audioDuration={seg32.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={19.89}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg33.start}
				durationInFrames={seg33.duration}
			>
				<Audio src={audioFiles["module-2-application"]} startFrom={Math.round(30.17 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg33.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"Or consider a research workflow An analyst needs a summary of recent market activity"
					]}
					slideName="module-2-application"
					audioDuration={seg33.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={30.17}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg34.start}
				durationInFrames={seg34.duration}
			>
				<Audio src={audioFiles["module-2-application"]} startFrom={Math.round(40.51 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg34.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"An agent receives the request queries multiple data sources synthesizes findings checks for consistency and ge..."
					]}
					slideName="module-2-application"
					audioDuration={seg34.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={40.51}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg35.start}
				durationInFrames={seg35.duration}
			>
				<Audio src={audioFiles["module-2-application"]} startFrom={Math.round(50.44 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg35.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"If the data is conflicting the agent flags it for review Again that's a loop Multiple steps Multiple"
					]}
					slideName="module-2-application"
					audioDuration={seg35.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={50.44}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg36.start}
				durationInFrames={seg36.duration}
			>
				<Audio src={audioFiles["module-2-application"]} startFrom={Math.round(59.91 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg36.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"Grounding Safety checks Enterprises are adopting agentic systems because their workloads are not single call problems"
					]}
					slideName="module-2-application"
					audioDuration={seg36.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={59.91}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg37.start}
				durationInFrames={seg37.duration}
			>
				<Audio src={audioFiles["module-2-application"]} startFrom={Math.round(69.65 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg37.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"They're multi step processes that require coordination verification and adaptation Agents are the architectural patte..."
					]}
					slideName="module-2-application"
					audioDuration={seg37.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={69.65}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg38.start}
				durationInFrames={seg38.duration}
			>
				<Audio src={audioFiles["module-2-application"]} startFrom={Math.round(80.11 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg38.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"The shift from demos to workloads is the shift from single calls"
					]}
					slideName="module-2-application"
					audioDuration={seg38.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={80.11}
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg38.start + seg38.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg39.start}
				durationInFrames={seg39.duration}
			>
				<Audio src={audioFiles["module-2-exam-mapping"]} />
				<CrossFadeWrapper
					totalDuration={seg39.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"For the NVIDIA certification this module establishes core vocabulary and concepts you'll see throughout the exam You ..."
					]}
					slideName="module-2-exam-mapping"
					audioDuration={seg39.audioDuration}
					moduleNumber={2}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg40.start}
				durationInFrames={seg40.duration}
			>
				<Audio src={audioFiles["module-2-exam-mapping"]} startFrom={Math.round(10.74 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg40.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"The answer is the loop planning acting observing adapting"
					]}
					slideName="module-2-exam-mapping"
					audioDuration={seg40.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={10.74}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg41.start}
				durationInFrames={seg41.duration}
			>
				<Audio src={audioFiles["module-2-exam-mapping"]} startFrom={Math.round(19.74 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg41.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"You need to recognize the six components and understand their roles Expect questions that ask you to identify"
					]}
					slideName="module-2-exam-mapping"
					audioDuration={seg41.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={19.74}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg42.start}
				durationInFrames={seg42.duration}
			>
				<Audio src={audioFiles["module-2-exam-mapping"]} startFrom={Math.round(30.66 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg42.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"You should also be able"
					]}
					slideName="module-2-exam-mapping"
					audioDuration={seg42.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={30.66}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg43.start}
				durationInFrames={seg43.duration}
			>
				<Audio src={audioFiles["module-2-exam-mapping"]} startFrom={Math.round(39.97 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg43.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"The exam tests whether you understand that production workloads require loops not isolated"
					]}
					slideName="module-2-exam-mapping"
					audioDuration={seg43.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={39.97}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg44.start}
				durationInFrames={seg44.duration}
			>
				<Audio src={audioFiles["module-2-exam-mapping"]} startFrom={Math.round(50.24 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg44.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"Finally pay attention to the terminology",
					"agent loop tool use grounding retrieval working memory long"
					]}
					slideName="module-2-exam-mapping"
					audioDuration={seg44.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={50.24}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg45.start}
				durationInFrames={seg45.duration}
			>
				<Audio src={audioFiles["module-2-exam-mapping"]} startFrom={Math.round(60.24 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg45.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"HITL These terms will appear in questions",
					"and precise understanding matters"
					]}
					slideName="module-2-exam-mapping"
					audioDuration={seg45.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={60.24}
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

			{/* Recap */}
			<Sequence
				from={seg46.start}
				durationInFrames={seg46.duration}
			>
				<Audio src={audioFiles["module-2-recap"]} />
				<CrossFadeWrapper
					totalDuration={seg46.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"Let's consolidate what we covered",
					"An agent is a system that wraps a language model in a control loop",
					"That loop enables Planning Action"
					]}
					slideName="module-2-recap"
					audioDuration={seg46.audioDuration}
					moduleNumber={2}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg47.start}
				durationInFrames={seg47.duration}
			>
				<Audio src={audioFiles["module-2-recap"]} startFrom={Math.round(9.74 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg47.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"Observation and Adaptation It's what transforms a model from a responder into a worker",
					"The agent loop has six core components"
					]}
					slideName="module-2-recap"
					audioDuration={seg47.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={9.74}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg48.start}
				durationInFrames={seg48.duration}
			>
				<Audio src={audioFiles["module-2-recap"]} startFrom={Math.round(18.42 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg48.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"Planning Tools Memory Retrieval Safety and Human in the loop Each component addresses a specific limitation"
					]}
					slideName="module-2-recap"
					audioDuration={seg48.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={18.42}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg49.start}
				durationInFrames={seg49.duration}
			>
				<Audio src={audioFiles["module-2-recap"]} startFrom={Math.round(30.32 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg49.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"Demos show you single calls",
					"Real workloads require loops That's the fundamental distinction this module"
					]}
					slideName="module-2-recap"
					audioDuration={seg49.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={30.32}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg50.start}
				durationInFrames={seg50.duration}
			>
				<Audio src={audioFiles["module-2-recap"]} startFrom={Math.round(40.34 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg50.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"Enterprises are adopting agents because their problems are multi step",
					"verification"
					]}
					slideName="module-2-recap"
					audioDuration={seg50.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={40.34}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg51.start}
				durationInFrames={seg51.duration}
			>
				<Audio src={audioFiles["module-2-recap"]} startFrom={Math.round(49.70 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg51.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"Agents are the architecture that fits And for the certification",
					"you need to know this inside and out"
					]}
					slideName="module-2-recap"
					audioDuration={seg51.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={49.70}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg52.start}
				durationInFrames={seg52.duration}
			>
				<Audio src={audioFiles["module-2-recap"]} startFrom={Math.round(59.38 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg52.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={0}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"The loop is the foundation",
					"Everything else builds"
					]}
					slideName="module-2-recap"
					audioDuration={seg52.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={59.38}
		/>
				</CrossFadeWrapper>
			</Sequence>

		</div>
	);
};
