import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module11Diagram1Props extends SceneProps {}

export const Module11Diagram1: React.FC<Module11Diagram1Props> = ({ durationInFrames, cuePoints = [] }) => (
	<BaseDiagramScene
		durationInFrames={durationInFrames}
		cuePoints={cuePoints}
		title="Evaluation Harness Dimensions"
		subtitle="Correctness, structure, grounding, and regression testing."
		sectionLabel="Concept"
		svgPath="assets/agentic-ai-for-beginners/module11/eval-harness-dimensions.svg"
		animationSpecPath="assets/agentic-ai-for-beginners/module11/eval-harness-dimensions-concept.animation.json"
		layout="full"
		slideName="module-11-concept"
		moduleNumber={11}
	/>
);
