// Complete Pulumi code for Advanced Networking Patterns
// Module 11
// 
// NOTE: This file combines all TypeScript code from this module.
// Some resources may depend on resources from previous modules.
// Review and adjust variable references as needed.

import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

// ============================================================================
// Create VPC Peering Connection
// ============================================================================
// VPC Peering between two VPCs
const vpc1 = new aws.ec2.Vpc("vpc1", {
    cidrBlock: "10.0.0.0/16",
    // ... configuration ...
});

const vpc2 = new aws.ec2.Vpc("vpc2", {
    cidrBlock: "10.1.0.0/16",
    // ... configuration ...
});

// Create peering connection
const peering = new aws.ec2.VpcPeeringConnection("vpc-peering", {
    vpcId: vpc1.id,
    peerVpcId: vpc2.id,
    autoAccept: true, // Auto-accept if same account
    tags: {
        Name: "vpc1-to-vpc2",
    },
});

// Add routes in VPC1 to reach VPC2
const vpc1Route = new aws.ec2.Route("vpc1-to-vpc2", {
    routeTableId: vpc1RouteTable.id,
    destinationCidrBlock: "10.1.0.0/16", // VPC2's CIDR
    vpcPeeringConnectionId: peering.id,
});

// Add routes in VPC2 to reach VPC1
const vpc2Route = new aws.ec2.Route("vpc2-to-vpc1", {
    routeTableId: vpc2RouteTable.id,
    destinationCidrBlock: "10.0.0.0/16", // VPC1's CIDR
    vpcPeeringConnectionId: peering.id,
});

// ============================================================================
// Create Transit Gateway with VPC Attachments
// ============================================================================
// Create Transit Gateway
const tgw = new aws.ec2.TransitGateway("main-tgw", {
    description: "Main Transit Gateway",
    amazonSideAsn: 64512,
    tags: {
        Name: "main-tgw",
    },
});

// Attach VPC1 to Transit Gateway
const vpc1Attachment = new aws.ec2.TransitGatewayVpcAttachment("vpc1-attachment", {
    subnetIds: [vpc1Subnet1.id, vpc1Subnet2.id],
    transitGatewayId: tgw.id,
    vpcId: vpc1.id,
    tags: {
        Name: "vpc1-attachment",
    },
});

// Attach VPC2 to Transit Gateway
const vpc2Attachment = new aws.ec2.TransitGatewayVpcAttachment("vpc2-attachment", {
    subnetIds: [vpc2Subnet1.id, vpc2Subnet2.id],
    transitGatewayId: tgw.id,
    vpcId: vpc2.id,
    tags: {
        Name: "vpc2-attachment",
    },
});

// Create Transit Gateway route table
const tgwRouteTable = new aws.ec2.TransitGatewayRouteTable("main-tgw-rt", {
    transitGatewayId: tgw.id,
    tags: {
        Name: "main-tgw-rt",
    },
});

// Associate attachments with route table
const vpc1Association = new aws.ec2.TransitGatewayRouteTableAssociation("vpc1-assoc", {
    transitGatewayAttachmentId: vpc1Attachment.id,
    transitGatewayRouteTableId: tgwRouteTable.id,
});

const vpc2Association = new aws.ec2.TransitGatewayRouteTableAssociation("vpc2-assoc", {
    transitGatewayAttachmentId: vpc2Attachment.id,
    transitGatewayRouteTableId: tgwRouteTable.id,
});

// Add routes in VPC route tables to reach other VPCs via TGW
const vpc1ToVpc2Route = new aws.ec2.Route("vpc1-to-vpc2-via-tgw", {
    routeTableId: vpc1RouteTable.id,
    destinationCidrBlock: "10.1.0.0/16",
    transitGatewayId: tgw.id,
});

// ============================================================================
// Exports
// ============================================================================
// Uncomment and adjust these exports based on what you need:
// export const vpcId = vpc.id;
// export const subnetIds = [publicSubnet1.id, publicSubnet2.id];
