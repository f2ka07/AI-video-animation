import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { GitMachineAnimation } from "./GitMachineAnimation";
import { PremiumSlideBackground, premiumSlideRootStyle } from "./PremiumSlideBackground";
import { SvgDiagramFrame } from "./SvgDiagramFrame";
import { premiumTheme } from "../theme/premiumTheme";

type TitleAnimationType = "git-machine" | "none";

interface TitleSlideProps {
	title: string;
	subtitle?: string;
	duration?: number;
	animation?: TitleAnimationType;
	audioDuration?: number;
	imageSrc?: string;
}

export const TitleSlide: React.FC<TitleSlideProps> = ({
	title,
	subtitle,
	animation,
	audioDuration,
	imageSrc,
}) => {
	const hasAnimation = animation && animation !== "none";
	const hasRightPanel = hasAnimation || !!imageSrc;
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const titleSpring = spring({
		frame,
		fps,
		config: { damping: 12, stiffness: 100 },
		durationInFrames: fps * 0.8,
	});
	const subtitleSpring = spring({
		frame,
		fps,
		config: { damping: 15, stiffness: 80 },
		delay: fps * 0.35,
		durationInFrames: fps * 0.55,
	});
	const decorSpring = spring({ frame, fps, config: { damping: 20, stiffness: 60 }, delay: fps * 0.15 });
	const panelSpring = spring({
		frame,
		fps,
		config: { damping: 15, stiffness: 80 },
		delay: fps * 0.3,
		durationInFrames: fps * 0.75,
	});

	const titleOpacity = titleSpring;
	const titleScale = interpolate(titleSpring, [0, 1], [0.9, 1]);
	const titleY = interpolate(titleSpring, [0, 1], [32, 0]);

	return (
		<div
			style={{
				...premiumSlideRootStyle,
				display: "flex",
				flexDirection: "row",
				alignItems: hasRightPanel ? "stretch" : "center",
				justifyContent: "center",
				padding: hasRightPanel ? "72px 56px" : 72,
				gap: hasRightPanel ? 48 : 0,
			}}
		>
			<PremiumSlideBackground decorProgress={decorSpring} />

			<div
				style={{
					position: "relative",
					zIndex: 1,
					flex: hasRightPanel ? 1 : undefined,
					maxWidth: hasRightPanel ? undefined : 1100,
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					textAlign: hasRightPanel ? "left" : "center",
				}}
			>
				{subtitle && (
					<p
						style={{
							margin: "0 0 12px",
							fontSize: premiumTheme.typography.kicker,
							fontWeight: 600,
							letterSpacing: "0.08em",
							textTransform: "uppercase",
							color: premiumTheme.colors.accentBlueMuted,
							opacity: subtitleSpring,
						}}
					>
						{subtitle}
					</p>
				)}
				<h1
					style={{
						fontSize: hasRightPanel ? 72 : 88,
						margin: 0,
						opacity: titleOpacity,
						transform: `scale(${titleScale}) translateY(${titleY}px)`,
						fontWeight: 800,
						lineHeight: 1.08,
						color: premiumTheme.colors.textPrimary,
						letterSpacing: "-0.025em",
					}}
				>
					{title || "Untitled"}
				</h1>
				<div
					style={{
						width: interpolate(subtitleSpring, [0, 1], [0, hasRightPanel ? 140 : 100]),
						height: 3,
						background: premiumTheme.gradients.accentLine,
						margin: hasRightPanel ? "28px 0 0" : "28px auto 0",
						borderRadius: 2,
					}}
				/>
			</div>

			{animation === "git-machine" && (
				<div
					style={{
						flex: 1,
						maxWidth: 580,
						borderRadius: premiumTheme.radius.svgFrame,
						overflow: "hidden",
						opacity: panelSpring,
						alignSelf: "center",
					}}
				>
					<GitMachineAnimation audioDuration={audioDuration} />
				</div>
			)}

			{!animation && imageSrc && (
				<SvgDiagramFrame
					imageSrc={imageSrc}
					entranceProgress={panelSpring}
					audioDuration={audioDuration}
					flex="1 1 52%"
					minWidth={620}
				/>
			)}
		</div>
	);
};
