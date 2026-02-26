// Base Recap Scene - Dark background with minimal motion
import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { RecapSceneProps, COLORS, MOTION_CONFIG } from './types';

export const BaseRecapScene: React.FC<RecapSceneProps> = ({
	durationInFrames,
	cuePoints = [],
	title,
	points,
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const config = MOTION_CONFIG.recap;

	// Title entrance
	const titleSpring = spring({
		frame,
		fps,
		config: { damping: config.damping, stiffness: config.stiffness },
		durationInFrames: fps * 0.4,
	});

	// Staggered point entrances
	const getPointSpring = (index: number) => {
		const staggerDelay = fps * 0.2;
		const baseDelay = fps * 0.5;
		return spring({
			frame,
			fps,
			config: { damping: config.damping, stiffness: config.stiffness },
			delay: baseDelay + index * staggerDelay,
			durationInFrames: fps * config.fadeInDuration,
		});
	};

	// Title transforms
	const titleOpacity = titleSpring;
	const titleY = interpolate(titleSpring, [0, 1], [15, 0]);

	// Decorative elements
	const decorSpring = spring({
		frame,
		fps,
		config: { damping: 25, stiffness: 70 },
		delay: fps * 0.2,
	});

	return (
		<div
			style={{
				width: '100%',
				height: '100%',
				background: COLORS.dark.background,
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				padding: 100,
				fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
				overflow: 'hidden',
				position: 'relative',
			}}
		>
			{/* Static background grid (no animation for recap) */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					opacity: 0.03,
					backgroundImage: `radial-gradient(circle at 2px 2px, ${COLORS.dark.accent} 1px, transparent 0)`,
					backgroundSize: '50px 50px',
				}}
			/>

			{/* Simple gradient overlay */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: `radial-gradient(ellipse at 30% 50%, rgba(59, 130, 246, 0.06) 0%, transparent 50%)`,
					pointerEvents: 'none',
				}}
			/>

			{/* Content */}
			<div style={{ position: 'relative', zIndex: 1, maxWidth: 1400 }}>
				{/* Title */}
				<h2
					style={{
						fontSize: 56,
						fontWeight: 700,
						margin: 0,
						marginBottom: 60,
						opacity: titleOpacity,
						transform: `translateY(${titleY}px)`,
						color: COLORS.dark.text,
						letterSpacing: '-0.01em',
					}}
				>
					{title}
				</h2>

				{/* Accent line */}
				<div
					style={{
						width: interpolate(decorSpring, [0, 1], [0, 100]),
						height: 3,
						background: `linear-gradient(90deg, ${COLORS.dark.accent} 0%, ${COLORS.dark.secondary} 100%)`,
						marginBottom: 50,
						borderRadius: 2,
					}}
				/>

				{/* Key points */}
				<div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
					{points.map((point, index) => {
						const pointSpring = getPointSpring(index);
						const pointOpacity = pointSpring;
						const pointX = interpolate(pointSpring, [0, 1], [-20, 0]);

						return (
							<div
								key={index}
								style={{
									display: 'flex',
									alignItems: 'flex-start',
									gap: 20,
									opacity: pointOpacity,
									transform: `translateX(${pointX}px)`,
								}}
							>
								{/* Bullet indicator */}
								<div
									style={{
										width: 8,
										height: 8,
										backgroundColor: COLORS.dark.accent,
										borderRadius: '50%',
										marginTop: 12,
										flexShrink: 0,
										boxShadow: `0 0 12px rgba(59, 130, 246, 0.5)`,
									}}
								/>
								<p
									style={{
										fontSize: 32,
										margin: 0,
										lineHeight: 1.5,
										color: COLORS.dark.muted,
										fontWeight: 400,
									}}
								>
									{point}
								</p>
							</div>
						);
					})}
				</div>
			</div>

			{/* Corner accents */}
			<div
				style={{
					position: 'absolute',
					bottom: 50,
					left: 50,
					width: interpolate(decorSpring, [0, 1], [0, 60]),
					height: 2,
					background: COLORS.dark.accent,
					opacity: 0.4,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					bottom: 50,
					left: 50,
					width: 2,
					height: interpolate(decorSpring, [0, 1], [0, 60]),
					background: COLORS.dark.accent,
					opacity: 0.4,
				}}
			/>
		</div>
	);
};
