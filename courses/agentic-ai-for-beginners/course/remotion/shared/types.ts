// Shared types for Agentic AI course Remotion scenes

export interface SceneProps {
	durationInFrames: number;
	cuePoints?: number[]; // Frame indices for key reveals
}

export interface IntroSceneProps extends SceneProps {
	title: string;
	subtitle?: string;
	tagline?: string;
}

export interface DiagramSceneProps extends SceneProps {
	title: string;
	/** One-line summary of what this section explains (always visible, never blurred). */
	subtitle?: string;
	/** Section badge, e.g. Concept / Architecture / Application. */
	sectionLabel?: string;
	svgPath: string; // Relative path to SVG
	highlights?: string[]; // Element IDs to highlight in sequence
}

export interface RecapSceneProps extends SceneProps {
	title: string;
	points: string[];
}

// Motion configuration for different scene types
export const MOTION_CONFIG = {
	intro: {
		damping: 10,
		stiffness: 80,
		panScale: 0.03,
		zoomScale: 0.05,
	},
	diagram: {
		damping: 15,
		stiffness: 100,
		staggerDelay: 0.15, // seconds between element reveals
	},
	recap: {
		damping: 20,
		stiffness: 120,
		fadeInDuration: 0.5, // seconds
	},
};

// Common color schemes
export const COLORS = {
	dark: {
		background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
		text: '#ffffff',
		accent: '#3b82f6',
		secondary: '#8b5cf6',
		muted: '#94a3b8',
	},
	light: {
		background: '#f1f5f9',
		text: '#0f172a',
		accent: '#2563eb',
		secondary: '#059669',
		muted: '#64748b',
		panel: '#ffffff',
		panelBorder: '#e2e8f0',
	},
};

export const SECTION_LABEL_STYLES: Record<
	string,
	{ bg: string; border: string; text: string; accent: string }
> = {
	Concept: { bg: '#eff6ff', border: '#3b82f6', text: '#1e40af', accent: '#2563eb' },
	Architecture: { bg: '#f5f3ff', border: '#8b5cf6', text: '#5b21b6', accent: '#7c3aed' },
	Application: { bg: '#ecfdf5', border: '#10b981', text: '#047857', accent: '#059669' },
	'Exam Mapping': { bg: '#fff7ed', border: '#f59e0b', text: '#b45309', accent: '#d97706' },
};
