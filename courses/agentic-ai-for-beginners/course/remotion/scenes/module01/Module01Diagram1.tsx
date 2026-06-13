// Module 01 Diagram 1: Direct Prompting vs Agentic Systems
// Uses BaseDiagramScene with animated SVG
import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module01Diagram1Props extends SceneProps {}

export const Module01Diagram1: React.FC<Module01Diagram1Props> = ({
	durationInFrames,
	cuePoints = [],
}) => {
	return (
		<BaseDiagramScene
			durationInFrames={durationInFrames}
			cuePoints={cuePoints}
			title="Direct Prompting vs Agentic Systems"
			subtitle="Single-call inference vs multi-step agent pipelines that plan, act, and iterate."
			sectionLabel="Concept"
			svgPath="assets/agentic-ai-for-beginners/module01/direct-prompting-vs-agentic.svg"
			// Enable two-card layout: content on left, SVG on right
			layout="two-card"
			contentPoints={[
				"Single-call inference: one prompt, one response, then done",
				"No memory, planning, tools, or verification between steps",
				"Agents are pipelines: plan, act, observe, and iterate in loops",
				"From AI as interface to AI as infrastructure"
			]}
			slideName="module-1-concept"
			moduleNumber={1}
			audioDuration={99.04} // From audioDuration.ts
		/>
	);
};
