// ============================================================================
// Multi-Environment Management
// Module 10
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
// Create Stack Configuration Files
// ============================================================================
// Read stack configuration

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

// ============================================================================
// Manage Secrets Securely
// ============================================================================
// Read secrets from configuration
const dbPassword = config.requireSecret("dbPassword");
const apiKey = config.requireSecret("apiKey");

// Use secrets in resources
const dbInstance = new aws.rds.Instance("db", {
    password: dbPassword, // Automatically encrypted
    // ... other configuration ...
});

// Set secrets via CLI (encrypted automatically)
// pulumi config set --secret dbPassword "MySecurePassword123!"
// pulumi config set --secret apiKey "sk-1234567890abcdef"

// Or in Pulumi.{stack}.yaml (encrypted by Pulumi service)
// config:
//   dbPassword:
//     secure: AAABAKdJZXl... (encrypted value)

// ============================================================================
// Exports
// ============================================================================
