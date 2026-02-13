// Allocate Elastic IP for NAT Gateway
// This is a code snippet from Module 4
// Note: This file may reference variables from other slides
// For a complete, runnable version, see index.ts in this directory

// Elastic IP provides a static public IP address
// Required for NAT Gateway to maintain consistent outbound IP
const natEip = new aws.ec2.Eip("nat-eip", {
    domain: "vpc",
    tags: {
        Name: "nat-gateway-eip",
    },
});