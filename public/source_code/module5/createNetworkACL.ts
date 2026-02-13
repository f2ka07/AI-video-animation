// Create Network ACL for Subnet Protection
// This is a code snippet from Module 5
// Note: This file may reference variables from other slides
// For a complete, runnable version, see index.ts in this directory

// Network ACL provides subnet-level firewall
// Rules are evaluated in order (lower number = higher priority)
const publicNacl = new aws.ec2.NetworkAcl("public-nacl", {
    vpcId: vpc.id,
    tags: {
        Name: "public-nacl",
    },
});

// Inbound rules - allow HTTP, HTTPS, and ephemeral ports
const httpInbound = new aws.ec2.NetworkAclRule("http-inbound", {
    networkAclId: publicNacl.id,
    ruleNumber: 100,
    protocol: "tcp",
    ruleAction: "allow",
    cidrBlock: "0.0.0.0/0",
    fromPort: 80,
    toPort: 80,
});

const httpsInbound = new aws.ec2.NetworkAclRule("https-inbound", {
    networkAclId: publicNacl.id,
    ruleNumber: 110,
    protocol: "tcp",
    ruleAction: "allow",
    cidrBlock: "0.0.0.0/0",
    fromPort: 443,
    toPort: 443,
});

// Ephemeral ports for return traffic (1024-65535)
const ephemeralInbound = new aws.ec2.NetworkAclRule("ephemeral-inbound", {
    networkAclId: publicNacl.id,
    ruleNumber: 120,
    protocol: "tcp",
    ruleAction: "allow",
    cidrBlock: "0.0.0.0/0",
    fromPort: 1024,
    toPort: 65535,
});

// Outbound rules - allow all traffic
const allOutbound = new aws.ec2.NetworkAclRule("all-outbound", {
    networkAclId: publicNacl.id,
    ruleNumber: 100,
    protocol: "-1",
    ruleAction: "allow",
    cidrBlock: "0.0.0.0/0",
    fromPort: 0,
    toPort: 0,
    egress: true,
});

// Associate NACL with public subnet
const publicNaclAssociation = new aws.ec2.NetworkAclAssociation("public-nacl-assoc", {
    networkAclId: publicNacl.id,
    subnetId: publicSubnet1.id,
});