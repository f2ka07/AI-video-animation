import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module09Diagram3Props extends SceneProps {}

export const Module09Diagram3: React.FC<Module09Diagram3Props> = ({ durationInFrames, cuePoints = [] }) => (
	<BaseDiagramScene
		durationInFrames={durationInFrames}
		cuePoints={cuePoints}
		title="When to Apply Each Optimization"
		subtitle="Choose batching, concurrency, and TensorRT based on workload goals."
		sectionLabel="Application"
		svgPath="assets/agentic-ai-for-beginners/module09/inference-optimization-guide.svg"
		animationSpecPath="assets/agentic-ai-for-beginners/module09/inference-optimization-guide-application.animation.json"
		layout="full"
		slideName="module-9-application"
		moduleNumber={9}
	/>
);
