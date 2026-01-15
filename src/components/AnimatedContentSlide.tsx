// Enhanced ContentSlide with word-level highlighting synchronized to audio
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { getActiveCues } from "../utils/animationCues";
import { wordTimings } from "../utils/wordTimings";
import { getPointHighlightTime } from "../utils/pointMappings";

interface AnimatedContentSlideProps {
	title: string;
	points: string[];
	slideName: string; // e.g., "whyIaC", "workflow", "whyTypeScript", "summary"
	audioStartFrame?: number;
}

export const AnimatedContentSlide: React.FC<AnimatedContentSlideProps> = ({
	title,
	points,
	slideName,
	audioStartFrame = 0,
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const currentAudioTime = Math.max(0, frame / fps);

	// Get word timings for this slide
	const timings = wordTimings[slideName];
	const words = timings?.words || [];

	// Get highlight time for a bullet point using word timings
	const getPointHighlightTimeForIndex = (pointIndex: number): { start: number; end: number } | null => {
		// Use actual word timings if available
		const highlightTime = getPointHighlightTime(slideName, pointIndex, words);
		if (highlightTime) {
			return highlightTime;
		}

		// Fallback: estimate timing if no mapping available
		if (!words.length) return null;

		const totalDuration = words[words.length - 1]?.end || 0;
		const pointsCount = points.length;
		const timePerPoint = totalDuration / pointsCount;
		
		// Start after title (first 20% of audio)
		const titleDuration = totalDuration * 0.2;
		const start = titleDuration + (pointIndex * timePerPoint);
		const end = start + (timePerPoint * 0.8);

		return { start, end };
	};

	const titleOpacity = interpolate(frame, [0, fps * 0.3], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const titleY = interpolate(frame, [0, fps * 0.3], [20, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const getPointOpacity = (index: number) => {
		const highlightTime = getPointHighlightTimeForIndex(index);
		if (!highlightTime) {
			// Fallback to original animation
			const startFrame = fps * (0.5 + index * 0.2);
			const endFrame = startFrame + fps * 0.3;
			return interpolate(frame, [startFrame, endFrame], [0, 1], {
				extrapolateLeft: "clamp",
				extrapolateRight: "clamp",
			});
		}

		// Use word timing-based animation
		const startFrame = highlightTime.start * fps;
		const endFrame = highlightTime.end * fps;
		return interpolate(frame, [startFrame, endFrame], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		});
	};

	const getPointX = (index: number) => {
		const highlightTime = getPointHighlightTimeForIndex(index);
		if (!highlightTime) {
			const startFrame = fps * (0.5 + index * 0.2);
			const endFrame = startFrame + fps * 0.3;
			return interpolate(frame, [startFrame, endFrame], [-20, 0], {
				extrapolateLeft: "clamp",
				extrapolateRight: "clamp",
			});
		}

		const startFrame = highlightTime.start * fps;
		const endFrame = highlightTime.end * fps;
		return interpolate(frame, [startFrame, endFrame], [-20, 0], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		});
	};

	// Check if a point should be highlighted based on current time
	const isPointHighlighted = (index: number): boolean => {
		const highlightTime = getPointHighlightTimeForIndex(index);
		if (!highlightTime) return false;

		// Add delay before highlight appears (0.15 seconds)
		const delay = 0.15;
		const adjustedStart = highlightTime.start + delay;
		const adjustedEnd = highlightTime.end - delay;

		return currentAudioTime >= adjustedStart && currentAudioTime <= adjustedEnd;
	};

	// Get highlight intensity with smooth fade
	const getHighlightIntensity = (index: number): number => {
		if (!isPointHighlighted(index)) return 0;

		const highlightTime = getPointHighlightTimeForIndex(index);
		if (!highlightTime) return 0;

		const delay = 0.15;
		const adjustedStart = highlightTime.start + delay;
		const adjustedEnd = highlightTime.end - delay;
		const duration = adjustedEnd - adjustedStart;

		if (duration <= 0) return 0;

		const progress = (currentAudioTime - adjustedStart) / duration;

		// Smooth fade in/out (30% of duration for each)
		if (progress < 0.3) {
			return interpolate(progress, [0, 0.3], [0, 1], {
				extrapolateLeft: "clamp",
				extrapolateRight: "clamp",
			});
		} else if (progress > 0.7) {
			return interpolate(progress, [0.7, 1], [1, 0], {
				extrapolateLeft: "clamp",
				extrapolateRight: "clamp",
			});
		}
		return 1;
	};

	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				flex: 1,
				background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
				color: "white",
				display: "flex",
				flexDirection: "column",
				padding: 80,
				fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
				position: "relative",
				overflow: "hidden",
			}}
		>
			{/* Subtle background pattern */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					opacity: 0.02,
					backgroundImage: `radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)`,
					backgroundSize: "40px 40px",
				}}
			/>

			{/* Accent line */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					height: 4,
					background: "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)",
				}}
			/>

			<div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column" }}>
				<h2
					style={{
						fontSize: 72,
						margin: 0,
						marginBottom: 60,
						opacity: titleOpacity,
						transform: `translateY(${titleY}px)`,
						fontWeight: 800,
						background: "linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)",
						WebkitBackgroundClip: "text",
						WebkitTextFillColor: "transparent",
						backgroundClip: "text",
						letterSpacing: "-0.02em",
						paddingBottom: 24,
						borderBottom: "3px solid",
						borderImage: "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%) 1",
					}}
				>
					{title}
				</h2>
				<div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24 }}>
					{points.map((point, index) => {
						const highlighted = isPointHighlighted(index);
						const intensity = getHighlightIntensity(index);
						const baseOpacity = getPointOpacity(index);
						const baseX = getPointX(index);

						return (
							<div
								key={index}
								style={{
									opacity: baseOpacity,
									transform: `translateX(${baseX}px)`,
									display: "flex",
									alignItems: "flex-start",
									gap: 24,
									padding: 24,
									backgroundColor: highlighted
										? `rgba(59, 130, 246, ${0.3 + intensity * 0.3})`
										: "rgba(30, 41, 59, 0.6)",
									borderRadius: 12,
									borderLeft: highlighted
										? `4px solid rgba(96, 165, 250, ${intensity})`
										: "4px solid #3b82f6",
									boxShadow: highlighted
										? `0 0 ${intensity * 25}px rgba(96, 165, 250, ${intensity * 0.6}), 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)`
										: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
									transition: "all 0.2s ease",
									transform: `translateX(${baseX}px) scale(${highlighted ? 1 + intensity * 0.02 : 1})`,
								}}
							>
								<div
									style={{
										width: 8,
										height: 8,
										backgroundColor: highlighted
											? `rgba(96, 165, 250, ${intensity})`
											: "#3b82f6",
										borderRadius: "50%",
										marginTop: 12,
										flexShrink: 0,
										boxShadow: highlighted
											? `0 0 ${intensity * 15}px rgba(96, 165, 250, ${intensity * 0.8})`
											: "0 0 12px rgba(59, 130, 246, 0.5)",
									}}
								/>
								<p
									style={{
										fontSize: 38,
										margin: 0,
										lineHeight: 1.7,
										flex: 1,
										color: highlighted ? "#e0e7ff" : "#f1f5f9",
										fontWeight: highlighted ? 500 : 400,
									}}
								>
									{point}
								</p>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};
