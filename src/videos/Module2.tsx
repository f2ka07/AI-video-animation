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
		"hook-intermediate-agent-concepts": staticFile("audio/agentic-ai-labs-deep-dive/module2-hook-intermediate-agent-concepts.wav"),
		"lab-2-1-overview": staticFile("audio/agentic-ai-labs-deep-dive/module2-lab-2-1-overview.wav"),
		"lab-2-1-code": staticFile("audio/agentic-ai-labs-deep-dive/module2-lab-2-1-code.wav"),
		"code-flow-lab-2-1": staticFile("audio/agentic-ai-labs-deep-dive/module2-code-flow-lab-2-1.wav"),
		"lab-2-1-in-practice-overview": staticFile("audio/agentic-ai-labs-deep-dive/module2-lab-2-1-in-practice-overview.wav"),
		"lab-2-1-actual-code": staticFile("audio/agentic-ai-labs-deep-dive/module2-lab-2-1-actual-code.wav"),
		"lab-2-1-actual-flow": staticFile("audio/agentic-ai-labs-deep-dive/module2-lab-2-1-actual-flow.wav"),
		"lab-3-1-overview": staticFile("audio/agentic-ai-labs-deep-dive/module2-lab-3-1-overview.wav"),
		"lab-3-1-code": staticFile("audio/agentic-ai-labs-deep-dive/module2-lab-3-1-code.wav"),
		"code-flow-lab-3-1": staticFile("audio/agentic-ai-labs-deep-dive/module2-code-flow-lab-3-1.wav"),
		"lab-3-1-in-practice-overview": staticFile("audio/agentic-ai-labs-deep-dive/module2-lab-3-1-in-practice-overview.wav"),
		"lab-3-1-actual-code": staticFile("audio/agentic-ai-labs-deep-dive/module2-lab-3-1-actual-code.wav"),
		"lab-3-1-actual-flow": staticFile("audio/agentic-ai-labs-deep-dive/module2-lab-3-1-actual-flow.wav"),
		"why-intermediate-matters": staticFile("audio/agentic-ai-labs-deep-dive/module2-why-intermediate-matters.wav"),
		"conclusion-intermediate-agent": staticFile("audio/agentic-ai-labs-deep-dive/module2-conclusion-intermediate-agent.wav"),
		whoosh: staticFile("audio/whoosh.wav"),
	};

	const audioDurations = {
		"hook-intermediate-agent-concepts": getAudioDuration("agentic-ai-labs-deep-dive/module2-hook-intermediate-agent-concepts"),
		"lab-2-1-overview": getAudioDuration("agentic-ai-labs-deep-dive/module2-lab-2-1-overview"),
		"lab-2-1-code": getAudioDuration("agentic-ai-labs-deep-dive/module2-lab-2-1-code"),
		"code-flow-lab-2-1": getAudioDuration("agentic-ai-labs-deep-dive/module2-code-flow-lab-2-1"),
		"lab-2-1-in-practice-overview": getAudioDuration("agentic-ai-labs-deep-dive/module2-lab-2-1-in-practice-overview"),
		"lab-2-1-actual-code": getAudioDuration("agentic-ai-labs-deep-dive/module2-lab-2-1-actual-code"),
		"lab-2-1-actual-flow": getAudioDuration("agentic-ai-labs-deep-dive/module2-lab-2-1-actual-flow"),
		"lab-3-1-overview": getAudioDuration("agentic-ai-labs-deep-dive/module2-lab-3-1-overview"),
		"lab-3-1-code": getAudioDuration("agentic-ai-labs-deep-dive/module2-lab-3-1-code"),
		"code-flow-lab-3-1": getAudioDuration("agentic-ai-labs-deep-dive/module2-code-flow-lab-3-1"),
		"lab-3-1-in-practice-overview": getAudioDuration("agentic-ai-labs-deep-dive/module2-lab-3-1-in-practice-overview"),
		"lab-3-1-actual-code": getAudioDuration("agentic-ai-labs-deep-dive/module2-lab-3-1-actual-code"),
		"lab-3-1-actual-flow": getAudioDuration("agentic-ai-labs-deep-dive/module2-lab-3-1-actual-flow"),
		"why-intermediate-matters": getAudioDuration("agentic-ai-labs-deep-dive/module2-why-intermediate-matters"),
		"conclusion-intermediate-agent": getAudioDuration("agentic-ai-labs-deep-dive/module2-conclusion-intermediate-agent"),
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

	const hook_intermediate_agent_conceptsSlide = addSlide(audioDurations["hook-intermediate-agent-concepts"], false, 0.3);
	const lab_2_1_overviewSlide = addSlide(audioDurations["lab-2-1-overview"], false, 0.3);
	const lab_2_1_codeSlide = addSlide(audioDurations["lab-2-1-code"], false, 0.3);
	const code_flow_lab_2_1Slide = addSlide(audioDurations["code-flow-lab-2-1"], false, 0.3);
	const lab_2_1_in_practice_overviewSlide = addSlide(audioDurations["lab-2-1-in-practice-overview"], false, 0.3);
	const lab_2_1_actual_codeSlide = addSlide(audioDurations["lab-2-1-actual-code"], false, 0.3);
	const lab_2_1_actual_flowSlide = addSlide(audioDurations["lab-2-1-actual-flow"], false, 0.3);
	const lab_3_1_overviewSlide = addSlide(audioDurations["lab-3-1-overview"], false, 0.3);
	const lab_3_1_codeSlide = addSlide(audioDurations["lab-3-1-code"], false, 0.3);
	const code_flow_lab_3_1Slide = addSlide(audioDurations["code-flow-lab-3-1"], false, 0.3);
	const lab_3_1_in_practice_overviewSlide = addSlide(audioDurations["lab-3-1-in-practice-overview"], false, 0.3);
	const lab_3_1_actual_codeSlide = addSlide(audioDurations["lab-3-1-actual-code"], false, 0.3);
	const lab_3_1_actual_flowSlide = addSlide(audioDurations["lab-3-1-actual-flow"], false, 0.3);
	const why_intermediate_mattersSlide = addSlide(audioDurations["why-intermediate-matters"], false, 0.3);
	const conclusion_intermediate_agentSlide = addSlide(audioDurations["conclusion-intermediate-agent"], true, 0.8);

	return (
		<div
			style={{
				width: "100%",
			height: "100%",
			background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
			position: "relative",
		}}
		>
			{/* Level Up Your Agent Skills */}
			<Sequence
				from={hook_intermediate_agent_conceptsSlide.start}
				durationInFrames={hook_intermediate_agent_conceptsSlide.duration}
			>
				<Audio src={audioFiles["hook-intermediate-agent-concepts"]} />
				<CrossFadeWrapper
					totalDuration={hook_intermediate_agent_conceptsSlide.slideDuration}
					fadeInDuration={0.5}
					fadeOutDuration={crossFadeDuration}
			>
					<TitleSlide 
					title="Exploring Agentic AI Labs 2.1 and 3.1: Intermediate Agent Concepts" 
					subtitle="Understand agent states, observations, and simple decision making"
					
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={hook_intermediate_agent_conceptsSlide.start + hook_intermediate_agent_conceptsSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 2.1: Agent State Updates */}
			<Sequence
				from={lab_2_1_overviewSlide.start}
				durationInFrames={lab_2_1_overviewSlide.duration}
			>
				<Audio src={audioFiles["lab-2-1-overview"]} />
				<CrossFadeWrapper
					totalDuration={lab_2_1_overviewSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Lab 2.1: Agent State Updates"
					points={[
						"Internal agent state",
					"Update with observations",
					"Enable context awareness"
					]}
					slideName="lab-2-1-overview"
					audioDuration={lab_2_1_overviewSlide.audioDuration}
					moduleNumber={2}
					
					
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_2_1_overviewSlide.start + lab_2_1_overviewSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Agent State Update Code */}
			<Sequence
				from={lab_2_1_codeSlide.start}
				durationInFrames={lab_2_1_codeSlide.duration}
			>
				<Audio src={audioFiles["lab-2-1-code"]} />
				<CrossFadeWrapper
					totalDuration={lab_2_1_codeSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedCodeSlide
					title="Agent State Update Code"
					code={`def update_state(state, observation):
    state['last_obs'] = observation
    state['steps'] += 1
    return state`}
					language="python"
					slideName="lab-2-1-code"
					audioStartFrame={lab_2_1_codeSlide.start}
					audioDuration={lab_2_1_codeSlide.audioDuration}
					moduleNumber={2}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_2_1_codeSlide.start + lab_2_1_codeSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 2.1 Code Flow */}
			<Sequence
				from={code_flow_lab_2_1Slide.start}
				durationInFrames={code_flow_lab_2_1Slide.duration}
			>
				<Audio src={audioFiles["code-flow-lab-2-1"]} />
				<CrossFadeWrapper
					totalDuration={code_flow_lab_2_1Slide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<BulletsAndCodeSlide
					title="Lab 2.1 Code Flow"
					points={[
						"Store observation for memory",
						"Increment step counter",
						"Return updated state for next decision"
					]}
					code={`def update_state(state, observation):
    state['last_obs'] = observation
    state['steps'] += 1
    return state`}
					language="python"
					codeContext="Lab 2.1: update_state() - agent memory component"
					slideName="code-flow-lab-2-1"
					audioDuration={code_flow_lab_2_1Slide.audioDuration}
					moduleNumber={2}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={code_flow_lab_2_1Slide.start + code_flow_lab_2_1Slide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 2.1 in Practice */}
			<Sequence
				from={lab_2_1_in_practice_overviewSlide.start}
				durationInFrames={lab_2_1_in_practice_overviewSlide.duration}
			>
				<Audio src={audioFiles["lab-2-1-in-practice-overview"]} />
				<CrossFadeWrapper
					totalDuration={lab_2_1_in_practice_overviewSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Lab 2.1 in Practice"
					points={[
						"Tool schema: properties, required, types",
					"validate_tool_args checks before execution",
					"lookup_travel_info as example tool"
					]}
					slideName="lab-2-1-in-practice-overview"
					audioDuration={lab_2_1_in_practice_overviewSlide.audioDuration}
					moduleNumber={2}
					
					
			/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_2_1_in_practice_overviewSlide.start + lab_2_1_in_practice_overviewSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 2.1 Actual Code */}
			<Sequence
				from={lab_2_1_actual_codeSlide.start}
				durationInFrames={lab_2_1_actual_codeSlide.duration}
			>
				<Audio src={audioFiles["lab-2-1-actual-code"]} />
				<CrossFadeWrapper
					totalDuration={lab_2_1_actual_codeSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedCodeSlide
					title="Lab 2.1 Actual Code"
					code={`def validate_tool_args(tool, arguments):
    for field in tool.parameters.get("required", []):
        if field not in arguments:
            return False, f"Missing required field: {field}"
    return True, None

is_valid, error = validate_tool_args(tool, tool_call.arguments)
if is_valid:
    result = await tool.handler(**tool_call.arguments)`}
					language="python"
					slideName="lab-2-1-actual-code"
					audioStartFrame={lab_2_1_actual_codeSlide.start}
					audioDuration={lab_2_1_actual_codeSlide.audioDuration}
					moduleNumber={2}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_2_1_actual_codeSlide.start + lab_2_1_actual_codeSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 2.1 Actual Flow */}
			<Sequence
				from={lab_2_1_actual_flowSlide.start}
				durationInFrames={lab_2_1_actual_flowSlide.duration}
			>
				<Audio src={audioFiles["lab-2-1-actual-flow"]} />
				<CrossFadeWrapper
					totalDuration={lab_2_1_actual_flowSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<BulletsAndCodeSlide
					title="Lab 2.1 Actual Flow"
					points={[
						"Define parameters with type and required",
						"Validate arguments before handler call",
						"Execute only when validation passes"
					]}
					code={`parameters={"properties":{"city":{"type":"string"},"budget":{"type":"number"}},"required":["city","dates","budget"]}
is_valid, error = validate_tool_args(tool, tool_call.arguments)`}
					language="python"
					codeContext="Lab 2.1: validate_tool_args, lookup_travel_info"
					slideName="lab-2-1-actual-flow"
					audioDuration={lab_2_1_actual_flowSlide.audioDuration}
					moduleNumber={2}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_2_1_actual_flowSlide.start + lab_2_1_actual_flowSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 3.1: Basic Decision Making */}
			<Sequence
				from={lab_3_1_overviewSlide.start}
				durationInFrames={lab_3_1_overviewSlide.duration}
			>
				<Audio src={audioFiles["lab-3-1-overview"]} />
				<CrossFadeWrapper
					totalDuration={lab_3_1_overviewSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Lab 3.1: Basic Decision Making"
					points={[
						"Dynamic action selection",
					"Leverages agent state",
					"Moves beyond fixed actions"
					]}
					slideName="lab-3-1-overview"
					audioDuration={lab_3_1_overviewSlide.audioDuration}
					moduleNumber={2}
					
					
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_3_1_overviewSlide.start + lab_3_1_overviewSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Decision Making Code Snippet */}
			<Sequence
				from={lab_3_1_codeSlide.start}
				durationInFrames={lab_3_1_codeSlide.duration}
			>
				<Audio src={audioFiles["lab-3-1-code"]} />
				<CrossFadeWrapper
					totalDuration={lab_3_1_codeSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedCodeSlide
					title="Decision Making Code Snippet"
					code={`def decide_action(state, observation):
    if observation == 'obstacle':
        return 'move_right'
    return 'move_forward'`}
					language="python"
					slideName="lab-3-1-code"
					audioStartFrame={lab_3_1_codeSlide.start}
					audioDuration={lab_3_1_codeSlide.audioDuration}
					moduleNumber={2}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_3_1_codeSlide.start + lab_3_1_codeSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 3.1 Code Flow */}
			<Sequence
				from={code_flow_lab_3_1Slide.start}
				durationInFrames={code_flow_lab_3_1Slide.duration}
			>
				<Audio src={audioFiles["code-flow-lab-3-1"]} />
				<CrossFadeWrapper
					totalDuration={code_flow_lab_3_1Slide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<BulletsAndCodeSlide
					title="Lab 3.1 Code Flow"
					points={[
						"Check observation first",
						"Branch on obstacle vs clear",
						"Return appropriate action"
					]}
					code={`def decide_action(state, observation):
    if observation == 'obstacle':
        return 'move_right'
    return 'move_forward'`}
					language="python"
					codeContext="Lab 3.1: decide_action() - reactive decision logic"
					slideName="code-flow-lab-3-1"
					audioDuration={code_flow_lab_3_1Slide.audioDuration}
					moduleNumber={2}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={code_flow_lab_3_1Slide.start + code_flow_lab_3_1Slide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 3.1 in Practice */}
			<Sequence
				from={lab_3_1_in_practice_overviewSlide.start}
				durationInFrames={lab_3_1_in_practice_overviewSlide.duration}
			>
				<Audio src={audioFiles["lab-3-1-in-practice-overview"]} />
				<CrossFadeWrapper
					totalDuration={lab_3_1_in_practice_overviewSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Lab 3.1 in Practice"
					points={[
						"UnitTestEvaluator runs test function on code",
					"SelfRepairPipeline: agent plus evaluator",
					"execute_with_repair loop until pass or max attempts"
					]}
					slideName="lab-3-1-in-practice-overview"
					audioDuration={lab_3_1_in_practice_overviewSlide.audioDuration}
					moduleNumber={2}
					
					
			/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_3_1_in_practice_overviewSlide.start + lab_3_1_in_practice_overviewSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 3.1 Actual Code */}
			<Sequence
				from={lab_3_1_actual_codeSlide.start}
				durationInFrames={lab_3_1_actual_codeSlide.duration}
			>
				<Audio src={audioFiles["lab-3-1-actual-code"]} />
				<CrossFadeWrapper
					totalDuration={lab_3_1_actual_codeSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedCodeSlide
					title="Lab 3.1 Actual Code"
					code={`evaluator = UnitTestEvaluator(test_add_function)
eval_result = await evaluator.evaluate(initial_code)
pipeline = SelfRepairPipeline(agent, evaluator, max_repair_attempts=3)
result = await pipeline.execute_with_repair(messages, evaluation_criteria={'test_function': test_add_function})`}
					language="python"
					slideName="lab-3-1-actual-code"
					audioStartFrame={lab_3_1_actual_codeSlide.start}
					audioDuration={lab_3_1_actual_codeSlide.audioDuration}
					moduleNumber={2}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_3_1_actual_codeSlide.start + lab_3_1_actual_codeSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 3.1 Actual Flow */}
			<Sequence
				from={lab_3_1_actual_flowSlide.start}
				durationInFrames={lab_3_1_actual_flowSlide.duration}
			>
				<Audio src={audioFiles["lab-3-1-actual-flow"]} />
				<CrossFadeWrapper
					totalDuration={lab_3_1_actual_flowSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<BulletsAndCodeSlide
					title="Lab 3.1 Actual Flow"
					points={[
						"Generate code with agent",
						"Evaluate with UnitTestEvaluator",
						"Repair loop: feedback to agent, retry until pass or max"
					]}
					code={`initial_code = await code_generation_agent(prompt)
eval_result = await evaluator.evaluate(initial_code)
result = await pipeline.execute_with_repair(messages, evaluation_criteria={...})`}
					language="python"
					codeContext="Lab 3.1: UnitTestEvaluator, SelfRepairPipeline"
					slideName="lab-3-1-actual-flow"
					audioDuration={lab_3_1_actual_flowSlide.audioDuration}
					moduleNumber={2}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_3_1_actual_flowSlide.start + lab_3_1_actual_flowSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Why This Matters */}
			<Sequence
				from={why_intermediate_mattersSlide.start}
				durationInFrames={why_intermediate_mattersSlide.duration}
			>
				<Audio src={audioFiles["why-intermediate-matters"]} />
				<CrossFadeWrapper
					totalDuration={why_intermediate_mattersSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Why This Matters"
					points={[
						"Build smarter agents",
					"Use memory for decisions",
					"Prepare for complex tasks"
					]}
					slideName="why-intermediate-matters"
					audioDuration={why_intermediate_mattersSlide.audioDuration}
					moduleNumber={2}
					
					
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={why_intermediate_mattersSlide.start + why_intermediate_mattersSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* What This Means for You */}
			<Sequence
				from={conclusion_intermediate_agentSlide.start}
				durationInFrames={conclusion_intermediate_agentSlide.duration}
			>
				<Audio src={audioFiles["conclusion-intermediate-agent"]} />
				<CrossFadeWrapper
					totalDuration={conclusion_intermediate_agentSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={0}
			>
					<AnimatedContentSlide
					title="What This Means for You"
					points={[
						"Agents need memory",
					"Dynamic actions beat fixed",
					"Foundation for intelligence"
					]}
					slideName="conclusion-intermediate-agent"
					audioDuration={conclusion_intermediate_agentSlide.audioDuration}
					moduleNumber={2}
					
					
				/>
				</CrossFadeWrapper>
			</Sequence>

		</div>
	);
};
