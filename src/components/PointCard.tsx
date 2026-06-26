import React from "react";
import { interpolate } from "remotion";
import { premiumTheme } from "../theme/premiumTheme";

interface PointCardProps {
	title: string;
	subPoints?: string[];
	fontSize: number;
	highlight?: number;
	entranceProgress?: number;
	compact?: boolean;
	emphasisRenderer?: (text: string) => React.ReactNode;
}

export const PointCard: React.FC<PointCardProps> = ({
	title,
	subPoints,
	fontSize,
	highlight = 0,
	entranceProgress = 1,
	compact = false,
	emphasisRenderer,
}) => {
	const isActive = highlight > 0.5;
	const render = emphasisRenderer ?? ((t: string) => t);

	return (
		<div
			style={{
				opacity: entranceProgress,
				transform: `translateX(${interpolate(entranceProgress, [0, 1], [-20, 0])}px)`,
				padding: compact ? "14px 20px" : "16px 22px",
				backgroundColor:
					highlight > 0.3
						? `rgba(59, 130, 246, ${0.15 + highlight * 0.2})`
						: premiumTheme.colors.cardBg,
				borderRadius: premiumTheme.radius.card,
				borderLeft: `4px solid rgba(59, 130, 246, ${0.6 + highlight * 0.35})`,
				boxShadow: highlight > 0.3 ? premiumTheme.shadow.cardActive : premiumTheme.shadow.card,
				backdropFilter: "blur(8px)",
			}}
		>
			<p
				style={{
					margin: 0,
					fontSize,
					lineHeight: 1.5,
					fontWeight: isActive ? 500 : 400,
					color: isActive ? premiumTheme.colors.textBulletActive : premiumTheme.colors.textBullet,
				}}
			>
				{render(title)}
			</p>
			{subPoints && subPoints.length > 0 && (
				<ul
					style={{
						margin: "10px 0 0",
						paddingLeft: 18,
						fontSize: fontSize * 0.88,
						color: premiumTheme.colors.textSecondary,
						lineHeight: 1.45,
					}}
				>
					{subPoints.map((sp, i) => (
						<li key={i} style={{ marginBottom: 4 }}>
							{sp}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

interface BulletRowProps {
	text: string;
	fontSize: number;
	highlight?: number;
	entranceProgress?: number;
	compact?: boolean;
	emphasisRenderer?: (text: string) => React.ReactNode;
}

export const BulletRow: React.FC<BulletRowProps> = ({
	text,
	fontSize,
	highlight = 0,
	entranceProgress = 1,
	compact = false,
	emphasisRenderer,
}) => {
	const isActive = highlight > 0.5;
	const render = emphasisRenderer ?? ((t: string) => t);

	return (
		<div
			style={{
				opacity: entranceProgress,
				transform: `translateX(${interpolate(entranceProgress, [0, 1], [-24, 0])}px)`,
				display: "flex",
				alignItems: "flex-start",
				gap: compact ? 14 : 16,
				padding: compact ? "14px 20px" : "16px 22px",
				backgroundColor:
					highlight > 0.3
						? `rgba(59, 130, 246, ${0.15 + highlight * 0.2})`
						: premiumTheme.colors.cardBg,
				borderRadius: premiumTheme.radius.card,
				borderLeft: `4px solid rgba(59, 130, 246, ${0.6 + highlight * 0.35})`,
				boxShadow: highlight > 0.3 ? premiumTheme.shadow.cardActive : premiumTheme.shadow.card,
				backdropFilter: "blur(8px)",
			}}
		>
			<div
				style={{
					width: 8,
					height: 8,
					marginTop: fontSize * 0.45,
					borderRadius: "50%",
					backgroundColor: isActive ? premiumTheme.colors.accentBlueLight : premiumTheme.colors.accentBlue,
					flexShrink: 0,
					boxShadow: isActive ? `0 0 12px rgba(59, 130, 246, 0.6)` : undefined,
				}}
			/>
			<p
				style={{
					margin: 0,
					fontSize,
					lineHeight: 1.5,
					flex: 1,
					fontWeight: isActive ? 500 : 400,
					color: isActive ? premiumTheme.colors.textBulletActive : premiumTheme.colors.textBullet,
				}}
			>
				{render(text)}
			</p>
		</div>
	);
};
