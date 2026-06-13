// Module 05 Diagram 3: Deployment models and business drivers
// Uses BaseDiagramScene with animated SVG (deployment-decision-matrix.svg)
import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module05Diagram3Props extends SceneProps {}

export const Module05Diagram3: React.FC<Module05Diagram3Props> = ({
	durationInFrames,
	cuePoints = [],
}) => {
	return (
		<BaseDiagramScene
			durationInFrames={durationInFrames}
			cuePoints={cuePoints}
			title="Deployment Decision Matrix"
			subtitle="Matching deployment choice to velocity, flexibility, compliance, and latency needs."
			sectionLabel="Application"
			svgPath="assets/agentic-ai-for-beginners/module05/deployment-decision-matrix.svg"
			animationSpecPath="assets/agentic-ai-for-beginners/module05/deployment-decision-application.animation.json"
			layout="full"
			slideName="module-5-application"
			moduleNumber={5}
		/>
	);
};
