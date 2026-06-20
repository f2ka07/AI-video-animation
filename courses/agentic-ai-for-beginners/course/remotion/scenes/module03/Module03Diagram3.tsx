// Module 03 Diagram 3: Inference for agentic workloads
// Full-slide premium SVG synced to Gentle word timings
import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module03Diagram3Props extends SceneProps {}

export const Module03Diagram3: React.FC<Module03Diagram3Props> = ({
	durationInFrames,
	cuePoints = [],
}) => {
	return (
		<BaseDiagramScene
			durationInFrames={durationInFrames}
			cuePoints={cuePoints}
			title="Inference for Agentic Workloads"
			subtitle="TensorRT optimizes, Triton serves, NIM packages - self-hosted production path"
			sectionLabel="Application"
			layout="immersive"
			svgPath="assets/agentic-ai-for-beginners/module03/nvidia-inference-premium.svg"
			animationSpecPath="assets/agentic-ai-for-beginners/module03/nvidia-inference-premium.animation.json"
			slideName="module-3-application"
			moduleNumber={3}
		/>
	);
};
