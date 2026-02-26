// Module 01 Diagram 3: Enterprise Adoption Drivers
// Uses BaseDiagramScene with animated SVG (enterprise-adoption-drivers.svg + .animation.json)
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
			svgPath="assets/agentic-ai-for-beginners/module01/enterprise-adoption-drivers.svg"
			layout="full"
			slideName="module-1-application"
			moduleNumber={1}
		/>
	);
};
