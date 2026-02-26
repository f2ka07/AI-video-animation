// Module 02 Diagram 3: Single-Call vs Agentic Inference
// Uses BaseDiagramScene with animated SVG (agent-vs-singlecall.svg + .animation.json)
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
			title="Single-Call vs Agentic Inference"
			svgPath="assets/agentic-ai-for-beginners/module02/agent-vs-singlecall.svg"
			layout="full"
			slideName="module-2-application"
			moduleNumber={2}
		/>
	);
};
