// src/diagrams/AWSDiagramCanvas.tsx
import React from "react";
import { useCurrentFrame, useVideoConfig, staticFile } from "remotion";
import { DiagramScene, DiagramNode, DiagramGroup, DiagramEdge } from "./sceneTypes";

interface AWSDiagramCanvasProps {
  scene: DiagramScene;
  highlightedNodeIds?: string[];
}

// Simple node icon mapping - can be expanded with actual AWS icons
const getNodeIcon = (type: string): string => {
  const iconMap: Record<string, string> = {
    vpc: "assets/vpc.svg",
    subnet_public: "assets/vpc.svg",
    subnet_private: "assets/vpc.svg",
    internet_gateway: "assets/vpc.svg",
    nat_gateway: "assets/vpc.svg",
    alb: "assets/vpc.svg",
    ec2: "assets/vpc.svg",
    ecs_service: "assets/vpc.svg",
    rds: "assets/vpc.svg",
    s3: "assets/vpc.svg",
    lambda: "assets/vpc.svg",
    security_group: "assets/vpc.svg",
  };
  return iconMap[type] || "assets/vpc.svg";
};

// Responsive layout function that scales with container size
const layoutNodes = (
  scene: DiagramScene, 
  containerWidth: number, 
  containerHeight: number
): Map<string, { x: number; y: number }> => {
  const positions = new Map<string, { x: number; y: number }>();
  const centerX = containerWidth * 0.5;
  const centerY = containerHeight * 0.5;
  const minDimension = Math.min(containerWidth, containerHeight);
  
  if (scene.layout === "vpc-public-private") {
    // Find VPC group
    const vpcGroup = scene.groups.find(g => g.type === "vpc");
    if (vpcGroup) {
      // Position VPC container in center - make it large enough to contain subnets
      const vpcNode = scene.nodes.find(n => n.id === vpcGroup.id);
      if (vpcNode) {
        positions.set(vpcNode.id, { x: centerX, y: centerY });
      }
      
      // Get subnets that belong to this VPC
      const subnets = scene.nodes.filter(n => 
        vpcGroup.children.includes(n.id) && 
        (n.type === "subnet_public" || n.type === "subnet_private")
      );
      
      // Position subnets INSIDE the VPC container
      // Use a smaller radius so they fit within the VPC bounds
      const vpcContainerWidth = Math.max(400, containerWidth * 0.6);
      const vpcContainerHeight = Math.max(300, containerHeight * 0.5);
      const innerRadius = Math.min(vpcContainerWidth, vpcContainerHeight) * 0.2;
      
      subnets.forEach((subnet, index) => {
        const angle = (index / subnets.length) * Math.PI * 2;
        // Position subnets inside VPC, offset from center
        positions.set(subnet.id, {
          x: centerX + Math.cos(angle) * innerRadius,
          y: centerY + Math.sin(angle) * innerRadius,
        });
      });
    }
    
    // Position other nodes (like IGW, NAT Gateway) OUTSIDE the VPC
    scene.nodes.forEach((node, index) => {
      if (!positions.has(node.id)) {
        // Position to the right or bottom of the VPC
        const offsetX = containerWidth * 0.7;
        const offsetY = containerHeight * 0.3 + (index * 120);
        positions.set(node.id, {
          x: offsetX,
          y: offsetY,
        });
      }
    });
  } else {
    // Generic grid layout - responsive
    const gridCols = Math.ceil(Math.sqrt(scene.nodes.length));
    const spacing = minDimension / (gridCols + 1);
    scene.nodes.forEach((node, index) => {
      positions.set(node.id, {
        x: (index % gridCols) * spacing + spacing,
        y: Math.floor(index / gridCols) * spacing + containerHeight * 0.15,
      });
    });
  }
  
  return positions;
};

