// Module 07 Diagram 3: Reliability Patterns
import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module07Diagram3Props extends SceneProps {}

export const Module07Diagram3: React.FC<Module07Diagram3Props> = ({
	durationInFrames,
	cuePoints = [],
}) => {
	return (
		<BaseDiagramScene
			durationInFrames={durationInFrames}
			cuePoints={cuePoints}
			title="Reliability by Architecture Choice"
			subtitle="Reliability patterns that follow from how you structure your agent system."
			sectionLabel="Application"
			svgPath="assets/agentic-ai-for-beginners/module07/reliability-patterns.svg"
			layout="full"
			slideName="module-7-application"
			moduleNumber={7}
		/>
	);
};
