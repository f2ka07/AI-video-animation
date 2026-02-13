import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

interface TransitionSlideProps {
	text: string;
	duration?: number;
}

export const TransitionSlide: React.FC<TransitionSlideProps> = ({
	text,
	duration = 0.5,
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const durationFrames = duration * fps;

	const opacity = interpolate(
		frame,
		[0, durationFrames * 0.3, durationFrames * 0.7, durationFrames],
		[0, 1, 1, 0],
		{
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		}
	);

	const scale = interpolate(
		frame,
		[0, durationFrames * 0.3, durationFrames * 0.7, durationFrames],
		[0.8, 1, 1, 0.8],
		{
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		}
	);

	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				flex: 1,
				background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
				color: "white",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
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

			<div
				style={{
					opacity,
					transform: `scale(${scale})`,
					textAlign: "center",
					position: "relative",
					zIndex: 1,
				}}
			>
				<p
					style={{
						fontSize: 56,
						fontWeight: 700,
						color: "#ffffff",
						letterSpacing: "0.02em",
						margin: 0,
					}}
				>
					{text}
				</p>
				<div
					style={{
						width: 200,
						height: 4,
						background: "linear-gradient(90deg, transparent 0%, #3b82f6 50%, transparent 100%)",
						margin: "24px auto 0",
						borderRadius: 2,
					}}
				/>
			</div>
		</div>
	);
};
