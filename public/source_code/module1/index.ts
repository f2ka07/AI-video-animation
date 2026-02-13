// Complete Pulumi code for AWS Infrastructure as Code with Pulumi
// Module 1
// 
// NOTE: This file combines all TypeScript code from this module.
// Some resources may depend on resources from previous modules.
// Review and adjust variable references as needed.

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
// Uncomment and adjust these exports based on what you need:
// export const vpcId = vpc.id;
// export const subnetIds = [publicSubnet1.id, publicSubnet2.id];
