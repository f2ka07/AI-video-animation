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

export const Module11: React.FC = () => {
	const { fps } = useVideoConfig();
	const crossFadeDuration = 0.3;
	const whooshDuration = 0.57;

	const audioFiles = {
		"module-11-title": staticFile("audio/agentic-ai-for-beginners/module11-module-11-title.wav"),
		"module-11-concept": staticFile("audio/agentic-ai-for-beginners/module11-module-11-concept.wav"),
		"module-11-architecture": staticFile("audio/agentic-ai-for-beginners/module11-module-11-architecture.wav"),
		"module-11-application": staticFile("audio/agentic-ai-for-beginners/module11-module-11-application.wav"),
		"module-11-exam-mapping": staticFile("audio/agentic-ai-for-beginners/module11-module-11-exam-mapping.wav"),
		"module-11-recap": staticFile("audio/agentic-ai-for-beginners/module11-module-11-recap.wav"),
		whoosh: staticFile("audio/whoosh.wav"),
	};

	const audioDurations = {
		"module-11-title": getAudioDuration("agentic-ai-for-beginners/module11-module-11-title"),
		"module-11-concept": getAudioDuration("agentic-ai-for-beginners/module11-module-11-concept"),
		"module-11-architecture": getAudioDuration("agentic-ai-for-beginners/module11-module-11-architecture"),
		"module-11-application": getAudioDuration("agentic-ai-for-beginners/module11-module-11-application"),
		"module-11-exam-mapping": getAudioDuration("agentic-ai-for-beginners/module11-module-11-exam-mapping"),
		"module-11-recap": getAudioDuration("agentic-ai-for-beginners/module11-module-11-recap"),
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

	const seg0 = addSegment(26.95, true, false, 1);
	const seg1 = addSegment(10.00, false, false, 1);
	const seg2 = addSegment(10.00, false, false, 1);
	const seg3 = addSegment(10.00, false, false, 1);
	const seg4 = addSegment(10.00, false, false, 1);
	const seg5 = addSegment(10.00, false, false, 1);
	const seg6 = addSegment(10.00, false, false, 1);
	const seg7 = addSegment(10.00, false, false, 1);
	const seg8 = addSegment(1.53, true, false, 1);
	const seg9 = addSegment(10.00, false, false, 1);
	const seg10 = addSegment(10.00, false, false, 1);
	const seg11 = addSegment(10.00, false, false, 1);
	const seg12 = addSegment(10.00, false, false, 1);
	const seg13 = addSegment(10.00, false, false, 1);
	const seg14 = addSegment(10.00, false, false, 1);
	const seg15 = addSegment(10.00, false, false, 1);
	const seg16 = addSegment(10.00, false, false, 1);
	const seg17 = addSegment(2.74, true, false, 1);
	const seg18 = addSegment(10.00, false, false, 1);
	const seg19 = addSegment(10.00, false, false, 1);
	const seg20 = addSegment(10.00, false, false, 1);
	const seg21 = addSegment(10.00, false, false, 1);
	const seg22 = addSegment(10.00, false, false, 1);
	const seg23 = addSegment(10.00, false, false, 1);
	const seg24 = addSegment(10.00, false, false, 1);
	const seg25 = addSegment(10.00, false, false, 1);
	const seg26 = addSegment(10.00, false, false, 1);
	const seg27 = addSegment(9.42, true, false, 1);
	const seg28 = addSegment(27.00, true, false, 1);
	const seg29 = addSegment(29.78, true, true, 1.2);

	return (
		<div
			style={{
				width: "100%",
			height: "100%",
			background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
			position: "relative",
		}}
		>
			{/* Evaluation and Monitoring */}
			<Sequence
				from={seg0.start}
				durationInFrames={seg0.duration}
			>
				<Audio src={audioFiles["module-11-title"]} />
				<CrossFadeWrapper
					totalDuration={seg0.slideDuration}
					fadeInDuration={0.5}
					fadeOutDuration={crossFadeDuration}
			>
					<TitleSlide 
					title="Evaluation and Monitoring" 
					subtitle="Evaluation and Monitoring"
					
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
				<Audio src={audioFiles["module-11-concept"]} />
				<CrossFadeWrapper
					totalDuration={seg1.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"Let's define what we mean by evaluation An evaluation harness is a system that runs your agent against"
					]}
					slideName="module-11-concept"
					audioDuration={seg1.audioDuration}
					moduleNumber={11}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg2.start}
				durationInFrames={seg2.duration}
			>
				<Audio src={audioFiles["module-11-concept"]} startFrom={Math.round(10.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg2.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"Structure does the output match the expected format valid JSON required fields",
					"Grounding the"
					]}
					slideName="module-11-concept"
					audioDuration={seg2.audioDuration}
					moduleNumber={11}
					
					
					audioStartOffset={10.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg3.start}
				durationInFrames={seg3.duration}
			>
				<Audio src={audioFiles["module-11-concept"]} startFrom={Math.round(20.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg3.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"hallucinate",
					"Regression did a change make things"
					]}
					slideName="module-11-concept"
					audioDuration={seg3.audioDuration}
					moduleNumber={11}
					
					
					audioStartOffset={20.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg4.start}
				durationInFrames={seg4.duration}
			>
				<Audio src={audioFiles["module-11-concept"]} startFrom={Math.round(30.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg4.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"Run the same test set before and after If scores drop you've introduced a regression Automated evaluators"
					]}
					slideName="module-11-concept"
					audioDuration={seg4.audioDuration}
					moduleNumber={11}
					
					
					audioStartOffset={30.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg5.start}
				durationInFrames={seg5.duration}
			>
				<Audio src={audioFiles["module-11-concept"]} startFrom={Math.round(40.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg5.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"For correctness you might use a model as judge a separate model scores the output",
					"For structure use a parser"
					]}
					slideName="module-11-concept"
					audioDuration={seg5.audioDuration}
					moduleNumber={11}
					
					
					audioStartOffset={40.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg6.start}
				durationInFrames={seg6.duration}
			>
				<Audio src={audioFiles["module-11-concept"]} startFrom={Math.round(50.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg6.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"JSON or schema validation For grounding check that citations reference actual retrieved chunks or tool outputs For ha..."
					]}
					slideName="module-11-concept"
					audioDuration={seg6.audioDuration}
					moduleNumber={11}
					
					
					audioStartOffset={50.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg7.start}
				durationInFrames={seg7.duration}
			>
				<Audio src={audioFiles["module-11-concept"]} startFrom={Math.round(60.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg7.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"These checks can run in CI",
					"every pull request triggers the harness",
					"Fail the build if regression"
					]}
					slideName="module-11-concept"
					audioDuration={seg7.audioDuration}
					moduleNumber={11}
					
					
					audioStartOffset={60.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg8.start}
				durationInFrames={seg8.duration}
			>
				<Audio src={audioFiles["module-11-concept"]} startFrom={Math.round(70.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg8.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"regression is detected"
					]}
					slideName="module-11-concept"
					audioDuration={seg8.audioDuration}
					moduleNumber={11}
					
					
					audioStartOffset={70.00}
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
				<Audio src={audioFiles["module-11-architecture"]} />
				<CrossFadeWrapper
					totalDuration={seg9.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"What does production monitoring look like Latency tracking Log every request's",
					"Track p50 p95 p99 deterministic reports",
					"End To End"
					]}
					slideName="module-11-architecture"
					audioDuration={seg9.audioDuration}
					moduleNumber={11}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg10.start}
				durationInFrames={seg10.duration}
			>
				<Audio src={audioFiles["module-11-architecture"]} startFrom={Math.round(10.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg10.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Agent workloads have variable latency more steps mean more time But sudden spikes indicate problems model slowdown"
					]}
					slideName="module-11-architecture"
					audioDuration={seg10.audioDuration}
					moduleNumber={11}
					
					
					audioStartOffset={10.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg11.start}
				durationInFrames={seg11.duration}
			>
				<Audio src={audioFiles["module-11-architecture"]} startFrom={Math.round(20.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg11.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Alert when p95 exceeds a threshold Cost awareness Log token usage per request"
					]}
					slideName="module-11-architecture"
					audioDuration={seg11.audioDuration}
					moduleNumber={11}
					
					
					audioStartOffset={20.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg12.start}
				durationInFrames={seg12.duration}
			>
				<Audio src={audioFiles["module-11-architecture"]} startFrom={Math.round(30.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg12.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Track cost per request and cost per user Set budgets"
					]}
					slideName="module-11-architecture"
					audioDuration={seg12.audioDuration}
					moduleNumber={11}
					
					
					audioStartOffset={30.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg13.start}
				durationInFrames={seg13.duration}
			>
				<Audio src={audioFiles["module-11-architecture"]} startFrom={Math.round(40.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg13.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"spikes often correlate with loops or runaway retries",
					"Output stability For workflows log whether the output"
					]}
					slideName="module-11-architecture"
					audioDuration={seg13.audioDuration}
					moduleNumber={11}
					
					
					audioStartOffset={40.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg14.start}
				durationInFrames={seg14.duration}
			>
				<Audio src={audioFiles["module-11-architecture"]} startFrom={Math.round(50.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg14.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"If the same input suddenly produces different output something shifted model update retrieval change or confi..."
					]}
					slideName="module-11-architecture"
					audioDuration={seg14.audioDuration}
					moduleNumber={11}
					
					
					audioStartOffset={50.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg15.start}
				durationInFrames={seg15.duration}
			>
				<Audio src={audioFiles["module-11-architecture"]} startFrom={Math.round(60.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg15.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Telemetry and tracing Instrument the agent loop Log each step plan tool call observation next action Use"
					]}
					slideName="module-11-architecture"
					audioDuration={seg15.audioDuration}
					moduleNumber={11}
					
					
					audioStartOffset={60.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg16.start}
				durationInFrames={seg16.duration}
			>
				<Audio src={audioFiles["module-11-architecture"]} startFrom={Math.round(70.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg16.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"IDs to follow a request through the pipeline When a user",
					"Tracing is essential"
					]}
					slideName="module-11-architecture"
					audioDuration={seg16.audioDuration}
					moduleNumber={11}
					
					
					audioStartOffset={70.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg17.start}
				durationInFrames={seg17.duration}
			>
				<Audio src={audioFiles["module-11-architecture"]} startFrom={Math.round(80.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg17.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"for debugging agent behavior"
					]}
					slideName="module-11-architecture"
					audioDuration={seg17.audioDuration}
					moduleNumber={11}
					
					
					audioStartOffset={80.00}
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg17.start + seg17.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg18.start}
				durationInFrames={seg18.duration}
			>
				<Audio src={audioFiles["module-11-application"]} />
				<CrossFadeWrapper
					totalDuration={seg18.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"How do you implement these patterns",
					"Evaluation harness Build a test set of inputs and expected behaviors",
					"For each test case run request count Automated checks can catch obvious cases Human review catches subtle ones"
					]}
					slideName="module-11-application"
					audioDuration={seg18.audioDuration}
					moduleNumber={11}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg19.start}
				durationInFrames={seg19.duration}
			>
				<Audio src={audioFiles["module-11-application"]} startFrom={Math.round(10.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg19.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"Automate correctness via model",
					"as judge or rule based check",
					"Model As Judge"
					]}
					slideName="module-11-application"
					audioDuration={seg19.audioDuration}
					moduleNumber={11}
					
					
					audioStartOffset={10.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg20.start}
				durationInFrames={seg20.duration}
			>
				<Audio src={audioFiles["module-11-application"]} startFrom={Math.round(20.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg20.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"Run on every deploy Block releases that regress M..."
					]}
					slideName="module-11-application"
					audioDuration={seg20.audioDuration}
					moduleNumber={11}
					
					
					audioStartOffset={20.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg21.start}
				durationInFrames={seg21.duration}
			>
				<Audio src={audioFiles["module-11-application"]} startFrom={Math.round(30.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg21.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"Use a logging and metrics platform Datadog Prometheus or cloud native options Emit metrics latency"
					]}
					slideName="module-11-application"
					audioDuration={seg21.audioDuration}
					moduleNumber={11}
					
					
					audioStartOffset={30.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg22.start}
				durationInFrames={seg22.duration}
			>
				<Audio src={audioFiles["module-11-application"]} startFrom={Math.round(40.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg22.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"Create dashboards Set alerts latency spike error rate increase cost threshold For agents"
					]}
					slideName="module-11-application"
					audioDuration={seg22.audioDuration}
					moduleNumber={11}
					
					
					audioStartOffset={40.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg23.start}
				durationInFrames={seg23.duration}
			>
				<Audio src={audioFiles["module-11-application"]} startFrom={Math.round(50.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg23.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"Failure diagnosis",
					"When alerts fire"
					]}
					slideName="module-11-application"
					audioDuration={seg23.audioDuration}
					moduleNumber={11}
					
					
					audioStartOffset={50.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg24.start}
				durationInFrames={seg24.duration}
			>
				<Audio src={audioFiles["module-11-application"]} startFrom={Math.round(60.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg24.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"Find the request Follow the trace",
					"Did the planner produce a bad plan",
					"Did a tool timeout Did retrieval"
					]}
					slideName="module-11-application"
					audioDuration={seg24.audioDuration}
					moduleNumber={11}
					
					
					audioStartOffset={60.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg25.start}
				durationInFrames={seg25.duration}
			>
				<Audio src={audioFiles["module-11-application"]} startFrom={Math.round(70.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg25.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"Did the model hallucinate",
					"Traces tell you where it broke",
					"Add more logging"
					]}
					slideName="module-11-application"
					audioDuration={seg25.audioDuration}
					moduleNumber={11}
					
					
					audioStartOffset={70.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg26.start}
				durationInFrames={seg26.duration}
			>
				<Audio src={audioFiles["module-11-application"]} startFrom={Math.round(80.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg26.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"Detecting hallucinations",
					"Compare model output to context If the model states a fact not in the retrieved chunks or tool"
					]}
					slideName="module-11-application"
					audioDuration={seg26.audioDuration}
					moduleNumber={11}
					
					
					audioStartOffset={80.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg27.start}
				durationInFrames={seg27.duration}
			>
				<Audio src={audioFiles["module-11-application"]} startFrom={Math.round(90.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg27.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"results flag it"
					]}
					slideName="module-11-application"
					audioDuration={seg27.audioDuration}
					moduleNumber={11}
					
					
					audioStartOffset={90.00}
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

			{/* Exam Mapping */}
			<Sequence
				from={seg28.start}
				durationInFrames={seg28.duration}
			>
				<Audio src={audioFiles["module-11-exam-mapping"]} />
				<CrossFadeWrapper
					totalDuration={seg28.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"The certification will test how to detect hallucinations",
					"Key terms evaluation harness correctness structure grounding regressio...",
					"and how monitoring detects production issues"
					]}
					slideName="module-11-exam-mapping"
					audioDuration={seg28.audioDuration}
					moduleNumber={11}
					
					
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
				<Audio src={audioFiles["module-11-recap"]} />
				<CrossFadeWrapper
					totalDuration={seg29.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={0}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"Evaluation harnesses measure correctness structure grounding and regression",
					"Automate checks and run them in CI",
					"Block releases that regress Monitoring tracks latency cost and output stability Telemetry and tracing let you follow ...",
					"When something breaks traces show where Design for observability from the start It's not optional for produc..."
					]}
					slideName="module-11-recap"
					audioDuration={seg29.audioDuration}
					moduleNumber={11}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

		</div>
	);
};
