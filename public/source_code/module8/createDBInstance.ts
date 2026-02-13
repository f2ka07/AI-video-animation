// Create RDS MySQL Database Instance
// This is a code snippet from Module 8
// Note: This file may reference variables from other slides
// For a complete, runnable version, see index.ts in this directory

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