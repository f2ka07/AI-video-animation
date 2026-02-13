// Launch EC2 Instances from Launch Template
// This is a code snippet from Module 6
// Note: This file may reference variables from other slides
// For a complete, runnable version, see index.ts in this directory

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