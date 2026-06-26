import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { premiumTheme } from "../theme/premiumTheme";

interface PremiumSlideBackgroundProps {
	decorProgress?: number;
	showAccentLine?: boolean;
	children?: React.ReactNode;
}

export const PremiumSlideBackground: React.FC<PremiumSlideBackgroundProps> = ({
	decorProgress = 1,
	showAccentLine = true,
	children,
}) => {
	const frame = useCurrentFrame();
	const gridDriftY = Math.sin(frame / 100) * 4;
	const gridDriftX = Math.cos(frame / 120) * 3;

	return (
		<>
			<div
				style={{
					position: "absolute",
					inset: 0,
					opacity: 0.035 + Math.sin(frame / 80) * 0.01,
					backgroundImage: "radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)",
					backgroundSize: "44px 44px",
					transform: `translate(${gridDriftX}px, ${gridDriftY}px)`,
					pointerEvents: "none",
				}}
			/>
			<div
				style={{
					position: "absolute",
					inset: 0,
					opacity: 0.02,
					backgroundImage: "radial-gradient(circle at 1px 1px, #8b5cf6 0.5px, transparent 0)",
					backgroundSize: "64px 64px",
					pointerEvents: "none",
				}}
			/>
			<div
				style={{
					position: "absolute",
					top: "12%",
					right: "8%",
					width: 280,
					height: 280,
					borderRadius: "50%",
					background: "radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)",
					filter: "blur(40px)",
					pointerEvents: "none",
				}}
			/>
			<div
				style={{
					position: "absolute",
					bottom: "10%",
					left: "6%",
					width: 220,
					height: 220,
					borderRadius: "50%",
					background: "radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 70%)",
					filter: "blur(36px)",
					pointerEvents: "none",
				}}
			/>
			<svg
				style={{ position: "absolute", inset: 0, opacity: 0.04, pointerEvents: "none" }}
				viewBox="0 0 1920 1080"
				preserveAspectRatio="none"
			>
				<path
					d="M0 540 Q480 420 960 540 T1920 540"
					fill="none"
					stroke="#3b82f6"
					strokeWidth="1"
				/>
				<path
					d="M0 680 Q640 560 1280 680 T1920 680"
					fill="none"
					stroke="#8b5cf6"
					strokeWidth="0.5"
				/>
			</svg>
			{showAccentLine && (
				<div
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						width: `${interpolate(decorProgress, [0, 1], [0, 100])}%`,
						height: 3,
						background: premiumTheme.gradients.accentLine,
						boxShadow: `0 0 16px rgba(59, 130, 246, ${0.4 * decorProgress})`,
						pointerEvents: "none",
					}}
				/>
			)}
			{children}
		</>
	);
};

export const premiumSlideRootStyle: React.CSSProperties = {
	width: "100%",
	height: "100%",
	flex: 1,
	background: premiumTheme.gradients.slideBg,
	color: premiumTheme.colors.textPrimary,
	fontFamily: premiumTheme.typography.fontFamily,
	position: "relative",
	overflow: "hidden",
};
