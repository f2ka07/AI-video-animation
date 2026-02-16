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
	const addSegment = (audioDuration: number, isLastInGroup: boolean, isLastInModule: boolean, buffer: number) => {
		const slideDuration = audioDuration + buffer;
		const start = currentFrame;
		currentFrame += slideDuration * fps + (isLastInGroup && !isLastInModule ? whooshDuration * fps : 0);
		return { start, duration: slideDuration * fps, slideDuration, audioDuration, buffer };
	};

	const seg0 = addSegment(56.26, true, false, 1);
	const seg1 = addSegment(10.72, false, false, 1);
	const seg2 = addSegment(9.68, false, false, 1);
	const seg3 = addSegment(10.20, false, false, 1);
	const seg4 = addSegment(8.60, false, false, 1);
	const seg5 = addSegment(11.12, false, false, 1);
	const seg6 = addSegment(10.06, false, false, 1);
	const seg7 = addSegment(9.66, false, false, 1);
	const seg8 = addSegment(10.06, false, false, 1);
	const seg9 = addSegment(8.66, true, false, 1);
	const seg10 = addSegment(9.99, false, false, 1);
	const seg11 = addSegment(10.06, false, false, 1);
	const seg12 = addSegment(10.09, false, false, 1);
	const seg13 = addSegment(9.71, false, false, 1);
	const seg14 = addSegment(9.72, false, false, 1);
	const seg15 = addSegment(10.83, false, false, 1);
	const seg16 = addSegment(9.03, false, false, 1);
	const seg17 = addSegment(9.85, false, false, 1);
	const seg18 = addSegment(10.87, false, false, 1);
	const seg19 = addSegment(9.72, false, false, 1);
	const seg20 = addSegment(10.79, false, false, 1);
	const seg21 = addSegment(9.25, false, false, 1);
	const seg22 = addSegment(10.55, false, false, 1);
	const seg23 = addSegment(9.63, false, false, 1);
	const seg24 = addSegment(10.14, false, false, 1);
	const seg25 = addSegment(9.81, false, false, 1);
	const seg26 = addSegment(10.08, false, false, 1);
	const seg27 = addSegment(7.57, true, false, 1);
	const seg28 = addSegment(10.12, false, false, 1);
	const seg29 = addSegment(10.21, false, false, 1);
	const seg30 = addSegment(9.68, false, false, 1);
	const seg31 = addSegment(9.80, false, false, 1);
	const seg32 = addSegment(10.11, false, false, 1);
	const seg33 = addSegment(10.11, false, false, 1);
	const seg34 = addSegment(9.53, false, false, 1);
	const seg35 = addSegment(10.96, false, false, 1);
	const seg36 = addSegment(9.38, false, false, 1);
	const seg37 = addSegment(10.14, false, false, 1);
	const seg38 = addSegment(9.96, false, false, 1);
	const seg39 = addSegment(10.28, false, false, 1);
	const seg40 = addSegment(10.20, false, false, 1);
	const seg41 = addSegment(9.25, false, false, 1);
	const seg42 = addSegment(7.43, true, false, 1);
	const seg43 = addSegment(10.42, false, false, 1);
	const seg44 = addSegment(9.59, false, false, 1);
	const seg45 = addSegment(10.83, false, false, 1);
	const seg46 = addSegment(9.28, false, false, 1);
	const seg47 = addSegment(10.86, false, false, 1);
	const seg48 = addSegment(9.10, false, false, 1);
	const seg49 = addSegment(9.99, false, false, 1);
	const seg50 = addSegment(6.88, true, false, 1);
	const seg51 = addSegment(10.52, false, false, 1);
	const seg52 = addSegment(9.48, false, false, 1);
	const seg53 = addSegment(9.76, false, false, 1);
	const seg54 = addSegment(9.60, false, false, 1);
	const seg55 = addSegment(11.44, false, false, 1);
	const seg56 = addSegment(9.52, false, false, 1);
	const seg57 = addSegment(9.76, false, false, 1);
	const seg58 = addSegment(10.02, false, false, 1);
	const seg59 = addSegment(0.75, true, true, 1.2);

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
				from={seg0.start}
				durationInFrames={seg0.duration}
			>
				<Audio src={audioFiles["module-6-title"]} />
				<CrossFadeWrapper
					totalDuration={seg0.slideDuration}
					fadeInDuration={0.5}
					fadeOutDuration={crossFadeDuration}
			>
					<TitleSlide 
					title="Enterprise and Industry Use Cases" 
					subtitle="Enterprise and Industry Use Cases"
					
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
				<Audio src={audioFiles["module-6-concept"]} />
				<CrossFadeWrapper
					totalDuration={seg1.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"Let's start with a framing question",
					"Why do enterprises buy AI Not because it's interesting not because it's new",
					"Enterprises buy AI because"
					]}
					slideName="module-6-concept"
					audioDuration={seg1.audioDuration}
					moduleNumber={6}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg2.start}
				durationInFrames={seg2.duration}
			>
				<Audio src={audioFiles["module-6-concept"]} startFrom={Math.round(10.72 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg2.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"it solves operational problems that matter to the business",
					"Those problems fall into a few categories",
					"Automation Replacing manual"
					]}
					slideName="module-6-concept"
					audioDuration={seg2.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={10.72}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg3.start}
				durationInFrames={seg3.duration}
			>
				<Audio src={audioFiles["module-6-concept"]} startFrom={Math.round(20.40 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg3.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"continuously",
					"This includes document processing data entry routine customer interactions"
					]}
					slideName="module-6-concept"
					audioDuration={seg3.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={20.40}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg4.start}
				durationInFrames={seg4.duration}
			>
				<Audio src={audioFiles["module-6-concept"]} startFrom={Math.round(30.60 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg4.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"Speed Accelerating processes that previously took days or weeks",
					"Research synthesis"
					]}
					slideName="module-6-concept"
					audioDuration={seg4.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={30.60}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg5.start}
				durationInFrames={seg5.duration}
			>
				<Audio src={audioFiles["module-6-concept"]} startFrom={Math.round(39.20 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg5.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"Consistency Ensuring that processes produce the same q..."
					]}
					slideName="module-6-concept"
					audioDuration={seg5.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={39.20}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg6.start}
				durationInFrames={seg6.duration}
			>
				<Audio src={audioFiles["module-6-concept"]} startFrom={Math.round(50.32 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg6.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"Traceability Creating audit trails"
					]}
					slideName="module-6-concept"
					audioDuration={seg6.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={50.32}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg7.start}
				durationInFrames={seg7.duration}
			>
				<Audio src={audioFiles["module-6-concept"]} startFrom={Math.round(60.38 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg7.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"Knowing what happened",
					"Scalability Handling volume that would be impossible with human teams alone"
					]}
					slideName="module-6-concept"
					audioDuration={seg7.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={60.38}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg8.start}
				durationInFrames={seg8.duration}
			>
				<Audio src={audioFiles["module-6-concept"]} startFrom={Math.round(70.04 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg8.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"Thousands of support tickets Millions of documents Continuous monitoring",
					"These are the value drivers that justify agentic AI When you're"
					]}
					slideName="module-6-concept"
					audioDuration={seg8.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={70.04}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg9.start}
				durationInFrames={seg9.duration}
			>
				<Audio src={audioFiles["module-6-concept"]} startFrom={Math.round(80.10 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg9.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"evaluating a use case ask which of these drivers applies",
					"If none do the use case probably isn't ready"
					]}
					slideName="module-6-concept"
					audioDuration={seg9.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={80.10}
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg9.start + seg9.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg10.start}
				durationInFrames={seg10.duration}
			>
				<Audio src={audioFiles["module-6-architecture"]} />
				<CrossFadeWrapper
					totalDuration={seg10.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Now let's look at the use cases themselves Where is agentic AI being deployed in enterprise settings",
					"Knowledge Management Every organization move"
					]}
					slideName="module-6-architecture"
					audioDuration={seg10.audioDuration}
					moduleNumber={6}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg11.start}
				durationInFrames={seg11.duration}
			>
				<Audio src={audioFiles["module-6-architecture"]} startFrom={Math.round(9.99 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg11.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"has institutional knowledge trapped in documents wikis emails and people's heads",
					"Agentic systems can surface this knowledge on demand An employee"
					]}
					slideName="module-6-architecture"
					audioDuration={seg11.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={9.99}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg12.start}
				durationInFrames={seg12.duration}
			>
				<Audio src={audioFiles["module-6-architecture"]} startFrom={Math.round(20.05 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg12.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"The agent retrieves relevant documents synthesizes an answer and provides citations This is retrieval..."
					]}
					slideName="module-6-architecture"
					audioDuration={seg12.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={20.05}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg13.start}
				durationInFrames={seg13.duration}
			>
				<Audio src={audioFiles["module-6-architecture"]} startFrom={Math.round(30.14 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg13.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"The agent doesn't just search It reasons across sources and produces coherent responses",
					"Customer Operations"
					]}
					slideName="module-6-architecture"
					audioDuration={seg13.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={30.14}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg14.start}
				durationInFrames={seg14.duration}
			>
				<Audio src={audioFiles["module-6-architecture"]} startFrom={Math.round(39.85 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg14.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Support sales and success teams handle high volumes of customer interactions Agentic systems can triage tickets"
					]}
					slideName="module-6-architecture"
					audioDuration={seg14.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={39.85}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg15.start}
				durationInFrames={seg15.duration}
			>
				<Audio src={audioFiles["module-6-architecture"]} startFrom={Math.round(49.57 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg15.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"answer common questions draft responses and route complex cases to humans",
					"The agent integrates with CRM systems accesses customer"
					]}
					slideName="module-6-architecture"
					audioDuration={seg15.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={49.57}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg16.start}
				durationInFrames={seg16.duration}
			>
				<Audio src={audioFiles["module-6-architecture"]} startFrom={Math.round(60.40 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg16.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"This isn't a chatbot",
					"It's an operational system that handles real workflow"
					]}
					slideName="module-6-architecture"
					audioDuration={seg16.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={60.40}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg17.start}
				durationInFrames={seg17.duration}
			>
				<Audio src={audioFiles["module-6-architecture"]} startFrom={Math.round(69.43 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg17.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Research and Analysis Analysts spend enormous time gathering data cleaning it and synthesizing findings"
					]}
					slideName="module-6-architecture"
					audioDuration={seg17.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={69.43}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg18.start}
				durationInFrames={seg18.duration}
			>
				<Audio src={audioFiles["module-6-architecture"]} startFrom={Math.round(79.28 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg18.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Agentic systems can automate much of this Given a research question the agent queries data sources retrieves documents"
					]}
					slideName="module-6-architecture"
					audioDuration={seg18.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={79.28}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg19.start}
				durationInFrames={seg19.duration}
			>
				<Audio src={audioFiles["module-6-architecture"]} startFrom={Math.round(90.15 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg19.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Humans review the output but the heavy lifting is automated",
					"Document Automation Contracts"
					]}
					slideName="module-6-architecture"
					audioDuration={seg19.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={90.15}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg20.start}
				durationInFrames={seg20.duration}
			>
				<Audio src={audioFiles["module-6-architecture"]} startFrom={Math.round(99.87 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg20.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"operations",
					"Agentic systems can extract data from documents"
					]}
					slideName="module-6-architecture"
					audioDuration={seg20.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={99.87}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg21.start}
				durationInFrames={seg21.duration}
			>
				<Audio src={audioFiles["module-6-architecture"]} startFrom={Math.round(110.66 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg21.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"This reduces processing time from days"
					]}
					slideName="module-6-architecture"
					audioDuration={seg21.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={110.66}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg22.start}
				durationInFrames={seg22.duration}
			>
				<Audio src={audioFiles["module-6-architecture"]} startFrom={Math.round(119.91 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg22.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Data Workflows Data engineering teams maintain pipelines that data from documents"
					]}
					slideName="module-6-architecture"
					audioDuration={seg22.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={119.91}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg23.start}
				durationInFrames={seg23.duration}
			>
				<Audio src={audioFiles["module-6-architecture"]} startFrom={Math.round(130.46 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg23.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"to warehouses to analytics platforms",
					"Agentic systems can monitor these pipelines diagnose failures suggest fixes and even"
					]}
					slideName="module-6-architecture"
					audioDuration={seg23.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={130.46}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg24.start}
				durationInFrames={seg24.duration}
			>
				<Audio src={audioFiles["module-6-architecture"]} startFrom={Math.round(140.09 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg24.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"The agent becomes an operational copilot for the data team Adjacent Domains",
					"Robotics and Simulation"
					]}
					slideName="module-6-architecture"
					audioDuration={seg24.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={140.09}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg25.start}
				durationInFrames={seg25.duration}
			>
				<Audio src={audioFiles["module-6-architecture"]} startFrom={Math.round(150.23 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg25.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Beyond traditional software agentic systems are appearing in robotics where they coordinate with perception and contr..."
					]}
					slideName="module-6-architecture"
					audioDuration={seg25.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={150.23}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg26.start}
				durationInFrames={seg26.duration}
			>
				<Audio src={audioFiles["module-6-architecture"]} startFrom={Math.round(160.04 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg26.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"These use cases share a common pattern"
					]}
					slideName="module-6-architecture"
					audioDuration={seg26.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={160.04}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg27.start}
				durationInFrames={seg27.duration}
			>
				<Audio src={audioFiles["module-6-architecture"]} startFrom={Math.round(170.12 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg27.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"That's what makes them agentic"
					]}
					slideName="module-6-architecture"
					audioDuration={seg27.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={170.12}
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg27.start + seg27.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg28.start}
				durationInFrames={seg28.duration}
			>
				<Audio src={audioFiles["module-6-application"]} />
				<CrossFadeWrapper
					totalDuration={seg28.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"Understanding use cases is necessary but not sufficient",
					"You also need to understand how enterprises adopt",
					"Adoption happens AI agentic"
					]}
					slideName="module-6-application"
					audioDuration={seg28.audioDuration}
					moduleNumber={6}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg29.start}
				durationInFrames={seg29.duration}
			>
				<Audio src={audioFiles["module-6-application"]} startFrom={Math.round(10.12 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg29.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"Stage 1 Pilot",
					"The organization runs a limited proof of concept Usually a single use case with a small"
					]}
					slideName="module-6-application"
					audioDuration={seg29.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={10.12}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg30.start}
				durationInFrames={seg30.duration}
			>
				<Audio src={audioFiles["module-6-application"]} startFrom={Math.round(20.33 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg30.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"The goal is to validate feasibility",
					"does the technology work for our problem",
					"Pilots are time boxed and resource"
					]}
					slideName="module-6-application"
					audioDuration={seg30.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={20.33}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg31.start}
				durationInFrames={seg31.duration}
			>
				<Audio src={audioFiles["module-6-application"]} startFrom={Math.round(30.01 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg31.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"Many never progress further",
					"Stage 2 Integration A successful pilot",
					"integration"
					]}
					slideName="module-6-application"
					audioDuration={seg31.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={30.01}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg32.start}
				durationInFrames={seg32.duration}
			>
				<Audio src={audioFiles["module-6-application"]} startFrom={Math.round(39.81 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg32.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"The system connects to production data and workflows Security reviews happen Compliance teams get involved This stage is where"
					]}
					slideName="module-6-application"
					audioDuration={seg32.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={39.81}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg33.start}
				durationInFrames={seg33.duration}
			>
				<Audio src={audioFiles["module-6-application"]} startFrom={Math.round(49.92 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg33.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"Integration is harder than prototyping Stage 3",
					"Scale Out Once integrated the system expands to more users more"
					]}
					slideName="module-6-application"
					audioDuration={seg33.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={49.92}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg34.start}
				durationInFrames={seg34.duration}
			>
				<Audio src={audioFiles["module-6-application"]} startFrom={Math.round(60.03 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg34.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"This requires operational maturity monitoring alerting SLAs and support processes"
					]}
					slideName="module-6-application"
					audioDuration={seg34.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={60.03}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg35.start}
				durationInFrames={seg35.duration}
			>
				<Audio src={audioFiles["module-6-application"]} startFrom={Math.round(69.56 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg35.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"Scaling is not just technical It's organizational Stage 4 Platform Standardization At maturity the organization treat..."
					]}
					slideName="module-6-application"
					audioDuration={seg35.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={69.56}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg36.start}
				durationInFrames={seg36.duration}
			>
				<Audio src={audioFiles["module-6-application"]} startFrom={Math.round(80.52 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg36.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"Shared infrastructure Reusable components Governance frameworks",
					"This is rare"
					]}
					slideName="module-6-application"
					audioDuration={seg36.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={80.52}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg37.start}
				durationInFrames={seg37.duration}
			>
				<Audio src={audioFiles["module-6-application"]} startFrom={Math.round(89.90 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg37.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"At this stage AI is not a project It's part of how the organization",
					"Most enterprises"
					]}
					slideName="module-6-application"
					audioDuration={seg37.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={89.90}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg38.start}
				durationInFrames={seg38.duration}
			>
				<Audio src={audioFiles["module-6-application"]} startFrom={Math.round(100.04 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg38.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"are in the pilot or integration phase",
					"The path to platform standardization is long and requires sustained investment Adoption Blockers"
					]}
					slideName="module-6-application"
					audioDuration={seg38.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={100.04}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg39.start}
				durationInFrames={seg39.duration}
			>
				<Audio src={audioFiles["module-6-application"]} startFrom={Math.round(110.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg39.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"Common blockers include unclear ROI making it hard to justify continued investment Data quality issues that undermine..."
					]}
					slideName="module-6-application"
					audioDuration={seg39.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={110.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg40.start}
				durationInFrames={seg40.duration}
			>
				<Audio src={audioFiles["module-6-application"]} startFrom={Math.round(120.28 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg40.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"Organizational resistance from teams who see",
					"AI as a threat And governance"
					]}
					slideName="module-6-application"
					audioDuration={seg40.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={120.28}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg41.start}
				durationInFrames={seg41.duration}
			>
				<Audio src={audioFiles["module-6-application"]} startFrom={Math.round(130.48 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg41.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"For technical leaders adoption is as much about change management"
					]}
					slideName="module-6-application"
					audioDuration={seg41.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={130.48}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg42.start}
				durationInFrames={seg42.duration}
			>
				<Audio src={audioFiles["module-6-application"]} startFrom={Math.round(139.73 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg42.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"For engineers it's about building systems that can survive the friction of real organizations"
					]}
					slideName="module-6-application"
					audioDuration={seg42.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={139.73}
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg42.start + seg42.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg43.start}
				durationInFrames={seg43.duration}
			>
				<Audio src={audioFiles["module-6-exam-mapping"]} />
				<CrossFadeWrapper
					totalDuration={seg43.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"For the certification you need to demonstrate understanding of where agentic AI applies and how enterprises adopt"
					]}
					slideName="module-6-exam-mapping"
					audioDuration={seg43.audioDuration}
					moduleNumber={6}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg44.start}
				durationInFrames={seg44.duration}
			>
				<Audio src={audioFiles["module-6-exam-mapping"]} startFrom={Math.round(10.42 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg44.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"Is this knowledge management customer"
					]}
					slideName="module-6-exam-mapping"
					audioDuration={seg44.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={10.42}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg45.start}
				durationInFrames={seg45.duration}
			>
				<Audio src={audioFiles["module-6-exam-mapping"]} startFrom={Math.round(20.01 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg45.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"Understand the value drivers Questions may ask you to identify which driver justifies"
					]}
					slideName="module-6-exam-mapping"
					audioDuration={seg45.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={20.01}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg46.start}
				durationInFrames={seg46.duration}
			>
				<Audio src={audioFiles["module-6-exam-mapping"]} startFrom={Math.round(30.84 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg46.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"scalability",
					"Know the adoption stages The exam may ask about"
					]}
					slideName="module-6-exam-mapping"
					audioDuration={seg46.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={30.84}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg47.start}
				durationInFrames={seg47.duration}
			>
				<Audio src={audioFiles["module-6-exam-mapping"]} startFrom={Math.round(40.12 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg47.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"Pay attention to maturity indicators Platform s..."
					]}
					slideName="module-6-exam-mapping"
					audioDuration={seg47.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={40.12}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg48.start}
				durationInFrames={seg48.duration}
			>
				<Audio src={audioFiles["module-6-exam-mapping"]} startFrom={Math.round(50.98 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg48.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"The exam tests whether you can recognize..."
					]}
					slideName="module-6-exam-mapping"
					audioDuration={seg48.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={50.98}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg49.start}
				durationInFrames={seg49.duration}
			>
				<Audio src={audioFiles["module-6-exam-mapping"]} startFrom={Math.round(60.08 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg49.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"Finally understand the adjacent domains Robotics and simulation are mentioned in the curriculum Know that ag..."
					]}
					slideName="module-6-exam-mapping"
					audioDuration={seg49.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={60.08}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg50.start}
				durationInFrames={seg50.duration}
			>
				<Audio src={audioFiles["module-6-exam-mapping"]} startFrom={Math.round(70.07 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg50.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"environments"
					]}
					slideName="module-6-exam-mapping"
					audioDuration={seg50.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={70.07}
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg50.start + seg50.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg51.start}
				durationInFrames={seg51.duration}
			>
				<Audio src={audioFiles["module-6-recap"]} />
				<CrossFadeWrapper
					totalDuration={seg51.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"Let's consolidate everything from this module",
					"Agentic AI is a Business category",
					"Technology Enterprises adopt it because"
					]}
					slideName="module-6-recap"
					audioDuration={seg51.audioDuration}
					moduleNumber={6}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg52.start}
				durationInFrames={seg52.duration}
			>
				<Audio src={audioFiles["module-6-recap"]} startFrom={Math.round(10.52 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg52.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"The primary"
					]}
					slideName="module-6-recap"
					audioDuration={seg52.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={10.52}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg53.start}
				durationInFrames={seg53.duration}
			>
				<Audio src={audioFiles["module-6-recap"]} startFrom={Math.round(20.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg53.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"Knowledge management customer operations",
					"research and analysis document automation and data workflows"
					]}
					slideName="module-6-recap"
					audioDuration={seg53.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={20.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg54.start}
				durationInFrames={seg54.duration}
			>
				<Audio src={audioFiles["module-6-recap"]} startFrom={Math.round(29.76 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg54.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"Each is multi step tool intensive and requires enterprise integration",
					"Adoption happens in stages"
					]}
					slideName="module-6-recap"
					audioDuration={seg54.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={29.76}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg55.start}
				durationInFrames={seg55.duration}
			>
				<Audio src={audioFiles["module-6-recap"]} startFrom={Math.round(39.36 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg55.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"Pilot integration scale out and platform standardization",
					"Most organizations are early in this journey The path forward requires sustained investment"
					]}
					slideName="module-6-recap"
					audioDuration={seg55.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={39.36}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg56.start}
				durationInFrames={seg56.duration}
			>
				<Audio src={audioFiles["module-6-recap"]} startFrom={Math.round(50.80 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg56.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"For the certification",
					"understand the use cases the value drivers and the adoption patterns"
					]}
					slideName="module-6-recap"
					audioDuration={seg56.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={50.80}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg57.start}
				durationInFrames={seg57.duration}
			>
				<Audio src={audioFiles["module-6-recap"]} startFrom={Math.round(60.32 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg57.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"This is the practical grounding for everything else in the curriculum",
					"And with that we've completed the foundation You now understand"
					]}
					slideName="module-6-recap"
					audioDuration={seg57.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={60.32}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg58.start}
				durationInFrames={seg58.duration}
			>
				<Audio src={audioFiles["module-6-recap"]} startFrom={Math.round(70.08 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg58.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"Agentic AI is how it works what platform it runs on how it's deployed",
					"The rest is practice Good luck"
					]}
					slideName="module-6-recap"
					audioDuration={seg58.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={70.08}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg59.start}
				durationInFrames={seg59.duration}
			>
				<Audio src={audioFiles["module-6-recap"]} startFrom={Math.round(80.10 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg59.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={0}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"The rest is practice Good luck"
					]}
					slideName="module-6-recap"
					audioDuration={seg59.audioDuration}
					moduleNumber={6}
					
					
					audioStartOffset={80.10}
		/>
				</CrossFadeWrapper>
			</Sequence>

		</div>
	);
};
