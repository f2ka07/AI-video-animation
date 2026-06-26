// Content-driven module - loads from allModules, no generated ModuleN.tsx
// Supports slide splits, short videos, and all slide types

import React from "react";
import { Sequence, useVideoConfig, Audio, staticFile } from "remotion";
import { TitleSlide } from "../components/TitleSlide";
import { AnimatedContentSlide } from "../components/AnimatedContentSlide";
import { AnimatedCodeSlide } from "../components/AnimatedCodeSlide";
import { BulletsAndCodeSlide } from "../components/BulletsAndCodeSlide";
import { AnimatedComparisonSlide } from "../components/AnimatedComparisonSlide";
import { SequentialBulletSlide } from "../components/SequentialBulletSlide";
import { CodeAndDiagram } from "../compositions/CodeAndDiagram";
import { CrossFadeWrapper } from "../components/CrossFadeWrapper";
import { SegmentedContentSlide } from "../components/SegmentedContentSlide";
import { MermaidSlide } from "../components/MermaidSlide";
import { SegmentedMermaidSlide } from "../components/SegmentedMermaidSlide";
import { getAudioDurationOrEstimate } from "../utils/audioDuration";
import { allModules } from "./moduleContent";
import { expandSlidesWithSplits } from "../utils/expandSlidesWithSplits";
import { slideSplitsByCourse } from "../utils/slideSplitsData";
import {
	buildGenericModuleTimeline,
	WHOOSH_DURATION_SECONDS,
} from "./genericModuleTimeline";
import type { SlideContent, ModuleContent } from "./moduleContent";
import type { DiagramScene } from "../diagrams/sceneTypes";
import { toPremiumBullets, toPremiumComparisonItems } from "../utils/premiumDisplayPoints";

function isMultiAudioCodeSlide(slide: { type: string; scripts?: string[] }): boolean {
	return slide.type === "code" && !!slide.scripts && slide.scripts.length >= 1;
}

function normalizeSubtitle(s: string): string {
	if (!s || typeof s !== "string") return s;
	return s.replace(/^(Module|Video) \d+:\s*/i, "").trim() || s;
}

function normalizeConclusionTitle(title: string | undefined, isLastSlide: boolean): string {
	if (!title || !isLastSlide) return title ?? "";
	if (!/^Module \d+\s*Summary\s*:?\s*/i.test(title)) return title;
	const after = title.replace(/^Module \d+\s*Summary\s*:?\s*/i, "").trim();
	return after || "Conclusion";
}

function parseScene(scene: unknown): DiagramScene | null {
	if (!scene) return null;
	if (typeof scene === "object") return scene as DiagramScene;
	if (typeof scene === "string") {
		try {
			return JSON.parse(scene) as DiagramScene;
		} catch {
			return null;
		}
	}
	return null;
}

interface GenericModuleProps {
	courseId: string;
	moduleNumber: number;
}

