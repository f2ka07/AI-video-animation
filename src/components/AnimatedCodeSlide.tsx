// Enhanced CodeSlide with animation cues synchronized to audio
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { getActiveCues, AnimationCue } from "../utils/animationCues";
import { buildCuesFromTimings } from "../utils/buildCuesFromTimings";
import { wordTimings, lineMappings } from "../utils/wordTimings";

interface AnimatedCodeSlideProps {
	title: string;
	code: string;
	language?: string;
	slideName: string; // e.g., "workflow", "initCode", "typescriptCode"
	audioStartFrame?: number; // Frame when audio starts (for sync)
}

export const AnimatedCodeSlide: React.FC<AnimatedCodeSlideProps> = ({
	title,
	code,
	language = "typescript",
	slideName,
	audioStartFrame = 0,
}) => {
	const frame = useCurrentFrame();
	const { fps, width, height } = useVideoConfig();

	// Calculate current audio time in seconds
	// Frame is relative to sequence start, so we can use it directly
	// But we need to account for any fade-in delay if audio starts later
	const currentAudioTime = Math.max(0, frame / fps);

	// Count code lines first (needed for calculations and rendering)
	const codeLines = code.trim().split("\n");
	const lineCount = codeLines.length;

	// Calculate available space for code
	// Canvas: 1920x1080
	// Padding: 64px all around = 128px total vertical
	// Header (title + margin): ~120px
	// Window bar: 36px
	// Code padding: 24px top + 24px bottom = 48px
	const padding = 64;
	const headerHeight = 120; // Title + margins
	const windowBarHeight = 36;
	const codePadding = 48;
	const availableHeight = height - (padding * 2) - headerHeight - windowBarHeight - codePadding;

	// Calculate optimal font size to fit all lines
	// Base line height: 1.15
	// We want: lineCount * fontSize * 1.15 <= availableHeight
	const baseFontSize = 38;
	const baseLineHeight = 1.15;
	const requiredHeight = lineCount * baseFontSize * baseLineHeight;
	
	let fontSize = baseFontSize;
	let lineHeight = baseLineHeight;
	
	// If code doesn't fit, scale down proportionally
	if (requiredHeight > availableHeight) {
		const scale = availableHeight / requiredHeight;
		fontSize = Math.floor(baseFontSize * scale);
		lineHeight = baseLineHeight; // Keep line height ratio
		
		// Ensure minimum readable size (at least 24px)
		if (fontSize < 24) {
			fontSize = 24;
			// Recalculate line height to fit
			const maxLineHeight = availableHeight / (lineCount * fontSize);
			lineHeight = Math.min(maxLineHeight, 1.3); // Cap at 1.3 for readability
		}
	}

	// Get active animation cues for this moment
	const activeCues = getActiveCues(slideName, currentAudioTime);

	// Cache for all cues (to find next highlight)
	const cueCache: Record<string, AnimationCue[]> = {};
	const fallbackCues: Record<string, AnimationCue[]> = {
		initCode: [
			{ startTime: 2.5, endTime: 4.5, type: "highlight", target: "line-2", effect: "glow" },
			{ startTime: 5.0, endTime: 7.0, type: "highlight", target: "line-5", effect: "glow" },
			{ startTime: 7.0, endTime: 9.0, type: "highlight", target: "line-6", effect: "glow" },
			{ startTime: 9.0, endTime: 11.0, type: "highlight", target: "line-7", effect: "glow" },
			{ startTime: 11.0, endTime: 13.0, type: "highlight", target: "line-8", effect: "glow" },
		],
		typescriptCode: [
			{ startTime: 2.0, endTime: 4.0, type: "highlight", target: "line-1", effect: "glow" },
			{ startTime: 4.5, endTime: 6.5, type: "highlight", target: "line-4", effect: "glow" },
			{ startTime: 6.5, endTime: 8.5, type: "highlight", target: "line-5", effect: "glow" },
			{ startTime: 8.5, endTime: 10.0, type: "highlight", target: "line-6", effect: "glow" },
			{ startTime: 10.0, endTime: 11.5, type: "highlight", target: "line-7", effect: "glow" },
			{ startTime: 11.5, endTime: 13.5, type: "highlight", target: "line-8", effect: "glow" },
			{ startTime: 15.0, endTime: 17.0, type: "highlight", target: "line-15", effect: "glow" },
		],
	};

	// Get all cues for this slide to find next highlight
	const getAllCues = (): AnimationCue[] => {
		if (!cueCache[slideName]) {
			const timings = wordTimings[slideName];
			const mappings = lineMappings[slideName];
			if (timings?.words.length && mappings?.length) {
				cueCache[slideName] = buildCuesFromTimings(slideName, timings.words, mappings);
			} else {
				cueCache[slideName] = fallbackCues[slideName] || [];
			}
		}
		return cueCache[slideName] || [];
	};

	// Get highlight style for a specific line number (1-based)
	const getLineStyle = (lineNumber: number): React.CSSProperties => {
		const lineIndex = lineNumber - 1; // Convert to 0-based
		const allCues = getAllCues();
		
		// Find the current cue for this line
		const cue = allCues.find((c) => {
			if (c.type !== "highlight") return false;
			const targetLine = parseInt(c.target.replace("line-", ""));
			return targetLine === lineNumber && currentAudioTime >= c.startTime;
		});

		if (!cue) {
			return {}; // No highlight
		}

		// Find the next cue (for any line) to know when to fade out
		const nextCue = allCues
			.filter((c) => c.type === "highlight" && c.startTime > currentAudioTime)
			.sort((a, b) => a.startTime - b.startTime)[0];

		// Keep highlight visible until next highlight starts (or end of cue if no next)
		const effectiveEndTime = nextCue ? nextCue.startTime : cue.endTime;
		
		// Add delay before overlay appears (0.15 seconds)
		const delay = 0.15;
		const adjustedStartTime = cue.startTime + delay;
		const adjustedEndTime = effectiveEndTime; // Don't fade out early - keep until next highlight
		
		// Only show highlight if we're past the delay
		if (currentAudioTime < adjustedStartTime || currentAudioTime > adjustedEndTime) {
			return {}; // No highlight yet or already past
		}
		
		// Calculate intensity - fade in smoothly, stay at full intensity, fade out only if next highlight is starting
		const fadeInDuration = 0.2; // 0.2s fade in
		const fadeOutDuration = nextCue ? 0.1 : 0; // Quick fade out only if next highlight is starting
		const fadeOutStart = adjustedEndTime - fadeOutDuration;
		
		let intensity = 1;
		if (currentAudioTime < adjustedStartTime + fadeInDuration) {
			// Fade in
			const progress = (currentAudioTime - adjustedStartTime) / fadeInDuration;
			intensity = interpolate(progress, [0, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
		} else if (nextCue && currentAudioTime > fadeOutStart) {
			// Fade out only if next highlight is starting
			const progress = (currentAudioTime - fadeOutStart) / fadeOutDuration;
			intensity = interpolate(progress, [0, 1], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
		}

		const effect = cue.effect || "glow";
		const glowIntensity = effect === "glow" ? intensity * 0.8 : 0;

		// More visible highlight with better contrast
		return {
			backgroundColor: `rgba(59, 130, 246, ${intensity * 0.3})`,
			borderLeft: `4px solid rgba(96, 165, 250, ${intensity})`,
			boxShadow: glowIntensity > 0
				? `0 0 ${glowIntensity * 25}px rgba(96, 165, 250, ${glowIntensity * 0.8}), inset 0 0 ${glowIntensity * 15}px rgba(59, 130, 246, ${glowIntensity * 0.3})`
				: `inset 0 0 10px rgba(59, 130, 246, ${intensity * 0.2})`,
			borderRadius: "4px",
			paddingLeft: "12px",
			marginLeft: "-12px",
			paddingRight: "4px",
			transition: "all 0.1s ease",
		};
	};

	const titleOpacity = interpolate(frame, [0, fps * 0.25], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const titleY = interpolate(frame, [0, fps * 0.25], [20, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const codeOpacity = interpolate(frame, [fps * 0.1, fps * 0.3], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const codeY = interpolate(frame, [fps * 0.1, fps * 0.3], [20, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	// Render code with line-by-line highlighting
	const renderCodeWithHighlights = () => {
		return codeLines.map((line, index) => {
			const highlighted = isLineHighlighted(index);
			const intensity = getHighlightIntensity(index);
			const effect = getLineEffect(index);

			// Calculate glow/scale based on effect type
			const glowIntensity = effect === "glow" ? intensity * 0.8 : 0;
			const scale = effect === "scale" ? 1 + intensity * 0.02 : 1;
			const pulse = effect === "pulse" ? Math.sin(currentAudioTime * 4) * 0.5 + 0.5 : 0;

			return (
				<div
					key={index}
					style={{
						position: "relative",
						padding: "2px 0",
						transform: `scale(${scale})`,
						transformOrigin: "left center",
						transition: "all 0.2s ease",
					}}
				>
					{/* Highlight background */}
					{highlighted && (
						<div
							style={{
								position: "absolute",
								left: -32,
								right: -32,
								top: 0,
								bottom: 0,
								backgroundColor: `rgba(59, 130, 246, ${intensity * 0.15})`,
								borderLeft: `3px solid rgba(59, 130, 246, ${intensity * 0.8})`,
								boxShadow: glowIntensity > 0
									? `0 0 ${glowIntensity * 20}px rgba(59, 130, 246, ${glowIntensity * 0.6})`
									: "none",
								borderRadius: "4px",
								zIndex: 0,
							}}
						/>
					)}
					{/* Callout arrow */}
					{highlighted && activeCues.some(c => c.effect === "arrow") && (
						<div
							style={{
								position: "absolute",
								left: -50,
								top: "50%",
								transform: "translateY(-50%)",
								opacity: intensity,
								zIndex: 1,
							}}
						>
							<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
								<path
									d="M13 7L18 12L13 17"
									stroke="#3b82f6"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<circle cx="12" cy="12" r="8" stroke="#3b82f6" strokeWidth="1" fill="none" opacity="0.3" />
							</svg>
						</div>
					)}
					<span style={{ position: "relative", zIndex: 1 }}>{line}</span>
				</div>
			);
		}).join("\n");
	};

	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				flex: 1,
				background: "radial-gradient(circle at top left, #020617 0%, #020617 45%, #000000 100%)",
				color: "white",
				display: "flex",
				flexDirection: "column",
				padding: 64,
				boxSizing: "border-box",
				fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
				position: "relative",
			}}
		>
			{/* Top accent */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					height: 4,
					background: "linear-gradient(90deg, #38bdf8 0%, #6366f1 50%, #22c55e 100%)",
					opacity: 0.9,
				}}
			/>

			{/* Subtle texture */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					opacity: 0.06,
					backgroundImage: "radial-gradient(circle at 1px 1px, #1f2937 1px, transparent 0)",
					backgroundSize: "28px 28px",
				}}
			/>

			<div
				style={{
					position: "relative",
					zIndex: 1,
					display: "flex",
					flexDirection: "column",
					height: "100%",
					maxWidth: 1700,
					margin: "0 auto",
					overflow: "hidden",
				}}
			>
				{/* Header */}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						marginBottom: 24,
						flexShrink: 0,
					}}
				>
					<h2
						style={{
							fontSize: 62,
							margin: 0,
							flex: 1,
							opacity: titleOpacity,
							transform: `translateY(${titleY}px)`,
							fontWeight: 700,
							letterSpacing: -0.01,
							color: "#e5e7eb",
						}}
					>
						{title}
					</h2>
				</div>

				{/* Code */}
				<div
					style={{
						flex: 1,
						display: "flex",
						alignItems: "stretch",
						minHeight: 0,
						overflow: "hidden",
					}}
				>
					<div
						style={{
							flex: 1,
							maxWidth: 1600,
							opacity: codeOpacity,
							transform: `translateY(${codeY}px)`,
							borderRadius: 16,
							overflow: "hidden",
							border: "1px solid rgba(148, 163, 184, 0.35)",
							backgroundColor: "#020617",
							boxShadow: "0 22px 44px rgba(15, 23, 42, 0.95), 0 0 0 1px rgba(15,23,42,0.8)",
							display: "flex",
							flexDirection: "column",
							maxHeight: "100%",
						}}
					>
						{/* Window bar */}
						<div
							style={{
								height: 36,
								background: "linear-gradient(90deg, #020617 0%, #111827 100%)",
								borderBottom: "1px solid rgba(51, 65, 85, 0.9)",
								display: "flex",
								alignItems: "center",
								paddingLeft: 16,
								gap: 6,
							}}
						>
							<div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#f97373" }} />
							<div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#facc15" }} />
							<div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#22c55e" }} />
							<span
								style={{
									marginLeft: 14,
									fontSize: 18,
									color: "#9ca3af",
									textTransform: "uppercase",
									letterSpacing: 1.2,
								}}
							>
								{language}
							</span>
						</div>

						<div style={{ flex: 1, overflow: "hidden", minHeight: 0, maxHeight: "100%", display: "flex", alignItems: "center" }}>
							<SyntaxHighlighter
								language={language}
								style={vscDarkPlus}
								customStyle={{
									margin: 0,
									padding: "24px 32px 24px 32px",
									fontSize: fontSize,
									lineHeight: lineHeight.toString(),
									backgroundColor: "#020617",
									fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
									overflowX: "visible",
									overflowY: "visible",
									fontWeight: 400,
									WebkitFontSmoothing: "antialiased",
									MozOsxFontSmoothing: "grayscale",
									textRendering: "optimizeLegibility",
									color: "#e5e7eb",
									maxHeight: `${availableHeight}px`,
								}}
								codeTagProps={{
									style: {
										lineHeight: lineHeight.toString(),
									},
								}}
								showLineNumbers
								lineNumberStyle={{
									fontSize: fontSize,
									paddingRight: 24,
									color: "#6b7280",
									fontWeight: 400,
									lineHeight: lineHeight.toString(),
								}}
								wrapLines
								lineProps={(lineNumber: number) => {
									const style = getLineStyle(lineNumber);
									return {
										style: style,
									};
								}}
							>
								{code.trim()}
							</SyntaxHighlighter>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
