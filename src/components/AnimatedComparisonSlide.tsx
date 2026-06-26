// Enhanced ComparisonSlide with premium card layout
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { useModuleTimings } from "../hooks/useModuleTimings";
import { PremiumSlideBackground, premiumSlideRootStyle } from "./PremiumSlideBackground";
import { SvgDiagramFrame } from "./SvgDiagramFrame";
import { premiumTheme } from "../theme/premiumTheme";

interface AnimatedComparisonSlideProps {
	title: string;
	leftTitle: string;
	leftItems: string[];
	rightTitle: string;
	rightItems: string[];
	slideName: string;
	audioStartFrame?: number;
	audioDuration?: number;
	imageSrc?: string;
	moduleNumber?: number;
}

export const AnimatedComparisonSlide: React.FC<AnimatedComparisonSlideProps> = ({
	title,
	leftTitle,
	leftItems,
	rightTitle,
	rightItems,
	slideName,
	audioDuration,
	imageSrc,
	moduleNumber = 1,
}) => {
	const { timings } = useModuleTimings(moduleNumber);
	const slideTimings = timings?.slides[slideName];
	const words = slideTimings?.words || [];
	const leftPhraseTimes = slideTimings?.leftPhraseTimes;
	const rightPhraseTimes = slideTimings?.rightPhraseTimes;
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();

	const titleSpring = spring({ frame, fps, config: { damping: 12, stiffness: 100 }, durationInFrames: fps * 0.55 });
	const leftColumnSpring = spring({ frame, fps, config: { damping: 15, stiffness: 80 }, delay: fps * 0.25, durationInFrames: fps * 0.55 });
	const rightColumnSpring = spring({ frame, fps, config: { damping: 15, stiffness: 80 }, delay: fps * 0.4, durationInFrames: fps * 0.55 });
	const decorSpring = spring({ frame, fps, config: { damping: 20, stiffness: 60 }, delay: fps * 0.15 });
	const imageSpring = rightColumnSpring;

	const getItemSpring = (index: number, side: "left" | "right") =>
		spring({
			frame,
			fps,
			config: { damping: 14, stiffness: 90 },
			delay: (side === "left" ? fps * 0.45 : fps * 0.55) + index * fps * 0.1,
			durationInFrames: fps * 0.35,
		});

	const currentTimeSeconds = frame / fps;
	const entranceTime = 0.35;

	const getPhraseRanges = (
		items: string[],
		side: "left" | "right"
	): Array<{ start: number; end: number }> | null => {
		const stored = side === "left" ? leftPhraseTimes : rightPhraseTimes;
		if (stored && stored.length === items.length && stored.every((p) => p && typeof p.start === "number")) {
			return stored.map((p) => ({ start: p!.start, end: p!.end }));
		}
		if (words.length === 0) return null;
		const normalize = (s: string) => s.toLowerCase().replace(/[.,!?;:'"()[\]]/g, "").trim();
		const validWords = words.filter((w) => w.start > 0 || w.end > 0);
		const ranges: Array<{ start: number; end: number }> = [];
		let minFrom = 0;
		for (const item of items) {
			const phraseWords = item.split(/\s+/).map(normalize).filter((w) => w.length >= 2);
			if (phraseWords.length === 0) return null;
			let found: { start: number; end: number } | null = null;
			for (let len = Math.min(phraseWords.length, 3); len >= 1 && !found; len--) {
				const searchWords = phraseWords.slice(0, len);
				for (let i = 0; i <= validWords.length - searchWords.length; i++) {
					if (validWords[i].start < minFrom) continue;
					let matched = true;
					for (let j = 0; j < searchWords.length; j++) {
						const w = normalize(validWords[i + j].text);
						const p = searchWords[j];
						if (w !== p && !w.includes(p) && !p.includes(w)) {
							matched = false;
							break;
						}
					}
					if (matched) {
						found = {
							start: validWords[i].start,
							end: validWords[Math.min(i + searchWords.length + 3, validWords.length - 1)]?.end ?? validWords[i].end,
						};
						break;
					}
				}
			}
			if (!found) return null;
			ranges.push(found);
			minFrom = found.start + 0.1;
		}
		return ranges.length === items.length ? ranges : null;
	};

	const leftRanges = React.useMemo(() => getPhraseRanges(leftItems, "left"), [leftItems, leftPhraseTimes, words]);
	const rightRanges = React.useMemo(() => getPhraseRanges(rightItems, "right"), [rightItems, rightPhraseTimes, words]);

	const getItemHighlight = (index: number, side: "left" | "right"): number => {
		if (!audioDuration || audioDuration <= 0) return 0;
		if (currentTimeSeconds < entranceTime) return 0;

		const ranges = side === "left" ? leftRanges : rightRanges;
		if (ranges?.[index]) {
			const start = ranges[index].start;
			const end =
				index + 1 < ranges.length
					? ranges[index + 1].start
					: Math.max(ranges[index].end + 0.3, (words[words.length - 1]?.end ?? audioDuration) - 0.3);
			if (currentTimeSeconds < start) return 0;
			if (currentTimeSeconds > end) return 0.12;
			const progress = (currentTimeSeconds - start) / (end - start);
			if (progress < 0.12) return interpolate(progress, [0, 0.12], [0, 1]);
			if (progress > 0.88) return interpolate(progress, [0.88, 1], [1, 0.12]);
			return 1;
		}

		const items = side === "left" ? leftItems : rightItems;
		const intro = audioDuration * 0.12;
		const leftDur = audioDuration * 0.38;
		const rightDur = audioDuration * 0.38;
		const tpi = (side === "left" ? leftDur : rightDur) / items.length;
		const start =
			entranceTime +
			intro +
			(side === "right" ? leftDur : 0) +
			index * tpi;
		const end = start + tpi;
		if (currentTimeSeconds < start) return 0;
		if (currentTimeSeconds > end) return 0.12;
		const progress = (currentTimeSeconds - start) / tpi;
		if (progress < 0.12) return interpolate(progress, [0, 0.12], [0, 1]);
		if (progress > 0.88) return interpolate(progress, [0.88, 1], [1, 0.12]);
		return 1;
	};

	const renderColumn = (
		items: string[],
		columnTitle: string,
		side: "left" | "right",
		columnSpring: number
	) => {
		const accent = side === "left" ? premiumTheme.colors.accentRed : premiumTheme.colors.accentGreen;
		const bgActive =
			side === "left" ? "rgba(239, 68, 68, 0.2)" : "rgba(34, 197, 94, 0.2)";

		return (
			<div
				style={{
					flex: 1,
					display: "flex",
					flexDirection: "column",
					opacity: columnSpring,
					transform: `translateX(${interpolate(columnSpring, [0, 1], [side === "left" ? -24 : 24, 0])}px)`,
				}}
			>
				<h3
					style={{
						fontSize: imageSrc ? 32 : 38,
						margin: "0 0 18px",
						color: accent,
						fontWeight: 700,
						display: "flex",
						alignItems: "center",
						gap: 10,
					}}
				>
					<span
						style={{
							width: 8,
							height: 8,
							borderRadius: "50%",
							backgroundColor: accent,
						}}
					/>
					{columnTitle}
				</h3>
				<div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
					{items.map((item, index) => {
						const highlight = getItemHighlight(index, side);
						const itemSpring = getItemSpring(index, side);
						return (
							<div
								key={index}
								style={{
									opacity: itemSpring,
									transform: `translateY(${interpolate(itemSpring, [0, 1], [12, 0])}px)`,
									fontSize: imageSrc ? 24 : 28,
									lineHeight: 1.45,
									padding: "18px 20px",
									backgroundColor: highlight > 0.3 ? bgActive : premiumTheme.colors.cardBg,
									borderRadius: premiumTheme.radius.card,
									borderLeft: `4px solid ${accent}`,
									boxShadow: highlight > 0.3 ? premiumTheme.shadow.cardActive : premiumTheme.shadow.card,
								}}
							>
								{item}
							</div>
						);
					})}
				</div>
			</div>
		);
	};

	return (
		<div
			style={{
				...premiumSlideRootStyle,
				display: "flex",
				flexDirection: "column",
				padding: 64,
			}}
		>
			<PremiumSlideBackground decorProgress={decorSpring} />

			<div
				style={{
					position: "relative",
					zIndex: 1,
					flex: 1,
					display: "flex",
					flexDirection: imageSrc ? "row" : "column",
					gap: imageSrc ? 32 : 0,
					minHeight: 0,
				}}
			>
				<div style={{ flex: imageSrc ? "1 1 54%" : undefined, display: "flex", flexDirection: "column", minWidth: 0 }}>
					<h2
						style={{
							fontSize: imageSrc ? 44 : 56,
							margin: "0 0 32px",
							opacity: titleSpring,
							transform: `translateY(${interpolate(titleSpring, [0, 1], [20, 0])}px)`,
							fontWeight: 800,
							textAlign: imageSrc ? "left" : "center",
							letterSpacing: "-0.02em",
						}}
					>
						{title}
					</h2>

					<div style={{ flex: 1, display: "flex", gap: 20, alignItems: "stretch", minHeight: 0 }}>
						{renderColumn(leftItems, leftTitle, "left", leftColumnSpring)}
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								justifyContent: "center",
								padding: "0 4px",
								opacity: decorSpring,
							}}
						>
							<div
								style={{
									width: 36,
									height: 36,
									borderRadius: "50%",
									background: "rgba(30, 41, 59, 0.9)",
									border: `1px solid ${premiumTheme.colors.accentBlue}`,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									fontSize: 13,
									fontWeight: 700,
									color: premiumTheme.colors.accentBlueMuted,
								}}
							>
								vs
							</div>
							<div
								style={{
									flex: 1,
									width: 2,
									marginTop: 12,
									background: `linear-gradient(180deg, ${premiumTheme.colors.accentRed} 0%, ${premiumTheme.colors.accentBlue} 50%, ${premiumTheme.colors.accentGreen} 100%)`,
									opacity: 0.5,
									borderRadius: 1,
								}}
							/>
						</div>
						{renderColumn(rightItems, rightTitle, "right", rightColumnSpring)}
					</div>
				</div>

				{imageSrc && (
					<SvgDiagramFrame
						imageSrc={imageSrc}
						entranceProgress={imageSpring}
						audioDuration={audioDuration}
						flex="1 1 46%"
						minWidth={520}
					/>
				)}
			</div>
		</div>
	);
};
