// Module 07 Diagram 2: Single vs Multi-Agent
// Full-slide premium SVG synced to Gentle word timings
import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module07Diagram2Props extends SceneProps {}

export const Module07Diagram2: React.FC<Module07Diagram2Props> = ({
	durationInFrames,
	cuePoints = [],
}) => {
	return (
		<BaseDiagramScene
			durationInFrames={durationInFrames}
			cuePoints={cuePoints}
			title="Single-Agent vs Multi-Agent"
			subtitle="When a single agent is enough vs when you need coordinated multi-agent design."
			sectionLabel="Architecture"
			layout="immersive"
			svgPath="assets/agentic-ai-for-beginners/module07/single-multi-agent-premium.svg"
			animationSpecPath="assets/agentic-ai-for-beginners/module07/single-multi-agent-premium.animation.json"
			slideName="module-7-architecture"
			moduleNumber={7}
		/>
	);
};
