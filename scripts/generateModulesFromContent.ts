// Auto-generate ModuleX.tsx and ModuleXConfig.ts from moduleContent.ts
// This is the core automation - you only edit moduleContent.ts, everything else is generated

import * as fs from "fs";
import * as path from "path";
import { allModules, ModuleContent } from "../src/videos/moduleContent";
import { courseUsesSceneVisuals } from "./courseVisualMode";
import { loadSlideSplits, expandSlidesWithSplits, EffectiveSegment } from "./loadSlideSplits";

function stripMermaidFromSplits(splits: Record<string, unknown>): Record<string, unknown> {
	const out: Record<string, unknown> = { ...splits };
	for (const key of Object.keys(out)) {
		const entry = out[key] as { segments?: Array<{ mermaidSource?: string }> };
		if (!entry?.segments) continue;
		entry.segments = entry.segments.map((seg) => {
			if (!seg?.mermaidSource) return seg;
			const { mermaidSource, ...rest } = seg;
			return rest;
		});
	}
	return out;
}
import { getAudioDuration } from "../src/utils/audioDuration";

/** Load code for a slide from content.json when moduleContent lacks it */
function getCodeFromContentJson(courseId: string, moduleNumber: number, slideName: string): string | undefined {
	const contentPath = path.join(__dirname, "../courses", courseId, "content.json");
	if (!fs.existsSync(contentPath)) return undefined;
	try {
		const plan = JSON.parse(fs.readFileSync(contentPath, "utf-8"));
		const mod = plan.modules?.find((m: any) => m.moduleNumber === moduleNumber);
		const slide = mod?.slides?.find((s: any) => s.name === slideName);
		return slide?.code;
	} catch {
		return undefined;
	}
}

function isMultiAudioCodeSlide(slide: { type: string; scripts?: string[] }): boolean {
	return slide.type === "code" && slide.scripts && slide.scripts.length >= 1;
}

/** Remove "Module N:" / "Video N:" prefix so subtitles work in multi-purpose / combined videos */
function normalizeSubtitle(s: string): string {
	if (!s || typeof s !== "string") return s;
	return s.replace(/^(Module|Video) \d+:\s*/i, "").trim() || s;
}

/** Replace "Module N Summary" / "Module N Summary: X" with "X" or "Conclusion" for last slide */
function normalizeConclusionTitle(title: string | undefined, isLastSlide: boolean): string {
	if (!title || !isLastSlide) return title ?? "";
	if (!/^Module \d+\s*Summary\s*:?\s*/i.test(title)) return title;
	const after = title.replace(/^Module \d+\s*Summary\s*:?\s*/i, "").trim();
	return after || "Conclusion";
}

function getAudioKeysForSlide(courseId: string, moduleNumber: number, slide: { name: string; type: string; scripts?: string[] }): string[] {
	if (isMultiAudioCodeSlide(slide)) {
		const n = (slide.scripts?.length ?? 1);
		return Array.from({ length: n }, (_, i) => `${courseId}/module${moduleNumber}-${slide.name}-${i + 1}`);
	}
	return [`${courseId}/module${moduleNumber}-${slide.name}`];
}

/** Fixed duration per slide (seconds) when using --preview (no audio yet) */
const PREVIEW_SLIDE_DURATION = 15;

