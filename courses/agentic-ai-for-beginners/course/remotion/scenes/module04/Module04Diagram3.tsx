// Module 04 Diagram 3: Enterprise workload examples and constraints
// Uses BaseDiagramScene with animated SVG (workload-matrix.svg)
import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module04Diagram3Props extends SceneProps {}

export const Module04Diagram3: React.FC<Module04Diagram3Props> = ({
	durationInFrames,
	cuePoints = [],
}) => {
	return (
		<BaseDiagramScene
			durationInFrames={durationInFrames}
			cuePoints={cuePoints}
			title="Enterprise Workload Matrix"
			subtitle="Real enterprise patterns and the latency-accuracy-cost tradeoffs that shape them."
			sectionLabel="Application"
			svgPath="assets/agentic-ai-for-beginners/module04/workload-matrix.svg"
			animationSpecPath="assets/agentic-ai-for-beginners/module04/workload-matrix-application.animation.json"
			layout="full"
			slideName="module-4-application"
			moduleNumber={4}
		/>
	);
};
