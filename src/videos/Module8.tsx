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

export const Module8: React.FC = () => {
	const { fps } = useVideoConfig();
	const crossFadeDuration = 0.3;
	const whooshDuration = 0.57;

	const audioFiles = {
		"module-8-title": staticFile("audio/agentic-ai-for-beginners/module8-module-8-title.wav"),
		"module-8-concept": staticFile("audio/agentic-ai-for-beginners/module8-module-8-concept.wav"),
		"module-8-architecture": staticFile("audio/agentic-ai-for-beginners/module8-module-8-architecture.wav"),
		"module-8-application": staticFile("audio/agentic-ai-for-beginners/module8-module-8-application.wav"),
		"module-8-exam-mapping": staticFile("audio/agentic-ai-for-beginners/module8-module-8-exam-mapping.wav"),
		"module-8-recap": staticFile("audio/agentic-ai-for-beginners/module8-module-8-recap.wav"),
		whoosh: staticFile("audio/whoosh.wav"),
	};

	const audioDurations = {
		"module-8-title": getAudioDuration("agentic-ai-for-beginners/module8-module-8-title"),
		"module-8-concept": getAudioDuration("agentic-ai-for-beginners/module8-module-8-concept"),
		"module-8-architecture": getAudioDuration("agentic-ai-for-beginners/module8-module-8-architecture"),
		"module-8-application": getAudioDuration("agentic-ai-for-beginners/module8-module-8-application"),
		"module-8-exam-mapping": getAudioDuration("agentic-ai-for-beginners/module8-module-8-exam-mapping"),
		"module-8-recap": getAudioDuration("agentic-ai-for-beginners/module8-module-8-recap"),
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

	const seg0 = addSegment(27.47, true, false, 1);
	const seg1 = addSegment(8.90, false, false, 1);
	const seg2 = addSegment(11.34, false, false, 1);
	const seg3 = addSegment(9.75, false, false, 1);
	const seg4 = addSegment(9.97, false, false, 1);
	const seg5 = addSegment(10.05, false, false, 1);
	const seg6 = addSegment(10.55, false, false, 1);
	const seg7 = addSegment(9.87, false, false, 1);
	const seg8 = addSegment(6.05, true, false, 1);
	const seg9 = addSegment(10.40, false, false, 1);
	const seg10 = addSegment(9.50, false, false, 1);
	const seg11 = addSegment(10.19, false, false, 1);
	const seg12 = addSegment(33.37, false, false, 1);
	const seg13 = addSegment(0.50, false, false, 1);
	const seg14 = addSegment(0.50, false, false, 1);
	const seg15 = addSegment(5.04, false, false, 1);
	const seg16 = addSegment(10.84, false, false, 1);
	const seg17 = addSegment(10.24, false, false, 1);
	const seg18 = addSegment(8.99, false, false, 1);
	const seg19 = addSegment(6.78, true, false, 1);
	const seg20 = addSegment(10.03, false, false, 1);
	const seg21 = addSegment(10.08, false, false, 1);
	const seg22 = addSegment(10.04, false, false, 1);
	const seg23 = addSegment(10.19, false, false, 1);
	const seg24 = addSegment(9.85, false, false, 1);
	const seg25 = addSegment(9.97, false, false, 1);
	const seg26 = addSegment(10.13, false, false, 1);
	const seg27 = addSegment(10.12, false, false, 1);
	const seg28 = addSegment(0.28, true, false, 1);
	const seg29 = addSegment(34.48, true, false, 1);
	const seg30 = addSegment(35.47, true, true, 1.2);

	return (
		<div
			style={{
				width: "100%",
			height: "100%",
			background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
			position: "relative",
		}}
		>
			{/* Reasoning, Planning, and Memory */}
			<Sequence
				from={seg0.start}
				durationInFrames={seg0.duration}
			>
				<Audio src={audioFiles["module-8-title"]} />
				<CrossFadeWrapper
					totalDuration={seg0.slideDuration}
					fadeInDuration={0.5}
					fadeOutDuration={crossFadeDuration}
			>
					<TitleSlide 
					title="Reasoning, Planning, and Memory" 
					subtitle="Reasoning, Planning, and Memory"
					
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
				<Audio src={audioFiles["module-8-concept"]} />
				<CrossFadeWrapper
					totalDuration={seg1.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"Let's talk about how agents reason and where it breaks Task decomposition is the first step The agent"
					]}
					slideName="module-8-concept"
					audioDuration={seg1.audioDuration}
					moduleNumber={8}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg2.start}
				durationInFrames={seg2.duration}
			>
				<Audio src={audioFiles["module-8-concept"]} startFrom={Math.round(8.90 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg2.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"Summarize this document becomes retrieve the document extract key sections synthesize format Step planning can be exp..."
					]}
					slideName="module-8-concept"
					audioDuration={seg2.audioDuration}
					moduleNumber={8}
					
					
					audioStartOffset={8.90}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg3.start}
				durationInFrames={seg3.duration}
			>
				<Audio src={audioFiles["module-8-concept"]} startFrom={Math.round(20.24 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg3.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"a structured planner outputs a list or implicit the language model reasons through steps in one pass Explicit"
					]}
					slideName="module-8-concept"
					audioDuration={seg3.audioDuration}
					moduleNumber={8}
					
					
					audioStartOffset={20.24}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg4.start}
				durationInFrames={seg4.duration}
			>
				<Audio src={audioFiles["module-8-concept"]} startFrom={Math.round(29.99 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg4.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"Implicit is more flexible Most production systems use a hybrid",
					"high level plan from a planner flexible execution from the model"
					]}
					slideName="module-8-concept"
					audioDuration={seg4.audioDuration}
					moduleNumber={8}
					
					
					audioStartOffset={29.99}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg5.start}
				durationInFrames={seg5.duration}
			>
				<Audio src={audioFiles["module-8-concept"]} startFrom={Math.round(39.96 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg5.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"Reflection and self correction are what separate robust agents from brittle ones After an action the agent can"
					]}
					slideName="module-8-concept"
					audioDuration={seg5.audioDuration}
					moduleNumber={8}
					
					
					audioStartOffset={39.96}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg6.start}
				durationInFrames={seg6.duration}
			>
				<Audio src={audioFiles["module-8-concept"]} startFrom={Math.round(50.01 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg6.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"Is the format correct Did I miss something Reflection patterns include generate then critique where a critic model"
					]}
					slideName="module-8-concept"
					audioDuration={seg6.audioDuration}
					moduleNumber={8}
					
					
					audioStartOffset={50.01}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg7.start}
				durationInFrames={seg7.duration}
			>
				<Audio src={audioFiles["module-8-concept"]} startFrom={Math.round(60.56 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg7.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"chain of verification where the agent checks its own reasoning and iterative refinement where the agent loops until"
					]}
					slideName="module-8-concept"
					audioDuration={seg7.audioDuration}
					moduleNumber={8}
					
					
					audioStartOffset={60.56}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg8.start}
				durationInFrames={seg8.duration}
			>
				<Audio src={audioFiles["module-8-concept"]} startFrom={Math.round(70.43 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg8.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"These patterns reduce hallucination",
					"and improve accuracy"
					]}
					slideName="module-8-concept"
					audioDuration={seg8.audioDuration}
					moduleNumber={8}
					
					
					audioStartOffset={70.43}
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
				<Audio src={audioFiles["module-8-architecture"]} />
				<CrossFadeWrapper
					totalDuration={seg9.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Now let's map memory to failure modes",
					"Working memory holds the current task context the goal what's been done what's pending observed no"
					]}
					slideName="module-8-architecture"
					audioDuration={seg9.audioDuration}
					moduleNumber={8}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg10.start}
				durationInFrames={seg10.duration}
			>
				<Audio src={audioFiles["module-8-architecture"]} startFrom={Math.round(10.40 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg10.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"It's a conversation buffer or session state When does reasoning fail When the agent forgets the original"
					]}
					slideName="module-8-architecture"
					audioDuration={seg10.audioDuration}
					moduleNumber={8}
					
					
					audioStartOffset={10.40}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg11.start}
				durationInFrames={seg11.duration}
			>
				<Audio src={audioFiles["module-8-architecture"]} startFrom={Math.round(19.90 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg11.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Summarize in bullet points gets lost after three tool calls",
					"Fix keep the instruction in working memory and re inject it at each"
					]}
					slideName="module-8-architecture"
					audioDuration={seg11.audioDuration}
					moduleNumber={8}
					
					
					audioStartOffset={19.90}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg12.start}
				durationInFrames={seg12.duration}
			>
				<Audio src={audioFiles["module-8-architecture"]} startFrom={Math.round(30.09 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg12.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Working memory solves the forgotten instruction problem Long term memory persists across sessions It's vector st...",
					"What did we decide about the project timeline if it's not in the model's context window the agent",
					"No Context"
					]}
					slideName="module-8-architecture"
					audioDuration={seg12.audioDuration}
					moduleNumber={8}
					
					
					audioStartOffset={30.09}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg13.start}
				durationInFrames={seg13.duration}
			>
				<Audio src={audioFiles["module-8-architecture"]} startFrom={Math.round(63.46 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg13.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"What did we decide about the project timeline",
					"Fix store important outcomes in long"
					]}
					slideName="module-8-architecture"
					audioDuration={seg13.audioDuration}
					moduleNumber={8}
					
					
					audioStartOffset={63.46}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg14.start}
				durationInFrames={seg14.duration}
			>
				<Audio src={audioFiles["module-8-architecture"]} startFrom={Math.round(63.96 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg14.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Long term memory solves the context problem"
					]}
					slideName="module-8-architecture"
					audioDuration={seg14.audioDuration}
					moduleNumber={8}
					
					
					audioStartOffset={63.96}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg15.start}
				durationInFrames={seg15.duration}
			>
				<Audio src={audioFiles["module-8-architecture"]} startFrom={Math.round(64.46 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg15.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Session context bridges the two It's the rolling window of recent turns"
					]}
					slideName="module-8-architecture"
					audioDuration={seg15.audioDuration}
					moduleNumber={8}
					
					
					audioStartOffset={64.46}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg16.start}
				durationInFrames={seg16.duration}
			>
				<Audio src={audioFiles["module-8-architecture"]} startFrom={Math.round(69.50 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg16.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"When does reasoning fail When the agent loops repeating the same action or reasoning without progress Fix detect"
					]}
					slideName="module-8-architecture"
					audioDuration={seg16.audioDuration}
					moduleNumber={8}
					
					
					audioStartOffset={69.50}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg17.start}
				durationInFrames={seg17.duration}
			>
				<Audio src={audioFiles["module-8-architecture"]} startFrom={Math.round(80.34 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg17.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Session context helps with the looping reasoning problem Memory hygiene"
					]}
					slideName="module-8-architecture"
					audioDuration={seg17.audioDuration}
					moduleNumber={8}
					
					
					audioStartOffset={80.34}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg18.start}
				durationInFrames={seg18.duration}
			>
				<Audio src={audioFiles["module-8-architecture"]} startFrom={Math.round(90.58 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg18.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Use TTL time to live for ephemeral data Filter retrieval by relevance"
					]}
					slideName="module-8-architecture"
					audioDuration={seg18.audioDuration}
					moduleNumber={8}
					
					
					audioStartOffset={90.58}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg19.start}
				durationInFrames={seg19.duration}
			>
				<Audio src={audioFiles["module-8-architecture"]} startFrom={Math.round(99.57 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg19.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Without hygiene memory becomes noisy and retrieval returns irrelevant results"
					]}
					slideName="module-8-architecture"
					audioDuration={seg19.audioDuration}
					moduleNumber={8}
					
					
					audioStartOffset={99.57}
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg19.start + seg19.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg20.start}
				durationInFrames={seg20.duration}
			>
				<Audio src={audioFiles["module-8-application"]} />
				<CrossFadeWrapper
					totalDuration={seg20.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"How do you implement these patterns in practice For reflection add a critique step after each major output"
					]}
					slideName="module-8-application"
					audioDuration={seg20.audioDuration}
					moduleNumber={8}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg21.start}
				durationInFrames={seg21.duration}
			>
				<Audio src={audioFiles["module-8-application"]} startFrom={Math.round(10.03 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg21.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"If it fails the agent retries with the feedback This adds latency but improves quality"
					]}
					slideName="module-8-application"
					audioDuration={seg21.audioDuration}
					moduleNumber={8}
					
					
					audioStartOffset={10.03}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg22.start}
				durationInFrames={seg22.duration}
			>
				<Audio src={audioFiles["module-8-application"]} startFrom={Math.round(20.11 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg22.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"For working memory maintain a structured state object Include goal steps completed current step i..."
					]}
					slideName="module-8-application"
					audioDuration={seg22.audioDuration}
					moduleNumber={8}
					
					
					audioStartOffset={20.11}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg23.start}
				durationInFrames={seg23.duration}
			>
				<Audio src={audioFiles["module-8-application"]} startFrom={Math.round(30.15 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg23.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"Re inject the instruction into every model call Don't assume the model remembers after five tool calls",
					"It won't For long term memory"
					]}
					slideName="module-8-application"
					audioDuration={seg23.audioDuration}
					moduleNumber={8}
					
					
					audioStartOffset={30.15}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg24.start}
				durationInFrames={seg24.duration}
			>
				<Audio src={audioFiles["module-8-application"]} startFrom={Math.round(40.34 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg24.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"On retrieval apply freshness filters"
					]}
					slideName="module-8-application"
					audioDuration={seg24.audioDuration}
					moduleNumber={8}
					
					
					audioStartOffset={40.34}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg25.start}
				durationInFrames={seg25.duration}
			>
				<Audio src={audioFiles["module-8-application"]} startFrom={Math.round(50.19 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg25.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"This grounds responses and reduces hallucination For ant..."
					]}
					slideName="module-8-application"
					audioDuration={seg25.audioDuration}
					moduleNumber={8}
					
					
					audioStartOffset={50.19}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg26.start}
				durationInFrames={seg26.duration}
			>
				<Audio src={audioFiles["module-8-application"]} startFrom={Math.round(60.16 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg26.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"If the same tool is called with the same args three times",
					"or the same reasoning pattern repeats",
					"trigger a stop"
					]}
					slideName="module-8-application"
					audioDuration={seg26.audioDuration}
					moduleNumber={8}
					
					
					audioStartOffset={60.16}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg27.start}
				durationInFrames={seg27.duration}
			>
				<Audio src={audioFiles["module-8-application"]} startFrom={Math.round(70.29 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg27.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"Max step limits are a simple guard",
					"N steps stop or escalate regardless"
					]}
					slideName="module-8-application"
					audioDuration={seg27.audioDuration}
					moduleNumber={8}
					
					
					audioStartOffset={70.29}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg28.start}
				durationInFrames={seg28.duration}
			>
				<Audio src={audioFiles["module-8-application"]} startFrom={Math.round(80.41 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg28.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"N steps stop or escalate regardless"
					]}
					slideName="module-8-application"
					audioDuration={seg28.audioDuration}
					moduleNumber={8}
					
					
					audioStartOffset={80.41}
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

			{/* Exam Mapping */}
			<Sequence
				from={seg29.start}
				durationInFrames={seg29.duration}
			>
				<Audio src={audioFiles["module-8-exam-mapping"]} />
				<CrossFadeWrapper
					totalDuration={seg29.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"The certification will test your understanding of reasoning failures and memory solutions Key terms task decompositio...",
					"You'll need to match failure modes to fixes forgotten instruction",
					"Looping session context and stop conditions"
					]}
					slideName="module-8-exam-mapping"
					audioDuration={seg29.audioDuration}
					moduleNumber={8}
					
					
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

			{/* Recap */}
			<Sequence
				from={seg30.start}
				durationInFrames={seg30.duration}
			>
				<Audio src={audioFiles["module-8-recap"]} />
				<CrossFadeWrapper
					totalDuration={seg30.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={0}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"Reasoning fails in predictable ways forgotten instructions missing context looping",
					"Working memory fixes forgotten instructions",
					"Long term memory fixes missing context",
					"Session context and anti loop guards fix looping Reflection patterns critique verification refinement improve output ...",
					"Memory hygiene summarization TTL retrieval filtering keeps memory useful Design your memory model for the failures yo..."
					]}
					slideName="module-8-recap"
					audioDuration={seg30.audioDuration}
					moduleNumber={8}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

		</div>
	);
};
