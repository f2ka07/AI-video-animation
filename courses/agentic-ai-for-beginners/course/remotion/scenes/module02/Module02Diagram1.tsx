// Module 02 Diagram 1: The Agent Loop Pattern
// Full-slide premium SVG synced to Gentle word timings
import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module02Diagram1Props extends SceneProps {}

export const Module02Diagram1: React.FC<Module02Diagram1Props> = ({
	durationInFrames,
	cuePoints = [],
}) => {
	return (
		<BaseDiagramScene
			durationInFrames={durationInFrames}
			cuePoints={cuePoints}
			title="The Agent Loop Pattern"
			subtitle="Plan, act, observe, adapt - the control loop behind every agent"
			sectionLabel="Concept"
			layout="immersive"
			svgPath="assets/agentic-ai-for-beginners/module02/agent-loop-premium.svg"
			animationSpecPath="assets/agentic-ai-for-beginners/module02/agent-loop-premium.animation.json"
			slideName="module-2-concept"
			moduleNumber={2}
		/>
	);
};
