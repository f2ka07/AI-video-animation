// Complete Pulumi code for Application Load Balancer
// Module 7
// 
// NOTE: This file combines all TypeScript code from this module.
// Some resources may depend on resources from previous modules.
// Review and adjust variable references as needed.

import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

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
// Uncomment and adjust these exports based on what you need:
// export const vpcId = vpc.id;
// export const subnetIds = [publicSubnet1.id, publicSubnet2.id];
