// Module 07 Recap: Key Takeaways + exam mapping
import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { SceneProps, COLORS } from '../../shared/types';

interface Module07RecapProps extends SceneProps {}

export const Module07Recap: React.FC<Module07RecapProps> = ({ durationInFrames }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const isExamSegment = durationInFrames < 1200;

	const titleSpring = spring({
		frame,
		fps,
		config: { damping: 20, stiffness: 120 },
		durationInFrames: fps * 0.4,
	});

	const examTerms = [
		'planner, executor, router, orchestrator',
		'single-agent vs multi-agent tradeoffs',
		'event-driven, state machine, anti-loop guard',
	];

	const recapPoints = [
		'Four roles: planner structures, executor runs, router directs, orchestrator loops.',
		'Single-agent for coherent sequential work; multi-agent for specialization and fault isolation.',
		'Event-driven patterns scale with queues and state machines.',
		'Always add guards: stop conditions, max steps, and fallbacks.',
	];

	const points = isExamSegment ? examTerms : recapPoints;
	const title = isExamSegment ? 'Exam Focus' : 'Key Takeaways';
	const subtitle = isExamSegment
		? 'Scenario questions: match workload to architecture + cite reliability and coordination cost'
		: 'Module 07: Agent Architecture Deep Dive';

	const getPointSpring = (index: number) =>
		spring({
			frame,
			fps,
			config: { damping: 20, stiffness: 120 },
			delay: fps * (0.5 + index * 0.25),
			durationInFrames: fps * 0.5,
		});

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
					inset: 0,
					opacity: 0.03,
					backgroundImage: `radial-gradient(circle at 2px 2px, ${COLORS.dark.accent} 1px, transparent 0)`,
					backgroundSize: '50px 50px',
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
						color: COLORS.dark.text,
					}}
				>
					{title}
				</h2>
				<p style={{ fontSize: 24, margin: 0, marginBottom: 50, opacity: titleSpring, color: COLORS.dark.muted }}>
					{subtitle}
				</p>
				<div
					style={{
						width: interpolate(decorSpring, [0, 1], [0, 100]),
						height: 3,
						background: `linear-gradient(90deg, ${COLORS.dark.accent} 0%, ${COLORS.dark.secondary} 100%)`,
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
										background: `linear-gradient(135deg, ${COLORS.dark.accent}, ${COLORS.dark.secondary})`,
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										fontSize: 18,
										fontWeight: 700,
										color: 'white',
										flexShrink: 0,
									}}
								>
									{index + 1}
								</div>
								<p style={{ fontSize: isExamSegment ? 30 : 34, margin: 0, lineHeight: 1.5, color: COLORS.dark.muted }}>
									{point}
								</p>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};
