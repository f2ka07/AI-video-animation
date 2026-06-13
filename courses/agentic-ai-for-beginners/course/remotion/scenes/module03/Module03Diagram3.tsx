// Module 03 Diagram 3: Inference pipeline (TensorRT -> Triton -> NIM flow)
// Uses BaseDiagramScene with animated SVG (inference-pipeline.svg)
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
			title="Inference Pipeline Flow"
			subtitle="TensorRT optimizes, Triton serves, NIM packages - the path to production inference."
			sectionLabel="Application"
			svgPath="assets/agentic-ai-for-beginners/module03/inference-pipeline.svg"
			animationSpecPath="assets/agentic-ai-for-beginners/module03/inference-pipeline-application.animation.json"
			layout="full"
			slideName="module-3-application"
			moduleNumber={3}
		/>
	);
};
