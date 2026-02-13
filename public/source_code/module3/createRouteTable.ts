// Create Internet Gateway and Route Table
// This is a code snippet from Module 3
// Note: This file may reference variables from other slides
// For a complete, runnable version, see index.ts in this directory

// Internet Gateway provides internet connectivity for the VPC
const igw = new aws.ec2.InternetGateway("main-igw", {
    vpcId: vpc.id,
    tags: {
        Name: "main-igw",
    },
});

// Route table defines how traffic flows
// The default route (0.0.0.0/0) sends all internet-bound traffic to the IGW
const publicRouteTable = new aws.ec2.RouteTable("public-rt", {
    vpcId: vpc.id,
    routes: [{
        cidrBlock: "0.0.0.0/0", // All traffic
        gatewayId: igw.id,      // Goes to internet gateway
    }],
    tags: {
        Name: "public-rt",
    },
});