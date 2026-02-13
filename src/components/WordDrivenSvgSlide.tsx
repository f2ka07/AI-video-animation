// Word-Driven SVG Slide - Animates SVG elements based on narration word timings
// This is the improved version that synchronizes perfectly with audio

import React, { useMemo } from "react";
import {
	useCurrentFrame,
	useVideoConfig,
	staticFile,
	interpolate,
	spring,
	Easing,
} from "remotion";
import { useModuleTimings } from "../hooks/useModuleTimings";
import {
	getSvgMappings,
	getActiveElementsAtTime,
	SvgElementMapping,
} from "../utils/svgElementMappings";

interface WordDrivenSvgSlideProps {
	title: string;
	points: string[];
	svgPath: string; // Path to SVG file
	diagramName: string; // Key for svgElementMappings (e.g., "agentic-architecture-high-level")
	slideName: string;
	moduleNumber?: number;
	audioDuration?: number;
}

export const WordDrivenSvgSlide: React.FC<WordDrivenSvgSlideProps> = ({
	title,
	points,
	svgPath,
	diagramName,
	slideName,
	moduleNumber = 1,
	audioDuration,
}) => {
	const frame = useCurrentFrame();
	const { fps, width, height } = useVideoConfig();
	const { timings } = useModuleTimings(moduleNumber);

	// Get word timings for this slide
	const slideTimings = timings?.slides[slideName];
	const words = slideTimings?.words || [];

	// Get SVG element mappings
	const mappings = useMemo(() => getSvgMappings(diagramName), [diagramName]);

	// Calculate current time
	const currentTimeSeconds = frame / fps;

	// Get active elements based on word timings
	const activeState = useMemo(() => {
		return getActiveElementsAtTime(currentTimeSeconds, words, mappings);
	}, [currentTimeSeconds, words, mappings]);

	// Load SVG content (in production, this should be pre-loaded)
	const [svgContent, setSvgContent] = React.useState<string | null>(null);

	React.useEffect(() => {
		const loadSvg = async () => {
			try {
				const response = await fetch(staticFile(svgPath));
				if (response.ok) {
					const text = await response.text();
					setSvgContent(text);
				}
			} catch (error) {
				console.warn(`Failed to load SVG: ${svgPath}`, error);
			}
		};
		loadSvg();
	}, [svgPath]);

	// Process SVG to apply animations
	const processedSvg = useMemo(() => {
		if (!svgContent || !mappings.length) return svgContent;

		let processed = svgContent;

		// Process each mapped element
		for (const mapping of mappings) {
			const elementId = mapping.elementId;
			const regex = new RegExp(
				`<g\\s+([^>]*id=["']${elementId}["'][^>]*)>`,
				"gi"
			);

			processed = processed.replace(regex, (match, attributes) => {
				const animation = getElementAnimation(
					mapping,
					currentTimeSeconds,
					words,
					activeState,
					fps
				);

				// Remove existing style/opacity attributes
				let newAttributes = attributes
					.replace(/style=["'][^"']*["']/gi, "")
					.replace(/opacity=["'][^"']*["']/gi, "");

				// Build new style
				const styles: string[] = [];

				if (animation.opacity !== undefined) {
					styles.push(`opacity: ${animation.opacity.toFixed(3)}`);
				}

				if (animation.filter) {
					styles.push(`filter: ${animation.filter}`);
				}

				if (animation.transform) {
					styles.push(`transform: ${animation.transform}`);
				}

				if (styles.length > 0) {
					newAttributes += ` style="${styles.join("; ")}"`;
				}

				return `<g ${newAttributes}>`;
			});
		}

		return processed;
	}, [svgContent, mappings, currentTimeSeconds, words, activeState]);

	// Animations for title and points (similar to SvgContentSlide but word-synced)
	const titleSpring = spring({
		frame,
		fps,
		config: { damping: 12, stiffness: 100 },
		durationInFrames: fps * 0.6,
	});

	const getPointSpring = (index: number) => {
		const staggerDelay = fps * 0.15;
		const baseDelay = fps * 0.4;
		return spring({
			frame,
			fps,
			config: { damping: 14, stiffness: 90 },
			delay: baseDelay + index * staggerDelay,
			durationInFrames: fps * 0.5,
		});
	};

	// Get point highlight based on word timings (improved version)
	const getPointHighlight = (index: number): number => {
		if (!words.length || !audioDuration) return 0;

		// Find word range for this point (you'll need pointMappings for this)
		// For now, use simple time-based division as fallback
		const timePerPoint = audioDuration / points.length;
		const pointStartTime = index * timePerPoint;
		const pointEndTime = (index + 1) * timePerPoint;

		if (
			currentTimeSeconds >= pointStartTime &&
			currentTimeSeconds <= pointEndTime
		) {
			const progress =
				(currentTimeSeconds - pointStartTime) / timePerPoint;
			return Math.min(1, Math.max(0, progress));
		}

		return 0;
	};

	// Font sizes
	const leftWidth = width * 0.5;
	const padding = 80;
	const titleAreaHeight = 150;
	const availableHeight = height - padding * 2 - titleAreaHeight;

	const titleFontSize = Math.min(
		72,
		Math.max(40, (leftWidth - padding * 2) / title.length * 0.6)
	);
	const pointFontSize = Math.min(
		42,
		Math.max(24, availableHeight / (points.length * 2.5))
	);

	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "row",
				background:
					"linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
				position: "relative",
				overflow: "hidden",
			}}
		>
			{/* Left side: Content */}
			<div
				style={{
					width: "50%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					padding: padding,
					position: "relative",
					zIndex: 1,
					borderRight: "2px solid rgba(59, 130, 246, 0.2)",
				}}
			>
				<h2
					style={{
						fontSize: titleFontSize,
						margin: 0,
						marginBottom: 60,
						opacity: titleSpring,
						transform: `translateY(${interpolate(
							titleSpring,
							[0, 1],
							[30, 0]
						)}px)`,
						fontWeight: 800,
						color: "#ffffff",
						letterSpacing: "-0.02em",
						lineHeight: 1.2,
					}}
				>
					{title}
				</h2>

				<div
					style={{
						flex: 1,
						display: "flex",
						flexDirection: "column",
						gap: 20,
					}}
				>
					{points.map((point, index) => {
						const pointSpring = getPointSpring(index);
						const highlight = getPointHighlight(index);
						const isActive = highlight > 0.5;

						return (
							<div
								key={index}
								style={{
									opacity: pointSpring,
									transform: `translateX(${interpolate(
										pointSpring,
										[0, 1],
										[-30, 0]
									)}px) scale(${1 + highlight * 0.03})`,
									padding: "20px 24px",
									backgroundColor:
										highlight > 0.3
											? `rgba(59, 130, 246, ${0.18 + highlight * 0.25})`
											: "rgba(30, 41, 59, 0.65)",
									borderRadius: 14,
									borderLeft: `4px solid rgba(59, 130, 246, ${0.7 + highlight * 0.3})`,
									boxShadow: highlight > 0.3
										? `0 0 ${20 + highlight * 25}px rgba(59, 130, 246, ${highlight * 0.8})`
										: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
								}}
							>
								<p
									style={{
										fontSize: pointFontSize,
										margin: 0,
										lineHeight: 1.6,
										color: isActive ? "#e0f2fe" : "#f1f5f9",
										fontWeight: isActive ? 500 : 400,
									}}
								>
									{point}
								</p>
							</div>
						);
					})}
				</div>
			</div>

			{/* Right side: Animated SVG */}
			<div
				style={{
					width: "50%",
					height: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					position: "relative",
					background:
						"linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
					padding: 40,
				}}
			>
				{processedSvg ? (
					<div
						style={{
							width: "100%",
							height: "100%",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
						dangerouslySetInnerHTML={{ __html: processedSvg }}
					/>
				) : (
					<div style={{ color: "#fff" }}>Loading diagram...</div>
				)}
			</div>
		</div>
	);
};