function generateModuleConfig(module: ModuleContent, previewMode: boolean = false): string {
	const courseId = module.courseId || 'default';
	const isShort = module.videoCategory === "short";
	const slideNames = module.slides.map((s) => s.name);
	
	// For short videos: fixed 5-second slides, max 3 minutes (36 slides max)
	// For standard videos: audio-based durations
	if (isShort) {
		const slideDuration = 5; // Fixed 5 seconds per slide
		const whooshDuration = 0.57;
		const totalSlides = module.slides.length;
		const totalDuration = totalSlides * slideDuration + (totalSlides - 1) * whooshDuration;
		
		// Validate: ensure under 3 minutes (180 seconds)
		if (totalDuration > 180) {
			const maxSlides = Math.floor((180 - (totalSlides - 1) * whooshDuration) / slideDuration);
			throw new Error(
				`Module ${module.moduleNumber} (short video) exceeds 3 minutes: ${totalDuration.toFixed(1)}s. ` +
				`Maximum ${maxSlides} slides allowed for 3-minute limit.`
			);
		}
		
		return `// Configuration for Module ${module.moduleNumber} video (SHORT - Portrait)
// Auto-generated from moduleContent.ts - DO NOT EDIT MANUALLY

export const Module${module.moduleNumber}Config = {
	id: "module-${module.moduleNumber}",
	title: "${module.title}",
	fps: 30,
	width: 1080,
	height: 1920,
	totalDuration: ${totalDuration.toFixed(2)},
};
`;
	} else {
		const whooshDuration = 0.57;
		const summaryBuffer = 0.5;

		if (previewMode) {
			// Preview: fixed duration per slide (no audio needed)
			const fixedDur = PREVIEW_SLIDE_DURATION;
			const totalDuration = module.slides.reduce((sum, _, index) => {
				const isLastSlide = index === module.slides.length - 1;
				const slideDuration = fixedDur + (isLastSlide ? summaryBuffer : 0);
				const whooshTime = isLastSlide ? 0 : whooshDuration;
				return sum + slideDuration + whooshTime;
			}, 0);

			return `// Configuration for Module ${module.moduleNumber} video (PREVIEW - fixed durations)
// Auto-generated from moduleContent.ts - DO NOT EDIT MANUALLY
// Run without --preview after generating audio for real durations

export const Module${module.moduleNumber}Config = {
	id: "module-${module.moduleNumber}",
	title: "${module.title}",
	fps: 30,
	width: 1920,
	height: 1080,
	totalDuration: ${totalDuration.toFixed(2)},
};
`;
		}

		// For multi-audio code slides: one entry per slide (sum of chunk durations)
		const audioDurationsEntries = module.slides.map((slide) => {
			const keys = getAudioKeysForSlide(courseId, module.moduleNumber, slide);
			if (keys.length === 1) {
				return `\tgetAudioDuration("${keys[0]}")`;
			}
			const sumExpr = keys.map((k) => `getAudioDuration("${k}")`).join(" + ");
			return `\t(${sumExpr})`;
		});

		// Check for slide splits - affects totalDuration when present
		const splits = loadSlideSplits(courseId);
		const getDur = (sn: string) => getAudioDuration(`${courseId}/module${module.moduleNumber}-${sn}`);
		const effectiveSegments = expandSlidesWithSplits(module.slides, splits, getDur);
		const hasSplits = effectiveSegments.length !== module.slides.length;

		const totalDurationExpr = hasSplits
			? effectiveSegments.reduce((sum, s) => {
				const buf = s.isLastInModule ? 1.2 : 1.0;
				const whoosh = s.isLastInGroup && !s.isLastInModule ? 0.57 : 0;
				return sum + s.segmentDurationSeconds + buf + whoosh;
			}, 0).toFixed(2)
			: `audioDurations.reduce((sum, audioDur, index) => {
	const isLastSlide = index === audioDurations.length - 1;
	const slideDuration = audioDur + (isLastSlide ? lastSlideBuffer : slideBuffer);
	const whooshTime = isLastSlide ? 0 : whooshDuration;
	return sum + slideDuration + whooshTime;
}, 0)`;

		return `// Configuration for Module ${module.moduleNumber} video
// Auto-generated from moduleContent.ts - DO NOT EDIT MANUALLY

import { getAudioDuration } from "../utils/audioDuration";

const audioDurations = [
${audioDurationsEntries.join(",\n")}
];

const whooshDuration = 0.57;
const slideBuffer = 1.0;
const lastSlideBuffer = 1.2;
const totalDuration = ${totalDurationExpr};

export const Module${module.moduleNumber}Config = {
	id: "module-${module.moduleNumber}",
	title: "${module.title}",
	fps: 30,
	width: 1920,
	height: 1080,
	totalDuration,
};
`;
	}
}

