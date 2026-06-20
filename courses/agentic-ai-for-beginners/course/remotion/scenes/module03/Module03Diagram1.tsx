// Module 03 Diagram 1: NVIDIA AI Platform Stack concept
// Full-slide premium SVG synced to Gentle word timings
import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module03Diagram1Props extends SceneProps {}

export const Module03Diagram1: React.FC<Module03Diagram1Props> = ({
	durationInFrames,
	cuePoints = [],
}) => {
	return (
		<BaseDiagramScene
			durationInFrames={durationInFrames}
			cuePoints={cuePoints}
			title="The Infrastructure Problem"
			subtitle="Production AI needs GPUs, software, serving, deployment, and integration"
			sectionLabel="Concept"
			layout="immersive"
			svgPath="assets/agentic-ai-for-beginners/module03/nvidia-stack-concept-premium.svg"
			animationSpecPath="assets/agentic-ai-for-beginners/module03/nvidia-stack-concept-premium.animation.json"
			slideName="module-3-concept"
			moduleNumber={3}
		/>
	);
};
