// Enhanced CodeSlide with spring animations and word-timing based highlighting
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig, spring, staticFile } from "remotion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useModuleTimings } from "../hooks/useModuleTimings";
import { PremiumSlideBackground, premiumSlideRootStyle } from "./PremiumSlideBackground";
import { premiumTheme } from "../theme/premiumTheme";

// Define when to highlight each line (as percentage of audio duration)
export interface LineCue {
	line: number;      // 1-based line number
	startPct: number;  // Start highlight at this % of audio (0-100)
	endPct: number;    // End highlight at this % of audio (0-100)
}

interface AnimatedCodeSlideProps {
	title: string;
	code: string;
	language?: string;
	slideName: string;
	audioStartFrame?: number;
	audioDuration?: number;
	/** Per-chunk durations for multi-audio code slides; word timings use offsets when present */
	audioChunkDurations?: number[];
	lineCues?: LineCue[];
	moduleNumber?: number; // Module number for loading timing data from JSON
	/** Show only this 1-based line range [start, end] for focused teaching */
	visibleLineRange?: [number, number];
	/** Max lines to show; window scrolls so the active line stays in view (focus mode) */
	maxVisibleLines?: number;
	/** File path or context (e.g. "index.ts") shown in window bar for student clarity */
	codeContext?: string;
}

