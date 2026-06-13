import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module08Diagram3Props extends SceneProps {}

export const Module08Diagram3: React.FC<Module08Diagram3Props> = ({ durationInFrames, cuePoints = [] }) => (
	<BaseDiagramScene
		durationInFrames={durationInFrames}
		cuePoints={cuePoints}
		title="Implementing Memory and Guards"
		subtitle="Critique steps, structured state, retrieval filters, and anti-loop guards."
		sectionLabel="Application"
		svgPath="assets/agentic-ai-for-beginners/module08/memory-implementation-patterns.svg"
		animationSpecPath="assets/agentic-ai-for-beginners/module08/memory-implementation-patterns-application.animation.json"
		layout="full"
		slideName="module-8-application"
		moduleNumber={8}
	/>
);
