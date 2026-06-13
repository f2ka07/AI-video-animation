// Module 02 Diagram 2: Agent Components
// Uses BaseDiagramScene with animated SVG (agent-components.svg + .animation.json)
import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module02Diagram2Props extends SceneProps {}

export const Module02Diagram2: React.FC<Module02Diagram2Props> = ({
	durationInFrames,
	cuePoints = [],
}) => {
	return (
		<BaseDiagramScene
			durationInFrames={durationInFrames}
			cuePoints={cuePoints}
			title="Six Core Agent Components"
			subtitle="The six building blocks that make an agent more than a chatbot."
			sectionLabel="Architecture"
			svgPath="assets/agentic-ai-for-beginners/module02/agent-components.svg"
			layout="full"
			slideName="module-2-architecture"
			moduleNumber={2}
		/>
	);
};
