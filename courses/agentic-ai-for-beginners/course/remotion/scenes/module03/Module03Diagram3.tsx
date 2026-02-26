// Module 03 Diagram 3: Deployment Surfaces
// Uses BaseDiagramScene with animated SVG (deployment-surfaces.svg + .animation.json)
import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module03Diagram3Props extends SceneProps {}

export const Module03Diagram3: React.FC<Module03Diagram3Props> = ({
	durationInFrames,
	cuePoints = [],
}) => {
	return (
		<BaseDiagramScene
			durationInFrames={durationInFrames}
			cuePoints={cuePoints}
			title="Deployment Surfaces"
			svgPath="assets/agentic-ai-for-beginners/module03/deployment-surfaces.svg"
			layout="full"
			slideName="module-3-application"
			moduleNumber={3}
		/>
	);
};
