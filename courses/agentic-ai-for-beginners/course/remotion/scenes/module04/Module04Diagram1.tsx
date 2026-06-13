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
			subtitle="Let's define our terms: workloads are sustained production processes, not one-off demos."
			sectionLabel="Concept"
			svgPath="assets/agentic-ai-for-beginners/module04/inference-pipeline-full.svg"
			animationSpecPath="assets/agentic-ai-for-beginners/module04/inference-pipeline-concept.animation.json"
			layout="full"
			slideName="module-4-concept"
			moduleNumber={4}
		/>
	);
};
