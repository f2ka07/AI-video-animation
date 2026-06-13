// Module 06 Diagram 1: Value drivers for enterprise AI
// Uses BaseDiagramScene with animated SVG (value-driver-spider.svg)
import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module06Diagram1Props extends SceneProps {}

export const Module06Diagram1: React.FC<Module06Diagram1Props> = ({
	durationInFrames,
	cuePoints = [],
}) => {
	return (
		<BaseDiagramScene
			durationInFrames={durationInFrames}
			cuePoints={cuePoints}
			title="Value Drivers"
			subtitle="Why enterprises buy AI: automation, speed, consistency, traceability, and scale."
			sectionLabel="Concept"
			svgPath="assets/agentic-ai-for-beginners/module06/value-driver-spider.svg"
			animationSpecPath="assets/agentic-ai-for-beginners/module06/value-driver-concept.animation.json"
			layout="full"
			slideName="module-6-concept"
			moduleNumber={6}
		/>
	);
};
