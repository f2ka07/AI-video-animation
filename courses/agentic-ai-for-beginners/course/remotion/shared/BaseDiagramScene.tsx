// Base Diagram Scene - Light background with SVG animations
import React, { useEffect, useState, useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate, staticFile } from 'remotion';
import { DiagramSceneProps, COLORS, MOTION_CONFIG, SECTION_LABEL_STYLES } from './types';
import { useModuleTimings } from '../../../../../src/hooks/useModuleTimings';
import { computeBulletStarts, computeBulletStartsFromTriggerWords } from '../../../../../src/utils/computeBulletStarts';
import { loadBulletStarts } from '../../../../../src/utils/timingsLoader';

// Slide-safe margins for 1920x1080 presentation video
const SLIDE_MARGIN = {
	top: 56,
	right: 120,
	bottom: 96,
	left: 120,
};

const SLIDE_TYPE = {
	badge: 18,
	meta: 16,
	title: 58,
	subtitle: 32,
	captionEyebrow: 16,
	caption: 34,
	twoCardTitle: 60,
	twoCardBody: 36,
};

interface BaseDiagramSceneProps extends DiagramSceneProps {
	children?: React.ReactNode; // For custom SVG rendering with animations
	animationSpecPath?: string; // Optional path to animation.json for SVG animations
	layout?: "full" | "two-card"; // Layout mode: full-screen SVG or content + SVG split
	contentPoints?: string[]; // Bullet points to show on left side (for two-card layout)
	slideName?: string; // Slide name for word timings
	moduleNumber?: number; // Module number for word timings
	audioDuration?: number; // Audio duration for timing
	/** Optional override; otherwise derived from word timings + contentPoints */
	bulletStarts?: number[];
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
	/** Short line shown while this phase is active (updates as narration progresses). */
	label?: string;
}

interface AnimationSpec {
	diagram: string;
	phases: AnimationPhase[];
	/** Optional per-bullet trigger words synced to narration (two-card layout). */
	bulletTriggerWords?: string[][];
	/** Fallback section summary when subtitle prop is not set on the scene. */
	sectionSummary?: string;
}

