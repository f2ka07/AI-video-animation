// Enhanced ContentSlide with spring animations
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig, staticFile, spring } from "remotion";
import { calculateFontSizeForMultiple, calculateOptimalFontSize } from "../utils/textSizing";
import { GitMachineAnimation } from "./GitMachineAnimation";
import { useModuleTimings } from "../hooks/useModuleTimings";

// Available animation types
type AnimationType = "git-machine" | "none";

interface PhraseTime {
	start: number;
	end: number;
}

interface AnimatedContentSlideProps {
	title: string;
	points: string[];
	keyWords?: string[][];
	phraseTimes?: (PhraseTime | undefined)[];
	slideName: string;
	audioStartFrame?: number;
	audioStartOffset?: number; // Seconds into the narration (for split-slide segments)
	imageSrc?: string;
	audioDuration?: number; // Total audio duration in seconds for proper sync
	moduleNumber?: number; // For loading word timings (cues)
	animation?: AnimationType; // Use animated visualization instead of static image
}

function renderPointWithEmphasis(point: string, keyWords: string[]): React.ReactNode {
	if (!keyWords || keyWords.length === 0) return point;
	const escaped = keyWords.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
	const pattern = new RegExp(`\\b(${escaped.join("|")})\\b`, "gi");
	const parts = point.split(pattern);
	return parts.map((part, i) => {
		const isMatch = keyWords.some((kw) => part.toLowerCase() === kw.toLowerCase());
		return isMatch ? (
			<strong key={i} style={{ fontWeight: 600, color: "#93c5fd" }}>
				{part}
			</strong>
		) : (
			<React.Fragment key={i}>{part}</React.Fragment>
		);
	});
}

