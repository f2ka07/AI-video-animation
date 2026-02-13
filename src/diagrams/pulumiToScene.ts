// src/diagrams/pulumiToScene.ts
import { DiagramScene, DiagramNode, AwsNodeType, DiagramGroup, DiagramEdge } from "./sceneTypes";

interface PulumiResource {
  urn: string;
  type: string;   // e.g. "aws:ec2/vpc:Vpc"
  name: string;
  // you can extend with props/outputs if needed
}

interface PulumiPreview {
  // extremely simplified view of the JSON
  steps: {
    op: "create" | "update" | "delete" | string;
    new?: { resource: PulumiResource };
  }[];
}

const typeMap: Record<string, AwsNodeType> = {
  "aws:ec2/vpc:Vpc": "vpc",
  "aws:ec2/subnet:Subnet": "subnet_private", // default, we will re-tag some as public
  "aws:ec2/internetGateway:InternetGateway": "internet_gateway",
  "aws:ec2/natGateway:NatGateway": "nat_gateway",
  "aws:lb/loadBalancer:LoadBalancer": "alb",
  "aws:ec2/instance:Instance": "ec2",
  "aws:ecs/service:Service": "ecs_service",
  "aws:rds/instance:Instance": "rds",
  "aws:s3/bucket:Bucket": "s3",
  "aws:lambda/function:Function": "lambda",
};

const guessNodeType = (r: PulumiResource): AwsNodeType => {
  if (typeMap[r.type]) return typeMap[r.type];
  if (r.type.startsWith("aws:ec2/subnet")) {
    // simple heuristic: names containing "public" / "private"
    if (/public/i.test(r.name)) return "subnet_public";
    if (/private/i.test(r.name)) return "subnet_private";
    return "subnet_private";
  }
  return "other";
};

// You can expand this as needed
export const mapPulumiPreviewToVpcScene = (
  preview: PulumiPreview,
  sceneId = "vpc-scene"
): DiagramScene => {
  const createdResources = preview.steps
    .filter((s) => s.op === "create" && s.new?.resource)
    .map((s) => s.new!.resource);

  const nodes: DiagramNode[] = createdResources.map((r) => ({
    id: r.urn,
    label: r.name,
    type: guessNodeType(r),
  }));

  const vpc = nodes.find((n) => n.type === "vpc");
  const subnets = nodes.filter((n) => n.type === "subnet_public" || n.type === "subnet_private");

  const groups: DiagramGroup[] = [];
  if (vpc) {
    groups.push({
      id: vpc.id,
      label: vpc.label,
      type: "vpc",
      children: subnets.map((s) => s.id),
    });
  }

  // Very naive edges: ALB -> ECS -> RDS if present
  const edges: DiagramEdge[] = [];
  const alb = nodes.find((n) => n.type === "alb");
  const ecs = nodes.find((n) => n.type === "ecs_service");
  const rds = nodes.find((n) => n.type === "rds");
  if (alb && ecs) {
    edges.push({ id: "edge-alb-ecs", from: alb.id, to: ecs.id, kind: "traffic" });
  }
  if (ecs && rds) {
    edges.push({ id: "edge-ecs-rds", from: ecs.id, to: rds.id, kind: "traffic" });
  }

  return {
    id: sceneId,
    title: "VPC layout from Pulumi stack",
    layout: "vpc-public-private",
    nodes,
    groups,
    edges,
  };
};
