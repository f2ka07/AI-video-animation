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
		"hardware-introduction": staticFile("audio/introduction-to-computer-networks/module2-hardware-introduction.wav"),
		"network-interface-cards": staticFile("audio/introduction-to-computer-networks/module2-network-interface-cards.wav"),
		"hubs-and-switches": staticFile("audio/introduction-to-computer-networks/module2-hubs-and-switches.wav"),
		routers: staticFile("audio/introduction-to-computer-networks/module2-routers.wav"),
		"story-beat-routers": staticFile("audio/introduction-to-computer-networks/module2-story-beat-routers.wav"),
		"cables-and-connectors": staticFile("audio/introduction-to-computer-networks/module2-cables-and-connectors.wav"),
		"wireless-access-points": staticFile("audio/introduction-to-computer-networks/module2-wireless-access-points.wav"),
		"story-beat-hardware-recap": staticFile("audio/introduction-to-computer-networks/module2-story-beat-hardware-recap.wav"),
		firewalls: staticFile("audio/introduction-to-computer-networks/module2-firewalls.wav"),
		"network-hardware-conclusion": staticFile("audio/introduction-to-computer-networks/module2-network-hardware-conclusion.wav"),
		whoosh: staticFile("audio/whoosh.wav"),
	};

	const audioDurations = {
		"hardware-introduction": getAudioDuration("introduction-to-computer-networks/module2-hardware-introduction"),
		"network-interface-cards": getAudioDuration("introduction-to-computer-networks/module2-network-interface-cards"),
		"hubs-and-switches": getAudioDuration("introduction-to-computer-networks/module2-hubs-and-switches"),
		routers: getAudioDuration("introduction-to-computer-networks/module2-routers"),
		"story-beat-routers": getAudioDuration("introduction-to-computer-networks/module2-story-beat-routers"),
		"cables-and-connectors": getAudioDuration("introduction-to-computer-networks/module2-cables-and-connectors"),
		"wireless-access-points": getAudioDuration("introduction-to-computer-networks/module2-wireless-access-points"),
		"story-beat-hardware-recap": getAudioDuration("introduction-to-computer-networks/module2-story-beat-hardware-recap"),
		firewalls: getAudioDuration("introduction-to-computer-networks/module2-firewalls"),
		"network-hardware-conclusion": getAudioDuration("introduction-to-computer-networks/module2-network-hardware-conclusion"),
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

	const seg0 = addSegment(11.17, true, false, 1);
	const seg1 = addSegment(7.63, false, false, 1);
	const seg2 = addSegment(7.63, true, false, 1);
	const seg3 = addSegment(16.21, true, false, 1);
	const seg4 = addSegment(7.21, false, false, 1);
	const seg5 = addSegment(7.21, true, false, 1);
	const seg6 = addSegment(12.11, true, false, 1);
	const seg7 = addSegment(6.38, false, false, 1);
	const seg8 = addSegment(6.38, true, false, 1);
	const seg9 = addSegment(8.13, false, false, 1);
	const seg10 = addSegment(8.13, true, false, 1);
	const seg11 = addSegment(11.86, true, false, 1);
	const seg12 = addSegment(6.89, false, false, 1);
	const seg13 = addSegment(6.50, true, false, 1);
	const seg14 = addSegment(13.69, true, true, 1.2);

	return (
		<div
			style={{
				width: "100%",
			height: "100%",
			background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
			position: "relative",
		}}
		>
			{/* Network Hardware */}
			<Sequence
				from={seg0.start}
				durationInFrames={seg0.duration}
			>
				<Audio src={audioFiles["hardware-introduction"]} />
				<CrossFadeWrapper
					totalDuration={seg0.slideDuration}
					fadeInDuration={0.5}
					fadeOutDuration={crossFadeDuration}
			>
					<TitleSlide 
					title="Network Hardware" 
					subtitle="Exploring the Physical Components"
					
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

			{/* Network Interface Cards (NIC) */}
			<Sequence
				from={seg1.start}
				durationInFrames={seg1.duration}
			>
				<Audio src={audioFiles["network-interface-cards"]} />
				<CrossFadeWrapper
					totalDuration={seg1.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Network Interface Cards (NIC)"
					points={[
						"NIC is the hardware",
					"connects a computer"
					]}
					slideName="network-interface-cards"
					audioDuration={seg1.audioDuration}
					moduleNumber={2}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Network Interface Cards (NIC) */}
			<Sequence
				from={seg2.start}
				durationInFrames={seg2.duration}
			>
				<Audio src={audioFiles["network-interface-cards"]} startFrom={Math.round(7.63 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg2.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Network Interface Cards (NIC)"
					points={[
						"Think of it as the translator"
					]}
					slideName="network-interface-cards"
					audioDuration={seg2.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={7.63}
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

			{/* Hubs vs. Switches */}
			<Sequence
				from={seg3.start}
				durationInFrames={seg3.duration}
			>
				<Audio src={audioFiles["hubs-and-switches"]} />
				<CrossFadeWrapper
					totalDuration={seg3.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedComparisonSlide
					title="Hubs vs. Switches"
					leftTitle="Hubs"
					leftItems={[
						"Broadcast data to all",
						"Less efficient",
						"Simple design"
					]}
					rightTitle="Switches"
					rightItems={[
						"Direct data intelligently",
						"More efficient",
						"Complex design"
					]}
					slideName="hubs-and-switches"
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

			{/* Routers */}
			<Sequence
				from={seg4.start}
				durationInFrames={seg4.duration}
			>
				<Audio src={audioFiles["routers"]} />
				<CrossFadeWrapper
					totalDuration={seg4.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Routers"
					points={[
						"Routers are the traffic directors",
					"connect multiple networks"
					]}
					slideName="routers"
					audioDuration={seg4.audioDuration}
					moduleNumber={2}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Routers */}
			<Sequence
				from={seg5.start}
				durationInFrames={seg5.duration}
			>
				<Audio src={audioFiles["routers"]} startFrom={Math.round(7.21 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg5.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Routers"
					points={[
						"Imagine them as air traffic controllers"
					]}
					slideName="routers"
					audioDuration={seg5.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={7.21}
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

			{/* story-beat-routers */}
			<Sequence
				from={seg6.start}
				durationInFrames={seg6.duration}
			>
				<Audio src={audioFiles["story-beat-routers"]} />
				<CrossFadeWrapper
					totalDuration={seg6.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title=""
					points={[
						
					]}
					slideName="story-beat-routers"
					audioDuration={seg6.audioDuration}
					moduleNumber={2}
					
					
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

			{/* Cables and Connectors */}
			<Sequence
				from={seg7.start}
				durationInFrames={seg7.duration}
			>
				<Audio src={audioFiles["cables-and-connectors"]} />
				<CrossFadeWrapper
					totalDuration={seg7.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Cables and Connectors"
					points={[
						"Cables and connectors are pathways",
					"Ethernet cables are common"
					]}
					slideName="cables-and-connectors"
					audioDuration={seg7.audioDuration}
					moduleNumber={2}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Cables and Connectors */}
			<Sequence
				from={seg8.start}
				durationInFrames={seg8.duration}
			>
				<Audio src={audioFiles["cables-and-connectors"]} startFrom={Math.round(6.38 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg8.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Cables and Connectors"
					points={[
						"like roads for data travel"
					]}
					slideName="cables-and-connectors"
					audioDuration={seg8.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={6.38}
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

			{/* Wireless Access Points (WAPs) */}
			<Sequence
				from={seg9.start}
				durationInFrames={seg9.duration}
			>
				<Audio src={audioFiles["wireless-access-points"]} />
				<CrossFadeWrapper
					totalDuration={seg9.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Wireless Access Points (WAPs)"
					points={[
						"WAPs extend a network's reach",
					"convert wired signals"
					]}
					slideName="wireless-access-points"
					audioDuration={seg9.audioDuration}
					moduleNumber={2}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Wireless Access Points (WAPs) */}
			<Sequence
				from={seg10.start}
				durationInFrames={seg10.duration}
			>
				<Audio src={audioFiles["wireless-access-points"]} startFrom={Math.round(8.13 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg10.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Wireless Access Points (WAPs)"
					points={[
						"like adding a Wi-Fi hotspot"
					]}
					slideName="wireless-access-points"
					audioDuration={seg10.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={8.13}
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

			{/* story-beat-hardware-recap */}
			<Sequence
				from={seg11.start}
				durationInFrames={seg11.duration}
			>
				<Audio src={audioFiles["story-beat-hardware-recap"]} />
				<CrossFadeWrapper
					totalDuration={seg11.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title=""
					points={[
						
					]}
					slideName="story-beat-hardware-recap"
					audioDuration={seg11.audioDuration}
					moduleNumber={2}
					
					
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

			{/* Firewalls */}
			<Sequence
				from={seg12.start}
				durationInFrames={seg12.duration}
			>
				<Audio src={audioFiles["firewalls"]} />
				<CrossFadeWrapper
					totalDuration={seg12.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Firewalls"
					points={[
						"Firewalls are security devices",
					"monitor and control traffic"
					]}
					slideName="firewalls"
					audioDuration={seg12.audioDuration}
					moduleNumber={2}
					
					
		/>
				</CrossFadeWrapper>
			</Sequence>

			{/* Firewalls */}
			<Sequence
				from={seg13.start}
				durationInFrames={seg13.duration}
			>
				<Audio src={audioFiles["firewalls"]} startFrom={Math.round(6.89 * fps)} />
				<CrossFadeWrapper
					totalDuration={seg13.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Firewalls"
					points={[
						"Think of them as security guards"
					]}
					slideName="firewalls"
					audioDuration={seg13.audioDuration}
					moduleNumber={2}
					
					
					audioStartOffset={6.89}
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

			{/* network-hardware-conclusion */}
			<Sequence
				from={seg14.start}
				durationInFrames={seg14.duration}
			>
				<Audio src={audioFiles["network-hardware-conclusion"]} />
				<CrossFadeWrapper
					totalDuration={seg14.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={0}
			>
					<AnimatedContentSlide
					title=""
					points={[
						
					]}
					slideName="network-hardware-conclusion"
					audioDuration={seg14.audioDuration}
					moduleNumber={2}
					
					
				/>
				</CrossFadeWrapper>
			</Sequence>

		</div>
	);
};
