// Create Private Subnets
// This is a code snippet from Module 4
// Note: This file may reference variables from other slides
// For a complete, runnable version, see index.ts in this directory

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