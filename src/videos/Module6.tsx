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

export const Module6: React.FC = () => {
	const { fps } = useVideoConfig();
	const crossFadeDuration = 0.3;
	const whooshDuration = 0.57;

	const audioFiles = {
		"hook-scaling-rag": staticFile("audio/rag-for-code-search-codebase-like-cursor/module6-hook-scaling-rag.wav"),
		"index-sharding-techniques": staticFile("audio/rag-for-code-search-codebase-like-cursor/module6-index-sharding-techniques.wav"),
		"caching-results": staticFile("audio/rag-for-code-search-codebase-like-cursor/module6-caching-results.wav"),
		"multi-user-access-control": staticFile("audio/rag-for-code-search-codebase-like-cursor/module6-multi-user-access-control.wav"),
		"monitoring-and-alerting": staticFile("audio/rag-for-code-search-codebase-like-cursor/module6-monitoring-and-alerting.wav"),
		"module6-wrap-up": staticFile("audio/rag-for-code-search-codebase-like-cursor/module6-module6-wrap-up.wav"),
		whoosh: staticFile("audio/whoosh.wav"),
	};

	const audioDurations = {
		"hook-scaling-rag": getAudioDuration("rag-for-code-search-codebase-like-cursor/module6-hook-scaling-rag"),
		"index-sharding-techniques": getAudioDuration("rag-for-code-search-codebase-like-cursor/module6-index-sharding-techniques"),
		"caching-results": getAudioDuration("rag-for-code-search-codebase-like-cursor/module6-caching-results"),
		"multi-user-access-control": getAudioDuration("rag-for-code-search-codebase-like-cursor/module6-multi-user-access-control"),
		"monitoring-and-alerting": getAudioDuration("rag-for-code-search-codebase-like-cursor/module6-monitoring-and-alerting"),
		"module6-wrap-up": getAudioDuration("rag-for-code-search-codebase-like-cursor/module6-module6-wrap-up"),
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

	const hook_scaling_ragSlide = addSlide(audioDurations["hook-scaling-rag"]);
	const index_sharding_techniquesSlide = addSlide(audioDurations["index-sharding-techniques"]);
	const caching_resultsSlide = addSlide(audioDurations["caching-results"]);
	const multi_user_access_controlSlide = addSlide(audioDurations["multi-user-access-control"]);
	const monitoring_and_alertingSlide = addSlide(audioDurations["monitoring-and-alerting"]);
	const module6_wrap_upSlide = addSlide(audioDurations["module6-wrap-up"], true, 0.5);

	return (
		<div
			style={{
				width: "100%",
			height: "100%",
			background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
			position: "relative",
		}}
		>
			{/* Scale RAG for Big Codebases & Teams */}
			<Sequence
				from={hook_scaling_ragSlide.start}
				durationInFrames={hook_scaling_ragSlide.duration}
			>
				<Audio src={audioFiles["hook-scaling-rag"]} />
				<CrossFadeWrapper
					totalDuration={hook_scaling_ragSlide.slideDuration}
					fadeInDuration={0.5}
					fadeOutDuration={crossFadeDuration}
			>
					<TitleSlide 
					title="Scaling RAG Systems for Large Codebases and Teams" 
					subtitle="Handling Big Repos and Multiple Developers"
					
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={hook_scaling_ragSlide.start + hook_scaling_ragSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Index Sharding Techniques */}
			<Sequence
				from={index_sharding_techniquesSlide.start}
				durationInFrames={index_sharding_techniquesSlide.duration}
			>
				<Audio src={audioFiles["index-sharding-techniques"]} />
				<CrossFadeWrapper
					totalDuration={index_sharding_techniquesSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Index Sharding Techniques"
					points={[
						"Split index by repo parts",
					"Reduce search space",
					"Speed up retrieval",
					"Shard by directory or language"
					]}
					slideName="index-sharding-techniques"
					audioDuration={index_sharding_techniquesSlide.audioDuration}
					moduleNumber={6}
					
					
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={index_sharding_techniquesSlide.start + index_sharding_techniquesSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Caching to Improve Performance */}
			<Sequence
				from={caching_resultsSlide.start}
				durationInFrames={caching_resultsSlide.duration}
			>
				<Audio src={audioFiles["caching-results"]} />
				<CrossFadeWrapper
					totalDuration={caching_resultsSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Caching to Improve Performance"
					points={[
						"Store frequent query results",
					"Avoid repeat computation",
					"Speed up responses",
					"Enhance user experience"
					]}
					slideName="caching-results"
					audioDuration={caching_resultsSlide.audioDuration}
					moduleNumber={6}
					
					
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={caching_resultsSlide.start + caching_resultsSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Multi-User Access & Security */}
			<Sequence
				from={multi_user_access_controlSlide.start}
				durationInFrames={multi_user_access_controlSlide.duration}
			>
				<Audio src={audioFiles["multi-user-access-control"]} />
				<CrossFadeWrapper
					totalDuration={multi_user_access_controlSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Multi-User Access & Security"
					points={[
						"User authentication",
					"Permission controls",
					"Secure sensitive code",
					"Compliance support"
					]}
					slideName="multi-user-access-control"
					audioDuration={multi_user_access_controlSlide.audioDuration}
					moduleNumber={6}
					
					
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={multi_user_access_controlSlide.start + multi_user_access_controlSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Monitoring & Alerting */}
			<Sequence
				from={monitoring_and_alertingSlide.start}
				durationInFrames={monitoring_and_alertingSlide.duration}
			>
				<Audio src={audioFiles["monitoring-and-alerting"]} />
				<CrossFadeWrapper
					totalDuration={monitoring_and_alertingSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={crossFadeDuration}
			>
					<AnimatedContentSlide
					title="Monitoring & Alerting"
					points={[
						"Track performance",
					"Monitor errors",
					"Measure accuracy",
					"Set alerts"
					]}
					slideName="monitoring-and-alerting"
					audioDuration={monitoring_and_alertingSlide.audioDuration}
					moduleNumber={6}
					
					
				/>
				</CrossFadeWrapper>
			</Sequence>
			{/* Whoosh transition */}
			<Sequence
				from={monitoring_and_alertingSlide.start + monitoring_and_alertingSlide.duration}
				durationInFrames={whooshDuration * fps}
			>
				<Audio src={audioFiles.whoosh} startFrom={0} />
			</Sequence>

			{/* Wrap-Up & Next Video Preview */}
			<Sequence
				from={module6_wrap_upSlide.start}
				durationInFrames={module6_wrap_upSlide.duration}
			>
				<Audio src={audioFiles["module6-wrap-up"]} />
				<CrossFadeWrapper
					totalDuration={module6_wrap_upSlide.slideDuration}
					fadeInDuration={crossFadeDuration}
					fadeOutDuration={0}
			>
					<AnimatedContentSlide
					title="Wrap-Up & Next Video Preview"
					points={[
						"Shard your index",
					"Cache popular queries",
					"Secure multi-user access",
					"Monitor system health"
					]}
					slideName="module6-wrap-up"
					audioDuration={module6_wrap_upSlide.audioDuration}
					moduleNumber={6}
					
					
				/>
				</CrossFadeWrapper>
			</Sequence>

		</div>
	);
};
