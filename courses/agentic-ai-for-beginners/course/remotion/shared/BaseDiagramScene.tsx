// Base Diagram Scene - Light background with SVG animations
import React, { useEffect, useState, useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate, staticFile, Easing } from 'remotion';
import { DiagramSceneProps, COLORS, MOTION_CONFIG } from './types';
import { useModuleTimings } from '../../../../../src/hooks/useModuleTimings';

interface BaseDiagramSceneProps extends DiagramSceneProps {
	children?: React.ReactNode; // For custom SVG rendering with animations
	animationSpecPath?: string; // Optional path to animation.json for SVG animations
	layout?: "full" | "two-card"; // Layout mode: full-screen SVG or content + SVG split
	contentPoints?: string[]; // Bullet points to show on left side (for two-card layout)
	slideName?: string; // Slide name for word timings
	moduleNumber?: number; // Module number for word timings
	audioDuration?: number; // Audio duration for timing
}

interface AnimationPhase {
	start: number;
	end: number;
	phase?: number; // Phase number (1, 2, 3, 4) for data-phase attribute
	show?: string[]; // Group IDs to show (full opacity)
	dim?: string[]; // Group IDs to dim (low opacity)
	highlight?: string[]; // Group IDs to highlight
	classes?: Record<string, string[]>; // CSS classes to apply to groups: { "part-chat": ["group1", "group2"] }
	animations?: Record<string, any>; // Animation configs per group
	/** When present, phase boundaries are driven by first occurrence of these words in the script (narration order). */
	triggerWords?: string[];
}

interface AnimationSpec {
	diagram: string;
	phases: AnimationPhase[];
}

