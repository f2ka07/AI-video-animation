// Module 06 Diagram 2: Adoption Curve / Stages
// Uses BaseDiagramScene with animated SVG (adoption-curve.svg + .animation.json)
import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module06Diagram2Props extends SceneProps {}

export const Module06Diagram2: React.FC<Module06Diagram2Props> = ({
	durationInFrames,
	cuePoints = [],
}) => {
	return (
		<BaseDiagramScene
			durationInFrames={durationInFrames}
			cuePoints={cuePoints}
			title="Adoption Curve"
			svgPath="assets/agentic-ai-for-beginners/module06/adoption-curve.svg"
			layout="full"
			slideName="module-6-architecture"
			moduleNumber={6}
		/>
	);
};
