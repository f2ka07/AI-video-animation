// Create DB Subnet Group
// This is a code snippet from Module 8
// Note: This file may reference variables from other slides
// For a complete, runnable version, see index.ts in this directory

// DB Subnet Group defines which subnets RDS can use
// Must span at least 2 AZs for high availability
const dbSubnetGroup = new aws.rds.SubnetGroup("db-subnet-group", {
    name: "main-db-subnet-group",
    subnetIds: [privateSubnet1.id, privateSubnet2.id],
    tags: {
        Name: "main-db-subnet-group",
    },
});