export const BaseDiagramScene: React.FC<BaseDiagramSceneProps> = ({
	durationInFrames,
	cuePoints = [],
	title,
	svgPath,
	highlights = [],
	children,
	animationSpecPath,
	layout = "full",
	contentPoints = [],
	slideName,
	moduleNumber = 1,
	audioDuration,
}) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const config = MOTION_CONFIG.diagram;
	const t = frame / fps;
	
	const [spec, setSpec] = useState<AnimationSpec | null>(null);
	const [svgContent, setSvgContent] = useState<string | null>(null);

	const { timings } = useModuleTimings(moduleNumber ?? 1);

	const words = useMemo(() => {
		if (!slideName || !timings?.slides) return [];
		return timings.slides[slideName]?.words ?? [];
	}, [slideName, timings]);

	const phaseBoundaries = useMemo((): { start: number; end: number; phaseIndex?: number }[] | null => {
		if (!spec?.phases?.length) return null;
		const n = spec.phases.length;
		
		// If we have words, try to use triggerWords for phase boundaries
		if (words.length > 0) {
			const hasTriggerWords = spec.phases.some((p) => (p as AnimationPhase).triggerWords?.length);
			if (hasTriggerWords) {
				const hits: { phaseIndex: number; start: number }[] = [];
				for (let i = 0; i < n; i++) {
					const triggers = (spec.phases[i] as AnimationPhase).triggerWords;
					if (!triggers?.length) {
						// Phase has no triggerWords - use spec time or interpolate
						const phaseStart = spec.phases[i].start;
						// Try to map spec time to word timing
						const audioDuration = words[words.length - 1]?.end ?? 0;
						const specDuration = spec.phases[spec.phases.length - 1]?.end ?? 0;
						if (specDuration > 0 && audioDuration > 0) {
							const mappedStart = (phaseStart / specDuration) * audioDuration;
							hits.push({ phaseIndex: i, start: mappedStart });
						} else {
							hits.push({ phaseIndex: i, start: phaseStart });
						}
						continue;
					}
					const lower = triggers.map((w) => w.toLowerCase());
					const first = words.find((w) => lower.includes((w.text || "").toLowerCase()));
					if (first) {
						hits.push({ phaseIndex: i, start: first.start });
					} else {
						// Trigger word not found - fall back to spec time mapped to audio
						const phaseStart = spec.phases[i].start;
						const audioDuration = words[words.length - 1]?.end ?? 0;
						const specDuration = spec.phases[spec.phases.length - 1]?.end ?? 0;
						if (specDuration > 0 && audioDuration > 0) {
							const mappedStart = (phaseStart / specDuration) * audioDuration;
							hits.push({ phaseIndex: i, start: mappedStart });
						} else {
							hits.push({ phaseIndex: i, start: phaseStart });
						}
					}
				}
				
				// Ensure ALL phases are represented
				if (hits.length < n) {
					// Fill in missing phases using spec times
					for (let i = 0; i < n; i++) {
						if (!hits.find(h => h.phaseIndex === i)) {
							const phaseStart = spec.phases[i].start;
							const audioDuration = words[words.length - 1]?.end ?? 0;
							const specDuration = spec.phases[spec.phases.length - 1]?.end ?? 0;
							if (specDuration > 0 && audioDuration > 0) {
								const mappedStart = (phaseStart / specDuration) * audioDuration;
								hits.push({ phaseIndex: i, start: mappedStart });
							} else {
								hits.push({ phaseIndex: i, start: phaseStart });
							}
						}
					}
				}
				
				if (hits.length === 0) return null;
				hits.sort((a, b) => a.start - b.start);
				const lastEnd = words[words.length - 1]?.end ?? 0;
				const boundaries: { start: number; end: number; phaseIndex?: number }[] = [];
				for (let j = 0; j < hits.length; j++) {
					const start = hits[j].start;
					const end = j < hits.length - 1 ? hits[j + 1].start : lastEnd;
					boundaries.push({ start, end, phaseIndex: hits[j].phaseIndex });
				}
				return boundaries;
			}
			
			// No triggerWords - divide words evenly across phases
			const wpp = Math.ceil(words.length / n);
			const boundaries: { start: number; end: number; phaseIndex?: number }[] = [];
			for (let i = 0; i < n; i++) {
				const si = i * wpp;
				const ei = Math.min((i + 1) * wpp - 1, words.length - 1);
				const startWord = words[si];
				const endWord = words[ei];
				if (startWord && endWord) {
					boundaries.push({ start: startWord.start, end: endWord.end, phaseIndex: i });
				} else {
					boundaries.push({ start: 0, end: 0, phaseIndex: i });
				}
			}
			return boundaries;
		}
		
		// No words - return null to use spec times directly
		return null;
	}, [spec?.phases, words]);

	const specTotalDuration = spec?.phases?.length
		? (spec.phases[spec.phases.length - 1]?.end ?? 0)
		: 0;
	const sceneDurationSeconds = durationInFrames / fps;
	
	// FIX: If spec duration is much shorter than scene duration, scale phases to match scene
	// This prevents blank screens when animation.json times don't match actual audio duration
	const scalePhases = specTotalDuration > 0 && sceneDurationSeconds > 0 && specTotalDuration < sceneDurationSeconds * 0.8;
	const tForPhase = scalePhases
		? Math.min(t * (specTotalDuration / sceneDurationSeconds), specTotalDuration)
		: t;
	
	// FIX: If spec duration is shorter than scene, extend last phase to cover full scene
	// This prevents blank screens when animation.json times don't match actual audio duration
	if (spec?.phases?.length && specTotalDuration > 0 && specTotalDuration < sceneDurationSeconds * 0.8) {
		const lastPhase = spec.phases[spec.phases.length - 1];
		if (lastPhase) {
			lastPhase.end = Math.max(lastPhase.end, sceneDurationSeconds);
		}
	}

	// Title entrance
	const titleSpring = spring({
		frame,
		fps,
		config: { damping: config.damping, stiffness: config.stiffness },
		durationInFrames: fps * 0.5,
	});

	// Diagram container entrance (delayed)
	const diagramSpring = spring({
		frame,
		fps,
		config: { damping: config.damping + 2, stiffness: config.stiffness - 10 },
		delay: fps * 0.3,
		durationInFrames: fps * 0.6,
	});

	// Title transforms
	const titleOpacity = titleSpring;
	const titleY = interpolate(titleSpring, [0, 1], [20, 0]);

	// Diagram transforms
	const diagramOpacity = diagramSpring;
	const diagramY = interpolate(diagramSpring, [0, 1], [30, 0]);
	const diagramScaleTwoCard = interpolate(diagramSpring, [0, 1], [0.95, 1]);

	// Decorative accent line
	const lineSpring = spring({
		frame,
		fps,
		config: { damping: 20, stiffness: 80 },
		delay: fps * 0.2,
	});
	const lineWidth = interpolate(lineSpring, [0, 1], [0, 100]);
	
	// Auto-detect animation spec path from SVG path if not provided
	const detectedAnimationSpecPath = animationSpecPath || (svgPath ? svgPath.replace('.svg', '.animation.json') : undefined);
	
	// Load animation spec if SVG path is provided
	useEffect(() => {
		if (!svgPath) return;
		
		const specPath = detectedAnimationSpecPath;
		if (!specPath) return;
		
		const loadSpec = async () => {
			try {
				const response = await fetch(staticFile(specPath));
				if (response.ok) {
					// Always read as text first to check if it's JSON
					const text = await response.text();
					
					// Check if response is HTML (error page)
					if (text.trim().startsWith('<!')) {
						console.log(`Animation spec at ${specPath} returned HTML instead of JSON, using static SVG`);
						return;
					}
					
					// Try to parse as JSON
					try {
						const data = JSON.parse(text);
						setSpec(data);
					} catch (parseError) {
						console.log(`Failed to parse animation spec at ${specPath} as JSON, using static SVG`, parseError);
					}
				} else {
					// No animation spec found - that's okay, will use static SVG
					console.log(`No animation spec found at ${specPath} (${response.status}), using static SVG`);
				}
			} catch (error) {
				// No animation spec - that's okay
				console.log(`Animation spec not available: ${specPath}, using static SVG`, error);
			}
		};
		
		loadSpec();
	}, [svgPath, detectedAnimationSpecPath]);
	
	// Load SVG content if svgPath is provided
	useEffect(() => {
		if (!svgPath) return;
		
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
	
	// Resolve current phase: use word timings when available, else scaled spec times
	const useWordTimings = Boolean(slideName && phaseBoundaries && spec?.phases?.length);
	let currentPhaseIndex: number;
	let phaseStartSeconds: number;
	let phaseEndSeconds: number;

	if (useWordTimings && phaseBoundaries && phaseBoundaries.length > 0) {
		// Use word-driven phase boundaries
		// Find boundary that contains current time
		let seg = phaseBoundaries.findIndex((b) => t >= b.start && t < b.end);
		
		if (seg < 0) {
			// Time is outside all boundaries - find closest phase
			const firstStart = phaseBoundaries[0]?.start ?? 0;
			const lastEnd = phaseBoundaries[phaseBoundaries.length - 1]?.end ?? sceneDurationSeconds;
			
			if (t < firstStart) {
				// Before first phase - use first phase
				seg = 0;
			} else if (t >= lastEnd) {
				// After last phase - use last phase
				seg = phaseBoundaries.length - 1;
			} else {
				// Between boundaries (shouldn't happen, but handle it)
				// Find the boundary with the closest start time
				seg = phaseBoundaries.reduce((closest, b, idx) => {
					const closestDist = Math.abs(t - (phaseBoundaries[closest]?.start ?? 0));
					const currentDist = Math.abs(t - b.start);
					return currentDist < closestDist ? idx : closest;
				}, 0);
			}
		}
		
		const b = phaseBoundaries[seg];
		if (!b) {
			// Fallback - shouldn't happen but handle it
			currentPhaseIndex = 0;
			phaseStartSeconds = 0;
			phaseEndSeconds = sceneDurationSeconds;
		} else {
			// Use phaseIndex from boundary if available, otherwise use seg index
			currentPhaseIndex = typeof b.phaseIndex === "number" ? b.phaseIndex : seg;
			phaseStartSeconds = b.start;
			phaseEndSeconds = b.end;
		}
	} else {
		// Use spec times directly (scaled if needed)
		currentPhaseIndex = spec?.phases.findIndex(
			(p) => tForPhase >= p.start && tForPhase < p.end
		) ?? -1;
		
		// If no phase matches, find the appropriate phase
		if (currentPhaseIndex < 0 && spec?.phases?.length) {
			// Find last phase that has started (for times beyond last phase)
			for (let i = spec.phases.length - 1; i >= 0; i--) {
				if (tForPhase >= spec.phases[i].start) {
					currentPhaseIndex = i;
					break;
				}
			}
			// If still before first phase, use first phase
			if (currentPhaseIndex < 0) {
				currentPhaseIndex = 0;
			}
		}
		
		const p = currentPhaseIndex >= 0 ? spec?.phases[currentPhaseIndex] : null;
		phaseStartSeconds = p?.start ?? 0;
		phaseEndSeconds = p?.end ?? (p ? p.end : sceneDurationSeconds);
	}

	// Get current phase - ensure we always have a valid phase if spec exists
	// Validate phaseIndex is within bounds
	const validPhaseIndex = currentPhaseIndex >= 0 && currentPhaseIndex < (spec?.phases?.length ?? 0)
		? currentPhaseIndex
		: (spec?.phases?.length ? 0 : -1);
	
	const currentPhase = validPhaseIndex >= 0 && spec?.phases?.[validPhaseIndex]
		? spec.phases[validPhaseIndex]
		: (spec?.phases?.[0] ?? null);
	
	// Update currentPhaseIndex to valid value for consistency
	currentPhaseIndex = validPhaseIndex;
	
	// Debug: Log phase resolution (only in development)
	if (process.env.NODE_ENV === 'development' && spec && currentPhase) {
		if (frame % (fps * 2) === 0) { // Log every 2 seconds
			console.log(`[BaseDiagramScene] t=${t.toFixed(2)}s, phase=${currentPhaseIndex}, show=[${currentPhase.show?.join(', ') || 'none'}], dim=[${currentPhase.dim?.join(', ') || 'none'}]`);
		}
	}

	const phaseDurationSeconds = phaseEndSeconds - phaseStartSeconds;
	const timeInPhase = useWordTimings ? t - phaseStartSeconds : tForPhase - phaseStartSeconds;
	
	// Get opacity for a group ID - RESPECT PHASE TIMINGS
	const getGroupOpacity = (groupId: string): number => {
		if (!currentPhase) {
			return 1; // No phase = show everything (fallback)
		}
		
		// If show array is empty or undefined, show everything (progressive reveal not configured)
		// This handles cases where animation.json doesn't specify show/dim
		if (!currentPhase.show || currentPhase.show.length === 0) {
			// Check if this element should be dimmed
			if (currentPhase.dim && currentPhase.dim.includes(groupId)) {
				return 0.15; // Dimmed
			}
			return 1; // Show all by default when no show array
		}
		
		// Progressive reveal mode - RESPECT THE PHASE CONFIGURATION
		if (currentPhase.show.includes(groupId)) {
			return 1; // Fully visible - element is in show array
		} else if (currentPhase.dim && currentPhase.dim.includes(groupId)) {
			return 0.15; // Dimmed - element is explicitly dimmed
		} else {
			// Not in show array and not in dim array = HIDE IT (opacity 0)
			// This is correct - phases control what's visible
			return 0;
		}
	};
	
	// Get highlight state
	const isHighlighted = (groupId: string): boolean => {
		return currentPhase?.highlight?.includes(groupId) || false;
	};
	
	// Get CSS classes for a group ID based on current phase
	const getGroupClasses = (groupId: string): string[] => {
		if (!currentPhase || !currentPhase.classes) return [];
		
		const classes: string[] = [];
		for (const [className, groupIds] of Object.entries(currentPhase.classes)) {
			if (groupIds.includes(groupId)) {
				classes.push(className);
			}
		}
		return classes;
	};
	
	// Get animation style for a group
	const getGroupAnimationStyle = (groupId: string): string => {
		if (!currentPhase || !currentPhase.animations) return "";
		
		const anim = currentPhase.animations[groupId];
		if (!anim) return "";
		
		const styles: string[] = [];
		
		// Transform animations
		if (anim.transform) {
			if (anim.transform.translateY) {
				styles.push(`transform: translateY(${anim.transform.translateY}px)`);
			}
			if (anim.transform.scale) {
				const scale = anim.transform.scale;
				// Pulse animation
				if (anim.pulse) {
					const pulsePhase = (t % anim.pulse.duration) / anim.pulse.duration;
					const pulseScale = interpolate(
						pulsePhase,
						[0, 0.5, 1],
						[scale, scale * 1.05, scale],
						{ extrapolateLeft: "clamp", extrapolateRight: "clamp" }
					);
					styles.push(`transform: scale(${pulseScale.toFixed(3)})`);
				} else {
					styles.push(`transform: scale(${scale})`);
				}
			}
		}
		
		// Filter/glow effects
		if (anim.glow) {
			const color = anim.glow.color || "rgba(59, 130, 246, 0.9)";
			const size = anim.glow.size || 14;
			styles.push(`filter: drop-shadow(0 0 ${size}px ${color})`);
		}
		
		return styles.length > 0 ? `style="${styles.join("; ")}"` : "";
	};
	
	// Normalize SVG for full-viewport scaling: fill container, center via preserveAspectRatio, block layout
	const normalizeSvgForScaling = (raw: string): string => {
		if (!raw || !raw.trim().startsWith('<svg')) return raw;
		return raw.replace(
			/<svg(\s[^>]*?)>/i,
			(_, attrs) => {
				let a = attrs
					.replace(/\s*width=["'][^"']*["']/gi, '')
					.replace(/\s*height=["'][^"']*["']/gi, '')
					.replace(/\s*style=["'][^"']*["']/gi, '');
				if (!/preserveAspectRatio=/i.test(a)) {
					a += ' preserveAspectRatio="xMidYMid meet"';
				}
				a += ' width="100%" height="100%" style="display:block"';
				return `<svg${a}>`;
			}
		);
	};

	// Get link animation style
	const getLinkAnimationStyle = (linkId: string): string => {
		if (!currentPhase || !currentPhase.animations) return "";
		
		const anim = currentPhase.animations[linkId];
		if (!anim || !anim.flow) return "";
		
		// Animated stroke with dash-array
		const dashLength = anim.flow.dashLength || 4;
		const speed = anim.flow.speed || 0.6;
		const offset = (t % speed) * (dashLength * 2);
		
		return `style="stroke: ${anim.flow.color || "#38bdf8"}; stroke-dasharray: ${dashLength} ${dashLength}; stroke-dashoffset: ${offset.toFixed(1)};"`;
	};
	
	// Process SVG content to apply animations using inline styles (works better in Remotion)
	const processSvgContent = (content: string): string => {
		if (!content) return content;
		
		let processed = content;
		const phaseDuration = phaseDurationSeconds;
		
		// If no phase, normalize and return (no animations, but visible)
		// This should rarely happen if spec is loaded correctly
		if (!currentPhase) {
			return normalizeSvgForScaling(processed);
		}
		
		// Normalize for scaling first, then apply phase-based opacity/styles
		processed = normalizeSvgForScaling(processed);
		// Process groups with IDs - apply animations based on phase
		const groupRegex = /<g\s+([^>]*id=["']([^"']+)["'][^>]*)>/gi;
		let match;
		const processedGroups = new Set<string>();
		
		while ((match = groupRegex.exec(content)) !== null) {
			const fullMatch = match[0];
			const groupId = match[2];
			
			// Avoid processing the same group twice
			if (processedGroups.has(groupId)) continue;
			processedGroups.add(groupId);
			
			const attributes = match[1];
			
			// Get opacity, highlight, and classes for this group
			const opacity = getGroupOpacity(groupId);
			const highlighted = isHighlighted(groupId);
			const classes = getGroupClasses(groupId);
			
			// Debug: Log if element should be visible but opacity is 0
			if (opacity === 0 && currentPhase?.show?.includes(groupId)) {
				console.warn(`[BaseDiagramScene] Group "${groupId}" is in show array but opacity is 0. Phase: ${currentPhaseIndex}, show: ${currentPhase.show.join(', ')}`);
			}
			
			// Entrance/exit transitions - RESPECT PHASE TIMINGS
			let smoothOpacity = opacity;
			let entranceScale = 1;
			let entranceX = 0;
			let entranceY = 0;
			
			// Only apply entrance animation if element is appearing (opacity going from 0 to >0)
			// Check if this is a phase transition where element becomes visible
			const fadeDuration = 0.3;
			if (phaseDuration > 0 && fadeDuration > 0 && opacity > 0) {
				const fadeStart = Math.min(fadeDuration, phaseDuration * 0.2);
				
				if (timeInPhase < fadeStart) {
					// Entrance: fade in from 0 to target opacity
					const entranceProgress = Math.min(1, timeInPhase / fadeStart);
					smoothOpacity = interpolate(
						entranceProgress,
						[0, 1],
						[0, opacity], // Start at 0, fade to target opacity
						{ easing: Easing.out(Easing.quad), extrapolateLeft: "clamp", extrapolateRight: "clamp" }
					);
					entranceScale = interpolate(
						entranceProgress,
						[0, 1],
						[0.9, 1], // Subtle scale
						{ easing: Easing.out(Easing.quad), extrapolateLeft: "clamp", extrapolateRight: "clamp" }
					);
				} else {
					// Normal state - use target opacity
					smoothOpacity = opacity;
				}
			} else {
				// No animation - use target opacity directly
				smoothOpacity = opacity;
			}
			
			// Build style string based on phase and classes
			let styleParts: string[] = [];
			
			// FIX: Always ensure opacity is set - never let it be 0 or undefined
			if (smoothOpacity > 0) {
				styleParts.push(`opacity: ${smoothOpacity.toFixed(3)}`);
			} else {
				// Fallback: if opacity is 0 or invalid, use base opacity
				styleParts.push(`opacity: ${opacity > 0 ? opacity : 0.5}`);
			}
			
			// Apply phase-specific animations based on CSS classes
			const phaseNumber = currentPhase?.phase ?? (currentPhaseIndex >= 0 ? currentPhaseIndex + 1 : 0);
			
			// DRAMATIC pulsing animation for highlighted elements - much more visible
			if (highlighted && smoothOpacity > 0.5) {
				const pulsePhase = (t % 1.5) / 1.5; // Faster, more noticeable pulse (1.5s cycle)
				const pulseGlow = interpolate(
					pulsePhase,
					[0, 0.5, 1],
					[15, 35, 15], // Much larger glow - was 8-16, now 15-35
					{ extrapolateLeft: "clamp", extrapolateRight: "clamp" }
				);
				const pulseScale = interpolate(
					pulsePhase,
					[0, 0.5, 1],
					[1, 1.08, 1], // More dramatic scale - was 1.02, now 1.08
					{ extrapolateLeft: "clamp", extrapolateRight: "clamp" }
				);
				styleParts.push(`transform: scale(${pulseScale.toFixed(3)})`);
				// Double glow for extra visibility
				styleParts.push(`filter: drop-shadow(0 0 ${pulseGlow.toFixed(1)}px rgba(59, 130, 246, 0.9)) drop-shadow(0 0 ${pulseGlow * 1.5}px rgba(139, 92, 246, 0.6))`);
			} else if (smoothOpacity > 0.7 && !highlighted) {
				// Continuous subtle animation for visible elements (keeps diagram alive)
				const subtlePhase = (t % 3.0) / 3.0; // 3 second subtle cycle
				const subtleGlow = interpolate(
					subtlePhase,
					[0, 0.5, 1],
					[3, 6, 3], // Slightly more visible - was 2-4, now 3-6
					{ extrapolateLeft: "clamp", extrapolateRight: "clamp" }
				);
				const subtleScale = interpolate(
					subtlePhase,
					[0, 0.5, 1],
					[1, 1.02, 1], // Very subtle breathing
					{ extrapolateLeft: "clamp", extrapolateRight: "clamp" }
				);
				// Only add transform if we don't already have one from highlighted
				if (styleParts.filter(s => s.includes("transform")).length === 0) {
					styleParts.push(`transform: translate(${entranceX.toFixed(1)}px, ${entranceY.toFixed(1)}px) scale(${(entranceScale * subtleScale).toFixed(3)})`);
				}
				// Only add filter if we don't already have one from highlighted
				if (styleParts.filter(s => s.includes("filter")).length === 0) {
					styleParts.push(`filter: drop-shadow(0 0 ${subtleGlow.toFixed(1)}px rgba(100, 116, 139, 0.4))`);
				}
			} else if (smoothOpacity > 0) {
				// For dimmed elements, still ensure they have transform/opacity
				if (styleParts.filter(s => s.includes("transform")).length === 0) {
					styleParts.push(`transform: translate(${entranceX.toFixed(1)}px, ${entranceY.toFixed(1)}px) scale(${entranceScale.toFixed(3)})`);
				}
			}
			
			// Phase-specific animations
			if (classes.includes("part-chat") && phaseNumber === 1) {
				styleParts.push("transform: translateY(-4px)");
				styleParts.push("filter: drop-shadow(0 0 14px rgba(56, 189, 248, 0.9))");
			}
			
			if (classes.includes("part-tools") && phaseNumber === 2) {
				styleParts.push("filter: drop-shadow(0 0 10px rgba(96, 165, 250, 0.9))");
			}
			
			if (classes.includes("part-agent") && phaseNumber === 3) {
				// Pulse animation
				const pulsePhase = (timeInPhase % 1.2) / 1.2;
				const pulseScale = interpolate(
					pulsePhase,
					[0, 0.5, 1],
					[1, 1.05, 1],
					{ extrapolateLeft: "clamp", extrapolateRight: "clamp" }
				);
				const pulseGlow = interpolate(
					pulsePhase,
					[0, 0.5, 1],
					[10, 18, 10],
					{ extrapolateLeft: "clamp", extrapolateRight: "clamp" }
				);
				styleParts.push(`transform: scale(${pulseScale.toFixed(3)})`);
				styleParts.push(`filter: drop-shadow(0 0 ${pulseGlow.toFixed(1)}px rgba(244, 114, 182, 0.9))`);
			}
			
			if (classes.includes("part-actions") && phaseNumber === 4) {
				styleParts.push("filter: drop-shadow(0 0 16px rgba(34, 197, 94, 0.95))");
			}
			
			// Build new attributes
			let newAttributes = attributes.replace(/opacity=["'][^"']*["']/gi, "");
			newAttributes = newAttributes.replace(/style=["'][^"']*["']/gi, "");
			
			// Set opacity - RESPECT PHASE TIMINGS (can be 0 if element should be hidden)
			newAttributes += ` opacity="${smoothOpacity.toFixed(3)}"`;
			
			// Remove opacity from styleParts if it's there (opacity attribute takes precedence)
			const stylePartsWithoutOpacity = styleParts.filter(s => !s.startsWith("opacity:"));
			if (stylePartsWithoutOpacity.length > 0) {
				newAttributes += ` style="${stylePartsWithoutOpacity.join("; ")}"`;
			}
			
			const newGroupTag = `<g ${newAttributes}>`;
			processed = processed.replace(fullMatch, newGroupTag);
		}
		
		// Process ALL lines/paths - animate connections when both connected elements are active
		// This makes arrows/connections much more visible and engaging
		const linkRegex = /<(line|path)\s+([^>]*)>/gi;
		let linkMatch;
		
		while ((linkMatch = linkRegex.exec(content)) !== null) {
			const fullMatch = linkMatch[0];
			const tag = linkMatch[1];
			const attributes = linkMatch[2];
			
			// Determine if this line connects active elements
			// Check if line connects to/from active elements based on coordinates
			// For agentic-architecture: lines connect planner→evaluator, tools→evaluator, etc.
			let shouldAnimate = false;
			let lineColor = "#64748b"; // Default gray
			let lineWidth = 2;
			
			// Check if both source and target elements are in show array
			if (currentPhase?.show) {
				const showCount = currentPhase.show.length;
				// If 2+ elements are shown, likely a connection is active
				if (showCount >= 2) {
					shouldAnimate = true;
					// Color based on which elements are active
					if (currentPhase.show.includes("planner") && currentPhase.show.includes("evaluator")) {
						lineColor = "#8b5cf6"; // Purple for planning
						lineWidth = 3;
					} else if (currentPhase.show.includes("tools") && currentPhase.show.includes("evaluator")) {
						lineColor = "#10b981"; // Green for tools
						lineWidth = 3;
					} else if (currentPhase.show.includes("memory") && currentPhase.show.includes("evaluator")) {
						lineColor = "#f59e0b"; // Orange for memory
						lineWidth = 3;
					} else if (currentPhase.show.includes("environment") && currentPhase.show.includes("evaluator")) {
						lineColor = "#ef4444"; // Red for safety
						lineWidth = 3;
					}
				}
			}
			
			if (shouldAnimate) {
				// Animated stroke drawing effect - much more visible
				const dashLength = 10; // Larger dashes - was 4
				const speed = 0.8; // Slightly slower for visibility
				const offset = ((t % speed) / speed) * (dashLength * 2);
				
				let newAttributes = attributes
					.replace(/stroke=["'][^"']*["']/gi, "")
					.replace(/stroke-width=["'][^"']*["']/gi, "")
					.replace(/stroke-dasharray=["'][^"']*["']/gi, "")
					.replace(/stroke-dashoffset=["'][^"']*["']/gi, "")
					.replace(/style=["'][^"']*["']/gi, "");
				
				newAttributes += ` stroke="${lineColor}" stroke-width="${lineWidth}" stroke-dasharray="${dashLength} ${dashLength}" stroke-dashoffset="${offset.toFixed(1)}"`;
				
				const newLinkTag = `<${tag} ${newAttributes}>`;
				processed = processed.replace(fullMatch, newLinkTag);
			}
		}
		
		return processed;
	};

	const isTwoCard = layout === "two-card" && contentPoints.length > 0;
	
	// Progressive highlighting for two-card layout
	const currentTimeSeconds = frame / fps;
	const entranceTime = 0.3;
	
	const getPointHighlight = (index: number): number => {
		if (!isTwoCard || !audioDuration || audioDuration <= 0) return 0;
		if (currentTimeSeconds < entranceTime) return 0;
		
		const introTime = audioDuration * 0.15;
		const contentDuration = audioDuration * 0.80;
		const timePerPoint = contentDuration / contentPoints.length;
		
		const pointStartTime = entranceTime + introTime + index * timePerPoint;
		const pointEndTime = pointStartTime + timePerPoint;
		
		if (currentTimeSeconds < pointStartTime) return 0;
		if (currentTimeSeconds > pointEndTime) return 0.12;
		
		const progress = (currentTimeSeconds - pointStartTime) / timePerPoint;
		if (progress < 0.12) return interpolate(progress, [0, 0.12], [0, 1]);
		if (progress > 0.88) return interpolate(progress, [0.88, 1], [1, 0.12]);
		return 1;
	};

	// Point spring animations for two-card
	const getPointSpring = (index: number) => {
		if (!isTwoCard) return 1;
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

	return (
		<div
			style={{
				width: '100%',
				height: '100%',
				background: isTwoCard 
					? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'
					: COLORS.light.background,
				display: 'flex',
				flexDirection: isTwoCard ? 'row' : 'column',
				padding: isTwoCard ? 0 : 48,
				fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
				overflow: 'hidden',
				position: 'relative',
			}}
		>
			{/* Subtle background pattern */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					opacity: 0.03,
					backgroundImage: `radial-gradient(circle at 2px 2px, ${COLORS.light.muted} 1px, transparent 0)`,
					backgroundSize: '40px 40px',
				}}
			/>

			{/* Accent line at top */}
			<div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					width: `${lineWidth}%`,
					height: 4,
					background: `linear-gradient(90deg, ${COLORS.light.accent} 0%, ${COLORS.light.secondary} 100%)`,
				}}
			/>

			{/* Two-card layout: Content on left */}
			{isTwoCard && (
				<div
					style={{
						width: '50%',
						height: '100%',
						display: 'flex',
						flexDirection: 'column',
						padding: 80,
						position: 'relative',
						zIndex: 1,
						borderRight: '2px solid rgba(59, 130, 246, 0.2)',
					}}
				>
					<h2
						style={{
							fontSize: 56,
							fontWeight: 800,
							margin: 0,
							marginBottom: 60,
							opacity: titleOpacity,
							transform: `translateY(${titleY}px)`,
							color: COLORS.light.text,
							letterSpacing: '-0.02em',
							lineHeight: 1.2,
						}}
					>
						{title}
					</h2>
					<div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
						{contentPoints.map((point, index) => {
							const pointSpring = getPointSpring(index);
							const pointOpacity = pointSpring;
							const pointX = interpolate(pointSpring, [0, 1], [-30, 0]);
							const pointScale = interpolate(pointSpring, [0, 1], [0.95, 1]);
							const highlight = getPointHighlight(index);
							const isActive = highlight > 0.5;
							const breathe = isActive ? Math.sin(frame / 15) * 0.02 : 0;
							const activeScale = 1 + highlight * 0.03 + breathe;
							const glowSize = 20 + highlight * 25;
							const glowOpacity = highlight * 0.8;

							return (
								<div
									key={index}
									style={{
										opacity: pointOpacity,
										transform: `translateX(${pointX}px) scale(${pointScale * activeScale})`,
										display: 'flex',
										alignItems: 'flex-start',
										gap: 20,
										padding: '20px 24px',
										backgroundColor: highlight > 0.3
											? `rgba(59, 130, 246, ${0.18 + highlight * 0.25})`
											: 'rgba(30, 41, 59, 0.65)',
										borderRadius: 14,
										borderLeft: `4px solid rgba(59, 130, 246, ${0.7 + highlight * 0.3})`,
										boxShadow: highlight > 0.3
											? `0 0 ${glowSize}px rgba(59, 130, 246, ${glowOpacity}), 0 0 ${glowSize * 1.5}px rgba(139, 92, 246, ${glowOpacity * 0.4}), 0 8px 16px -4px rgba(0, 0, 0, 0.4)`
											: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
									}}
								>
									<div
										style={{
											width: 12,
											height: 12,
											backgroundColor: isActive ? '#60a5fa' : '#3b82f6',
											borderRadius: '50%',
											marginTop: 8,
											flexShrink: 0,
											boxShadow: `0 0 ${15 + highlight * 20}px rgba(59, 130, 246, ${0.6 + highlight * 0.6})`,
										}}
									/>
									<p
										style={{
											fontSize: 32,
											margin: 0,
											lineHeight: 1.6,
											flex: 1,
											color: isActive ? '#e0f2fe' : '#f1f5f9',
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
			)}

			{/* Title section (full layout only) - compact so diagram gets more space */}
			{!isTwoCard && (
				<div
					style={{
						position: 'relative',
						zIndex: 1,
						marginBottom: 16,
						flexShrink: 0,
					}}
				>
					<h2
						style={{
							fontSize: 36,
							fontWeight: 700,
							margin: 0,
							opacity: titleOpacity,
							transform: `translateY(${titleY}px)`,
							color: COLORS.light.text,
							letterSpacing: '-0.01em',
						}}
					>
						{title}
					</h2>
					<div
						style={{
							width: interpolate(titleSpring, [0, 1], [0, 120]),
							height: 3,
							background: COLORS.light.accent,
							marginTop: 8,
							borderRadius: 2,
						}}
					/>
				</div>
			)}

			{/*
				Diagram: centered flex container. Wrapper grows (flex 1) to use remaining space;
				SVG fills wrapper with preserveAspectRatio meet so it scales proportionally, centered.
			*/}
			<div
				style={{
					flex: 1,
					minHeight: 0,
					width: isTwoCard ? '50%' : '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					position: 'relative',
					zIndex: 1,
					opacity: diagramOpacity,
					...(isTwoCard && {
						transform: `translateX(${interpolate(diagramSpring, [0, 1], [40, 0])}px) scale(${diagramScaleTwoCard})`,
					}),
					padding: isTwoCard ? 40 : 0,
					background: isTwoCard ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' : 'transparent',
				}}
			>
				{children ? (
					children
				) : svgPath ? (
					<div
						style={{
							width: '100%',
							flex: 1,
							minHeight: 0,
							alignSelf: 'stretch',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						{svgContent ? (
							// FIX: Always process SVG - even if no spec, show it with default styling
							<div
								style={{
									width: '100%',
									height: '100%',
									flex: 1,
									minHeight: 0,
									alignSelf: 'stretch',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
								}}
								dangerouslySetInnerHTML={{ 
									__html: (spec && currentPhase) 
										? processSvgContent(svgContent) 
										: normalizeSvgForScaling(svgContent)
								}}
							/>
						) : (
							<div style={{ 
								width: '100%', 
								flex: 1, 
								minHeight: 0, 
								alignSelf: 'stretch',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								color: COLORS.light.muted
							}}>
								Loading diagram...
							</div>
						)}
					</div>
				) : null}
			</div>

			{/* Module indicator (bottom right) */}
			<div
				style={{
					position: 'absolute',
					bottom: 30,
					right: 40,
					opacity: interpolate(diagramSpring, [0, 1], [0, 0.5]),
					color: COLORS.light.muted,
					fontSize: 14,
					fontWeight: 500,
				}}
			>
				Agentic AI Professional
			</div>
		</div>
	);
};
