// Module 02 Diagram 1: Agent Loop Pattern
// Uses BaseDiagramScene with animated SVG (agent-loop-pattern.svg + .animation.json)
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
			subtitle="Plan, act, observe, adapt - the control loop behind every production agent."
			sectionLabel="Concept"
			svgPath="assets/agentic-ai-for-beginners/module02/agent-loop-pattern.svg"
			layout="full"
			slideName="module-2-concept"
			moduleNumber={2}
			audioDuration={69.2}
		/>
	);
};
