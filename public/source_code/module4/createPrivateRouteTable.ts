// Create Route Table for Private Subnets
// This is a code snippet from Module 4
// Note: This file may reference variables from other slides
// For a complete, runnable version, see index.ts in this directory

// Route table for private subnets
// Routes internet traffic through NAT Gateway (not Internet Gateway)
const privateRouteTable = new aws.ec2.RouteTable("private-rt", {
    vpcId: vpc.id,
    routes: [{
        cidrBlock: "0.0.0.0/0", // All internet traffic
        natGatewayId: natGateway.id, // Goes through NAT Gateway
    }],
    tags: {
        Name: "private-rt",
    },
});

// Associate route table with private subnets
const privateSubnet1RouteTableAssociation = new aws.ec2.RouteTableAssociation(
    "private-subnet-1-rta",
    {
        subnetId: privateSubnet1.id,
        routeTableId: privateRouteTable.id,
    }
);

const privateSubnet2RouteTableAssociation = new aws.ec2.RouteTableAssociation(
    "private-subnet-2-rta",
    {
        subnetId: privateSubnet2.id,
        routeTableId: privateRouteTable.id,
    }
);