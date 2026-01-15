// Template for creating new module videos
// Copy this file and modify for each new module

import React from "react";
import { Sequence, useVideoConfig } from "remotion";
import { TitleSlide } from "../components/TitleSlide";
import { ContentSlide } from "../components/ContentSlide";
import { ComparisonSlide } from "../components/ComparisonSlide";
import { CodeSlide } from "../components/CodeSlide";
import { TransitionSlide } from "../components/TransitionSlide";

interface VideoTemplateProps {
	moduleNumber: number;
	moduleTitle: string;
	slides: Array<{
		type: "title" | "content" | "code" | "comparison" | "transition";
		props: any;
		duration?: number;
	}>;
}

export const VideoTemplate: React.FC<VideoTemplateProps> = ({
	moduleNumber,
	moduleTitle,
	slides,
}) => {
	const { fps } = useVideoConfig();
	const defaultSlideDuration = 8;
	const defaultTransitionDuration = 1;

	let currentFrame = 0;

	const addSequence = (duration: number) => {
		const start = currentFrame;
		currentFrame += duration * fps;
		return { start, duration: duration * fps };
	};

	const renderSlide = (slide: any, index: number) => {
		const duration =
			slide.duration ||
			(slide.type === "transition"
				? defaultTransitionDuration
				: defaultSlideDuration);
		const { start, duration: durationFrames } = addSequence(duration);

		switch (slide.type) {
			case "title":
				return (
					<Sequence key={index} from={start} durationInFrames={durationFrames}>
						<TitleSlide {...slide.props} />
					</Sequence>
				);
			case "content":
				return (
					<Sequence key={index} from={start} durationInFrames={durationFrames}>
						<ContentSlide {...slide.props} />
					</Sequence>
				);
			case "code":
				return (
					<Sequence key={index} from={start} durationInFrames={durationFrames}>
						<CodeSlide {...slide.props} />
					</Sequence>
				);
			case "comparison":
				return (
					<Sequence key={index} from={start} durationInFrames={durationFrames}>
						<ComparisonSlide {...slide.props} />
					</Sequence>
				);
			case "transition":
				return (
					<Sequence key={index} from={start} durationInFrames={durationFrames}>
						<TransitionSlide {...slide.props} />
					</Sequence>
				);
			default:
				return null;
		}
	};

	return <>{slides.map((slide, index) => renderSlide(slide, index))}</>;
};
