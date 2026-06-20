// Module 07 Diagram 1: Four Roles in Agentic Architecture
// Full-slide premium SVG synced to Gentle word timings
import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module07Diagram1Props extends SceneProps {}

export const Module07Diagram1: React.FC<Module07Diagram1Props> = ({
	durationInFrames,
	cuePoints = [],
}) => {
	return (
		<BaseDiagramScene
			durationInFrames={durationInFrames}
			cuePoints={cuePoints}
			title="Four Roles in Agentic Systems"
			subtitle="Planner, executor, router, and orchestrator - how work flows through the pipeline."
			sectionLabel="Concept"
			layout="immersive"
			svgPath="assets/agentic-ai-for-beginners/module07/agent-roles-premium.svg"
			animationSpecPath="assets/agentic-ai-for-beginners/module07/agent-roles-premium.animation.json"
			slideName="module-7-concept"
			moduleNumber={7}
		/>
	);
};
