// ============================================================================
// Application Load Balancer
// Module 7
// ============================================================================
// This is a complete, runnable Pulumi program.
// Run: pulumi up

import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

// NOTE: This module depends on resources from previous modules.
// For a complete setup, combine with modules: 3, 4, 5, 6
// Or ensure these resources exist:
//   - Module 3: Provisioning a Basic VPC Stack
//   - Module 4: Private Subnets and NAT Gateway
//   - Module 5: Security Groups and Network ACLs
//   - Module 6: EC2 Instances and Launch Templates

// VPC and networking resources (from Module 3)
// Uncomment and adjust if not combining with Module 3:
/*
const vpc = new aws.ec2.Vpc("main-vpc", {
    cidrBlock: "10.0.0.0/16",
    enableDnsHostnames: true,
    enableDnsSupport: true,
    tags: { Name: "main-vpc" },
});
*/

// ============================================================================
// Create Target Group for EC2 Instances
// ============================================================================
// Target Group defines which instances receive traffic
const webTargetGroup = new aws.lb.TargetGroup("web-targets", {
    port: 80,
    protocol: "HTTP",
    vpcId: vpc.id,
    targetType: "instance",
    healthCheck: {
        enabled: true,
        path: "/",
        protocol: "HTTP",
        healthyThreshold: 2,
        unhealthyThreshold: 2,
        timeout: 5,
        interval: 30,
        matcher: "200",
    },
    tags: {
        Name: "web-target-group",
    },
});

// ============================================================================
// Create Application Load Balancer
// ============================================================================
// Application Load Balancer in public subnets
const webAlb = new aws.lb.LoadBalancer("web-alb", {
    name: "web-alb",
    loadBalancerType: "application",
    subnets: [publicSubnet1.id, publicSubnet2.id],
    securityGroups: [webSg.id],
    enableDeletionProtection: false, // Set to true in production
    enableHttp2: true,
    tags: {
        Name: "web-alb",
    },
});

// ============================================================================
// Register EC2 Instances with Target Group
// ============================================================================
// Register web server instances with target group
const webTarget1 = new aws.lb.TargetGroupAttachment("web-target-1", {
    targetGroupId: webTargetGroup.id,
    targetId: webServer1.id,
    port: 80,
});

const webTarget2 = new aws.lb.TargetGroupAttachment("web-target-2", {
    targetGroupId: webTargetGroup.id,
    targetId: webServer2.id,
    port: 80,
});

// ============================================================================
// Create Load Balancer Listener
// ============================================================================
// Listener defines how ALB handles incoming traffic
const webListener = new aws.lb.Listener("web-listener", {
    loadBalancerArn: webAlb.arn,
    port: 80,
    protocol: "HTTP",
    defaultActions: [{
        type: "forward",
        targetGroupArn: webTargetGroup.arn,
    }],
});

// Export ALB DNS name for easy access
export const albDnsName = webAlb.dnsName;

// ============================================================================
// Exports
// ============================================================================
export const albDnsName = webAlb.dnsName;
export const albArn = webAlb.arn;
