// Module 12 Diagram 2: Safety guardrails architecture
import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface Module12Diagram2Props extends SceneProps {}

export const Module12Diagram2: React.FC<Module12Diagram2Props> = ({
	durationInFrames,
	cuePoints = [],
}) => {
	return (
		<BaseDiagramScene
			durationInFrames={durationInFrames}
			cuePoints={cuePoints}
			title="Safety Architecture Patterns"
			subtitle="Approval gates, policy filters, audit logs, and transparency."
			sectionLabel="Architecture"
			layout="immersive"
			svgPath="assets/agentic-ai-for-beginners/module12/guardrails-architecture-premium.svg"
			animationSpecPath="assets/agentic-ai-for-beginners/module12/guardrails-architecture-premium.animation.json"
			slideName="module-12-architecture"
			moduleNumber={12}
		/>
	);
};
