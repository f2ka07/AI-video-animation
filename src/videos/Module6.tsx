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

// Auto-generated from moduleContent.ts - DO NOT EDIT MANUALLY

export const Module6: React.FC = () => {
	const { fps } = useVideoConfig();
	const crossFadeDuration = 0.3;
	const whooshDuration = 0.57;

	const audioFiles = {
		"the-importance-of-ai-security": staticFile("audio/ai-security-crash-course-2026/module6-the-importance-of-ai-security.wav"),
		"key-takeaways-from-course": staticFile("audio/ai-security-crash-course-2026/module6-key-takeaways-from-course.wav"),
		"future-of-ai-security": staticFile("audio/ai-security-crash-course-2026/module6-future-of-ai-security.wav"),
		"building-a-secure-ai-culture": staticFile("audio/ai-security-crash-course-2026/module6-building-a-secure-ai-culture.wav"),
		"securing-the-future": staticFile("audio/ai-security-crash-course-2026/module6-securing-the-future.wav"),
		whoosh: staticFile("audio/whoosh.wav"),
	};

	const audioDurations = {
		"the-importance-of-ai-security": 15,
		"key-takeaways-from-course": 15,
		"future-of-ai-security": 15,
		"building-a-secure-ai-culture": 15,
		"securing-the-future": 15,
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

	const the_importance_of_ai_securitySlide = addSlide(audioDurations["the-importance-of-ai-security"], false, 1.0);
	const key_takeaways_from_courseSlide = addSlide(audioDurations["key-takeaways-from-course"], false, 1.0);
	const future_of_ai_securitySlide = addSlide(audioDurations["future-of-ai-security"], false, 1.0);
	const building_a_secure_ai_cultureSlide = addSlide(audioDurations["building-a-secure-ai-culture"], false, 1.0);
	const securing_the_futureSlide = addSlide(audioDurations["securing-the-future"], true, 1.2);

	return (
		<div
			style={{
				width: "100%",
			height: "100%",
			background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
			position: "relative",
		}}
		>
			{/* The Importance of AI Security */}
			<Sequence
				from={the_importance_of_ai_securitySlide.start}
				durationInFrames={the_importance_of_ai_securitySlide.duration}
			>
				<Audio src={audioFiles["the-importance-of-ai-security"]} />
				<CrossFadeWrapper
					totalDuration={the_importance_of_ai_securitySlide.slideDuration}
					fadeInDuration={0.5}
					fadeOutDuration={crossFadeDuration}
			>
					<TitleSlide 
					title="Conclusion: Securing the Future" 
					subtitle="Ensuring AI Systems Remain Safe and Trustworthy"
					
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={the_importance_of_ai_securitySlide.start + the_importance_of_ai_securitySlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Key Takeaways from Course */}
			<Sequence
				from={key_takeaways_from_courseSlide.start}
				durationInFrames={key_takeaways_from_courseSlide.duration}
			>
				<Audio src={audioFiles["key-takeaways-from-course"]} />
				<CrossFadeWrapper
					totalDuration={key_takeaways_from_courseSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Key Takeaways from Course"
					points={[
						"explored threats",
					"implementing security measures",
					"protecting AI systems"
					]}
					slideName="key-takeaways-from-course"
					audioDuration={key_takeaways_from_courseSlide.audioDuration}
					moduleNumber={6}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={key_takeaways_from_courseSlide.start + key_takeaways_from_courseSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Future of AI Security */}
			<Sequence
				from={future_of_ai_securitySlide.start}
				durationInFrames={future_of_ai_securitySlide.duration}
			>
				<Audio src={audioFiles["future-of-ai-security"]} />
				<CrossFadeWrapper
					totalDuration={future_of_ai_securitySlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Future of AI Security"
					points={[
						"continuous innovation",
					"adaptation",
					"culture of security"
					]}
					slideName="future-of-ai-security"
					audioDuration={future_of_ai_securitySlide.audioDuration}
					moduleNumber={6}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={future_of_ai_securitySlide.start + future_of_ai_securitySlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Building a Secure AI Culture */}
			<Sequence
				from={building_a_secure_ai_cultureSlide.start}
				durationInFrames={building_a_secure_ai_cultureSlide.duration}
			>
				<Audio src={audioFiles["building-a-secure-ai-culture"]} />
				<CrossFadeWrapper
					totalDuration={building_a_secure_ai_cultureSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Building a Secure AI Culture"
					points={[
						"collaboration",
					"developers, policymakers, and users",
					"protect AI systems"
					]}
					slideName="building-a-secure-ai-culture"
					audioDuration={building_a_secure_ai_cultureSlide.audioDuration}
					moduleNumber={6}
					
					
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={building_a_secure_ai_cultureSlide.start + building_a_secure_ai_cultureSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Securing the Future */}
			<Sequence
				from={securing_the_futureSlide.start}
				durationInFrames={securing_the_futureSlide.duration}
			>
				<Audio src={audioFiles["securing-the-future"]} />
				<CrossFadeWrapper
					totalDuration={securing_the_futureSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={0}
			>
					<TitleSlide 
					title="Conclusion: Securing the Future" 
					subtitle="Ensuring AI Systems Remain Safe and Trustworthy"
					
				/>
				</CrossFadeWrapper>
			</Sequence>

		</div>
	);
};
