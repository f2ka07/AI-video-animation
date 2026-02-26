// Module 05 Diagram 3: Ops Lifecycle
// Uses BaseDiagramScene with animated SVG (ops-lifecycle.svg + .animation.json)
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
			title="Ops Lifecycle"
			svgPath="assets/agentic-ai-for-beginners/module05/ops-lifecycle.svg"
			layout="full"
			slideName="module-5-application"
			moduleNumber={5}
		/>
	);
};
