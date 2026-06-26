// Inline SVG diagram with phased group reveal synced to slide audio

import React, { useEffect, useMemo, useState } from "react";
import { continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { prepareSvgForRemotion } from "../utils/prepareSvgForRemotion";
import { premiumTheme } from "../theme/premiumTheme";

interface AnimationPhase {
	start: number;
	end: number;
	show: string[];
	dim: string[];
	highlight: string[];
}

interface AnimationSpec {
	diagram: string;
	phases: AnimationPhase[];
}

interface AnimatedSvgDiagramProps {
	imageSrc: string;
	entranceProgress?: number;
	audioDuration?: number;
	flex?: string;
	minWidth?: number;
	style?: React.CSSProperties;
}

function collectControlledIds(spec: AnimationSpec | null): Set<string> {
	const ids = new Set<string>();
	if (!spec?.phases?.length) return ids;
	for (const phase of spec.phases) {
		for (const id of [...phase.show, ...phase.dim, ...phase.highlight]) {
			ids.add(id);
		}
	}
	return ids;
}

function pickPhase(phases: AnimationPhase[], t: number): AnimationPhase {
	if (phases.length === 0) {
		return { start: 0, end: 1, show: ["viz-main"], dim: [], highlight: [] };
	}
	const match = [...phases].reverse().find((p) => t >= p.start);
	return match ?? phases[0];
}

/** Only phase-target groups are hidden/dimmed — never decorative child ids (d1, d2, ...). */
function applyPhaseToSvg(svg: string, phase: AnimationPhase, controlledIds: Set<string>): string {
	if (controlledIds.size === 0) return svg;

	const show = new Set(phase.show);
	const dim = new Set(phase.dim);
	const highlight = new Set(phase.highlight);

	return svg.replace(/<(\w+)\s+id="([^"]+)"([^>]*)>/g, (full, tag: string, id: string, rest: string) => {
		if (!controlledIds.has(id)) return full;

		if (!show.has(id)) {
			return `<${tag} id="${id}"${rest} style="opacity:0">`;
		}
		if (highlight.has(id)) {
			return `<${tag} id="${id}"${rest} style="opacity:1">`;
		}
		if (dim.has(id)) {
			return `<${tag} id="${id}"${rest} style="opacity:0.4">`;
		}
		return `<${tag} id="${id}"${rest} style="opacity:1">`;
	});
}

export const AnimatedSvgDiagram: React.FC<AnimatedSvgDiagramProps> = ({
	imageSrc,
	entranceProgress = 1,
	audioDuration,
	flex = "1 1 56%",
	minWidth = 580,
	style,
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const [svgMarkup, setSvgMarkup] = useState<string | null>(null);
	const [spec, setSpec] = useState<AnimationSpec | null>(null);
	const [loadError, setLoadError] = useState(false);

	const animSrc = imageSrc.replace(/\.svg$/i, ".animation.json");

	useEffect(() => {
		const handle = delayRender(`Loading diagram ${imageSrc}`);
		let cancelled = false;

		(async () => {
			try {
				const [svgRes, animRes] = await Promise.all([
					fetch(staticFile(imageSrc)),
					fetch(staticFile(animSrc)),
				]);
				if (!svgRes.ok) throw new Error(`SVG ${svgRes.status}`);
				const rawSvg = prepareSvgForRemotion(await svgRes.text());
				if (!cancelled) setSvgMarkup(rawSvg);

				if (animRes.ok) {
					const json = (await animRes.json()) as AnimationSpec;
					if (!cancelled) setSpec(json);
				}
			} catch {
				if (!cancelled) setLoadError(true);
			} finally {
				if (!cancelled) continueRender(handle);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, [imageSrc, animSrc]);

	const controlledIds = useMemo(() => collectControlledIds(spec), [spec]);

	const currentTime = frame / fps;
	const phase = useMemo(() => {
		if (!spec?.phases?.length) {
			return { start: 0, end: 1, show: ["viz-main"], dim: [], highlight: [] };
		}
		const lastEnd = spec.phases[spec.phases.length - 1]?.end ?? 12;
		const scale = audioDuration && audioDuration > 0 ? audioDuration / lastEnd : 1;
		return pickPhase(spec.phases, currentTime / scale);
	}, [spec, currentTime, audioDuration]);

	const renderedSvg = useMemo(() => {
		if (!svgMarkup) return null;
		if (controlledIds.size === 0) return svgMarkup;
		return applyPhaseToSvg(svgMarkup, phase, controlledIds);
	}, [svgMarkup, phase, controlledIds]);

	const translateX = (1 - entranceProgress) * 32;
	const scale = 0.97 + entranceProgress * 0.03;

	if (loadError) {
		return (
			<div
				style={{
					flex,
					minWidth,
					alignSelf: "stretch",
					borderRadius: premiumTheme.radius.svgFrame,
					overflow: "hidden",
					opacity: entranceProgress,
					transform: `translateX(${translateX}px) scale(${scale})`,
					boxShadow: premiumTheme.shadow.svgFrame,
					background: premiumTheme.gradients.svgPanel,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					...style,
				}}
			>
				<img
					src={staticFile(imageSrc)}
					alt=""
					style={{
						width: "100%",
						height: "100%",
						objectFit: "contain",
						padding: premiumTheme.spacing.svgPadding,
					}}
				/>
			</div>
		);
	}

	if (!renderedSvg) {
		return (
			<div
				style={{
					flex,
					minWidth,
					alignSelf: "stretch",
					borderRadius: premiumTheme.radius.svgFrame,
					background: premiumTheme.gradients.svgPanel,
					opacity: entranceProgress * 0.3,
					...style,
				}}
			/>
		);
	}

	return (
		<div
			style={{
				flex,
				minWidth,
				alignSelf: "stretch",
				position: "relative",
				borderRadius: premiumTheme.radius.svgFrame,
				overflow: "hidden",
				opacity: entranceProgress,
				transform: `translateX(${translateX}px) scale(${scale})`,
				boxShadow: premiumTheme.shadow.svgFrame,
				background: premiumTheme.gradients.svgPanel,
				borderTop: `1px solid rgba(59, 130, 246, ${0.35 * entranceProgress})`,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				...style,
			}}
		>
			<div
				style={{
					width: "100%",
					height: "100%",
					padding: premiumTheme.spacing.svgPadding,
					boxSizing: "border-box",
				}}
				dangerouslySetInnerHTML={{ __html: renderedSvg }}
			/>
		</div>
	);
};
