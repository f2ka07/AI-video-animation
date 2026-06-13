// Module 05 Diagram 2: Integration Surfaces
// Uses BaseDiagramScene with animated SVG (integration-surfaces.svg + .animation.json)
import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module05Diagram2Props extends SceneProps {}

export const Module05Diagram2: React.FC<Module05Diagram2Props> = ({
	durationInFrames,
	cuePoints = [],
}) => {
	return (
		<BaseDiagramScene
			durationInFrames={durationInFrames}
			cuePoints={cuePoints}
			title="Integration Surfaces"
			subtitle="How agents connect to APIs, tools, enterprise data, and policy gateways."
			sectionLabel="Architecture"
			svgPath="assets/agentic-ai-for-beginners/module05/integration-surfaces.svg"
			animationSpecPath="assets/agentic-ai-for-beginners/module05/integration-surfaces-architecture.animation.json"
			layout="full"
			slideName="module-5-architecture"
			moduleNumber={5}
		/>
	);
};
