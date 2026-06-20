// Module 01 Diagram 1: Direct Prompting vs Agentic Systems
// Full-slide premium SVG synced to Gentle word timings
import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module01Diagram1Props extends SceneProps {}

export const Module01Diagram1: React.FC<Module01Diagram1Props> = ({
	durationInFrames,
	cuePoints = [],
}) => {
	return (
		<BaseDiagramScene
			durationInFrames={durationInFrames}
			cuePoints={cuePoints}
			title="Direct Prompting vs Agentic Systems"
			subtitle="Understanding what we are leaving behind"
			sectionLabel="Concept"
			layout="immersive"
			svgPath="assets/agentic-ai-for-beginners/module01/direct-prompting-vs-agentic-premium.svg"
			animationSpecPath="assets/agentic-ai-for-beginners/module01/direct-prompting-vs-agentic-premium.animation.json"
			slideName="module-1-concept"
			moduleNumber={1}
		/>
	);
};
