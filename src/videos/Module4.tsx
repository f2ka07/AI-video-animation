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
		"security-introduction": staticFile("audio/introduction-to-computer-networks/module4-security-introduction.wav"),
		encryption: staticFile("audio/introduction-to-computer-networks/module4-encryption.wav"),
		firewalls: staticFile("audio/introduction-to-computer-networks/module4-firewalls.wav"),
		"antivirus-software": staticFile("audio/introduction-to-computer-networks/module4-antivirus-software.wav"),
		"story-beat-security-recap": staticFile("audio/introduction-to-computer-networks/module4-story-beat-security-recap.wav"),
		"security-policies": staticFile("audio/introduction-to-computer-networks/module4-security-policies.wav"),
		vpn: staticFile("audio/introduction-to-computer-networks/module4-vpn.wav"),
		"network-security-conclusion": staticFile("audio/introduction-to-computer-networks/module4-network-security-conclusion.wav"),
		whoosh: staticFile("audio/whoosh.wav"),
	};

	const audioDurations = {
		"security-introduction": getAudioDuration("introduction-to-computer-networks/module4-security-introduction"),
		encryption: getAudioDuration("introduction-to-computer-networks/module4-encryption"),
		firewalls: getAudioDuration("introduction-to-computer-networks/module4-firewalls"),
		"antivirus-software": getAudioDuration("introduction-to-computer-networks/module4-antivirus-software"),
		"story-beat-security-recap": getAudioDuration("introduction-to-computer-networks/module4-story-beat-security-recap"),
		"security-policies": getAudioDuration("introduction-to-computer-networks/module4-security-policies"),
		vpn: getAudioDuration("introduction-to-computer-networks/module4-vpn"),
		"network-security-conclusion": getAudioDuration("introduction-to-computer-networks/module4-network-security-conclusion"),
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

	const seg0 = addSegment(9.94, true, false, 1);
	const seg1 = addSegment(5.10, false, false, 1);
	const seg2 = addSegment(5.10, true, false, 1);
	const seg3 = addSegment(6.89, false, false, 1);
	const seg4 = addSegment(6.89, true, false, 1);
	const seg5 = addSegment(5.74, false, false, 1);
	const seg6 = addSegment(5.74, true, false, 1);
	const seg7 = addSegment(11.73, true, false, 1);
	const seg8 = addSegment(6.55, false, false, 1);
	const seg9 = addSegment(6.55, true, false, 1);
	const seg10 = addSegment(7.57, false, false, 1);
	const seg11 = addSegment(7.57, true, false, 1);
	const seg12 = addSegment(12.37, true, true, 1.2);

	return (
		<div
			style={{
				width: "100%",
			height: "100%",
			background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
			position: "relative",
		}}
		>
			{/* Network Security Basics */}
			<Sequence
				from={seg0.start}
				durationInFrames={seg0.duration}
			>
				<Audio src={audioFiles["security-introduction"]} />
				<CrossFadeWrapper
					totalDuration={seg0.slideDuration}
					fadeInDuration={0.5}
					fadeOutDuration={crossFadeDuration}
			>
					<TitleSlide 
					title="Network Security Basics" 
					subtitle="Protecting Data and Integrity"
					
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

			{/* Encryption */}
			<Sequence
				from={seg1.start}
				durationInFrames={seg1.duration}
			>
				<Audio src={audioFiles["encryption"]} />
				<CrossFadeWrapper
					totalDuration={seg1.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Encryption"
					points={[
						"Encryption converts data",
					"into a code"
					]}
					slideName="encryption"
					audioDuration={seg1.audioDuration}
					moduleNumber={4}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Encryption */}
			<Sequence
				from={seg2.start}
				durationInFrames={seg2.duration}
			>
				<Audio src={audioFiles["encryption"]} startFrom={Math.round(5.10 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg2.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Encryption"
					points={[
						"like locking your data"
					]}
					slideName="encryption"
					audioDuration={seg2.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={5.10}
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg2.start + seg2.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Firewalls */}
			<Sequence
				from={seg3.start}
				durationInFrames={seg3.duration}
			>
				<Audio src={audioFiles["firewalls"]} />
				<CrossFadeWrapper
					totalDuration={seg3.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Firewalls"
					points={[
						"Firewalls act as barriers",
					"control network traffic"
					]}
					slideName="firewalls"
					audioDuration={seg3.audioDuration}
					moduleNumber={4}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Firewalls */}
			<Sequence
				from={seg4.start}
				durationInFrames={seg4.duration}
			>
				<Audio src={audioFiles["firewalls"]} startFrom={Math.round(6.89 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg4.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Firewalls"
					points={[
						"like security guards"
					]}
					slideName="firewalls"
					audioDuration={seg4.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={6.89}
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg4.start + seg4.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Antivirus Software */}
			<Sequence
				from={seg5.start}
				durationInFrames={seg5.duration}
			>
				<Audio src={audioFiles["antivirus-software"]} />
				<CrossFadeWrapper
					totalDuration={seg5.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Antivirus Software"
					points={[
						"Antivirus software detects threats",
					"removes malicious software"
					]}
					slideName="antivirus-software"
					audioDuration={seg5.audioDuration}
					moduleNumber={4}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Antivirus Software */}
			<Sequence
				from={seg6.start}
				durationInFrames={seg6.duration}
			>
				<Audio src={audioFiles["antivirus-software"]} startFrom={Math.round(5.74 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg6.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Antivirus Software"
					points={[
						"like a digital health checkup"
					]}
					slideName="antivirus-software"
					audioDuration={seg6.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={5.74}
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg6.start + seg6.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* story-beat-security-recap */}
			<Sequence
				from={seg7.start}
				durationInFrames={seg7.duration}
			>
				<Audio src={audioFiles["story-beat-security-recap"]} />
				<CrossFadeWrapper
					totalDuration={seg7.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title=""
					points={[
						
					]}
					slideName="story-beat-security-recap"
					audioDuration={seg7.audioDuration}
					moduleNumber={4}
					
					
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg7.start + seg7.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Security Policies */}
			<Sequence
				from={seg8.start}
				durationInFrames={seg8.duration}
			>
				<Audio src={audioFiles["security-policies"]} />
				<CrossFadeWrapper
					totalDuration={seg8.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Security Policies"
					points={[
						"Security policies are rules",
					"designed to protect integrity"
					]}
					slideName="security-policies"
					audioDuration={seg8.audioDuration}
					moduleNumber={4}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Security Policies */}
			<Sequence
				from={seg9.start}
				durationInFrames={seg9.duration}
			>
				<Audio src={audioFiles["security-policies"]} startFrom={Math.round(6.55 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg9.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Security Policies"
					points={[
						"the rulebook for network safety"
					]}
					slideName="security-policies"
					audioDuration={seg9.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={6.55}
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

			{/* Virtual Private Network (VPN) */}
			<Sequence
				from={seg10.start}
				durationInFrames={seg10.duration}
			>
				<Audio src={audioFiles["vpn"]} />
				<CrossFadeWrapper
					totalDuration={seg10.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Virtual Private Network (VPN)"
					points={[
						"VPN creates a secure connection",
					"masks your IP address"
					]}
					slideName="vpn"
					audioDuration={seg10.audioDuration}
					moduleNumber={4}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Virtual Private Network (VPN) */}
			<Sequence
				from={seg11.start}
				durationInFrames={seg11.duration}
			>
				<Audio src={audioFiles["vpn"]} startFrom={Math.round(7.57 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg11.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Virtual Private Network (VPN)"
					points={[
						"private tunnel through internet"
					]}
					slideName="vpn"
					audioDuration={seg11.audioDuration}
					moduleNumber={4}
					
					
					audioStartOffset={7.57}
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg11.start + seg11.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* network-security-conclusion */}
			<Sequence
				from={seg12.start}
				durationInFrames={seg12.duration}
			>
				<Audio src={audioFiles["network-security-conclusion"]} />
				<CrossFadeWrapper
					totalDuration={seg12.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={0}
			>
					<AnimatedContentSlide
					title=""
					points={[
						
					]}
					slideName="network-security-conclusion"
					audioDuration={seg12.audioDuration}
					moduleNumber={4}
					
					
				/>
				</CrossFadeWrapper>
			</Sequence>

		</div>
	);
};
