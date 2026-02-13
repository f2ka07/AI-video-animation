// Complete Pulumi code for RDS Database in Private Subnets
// Module 8
// 
// NOTE: This file combines all TypeScript code from this module.
// Some resources may depend on resources from previous modules.
// Review and adjust variable references as needed.

import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

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
// Uncomment and adjust these exports based on what you need:
// export const vpcId = vpc.id;
// export const subnetIds = [publicSubnet1.id, publicSubnet2.id];
