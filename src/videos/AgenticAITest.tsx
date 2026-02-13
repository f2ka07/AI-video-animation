// Test composition for Agentic AI for Beginners course scenes
// Use this to preview scenes before audio generation

import React from 'react';
import { Sequence, useVideoConfig } from 'remotion';

// Import all module scenes
import { Module01Intro, Module01Diagram1, Module01Diagram2, Module01Diagram3, Module01Recap } from '../../courses/agentic-ai-for-beginners/course/remotion/scenes/module01';
import { Module02Intro, Module02Diagram1, Module02Diagram2, Module02Diagram3, Module02Recap } from '../../courses/agentic-ai-for-beginners/course/remotion/scenes/module02';
import { Module03Intro, Module03Diagram1, Module03Diagram2, Module03Diagram3, Module03Recap } from '../../courses/agentic-ai-for-beginners/course/remotion/scenes/module03';
import { Module04Intro, Module04Diagram1, Module04Diagram2, Module04Diagram3, Module04Recap } from '../../courses/agentic-ai-for-beginners/course/remotion/scenes/module04';
import { Module05Intro, Module05Diagram1, Module05Diagram2, Module05Diagram3, Module05Recap } from '../../courses/agentic-ai-for-beginners/course/remotion/scenes/module05';
import { Module06Intro, Module06Diagram1, Module06Diagram2, Module06Diagram3, Module06Recap } from '../../courses/agentic-ai-for-beginners/course/remotion/scenes/module06';

// Scene duration in frames (at 30fps)
const SCENE_DURATION = 150; // 5 seconds per scene for testing

// Test all Module 01 scenes
export const AgenticModule01Test: React.FC = () => {
	const { fps } = useVideoConfig();
	const sceneDuration = SCENE_DURATION;

	return (
		<>
			<Sequence from={0} durationInFrames={sceneDuration} name="Module01-Intro">
				<Module01Intro durationInFrames={sceneDuration} />
			</Sequence>
			<Sequence from={sceneDuration} durationInFrames={sceneDuration} name="Module01-Diagram1">
				<Module01Diagram1 durationInFrames={sceneDuration} />
			</Sequence>
			<Sequence from={sceneDuration * 2} durationInFrames={sceneDuration} name="Module01-Diagram2">
				<Module01Diagram2 durationInFrames={sceneDuration} />
			</Sequence>
			<Sequence from={sceneDuration * 3} durationInFrames={sceneDuration} name="Module01-Diagram3">
				<Module01Diagram3 durationInFrames={sceneDuration} />
			</Sequence>
			<Sequence from={sceneDuration * 4} durationInFrames={sceneDuration} name="Module01-Recap">
				<Module01Recap durationInFrames={sceneDuration} />
			</Sequence>
		</>
	);
};

// Test all Module 02 scenes
export const AgenticModule02Test: React.FC = () => {
	const sceneDuration = SCENE_DURATION;

	return (
		<>
			<Sequence from={0} durationInFrames={sceneDuration} name="Module02-Intro">
				<Module02Intro durationInFrames={sceneDuration} />
			</Sequence>
			<Sequence from={sceneDuration} durationInFrames={sceneDuration} name="Module02-Diagram1">
				<Module02Diagram1 durationInFrames={sceneDuration} />
			</Sequence>
			<Sequence from={sceneDuration * 2} durationInFrames={sceneDuration} name="Module02-Diagram2">
				<Module02Diagram2 durationInFrames={sceneDuration} />
			</Sequence>
			<Sequence from={sceneDuration * 3} durationInFrames={sceneDuration} name="Module02-Diagram3">
				<Module02Diagram3 durationInFrames={sceneDuration} />
			</Sequence>
			<Sequence from={sceneDuration * 4} durationInFrames={sceneDuration} name="Module02-Recap">
				<Module02Recap durationInFrames={sceneDuration} />
			</Sequence>
		</>
	);
};

// Test all Module 03 scenes
export const AgenticModule03Test: React.FC = () => {
	const sceneDuration = SCENE_DURATION;

	return (
		<>
			<Sequence from={0} durationInFrames={sceneDuration} name="Module03-Intro">
				<Module03Intro durationInFrames={sceneDuration} />
			</Sequence>
			<Sequence from={sceneDuration} durationInFrames={sceneDuration} name="Module03-Diagram1">
				<Module03Diagram1 durationInFrames={sceneDuration} />
			</Sequence>
			<Sequence from={sceneDuration * 2} durationInFrames={sceneDuration} name="Module03-Diagram2">
				<Module03Diagram2 durationInFrames={sceneDuration} />
			</Sequence>
			<Sequence from={sceneDuration * 3} durationInFrames={sceneDuration} name="Module03-Diagram3">
				<Module03Diagram3 durationInFrames={sceneDuration} />
			</Sequence>
			<Sequence from={sceneDuration * 4} durationInFrames={sceneDuration} name="Module03-Recap">
				<Module03Recap durationInFrames={sceneDuration} />
			</Sequence>
		</>
	);
};

