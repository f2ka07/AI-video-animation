// Create Security Groups with Least Privilege
// This is a code snippet from Module 5
// Note: This file may reference variables from other slides
// For a complete, runnable version, see index.ts in this directory

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