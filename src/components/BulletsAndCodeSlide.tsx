// Bullets on left, code snippet on right with provenance context
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useModuleTimings } from "../hooks/useModuleTimings";
import { calculateFontSizeForMultiple, calculateOptimalFontSize } from "../utils/textSizing";
import { PremiumSlideBackground, premiumSlideRootStyle } from "./PremiumSlideBackground";
import { BulletRow } from "./PointCard";
import { premiumTheme } from "../theme/premiumTheme";

interface BulletsAndCodeSlideProps {
	title: string;
	points: string[];
	code: string;
	language?: string;
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
	const frame = useCurrentFrame();
	const { fps, width, height } = useVideoConfig();

	const padding = { top: 64, right: 48, bottom: 64, left: 64 };
	const titleAreaHeight = 140;
	const gap = premiumTheme.spacing.bulletGap;
	const leftWidth = width * 0.42;
	const codeWidth = width * 0.5;

	const availableWidth = leftWidth - padding.left - 40;
	const availableHeight = height - padding.top - padding.bottom - titleAreaHeight;

	const titleFontSize = Math.min(
		44,
		calculateOptimalFontSize(title, availableWidth, titleAreaHeight, 48, 28, undefined, 1.1).fontSize
	);
	const pointsFontSize = calculateFontSizeForMultiple(
		points.slice(0, 3),
		availableWidth - 32,
		availableHeight,
		26,
		18,
		undefined,
		1.5,
		gap
	).fontSize;

	const titleSpring = spring({ frame, fps, config: { damping: 12, stiffness: 100 }, durationInFrames: fps * 0.5 });
	const decorSpring = spring({ frame, fps, config: { damping: 20, stiffness: 60 }, delay: fps * 0.15 });
	const codeSpring = spring({
		frame,
		fps,
		config: { damping: 15, stiffness: 70 },
		delay: fps * 0.25,
		durationInFrames: fps * 0.6,
	});

	const currentTimeSeconds = frame / fps;
	const entranceTime = 0.25;

	const getPointHighlight = (index: number): number => {
		if (!audioDuration || audioDuration <= 0) return 0;
		if (currentTimeSeconds < entranceTime) return 0;
		const timePerPoint = (audioDuration * 0.8) / points.length;
		const pointStartTime = entranceTime + audioDuration * 0.1 + index * timePerPoint;
		const pointEndTime = pointStartTime + timePerPoint;
		if (currentTimeSeconds < pointStartTime) return 0;
		if (currentTimeSeconds > pointEndTime) return 0.12;
		const progress = (currentTimeSeconds - pointStartTime) / (pointEndTime - pointStartTime);
		if (progress < 0.12) return interpolate(progress, [0, 0.12], [0, 1]);
		if (progress > 0.88) return interpolate(progress, [0.88, 1], [1, 0.12]);
		return 1;
	};

	const getPointSpring = (index: number) =>
		spring({
			frame,
			fps,
			config: { damping: 14, stiffness: 90 },
			delay: fps * 0.3 + index * fps * 0.1,
			durationInFrames: fps * 0.4,
		});

	const codeLines = (code || "").trim().split("\n");
	const codeBlockHeight = height - padding.top - padding.bottom - titleAreaHeight - 72;
	const codeFontSize = Math.min(22, Math.max(18, (codeBlockHeight - 40) / (Math.max(1, codeLines.length) * 1.4)));

	const displayPoints = points.slice(0, 3);

	return (
		<div
			style={{
				...premiumSlideRootStyle,
				display: "flex",
				flexDirection: "column",
				padding: `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`,
			}}
		>
			<PremiumSlideBackground decorProgress={decorSpring} />

			<div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "row", gap: 36 }}>
				<div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, maxWidth: leftWidth }}>
					<h2
						style={{
							fontSize: titleFontSize,
							margin: "0 0 28px",
							opacity: titleSpring,
							transform: `translateY(${interpolate(titleSpring, [0, 1], [16, 0])}px)`,
							fontWeight: 800,
							letterSpacing: "-0.02em",
							paddingBottom: 14,
							borderBottom: "2px solid",
							borderImage: `${premiumTheme.gradients.titleBorder} 1`,
						}}
					>
						{title}
					</h2>
					<div style={{ flex: 1, display: "flex", flexDirection: "column", gap }}>
						{displayPoints.map((point, index) => (
							<BulletRow
								key={index}
								text={point}
								fontSize={pointsFontSize}
								highlight={getPointHighlight(index)}
								entranceProgress={getPointSpring(index)}
								compact
							/>
						))}
					</div>
				</div>

				<div
					style={{
						flex: 1,
						display: "flex",
						flexDirection: "column",
						minWidth: 0,
						maxWidth: codeWidth,
						opacity: codeSpring,
						transform: `translateX(${interpolate(codeSpring, [0, 1], [28, 0])}px)`,
					}}
				>
					<div
						style={{
							marginBottom: 10,
							padding: "8px 14px",
							background: "rgba(59, 130, 246, 0.12)",
							borderRadius: 8,
							borderLeft: `3px solid ${premiumTheme.colors.accentBlue}`,
							fontSize: 15,
							color: premiumTheme.colors.accentBlueMuted,
							fontWeight: 500,
							fontFamily: "monospace",
						}}
					>
						{codeContext}
					</div>
					<div
						style={{
							flex: 1,
							borderRadius: premiumTheme.radius.card,
							overflow: "hidden",
							border: `1px solid ${premiumTheme.colors.codeBorder}`,
							backgroundColor: premiumTheme.colors.codePanel,
							boxShadow: premiumTheme.shadow.card,
						}}
					>
						<div
							style={{
								height: 32,
								background: "linear-gradient(90deg, #111827 0%, #1f2937 100%)",
								borderBottom: "1px solid rgba(51, 65, 85, 0.8)",
								display: "flex",
								alignItems: "center",
								paddingLeft: 14,
								gap: 6,
							}}
						>
							<div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#f97373" }} />
							<div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#facc15" }} />
							<div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#22c55e" }} />
							<span style={{ marginLeft: 10, fontSize: 13, color: "#9ca3af", textTransform: "uppercase" }}>
								{language}
							</span>
						</div>
						<div style={{ overflow: "hidden", height: codeBlockHeight }}>
							<SyntaxHighlighter
								language={language}
								style={vscDarkPlus}
								customStyle={{
									margin: 0,
									padding: "18px 22px",
									fontSize: codeFontSize,
									lineHeight: 1.4,
									backgroundColor: premiumTheme.colors.codePanel,
									fontFamily: "ui-monospace, monospace",
								}}
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
