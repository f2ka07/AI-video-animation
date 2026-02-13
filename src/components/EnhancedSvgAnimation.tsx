// Enhanced SVG Animation System
// Creates dramatic, engaging animations that are visible and creative
// Solves the "1 SVG for 60+ seconds" problem with progressive reveals and dynamic effects

import React, { useMemo } from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { useModuleTimings } from "../hooks/useModuleTimings";
import {
  getSvgMappings,
  getActiveElementsAtTime,
  SvgElementMapping,
} from "../utils/svgElementMappings";

interface EnhancedSvgAnimationProps {
  svgPath: string;
  diagramName: string;
  slideName: string;
  moduleNumber?: number;
  width?: number;
  height?: number;
}

export const EnhancedSvgAnimation: React.FC<EnhancedSvgAnimationProps> = ({
  svgPath,
  diagramName,
  slideName,
  moduleNumber = 1,
  width,
  height,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { timings } = useModuleTimings(moduleNumber);

  const slideTimings = timings?.slides[slideName];
  const words = slideTimings?.words || [];
  const mappings = useMemo(() => getSvgMappings(diagramName), [diagramName]);

  const currentTimeSeconds = frame / fps;
  const activeState = useMemo(() => {
    return getActiveElementsAtTime(currentTimeSeconds, words, mappings);
  }, [currentTimeSeconds, words, mappings]);

  const [svgContent, setSvgContent] = React.useState<string | null>(null);

  React.useEffect(() => {
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

  // Enhanced animation processing with dramatic effects
  const processedSvg = useMemo(() => {
    if (!svgContent || !mappings.length) return svgContent;

    let processed = svgContent;

    // Process each mapped element with enhanced animations
    for (const mapping of mappings) {
      const elementId = mapping.elementId;
      const regex = new RegExp(
        `<g\\s+([^>]*id=["']${elementId}["'][^>]*)>`,
        "gi",
      );

      processed = processed.replace(regex, (match, attributes) => {
        const animation = getEnhancedAnimation(
          mapping,
          currentTimeSeconds,
          words,
          activeState,
          fps,
          frame,
        );

        // Remove existing attributes
        let newAttributes = attributes
          .replace(/style=["'][^"']*["']/gi, "")
          .replace(/opacity=["'][^"']*["']/gi, "")
          .replace(/transform=["'][^"']*["']/gi, "");

        // Build comprehensive style with dramatic effects
        const styles: string[] = [];

        if (animation.opacity !== undefined) {
          styles.push(`opacity: ${animation.opacity.toFixed(3)}`);
        }

        if (animation.filter) {
          styles.push(`filter: ${animation.filter}`);
        }

        if (animation.transform) {
          styles.push(`transform: ${animation.transform}`);
        }

        if (styles.length > 0) {
          newAttributes += ` style="${styles.join("; ")}"`;
        }

        return `<g ${newAttributes}>`;
      });

      // Animate arrows/connections when both connected elements are active
      processed = animateConnections(
        processed,
        mapping,
        activeState,
        currentTimeSeconds,
        fps,
        frame,
      );
    }

    return processed;
  }, [
    svgContent,
    mappings,
    currentTimeSeconds,
    words,
    activeState,
    fps,
    frame,
  ]);

  return (
    <div
      style={{
        width: width || "100%",
        height: height || "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {processedSvg ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          dangerouslySetInnerHTML={{ __html: processedSvg }}
        />
      ) : (
        <div style={{ color: "#fff" }}>Loading diagram...</div>
      )}
    </div>
  );
};

/**
 * Enhanced animation with dramatic, visible effects
 */
function getEnhancedAnimation(
  mapping: SvgElementMapping,
  currentTime: number,
  words: Array<{ start: number; end: number }>,
  activeState: { show: string[]; highlight: string[]; dim: string[] },
  fps: number,
  frame: number,
): {
  opacity?: number;
  filter?: string;
  transform?: string;
} {
  const [startIdx, endIdx] = mapping.wordRange;
  const startWord = words[startIdx];
  const endWord = words[endIdx];

  if (!startWord || !endWord) {
    return { opacity: 0.1 }; // Very dim if not mapped
  }

  const elementStartTime = startWord.start + (mapping.animationDelay || 0);
  const elementEndTime = endWord.end;
  const elementDuration = elementEndTime - elementStartTime;

  const isActive = activeState.show.includes(mapping.elementId);
  const isHighlighted = activeState.highlight.includes(mapping.elementId);
  const isDimmed = activeState.dim.includes(mapping.elementId);

  // Calculate progress
  let progress = 0;
  if (currentTime >= elementStartTime && currentTime <= elementEndTime) {
    progress = (currentTime - elementStartTime) / elementDuration;
    progress = Math.max(0, Math.min(1, progress));
  } else if (currentTime < elementStartTime) {
    progress = 0;
  } else {
    progress = 1;
  }

  // Time since element became active (for continuous animations)
  const timeSinceActive = Math.max(0, currentTime - elementStartTime);

  // Apply dramatic animation based on type
  switch (mapping.animationType) {
    case "reveal":
      // Dramatic entrance: scale from 0, fade in, slide in
      const revealProgress = Math.min(1, progress * 2); // Faster reveal
      const revealOpacity = spring({
        frame: revealProgress * fps * 0.8,
        fps,
        config: { damping: 15, stiffness: 120 },
      });
      const revealScale = interpolate(
        revealProgress,
        [0, 0.3, 1],
        [0, 1.1, 1],
        { easing: Easing.out(Easing.back(1.2)) },
      );
      const revealX = interpolate(revealProgress, [0, 1], [-50, 0], {
        easing: Easing.out(Easing.quad),
      });
      const revealY = interpolate(revealProgress, [0, 1], [-30, 0], {
        easing: Easing.out(Easing.quad),
      });

      // Continuous pulse when active
      const pulse = isActive ? 1 + Math.sin(timeSinceActive * 2) * 0.05 : 1;

      return {
        opacity: isDimmed ? 0.1 : isActive ? Math.max(0.8, revealOpacity) : 0.2,
        transform: `translate(${revealX}px, ${revealY}px) scale(${revealScale * pulse})`,
        filter: isHighlighted
          ? `drop-shadow(0 0 20px rgba(59, 130, 246, 0.9)) drop-shadow(0 0 40px rgba(139, 92, 246, 0.6))`
          : isActive
            ? `drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))`
            : "none",
      };

    case "highlight":
      // Strong pulsing glow with scale animation
      const highlightPulse = Math.sin(timeSinceActive * 3) * 0.15 + 1;
      const glowSize = isHighlighted
        ? 20 + Math.sin(timeSinceActive * 4) * 10
        : 10;
      const glowIntensity = isHighlighted ? 1.0 : 0.4;

      return {
        opacity: isDimmed ? 0.1 : 1,
        filter: `drop-shadow(0 0 ${glowSize}px rgba(59, 130, 246, ${glowIntensity})) drop-shadow(0 0 ${glowSize * 1.5}px rgba(139, 92, 246, ${glowIntensity * 0.6}))`,
        transform: `scale(${isHighlighted ? highlightPulse : 1})`,
      };

    case "zoom":
      // Camera zoom effect - element grows and glows
      const zoomProgress = Math.min(1, progress * 1.5);
      const zoomScale = interpolate(
        zoomProgress,
        [0, 0.3, 0.7, 1],
        [0.8, 1.3, 1.2, 1],
        { easing: Easing.inOut(Easing.quad) },
      );
      const zoomGlow = interpolate(zoomProgress, [0, 0.5, 1], [0, 1, 0.3], {
        easing: Easing.inOut(Easing.quad),
      });

      return {
        opacity: isDimmed ? 0.1 : 1,
        transform: `scale(${zoomScale})`,
        filter: `drop-shadow(0 0 ${30 * zoomGlow}px rgba(59, 130, 246, ${0.7 + zoomGlow * 0.3}))`,
      };

    case "draw":
      // Path drawing animation (for arrows/connections)
      const drawProgress = Math.min(1, progress * 1.2);
      return {
        opacity: isDimmed ? 0.1 : drawProgress,
        transform: `scale(${0.9 + drawProgress * 0.1})`,
      };

    case "fade-in":
      // Smooth fade with slight scale
      const fadeProgress = Math.min(1, progress * 1.5);
      const fadeOpacity = interpolate(fadeProgress, [0, 0.5, 1], [0, 1, 1], {
        easing: Easing.out(Easing.quad),
      });
      const fadeScale = interpolate(fadeProgress, [0, 1], [0.95, 1], {
        easing: Easing.out(Easing.quad),
      });

      return {
        opacity: isDimmed ? 0.1 : fadeOpacity,
        transform: `scale(${fadeScale})`,
      };

    default:
      // Default: dramatic dim/active contrast
      return {
        opacity: isDimmed ? 0.1 : isActive ? 1 : 0.2,
        filter: isHighlighted
          ? `drop-shadow(0 0 15px rgba(59, 130, 246, 0.8))`
          : "none",
      };
  }
}

/**
 * Animate connections/arrows when both connected elements are active
 */
function animateConnections(
  svgContent: string,
  mapping: SvgElementMapping,
  activeState: { show: string[]; highlight: string[]; dim: string[] },
  currentTime: number,
  fps: number,
  frame: number,
): string {
  // Find lines/paths that connect to this element
  // This is a simplified version - you'd need to map connections in your SVG
  const lineRegex = /<(line|path)\s+([^>]*(?:x1|d)=[^>]*)>/gi;

  return svgContent.replace(lineRegex, (match, tag, attributes) => {
    // Check if this line connects active elements
    // For now, animate all lines when their target element is active
    const isConnected = activeState.show.includes(mapping.elementId);

    if (!isConnected) {
      return match; // No animation
    }

    // Animated stroke drawing effect
    const dashLength = 8;
    const speed = 1.0;
    const offset = ((currentTime % speed) / speed) * (dashLength * 2);

    let newAttributes = attributes
      .replace(/stroke=["'][^"']*["']/gi, "")
      .replace(/stroke-dasharray=["'][^"']*["']/gi, "")
      .replace(/stroke-dashoffset=["'][^"']*["']/gi, "")
      .replace(/stroke-width=["'][^"']*["']/gi, "");

    newAttributes += ` stroke="#3b82f6" stroke-width="3" stroke-dasharray="${dashLength} ${dashLength}" stroke-dashoffset="${offset.toFixed(1)}"`;

    return `<${tag} ${newAttributes}>`;
  });
}
