// Module 12 Diagram 1: Agent threat model
import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module12Diagram1Props extends SceneProps {}

export const Module12Diagram1: React.FC<Module12Diagram1Props> = ({
	durationInFrames,
	cuePoints = [],
}) => {
	return (
		<BaseDiagramScene
			durationInFrames={durationInFrames}
			cuePoints={cuePoints}
			title="Agent Threat Model"
			subtitle="Prompt injection, misuse, and why human oversight is the backstop."
			sectionLabel="Concept"
			layout="immersive"
			svgPath="assets/agentic-ai-for-beginners/module12/threat-model-premium.svg"
			animationSpecPath="assets/agentic-ai-for-beginners/module12/threat-model-premium.animation.json"
			slideName="module-12-concept"
			moduleNumber={12}
		/>
	);
};
