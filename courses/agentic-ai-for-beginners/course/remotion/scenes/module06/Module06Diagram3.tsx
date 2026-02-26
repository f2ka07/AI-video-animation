// Module 06 Diagram 3: Value Drivers
// Uses BaseDiagramScene with animated SVG (value-driver-spider.svg + .animation.json)
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
			title="Value Drivers"
			svgPath="assets/agentic-ai-for-beginners/module06/value-driver-spider.svg"
			layout="full"
			slideName="module-6-application"
			moduleNumber={6}
		/>
	);
};
