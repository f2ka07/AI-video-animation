// ============================================================================
// EC2 Instances and Launch Templates
// Module 6
// ============================================================================
// This is a complete, runnable Pulumi program.
// Run: pulumi up

import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

// NOTE: This module depends on resources from previous modules.
// For a complete setup, combine with modules: 3, 4, 5
// Or ensure these resources exist:
//   - Module 3: Provisioning a Basic VPC Stack
//   - Module 4: Private Subnets and NAT Gateway
//   - Module 5: Security Groups and Network ACLs

// VPC and networking resources (from Module 3)
// Uncomment and adjust if not combining with Module 3:
/*
const vpc = new aws.ec2.Vpc("main-vpc", {
    cidrBlock: "10.0.0.0/16",
    enableDnsHostnames: true,
    enableDnsSupport: true,
    tags: { Name: "main-vpc" },
});
*/

// ============================================================================
// Create IAM Role for EC2 Instances
// ============================================================================
// IAM role allows EC2 instances to access AWS services securely
const ec2Role = new aws.iam.Role("ec2-role", {
    assumeRolePolicy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [{
            Action: "sts:AssumeRole",
            Effect: "Allow",
            Principal: {
                Service: "ec2.amazonaws.com",
            },
        }],
    }),
    tags: {
        Name: "ec2-instance-role",
    },
});

// Attach AWS managed policy for Systems Manager access
const ssmPolicy = new aws.iam.RolePolicyAttachment("ec2-ssm-policy", {
    role: ec2Role.name,
    policyArn: "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore",
});

// Instance profile is required for EC2 instances to use IAM roles
const ec2InstanceProfile = new aws.iam.InstanceProfile("ec2-profile", {
    role: ec2Role.name,
    tags: {
        Name: "ec2-instance-profile",
    },
});

// ============================================================================
// Create Launch Template for Web Servers
// ============================================================================
// Get the latest Amazon Linux 2023 AMI
const ami = aws.ec2.getAmi({
    filters: [{
        name: "name",
        values: ["al2023-ami-*-x86_64"],
    }],
    owners: ["amazon"],
    mostRecent: true,
});

// Launch Template for web servers
const webLaunchTemplate = new aws.ec2.LaunchTemplate("web-launch-template", {
    namePrefix: "web-server-",
    imageId: ami.then(a => a.id),
    instanceType: "t3.micro",
    vpcSecurityGroupIds: [webSg.id],
    iamInstanceProfile: {
        name: ec2InstanceProfile.name,
    },
    userData: Buffer.from("#!/bin/bash\n        yum update -y\n        yum install -y httpd\n        systemctl start httpd\n        systemctl enable httpd\n        echo \"<h1>Hello from Pulumi!</h1>\" > /var/www/html/index.html\n    ").toString("base64"),
    metadataOptions: {
        httpEndpoint: "enabled",
        httpTokens: "required", // Enforce IMDSv2
        httpPutResponseHopLimit: 1,
    },
    tagSpecifications: [{
        resourceType: "instance",
        tags: {
            Name: "web-server",
            Environment: "production",
        },
    }],
});

// ============================================================================
// Launch EC2 Instances from Launch Template
// ============================================================================
// Launch web server instances in public subnets
const webServer1 = new aws.ec2.Instance("web-server-1", {
    launchTemplate: {
        id: webLaunchTemplate.id,
        version: "$Latest", // Use latest template version
    },
    subnetId: publicSubnet1.id,
    tags: {
        Name: "web-server-1",
    },
});

const webServer2 = new aws.ec2.Instance("web-server-2", {
    launchTemplate: {
        id: webLaunchTemplate.id,
        version: "$Latest",
    },
    subnetId: publicSubnet2.id,
    tags: {
        Name: "web-server-2",
    },
});

// Export instance public IPs for easy access
export const webServer1Ip = webServer1.publicIp;
export const webServer2Ip = webServer2.publicIp;

// ============================================================================
// Exports
// ============================================================================
export const webServer1Id = webServer1.id;
export const webServer1Ip = webServer1.publicIp;
