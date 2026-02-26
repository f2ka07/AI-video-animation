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
		"networking-intro": staticFile("audio/introduction-to-computer-networks/module1-networking-intro.wav"),
		"what-is-a-network": staticFile("audio/introduction-to-computer-networks/module1-what-is-a-network.wav"),
		"network-components": staticFile("audio/introduction-to-computer-networks/module1-network-components.wav"),
		"types-of-networks": staticFile("audio/introduction-to-computer-networks/module1-types-of-networks.wav"),
		"story-beat-lan-wan": staticFile("audio/introduction-to-computer-networks/module1-story-beat-lan-wan.wav"),
		"network-protocols": staticFile("audio/introduction-to-computer-networks/module1-network-protocols.wav"),
		"tcp-ip-stack": staticFile("audio/introduction-to-computer-networks/module1-tcp-ip-stack.wav"),
		"osi-model": staticFile("audio/introduction-to-computer-networks/module1-osi-model.wav"),
		"story-beat-osi": staticFile("audio/introduction-to-computer-networks/module1-story-beat-osi.wav"),
		"network-addressing": staticFile("audio/introduction-to-computer-networks/module1-network-addressing.wav"),
		"ip-addressing": staticFile("audio/introduction-to-computer-networks/module1-ip-addressing.wav"),
		subnetting: staticFile("audio/introduction-to-computer-networks/module1-subnetting.wav"),
		"story-beat-conclusion": staticFile("audio/introduction-to-computer-networks/module1-story-beat-conclusion.wav"),
		whoosh: staticFile("audio/whoosh.wav"),
	};

	const audioDurations = {
		"networking-intro": getAudioDuration("introduction-to-computer-networks/module1-networking-intro"),
		"what-is-a-network": getAudioDuration("introduction-to-computer-networks/module1-what-is-a-network"),
		"network-components": getAudioDuration("introduction-to-computer-networks/module1-network-components"),
		"types-of-networks": getAudioDuration("introduction-to-computer-networks/module1-types-of-networks"),
		"story-beat-lan-wan": getAudioDuration("introduction-to-computer-networks/module1-story-beat-lan-wan"),
		"network-protocols": getAudioDuration("introduction-to-computer-networks/module1-network-protocols"),
		"tcp-ip-stack": getAudioDuration("introduction-to-computer-networks/module1-tcp-ip-stack"),
		"osi-model": getAudioDuration("introduction-to-computer-networks/module1-osi-model"),
		"story-beat-osi": getAudioDuration("introduction-to-computer-networks/module1-story-beat-osi"),
		"network-addressing": getAudioDuration("introduction-to-computer-networks/module1-network-addressing"),
		"ip-addressing": getAudioDuration("introduction-to-computer-networks/module1-ip-addressing"),
		subnetting: getAudioDuration("introduction-to-computer-networks/module1-subnetting"),
		"story-beat-conclusion": getAudioDuration("introduction-to-computer-networks/module1-story-beat-conclusion"),
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

	const seg0 = addSegment(18.31, true, false, 1);
	const seg1 = addSegment(9.54, false, false, 1);
	const seg2 = addSegment(9.54, true, false, 1);
	const seg3 = addSegment(11.58, false, false, 1);
	const seg4 = addSegment(11.58, true, false, 1);
	const seg5 = addSegment(17.85, true, false, 1);
	const seg6 = addSegment(10.11, true, false, 1);
	const seg7 = addSegment(6.79, false, false, 1);
	const seg8 = addSegment(6.79, true, false, 1);
	const seg9 = addSegment(8.78, false, false, 1);
	const seg10 = addSegment(8.78, true, false, 1);
	const seg11 = addSegment(8.90, false, false, 1);
	const seg12 = addSegment(8.90, true, false, 1);
	const seg13 = addSegment(13.95, true, false, 1);
	const seg14 = addSegment(6.87, false, false, 1);
	const seg15 = addSegment(6.87, true, false, 1);
	const seg16 = addSegment(13.26, true, false, 1);
	const seg17 = addSegment(8.55, false, false, 1);
	const seg18 = addSegment(8.55, true, false, 1);
	const seg19 = addSegment(17.07, true, true, 1.2);

	return (
		<div
			style={{
				width: "100%",
			height: "100%",
			background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
			position: "relative",
		}}
		>
			{/* The Basics of Networking */}
			<Sequence
				from={seg0.start}
				durationInFrames={seg0.duration}
			>
				<Audio src={audioFiles["networking-intro"]} />
				<CrossFadeWrapper
					totalDuration={seg0.slideDuration}
					fadeInDuration={0.5}
					fadeOutDuration={crossFadeDuration}
			>
					<TitleSlide 
					title="The Basics of Networking" 
					subtitle="Understanding How Devices Communicate"
					
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

			{/* What is a Network? */}
			<Sequence
				from={seg1.start}
				durationInFrames={seg1.duration}
			>
				<Audio src={audioFiles["what-is-a-network"]} />
				<CrossFadeWrapper
					totalDuration={seg1.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="What is a Network?"
					points={[
						"A network is a collection",
					"connected together to share"
					]}
					slideName="what-is-a-network"
					audioDuration={seg1.audioDuration}
					moduleNumber={1}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* What is a Network? */}
			<Sequence
				from={seg2.start}
				durationInFrames={seg2.duration}
			>
				<Audio src={audioFiles["what-is-a-network"]} startFrom={Math.round(9.54 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg2.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="What is a Network?"
					points={[
						"Think of it like a web"
					]}
					slideName="what-is-a-network"
					audioDuration={seg2.audioDuration}
					moduleNumber={1}
					
					
					audioStartOffset={9.54}
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

			{/* Network Components */}
			<Sequence
				from={seg3.start}
				durationInFrames={seg3.duration}
			>
				<Audio src={audioFiles["network-components"]} />
				<CrossFadeWrapper
					totalDuration={seg3.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Network Components"
					points={[
						"Devices (or nodes)",
					"Connections"
					]}
					slideName="network-components"
					audioDuration={seg3.audioDuration}
					moduleNumber={1}
					
					
				/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Network Components */}
			<Sequence
				from={seg4.start}
				durationInFrames={seg4.duration}
			>
				<Audio src={audioFiles["network-components"]} startFrom={Math.round(11.58 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg4.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Network Components"
					points={[
						"Data"
					]}
					slideName="network-components"
					audioDuration={seg4.audioDuration}
					moduleNumber={1}
					
					
					audioStartOffset={11.58}
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

			{/* Types of Networks */}
			<Sequence
				from={seg5.start}
				durationInFrames={seg5.duration}
			>
				<Audio src={audioFiles["types-of-networks"]} />
				<CrossFadeWrapper
					totalDuration={seg5.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedComparisonSlide
					title="Types of Networks"
					leftTitle="Local Area Networks (LAN)"
					leftItems={[
						"Small scale",
						"Single building",
						"Faster speeds"
					]}
					rightTitle="Wide Area Networks (WAN)"
					rightItems={[
						"Large scale",
						"Multiple locations",
						"Slower speeds"
					]}
					slideName="types-of-networks"
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

			{/* story-beat-lan-wan */}
			<Sequence
				from={seg6.start}
				durationInFrames={seg6.duration}
			>
				<Audio src={audioFiles["story-beat-lan-wan"]} />
				<CrossFadeWrapper
					totalDuration={seg6.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title=""
					points={[
						
					]}
					slideName="story-beat-lan-wan"
					audioDuration={seg6.audioDuration}
					moduleNumber={1}
					
					
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

			{/* Network Protocols */}
			<Sequence
				from={seg7.start}
				durationInFrames={seg7.duration}
			>
				<Audio src={audioFiles["network-protocols"]} />
				<CrossFadeWrapper
					totalDuration={seg7.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Network Protocols"
					points={[
						"Protocols are the rules",
					"define how data is transmitted"
					]}
					slideName="network-protocols"
					audioDuration={seg7.audioDuration}
					moduleNumber={1}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Network Protocols */}
			<Sequence
				from={seg8.start}
				durationInFrames={seg8.duration}
			>
				<Audio src={audioFiles["network-protocols"]} startFrom={Math.round(6.79 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg8.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Network Protocols"
					points={[
						"Think of them like grammar"
					]}
					slideName="network-protocols"
					audioDuration={seg8.audioDuration}
					moduleNumber={1}
					
					
					audioStartOffset={6.79}
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg8.start + seg8.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* The TCP/IP Stack */}
			<Sequence
				from={seg9.start}
				durationInFrames={seg9.duration}
			>
				<Audio src={audioFiles["tcp-ip-stack"]} />
				<CrossFadeWrapper
					totalDuration={seg9.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="The TCP/IP Stack"
					points={[
						"TCP/IP stack is the foundation",
					"layers handle different aspects"
					]}
					slideName="tcp-ip-stack"
					audioDuration={seg9.audioDuration}
					moduleNumber={1}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* The TCP/IP Stack */}
			<Sequence
				from={seg10.start}
				durationInFrames={seg10.duration}
			>
				<Audio src={audioFiles["tcp-ip-stack"]} startFrom={Math.round(8.78 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg10.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="The TCP/IP Stack"
					points={[
						"Each layer serves a function"
					]}
					slideName="tcp-ip-stack"
					audioDuration={seg10.audioDuration}
					moduleNumber={1}
					
					
					audioStartOffset={8.78}
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

			{/* The OSI Model */}
			<Sequence
				from={seg11.start}
				durationInFrames={seg11.duration}
			>
				<Audio src={audioFiles["osi-model"]} />
				<CrossFadeWrapper
					totalDuration={seg11.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="The OSI Model"
					points={[
						"OSI model is a framework",
					"breaks down communication"
					]}
					slideName="osi-model"
					audioDuration={seg11.audioDuration}
					moduleNumber={1}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* The OSI Model */}
			<Sequence
				from={seg12.start}
				durationInFrames={seg12.duration}
			>
				<Audio src={audioFiles["osi-model"]} startFrom={Math.round(8.90 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg12.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="The OSI Model"
					points={[
						"detailed map of data travel"
					]}
					slideName="osi-model"
					audioDuration={seg12.audioDuration}
					moduleNumber={1}
					
					
					audioStartOffset={8.90}
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg12.start + seg12.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* story-beat-osi */}
			<Sequence
				from={seg13.start}
				durationInFrames={seg13.duration}
			>
				<Audio src={audioFiles["story-beat-osi"]} />
				<CrossFadeWrapper
					totalDuration={seg13.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title=""
					points={[
						
					]}
					slideName="story-beat-osi"
					audioDuration={seg13.audioDuration}
					moduleNumber={1}
					
					
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg13.start + seg13.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Network Addressing */}
			<Sequence
				from={seg14.start}
				durationInFrames={seg14.duration}
			>
				<Audio src={audioFiles["network-addressing"]} />
				<CrossFadeWrapper
					totalDuration={seg14.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Network Addressing"
					points={[
						"Network addressing is like",
					"unique postal address"
					]}
					slideName="network-addressing"
					audioDuration={seg14.audioDuration}
					moduleNumber={1}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Network Addressing */}
			<Sequence
				from={seg15.start}
				durationInFrames={seg15.duration}
			>
				<Audio src={audioFiles["network-addressing"]} startFrom={Math.round(6.87 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg15.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Network Addressing"
					points={[
						"Without proper addressing"
					]}
					slideName="network-addressing"
					audioDuration={seg15.audioDuration}
					moduleNumber={1}
					
					
					audioStartOffset={6.87}
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg15.start + seg15.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* IP Addressing */}
			<Sequence
				from={seg16.start}
				durationInFrames={seg16.duration}
			>
				<Audio src={audioFiles["ip-addressing"]} />
				<CrossFadeWrapper
					totalDuration={seg16.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedCodeSlide
					title="IP Addressing"
					code={`192.168.1.1`}
					language="plaintext"
					slideName="ip-addressing"
					audioStartFrame={seg16.start}
					audioDuration={seg16.audioDuration}
					moduleNumber={1}
					visibleLineRange={[undefined, undefined]}
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg16.start + seg16.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Subnetting */}
			<Sequence
				from={seg17.start}
				durationInFrames={seg17.duration}
			>
				<Audio src={audioFiles["subnetting"]} />
				<CrossFadeWrapper
					totalDuration={seg17.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Subnetting"
					points={[
						"Subnetting divides a network",
					"helps optimize performance"
					]}
					slideName="subnetting"
					audioDuration={seg17.audioDuration}
					moduleNumber={1}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Subnetting */}
			<Sequence
				from={seg18.start}
				durationInFrames={seg18.duration}
			>
				<Audio src={audioFiles["subnetting"]} startFrom={Math.round(8.55 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg18.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Subnetting"
					points={[
						"dividing a large office"
					]}
					slideName="subnetting"
					audioDuration={seg18.audioDuration}
					moduleNumber={1}
					
					
					audioStartOffset={8.55}
		/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={seg18.start + seg18.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* story-beat-conclusion */}
			<Sequence
				from={seg19.start}
				durationInFrames={seg19.duration}
			>
				<Audio src={audioFiles["story-beat-conclusion"]} />
				<CrossFadeWrapper
					totalDuration={seg19.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={0}
			>
					<AnimatedContentSlide
					title=""
					points={[
						
					]}
					slideName="story-beat-conclusion"
					audioDuration={seg19.audioDuration}
					moduleNumber={1}
					
					
				/>
				</CrossFadeWrapper>
			</Sequence>

		</div>
	);
};
