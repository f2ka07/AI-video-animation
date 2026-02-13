// Create VPC Peering Connection
// This is a code snippet from Module 11
// Note: This file may reference variables from other slides
// For a complete, runnable version, see index.ts in this directory

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