// Module 05 Diagram 1: Deployment Decision Matrix
// Full-slide premium SVG synced to Gentle word timings
import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module05Diagram1Props extends SceneProps {}

export const Module05Diagram1: React.FC<Module05Diagram1Props> = ({
	durationInFrames,
	cuePoints = [],
}) => {
	return (
		<BaseDiagramScene
			durationInFrames={durationInFrames}
			cuePoints={cuePoints}
			title="Deployment Decision Matrix"
			subtitle="Four deployment models - SaaS, cloud GPU, on-premises, and edge - and their tradeoffs."
			sectionLabel="Concept"
			layout="immersive"
			svgPath="assets/agentic-ai-for-beginners/module05/deployment-models-premium.svg"
			animationSpecPath="assets/agentic-ai-for-beginners/module05/deployment-models-premium.animation.json"
			slideName="module-5-concept"
			moduleNumber={5}
		/>
	);
};
