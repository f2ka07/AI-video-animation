// src/diagrams/sceneTypes.ts
export type AwsNodeType =
  | "vpc"
  | "subnet_public"
  | "subnet_private"
  | "internet_gateway"
  | "nat_gateway"
  | "alb"
  | "ec2"
  | "ecs_service"
  | "rds"
  | "s3"
  | "lambda"
  | "security_group"
  | "other";

export interface DiagramNode {
  id: string;
  label: string;
  type: AwsNodeType;
  groupId?: string;
}

export interface DiagramGroup {
  id: string;
  label: string;
  type: "vpc" | "subnet_public" | "subnet_private" | "generic";
  children: string[]; // node ids
}

export interface DiagramEdge {
  id: string;
  from: string; // node id
  to: string;   // node id
  label?: string;
  kind?: "traffic" | "dependency";
}

export interface DiagramScene {
  id: string;
  title: string;
  layout: "vpc-public-private" | "lb-service-db" | "generic-grid";
  nodes: DiagramNode[];
  groups: DiagramGroup[];
  edges: DiagramEdge[];
}
