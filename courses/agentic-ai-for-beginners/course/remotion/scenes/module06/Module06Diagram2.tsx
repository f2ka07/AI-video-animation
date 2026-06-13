// Module 06 Diagram 2: Enterprise use case grid
// Uses BaseDiagramScene with animated SVG (industry-usecase-grid.svg)
import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module06Diagram2Props extends SceneProps {}

export const Module06Diagram2: React.FC<Module06Diagram2Props> = ({
	durationInFrames,
	cuePoints = [],
}) => {
	return (
		<BaseDiagramScene
			durationInFrames={durationInFrames}
			cuePoints={cuePoints}
			title="Industry Use Case Grid"
			subtitle="Primary use cases: knowledge, support, research, documents, and adjacent domains."
			sectionLabel="Architecture"
			svgPath="assets/agentic-ai-for-beginners/module06/industry-usecase-grid.svg"
			animationSpecPath="assets/agentic-ai-for-beginners/module06/industry-usecase-architecture.animation.json"
			layout="full"
			slideName="module-6-architecture"
			moduleNumber={6}
		/>
	);
};
