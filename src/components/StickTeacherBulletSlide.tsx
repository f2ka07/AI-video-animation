// Full-width slide matching live.html exactly:
// Single white card on dark background, teacher left (36%), bullets right.
// Teacher arm images (arm_0-4) are pre-designed to point at bullet positions.
// arm_5 is the rest pose.
//
// BULLET GENERATION RULE: All slides MUST have exactly 5 bullets.
// bulletStarts: [t0..t4] seconds from slide start; anchor = start of bullet phrase (word timings).
// See docs/bullet-pointing-algorithm.md. No per-slide or per-bullet hacks.

import React from "react";
import {
	interpolate,
	useCurrentFrame,
	useVideoConfig,
	spring,
	staticFile,
	Img,
} from "remotion";

const REST_ARM_INDEX = 5;
const GESTURE_DURATION_SECONDS = 5.0;

export interface StickTeacherBulletSlideProps {
	title: string;
	subtitle?: string;
	eyebrow?: string;
	points: string[];
	bulletStarts: number[];
	audioDuration: number;
	slideName?: string;
	moduleNumber?: number;
	gestureDurationSeconds?: number;
	/** When set, use content-relative time (trim leading silence). Bullet logic uses t - contentStartSeconds. */
	contentStartSeconds?: number;
	/** Uniform offset (s) for when we point. Negative = earlier, positive = later. Same for all bullets/slides. */
	pointingLeadSeconds?: number;
	/**
	 * Delay (s) before switching to bullets 2-5. Prevents pointing at the next bullet while the narrator
	 * is still on the previous one (e.g. ordinal said before substantive content). Applied to segment starts
	 * for active-bullet and pointing only; bullet 1 unchanged.
	 */
	bulletSwitchDelaySeconds?: number;
}

