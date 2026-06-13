// Module 03 Diagram 2: Stack layer walkthrough (architecture narration)
// Uses BaseDiagramScene with animated SVG (nvidia-ai-stack-overview.svg)
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
			title="NVIDIA AI Platform Stack"
			subtitle="Five layers from GPU hardware through NIM to your agentic application."
			sectionLabel="Architecture"
			svgPath="assets/agentic-ai-for-beginners/module03/nvidia-ai-stack-overview.svg"
			animationSpecPath="assets/agentic-ai-for-beginners/module03/nvidia-ai-stack-architecture.animation.json"
			layout="full"
			slideName="module-3-architecture"
			moduleNumber={3}
		/>
	);
};
