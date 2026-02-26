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
		background: '#f8fafc',
		text: '#1e293b',
		accent: '#3b82f6',
		secondary: '#10b981',
		muted: '#64748b',
	},
};
