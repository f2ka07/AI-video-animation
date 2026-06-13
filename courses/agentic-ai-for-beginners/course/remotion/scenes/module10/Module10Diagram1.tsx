import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module10Diagram1Props extends SceneProps {}

export const Module10Diagram1: React.FC<Module10Diagram1Props> = ({ durationInFrames, cuePoints = [] }) => (
	<BaseDiagramScene
		durationInFrames={durationInFrames}
		cuePoints={cuePoints}
		title="Retrieval Pipeline End to End"
		subtitle="Ingestion, chunking, embedding, search, and context injection."
		sectionLabel="Concept"
		svgPath="assets/agentic-ai-for-beginners/module10/rag-pipeline-stages.svg"
		animationSpecPath="assets/agentic-ai-for-beginners/module10/rag-pipeline-stages-concept.animation.json"
		layout="full"
		slideName="module-10-concept"
		moduleNumber={10}
	/>
);
