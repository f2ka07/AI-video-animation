// Enhanced ComparisonSlide with word-level highlighting synchronized to audio
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { wordTimings } from "../utils/wordTimings";

interface AnimatedComparisonSlideProps {
	title: string;
	leftTitle: string;
	leftItems: string[];
	rightTitle: string;
	rightItems: string[];
	slideName: string; // e.g., "comparison"
	audioStartFrame?: number;
}

export const AnimatedComparisonSlide: React.FC<AnimatedComparisonSlideProps> = ({
	title,
	leftTitle,
	leftItems,
	rightTitle,
	rightItems,
	slideName,
	audioStartFrame = 0,
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const currentAudioTime = Math.max(0, frame / fps);

	// Get word timings for this slide
	const timings = wordTimings[slideName];
	const words = timings?.words || [];

	// Estimate timing for each item based on narration
	const getItemHighlightTime = (index: number, side: "left" | "right"): { start: number; end: number } | null => {
		if (!words.length) return null;

		const totalDuration = words[words.length - 1]?.end || 0;
		const itemsCount = Math.max(leftItems.length, rightItems.length);
		
		// Left items come first (first 50% of content time), right items come after
		const contentStart = totalDuration * 0.2; // After title
		const contentDuration = totalDuration * 0.8;
		const leftDuration = contentDuration * 0.5;
		const rightDuration = contentDuration * 0.5;
		
		const timePerItem = side === "left" ? leftDuration / leftItems.length : rightDuration / rightItems.length;
		const baseTime = side === "left" ? contentStart : contentStart + leftDuration;
		
		const start = baseTime + (index * timePerItem);
		const end = start + (timePerItem * 0.8);

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

	const columnsOpacity = interpolate(frame, [fps * 0.4, fps * 0.7], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const columnsY = interpolate(frame, [fps * 0.4, fps * 0.7], [30, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const getItemOpacity = (index: number, side: "left" | "right") => {
		const highlightTime = getItemHighlightTime(index, side);
		if (!highlightTime) {
			// Fallback to original animation
			const baseFrame = fps * 0.7;
			const delay = index * 0.15;
			const startFrame = baseFrame + delay * fps;
			const endFrame = startFrame + fps * 0.2;
			return interpolate(frame, [startFrame, endFrame], [0, 1], {
				extrapolateLeft: "clamp",
				extrapolateRight: "clamp",
			});
		}

		const startFrame = highlightTime.start * fps;
		const endFrame = highlightTime.end * fps;
		return interpolate(frame, [startFrame, endFrame], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		});
	};

	const getItemX = (index: number, side: "left" | "right") => {
		const highlightTime = getItemHighlightTime(index, side);
		if (!highlightTime) {
			const baseFrame = fps * 0.7;
			const delay = index * 0.15;
			const startFrame = baseFrame + delay * fps;
			const endFrame = startFrame + fps * 0.2;
			const direction = side === "left" ? -1 : 1;
			return interpolate(frame, [startFrame, endFrame], [direction * 20, 0], {
				extrapolateLeft: "clamp",
				extrapolateRight: "clamp",
			});
		}

		const startFrame = highlightTime.start * fps;
		const endFrame = highlightTime.end * fps;
		const direction = side === "left" ? -1 : 1;
		return interpolate(frame, [startFrame, endFrame], [direction * 20, 0], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		});
	};

	// Check if an item should be highlighted
	const isItemHighlighted = (index: number, side: "left" | "right"): boolean => {
		const highlightTime = getItemHighlightTime(index, side);
		if (!highlightTime) return false;

		const delay = 0.15;
		const adjustedStart = highlightTime.start + delay;
		const adjustedEnd = highlightTime.end - delay;

		return currentAudioTime >= adjustedStart && currentAudioTime <= adjustedEnd;
	};

	// Get highlight intensity
	const getHighlightIntensity = (index: number, side: "left" | "right"): number => {
		if (!isItemHighlighted(index, side)) return 0;

		const highlightTime = getItemHighlightTime(index, side);
		if (!highlightTime) return 0;

		const delay = 0.15;
		const adjustedStart = highlightTime.start + delay;
		const adjustedEnd = highlightTime.end - delay;
		const duration = adjustedEnd - adjustedStart;

		if (duration <= 0) return 0;

		const progress = (currentAudioTime - adjustedStart) / duration;

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
				padding: 60,
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
						fontSize: 64,
						margin: 0,
						marginBottom: 50,
						opacity: titleOpacity,
						transform: `translateY(${titleY}px)`,
						fontWeight: 800,
						textAlign: "center",
						background: "linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)",
						WebkitBackgroundClip: "text",
						WebkitTextFillColor: "transparent",
						backgroundClip: "text",
						letterSpacing: "-0.02em",
					}}
				>
					{title}
				</h2>
				<div
					style={{
						flex: 1,
						display: "flex",
						gap: 40,
						opacity: columnsOpacity,
						transform: `translateY(${columnsY}px)`,
					}}
				>
					<div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
						<h3
							style={{
								fontSize: 44,
								margin: 0,
								marginBottom: 32,
								color: "#ef4444",
								fontWeight: 700,
								display: "flex",
								alignItems: "center",
								gap: 12,
							}}
						>
							<span
								style={{
									width: 6,
									height: 6,
									backgroundColor: "#ef4444",
									borderRadius: "50%",
									boxShadow: "0 0 12px rgba(239, 68, 68, 0.6)",
								}}
							/>
							{leftTitle}
						</h3>
						<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
							{leftItems.map((item, index) => {
								const highlighted = isItemHighlighted(index, "left");
								const intensity = getHighlightIntensity(index, "left");
								const baseOpacity = getItemOpacity(index, "left");
								const baseX = getItemX(index, "left");

								return (
									<div
										key={index}
										style={{
											opacity: baseOpacity,
											transform: `translateX(${baseX}px) scale(${highlighted ? 1 + intensity * 0.02 : 1})`,
											fontSize: 32,
											lineHeight: 1.6,
											padding: 24,
											backgroundColor: highlighted
												? `rgba(239, 68, 68, ${0.2 + intensity * 0.2})`
												: "rgba(30, 41, 59, 0.7)",
											borderRadius: 12,
											borderLeft: highlighted
												? `4px solid rgba(248, 113, 113, ${intensity})`
												: "4px solid #ef4444",
											boxShadow: highlighted
												? `0 0 ${intensity * 20}px rgba(248, 113, 113, ${intensity * 0.6}), 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)`
												: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
											transition: "all 0.2s ease",
										}}
									>
										{item}
									</div>
								);
							})}
						</div>
					</div>
					<div
						style={{
							width: 2,
							background: "linear-gradient(180deg, transparent 0%, #3b82f6 50%, transparent 100%)",
							opacity: 0.5,
						}}
					/>
					<div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
						<h3
							style={{
								fontSize: 44,
								margin: 0,
								marginBottom: 32,
								color: "#3b82f6",
								fontWeight: 700,
								display: "flex",
								alignItems: "center",
								gap: 12,
							}}
						>
							<span
								style={{
									width: 6,
									height: 6,
									backgroundColor: "#3b82f6",
									borderRadius: "50%",
									boxShadow: "0 0 12px rgba(59, 130, 246, 0.6)",
								}}
							/>
							{rightTitle}
						</h3>
						<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
							{rightItems.map((item, index) => {
								const highlighted = isItemHighlighted(index, "right");
								const intensity = getHighlightIntensity(index, "right");
								const baseOpacity = getItemOpacity(index, "right");
								const baseX = getItemX(index, "right");

								return (
									<div
										key={index}
										style={{
											opacity: baseOpacity,
											transform: `translateX(${baseX}px) scale(${highlighted ? 1 + intensity * 0.02 : 1})`,
											fontSize: 32,
											lineHeight: 1.6,
											padding: 24,
											backgroundColor: highlighted
												? `rgba(59, 130, 246, ${0.2 + intensity * 0.2})`
												: "rgba(30, 41, 59, 0.7)",
											borderRadius: 12,
											borderLeft: highlighted
												? `4px solid rgba(96, 165, 250, ${intensity})`
												: "4px solid #3b82f6",
											boxShadow: highlighted
												? `0 0 ${intensity * 20}px rgba(96, 165, 250, ${intensity * 0.6}), 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)`
												: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
											transition: "all 0.2s ease",
										}}
									>
										{item}
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
