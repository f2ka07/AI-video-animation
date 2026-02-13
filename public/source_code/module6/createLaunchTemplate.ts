// Create Launch Template for Web Servers
// This is a code snippet from Module 6
// Note: This file may reference variables from other slides
// For a complete, runnable version, see index.ts in this directory

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