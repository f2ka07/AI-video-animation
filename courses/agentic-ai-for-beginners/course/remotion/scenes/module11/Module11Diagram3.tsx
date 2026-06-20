// Module 11 Diagram 3: Eval and observability practice
import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module11Diagram3Props extends SceneProps {}

export const Module11Diagram3: React.FC<Module11Diagram3Props> = ({
	durationInFrames,
	cuePoints = [],
}) => {
	return (
		<BaseDiagramScene
			durationInFrames={durationInFrames}
			cuePoints={cuePoints}
			title="Implementing Eval and Observability"
			subtitle="Automated harnesses, dashboards, alerts, and trace-based diagnosis."
			sectionLabel="Application"
			layout="immersive"
			svgPath="assets/agentic-ai-for-beginners/module11/eval-practice-premium.svg"
			animationSpecPath="assets/agentic-ai-for-beginners/module11/eval-practice-premium.animation.json"
			slideName="module-11-application"
			moduleNumber={11}
		/>
	);
};
