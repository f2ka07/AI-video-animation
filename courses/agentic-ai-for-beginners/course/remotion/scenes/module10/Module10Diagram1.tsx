// Module 10 Diagram 1: Retrieval pipeline concept
// Full-slide premium SVG synced to Gentle word timings
import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module10Diagram1Props extends SceneProps {}

export const Module10Diagram1: React.FC<Module10Diagram1Props> = ({
	durationInFrames,
	cuePoints = [],
}) => {
	return (
		<BaseDiagramScene
			durationInFrames={durationInFrames}
			cuePoints={cuePoints}
			title="Retrieval Pipeline End to End"
			subtitle="Ingestion, chunking, embedding, search, and context injection."
			sectionLabel="Concept"
			layout="immersive"
			svgPath="assets/agentic-ai-for-beginners/module10/rag-pipeline-premium.svg"
			animationSpecPath="assets/agentic-ai-for-beginners/module10/rag-pipeline-premium.animation.json"
			slideName="module-10-concept"
			moduleNumber={10}
		/>
	);
};
