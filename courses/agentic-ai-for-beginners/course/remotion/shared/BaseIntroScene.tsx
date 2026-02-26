// Base Intro Scene - Cinematic dark background with text motion
import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { IntroSceneProps, COLORS, MOTION_CONFIG } from './types';

export const BaseIntroScene: React.FC<IntroSceneProps> = ({
	durationInFrames,
	cuePoints = [],
	title,
	subtitle,
	tagline,
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const config = MOTION_CONFIG.intro;

	// Camera-like pan effect
	const panX = Math.sin(frame / 120) * config.panScale * 100;
	const panY = Math.cos(frame / 100) * config.panScale * 50;

	// Subtle zoom breathing
	const zoom = 1 + Math.sin(frame / 80) * config.zoomScale * 0.3;

	// Title entrance spring
	const titleSpring = spring({
		frame,
		fps,
		config: { damping: config.damping, stiffness: config.stiffness },
		durationInFrames: fps * 1.2,
	});

	// Subtitle entrance (delayed)
	const subtitleSpring = spring({
		frame,
		fps,
		config: { damping: config.damping + 2, stiffness: config.stiffness - 10 },
		delay: fps * 0.6,
		durationInFrames: fps * 0.8,
	});

	// Tagline entrance (more delayed)
	const taglineSpring = spring({
		frame,
		fps,
		config: { damping: config.damping + 4, stiffness: config.stiffness - 20 },
		delay: fps * 1.2,
		durationInFrames: fps * 0.6,
	});

	// Title transforms
	const titleOpacity = titleSpring;
	const titleY = interpolate(titleSpring, [0, 1], [60, 0]);
	const titleScale = interpolate(titleSpring, [0, 1], [0.9, 1]);

	// Subtitle transforms
	const subtitleOpacity = subtitleSpring;
	const subtitleY = interpolate(subtitleSpring, [0, 1], [40, 0]);

	// Tagline transforms
	const taglineOpacity = taglineSpring;
	const taglineY = interpolate(taglineSpring, [0, 1], [30, 0]);

	// Decorative line animation
	const lineSpring = spring({
		frame,
		fps,
		config: { damping: 20, stiffness: 60 },
		delay: fps * 0.3,
	});
	const lineWidth = interpolate(lineSpring, [0, 1], [0, 200]);

	// Glow effect for title
	const glowIntensity = 30 + Math.sin(frame / 40) * 10;

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

			{/* Gradient spotlight with movement */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: `radial-gradient(ellipse at ${50 + panX}% ${50 + panY}%, rgba(59, 130, 246, 0.12) 0%, transparent 60%)`,
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
					background: `radial-gradient(ellipse at ${70 - panX * 0.5}% ${30 - panY * 0.5}%, rgba(139, 92, 246, 0.08) 0%, transparent 50%)`,
					pointerEvents: 'none',
				}}
			/>

			{/* Content container */}
			<div
				style={{
					position: 'relative',
					zIndex: 1,
					textAlign: 'center',
					maxWidth: 1400,
					padding: '0 80px',
				}}
			>
				{/* Title */}
				<h1
					style={{
						fontSize: 96,
						fontWeight: 800,
						margin: 0,
						marginBottom: subtitle ? 40 : 0,
						opacity: titleOpacity,
						transform: `translateY(${titleY}px) scale(${titleScale})`,
						background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent',
						backgroundClip: 'text',
						letterSpacing: '-0.02em',
						lineHeight: 1.1,
						filter: `drop-shadow(0 0 ${glowIntensity}px rgba(59, 130, 246, 0.3))`,
					}}
				>
					{title}
				</h1>

				{/* Decorative line */}
				{subtitle && (
					<div
						style={{
							width: lineWidth,
							height: 4,
							background: `linear-gradient(90deg, ${COLORS.dark.accent} 0%, ${COLORS.dark.secondary} 100%)`,
							margin: '0 auto 40px',
							borderRadius: 2,
						}}
					/>
				)}

				{/* Subtitle */}
				{subtitle && (
					<p
						style={{
							fontSize: 42,
							fontWeight: 500,
							margin: 0,
							marginBottom: tagline ? 30 : 0,
							opacity: subtitleOpacity,
							transform: `translateY(${subtitleY}px)`,
							color: COLORS.dark.muted,
							letterSpacing: '0.01em',
						}}
					>
						{subtitle}
					</p>
				)}

				{/* Tagline */}
				{tagline && (
					<p
						style={{
							fontSize: 28,
							fontWeight: 400,
							margin: 0,
							opacity: taglineOpacity,
							transform: `translateY(${taglineY}px)`,
							color: COLORS.dark.accent,
							fontStyle: 'italic',
						}}
					>
						{tagline}
					</p>
				)}
			</div>

			{/* Decorative corner accents */}
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
		</div>
	);
};
