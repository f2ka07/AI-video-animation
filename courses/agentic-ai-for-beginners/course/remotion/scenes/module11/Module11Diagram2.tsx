import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module11Diagram2Props extends SceneProps {}

export const Module11Diagram2: React.FC<Module11Diagram2Props> = ({ durationInFrames, cuePoints = [] }) => (
	<BaseDiagramScene
		durationInFrames={durationInFrames}
		cuePoints={cuePoints}
		title="Production Monitoring Stack"
		subtitle="Latency, cost, stability, and distributed tracing."
		sectionLabel="Architecture"
		svgPath="assets/agentic-ai-for-beginners/module11/production-monitoring-stack.svg"
		animationSpecPath="assets/agentic-ai-for-beginners/module11/production-monitoring-stack-architecture.animation.json"
		layout="full"
		slideName="module-11-architecture"
		moduleNumber={11}
	/>
);
