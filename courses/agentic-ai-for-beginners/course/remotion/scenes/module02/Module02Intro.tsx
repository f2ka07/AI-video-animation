// Module 02 Intro: Agent Fundamentals
// Cinematic introduction with dark theme
import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { SceneProps, COLORS } from '../../shared/types';

interface Module02IntroProps extends SceneProps {}

export const Module02Intro: React.FC<Module02IntroProps> = ({
	durationInFrames,
	cuePoints = [],
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	// Camera effects
	const panX = Math.sin(frame / 110) * 3;
	const panY = Math.cos(frame / 90) * 2;
	const zoom = 1 + Math.sin(frame / 70) * 0.015;

	// Opening line
	const openingSpring = spring({
		frame,
		fps,
		config: { damping: 12, stiffness: 70 },
		durationInFrames: fps * 1.5,
	});

	// Main title
	const titleSpring = spring({
		frame,
		fps,
		config: { damping: 10, stiffness: 80 },
		delay: fps * 2,
		durationInFrames: fps * 1.2,
	});

	// Tagline
	const taglineSpring = spring({
		frame,
		fps,
		config: { damping: 14, stiffness: 90 },
		delay: fps * 3,
		durationInFrames: fps * 0.8,
	});

	// Fade out opening
	const openingFadeOut = interpolate(frame, [fps * 1.8, fps * 2.5], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// Decorative line
	const lineSpring = spring({
		frame,
		fps,
		config: { damping: 18, stiffness: 60 },
		delay: fps * 2.5,
	});

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
			{/* Background grid */}
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

			{/* Spotlights */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: `radial-gradient(ellipse at ${50 + panX * 2}% ${50 + panY * 2}%, rgba(16, 185, 129, 0.12) 0%, transparent 55%)`,
					pointerEvents: 'none',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: `radial-gradient(ellipse at ${65 - panX}% ${35 - panY}%, rgba(59, 130, 246, 0.1) 0%, transparent 45%)`,
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
				{/* Opening */}
				<p
					style={{
						fontSize: 52,
						fontWeight: 500,
						margin: 0,
						marginBottom: 60,
						opacity: openingSpring * openingFadeOut,
						transform: `translateY(${interpolate(openingSpring, [0, 1], [50, 0])}px)`,
						color: COLORS.dark.muted,
						lineHeight: 1.4,
					}}
				>
					Every demo you've ever seen of a language model lied to you.
				</p>

				{/* Title */}
				<h1
					style={{
						fontSize: 130,
						fontWeight: 800,
						margin: 0,
						opacity: titleSpring,
						transform: `translateY(${interpolate(titleSpring, [0, 1], [60, 0])}px) scale(${interpolate(titleSpring, [0, 1], [0.85, 1])})`,
						background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						backgroundClip: 'text',
						letterSpacing: '-0.03em',
						lineHeight: 1.1,
						filter: `drop-shadow(0 0 ${glowIntensity}px rgba(16, 185, 129, 0.35))`,
					}}
				>
					The Agent Loop
				</h1>

				{/* Line */}
				<div
					style={{
						width: interpolate(lineSpring, [0, 1], [0, 350]),
						height: 6,
						background: `linear-gradient(90deg, #10b981 0%, #3b82f6 100%)`,
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
						opacity: taglineSpring,
						transform: `translateY(${interpolate(taglineSpring, [0, 1], [30, 0])}px)`,
						color: '#10b981',
						fontStyle: 'italic',
					}}
				>
					Real work is a loop, not a line.
				</p>
			</div>

			{/* Corner accents */}
			<div style={{ position: 'absolute', top: 40, left: 40, width: interpolate(lineSpring, [0, 1], [0, 80]), height: 3, background: '#10b981', opacity: 0.5 }} />
			<div style={{ position: 'absolute', top: 40, left: 40, width: 3, height: interpolate(lineSpring, [0, 1], [0, 80]), background: '#10b981', opacity: 0.5 }} />
			<div style={{ position: 'absolute', bottom: 40, right: 40, width: interpolate(lineSpring, [0, 1], [0, 80]), height: 3, background: COLORS.dark.accent, opacity: 0.5 }} />
			<div style={{ position: 'absolute', bottom: 40, right: 40, width: 3, height: interpolate(lineSpring, [0, 1], [0, 80]), background: COLORS.dark.accent, opacity: 0.5 }} />

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
				Module 02 - Fundamentals
			</div>
		</div>
	);
};
