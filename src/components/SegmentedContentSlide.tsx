// Wrapper that shows cumulative bullet points at split boundaries.
// Bullets accumulate: each segment adds its points; previous bullets stay visible.
// Audio plays continuously (no cuts). Content fades in once at slide start.

import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, AbsoluteFill } from "remotion";
import { AnimatedContentSlide } from "./AnimatedContentSlide";

export interface PhraseTime {
	start: number;
	end: number;
}

export interface SegmentDef {
	points: string[];
	keyWords?: string[][];
	phraseTimes?: PhraseTime[];
	startSeconds: number;
	endSeconds: number;
}

interface SegmentedContentSlideProps {
	title: string;
	segments: SegmentDef[];
	slideName: string;
	audioDuration: number;
	moduleNumber: number;
	animation?: "git-machine" | "none";
	imageSrc?: string;
	fallbackPointsFromSlide?: string[];
}

const SEGMENT_TRANSITION_SEC = 0.4;
const MAX_VISIBLE_BULLETS = 3;

export const SegmentedContentSlide: React.FC<SegmentedContentSlideProps> = ({
	title,
	segments,
	slideName,
	audioDuration,
	moduleNumber,
	animation,
	imageSrc,
	fallbackPointsFromSlide,
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const currentTimeSeconds = frame / fps;

	const segmentIndex = segments.findIndex(
		(s) => currentTimeSeconds >= s.startSeconds && currentTimeSeconds < s.endSeconds
	);
	const idx = segmentIndex >= 0 ? segmentIndex : segments.length - 1;
	const fallbackPoints =
		segments.find((s) => s.points.length > 0)?.points ??
		(fallbackPointsFromSlide && fallbackPointsFromSlide.length > 0 ? fallbackPointsFromSlide : []);
	const pointsAndMeta = segments
		.slice(0, idx + 1)
		.flatMap((s) =>
			s.points.length > 0
				? s.points.map((p, i) => ({
						point: p,
						keyWords: s.keyWords?.[i] ?? [],
						phraseTime: s.phraseTimes?.[i],
				  }))
				: []
		)
		.filter((x) => x.point && x.point.trim().length > 0);
	const allPoints = pointsAndMeta.length > 0 ? pointsAndMeta.map((x) => x.point) : fallbackPoints;
	const allKeyWords =
		pointsAndMeta.length > 0 ? pointsAndMeta.map((x) => x.keyWords) : [];
	const toSlice =
		pointsAndMeta.length > MAX_VISIBLE_BULLETS
			? pointsAndMeta.slice(-MAX_VISIBLE_BULLETS)
			: pointsAndMeta;
	const effectivePoints = toSlice.length > 0 ? toSlice.map((x) => x.point) : allPoints;
	const effectiveKeyWords = toSlice.length > 0 ? toSlice.map((x) => x.keyWords) : allKeyWords;
	const effectivePhraseTimes = toSlice.length > 0 ? toSlice.map((x) => x.phraseTime) : [];

	const fadeInEnd = SEGMENT_TRANSITION_SEC * fps;
	const opacity = interpolate(frame, [0, fadeInEnd], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<AbsoluteFill style={{ opacity }}>
			<AnimatedContentSlide
				title={title}
				points={effectivePoints}
				keyWords={effectiveKeyWords.length === effectivePoints.length ? effectiveKeyWords : undefined}
				phraseTimes={effectivePhraseTimes.length === effectivePoints.length ? effectivePhraseTimes : undefined}
				slideName={slideName}
				audioDuration={audioDuration}
				moduleNumber={moduleNumber}
				animation={animation}
				imageSrc={imageSrc}
			/>
		</AbsoluteFill>
	);
};
