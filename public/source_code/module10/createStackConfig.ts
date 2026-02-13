// Create Stack Configuration Files
// This is a code snippet from Module 10
// Note: This file may reference variables from other slides
// For a complete, runnable version, see index.ts in this directory

// Read stack configuration
import * as pulumi from "@pulumi/pulumi";

const config = new pulumi.Config();

// Environment-specific configuration with defaults
const environment = config.get("environment") || "dev";
const instanceType = config.get("instanceType") || "t3.micro";
const dbInstanceClass = config.get("dbInstanceClass") || "db.t3.micro";
const enableMultiAz = config.getBoolean("enableMultiAz") || false;
const minInstances = config.getNumber("minInstances") || 1;
const maxInstances = config.getNumber("maxInstances") || 2;

// Use configuration in resources
const webServer = new aws.ec2.Instance("web-server", {
    instanceType: instanceType, // From config
    // ... other configuration ...
});

// Pulumi.dev.yaml
// config:
//   environment: dev
//   instanceType: t3.micro
//   dbInstanceClass: db.t3.micro
//   enableMultiAz: false
//   minInstances: 1
//   maxInstances: 2

// Pulumi.prod.yaml
// config:
//   environment: production
//   instanceType: t3.large
//   dbInstanceClass: db.r5.large
//   enableMultiAz: true
//   minInstances: 2
//   maxInstances: 10