export const GenericModule: React.FC<GenericModuleProps> = ({ courseId, moduleNumber }) => {
	const { fps } = useVideoConfig();
	const crossFadeDuration = 0.3;
	const whooshDuration = WHOOSH_DURATION_SECONDS;

	const module = allModules.find(
		(m) => m.courseId === courseId && m.moduleNumber === moduleNumber
	) as ModuleContent | undefined;

	if (!module) {
		return (
			<div style={{ padding: 40, color: "#fff" }}>
				Module not found: {courseId} / {moduleNumber}
			</div>
		);
	}

	const getDur = (slideName: string, script?: string): number =>
		getAudioDurationOrEstimate(
			`${courseId}/module${moduleNumber}-${slideName}`,
			script
		);

	const splits = slideSplitsByCourse[courseId] || {};
	const getDurForSlide = (slideName: string): number => {
		const slide = module.slides.find((s) => s.name === slideName);
		if (slide && isMultiAudioCodeSlide(slide)) {
			let sum = 0;
			for (let i = 1; i <= slide.scripts!.length; i++) {
				sum += getAudioDurationOrEstimate(
					`${courseId}/module${moduleNumber}-${slideName}-${i}`,
					slide.scripts![i - 1]
				);
			}
			return sum;
		}
		return getDur(slideName, slide?.script);
	};

	const effectiveSegments = expandSlidesWithSplits(module.slides, splits, getDurForSlide);
	const timeline = buildGenericModuleTimeline(courseId, module as ModuleContent & { videoCategory?: string });

	// Group segments by slide - one Sequence per slide, audio plays continuously (no cuts)
	const slideGroups: Array<{ slide: SlideContent; segments: typeof effectiveSegments }> = [];
	for (const slide of module.slides) {
		const segs = effectiveSegments.filter((s) => s.slideName === slide.name);
		slideGroups.push({ slide, segments: segs });
	}

	const audioFiles: Record<string, string> = { whoosh: staticFile("audio/whoosh.wav") };
	const audioDurations: Record<string, number> = {};

	for (const slide of module.slides) {
		if (isMultiAudioCodeSlide(slide)) {
			const n = slide.scripts!.length;
			for (let i = 1; i <= n; i++) {
				const key = `${slide.name}-${i}`;
				audioFiles[key] = staticFile(
					`audio/${courseId}/module${moduleNumber}-${slide.name}-${i}.wav`
				);
				audioDurations[key] = getAudioDurationOrEstimate(
					`${courseId}/module${moduleNumber}-${slide.name}-${i}`,
					slide.scripts![i - 1]
				);
			}
		} else {
			audioFiles[slide.name] = staticFile(
				`audio/${courseId}/module${moduleNumber}-${slide.name}.wav`
			);
			audioDurations[slide.name] = getDur(slide.name, slide.script);
		}
	}

	let currentFrame = 0;
	const slideGroupVars: Array<{
		start: number;
		duration: number;
		slideDuration: number;
		audioDuration: number;
	}> = [];

	for (let i = 0; i < slideGroups.length; i++) {
		const entry = timeline.slides[i];
		if (!entry) continue;
		const slideDuration = entry.slideDuration;
		const whooshTime = entry.whooshAfter ? whooshDuration : 0;
		slideGroupVars.push({
			start: currentFrame,
			duration: slideDuration * fps,
			slideDuration,
			audioDuration: entry.audioDuration,
		});
		currentFrame += (slideDuration + whooshTime) * fps;
	}

	const getPremiumOptions = (slide: SlideContent) => {
		const ext = slide as SlideContent & { beat?: string; keyPhrases?: string[] };
		const isLab = slide.name?.includes("lab-setup") || slide.title?.toLowerCase().includes("lab");
		return {
			script: slide.script,
			keyPhrases: ext.keyPhrases,
			slideType: slide.type,
			beat: ext.beat,
			allowLabDense: isLab,
		};
	};

	const getEffectivePoints = (points: string[], slide: SlideContent): string[] => {
		const manual = slide as SlideContent & { useManualPoints?: boolean };
		const opts = getPremiumOptions(slide);
		let resolved: string[];
		if (manual.useManualPoints === true && slide.points && slide.points.length > 0) {
			resolved = slide.points;
		} else if (points.length > 0) {
			resolved = points;
		} else {
			resolved = [];
		}
		return toPremiumBullets(resolved, opts);
	};

	const getStoryBeatTitle = (slide: SlideContent): string => {
		const beat = (slide as SlideContent & { beat?: string }).beat;
		if (beat === "pattern-interrupt") return "Pattern interrupt";
		if (beat === "recap") return "Recap";
		if (beat && typeof beat === "string") return beat.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
		return "";
	};

	const renderSlideGroup = (
		group: { slide: SlideContent; segments: typeof effectiveSegments },
		slideVar: { start: number; duration: number; slideDuration: number; audioDuration: number },
		groupIndex: number
	) => {
		const { slide, segments } = group;
		const isFirst = groupIndex === 0;
		const isLast = groupIndex === slideGroups.length - 1;
		const needsWhoosh = !isLast;
		const manualBullets = (slide as SlideContent & { useManualPoints?: boolean }).useManualPoints === true;
		const hasVisualSplits = !manualBullets && segments.length > 1;
		const firstSeg = segments[0];

		let slideEl: React.ReactNode;
		switch (slide.type) {
			case "title": {
				const subtitleText = normalizeSubtitle(slide.subtitle || module.subtitle);
				const slideTitle = slide.title?.trim() || module.title;
				slideEl = (
					<TitleSlide
						title={slideTitle}
						subtitle={subtitleText}
						animation={(slide as SlideContent & { animation?: string }).animation}
						imageSrc={slide.imageSrc}
						audioDuration={slideVar.audioDuration}
					/>
				);
				break;
			}
			case "content-two-card": {
				const slideTitle = normalizeConclusionTitle(slide.title, isLast);
				const hasMermaidSegments = hasVisualSplits && segments.some((s) => s.mermaidSource);
				slideEl = hasMermaidSegments ? (
					<SegmentedMermaidSlide
						title={slideTitle}
						segments={segments.map((s) => ({
							mermaidSource: s.mermaidSource ?? "",
							startSeconds: s.segmentStartSeconds,
							endSeconds: s.segmentStartSeconds + s.segmentDurationSeconds,
						}))}
						slideName={slide.name}
						audioDuration={slideVar.audioDuration}
						moduleNumber={moduleNumber}
					/>
				) : hasVisualSplits ? (
					<SegmentedContentSlide
						title={slideTitle}
						segments={segments.map((s) => ({
							points: s.points,
							keyWords: s.keyWords,
							phraseTimes: s.phraseTimes,
							startSeconds: s.segmentStartSeconds,
							endSeconds: s.segmentStartSeconds + s.segmentDurationSeconds,
						}))}
						slideName={slide.name}
						audioDuration={slideVar.audioDuration}
						moduleNumber={moduleNumber}
						animation={(slide as SlideContent & { animation?: string }).animation}
						imageSrc={slide.imageSrc}
						fallbackPointsFromSlide={slide.points}
					/>
				) : (
					<AnimatedContentSlide
						title={slideTitle}
						points={getEffectivePoints(firstSeg.points, slide)}
						slideName={slide.name}
						audioDuration={slideVar.audioDuration}
						moduleNumber={moduleNumber}
						animation={(slide as SlideContent & { animation?: string }).animation}
						imageSrc={slide.imageSrc}
					/>
				);
				break;
			}
			case "mermaid": {
				const mermaidSource = (slide as SlideContent & { mermaidSource?: string }).mermaidSource;
				const hasMermaidSegments = hasVisualSplits && segments.some((s) => s.mermaidSource);
				slideEl = hasMermaidSegments ? (
					<SegmentedMermaidSlide
						title={slide.title ?? ""}
						segments={segments.map((s) => ({
							mermaidSource: s.mermaidSource ?? mermaidSource ?? "",
							startSeconds: s.segmentStartSeconds,
							endSeconds: s.segmentStartSeconds + s.segmentDurationSeconds,
						}))}
						slideName={slide.name}
						audioDuration={slideVar.audioDuration}
						moduleNumber={moduleNumber}
					/>
				) : mermaidSource ? (
					<MermaidSlide
						title={slide.title ?? ""}
						mermaidSource={mermaidSource}
						slideName={slide.name}
						audioDuration={slideVar.audioDuration}
						moduleNumber={moduleNumber}
					/>
				) : (
					<div style={{ padding: 40, color: "#ef4444" }}>Missing mermaidSource for {slide.name}</div>
				);
				break;
			}
			case "content-single":
				const hasMermaidSegmentsSingle = hasVisualSplits && segments.some((s) => s.mermaidSource);
				slideEl = hasMermaidSegmentsSingle ? (
					<SegmentedMermaidSlide
						title={slide.title ?? ""}
						segments={segments.map((s) => ({
							mermaidSource: s.mermaidSource ?? "",
							startSeconds: s.segmentStartSeconds,
							endSeconds: s.segmentStartSeconds + s.segmentDurationSeconds,
						}))}
						slideName={slide.name}
						audioDuration={slideVar.audioDuration}
						moduleNumber={moduleNumber}
					/>
				) : hasVisualSplits ? (
					<SegmentedContentSlide
						title={slide.title ?? ""}
						segments={segments.map((s) => ({
							points: s.points,
							keyWords: s.keyWords,
							phraseTimes: s.phraseTimes,
							startSeconds: s.segmentStartSeconds,
							endSeconds: s.segmentStartSeconds + s.segmentDurationSeconds,
						}))}
						slideName={slide.name}
						audioDuration={slideVar.audioDuration}
						moduleNumber={moduleNumber}
						animation={(slide as SlideContent & { animation?: string }).animation}
						imageSrc={slide.imageSrc}
						fallbackPointsFromSlide={slide.points}
					/>
				) : (
					<AnimatedContentSlide
						title={slide.title ?? ""}
						points={getEffectivePoints(firstSeg.points, slide)}
						slideName={slide.name}
						audioDuration={slideVar.audioDuration}
						moduleNumber={moduleNumber}
						animation={(slide as SlideContent & { animation?: string }).animation}
						imageSrc={slide.imageSrc}
					/>
				);
				break;
			case "bullets-code": {
				const code = slide.code ?? "";
				const codeContext = (slide as SlideContent & { codeContext?: string }).codeContext ?? "";
				slideEl = (
					<BulletsAndCodeSlide
						title={slide.title ?? ""}
						points={getEffectivePoints(firstSeg.points, slide)}
						code={code}
						language={slide.language || "python"}
						codeContext={codeContext}
						slideName={slide.name}
						audioDuration={slideVar.audioDuration}
						moduleNumber={moduleNumber}
					/>
				);
				break;
			}
			case "code": {
				const code = slide.code ?? "";
				const codeLineCount = code.trim() ? code.trim().split("\n").length : 0;
				const visibleLineRange =
					codeLineCount > 0 && codeLineCount <= 24 ? undefined : slide.visibleLineRange;
				const audioChunkDurations = isMultiAudioCodeSlide(slide)
					? slide.scripts!.map(
							(_, j) =>
								audioDurations[`${slide.name}-${j + 1}`] ??
								getAudioDurationOrEstimate(
									`${courseId}/module${moduleNumber}-${slide.name}-${j + 1}`,
									slide.scripts![j]
								)
					  )
					: undefined;
				const codeContext = slide.codeContext ?? slide.filePath ?? "";
				slideEl = (
					<AnimatedCodeSlide
						title={slide.title ?? ""}
						code={code}
						language={slide.language || "typescript"}
						slideName={slide.name}
						audioDuration={slideVar.audioDuration}
						moduleNumber={moduleNumber}
						audioChunkDurations={audioChunkDurations}
						visibleLineRange={visibleLineRange}
						codeContext={codeContext || undefined}
					/>
				);
				break;
			}
			case "code-diagram": {
				const codeDiagram = slide.code ?? "";
				const codeDiagramLineCount = codeDiagram.trim() ? codeDiagram.trim().split("\n").length : 0;
				const codeDiagramVisibleLineRange =
					codeDiagramLineCount > 0 && codeDiagramLineCount <= 24
						? undefined
						: slide.visibleLineRange;
				const scene = parseScene(slide.scene);
				slideEl = scene ? (
					<CodeAndDiagram
						title={slide.title ?? ""}
						code={codeDiagram}
						language={slide.language || "typescript"}
						slideName={slide.name}
						scene={scene}
						moduleNumber={moduleNumber}
					/>
				) : (
					<AnimatedCodeSlide
						title={slide.title ?? ""}
						code={codeDiagram}
						language={slide.language || "typescript"}
						slideName={slide.name}
						audioDuration={slideVar.audioDuration}
						moduleNumber={moduleNumber}
						visibleLineRange={codeDiagramVisibleLineRange}
						codeContext={slide.codeContext ?? slide.filePath ?? undefined}
					/>
				);
				break;
			}
			case "comparison": {
				const comparisonCopy = toPremiumComparisonItems(
					slide.leftItems ?? [],
					slide.rightItems ?? []
				);
				slideEl = (
					<AnimatedComparisonSlide
						title={slide.title ?? ""}
						leftTitle={slide.leftTitle ?? ""}
						leftItems={comparisonCopy.leftItems}
						rightTitle={slide.rightTitle ?? ""}
						rightItems={comparisonCopy.rightItems}
						slideName={slide.name}
						audioDuration={slideVar.audioDuration}
						imageSrc={slide.imageSrc}
						moduleNumber={moduleNumber}
					/>
				);
				break;
			}
			case "sequential-bullet":
				slideEl = (
					<SequentialBulletSlide
						title={slide.title ?? ""}
						points={getEffectivePoints(firstSeg.points, slide)}
						slideName={slide.name}
						moduleNumber={moduleNumber}
						svgPath={(slide as SlideContent & { svgPath?: string }).svgPath}
					/>
				);
				break;
			case "story-beat":
				slideEl = (
					<AnimatedContentSlide
						title={slide.title || getStoryBeatTitle(slide)}
						points={getEffectivePoints(firstSeg.points, slide)}
						slideName={slide.name}
						audioDuration={slideVar.audioDuration}
						moduleNumber={moduleNumber}
						animation={(slide as SlideContent & { animation?: string }).animation}
						imageSrc={slide.imageSrc}
					/>
				);
				break;
			default:
				slideEl = (
					<AnimatedContentSlide
						title={slide.title ?? ""}
						points={getEffectivePoints(firstSeg.points, slide)}
						slideName={slide.name}
						audioDuration={slideVar.audioDuration}
						moduleNumber={moduleNumber}
					/>
				);
		}

		const fadeOut = isLast ? 0 : crossFadeDuration;
		const fadeIn = isFirst ? 0.5 : crossFadeDuration;

		// One continuous audio per slide - no cuts, no startFrom
		const audioEl = isMultiAudioCodeSlide(slide) ? (
			<>
				{slide.scripts!.map((_, j) => {
					const key = `${slide.name}-${j + 1}`;
					const fromFrames =
						j === 0
							? 0
							: Math.round(
									slide.scripts!
										.slice(0, j)
										.reduce(
											(sum, _, k) =>
												sum +
												(audioDurations[`${slide.name}-${k + 1}`] ?? 0),
											0
										) * fps
							  );
					return (
						<Sequence key={key} from={fromFrames}>
							<Audio src={audioFiles[key]} />
						</Sequence>
					);
				})}
			</>
		) : (
			<Audio src={audioFiles[slide.name]} />
		);

		return (
			<React.Fragment key={slide.name}>
				<Sequence from={slideVar.start} durationInFrames={slideVar.duration}>
					{audioEl}
					<CrossFadeWrapper
						totalDuration={slideVar.slideDuration}
						fadeInDuration={fadeIn}
						fadeOutDuration={fadeOut}
					>
						{slideEl}
					</CrossFadeWrapper>
				</Sequence>
				{needsWhoosh && (
					<Sequence
						from={slideVar.start + slideVar.duration}
						durationInFrames={whooshDuration * fps}
					>
						<Audio src={audioFiles.whoosh} startFrom={0} />
					</Sequence>
				)}
			</React.Fragment>
		);
	};

	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
				position: "relative",
			}}
		>
			{slideGroups.map((group, i) => {
				const slideVar = slideGroupVars[i];
				if (!slideVar) return null;
				return renderSlideGroup(group, slideVar, i);
			})}
		</div>
	);
};
