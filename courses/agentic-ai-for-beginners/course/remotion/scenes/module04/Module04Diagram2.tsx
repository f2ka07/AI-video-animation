// Module 04 Diagram 2: Agentic inference pipeline ten stages
// Full-slide premium SVG synced to Gentle word timings
import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module04Diagram2Props extends SceneProps {}

export const Module04Diagram2: React.FC<Module04Diagram2Props> = ({
	durationInFrames,
	cuePoints = [],
}) => {
	return (
		<BaseDiagramScene
			durationInFrames={durationInFrames}
			cuePoints={cuePoints}
			title="Agentic Inference Pipeline: 10 Stages"
			subtitle="Ten stages from request intake through output, logging, and evaluation"
			sectionLabel="Architecture"
			layout="immersive"
			svgPath="assets/agentic-ai-for-beginners/module04/inference-pipeline-architecture-premium.svg"
			animationSpecPath="assets/agentic-ai-for-beginners/module04/inference-pipeline-architecture-premium.animation.json"
			slideName="module-4-architecture"
			moduleNumber={4}
		/>
	);
};
