// Module 05 Diagram 2: Integration Surfaces
// Full-slide premium SVG synced to Gentle word timings
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
			layout="immersive"
			svgPath="assets/agentic-ai-for-beginners/module05/integration-surfaces-premium.svg"
			animationSpecPath="assets/agentic-ai-for-beginners/module05/integration-surfaces-premium.animation.json"
			slideName="module-5-architecture"
			moduleNumber={5}
		/>
	);
};
