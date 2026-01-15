import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

interface ContentSlideProps {
	title: string;
	points: string[];
	duration?: number;
}

export const ContentSlide: React.FC<ContentSlideProps> = ({
	title,
	points,
	duration = 1,
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const durationFrames = duration * fps;

	const titleOpacity = interpolate(frame, [0, fps * 0.3], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const titleY = interpolate(frame, [0, fps * 0.3], [20, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const getPointOpacity = (index: number) => {
		const startFrame = fps * (0.5 + index * 0.2);
		const endFrame = startFrame + fps * 0.3;
		return interpolate(frame, [startFrame, endFrame], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		});
	};

	const getPointX = (index: number) => {
		const startFrame = fps * (0.5 + index * 0.2);
		const endFrame = startFrame + fps * 0.3;
		return interpolate(frame, [startFrame, endFrame], [-20, 0], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		});
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
				padding: 80,
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
						fontSize: 72,
						margin: 0,
						marginBottom: 60,
						opacity: titleOpacity,
						transform: `translateY(${titleY}px)`,
						fontWeight: 800,
						background: "linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)",
						WebkitBackgroundClip: "text",
						WebkitTextFillColor: "transparent",
						backgroundClip: "text",
						letterSpacing: "-0.02em",
						paddingBottom: 24,
						borderBottom: "3px solid",
						borderImage: "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%) 1",
					}}
				>
					{title}
				</h2>
				<div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24 }}>
					{points.map((point, index) => (
						<div
							key={index}
							style={{
								opacity: getPointOpacity(index),
								transform: `translateX(${getPointX(index)}px)`,
								display: "flex",
								alignItems: "flex-start",
								gap: 24,
								padding: 24,
								backgroundColor: "rgba(30, 41, 59, 0.6)",
								borderRadius: 12,
								borderLeft: "4px solid #3b82f6",
								boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
								transition: "all 0.3s ease",
							}}
						>
							<div
								style={{
									width: 8,
									height: 8,
									backgroundColor: "#3b82f6",
									borderRadius: "50%",
									marginTop: 12,
									flexShrink: 0,
									boxShadow: "0 0 12px rgba(59, 130, 246, 0.5)",
								}}
							/>
							<p
								style={{
									fontSize: 38,
									margin: 0,
									lineHeight: 1.7,
									flex: 1,
									color: "#f1f5f9",
									fontWeight: 400,
								}}
							>
								{point}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
