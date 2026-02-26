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
		"protocols-introduction": staticFile("audio/introduction-to-computer-networks/module3-protocols-introduction.wav"),
		"tcp-and-udp": staticFile("audio/introduction-to-computer-networks/module3-tcp-and-udp.wav"),
		"http-and-https": staticFile("audio/introduction-to-computer-networks/module3-http-and-https.wav"),
		dns: staticFile("audio/introduction-to-computer-networks/module3-dns.wav"),
		"story-beat-dns": staticFile("audio/introduction-to-computer-networks/module3-story-beat-dns.wav"),
		"ftp-and-sftp": staticFile("audio/introduction-to-computer-networks/module3-ftp-and-sftp.wav"),
		"email-protocols": staticFile("audio/introduction-to-computer-networks/module3-email-protocols.wav"),
		"story-beat-protocols-recap": staticFile("audio/introduction-to-computer-networks/module3-story-beat-protocols-recap.wav"),
		"protocols-conclusion": staticFile("audio/introduction-to-computer-networks/module3-protocols-conclusion.wav"),
		whoosh: staticFile("audio/whoosh.wav"),
	};

	const audioDurations = {
		"protocols-introduction": getAudioDuration("introduction-to-computer-networks/module3-protocols-introduction"),
		"tcp-and-udp": getAudioDuration("introduction-to-computer-networks/module3-tcp-and-udp"),
		"http-and-https": getAudioDuration("introduction-to-computer-networks/module3-http-and-https"),
		dns: getAudioDuration("introduction-to-computer-networks/module3-dns"),
		"story-beat-dns": getAudioDuration("introduction-to-computer-networks/module3-story-beat-dns"),
		"ftp-and-sftp": getAudioDuration("introduction-to-computer-networks/module3-ftp-and-sftp"),
		"email-protocols": getAudioDuration("introduction-to-computer-networks/module3-email-protocols"),
		"story-beat-protocols-recap": getAudioDuration("introduction-to-computer-networks/module3-story-beat-protocols-recap"),
		"protocols-conclusion": getAudioDuration("introduction-to-computer-networks/module3-protocols-conclusion"),
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

	const seg0 = addSegment(13.18, true, false, 1);
	const seg1 = addSegment(15.02, true, false, 1);
	const seg2 = addSegment(7.02, false, false, 1);
	const seg3 = addSegment(7.02, true, false, 1);
	const seg4 = addSegment(6.18, false, false, 1);
	const seg5 = addSegment(6.18, true, false, 1);
	const seg6 = addSegment(13.39, true, false, 1);
	const seg7 = addSegment(12.75, true, false, 1);
	const seg8 = addSegment(8.75, false, false, 1);
	const seg9 = addSegment(8.75, true, false, 1);
	const seg10 = addSegment(12.85, true, false, 1);
	const seg11 = addSegment(13.61, true, true, 1.2);

	return (
		<div
			style={{
				width: "100%",
			height: "100%",
			background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
			position: "relative",
		}}
		>
			{/* Networking Protocols */}
			<Sequence
				from={seg0.start}
				durationInFrames={seg0.duration}
			>
				<Audio src={audioFiles["protocols-introduction"]} />
				<CrossFadeWrapper
					totalDuration={seg0.slideDuration}
					fadeInDuration={0.5}
					fadeOutDuration={crossFadeDuration}
			>
					<TitleSlide 
					title="Networking Protocols" 
					subtitle="The Rules of Digital Communication"
					
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

			{/* TCP vs. UDP */}
			<Sequence
				from={seg1.start}
				durationInFrames={seg1.duration}
			>
				<Audio src={audioFiles["tcp-and-udp"]} />
				<CrossFadeWrapper
					totalDuration={seg1.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedComparisonSlide
					title="TCP vs. UDP"
					leftTitle="TCP"
					leftItems={[
						"Reliable communication",
						"Error checking",
						"Guaranteed delivery"
					]}
					rightTitle="UDP"
					rightItems={[
						"Faster",
						"No error checking",
						"No delivery guarantee"
					]}
					slideName="tcp-and-udp"
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg1.start + seg1.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* HTTP and HTTPS */}
			<Sequence
				from={seg2.start}
				durationInFrames={seg2.duration}
			>
				<Audio src={audioFiles["http-and-https"]} />
				<CrossFadeWrapper
					totalDuration={seg2.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="HTTP and HTTPS"
					points={[
						"HTTP and HTTPS are protocols",
					"HTTPS is the secure version"
					]}
					slideName="http-and-https"
					audioDuration={seg2.audioDuration}
					moduleNumber={3}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* HTTP and HTTPS */}
			<Sequence
				from={seg3.start}
				durationInFrames={seg3.duration}
			>
				<Audio src={audioFiles["http-and-https"]} startFrom={Math.round(7.02 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg3.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="HTTP and HTTPS"
					points={[
						"like a sealed envelope"
					]}
					slideName="http-and-https"
					audioDuration={seg3.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={7.02}
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg3.start + seg3.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Domain Name System (DNS) */}
			<Sequence
				from={seg4.start}
				durationInFrames={seg4.duration}
			>
				<Audio src={audioFiles["dns"]} />
				<CrossFadeWrapper
					totalDuration={seg4.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Domain Name System (DNS)"
					points={[
						"DNS translates domain names",
					"into IP addresses"
					]}
					slideName="dns"
					audioDuration={seg4.audioDuration}
					moduleNumber={3}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Domain Name System (DNS) */}
			<Sequence
				from={seg5.start}
				durationInFrames={seg5.duration}
			>
				<Audio src={audioFiles["dns"]} startFrom={Math.round(6.18 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg5.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Domain Name System (DNS)"
					points={[
						"like a phone book"
					]}
					slideName="dns"
					audioDuration={seg5.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={6.18}
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg5.start + seg5.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* story-beat-dns */}
			<Sequence
				from={seg6.start}
				durationInFrames={seg6.duration}
			>
				<Audio src={audioFiles["story-beat-dns"]} />
				<CrossFadeWrapper
					totalDuration={seg6.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title=""
					points={[
						
					]}
					slideName="story-beat-dns"
					audioDuration={seg6.audioDuration}
					moduleNumber={3}
					
					
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

			{/* FTP vs. SFTP */}
			<Sequence
				from={seg7.start}
				durationInFrames={seg7.duration}
			>
				<Audio src={audioFiles["ftp-and-sftp"]} />
				<CrossFadeWrapper
					totalDuration={seg7.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedComparisonSlide
					title="FTP vs. SFTP"
					leftTitle="FTP"
					leftItems={[
						"Standard protocol",
						"No encryption",
						"Simple transfers"
					]}
					rightTitle="SFTP"
					rightItems={[
						"Secure protocol",
						"Encrypts data",
						"Secure transfers"
					]}
					slideName="ftp-and-sftp"
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

			{/* Email Protocols */}
			<Sequence
				from={seg8.start}
				durationInFrames={seg8.duration}
			>
				<Audio src={audioFiles["email-protocols"]} />
				<CrossFadeWrapper
					totalDuration={seg8.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Email Protocols"
					points={[
						"SMTP, IMAP, and POP3",
					"SMTP for outgoing mail"
					]}
					slideName="email-protocols"
					audioDuration={seg8.audioDuration}
					moduleNumber={3}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Email Protocols */}
			<Sequence
				from={seg9.start}
				durationInFrames={seg9.duration}
			>
				<Audio src={audioFiles["email-protocols"]} startFrom={Math.round(8.75 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg9.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Email Protocols"
					points={[
						"IMAP and POP3 for incoming"
					]}
					slideName="email-protocols"
					audioDuration={seg9.audioDuration}
					moduleNumber={3}
					
					
					audioStartOffset={8.75}
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

			{/* story-beat-protocols-recap */}
			<Sequence
				from={seg10.start}
				durationInFrames={seg10.duration}
			>
				<Audio src={audioFiles["story-beat-protocols-recap"]} />
				<CrossFadeWrapper
					totalDuration={seg10.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title=""
					points={[
						
					]}
					slideName="story-beat-protocols-recap"
					audioDuration={seg10.audioDuration}
					moduleNumber={3}
					
					
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg10.start + seg10.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* protocols-conclusion */}
			<Sequence
				from={seg11.start}
				durationInFrames={seg11.duration}
			>
				<Audio src={audioFiles["protocols-conclusion"]} />
				<CrossFadeWrapper
					totalDuration={seg11.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={0}
			>
					<AnimatedContentSlide
					title=""
					points={[
						
					]}
					slideName="protocols-conclusion"
					audioDuration={seg11.audioDuration}
					moduleNumber={3}
					
					
				/>
				</CrossFadeWrapper>
			</Sequence>

		</div>
	);
};
