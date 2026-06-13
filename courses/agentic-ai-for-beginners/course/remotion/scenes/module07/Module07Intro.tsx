// Module 07 Intro: Agent Architecture Deep Dive
import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { SceneProps, COLORS } from '../../shared/types';

interface Module07IntroProps extends SceneProps {}

export const Module07Intro: React.FC<Module07IntroProps> = ({ durationInFrames }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const panX = Math.sin(frame / 110) * 3;
	const panY = Math.cos(frame / 90) * 2;
	const zoom = 1 + Math.sin(frame / 70) * 0.015;

	const openingSpring = spring({ frame, fps, config: { damping: 12, stiffness: 70 }, durationInFrames: fps * 1.5 });
	const titleSpring = spring({ frame, fps, config: { damping: 10, stiffness: 80 }, delay: fps * 2, durationInFrames: fps * 1.2 });
	const taglineSpring = spring({ frame, fps, config: { damping: 14, stiffness: 90 }, delay: fps * 3, durationInFrames: fps * 0.8 });
	const openingFadeOut = interpolate(frame, [fps * 1.8, fps * 2.5], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const lineSpring = spring({ frame, fps, config: { damping: 18, stiffness: 60 }, delay: fps * 2.5 });
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
			<div
				style={{
					position: 'absolute',
					inset: 0,
					opacity: 0.04,
					backgroundImage: `radial-gradient(circle at 2px 2px, ${COLORS.dark.accent} 1px, transparent 0)`,
					backgroundSize: '50px 50px',
					transform: `translate(${panX}px, ${panY}px) scale(${zoom})`,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					background: `radial-gradient(ellipse at ${50 + panX * 2}% ${50 + panY * 2}%, rgba(59, 130, 246, 0.12) 0%, transparent 55%)`,
					pointerEvents: 'none',
				}}
			/>

			<div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 1400, padding: '0 80px' }}>
				<p
					style={{
						fontSize: 50,
						fontWeight: 500,
						margin: 0,
						marginBottom: 60,
						opacity: openingSpring * openingFadeOut,
						transform: `translateY(${interpolate(openingSpring, [0, 1], [50, 0])}px)`,
						color: COLORS.dark.muted,
						lineHeight: 1.4,
					}}
				>
					Who does what? That question decides your architecture.
				</p>
				<h1
					style={{
						fontSize: 120,
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
						filter: `drop-shadow(0 0 ${glowIntensity}px rgba(59, 130, 246, 0.35))`,
					}}
				>
					Agent Architecture
				</h1>
				<div
					style={{
						width: interpolate(lineSpring, [0, 1], [0, 320]),
						height: 6,
						background: `linear-gradient(90deg, ${COLORS.dark.accent} 0%, ${COLORS.dark.secondary} 100%)`,
						margin: '50px auto',
						borderRadius: 3,
					}}
				/>
				<p
					style={{
						fontSize: 40,
						fontWeight: 400,
						margin: 0,
						opacity: taglineSpring,
						transform: `translateY(${interpolate(taglineSpring, [0, 1], [30, 0])}px)`,
						color: COLORS.dark.accent,
						fontStyle: 'italic',
					}}
				>
					Roles determine reliability, scalability, and production readiness.
				</p>
			</div>

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
				Module 07 - Architecture Deep Dive
			</div>
		</div>
	);
};
