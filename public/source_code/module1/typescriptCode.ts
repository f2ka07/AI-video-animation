// TypeScript Infrastructure Code
// This is a code snippet from Module 1
// Note: This file may reference variables from other slides
// For a complete, runnable version, see index.ts in this directory

import * as aws from "@pulumi/aws";

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