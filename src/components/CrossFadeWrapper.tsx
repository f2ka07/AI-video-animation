import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

interface CrossFadeWrapperProps {
	children: React.ReactNode;
	fadeInDuration?: number;
	fadeOutDuration?: number;
	totalDuration: number;
}

export const CrossFadeWrapper: React.FC<CrossFadeWrapperProps> = ({
	children,
	fadeInDuration = 0.5,
	fadeOutDuration = 0.5,
	totalDuration,
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const totalFrames = totalDuration * fps;
	const fadeInFrames = fadeInDuration * fps;
	const fadeOutFrames = fadeOutDuration * fps;

	// Ensure input range is strictly monotonically increasing
	// Handle cases where fadeOutDuration is 0 or fadeInDuration equals totalDuration
	let inputRange: number[];
	let outputRange: number[];

	if (fadeOutFrames === 0) {
		// No fade out - just fade in and stay visible
		if (fadeInFrames >= totalFrames) {
			// Fade in takes entire duration - just fade in
			inputRange = [0, totalFrames];
			outputRange = [0, 1];
		} else {
			// Fade in, then stay at 1
			inputRange = [0, fadeInFrames, totalFrames];
			outputRange = [0, 1, 1];
		}
	} else if (fadeInFrames === 0) {
		// No fade in - just fade out
		const fadeOutStart = totalFrames - fadeOutFrames;
		if (fadeOutStart <= 0) {
			// Fade out takes entire duration - just fade out
			inputRange = [0, totalFrames];
			outputRange = [1, 0];
		} else {
			// Stay at 1, then fade out
			inputRange = [0, fadeOutStart, totalFrames];
			outputRange = [1, 1, 0];
		}
	} else {
		// Both fade in and fade out
		const fadeOutStart = totalFrames - fadeOutFrames;
		
		// Ensure fade-in ends before fade-out starts
		if (fadeInFrames >= fadeOutStart) {
			// Fade in and fade out overlap - adjust to prevent duplicate values
			const midPoint = totalFrames / 2;
			inputRange = [0, Math.min(fadeInFrames, midPoint), Math.max(fadeOutStart, midPoint), totalFrames];
			outputRange = [0, 1, 1, 0];
		} else {
			// Normal case: fade in, stay visible, fade out
			inputRange = [0, fadeInFrames, fadeOutStart, totalFrames];
			outputRange = [0, 1, 1, 0];
		}
	}

	// Ensure all values in inputRange are strictly increasing
	const uniqueInputRange = inputRange.filter((val, idx, arr) => idx === 0 || val !== arr[idx - 1]);
	const uniqueOutputRange = outputRange.slice(0, uniqueInputRange.length);

	const opacity = interpolate(
		frame,
		uniqueInputRange,
		uniqueOutputRange,
		{
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		}
	);

	return (
		<div
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				width: "100%",
				height: "100%",
				opacity,
				background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
				display: "flex",
				overflow: "hidden",
			}}
		>
			<div style={{ width: "100%", height: "100%", display: "flex", flex: 1 }}>
				{children}
			</div>
		</div>
	);
};
