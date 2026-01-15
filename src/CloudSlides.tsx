import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const CloudSlides: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	// fade in title over first 1 second
	const titleOpacity = interpolate(frame, [0, fps], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	// fade in subtitle between second 1 and 2
	const subtitleOpacity = interpolate(frame, [fps, fps * 2], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<div
			style={{
				flex: 1,
				backgroundColor: "#020617",
				color: "white",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
			}}
		>
			<h1
				style={{
					fontSize: 72,
					margin: 0,
					opacity: titleOpacity,
				}}
			>
				Skilleo – Cloud Skills Boost
			</h1>

			<p
				style={{
					fontSize: 32,
					marginTop: 24,
					opacity: subtitleOpacity,
				}}
			>
				AWS Solutions Architect capstone overview
			</p>
		</div>
	);
};
