// Module 02 Diagram 2: Six Core Agent Components
// Full-slide premium SVG synced to Gentle word timings
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
			subtitle="The building blocks that make an agent more than a chatbot"
			sectionLabel="Architecture"
			layout="immersive"
			svgPath="assets/agentic-ai-for-beginners/module02/agent-components-premium.svg"
			animationSpecPath="assets/agentic-ai-for-beginners/module02/agent-components-premium.animation.json"
			slideName="module-2-architecture"
			moduleNumber={2}
		/>
	);
};
