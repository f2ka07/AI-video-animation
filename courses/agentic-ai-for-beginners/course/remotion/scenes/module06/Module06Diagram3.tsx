// Module 06 Diagram 3: Enterprise adoption curve
// Full-slide premium SVG synced to Gentle word timings
import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module06Diagram3Props extends SceneProps {}

export const Module06Diagram3: React.FC<Module06Diagram3Props> = ({
	durationInFrames,
	cuePoints = [],
}) => {
	return (
		<BaseDiagramScene
			durationInFrames={durationInFrames}
			cuePoints={cuePoints}
			title="Enterprise Adoption Curve"
			subtitle="From pilot to platform standardization - and the blockers that slow adoption."
			sectionLabel="Application"
			layout="immersive"
			svgPath="assets/agentic-ai-for-beginners/module06/adoption-curve-premium.svg"
			animationSpecPath="assets/agentic-ai-for-beginners/module06/adoption-curve-premium.animation.json"
			slideName="module-6-application"
			moduleNumber={6}
		/>
	);
};
