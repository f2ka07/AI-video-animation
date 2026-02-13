// ============================================================================
// AWS Infrastructure as Code with Pulumi
// Module 1
// ============================================================================
// This is a complete, runnable Pulumi program.
// Run: pulumi up

import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

// ============================================================================
// TypeScript Infrastructure Code
// ============================================================================
// Create a VPC with type safety
const vpc = new aws.ec2.Vpc("main-vpc", {
    cidrBlock: "10.0.0.0/16",
    enableDnsHostnames: true,
    enableDnsSupport: true,
    tags: {
        Name: "main-vpc",
        Environment: "production",
    },
});

// Export the VPC ID
export const vpcId = vpc.id;

// ============================================================================
// Exports
// ============================================================================
