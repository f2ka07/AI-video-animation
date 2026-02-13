import React from "react";
import { Sequence, useVideoConfig, Audio, staticFile } from "remotion";
import { TitleSlide } from "../components/TitleSlide";
import { AnimatedContentSlide } from "../components/AnimatedContentSlide";
import { AnimatedCodeSlide } from "../components/AnimatedCodeSlide";
import { AnimatedComparisonSlide } from "../components/AnimatedComparisonSlide";
import { SequentialBulletSlide } from "../components/SequentialBulletSlide";
import { CodeAndDiagram } from "../compositions/CodeAndDiagram";
import { CrossFadeWrapper } from "../components/CrossFadeWrapper";
import { getAudioDuration } from "../utils/audioDuration";

// Auto-generated from moduleContent.ts - DO NOT EDIT MANUALLY

export const Module7: React.FC = () => {
	const { fps } = useVideoConfig();
	const crossFadeDuration = 0.3;
	const whooshDuration = 0.57;

	const audioFiles = {
		"hook-case-studies": staticFile("audio/rag-for-code-search-codebase-like-cursor/module7-hook-case-studies.wav"),
		"case-study-cursor": staticFile("audio/rag-for-code-search-codebase-like-cursor/module7-case-study-cursor.wav"),
		"case-study-microsoft": staticFile("audio/rag-for-code-search-codebase-like-cursor/module7-case-study-microsoft.wav"),
		"case-study-startup": staticFile("audio/rag-for-code-search-codebase-like-cursor/module7-case-study-startup.wav"),
		"module7-wrap-up": staticFile("audio/rag-for-code-search-codebase-like-cursor/module7-module7-wrap-up.wav"),
		whoosh: staticFile("audio/whoosh.wav"),
	};

	const audioDurations = {
		"hook-case-studies": getAudioDuration("rag-for-code-search-codebase-like-cursor/module7-hook-case-studies"),
		"case-study-cursor": getAudioDuration("rag-for-code-search-codebase-like-cursor/module7-case-study-cursor"),
		"case-study-microsoft": getAudioDuration("rag-for-code-search-codebase-like-cursor/module7-case-study-microsoft"),
		"case-study-startup": getAudioDuration("rag-for-code-search-codebase-like-cursor/module7-case-study-startup"),
		"module7-wrap-up": getAudioDuration("rag-for-code-search-codebase-like-cursor/module7-module7-wrap-up"),
	};

	let currentFrame = 0;

	const addSlide = (audioDuration: number, isLast: boolean = false, buffer: number = 0) => {
		const slideDuration = audioDuration + buffer;
		const start = currentFrame;
		if (!isLast) {
			currentFrame += (slideDuration + whooshDuration) * fps;
		} else {
			currentFrame += slideDuration * fps;
		}
		return { start, duration: slideDuration * fps, slideDuration, audioDuration, buffer };
	};

	const hook_case_studiesSlide = addSlide(audioDurations["hook-case-studies"]);
	const case_study_cursorSlide = addSlide(audioDurations["case-study-cursor"]);
	const case_study_microsoftSlide = addSlide(audioDurations["case-study-microsoft"]);
	const case_study_startupSlide = addSlide(audioDurations["case-study-startup"]);
	const module7_wrap_upSlide = addSlide(audioDurations["module7-wrap-up"], true, 0.5);

	return (
		<div
			style={{
				width: "100%",
			height: "100%",
			background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
			position: "relative",
		}}
		>
			{/* Real-World RAG Case Studies */}
			<Sequence
				from={hook_case_studiesSlide.start}
				durationInFrames={hook_case_studiesSlide.duration}
			>
				<Audio src={audioFiles["hook-case-studies"]} />
				<CrossFadeWrapper
					totalDuration={hook_case_studiesSlide.slideDuration}
					fadeInDuration={0.5}
					fadeOutDuration={crossFadeDuration}
			>
					<TitleSlide 
					title="Real-World RAG Case Studies for Code Search" 
					subtitle="How Companies Use RAG to Boost Developer Productivity"
					
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={hook_case_studiesSlide.start + hook_case_studiesSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Cursor.ai Case Study */}
			<Sequence
				from={case_study_cursorSlide.start}
				durationInFrames={case_study_cursorSlide.duration}
			>
				<Audio src={audioFiles["case-study-cursor"]} />
				<CrossFadeWrapper
					totalDuration={case_study_cursorSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Cursor.ai Case Study"
					points={[
						"Natural language repo search",
					"Instant relevant answers",
					"Faster debugging",
					"Accelerated development"
					]}
					slideName="case-study-cursor"
					audioDuration={case_study_cursorSlide.audioDuration}
					moduleNumber={7}
					
					
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={case_study_cursorSlide.start + case_study_cursorSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Microsoft Internal Tools */}
			<Sequence
				from={case_study_microsoftSlide.start}
				durationInFrames={case_study_microsoftSlide.duration}
			>
				<Audio src={audioFiles["case-study-microsoft"]} />
				<CrossFadeWrapper
					totalDuration={case_study_microsoftSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Microsoft Internal Tools"
					points={[
						"Legacy code understanding",
					"On-demand doc generation",
					"Improved collaboration",
					"Time savings"
					]}
					slideName="case-study-microsoft"
					audioDuration={case_study_microsoftSlide.audioDuration}
					moduleNumber={7}
					
					
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={case_study_microsoftSlide.start + case_study_microsoftSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Startup Onboarding Boost */}
			<Sequence
				from={case_study_startupSlide.start}
				durationInFrames={case_study_startupSlide.duration}
			>
				<Audio src={audioFiles["case-study-startup"]} />
				<CrossFadeWrapper
					totalDuration={case_study_startupSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Startup Onboarding Boost"
					points={[
						"Natural language queries",
					"Faster new hire ramp-up",
					"Boosted confidence",
					"Reduced training time"
					]}
					slideName="case-study-startup"
					audioDuration={case_study_startupSlide.audioDuration}
					moduleNumber={7}
					
					
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={case_study_startupSlide.start + case_study_startupSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Wrap-Up & Next Video Preview */}
			<Sequence
				from={module7_wrap_upSlide.start}
				durationInFrames={module7_wrap_upSlide.duration}
			>
				<Audio src={audioFiles["module7-wrap-up"]} />
				<CrossFadeWrapper
					totalDuration={module7_wrap_upSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={0}
			>
					<AnimatedContentSlide
					title="Wrap-Up & Next Video Preview"
					points={[
						"RAG boosts productivity",
					"Faster debugging & onboarding",
					"Generates docs on demand",
					"Next: Customizing RAG systems"
					]}
					slideName="module7-wrap-up"
					audioDuration={module7_wrap_upSlide.audioDuration}
					moduleNumber={7}
					
					
				/>
				</CrossFadeWrapper>
			</Sequence>

		</div>
	);
};
