import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

interface ComparisonSlideProps {
	title: string;
	leftTitle: string;
	leftItems: string[];
	rightTitle: string;
	rightItems: string[];
	duration?: number;
}

export const ComparisonSlide: React.FC<ComparisonSlideProps> = ({
	title,
	leftTitle,
	leftItems,
	rightTitle,
	rightItems,
	duration = 1,
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const titleOpacity = interpolate(frame, [0, fps * 0.3], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const titleY = interpolate(frame, [0, fps * 0.3], [20, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const columnsOpacity = interpolate(frame, [fps * 0.4, fps * 0.7], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const columnsY = interpolate(frame, [fps * 0.4, fps * 0.7], [30, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const getItemOpacity = (index: number, side: "left" | "right") => {
		const baseFrame = fps * 0.7;
		const delay = side === "left" ? index * 0.15 : index * 0.15;
		const startFrame = baseFrame + delay * fps;
		const endFrame = startFrame + fps * 0.2;
		return interpolate(frame, [startFrame, endFrame], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		});
	};

	const getItemX = (index: number, side: "left" | "right") => {
		const baseFrame = fps * 0.7;
		const delay = side === "left" ? index * 0.15 : index * 0.15;
		const startFrame = baseFrame + delay * fps;
		const endFrame = startFrame + fps * 0.2;
		const direction = side === "left" ? -1 : 1;
		return interpolate(frame, [startFrame, endFrame], [direction * 20, 0], {
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
				padding: 60,
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
						fontSize: 64,
						margin: 0,
						marginBottom: 50,
						opacity: titleOpacity,
						transform: `translateY(${titleY}px)`,
						fontWeight: 800,
						textAlign: "center",
						background: "linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)",
						WebkitBackgroundClip: "text",
						WebkitTextFillColor: "transparent",
						backgroundClip: "text",
						letterSpacing: "-0.02em",
					}}
				>
					{title}
				</h2>
				<div
					style={{
						flex: 1,
						display: "flex",
						gap: 40,
						opacity: columnsOpacity,
						transform: `translateY(${columnsY}px)`,
					}}
				>
					<div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
						<h3
							style={{
								fontSize: 44,
								margin: 0,
								marginBottom: 32,
								color: "#ef4444",
								fontWeight: 700,
								display: "flex",
								alignItems: "center",
								gap: 12,
							}}
						>
							<span
								style={{
									width: 6,
									height: 6,
									backgroundColor: "#ef4444",
									borderRadius: "50%",
									boxShadow: "0 0 12px rgba(239, 68, 68, 0.6)",
								}}
							/>
							{leftTitle}
						</h3>
						<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
							{leftItems.map((item, index) => (
								<div
									key={index}
									style={{
										opacity: getItemOpacity(index, "left"),
										transform: `translateX(${getItemX(index, "left")}px)`,
										fontSize: 32,
										lineHeight: 1.6,
										padding: 24,
										backgroundColor: "rgba(30, 41, 59, 0.7)",
										borderRadius: 12,
										borderLeft: "4px solid #ef4444",
										boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
									}}
								>
									{item}
								</div>
							))}
						</div>
					</div>
					<div
						style={{
							width: 2,
							background: "linear-gradient(180deg, transparent 0%, #3b82f6 50%, transparent 100%)",
							opacity: 0.5,
						}}
					/>
					<div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
						<h3
							style={{
								fontSize: 44,
								margin: 0,
								marginBottom: 32,
								color: "#3b82f6",
								fontWeight: 700,
								display: "flex",
								alignItems: "center",
								gap: 12,
							}}
						>
							<span
								style={{
									width: 6,
									height: 6,
									backgroundColor: "#3b82f6",
									borderRadius: "50%",
									boxShadow: "0 0 12px rgba(59, 130, 246, 0.6)",
								}}
							/>
							{rightTitle}
						</h3>
						<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
							{rightItems.map((item, index) => (
								<div
									key={index}
									style={{
										opacity: getItemOpacity(index, "right"),
										transform: `translateX(${getItemX(index, "right")}px)`,
										fontSize: 32,
										lineHeight: 1.6,
										padding: 24,
										backgroundColor: "rgba(30, 41, 59, 0.7)",
										borderRadius: 12,
										borderLeft: "4px solid #3b82f6",
										boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
									}}
								>
									{item}
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
