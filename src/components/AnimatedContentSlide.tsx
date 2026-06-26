// Enhanced ContentSlide with spring animations and premium layout
import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig, spring } from "remotion";
import { calculateFontSizeForMultiple, calculateOptimalFontSize } from "../utils/textSizing";
import { GitMachineAnimation } from "./GitMachineAnimation";
import { useModuleTimings } from "../hooks/useModuleTimings";
import { PremiumSlideBackground, premiumSlideRootStyle } from "./PremiumSlideBackground";
import { SvgDiagramFrame } from "./SvgDiagramFrame";
import { BulletRow, PointCard } from "./PointCard";
import { premiumTheme } from "../theme/premiumTheme";
import { groupPointsIntoCards, needsGroupedCards } from "../utils/premiumDisplayPoints";

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
	audioStartOffset?: number;
	imageSrc?: string;
	audioDuration?: number;
	moduleNumber?: number;
	animation?: AnimationType;
}

function renderPointWithEmphasis(point: string, keyWords: string[]): React.ReactNode {
	if (!keyWords || keyWords.length === 0) return point;
	const escaped = keyWords.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
	const pattern = new RegExp(`\\b(${escaped.join("|")})\\b`, "gi");
	const parts = point.split(pattern);
	return parts.map((part, i) => {
		const isMatch = keyWords.some((kw) => part.toLowerCase() === kw.toLowerCase());
		return isMatch ? (
			<strong key={i} style={{ fontWeight: 600, color: premiumTheme.colors.accentBlueMuted }}>
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
	const hasRightPanel = imageSrc || animation;
	const frame = useCurrentFrame();
	const { fps, width, height } = useVideoConfig();

	const padding = hasRightPanel ? premiumTheme.spacing.slidePaddingWide : { top: 72, right: 72, bottom: 72, left: 72 };
	const titleAreaHeight = hasRightPanel ? 110 : 160;
	const bulletGap = premiumTheme.spacing.bulletGap;

	const padH = typeof padding === "number" ? padding * 2 : padding.left + padding.right;
	const padV = typeof padding === "number" ? padding * 2 : padding.top + padding.bottom;
	const availableWidth = width - padH - (hasRightPanel ? 40 : 0);
	const availableHeight = height - padV - titleAreaHeight;

	const titleFontSize = hasRightPanel
		? Math.min(
				calculateOptimalFontSize(title, availableWidth, titleAreaHeight, 48, 32, undefined, 1.1).fontSize,
				premiumTheme.typography.titleMedium
			)
		: calculateOptimalFontSize(title, availableWidth, titleAreaHeight, 56, 32, undefined, 1.1).fontSize;

	const displayPoints = points;
	const useCards = needsGroupedCards(displayPoints);
	const cardGroups = useCards ? groupPointsIntoCards(displayPoints) : [];

	const pointsFontSize = hasRightPanel
		? Math.min(
				calculateFontSizeForMultiple(
					useCards ? cardGroups.map((c) => c.title) : displayPoints,
					availableWidth - 40,
					availableHeight,
					premiumTheme.typography.bulletMedium,
					18,
					undefined,
					1.5,
					bulletGap
				).fontSize,
				premiumTheme.typography.bulletMedium
			)
		: calculateFontSizeForMultiple(
				useCards ? cardGroups.map((c) => c.title) : displayPoints,
				availableWidth - 40,
				availableHeight,
				premiumTheme.typography.bulletLarge,
				18,
				undefined,
				1.55,
				bulletGap
			).fontSize;

	const titleSpring = spring({ frame, fps, config: { damping: 12, stiffness: 100 }, durationInFrames: fps * 0.6 });
	const titleOpacity = titleSpring;
	const titleY = interpolate(titleSpring, [0, 1], [24, 0]);

	const getPointSpring = (index: number) =>
		spring({
			frame,
			fps,
			config: { damping: 14, stiffness: 90 },
			delay: fps * 0.35 + index * fps * 0.12,
			durationInFrames: fps * 0.45,
		});

	const currentTimeSeconds = frame / fps;
	const effectiveTimeSeconds = currentTimeSeconds + audioStartOffset;
	const entranceTime = 0.3;

	const findPhraseTime = (
		phrase: string,
		wordList: Array<{ text: string; start: number; end: number }>,
		minStartFrom: number = 0
	): { start: number; end: number } | null => {
		if (!phrase || wordList.length === 0) return null;
		const normalize = (s: string) => s.toLowerCase().replace(/[.,!?;:'"()[\]]/g, "").trim();
		const phraseWords = phrase.split(/\s+/).map(normalize).filter((w) => w.length >= 2);
		if (phraseWords.length === 0) return null;
		const searchWords = phraseWords.slice(0, Math.min(3, phraseWords.length));
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
				return { start, end: wordList[endIdx]?.end ?? start + 2 };
			}
		}
		return null;
	};

	const phraseRanges = React.useMemo(() => {
		if (displayPoints.length === 0) return null;
		const ranges: Array<{ start: number; end: number }> = [];
		let minFrom = audioStartOffset;
		for (let i = 0; i < displayPoints.length; i++) {
			const stored = phraseTimes?.[i] ?? timingsPhraseTimes?.[i];
			if (stored && typeof stored.start === "number") {
				ranges.push({ start: stored.start, end: stored.end });
				minFrom = stored.start + 0.1;
			} else if (words.length > 0) {
				const r = findPhraseTime(displayPoints[i], words, minFrom);
				if (r) {
					ranges.push(r);
					minFrom = r.start + 0.1;
				} else return null;
			} else return null;
		}
		return ranges.length === displayPoints.length ? ranges : null;
	}, [words, displayPoints, audioStartOffset, phraseTimes, timingsPhraseTimes]);

	const getPointHighlight = (index: number): number => {
		if (!audioDuration || audioDuration <= 0) return 0;
		if (effectiveTimeSeconds < entranceTime) return 0;

		let pointStartTime: number;
		let pointEndTime: number;

		if (phraseRanges?.[index]) {
			pointStartTime = phraseRanges[index].start;
			pointEndTime =
				index + 1 < phraseRanges.length
					? phraseRanges[index + 1].start
					: Math.max(phraseRanges[index].end + 0.3, (words[words.length - 1]?.end ?? audioDuration) - 0.3);
		} else if (words.length > 0) {
			const wordsPerPoint = Math.ceil(words.length / displayPoints.length);
			const sw = words[index * wordsPerPoint];
			const ew = words[Math.min((index + 1) * wordsPerPoint - 1, words.length - 1)];
			if (sw && ew) {
				pointStartTime = sw.start;
				pointEndTime = ew.end;
			} else {
				const t = audioDuration / displayPoints.length;
				pointStartTime = index * t;
				pointEndTime = (index + 1) * t;
			}
		} else {
			const t = (audioDuration * 0.8) / displayPoints.length;
			pointStartTime = entranceTime + audioDuration * 0.12 + index * t;
			pointEndTime = pointStartTime + t;
		}

		if (effectiveTimeSeconds < pointStartTime) return 0;
		if (effectiveTimeSeconds > pointEndTime) return 0.12;
		const duration = pointEndTime - pointStartTime;
		const progress = duration > 0 ? (effectiveTimeSeconds - pointStartTime) / duration : 0;
		if (progress < 0.12) return interpolate(progress, [0, 0.12], [0, 1]);
		if (progress > 0.88) return interpolate(progress, [0.88, 1], [1, 0.12]);
		return 1;
	};

	const decorSpring = spring({ frame, fps, config: { damping: 20, stiffness: 60 }, delay: fps * 0.2 });
	const imageSpring = spring({
		frame,
		fps,
		config: { damping: 15, stiffness: 70 },
		delay: fps * 0.25,
		durationInFrames: fps * 0.7,
	});

	const padStyle =
		typeof padding === "number"
			? padding
			: `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`;

	return (
		<div
			style={{
				...premiumSlideRootStyle,
				display: "flex",
				flexDirection: "column",
				padding: padStyle,
			}}
		>
			<PremiumSlideBackground decorProgress={decorSpring} />

			<div
				style={{
					position: "relative",
					zIndex: 1,
					flex: 1,
					display: "flex",
					flexDirection: hasRightPanel ? "row" : "column",
					gap: hasRightPanel ? 28 : 24,
					minHeight: 0,
				}}
			>
				<div style={{ flex: hasRightPanel ? "0 1 42%" : 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
					<h2
						style={{
							fontSize: titleFontSize,
							margin: 0,
							marginBottom: hasRightPanel ? 24 : 36,
							opacity: titleOpacity,
							transform: `translateY(${titleY}px)`,
							fontWeight: 800,
							color: premiumTheme.colors.textPrimary,
							letterSpacing: "-0.02em",
							paddingBottom: 16,
							borderBottom: "2px solid",
							borderImage: `${premiumTheme.gradients.titleBorder} 1`,
						}}
					>
						{title}
					</h2>

					<div style={{ flex: 1, display: "flex", flexDirection: "column", gap: bulletGap }}>
						{useCards
							? cardGroups.map((card, index) => (
									<PointCard
										key={index}
										title={card.title}
										subPoints={card.subPoints}
										fontSize={pointsFontSize}
										highlight={getPointHighlight(Math.min(index, displayPoints.length - 1))}
										entranceProgress={getPointSpring(index)}
										compact={hasRightPanel}
										emphasisRenderer={(t) =>
											renderPointWithEmphasis(t, keyWords?.[index] ?? [])
										}
									/>
								))
							: displayPoints.map((point, index) => (
									<BulletRow
										key={index}
										text={point}
										fontSize={pointsFontSize}
										highlight={getPointHighlight(index)}
										entranceProgress={getPointSpring(index)}
										compact={hasRightPanel}
										emphasisRenderer={(t) =>
											renderPointWithEmphasis(t, keyWords?.[index] ?? [])
										}
									/>
								))}
					</div>
				</div>

				{animation === "git-machine" && (
					<div
						style={{
							flex: 1,
							borderRadius: premiumTheme.radius.svgFrame,
							overflow: "hidden",
							opacity: imageSpring,
						}}
					>
						<GitMachineAnimation audioDuration={audioDuration} />
					</div>
				)}

				{!animation && imageSrc && (
					<SvgDiagramFrame
						imageSrc={imageSrc}
						entranceProgress={imageSpring}
						audioDuration={audioDuration}
						flex="1 1 58%"
						minWidth={600}
					/>
				)}
			</div>
		</div>
	);
};