export const StickTeacherBulletSlide: React.FC<StickTeacherBulletSlideProps> = ({
	title,
	subtitle,
	eyebrow,
	points,
	bulletStarts,
	audioDuration,
	slideName,
	moduleNumber = 1,
	gestureDurationSeconds = GESTURE_DURATION_SECONDS,
	contentStartSeconds = 0,
	pointingLeadSeconds = 0,
	bulletSwitchDelaySeconds = 0,
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const t = frame / fps;

	if (points.length !== 5) {
		console.error(
			`StickTeacherBulletSlide: Expected exactly 5 bullets, got ${points.length}. ` +
			`Slide: ${slideName || "unknown"}.`
		);
	}
	if (bulletStarts.length !== 5) {
		console.error(
			`StickTeacherBulletSlide: Expected exactly 5 bulletStarts, got ${bulletStarts.length}. ` +
			`Slide: ${slideName || "unknown"}.`
		);
	}

	const safeStarts = bulletStarts.length === points.length ? bulletStarts : [];
	const tContent = Math.max(0, t - contentStartSeconds);
	const durationContent = audioDuration - contentStartSeconds;
	const startsContent = safeStarts.map((s) => Math.max(0, s - contentStartSeconds));

	// Delay switching to bullets 2-5 so we do not point at the next bullet while narrator is still on the previous one.
	const startsForSegment = startsContent.map((s, i) =>
		i === 0 ? s : s + bulletSwitchDelaySeconds
	);

	const getActiveBulletIndex = (): number => {
		if (startsForSegment.length === 0 || tContent < startsForSegment[0]) return -1;
		for (let i = 0; i < points.length; i++) {
			const start = startsForSegment[i];
			const end = i < startsForSegment.length - 1 ? startsForSegment[i + 1] : durationContent;
			if (tContent >= start && tContent < end) return i;
		}
		return points.length - 1;
	};

	const activeBullet = getActiveBulletIndex();

	const isPointing = (): boolean => {
		if (activeBullet < 0) return false;
		const start = startsForSegment[activeBullet];
		const pointStart = start + pointingLeadSeconds;
		return tContent >= pointStart && tContent < pointStart + gestureDurationSeconds;
	};

	const pointing = isPointing();
	// Clamp to arm_0 through arm_4 (5 arm positions available)
	const armIndex = pointing && activeBullet >= 0
		? Math.min(activeBullet, 4)
		: REST_ARM_INDEX;

	// Entrance springs
	const slideSpring = spring({
		frame,
		fps,
		config: { damping: 14, stiffness: 80 },
		durationInFrames: fps * 0.6,
	});

	// Modern color palette
	const accent = "#3b82f6";
	const accentSoft = "rgba(59, 130, 246, 0.1)";
	const accentHover = "rgba(59, 130, 246, 0.15)";
	const textMain = "#111827";
	const textMuted = "#6b7280";
	const borderSubtle = "#e5e7eb";
	const cardBg = "#ffffff";
	const gradientStart = "#667eea";
	const gradientEnd = "#764ba2";

	// Idle sway when at rest
	const idleSway = pointing ? 0 : Math.sin(t * 0.5 * Math.PI) * 3;

	return (
		<div
			style={{
				width: "100%",
				height: "100%",
				background: "radial-gradient(circle at top left, #1e293b 0%, #020617 55%)",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				padding: 20,
				boxSizing: "border-box",
				fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
			}}
		>
			{/* Modern white card with subtle shadow */}
			<div
				style={{
					width: "100%",
					maxWidth: 1800,
					aspectRatio: "16 / 9",
					background: cardBg,
					borderRadius: 32,
					boxShadow: "0 20px 60px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.04)",
					display: "flex",
					flexDirection: "column",
					padding: "32px 40px",
					boxSizing: "border-box",
					gap: 20,
					opacity: slideSpring,
					transform: `scale(${interpolate(slideSpring, [0, 1], [0.96, 1])})`,
					backdropFilter: "blur(10px)",
				}}
			>
				{/* MODERN HEADER - larger fonts to use available space */}
				<div
					style={{
						paddingBottom: 20,
						borderBottom: `2px solid ${borderSubtle}`,
					}}
				>
					<div
						style={{
							fontSize: 16,
							textTransform: "uppercase",
							letterSpacing: "0.2em",
							color: accent,
							fontWeight: 700,
							marginBottom: 12,
							opacity: 0.8,
						}}
					>
						{eyebrow || `Module ${moduleNumber}`}
					</div>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "baseline",
							gap: 32,
						}}
					>
						<div
							style={{
								fontSize: 48,
								fontWeight: 800,
								color: textMain,
								letterSpacing: "-0.02em",
								lineHeight: 1.2,
							}}
						>
							{title}
						</div>
						<div
							style={{
								fontSize: 20,
								color: textMuted,
								whiteSpace: "nowrap",
								fontWeight: 600,
								padding: "8px 18px",
								background: accentSoft,
								borderRadius: 24,
							}}
						>
							{activeBullet >= 0 ? `Point ${activeBullet + 1} of ${points.length}` : ""}
						</div>
					</div>
					{subtitle && (
						<div
							style={{
								marginTop: 12,
								fontSize: 24,
								color: textMuted,
								fontWeight: 400,
								lineHeight: 1.5,
							}}
						>
							{subtitle}
						</div>
					)}
				</div>

				{/* BODY ROW: container for teacher + bullets, scaled up */}
				<div
					style={{
						flex: 1,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						minHeight: 0,
					}}
				>
					{/* Locked container: teacher + bullets, scaled 1.3x */}
					<div
						style={{
							display: "flex",
							gap: 0,
							alignItems: "center",
							transform: "scale(1.3)",
							transformOrigin: "center center",
							width: "77%",
							height: "77%",
						}}
					>
						{/* LEFT: Teacher - flush to right edge */}
						<div
							style={{
								flex: "0 0 36%",
								display: "flex",
								alignItems: "center",
								justifyContent: "flex-end",
								height: "100%",
								marginRight: 0,
								paddingRight: 0,
							}}
						>
							<div
								style={{
									width: "100%",
									height: "100%",
									maxWidth: 430,
									background: "#ffffff",
									position: "relative",
									overflow: "visible",
									marginLeft: 0,
									marginRight: 0,
									paddingRight: 0,
									display: "flex",
									alignItems: "center",
									justifyContent: "flex-end",
								}}
							>
								{/* Teacher image - larger, flush to right edge */}
								<Img
									src={staticFile(`assets/teacher/arm_${armIndex}.png`)}
									style={{
										position: "relative",
										zIndex: 1,
										width: "100%",
										maxHeight: "100%",
										objectFit: "contain",
										display: "block",
										margin: 0,
										padding: 0,
										transform: `translateY(${idleSway}px)`,
									}}
								/>
							</div>
						</div>

						{/* RIGHT: Bullets - flush to left edge, larger text */}
						<div
							style={{
								flex: 1,
								display: "flex",
								flexDirection: "column",
								justifyContent: "center",
								gap: 10,
								paddingLeft: 0,
								marginLeft: 0,
							}}
						>
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									gap: 12,
									marginLeft: 0,
									paddingLeft: 0,
								}}
							>
								{points.map((point, index) => {
									const isActive = activeBullet === index;
									return (
										<div
											key={index}
											style={{
												position: "relative",
												display: "grid",
												gridTemplateColumns: "auto 1fr",
												alignItems: "center",
												columnGap: 16,
												padding: "14px 18px",
												borderRadius: 16,
												background: isActive ? accentSoft : "rgba(0, 0, 0, 0.02)",
												border: isActive ? `2px solid ${accent}` : "2px solid transparent",
												transform: isActive ? "translateX(6px)" : "none",
												boxShadow: isActive
													? "0 4px 16px rgba(59, 130, 246, 0.2), 0 0 0 1px rgba(59, 130, 246, 0.1)"
													: "0 2px 8px rgba(0, 0, 0, 0.04)",
												height: 56,
												alignItems: "center",
											}}
										>
											{/* Modern bullet number */}
											<div
												style={{
													width: 36,
													height: 36,
													borderRadius: "50%",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
													fontSize: 18,
													fontWeight: 700,
													background: isActive
														? `linear-gradient(135deg, ${gradientStart}, ${gradientEnd})`
														: "#f3f4f6",
													color: isActive ? "#ffffff" : textMuted,
													transform: isActive ? "scale(1.08)" : "none",
													boxShadow: isActive
														? "0 4px 12px rgba(59, 130, 246, 0.3)"
														: "0 2px 4px rgba(0, 0, 0, 0.1)",
													flexShrink: 0,
												}}
											>
												{index + 1}
											</div>
											{/* Modern bullet text - reduced size, fixed height container maintains vertical center */}
											<div
												style={{
													fontSize: 18,
													lineHeight: 1.3,
													color: isActive ? textMain : textMuted,
													fontWeight: isActive ? 600 : 500,
													letterSpacing: "-0.01em",
													display: "flex",
													alignItems: "center",
													height: "100%",
													overflow: "hidden",
													wordBreak: "break-word",
												}}
											>
												{point}
											</div>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</div>

				{/* FOOTER */}
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							marginTop: 8,
							fontSize: 14,
							color: textMuted,
							fontWeight: 500,
						}}
					>
						<div style={{ opacity: 0.7 }}>{slideName || `Slide ${moduleNumber}`}</div>
						<div
							style={{
								display: "flex",
								alignItems: "center",
								gap: 10,
							}}
						>
							<span style={{ fontSize: 13, opacity: 0.8 }}>Progress</span>
							<div
								style={{
									width: 160,
									height: 8,
									borderRadius: 999,
									background: "#f3f4f6",
									overflow: "hidden",
									boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.06)",
								}}
							>
								<div
									style={{
										height: "100%",
										width: `${activeBullet >= 0 ? ((activeBullet + 1) / points.length) * 100 : 0}%`,
										borderRadius: 999,
										background: `linear-gradient(90deg, ${gradientStart}, ${gradientEnd})`,
										boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
									}}
								/>
							</div>
						</div>
					</div>
			</div>
		</div>
	);
};
