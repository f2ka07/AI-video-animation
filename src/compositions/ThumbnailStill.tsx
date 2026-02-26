// YouTube thumbnail still - Tech Education Blueprint: max 3 words, one concept, no diagrams
// Renders big bold text on high-contrast background for CTR

import React from "react";
import { AbsoluteFill } from "remotion";

const YOUTUBE_THUMB_WIDTH = 1280;
const YOUTUBE_THUMB_HEIGHT = 720;

interface ThumbnailStillProps {
	thumbnailText: string;
}

export const ThumbnailStill: React.FC<ThumbnailStillProps> = ({ thumbnailText }) => {
	const text = (thumbnailText || "THUMBNAIL").toUpperCase().trim();
	const words = text.split(/\s+/).slice(0, 3).join(" ");

	return (
		<AbsoluteFill
			style={{
				background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
				justifyContent: "center",
				alignItems: "center",
				padding: 48,
			}}
		>
			<div
				style={{
					fontFamily: "system-ui, -apple-system, sans-serif",
					fontSize: Math.min(140, Math.floor((YOUTUBE_THUMB_WIDTH * 0.8) / (words.length * 0.6))),
					fontWeight: 800,
					color: "#ffffff",
					textAlign: "center",
					lineHeight: 1.1,
					textShadow: "0 4px 24px rgba(0,0,0,0.5)",
					letterSpacing: "0.02em",
				}}
			>
				{words}
			</div>
		</AbsoluteFill>
	);
};
