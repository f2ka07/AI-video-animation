// Module 04 Diagram 1: Full Inference Pipeline
// Uses BaseDiagramScene with animated SVG (inference-pipeline-full.svg + .animation.json)
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
			title="Agentic Inference Pipeline: 10 Stages"
			svgPath="assets/agentic-ai-for-beginners/module04/inference-pipeline-full.svg"
			layout="full"
			slideName="module-4-concept"
			moduleNumber={4}
		/>
	);
};