export const BaseDiagramScene: React.FC<BaseDiagramSceneProps> = ({
	durationInFrames,
	cuePoints = [],
	title,
	subtitle,
	sectionLabel,
	svgPath,
	highlights = [],
	children,
	animationSpecPath,
	layout = "full",
	contentPoints = [],
	slideName,
	moduleNumber = 1,
	audioDuration,
	bulletStarts: bulletStartsProp,
}) => {
	const frame = useCurrentFrame();
	const { fps, height: videoHeight } = useVideoConfig();
	const config = MOTION_CONFIG.diagram;
	const t = frame / fps;
	
	const [spec, setSpec] = useState<AnimationSpec | null>(null);
	const [svgContent, setSvgContent] = useState<string | null>(null);
	const [savedBulletStarts, setSavedBulletStarts] = useState<Record<string, number[]> | null>(null);

	const { timings } = useModuleTimings(moduleNumber ?? 1);

	useEffect(() => {
		if (!moduleNumber) return;
		loadBulletStarts(moduleNumber)
			.then((data) => setSavedBulletStarts(data))
			.catch(() => setSavedBulletStarts(null));
	}, [moduleNumber]);

	const words = useMemo(() => {
		if (!slideName || !timings?.slides) return [];
		const raw = timings.slides[slideName]?.words ?? [];
		// Ignore broken timing entries (0,0) that break phase end calculations
		return raw.filter((w) => w && typeof w.end === "number" && w.end > 0.05);
	}, [slideName, timings]);

	const isTwoCard = layout === "two-card" && contentPoints.length > 0;
	const sceneDurationSeconds = durationInFrames / fps;

	const slideEndSeconds = useMemo(() => {
		if (words.length > 0) {
			return words[words.length - 1]?.end ?? sceneDurationSeconds;
		}
		if (audioDuration && audioDuration > 0) return audioDuration;
		return sceneDurationSeconds;
	}, [words, audioDuration, sceneDurationSeconds]);

	const resolvedBulletStarts = useMemo((): number[] | null => {
		if (!isTwoCard || contentPoints.length === 0) return null;

		if (bulletStartsProp?.length === contentPoints.length) {
			return bulletStartsProp;
		}

		const saved =
			slideName && savedBulletStarts?.[slideName]?.length === contentPoints.length
				? savedBulletStarts[slideName]
				: null;
		if (saved) return saved;

		if (words.length > 0) {
			const computed = computeBulletStarts(words, contentPoints);
			if (computed?.length === contentPoints.length) return computed;
		}

		if (
			spec?.bulletTriggerWords?.length === contentPoints.length &&
			words.length > 0
		) {
			const fromTriggers = computeBulletStartsFromTriggerWords(
				words,
				spec.bulletTriggerWords
			);
			if (fromTriggers?.length === contentPoints.length) return fromTriggers;
		}

		return null;
	}, [
		isTwoCard,
		contentPoints,
		bulletStartsProp,
		slideName,
		savedBulletStarts,
		words,
		spec?.bulletTriggerWords,
	]);

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
						const phaseStart = spec.phases[i].start;
						const audioDuration = words[words.length - 1]?.end ?? sceneDurationSeconds;
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
					// Match triggers in narration order (after previous phase), not first word in entire slide
					const minStart = hits.length === 0 ? 0 : hits[hits.length - 1].start + 0.25;
					const first = words.find((w) => {
						if (w.start < minStart) return false;
						const t = (w.text || "").toLowerCase();
						return lower.some((trigger) => t === trigger || t.includes(trigger));
					});
					if (first) {
						hits.push({ phaseIndex: i, start: first.start });
					} else {
						const phaseStart = spec.phases[i].start;
						const audioDuration = words[words.length - 1]?.end ?? sceneDurationSeconds;
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
				// Keep narration order by phase index (not sorted by trigger time)
				hits.sort((a, b) => a.phaseIndex - b.phaseIndex);
				const lastWordEnd = words[words.length - 1]?.end ?? 0;
				const slideEnd = Math.max(lastWordEnd, sceneDurationSeconds);
				const boundaries: { start: number; end: number; phaseIndex?: number }[] = [];
				for (let j = 0; j < hits.length; j++) {
					const start = hits[j].start;
					const end = j < hits.length - 1 ? hits[j + 1].start : slideEnd;
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
	}, [spec?.phases, words, sceneDurationSeconds]);

	const specTotalDuration = spec?.phases?.length
		? (spec.phases[spec.phases.length - 1]?.end ?? 0)
		: 0;

	// Scale short animation specs to full slide duration (avoid early cutoff)
	const scalePhases = specTotalDuration > 0 && sceneDurationSeconds > 0 && specTotalDuration < sceneDurationSeconds * 0.8;
	const tForPhase = scalePhases
		? Math.min(t * (specTotalDuration / sceneDurationSeconds), specTotalDuration)
		: t;

	// Effective spec with last phase extended to scene duration (immutable - do not mutate loaded spec)
	const effectivePhases = useMemo(() => {
		if (!spec?.phases?.length) return null;
		if (!(specTotalDuration > 0 && specTotalDuration < sceneDurationSeconds * 0.8)) {
			return spec.phases;
		}
		return spec.phases.map((p, i) =>
			i === spec.phases.length - 1 ? { ...p, end: Math.max(p.end, sceneDurationSeconds) } : p
		);
	}, [spec?.phases, specTotalDuration, sceneDurationSeconds]);

	const phases = effectivePhases ?? spec?.phases ?? [];

	// Title: fade in only (no slide/scale)
	const titleSpring = spring({
		frame,
		fps,
		config: { damping: config.damping, stiffness: config.stiffness },
		durationInFrames: fps * 0.35,
	});

	const titleOpacity = titleSpring;

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
		currentPhaseIndex = phases.findIndex(
			(p) => tForPhase >= p.start && tForPhase < p.end
		) ?? -1;
		
		if (currentPhaseIndex < 0 && phases.length) {
			for (let i = phases.length - 1; i >= 0; i--) {
				if (tForPhase >= phases[i].start) {
					currentPhaseIndex = i;
					break;
				}
			}
			if (currentPhaseIndex < 0) {
				currentPhaseIndex = 0;
			}
		}
		
		const p = currentPhaseIndex >= 0 ? phases[currentPhaseIndex] : null;
		phaseStartSeconds = p?.start ?? 0;
		phaseEndSeconds = p?.end ?? sceneDurationSeconds;
	}

	const validPhaseIndex = currentPhaseIndex >= 0 && currentPhaseIndex < phases.length
		? currentPhaseIndex
		: (phases.length ? 0 : -1);
	
	const currentPhase = validPhaseIndex >= 0 && phases[validPhaseIndex]
		? phases[validPhaseIndex]
		: (phases[0] ?? null);
	
	// Update currentPhaseIndex to valid value for consistency
	currentPhaseIndex = validPhaseIndex;

	const timeInPhase = Math.max(0, t - phaseStartSeconds);
	const REVEAL_EASE_SECONDS = 0.4;

	const allDiagramGroupIds = useMemo(() => {
		const ids = new Set<string>();
		phases.forEach((p) => {
			p.show?.forEach((id) => ids.add(id));
			p.dim?.forEach((id) => ids.add(id));
			p.highlight?.forEach((id) => ids.add(id));
		});
		return ids;
	}, [phases]);

	const hasProgressiveShow = useMemo(
		() => phases.some((p) => (p.show?.length ?? 0) > 0),
		[phases]
	);

	const cumulativeRevealSet = useMemo(() => {
		const set = new Set<string>();
		if (validPhaseIndex < 0) return set;
		for (let i = 0; i <= validPhaseIndex; i++) {
			const p = phases[i];
			p?.show?.forEach((id) => set.add(id));
			p?.highlight?.forEach((id) => set.add(id));
		}
		return set;
	}, [phases, validPhaseIndex]);

	const firstRevealPhaseByGroup = useMemo(() => {
		const map = new Map<string, number>();
		phases.forEach((p, i) => {
			const ids = [...(p.show ?? []), ...(p.highlight ?? [])];
			ids.forEach((id) => {
				if (!map.has(id)) map.set(id, i);
			});
		});
		return map;
	}, [phases]);

	const previouslyHighlightedSet = useMemo(() => {
		const set = new Set<string>();
		if (validPhaseIndex <= 0) return set;
		for (let i = 0; i < validPhaseIndex; i++) {
			phases[i]?.highlight?.forEach((id) => set.add(id));
		}
		return set;
	}, [phases, validPhaseIndex]);

	// Get highlight state
	const isHighlighted = (groupId: string): boolean => {
		return currentPhase?.highlight?.includes(groupId) || false;
	};

	const isGroupRevealed = (groupId: string): boolean => {
		if (!allDiagramGroupIds.has(groupId)) return true;
		if (!hasProgressiveShow) return true;
		return cumulativeRevealSet.has(groupId);
	};

	const getRevealProgress = (groupId: string): number => {
		if (!allDiagramGroupIds.has(groupId)) return 1;
		if (!hasProgressiveShow) return 1;
		const first = firstRevealPhaseByGroup.get(groupId);
		if (first === undefined) return 1;
		if (validPhaseIndex < first) return 0;
		if (validPhaseIndex > first) return 1;
		return Math.min(1, timeInPhase / REVEAL_EASE_SECONDS);
	};

	type GroupVisualLevel = 'pending' | 'dimmed' | 'digest' | 'clear' | 'highlight';

	const getGroupVisualLevel = (groupId: string): GroupVisualLevel => {
		if (!isGroupRevealed(groupId)) return 'pending';
		if (isHighlighted(groupId)) return 'highlight';
		// After a step was discussed, keep it on screen with light blur so viewers can digest
		if (previouslyHighlightedSet.has(groupId)) return 'digest';
		if (currentPhase?.dim?.includes(groupId)) return 'dimmed';
		return 'clear';
	};

	const buildGroupStyleParts = (groupId: string): string[] => {
		const level = getGroupVisualLevel(groupId);
		const revealMix = getRevealProgress(groupId);

		const presets = {
			pending: { opacity: 0.58, blur: 3, saturate: 0.55, brightness: 0.92 },
			dimmed: { opacity: 0.85, blur: 1.5, saturate: 0.75, brightness: 0.96 },
			digest: { opacity: 0.95, blur: 0.5, saturate: 0.9, brightness: 0.99 },
			clear: { opacity: 1, blur: 0, saturate: 1, brightness: 1 },
			highlight: { opacity: 1, blur: 0, saturate: 1, brightness: 1 },
		};

		if (level === 'pending' || revealMix === 0) {
			const p = presets.pending;
			return [
				`opacity: ${p.opacity}`,
				`filter: blur(${p.blur}px) saturate(${p.saturate}) brightness(${p.brightness})`,
			];
		}

		const targetKey = level === 'highlight' ? 'highlight' : level;
		const from = presets.pending;
		const target = presets[targetKey];
		const firstPhase = firstRevealPhaseByGroup.get(groupId);
		const easing =
			firstPhase !== undefined && validPhaseIndex === firstPhase ? revealMix : 1;

		const opacity = from.opacity + (target.opacity - from.opacity) * easing;
		const blur = from.blur + (target.blur - from.blur) * easing;
		const saturate = from.saturate + (target.saturate - from.saturate) * easing;
		const brightness = from.brightness + (target.brightness - from.brightness) * easing;

		const parts: string[] = [`opacity: ${opacity.toFixed(2)}`];

		if (level === 'highlight') {
			parts.push('filter: drop-shadow(0 0 12px rgba(59, 130, 246, 0.55))');
		} else if (blur > 0.15 || saturate < 0.98) {
			parts.push(
				`filter: blur(${blur.toFixed(1)}px) saturate(${saturate.toFixed(2)}) brightness(${brightness.toFixed(2)})`
			);
		}

		return parts;
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
				styles.push(`transform: scale(${scale})`);
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
			const classes = getGroupClasses(groupId);
			const styleParts = buildGroupStyleParts(groupId);
			
			// Phase-specific animations
			const phaseNumber = currentPhase?.phase ?? (currentPhaseIndex >= 0 ? currentPhaseIndex + 1 : 0);

			if (classes.includes("part-chat") && phaseNumber === 1) {
				styleParts.push("filter: drop-shadow(0 0 14px rgba(56, 189, 248, 0.9))");
			}
			
			if (classes.includes("part-tools") && phaseNumber === 2) {
				styleParts.push("filter: drop-shadow(0 0 10px rgba(96, 165, 250, 0.9))");
			}
			
			if (classes.includes("part-agent") && phaseNumber === 3) {
				styleParts.push("filter: drop-shadow(0 0 12px rgba(244, 114, 182, 0.75))");
			}
			
			if (classes.includes("part-actions") && phaseNumber === 4) {
				styleParts.push("filter: drop-shadow(0 0 16px rgba(34, 197, 94, 0.95))");
			}
			
			// Build new attributes (never set opacity=0 on <g> — it hides children in Remotion SVG)
			let newAttributes = attributes.replace(/opacity=["'][^"']*["']/gi, "");
			newAttributes = newAttributes.replace(/style=["'][^"']*["']/gi, "");
			newAttributes = newAttributes.replace(/visibility=["'][^"']*["']/gi, "");

			if (styleParts.length > 0) {
				newAttributes += ` style="${styleParts.join("; ")}"`;
			}

			const newGroupTag = `<g ${newAttributes}>`;
			processed = processed.split(fullMatch).join(newGroupTag);
		}

		return processed;
	};

	// Progressive highlighting for two-card layout
	const currentTimeSeconds = frame / fps;
	const entranceTime = 0.3;

	const getEvenSpacedTiming = (index: number): { start: number; end: number } | null => {
		if (!isTwoCard || !audioDuration || audioDuration <= 0) return null;
		const introTime = audioDuration * 0.15;
		const contentDuration = audioDuration * 0.80;
		const timePerPoint = contentDuration / contentPoints.length;
		const start = entranceTime + introTime + index * timePerPoint;
		return { start, end: start + timePerPoint };
	};

	const getPointTiming = (index: number): { start: number; end: number } | null => {
		if (!isTwoCard) return null;

		if (resolvedBulletStarts?.length === contentPoints.length) {
			const start = resolvedBulletStarts[index];
			const end =
				index < resolvedBulletStarts.length - 1
					? resolvedBulletStarts[index + 1]
					: slideEndSeconds;
			return { start, end };
		}

		return getEvenSpacedTiming(index);
	};

	const getPointHighlight = (index: number): number => {
		const timing = getPointTiming(index);
		if (!timing) return 0;
		if (currentTimeSeconds < entranceTime) return 0;
		if (currentTimeSeconds < timing.start) return 0;
		if (currentTimeSeconds > timing.end) return 0.12;

		const progress = (currentTimeSeconds - timing.start) / (timing.end - timing.start);
		if (progress < 0.12) return interpolate(progress, [0, 0.12], [0, 1]);
		if (progress > 0.88) return interpolate(progress, [0.88, 1], [1, 0.12]);
		return 1;
	};

	const getPointBlurStyle = (index: number): { opacity: number; filter: string } => {
		const timing = getPointTiming(index);
		if (!timing) return { opacity: 1, filter: 'none' };

		const highlight = getPointHighlight(index);
		if (highlight > 0.5) {
			return { opacity: 1, filter: 'none' };
		}

		if (currentTimeSeconds < timing.start) {
			const leadIn = Math.max(0, timing.start - currentTimeSeconds);
			const pendingStrength = Math.min(1, 0.4 + leadIn * 0.05);
			return {
				opacity: 0.55 + (1 - pendingStrength) * 0.1,
				filter: `blur(${3 * pendingStrength}px) saturate(0.6)`,
			};
		}

		if (currentTimeSeconds > timing.end) {
			return { opacity: 0.9, filter: 'blur(0.5px) saturate(0.9)' };
		}

		const revealMix = Math.min(1, (currentTimeSeconds - timing.start) / REVEAL_EASE_SECONDS);
		if (revealMix < 1) {
			return {
				opacity: 0.6 + revealMix * 0.3,
				filter: `blur(${(3 * (1 - revealMix)).toFixed(1)}px) saturate(${0.6 + revealMix * 0.3})`,
			};
		}

		return { opacity: 0.92, filter: 'blur(1px) saturate(0.85)' };
	};

	const resolvedSubtitle = subtitle ?? spec?.sectionSummary ?? '';
	const focusLine = currentPhase?.label ?? '';
	const showFocusLine = focusLine.length > 0;

	const sectionStyle = sectionLabel
		? (SECTION_LABEL_STYLES[sectionLabel] ?? SECTION_LABEL_STYLES.Concept)
		: null;

	const captionEyebrow = 'Current focus';
	const focusDiffersFromObjective =
		focusLine.trim().toLowerCase() !== resolvedSubtitle.trim().toLowerCase();
	const showCaption = showFocusLine && focusLine.length > 0 && focusDiffersFromObjective;

	const slideContentHeight =
		videoHeight - SLIDE_MARGIN.top - SLIDE_MARGIN.bottom - (isTwoCard ? 0 : 10);
	const diagramMaxHeight = Math.round(
		slideContentHeight * (showCaption ? 0.42 : 0.48),
	);
	const slideRowGap = showCaption ? 36 : 12;

	const renderSectionBadge = (variant: 'full' | 'two-card') => {
		if (!sectionLabel || !sectionStyle) return null;
		const isDark = variant === 'two-card';
		return (
			<div
				style={{
					display: 'inline-flex',
					alignItems: 'center',
					gap: 14,
				}}
			>
				<span
					style={{
						fontSize: SLIDE_TYPE.badge,
						fontWeight: 800,
						letterSpacing: '0.12em',
						textTransform: 'uppercase',
						color: isDark ? sectionStyle.accent : sectionStyle.text,
					}}
				>
					{sectionLabel}
				</span>
				{moduleNumber ? (
					<>
						<span
							style={{
								fontSize: SLIDE_TYPE.meta,
								fontWeight: 500,
								color: isDark ? '#64748b' : '#cbd5e1',
							}}
						>
							|
						</span>
						<span
							style={{
								fontSize: SLIDE_TYPE.meta,
								fontWeight: 600,
								letterSpacing: '0.06em',
								textTransform: 'uppercase',
								color: isDark ? '#94a3b8' : '#64748b',
							}}
						>
							Module {moduleNumber}
						</span>
					</>
				) : null}
			</div>
		);
	};

	const renderLeadPanel = (variant: 'full' | 'two-card') => {
		if (!resolvedSubtitle) return null;
		const isDark = variant === 'two-card';
		return (
			<div style={{ marginTop: 22 }}>
				<div
					style={{
						fontSize: SLIDE_TYPE.captionEyebrow,
						fontWeight: 700,
						letterSpacing: '0.14em',
						textTransform: 'uppercase',
						color: isDark ? '#94a3b8' : '#94a3b8',
						marginBottom: 10,
					}}
				>
					Section objective
				</div>
				<p
					style={{
						margin: 0,
						fontSize: isDark ? SLIDE_TYPE.subtitle : SLIDE_TYPE.subtitle,
						fontWeight: 600,
						lineHeight: 1.35,
						color: isDark ? '#e2e8f0' : '#1e293b',
					}}
				>
					{resolvedSubtitle}
				</p>
			</div>
		);
	};

	const renderPresentationHeader = () => (
		<div
			style={{
				flexShrink: 0,
				opacity: titleOpacity,
				position: 'relative',
				zIndex: 2,
			}}
		>
			<div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 24 }}>
				{renderSectionBadge('full')}
				<span
					style={{
						fontSize: SLIDE_TYPE.meta,
						fontWeight: 600,
						letterSpacing: '0.1em',
						textTransform: 'uppercase',
						color: '#94a3b8',
					}}
				>
					Agentic AI Professional
				</span>
			</div>
			<h2
				style={{
					fontSize: SLIDE_TYPE.title,
					fontWeight: 800,
					margin: 0,
					marginTop: 22,
					color: COLORS.light.text,
					letterSpacing: '-0.025em',
					lineHeight: 1.1,
				}}
			>
				{title}
			</h2>
			<div
				style={{
					width: 96,
					height: 6,
					marginTop: 18,
					background: sectionStyle?.accent ?? COLORS.light.accent,
				}}
			/>
			{renderLeadPanel('full')}
		</div>
	);

	const renderDiagramCaption = () => {
		if (!showCaption) return null;
		return (
			<div
				style={{
					width: '100%',
					flexShrink: 0,
					borderTop: `5px solid ${sectionStyle?.accent ?? COLORS.light.accent}`,
					background: sectionStyle?.bg ?? '#f8fafc',
					padding: '24px 0 0',
					position: 'relative',
					zIndex: 2,
				}}
			>
				<div
					style={{
						fontSize: SLIDE_TYPE.captionEyebrow,
						fontWeight: 700,
						letterSpacing: '0.14em',
						textTransform: 'uppercase',
						color: sectionStyle?.text ?? '#64748b',
						marginBottom: 12,
					}}
				>
					{captionEyebrow}
				</div>
				<p
					style={{
						margin: 0,
						fontSize: SLIDE_TYPE.caption,
						fontWeight: 700,
						lineHeight: 1.3,
						color: '#0f172a',
					}}
				>
					{focusLine}
				</p>
			</div>
		);
	};

	const renderTwoCardHeader = () => (
		<>
			{renderSectionBadge('two-card')}
			<h2
				style={{
					fontSize: SLIDE_TYPE.twoCardTitle,
					fontWeight: 800,
					margin: 0,
					marginTop: 24,
					marginBottom: 0,
					opacity: titleOpacity,
					color: COLORS.dark.text,
					letterSpacing: '-0.025em',
					lineHeight: 1.1,
					flexShrink: 0,
				}}
			>
				{title}
			</h2>
			<div
				style={{
					width: 96,
					height: 6,
					marginTop: 20,
					background: sectionStyle?.accent ?? COLORS.dark.accent,
				}}
			/>
			{renderLeadPanel('two-card')}
		</>
	);

	return (
		<div
			style={{
				width: '100%',
				height: '100%',
				background: isTwoCard
					? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'
					: '#ffffff',
				display: 'flex',
				flexDirection: isTwoCard ? 'row' : 'column',
				fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
				overflow: 'hidden',
				position: 'relative',
			}}
		>
			{/* Top accent stripe (full layout slide) */}
			{!isTwoCard && (
				<div
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						height: 6,
						background: sectionStyle?.accent ?? COLORS.light.accent,
					}}
				/>
			)}

			{/* Accent line at top (two-card layout) */}
			{isTwoCard && (
				<div
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: `${lineWidth}%`,
						height: 6,
						background: `linear-gradient(90deg, ${COLORS.light.accent} 0%, ${COLORS.light.secondary} 100%)`,
					}}
				/>
			)}

			{/* Slide canvas with safe margins */}
			<div
				style={{
					flex: 1,
					minHeight: 0,
					width: '100%',
					height: '100%',
					display: isTwoCard ? 'flex' : 'grid',
					flexDirection: isTwoCard ? 'row' : undefined,
					gridTemplateRows: isTwoCard
						? undefined
						: showCaption
							? 'auto minmax(0, 1fr) auto'
							: 'auto minmax(0, 1fr)',
					rowGap: isTwoCard ? undefined : slideRowGap,
					padding: isTwoCard
						? `${SLIDE_MARGIN.top}px ${SLIDE_MARGIN.right}px ${SLIDE_MARGIN.bottom}px ${SLIDE_MARGIN.left}px`
						: `${SLIDE_MARGIN.top + 10}px ${SLIDE_MARGIN.right}px ${SLIDE_MARGIN.bottom}px ${SLIDE_MARGIN.left}px`,
					boxSizing: 'border-box',
					position: 'relative',
					zIndex: 1,
					overflow: 'hidden',
				}}
			>
			{/* Two-card layout: Content on left */}
			{isTwoCard && (
				<div
					style={{
						width: '50%',
						height: '100%',
						display: 'flex',
						flexDirection: 'column',
						paddingRight: 48,
						position: 'relative',
						borderRight: '3px solid rgba(59, 130, 246, 0.25)',
					}}
				>
					{renderTwoCardHeader()}
					<div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24, marginTop: 36 }}>
						{contentPoints.map((point, index) => {
							const highlight = getPointHighlight(index);
							const isActive = highlight > 0.5;
							const blurStyle = getPointBlurStyle(index);

							return (
								<div
									key={index}
									style={{
										opacity: blurStyle.opacity,
										filter: blurStyle.filter,
										display: 'flex',
										alignItems: 'flex-start',
										gap: 22,
										padding: '8px 0',
										borderLeft: `5px solid rgba(59, 130, 246, ${0.5 + highlight * 0.5})`,
										paddingLeft: 24,
									}}
								>
									<div
										style={{
											width: 14,
											height: 14,
											backgroundColor: isActive ? '#60a5fa' : '#3b82f6',
											borderRadius: '50%',
											marginTop: 12,
											flexShrink: 0,
										}}
									/>
									<p
										style={{
											fontSize: SLIDE_TYPE.twoCardBody,
											margin: 0,
											lineHeight: 1.45,
											flex: 1,
											color: isActive ? '#e0f2fe' : '#f1f5f9',
											fontWeight: isActive ? 600 : 500,
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

			{/* Presentation header (full layout) */}
			{!isTwoCard && renderPresentationHeader()}

			{/*
				Diagram: centered flex container. Wrapper grows (flex 1) to use remaining space;
				SVG fills wrapper with preserveAspectRatio meet so it scales proportionally, centered.
			*/}
			<div
				style={{
					minHeight: 0,
					width: isTwoCard ? '50%' : '100%',
					height: isTwoCard ? '100%' : undefined,
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					position: 'relative',
					overflow: 'visible',
					padding: isTwoCard ? '0 0 0 48px' : showCaption ? '8px 0 12px' : '16px 0 12px',
				}}
			>
				<div
					style={{
						width: '100%',
						height: '100%',
						maxHeight: isTwoCard ? '100%' : diagramMaxHeight,
						flex: isTwoCard ? 1 : undefined,
						minHeight: 0,
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
						paddingBottom: isTwoCard ? 0 : 8,
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
							<div
								style={{
									width: '100%',
									height: '100%',
									flex: 1,
									minHeight: 0,
									alignSelf: 'stretch',
									position: 'relative',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
								}}
							>
								<div
									style={{
										width: '100%',
										height: '100%',
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
									}}
									dangerouslySetInnerHTML={{
										__html: (spec && currentPhase)
											? processSvgContent(svgContent)
											: normalizeSvgForScaling(svgContent),
									}}
								/>
							</div>
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
			</div>
			{!isTwoCard && renderDiagramCaption()}
			</div>

			{/* Course watermark - subtle */}
			{isTwoCard && (
				<div
					style={{
						position: 'absolute',
						bottom: SLIDE_MARGIN.bottom - 24,
						right: SLIDE_MARGIN.right,
						opacity: 0.45,
						color: COLORS.light.muted,
						fontSize: SLIDE_TYPE.meta,
						fontWeight: 600,
						letterSpacing: '0.08em',
						textTransform: 'uppercase',
					}}
				>
					Agentic AI Professional
				</div>
			)}
		</div>
	);
};
