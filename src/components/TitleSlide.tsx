import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

interface TitleSlideProps {
	title: string;
	subtitle?: string;
	duration?: number;
}

export const TitleSlide: React.FC<TitleSlideProps> = ({
	title,
	subtitle,
	duration = 1,
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const durationFrames = duration * fps;

	const titleOpacity = interpolate(frame, [0, fps * 0.5], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const subtitleOpacity = interpolate(
		frame,
		[fps * 0.5, fps * 1],
		[0, 1],
		{
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		}
	);

	const titleScale = interpolate(frame, [0, fps * 0.5], [0.9, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

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
				justifyContent: "center",
				alignItems: "center",
				fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
				padding: 80,
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
					opacity: 0.03,
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

			<div
				style={{
					position: "relative",
					zIndex: 1,
					textAlign: "center",
					maxWidth: 1200,
				}}
			>
				<h1
					style={{
						fontSize: 96,
						margin: 0,
						opacity: titleOpacity,
						transform: `scale(${titleScale})`,
						fontWeight: 800,
						textAlign: "center",
						lineHeight: 1.1,
						background: "linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)",
						WebkitBackgroundClip: "text",
						WebkitTextFillColor: "transparent",
						backgroundClip: "text",
						letterSpacing: "-0.02em",
						marginBottom: subtitle ? 32 : 0,
					}}
				>
					{title}
				</h1>
				{subtitle && (
					<div
						style={{
							opacity: subtitleOpacity,
							marginTop: 32,
						}}
					>
						<p
							style={{
								fontSize: 42,
								margin: 0,
								textAlign: "center",
								color: "#94a3b8",
								fontWeight: 500,
								letterSpacing: "0.01em",
							}}
						>
							{subtitle}
						</p>
						<div
							style={{
								width: 120,
								height: 3,
								background: "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)",
								margin: "24px auto 0",
								borderRadius: 2,
							}}
						/>
					</div>
				)}
			</div>
		</div>
	);
};
