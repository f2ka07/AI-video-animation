import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module12Diagram1Props extends SceneProps {}

export const Module12Diagram1: React.FC<Module12Diagram1Props> = ({ durationInFrames, cuePoints = [] }) => (
	<BaseDiagramScene
		durationInFrames={durationInFrames}
		cuePoints={cuePoints}
		title="Agent Threat Model"
		subtitle="Prompt injection, misuse, and why human oversight is the backstop."
		sectionLabel="Concept"
		svgPath="assets/agentic-ai-for-beginners/module12/agent-threat-model.svg"
		animationSpecPath="assets/agentic-ai-for-beginners/module12/agent-threat-model-concept.animation.json"
		layout="full"
		slideName="module-12-concept"
		moduleNumber={12}
	/>
);
