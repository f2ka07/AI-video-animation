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

export const Module5: React.FC = () => {
	const { fps } = useVideoConfig();
	const crossFadeDuration = 0.3;
	const whooshDuration = 0.57;

	const audioFiles = {
		"hook-final-labs-capstone": staticFile("audio/agentic-ai-labs-deep-dive/module5-hook-final-labs-capstone.wav"),
		"lab-10-1-overview": staticFile("audio/agentic-ai-labs-deep-dive/module5-lab-10-1-overview.wav"),
		"lab-10-1-code": staticFile("audio/agentic-ai-labs-deep-dive/module5-lab-10-1-code.wav"),
		"code-flow-lab-10-1": staticFile("audio/agentic-ai-labs-deep-dive/module5-code-flow-lab-10-1.wav"),
		"lab-10-1-in-practice-overview": staticFile("audio/agentic-ai-labs-deep-dive/module5-lab-10-1-in-practice-overview.wav"),
		"lab-10-1-actual-code": staticFile("audio/agentic-ai-labs-deep-dive/module5-lab-10-1-actual-code.wav"),
		"lab-10-1-actual-flow": staticFile("audio/agentic-ai-labs-deep-dive/module5-lab-10-1-actual-flow.wav"),
		"lab-10-2-overview": staticFile("audio/agentic-ai-labs-deep-dive/module5-lab-10-2-overview.wav"),
		"lab-10-2-code": staticFile("audio/agentic-ai-labs-deep-dive/module5-lab-10-2-code.wav"),
		"code-flow-lab-10-2": staticFile("audio/agentic-ai-labs-deep-dive/module5-code-flow-lab-10-2.wav"),
		"lab-10-2-in-practice-overview": staticFile("audio/agentic-ai-labs-deep-dive/module5-lab-10-2-in-practice-overview.wav"),
		"lab-10-2-actual-code": staticFile("audio/agentic-ai-labs-deep-dive/module5-lab-10-2-actual-code.wav"),
		"lab-10-2-actual-flow": staticFile("audio/agentic-ai-labs-deep-dive/module5-lab-10-2-actual-flow.wav"),
		"lab-10-3-overview": staticFile("audio/agentic-ai-labs-deep-dive/module5-lab-10-3-overview.wav"),
		"lab-10-3-code": staticFile("audio/agentic-ai-labs-deep-dive/module5-lab-10-3-code.wav"),
		"code-flow-lab-10-3": staticFile("audio/agentic-ai-labs-deep-dive/module5-code-flow-lab-10-3.wav"),
		"lab-10-3-in-practice-overview": staticFile("audio/agentic-ai-labs-deep-dive/module5-lab-10-3-in-practice-overview.wav"),
		"lab-10-3-actual-code": staticFile("audio/agentic-ai-labs-deep-dive/module5-lab-10-3-actual-code.wav"),
		"lab-10-3-actual-flow": staticFile("audio/agentic-ai-labs-deep-dive/module5-lab-10-3-actual-flow.wav"),
		"capstone-overview": staticFile("audio/agentic-ai-labs-deep-dive/module5-capstone-overview.wav"),
		"capstone-code": staticFile("audio/agentic-ai-labs-deep-dive/module5-capstone-code.wav"),
		"code-flow-capstone": staticFile("audio/agentic-ai-labs-deep-dive/module5-code-flow-capstone.wav"),
		"capstone-in-practice-overview": staticFile("audio/agentic-ai-labs-deep-dive/module5-capstone-in-practice-overview.wav"),
		"capstone-actual-code": staticFile("audio/agentic-ai-labs-deep-dive/module5-capstone-actual-code.wav"),
		"capstone-actual-flow": staticFile("audio/agentic-ai-labs-deep-dive/module5-capstone-actual-flow.wav"),
		"final-thoughts": staticFile("audio/agentic-ai-labs-deep-dive/module5-final-thoughts.wav"),
		"final-big-takeaway": staticFile("audio/agentic-ai-labs-deep-dive/module5-final-big-takeaway.wav"),
		whoosh: staticFile("audio/whoosh.wav"),
	};

	const audioDurations = {
		"hook-final-labs-capstone": getAudioDuration("agentic-ai-labs-deep-dive/module5-hook-final-labs-capstone"),
		"lab-10-1-overview": getAudioDuration("agentic-ai-labs-deep-dive/module5-lab-10-1-overview"),
		"lab-10-1-code": getAudioDuration("agentic-ai-labs-deep-dive/module5-lab-10-1-code"),
		"code-flow-lab-10-1": getAudioDuration("agentic-ai-labs-deep-dive/module5-code-flow-lab-10-1"),
		"lab-10-1-in-practice-overview": getAudioDuration("agentic-ai-labs-deep-dive/module5-lab-10-1-in-practice-overview"),
		"lab-10-1-actual-code": getAudioDuration("agentic-ai-labs-deep-dive/module5-lab-10-1-actual-code"),
		"lab-10-1-actual-flow": getAudioDuration("agentic-ai-labs-deep-dive/module5-lab-10-1-actual-flow"),
		"lab-10-2-overview": getAudioDuration("agentic-ai-labs-deep-dive/module5-lab-10-2-overview"),
		"lab-10-2-code": getAudioDuration("agentic-ai-labs-deep-dive/module5-lab-10-2-code"),
		"code-flow-lab-10-2": getAudioDuration("agentic-ai-labs-deep-dive/module5-code-flow-lab-10-2"),
		"lab-10-2-in-practice-overview": getAudioDuration("agentic-ai-labs-deep-dive/module5-lab-10-2-in-practice-overview"),
		"lab-10-2-actual-code": getAudioDuration("agentic-ai-labs-deep-dive/module5-lab-10-2-actual-code"),
		"lab-10-2-actual-flow": getAudioDuration("agentic-ai-labs-deep-dive/module5-lab-10-2-actual-flow"),
		"lab-10-3-overview": getAudioDuration("agentic-ai-labs-deep-dive/module5-lab-10-3-overview"),
		"lab-10-3-code": getAudioDuration("agentic-ai-labs-deep-dive/module5-lab-10-3-code"),
		"code-flow-lab-10-3": getAudioDuration("agentic-ai-labs-deep-dive/module5-code-flow-lab-10-3"),
		"lab-10-3-in-practice-overview": getAudioDuration("agentic-ai-labs-deep-dive/module5-lab-10-3-in-practice-overview"),
		"lab-10-3-actual-code": getAudioDuration("agentic-ai-labs-deep-dive/module5-lab-10-3-actual-code"),
		"lab-10-3-actual-flow": getAudioDuration("agentic-ai-labs-deep-dive/module5-lab-10-3-actual-flow"),
		"capstone-overview": getAudioDuration("agentic-ai-labs-deep-dive/module5-capstone-overview"),
		"capstone-code": getAudioDuration("agentic-ai-labs-deep-dive/module5-capstone-code"),
		"code-flow-capstone": getAudioDuration("agentic-ai-labs-deep-dive/module5-code-flow-capstone"),
		"capstone-in-practice-overview": getAudioDuration("agentic-ai-labs-deep-dive/module5-capstone-in-practice-overview"),
		"capstone-actual-code": getAudioDuration("agentic-ai-labs-deep-dive/module5-capstone-actual-code"),
		"capstone-actual-flow": getAudioDuration("agentic-ai-labs-deep-dive/module5-capstone-actual-flow"),
		"final-thoughts": getAudioDuration("agentic-ai-labs-deep-dive/module5-final-thoughts"),
		"final-big-takeaway": getAudioDuration("agentic-ai-labs-deep-dive/module5-final-big-takeaway"),
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

	const hook_final_labs_capstoneSlide = addSlide(audioDurations["hook-final-labs-capstone"], false, 0.3);
	const lab_10_1_overviewSlide = addSlide(audioDurations["lab-10-1-overview"], false, 0.3);
	const lab_10_1_codeSlide = addSlide(audioDurations["lab-10-1-code"], false, 0.3);
	const code_flow_lab_10_1Slide = addSlide(audioDurations["code-flow-lab-10-1"], false, 0.3);
	const lab_10_1_in_practice_overviewSlide = addSlide(audioDurations["lab-10-1-in-practice-overview"], false, 0.3);
	const lab_10_1_actual_codeSlide = addSlide(audioDurations["lab-10-1-actual-code"], false, 0.3);
	const lab_10_1_actual_flowSlide = addSlide(audioDurations["lab-10-1-actual-flow"], false, 0.3);
	const lab_10_2_overviewSlide = addSlide(audioDurations["lab-10-2-overview"], false, 0.3);
	const lab_10_2_codeSlide = addSlide(audioDurations["lab-10-2-code"], false, 0.3);
	const code_flow_lab_10_2Slide = addSlide(audioDurations["code-flow-lab-10-2"], false, 0.3);
	const lab_10_2_in_practice_overviewSlide = addSlide(audioDurations["lab-10-2-in-practice-overview"], false, 0.3);
	const lab_10_2_actual_codeSlide = addSlide(audioDurations["lab-10-2-actual-code"], false, 0.3);
	const lab_10_2_actual_flowSlide = addSlide(audioDurations["lab-10-2-actual-flow"], false, 0.3);
	const lab_10_3_overviewSlide = addSlide(audioDurations["lab-10-3-overview"], false, 0.3);
	const lab_10_3_codeSlide = addSlide(audioDurations["lab-10-3-code"], false, 0.3);
	const code_flow_lab_10_3Slide = addSlide(audioDurations["code-flow-lab-10-3"], false, 0.3);
	const lab_10_3_in_practice_overviewSlide = addSlide(audioDurations["lab-10-3-in-practice-overview"], false, 0.3);
	const lab_10_3_actual_codeSlide = addSlide(audioDurations["lab-10-3-actual-code"], false, 0.3);
	const lab_10_3_actual_flowSlide = addSlide(audioDurations["lab-10-3-actual-flow"], false, 0.3);
	const capstone_overviewSlide = addSlide(audioDurations["capstone-overview"], false, 0.3);
	const capstone_codeSlide = addSlide(audioDurations["capstone-code"], false, 0.3);
	const code_flow_capstoneSlide = addSlide(audioDurations["code-flow-capstone"], false, 0.3);
	const capstone_in_practice_overviewSlide = addSlide(audioDurations["capstone-in-practice-overview"], false, 0.3);
	const capstone_actual_codeSlide = addSlide(audioDurations["capstone-actual-code"], false, 0.3);
	const capstone_actual_flowSlide = addSlide(audioDurations["capstone-actual-flow"], false, 0.3);
	const final_thoughtsSlide = addSlide(audioDurations["final-thoughts"], false, 0.3);
	const final_big_takeawaySlide = addSlide(audioDurations["final-big-takeaway"], true, 0.8);

	return (
		<div
			style={{
				width: "100%",
			height: "100%",
			background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
			position: "relative",
		}}
		>
			{/* Bringing It All Together */}
			<Sequence
				from={hook_final_labs_capstoneSlide.start}
				durationInFrames={hook_final_labs_capstoneSlide.duration}
			>
				<Audio src={audioFiles["hook-final-labs-capstone"]} />
				<CrossFadeWrapper
					totalDuration={hook_final_labs_capstoneSlide.slideDuration}
					fadeInDuration={0.5}
					fadeOutDuration={crossFadeDuration}
			>
					<TitleSlide 
					title="Final Labs and Capstone: Mastery of Agentic AI" 
					subtitle="Integrating everything with labs 10.1 to 10.3 and the Capstone project"
					
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={hook_final_labs_capstoneSlide.start + hook_final_labs_capstoneSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 10.1: Multi-Goal Agents */}
			<Sequence
				from={lab_10_1_overviewSlide.start}
				durationInFrames={lab_10_1_overviewSlide.duration}
			>
				<Audio src={audioFiles["lab-10-1-overview"]} />
				<CrossFadeWrapper
					totalDuration={lab_10_1_overviewSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Lab 10.1: Multi-Goal Agents"
					points={[
						"Manage multiple goals",
					"Prioritize effectively",
					"Handle goal conflicts"
					]}
					slideName="lab-10-1-overview"
					audioDuration={lab_10_1_overviewSlide.audioDuration}
					moduleNumber={5}
					
					
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_10_1_overviewSlide.start + lab_10_1_overviewSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Goal Prioritization Code */}
			<Sequence
				from={lab_10_1_codeSlide.start}
				durationInFrames={lab_10_1_codeSlide.duration}
			>
				<Audio src={audioFiles["lab-10-1-code"]} />
				<CrossFadeWrapper
					totalDuration={lab_10_1_codeSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedCodeSlide
					title="Goal Prioritization Code"
					code={`goals = [{'name': 'A', 'priority': 2}, {'name': 'B', 'priority': 5}]
goals.sort(key=lambda g: g['priority'], reverse=True)
current_goal = goals[0]`}
					language="python"
					slideName="lab-10-1-code"
					audioStartFrame={lab_10_1_codeSlide.start}
					audioDuration={lab_10_1_codeSlide.audioDuration}
					moduleNumber={5}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_10_1_codeSlide.start + lab_10_1_codeSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 10.1 Code Flow */}
			<Sequence
				from={code_flow_lab_10_1Slide.start}
				durationInFrames={code_flow_lab_10_1Slide.duration}
			>
				<Audio src={audioFiles["code-flow-lab-10-1"]} />
				<CrossFadeWrapper
					totalDuration={code_flow_lab_10_1Slide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<BulletsAndCodeSlide
					title="Lab 10.1 Code Flow"
					points={[
						"Maintain list of goals with priorities",
						"Sort by priority descending",
						"Select top goal as current focus"
					]}
					code={`goals = [{'name': 'A', 'priority': 2}, {'name': 'B', 'priority': 5}]
goals.sort(key=lambda g: g['priority'], reverse=True)
current_goal = goals[0]`}
					language="python"
					codeContext="Lab 10.1: goal prioritization - multi-goal selection"
					slideName="code-flow-lab-10-1"
					audioDuration={code_flow_lab_10_1Slide.audioDuration}
					moduleNumber={5}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={code_flow_lab_10_1Slide.start + code_flow_lab_10_1Slide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 10.1 in Practice */}
			<Sequence
				from={lab_10_1_in_practice_overviewSlide.start}
				durationInFrames={lab_10_1_in_practice_overviewSlide.duration}
			>
				<Audio src={audioFiles["lab-10-1-in-practice-overview"]} />
				<CrossFadeWrapper
					totalDuration={lab_10_1_in_practice_overviewSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Lab 10.1 in Practice"
					points={[
						"send_email tool requires approval",
					"Collect pending_actions from tool_calls",
					"Prompt user: Approve? Execute only if yes"
					]}
					slideName="lab-10-1-in-practice-overview"
					audioDuration={lab_10_1_in_practice_overviewSlide.audioDuration}
					moduleNumber={5}
					
					
			/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_10_1_in_practice_overviewSlide.start + lab_10_1_in_practice_overviewSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 10.1 Actual Code */}
			<Sequence
				from={lab_10_1_actual_codeSlide.start}
				durationInFrames={lab_10_1_actual_codeSlide.duration}
			>
				<Audio src={audioFiles["lab-10-1-actual-code"]} />
				<CrossFadeWrapper
					totalDuration={lab_10_1_actual_codeSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedCodeSlide
					title="Lab 10.1 Actual Code"
					code={`for tool_call in response.tool_calls:
    if tool_call.tool_name == "send_email":
        pending_actions.append(tool_call)
for action in pending_actions:
    approval = input("Approve this action? (yes/no): ")
    if approval == "yes":
        result = await tool.handler(**action.arguments)`}
					language="python"
					slideName="lab-10-1-actual-code"
					audioStartFrame={lab_10_1_actual_codeSlide.start}
					audioDuration={lab_10_1_actual_codeSlide.audioDuration}
					moduleNumber={5}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_10_1_actual_codeSlide.start + lab_10_1_actual_codeSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 10.1 Actual Flow */}
			<Sequence
				from={lab_10_1_actual_flowSlide.start}
				durationInFrames={lab_10_1_actual_flowSlide.duration}
			>
				<Audio src={audioFiles["lab-10-1-actual-flow"]} />
				<CrossFadeWrapper
					totalDuration={lab_10_1_actual_flowSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<BulletsAndCodeSlide
					title="Lab 10.1 Actual Flow"
					points={[
						"Filter tool_calls for approval-required tools",
						"Prompt user for each pending action",
						"Execute only on approval"
					]}
					code={`pending_actions = [tc for tc in response.tool_calls if tc.tool_name == "send_email"]
approval = input("Approve? (yes/no)")
if approval == "yes": await tool.handler(**action.arguments)`}
					language="python"
					codeContext="Lab 10.1: send_email, HITL approval flow"
					slideName="lab-10-1-actual-flow"
					audioDuration={lab_10_1_actual_flowSlide.audioDuration}
					moduleNumber={5}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_10_1_actual_flowSlide.start + lab_10_1_actual_flowSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 10.2: Robustness and Adaptability */}
			<Sequence
				from={lab_10_2_overviewSlide.start}
				durationInFrames={lab_10_2_overviewSlide.duration}
			>
				<Audio src={audioFiles["lab-10-2-overview"]} />
				<CrossFadeWrapper
					totalDuration={lab_10_2_overviewSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Lab 10.2: Robustness and Adaptability"
					points={[
						"Failure recovery",
					"Plan adjustment",
					"Optimize goals"
					]}
					slideName="lab-10-2-overview"
					audioDuration={lab_10_2_overviewSlide.audioDuration}
					moduleNumber={5}
					
					
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_10_2_overviewSlide.start + lab_10_2_overviewSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Failure Recovery Code */}
			<Sequence
				from={lab_10_2_codeSlide.start}
				durationInFrames={lab_10_2_codeSlide.duration}
			>
				<Audio src={audioFiles["lab-10-2-code"]} />
				<CrossFadeWrapper
					totalDuration={lab_10_2_codeSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedCodeSlide
					title="Failure Recovery Code"
					code={`if env.failed:
    plan = replanner.replan(state)`}
					language="python"
					slideName="lab-10-2-code"
					audioStartFrame={lab_10_2_codeSlide.start}
					audioDuration={lab_10_2_codeSlide.audioDuration}
					moduleNumber={5}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_10_2_codeSlide.start + lab_10_2_codeSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 10.2 Code Flow */}
			<Sequence
				from={code_flow_lab_10_2Slide.start}
				durationInFrames={code_flow_lab_10_2Slide.duration}
			>
				<Audio src={audioFiles["code-flow-lab-10-2"]} />
				<CrossFadeWrapper
					totalDuration={code_flow_lab_10_2Slide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<BulletsAndCodeSlide
					title="Lab 10.2 Code Flow"
					points={[
						"Detect failure from environment",
						"Trigger replan with current state",
						"Replace plan with adapted one"
					]}
					code={`if env.failed:
    plan = replanner.replan(state)`}
					language="python"
					codeContext="Lab 10.2: failure recovery - replanning trigger"
					slideName="code-flow-lab-10-2"
					audioDuration={code_flow_lab_10_2Slide.audioDuration}
					moduleNumber={5}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={code_flow_lab_10_2Slide.start + code_flow_lab_10_2Slide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 10.2 in Practice */}
			<Sequence
				from={lab_10_2_in_practice_overviewSlide.start}
				durationInFrames={lab_10_2_in_practice_overviewSlide.duration}
			>
				<Audio src={audioFiles["lab-10-2-in-practice-overview"]} />
				<CrossFadeWrapper
					totalDuration={lab_10_2_in_practice_overviewSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Lab 10.2 in Practice"
					points={[
						"ResearcherAgent, CriticAgent, WriterAgent",
					"MultiAgentOrchestrator with agents dict",
					"run_round with order: researcher, critic, writer"
					]}
					slideName="lab-10-2-in-practice-overview"
					audioDuration={lab_10_2_in_practice_overviewSlide.audioDuration}
					moduleNumber={5}
					
					
			/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_10_2_in_practice_overviewSlide.start + lab_10_2_in_practice_overviewSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 10.2 Actual Code */}
			<Sequence
				from={lab_10_2_actual_codeSlide.start}
				durationInFrames={lab_10_2_actual_codeSlide.duration}
			>
				<Audio src={audioFiles["lab-10-2-actual-code"]} />
				<CrossFadeWrapper
					totalDuration={lab_10_2_actual_codeSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedCodeSlide
					title="Lab 10.2 Actual Code"
					code={`researcher = ResearcherAgent(AgentConfig(role="researcher", ...))
critic = CriticAgent(AgentConfig(role="critic", ...))
writer = WriterAgent(AgentConfig(role="writer", ...))
orchestrator = MultiAgentOrchestrator(agents={"researcher": researcher, ...})
responses = await orchestrator.run_round(history, order=["researcher", "critic", "writer"])`}
					language="python"
					slideName="lab-10-2-actual-code"
					audioStartFrame={lab_10_2_actual_codeSlide.start}
					audioDuration={lab_10_2_actual_codeSlide.audioDuration}
					moduleNumber={5}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_10_2_actual_codeSlide.start + lab_10_2_actual_codeSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 10.2 Actual Flow */}
			<Sequence
				from={lab_10_2_actual_flowSlide.start}
				durationInFrames={lab_10_2_actual_flowSlide.duration}
			>
				<Audio src={audioFiles["lab-10-2-actual-flow"]} />
				<CrossFadeWrapper
					totalDuration={lab_10_2_actual_flowSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<BulletsAndCodeSlide
					title="Lab 10.2 Actual Flow"
					points={[
						"Create ResearcherAgent, CriticAgent, WriterAgent",
						"orchestrator.run_round(history, order)",
						"Each agent adds to history in sequence"
					]}
					code={`orchestrator = MultiAgentOrchestrator(agents={...})
responses = await orchestrator.run_round(history, order=["researcher", "critic", "writer"])`}
					language="python"
					codeContext="Lab 10.2: ResearcherAgent, CriticAgent, WriterAgent, MultiAgentOrchestrator"
					slideName="lab-10-2-actual-flow"
					audioDuration={lab_10_2_actual_flowSlide.audioDuration}
					moduleNumber={5}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_10_2_actual_flowSlide.start + lab_10_2_actual_flowSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 10.3: Multimodal Agent Capabilities */}
			<Sequence
				from={lab_10_3_overviewSlide.start}
				durationInFrames={lab_10_3_overviewSlide.duration}
			>
				<Audio src={audioFiles["lab-10-3-overview"]} />
				<CrossFadeWrapper
					totalDuration={lab_10_3_overviewSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Lab 10.3: Multimodal Agent Capabilities"
					points={[
						"process_image for vision input",
					"process_audio for audio input",
					"Combined multimodal prompts"
					]}
					slideName="lab-10-3-overview"
					audioDuration={lab_10_3_overviewSlide.audioDuration}
					moduleNumber={5}
					
					
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_10_3_overviewSlide.start + lab_10_3_overviewSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 10.3 Code */}
			<Sequence
				from={lab_10_3_codeSlide.start}
				durationInFrames={lab_10_3_codeSlide.duration}
			>
				<Audio src={audioFiles["lab-10-3-code"]} />
				<CrossFadeWrapper
					totalDuration={lab_10_3_codeSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedCodeSlide
					title="Lab 10.3 Code"
					code={`image_description = await process_image(image_path)
audio_transcription = await process_audio(audio_path)
combined_prompt = f"Image: {image_description}\nAudio: {transcription}\nHow do these relate?"
response = await run_chat("planner", [Message(role="user", content=combined_prompt)])`}
					language="python"
					slideName="lab-10-3-code"
					audioStartFrame={lab_10_3_codeSlide.start}
					audioDuration={lab_10_3_codeSlide.audioDuration}
					moduleNumber={5}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_10_3_codeSlide.start + lab_10_3_codeSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 10.3 Code Flow */}
			<Sequence
				from={code_flow_lab_10_3Slide.start}
				durationInFrames={code_flow_lab_10_3Slide.duration}
			>
				<Audio src={audioFiles["code-flow-lab-10-3"]} />
				<CrossFadeWrapper
					totalDuration={code_flow_lab_10_3Slide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<BulletsAndCodeSlide
					title="Lab 10.3 Code Flow"
					points={[
						"process_image: path to description",
						"process_audio: path to transcription",
						"Combine in prompt, run_chat or agent.act"
					]}
					code={`image_desc = await process_image(path)
transcription = await process_audio(path)
prompt = f"Image: {image_desc}\nAudio: {transcription}"`}
					language="python"
					codeContext="Lab 10.3: process_image, process_audio, multimodal prompts"
					slideName="code-flow-lab-10-3"
					audioDuration={code_flow_lab_10_3Slide.audioDuration}
					moduleNumber={5}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={code_flow_lab_10_3Slide.start + code_flow_lab_10_3Slide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 10.3 in Practice */}
			<Sequence
				from={lab_10_3_in_practice_overviewSlide.start}
				durationInFrames={lab_10_3_in_practice_overviewSlide.duration}
			>
				<Audio src={audioFiles["lab-10-3-in-practice-overview"]} />
				<CrossFadeWrapper
					totalDuration={lab_10_3_in_practice_overviewSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Lab 10.3 in Practice"
					points={[
						"Scenario 1: process_image, planner for photography plan",
					"Scenario 2: process_audio, agent for transcription-based response",
					"Scenario 3: combined prompt for cross-modal reasoning"
					]}
					slideName="lab-10-3-in-practice-overview"
					audioDuration={lab_10_3_in_practice_overviewSlide.audioDuration}
					moduleNumber={5}
					
					
			/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_10_3_in_practice_overviewSlide.start + lab_10_3_in_practice_overviewSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 10.3 Actual Code */}
			<Sequence
				from={lab_10_3_actual_codeSlide.start}
				durationInFrames={lab_10_3_actual_codeSlide.duration}
			>
				<Audio src={audioFiles["lab-10-3-actual-code"]} />
				<CrossFadeWrapper
					totalDuration={lab_10_3_actual_codeSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedCodeSlide
					title="Lab 10.3 Actual Code"
					code={`image_description = await process_image("sample_image.jpg")
planner_prompt = f"Based on: {image_description}. Create a plan."
audio_transcription = await process_audio("sample_audio.wav")
combined = f"Image: {image_description}\nAudio: {transcription}\nHow do these relate?"`}
					language="python"
					slideName="lab-10-3-actual-code"
					audioStartFrame={lab_10_3_actual_codeSlide.start}
					audioDuration={lab_10_3_actual_codeSlide.audioDuration}
					moduleNumber={5}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_10_3_actual_codeSlide.start + lab_10_3_actual_codeSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 10.3 Actual Flow */}
			<Sequence
				from={lab_10_3_actual_flowSlide.start}
				durationInFrames={lab_10_3_actual_flowSlide.duration}
			>
				<Audio src={audioFiles["lab-10-3-actual-flow"]} />
				<CrossFadeWrapper
					totalDuration={lab_10_3_actual_flowSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<BulletsAndCodeSlide
					title="Lab 10.3 Actual Flow"
					points={[
						"process_image, process_audio return text",
						"Planner: image-only; Agent: audio-only",
						"Combined: both in one prompt"
					]}
					code={`image_desc = await process_image(path)
transcription = await process_audio(path)
combined = f"Image: {image_desc}\nAudio: {transcription}"`}
					language="python"
					codeContext="Lab 10.3: process_image, process_audio, multimodal scenarios"
					slideName="lab-10-3-actual-flow"
					audioDuration={lab_10_3_actual_flowSlide.audioDuration}
					moduleNumber={5}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_10_3_actual_flowSlide.start + lab_10_3_actual_flowSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Capstone Project Overview */}
			<Sequence
				from={capstone_overviewSlide.start}
				durationInFrames={capstone_overviewSlide.duration}
			>
				<Audio src={audioFiles["capstone-overview"]} />
				<CrossFadeWrapper
					totalDuration={capstone_overviewSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Capstone Project Overview"
					points={[
						"Integrate all skills",
					"Handle complex environments",
					"Achieve multi-goal success"
					]}
					slideName="capstone-overview"
					audioDuration={capstone_overviewSlide.audioDuration}
					moduleNumber={5}
					
					
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={capstone_overviewSlide.start + capstone_overviewSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Capstone Main Loop Code */}
			<Sequence
				from={capstone_codeSlide.start}
				durationInFrames={capstone_codeSlide.duration}
			>
				<Audio src={audioFiles["capstone-code"]} />
				<CrossFadeWrapper
					totalDuration={capstone_codeSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedCodeSlide
					title="Capstone Main Loop Code"
					code={`while True:
    state = agent.update_state(env.observe())
    goal = agent.select_goal(state)
    plan = agent.plan(goal)
    action = plan.next()
    env.step(action)
    agent.learn(env.feedback())`}
					language="python"
					slideName="capstone-code"
					audioStartFrame={capstone_codeSlide.start}
					audioDuration={capstone_codeSlide.audioDuration}
					moduleNumber={5}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={capstone_codeSlide.start + capstone_codeSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Capstone Main Loop Flow */}
			<Sequence
				from={code_flow_capstoneSlide.start}
				durationInFrames={code_flow_capstoneSlide.duration}
			>
				<Audio src={audioFiles["code-flow-capstone"]} />
				<CrossFadeWrapper
					totalDuration={code_flow_capstoneSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<BulletsAndCodeSlide
					title="Capstone Main Loop Flow"
					points={[
						"Observe and update state",
						"Select goal, plan, get action",
						"Act, then learn from feedback"
					]}
					code={`while True:
    state = agent.update_state(env.observe())
    goal = agent.select_goal(state)
    plan = agent.plan(goal)
    action = plan.next()
    env.step(action)
    agent.learn(env.feedback())`}
					language="python"
					codeContext="Capstone: main loop - full agent integration"
					slideName="code-flow-capstone"
					audioDuration={code_flow_capstoneSlide.audioDuration}
					moduleNumber={5}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={code_flow_capstoneSlide.start + code_flow_capstoneSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Capstone in Practice */}
			<Sequence
				from={capstone_in_practice_overviewSlide.start}
				durationInFrames={capstone_in_practice_overviewSlide.duration}
			>
				<Audio src={audioFiles["capstone-in-practice-overview"]} />
				<CrossFadeWrapper
					totalDuration={capstone_in_practice_overviewSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Capstone in Practice"
					points={[
						"AutonomousResearchPipeline: planner + RAG + multi-agent",
					"FastAPI: /health, /v1/research",
					"execute_research(query, session_id)"
					]}
					slideName="capstone-in-practice-overview"
					audioDuration={capstone_in_practice_overviewSlide.audioDuration}
					moduleNumber={5}
					
					
			/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={capstone_in_practice_overviewSlide.start + capstone_in_practice_overviewSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Capstone Actual Code */}
			<Sequence
				from={capstone_actual_codeSlide.start}
				durationInFrames={capstone_actual_codeSlide.duration}
			>
				<Audio src={audioFiles["capstone-actual-code"]} />
				<CrossFadeWrapper
					totalDuration={capstone_actual_codeSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedCodeSlide
					title="Capstone Actual Code"
					code={`app = FastAPI()
pipeline = AutonomousResearchPipeline()
@app.get("/health") ...
@app.post("/v1/research")
async def research(request):
    result = await pipeline.execute_research(request.query, request.session_id)
    return AgentInvokeResponse(response=result["response"], ...)`}
					language="python"
					slideName="capstone-actual-code"
					audioStartFrame={capstone_actual_codeSlide.start}
					audioDuration={capstone_actual_codeSlide.audioDuration}
					moduleNumber={5}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={capstone_actual_codeSlide.start + capstone_actual_codeSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Capstone Actual Flow */}
			<Sequence
				from={capstone_actual_flowSlide.start}
				durationInFrames={capstone_actual_flowSlide.duration}
			>
				<Audio src={audioFiles["capstone-actual-flow"]} />
				<CrossFadeWrapper
					totalDuration={capstone_actual_flowSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<BulletsAndCodeSlide
					title="Capstone Actual Flow"
					points={[
						"execute_research: plan, RAG, multi-agent, policy",
						"/v1/research endpoint",
						"Full integration of labs 5.1, 5.2, 6.1, 9.1, 10.2"
					]}
					code={`result = await pipeline.execute_research(request.query, request.session_id)
return AgentInvokeResponse(response=result["response"], ...)`}
					language="python"
					codeContext="Capstone: AutonomousResearchPipeline, /v1/research"
					slideName="capstone-actual-flow"
					audioDuration={capstone_actual_flowSlide.audioDuration}
					moduleNumber={5}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={capstone_actual_flowSlide.start + capstone_actual_flowSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Why Mastery Matters */}
			<Sequence
				from={final_thoughtsSlide.start}
				durationInFrames={final_thoughtsSlide.duration}
			>
				<Audio src={audioFiles["final-thoughts"]} />
				<CrossFadeWrapper
					totalDuration={final_thoughtsSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Why Mastery Matters"
					points={[
						"Integrate diverse skills",
					"Build resilient agents",
					"Prepare for real AI tasks"
					]}
					slideName="final-thoughts"
					audioDuration={final_thoughtsSlide.audioDuration}
					moduleNumber={5}
					
					
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={final_thoughtsSlide.start + final_thoughtsSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Your Agentic AI Journey Complete */}
			<Sequence
				from={final_big_takeawaySlide.start}
				durationInFrames={final_big_takeawaySlide.duration}
			>
				<Audio src={audioFiles["final-big-takeaway"]} />
				<CrossFadeWrapper
					totalDuration={final_big_takeawaySlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={0}
			>
					<AnimatedContentSlide
					title="Your Agentic AI Journey Complete"
					points={[
						"Stepwise skill building",
					"From simple to complex",
					"Agents ready for real world"
					]}
					slideName="final-big-takeaway"
					audioDuration={final_big_takeawaySlide.audioDuration}
					moduleNumber={5}
					
					
				/>
				</CrossFadeWrapper>
			</Sequence>

		</div>
	);
};
