// Module 05 Diagram 3: Business drivers for deployment
// Full-slide premium SVG synced to Gentle word timings
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
			title="Business Drivers for Deployment"
			subtitle="Matching deployment choice to velocity, flexibility, compliance, and latency needs."
			sectionLabel="Application"
			layout="immersive"
			svgPath="assets/agentic-ai-for-beginners/module05/deployment-drivers-premium.svg"
			animationSpecPath="assets/agentic-ai-for-beginners/module05/deployment-drivers-premium.animation.json"
			slideName="module-5-application"
			moduleNumber={5}
		/>
	);
};
