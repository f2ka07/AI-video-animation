// Module 01 Diagram 2: Agentic Architecture High-Level
// Full-slide premium SVG synced to Gentle word timings
import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module01Diagram2Props extends SceneProps {}

export const Module01Diagram2: React.FC<Module01Diagram2Props> = ({
	durationInFrames,
	cuePoints = [],
}) => {
	return (
		<BaseDiagramScene
			durationInFrames={durationInFrames}
			cuePoints={cuePoints}
			title="The Five Pillars of Agentic Architecture"
			subtitle="Planning, tools, memory, safety loops, and human oversight - the core architecture."
			sectionLabel="Architecture"
			layout="immersive"
			svgPath="assets/agentic-ai-for-beginners/module01/agentic-architecture-premium.svg"
			animationSpecPath="assets/agentic-ai-for-beginners/module01/agentic-architecture-premium.animation.json"
			slideName="module-1-architecture"
			moduleNumber={1}
		/>
	);
};