function generateModuleFile(module: ModuleContent, previewMode: boolean = false, bulletsOnly: boolean = false): string {
	const slideNames = module.slides.map((s) => s.name);
	
	// Helper function to quote property names if they are not valid JavaScript identifiers
	// Valid identifiers: start with letter/underscore/$ and contain only letters, numbers, underscore, $
	const quotePropertyName = (name: string): string => {
		// Check if it's a valid JavaScript identifier
		const isValidIdentifier = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name);
		// Always quote if not a valid identifier (handles hyphens, spaces, numbers at start, etc.)
		return isValidIdentifier ? name : `"${name}"`;
	};
	
	const courseId = module.courseId || 'default';
	const audioFilesLines: string[] = [];
	const audioDurationsLines: string[] = [];
	const fixedDur = previewMode ? PREVIEW_SLIDE_DURATION : 0;
	for (const slide of module.slides) {
		const quotedName = quotePropertyName(slide.name);
		if (isMultiAudioCodeSlide(slide)) {
			const n = slide.scripts!.length;
			const pathKeys: string[] = [];
			for (let i = 1; i <= n; i++) {
				const key = `${slide.name}-${i}`;
				const qk = quotePropertyName(key);
				const pathKey = `${courseId}/module${module.moduleNumber}-${slide.name}-${i}`;
				pathKeys.push(pathKey);
				audioFilesLines.push(`\t\t${qk}: staticFile("audio/${pathKey}.wav"),`);
				audioDurationsLines.push(previewMode
					? `\t\t${qk}: ${fixedDur},`
					: `\t\t${qk}: getAudioDuration("${pathKey}"),`);
			}
			audioDurationsLines.push(previewMode
				? `\t\t${quotedName}: ${fixedDur * (slide.scripts!.length)},`
				: `\t\t${quotedName}: (${pathKeys.map((pk) => `getAudioDuration("${pk}")`).join(" + ")}),`);
		} else {
			audioFilesLines.push(`\t\t${quotedName}: staticFile("audio/${courseId}/module${module.moduleNumber}-${slide.name}.wav"),`);
			audioDurationsLines.push(previewMode
				? `\t\t${quotedName}: ${fixedDur},`
				: `\t\t${quotedName}: getAudioDuration("${courseId}/module${module.moduleNumber}-${slide.name}"),`);
		}
	}
	const audioFiles = audioFilesLines.join("\n");
	const audioDurations = audioDurationsLines.join("\n");

	// Helper function to convert slide name to valid JavaScript identifier
	const toValidIdentifier = (name: string): string => {
		// Replace hyphens and other invalid chars with underscores, ensure it starts with letter/underscore
		return name.replace(/[^a-zA-Z0-9_]/g, '_').replace(/^(\d)/, '_$1');
	};

	// Determine if this is a short video
	const isShort = module.videoCategory === "short";
	const fixedSlideDuration = 5; // 5 seconds for short videos

	// For standard videos: check slide splits (content-single/content-two-card can be split into segments)
	// Skip splits in preview mode (no audio files to measure)
	const splitsRaw = !previewMode ? loadSlideSplits(courseId) : {};
	const splits = bulletsOnly ? (stripMermaidFromSplits(splitsRaw) as ReturnType<typeof loadSlideSplits>) : splitsRaw;
	const getDur = (sn: string) => {
		if (previewMode) return fixedDur;
		return getAudioDuration(`${courseId}/module${module.moduleNumber}-${sn}`);
	};
	const effectiveSegments = expandSlidesWithSplits(module.slides, splits, getDur);
	const hasSplits = !previewMode && effectiveSegments.length !== module.slides.length;

	// Generate slide timings
	const slideTimings = (() => {
		if (isShort) {
			return slideNames
				.map((name, index) => {
					const varName = toValidIdentifier(name);
					const slideDuration = fixedSlideDuration;
					const whooshDuration = 0.57;
					const start = index * (slideDuration + whooshDuration) * 30;
					const duration = slideDuration * 30;
					return `\tconst ${varName}Slide = {
		start: ${start},
		duration: ${duration},
		slideDuration: ${slideDuration},
		audioDuration: ${slideDuration},
		buffer: 0
	};`;
				})
				.join("\n");
		}
		if (hasSplits) {
			// Use addSegment: whoosh only between slide groups (isLastInGroup && !isLastInModule)
			return effectiveSegments
				.map((seg, i) => {
					const buf = seg.isLastInModule ? 1.2 : 1.0;
					const args = `${seg.segmentDurationSeconds.toFixed(2)}, ${seg.isLastInGroup}, ${seg.isLastInModule}, ${buf}`;
					return `\tconst seg${i} = addSegment(${args});`;
				})
				.join("\n");
		}
		// Standard: one addSlide per slide
		return slideNames
			.map((name, index) => {
				const isLast = index === slideNames.length - 1;
				const varName = toValidIdentifier(name);
				const buffer = isLast ? ", true, 1.2" : ", false, 1.0";
				return `\tconst ${varName}Slide = addSlide(audioDurations["${name.replace(/"/g, '\\"')}"]${buffer});`;
			})
			.join("\n");
	})();

	// Build list of items to render: effectiveSegments when hasSplits, else one "virtual segment" per slide
	type RenderItem = { slide: typeof module.slides[0]; points: string[]; segmentStart: number; segmentDuration: number; slideVar: string; isFirst: boolean; isLast: boolean; needsWhoosh: boolean };
	const renderItems: RenderItem[] = hasSplits
		? effectiveSegments.map((seg, i) => ({
			slide: seg.slide,
			points: seg.points,
			segmentStart: seg.segmentStartSeconds,
			segmentDuration: seg.segmentDurationSeconds,
			slideVar: `seg${i}`,
			isFirst: i === 0,
			isLast: seg.isLastInModule,
			needsWhoosh: seg.isLastInGroup && !seg.isLastInModule,
		}))
		: module.slides.map((slide, i) => ({
			slide,
			points: slide.points || [],
			segmentStart: 0,
			segmentDuration: 0, // use slideVar.audioDuration at render
			slideVar: `${toValidIdentifier(slide.name)}Slide`,
			isFirst: i === 0,
			isLast: i === module.slides.length - 1,
			needsWhoosh: i < module.slides.length - 1,
		}));

	const sequences = renderItems.map((item) => {
		const { slide, points, segmentStart, segmentDuration, slideVar, isFirst, isLast, needsWhoosh } = item;

		let slideComponent = "";
		switch (slide.type) {
				case "title": {
					const titleAnimationProp = slide.animation ? `animation="${slide.animation}"` : "";
					const subtitleText = normalizeSubtitle(slide.subtitle || module.subtitle);
					slideComponent = `<TitleSlide 
\t\t\t\t\ttitle="${module.title}" 
\t\t\t\t\tsubtitle="${subtitleText.replace(/"/g, '\\"')}"
\t\t\t\t\t${titleAnimationProp}
\t\t\t\t/>`;
					break;
				}
			case "content-two-card": {
				const pointsStr = points.map((p) => `"${p.replace(/"/g, '\\"')}"`).join(",\n\t\t\t\t\t") || "";
				const animationPropTwoCard = slide.animation ? `animation="${slide.animation}"` : "";
				const imagePropTwoCard = !slide.animation && slide.imageSrc ? `imageSrc="${slide.imageSrc}"` : "";
				const slideTitle = normalizeConclusionTitle(slide.title, isLast).replace(/"/g, '\\"');
				const audioStartOffsetProp = hasSplits && segmentStart > 0 ? `\n\t\t\t\t\taudioStartOffset={${segmentStart.toFixed(2)}}` : "";
				slideComponent = `<AnimatedContentSlide
\t\t\t\t\ttitle="${slideTitle}"
\t\t\t\t\tpoints={[
\t\t\t\t\t\t${pointsStr}
\t\t\t\t\t]}
\t\t\t\t\tslideName="${slide.name}"
\t\t\t\t\taudioDuration={${slideVar}.audioDuration}
\t\t\t\t\tmoduleNumber={${module.moduleNumber}}
\t\t\t\t\t${animationPropTwoCard}
\t\t\t\t\t${imagePropTwoCard}${audioStartOffsetProp}
\t\t\t\t/>`;
				break;
			}
			case "content-single":
				const pointsSingleStr = points.map((p) => `"${p.replace(/"/g, '\\"')}"`).join(",\n\t\t\t\t\t") || "";
				const animationProp = slide.animation ? `animation="${slide.animation}"` : "";
				const imagePropSingle = !slide.animation && slide.imageSrc ? `imageSrc="${slide.imageSrc}"` : "";
				const audioStartOffsetPropSingle = hasSplits && segmentStart > 0 ? `\n\t\t\t\t\taudioStartOffset={${segmentStart.toFixed(2)}}` : "";
				slideComponent = `<AnimatedContentSlide
\t\t\t\t\ttitle="${slide.title?.replace(/"/g, '\\"') || ""}"
\t\t\t\t\tpoints={[
\t\t\t\t\t\t${pointsSingleStr}
\t\t\t\t\t]}
\t\t\t\t\tslideName="${slide.name}"
\t\t\t\t\taudioDuration={${slideVar}.audioDuration}
\t\t\t\t\tmoduleNumber={${module.moduleNumber}}
\t\t\t\t\t${animationProp}
\t\t\t\t\t${imagePropSingle}${audioStartOffsetPropSingle}
\t\t/>`;
				break;
			case "bullets-code": {
				const pointsBulletsCode = slide.points?.map((p) => `"${p.replace(/"/g, '\\"')}"`).join(",\n\t\t\t\t\t\t") || "";
				const codeBulletsCode = (slide.code ?? "").replace(/`/g, "\\`").replace(/\$/g, "\\$");
				const codeContextBullets = (slide.codeContext ?? "").replace(/"/g, '\\"');
				slideComponent = `<BulletsAndCodeSlide
\t\t\t\t\ttitle="${slide.title?.replace(/"/g, '\\"') || ""}"
\t\t\t\t\tpoints={[
\t\t\t\t\t\t${pointsBulletsCode}
\t\t\t\t\t]}
\t\t\t\t\tcode={\`${codeBulletsCode}\`}
\t\t\t\t\tlanguage="${slide.language || "python"}"
\t\t\t\t\tcodeContext="${codeContextBullets}"
\t\t\t\t\tslideName="${slide.name}"
\t\t\t\t\taudioDuration={${slideVar}.audioDuration}
\t\t\t\t\tmoduleNumber={${module.moduleNumber}}
\t\t\t\t/>`;
				break;
			}
				case "code": {
					const codeRaw = slide.code || getCodeFromContentJson(courseId, module.moduleNumber, slide.name);
					const code = (codeRaw ?? "").replace(/`/g, "\\`").replace(/\$/g, "\\$");
					const audioChunkDurationsProp = isMultiAudioCodeSlide(slide)
						? `\n\t\t\t\t\taudioChunkDurations={[${Array.from({ length: slide.scripts!.length }, (_, i) =>
							`audioDurations["${slide.name}-${i + 1}"]`).join(", ")}]}`
						: "";
					const visibleLineRangeProp = (slide as { visibleLineRange?: [number, number] }).visibleLineRange
						? `\n\t\t\t\t\tvisibleLineRange={[${(slide as { visibleLineRange: [number, number] }).visibleLineRange[0]}, ${(slide as { visibleLineRange: [number, number] }).visibleLineRange[1]}]}`
						: "";
					const codeContextProp = (slide as { codeContext?: string }).codeContext || (slide as { filePath?: string }).filePath
						? `\n\t\t\t\t\tcodeContext="${String((slide as { codeContext?: string }).codeContext || (slide as { filePath?: string }).filePath).replace(/"/g, '\\"')}"`
						: "";
					slideComponent = `<AnimatedCodeSlide
\t\t\t\t\ttitle="${slide.title?.replace(/"/g, '\\"') || ""}"
\t\t\t\t\tcode={\`${code}\`}
\t\t\t\t\tlanguage="${slide.language || "typescript"}"
\t\t\t\t\tslideName="${slide.name}"
\t\t\t\t\taudioStartFrame={${slideVar}.start}
\t\t\t\t\taudioDuration={${slideVar}.audioDuration}
\t\t\t\t\tmoduleNumber={${module.moduleNumber}}${audioChunkDurationsProp}${visibleLineRangeProp}${codeContextProp}
\t\t\t\t/>`;
				break;
				}
			case "code-diagram": {
					const codeDiagramRaw = slide.code || getCodeFromContentJson(courseId, module.moduleNumber, slide.name);
					const codeDiagram = (codeDiagramRaw ?? "").replace(/`/g, "\\`").replace(/\$/g, "\\$");
					// Serialize the scene object - need to handle it as a JSON string
					let sceneCode = "null";
					if (slide.scene) {
						try {
							const sceneStr = JSON.stringify(slide.scene);
							// Escape for template literal
							const escaped = sceneStr.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$/g, "\\$");
							sceneCode = `JSON.parse(\`${escaped}\`)`;
						} catch (e) {
							console.warn(`Failed to serialize scene for slide ${slide.name}:`, e);
							sceneCode = "null";
						}
					}
					// Fallback to AnimatedCodeSlide when no scene (planner often outputs code-diagram without scene)
					if (sceneCode === "null") {
						const visibleLineRangeProp = (slide as { visibleLineRange?: [number, number] }).visibleLineRange
							? `\n\t\t\t\t\tvisibleLineRange={[${(slide as { visibleLineRange: [number, number] }).visibleLineRange[0]}, ${(slide as { visibleLineRange: [number, number] }).visibleLineRange[1]}]}`
							: "";
						const codeContextProp = (slide as { codeContext?: string }).codeContext || (slide as { filePath?: string }).filePath
							? `\n\t\t\t\t\tcodeContext="${String((slide as { codeContext?: string }).codeContext || (slide as { filePath?: string }).filePath).replace(/"/g, '\\"')}"`
							: "";
						slideComponent = `<AnimatedCodeSlide
\t\t\t\t\ttitle="${slide.title?.replace(/"/g, '\\"') || ""}"
\t\t\t\t\tcode={\`${codeDiagram}\`}
\t\t\t\t\tlanguage="${slide.language || "typescript"}"
\t\t\t\t\tslideName="${slide.name}"
\t\t\t\t\taudioStartFrame={${slideVar}.start}
\t\t\t\t\taudioDuration={${slideVar}.audioDuration}
\t\t\t\t\tmoduleNumber={${module.moduleNumber}}${visibleLineRangeProp}${codeContextProp}
\t\t\t\t/>`;
					} else {
						slideComponent = `<CodeAndDiagram
\t\t\t\t\ttitle="${slide.title?.replace(/"/g, '\\"') || ""}"
\t\t\t\t\tcode={\`${codeDiagram}\`}
\t\t\t\t\tlanguage="${slide.language || "typescript"}"
\t\t\t\t\tslideName="${slide.name}"
\t\t\t\tscene={${sceneCode} as any}
\t\t\t\tmoduleNumber={${module.moduleNumber}}
\t/>`;
					}
					break;
				}
			case "comparison":
				const leftItems = slide.leftItems?.map((i) => `"${i.replace(/"/g, '\\"')}"`).join(",\n\t\t\t\t\t\t") || "";
				const rightItems = slide.rightItems?.map((i) => `"${i.replace(/"/g, '\\"')}"`).join(",\n\t\t\t\t\t\t") || "";
				slideComponent = `<AnimatedComparisonSlide
\t\t\t\t\ttitle="${slide.title?.replace(/"/g, '\\"') || ""}"
\t\t\t\t\tleftTitle="${slide.leftTitle?.replace(/"/g, '\\"') || ""}"
\t\t\t\t\tleftItems={[
\t\t\t\t\t\t${leftItems}
\t\t\t\t\t]}
\t\t\t\t\trightTitle="${slide.rightTitle?.replace(/"/g, '\\"') || ""}"
\t\t\t\t\trightItems={[
\t\t\t\t\t\t${rightItems}
\t\t\t\t\t]}
\t\t\t\t\tslideName="${slide.name}"
\t\t\t\t/>`;
				break;
			case "sequential-bullet":
				const pointsSeq = slide.points?.map((p) => `"${p.replace(/"/g, '\\"')}"`).join(",\n\t\t\t\t\t\t") || "";
				const svgProp = slide.svgPath ? `svgPath="${slide.svgPath}"` : "";
				slideComponent = `<SequentialBulletSlide
\t\t\t\t\ttitle="${slide.title?.replace(/"/g, '\\"') || ""}"
\t\t\t\t\tpoints={[
\t\t\t\t\t\t${pointsSeq}
\t\t\t\t\t]}
\t\t\t\t\tslideName="${slide.name}"
\t\t\t\t\tmoduleNumber={${module.moduleNumber}}
\t\t\t\t\t${svgProp}
\t\t\t\t/>`;
				break;
			case "story-beat": {
				const pointsStoryBeat = points.map((p) => `"${p.replace(/"/g, '\\"')}"`).join(",\n\t\t\t\t\t") || "";
				const animationPropStoryBeat = slide.animation ? `animation="${slide.animation}"` : "";
				const imagePropStoryBeat = !slide.animation && slide.imageSrc ? `imageSrc="${slide.imageSrc}"` : "";
				const audioStartOffsetPropStoryBeat = hasSplits && segmentStart > 0 ? `\n\t\t\t\t\taudioStartOffset={${segmentStart.toFixed(2)}}` : "";
				slideComponent = `<AnimatedContentSlide
\t\t\t\t\ttitle="${slide.title?.replace(/"/g, '\\"') || ""}"
\t\t\t\t\tpoints={[
\t\t\t\t\t\t${pointsStoryBeat}
\t\t\t\t\t]}
\t\t\t\t\tslideName="${slide.name}"
\t\t\t\t\taudioDuration={${slideVar}.audioDuration}
\t\t\t\t\tmoduleNumber={${module.moduleNumber}}
\t\t\t\t\t${animationPropStoryBeat}
\t\t\t\t\t${imagePropStoryBeat}${audioStartOffsetPropStoryBeat}
\t\t\t\t/>`;
				break;
			}
			}

			const fadeOut = isLast ? "fadeOutDuration={0}" : `fadeOutDuration={crossFadeDuration}`;
			const fadeIn = isFirst ? "fadeInDuration={0.5}" : `fadeInDuration={crossFadeDuration}`;
			const durationProp = `durationInFrames={${slideVar}.duration}`;
			const totalDurationProp = `totalDuration={${slideVar}.slideDuration}`;

			const audioElements = isMultiAudioCodeSlide(slide)
				? Array.from({ length: slide.scripts!.length }, (_, i) => {
						const key = `${slide.name}-${i + 1}`;
						const qk = quotePropertyName(key);
						const fromFrames = i === 0
							? "0"
							: `Math.round((${Array.from({ length: i }, (_, j) => `audioDurations["${slide.name}-${j + 1}"]`).join(" + ")}) * fps)`;
						return `\t\t\t\t<Sequence from={${fromFrames}}><Audio src={audioFiles[${qk}]} /></Sequence>`;
					}).join("\n")
				: (hasSplits && segmentStart > 0
					? `\t\t\t\t<Audio src={audioFiles["${slide.name}"]} startFrom={Math.round(${segmentStart.toFixed(2)} * fps)} />`
					: `\t\t\t\t<Audio src={audioFiles["${slide.name}"]} />`);

			return `\t\t\t{/* ${slide.title || slide.name} */}
\t\t\t<Sequence
\t\t\t\tfrom={${slideVar}.start}
\t\t\t\t${durationProp}
\t\t\t>
${audioElements}
\t\t\t\t<CrossFadeWrapper
\t\t\t\t\t${totalDurationProp}
\t\t\t\t\t${fadeIn}
\t\t\t\t\t${fadeOut}
\t\t\t>
\t\t\t\t\t${slideComponent}
\t\t\t\t</CrossFadeWrapper>
\t\t\t</Sequence>
${needsWhoosh ? `\t\t\t{/* Whoosh transition */}
\t\t\t<Sequence
\t\t\t\tfrom={${slideVar}.start + ${slideVar}.duration}
\t\t\t\tdurationInFrames={whooshDuration * fps}
\t\t\t>
\t\t\t\t<Audio src={audioFiles.whoosh} startFrom={0} />
\t\t\t</Sequence>
` : ""}`;
	})
	.join("\n");

	const imports = [
		'import React from "react";',
		'import { Sequence, useVideoConfig, Audio, staticFile } from "remotion";',
		'import { TitleSlide } from "../components/TitleSlide";',
		'import { AnimatedContentSlide } from "../components/AnimatedContentSlide";',
		'import { AnimatedCodeSlide } from "../components/AnimatedCodeSlide";',
		'import { BulletsAndCodeSlide } from "../components/BulletsAndCodeSlide";',
		'import { AnimatedComparisonSlide } from "../components/AnimatedComparisonSlide";',
		'import { SequentialBulletSlide } from "../components/SequentialBulletSlide";',
		'import { CodeAndDiagram } from "../compositions/CodeAndDiagram";',
		'import { CrossFadeWrapper } from "../components/CrossFadeWrapper";',
	];
	if (!isShort && !previewMode) {
		imports.push('import { getAudioDuration } from "../utils/audioDuration";');
	}

	return `${imports.join('\n')}

// Auto-generated from moduleContent.ts - DO NOT EDIT MANUALLY
${isShort ? '// SHORT VIDEO - Portrait format, 5-second slides' : ''}
export const Module${module.moduleNumber}: React.FC = () => {
\tconst { fps } = useVideoConfig();
\tconst crossFadeDuration = 0.3;
\tconst whooshDuration = 0.57;

\tconst audioFiles = {
${audioFiles}
\t\twhoosh: staticFile("audio/whoosh.wav"),
\t};
${isShort ? '' : `
\tconst audioDurations = {
${audioDurations}
\t};

\tlet currentFrame = 0;

\tconst addSlide = (audioDuration: number, isLast: boolean = false, buffer: number = 0) => {
\t\tconst slideDuration = audioDuration + buffer;
\t\tconst start = currentFrame;
\t\tif (!isLast) {
\t\t\tcurrentFrame += (slideDuration + whooshDuration) * fps;
\t\t} else {
\t\t\tcurrentFrame += slideDuration * fps;
\t\t}
\t\treturn { start, duration: slideDuration * fps, slideDuration, audioDuration, buffer };
\t};${hasSplits ? `
\tconst addSegment = (audioDuration: number, isLastInGroup: boolean, isLastInModule: boolean, buffer: number) => {
\t\tconst slideDuration = audioDuration + buffer;
\t\tconst start = currentFrame;
\t\tcurrentFrame += slideDuration * fps + (isLastInGroup && !isLastInModule ? whooshDuration * fps : 0);
\t\treturn { start, duration: slideDuration * fps, slideDuration, audioDuration, buffer };
\t};` : ""}`}

${slideTimings}

\treturn (
\t\t<div
\t\t\tstyle={{
\t\t\t\twidth: "100%",
\t\t\theight: "100%",
\t\t\tbackground: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
\t\t\tposition: "relative",
\t\t}}
\t\t>
${sequences}
\t\t</div>
\t);
};
`;
}

function updateRootFile(modules: ModuleContent[]): void {
	const rootPath = path.join(__dirname, "../src/Root.tsx");
	const courseIds = [...new Set(modules.map((m) => m.courseId))];
	const singleCourse = courseIds.length === 1 ? courseIds[0] : null;

	const compositions = modules
		.map((m) => {
			const compId =
				singleCourse && m.courseId === singleCourse
					? `module-${m.moduleNumber}`
					: `module-${m.courseId}-${m.moduleNumber}`;
			return `\t\t\t<Composition
\t\t\t\tkey="${compId}"
\t\t\t\tid="${compId}"
\t\t\t\tcomponent={GenericModule}
\t\t\t\tdefaultProps={{ courseId: "${m.courseId}", moduleNumber: ${m.moduleNumber} }}
\t\t\t\tdurationInFrames={secondsToFrames(getModuleConfig("${m.courseId}", ${m.moduleNumber}).totalDuration, getModuleConfig("${m.courseId}", ${m.moduleNumber}).fps)}
\t\t\t\tfps={getModuleConfig("${m.courseId}", ${m.moduleNumber}).fps}
\t\t\t\twidth={getModuleConfig("${m.courseId}", ${m.moduleNumber}).width}
\t\t\t\theight={getModuleConfig("${m.courseId}", ${m.moduleNumber}).height}
\t\t\t/>`;
		})
		.join("\n");

	const newRoot = `import React from "react";
import { Composition, Still } from "remotion";
import { GenericModule } from "./videos/GenericModule";
import { ThumbnailStill } from "./compositions/ThumbnailStill";
import { getModuleConfig } from "./videos/GenericModuleConfig";
import { allModules } from "./videos/moduleContent";
import { secondsToFrames } from "./utils/calculateDuration";

// Content-driven: GenericModule compositions from moduleContent.ts
export const RemotionRoot: React.FC = () => {
\treturn (
\t\t<>
${compositions}
\t\t\t<Still
\t\t\t\tid="thumbnail"
\t\t\t\tcomponent={ThumbnailStill}
\t\t\t\twidth={1280}
\t\t\t\theight={720}
\t\t\t\tdefaultProps={{ thumbnailText: "THUMBNAIL" }}
\t\t\t/>
\t\t</>
\t);
};
`;

	fs.writeFileSync(rootPath, newRoot);
}

function parseModuleRange(input: string): number[] {
	// Parse "1", "1-5", "1,3,5", or "all"
	if (input === "all" || !input) {
		return allModules.map((m) => m.moduleNumber);
	}

	const modules: number[] = [];
	const parts = input.split(",");

	for (const part of parts) {
		const trimmed = part.trim();
		if (trimmed.includes("-")) {
			// Range like "1-5"
			const [start, end] = trimmed.split("-").map((n) => parseInt(n.trim()));
			if (isNaN(start) || isNaN(end)) {
				throw new Error(`Invalid range: ${trimmed}`);
			}
			for (let i = start; i <= end; i++) {
				modules.push(i);
			}
		} else {
			// Single number
			const num = parseInt(trimmed);
			if (isNaN(num)) {
				throw new Error(`Invalid module number: ${trimmed}`);
			}
			modules.push(num);
		}
	}

	return [...new Set(modules)].sort((a, b) => a - b);
}

function main() {
	const args = process.argv.slice(2);
	const previewMode = args.includes("--preview");
	const bulletsOnly = args.includes("--bullets-only");
	const skipRoot = args.includes("--skip-root");
	const moduleInput = args.find((a) => !a.startsWith("--")) || "all";

	const activeCourseId = allModules[0]?.courseId;
	if (
		activeCourseId &&
		courseUsesSceneVisuals(activeCourseId) &&
		!bulletsOnly &&
		!process.env.ALLOW_GENERIC_MODULE_FOR_SCENES
	) {
		console.error(
			`Refusing generateModulesFromContent for scene course "${activeCourseId}". ` +
				`Use: npx tsx scripts/generateModulesFromScenes.ts ${activeCourseId} 1-12 ` +
				`or: npx tsx scripts/activateCourse.ts ${activeCourseId}`
		);
		process.exit(1);
	}

	console.log(
		"Generating modules from content" +
			(previewMode ? " (PREVIEW - fixed durations, no audio needed)" : "") +
			(bulletsOnly ? " (BULLETS ONLY - no Mermaid diagrams)" : "") +
			"\n"
	);

	let modulesToGenerate: number[];
	try {
		modulesToGenerate = parseModuleRange(moduleInput);
	} catch (error: any) {
		console.error(`❌ Error: ${error.message}`);
		console.error("\nUsage:");
		console.error("  tsx scripts/generateModulesFromContent.ts [module-range] [--preview]");
		console.error("\n  --preview: Use fixed 15s per slide (no audio needed). View segments in Remotion before generating audio.");
		console.error("\nExamples:");
		console.error("  tsx scripts/generateModulesFromContent.ts 1        # Module 1 only");
		console.error("  tsx scripts/generateModulesFromContent.ts 1-3     # Modules 1, 2, 3");
		console.error("  tsx scripts/generateModulesFromContent.ts all --preview  # Preview all (no audio)");
		process.exit(1);
	}

	const modulesToProcess = allModules.filter((m) => modulesToGenerate.includes(m.moduleNumber));

	if (modulesToProcess.length === 0) {
		console.error(`❌ No modules found for: ${moduleInput}`);
		console.error(`   Available modules: ${allModules.map((m) => m.moduleNumber).join(", ")}`);
		process.exit(1);
	}

	console.log(`Generating modules: ${modulesToGenerate.join(", ")}\n`);

	for (const module of modulesToProcess) {
		console.log(`Generating Module ${module.moduleNumber}: ${module.title}`);
		console.log(`  ${module.slides.length} slides`);

		// Generate config
		const configPath = path.join(__dirname, `../src/videos/Module${module.moduleNumber}Config.ts`);
		fs.writeFileSync(configPath, generateModuleConfig(module, previewMode));
		console.log(`  ✓ Module${module.moduleNumber}Config.ts`);

		// Generate module file (skip if PRESERVE_MANUAL_EDITS)
		const modulePath = path.join(__dirname, `../src/videos/Module${module.moduleNumber}.tsx`);
		const existingModule = fs.existsSync(modulePath) ? fs.readFileSync(modulePath, "utf-8") : "";
		if (existingModule && /\/\/\s*PRESERVE_MANUAL_EDITS/i.test(existingModule)) {
			console.log(`  Skipped Module${module.moduleNumber}.tsx (PRESERVE_MANUAL_EDITS)`);
		} else {
			fs.writeFileSync(modulePath, generateModuleFile(module, previewMode, bulletsOnly));
			console.log(`  ✓ Module${module.moduleNumber}.tsx`);
		}
	}

	if (!skipRoot) {
		console.log("\nUpdating Root.tsx...");
		updateRootFile(allModules);
		console.log("  ✓ Root.tsx updated");
	}

	console.log(`\n✅ Modules ${modulesToGenerate.join(", ")} generated!`);
	if (previewMode) {
		console.log("\nPreview mode: Open Remotion Studio to view segments (npm start)");
		console.log("  Then run without --preview after generating audio for real durations");
	} else {
		console.log("\nNext steps:");
		console.log(`  Generate audio: npm run generate-audio [module-range]`);
		console.log(`  Measure durations: npm run measure-actual-audio`);
		console.log(`  Extract timings: npm run extract-timings-curl (optional)`);
	}
}

main();
