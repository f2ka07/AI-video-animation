// Module 10 Diagram 3: RAG implementation patterns
import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module10Diagram3Props extends SceneProps {}

export const Module10Diagram3: React.FC<Module10Diagram3Props> = ({
	durationInFrames,
	cuePoints = [],
}) => {
	return (
		<BaseDiagramScene
			durationInFrames={durationInFrames}
			cuePoints={cuePoints}
			title="Building RAG from PDFs and Web"
			subtitle="Extraction, chunk overlap, citations, validation, and retries."
			sectionLabel="Application"
			layout="immersive"
			svgPath="assets/agentic-ai-for-beginners/module10/rag-patterns-premium.svg"
			animationSpecPath="assets/agentic-ai-for-beginners/module10/rag-patterns-premium.animation.json"
			slideName="module-10-application"
			moduleNumber={10}
		/>
	);
};
