import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { GitMachineAnimation } from "./GitMachineAnimation";

// Available animation types for title slides
type TitleAnimationType = "git-machine" | "none";

interface TitleSlideProps {
	title: string;
	subtitle?: string;
	duration?: number;
	animation?: TitleAnimationType;
	audioDuration?: number;
}

export const TitleSlide: React.FC<TitleSlideProps> = ({
	title,
	subtitle,
	duration = 1,
	animation,
	audioDuration,
}) => {
	const hasAnimation = animation && animation !== "none";
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	// Spring animation for title - smooth entrance with slight overshoot
	const titleSpring = spring({
		frame,
		fps,
		config: { damping: 12, stiffness: 100 },
		durationInFrames: fps * 0.8,
	});

	// Spring animation for subtitle - delayed entrance
	const subtitleSpring = spring({
		frame,
		fps,
		config: { damping: 15, stiffness: 80 },
		delay: fps * 0.4,
		durationInFrames: fps * 0.6,
	});

	// Title transforms using spring
	const titleOpacity = titleSpring;
	const titleScale = interpolate(titleSpring, [0, 1], [0.85, 1]);
	const titleY = interpolate(titleSpring, [0, 1], [40, 0]);

	// Subtitle transforms
	const subtitleOpacity = subtitleSpring;
	const subtitleY = interpolate(subtitleSpring, [0, 1], [20, 0]);

	// Decorative elements spring
	const decorSpring = spring({
		frame,
		fps,
		config: { damping: 20, stiffness: 60 },
		delay: fps * 0.2,
	});

	// Accent line animation
	const lineWidth = interpolate(decorSpring, [0, 1], [0, 100]);

	// Continuous breathing effect for title (subtle)
	const breatheScale = 1 + Math.sin(frame / 40) * 0.008;
	const breatheGlow = 40 + Math.sin(frame / 30) * 15;

	// Animation panel spring (for when animation is present)
	const animationSpring = spring({
		frame,
		fps,
		config: { damping: 15, stiffness: 80 },
		delay: fps * 0.3,
		durationInFrames: fps * 0.8,
	});

	// Dynamic camera movements
	const cameraZoom = 1 + Math.sin(frame / 140) * 0.012;
	const cameraPanX = Math.sin(frame / 160) * 6;
	const cameraPanY = Math.cos(frame / 200) * 5;

	// Particle system
	const particleCount = 15;
	const particles = Array.from({ length: particleCount }, (_, i) => {
		const baseX = (i * 137.5) % 100;
		const baseY = (i * 97.3) % 100;
		const speed = 0.25 + (i % 4) * 0.08;
		const size = 2.5 + (i % 4) * 1.2;
		return {
			x: baseX + Math.sin(frame / (65 + i * 6)) * 18,
			y: baseY + Math.cos(frame / (75 + i * 8)) * 15,
			size,
			opacity: 0.2 + Math.sin(frame / (45 + i * 4)) * 0.12,
			speed,
		};
	});

	// Animated geometric shapes
	const shapes = Array.from({ length: 8 }, (_, i) => {
		const angle = (i / 8) * Math.PI * 2 + frame / 90;
		const radius = 250 + Math.sin(frame / 70 + i) * 60;
		return {
			x: 50 + Math.cos(angle) * radius / 1920 * 100,
			y: 50 + Math.sin(angle) * radius / 1080 * 100,
			rotation: angle * (180 / Math.PI) + frame / 1.5,
			scale: 0.35 + Math.sin(frame / 55 + i) * 0.25,
		};
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
				flexDirection: "row",
				justifyContent: "center",
				alignItems: "center",
				fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
				padding: hasAnimation ? "80px 60px" : 80,
				gap: hasAnimation ? 60 : 0,
				position: "relative",
				overflow: "hidden",
				transform: `scale(${cameraZoom}) translate(${cameraPanX}px, ${cameraPanY}px)`,
				transformOrigin: "center center",
			}}
		>
			{/* Multi-layer animated background pattern */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					opacity: 0.04 + Math.sin(frame / 60) * 0.02,
					backgroundImage: `radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)`,
					backgroundSize: "40px 40px",
					transform: `translateY(${Math.sin(frame / 80) * 8}px) translateX(${Math.cos(frame / 100) * 6}px)`,
				}}
			/>
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					opacity: 0.025 + Math.cos(frame / 75) * 0.015,
					backgroundImage: `radial-gradient(circle at 1px 1px, #8b5cf6 0.5px, transparent 0)`,
					backgroundSize: "60px 60px",
					transform: `translateY(${Math.cos(frame / 90) * 7}px) translateX(${Math.sin(frame / 110) * 5}px)`,
				}}
			/>

			{/* Animated geometric shapes */}
			{shapes.map((shape, i) => (
				<div
					key={i}
					style={{
						position: "absolute",
						left: `${shape.x}%`,
						top: `${shape.y}%`,
						width: 100,
						height: 100,
						border: `2px solid rgba(59, 130, 246, ${0.1 * shape.scale})`,
						borderRadius: i % 3 === 0 ? "50%" : i % 3 === 1 ? "8px" : "0",
						opacity: 0.18 * shape.scale,
						transform: `rotate(${shape.rotation}deg) scale(${shape.scale})`,
						transformOrigin: "center center",
						pointerEvents: "none",
					}}
				/>
			))}

			{/* Floating particles */}
			{particles.map((particle, i) => (
				<div
					key={i}
					style={{
						position: "absolute",
						left: `${particle.x}%`,
						top: `${particle.y}%`,
						width: particle.size,
						height: particle.size,
						borderRadius: "50%",
						background: `radial-gradient(circle, rgba(59, 130, 246, ${particle.opacity}) 0%, transparent 70%)`,
						boxShadow: `0 0 ${particle.size * 4}px rgba(59, 130, 246, ${particle.opacity * 0.6})`,
						pointerEvents: "none",
					}}
				/>
			))}

			{/* Moving gradient spotlight with multiple layers */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: `radial-gradient(ellipse at ${hasAnimation ? 30 : 50 + Math.sin(frame / 60) * 20}% ${50 + Math.cos(frame / 45) * 15}%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)`,
					pointerEvents: "none",
				}}
			/>
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: `radial-gradient(ellipse at ${hasAnimation ? 70 : 30 + Math.cos(frame / 80) * 25}% ${hasAnimation ? 30 : 70 + Math.sin(frame / 65) * 20}%, rgba(139, 92, 246, 0.1) 0%, transparent 45%)`,
					pointerEvents: "none",
				}}
			/>
			
			{/* Animated accent line with glow */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: hasAnimation ? 0 : "50%",
					transform: hasAnimation ? "none" : "translateX(-50%)",
					width: hasAnimation ? `${lineWidth * 0.6}%` : `${lineWidth}%`,
					height: 4,
					background: "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #22c55e 100%)",
					boxShadow: `0 0 ${25 * decorSpring}px rgba(59, 130, 246, ${0.7 * decorSpring}), 0 0 ${50 * decorSpring}px rgba(139, 92, 246, ${0.4 * decorSpring})`,
				}}
			/>

			{/* Animated scan line */}
			<div
				style={{
					position: "absolute",
					top: `${(frame / 2.5) % 100}%`,
					left: 0,
					right: 0,
					height: 2,
					background: "linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.4) 50%, transparent 100%)",
					opacity: 0.5,
					pointerEvents: "none",
				}}
			/>

			{/* Floating decorative orbs - only show when no animation */}
			{!hasAnimation && (
				<>
					<div
						style={{
							position: "absolute",
							top: "15%",
							right: "10%",
							width: 200,
							height: 200,
							borderRadius: "50%",
							background: "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)",
							opacity: decorSpring * 0.6,
							transform: `scale(${0.8 + decorSpring * 0.4}) translateY(${Math.sin(frame / 30) * 10}px)`,
						}}
					/>
					<div
						style={{
							position: "absolute",
							bottom: "20%",
							left: "8%",
							width: 150,
							height: 150,
							borderRadius: "50%",
							background: "radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)",
							opacity: decorSpring * 0.5,
							transform: `scale(${0.8 + decorSpring * 0.3}) translateY(${Math.sin(frame / 25 + 1) * 8}px)`,
						}}
					/>
				</>
			)}

			{/* Left side: Title content */}
			<div
				style={{
					position: "relative",
					zIndex: 1,
					textAlign: hasAnimation ? "left" : "center",
					flex: hasAnimation ? 1 : undefined,
					maxWidth: hasAnimation ? undefined : 1200,
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
				}}
			>
				<h1
					style={{
						fontSize: hasAnimation ? 80 : 96,
						margin: 0,
						opacity: titleOpacity,
						transform: `scale(${titleScale * breatheScale * (1 + Math.sin(frame / 60) * 0.003)}) translateY(${titleY}px)`,
						fontWeight: 800,
						textAlign: hasAnimation ? "left" : "center",
						lineHeight: 1.1,
						color: "#ffffff",
						letterSpacing: "-0.02em",
						marginBottom: subtitle ? 32 : 0,
						filter: `drop-shadow(0 0 ${breatheGlow}px rgba(59, 130, 246, 0.3)) drop-shadow(0 0 ${breatheGlow * 1.5}px rgba(139, 92, 246, 0.15))`,
						minHeight: "1em",
						textShadow: `0 0 ${breatheGlow}px rgba(59, 130, 246, 0.4), 0 0 ${breatheGlow * 1.5}px rgba(139, 92, 246, 0.2)`,
					}}
				>
					{title || "Untitled"}
				</h1>
				{subtitle && (
					<div
						style={{
							opacity: subtitleOpacity,
							transform: `translateY(${subtitleY}px)`,
							marginTop: 32,
						}}
					>
						<p
							style={{
								fontSize: hasAnimation ? 36 : 42,
								margin: 0,
								textAlign: hasAnimation ? "left" : "center",
								color: "#94a3b8",
								fontWeight: 500,
								letterSpacing: "0.01em",
							}}
						>
							{subtitle}
						</p>
						<div
							style={{
								width: interpolate(subtitleSpring, [0, 1], [0, 120]),
								height: 3,
								background: "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)",
								margin: hasAnimation ? "24px 0 0" : "24px auto 0",
								borderRadius: 2,
							}}
						/>
					</div>
				)}
			</div>

			{/* Right side: Animation panel */}
			{animation === "git-machine" && (
				<div
					style={{
						flex: 1,
						position: "relative",
						borderRadius: 24,
						overflow: "hidden",
						opacity: animationSpring,
						transform: `translateX(${interpolate(animationSpring, [0, 1], [60, 0])}px) scale(${interpolate(animationSpring, [0, 1], [0.9, 1])})`,
						maxWidth: 600,
						height: "80%",
					}}
				>
					<GitMachineAnimation audioDuration={audioDuration} />
				</div>
			)}
		</div>
	);
};