export const AWSDiagramCanvas: React.FC<AWSDiagramCanvasProps> = ({
  scene,
  highlightedNodeIds = [],
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  
  // Calculate actual container dimensions (accounting for padding)
  const containerWidth = width * 0.5 - 80; // 40px padding on each side
  const containerHeight = height - 80; // 40px padding top/bottom
  const minDimension = Math.min(containerWidth, containerHeight);
  
  // Pulse animation for highlighted nodes
  const pulse = 1 + Math.sin((frame / fps) * 2) * 0.1;
  
  const nodePositions = layoutNodes(scene, containerWidth, containerHeight);
  
  return (
    <div
      style={{
        width: containerWidth,
        height: containerHeight,
        position: "relative",
        backgroundColor: "#0f172a",
        borderRadius: 12,
        overflow: "visible",
        border: "2px solid rgba(96, 165, 250, 0.3)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          right: 20,
          fontSize: 28,
          fontWeight: 700,
          color: "#ffffff",
          zIndex: 10,
          textShadow: "0 2px 8px rgba(0,0,0,0.5)",
        }}
      >
        {scene.title}
      </div>
      
      {/* Render groups (VPC containers) */}
      {scene.groups.map((group) => {
        const groupNode = scene.nodes.find(n => n.id === group.id);
        if (!groupNode) return null;
        
        const pos = nodePositions.get(group.id);
        if (!pos) return null;
        
        const isHighlighted = highlightedNodeIds.includes(group.id);
        
        // Make VPC container large enough to visually contain subnets
        const groupWidth = group.type === "vpc" 
          ? Math.max(500, containerWidth * 0.65)  // Larger for VPC
          : Math.max(300, containerWidth * 0.4);
        const groupHeight = group.type === "vpc"
          ? Math.max(400, containerHeight * 0.55)  // Larger for VPC
          : Math.max(200, containerHeight * 0.3);
        
        return (
          <div
            key={group.id}
            style={{
              position: "absolute",
              left: pos.x - groupWidth / 2,
              top: pos.y - groupHeight / 2,
              width: groupWidth,
              height: groupHeight,
              border: `3px solid ${isHighlighted ? "#60a5fa" : "rgba(96, 165, 250, 0.4)"}`,
              borderRadius: 12,
              backgroundColor: isHighlighted 
                ? "rgba(59, 130, 246, 0.15)" 
                : "rgba(59, 130, 246, 0.08)",
              opacity: isHighlighted ? 1 : 0.7,
              transform: isHighlighted ? `scale(${pulse})` : "scale(1)",
              transition: "all 0.3s ease",
              boxShadow: isHighlighted 
                ? "0 0 20px rgba(96, 165, 250, 0.5)" 
                : "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 12,
                left: 12,
                fontSize: 18,
                color: "#ffffff",
                fontWeight: 600,
                textShadow: "0 2px 4px rgba(0,0,0,0.5)",
              }}
            >
              {group.label}
            </div>
          </div>
        );
      })}
      
      {/* Render edges */}
      {scene.edges.map((edge) => {
        const fromPos = nodePositions.get(edge.from);
        const toPos = nodePositions.get(edge.to);
        if (!fromPos || !toPos) return null;
        
        return (
          <svg
            key={edge.id}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: containerWidth,
              height: containerHeight,
              pointerEvents: "none",
              zIndex: 1,
            }}
          >
            <line
              x1={fromPos.x}
              y1={fromPos.y}
              x2={toPos.x}
              y2={toPos.y}
              stroke="rgba(96, 165, 250, 0.7)"
              strokeWidth="5"
              markerEnd="url(#arrowhead)"
            />
          </svg>
        );
      })}
      
      {/* Arrow marker definition - shared across all edges */}
      <svg style={{ position: "absolute", width: 0, height: 0, overflow: "visible" }}>
        <defs>
          <marker
            id="arrowhead"
            markerWidth="12"
            markerHeight="12"
            refX="10"
            refY="4"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <polygon
              points="0 0, 12 4, 0 8"
              fill="rgba(96, 165, 250, 0.8)"
            />
          </marker>
        </defs>
      </svg>
      
      {/* Render nodes - skip nodes that are children of groups (they're rendered inside groups) */}
      {scene.nodes.map((node) => {
        const pos = nodePositions.get(node.id);
        if (!pos) return null;
        
        // Skip nodes that are children of groups - they're rendered inside the group container
        const isChildOfGroup = scene.groups.some(g => g.children.includes(node.id));
        if (isChildOfGroup) return null;
        
        const isHighlighted = highlightedNodeIds.includes(node.id);
        
        const nodeSize = Math.max(120, minDimension * 0.12);
        const iconSize = nodeSize * 0.5;
        
        return (
          <div
            key={node.id}
            style={{
              position: "absolute",
              left: pos.x - nodeSize / 2,
              top: pos.y - nodeSize / 2,
              width: nodeSize,
              height: nodeSize,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: isHighlighted 
                ? "rgba(59, 130, 246, 0.25)" 
                : "rgba(30, 64, 175, 0.15)",
              border: `3px solid ${isHighlighted ? "#60a5fa" : "rgba(96, 165, 250, 0.5)"}`,
              borderRadius: 12,
              opacity: isHighlighted ? 1 : 0.8,
              transform: isHighlighted ? `scale(${pulse})` : "scale(1)",
              transition: "all 0.3s ease",
              zIndex: 2,
              boxShadow: isHighlighted 
                ? "0 0 20px rgba(96, 165, 250, 0.6)" 
                : "0 4px 12px rgba(0,0,0,0.4)",
            }}
          >
            <img
              src={staticFile(getNodeIcon(node.type))}
              alt={node.type}
              style={{
                width: iconSize,
                height: iconSize,
                filter: isHighlighted 
                  ? "drop-shadow(0 0 12px rgba(96, 165, 250, 0.9))" 
                  : "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
              }}
            />
            <div
              style={{
                marginTop: 8,
                fontSize: Math.max(14, minDimension * 0.015),
                color: "#ffffff",
                textAlign: "center",
                maxWidth: nodeSize - 16,
                fontWeight: 500,
                textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {node.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};
