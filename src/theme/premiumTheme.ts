// Shared visual tokens for premium course slides

export const premiumTheme = {
	colors: {
		bgStart: "#0b1220",
		bgMid: "#1e293b",
		bgEnd: "#0b1220",
		textPrimary: "#ffffff",
		textSecondary: "#94a3b8",
		textBullet: "#f1f5f9",
		textBulletActive: "#e0f2fe",
		accentBlue: "#3b82f6",
		accentBlueLight: "#60a5fa",
		accentBlueMuted: "#93c5fd",
		accentViolet: "#8b5cf6",
		accentGreen: "#22c55e",
		accentRed: "#ef4444",
		cardBg: "rgba(30, 41, 59, 0.65)",
		cardBgActive: "rgba(59, 130, 246, 0.22)",
		svgPanelStart: "#0d2746",
		svgPanelEnd: "#071525",
		codePanel: "#0d1117",
		codeBorder: "rgba(59, 130, 246, 0.25)",
	},
	gradients: {
		slideBg: "linear-gradient(135deg, #0b1220 0%, #1e293b 50%, #0b1220 100%)",
		accentLine: "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #22c55e 100%)",
		titleBorder: "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #22c55e 100%)",
		svgPanel: "linear-gradient(135deg, #0d2746 0%, #071525 100%)",
	},
	typography: {
		fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
		titleLarge: 56,
		titleMedium: 48,
		titleSmall: 42,
		bulletLarge: 28,
		bulletMedium: 26,
		bulletSmall: 22,
		label: 14,
		kicker: 16,
	},
	spacing: {
		slidePadding: 72,
		slidePaddingWide: { top: 72, right: 56, bottom: 72, left: 72 },
		cardGap: 22,
		bulletGap: 16,
		svgPadding: 28,
	},
	radius: {
		card: 16,
		panel: 20,
		svgFrame: 24,
	},
	shadow: {
		svgFrame: "0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(59, 130, 246, 0.2)",
		card: "0 4px 12px -2px rgba(0, 0, 0, 0.35)",
		cardActive: "0 0 24px rgba(59, 130, 246, 0.35), 0 8px 16px -4px rgba(0, 0, 0, 0.4)",
	},
} as const;

export type PremiumTheme = typeof premiumTheme;
