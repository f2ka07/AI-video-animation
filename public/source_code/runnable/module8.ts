// ============================================================================
// RDS Database in Private Subnets
// Module 8
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
// Create DB Subnet Group
// ============================================================================
// DB Subnet Group defines which subnets RDS can use
// Must span at least 2 AZs for high availability
const dbSubnetGroup = new aws.rds.SubnetGroup("db-subnet-group", {
    name: "main-db-subnet-group",
    subnetIds: [privateSubnet1.id, privateSubnet2.id],
    tags: {
        Name: "main-db-subnet-group",
    },
});

// ============================================================================
// Create DB Parameter Group
// ============================================================================
// Parameter Group customizes database engine settings
const dbParameterGroup = new aws.rds.ParameterGroup("db-params", {
    family: "mysql8.0",
    name: "main-db-params",
    parameters: [
        {
            name: "max_connections",
            value: "100",
        },
        {
            name: "character_set_server",
            value: "utf8mb4",
        },
    ],
    tags: {
        Name: "main-db-params",
    },
});

// ============================================================================
// Create RDS MySQL Database Instance
// ============================================================================
// RDS MySQL database instance in private subnets
const dbInstance = new aws.rds.Instance("main-db", {
    engine: "mysql",
    engineVersion: "8.0",
    instanceClass: "db.t3.micro",
    allocatedStorage: 20,
    storageType: "gp3",
    
    dbName: "appdb",
    username: "admin",
    password: "ChangeMe123!", // Use Pulumi secrets in production
    
    dbSubnetGroupName: dbSubnetGroup.name,
    vpcSecurityGroupIds: [dbSg.id],
    parameterGroupName: dbParameterGroup.name,
    
    publiclyAccessible: false, // Security best practice
    multiAz: false, // Enable for production
    backupRetentionPeriod: 7,
    backupWindow: "03:00-04:00",
    maintenanceWindow: "sun:04:00-sun:05:00",
    
    deletionProtection: false, // Set to true in production
    skipFinalSnapshot: true, // Set to false in production
    
    tags: {
        Name: "main-database",
    },
});

// Export database endpoint for application connection
export const dbEndpoint = dbInstance.endpoint;

// ============================================================================
// Exports
// ============================================================================
export const dbEndpoint = dbInstance.endpoint;
export const dbAddress = dbInstance.address;
