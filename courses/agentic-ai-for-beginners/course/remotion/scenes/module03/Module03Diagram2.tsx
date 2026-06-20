// Module 03 Diagram 2: Five layers of the NVIDIA stack
// Full-slide premium SVG synced to Gentle word timings
import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module03Diagram2Props extends SceneProps {}

export const Module03Diagram2: React.FC<Module03Diagram2Props> = ({
	durationInFrames,
	cuePoints = [],
}) => {
	return (
		<BaseDiagramScene
			durationInFrames={durationInFrames}
			cuePoints={cuePoints}
			title="Five Layers of the NVIDIA Stack"
			subtitle="From GPU hardware through NIM to your agentic application"
			sectionLabel="Architecture"
			layout="immersive"
			svgPath="assets/agentic-ai-for-beginners/module03/nvidia-stack-architecture-premium.svg"
			animationSpecPath="assets/agentic-ai-for-beginners/module03/nvidia-stack-architecture-premium.animation.json"
			slideName="module-3-architecture"
			moduleNumber={3}
		/>
	);
};
