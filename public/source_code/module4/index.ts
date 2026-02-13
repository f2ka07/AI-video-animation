// Complete Pulumi code for Private Subnets and NAT Gateway
// Module 4
// 
// NOTE: This file combines all TypeScript code from this module.
// Some resources may depend on resources from previous modules.
// Review and adjust variable references as needed.

import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

// ============================================================================
// Create Private Subnets
// ============================================================================
// Create private subnets in the same AZs as public subnets
// Private subnets do NOT get public IP addresses
const privateSubnet1 = new aws.ec2.Subnet("private-subnet-1", {
    vpcId: vpc.id,
    cidrBlock: "10.0.3.0/24", // 256 IP addresses
    availabilityZone: "us-east-1a",
    mapPublicIpOnLaunch: false, // No public IPs
    tags: {
        Name: "private-subnet-1",
    },
});

const privateSubnet2 = new aws.ec2.Subnet("private-subnet-2", {
    vpcId: vpc.id,
    cidrBlock: "10.0.4.0/24", // 256 IP addresses
    availabilityZone: "us-east-1b",
    mapPublicIpOnLaunch: false, // No public IPs
    tags: {
        Name: "private-subnet-2",
    },
});

// ============================================================================
// Allocate Elastic IP for NAT Gateway
// ============================================================================
// Elastic IP provides a static public IP address
// Required for NAT Gateway to maintain consistent outbound IP
const natEip = new aws.ec2.Eip("nat-eip", {
    domain: "vpc",
    tags: {
        Name: "nat-gateway-eip",
    },
});

// ============================================================================
// Create NAT Gateway in Public Subnet
// ============================================================================
// NAT Gateway must be in a public subnet
// It provides outbound internet access for private subnets
const natGateway = new aws.ec2.NatGateway("main-nat", {
    allocationId: natEip.id,
    subnetId: publicSubnet1.id, // Must be in public subnet
    tags: {
        Name: "main-nat-gateway",
    },
    // Note: NAT Gateway creation takes a few minutes
});

// ============================================================================
// Create Route Table for Private Subnets
// ============================================================================
// Route table for private subnets
// Routes internet traffic through NAT Gateway (not Internet Gateway)
const privateRouteTable = new aws.ec2.RouteTable("private-rt", {
    vpcId: vpc.id,
    routes: [{
        cidrBlock: "0.0.0.0/0", // All internet traffic
        natGatewayId: natGateway.id, // Goes through NAT Gateway
    }],
    tags: {
        Name: "private-rt",
    },
});

// Associate route table with private subnets
const privateSubnet1RouteTableAssociation = new aws.ec2.RouteTableAssociation(
    "private-subnet-1-rta",
    {
        subnetId: privateSubnet1.id,
        routeTableId: privateRouteTable.id,
    }
);

const privateSubnet2RouteTableAssociation = new aws.ec2.RouteTableAssociation(
    "private-subnet-2-rta",
    {
        subnetId: privateSubnet2.id,
        routeTableId: privateRouteTable.id,
    }
);

// ============================================================================
// Exports
// ============================================================================
// Uncomment and adjust these exports based on what you need:
// export const vpcId = vpc.id;
// export const subnetIds = [publicSubnet1.id, publicSubnet2.id];
