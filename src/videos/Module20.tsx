import React from "react";
import { Sequence, useVideoConfig, Audio, staticFile } from "remotion";
import { TitleSlide } from "../components/TitleSlide";
import { AnimatedContentSlide } from "../components/AnimatedContentSlide";
import { AnimatedCodeSlide } from "../components/AnimatedCodeSlide";
import { AnimatedComparisonSlide } from "../components/AnimatedComparisonSlide";
import { CodeAndDiagram } from "../compositions/CodeAndDiagram";
import { CrossFadeWrapper } from "../components/CrossFadeWrapper";
import { getAudioDuration } from "../utils/audioDuration";

// Auto-generated from moduleContent.ts - DO NOT EDIT MANUALLY
export const Module20: React.FC = () => {
	const { fps } = useVideoConfig();
	const crossFadeDuration = 0.3;
	const whooshDuration = 0.57;

	const audioFiles = {
		"slide-2": staticFile("audio/module20-slide-2.wav"),
		whoosh: staticFile("audio/whoosh.wav"),
	};

	const audioDurations = {
		"slide-2": getAudioDuration("module20-slide-2"),
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

	const slide_2Slide = addSlide(audioDurations["slide-2"], true, 0.5);

	return (
		<div
			style={{
				width: "100%",
			height: "100%",
			background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
			position: "relative",
		}}
		>
			{/* The Evolution */}
			<Sequence
				from={slide_2Slide.start}
				durationInFrames={slide_2Slide.duration}
			>
				<Audio src={audioFiles["slide-2"]} />
				<CrossFadeWrapper
					totalDuration={slide_2Slide.slideDuration}
					fadeInDuration={0.5}
					fadeOutDuration={0}
			>
					<AnimatedContentSlide
					title="The Evolution"
					points={[
						"Cloud platforms removed servers",
					"AI removed boilerplate coding",
					"No-code removed interfaces",
					"Stripe removed payments",
					"OpenAI removed customer support",
					"Everything is now an API"
					]}
					slideName="slide-2"
					
					audioDuration={audioDurations["slide-2"]}
				/>
				</CrossFadeWrapper>
			</Sequence>

		</div>
	);
};
