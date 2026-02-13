// Create VPC with DNS Support
// This is a code snippet from Module 3
// Note: This file may reference variables from other slides
// For a complete, runnable version, see index.ts in this directory

import * as aws from "@pulumi/aws";

// Create a VPC with CIDR block 10.0.0.0/16
// This provides 65,536 IP addresses (2^16)
const vpc = new aws.ec2.Vpc("main-vpc", {
    cidrBlock: "10.0.0.0/16",
    // Enable DNS so instances can resolve each other by hostname
    enableDnsHostnames: true,
    enableDnsSupport: true,
    tags: {
        Name: "main-vpc",
    },
});