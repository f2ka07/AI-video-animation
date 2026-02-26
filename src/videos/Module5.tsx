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

export const Module5: React.FC = () => {
	const { fps } = useVideoConfig();
	const crossFadeDuration = 0.3;
	const whooshDuration = 0.57;

	const audioFiles = {
		"importance-of-ai-security-measures": staticFile("audio/ai-security-crash-course-2026/module5-importance-of-ai-security-measures.wav"),
		"layered-security-approach": staticFile("audio/ai-security-crash-course-2026/module5-layered-security-approach.wav"),
		"example-layered-security": staticFile("audio/ai-security-crash-course-2026/module5-example-layered-security.wav"),
		"encryption-techniques": staticFile("audio/ai-security-crash-course-2026/module5-encryption-techniques.wav"),
		"access-control-mechanisms": staticFile("audio/ai-security-crash-course-2026/module5-access-control-mechanisms.wav"),
		"monitoring-and-logging": staticFile("audio/ai-security-crash-course-2026/module5-monitoring-and-logging.wav"),
		"real-world-implementation": staticFile("audio/ai-security-crash-course-2026/module5-real-world-implementation.wav"),
		"the-road-to-secure-ai": staticFile("audio/ai-security-crash-course-2026/module5-the-road-to-secure-ai.wav"),
		whoosh: staticFile("audio/whoosh.wav"),
	};

	const audioDurations = {
		"importance-of-ai-security-measures": 15,
		"layered-security-approach": 15,
		"example-layered-security": 15,
		"encryption-techniques": 15,
		"access-control-mechanisms": 15,
		"monitoring-and-logging": 15,
		"real-world-implementation": 15,
		"the-road-to-secure-ai": 15,
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

	const importance_of_ai_security_measuresSlide = addSlide(audioDurations["importance-of-ai-security-measures"], false, 1.0);
	const layered_security_approachSlide = addSlide(audioDurations["layered-security-approach"], false, 1.0);
	const example_layered_securitySlide = addSlide(audioDurations["example-layered-security"], false, 1.0);
	const encryption_techniquesSlide = addSlide(audioDurations["encryption-techniques"], false, 1.0);
	const access_control_mechanismsSlide = addSlide(audioDurations["access-control-mechanisms"], false, 1.0);
	const monitoring_and_loggingSlide = addSlide(audioDurations["monitoring-and-logging"], false, 1.0);
	const real_world_implementationSlide = addSlide(audioDurations["real-world-implementation"], false, 1.0);
	const the_road_to_secure_aiSlide = addSlide(audioDurations["the-road-to-secure-ai"], true, 1.2);

	return (
		<div
			style={{
				width: "100%",
			height: "100%",
			background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
			position: "relative",
		}}
		>
			{/* Importance of AI Security Measures */}
			<Sequence
				from={importance_of_ai_security_measuresSlide.start}
				durationInFrames={importance_of_ai_security_measuresSlide.duration}
			>
				<Audio src={audioFiles["importance-of-ai-security-measures"]} />
				<CrossFadeWrapper
					totalDuration={importance_of_ai_security_measuresSlide.slideDuration}
					fadeInDuration={0.5}
					fadeOutDuration={crossFadeDuration}
			>
					<TitleSlide 
					title="Implementing AI Security Measures" 
					subtitle="Practical Techniques for Securing AI Systems"
					
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={importance_of_ai_security_measuresSlide.start + importance_of_ai_security_measuresSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Layered Security Approach */}
			<Sequence
				from={layered_security_approachSlide.start}
				durationInFrames={layered_security_approachSlide.duration}
			>
				<Audio src={audioFiles["layered-security-approach"]} />
				<CrossFadeWrapper
					totalDuration={layered_security_approachSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Layered Security Approach"
					points={[
						"multiple defenses",
					"protect AI systems",
					"fortress analogy"
					]}
					slideName="layered-security-approach"
					audioDuration={layered_security_approachSlide.audioDuration}
					moduleNumber={5}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={layered_security_approachSlide.start + layered_security_approachSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Example: Layered Security */}
			<Sequence
				from={example_layered_securitySlide.start}
				durationInFrames={example_layered_securitySlide.duration}
			>
				<Audio src={audioFiles["example-layered-security"]} />
				<CrossFadeWrapper
					totalDuration={example_layered_securitySlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedCodeSlide
					title="Example: Layered Security"
					code={`def layered_security(user, password, data):
    if authenticate(user, password):
        encrypted_data = encrypt_data(data)
        log_access(user)
        return encrypted_data
    else:
        return 'Access denied'
# Layered security example`}
					language="python"
					slideName="example-layered-security"
					audioStartFrame={example_layered_securitySlide.start}
					audioDuration={example_layered_securitySlide.audioDuration}
					moduleNumber={5}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={example_layered_securitySlide.start + example_layered_securitySlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Encryption Techniques */}
			<Sequence
				from={encryption_techniquesSlide.start}
				durationInFrames={encryption_techniquesSlide.duration}
			>
				<Audio src={audioFiles["encryption-techniques"]} />
				<CrossFadeWrapper
					totalDuration={encryption_techniquesSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<BulletsAndCodeSlide
					title="Encryption Techniques"
					points={[
						"protecting data",
						"symmetric and asymmetric",
						"strong security"
					]}
					code={`from cryptography.fernet import Fernet
key = Fernet.generate_key()
cipher_suite = Fernet(key)
plain_text = b'Sensitive data'
cipher_text = cipher_suite.encrypt(plain_text)
# Symmetric encryption example`}
					language="python"
					codeContext=""
					slideName="encryption-techniques"
					audioDuration={encryption_techniquesSlide.audioDuration}
					moduleNumber={5}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={encryption_techniquesSlide.start + encryption_techniquesSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Access Control Mechanisms */}
			<Sequence
				from={access_control_mechanismsSlide.start}
				durationInFrames={access_control_mechanismsSlide.duration}
			>
				<Audio src={audioFiles["access-control-mechanisms"]} />
				<CrossFadeWrapper
					totalDuration={access_control_mechanismsSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Access Control Mechanisms"
					points={[
						"restrict access",
					"role-based access",
					"multi-factor authentication"
					]}
					slideName="access-control-mechanisms"
					audioDuration={access_control_mechanismsSlide.audioDuration}
					moduleNumber={5}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={access_control_mechanismsSlide.start + access_control_mechanismsSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Monitoring and Logging */}
			<Sequence
				from={monitoring_and_loggingSlide.start}
				durationInFrames={monitoring_and_loggingSlide.duration}
			>
				<Audio src={audioFiles["monitoring-and-logging"]} />
				<CrossFadeWrapper
					totalDuration={monitoring_and_loggingSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Monitoring and Logging"
					points={[
						"detecting incidents",
					"tracking activities",
					"identify suspicious behavior"
					]}
					slideName="monitoring-and-logging"
					audioDuration={monitoring_and_loggingSlide.audioDuration}
					moduleNumber={5}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={monitoring_and_loggingSlide.start + monitoring_and_loggingSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Real-World Implementation */}
			<Sequence
				from={real_world_implementationSlide.start}
				durationInFrames={real_world_implementationSlide.duration}
			>
				<Audio src={audioFiles["real-world-implementation"]} />
				<CrossFadeWrapper
					totalDuration={real_world_implementationSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Real-World Implementation"
					points={[
						"real-world implementation",
					"financial institution",
					"reducing breach risks"
					]}
					slideName="real-world-implementation"
					audioDuration={real_world_implementationSlide.audioDuration}
					moduleNumber={5}
					
					
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={real_world_implementationSlide.start + real_world_implementationSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* The Road to Secure AI */}
			<Sequence
				from={the_road_to_secure_aiSlide.start}
				durationInFrames={the_road_to_secure_aiSlide.duration}
			>
				<Audio src={audioFiles["the-road-to-secure-ai"]} />
				<CrossFadeWrapper
					totalDuration={the_road_to_secure_aiSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={0}
			>
					<TitleSlide 
					title="Implementing AI Security Measures" 
					subtitle="Practical Techniques for Securing AI Systems"
					
				/>
				</CrossFadeWrapper>
			</Sequence>

		</div>
	);
};