// Test all Module 04 scenes
export const AgenticModule04Test: React.FC = () => {
	const sceneDuration = SCENE_DURATION;

	return (
		<>
			<Sequence from={0} durationInFrames={sceneDuration} name="Module04-Intro">
				<Module04Intro durationInFrames={sceneDuration} />
			</Sequence>
			<Sequence from={sceneDuration} durationInFrames={sceneDuration} name="Module04-Diagram1">
				<Module04Diagram1 durationInFrames={sceneDuration} />
			</Sequence>
			<Sequence from={sceneDuration * 2} durationInFrames={sceneDuration} name="Module04-Diagram2">
				<Module04Diagram2 durationInFrames={sceneDuration} />
			</Sequence>
			<Sequence from={sceneDuration * 3} durationInFrames={sceneDuration} name="Module04-Diagram3">
				<Module04Diagram3 durationInFrames={sceneDuration} />
			</Sequence>
			<Sequence from={sceneDuration * 4} durationInFrames={sceneDuration} name="Module04-Recap">
				<Module04Recap durationInFrames={sceneDuration} />
			</Sequence>
		</>
	);
};

// Test all Module 05 scenes
export const AgenticModule05Test: React.FC = () => {
	const sceneDuration = SCENE_DURATION;

	return (
		<>
			<Sequence from={0} durationInFrames={sceneDuration} name="Module05-Intro">
				<Module05Intro durationInFrames={sceneDuration} />
			</Sequence>
			<Sequence from={sceneDuration} durationInFrames={sceneDuration} name="Module05-Diagram1">
				<Module05Diagram1 durationInFrames={sceneDuration} />
			</Sequence>
			<Sequence from={sceneDuration * 2} durationInFrames={sceneDuration} name="Module05-Diagram2">
				<Module05Diagram2 durationInFrames={sceneDuration} />
			</Sequence>
			<Sequence from={sceneDuration * 3} durationInFrames={sceneDuration} name="Module05-Diagram3">
				<Module05Diagram3 durationInFrames={sceneDuration} />
			</Sequence>
			<Sequence from={sceneDuration * 4} durationInFrames={sceneDuration} name="Module05-Recap">
				<Module05Recap durationInFrames={sceneDuration} />
			</Sequence>
		</>
	);
};

// Test all Module 06 scenes
export const AgenticModule06Test: React.FC = () => {
	const sceneDuration = SCENE_DURATION;

	return (
		<>
			<Sequence from={0} durationInFrames={sceneDuration} name="Module06-Intro">
				<Module06Intro durationInFrames={sceneDuration} />
			</Sequence>
			<Sequence from={sceneDuration} durationInFrames={sceneDuration} name="Module06-Diagram1">
				<Module06Diagram1 durationInFrames={sceneDuration} />
			</Sequence>
			<Sequence from={sceneDuration * 2} durationInFrames={sceneDuration} name="Module06-Diagram2">
				<Module06Diagram2 durationInFrames={sceneDuration} />
			</Sequence>
			<Sequence from={sceneDuration * 3} durationInFrames={sceneDuration} name="Module06-Diagram3">
				<Module06Diagram3 durationInFrames={sceneDuration} />
			</Sequence>
			<Sequence from={sceneDuration * 4} durationInFrames={sceneDuration} name="Module06-Recap">
				<Module06Recap durationInFrames={sceneDuration} />
			</Sequence>
		</>
	);
};

// Full course preview (all modules, all scenes)
export const AgenticFullCourseTest: React.FC = () => {
	const sceneDuration = SCENE_DURATION;
	const moduleScenes = 5;
	const moduleDuration = sceneDuration * moduleScenes;

	return (
		<>
			<Sequence from={0} durationInFrames={moduleDuration} name="Module01">
				<AgenticModule01Test />
			</Sequence>
			<Sequence from={moduleDuration} durationInFrames={moduleDuration} name="Module02">
				<AgenticModule02Test />
			</Sequence>
			<Sequence from={moduleDuration * 2} durationInFrames={moduleDuration} name="Module03">
				<AgenticModule03Test />
			</Sequence>
			<Sequence from={moduleDuration * 3} durationInFrames={moduleDuration} name="Module04">
				<AgenticModule04Test />
			</Sequence>
			<Sequence from={moduleDuration * 4} durationInFrames={moduleDuration} name="Module05">
				<AgenticModule05Test />
			</Sequence>
			<Sequence from={moduleDuration * 5} durationInFrames={moduleDuration} name="Module06">
				<AgenticModule06Test />
			</Sequence>
		</>
	);
};
