// Module 01 Intro: The Agentic AI Transition
// Cinematic introduction with dark theme
import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { SceneProps, COLORS } from '../../shared/types';

interface Module01IntroProps extends SceneProps {}

export const Module01Intro: React.FC<Module01IntroProps> = ({
	durationInFrames,
	cuePoints = [],
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	// Camera-like pan effect
	const panX = Math.sin(frame / 120) * 3;
	const panY = Math.cos(frame / 100) * 2;
	const zoom = 1 + Math.sin(frame / 80) * 0.015;

	// Opening line spring
	const openingSpring = spring({
		frame,
		fps,
		config: { damping: 12, stiffness: 70 },
		durationInFrames: fps * 1.5,
	});

	// Main title spring (delayed)
	const titleSpring = spring({
		frame,
		fps,
		config: { damping: 10, stiffness: 80 },
		delay: fps * 2,
		durationInFrames: fps * 1.2,
	});

	// Tagline spring
	const taglineSpring = spring({
		frame,
		fps,
		config: { damping: 14, stiffness: 90 },
		delay: fps * 3.2,
		durationInFrames: fps * 0.8,
	});

	// Opening transforms
	const openingOpacity = openingSpring;
	const openingY = interpolate(openingSpring, [0, 1], [50, 0]);
	const openingScale = interpolate(openingSpring, [0, 1], [0.9, 1]);

	// Fade out opening as title comes in
	const openingFadeOut = interpolate(frame, [fps * 1.8, fps * 2.5], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Title transforms
	const titleOpacity = titleSpring;
	const titleY = interpolate(titleSpring, [0, 1], [60, 0]);
	const titleScale = interpolate(titleSpring, [0, 1], [0.85, 1]);

	// Tagline transforms
	const taglineOpacity = taglineSpring;
	const taglineY = interpolate(taglineSpring, [0, 1], [30, 0]);

	// Decorative line
	const lineSpring = spring({
		frame,
		fps,
		config: { damping: 18, stiffness: 60 },
		delay: fps * 2.5,
	});
	const lineWidth = interpolate(lineSpring, [0, 1], [0, 300]);

	// Glow effect
	const glowIntensity = 35 + Math.sin(frame / 35) * 12;

	return (
		<div
			style={{
				width: '100%',
				height: '100%',
				background: COLORS.dark.background,
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
				overflow: 'hidden',
				position: 'relative',
			}}
		>
			{/* Animated background grid with pan */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					opacity: 0.04,
					backgroundImage: `radial-gradient(circle at 2px 2px, ${COLORS.dark.accent} 1px, transparent 0)`,
					backgroundSize: '50px 50px',
					transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
				}}
			/>

			{/* Primary spotlight */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: `radial-gradient(ellipse at ${50 + panX * 2}% ${50 + panY * 2}%, rgba(59, 130, 246, 0.15) 0%, transparent 55%)`,
					pointerEvents: 'none',
				}}
			/>

			{/* Secondary spotlight */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: `radial-gradient(ellipse at ${65 - panX}% ${35 - panY}%, rgba(139, 92, 246, 0.1) 0%, transparent 45%)`,
					pointerEvents: 'none',
				}}
			/>

			{/* Content */}
			<div
				style={{
					position: 'relative',
					zIndex: 1,
					textAlign: 'center',
					maxWidth: 1400,
					padding: '0 80px',
				}}
			>
				{/* Opening statement */}
				<p
					style={{
						fontSize: 56,
						fontWeight: 500,
						margin: 0,
						marginBottom: 60,
						opacity: openingOpacity * openingFadeOut,
						transform: `translateY(${openingY}px) scale(${openingScale})`,
						color: COLORS.dark.muted,
						letterSpacing: '0.01em',
						lineHeight: 1.4,
					}}
				>
					The age of typing prompts into a chat window is ending.
				</p>

				{/* Main title */}
				<h1
					style={{
						fontSize: 140,
						fontWeight: 800,
						margin: 0,
						opacity: titleOpacity,
						transform: `translateY(${titleY}px) scale(${titleScale})`,
						background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						backgroundClip: 'text',
						letterSpacing: '-0.03em',
						lineHeight: 1.1,
						filter: `drop-shadow(0 0 ${glowIntensity}px rgba(59, 130, 246, 0.35))`,
					}}
				>
					Agentic AI
				</h1>

				{/* Decorative line */}
				<div
					style={{
						width: lineWidth,
						height: 6,
						background: `linear-gradient(90deg, ${COLORS.dark.accent} 0%, ${COLORS.dark.secondary} 100%)`,
						margin: '50px auto',
						borderRadius: 3,
					}}
				/>

				{/* Tagline */}
				<p
					style={{
						fontSize: 44,
						fontWeight: 400,
						margin: 0,
						opacity: taglineOpacity,
						transform: `translateY(${taglineY}px)`,
						color: COLORS.dark.accent,
						fontStyle: 'italic',
					}}
				>
					From AI as interface, to AI as infrastructure.
				</p>
			</div>

			{/* Corner accents */}
			<div
				style={{
					position: 'absolute',
					top: 40,
					left: 40,
					width: interpolate(lineSpring, [0, 1], [0, 80]),
					height: 3,
					background: COLORS.dark.accent,
					opacity: 0.5,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					top: 40,
					left: 40,
					width: 3,
					height: interpolate(lineSpring, [0, 1], [0, 80]),
					background: COLORS.dark.accent,
					opacity: 0.5,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					bottom: 40,
					right: 40,
					width: interpolate(lineSpring, [0, 1], [0, 80]),
					height: 3,
					background: COLORS.dark.secondary,
					opacity: 0.5,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					bottom: 40,
					right: 40,
					width: 3,
					height: interpolate(lineSpring, [0, 1], [0, 80]),
					background: COLORS.dark.secondary,
					opacity: 0.5,
				}}
			/>

			{/* Module indicator */}
			<div
				style={{
					position: 'absolute',
					bottom: 50,
					left: '50%',
					transform: 'translateX(-50%)',
					opacity: interpolate(taglineSpring, [0, 1], [0, 0.6]),
					color: COLORS.dark.muted,
					fontSize: 16,
					fontWeight: 500,
					letterSpacing: '0.1em',
					textTransform: 'uppercase',
				}}
			>
				Module 01 - The Transition
			</div>
		</div>
	);
};
