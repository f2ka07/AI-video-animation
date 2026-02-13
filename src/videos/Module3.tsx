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

export const Module3: React.FC = () => {
	const { fps } = useVideoConfig();
	const crossFadeDuration = 0.3;
	const whooshDuration = 0.57;

	const audioFiles = {
		"hook-advanced-agent-skills": staticFile("audio/agentic-ai-labs-deep-dive/module3-hook-advanced-agent-skills.wav"),
		"lab-4-1-overview": staticFile("audio/agentic-ai-labs-deep-dive/module3-lab-4-1-overview.wav"),
		"lab-4-1-code": staticFile("audio/agentic-ai-labs-deep-dive/module3-lab-4-1-code.wav"),
		"code-flow-lab-4-1": staticFile("audio/agentic-ai-labs-deep-dive/module3-code-flow-lab-4-1.wav"),
		"lab-4-1-in-practice-overview": staticFile("audio/agentic-ai-labs-deep-dive/module3-lab-4-1-in-practice-overview.wav"),
		"lab-4-1-actual-code": staticFile("audio/agentic-ai-labs-deep-dive/module3-lab-4-1-actual-code.wav"),
		"lab-4-1-actual-flow": staticFile("audio/agentic-ai-labs-deep-dive/module3-lab-4-1-actual-flow.wav"),
		"lab-5-1-overview": staticFile("audio/agentic-ai-labs-deep-dive/module3-lab-5-1-overview.wav"),
		"lab-5-1-code": staticFile("audio/agentic-ai-labs-deep-dive/module3-lab-5-1-code.wav"),
		"code-flow-lab-5-1": staticFile("audio/agentic-ai-labs-deep-dive/module3-code-flow-lab-5-1.wav"),
		"lab-5-1-in-practice-overview": staticFile("audio/agentic-ai-labs-deep-dive/module3-lab-5-1-in-practice-overview.wav"),
		"lab-5-1-actual-code": staticFile("audio/agentic-ai-labs-deep-dive/module3-lab-5-1-actual-code.wav"),
		"lab-5-1-actual-flow": staticFile("audio/agentic-ai-labs-deep-dive/module3-lab-5-1-actual-flow.wav"),
		"lab-5-2-overview": staticFile("audio/agentic-ai-labs-deep-dive/module3-lab-5-2-overview.wav"),
		"lab-5-2-code": staticFile("audio/agentic-ai-labs-deep-dive/module3-lab-5-2-code.wav"),
		"code-flow-lab-5-2": staticFile("audio/agentic-ai-labs-deep-dive/module3-code-flow-lab-5-2.wav"),
		"lab-6-1-overview": staticFile("audio/agentic-ai-labs-deep-dive/module3-lab-6-1-overview.wav"),
		"lab-6-1-code": staticFile("audio/agentic-ai-labs-deep-dive/module3-lab-6-1-code.wav"),
		"code-flow-lab-6-1": staticFile("audio/agentic-ai-labs-deep-dive/module3-code-flow-lab-6-1.wav"),
		"lab-6-1-in-practice-overview": staticFile("audio/agentic-ai-labs-deep-dive/module3-lab-6-1-in-practice-overview.wav"),
		"lab-6-1-actual-code": staticFile("audio/agentic-ai-labs-deep-dive/module3-lab-6-1-actual-code.wav"),
		"lab-6-1-actual-flow": staticFile("audio/agentic-ai-labs-deep-dive/module3-lab-6-1-actual-flow.wav"),
		"advanced-skills-importance": staticFile("audio/agentic-ai-labs-deep-dive/module3-advanced-skills-importance.wav"),
		"conclusion-advanced-agent-skills": staticFile("audio/agentic-ai-labs-deep-dive/module3-conclusion-advanced-agent-skills.wav"),
		whoosh: staticFile("audio/whoosh.wav"),
	};

	const audioDurations = {
		"hook-advanced-agent-skills": getAudioDuration("agentic-ai-labs-deep-dive/module3-hook-advanced-agent-skills"),
		"lab-4-1-overview": getAudioDuration("agentic-ai-labs-deep-dive/module3-lab-4-1-overview"),
		"lab-4-1-code": getAudioDuration("agentic-ai-labs-deep-dive/module3-lab-4-1-code"),
		"code-flow-lab-4-1": getAudioDuration("agentic-ai-labs-deep-dive/module3-code-flow-lab-4-1"),
		"lab-4-1-in-practice-overview": getAudioDuration("agentic-ai-labs-deep-dive/module3-lab-4-1-in-practice-overview"),
		"lab-4-1-actual-code": getAudioDuration("agentic-ai-labs-deep-dive/module3-lab-4-1-actual-code"),
		"lab-4-1-actual-flow": getAudioDuration("agentic-ai-labs-deep-dive/module3-lab-4-1-actual-flow"),
		"lab-5-1-overview": getAudioDuration("agentic-ai-labs-deep-dive/module3-lab-5-1-overview"),
		"lab-5-1-code": getAudioDuration("agentic-ai-labs-deep-dive/module3-lab-5-1-code"),
		"code-flow-lab-5-1": getAudioDuration("agentic-ai-labs-deep-dive/module3-code-flow-lab-5-1"),
		"lab-5-1-in-practice-overview": getAudioDuration("agentic-ai-labs-deep-dive/module3-lab-5-1-in-practice-overview"),
		"lab-5-1-actual-code": getAudioDuration("agentic-ai-labs-deep-dive/module3-lab-5-1-actual-code"),
		"lab-5-1-actual-flow": getAudioDuration("agentic-ai-labs-deep-dive/module3-lab-5-1-actual-flow"),
		"lab-5-2-overview": getAudioDuration("agentic-ai-labs-deep-dive/module3-lab-5-2-overview"),
		"lab-5-2-code": getAudioDuration("agentic-ai-labs-deep-dive/module3-lab-5-2-code"),
		"code-flow-lab-5-2": getAudioDuration("agentic-ai-labs-deep-dive/module3-code-flow-lab-5-2"),
		"lab-6-1-overview": getAudioDuration("agentic-ai-labs-deep-dive/module3-lab-6-1-overview"),
		"lab-6-1-code": getAudioDuration("agentic-ai-labs-deep-dive/module3-lab-6-1-code"),
		"code-flow-lab-6-1": getAudioDuration("agentic-ai-labs-deep-dive/module3-code-flow-lab-6-1"),
		"lab-6-1-in-practice-overview": getAudioDuration("agentic-ai-labs-deep-dive/module3-lab-6-1-in-practice-overview"),
		"lab-6-1-actual-code": getAudioDuration("agentic-ai-labs-deep-dive/module3-lab-6-1-actual-code"),
		"lab-6-1-actual-flow": getAudioDuration("agentic-ai-labs-deep-dive/module3-lab-6-1-actual-flow"),
		"advanced-skills-importance": getAudioDuration("agentic-ai-labs-deep-dive/module3-advanced-skills-importance"),
		"conclusion-advanced-agent-skills": getAudioDuration("agentic-ai-labs-deep-dive/module3-conclusion-advanced-agent-skills"),
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

	const hook_advanced_agent_skillsSlide = addSlide(audioDurations["hook-advanced-agent-skills"], false, 0.3);
	const lab_4_1_overviewSlide = addSlide(audioDurations["lab-4-1-overview"], false, 0.3);
	const lab_4_1_codeSlide = addSlide(audioDurations["lab-4-1-code"], false, 0.3);
	const code_flow_lab_4_1Slide = addSlide(audioDurations["code-flow-lab-4-1"], false, 0.3);
	const lab_4_1_in_practice_overviewSlide = addSlide(audioDurations["lab-4-1-in-practice-overview"], false, 0.3);
	const lab_4_1_actual_codeSlide = addSlide(audioDurations["lab-4-1-actual-code"], false, 0.3);
	const lab_4_1_actual_flowSlide = addSlide(audioDurations["lab-4-1-actual-flow"], false, 0.3);
	const lab_5_1_overviewSlide = addSlide(audioDurations["lab-5-1-overview"], false, 0.3);
	const lab_5_1_codeSlide = addSlide(audioDurations["lab-5-1-code"], false, 0.3);
	const code_flow_lab_5_1Slide = addSlide(audioDurations["code-flow-lab-5-1"], false, 0.3);
	const lab_5_1_in_practice_overviewSlide = addSlide(audioDurations["lab-5-1-in-practice-overview"], false, 0.3);
	const lab_5_1_actual_codeSlide = addSlide(audioDurations["lab-5-1-actual-code"], false, 0.3);
	const lab_5_1_actual_flowSlide = addSlide(audioDurations["lab-5-1-actual-flow"], false, 0.3);
	const lab_5_2_overviewSlide = addSlide(audioDurations["lab-5-2-overview"], false, 0.3);
	const lab_5_2_codeSlide = addSlide(audioDurations["lab-5-2-code"], false, 0.3);
	const code_flow_lab_5_2Slide = addSlide(audioDurations["code-flow-lab-5-2"], false, 0.3);
	const lab_6_1_overviewSlide = addSlide(audioDurations["lab-6-1-overview"], false, 0.3);
	const lab_6_1_codeSlide = addSlide(audioDurations["lab-6-1-code"], false, 0.3);
	const code_flow_lab_6_1Slide = addSlide(audioDurations["code-flow-lab-6-1"], false, 0.3);
	const lab_6_1_in_practice_overviewSlide = addSlide(audioDurations["lab-6-1-in-practice-overview"], false, 0.3);
	const lab_6_1_actual_codeSlide = addSlide(audioDurations["lab-6-1-actual-code"], false, 0.3);
	const lab_6_1_actual_flowSlide = addSlide(audioDurations["lab-6-1-actual-flow"], false, 0.3);
	const advanced_skills_importanceSlide = addSlide(audioDurations["advanced-skills-importance"], false, 0.3);
	const conclusion_advanced_agent_skillsSlide = addSlide(audioDurations["conclusion-advanced-agent-skills"], true, 0.8);

	return (
		<div
			style={{
				width: "100%",
			height: "100%",
			background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
			position: "relative",
		}}
		>
			{/* Unlock Advanced Agent Skills */}
			<Sequence
				from={hook_advanced_agent_skillsSlide.start}
				durationInFrames={hook_advanced_agent_skillsSlide.duration}
			>
				<Audio src={audioFiles["hook-advanced-agent-skills"]} />
				<CrossFadeWrapper
					totalDuration={hook_advanced_agent_skillsSlide.slideDuration}
					fadeInDuration={0.5}
					fadeOutDuration={crossFadeDuration}
			>
					<TitleSlide 
					title="Mastering Advanced Agent Skills: Labs 4.1 to 6.1" 
					subtitle="State management, action policies, and environment interaction"
					
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={hook_advanced_agent_skillsSlide.start + hook_advanced_agent_skillsSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 4.1: Complex State Management */}
			<Sequence
				from={lab_4_1_overviewSlide.start}
				durationInFrames={lab_4_1_overviewSlide.duration}
			>
				<Audio src={audioFiles["lab-4-1-overview"]} />
				<CrossFadeWrapper
					totalDuration={lab_4_1_overviewSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Lab 4.1: Complex State Management"
					points={[
						"Nested state structures",
					"Timers and counters",
					"Track multi-step tasks"
					]}
					slideName="lab-4-1-overview"
					audioDuration={lab_4_1_overviewSlide.audioDuration}
					moduleNumber={3}
					
					
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_4_1_overviewSlide.start + lab_4_1_overviewSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* State Timer Code Snippet */}
			<Sequence
				from={lab_4_1_codeSlide.start}
				durationInFrames={lab_4_1_codeSlide.duration}
			>
				<Audio src={audioFiles["lab-4-1-code"]} />
				<CrossFadeWrapper
					totalDuration={lab_4_1_codeSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedCodeSlide
					title="State Timer Code Snippet"
					code={`if 'timer' not in state:
    state['timer'] = 5
else:
    state['timer'] -= 1`}
					language="python"
					slideName="lab-4-1-code"
					audioStartFrame={lab_4_1_codeSlide.start}
					audioDuration={lab_4_1_codeSlide.audioDuration}
					moduleNumber={3}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_4_1_codeSlide.start + lab_4_1_codeSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 4.1 Code Flow */}
			<Sequence
				from={code_flow_lab_4_1Slide.start}
				durationInFrames={code_flow_lab_4_1Slide.duration}
			>
				<Audio src={audioFiles["code-flow-lab-4-1"]} />
				<CrossFadeWrapper
					totalDuration={code_flow_lab_4_1Slide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<BulletsAndCodeSlide
					title="Lab 4.1 Code Flow"
					points={[
						"Lazy init: set timer if absent",
						"Else: decrement each step",
						"State persists across the loop"
					]}
					code={`if 'timer' not in state:
    state['timer'] = 5
else:
    state['timer'] -= 1`}
					language="python"
					codeContext="Lab 4.1: state timer - multi-step delay tracking"
					slideName="code-flow-lab-4-1"
					audioDuration={code_flow_lab_4_1Slide.audioDuration}
					moduleNumber={3}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={code_flow_lab_4_1Slide.start + code_flow_lab_4_1Slide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 4.1 in Practice */}
			<Sequence
				from={lab_4_1_in_practice_overviewSlide.start}
				durationInFrames={lab_4_1_in_practice_overviewSlide.duration}
			>
				<Audio src={audioFiles["lab-4-1-in-practice-overview"]} />
				<CrossFadeWrapper
					totalDuration={lab_4_1_in_practice_overviewSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Lab 4.1 in Practice"
					points={[
						"FastAPI app with /health endpoint",
					"/v1/agent/invoke for sync requests",
					"/v1/agent/stream for streaming responses"
					]}
					slideName="lab-4-1-in-practice-overview"
					audioDuration={lab_4_1_in_practice_overviewSlide.audioDuration}
					moduleNumber={3}
					
					
			/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_4_1_in_practice_overviewSlide.start + lab_4_1_in_practice_overviewSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 4.1 Actual Code */}
			<Sequence
				from={lab_4_1_actual_codeSlide.start}
				durationInFrames={lab_4_1_actual_codeSlide.duration}
			>
				<Audio src={audioFiles["lab-4-1-actual-code"]} />
				<CrossFadeWrapper
					totalDuration={lab_4_1_actual_codeSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedCodeSlide
					title="Lab 4.1 Actual Code"
					code={`@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/v1/agent/invoke")
async def invoke(request: AgentInvokeRequest):
    result = await pipeline.execute(request.query)
    return AgentInvokeResponse(response=result)`}
					language="python"
					slideName="lab-4-1-actual-code"
					audioStartFrame={lab_4_1_actual_codeSlide.start}
					audioDuration={lab_4_1_actual_codeSlide.audioDuration}
					moduleNumber={3}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_4_1_actual_codeSlide.start + lab_4_1_actual_codeSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 4.1 Actual Flow */}
			<Sequence
				from={lab_4_1_actual_flowSlide.start}
				durationInFrames={lab_4_1_actual_flowSlide.duration}
			>
				<Audio src={audioFiles["lab-4-1-actual-flow"]} />
				<CrossFadeWrapper
					totalDuration={lab_4_1_actual_flowSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<BulletsAndCodeSlide
					title="Lab 4.1 Actual Flow"
					points={[
						"FastAPI app with CORS",
						"/health for readiness checks",
						"/v1/agent/invoke and stream for agent requests"
					]}
					code={`app = FastAPI()
app.add_middleware(CORSMiddleware, ...)
@app.get("/health") ...
@app.post("/v1/agent/invoke") ...`}
					language="python"
					codeContext="Lab 4.1: FastAPI deployment - health and agent endpoints"
					slideName="lab-4-1-actual-flow"
					audioDuration={lab_4_1_actual_flowSlide.audioDuration}
					moduleNumber={3}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_4_1_actual_flowSlide.start + lab_4_1_actual_flowSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 5.1: Action Policies */}
			<Sequence
				from={lab_5_1_overviewSlide.start}
				durationInFrames={lab_5_1_overviewSlide.duration}
			>
				<Audio src={audioFiles["lab-5-1-overview"]} />
				<CrossFadeWrapper
					totalDuration={lab_5_1_overviewSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Lab 5.1: Action Policies"
					points={[
						"Define agent strategies",
					"Use state and observations",
					"Guide action selection"
					]}
					slideName="lab-5-1-overview"
					audioDuration={lab_5_1_overviewSlide.audioDuration}
					moduleNumber={3}
					
					
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_5_1_overviewSlide.start + lab_5_1_overviewSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Action Policy Code Example */}
			<Sequence
				from={lab_5_1_codeSlide.start}
				durationInFrames={lab_5_1_codeSlide.duration}
			>
				<Audio src={audioFiles["lab-5-1-code"]} />
				<CrossFadeWrapper
					totalDuration={lab_5_1_codeSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedCodeSlide
					title="Action Policy Code Example"
					code={`def policy(state, obs):
    if obs == 'clear_path':
        return 'move_forward'
    return 'turn_right'`}
					language="python"
					slideName="lab-5-1-code"
					audioStartFrame={lab_5_1_codeSlide.start}
					audioDuration={lab_5_1_codeSlide.audioDuration}
					moduleNumber={3}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_5_1_codeSlide.start + lab_5_1_codeSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 5.1 Code Flow */}
			<Sequence
				from={code_flow_lab_5_1Slide.start}
				durationInFrames={code_flow_lab_5_1Slide.duration}
			>
				<Audio src={audioFiles["code-flow-lab-5-1"]} />
				<CrossFadeWrapper
					totalDuration={code_flow_lab_5_1Slide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<BulletsAndCodeSlide
					title="Lab 5.1 Code Flow"
					points={[
						"Input: state and observation",
						"Branch on observation value",
						"Return single action per case"
					]}
					code={`def policy(state, obs):
    if obs == 'clear_path':
        return 'move_forward'
    return 'turn_right'`}
					language="python"
					codeContext="Lab 5.1: policy() - action selection strategy"
					slideName="code-flow-lab-5-1"
					audioDuration={code_flow_lab_5_1Slide.audioDuration}
					moduleNumber={3}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={code_flow_lab_5_1Slide.start + code_flow_lab_5_1Slide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 5.1 in Practice */}
			<Sequence
				from={lab_5_1_in_practice_overviewSlide.start}
				durationInFrames={lab_5_1_in_practice_overviewSlide.duration}
			>
				<Audio src={audioFiles["lab-5-1-in-practice-overview"]} />
				<CrossFadeWrapper
					totalDuration={lab_5_1_in_practice_overviewSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Lab 5.1 in Practice"
					points={[
						"LLMPlanner.create_plan(goal) returns Plan",
					"Plan has steps with id, description, tool_name, depends_on",
					"Execute steps respecting dependencies"
					]}
					slideName="lab-5-1-in-practice-overview"
					audioDuration={lab_5_1_in_practice_overviewSlide.audioDuration}
					moduleNumber={3}
					
					
			/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_5_1_in_practice_overviewSlide.start + lab_5_1_in_practice_overviewSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 5.1 Actual Code */}
			<Sequence
				from={lab_5_1_actual_codeSlide.start}
				durationInFrames={lab_5_1_actual_codeSlide.duration}
			>
				<Audio src={audioFiles["lab-5-1-actual-code"]} />
				<CrossFadeWrapper
					totalDuration={lab_5_1_actual_codeSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedCodeSlide
					title="Lab 5.1 Actual Code"
					code={`planner = LLMPlanner()
plan = await planner.create_plan(goal)
for step in plan.steps:
    if step.depends_on:
        for dep_id in step.depends_on:
            if dep_id not in results: continue
    result = await execute_plan_step(step, context)
    results[step.id] = result`}
					language="python"
					slideName="lab-5-1-actual-code"
					audioStartFrame={lab_5_1_actual_codeSlide.start}
					audioDuration={lab_5_1_actual_codeSlide.audioDuration}
					moduleNumber={3}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_5_1_actual_codeSlide.start + lab_5_1_actual_codeSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 5.1 Actual Flow */}
			<Sequence
				from={lab_5_1_actual_flowSlide.start}
				durationInFrames={lab_5_1_actual_flowSlide.duration}
			>
				<Audio src={audioFiles["lab-5-1-actual-flow"]} />
				<CrossFadeWrapper
					totalDuration={lab_5_1_actual_flowSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<BulletsAndCodeSlide
					title="Lab 5.1 Actual Flow"
					points={[
						"create_plan(goal) returns Plan with steps",
						"Check depends_on before executing each step",
						"Store results for dependent steps"
					]}
					code={`plan = await planner.create_plan(goal)
for step in plan.steps:
    result = await execute_plan_step(step, context)
    results[step.id] = result`}
					language="python"
					codeContext="Lab 5.1: LLMPlanner, Plan, execute_plan_step"
					slideName="lab-5-1-actual-flow"
					audioDuration={lab_5_1_actual_flowSlide.audioDuration}
					moduleNumber={3}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_5_1_actual_flowSlide.start + lab_5_1_actual_flowSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 5.2: Memory and State Persistence */}
			<Sequence
				from={lab_5_2_overviewSlide.start}
				durationInFrames={lab_5_2_overviewSlide.duration}
			>
				<Audio src={audioFiles["lab-5-2-overview"]} />
				<CrossFadeWrapper
					totalDuration={lab_5_2_overviewSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Lab 5.2: Memory and State Persistence"
					points={[
						"MemoryStore for tasks and memories",
					"create_task, add_memory, get_memories",
					"Refinement over iterations"
					]}
					slideName="lab-5-2-overview"
					audioDuration={lab_5_2_overviewSlide.audioDuration}
					moduleNumber={3}
					
					
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_5_2_overviewSlide.start + lab_5_2_overviewSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 5.2 Code */}
			<Sequence
				from={lab_5_2_codeSlide.start}
				durationInFrames={lab_5_2_codeSlide.duration}
			>
				<Audio src={audioFiles["lab-5-2-code"]} />
				<CrossFadeWrapper
					totalDuration={lab_5_2_codeSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedCodeSlide
					title="Lab 5.2 Code"
					code={`store = MemoryStore()
task_id = store.create_task(unique_task_id, goal)
store.add_memory(session_id, "Created plan for: ...", metadata={...})
refined_plan = await planner.refine_plan(goal, plan, feedback)
store.update_task(task_id, results={"refined_plan": refined_plan.model_dump()})`}
					language="python"
					slideName="lab-5-2-code"
					audioStartFrame={lab_5_2_codeSlide.start}
					audioDuration={lab_5_2_codeSlide.audioDuration}
					moduleNumber={3}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_5_2_codeSlide.start + lab_5_2_codeSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 5.2 Code Flow */}
			<Sequence
				from={code_flow_lab_5_2Slide.start}
				durationInFrames={code_flow_lab_5_2Slide.duration}
			>
				<Audio src={audioFiles["code-flow-lab-5-2"]} />
				<CrossFadeWrapper
					totalDuration={code_flow_lab_5_2Slide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<BulletsAndCodeSlide
					title="Lab 5.2 Code Flow"
					points={[
						"create_task stores goal and returns task_id",
						"add_memory logs events with metadata",
						"refine_plan and update_task for iteration"
					]}
					code={`task_id = store.create_task(unique_task_id, goal)
store.add_memory(session_id, content, metadata)
refined = await planner.refine_plan(goal, plan, feedback)
store.update_task(task_id, results={...})`}
					language="python"
					codeContext="Lab 5.2: MemoryStore, create_task, add_memory, refine_plan"
					slideName="code-flow-lab-5-2"
					audioDuration={code_flow_lab_5_2Slide.audioDuration}
					moduleNumber={3}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={code_flow_lab_5_2Slide.start + code_flow_lab_5_2Slide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 6.1: Environment Interaction */}
			<Sequence
				from={lab_6_1_overviewSlide.start}
				durationInFrames={lab_6_1_overviewSlide.duration}
			>
				<Audio src={audioFiles["lab-6-1-overview"]} />
				<CrossFadeWrapper
					totalDuration={lab_6_1_overviewSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Lab 6.1: Environment Interaction"
					points={[
						"Query environment state",
					"Adaptive actions",
					"Responsive agents"
					]}
					slideName="lab-6-1-overview"
					audioDuration={lab_6_1_overviewSlide.audioDuration}
					moduleNumber={3}
					
					
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_6_1_overviewSlide.start + lab_6_1_overviewSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Environment Query Code */}
			<Sequence
				from={lab_6_1_codeSlide.start}
				durationInFrames={lab_6_1_codeSlide.duration}
			>
				<Audio src={audioFiles["lab-6-1-code"]} />
				<CrossFadeWrapper
					totalDuration={lab_6_1_codeSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedCodeSlide
					title="Environment Query Code"
					code={`sensors = env.get_sensors()
if sensors['front'] == 'clear':
    action = 'move_forward'
else:
    action = 'turn_left'`}
					language="python"
					slideName="lab-6-1-code"
					audioStartFrame={lab_6_1_codeSlide.start}
					audioDuration={lab_6_1_codeSlide.audioDuration}
					moduleNumber={3}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_6_1_codeSlide.start + lab_6_1_codeSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 6.1 Code Flow */}
			<Sequence
				from={code_flow_lab_6_1Slide.start}
				durationInFrames={code_flow_lab_6_1Slide.duration}
			>
				<Audio src={audioFiles["code-flow-lab-6-1"]} />
				<CrossFadeWrapper
					totalDuration={code_flow_lab_6_1Slide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<BulletsAndCodeSlide
					title="Lab 6.1 Code Flow"
					points={[
						"Query sensors from environment",
						"Read relevant sensor—e.g. front",
						"Select action based on sensor value"
					]}
					code={`sensors = env.get_sensors()
if sensors['front'] == 'clear':
    action = 'move_forward'
else:
    action = 'turn_left'`}
					language="python"
					codeContext="Lab 6.1: sensor query - environment interaction"
					slideName="code-flow-lab-6-1"
					audioDuration={code_flow_lab_6_1Slide.audioDuration}
					moduleNumber={3}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={code_flow_lab_6_1Slide.start + code_flow_lab_6_1Slide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 6.1 in Practice */}
			<Sequence
				from={lab_6_1_in_practice_overviewSlide.start}
				durationInFrames={lab_6_1_in_practice_overviewSlide.duration}
			>
				<Audio src={audioFiles["lab-6-1-in-practice-overview"]} />
				<CrossFadeWrapper
					totalDuration={lab_6_1_in_practice_overviewSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Lab 6.1 in Practice"
					points={[
						"VectorStore: add_texts, search",
					"Retrieve top-k documents for query",
					"Augment prompt with context before run_chat"
					]}
					slideName="lab-6-1-in-practice-overview"
					audioDuration={lab_6_1_in_practice_overviewSlide.audioDuration}
					moduleNumber={3}
					
					
			/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_6_1_in_practice_overviewSlide.start + lab_6_1_in_practice_overviewSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 6.1 Actual Code */}
			<Sequence
				from={lab_6_1_actual_codeSlide.start}
				durationInFrames={lab_6_1_actual_codeSlide.duration}
			>
				<Audio src={audioFiles["lab-6-1-actual-code"]} />
				<CrossFadeWrapper
					totalDuration={lab_6_1_actual_codeSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedCodeSlide
					title="Lab 6.1 Actual Code"
					code={`vs = VectorStore(collection_name="rag_demo")
vs.add_texts(texts=documents, metadatas=[...], ids=[...])
results = vs.search(query, n_results=2)
context = "\n".join([r['text'] for r in results])
augmented_prompt = f"Context:\n{context}\n\nQuestion: {query}"
response = await run_chat("tool", [Message(role="user", content=augmented_prompt)])`}
					language="python"
					slideName="lab-6-1-actual-code"
					audioStartFrame={lab_6_1_actual_codeSlide.start}
					audioDuration={lab_6_1_actual_codeSlide.audioDuration}
					moduleNumber={3}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_6_1_actual_codeSlide.start + lab_6_1_actual_codeSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Lab 6.1 Actual Flow */}
			<Sequence
				from={lab_6_1_actual_flowSlide.start}
				durationInFrames={lab_6_1_actual_flowSlide.duration}
			>
				<Audio src={audioFiles["lab-6-1-actual-flow"]} />
				<CrossFadeWrapper
					totalDuration={lab_6_1_actual_flowSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<BulletsAndCodeSlide
					title="Lab 6.1 Actual Flow"
					points={[
						"add_texts indexes documents with embeddings",
						"search(query, n_results) retrieves similar",
						"Augment prompt, run_chat, cite sources"
					]}
					code={`vs.add_texts(texts=documents, ...)
results = vs.search(query, n_results=2)
augmented_prompt = f"Context:\n{context}\nQuestion: {query}"`}
					language="python"
					codeContext="Lab 6.1: VectorStore, add_texts, search, RAG prompt"
					slideName="lab-6-1-actual-flow"
					audioDuration={lab_6_1_actual_flowSlide.audioDuration}
					moduleNumber={3}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={lab_6_1_actual_flowSlide.start + lab_6_1_actual_flowSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Why These Skills Matter */}
			<Sequence
				from={advanced_skills_importanceSlide.start}
				durationInFrames={advanced_skills_importanceSlide.duration}
			>
				<Audio src={audioFiles["advanced-skills-importance"]} />
				<CrossFadeWrapper
					totalDuration={advanced_skills_importanceSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Why These Skills Matter"
					points={[
						"Handle complex tasks",
					"Make strategic decisions",
					"Adapt to changing environments"
					]}
					slideName="advanced-skills-importance"
					audioDuration={advanced_skills_importanceSlide.audioDuration}
					moduleNumber={3}
					
					
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={advanced_skills_importanceSlide.start + advanced_skills_importanceSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Where We Go From Here */}
			<Sequence
				from={conclusion_advanced_agent_skillsSlide.start}
				durationInFrames={conclusion_advanced_agent_skillsSlide.duration}
			>
				<Audio src={audioFiles["conclusion-advanced-agent-skills"]} />
				<CrossFadeWrapper
					totalDuration={conclusion_advanced_agent_skillsSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={0}
			>
					<AnimatedContentSlide
					title="Where We Go From Here"
					points={[
						"Manage complex states",
					"Use strategic policies",
					"Interact intelligently"
					]}
					slideName="conclusion-advanced-agent-skills"
					audioDuration={conclusion_advanced_agent_skillsSlide.audioDuration}
					moduleNumber={3}
					
					
				/>
				</CrossFadeWrapper>
			</Sequence>

		</div>
	);
};
