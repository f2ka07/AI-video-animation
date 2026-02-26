// Module 03 Diagram 1: NVIDIA AI Stack Overview
// Uses BaseDiagramScene with animated SVG (nvidia-ai-stack-overview.svg + .animation.json)
import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module03Diagram1Props extends SceneProps {}

export const Module03Diagram1: React.FC<Module03Diagram1Props> = ({
	durationInFrames,
	cuePoints = [],
}) => {
	return (
		<BaseDiagramScene
			durationInFrames={durationInFrames}
			cuePoints={cuePoints}
			title="NVIDIA AI Platform Stack"
			svgPath="assets/agentic-ai-for-beginners/module03/nvidia-ai-stack-overview.svg"
			layout="full"
			slideName="module-3-concept"
			moduleNumber={3}
		/>
	);
};
