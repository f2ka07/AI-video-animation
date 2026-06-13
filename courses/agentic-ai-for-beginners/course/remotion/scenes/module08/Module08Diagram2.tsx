import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module08Diagram2Props extends SceneProps {}

export const Module08Diagram2: React.FC<Module08Diagram2Props> = ({ durationInFrames, cuePoints = [] }) => (
	<BaseDiagramScene
		durationInFrames={durationInFrames}
		cuePoints={cuePoints}
		title="Memory Types and Failure Modes"
		subtitle="Map each reasoning failure to the memory layer that fixes it."
		sectionLabel="Architecture"
		svgPath="assets/agentic-ai-for-beginners/module08/memory-failure-map.svg"
		animationSpecPath="assets/agentic-ai-for-beginners/module08/memory-failure-map-architecture.animation.json"
		layout="full"
		slideName="module-8-architecture"
		moduleNumber={8}
	/>
);
