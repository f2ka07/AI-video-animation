// src/compositions/CodeAndDiagram.tsx
import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { AnimatedCodeSlide } from "../components/AnimatedCodeSlide";
import { AWSDiagramCanvas } from "../diagrams/AWSDiagramCanvas";
import { DiagramScene } from "../diagrams/sceneTypes";

interface CodeAndDiagramProps {
  title: string;
  code: string;
  language?: string;
  slideName: string;
  scene?: DiagramScene | null;
  moduleNumber?: number;
  /** Fraction of width for code (0–1). Default 0.5. Use e.g. 0.6 for more code space when teaching line-by-line. */
  codeWidthFraction?: number;
}

/**
 * Very simple time → highlight mapping.
 * You can later plug this into your existing cue system.
 */
const getHighlightedNodesForTime = (scene: DiagramScene, seconds: number): string[] => {
  // example hard-coded bands
  if (seconds < 5) {
    // just VPC
    const vpc = scene.nodes.find((n) => n.type === "vpc");
    return vpc ? [vpc.id] : [];
  }
  if (seconds < 10) {
    // subnets
    return scene.nodes
      .filter((n) => n.type === "subnet_public" || n.type === "subnet_private")
      .map((n) => n.id);
  }
  if (seconds < 15) {
    // ALB + ECS
    return scene.nodes
      .filter((n) => n.type === "alb" || n.type === "ecs_service")
      .map((n) => n.id);
  }
  if (seconds < 20) {
    // RDS
    const rds = scene.nodes.find((n) => n.type === "rds");
    return rds ? [rds.id] : [];
  }
  return [];
};

export const CodeAndDiagram: React.FC<CodeAndDiagramProps> = ({
  title,
  code,
  language = "typescript",
  slideName,
  scene,
  moduleNumber = 1,
  codeWidthFraction = 0.5,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  if (!scene) {
    return (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
        <div>Diagram scene not configured for this slide</div>
      </div>
    );
  }

  const highlightedNodeIds = getHighlightedNodesForTime(scene, t);
  const { width } = useVideoConfig();
  const codeWidth = width * Math.max(0.3, Math.min(0.8, codeWidthFraction));
  const diagramWidth = width - codeWidth;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        backgroundColor: "#020617",
        gap: 0,
      }}
    >
      <div
        style={{
          width: codeWidth,
          height: "100%",
          borderRight: "2px solid rgba(30,64,175,0.6)",
          overflow: "hidden",
        }}
      >
        <AnimatedCodeSlide
          title={title}
          code={code}
          language={language}
          slideName={slideName}
          audioStartFrame={0}
          moduleNumber={moduleNumber}
        />
      </div>
      <div
        style={{
          width: diagramWidth,
          height: "100%",
          padding: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AWSDiagramCanvas scene={scene} highlightedNodeIds={highlightedNodeIds} />
      </div>
    </div>
  );
};
