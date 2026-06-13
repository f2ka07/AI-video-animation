import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module11Diagram3Props extends SceneProps {}

export const Module11Diagram3: React.FC<Module11Diagram3Props> = ({ durationInFrames, cuePoints = [] }) => (
	<BaseDiagramScene
		durationInFrames={durationInFrames}
		cuePoints={cuePoints}
		title="Implementing Eval and Observability"
		subtitle="Automated harnesses, dashboards, alerts, and trace-based diagnosis."
		sectionLabel="Application"
		svgPath="assets/agentic-ai-for-beginners/module11/eval-monitoring-practice.svg"
		animationSpecPath="assets/agentic-ai-for-beginners/module11/eval-monitoring-practice-application.animation.json"
		layout="full"
		slideName="module-11-application"
		moduleNumber={11}
	/>
);
