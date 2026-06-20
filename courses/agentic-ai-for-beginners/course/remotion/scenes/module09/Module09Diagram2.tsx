// Module 09 Diagram 2: Triton and TensorRT in Production
// Full-slide premium SVG synced to Gentle word timings
import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module09Diagram2Props extends SceneProps {}

export const Module09Diagram2: React.FC<Module09Diagram2Props> = ({
	durationInFrames,
	cuePoints = [],
}) => (
	<BaseDiagramScene
		durationInFrames={durationInFrames}
		cuePoints={cuePoints}
		title="Triton and TensorRT in Production"
		subtitle="Dynamic batching, concurrent serving, and compiled model graphs."
		sectionLabel="Architecture"
		layout="immersive"
		svgPath="assets/agentic-ai-for-beginners/module09/triton-tensorrt-premium.svg"
		animationSpecPath="assets/agentic-ai-for-beginners/module09/triton-tensorrt-premium.animation.json"
		slideName="module-9-architecture"
		moduleNumber={9}
	/>
);
