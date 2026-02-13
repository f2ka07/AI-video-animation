// Create IAM Role for EC2 Instances
// This is a code snippet from Module 6
// Note: This file may reference variables from other slides
// For a complete, runnable version, see index.ts in this directory

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