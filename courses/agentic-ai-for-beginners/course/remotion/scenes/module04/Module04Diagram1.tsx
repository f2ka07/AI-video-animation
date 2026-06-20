// Module 04 Diagram 1: Workloads vs demos concept
// Full-slide premium SVG synced to Gentle word timings
import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module04Diagram1Props extends SceneProps {}

export const Module04Diagram1: React.FC<Module04Diagram1Props> = ({
	durationInFrames,
	cuePoints = [],
}) => {
	return (
		<BaseDiagramScene
			durationInFrames={durationInFrames}
			cuePoints={cuePoints}
			title="Workloads vs Demos"
			subtitle="Workloads are sustained production processes, not one-off demos"
			sectionLabel="Concept"
			layout="immersive"
			svgPath="assets/agentic-ai-for-beginners/module04/inference-pipeline-concept-premium.svg"
			animationSpecPath="assets/agentic-ai-for-beginners/module04/inference-pipeline-concept-premium.animation.json"
			slideName="module-4-concept"
			moduleNumber={4}
		/>
	);
};
