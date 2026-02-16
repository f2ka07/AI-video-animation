// Mermaid slide with time-synced segments - figures flow with narration
// Each segment has its own mermaidSource; diagram switches at segment boundaries

import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, AbsoluteFill } from "remotion";
import { MermaidSlide } from "./MermaidSlide";

export interface MermaidSegmentDef {
	mermaidSource: string;
	startSeconds: number;
	endSeconds: number;
}

interface SegmentedMermaidSlideProps {
	title: string;
	segments: MermaidSegmentDef[];
	slideName: string;
	audioDuration: number;
	moduleNumber: number;
}

const FADE_DURATION_SEC = 0.3;

export const SegmentedMermaidSlide: React.FC<SegmentedMermaidSlideProps> = ({
	title,
	segments,
	slideName,
	audioDuration,
	moduleNumber,
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const currentTimeSeconds = frame / fps;

	const segmentIndex = segments.findIndex(
		(s) => currentTimeSeconds >= s.startSeconds && currentTimeSeconds < s.endSeconds
	);
	const idx = segmentIndex >= 0 ? segmentIndex : segments.length - 1;
	const activeSegment = segments[idx];
	const mermaidSource = activeSegment?.mermaidSource;

	const fadeInFrames = FADE_DURATION_SEC * fps;
	const segmentStartFrame = activeSegment ? activeSegment.startSeconds * fps : 0;
	const opacity = interpolate(
		frame,
		[segmentStartFrame, segmentStartFrame + fadeInFrames],
		[0, 1],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp" }
	);

	if (!mermaidSource || !mermaidSource.trim()) {
		return (
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					background: "#0f172a",
					color: "#94a3b8",
					fontFamily: "system-ui",
				}}
			>
				No diagram for this segment
			</div>
		);
	}

	return (
		<AbsoluteFill style={{ opacity }}>
			<MermaidSlide
				title={title}
				mermaidSource={mermaidSource}
				slideName={`${slideName}-seg-${idx}`}
				audioDuration={audioDuration}
				moduleNumber={moduleNumber}
			/>
		</AbsoluteFill>
	);
};
