// Module 06 Diagram 1: Enterprise value drivers
// Full-slide premium SVG synced to Gentle word timings
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
			title="Enterprise Value Drivers"
			subtitle="Why enterprises buy agentic AI: automation, speed, consistency, traceability, scale."
			sectionLabel="Concept"
			layout="immersive"
			svgPath="assets/agentic-ai-for-beginners/module06/value-drivers-premium.svg"
			animationSpecPath="assets/agentic-ai-for-beginners/module06/value-drivers-premium.animation.json"
			slideName="module-6-concept"
			moduleNumber={6}
		/>
	);
};
