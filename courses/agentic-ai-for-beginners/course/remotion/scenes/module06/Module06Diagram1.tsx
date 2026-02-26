// Module 06 Diagram 1: Industry Use Case Grid
// Uses BaseDiagramScene with animated SVG (industry-usecase-grid.svg + .animation.json)
import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module06Diagram1Props extends SceneProps {}

export const Module06Diagram1: React.FC<Module06Diagram1Props> = ({
	durationInFrames,
	cuePoints = [],
}) => {
	return (
		<BaseDiagramScene
			durationInFrames={durationInFrames}
			cuePoints={cuePoints}
			title="Industry Use Case Grid"
			svgPath="assets/agentic-ai-for-beginners/module06/industry-usecase-grid.svg"
			layout="full"
			slideName="module-6-concept"
			moduleNumber={6}
		/>
	);
};
