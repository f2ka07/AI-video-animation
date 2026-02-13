// Complete Pulumi code for Security Groups and Network ACLs
// Module 5
// 
// NOTE: This file combines all TypeScript code from this module.
// Some resources may depend on resources from previous modules.
// Review and adjust variable references as needed.

import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

// ============================================================================
// Create Security Groups with Least Privilege
// ============================================================================
// Web server security group - allows HTTP/HTTPS from internet
const webSg = new aws.ec2.SecurityGroup("web-sg", {
    vpcId: vpc.id,
    description: "Security group for web servers",
    ingress: [
        {
            protocol: "tcp",
            fromPort: 80,
            toPort: 80,
            cidrBlocks: ["0.0.0.0/0"], // HTTP from anywhere
        },
        {
            protocol: "tcp",
            fromPort: 443,
            toPort: 443,
            cidrBlocks: ["0.0.0.0/0"], // HTTPS from anywhere
        },
    ],
    egress: [{
        protocol: "-1", // All protocols
        fromPort: 0,
        toPort: 0,
        cidrBlocks: ["0.0.0.0/0"], // Allow all outbound
    }],
    tags: {
        Name: "web-sg",
    },
});

// Application server security group - only from web servers
const appSg = new aws.ec2.SecurityGroup("app-sg", {
    vpcId: vpc.id,
    description: "Security group for application servers",
    ingress: [{
        protocol: "tcp",
        fromPort: 8000,
        toPort: 8000,
        sourceSecurityGroupId: webSg.id, // Only from web servers
    }],
    egress: [{
        protocol: "-1",
        fromPort: 0,
        toPort: 0,
        cidrBlocks: ["0.0.0.0/0"],
    }],
    tags: {
        Name: "app-sg",
    },
});

// Database security group - only from application servers
const dbSg = new aws.ec2.SecurityGroup("db-sg", {
    vpcId: vpc.id,
    description: "Security group for database",
    ingress: [{
        protocol: "tcp",
        fromPort: 3306,
        toPort: 3306,
        sourceSecurityGroupId: appSg.id, // Only from app servers
    }],
    egress: [{
        protocol: "-1",
        fromPort: 0,
        toPort: 0,
        cidrBlocks: ["0.0.0.0/0"],
    }],
    tags: {
        Name: "db-sg",
    },
});

// ============================================================================
// Create Network ACL for Subnet Protection
// ============================================================================
// Network ACL provides subnet-level firewall
// Rules are evaluated in order (lower number = higher priority)
const publicNacl = new aws.ec2.NetworkAcl("public-nacl", {
    vpcId: vpc.id,
    tags: {
        Name: "public-nacl",
    },
});

// Inbound rules - allow HTTP, HTTPS, and ephemeral ports
const httpInbound = new aws.ec2.NetworkAclRule("http-inbound", {
    networkAclId: publicNacl.id,
    ruleNumber: 100,
    protocol: "tcp",
    ruleAction: "allow",
    cidrBlock: "0.0.0.0/0",
    fromPort: 80,
    toPort: 80,
});

const httpsInbound = new aws.ec2.NetworkAclRule("https-inbound", {
    networkAclId: publicNacl.id,
    ruleNumber: 110,
    protocol: "tcp",
    ruleAction: "allow",
    cidrBlock: "0.0.0.0/0",
    fromPort: 443,
    toPort: 443,
});

// Ephemeral ports for return traffic (1024-65535)
const ephemeralInbound = new aws.ec2.NetworkAclRule("ephemeral-inbound", {
    networkAclId: publicNacl.id,
    ruleNumber: 120,
    protocol: "tcp",
    ruleAction: "allow",
    cidrBlock: "0.0.0.0/0",
    fromPort: 1024,
    toPort: 65535,
});

// Outbound rules - allow all traffic
const allOutbound = new aws.ec2.NetworkAclRule("all-outbound", {
    networkAclId: publicNacl.id,
    ruleNumber: 100,
    protocol: "-1",
    ruleAction: "allow",
    cidrBlock: "0.0.0.0/0",
    fromPort: 0,
    toPort: 0,
    egress: true,
});

// Associate NACL with public subnet
const publicNaclAssociation = new aws.ec2.NetworkAclAssociation("public-nacl-assoc", {
    networkAclId: publicNacl.id,
    subnetId: publicSubnet1.id,
});

// ============================================================================
// Exports
// ============================================================================
// Uncomment and adjust these exports based on what you need:
// export const vpcId = vpc.id;
// export const subnetIds = [publicSubnet1.id, publicSubnet2.id];
