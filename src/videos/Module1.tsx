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

	const audioDurations = {
		"module-1-title": getAudioDuration("agentic-ai-for-beginners/module1-module-1-title"),
		"module-1-concept": getAudioDuration("agentic-ai-for-beginners/module1-module-1-concept"),
		"module-1-architecture": getAudioDuration("agentic-ai-for-beginners/module1-module-1-architecture"),
		"module-1-application": getAudioDuration("agentic-ai-for-beginners/module1-module-1-application"),
		"module-1-exam-mapping": getAudioDuration("agentic-ai-for-beginners/module1-module-1-exam-mapping"),
		"module-1-recap": getAudioDuration("agentic-ai-for-beginners/module1-module-1-recap"),
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

	const seg0 = addSegment(42.87, true, false, 1);
	const seg1 = addSegment(10.00, false, false, 1);
	const seg2 = addSegment(10.03, false, false, 1);
	const seg3 = addSegment(10.13, false, false, 1);
	const seg4 = addSegment(10.13, false, false, 1);
	const seg5 = addSegment(9.71, false, false, 1);
	const seg6 = addSegment(10.01, false, false, 1);
	const seg7 = addSegment(10.78, false, false, 1);
	const seg8 = addSegment(8.64, false, false, 1);
	const seg9 = addSegment(9.62, false, false, 1);
	const seg10 = addSegment(9.99, true, false, 1);
	const seg11 = addSegment(8.76, false, false, 1);
	const seg12 = addSegment(11.30, false, false, 1);
	const seg13 = addSegment(4.50, false, false, 1);
	const seg14 = addSegment(13.78, false, false, 1);
	const seg15 = addSegment(9.34, false, false, 1);
	const seg16 = addSegment(12.62, false, false, 1);
	const seg17 = addSegment(9.04, false, false, 1);
	const seg18 = addSegment(10.66, false, false, 1);
	const seg19 = addSegment(10.08, false, false, 1);
	const seg20 = addSegment(9.26, false, false, 1);
	const seg21 = addSegment(10.38, false, false, 1);
	const seg22 = addSegment(7.78, true, false, 1);
	const seg23 = addSegment(11.56, false, false, 1);
	const seg24 = addSegment(7.78, false, false, 1);
	const seg25 = addSegment(10.64, false, false, 1);
	const seg26 = addSegment(10.02, false, false, 1);
	const seg27 = addSegment(7.62, false, false, 1);
	const seg28 = addSegment(12.62, false, false, 1);
	const seg29 = addSegment(9.68, false, false, 1);
	const seg30 = addSegment(10.40, false, false, 1);
	const seg31 = addSegment(2.84, true, false, 1);
	const seg32 = addSegment(10.06, false, false, 1);
	const seg33 = addSegment(10.46, false, false, 1);
	const seg34 = addSegment(9.81, false, false, 1);
	const seg35 = addSegment(9.78, false, false, 1);
	const seg36 = addSegment(4.84, true, false, 1);
	const seg37 = addSegment(10.00, false, false, 1);
	const seg38 = addSegment(10.00, false, false, 1);
	const seg39 = addSegment(10.28, false, false, 1);
	const seg40 = addSegment(9.90, false, false, 1);
	const seg41 = addSegment(9.90, false, false, 1);
	const seg42 = addSegment(7.12, true, true, 1.2);

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
				from={seg0.start}
				durationInFrames={seg0.duration}
			>
				<Audio src={audioFiles["module-1-title"]} />
				<CrossFadeWrapper
					totalDuration={seg0.slideDuration}
					fadeInDuration={0.5}
					fadeOutDuration={crossFadeDuration}
			>
					<TitleSlide 
					title="The Agentic AI Transition" 
					subtitle="The Agentic AI Transition"
					
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
				<Audio src={audioFiles["module-1-concept"]} />
				<CrossFadeWrapper
					totalDuration={seg1.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"Let's start by understanding what we're leaving behind",
					"When you type a prompt into ChatGPT or Claude you're making a single call to a language model",
					"Agentic"
					]}
					slideName="module-1-concept"
					audioDuration={seg1.audioDuration}
					moduleNumber={1}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg2.start}
				durationInFrames={seg2.duration}
			>
				<Audio src={audioFiles["module-1-concept"]} startFrom={Math.round(10.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg2.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"You send input the model generates output",
					"This is called single call inference It's useful"
					]}
					slideName="module-1-concept"
					audioDuration={seg2.audioDuration}
					moduleNumber={1}
					
					
					audioStartOffset={10.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg3.start}
				durationInFrames={seg3.duration}
			>
				<Audio src={audioFiles["module-1-concept"]} startFrom={Math.round(20.03 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg3.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"It's accessible And for production workloads it's fundamentally limited Single call systems have no memory between"
					]}
					slideName="module-1-concept"
					audioDuration={seg3.audioDuration}
					moduleNumber={1}
					
					
					audioStartOffset={20.03}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg4.start}
				durationInFrames={seg4.duration}
			>
				<Audio src={audioFiles["module-1-concept"]} startFrom={Math.round(30.16 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg4.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"They cannot plan across multiple steps They cannot use external tools They cannot verify their own outputs"
					]}
					slideName="module-1-concept"
					audioDuration={seg4.audioDuration}
					moduleNumber={1}
					
					
					audioStartOffset={30.16}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg5.start}
				durationInFrames={seg5.duration}
			>
				<Audio src={audioFiles["module-1-concept"]} startFrom={Math.round(40.29 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg5.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"In short they respond They don't work Agentic AI is different An agent is not"
					]}
					slideName="module-1-concept"
					audioDuration={seg5.audioDuration}
					moduleNumber={1}
					
					
					audioStartOffset={40.29}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg6.start}
				durationInFrames={seg6.duration}
			>
				<Audio src={audioFiles["module-1-concept"]} startFrom={Math.round(50.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg6.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"It's a system architecture It's a pipeline that orchestrates language models alongside planning memory tool ..."
					]}
					slideName="module-1-concept"
					audioDuration={seg6.audioDuration}
					moduleNumber={1}
					
					
					audioStartOffset={50.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg7.start}
				durationInFrames={seg7.duration}
			>
				<Audio src={audioFiles["module-1-concept"]} startFrom={Math.round(60.01 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg7.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"When we say agentic we mean the AI",
					"can perceive its environment reason about goals take actions"
					]}
					slideName="module-1-concept"
					audioDuration={seg7.audioDuration}
					moduleNumber={1}
					
					
					audioStartOffset={60.01}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg8.start}
				durationInFrames={seg8.duration}
			>
				<Audio src={audioFiles["module-1-concept"]} startFrom={Math.round(70.79 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg8.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"It operates in loops not single shots It retrieves information when needed"
					]}
					slideName="module-1-concept"
					audioDuration={seg8.audioDuration}
					moduleNumber={1}
					
					
					audioStartOffset={70.79}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg9.start}
				durationInFrames={seg9.duration}
			>
				<Audio src={audioFiles["module-1-concept"]} startFrom={Math.round(79.43 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg9.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"It calls external tools It remembers context",
					"And critically it can be interrupted"
					]}
					slideName="module-1-concept"
					audioDuration={seg9.audioDuration}
					moduleNumber={1}
					
					
					audioStartOffset={79.43}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg10.start}
				durationInFrames={seg10.duration}
			>
				<Audio src={audioFiles["module-1-concept"]} startFrom={Math.round(89.05 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg10.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"AI as interface to AI as infrastructure"
					]}
					slideName="module-1-concept"
					audioDuration={seg10.audioDuration}
					moduleNumber={1}
					
					
					audioStartOffset={89.05}
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg10.start + seg10.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg11.start}
				durationInFrames={seg11.duration}
			>
				<Audio src={audioFiles["module-1-architecture"]} />
				<CrossFadeWrapper
					totalDuration={seg11.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"what does an agentic system actually look like at the highest level an agent is a pipeline with five"
					]}
					slideName="module-1-architecture"
					audioDuration={seg11.audioDuration}
					moduleNumber={1}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg12.start}
				durationInFrames={seg12.duration}
			>
				<Audio src={audioFiles["module-1-architecture"]} startFrom={Math.round(8.76 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg12.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"on an execution order and adapt when things go wrong this",
					"is where reasoning models earn their value"
					]}
					slideName="module-1-architecture"
					audioDuration={seg12.audioDuration}
					moduleNumber={1}
					
					
					audioStartOffset={8.76}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg13.start}
				durationInFrames={seg13.duration}
			>
				<Audio src={audioFiles["module-1-architecture"]} startFrom={Math.round(20.06 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg13.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"planning isn't just thinking it's structured decision-making under uncertainty second tools an agent without tools"
					]}
					slideName="module-1-architecture"
					audioDuration={seg13.audioDuration}
					moduleNumber={1}
					
					
					audioStartOffset={20.06}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg14.start}
				durationInFrames={seg14.duration}
			>
				<Audio src={audioFiles["module-1-architecture"]} startFrom={Math.round(24.56 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg14.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"is just a language model with extra steps tools are the interfaces",
					"interfaces that let agents interact with the real world apis"
					]}
					slideName="module-1-architecture"
					audioDuration={seg14.audioDuration}
					moduleNumber={1}
					
					
					audioStartOffset={24.56}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg15.start}
				durationInFrames={seg15.duration}
			>
				<Audio src={audioFiles["module-1-architecture"]} startFrom={Math.round(38.34 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg15.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"databases file systems code interpreters search engines and more"
					]}
					slideName="module-1-architecture"
					audioDuration={seg15.audioDuration}
					moduleNumber={1}
					
					
					audioStartOffset={38.34}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg16.start}
				durationInFrames={seg16.duration}
			>
				<Audio src={audioFiles["module-1-architecture"]} startFrom={Math.round(47.68 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg16.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"more tool use is what makes agents useful beyond conversation third memory agents need to retain information across"
					]}
					slideName="module-1-architecture"
					audioDuration={seg16.audioDuration}
					moduleNumber={1}
					
					
					audioStartOffset={47.68}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg17.start}
				durationInFrames={seg17.duration}
			>
				<Audio src={audioFiles["module-1-architecture"]} startFrom={Math.round(60.30 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg17.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"the current task context long-term memory stores",
					"knowledge that persists across sessions"
					]}
					slideName="module-1-architecture"
					audioDuration={seg17.audioDuration}
					moduleNumber={1}
					
					
					audioStartOffset={60.30}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg18.start}
				durationInFrames={seg18.duration}
			>
				<Audio src={audioFiles["module-1-architecture"]} startFrom={Math.round(69.34 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg18.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"without memory agents would repeat",
					"mistakes indefinitely fourth safety loops",
					"this includes guardrails that filter harmful",
					"outputs policy"
					]}
					slideName="module-1-architecture"
					audioDuration={seg18.audioDuration}
					moduleNumber={1}
					
					
					audioStartOffset={69.34}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg19.start}
				durationInFrames={seg19.duration}
			>
				<Audio src={audioFiles["module-1-architecture"]} startFrom={Math.round(80.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg19.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"checks that enforce business rules and evaluation layers that assess",
					"assess whether the agent is on track safety isn't optional in production it's",
					"load-bearing"
					]}
					slideName="module-1-architecture"
					audioDuration={seg19.audioDuration}
					moduleNumber={1}
					
					
					audioStartOffset={80.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg20.start}
				durationInFrames={seg20.duration}
			>
				<Audio src={audioFiles["module-1-architecture"]} startFrom={Math.round(90.08 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg20.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"fifth human-in-the-loop not every decision",
					"should be automated agentic systems must know when to pause escalate and defer"
					]}
					slideName="module-1-architecture"
					audioDuration={seg20.audioDuration}
					moduleNumber={1}
					
					
					audioStartOffset={90.08}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg21.start}
				durationInFrames={seg21.duration}
			>
				<Audio src={audioFiles["module-1-architecture"]} startFrom={Math.round(99.34 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg21.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"to human judgment this is especially critical for high-stakes domains",
					"like healthcare finance and legal here's the mental model that matters"
					]}
					slideName="module-1-architecture"
					audioDuration={seg21.audioDuration}
					moduleNumber={1}
					
					
					audioStartOffset={99.34}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg22.start}
				durationInFrames={seg22.duration}
			>
				<Audio src={audioFiles["module-1-architecture"]} startFrom={Math.round(109.72 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg22.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"agents are pipelines not personas they're not characters you chat with they're systems you deploy"
					]}
					slideName="module-1-architecture"
					audioDuration={seg22.audioDuration}
					moduleNumber={1}
					
					
					audioStartOffset={109.72}
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg22.start + seg22.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg23.start}
				durationInFrames={seg23.duration}
			>
				<Audio src={audioFiles["module-1-application"]} />
				<CrossFadeWrapper
					totalDuration={seg23.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"why are enterprises making this transition now three drivers dominate first reliability single-call systems are britt...",
					"traceability"
					]}
					slideName="module-1-application"
					audioDuration={seg23.audioDuration}
					moduleNumber={1}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg24.start}
				durationInFrames={seg24.duration}
			>
				<Audio src={audioFiles["module-1-application"]} startFrom={Math.round(11.56 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg24.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"in regulated industries you need to know what the ai",
					"did why it did it and what data it used agentic systems"
					]}
					slideName="module-1-application"
					audioDuration={seg24.audioDuration}
					moduleNumber={1}
					
					
					audioStartOffset={11.56}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg25.start}
				durationInFrames={seg25.duration}
			>
				<Audio src={audioFiles["module-1-application"]} startFrom={Math.round(19.34 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg25.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"can log every step every tool",
					"call every memory access"
					]}
					slideName="module-1-application"
					audioDuration={seg25.audioDuration}
					moduleNumber={1}
					
					
					audioStartOffset={19.34}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg26.start}
				durationInFrames={seg26.duration}
			>
				<Audio src={audioFiles["module-1-application"]} startFrom={Math.round(29.98 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg26.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"compliance",
					"third integration enterprises don't run isolated models they run systems that connect"
					]}
					slideName="module-1-application"
					audioDuration={seg26.audioDuration}
					moduleNumber={1}
					
					
					audioStartOffset={29.98}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg27.start}
				durationInFrames={seg27.duration}
			>
				<Audio src={audioFiles["module-1-application"]} startFrom={Math.round(40.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg27.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"compliance",
					"third integration enterprises don't run isolated models they run systems that connect"
					]}
					slideName="module-1-application"
					audioDuration={seg27.audioDuration}
					moduleNumber={1}
					
					
					audioStartOffset={40.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg28.start}
				durationInFrames={seg28.duration}
			>
				<Audio src={audioFiles["module-1-application"]} startFrom={Math.round(47.62 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg28.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"warehouses",
					"and internal apis agentic architectures are built for integration"
					]}
					slideName="module-1-application"
					audioDuration={seg28.audioDuration}
					moduleNumber={1}
					
					
					audioStartOffset={47.62}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg29.start}
				durationInFrames={seg29.duration}
			>
				<Audio src={audioFiles["module-1-application"]} startFrom={Math.round(60.24 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg29.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"integration they treat external tools as first-class citizens the result is a new category of workload ai"
					]}
					slideName="module-1-application"
					audioDuration={seg29.audioDuration}
					moduleNumber={1}
					
					
					audioStartOffset={60.24}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg30.start}
				durationInFrames={seg30.duration}
			>
				<Audio src={audioFiles["module-1-application"]} startFrom={Math.round(69.92 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg30.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"that doesn't just answer questions but executes workflows ai that doesn't just generate content but manages processes ai"
					]}
					slideName="module-1-application"
					audioDuration={seg30.audioDuration}
					moduleNumber={1}
					
					
					audioStartOffset={69.92}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg31.start}
				durationInFrames={seg31.duration}
			>
				<Audio src={audioFiles["module-1-application"]} startFrom={Math.round(80.32 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg31.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"just assist but operates"
					]}
					slideName="module-1-application"
					audioDuration={seg31.audioDuration}
					moduleNumber={1}
					
					
					audioStartOffset={80.32}
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg31.start + seg31.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg32.start}
				durationInFrames={seg32.duration}
			>
				<Audio src={audioFiles["module-1-exam-mapping"]} />
				<CrossFadeWrapper
					totalDuration={seg32.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"If you're preparing for the NVIDIA certification this module maps to several key areas You'll need to understand"
					]}
					slideName="module-1-exam-mapping"
					audioDuration={seg32.audioDuration}
					moduleNumber={1}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg33.start}
				durationInFrames={seg33.duration}
			>
				<Audio src={audioFiles["module-1-exam-mapping"]} startFrom={Math.round(10.06 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg33.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"You'll need to recognize the limitations of single call inference a..."
					]}
					slideName="module-1-exam-mapping"
					audioDuration={seg33.audioDuration}
					moduleNumber={1}
					
					
					audioStartOffset={10.06}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg34.start}
				durationInFrames={seg34.duration}
			>
				<Audio src={audioFiles["module-1-exam-mapping"]} startFrom={Math.round(20.52 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg34.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"You'll also need vocabulary alignment Terms like agent loop tool use grounding and human"
					]}
					slideName="module-1-exam-mapping"
					audioDuration={seg34.audioDuration}
					moduleNumber={1}
					
					
					audioStartOffset={20.52}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg35.start}
				durationInFrames={seg35.duration}
			>
				<Audio src={audioFiles["module-1-exam-mapping"]} startFrom={Math.round(30.33 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg35.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"This module establishes the conceptual foundation for those terms Think",
					"And Human In The Loop Appear Throughout The Exam"
					]}
					slideName="module-1-exam-mapping"
					audioDuration={seg35.audioDuration}
					moduleNumber={1}
					
					
					audioStartOffset={30.33}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg36.start}
				durationInFrames={seg36.duration}
			>
				<Audio src={audioFiles["module-1-exam-mapping"]} startFrom={Math.round(40.11 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg36.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"The rest of the course builds on these ideas"
					]}
					slideName="module-1-exam-mapping"
					audioDuration={seg36.audioDuration}
					moduleNumber={1}
					
					
					audioStartOffset={40.11}
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg36.start + seg36.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg37.start}
				durationInFrames={seg37.duration}
			>
				<Audio src={audioFiles["module-1-recap"]} />
				<CrossFadeWrapper
					totalDuration={seg37.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"let's lock in the key points prompting was never the product it was the user interface for early"
					]}
					slideName="module-1-recap"
					audioDuration={seg37.audioDuration}
					moduleNumber={1}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg38.start}
				durationInFrames={seg38.duration}
			>
				<Audio src={audioFiles["module-1-recap"]} startFrom={Math.round(10.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg38.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"value of large language models emerges when they're embedded in pipelines not chat windows agents are not chatbots"
					]}
					slideName="module-1-recap"
					audioDuration={seg38.audioDuration}
					moduleNumber={1}
					
					
					audioStartOffset={10.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg39.start}
				durationInFrames={seg39.duration}
			>
				<Audio src={audioFiles["module-1-recap"]} startFrom={Math.round(20.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg39.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"let's lock in the key points prompting was never the product it was the user interface for early"
					]}
					slideName="module-1-recap"
					audioDuration={seg39.audioDuration}
					moduleNumber={1}
					
					
					audioStartOffset={20.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg40.start}
				durationInFrames={seg40.duration}
			>
				<Audio src={audioFiles["module-1-recap"]} startFrom={Math.round(30.28 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg40.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"of large language models emerges when they're embedded in pipelines not chat windows agents are not chatbots they're"
					]}
					slideName="module-1-recap"
					audioDuration={seg40.audioDuration}
					moduleNumber={1}
					
					
					audioStartOffset={30.28}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg41.start}
				durationInFrames={seg41.duration}
			>
				<Audio src={audioFiles["module-1-recap"]} startFrom={Math.round(40.18 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg41.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"real work enterprises are adopting agentic ai because they need reliability traceability and integration these aren't..."
					]}
					slideName="module-1-recap"
					audioDuration={seg41.audioDuration}
					moduleNumber={1}
					
					
					audioStartOffset={40.18}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg42.start}
				durationInFrames={seg42.duration}
			>
				<Audio src={audioFiles["module-1-recap"]} startFrom={Math.round(50.08 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg42.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={0}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"is designed to validate that you understand not just how models work but how agentic systems are built"
					]}
					slideName="module-1-recap"
					audioDuration={seg42.audioDuration}
					moduleNumber={1}
					
					
					audioStartOffset={50.08}
		/>
				</CrossFadeWrapper>
			</Sequence>

		</div>
	);
};
