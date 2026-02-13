// Create Public Subnets Across Availability Zones
// This is a code snippet from Module 3
// Note: This file may reference variables from other slides
// For a complete, runnable version, see index.ts in this directory

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