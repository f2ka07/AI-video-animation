// Module 03 Diagram 2: Inference Pipeline
// Uses BaseDiagramScene with animated SVG (inference-pipeline.svg + .animation.json)
import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module03Diagram2Props extends SceneProps {}

export const Module03Diagram2: React.FC<Module03Diagram2Props> = ({
	durationInFrames,
	cuePoints = [],
}) => {
	return (
		<BaseDiagramScene
			durationInFrames={durationInFrames}
			cuePoints={cuePoints}
			title="Inference Pipeline Flow"
			svgPath="assets/agentic-ai-for-beginners/module03/inference-pipeline.svg"
			layout="full"
			slideName="module-3-architecture"
			moduleNumber={3}
		/>
	);
};
