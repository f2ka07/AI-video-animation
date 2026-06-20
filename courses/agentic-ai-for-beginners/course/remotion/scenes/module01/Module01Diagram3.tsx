// Module 01 Diagram 3: Enterprise Adoption Drivers
// Full-slide premium SVG synced to Gentle word timings
import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module01Diagram3Props extends SceneProps {}

export const Module01Diagram3: React.FC<Module01Diagram3Props> = ({
	durationInFrames,
	cuePoints = [],
}) => {
	return (
		<BaseDiagramScene
			durationInFrames={durationInFrames}
			cuePoints={cuePoints}
			title="Enterprise Adoption Drivers"
			subtitle="What pushes enterprises from pilots to production agentic systems."
			sectionLabel="Application"
			layout="immersive"
			svgPath="assets/agentic-ai-for-beginners/module01/enterprise-adoption-premium.svg"
			animationSpecPath="assets/agentic-ai-for-beginners/module01/enterprise-adoption-premium.animation.json"
			slideName="module-1-application"
			moduleNumber={1}
		/>
	);
};
