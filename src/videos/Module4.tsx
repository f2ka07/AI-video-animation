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
		"hook-learning-planning": staticFile("audio/agentic-ai-labs-deep-dive/module4-hook-learning-planning.wav"),
		"lab-7-1-overview": staticFile("audio/agentic-ai-labs-deep-dive/module4-lab-7-1-overview.wav"),
		"lab-7-1-code": staticFile("audio/agentic-ai-labs-deep-dive/module4-lab-7-1-code.wav"),
		"code-flow-lab-7-1": staticFile("audio/agentic-ai-labs-deep-dive/module4-code-flow-lab-7-1.wav"),
		"lab-7-1-in-practice-overview": staticFile("audio/agentic-ai-labs-deep-dive/module4-lab-7-1-in-practice-overview.wav"),
		"lab-7-1-actual-code": staticFile("audio/agentic-ai-labs-deep-dive/module4-lab-7-1-actual-code.wav"),
		"lab-7-1-actual-flow": staticFile("audio/agentic-ai-labs-deep-dive/module4-lab-7-1-actual-flow.wav"),
		"lab-8-1-overview": staticFile("audio/agentic-ai-labs-deep-dive/module4-lab-8-1-overview.wav"),
		"lab-8-1-code": staticFile("audio/agentic-ai-labs-deep-dive/module4-lab-8-1-code.wav"),
		"code-flow-lab-8-1": staticFile("audio/agentic-ai-labs-deep-dive/module4-code-flow-lab-8-1.wav"),
		"lab-8-1-in-practice-overview": staticFile("audio/agentic-ai-labs-deep-dive/module4-lab-8-1-in-practice-overview.wav"),
		"lab-8-1-actual-code": staticFile("audio/agentic-ai-labs-deep-dive/module4-lab-8-1-actual-code.wav"),
		"lab-8-1-actual-flow": staticFile("audio/agentic-ai-labs-deep-dive/module4-lab-8-1-actual-flow.wav"),
		"lab-9-1-overview": staticFile("audio/agentic-ai-labs-deep-dive/module4-lab-9-1-overview.wav"),
		"lab-9-1-code": staticFile("audio/agentic-ai-labs-deep-dive/module4-lab-9-1-code.wav"),
		"code-flow-lab-9-1": staticFile("audio/agentic-ai-labs-deep-dive/module4-code-flow-lab-9-1.wav"),
		"lab-9-1-in-practice-overview": staticFile("audio/agentic-ai-labs-deep-dive/module4-lab-9-1-in-practice-overview.wav"),
		"lab-9-1-actual-code": staticFile("audio/agentic-ai-labs-deep-dive/module4-lab-9-1-actual-code.wav"),
		"lab-9-1-actual-flow": staticFile("audio/agentic-ai-labs-deep-dive/module4-lab-9-1-actual-flow.wav"),
		"why-learn-plan-goal": staticFile("audio/agentic-ai-labs-deep-dive/module4-why-learn-plan-goal.wav"),
		"conclusion-learning-planning": staticFile("audio/agentic-ai-labs-deep-dive/module4-conclusion-learning-planning.wav"),
		whoosh: staticFile("audio/whoosh.wav"),
	};

	const audioDurations = {
		"hook-learning-planning": getAudioDuration("agentic-ai-labs-deep-dive/module4-hook-learning-planning"),
		"lab-7-1-overview": getAudioDuration("agentic-ai-labs-deep-dive/module4-lab-7-1-overview"),
		"lab-7-1-code": getAudioDuration("agentic-ai-labs-deep-dive/module4-lab-7-1-code"),
		"code-flow-lab-7-1": getAudioDuration("agentic-ai-labs-deep-dive/module4-code-flow-lab-7-1"),
		"lab-7-1-in-practice-overview": getAudioDuration("agentic-ai-labs-deep-dive/module4-lab-7-1-in-practice-overview"),
		"lab-7-1-actual-code": getAudioDuration("agentic-ai-labs-deep-dive/module4-lab-7-1-actual-code"),
		"lab-7-1-actual-flow": getAudioDuration("agentic-ai-labs-deep-dive/module4-lab-7-1-actual-flow"),
		"lab-8-1-overview": getAudioDuration("agentic-ai-labs-deep-dive/module4-lab-8-1-overview"),
		"lab-8-1-code": getAudioDuration("agentic-ai-labs-deep-dive/module4-lab-8-1-code"),
		"code-flow-lab-8-1": getAudioDuration("agentic-ai-labs-deep-dive/module4-code-flow-lab-8-1"),
		"lab-8-1-in-practice-overview": getAudioDuration("agentic-ai-labs-deep-dive/module4-lab-8-1-in-practice-overview"),
		"lab-8-1-actual-code": getAudioDuration("agentic-ai-labs-deep-dive/module4-lab-8-1-actual-code"),
		"lab-8-1-actual-flow": getAudioDuration("agentic-ai-labs-deep-dive/module4-lab-8-1-actual-flow"),
		"lab-9-1-overview": getAudioDuration("agentic-ai-labs-deep-dive/module4-lab-9-1-overview"),
		"lab-9-1-code": getAudioDuration("agentic-ai-labs-deep-dive/module4-lab-9-1-code"),
		"code-flow-lab-9-1": getAudioDuration("agentic-ai-labs-deep-dive/module4-code-flow-lab-9-1"),
		"lab-9-1-in-practice-overview": getAudioDuration("agentic-ai-labs-deep-dive/module4-lab-9-1-in-practice-overview"),
		"lab-9-1-actual-code": getAudioDuration("agentic-ai-labs-deep-dive/module4-lab-9-1-actual-code"),
		"lab-9-1-actual-flow": getAudioDuration("agentic-ai-labs-deep-dive/module4-lab-9-1-actual-flow"),
		"why-learn-plan-goal": getAudioDuration("agentic-ai-labs-deep-dive/module4-why-learn-plan-goal"),
		"conclusion-learning-planning": getAudioDuration("agentic-ai-labs-deep-dive/module4-conclusion-learning-planning"),
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

	const hook_learning_planningSlide = addSlide(audioDurations["hook-learning-planning"], false, 0.3);
	const lab_7_1_overviewSlide = addSlide(audioDurations["lab-7-1-overview"], false, 0.3);
	const lab_7_1_codeSlide = addSlide(audioDurations["lab-7-1-code"], false, 0.3);
	const code_flow_lab_7_1Slide = addSlide(audioDurations["code-flow-lab-7-1"], false, 0.3);
	const lab_7_1_in_practice_overviewSlide = addSlide(audioDurations["lab-7-1-in-practice-overview"], false, 0.3);
	const lab_7_1_actual_codeSlide = addSlide(audioDurations["lab-7-1-actual-code"], false, 0.3);
	const lab_7_1_actual_flowSlide = addSlide(audioDurations["lab-7-1-actual-flow"], false, 0.3);
	const lab_8_1_overviewSlide = addSlide(audioDurations["lab-8-1-overview"], false, 0.3);
	const lab_8_1_codeSlide = addSlide(audioDurations["lab-8-1-code"], false, 0.3);
	const code_flow_lab_8_1Slide = addSlide(audioDurations["code-flow-lab-8-1"], false, 0.3);
	const lab_8_1_in_practice_overviewSlide = addSlide(audioDurations["lab-8-1-in-practice-overview"], false, 0.3);
	const lab_8_1_actual_codeSlide = addSlide(audioDurations["lab-8-1-actual-code"], false, 0.3);
	const lab_8_1_actual_flowSlide = addSlide(audioDurations["lab-8-1-actual-flow"], false, 0.3);
	const lab_9_1_overviewSlide = addSlide(audioDurations["lab-9-1-overview"], false, 0.3);
	const lab_9_1_codeSlide = addSlide(audioDurations["lab-9-1-code"], false, 0.3);
	const code_flow_lab_9_1Slide = addSlide(audioDurations["code-flow-lab-9-1"], false, 0.3);
	const lab_9_1_in_practice_overviewSlide = addSlide(audioDurations["lab-9-1-in-practice-overview"], false, 0.3);
	const lab_9_1_actual_codeSlide = addSlide(audioDurations["lab-9-1-actual-code"], false, 0.3);
	const lab_9_1_actual_flowSlide = addSlide(audioDurations["lab-9-1-actual-flow"], false, 0.3);
	const why_learn_plan_goalSlide = addSlide(audioDurations["why-learn-plan-goal"], false, 0.3);
	const conclusion_learning_planningSlide = addSlide(audioDurations["conclusion-learning-planning"], true, 0.8);

	return (
		<div
			style={{
				width: "100%",
			height: "100%",
			background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
			position: "relative",
		}}
		>
			{/* Teach Your Agent to Learn and Plan */}
			<Sequence
				from={hook_learning_planningSlide.start}
				durationInFrames={hook_learning_planningSlide.duration}
			>
				<Audio src={audioFiles["hook-learning-planning"]} />
				<CrossFadeWrapper
					totalDuration={hook_learning_planningSlide.slideDuration}
					fadeInDuration={0.5}
					fadeOutDuration={crossFadeDuration}
			>
					<TitleSlide 
					title="Agentic AI Labs 7.1 to 9.1: Learning and Planning" 
					subtitle="Implementing learning loops, planning strategies, and goal-directed behavior"
					
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={hook_learning_planningSlide.start + hook_learning_planningSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 7.1: Learning Loops */}
			<Sequence
				from={lab_7_1_overviewSlide.start}
				durationInFrames={lab_7_1_overviewSlide.duration}
			>
				<Audio src={audioFiles["lab-7-1-overview"]} />
				<CrossFadeWrapper
					totalDuration={lab_7_1_overviewSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Lab 7.1: Learning Loops"
					points={[
						"Update policies dynamically",
					"Use environment feedback",
					"Automate trial and error"
					]}
					slideName="lab-7-1-overview"
					audioDuration={lab_7_1_overviewSlide.audioDuration}
					moduleNumber={4}
					
					
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_7_1_overviewSlide.start + lab_7_1_overviewSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Learning Update Code */}
			<Sequence
				from={lab_7_1_codeSlide.start}
				durationInFrames={lab_7_1_codeSlide.duration}
			>
				<Audio src={audioFiles["lab-7-1-code"]} />
				<CrossFadeWrapper
					totalDuration={lab_7_1_codeSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedCodeSlide
					title="Learning Update Code"
					code={`value_estimate += learning_rate * (reward - value_estimate)`}
					language="python"
					slideName="lab-7-1-code"
					audioStartFrame={lab_7_1_codeSlide.start}
					audioDuration={lab_7_1_codeSlide.audioDuration}
					moduleNumber={4}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_7_1_codeSlide.start + lab_7_1_codeSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 7.1 Code Flow */}
			<Sequence
				from={code_flow_lab_7_1Slide.start}
				durationInFrames={code_flow_lab_7_1Slide.duration}
			>
				<Audio src={audioFiles["code-flow-lab-7-1"]} />
				<CrossFadeWrapper
					totalDuration={code_flow_lab_7_1Slide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<BulletsAndCodeSlide
					title="Lab 7.1 Code Flow"
					points={[
						"Compute prediction error: reward minus estimate",
						"Scale by learning rate",
						"Update estimate incrementally"
					]}
					code={`value_estimate += learning_rate * (reward - value_estimate)`}
					language="python"
					codeContext="Lab 7.1: temporal difference update - learning component"
					slideName="code-flow-lab-7-1"
					audioDuration={code_flow_lab_7_1Slide.audioDuration}
					moduleNumber={4}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={code_flow_lab_7_1Slide.start + code_flow_lab_7_1Slide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 7.1 in Practice */}
			<Sequence
				from={lab_7_1_in_practice_overviewSlide.start}
				durationInFrames={lab_7_1_in_practice_overviewSlide.duration}
			>
				<Audio src={audioFiles["lab-7-1-in-practice-overview"]} />
				<CrossFadeWrapper
					totalDuration={lab_7_1_in_practice_overviewSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Lab 7.1 in Practice"
					points={[
						"NeMo Guardrails: guarded_generate filters unsafe content",
					"NIM client: model-serving microservice",
					"Safety and compliance before inference"
					]}
					slideName="lab-7-1-in-practice-overview"
					audioDuration={lab_7_1_in_practice_overviewSlide.audioDuration}
					moduleNumber={4}
					
					
			/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_7_1_in_practice_overviewSlide.start + lab_7_1_in_practice_overviewSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 7.1 Actual Code */}
			<Sequence
				from={lab_7_1_actual_codeSlide.start}
				durationInFrames={lab_7_1_actual_codeSlide.duration}
			>
				<Audio src={audioFiles["lab-7-1-actual-code"]} />
				<CrossFadeWrapper
					totalDuration={lab_7_1_actual_codeSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedCodeSlide
					title="Lab 7.1 Actual Code"
					code={`response = await guarded_generate(query)
# Blocks: "How do I hack into a system?"
# Passes: "What is Python?"
# NIM: nim_client for model inference`}
					language="python"
					slideName="lab-7-1-actual-code"
					audioStartFrame={lab_7_1_actual_codeSlide.start}
					audioDuration={lab_7_1_actual_codeSlide.audioDuration}
					moduleNumber={4}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_7_1_actual_codeSlide.start + lab_7_1_actual_codeSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 7.1 Actual Flow */}
			<Sequence
				from={lab_7_1_actual_flowSlide.start}
				durationInFrames={lab_7_1_actual_flowSlide.duration}
			>
				<Audio src={audioFiles["lab-7-1-actual-flow"]} />
				<CrossFadeWrapper
					totalDuration={lab_7_1_actual_flowSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<BulletsAndCodeSlide
					title="Lab 7.1 Actual Flow"
					points={[
						"guarded_generate filters before LLM",
						"Block or rewrite unsafe queries",
						"NIM for model serving"
					]}
					code={`response = await guarded_generate(query)`}
					language="python"
					codeContext="Lab 7.1: NeMo Guardrails, NIM client"
					slideName="lab-7-1-actual-flow"
					audioDuration={lab_7_1_actual_flowSlide.audioDuration}
					moduleNumber={4}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_7_1_actual_flowSlide.start + lab_7_1_actual_flowSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 8.1: Planning Strategies */}
			<Sequence
				from={lab_8_1_overviewSlide.start}
				durationInFrames={lab_8_1_overviewSlide.duration}
			>
				<Audio src={audioFiles["lab-8-1-overview"]} />
				<CrossFadeWrapper
					totalDuration={lab_8_1_overviewSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Lab 8.1: Planning Strategies"
					points={[
						"Simulate future steps",
					"Evaluate action sequences",
					"Anticipate outcomes"
					]}
					slideName="lab-8-1-overview"
					audioDuration={lab_8_1_overviewSlide.audioDuration}
					moduleNumber={4}
					
					
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_8_1_overviewSlide.start + lab_8_1_overviewSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Planning Loop Code */}
			<Sequence
				from={lab_8_1_codeSlide.start}
				durationInFrames={lab_8_1_codeSlide.duration}
			>
				<Audio src={audioFiles["lab-8-1-code"]} />
				<CrossFadeWrapper
					totalDuration={lab_8_1_codeSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedCodeSlide
					title="Planning Loop Code"
					code={`best_score = -float('inf')
best_action = None
for action in possible_actions:
    score = simulate(action)
    if score > best_score:
        best_score = score
        best_action = action`}
					language="python"
					slideName="lab-8-1-code"
					audioStartFrame={lab_8_1_codeSlide.start}
					audioDuration={lab_8_1_codeSlide.audioDuration}
					moduleNumber={4}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_8_1_codeSlide.start + lab_8_1_codeSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 8.1 Code Flow */}
			<Sequence
				from={code_flow_lab_8_1Slide.start}
				durationInFrames={code_flow_lab_8_1Slide.duration}
			>
				<Audio src={audioFiles["code-flow-lab-8-1"]} />
				<CrossFadeWrapper
					totalDuration={code_flow_lab_8_1Slide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<BulletsAndCodeSlide
					title="Lab 8.1 Code Flow"
					points={[
						"Initialize best to negative infinity",
						"Loop: simulate each action",
						"Keep action with highest score"
					]}
					code={`best_score = -float('inf')
best_action = None
for action in possible_actions:
    score = simulate(action)
    if score > best_score:
        best_score = score
        best_action = action`}
					language="python"
					codeContext="Lab 8.1: planning loop - action evaluation"
					slideName="code-flow-lab-8-1"
					audioDuration={code_flow_lab_8_1Slide.audioDuration}
					moduleNumber={4}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={code_flow_lab_8_1Slide.start + code_flow_lab_8_1Slide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 8.1 in Practice */}
			<Sequence
				from={lab_8_1_in_practice_overviewSlide.start}
				durationInFrames={lab_8_1_in_practice_overviewSlide.duration}
			>
				<Audio src={audioFiles["lab-8-1-in-practice-overview"]} />
				<CrossFadeWrapper
					totalDuration={lab_8_1_in_practice_overviewSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Lab 8.1 in Practice"
					points={[
						"track_request: wrap agent calls for timing",
					"log_agent_action: record success/failure metrics",
					"get_metrics_collector: stats for analysis"
					]}
					slideName="lab-8-1-in-practice-overview"
					audioDuration={lab_8_1_in_practice_overviewSlide.audioDuration}
					moduleNumber={4}
					
					
			/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_8_1_in_practice_overviewSlide.start + lab_8_1_in_practice_overviewSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 8.1 Actual Code */}
			<Sequence
				from={lab_8_1_actual_codeSlide.start}
				durationInFrames={lab_8_1_actual_codeSlide.duration}
			>
				<Audio src={audioFiles["lab-8-1-actual-code"]} />
				<CrossFadeWrapper
					totalDuration={lab_8_1_actual_codeSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedCodeSlide
					title="Lab 8.1 Actual Code"
					code={`with track_request(role="agent"):
    response = await agent.act(messages)
    log_agent_action("demo_agent", "request_completed", {"duration": duration})
metrics = get_metrics_collector()
stats = metrics.get_stats()  # total_requests, avg_latency`}
					language="python"
					slideName="lab-8-1-actual-code"
					audioStartFrame={lab_8_1_actual_codeSlide.start}
					audioDuration={lab_8_1_actual_codeSlide.audioDuration}
					moduleNumber={4}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_8_1_actual_codeSlide.start + lab_8_1_actual_codeSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 8.1 Actual Flow */}
			<Sequence
				from={lab_8_1_actual_flowSlide.start}
				durationInFrames={lab_8_1_actual_flowSlide.duration}
			>
				<Audio src={audioFiles["lab-8-1-actual-flow"]} />
				<CrossFadeWrapper
					totalDuration={lab_8_1_actual_flowSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<BulletsAndCodeSlide
					title="Lab 8.1 Actual Flow"
					points={[
						"track_request wraps each request",
						"log_agent_action on success or failure",
						"get_metrics_collector for stats"
					]}
					code={`with track_request(role="agent"):
    response = await agent.act(messages)
log_agent_action("demo_agent", "request_completed", {...})`}
					language="python"
					codeContext="Lab 8.1: track_request, log_agent_action, get_metrics_collector"
					slideName="lab-8-1-actual-flow"
					audioDuration={lab_8_1_actual_flowSlide.audioDuration}
					moduleNumber={4}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_8_1_actual_flowSlide.start + lab_8_1_actual_flowSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 9.1: Goal-Directed Agents */}
			<Sequence
				from={lab_9_1_overviewSlide.start}
				durationInFrames={lab_9_1_overviewSlide.duration}
			>
				<Audio src={audioFiles["lab-9-1-overview"]} />
				<CrossFadeWrapper
					totalDuration={lab_9_1_overviewSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Lab 9.1: Goal-Directed Agents"
					points={[
						"Set clear goals",
					"Use learning and planning",
					"Pursue purposeful action"
					]}
					slideName="lab-9-1-overview"
					audioDuration={lab_9_1_overviewSlide.audioDuration}
					moduleNumber={4}
					
					
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_9_1_overviewSlide.start + lab_9_1_overviewSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Goal Pursuit Code */}
			<Sequence
				from={lab_9_1_codeSlide.start}
				durationInFrames={lab_9_1_codeSlide.duration}
			>
				<Audio src={audioFiles["lab-9-1-code"]} />
				<CrossFadeWrapper
					totalDuration={lab_9_1_codeSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedCodeSlide
					title="Goal Pursuit Code"
					code={`if distance_to_goal > threshold:
    action = planner.plan_towards(goal)
else:
    action = 'idle'`}
					language="python"
					slideName="lab-9-1-code"
					audioStartFrame={lab_9_1_codeSlide.start}
					audioDuration={lab_9_1_codeSlide.audioDuration}
					moduleNumber={4}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_9_1_codeSlide.start + lab_9_1_codeSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 9.1 Code Flow */}
			<Sequence
				from={code_flow_lab_9_1Slide.start}
				durationInFrames={code_flow_lab_9_1Slide.duration}
			>
				<Audio src={audioFiles["code-flow-lab-9-1"]} />
				<CrossFadeWrapper
					totalDuration={code_flow_lab_9_1Slide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<BulletsAndCodeSlide
					title="Lab 9.1 Code Flow"
					points={[
						"Check distance to goal",
						"If far: plan toward goal",
						"If close: idle until next goal"
					]}
					code={`if distance_to_goal > threshold:
    action = planner.plan_towards(goal)
else:
    action = 'idle'`}
					language="python"
					codeContext="Lab 9.1: goal pursuit - when to act vs idle"
					slideName="code-flow-lab-9-1"
					audioDuration={code_flow_lab_9_1Slide.audioDuration}
					moduleNumber={4}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={code_flow_lab_9_1Slide.start + code_flow_lab_9_1Slide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 9.1 in Practice */}
			<Sequence
				from={lab_9_1_in_practice_overviewSlide.start}
				durationInFrames={lab_9_1_in_practice_overviewSlide.duration}
			>
				<Audio src={audioFiles["lab-9-1-in-practice-overview"]} />
				<CrossFadeWrapper
					totalDuration={lab_9_1_in_practice_overviewSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Lab 9.1 in Practice"
					points={[
						"PolicyEnforcer with add_checker",
					"PIIPolicyChecker: block emails, phones in messages",
					"ActionPolicyChecker: block dangerous tool calls"
					]}
					slideName="lab-9-1-in-practice-overview"
					audioDuration={lab_9_1_in_practice_overviewSlide.audioDuration}
					moduleNumber={4}
					
					
			/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_9_1_in_practice_overviewSlide.start + lab_9_1_in_practice_overviewSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 9.1 Actual Code */}
			<Sequence
				from={lab_9_1_actual_codeSlide.start}
				durationInFrames={lab_9_1_actual_codeSlide.duration}
			>
				<Audio src={audioFiles["lab-9-1-actual-code"]} />
				<CrossFadeWrapper
					totalDuration={lab_9_1_actual_codeSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedCodeSlide
					title="Lab 9.1 Actual Code"
					code={`enforcer = PolicyEnforcer()
enforcer.add_checker(PIIPolicyChecker())
enforcer.add_checker(ActionPolicyChecker(blocked_actions=["delete_file", "format_disk"]))
enforcer.enforce_message(message)
enforcer.enforce_tool_call(tool_call)`}
					language="python"
					slideName="lab-9-1-actual-code"
					audioStartFrame={lab_9_1_actual_codeSlide.start}
					audioDuration={lab_9_1_actual_codeSlide.audioDuration}
					moduleNumber={4}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_9_1_actual_codeSlide.start + lab_9_1_actual_codeSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 9.1 Actual Flow */}
			<Sequence
				from={lab_9_1_actual_flowSlide.start}
				durationInFrames={lab_9_1_actual_flowSlide.duration}
			>
				<Audio src={audioFiles["lab-9-1-actual-flow"]} />
				<CrossFadeWrapper
					totalDuration={lab_9_1_actual_flowSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<BulletsAndCodeSlide
					title="Lab 9.1 Actual Flow"
					points={[
						"add_checker for each policy type",
						"enforce_message before agent sees input",
						"enforce_tool_call before tool execution"
					]}
					code={`enforcer.add_checker(PIIPolicyChecker())
enforcer.enforce_message(msg)
enforcer.enforce_tool_call(tool_call)`}
					language="python"
					codeContext="Lab 9.1: PolicyEnforcer, PIIPolicyChecker, ActionPolicyChecker"
					slideName="lab-9-1-actual-flow"
					audioDuration={lab_9_1_actual_flowSlide.audioDuration}
					moduleNumber={4}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_9_1_actual_flowSlide.start + lab_9_1_actual_flowSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Why it Changes the Game */}
			<Sequence
				from={why_learn_plan_goalSlide.start}
				durationInFrames={why_learn_plan_goalSlide.duration}
			>
				<Audio src={audioFiles["why-learn-plan-goal"]} />
				<CrossFadeWrapper
					totalDuration={why_learn_plan_goalSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Why it Changes the Game"
					points={[
						"Agents improve over time",
					"Plan ahead effectively",
					"Act with clear purpose"
					]}
					slideName="why-learn-plan-goal"
					audioDuration={why_learn_plan_goalSlide.audioDuration}
					moduleNumber={4}
					
					
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={why_learn_plan_goalSlide.start + why_learn_plan_goalSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* The Power of Learning and Planning */}
			<Sequence
				from={conclusion_learning_planningSlide.start}
				durationInFrames={conclusion_learning_planningSlide.duration}
			>
				<Audio src={audioFiles["conclusion-learning-planning"]} />
				<CrossFadeWrapper
					totalDuration={conclusion_learning_planningSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={0}
			>
					<AnimatedContentSlide
					title="The Power of Learning and Planning"
					points={[
						"Learn from experience",
					"Plan future actions",
					"Pursue goals effectively"
					]}
					slideName="conclusion-learning-planning"
					audioDuration={conclusion_learning_planningSlide.audioDuration}
					moduleNumber={4}
					
					
				/>
				</CrossFadeWrapper>
			</Sequence>

		</div>
	);
};
