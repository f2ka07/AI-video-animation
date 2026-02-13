// Bullets on left, code snippet on right with provenance context
// Use when explaining code flow so students see both the explanation and the code

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useModuleTimings } from "../hooks/useModuleTimings";
import { calculateFontSizeForMultiple, calculateOptimalFontSize } from "../utils/textSizing";

interface BulletsAndCodeSlideProps {
	title: string;
	points: string[];
	code: string;
	language?: string;
	/** Where the code comes from - e.g. "Lab 1.1: smoke_test() - environment setup" */
	codeContext: string;
	slideName: string;
	audioDuration?: number;
	moduleNumber?: number;
}

export const BulletsAndCodeSlide: React.FC<BulletsAndCodeSlideProps> = ({
	title,
	points,
	code,
	language = "python",
	codeContext,
	slideName,
	audioDuration,
	moduleNumber = 1,
}) => {
	const { timings } = useModuleTimings(moduleNumber);
	const slideTimings = timings?.slides[slideName];
	const words = slideTimings?.words || [];
	const frame = useCurrentFrame();
	const { fps, width, height } = useVideoConfig();

	const padding = { top: 60, right: 48, bottom: 60, left: 60 };
	const titleAreaHeight = 160;
	const gap = 16;
	const leftWidth = width * 0.45;
	const codeWidth = width * 0.48;

	const availableWidth = leftWidth - padding.left - 48;
	const availableHeight = height - padding.top - padding.bottom - titleAreaHeight;

	const titleFontSize = Math.min(42, calculateOptimalFontSize(title, availableWidth, titleAreaHeight, 52, 28, undefined, 1.1).fontSize);
	const pointsFontSize = calculateFontSizeForMultiple(points, availableWidth - 32, availableHeight, 32, 16, undefined, 1.5, gap).fontSize;

	const titleSpring = spring({ frame, fps, config: { damping: 12, stiffness: 100 }, durationInFrames: fps * 0.5 });
	const titleOpacity = titleSpring;
	const titleY = interpolate(titleSpring, [0, 1], [20, 0]);

	const currentTimeSeconds = frame / fps;
	const entranceTime = 0.25;

	const getPointHighlight = (index: number): number => {
		if (!audioDuration || audioDuration <= 0) return 0;
		if (currentTimeSeconds < entranceTime) return 0;
		const timePerPoint = audioDuration * 0.8 / points.length;
		const pointStartTime = entranceTime + audioDuration * 0.1 + index * timePerPoint;
		const pointEndTime = pointStartTime + timePerPoint;
		if (currentTimeSeconds < pointStartTime) return 0;
		if (currentTimeSeconds > pointEndTime) return 0.12;
		const progress = (currentTimeSeconds - pointStartTime) / (pointEndTime - pointStartTime);
		if (progress < 0.12) return interpolate(progress, [0, 0.12], [0, 1]);
		if (progress > 0.88) return interpolate(progress, [0.88, 1], [1, 0.12]);
		return 1;
	};

	const getPointSpring = (index: number) => spring({
		frame, fps, config: { damping: 14, stiffness: 90 },
		delay: fps * 0.3 + index * fps * 0.1,
		durationInFrames: fps * 0.4,
	});

	const codeSpring = spring({
		frame, fps, config: { damping: 15, stiffness: 70 },
		delay: fps * 0.2,
		durationInFrames: fps * 0.6,
	});

	const codeLines = (code || "").trim().split("\n");
	const codeLineHeight = 1.4;
	const codeBlockHeight = height - padding.top - padding.bottom - titleAreaHeight - 80 - 28; // minus header bar
	const codeContentHeight = codeBlockHeight - 40; // SyntaxHighlighter vertical padding
	// Scale font so all lines fit without scroll (video must show everything)
	const codeFontSize = Math.min(22, Math.max(12, codeContentHeight / (Math.max(1, codeLines.length) * codeLineHeight)));

	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
				color: "white",
				display: "flex",
				flexDirection: "column",
				padding: `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`,
				fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
				position: "relative",
				overflow: "hidden",
			}}
		>
			<div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "row", gap: 32 }}>
				{/* Left: Bullets */}
				<div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, maxWidth: leftWidth }}>
					<h2
						style={{
							fontSize: titleFontSize,
							margin: 0,
							marginBottom: 32,
							opacity: titleOpacity,
							transform: `translateY(${titleY}px)`,
							fontWeight: 700,
							color: "#ffffff",
							letterSpacing: "-0.02em",
							paddingBottom: 16,
							borderBottom: "2px solid rgba(59, 130, 246, 0.5)",
						}}
					>
						{title}
					</h2>
					<div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
						{points.map((point, index) => {
							const pointSpring = getPointSpring(index);
							const highlight = getPointHighlight(index);
							const isActive = highlight > 0.5;
							return (
								<div
									key={index}
									style={{
										opacity: pointSpring,
										transform: `translateX(${interpolate(pointSpring, [0, 1], [-20, 0])}px)`,
										display: "flex",
										alignItems: "flex-start",
										gap: 14,
										padding: "14px 18px",
										backgroundColor: highlight > 0.3 ? `rgba(59, 130, 246, ${0.15 + highlight * 0.2})` : "rgba(30, 41, 59, 0.6)",
										borderRadius: 10,
										borderLeft: `3px solid rgba(59, 130, 246, ${0.6 + highlight * 0.4})`,
									}}
								>
									<div
										style={{
											width: 8,
											height: 8,
											marginTop: 8,
											borderRadius: "50%",
											backgroundColor: isActive ? "#60a5fa" : "#3b82f6",
											flexShrink: 0,
										}}
									/>
									<p style={{ fontSize: pointsFontSize, margin: 0, lineHeight: 1.5, color: isActive ? "#e0f2fe" : "#f1f5f9", flex: 1 }}>
										{point}
									</p>
								</div>
							);
						})}
					</div>
				</div>

				{/* Right: Code with context caption */}
				<div
					style={{
						flex: 1,
						display: "flex",
						flexDirection: "column",
						minWidth: 0,
						maxWidth: codeWidth,
						opacity: codeSpring,
						transform: `translateX(${interpolate(codeSpring, [0, 1], [30, 0])}px)`,
					}}
				>
					{/* Code provenance - where it comes from, which component */}
					<div
						style={{
							marginBottom: 12,
							padding: "10px 16px",
							background: "rgba(30, 58, 138, 0.4)",
							borderRadius: 8,
							borderLeft: "3px solid #3b82f6",
							fontSize: 18,
							color: "#93c5fd",
							fontWeight: 500,
						}}
					>
						{codeContext}
					</div>
					<div
						style={{
							flex: 1,
							borderRadius: 12,
							overflow: "hidden",
							border: "1px solid rgba(148, 163, 184, 0.3)",
							backgroundColor: "#020617",
						}}
					>
						<div
							style={{
								height: 28,
								background: "linear-gradient(90deg, #111827 0%, #1f2937 100%)",
								borderBottom: "1px solid rgba(51, 65, 85, 0.8)",
								display: "flex",
								alignItems: "center",
								paddingLeft: 14,
								fontSize: 14,
								color: "#9ca3af",
								textTransform: "uppercase",
								letterSpacing: 1,
							}}
						>
							{language}
						</div>
						<div style={{ overflow: "hidden", height: codeBlockHeight }}>
							<SyntaxHighlighter
								language={language}
								style={vscDarkPlus}
								customStyle={{
									margin: 0,
									padding: "20px 24px",
									fontSize: codeFontSize,
									lineHeight: 1.4,
									backgroundColor: "#020617",
									fontFamily: "system-ui, monospace",
									overflow: "visible",
								}}
								codeTagProps={{ style: { lineHeight: 1.4 } }}
								showLineNumbers
								lineNumberStyle={{ fontSize: codeFontSize, color: "#6b7280", minWidth: "2em" }}
							>
								{(code || "").trim()}
							</SyntaxHighlighter>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
