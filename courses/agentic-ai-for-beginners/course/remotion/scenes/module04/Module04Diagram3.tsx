// Module 04 Diagram 3: Pipeline Constraints Triangle
// Uses BaseDiagramScene with animated SVG (pipeline-constraints-triangle.svg + .animation.json)
import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module04Diagram3Props extends SceneProps {}

export const Module04Diagram3: React.FC<Module04Diagram3Props> = ({
	durationInFrames,
	cuePoints = [],
}) => {
	return (
		<BaseDiagramScene
			durationInFrames={durationInFrames}
			cuePoints={cuePoints}
			title="Pipeline Constraints Triangle"
			svgPath="assets/agentic-ai-for-beginners/module04/pipeline-constraints-triangle.svg"
			layout="full"
			slideName="module-4-application"
			moduleNumber={4}
		/>
	);
};
