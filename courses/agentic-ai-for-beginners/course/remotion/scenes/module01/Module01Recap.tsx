// Module 01 Recap: Key Takeaways
// Dark background with minimal motion
import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { SceneProps, COLORS } from '../../shared/types';

interface Module01RecapProps extends SceneProps {}

export const Module01Recap: React.FC<Module01RecapProps> = ({
	durationInFrames,
	cuePoints = [],
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	// Title entrance
	const titleSpring = spring({
		frame,
		fps,
		config: { damping: 20, stiffness: 120 },
		durationInFrames: fps * 0.4,
	});

	// Key points
	const points = [
		'Prompting was never the product. It was the user interface for early adoption.',
		'Agents are architectures, not chatbots. They combine planning, tools, memory, safety, and human oversight.',
		'Enterprises adopt agentic AI for reliability, traceability, and integration.',
		'The NVIDIA certification validates understanding of how agentic systems are built and operated.',
	];

	// Staggered point entrances
	const getPointSpring = (index: number) => {
		return spring({
			frame,
			fps,
			config: { damping: 20, stiffness: 120 },
			delay: fps * (0.5 + index * 0.25),
			durationInFrames: fps * 0.5,
		});
	};

	// Decorative spring
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
			{/* Static background grid */}
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
						fontSize: 72,
						fontWeight: 700,
						margin: 0,
						marginBottom: 20,
						opacity: titleSpring,
						transform: `translateY(${interpolate(titleSpring, [0, 1], [15, 0])}px)`,
						color: COLORS.dark.text,
					}}
				>
					Key Takeaways
				</h2>

				{/* Subtitle */}
				<p
					style={{
						fontSize: 24,
						margin: 0,
						marginBottom: 50,
						opacity: titleSpring,
						color: COLORS.dark.muted,
					}}
				>
					Module 01: The Agentic AI Transition
				</p>

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

						return (
							<div
								key={index}
								style={{
									display: 'flex',
									alignItems: 'flex-start',
									gap: 24,
									opacity: pointSpring,
									transform: `translateX(${interpolate(pointSpring, [0, 1], [-20, 0])}px)`,
								}}
							>
								{/* Number indicator */}
								<div
									style={{
										width: 36,
										height: 36,
										borderRadius: '50%',
										background: `linear-gradient(135deg, ${COLORS.dark.accent}, ${COLORS.dark.secondary})`,
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										fontSize: 18,
										fontWeight: 700,
										color: 'white',
										flexShrink: 0,
										boxShadow: `0 0 20px rgba(59, 130, 246, 0.4)`,
									}}
								>
									{index + 1}
								</div>
								<p
									style={{
										fontSize: 34,
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

			{/* Closing statement */}
			<div
				style={{
					position: 'absolute',
					bottom: 80,
					left: 100,
					right: 100,
					textAlign: 'center',
					opacity: interpolate(getPointSpring(3), [0, 1], [0, 0.8]),
				}}
			>
				<p
					style={{
						fontSize: 32,
						color: COLORS.dark.accent,
						margin: 0,
						fontStyle: 'italic',
					}}
				>
					This is the new baseline. Let's build on it.
				</p>
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