export const AnimatedCodeSlide: React.FC<AnimatedCodeSlideProps> = ({
	title,
	code,
	language = "typescript",
	slideName,
	audioStartFrame = 0,
	audioDuration,
	lineCues,
	moduleNumber = 1,
	visibleLineRange,
	maxVisibleLines,
	codeContext,
}) => {
	const frame = useCurrentFrame();
	const { fps, width, height } = useVideoConfig();

	// Count code lines first (needed for calculations and rendering)
	// Fallback placeholder if code is empty (e.g. missing from moduleContent before regeneration)
	const codeToRender = (code && code.trim()) || "// Code not available - run activateCourse and generateModulesFromContent";
	const codeLines = codeToRender.trim().split("\n");
	const lineCount = codeLines.length;

	// Teaching snippets (typical lab slides): always show every line — ignore visibleLineRange.
	const TEACHING_SNIPPET_MAX_LINES = 24;
	const forceFullSnippet = lineCount > 0 && lineCount <= TEACHING_SNIPPET_MAX_LINES;

	// Slide-relative time for highlight and scroll (needed early for effectiveLineRange)
	const currentTimeSeconds = (frame - (audioStartFrame ?? 0)) / fps;
	const entranceTime = 0;
	const totalContentDurationForProgress = audioDuration != null && audioDuration > 0
		? audioDuration - entranceTime - 0.5
		: Math.max(0.1, lineCount * 3);
	const contentTimeForProgress = currentTimeSeconds - entranceTime;
	const progress = Math.min(1, Math.max(0, contentTimeForProgress / totalContentDurationForProgress));
	const currentLineIndex = Math.min(lineCount - 1, Math.floor(progress * (lineCount - 0.01)));

	// Layout constants (needed for effective line range and font calculation)
	const padding = 64;
	const headerHeight = 120;
	const windowBarHeight = 36;
	const codePadding = 48;
	const baseLineHeight = 1.15;
	const availableHeight = height - (padding * 2) - headerHeight - windowBarHeight - codePadding;

	// Max lines that fit at teaching min font (24px) so we never show unreadable tiny code
	const maxLinesThatFitAtMinFont = Math.max(8, Math.floor(availableHeight / (24 * baseLineHeight)));

	// Effective line range: visibleLineRange, or sliding window, or full (or auto window if too many lines)
	const effectiveLineRange: [number, number] = (() => {
		if (forceFullSnippet) {
			return [1, lineCount];
		}
		if (
			visibleLineRange &&
			Array.isArray(visibleLineRange) &&
			visibleLineRange.length === 2 &&
			typeof visibleLineRange[0] === "number" &&
			typeof visibleLineRange[1] === "number"
		) {
			const start = Math.max(1, visibleLineRange[0]);
			const end = Math.min(lineCount, visibleLineRange[1]);
			// Small teaching snippets (<=12 lines): always show the full block.
			// Stale visibleLineRange values (e.g. [1,6] on 8-line code) must not truncate.
			if (end < lineCount && lineCount <= 12) {
				return [1, lineCount];
			}
			return [start, end];
		}
		const maxLines = maxVisibleLines ?? (lineCount > maxLinesThatFitAtMinFont ? maxLinesThatFitAtMinFont : null);
		if (maxLines != null && lineCount > maxLines) {
			const half = Math.floor(maxLines / 2);
			let start = Math.max(1, currentLineIndex + 1 - half);
			let end = Math.min(lineCount, start + maxLines - 1);
			start = Math.max(1, end - maxLines + 1);
			return [start, end];
		}
		return [1, lineCount];
	})();
	const codeLinesDisplayed = forceFullSnippet
		? codeLines
		: codeLines.slice(effectiveLineRange[0] - 1, effectiveLineRange[1]);
	const codeToRenderDisplayed = codeLinesDisplayed.join("\n");

	// Available width for code text: subtract line numbers (~60px), horizontal padding (~64px)
	const availableCodeWidth = Math.min(1600, width - padding * 2) - 124;

	const baseFontSize = 38;
	// Teaching minimum: never shrink below 24px; use visible range or focus mode instead
	const minFontSize = 24;

	// Use displayed lines for layout so focus mode gets larger font
	const maxLineLengthDisplayed = codeLinesDisplayed.length > 0 ? Math.max(...codeLinesDisplayed.map((l) => l.length)) : 1;
	const charWidthEm = 0.6;
	const fontSizeForWidth = availableCodeWidth / (maxLineLengthDisplayed * charWidthEm);

	const charWidthRatio = 0.7;
	const safetyBuffer = 1.25;
	const estimateWrappedLines = (fs: number, lines: string[]) =>
		Math.ceil(
			lines.reduce(
				(sum, line) =>
					sum + Math.max(1, Math.ceil((line.length * charWidthRatio * fs) / availableCodeWidth)),
				0
			) * safetyBuffer
		);

	let fontSize = baseFontSize;
	for (; fontSize >= minFontSize; fontSize--) {
		const totalVisualLines = estimateWrappedLines(fontSize, codeLinesDisplayed);
		if (totalVisualLines * fontSize * baseLineHeight <= availableHeight) break;
	}
	if (fontSize < minFontSize) fontSize = minFontSize;

	fontSize = Math.min(fontSize, fontSizeForWidth, baseFontSize);
	if (fontSize < minFontSize) fontSize = minFontSize;

	let lineHeight = baseLineHeight;
	if (fontSize < 28) {
		const totalVisualLines = estimateWrappedLines(fontSize, codeLinesDisplayed);
		const maxLineHeight = availableHeight / (totalVisualLines * fontSize);
		lineHeight = Math.min(maxLineHeight, 1.3);
	}

	// Spring animation for title
	const titleSpring = spring({
		frame,
		fps,
		config: { damping: 12, stiffness: 100 },
		durationInFrames: fps * 0.6,
	});

	// Spring animation for code window
	const windowSpring = spring({
		frame,
		fps,
		config: { damping: 15, stiffness: 80 },
		delay: fps * 0.2,
		durationInFrames: fps * 0.7,
	});

	// Decorative spring
	const decorSpring = spring({
		frame,
		fps,
		config: { damping: 20, stiffness: 60 },
		delay: fps * 0.3,
	});

	// Get spring for each code line (staggered reveal)
	const getLineSpring = (lineIndex: number) => {
		const staggerDelay = fps * 0.06; // 60ms between lines
		const baseDelay = fps * 0.4;
		return spring({
			frame,
			fps,
			config: { damping: 18, stiffness: 100 },
			delay: baseDelay + lineIndex * staggerDelay,
			durationInFrames: fps * 0.35,
		});
	};

	// Load timings from per-module JSON file
	const { timings: moduleTimings } = useModuleTimings(moduleNumber);
	
	// Get word timings and line mappings for this slide
	const slideTimings = moduleTimings?.slides[slideName];
	const slideLineMappings = moduleTimings?.lineMappings[slideName];
	
	// Debug: log data loading and highlight timing
	if (frame < 2) {
		console.log(`[CodeSlide] ${slideName} mod=${moduleNumber}`, {
			words: slideTimings?.words?.length || 0,
			mappings: slideLineMappings?.length || 0,
			allMappingKeys: Object.keys(moduleTimings?.lineMappings || {}),
		});
		// Log the word ranges for debugging
		if (slideLineMappings?.length) {
			for (const m of slideLineMappings) {
				const startWord = slideTimings?.words?.[m.wordRange[0]];
				const endWord = slideTimings?.words?.[m.wordRange[1]];
				console.log(`  Line ${m.line}: words[${m.wordRange[0]}-${m.wordRange[1]}] = "${startWord?.text}"-"${endWord?.text}" @ ${startWord?.start?.toFixed(1)}s-${endWord?.end?.toFixed(1)}s`);
			}
		}
	}
	
	// Minimum highlight duration (seconds) so students can see which line is active without flicker
	const MIN_HIGHLIGHT_DURATION = 1.5;

	// Get highlight intensity for a line (0-based lineIndex)
	const getLineHighlight = (lineIndex: number): number => {
		const lineNumber = lineIndex + 1; // Convert to 1-based for mapping lookup
		if (currentTimeSeconds < entranceTime) return 0;

		// Helper: highlight from time range with min duration and smooth edges
		const highlightFromRange = (start: number, end: number): number => {
			const rawDuration = end - start;
			const minDuration = MIN_HIGHLIGHT_DURATION;
			const buffer = rawDuration < minDuration ? (minDuration - rawDuration) / 2 : 0.2;
			const adjustedStart = start - buffer;
			const adjustedEnd = end + buffer;
			if (currentTimeSeconds < adjustedStart) return 0;
			if (currentTimeSeconds > adjustedEnd) return 0.15; // subtle glow for passed lines
			const duration = adjustedEnd - adjustedStart;
			const p = (currentTimeSeconds - adjustedStart) / duration;
			if (p < 0.1) return interpolate(p, [0, 0.1], [0, 1]);
			if (p > 0.9) return interpolate(p, [0.9, 1], [1, 0.1]);
			return 1;
		};

		// Priority 1: Manual lineCues (author-defined)
		if (lineCues && lineCues.length > 0 && audioDuration && audioDuration > 0) {
			const currentPct = (currentTimeSeconds / audioDuration) * 100;
			const cue = lineCues.find((c) => c.line === lineNumber);
			if (cue) {
				if (currentPct < cue.startPct) return 0;
				if (currentPct > cue.endPct) return 0.1;
				const cueProgress = (currentPct - cue.startPct) / (cue.endPct - cue.startPct);
				if (cueProgress < 0.1) return interpolate(cueProgress, [0, 0.1], [0, 1]);
				if (cueProgress > 0.9) return interpolate(cueProgress, [0.9, 1], [1, 0.1]);
				return 1;
			}
		}

		// Priority 2: Word timings + line mappings (use even when sparse)
		if (slideLineMappings && slideLineMappings.length > 0 && slideTimings?.words?.length) {
			const mappingsForLine = slideLineMappings.filter((m) => m.line === lineNumber);
			if (mappingsForLine.length > 0) {
				let lineStartTime = Infinity;
				let lineEndTime = 0;
				for (const mapping of mappingsForLine) {
					const [startWordIdx, endWordIdx] = mapping.wordRange;
					const startWord = slideTimings.words[startWordIdx];
					const endWord = slideTimings.words[endWordIdx];
					if (startWord && endWord) {
						lineStartTime = Math.min(lineStartTime, startWord.start);
						lineEndTime = Math.max(lineEndTime, endWord.end);
					}
				}
				if (lineStartTime !== Infinity) return highlightFromRange(lineStartTime, lineEndTime);
			}
			// Unmapped line: use time-based current line so one line is always clearly indicated
			if (lineIndex === currentLineIndex) return 1;
			if (lineIndex < currentLineIndex) return 0.08;
			return 0;
		}

		// Priority 3: No mappings - strong time-based "current line" fallback
		if (audioDuration && audioDuration > 0) {
			if (lineIndex === currentLineIndex) return 1;
			if (lineIndex < currentLineIndex) return 0.08;
			return 0;
		}

		return 0;
	};

	// Title transforms
	const titleOpacity = titleSpring;
	const titleY = interpolate(titleSpring, [0, 1], [25, 0]);

	// Window transforms  
	const windowOpacity = windowSpring;
	const windowScale = interpolate(windowSpring, [0, 1], [0.96, 1]);
	const windowY = interpolate(windowSpring, [0, 1], [20, 0]);

	// Get highlight style for a specific line number (1-based)
	const getLineStyle = (lineNumber: number): React.CSSProperties => {
		const lineIndex = lineNumber - 1; // Convert to 0-based
		const intensity = getLineHighlight(lineIndex);
		
		if (intensity < 0.05) {
			return {}; // No highlight
		}

		// Add subtle breathing effect for active lines
		const isActive = intensity > 0.5;
		const breathe = isActive ? Math.sin(frame / 12) * 0.1 : 0;
		const glowIntensity = intensity * 0.8 + breathe;

		return {
			backgroundColor: `rgba(59, 130, 246, ${intensity * 0.25})`,
			borderLeft: `4px solid rgba(96, 165, 250, ${intensity})`,
			boxShadow: `0 0 ${glowIntensity * 20}px rgba(96, 165, 250, ${glowIntensity * 0.7}), inset 0 0 ${glowIntensity * 10}px rgba(59, 130, 246, ${glowIntensity * 0.2})`,
			borderRadius: "4px",
			paddingLeft: "12px",
			marginLeft: "-12px",
			paddingRight: "4px",
		};
	};

	// Using spring-based animations defined above
	const codeOpacity = windowOpacity;
	const codeY = windowY;

	return (
		<div
			style={{
				...premiumSlideRootStyle,
				display: "flex",
				flexDirection: "column",
				padding: 64,
				boxSizing: "border-box",
			}}
		>
			<PremiumSlideBackground decorProgress={decorSpring} />

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
						gap: 20,
					}}
				>
					{/* Show VPC icon for VPC-related code with spring animation */}
					{slideName === "typescriptCode" && (
						<img
							src={staticFile("assets/vpc.svg")}
							alt="VPC"
							style={{
								width: 64,
								height: 64,
								opacity: titleSpring,
								transform: `translateY(${titleY}px) scale(${interpolate(titleSpring, [0, 1], [0.5, 1]) * (1 + Math.sin(frame / 20) * 0.03)})`,
								filter: `drop-shadow(0 0 ${15 + Math.sin(frame / 25) * 8}px rgba(59, 130, 246, 0.5))`,
							}}
						/>
					)}
					<h2
						style={{
							fontSize: 62,
							margin: 0,
							flex: 1,
							opacity: titleOpacity,
							transform: `translateY(${titleY}px) scale(${1 + Math.sin(frame / 70) * 0.002})`,
							fontWeight: 700,
							letterSpacing: -0.01,
							color: "#ffffff",
							filter: `drop-shadow(0 0 ${10 + Math.sin(frame / 40) * 3}px rgba(56, 189, 248, 0.3))`,
						}}
					>
						{title}
					</h2>
				</div>

				{/* Code (single-card full-width layout) */}
				<div
					style={{
						flex: 1,
						display: "flex",
						flexDirection: "column",
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
							borderRadius: premiumTheme.radius.card,
							overflow: "hidden",
							border: `1px solid ${premiumTheme.colors.codeBorder}`,
							backgroundColor: premiumTheme.colors.codePanel,
							boxShadow: premiumTheme.shadow.svgFrame,
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
							{codeContext && (
								<span
									style={{
										marginLeft: "auto",
										marginRight: 16,
										fontSize: 14,
										color: premiumTheme.colors.accentBlueMuted,
										fontFamily: "monospace",
										padding: "4px 10px",
										background: "rgba(59, 130, 246, 0.12)",
										borderRadius: 6,
									}}
								>
									{codeContext}
								</span>
							)}
						</div>

						<div style={{
							flex: 1,
							overflow: "hidden",
							minHeight: 0,
							maxHeight: "100%",
							display: "flex",
							flexDirection: "column",
							alignItems: "flex-start",
						}}>
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
									overflow: "hidden",
									fontWeight: 400,
									WebkitFontSmoothing: "antialiased",
									MozOsxFontSmoothing: "grayscale",
									textRendering: "optimizeLegibility",
									color: "#e5e7eb",
									whiteSpace: "pre-wrap",
									wordWrap: "break-word",
									overflowWrap: "break-word",
								}}
								codeTagProps={{
									style: {
										lineHeight: lineHeight.toString(),
									},
								}}
								showLineNumbers
								startingLineNumber={effectiveLineRange[0]}
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
									return { style };
								}}
							>
								{codeToRenderDisplayed}
							</SyntaxHighlighter>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
