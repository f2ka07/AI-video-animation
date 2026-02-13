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
		"hook-intro-agentic-ai": staticFile("audio/agentic-ai-labs-deep-dive/module1-hook-intro-agentic-ai.wav"),
		"environment-smoke-test-overview": staticFile("audio/agentic-ai-labs-deep-dive/module1-environment-smoke-test-overview.wav"),
		"explanation-environment-smoke-test": staticFile("audio/agentic-ai-labs-deep-dive/module1-explanation-environment-smoke-test.wav"),
		"environment-smoke-test-code": staticFile("audio/agentic-ai-labs-deep-dive/module1-environment-smoke-test-code.wav"),
		"code-flow-environment-smoke-test": staticFile("audio/agentic-ai-labs-deep-dive/module1-code-flow-environment-smoke-test.wav"),
		"lab-1-1-in-practice-overview": staticFile("audio/agentic-ai-labs-deep-dive/module1-lab-1-1-in-practice-overview.wav"),
		"lab-1-1-actual-code": staticFile("audio/agentic-ai-labs-deep-dive/module1-lab-1-1-actual-code.wav"),
		"lab-1-1-actual-flow": staticFile("audio/agentic-ai-labs-deep-dive/module1-lab-1-1-actual-flow.wav"),
		"minimal-acting-agent-intro": staticFile("audio/agentic-ai-labs-deep-dive/module1-minimal-acting-agent-intro.wav"),
		"explanation-minimal-acting-agent": staticFile("audio/agentic-ai-labs-deep-dive/module1-explanation-minimal-acting-agent.wav"),
		"minimal-acting-agent-code": staticFile("audio/agentic-ai-labs-deep-dive/module1-minimal-acting-agent-code.wav"),
		"code-flow-minimal-acting-agent": staticFile("audio/agentic-ai-labs-deep-dive/module1-code-flow-minimal-acting-agent.wav"),
		"lab-1-2-in-practice-overview": staticFile("audio/agentic-ai-labs-deep-dive/module1-lab-1-2-in-practice-overview.wav"),
		"lab-1-2-actual-code": staticFile("audio/agentic-ai-labs-deep-dive/module1-lab-1-2-actual-code.wav"),
		"lab-1-2-actual-flow": staticFile("audio/agentic-ai-labs-deep-dive/module1-lab-1-2-actual-flow.wav"),
		"why-start-simple": staticFile("audio/agentic-ai-labs-deep-dive/module1-why-start-simple.wav"),
		"big-takeaway-agentic-ai-start": staticFile("audio/agentic-ai-labs-deep-dive/module1-big-takeaway-agentic-ai-start.wav"),
		whoosh: staticFile("audio/whoosh.wav"),
	};

	const audioDurations = {
		"hook-intro-agentic-ai": getAudioDuration("agentic-ai-labs-deep-dive/module1-hook-intro-agentic-ai"),
		"environment-smoke-test-overview": getAudioDuration("agentic-ai-labs-deep-dive/module1-environment-smoke-test-overview"),
		"explanation-environment-smoke-test": getAudioDuration("agentic-ai-labs-deep-dive/module1-explanation-environment-smoke-test"),
		"environment-smoke-test-code": getAudioDuration("agentic-ai-labs-deep-dive/module1-environment-smoke-test-code"),
		"code-flow-environment-smoke-test": getAudioDuration("agentic-ai-labs-deep-dive/module1-code-flow-environment-smoke-test"),
		"lab-1-1-in-practice-overview": getAudioDuration("agentic-ai-labs-deep-dive/module1-lab-1-1-in-practice-overview"),
		"lab-1-1-actual-code": getAudioDuration("agentic-ai-labs-deep-dive/module1-lab-1-1-actual-code"),
		"lab-1-1-actual-flow": getAudioDuration("agentic-ai-labs-deep-dive/module1-lab-1-1-actual-flow"),
		"minimal-acting-agent-intro": getAudioDuration("agentic-ai-labs-deep-dive/module1-minimal-acting-agent-intro"),
		"explanation-minimal-acting-agent": getAudioDuration("agentic-ai-labs-deep-dive/module1-explanation-minimal-acting-agent"),
		"minimal-acting-agent-code": getAudioDuration("agentic-ai-labs-deep-dive/module1-minimal-acting-agent-code"),
		"code-flow-minimal-acting-agent": getAudioDuration("agentic-ai-labs-deep-dive/module1-code-flow-minimal-acting-agent"),
		"lab-1-2-in-practice-overview": getAudioDuration("agentic-ai-labs-deep-dive/module1-lab-1-2-in-practice-overview"),
		"lab-1-2-actual-code": getAudioDuration("agentic-ai-labs-deep-dive/module1-lab-1-2-actual-code"),
		"lab-1-2-actual-flow": getAudioDuration("agentic-ai-labs-deep-dive/module1-lab-1-2-actual-flow"),
		"why-start-simple": getAudioDuration("agentic-ai-labs-deep-dive/module1-why-start-simple"),
		"big-takeaway-agentic-ai-start": getAudioDuration("agentic-ai-labs-deep-dive/module1-big-takeaway-agentic-ai-start"),
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

	const hook_intro_agentic_aiSlide = addSlide(audioDurations["hook-intro-agentic-ai"], false, 0.3);
	const environment_smoke_test_overviewSlide = addSlide(audioDurations["environment-smoke-test-overview"], false, 0.3);
	const explanation_environment_smoke_testSlide = addSlide(audioDurations["explanation-environment-smoke-test"], false, 0.3);
	const environment_smoke_test_codeSlide = addSlide(audioDurations["environment-smoke-test-code"], false, 0.3);
	const code_flow_environment_smoke_testSlide = addSlide(audioDurations["code-flow-environment-smoke-test"], false, 0.3);
	const lab_1_1_in_practice_overviewSlide = addSlide(audioDurations["lab-1-1-in-practice-overview"], false, 0.3);
	const lab_1_1_actual_codeSlide = addSlide(audioDurations["lab-1-1-actual-code"], false, 0.3);
	const lab_1_1_actual_flowSlide = addSlide(audioDurations["lab-1-1-actual-flow"], false, 0.3);
	const minimal_acting_agent_introSlide = addSlide(audioDurations["minimal-acting-agent-intro"], false, 0.3);
	const explanation_minimal_acting_agentSlide = addSlide(audioDurations["explanation-minimal-acting-agent"], false, 0.3);
	const minimal_acting_agent_codeSlide = addSlide(audioDurations["minimal-acting-agent-code"], false, 0.3);
	const code_flow_minimal_acting_agentSlide = addSlide(audioDurations["code-flow-minimal-acting-agent"], false, 0.3);
	const lab_1_2_in_practice_overviewSlide = addSlide(audioDurations["lab-1-2-in-practice-overview"], false, 0.3);
	const lab_1_2_actual_codeSlide = addSlide(audioDurations["lab-1-2-actual-code"], false, 0.3);
	const lab_1_2_actual_flowSlide = addSlide(audioDurations["lab-1-2-actual-flow"], false, 0.3);
	const why_start_simpleSlide = addSlide(audioDurations["why-start-simple"], false, 0.3);
	const big_takeaway_agentic_ai_startSlide = addSlide(audioDurations["big-takeaway-agentic-ai-start"], true, 0.8);

	return (
		<div
			style={{
				width: "100%",
			height: "100%",
			background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
			position: "relative",
		}}
		>
			{/* Kickstart Your Agentic AI Journey */}
			<Sequence
				from={hook_intro_agentic_aiSlide.start}
				durationInFrames={hook_intro_agentic_aiSlide.duration}
			>
				<Audio src={audioFiles["hook-intro-agentic-ai"]} />
				<CrossFadeWrapper
					totalDuration={hook_intro_agentic_aiSlide.slideDuration}
					fadeInDuration={0.5}
					fadeOutDuration={crossFadeDuration}
			>
					<TitleSlide 
					title="Getting Started with Agentic AI Labs" 
					subtitle="Explore the Environment Smoke Test and Minimal Acting Agent"
					
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={hook_intro_agentic_aiSlide.start + hook_intro_agentic_aiSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 1.1: Environment Smoke Test */}
			<Sequence
				from={environment_smoke_test_overviewSlide.start}
				durationInFrames={environment_smoke_test_overviewSlide.duration}
			>
				<Audio src={audioFiles["environment-smoke-test-overview"]} />
				<CrossFadeWrapper
					totalDuration={environment_smoke_test_overviewSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Lab 1.1: Environment Smoke Test"
					points={[
						"Verify AI environment setup",
					"Check dependencies quickly",
					"Prevent early errors"
					]}
					slideName="environment-smoke-test-overview"
					audioDuration={environment_smoke_test_overviewSlide.audioDuration}
					moduleNumber={1}
					
					
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={environment_smoke_test_overviewSlide.start + environment_smoke_test_overviewSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Understanding the Smoke Test */}
			<Sequence
				from={explanation_environment_smoke_testSlide.start}
				durationInFrames={explanation_environment_smoke_testSlide.duration}
			>
				<Audio src={audioFiles["explanation-environment-smoke-test"]} />
				<CrossFadeWrapper
					totalDuration={explanation_environment_smoke_testSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Understanding the Smoke Test"
					points={[
						"Initialization and readiness checks",
					"Catch configuration issues early",
					"Confidence before building"
					]}
					slideName="explanation-environment-smoke-test"
					audioDuration={explanation_environment_smoke_testSlide.audioDuration}
					moduleNumber={1}
					
					
			/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={explanation_environment_smoke_testSlide.start + explanation_environment_smoke_testSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Smoke Test Code Snippet */}
			<Sequence
				from={environment_smoke_test_codeSlide.start}
				durationInFrames={environment_smoke_test_codeSlide.duration}
			>
				<Audio src={audioFiles["environment-smoke-test-code"]} />
				<CrossFadeWrapper
					totalDuration={environment_smoke_test_codeSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedCodeSlide
					title="Smoke Test Code Snippet"
					code={`def smoke_test():
    env = initialize_env()
    assert env.is_ready(), "Environment not ready"
    print('Smoke test passed!')`}
					language="python"
					slideName="environment-smoke-test-code"
					audioStartFrame={environment_smoke_test_codeSlide.start}
					audioDuration={environment_smoke_test_codeSlide.audioDuration}
					moduleNumber={1}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={environment_smoke_test_codeSlide.start + environment_smoke_test_codeSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Smoke Test Code Flow */}
			<Sequence
				from={code_flow_environment_smoke_testSlide.start}
				durationInFrames={code_flow_environment_smoke_testSlide.duration}
			>
				<Audio src={audioFiles["code-flow-environment-smoke-test"]} />
				<CrossFadeWrapper
					totalDuration={code_flow_environment_smoke_testSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<BulletsAndCodeSlide
					title="Smoke Test Code Flow"
					points={[
						"Step 1: Initialize environment",
						"Step 2: Assert readiness—fail fast if not",
						"Step 3: Confirm success before continuing"
					]}
					code={`def smoke_test():
    env = initialize_env()
    assert env.is_ready(), "Environment not ready"
    print('Smoke test passed!')`}
					language="python"
					codeContext="Lab 1.1: smoke_test() - environment setup validation"
					slideName="code-flow-environment-smoke-test"
					audioDuration={code_flow_environment_smoke_testSlide.audioDuration}
					moduleNumber={1}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={code_flow_environment_smoke_testSlide.start + code_flow_environment_smoke_testSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 1.1 in Practice */}
			<Sequence
				from={lab_1_1_in_practice_overviewSlide.start}
				durationInFrames={lab_1_1_in_practice_overviewSlide.duration}
			>
				<Audio src={audioFiles["lab-1-1-in-practice-overview"]} />
				<CrossFadeWrapper
					totalDuration={lab_1_1_in_practice_overviewSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Lab 1.1 in Practice"
					points={[
						"Tests run_chat for LLM inference",
					"Tests embed_text for embeddings",
					"Tests MemoryStore add and get"
					]}
					slideName="lab-1-1-in-practice-overview"
					audioDuration={lab_1_1_in_practice_overviewSlide.audioDuration}
					moduleNumber={1}
					
					
			/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_1_1_in_practice_overviewSlide.start + lab_1_1_in_practice_overviewSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 1.1 Actual Code */}
			<Sequence
				from={lab_1_1_actual_codeSlide.start}
				durationInFrames={lab_1_1_actual_codeSlide.duration}
			>
				<Audio src={audioFiles["lab-1-1-actual-code"]} />
				<CrossFadeWrapper
					totalDuration={lab_1_1_actual_codeSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedCodeSlide
					title="Lab 1.1 Actual Code"
					code={`msg = Message(role="user", content="Say 'OK' if you can read this.")
resp = await run_chat("planner", [msg])
embedding = embed_text("test text")
store = MemoryStore()
memory_id = store.add_memory("test_session", "test content")
memories = store.get_memories("test_session", limit=1)`}
					language="python"
					slideName="lab-1-1-actual-code"
					audioStartFrame={lab_1_1_actual_codeSlide.start}
					audioDuration={lab_1_1_actual_codeSlide.audioDuration}
					moduleNumber={1}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_1_1_actual_codeSlide.start + lab_1_1_actual_codeSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 1.1 Actual Flow */}
			<Sequence
				from={lab_1_1_actual_flowSlide.start}
				durationInFrames={lab_1_1_actual_flowSlide.duration}
			>
				<Audio src={audioFiles["lab-1-1-actual-flow"]} />
				<CrossFadeWrapper
					totalDuration={lab_1_1_actual_flowSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<BulletsAndCodeSlide
					title="Lab 1.1 Actual Flow"
					points={[
						"[1/3] run_chat: LLM inference with planner model",
						"[2/3] embed_text: embedding dimension check",
						"[3/3] MemoryStore: add and retrieve memories"
					]}
					code={`resp = await run_chat("planner", [msg])
embedding = embed_text("test text")
store.add_memory("test_session", "test content")
memories = store.get_memories("test_session", limit=1)`}
					language="python"
					codeContext="Lab 1.1: main() - LLM, embeddings, MemoryStore validation"
					slideName="lab-1-1-actual-flow"
					audioDuration={lab_1_1_actual_flowSlide.audioDuration}
					moduleNumber={1}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_1_1_actual_flowSlide.start + lab_1_1_actual_flowSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 1.2: Minimal Acting Agent */}
			<Sequence
				from={minimal_acting_agent_introSlide.start}
				durationInFrames={minimal_acting_agent_introSlide.duration}
			>
				<Audio src={audioFiles["minimal-acting-agent-intro"]} />
				<CrossFadeWrapper
					totalDuration={minimal_acting_agent_introSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Lab 1.2: Minimal Acting Agent"
					points={[
						"Build basic acting agent",
					"Understand agent loop",
					"Focus on simple actions"
					]}
					slideName="minimal-acting-agent-intro"
					audioDuration={minimal_acting_agent_introSlide.audioDuration}
					moduleNumber={1}
					
					
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={minimal_acting_agent_introSlide.start + minimal_acting_agent_introSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* The Minimal Agent Action Loop */}
			<Sequence
				from={explanation_minimal_acting_agentSlide.start}
				durationInFrames={explanation_minimal_acting_agentSlide.duration}
			>
				<Audio src={audioFiles["explanation-minimal-acting-agent"]} />
				<CrossFadeWrapper
					totalDuration={explanation_minimal_acting_agentSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="The Minimal Agent Action Loop"
					points={[
						"Perceive, decide, act cycle",
					"Environment interaction basics",
					"Foundation for complex agents"
					]}
					slideName="explanation-minimal-acting-agent"
					audioDuration={explanation_minimal_acting_agentSlide.audioDuration}
					moduleNumber={1}
					
					
			/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={explanation_minimal_acting_agentSlide.start + explanation_minimal_acting_agentSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Minimal Agent Action Loop */}
			<Sequence
				from={minimal_acting_agent_codeSlide.start}
				durationInFrames={minimal_acting_agent_codeSlide.duration}
			>
				<Audio src={audioFiles["minimal-acting-agent-code"]} />
				<CrossFadeWrapper
					totalDuration={minimal_acting_agent_codeSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedCodeSlide
					title="Minimal Agent Action Loop"
					code={`while True:
    action = 'do_nothing'
    env.step(action)
    if env.done:
        break`}
					language="python"
					slideName="minimal-acting-agent-code"
					audioStartFrame={minimal_acting_agent_codeSlide.start}
					audioDuration={minimal_acting_agent_codeSlide.audioDuration}
					moduleNumber={1}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={minimal_acting_agent_codeSlide.start + minimal_acting_agent_codeSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Minimal Agent Loop Flow */}
			<Sequence
				from={code_flow_minimal_acting_agentSlide.start}
				durationInFrames={code_flow_minimal_acting_agentSlide.duration}
			>
				<Audio src={audioFiles["code-flow-minimal-acting-agent"]} />
				<CrossFadeWrapper
					totalDuration={code_flow_minimal_acting_agentSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<BulletsAndCodeSlide
					title="Minimal Agent Loop Flow"
					points={[
						"Choose action",
						"Execute via env.step",
						"Check terminal condition and loop"
					]}
					code={`while True:
    action = 'do_nothing'
    env.step(action)
    if env.done:
        break`}
					language="python"
					codeContext="Lab 1.2: main agent loop - perceive, act, check"
					slideName="code-flow-minimal-acting-agent"
					audioDuration={code_flow_minimal_acting_agentSlide.audioDuration}
					moduleNumber={1}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={code_flow_minimal_acting_agentSlide.start + code_flow_minimal_acting_agentSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 1.2 in Practice */}
			<Sequence
				from={lab_1_2_in_practice_overviewSlide.start}
				durationInFrames={lab_1_2_in_practice_overviewSlide.duration}
			>
				<Audio src={audioFiles["lab-1-2-in-practice-overview"]} />
				<CrossFadeWrapper
					totalDuration={lab_1_2_in_practice_overviewSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Lab 1.2 in Practice"
					points={[
						"ToolRegistry and Tool with schema",
					"Agent with use_tools=True",
					"agent.act triggers tool calls"
					]}
					slideName="lab-1-2-in-practice-overview"
					audioDuration={lab_1_2_in_practice_overviewSlide.audioDuration}
					moduleNumber={1}
					
					
			/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_1_2_in_practice_overviewSlide.start + lab_1_2_in_practice_overviewSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 1.2 Actual Code */}
			<Sequence
				from={lab_1_2_actual_codeSlide.start}
				durationInFrames={lab_1_2_actual_codeSlide.duration}
			>
				<Audio src={audioFiles["lab-1-2-actual-code"]} />
				<CrossFadeWrapper
					totalDuration={lab_1_2_actual_codeSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedCodeSlide
					title="Lab 1.2 Actual Code"
					code={`registry = ToolRegistry()
registry.register(Tool(name="get_stock_price", description="...", parameters={...}, handler=get_stock_price))
agent = Agent(AgentConfig(use_tools=True), tools=registry)
response = await agent.act(messages)
for tool_call in response.tool_calls:
    result = await tool.handler(**tool_call.arguments)`}
					language="python"
					slideName="lab-1-2-actual-code"
					audioStartFrame={lab_1_2_actual_codeSlide.start}
					audioDuration={lab_1_2_actual_codeSlide.audioDuration}
					moduleNumber={1}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_1_2_actual_codeSlide.start + lab_1_2_actual_codeSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 1.2 Actual Flow */}
			<Sequence
				from={lab_1_2_actual_flowSlide.start}
				durationInFrames={lab_1_2_actual_flowSlide.duration}
			>
				<Audio src={audioFiles["lab-1-2-actual-flow"]} />
				<CrossFadeWrapper
					totalDuration={lab_1_2_actual_flowSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<BulletsAndCodeSlide
					title="Lab 1.2 Actual Flow"
					points={[
						"Register Tool with schema and handler",
						"Agent.act returns messages and tool_calls",
						"Execute each tool handler with arguments"
					]}
					code={`registry.register(Tool(...))
response = await agent.act(messages)
for tool_call in response.tool_calls:
    result = await tool.handler(**tool_call.arguments)`}
					language="python"
					codeContext="Lab 1.2: main() - ToolRegistry, Agent, tool execution"
					slideName="lab-1-2-actual-flow"
					audioDuration={lab_1_2_actual_flowSlide.audioDuration}
					moduleNumber={1}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_1_2_actual_flowSlide.start + lab_1_2_actual_flowSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Why These Labs Matter */}
			<Sequence
				from={why_start_simpleSlide.start}
				durationInFrames={why_start_simpleSlide.duration}
			>
				<Audio src={audioFiles["why-start-simple"]} />
				<CrossFadeWrapper
					totalDuration={why_start_simpleSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Why These Labs Matter"
					points={[
						"Avoid early bugs",
					"Grasp core agent concepts",
					"Build confidence moving forward"
					]}
					slideName="why-start-simple"
					audioDuration={why_start_simpleSlide.audioDuration}
					moduleNumber={1}
					
					
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={why_start_simpleSlide.start + why_start_simpleSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* The Big Takeaway */}
			<Sequence
				from={big_takeaway_agentic_ai_startSlide.start}
				durationInFrames={big_takeaway_agentic_ai_startSlide.duration}
			>
				<Audio src={audioFiles["big-takeaway-agentic-ai-start"]} />
				<CrossFadeWrapper
					totalDuration={big_takeaway_agentic_ai_startSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={0}
			>
					<AnimatedContentSlide
					title="The Big Takeaway"
					points={[
						"Test your environment first",
					"Build minimal acting agents",
					"Set up for success"
					]}
					slideName="big-takeaway-agentic-ai-start"
					audioDuration={big_takeaway_agentic_ai_startSlide.audioDuration}
					moduleNumber={1}
					
					
				/>
				</CrossFadeWrapper>
			</Sequence>

		</div>
	);
};
