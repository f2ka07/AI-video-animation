import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { SceneProps, COLORS } from '../../shared/types';

interface Module12IntroProps extends SceneProps {}

export const Module12Intro: React.FC<Module12IntroProps> = ({ durationInFrames }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const openingSpring = spring({ frame, fps, config: { damping: 12, stiffness: 70 }, durationInFrames: fps * 1.5 });
	const titleSpring = spring({ frame, fps, config: { damping: 10, stiffness: 80 }, delay: fps * 2, durationInFrames: fps * 1.2 });
	const taglineSpring = spring({ frame, fps, config: { damping: 14, stiffness: 90 }, delay: fps * 3, durationInFrames: fps * 0.8 });
	const openingFadeOut = interpolate(frame, [fps * 1.8, fps * 2.5], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const lineSpring = spring({ frame, fps, config: { damping: 18, stiffness: 60 }, delay: fps * 2.5 });

	return (
		<div style={{ width: '100%', height: '100%', background: COLORS.dark.background, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontFamily: 'system-ui, sans-serif', position: 'relative' }}>
			<div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 1400, padding: '0 80px' }}>
				<p style={{ fontSize: 46, fontWeight: 500, margin: 0, marginBottom: 50, opacity: openingSpring * openingFadeOut, color: COLORS.dark.muted, lineHeight: 1.4 }}>
					Autonomous agents can act wrongly. Safety is load-bearing for production.
				</p>
				<h1 style={{ fontSize: 110, fontWeight: 800, margin: 0, opacity: titleSpring, color: '#ffffff', letterSpacing: '-0.02em' }}>
					Safety and Guardrails
				</h1>
				<p style={{ fontSize: 36, marginTop: 30, opacity: taglineSpring, color: COLORS.dark.muted }}>
					Prompt injection, misuse, human approval, and audit trails.
				</p>
				<div style={{ width: interpolate(lineSpring, [0, 1], [0, 200]), height: 4, background: COLORS.dark.accent, margin: '40px auto 0', borderRadius: 2 }} />
				<p style={{ fontSize: 18, marginTop: 24, opacity: interpolate(taglineSpring, [0, 1], [0, 0.6]), color: COLORS.dark.muted }}>Module 12 - Safety and Guardrails</p>
			</div>
		</div>
	);
};
