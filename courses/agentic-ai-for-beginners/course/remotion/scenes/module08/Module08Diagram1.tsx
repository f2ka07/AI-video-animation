import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module08Diagram1Props extends SceneProps {}

export const Module08Diagram1: React.FC<Module08Diagram1Props> = ({ durationInFrames, cuePoints = [] }) => (
	<BaseDiagramScene
		durationInFrames={durationInFrames}
		cuePoints={cuePoints}
		title="Reasoning and Reflection"
		subtitle="Task decomposition, explicit vs implicit planning, and self-correction patterns."
		sectionLabel="Concept"
		svgPath="assets/agentic-ai-for-beginners/module08/reasoning-reflection-cycle.svg"
		animationSpecPath="assets/agentic-ai-for-beginners/module08/reasoning-reflection-cycle-concept.animation.json"
		layout="full"
		slideName="module-8-concept"
		moduleNumber={8}
	/>
);
