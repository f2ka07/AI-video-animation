// ============================================================================
// Outputs and Stack References
// Module 9
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
// Create Network Stack with Outputs
// ============================================================================
// Network stack - exports VPC and subnet information
// This stack manages all networking resources

// ... (VPC, subnets, gateways, route tables created here) ...

// Export values for other stacks to use
export const vpcId = vpc.id;
export const publicSubnetIds = [publicSubnet1.id, publicSubnet2.id];
export const privateSubnetIds = [privateSubnet1.id, privateSubnet2.id];
export const webSecurityGroupId = webSg.id;
export const appSecurityGroupId = appSg.id;
export const dbSecurityGroupId = dbSg.id;
export const natGatewayId = natGateway.id;

// ============================================================================
// Create Application Stack with Stack References
// ============================================================================
// Application stack - references network stack

// Reference the network stack
const networkStack = new pulumi.StackReference("network", {
    name: "your-org/network-stack/dev", // Format: org/project/stack
});

// Get outputs from network stack
const vpcId = networkStack.requireOutput("vpcId");
const publicSubnetIds = networkStack.requireOutput("publicSubnetIds") as pulumi.Output<string[]>;
const webSgId = networkStack.requireOutput("webSecurityGroupId");

// Create resources using referenced values
const webServer = new aws.ec2.Instance("web-server", {
    // Use subnet from network stack
    subnetId: publicSubnetIds.apply(ids => ids[0]),
    vpcSecurityGroupIds: [webSgId],
    // ... other configuration ...
});

// Export application-specific outputs
export const webServerId = webServer.id;

// ============================================================================
// Exports
// ============================================================================
