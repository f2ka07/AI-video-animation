// Complete Pulumi code for Outputs and Stack References
// Module 9
// 
// NOTE: This file combines all TypeScript code from this module.
// Some resources may depend on resources from previous modules.
// Review and adjust variable references as needed.

import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

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
// Uncomment and adjust these exports based on what you need:
// export const vpcId = vpc.id;
// export const subnetIds = [publicSubnet1.id, publicSubnet2.id];
