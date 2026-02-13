// Create Transit Gateway with VPC Attachments
// This is a code snippet from Module 11
// Note: This file may reference variables from other slides
// For a complete, runnable version, see index.ts in this directory

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