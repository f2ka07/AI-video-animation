// Sequential Bullet Slide - Shows one bullet point at a time with transitions
// Perfect for traditional presentation style with larger text
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig, spring, staticFile } from "remotion";
import { useModuleTimings } from "../hooks/useModuleTimings";

interface SequentialBulletSlideProps {
	title: string;
	points: string[];
	slideName: string;
	moduleNumber?: number;
	audioDuration?: number;
	svgPath?: string; // Optional SVG to show on the right side
	transitionDuration?: number; // Duration of transition between points (default 1 second)
}

export const SequentialBulletSlide: React.FC<SequentialBulletSlideProps> = ({
	title,
	points,
	slideName,
	moduleNumber = 1,
	audioDuration,
	svgPath,
	transitionDuration = 1.0,
}) => {
	const frame = useCurrentFrame();
	const { fps, width, height } = useVideoConfig();
	const { timings } = useModuleTimings(moduleNumber);

	// Get word timings for this slide
	const slideTimings = timings?.slides[slideName];
	const words = slideTimings?.words || [];

	// Calculate which bullet point should be shown based on word timings
	const currentTimeSeconds = frame / fps;
	
	// Map each bullet point to word ranges
	// If we have word timings, use them; otherwise distribute evenly
	const getPointTimeRange = (pointIndex: number): { start: number; end: number } => {
		if (!audioDuration || audioDuration <= 0) {
			// Fallback: distribute evenly
			const timePerPoint = 10; // Default 10 seconds per point
			return {
				start: pointIndex * timePerPoint,
				end: (pointIndex + 1) * timePerPoint,
			};
		}

		if (words.length === 0) {
			// No word timings: distribute evenly across audio duration
			const timePerPoint = audioDuration / points.length;
			return {
				start: pointIndex * timePerPoint,
				end: (pointIndex + 1) * timePerPoint,
			};
		}

		// Use word timings to map points
		// Assume points are roughly evenly distributed across words
		const wordsPerPoint = Math.ceil(words.length / points.length);
		const startWordIndex = pointIndex * wordsPerPoint;
		const endWordIndex = Math.min((pointIndex + 1) * wordsPerPoint - 1, words.length - 1);

		const startWord = words[startWordIndex];
		const endWord = words[endWordIndex];

		if (startWord && endWord) {
			return {
				start: startWord.start,
				end: endWord.end,
			};
		}

		// Fallback
		const timePerPoint = audioDuration / points.length;
		return {
			start: pointIndex * timePerPoint,
			end: (pointIndex + 1) * timePerPoint,
		};
	};

	// Find current active point (the one being discussed)
	let activePointIndex = 0;
	for (let i = 0; i < points.length; i++) {
		const range = getPointTimeRange(i);
		if (currentTimeSeconds >= range.start) {
			activePointIndex = i;
		}
		if (currentTimeSeconds >= range.end) {
			activePointIndex = i;
		}
	}

	// Bullets stay after discussed: show all points 0..activePointIndex, plus next one fading in
	const currentRange = getPointTimeRange(activePointIndex);
	const timeInRange = currentTimeSeconds - currentRange.start;
	const rangeDuration = currentRange.end - currentRange.start;
	const transitionFrames = fps * transitionDuration;
	const fadeInEnd = transitionFrames;
	const fadeOutStart = (rangeDuration * fps) - transitionFrames;
	const currentFrameInRange = timeInRange * fps;
	const nextPointIndex = activePointIndex + 1;

	// Opacity for next point (if transitioning in)
	const nextOpacity = nextPointIndex < points.length && currentFrameInRange > fadeOutStart
		? interpolate(currentFrameInRange, [fadeOutStart, rangeDuration * fps], [0, 1], {
				extrapolateLeft: "clamp",
			})
		: 0;

	// Spring animations
	const titleSpring = spring({
		frame,
		fps,
		config: { damping: 12, stiffness: 100 },
		durationInFrames: fps * 0.6,
	});

	// Left side only: use ~50% of width for bullets, right side for diagram or empty
	const hasSvg = !!svgPath;
	const leftWidth = hasSvg ? "50%" : "55%";
	const padding = hasSvg ? { top: 80, right: 60, bottom: 80, left: 80 } : { top: 80, right: 80, bottom: 80, left: 80 };
	const titleAreaHeight = 120;
	const availableHeight = height - (typeof padding === 'number' ? padding * 2 : padding.top + padding.bottom) - titleAreaHeight;
	const visibleCount = activePointIndex + 1 + (nextOpacity > 0 ? 1 : 0);
	const pointFontSize = Math.min(42, Math.max(24, availableHeight / Math.max(visibleCount, 1) / 1.8));
	const titleFontSize = Math.min(72, Math.max(40, 56));

	// Camera movements
	const cameraZoom = 1 + Math.sin(frame / 140) * 0.01;
	const cameraPanX = Math.sin(frame / 160) * 4;
	const cameraPanY = Math.cos(frame / 200) * 3;

	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				flex: 1,
				background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
				color: "white",
				display: "flex",
				flexDirection: "row",
				padding: hasSvg ? "80px 60px 80px 80px" : 80,
				gap: hasSvg ? 60 : 0,
				fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
				position: "relative",
				overflow: "hidden",
				transform: `scale(${cameraZoom}) translate(${cameraPanX}px, ${cameraPanY}px)`,
				transformOrigin: "center center",
			}}
		>
			{/* Background effects */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					opacity: 0.04 + Math.sin(frame / 60) * 0.02,
					backgroundImage: `radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)`,
					backgroundSize: "40px 40px",
					transform: `translateY(${Math.sin(frame / 100) * 8}px)`,
				}}
			/>
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: `radial-gradient(ellipse at ${50 + Math.sin(frame / 80) * 20}% ${50 + Math.cos(frame / 60) * 15}%, rgba(59, 130, 246, 0.12) 0%, transparent 50%)`,
					pointerEvents: "none",
				}}
			/>

			{/* Left side: Content (bullets stay after discussed) */}
			<div style={{ width: leftWidth, display: "flex", flexDirection: "column", justifyContent: "flex-start", position: "relative", zIndex: 1, gap: 16 }}>
				{/* Title */}
				<h2
					style={{
						fontSize: titleFontSize,
						margin: 0,
						marginBottom: 24,
						opacity: titleSpring,
						transform: `translateY(${interpolate(titleSpring, [0, 1], [30, 0])}px)`,
						fontWeight: 800,
						color: "#ffffff",
						letterSpacing: "-0.02em",
						lineHeight: 1.2,
					}}
				>
					{title}
				</h2>

				{/* Bullets 0..activePointIndex (stay visible after discussed) */}
				{points.slice(0, activePointIndex + 1).map((point, idx) => (
					<div
						key={idx}
						style={{
							display: "flex",
							alignItems: "flex-start",
							gap: 16,
							padding: "16px 24px",
							backgroundColor: idx === activePointIndex ? "rgba(59, 130, 246, 0.25)" : "rgba(59, 130, 246, 0.12)",
							borderRadius: 12,
							borderLeft: `4px solid ${idx === activePointIndex ? "#3b82f6" : "rgba(59, 130, 246, 0.6)"}`,
							boxShadow: idx === activePointIndex ? `0 0 20px rgba(59, 130, 246, 0.4)` : "none",
						}}
					>
						<div
							style={{
								width: 12,
								height: 12,
								backgroundColor: idx === activePointIndex ? "#60a5fa" : "rgba(96, 165, 250, 0.7)",
								borderRadius: "50%",
								marginTop: 6,
								flexShrink: 0,
							}}
						/>
						<p
							style={{
								fontSize: pointFontSize,
								margin: 0,
								lineHeight: 1.5,
								flex: 1,
								color: "#f1f5f9",
								fontWeight: idx === activePointIndex ? 600 : 500,
							}}
						>
							{point}
						</p>
					</div>
				))}

				{/* Next bullet (fading in) */}
				{nextPointIndex < points.length && nextOpacity > 0 && (
					<div
						style={{
							opacity: nextOpacity,
							display: "flex",
							alignItems: "flex-start",
							gap: 16,
							padding: "16px 24px",
							backgroundColor: "rgba(59, 130, 246, 0.2)",
							borderRadius: 12,
							borderLeft: "4px solid #3b82f6",
						}}
					>
						<div
							style={{
								width: 12,
								height: 12,
								backgroundColor: "#60a5fa",
								borderRadius: "50%",
								marginTop: 6,
								flexShrink: 0,
							}}
						/>
						<p
							style={{
								fontSize: pointFontSize,
								margin: 0,
								lineHeight: 1.5,
								flex: 1,
								color: "#f1f5f9",
								fontWeight: 500,
							}}
						>
							{points[nextPointIndex]}
						</p>
					</div>
				)}

				{/* Progress indicator */}
				<div
					style={{
						marginTop: 60,
						display: "flex",
						gap: 12,
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					{points.map((_, index) => (
						<div
							key={index}
							style={{
								width: index === activePointIndex ? 24 : 8,
								height: 8,
								backgroundColor: index === activePointIndex ? "#3b82f6" : "rgba(59, 130, 246, 0.3)",
								borderRadius: 4,
								transition: "all 0.3s ease",
								boxShadow: index === activePointIndex ? `0 0 ${12}px rgba(59, 130, 246, 0.6)` : "none",
							}}
						/>
					))}
				</div>
			</div>

			{/* Right side: SVG */}
			{svgPath && (
				<div
					style={{
						flex: 1,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						position: "relative",
						borderRadius: 24,
						overflow: "hidden",
						background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
						boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(59, 130, 246, 0.2)",
					}}
				>
					<img
						src={staticFile(svgPath)}
						alt=""
						style={{
							width: "100%",
							height: "100%",
							objectFit: "contain",
							padding: 40,
						}}
					/>
				</div>
			)}
		</div>
	);
};
