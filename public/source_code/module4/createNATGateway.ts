// Create NAT Gateway in Public Subnet
// This is a code snippet from Module 4
// Note: This file may reference variables from other slides
// For a complete, runnable version, see index.ts in this directory

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