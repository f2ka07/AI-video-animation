// Module 12 Recap: Key Takeaways - Course Finale
import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { SceneProps, COLORS } from '../../shared/types';

interface Module12RecapProps extends SceneProps {}

export const Module12Recap: React.FC<Module12RecapProps> = ({
	durationInFrames,
	cuePoints = [],
}) => {
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
		'Prompt injection defenses',
		'Human-in-the-loop and audit trails',
		'Compliance and transparency requirements',
	];

	const recapPoints = [
		'Defend against injection and misuse at input and output boundaries.',
		'Gate risky actions with human approval, policy filters, and audit logs.',
		'Design for compliance: data handling, privacy, and approval workflows.',
		'Build safety and transparency in from day one - it is load-bearing for production agents.',
	];

	const points = isExamSegment ? examTerms : recapPoints;
	const title = isExamSegment ? 'Exam Focus' : 'Course Complete';
	const subtitle = isExamSegment
		? 'Certification terms and scenario matching'
		: 'Module 12: Safety and Guardrails';

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

	const finaleSpring = spring({
		frame,
		fps,
		config: { damping: 15, stiffness: 80 },
		delay: fps * 2,
		durationInFrames: fps * 0.8,
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
					backgroundImage: `radial-gradient(circle at 2px 2px, #ef4444 1px, transparent 0)`,
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
					background: `radial-gradient(ellipse at 30% 50%, rgba(239, 68, 68, 0.06) 0%, transparent 50%)`,
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
					{title}
				</h2>

				<p style={{ fontSize: 24, margin: 0, marginBottom: 50, opacity: titleSpring, color: COLORS.dark.muted }}>
					{subtitle}
				</p>

				<div
					style={{
						width: interpolate(decorSpring, [0, 1], [0, 100]),
						height: 3,
						background: `linear-gradient(90deg, #ef4444 0%, #dc2626 100%)`,
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
										background: `linear-gradient(135deg, #ef4444, #dc2626)`,
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										fontSize: 18,
										fontWeight: 700,
										color: 'white',
										flexShrink: 0,
										boxShadow: `0 0 20px rgba(239, 68, 68, 0.4)`,
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

			{!isExamSegment && (
				<div
					style={{
						position: 'absolute',
						bottom: 80,
						left: 100,
						right: 100,
						textAlign: 'center',
						opacity: finaleSpring,
						transform: `translateY(${interpolate(finaleSpring, [0, 1], [20, 0])}px)`,
					}}
				>
					<p
						style={{
							fontSize: 36,
							color: '#ef4444',
							margin: 0,
							fontWeight: 600,
						}}
					>
						The rest is practice. Good luck on the exam.
					</p>
				</div>
			)}

			<div style={{ position: 'absolute', bottom: 50, left: 50, width: interpolate(decorSpring, [0, 1], [0, 60]), height: 2, background: '#ef4444', opacity: 0.4 }} />
			<div style={{ position: 'absolute', bottom: 50, left: 50, width: 2, height: interpolate(decorSpring, [0, 1], [0, 60]), background: '#ef4444', opacity: 0.4 }} />
		</div>
	);
};
