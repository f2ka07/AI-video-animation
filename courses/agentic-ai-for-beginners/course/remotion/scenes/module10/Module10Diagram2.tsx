import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module10Diagram2Props extends SceneProps {}

export const Module10Diagram2: React.FC<Module10Diagram2Props> = ({ durationInFrames, cuePoints = [] }) => (
	<BaseDiagramScene
		durationInFrames={durationInFrames}
		cuePoints={cuePoints}
		title="Retrieval vs Tool Calls"
		subtitle="Read-only knowledge search vs actions with side effects."
		sectionLabel="Architecture"
		svgPath="assets/agentic-ai-for-beginners/module10/retrieval-vs-tools.svg"
		animationSpecPath="assets/agentic-ai-for-beginners/module10/retrieval-vs-tools-architecture.animation.json"
		layout="full"
		slideName="module-10-architecture"
		moduleNumber={10}
	/>
);
