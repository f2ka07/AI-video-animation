// Generic animated diagram scene that reads animation specs
// Reusable across all courses and modules

import React, { useEffect, useState } from "react";
import { useCurrentFrame, useVideoConfig, staticFile, interpolate } from "remotion";

interface AnimationPhase {
  start: number;
  end: number;
  show: string[];
  dim: string[];
  highlight: string[];
}

interface AnimationSpec {
  diagram: string;
  phases: AnimationPhase[];
}

interface AnimatedDiagramSceneProps {
  svgPath: string; // Path to SVG file (relative to public/)
  animationSpecPath: string; // Path to animation.json (relative to public/ or absolute)
  title?: string;
  durationInFrames: number;
  fadeDuration?: number; // Duration of fade transitions in seconds
}

export const AnimatedDiagramScene: React.FC<AnimatedDiagramSceneProps> = ({
  svgPath,
  animationSpecPath,
  title,
  durationInFrames,
  fadeDuration = 0.3,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  
  const [spec, setSpec] = useState<AnimationSpec | null>(null);
  const [svgContent, setSvgContent] = useState<string | null>(null);
  
  // Load animation spec
  useEffect(() => {
    // Try to load from public/ first, then try absolute path
    const loadSpec = async () => {
      try {
        const response = await fetch(staticFile(animationSpecPath));
        if (response.ok) {
          const data = await response.json();
          setSpec(data);
        } else {
          // Try as absolute path
          const absResponse = await fetch(animationSpecPath);
          if (absResponse.ok) {
            const data = await absResponse.json();
            setSpec(data);
          }
        }
      } catch (error) {
        console.warn(`Failed to load animation spec: ${animationSpecPath}`, error);
      }
    };
    
    loadSpec();
  }, [animationSpecPath]);
  
  // Load SVG content
  useEffect(() => {
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
  
  // Find current phase
  const currentPhase = spec?.phases.find(
    (p) => t >= p.start && t < p.end
  ) || spec?.phases[spec.phases.length - 1];
  
  // Get opacity for a group ID
  const getGroupOpacity = (groupId: string): number => {
    if (!currentPhase) return 1;
    
    if (currentPhase.show.includes(groupId)) {
      return 1;
    } else if (currentPhase.dim.includes(groupId)) {
      return 0.15;
    } else {
      return 0;
    }
  };
  
  // Get highlight state for a group ID
  const isHighlighted = (groupId: string): boolean => {
    return currentPhase?.highlight.includes(groupId) || false;
  };
  
  // Process SVG content to apply animations
  const processSvgContent = (content: string): string => {
    if (!content || !currentPhase) return content;
    
    // Find all group elements with IDs
    const groupRegex = /<g\s+([^>]*id=["']([^"']+)["'][^>]*)>/gi;
    
    let processed = content;
    let match;
    
    while ((match = groupRegex.exec(content)) !== null) {
      const fullMatch = match[0];
      const groupId = match[2];
      const attributes = match[1];
      
      const opacity = getGroupOpacity(groupId);
      const highlighted = isHighlighted(groupId);
      
      // Calculate smooth opacity transition
      const phaseStart = currentPhase.start;
      const phaseEnd = currentPhase.end;
      const phaseDuration = phaseEnd - phaseStart;
      const timeInPhase = t - phaseStart;
      
      // Smooth fade in/out at phase boundaries
      let smoothOpacity = opacity;
      if (fadeDuration > 0 && phaseDuration > 0) {
        const fadeStart = Math.min(fadeDuration, phaseDuration * 0.2);
        const fadeEnd = Math.max(phaseDuration - fadeDuration, phaseDuration * 0.8);
        
        if (timeInPhase < fadeStart) {
          // Fade in
          smoothOpacity = interpolate(
            [0, fadeStart],
            [0, opacity],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          )(timeInPhase);
        } else if (timeInPhase > fadeEnd) {
          // Fade out
          smoothOpacity = interpolate(
            [fadeEnd, phaseDuration],
            [opacity, opacity * 0.5],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          )(timeInPhase);
        }
      }
      
      // Build new attributes
      let newAttributes = attributes.replace(/opacity=["'][^"']*["']/gi, ""); // Remove existing opacity
      newAttributes += ` opacity="${smoothOpacity.toFixed(3)}"`;
      
      if (highlighted) {
        // Add highlight effect (stroke or filter)
        newAttributes += ` style="filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.8)); stroke-width: 2;"`;
      }
      
      const newGroupTag = `<g ${newAttributes}>`;
      processed = processed.replace(fullMatch, newGroupTag);
    }
    
    return processed;
  };
  
  if (!svgContent) {
    return (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
        <div>Loading diagram...</div>
      </div>
    );
  }
  
  if (!spec) {
    // Fallback: show SVG without animation
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8fafc",
          padding: 40,
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: svgContent }} />
      </div>
    );
  }
  
  const processedSvg = processSvgContent(svgContent);
  
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#f8fafc",
        padding: 40,
      }}
    >
      {title && (
        <div
          style={{
            fontSize: 32,
            fontWeight: 600,
            color: "#1e293b",
            marginBottom: 30,
            textAlign: "center",
          }}
        >
          {title}
        </div>
      )}
      
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
          }}
          dangerouslySetInnerHTML={{ __html: processedSvg }}
        />
      </div>
      
      {/* Debug info (only in development) */}
      {process.env.NODE_ENV === "development" && currentPhase && (
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: 20,
            background: "rgba(0, 0, 0, 0.7)",
            color: "#fff",
            padding: "8px 12px",
            borderRadius: 4,
            fontSize: 12,
            fontFamily: "monospace",
          }}
        >
          Phase: {currentPhase.start.toFixed(1)}s - {currentPhase.end.toFixed(1)}s
          <br />
          Show: {currentPhase.show.join(", ") || "none"}
          <br />
          Highlight: {currentPhase.highlight.join(", ") || "none"}
        </div>
      )}
    </div>
  );
};
