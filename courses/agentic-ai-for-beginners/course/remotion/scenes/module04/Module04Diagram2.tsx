// Module 04 Diagram 2: Workload Characteristics Matrix
// Uses BaseDiagramScene with animated SVG (workload-matrix.svg + .animation.json)
import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module04Diagram2Props extends SceneProps {}

export const Module04Diagram2: React.FC<Module04Diagram2Props> = ({
	durationInFrames,
	cuePoints = [],
}) => {
	return (
		<BaseDiagramScene
			durationInFrames={durationInFrames}
			cuePoints={cuePoints}
			title="Enterprise Workload Matrix"
			svgPath="assets/agentic-ai-for-beginners/module04/workload-matrix.svg"
			layout="full"
			slideName="module-4-architecture"
			moduleNumber={4}
		/>
	);
};
