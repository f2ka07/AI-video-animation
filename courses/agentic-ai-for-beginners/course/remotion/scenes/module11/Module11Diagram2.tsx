// Module 11 Diagram 2: Production monitoring stack
import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module11Diagram2Props extends SceneProps {}

export const Module11Diagram2: React.FC<Module11Diagram2Props> = ({
	durationInFrames,
	cuePoints = [],
}) => {
	return (
		<BaseDiagramScene
			durationInFrames={durationInFrames}
			cuePoints={cuePoints}
			title="Production Monitoring Stack"
			subtitle="Latency, cost, stability, and distributed tracing."
			sectionLabel="Architecture"
			layout="immersive"
			svgPath="assets/agentic-ai-for-beginners/module11/monitoring-stack-premium.svg"
			animationSpecPath="assets/agentic-ai-for-beginners/module11/monitoring-stack-premium.animation.json"
			slideName="module-11-architecture"
			moduleNumber={11}
		/>
	);
};
