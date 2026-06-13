import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module12Diagram3Props extends SceneProps {}

export const Module12Diagram3: React.FC<Module12Diagram3Props> = ({ durationInFrames, cuePoints = [] }) => (
	<BaseDiagramScene
		durationInFrames={durationInFrames}
		cuePoints={cuePoints}
		title="Designing for Compliance"
		subtitle="Industry requirements, data handling, privacy, and approval workflows."
		sectionLabel="Application"
		svgPath="assets/agentic-ai-for-beginners/module12/compliance-design-patterns.svg"
		animationSpecPath="assets/agentic-ai-for-beginners/module12/compliance-design-patterns-application.animation.json"
		layout="full"
		slideName="module-12-application"
		moduleNumber={12}
	/>
);
