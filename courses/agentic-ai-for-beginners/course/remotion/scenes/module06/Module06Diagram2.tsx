// Module 06 Diagram 2: Industry use case grid
// Full-slide premium SVG synced to Gentle word timings
import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module06Diagram2Props extends SceneProps {}

export const Module06Diagram2: React.FC<Module06Diagram2Props> = ({
	durationInFrames,
	cuePoints = [],
}) => {
	return (
		<BaseDiagramScene
			durationInFrames={durationInFrames}
			cuePoints={cuePoints}
			title="Industry Use Case Grid"
			subtitle="Where agentic AI deploys today: knowledge, operations, research, documents, and beyond."
			sectionLabel="Architecture"
			layout="immersive"
			svgPath="assets/agentic-ai-for-beginners/module06/industry-usecases-premium.svg"
			animationSpecPath="assets/agentic-ai-for-beginners/module06/industry-usecases-premium.animation.json"
			slideName="module-6-architecture"
			moduleNumber={6}
		/>
	);
};
