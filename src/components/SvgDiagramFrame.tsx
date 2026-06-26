import React from "react";
import { interpolate, staticFile } from "remotion";
import { premiumTheme } from "../theme/premiumTheme";
import { AnimatedSvgDiagram } from "./AnimatedSvgDiagram";

interface SvgDiagramFrameProps {
	imageSrc: string;
	entranceProgress?: number;
	audioDuration?: number;
	flex?: string;
	minWidth?: number;
	style?: React.CSSProperties;
}

/** Right-panel diagram — phased SVG when .animation.json exists, static img otherwise. */
export const SvgDiagramFrame: React.FC<SvgDiagramFrameProps> = (props) => {
	const { imageSrc, entranceProgress = 1, flex = "1 1 56%", minWidth = 580, style } = props;
	const isSvg = imageSrc.toLowerCase().endsWith(".svg");

	if (isSvg) {
		return <AnimatedSvgDiagram {...props} />;
	}

	const translateX = interpolate(entranceProgress, [0, 1], [32, 0]);
	const scale = interpolate(entranceProgress, [0, 1], [0.97, 1]);

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
			<img
				src={staticFile(imageSrc)}
				alt=""
				style={{
					width: "100%",
					height: "100%",
					maxHeight: "100%",
					objectFit: "contain",
					padding: premiumTheme.spacing.svgPadding,
				}}
			/>
		</div>
	);
};
