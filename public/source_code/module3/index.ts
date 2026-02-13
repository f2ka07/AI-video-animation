// Complete Pulumi code for Provisioning a Basic VPC Stack
// Module 3
// 
// NOTE: This file combines all TypeScript code from this module.
// Some resources may depend on resources from previous modules.
// Review and adjust variable references as needed.

import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

// ============================================================================
// Create VPC with DNS Support
// ============================================================================
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

// ============================================================================
// Create Public Subnets Across Availability Zones
// ============================================================================
// Create public subnets in different AZs for high availability
// Public subnets can directly access the internet
const publicSubnet1 = new aws.ec2.Subnet("public-subnet-1", {
    vpcId: vpc.id,
    cidrBlock: "10.0.1.0/24", // 256 IP addresses
    availabilityZone: "us-east-1a",
    // Automatically assign public IPs to instances
    mapPublicIpOnLaunch: true,
    tags: {
        Name: "public-subnet-1",
    },
});

const publicSubnet2 = new aws.ec2.Subnet("public-subnet-2", {
    vpcId: vpc.id,
    cidrBlock: "10.0.2.0/24", // 256 IP addresses
    availabilityZone: "us-east-1b",
    mapPublicIpOnLaunch: true,
    tags: {
        Name: "public-subnet-2",
    },
});

// ============================================================================
// Create Internet Gateway and Route Table
// ============================================================================
// Internet Gateway provides internet connectivity for the VPC
const igw = new aws.ec2.InternetGateway("main-igw", {
    vpcId: vpc.id,
    tags: {
        Name: "main-igw",
    },
});

// Route table defines how traffic flows
// The default route (0.0.0.0/0) sends all internet-bound traffic to the IGW
const publicRouteTable = new aws.ec2.RouteTable("public-rt", {
    vpcId: vpc.id,
    routes: [{
        cidrBlock: "0.0.0.0/0", // All traffic
        gatewayId: igw.id,      // Goes to internet gateway
    }],
    tags: {
        Name: "public-rt",
    },
});

// ============================================================================
// Exports
// ============================================================================
// Uncomment and adjust these exports based on what you need:
// export const vpcId = vpc.id;
// export const subnetIds = [publicSubnet1.id, publicSubnet2.id];
