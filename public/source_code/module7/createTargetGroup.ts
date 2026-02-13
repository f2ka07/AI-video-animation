// Create Target Group for EC2 Instances
// This is a code snippet from Module 7
// Note: This file may reference variables from other slides
// For a complete, runnable version, see index.ts in this directory

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