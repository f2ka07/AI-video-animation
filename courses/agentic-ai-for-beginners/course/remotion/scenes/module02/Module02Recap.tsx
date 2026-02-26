// Module 02 Recap: Key Takeaways
import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { SceneProps, COLORS } from '../../shared/types';

interface Module02RecapProps extends SceneProps {}

export const Module02Recap: React.FC<Module02RecapProps> = ({
	durationInFrames,
	cuePoints = [],
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const titleSpring = spring({
		frame,
		fps,
		config: { damping: 20, stiffness: 120 },
		durationInFrames: fps * 0.4,
	});

	const points = [
		'An agent wraps a language model in a control loop: plan, act, observe, adapt.',
		'The agent loop has six core components: planning, tools, memory, retrieval, safety, HITL.',
		'Demos show single calls. Real workloads require loops.',
		'Enterprises adopt agents because their problems are multi-step and multi-tool.',
	];

	const getPointSpring = (index: number) => {
		return spring({
			frame,
			fps,
			config: { damping: 20, stiffness: 120 },
			delay: fps * (0.5 + index * 0.25),
			durationInFrames: fps * 0.5,
		});
	};

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
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					opacity: 0.03,
					backgroundImage: `radial-gradient(circle at 2px 2px, #10b981 1px, transparent 0)`,
					backgroundSize: '50px 50px',
				}}
			/>

			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: `radial-gradient(ellipse at 30% 50%, rgba(16, 185, 129, 0.06) 0%, transparent 50%)`,
					pointerEvents: 'none',
				}}
			/>

			<div style={{ position: 'relative', zIndex: 1, maxWidth: 1400 }}>
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

				<p
					style={{
						fontSize: 24,
						margin: 0,
						marginBottom: 50,
						opacity: titleSpring,
						color: COLORS.dark.muted,
					}}
				>
					Module 02: Agent Fundamentals
				</p>

				<div
					style={{
						width: interpolate(decorSpring, [0, 1], [0, 100]),
						height: 3,
						background: `linear-gradient(90deg, #10b981 0%, ${COLORS.dark.accent} 100%)`,
						marginBottom: 50,
						borderRadius: 2,
					}}
				/>

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
								<div
									style={{
										width: 36,
										height: 36,
										borderRadius: '50%',
										background: `linear-gradient(135deg, #10b981, ${COLORS.dark.accent})`,
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										fontSize: 18,
										fontWeight: 700,
										color: 'white',
										flexShrink: 0,
										boxShadow: `0 0 20px rgba(16, 185, 129, 0.4)`,
									}}
								>
									{index + 1}
								</div>
								<p style={{ fontSize: 34, margin: 0, lineHeight: 1.5, color: COLORS.dark.muted, fontWeight: 400 }}>
									{point}
								</p>
							</div>
						);
					})}
				</div>
			</div>

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
				<p style={{ fontSize: 32, color: '#10b981', margin: 0, fontStyle: 'italic' }}>
					The loop is the foundation. Everything else builds on it.
				</p>
			</div>

			<div style={{ position: 'absolute', bottom: 50, left: 50, width: interpolate(decorSpring, [0, 1], [0, 60]), height: 2, background: '#10b981', opacity: 0.4 }} />
			<div style={{ position: 'absolute', bottom: 50, left: 50, width: 2, height: interpolate(decorSpring, [0, 1], [0, 60]), background: '#10b981', opacity: 0.4 }} />
		</div>
	);
};