/**
 * Calculate animation properties for an SVG element based on word timings
 */
function getElementAnimation(
	mapping: SvgElementMapping,
	currentTime: number,
	words: Array<{ start: number; end: number }>,
	activeState: { show: string[]; highlight: string[]; dim: string[] },
	fps: number
): {
	opacity?: number;
	filter?: string;
	transform?: string;
} {
	const [startIdx, endIdx] = mapping.wordRange;
	const startWord = words[startIdx];
	const endWord = words[endIdx];

	if (!startWord || !endWord) {
		return { opacity: 0.3 }; // Default dimmed
	}

	const elementStartTime = startWord.start + (mapping.animationDelay || 0);
	const elementEndTime = endWord.end;
	const elementDuration =
		mapping.animationDuration || elementEndTime - elementStartTime;

	const isActive = activeState.show.includes(mapping.elementId);
	const isHighlighted = activeState.highlight.includes(mapping.elementId);
	const isDimmed = activeState.dim.includes(mapping.elementId);

	// Calculate progress within the element's time range
	let progress = 0;
	if (currentTime >= elementStartTime && currentTime <= elementEndTime) {
		progress = (currentTime - elementStartTime) / elementDuration;
		progress = Math.max(0, Math.min(1, progress));
	} else if (currentTime < elementStartTime) {
		progress = 0;
	} else {
		progress = 1;
	}

	// Apply animation based on type
	switch (mapping.animationType) {
		case "reveal":
			const revealOpacity = spring({
				frame: progress * fps * 0.5,
				fps,
				config: { damping: 20, stiffness: 100 },
			});
			const revealScale = interpolate(
				progress,
				[0, 1],
				[0.9, 1],
				{ easing: Easing.out(Easing.quad) }
			);
			return {
				opacity: isDimmed ? 0.15 : isActive ? revealOpacity : 0.3,
				transform: `scale(${revealScale})`,
			};

		case "highlight":
			const pulse = Math.sin(progress * Math.PI * 2) * 0.1 + 1;
			const glowIntensity = isHighlighted ? 0.8 : 0.3;
			return {
				opacity: isDimmed ? 0.15 : 1,
				filter: `drop-shadow(0 0 ${15 * pulse}px rgba(59, 130, 246, ${glowIntensity}))`,
				transform: `scale(${isHighlighted ? pulse : 1})`,
			};

		case "zoom":
			const zoomScale = interpolate(
				progress,
				[0, 0.5, 1],
				[1, 1.2, 1],
				{ easing: Easing.inOut(Easing.quad) }
			);
			return {
				opacity: isDimmed ? 0.15 : 1,
				transform: `scale(${zoomScale})`,
			};

		case "fade-in":
			const fadeOpacity = interpolate(
				progress,
				[0, 0.3],
				[0, 1],
				{ easing: Easing.out(Easing.quad) }
			);
			return {
				opacity: isDimmed ? 0.15 : fadeOpacity,
			};

		default:
			return {
				opacity: isDimmed ? 0.15 : isActive ? 1 : 0.3,
			};
	}
}
