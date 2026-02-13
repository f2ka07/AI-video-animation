// Create Load Balancer Listener
// This is a code snippet from Module 7
// Note: This file may reference variables from other slides
// For a complete, runnable version, see index.ts in this directory

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