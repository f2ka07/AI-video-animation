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
		"module-5-title": staticFile("audio/agentic-ai-for-beginners/module5-module-5-title.wav"),
		"module-5-concept": staticFile("audio/agentic-ai-for-beginners/module5-module-5-concept.wav"),
		"module-5-architecture": staticFile("audio/agentic-ai-for-beginners/module5-module-5-architecture.wav"),
		"module-5-application": staticFile("audio/agentic-ai-for-beginners/module5-module-5-application.wav"),
		"module-5-exam-mapping": staticFile("audio/agentic-ai-for-beginners/module5-module-5-exam-mapping.wav"),
		"module-5-recap": staticFile("audio/agentic-ai-for-beginners/module5-module-5-recap.wav"),
		whoosh: staticFile("audio/whoosh.wav"),
	};

	const audioDurations = {
		"module-5-title": getAudioDuration("agentic-ai-for-beginners/module5-module-5-title"),
		"module-5-concept": getAudioDuration("agentic-ai-for-beginners/module5-module-5-concept"),
		"module-5-architecture": getAudioDuration("agentic-ai-for-beginners/module5-module-5-architecture"),
		"module-5-application": getAudioDuration("agentic-ai-for-beginners/module5-module-5-application"),
		"module-5-exam-mapping": getAudioDuration("agentic-ai-for-beginners/module5-module-5-exam-mapping"),
		"module-5-recap": getAudioDuration("agentic-ai-for-beginners/module5-module-5-recap"),
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

	const seg0 = addSegment(61.88, true, false, 1);
	const seg1 = addSegment(10.50, false, false, 1);
	const seg2 = addSegment(9.56, false, false, 1);
	const seg3 = addSegment(10.60, false, false, 1);
	const seg4 = addSegment(9.76, false, false, 1);
	const seg5 = addSegment(8.38, false, false, 1);
	const seg6 = addSegment(11.28, false, false, 1);
	const seg7 = addSegment(10.14, false, false, 1);
	const seg8 = addSegment(10.16, false, false, 1);
	const seg9 = addSegment(9.44, false, false, 1);
	const seg10 = addSegment(10.40, false, false, 1);
	const seg11 = addSegment(9.88, false, false, 1);
	const seg12 = addSegment(10.30, false, false, 1);
	const seg13 = addSegment(9.36, false, false, 1);
	const seg14 = addSegment(10.76, false, false, 1);
	const seg15 = addSegment(9.94, false, false, 1);
	const seg16 = addSegment(9.96, false, false, 1);
	const seg17 = addSegment(9.92, false, false, 1);
	const seg18 = addSegment(9.74, false, false, 1);
	const seg19 = addSegment(8.13, true, false, 1);
	const seg20 = addSegment(10.50, false, false, 1);
	const seg21 = addSegment(8.50, false, false, 1);
	const seg22 = addSegment(10.46, false, false, 1);
	const seg23 = addSegment(10.72, false, false, 1);
	const seg24 = addSegment(9.88, false, false, 1);
	const seg25 = addSegment(8.94, false, false, 1);
	const seg26 = addSegment(10.34, false, false, 1);
	const seg27 = addSegment(11.02, false, false, 1);
	const seg28 = addSegment(9.00, false, false, 1);
	const seg29 = addSegment(11.16, false, false, 1);
	const seg30 = addSegment(8.66, false, false, 1);
	const seg31 = addSegment(11.28, false, false, 1);
	const seg32 = addSegment(9.64, false, false, 1);
	const seg33 = addSegment(0.48, true, false, 1);
	const seg34 = addSegment(10.20, false, false, 1);
	const seg35 = addSegment(9.89, false, false, 1);
	const seg36 = addSegment(9.97, false, false, 1);
	const seg37 = addSegment(10.11, false, false, 1);
	const seg38 = addSegment(9.56, false, false, 1);
	const seg39 = addSegment(10.24, false, false, 1);
	const seg40 = addSegment(10.35, false, false, 1);
	const seg41 = addSegment(9.86, false, false, 1);
	const seg42 = addSegment(9.94, false, false, 1);
	const seg43 = addSegment(10.19, false, false, 1);
	const seg44 = addSegment(9.77, false, false, 1);
	const seg45 = addSegment(9.96, false, false, 1);
	const seg46 = addSegment(0.29, true, false, 1);
	const seg47 = addSegment(10.44, false, false, 1);
	const seg48 = addSegment(9.58, false, false, 1);
	const seg49 = addSegment(10.40, false, false, 1);
	const seg50 = addSegment(9.68, false, false, 1);
	const seg51 = addSegment(10.16, false, false, 1);
	const seg52 = addSegment(9.28, false, false, 1);
	const seg53 = addSegment(10.90, false, false, 1);
	const seg54 = addSegment(10.08, false, false, 1);
	const seg55 = addSegment(2.64, true, false, 1);
	const seg56 = addSegment(10.35, false, false, 1);
	const seg57 = addSegment(9.75, false, false, 1);
	const seg58 = addSegment(10.09, false, false, 1);
	const seg59 = addSegment(10.00, false, false, 1);
	const seg60 = addSegment(9.87, false, false, 1);
	const seg61 = addSegment(10.22, false, false, 1);
	const seg62 = addSegment(9.87, false, false, 1);
	const seg63 = addSegment(0.29, true, true, 1.2);

	return (
		<div
			style={{
				width: "100%",
			height: "100%",
			background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
			position: "relative",
		}}
		>
			{/* Deployment and Integration Models */}
			<Sequence
				from={seg0.start}
				durationInFrames={seg0.duration}
			>
				<Audio src={audioFiles["module-5-title"]} />
				<CrossFadeWrapper
					totalDuration={seg0.slideDuration}
					fadeInDuration={0.5}
					fadeOutDuration={crossFadeDuration}
			>
					<TitleSlide 
					title="Deployment and Integration Models" 
					subtitle="Deployment and Integration Models"
					
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
				<Audio src={audioFiles["module-5-concept"]} />
				<CrossFadeWrapper
					totalDuration={seg1.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"Let's start with deployment models",
					"A deployment model defines where your AI system runs",
					"who operates it and what infrastructure supports"
					]}
					slideName="module-5-concept"
					audioDuration={seg1.audioDuration}
					moduleNumber={5}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg2.start}
				durationInFrames={seg2.duration}
			>
				<Audio src={audioFiles["module-5-concept"]} startFrom={Math.round(10.50 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg2.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"There are four primary models",
					"each with distinct trade offs",
					"SaaS Vendor Hosted AI In this model"
					]}
					slideName="module-5-concept"
					audioDuration={seg2.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={10.50}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg3.start}
				durationInFrames={seg3.duration}
			>
				<Audio src={audioFiles["module-5-concept"]} startFrom={Math.round(20.06 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg3.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"AI through a third party service You call an API",
					"The vendor runs the infrastructure Examples include OpenAI's API"
					]}
					slideName="module-5-concept"
					audioDuration={seg3.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={20.06}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg4.start}
				durationInFrames={seg4.duration}
			>
				<Audio src={audioFiles["module-5-concept"]} startFrom={Math.round(30.66 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg4.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"Anthropx Cloud API and various cloud hosted services",
					"SaaS is the fastest path to production",
					"You don't manage GPUs"
					]}
					slideName="module-5-concept"
					audioDuration={seg4.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={30.66}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg5.start}
				durationInFrames={seg5.duration}
			>
				<Audio src={audioFiles["module-5-concept"]} startFrom={Math.round(40.42 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg5.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"you don't configure servers you just integrate and go",
					"But there are limitations You are subject to the vendor's rate limits"
					]}
					slideName="module-5-concept"
					audioDuration={seg5.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={40.42}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg6.start}
				durationInFrames={seg6.duration}
			>
				<Audio src={audioFiles["module-5-concept"]} startFrom={Math.round(48.80 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg6.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"Your data goes to their servers",
					"which raises compliance and privacy concerns and you have no control over the model's behavior beyond what"
					]}
					slideName="module-5-concept"
					audioDuration={seg6.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={48.80}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg7.start}
				durationInFrames={seg7.duration}
			>
				<Audio src={audioFiles["module-5-concept"]} startFrom={Math.round(60.08 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg7.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"API exposes Cloud GPU rental",
					"In this model you run your own inference infrastructure",
					"but on rented cloud GPUs",
					"Providers like"
					]}
					slideName="module-5-concept"
					audioDuration={seg7.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={60.08}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg8.start}
				durationInFrames={seg8.duration}
			>
				<Audio src={audioFiles["module-5-concept"]} startFrom={Math.round(70.22 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg8.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"AWS GCP and Azure offer GPU instances",
					"You deploy your models using tools like Triton and Nim You control the configuration"
					]}
					slideName="module-5-concept"
					audioDuration={seg8.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={70.22}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg9.start}
				durationInFrames={seg9.duration}
			>
				<Audio src={audioFiles["module-5-concept"]} startFrom={Math.round(80.38 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg9.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"but you don't own the hardware",
					"This model offers flexibility You can scale up and down based on demand"
					]}
					slideName="module-5-concept"
					audioDuration={seg9.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={80.38}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg10.start}
				durationInFrames={seg10.duration}
			>
				<Audio src={audioFiles["module-5-concept"]} startFrom={Math.round(89.82 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg10.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"You can run custom models with custom optimizations",
					"But you're still dependent on cloud availability",
					"and costs can escalate quickly at scale"
					]}
					slideName="module-5-concept"
					audioDuration={seg10.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={89.82}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg11.start}
				durationInFrames={seg11.duration}
			>
				<Audio src={audioFiles["module-5-concept"]} startFrom={Math.round(100.22 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg11.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"Enterprise on premises In this model you run AI on infrastructure you own The hardware sits"
					]}
					slideName="module-5-concept"
					audioDuration={seg11.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={100.22}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg12.start}
				durationInFrames={seg12.duration}
			>
				<Audio src={audioFiles["module-5-concept"]} startFrom={Math.round(110.10 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg12.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"The GPUs the network the software stack On premises",
					"sovereignty",
					"Some industries"
					]}
					slideName="module-5-concept"
					audioDuration={seg12.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={110.10}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg13.start}
				durationInFrames={seg13.duration}
			>
				<Audio src={audioFiles["module-5-concept"]} startFrom={Math.round(120.40 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg13.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"infrastructure"
					]}
					slideName="module-5-concept"
					audioDuration={seg13.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={120.40}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg14.start}
				durationInFrames={seg14.duration}
			>
				<Audio src={audioFiles["module-5-concept"]} startFrom={Math.round(129.76 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg14.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"On prem is the only option that fully satisfies those requirements The trade off is capital expenditure"
					]}
					slideName="module-5-concept"
					audioDuration={seg14.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={129.76}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg15.start}
				durationInFrames={seg15.duration}
			>
				<Audio src={audioFiles["module-5-concept"]} startFrom={Math.round(140.52 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg15.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"You need hardware you need a team to manage",
					"And upgrades require planning Hybrid and Edge Hybrid models"
					]}
					slideName="module-5-concept"
					audioDuration={seg15.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={140.52}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg16.start}
				durationInFrames={seg16.duration}
			>
				<Audio src={audioFiles["module-5-concept"]} startFrom={Math.round(150.46 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg16.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"combine cloud and on prem",
					"You might train in the cloud and deploy on prem",
					"Or run primary inference in the cloud with on-prem"
					]}
					slideName="module-5-concept"
					audioDuration={seg16.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={150.46}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg17.start}
				durationInFrames={seg17.duration}
			>
				<Audio src={audioFiles["module-5-concept"]} startFrom={Math.round(160.42 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg17.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"Edge deployment pushes inference to devices at the network edge",
					"Robots vehicles industrial equipment"
					]}
					slideName="module-5-concept"
					audioDuration={seg17.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={160.42}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg18.start}
				durationInFrames={seg18.duration}
			>
				<Audio src={audioFiles["module-5-concept"]} startFrom={Math.round(170.34 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg18.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"This minimizes latency and enables autonomous operation when connectivity is limited",
					"Each deployment model is a"
					]}
					slideName="module-5-concept"
					audioDuration={seg18.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={170.34}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Concept */}
			<Sequence
				from={seg19.start}
				durationInFrames={seg19.duration}
			>
				<Audio src={audioFiles["module-5-concept"]} startFrom={Math.round(180.08 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg19.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Concept"
					points={[
						"There's no universal answer The right choice depends on your cons..."
					]}
					slideName="module-5-concept"
					audioDuration={seg19.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={180.08}
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

			{/* Architecture */}
			<Sequence
				from={seg20.start}
				durationInFrames={seg20.duration}
			>
				<Audio src={audioFiles["module-5-architecture"]} />
				<CrossFadeWrapper
					totalDuration={seg20.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Deployment is only half the challenge",
					"The other half is integration",
					"An agentic system that can't connect to enterprise data"
					]}
					slideName="module-5-architecture"
					audioDuration={seg20.audioDuration}
					moduleNumber={5}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg21.start}
				durationInFrames={seg21.duration}
			>
				<Audio src={audioFiles["module-5-architecture"]} startFrom={Math.round(10.50 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg21.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Integration surfaces are the interfaces that make that connection possible"
					]}
					slideName="module-5-architecture"
					audioDuration={seg21.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={10.50}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg22.start}
				durationInFrames={seg22.duration}
			>
				<Audio src={audioFiles["module-5-architecture"]} startFrom={Math.round(19.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg22.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"API integrations The most common integration surface is the API",
					"Your agent calls external APIs to retrieve data"
					]}
					slideName="module-5-architecture"
					audioDuration={seg22.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={19.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg23.start}
				durationInFrames={seg23.duration}
			>
				<Audio src={audioFiles["module-5-architecture"]} startFrom={Math.round(29.46 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg23.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"This includes both internal APIs like your CRM or ERP"
					]}
					slideName="module-5-architecture"
					audioDuration={seg23.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={29.46}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg24.start}
				durationInFrames={seg24.duration}
			>
				<Audio src={audioFiles["module-5-architecture"]} startFrom={Math.round(40.18 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg24.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"API integration requires authentication",
					"versioning"
					]}
					slideName="module-5-architecture"
					audioDuration={seg24.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={40.18}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg25.start}
				durationInFrames={seg25.duration}
			>
				<Audio src={audioFiles["module-5-architecture"]} startFrom={Math.round(50.06 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg25.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"It's not just about making calls",
					"It's about making calls reliably",
					"Tool interfaces For agentic systems"
					]}
					slideName="module-5-architecture"
					audioDuration={seg25.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={50.06}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg26.start}
				durationInFrames={seg26.duration}
			>
				<Audio src={audioFiles["module-5-architecture"]} startFrom={Math.round(59.00 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg26.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"integration",
					"A tool is a function the agent can invoke",
					"SQL query execute code"
					]}
					slideName="module-5-architecture"
					audioDuration={seg26.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={59.00}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg27.start}
				durationInFrames={seg27.duration}
			>
				<Audio src={audioFiles["module-5-architecture"]} startFrom={Math.round(69.34 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg27.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"search a knowledge base send an email",
					"Tool interfaces define what the agent can do",
					"They are the bridge between language model reasoning and real world action"
					]}
					slideName="module-5-architecture"
					audioDuration={seg27.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={69.34}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg28.start}
				durationInFrames={seg28.duration}
			>
				<Audio src={audioFiles["module-5-architecture"]} startFrom={Math.round(80.36 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg28.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Data connectors Agents often need access to structured data",
					"Databases data warehouses"
					]}
					slideName="module-5-architecture"
					audioDuration={seg28.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={80.36}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg29.start}
				durationInFrames={seg29.duration}
			>
				<Audio src={audioFiles["module-5-architecture"]} startFrom={Math.round(89.36 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg29.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Data connectors provide that access They handle authentication",
					"formatting"
					]}
					slideName="module-5-architecture"
					audioDuration={seg29.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={89.36}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg30.start}
				durationInFrames={seg30.duration}
			>
				<Audio src={audioFiles["module-5-architecture"]} startFrom={Math.round(100.52 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg30.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"For retrieval augmented generation vector database connectors are essential",
					"Policy gateways"
					]}
					slideName="module-5-architecture"
					audioDuration={seg30.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={100.52}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg31.start}
				durationInFrames={seg31.duration}
			>
				<Audio src={audioFiles["module-5-architecture"]} startFrom={Math.round(109.18 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg31.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"In enterprise environments not all actions are permitted",
					"Policy gateways enforce rules about what the agent can access and what actions require approval",
					"They integrate with identity"
					]}
					slideName="module-5-architecture"
					audioDuration={seg31.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={109.18}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg32.start}
				durationInFrames={seg32.duration}
			>
				<Audio src={audioFiles["module-5-architecture"]} startFrom={Math.round(120.46 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg32.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"identity systems compliance engines and audit logs",
					"Policy isn't separate from integration",
					"It's part of"
					]}
					slideName="module-5-architecture"
					audioDuration={seg32.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={120.46}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Architecture */}
			<Sequence
				from={seg33.start}
				durationInFrames={seg33.duration}
			>
				<Audio src={audioFiles["module-5-architecture"]} startFrom={Math.round(130.10 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg33.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Architecture"
					points={[
						"Policy isn't separate from integration",
					"It's part of"
					]}
					slideName="module-5-architecture"
					audioDuration={seg33.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={130.10}
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg33.start + seg33.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg34.start}
				durationInFrames={seg34.duration}
			>
				<Audio src={audioFiles["module-5-application"]} />
				<CrossFadeWrapper
					totalDuration={seg34.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"Let's connect deployment and integration to business drivers SaaS for Velocity",
					"Startups and innovation teams choose SaaS because"
					]}
					slideName="module-5-application"
					audioDuration={seg34.audioDuration}
					moduleNumber={5}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg35.start}
				durationInFrames={seg35.duration}
			>
				<Audio src={audioFiles["module-5-application"]} startFrom={Math.round(10.20 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg35.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"You can have a working prototype in days The tradeoff is that you're locked into the",
					"the vendor's capabilities and pricing For early"
					]}
					slideName="module-5-application"
					audioDuration={seg35.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={10.20}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg36.start}
				durationInFrames={seg36.duration}
			>
				<Audio src={audioFiles["module-5-application"]} startFrom={Math.round(20.09 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg36.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"For production scale it may not be Cloud for Flexibility Teams that need custom"
					]}
					slideName="module-5-application"
					audioDuration={seg36.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={20.09}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg37.start}
				durationInFrames={seg37.duration}
			>
				<Audio src={audioFiles["module-5-application"]} startFrom={Math.round(30.06 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg37.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"GPU rental You get the control of self hosting without the capital expense of owned hardware"
					]}
					slideName="module-5-application"
					audioDuration={seg37.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={30.06}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg38.start}
				durationInFrames={seg38.duration}
			>
				<Audio src={audioFiles["module-5-application"]} startFrom={Math.round(40.17 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg38.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"You scale up for peaks and down for troughs On Prem for Compliance and Sovereignty Regulated"
					]}
					slideName="module-5-application"
					audioDuration={seg38.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={40.17}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg39.start}
				durationInFrames={seg39.duration}
			>
				<Audio src={audioFiles["module-5-application"]} startFrom={Math.round(49.73 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg39.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"The driver isn't cost It's control When you can't"
					]}
					slideName="module-5-application"
					audioDuration={seg39.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={49.73}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg40.start}
				durationInFrames={seg40.duration}
			>
				<Audio src={audioFiles["module-5-application"]} startFrom={Math.round(59.97 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg40.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"Edge for Latency and Autonomy",
					"Industrial applications autonomous systems"
					]}
					slideName="module-5-application"
					audioDuration={seg40.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={59.97}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg41.start}
				durationInFrames={seg41.duration}
			>
				<Audio src={audioFiles["module-5-application"]} startFrom={Math.round(70.32 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg41.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"When network latency is unacceptable or connectivity is unreliable you run"
					]}
					slideName="module-5-application"
					audioDuration={seg41.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={70.32}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg42.start}
				durationInFrames={seg42.duration}
			>
				<Audio src={audioFiles["module-5-application"]} startFrom={Math.round(80.18 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg42.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"Enterprise Blockers Deployment decisions aren't just technical They're organizational Common blocke..."
					]}
					slideName="module-5-application"
					audioDuration={seg42.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={80.18}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg43.start}
				durationInFrames={seg43.duration}
			>
				<Audio src={audioFiles["module-5-application"]} startFrom={Math.round(90.12 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg43.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"Compliance requirements that limit cloud options Safety alignme..."
					]}
					slideName="module-5-application"
					audioDuration={seg43.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={90.12}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg44.start}
				durationInFrames={seg44.duration}
			>
				<Audio src={audioFiles["module-5-application"]} startFrom={Math.round(100.31 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg44.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"SaaS And integration debt",
					"the accumulated complexity of connecting to legacy systems de facto"
					]}
					slideName="module-5-application"
					audioDuration={seg44.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={100.31}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg45.start}
				durationInFrames={seg45.duration}
			>
				<Audio src={audioFiles["module-5-application"]} startFrom={Math.round(110.08 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg45.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"For engineers deployment is about infrastructure",
					"For technical leaders it's about risk cost and organizational readiness"
					]}
					slideName="module-5-application"
					audioDuration={seg45.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={110.08}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Application */}
			<Sequence
				from={seg46.start}
				durationInFrames={seg46.duration}
			>
				<Audio src={audioFiles["module-5-application"]} startFrom={Math.round(120.04 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg46.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Application"
					points={[
						"For technical leaders it's about risk cost and organizational readiness"
					]}
					slideName="module-5-application"
					audioDuration={seg46.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={120.04}
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg46.start + seg46.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg47.start}
				durationInFrames={seg47.duration}
			>
				<Audio src={audioFiles["module-5-exam-mapping"]} />
				<CrossFadeWrapper
					totalDuration={seg47.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"Expect questions that ask"
					]}
					slideName="module-5-exam-mapping"
					audioDuration={seg47.audioDuration}
					moduleNumber={5}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg48.start}
				durationInFrames={seg48.duration}
			>
				<Audio src={audioFiles["module-5-exam-mapping"]} startFrom={Math.round(10.44 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg48.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"If it describes rapid iteration the answer is likely"
					]}
					slideName="module-5-exam-mapping"
					audioDuration={seg48.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={10.44}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg49.start}
				durationInFrames={seg49.duration}
			>
				<Audio src={audioFiles["module-5-exam-mapping"]} startFrom={Math.round(20.02 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg49.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"SaaS Understand The Tradeoffs cloud offers flexibility but ongoing cost On prem offers control but requires capital SaaS"
					]}
					slideName="module-5-exam-mapping"
					audioDuration={seg49.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={20.02}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg50.start}
				durationInFrames={seg50.duration}
			>
				<Audio src={audioFiles["module-5-exam-mapping"]} startFrom={Math.round(30.42 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg50.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"Edge offers low latency but constrained resources Know the integration surfaces"
					]}
					slideName="module-5-exam-mapping"
					audioDuration={seg50.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={30.42}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg51.start}
				durationInFrames={seg51.duration}
			>
				<Audio src={audioFiles["module-5-exam-mapping"]} startFrom={Math.round(40.10 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg51.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"APIs tools data connectors and policy gateways are all testable You should be able to describe what each"
					]}
					slideName="module-5-exam-mapping"
					audioDuration={seg51.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={40.10}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg52.start}
				durationInFrames={seg52.duration}
			>
				<Audio src={audioFiles["module-5-exam-mapping"]} startFrom={Math.round(50.26 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg52.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"Pay attention to operational concerns The exam may ask about SLAs",
					"monitoring"
					]}
					slideName="module-5-exam-mapping"
					audioDuration={seg52.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={50.26}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg53.start}
				durationInFrames={seg53.duration}
			>
				<Audio src={audioFiles["module-5-exam-mapping"]} startFrom={Math.round(59.54 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg53.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"Deployment isn't just about getting the system running It's about keeping it running ...",
					"understand"
					]}
					slideName="module-5-exam-mapping"
					audioDuration={seg53.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={59.54}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg54.start}
				durationInFrames={seg54.duration}
			>
				<Audio src={audioFiles["module-5-exam-mapping"]} startFrom={Math.round(70.44 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg54.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"Agents need tools Tools require integration Without robust i..."
					]}
					slideName="module-5-exam-mapping"
					audioDuration={seg54.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={70.44}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Exam Mapping */}
			<Sequence
				from={seg55.start}
				durationInFrames={seg55.duration}
			>
				<Audio src={audioFiles["module-5-exam-mapping"]} startFrom={Math.round(80.52 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg55.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Exam Mapping"
					points={[
						"agents can't act"
					]}
					slideName="module-5-exam-mapping"
					audioDuration={seg55.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={80.52}
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg55.start + seg55.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg56.start}
				durationInFrames={seg56.duration}
			>
				<Audio src={audioFiles["module-5-recap"]} />
				<CrossFadeWrapper
					totalDuration={seg56.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"Let's lock in the key points",
					"Deployment models define where your AI runs",
					"SaaS is fastest but least controlled",
					"Cloud offers flexibility agentic"
					]}
					slideName="module-5-recap"
					audioDuration={seg56.audioDuration}
					moduleNumber={5}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg57.start}
				durationInFrames={seg57.duration}
			>
				<Audio src={audioFiles["module-5-recap"]} startFrom={Math.round(10.35 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg57.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"On prem offers control and compliance",
					"Edge offers low latency for autonomous systems Choose based"
					]}
					slideName="module-5-recap"
					audioDuration={seg57.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={10.35}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg58.start}
				durationInFrames={seg58.duration}
			>
				<Audio src={audioFiles["module-5-recap"]} startFrom={Math.round(20.10 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg58.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"Integration surfaces are how agentic systems connect to the enterprise APIs",
					"Tools for agent actions"
					]}
					slideName="module-5-recap"
					audioDuration={seg58.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={20.10}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg59.start}
				durationInFrames={seg59.duration}
			>
				<Audio src={audioFiles["module-5-recap"]} startFrom={Math.round(30.19 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg59.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"Data connectors for retrieval Policy gateways for governance Business drivers shape deployment choices Velocity pushes"
					]}
					slideName="module-5-recap"
					audioDuration={seg59.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={30.19}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg60.start}
				durationInFrames={seg60.duration}
			>
				<Audio src={audioFiles["module-5-recap"]} startFrom={Math.round(40.19 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg60.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"SaaS Flexibility pushes toward cloud Compliance pushes toward on prem Latency pushes toward edge Deployment is..."
					]}
					slideName="module-5-recap"
					audioDuration={seg60.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={40.19}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg61.start}
				durationInFrames={seg61.duration}
			>
				<Audio src={audioFiles["module-5-recap"]} startFrom={Math.round(50.06 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg61.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"It's where models become systems And for AI it's where the loop connects to the world"
					]}
					slideName="module-5-recap"
					audioDuration={seg61.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={50.06}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg62.start}
				durationInFrames={seg62.duration}
			>
				<Audio src={audioFiles["module-5-recap"]} startFrom={Math.round(60.28 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg62.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"This is the bridge from architecture",
					"You've now crossed"
					]}
					slideName="module-5-recap"
					audioDuration={seg62.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={60.28}
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Recap */}
			<Sequence
				from={seg63.start}
				durationInFrames={seg63.duration}
			>
				<Audio src={audioFiles["module-5-recap"]} startFrom={Math.round(70.15 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg63.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={0}
			>
					<AnimatedContentSlide
					title="Recap"
					points={[
						"You've now crossed"
					]}
					slideName="module-5-recap"
					audioDuration={seg63.audioDuration}
					moduleNumber={5}
					
					
					audioStartOffset={70.15}
		/>
				</CrossFadeWrapper>
			</Sequence>

		</div>
	);
};
