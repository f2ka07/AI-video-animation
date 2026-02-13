// SVG Sequential Slide - One bullet at a time with full SVG on right
// Perfect for your SVG-based slides with larger text
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig, spring, staticFile, Img } from "remotion";
import { useModuleTimings } from "../hooks/useModuleTimings";

interface SvgSequentialSlideProps {
	title: string;
	points: string[];
	svgPath: string; // Your existing SVG file path
	slideName: string;
	moduleNumber?: number;
	audioDuration?: number;
	transitionDuration?: number;
}

export const SvgSequentialSlide: React.FC<SvgSequentialSlideProps> = ({
	title,
	points,
	svgPath,
	slideName,
	moduleNumber = 1,
	audioDuration,
	transitionDuration = 1.0,
}) => {
	const frame = useCurrentFrame();
	const { fps, width, height } = useVideoConfig();
	const { timings } = useModuleTimings(moduleNumber);

	// Get word timings
	const slideTimings = timings?.slides[slideName];
	const words = slideTimings?.words || [];

	// Calculate which point to show
	const currentTimeSeconds = frame / fps;
	
	const getPointTimeRange = (pointIndex: number): { start: number; end: number } => {
		if (!audioDuration || audioDuration <= 0) {
			const timePerPoint = 10;
			return {
				start: pointIndex * timePerPoint,
				end: (pointIndex + 1) * timePerPoint,
			};
		}

		if (words.length === 0) {
			const timePerPoint = audioDuration / points.length;
			return {
				start: pointIndex * timePerPoint,
				end: (pointIndex + 1) * timePerPoint,
			};
		}

		// Use word timings
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

		const timePerPoint = audioDuration / points.length;
		return {
			start: pointIndex * timePerPoint,
			end: (pointIndex + 1) * timePerPoint,
		};
	};

	// Find active point
	let activePointIndex = 0;
	for (let i = 0; i < points.length; i++) {
		const range = getPointTimeRange(i);
		if (currentTimeSeconds >= range.start && currentTimeSeconds < range.end) {
			activePointIndex = i;
			break;
		}
		if (currentTimeSeconds >= range.end) {
			activePointIndex = i;
		}
	}

	// Transition progress
	const currentRange = getPointTimeRange(activePointIndex);
	const timeInRange = currentTimeSeconds - currentRange.start;
	const rangeDuration = currentRange.end - currentRange.start;
	
	const transitionFrames = fps * transitionDuration;
	const fadeInEnd = transitionFrames;
	const fadeOutStart = (rangeDuration * fps) - transitionFrames;
	
	const currentFrameInRange = timeInRange * fps;
	
	let currentOpacity = 1;
	if (currentFrameInRange < fadeInEnd) {
		currentOpacity = interpolate(currentFrameInRange, [0, fadeInEnd], [0, 1], {
			extrapolateRight: "clamp",
		});
	} else if (currentFrameInRange > fadeOutStart) {
		currentOpacity = interpolate(currentFrameInRange, [fadeOutStart, rangeDuration * fps], [1, 0], {
			extrapolateLeft: "clamp",
		});
	}

	const nextPointIndex = activePointIndex + 1;
	const nextOpacity = nextPointIndex < points.length && currentFrameInRange > fadeOutStart
		? interpolate(currentFrameInRange, [fadeOutStart, rangeDuration * fps], [0, 1], {
				extrapolateLeft: "clamp",
			})
		: 0;

	// Animations
	const titleSpring = spring({
		frame,
		fps,
		config: { damping: 12, stiffness: 100 },
		durationInFrames: fps * 0.6,
	});

	const pointSpring = spring({
		frame: Math.max(0, frame - activePointIndex * fps * 2),
		fps,
		config: { damping: 14, stiffness: 90 },
		durationInFrames: fps * 0.5,
	});

	const svgSpring = spring({
		frame,
		fps,
		config: { damping: 15, stiffness: 80 },
		delay: fps * 0.2,
		durationInFrames: fps * 0.7,
	});

	// Font sizes - much larger since only one point
	const leftWidth = width * 0.5;
	const padding = 80;
	const titleAreaHeight = 150;
	const availableHeight = height - padding * 2 - titleAreaHeight;
	
	const titleFontSize = Math.min(72, Math.max(40, (leftWidth - padding * 2) / title.length * 0.6));
	const pointFontSize = Math.min(64, Math.max(36, availableHeight / 3));

	// Camera movements
	const cameraZoom = 1 + Math.sin(frame / 140) * 0.01;
	const cameraPanX = Math.sin(frame / 160) * 4;
	const cameraPanY = Math.cos(frame / 200) * 3;

	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "row",
				background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
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

			{/* Left: Content */}
			<div
				style={{
					width: "50%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					padding: padding,
					position: "relative",
					zIndex: 1,
					borderRight: "2px solid rgba(59, 130, 246, 0.2)",
					justifyContent: "center",
				}}
			>
				<h2
					style={{
						fontSize: titleFontSize,
						margin: 0,
						marginBottom: 80,
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

				{/* Current point */}
				<div
					style={{
						opacity: currentOpacity,
						transform: `translateY(${interpolate(pointSpring, [0, 1], [40, 0])}px) scale(${interpolate(pointSpring, [0, 1], [0.95, 1])})`,
						display: "flex",
						alignItems: "flex-start",
						gap: 32,
						padding: "40px 48px",
						backgroundColor: "rgba(59, 130, 246, 0.2)",
						borderRadius: 20,
						borderLeft: "6px solid #3b82f6",
						boxShadow: `0 0 ${30 + Math.sin(frame / 20) * 15}px rgba(59, 130, 246, ${0.5 + Math.sin(frame / 25) * 0.3}), 0 12px 24px -8px rgba(0, 0, 0, 0.4)`,
						backdropFilter: "blur(10px)",
						minHeight: 200,
					}}
				>
					<div
						style={{
							width: 16,
							height: 16,
							backgroundColor: "#60a5fa",
							borderRadius: "50%",
							marginTop: 8,
							flexShrink: 0,
							boxShadow: `0 0 ${20 + Math.sin(frame / 15) * 10}px rgba(96, 165, 250, ${0.7 + Math.sin(frame / 20) * 0.3})`,
						}}
					/>
					<p
						style={{
							fontSize: pointFontSize,
							margin: 0,
							lineHeight: 1.6,
							flex: 1,
							color: "#f1f5f9",
							fontWeight: 500,
						}}
					>
						{points[activePointIndex]}
					</p>
				</div>

				{/* Next point (fading in) */}
				{nextPointIndex < points.length && nextOpacity > 0 && (
					<div
						style={{
							opacity: nextOpacity,
							transform: `translateY(${interpolate(nextOpacity, [0, 1], [40, 0])}px) scale(${interpolate(nextOpacity, [0, 1], [0.95, 1])})`,
							display: "flex",
							alignItems: "flex-start",
							gap: 32,
							padding: "40px 48px",
							backgroundColor: "rgba(59, 130, 246, 0.2)",
							borderRadius: 20,
							borderLeft: "6px solid #3b82f6",
							boxShadow: `0 0 ${30}px rgba(59, 130, 246, ${0.5 * nextOpacity}), 0 12px 24px -8px rgba(0, 0, 0, 0.4)`,
							backdropFilter: "blur(10px)",
							marginTop: 40,
							minHeight: 200,
						}}
					>
						<div
							style={{
								width: 16,
								height: 16,
								backgroundColor: "#60a5fa",
								borderRadius: "50%",
								marginTop: 8,
								flexShrink: 0,
								boxShadow: `0 0 ${20}px rgba(96, 165, 250, ${0.7 * nextOpacity})`,
							}}
						/>
						<p
							style={{
								fontSize: pointFontSize,
								margin: 0,
								lineHeight: 1.6,
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

			{/* Right: Full SVG */}
			<div
				style={{
					width: "50%",
					height: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					position: "relative",
					opacity: svgSpring,
					transform: `translateX(${interpolate(svgSpring, [0, 1], [40, 0])}px) scale(${interpolate(svgSpring, [0, 1], [0.95, 1])})`,
					background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
				}}
			>
				<Img
					src={staticFile(svgPath)}
					style={{
						width: "100%",
						height: "100%",
						objectFit: "contain",
						padding: 40,
						filter: `drop-shadow(0 0 ${30 * svgSpring}px rgba(59, 130, 246, 0.3))`,
					}}
				/>
			</div>
		</div>
	);
};
