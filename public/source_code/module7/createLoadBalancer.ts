// Create Application Load Balancer
// This is a code snippet from Module 7
// Note: This file may reference variables from other slides
// For a complete, runnable version, see index.ts in this directory

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