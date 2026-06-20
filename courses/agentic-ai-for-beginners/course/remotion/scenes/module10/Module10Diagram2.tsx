// Module 10 Diagram 2: Retrieval vs tool calls
import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module10Diagram2Props extends SceneProps {}

export const Module10Diagram2: React.FC<Module10Diagram2Props> = ({
	durationInFrames,
	cuePoints = [],
}) => {
	return (
		<BaseDiagramScene
			durationInFrames={durationInFrames}
			cuePoints={cuePoints}
			title="Retrieval vs Tool Calls"
			subtitle="Read-only knowledge search vs actions with side effects."
			sectionLabel="Architecture"
			layout="immersive"
			svgPath="assets/agentic-ai-for-beginners/module10/retrieval-vs-tools-premium.svg"
			animationSpecPath="assets/agentic-ai-for-beginners/module10/retrieval-vs-tools-premium.animation.json"
			slideName="module-10-architecture"
			moduleNumber={10}
		/>
	);
};
