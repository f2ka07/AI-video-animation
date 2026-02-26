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
			svgPath="assets/agentic-ai-for-beginners/module01/direct-prompting-vs-agentic.svg"
			// Enable two-card layout: content on left, SVG on right
			layout="two-card"
			contentPoints={[
				// TODO: Add your bullet points here - these will appear on the left side
				// Example: "First key point about direct prompting",
				// Example: "Second point about agentic systems",
				// Example: "Third important concept"
			]}
			slideName="module-1-concept"
			moduleNumber={1}
			audioDuration={99.04} // From audioDuration.ts
		/>
	);
};
