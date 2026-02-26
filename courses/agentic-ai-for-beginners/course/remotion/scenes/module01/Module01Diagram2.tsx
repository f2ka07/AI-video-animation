// Module 01 Diagram 2: Agentic Architecture High-Level
// Uses BaseDiagramScene with animated SVG (agentic-architecture-high-level.svg + .animation.json)
import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module01Diagram2Props extends SceneProps {}

export const Module01Diagram2: React.FC<Module01Diagram2Props> = ({
	durationInFrames,
	cuePoints = [],
}) => {
	return (
		<BaseDiagramScene
			durationInFrames={durationInFrames}
			cuePoints={cuePoints}
			title="The Five Pillars of Agentic Architecture"
			svgPath="assets/agentic-ai-for-beginners/module01/agentic-architecture-high-level.svg"
			layout="two-card"
			contentPoints={[
				"First, planning - decompose goals into subtasks",
				"Second, tools - APIs, code, search engines",
				"Third, memory - short-term and long-term retention",
				"Fourth, safety loops - guardrails and policy checks",
				"Fifth, human-in-the-loop - escalation and oversight"
			]}
			slideName="module-1-architecture"
			moduleNumber={1}
		/>
	);
};
