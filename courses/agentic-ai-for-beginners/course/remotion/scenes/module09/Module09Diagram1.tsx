// Module 09 Diagram 1: GPU Inference at Agent Scale
// Full-slide premium SVG synced to Gentle word timings
import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module09Diagram1Props extends SceneProps {}

export const Module09Diagram1: React.FC<Module09Diagram1Props> = ({
	durationInFrames,
	cuePoints = [],
}) => (
	<BaseDiagramScene
		durationInFrames={durationInFrames}
		cuePoints={cuePoints}
		title="GPU Inference at Agent Scale"
		subtitle="Multiple model calls per request and the latency-cost tradeoff."
		sectionLabel="Concept"
		layout="immersive"
		svgPath="assets/agentic-ai-for-beginners/module09/gpu-tradeoffs-premium.svg"
		animationSpecPath="assets/agentic-ai-for-beginners/module09/gpu-tradeoffs-premium.animation.json"
		slideName="module-9-concept"
		moduleNumber={9}
	/>
);
