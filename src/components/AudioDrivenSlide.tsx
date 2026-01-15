// Component that automatically adjusts slide duration based on audio length
import React, { useMemo } from "react";
import { Sequence, useVideoConfig, Audio, staticFile } from "remotion";
import { useAudioDuration } from "../utils/useAudioDuration";
import { CrossFadeWrapper } from "./CrossFadeWrapper";

interface AudioDrivenSlideProps {
	audioFile: string;
	startFrame: number;
	transitionDuration?: number;
	crossFadeDuration?: number;
	children: React.ReactNode;
	fadeInDuration?: number;
	fadeOutDuration?: number;
	onDurationCalculated?: (duration: number) => void;
}

export const AudioDrivenSlide: React.FC<AudioDrivenSlideProps> = ({
	audioFile,
	startFrame,
	transitionDuration = 1,
	crossFadeDuration = 0.2,
	children,
	fadeInDuration = 0.5,
	fadeOutDuration,
	onDurationCalculated,
}) => {
	const { fps } = useVideoConfig();
	const audioSrc = staticFile(`audio/${audioFile}.wav`);
	const audioDuration = useAudioDuration(audioSrc);

	// Calculate slide duration: audio duration + transition
	const slideDuration = useMemo(() => {
		if (audioDuration === null) {
			// Return default if audio not loaded yet
			return 10 + transitionDuration;
		}
		return audioDuration + transitionDuration;
	}, [audioDuration, transitionDuration]);

	// Notify parent of calculated duration
	React.useEffect(() => {
		if (audioDuration !== null && onDurationCalculated) {
			onDurationCalculated(slideDuration);
		}
	}, [audioDuration, slideDuration, onDurationCalculated]);

	const durationInFrames = (slideDuration + crossFadeDuration) * fps;
	const fadeOut = fadeOutDuration !== undefined ? fadeOutDuration : crossFadeDuration;

	return (
		<Sequence from={startFrame} durationInFrames={durationInFrames}>
			<Audio src={audioSrc} />
			<CrossFadeWrapper
				totalDuration={slideDuration + crossFadeDuration}
				fadeInDuration={fadeInDuration}
				fadeOutDuration={fadeOut}
			>
				{children}
			</CrossFadeWrapper>
		</Sequence>
	);
};