export const AnimatedContentSlide: React.FC<AnimatedContentSlideProps> = ({
	title,
	points,
	keyWords,
	phraseTimes,
	slideName,
	audioStartFrame = 0,
	audioStartOffset = 0,
	imageSrc,
	audioDuration,
	moduleNumber = 1,
	animation,
}) => {
	const { timings } = useModuleTimings(moduleNumber);
	const slideTimings = timings?.slides[slideName];
	const words = slideTimings?.words || [];
	const timingsPhraseTimes = slideTimings?.phraseTimes;
	// Determine if we should show the right panel (image or animation)
	const hasRightPanel = imageSrc || animation;
	const frame = useCurrentFrame();
	const { fps, width, height } = useVideoConfig();

	// Calculate dynamic font sizes based on available space
	const padding = hasRightPanel ? { top: 80, right: 60, bottom: 80, left: 80 } : 80;
	const titleAreaHeight = 200;
	const gap = 24;

	const availableWidth = width - (hasRightPanel ? padding.left + padding.right + 40 : padding * 2);
	const availableHeight = height - (typeof padding === 'number' ? padding * 2 : padding.top + padding.bottom) - titleAreaHeight;

	const titleFontSize = calculateOptimalFontSize(
		title,
		availableWidth,
		titleAreaHeight,
		72, 32, undefined, 1.1
	).fontSize;

	const pointsFontSize = calculateFontSizeForMultiple(
		points,
		availableWidth - 48,
		availableHeight,
		38, 20, undefined, 1.7, gap
	).fontSize;

	// Spring animation for title
	const titleSpring = spring({
		frame,
		fps,
		config: { damping: 12, stiffness: 100 },
		durationInFrames: fps * 0.6,
	});

	const titleOpacity = titleSpring;
	const titleY = interpolate(titleSpring, [0, 1], [30, 0]);
	const titleScale = interpolate(titleSpring, [0, 1], [0.95, 1]);

	// Staggered spring animations for each bullet point entrance
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

	// Progressive bullet highlighting - use phrase-matched word timings when available
	const currentTimeSeconds = frame / fps;
	const effectiveTimeSeconds = currentTimeSeconds + audioStartOffset;
	const entranceTime = 0.3;

	// Find when a bullet phrase appears in transcript (phrase-based cue sync)
	const findPhraseTime = (
		phrase: string,
		wordList: Array<{ text: string; start: number; end: number }>,
		minStartFrom: number = 0
	): { start: number; end: number } | null => {
		if (!phrase || wordList.length === 0) return null;
		const normalize = (s: string) => s.toLowerCase().replace(/[.,!?;:'"()[\]]/g, "").trim();
		const phraseWords = phrase.split(/\s+/).map(normalize).filter((w) => w.length >= 2);
		if (phraseWords.length === 0) return null;
		const matchLen = Math.min(3, phraseWords.length);
		const searchWords = phraseWords.slice(0, matchLen);
		for (let i = 0; i <= wordList.length - searchWords.length; i++) {
			if (wordList[i].start < minStartFrom) continue;
			let matched = true;
			for (let j = 0; j < searchWords.length; j++) {
				const w = normalize(wordList[i + j].text);
				if (w !== searchWords[j] && !w.includes(searchWords[j]) && !searchWords[j].includes(w)) {
					matched = false;
					break;
				}
			}
			if (matched) {
				const start = wordList[i].start;
				const endIdx = Math.min(i + searchWords.length + 5, wordList.length - 1);
				const end = wordList[endIdx]?.end ?? wordList[wordList.length - 1]?.end ?? start + 2;
				return { start, end };
			}
		}
		return null;
	};

	// Precompute phrase-based ranges: prefer phraseTimes prop (segments), then timings file, then runtime phrase match
	const phraseRanges = React.useMemo(() => {
		if (points.length === 0) return null;
		const ranges: Array<{ start: number; end: number }> = [];
		let minFrom = audioStartOffset;
		for (let i = 0; i < points.length; i++) {
			const fromProp = phraseTimes?.[i];
			const fromTimings = timingsPhraseTimes?.[i];
			const stored = fromProp ?? fromTimings;
			if (stored && typeof stored.start === "number" && typeof stored.end === "number") {
				ranges.push({ start: stored.start, end: stored.end });
				minFrom = stored.start + 0.1;
			} else if (words.length > 0) {
				const r = findPhraseTime(points[i], words, minFrom);
				if (r) {
					ranges.push(r);
					minFrom = r.start + 0.1;
				} else {
					return null;
				}
			} else {
				return null;
			}
		}
		if (ranges.length !== points.length) return null;
		return ranges;
	}, [words, points, audioStartOffset, phraseTimes, timingsPhraseTimes]);

	const getPointHighlight = (index: number): number => {
		if (!audioDuration || audioDuration <= 0) return 0;
		if (effectiveTimeSeconds < entranceTime) return 0;

		let pointStartTime: number;
		let pointEndTime: number;

		if (phraseRanges && phraseRanges[index]) {
			pointStartTime = phraseRanges[index].start;
			pointEndTime = index + 1 < phraseRanges.length
				? phraseRanges[index + 1].start
				: Math.max(phraseRanges[index].end + 0.3, (words[words.length - 1]?.end ?? audioDuration) - 0.3);
		} else if (words.length > 0) {
			const wordsPerPoint = Math.ceil(words.length / points.length);
			const startWordIndex = index * wordsPerPoint;
			const endWordIndex = Math.min((index + 1) * wordsPerPoint - 1, words.length - 1);
			const startWord = words[startWordIndex];
			const endWord = words[endWordIndex];
			if (startWord && endWord && typeof startWord.start === "number" && typeof endWord.end === "number") {
				pointStartTime = startWord.start;
				pointEndTime = endWord.end;
			} else {
				const timePerPoint = audioDuration / points.length;
				pointStartTime = index * timePerPoint;
				pointEndTime = (index + 1) * timePerPoint;
			}
		} else {
			const introTime = audioDuration * 0.15;
			const contentDuration = audioDuration * 0.80;
			const timePerPoint = contentDuration / points.length;
			pointStartTime = entranceTime + introTime + index * timePerPoint;
			pointEndTime = pointStartTime + timePerPoint;
		}

		if (effectiveTimeSeconds < pointStartTime) return 0;
		if (effectiveTimeSeconds > pointEndTime) return 0.12;

		const duration = pointEndTime - pointStartTime;
		const progress = duration > 0 ? (effectiveTimeSeconds - pointStartTime) / duration : 0;
		if (progress < 0.12) return interpolate(progress, [0, 0.12], [0, 1]);
		if (progress > 0.88) return interpolate(progress, [0.88, 1], [1, 0.12]);
		return 1;
	};

	// Decorative elements spring
	const decorSpring = spring({
		frame,
		fps,
		config: { damping: 20, stiffness: 60 },
		delay: fps * 0.3,
	});

	// Image spring for right card
	const imageSpring = spring({
		frame,
		fps,
		config: { damping: 15, stiffness: 70 },
		delay: fps * 0.2,
		durationInFrames: fps * 0.8,
	});

	// Dynamic camera movements - subtle zoom and pan
	const cameraZoom = 1 + Math.sin(frame / 120) * 0.015;
	const cameraPanX = Math.sin(frame / 150) * 8;
	const cameraPanY = Math.cos(frame / 180) * 6;

	// Particle system - floating particles
	const particleCount = 12;
	const particles = Array.from({ length: particleCount }, (_, i) => {
		const baseX = (i * 137.5) % 100; // Golden angle distribution
		const baseY = (i * 97.3) % 100;
		const speed = 0.3 + (i % 3) * 0.1;
		const size = 2 + (i % 3) * 1;
		return {
			x: baseX + Math.sin(frame / (60 + i * 5)) * 15,
			y: baseY + Math.cos(frame / (70 + i * 7)) * 12,
			size,
			opacity: 0.15 + Math.sin(frame / (40 + i * 3)) * 0.1,
			speed,
		};
	});

	// Animated geometric shapes
	const shapes = Array.from({ length: 6 }, (_, i) => {
		const angle = (i / 6) * Math.PI * 2 + frame / 100;
		const radius = 200 + Math.sin(frame / 80 + i) * 50;
		return {
			x: 50 + Math.cos(angle) * radius / width * 100,
			y: 50 + Math.sin(angle) * radius / height * 100,
			rotation: angle * (180 / Math.PI) + frame / 2,
			scale: 0.3 + Math.sin(frame / 60 + i) * 0.2,
		};
	});

	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				flex: 1,
				background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
				color: "white",
				display: "flex",
				flexDirection: "column",
				padding: hasRightPanel ? "80px 60px 80px 80px" : 80,
				fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
				position: "relative",
				overflow: "hidden",
				transform: `scale(${cameraZoom}) translate(${cameraPanX}px, ${cameraPanY}px)`,
				transformOrigin: "center center",
			}}
		>
			{/* Multi-layer animated background grid */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					opacity: 0.04 + Math.sin(frame / 60) * 0.02,
					backgroundImage: `radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)`,
					backgroundSize: "40px 40px",
					transform: `translateY(${Math.sin(frame / 100) * 8}px) translateX(${Math.cos(frame / 120) * 5}px)`,
				}}
			/>
			
			{/* Secondary grid layer for depth */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					opacity: 0.02 + Math.cos(frame / 80) * 0.01,
					backgroundImage: `radial-gradient(circle at 1px 1px, #8b5cf6 0.5px, transparent 0)`,
					backgroundSize: "60px 60px",
					transform: `translateY(${Math.cos(frame / 90) * 6}px) translateX(${Math.sin(frame / 110) * 4}px)`,
				}}
			/>
			
			{/* Animated geometric shapes */}
			{shapes.map((shape, i) => (
				<div
					key={i}
					style={{
						position: "absolute",
						left: `${shape.x}%`,
						top: `${shape.y}%`,
						width: 80,
						height: 80,
						border: `2px solid rgba(59, 130, 246, ${0.08 * shape.scale})`,
						borderRadius: i % 2 === 0 ? "50%" : "8px",
						opacity: 0.15 * shape.scale,
						transform: `rotate(${shape.rotation}deg) scale(${shape.scale})`,
						transformOrigin: "center center",
						pointerEvents: "none",
					}}
				/>
			))}
			
			{/* Floating particles */}
			{particles.map((particle, i) => (
				<div
					key={i}
					style={{
						position: "absolute",
						left: `${particle.x}%`,
						top: `${particle.y}%`,
						width: particle.size,
						height: particle.size,
						borderRadius: "50%",
						background: `radial-gradient(circle, rgba(59, 130, 246, ${particle.opacity}) 0%, transparent 70%)`,
						boxShadow: `0 0 ${particle.size * 3}px rgba(59, 130, 246, ${particle.opacity * 0.5})`,
						pointerEvents: "none",
					}}
				/>
			))}
			
			{/* Moving gradient overlay with multiple layers */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: `radial-gradient(ellipse at ${50 + Math.sin(frame / 80) * 20}% ${50 + Math.cos(frame / 60) * 15}%, rgba(59, 130, 246, 0.12) 0%, transparent 50%)`,
					pointerEvents: "none",
				}}
			/>
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: `radial-gradient(ellipse at ${30 + Math.cos(frame / 100) * 25}% ${70 + Math.sin(frame / 75) * 20}%, rgba(139, 92, 246, 0.08) 0%, transparent 45%)`,
					pointerEvents: "none",
				}}
			/>

			{/* Animated accent line with glow */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: `${interpolate(decorSpring, [0, 1], [0, 100])}%`,
					height: 4,
					background: "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #22c55e 100%)",
					boxShadow: `0 0 ${20 * decorSpring}px rgba(59, 130, 246, ${0.6 * decorSpring}), 0 0 ${40 * decorSpring}px rgba(139, 92, 246, ${0.3 * decorSpring})`,
				}}
			/>

			{/* Animated scan line effect */}
			<div
				style={{
					position: "absolute",
					top: `${(frame / 2) % 100}%`,
					left: 0,
					right: 0,
					height: 2,
					background: "linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.3) 50%, transparent 100%)",
					opacity: 0.4,
					pointerEvents: "none",
				}}
			/>

			{/* Floating decorative orbs with pulsing */}
			<div
				style={{
					position: "absolute",
					top: "60%",
					right: hasRightPanel ? "45%" : "5%",
					width: 120,
					height: 120,
					borderRadius: "50%",
					background: "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)",
					opacity: decorSpring * 0.6,
					transform: `scale(${0.8 + decorSpring * 0.4 + Math.sin(frame / 25) * 0.1}) translateY(${Math.sin(frame / 30) * 12}px) translateX(${Math.cos(frame / 35) * 8}px)`,
					boxShadow: `0 0 ${30 + Math.sin(frame / 20) * 20}px rgba(59, 130, 246, ${0.3 + Math.sin(frame / 25) * 0.2})`,
				}}
			/>
			<div
				style={{
					position: "absolute",
					bottom: "20%",
					left: "8%",
					width: 90,
					height: 90,
					borderRadius: "50%",
					background: "radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)",
					opacity: decorSpring * 0.5,
					transform: `scale(${0.7 + decorSpring * 0.3 + Math.cos(frame / 28) * 0.08}) translateY(${Math.cos(frame / 32) * 10}px)`,
					boxShadow: `0 0 ${25 + Math.cos(frame / 22) * 15}px rgba(139, 92, 246, ${0.25 + Math.cos(frame / 28) * 0.15})`,
				}}
			/>

			<div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: hasRightPanel ? "row" : "column", gap: hasRightPanel ? 40 : 0 }}>
				{/* Left Card: Content */}
				<div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
					<h2
						style={{
							fontSize: titleFontSize,
							margin: 0,
							marginBottom: 60,
							opacity: titleOpacity,
							transform: `translateY(${titleY}px) scale(${titleScale * (1 + Math.sin(frame / 50) * 0.005)})`,
							fontWeight: 800,
							color: "#ffffff",
							letterSpacing: "-0.02em",
							paddingBottom: 24,
							borderBottom: "3px solid",
							borderImage: "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #22c55e 100%) 1",
							wordWrap: "break-word",
							overflowWrap: "break-word",
							transformOrigin: "left center",
							filter: `drop-shadow(0 0 ${15 + Math.sin(frame / 30) * 5}px rgba(59, 130, 246, 0.4))`,
							animation: "shimmer 3s ease-in-out infinite",
						}}
					>
						{title}
					</h2>
					<div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
					{points.map((point, index) => {
						const pointKeyWords = keyWords?.[index] ?? [];
						const pointSpring = getPointSpring(index);
						const pointOpacity = pointSpring;
						const pointX = interpolate(pointSpring, [0, 1], [-30, 0]);
						const pointScale = interpolate(pointSpring, [0, 1], [0.95, 1]);
						
						// Continuous highlight animation
						const highlight = getPointHighlight(index);
						const isActive = highlight > 0.5;
						
						// Subtle breathing effect for active point
						const breathe = isActive ? Math.sin(frame / 15) * 0.02 : 0;
						const activeScale = 1 + highlight * 0.03 + breathe;
						
						// Glow intensity based on highlight
						const glowSize = 20 + highlight * 25;
						const glowOpacity = highlight * 0.8;
						
						// Subtle floating animation
						const floatY = Math.sin((frame + index * 10) / 40) * 2;
						const floatX = Math.cos((frame + index * 8) / 35) * 1;

						return (
							<div
								key={index}
								style={{
									opacity: pointOpacity,
									transform: `translateX(${pointX + floatX}px) translateY(${floatY}px) scale(${pointScale * activeScale})`,
									display: "flex",
									alignItems: "flex-start",
									gap: 20,
									padding: "20px 24px",
									backgroundColor: highlight > 0.3
										? `rgba(59, 130, 246, ${0.18 + highlight * 0.25})`
										: "rgba(30, 41, 59, 0.65)",
									borderRadius: 14,
									borderLeft: `4px solid rgba(59, 130, 246, ${0.7 + highlight * 0.3})`,
									boxShadow: highlight > 0.3
										? `0 0 ${glowSize}px rgba(59, 130, 246, ${glowOpacity}), 0 0 ${glowSize * 1.5}px rgba(139, 92, 246, ${glowOpacity * 0.4}), 0 8px 16px -4px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)`
										: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
									transformOrigin: "left center",
									backdropFilter: "blur(10px)",
									transition: "all 0.3s ease",
								}}
							>
								{/* Animated bullet point indicator with pulse and rings */}
								<div style={{ position: "relative", marginTop: 10, flexShrink: 0 }}>
									<div
										style={{
											width: interpolate(pointSpring, [0, 1], [0, 10]) + (isActive ? Math.sin(frame / 10) * 3 : 0),
											height: interpolate(pointSpring, [0, 1], [0, 10]) + (isActive ? Math.sin(frame / 10) * 3 : 0),
											backgroundColor: isActive ? "#60a5fa" : "#3b82f6",
											borderRadius: "50%",
											boxShadow: `0 0 ${15 + highlight * 20}px rgba(59, 130, 246, ${0.6 + highlight * 0.6})`,
											position: "relative",
											zIndex: 2,
										}}
									/>
									{isActive && (
										<div
											style={{
												position: "absolute",
												top: "50%",
												left: "50%",
												width: interpolate(pointSpring, [0, 1], [0, 10]) + 8,
												height: interpolate(pointSpring, [0, 1], [0, 10]) + 8,
												borderRadius: "50%",
												border: `2px solid rgba(96, 165, 250, ${0.4 + Math.sin(frame / 8) * 0.3})`,
												transform: "translate(-50%, -50%)",
												opacity: 0.6 + Math.sin(frame / 12) * 0.4,
											}}
										/>
									)}
								</div>
								<p
									style={{
										fontSize: pointsFontSize,
										margin: 0,
										lineHeight: 1.6,
										flex: 1,
										color: isActive ? "#e0f2fe" : "#f1f5f9",
										fontWeight: isActive ? 500 : 400,
										wordWrap: "break-word",
										overflowWrap: "break-word",
								}}
							>
								{renderPointWithEmphasis(point, pointKeyWords)}
							</p>
							</div>
						);
					})}
					</div>
				</div>

				{/* Right Panel: Animation or Image */}
				{animation === "git-machine" && (
					<div
						style={{
							flex: 1,
							position: "relative",
							borderRadius: 24,
							overflow: "hidden",
							opacity: imageSpring,
							transform: `translateX(${interpolate(imageSpring, [0, 1], [40, 0])}px) scale(${interpolate(imageSpring, [0, 1], [0.95, 1])})`,
						}}
					>
						<GitMachineAnimation audioDuration={audioDuration} />
					</div>
				)}
				
				{/* Right Card: Static Image or SVG (if no animation) */}
				{!animation && imageSrc && (
					<div
						style={{
							flex: 1,
							position: "relative",
							borderRadius: 24,
							overflow: "hidden",
							opacity: imageSpring,
							transform: `translateX(${interpolate(imageSpring, [0, 1], [40, 0])}px) scale(${interpolate(imageSpring, [0, 1], [0.95, 1])})`,
							boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(59, 130, 246, 0.2)",
							background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						{/* Check if it's an SVG file */}
						{imageSrc.toLowerCase().endsWith('.svg') ? (
							// SVG: Display directly with proper sizing
							<img
								src={staticFile(imageSrc)}
								alt=""
								style={{
									width: "100%",
									height: "100%",
									objectFit: "contain",
									padding: 40,
									filter: `drop-shadow(0 0 ${30 * imageSpring}px rgba(59, 130, 246, 0.4))`,
								}}
							/>
						) : (
							// Regular image: Use the decorative overlay style
							<>
								{/* Image background with overlay */}
								<img
									src={staticFile(imageSrc)}
									alt=""
									style={{
										position: "absolute",
										top: 0,
										left: 0,
										width: "100%",
										height: "100%",
										objectFit: "cover",
										opacity: 0.3,
										filter: "blur(2px)",
									}}
								/>
								{/* Gradient overlay */}
								<div
									style={{
										position: "absolute",
										top: 0,
										left: 0,
										right: 0,
										bottom: 0,
										background: "linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.6) 50%, rgba(15, 23, 42, 0.9) 100%)",
									}}
								/>
								{/* Animated icon overlay with spring */}
								<div
									style={{
										position: "absolute",
										top: "50%",
										left: "50%",
										transform: `translate(-50%, -50%) scale(${interpolate(imageSpring, [0, 1], [0.6, 1])}) rotate(${Math.sin(frame / 40) * 5}deg)`,
										opacity: imageSpring * 0.8,
									}}
								>
									<img
										src={staticFile(imageSrc)}
										alt=""
										style={{
											width: 350,
											height: 350,
											filter: `drop-shadow(0 0 ${40 * imageSpring}px rgba(59, 130, 246, 0.5))`,
										}}
									/>
								</div>
								{/* Floating decorative orbs */}
								<div
									style={{
										position: "absolute",
										top: 40,
										right: 40,
										width: 100,
										height: 100,
										borderRadius: "50%",
										background: "radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)",
										opacity: decorSpring * 0.5,
										transform: `scale(${0.8 + Math.sin(frame / 25) * 0.2})`,
									}}
								/>
								<div
									style={{
										position: "absolute",
										bottom: 50,
										left: 50,
										width: 70,
										height: 70,
										borderRadius: "50%",
										background: "radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)",
										opacity: decorSpring * 0.4,
										transform: `scale(${0.8 + Math.sin(frame / 30 + 1) * 0.15})`,
									}}
								/>
							</>
						)}
					</div>
				)}
			</div>
		</div>
	);
};
