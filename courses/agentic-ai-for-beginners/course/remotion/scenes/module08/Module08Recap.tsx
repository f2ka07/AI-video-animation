import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { SceneProps, COLORS } from '../../shared/types';

interface Module08RecapProps extends SceneProps {}

export const Module08Recap: React.FC<Module08RecapProps> = ({ durationInFrames }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const isExamSegment = durationInFrames < 1200;
	const titleSpring = spring({ frame, fps, config: { damping: 20, stiffness: 120 }, durationInFrames: fps * 0.4 });
	const examTerms = [
		'task decomposition, reflection, working vs long-term memory',
		'match failure modes to memory fixes',
		'memory hygiene, TTL, anti-loop guards',
	];
	const recapPoints = [
		'Reasoning fails: forgotten instructions, missing context, looping.',
		'Working memory, long-term retrieval, and session guards each fix a failure mode.',
		'Reflection patterns improve quality; hygiene keeps memory useful.',
	];
	const points = isExamSegment ? examTerms : recapPoints;
	const title = isExamSegment ? 'Exam Focus' : 'Key Takeaways';
	const subtitle = isExamSegment ? 'Certification terms and scenario matching' : 'Module 08: Reasoning, Planning, and Memory';

	return (
		<div style={{ width: '100%', height: '100%', background: COLORS.dark.background, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 100, fontFamily: 'system-ui, sans-serif' }}>
			<h2 style={{ fontSize: 64, fontWeight: 800, margin: 0, marginBottom: 16, opacity: titleSpring, color: '#fff' }}>{title}</h2>
			<p style={{ fontSize: 24, color: COLORS.dark.muted, marginBottom: 48 }}>{subtitle}</p>
			<div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
				{points.map((point, i) => {
					const s = spring({ frame, fps, config: { damping: 20, stiffness: 120 }, delay: fps * (0.4 + i * 0.2), durationInFrames: fps * 0.5 });
					return (
						<div key={i} style={{ opacity: s, padding: '18px 24px', background: 'rgba(30,41,59,0.65)', borderRadius: 12, borderLeft: '4px solid #3b82f6' }}>
							<p style={{ margin: 0, fontSize: 28, color: '#f1f5f9', lineHeight: 1.5 }}>{point}</p>
						</div>
					);
				})}
			</div>
		</div>
	);
};
