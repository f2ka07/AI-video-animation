// Module 06 Diagram 3: Adoption stages and blockers
// Uses BaseDiagramScene with animated SVG (adoption-curve.svg)
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
			title="Adoption Curve"
			subtitle="From pilot to platform standardization - and the blockers that slow adoption."
			sectionLabel="Application"
			svgPath="assets/agentic-ai-for-beginners/module06/adoption-curve.svg"
			animationSpecPath="assets/agentic-ai-for-beginners/module06/adoption-curve-application.animation.json"
			layout="full"
			slideName="module-6-application"
			moduleNumber={6}
		/>
	);
};
