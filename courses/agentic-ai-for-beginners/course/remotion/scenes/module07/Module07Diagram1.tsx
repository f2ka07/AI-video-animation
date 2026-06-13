// Module 07 Diagram 1: Four Roles in Agentic Architecture
import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module07Diagram1Props extends SceneProps {}

export const Module07Diagram1: React.FC<Module07Diagram1Props> = ({
	durationInFrames,
	cuePoints = [],
}) => {
	return (
		<BaseDiagramScene
			durationInFrames={durationInFrames}
			cuePoints={cuePoints}
			title="Four Roles in Agentic Systems"
			subtitle="Planner, executor, router, and orchestrator - how work flows through the pipeline."
			sectionLabel="Concept"
			svgPath="assets/agentic-ai-for-beginners/module07/architecture-roles-pipeline.svg"
			layout="two-card"
			contentPoints={[
				'Planner: breaks the goal into ordered subtasks (structure, not execution)',
				'Executor: runs one step via tools (predictable, testable)',
				'Router: sends work to the right agent or tool (RAG vs code)',
				'Orchestrator: runs the control loop (dispatch, retry, state)',
			]}
			slideName="module-7-concept"
			moduleNumber={7}
			audioDuration={73.31}
		/>
	);
};
