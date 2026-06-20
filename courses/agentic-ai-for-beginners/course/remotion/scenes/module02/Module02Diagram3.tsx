// Module 02 Diagram 3: Real Workloads Need Loops
// Full-slide premium SVG synced to Gentle word timings
import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module02Diagram3Props extends SceneProps {}

export const Module02Diagram3: React.FC<Module02Diagram3Props> = ({
	durationInFrames,
	cuePoints = [],
}) => {
	return (
		<BaseDiagramScene
			durationInFrames={durationInFrames}
			cuePoints={cuePoints}
			title="Real Workloads Need Loops"
			subtitle="Support and research workflows are multi-step, not single-call"
			sectionLabel="Application"
			layout="immersive"
			svgPath="assets/agentic-ai-for-beginners/module02/agent-workloads-premium.svg"
			animationSpecPath="assets/agentic-ai-for-beginners/module02/agent-workloads-premium.animation.json"
			slideName="module-2-application"
			moduleNumber={2}
		/>
	);
};
