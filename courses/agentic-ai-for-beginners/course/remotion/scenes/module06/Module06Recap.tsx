// Module 06 Recap: Key Takeaways
import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { SceneProps, COLORS } from '../../shared/types';

interface Module06RecapProps extends SceneProps {}

export const Module06Recap: React.FC<Module06RecapProps> = ({
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
		'Agentic AI is a business category. Enterprises adopt it for automation, speed, consistency, traceability, and scalability.',
		'Primary use cases: knowledge management, customer ops, research, document automation, data workflows.',
		'Adoption happens in stages: pilot, integration, scale-out, platform standardization.',
		'Most organizations are early in this journey - sustained investment and alignment matter.',
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
					backgroundImage: `radial-gradient(circle at 2px 2px, #ec4899 1px, transparent 0)`,
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
					background: `radial-gradient(ellipse at 30% 50%, rgba(236, 72, 153, 0.06) 0%, transparent 50%)`,
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

				<p style={{ fontSize: 24, margin: 0, marginBottom: 50, opacity: titleSpring, color: COLORS.dark.muted }}>
					Module 06: Enterprise and Industry Use Cases
				</p>

				<div
					style={{
						width: interpolate(decorSpring, [0, 1], [0, 100]),
						height: 3,
						background: `linear-gradient(90deg, #ec4899 0%, #f59e0b 100%)`,
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
										background: `linear-gradient(135deg, #ec4899, #f59e0b)`,
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										fontSize: 18,
										fontWeight: 700,
										color: 'white',
										flexShrink: 0,
										boxShadow: `0 0 20px rgba(236, 72, 153, 0.4)`,
									}}
								>
									{index + 1}
								</div>
								<p style={{ fontSize: 32, margin: 0, lineHeight: 1.5, color: COLORS.dark.muted, fontWeight: 400 }}>
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
				<p style={{ fontSize: 32, color: '#ec4899', margin: 0, fontStyle: 'italic' }}>
					Practical grounding for enterprise adoption - value drivers and use cases.
				</p>
			</div>

			<div style={{ position: 'absolute', bottom: 50, left: 50, width: interpolate(decorSpring, [0, 1], [0, 60]), height: 2, background: '#ec4899', opacity: 0.4 }} />
			<div style={{ position: 'absolute', bottom: 50, left: 50, width: 2, height: interpolate(decorSpring, [0, 1], [0, 60]), background: '#ec4899', opacity: 0.4 }} />
		</div>
	);
};
