// ============================================================================
// Complete AWS Infrastructure Setup
// Combines Modules 3-8: VPC, Subnets, NAT, Security, EC2, ALB, RDS
// ============================================================================
// This is a complete, production-ready infrastructure setup.
// Run: pulumi up

import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

// ============================================================================
// Module 3: Provisioning a Basic VPC Stack
// ============================================================================

// Create VPC with DNS Support
// Create a VPC with CIDR block 10.0.0.0/16
// This provides 65,536 IP addresses (2^16)
const vpc = new aws.ec2.Vpc("main-vpc", {
    cidrBlock: "10.0.0.0/16",
    // Enable DNS so instances can resolve each other by hostname
    enableDnsHostnames: true,
    enableDnsSupport: true,
    tags: {
        Name: "main-vpc",
    },
});

// Create Public Subnets Across Availability Zones
// Create public subnets in different AZs for high availability
// Public subnets can directly access the internet
const publicSubnet1 = new aws.ec2.Subnet("public-subnet-1", {
    vpcId: vpc.id,
    cidrBlock: "10.0.1.0/24", // 256 IP addresses
    availabilityZone: "us-east-1a",
    // Automatically assign public IPs to instances
    mapPublicIpOnLaunch: true,
    tags: {
        Name: "public-subnet-1",
    },
});

const publicSubnet2 = new aws.ec2.Subnet("public-subnet-2", {
    vpcId: vpc.id,
    cidrBlock: "10.0.2.0/24", // 256 IP addresses
    availabilityZone: "us-east-1b",
    mapPublicIpOnLaunch: true,
    tags: {
        Name: "public-subnet-2",
    },
});

// Create Internet Gateway and Route Table
// Internet Gateway provides internet connectivity for the VPC
const igw = new aws.ec2.InternetGateway("main-igw", {
    vpcId: vpc.id,
    tags: {
        Name: "main-igw",
    },
});

// Route table defines how traffic flows
// The default route (0.0.0.0/0) sends all internet-bound traffic to the IGW
const publicRouteTable = new aws.ec2.RouteTable("public-rt", {
    vpcId: vpc.id,
    routes: [{
        cidrBlock: "0.0.0.0/0", // All traffic
        gatewayId: igw.id,      // Goes to internet gateway
    }],
    tags: {
        Name: "public-rt",
    },
});

// Associate public route table with public subnets
const publicSubnet1RouteTableAssociation = new aws.ec2.RouteTableAssociation(
    "public-subnet-1-rta",
    {
        subnetId: publicSubnet1.id,
        routeTableId: publicRouteTable.id,
    }
);

const publicSubnet2RouteTableAssociation = new aws.ec2.RouteTableAssociation(
    "public-subnet-2-rta",
    {
        subnetId: publicSubnet2.id,
        routeTableId: publicRouteTable.id,
    }
);


// ============================================================================
// Module 4: Private Subnets and NAT Gateway
// ============================================================================

// Create Private Subnets
// Create private subnets in the same AZs as public subnets
// Private subnets do NOT get public IP addresses
const privateSubnet1 = new aws.ec2.Subnet("private-subnet-1", {
    vpcId: vpc.id,
    cidrBlock: "10.0.3.0/24", // 256 IP addresses
    availabilityZone: "us-east-1a",
    mapPublicIpOnLaunch: false, // No public IPs
    tags: {
        Name: "private-subnet-1",
    },
});

const privateSubnet2 = new aws.ec2.Subnet("private-subnet-2", {
    vpcId: vpc.id,
    cidrBlock: "10.0.4.0/24", // 256 IP addresses
    availabilityZone: "us-east-1b",
    mapPublicIpOnLaunch: false, // No public IPs
    tags: {
        Name: "private-subnet-2",
    },
});

// Allocate Elastic IP for NAT Gateway
// Elastic IP provides a static public IP address
// Required for NAT Gateway to maintain consistent outbound IP
const natEip = new aws.ec2.Eip("nat-eip", {
    domain: "vpc",
    tags: {
        Name: "nat-gateway-eip",
    },
});

// Create NAT Gateway in Public Subnet
// NAT Gateway must be in a public subnet
// It provides outbound internet access for private subnets
const natGateway = new aws.ec2.NatGateway("main-nat", {
    allocationId: natEip.id,
    subnetId: publicSubnet1.id, // Must be in public subnet
    tags: {
        Name: "main-nat-gateway",
    },
    // Note: NAT Gateway creation takes a few minutes
});

// Create Route Table for Private Subnets
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

// ============================================================================
// Module 5: Security Groups and Network ACLs
// ============================================================================

// Create Security Groups with Least Privilege
// Web server security group - allows HTTP/HTTPS from internet
const webSg = new aws.ec2.SecurityGroup("web-sg", {
    vpcId: vpc.id,
    description: "Security group for web servers",
    ingress: [
        {
            protocol: "tcp",
            fromPort: 80,
            toPort: 80,
            cidrBlocks: ["0.0.0.0/0"], // HTTP from anywhere
        },
        {
            protocol: "tcp",
            fromPort: 443,
            toPort: 443,
            cidrBlocks: ["0.0.0.0/0"], // HTTPS from anywhere
        },
    ],
    egress: [{
        protocol: "-1", // All protocols
        fromPort: 0,
        toPort: 0,
        cidrBlocks: ["0.0.0.0/0"], // Allow all outbound
    }],
    tags: {
        Name: "web-sg",
    },
});

// Application server security group - only from web servers
const appSg = new aws.ec2.SecurityGroup("app-sg", {
    vpcId: vpc.id,
    description: "Security group for application servers",
    ingress: [{
        protocol: "tcp",
        fromPort: 8000,
        toPort: 8000,
        sourceSecurityGroupId: webSg.id, // Only from web servers
    }],
    egress: [{
        protocol: "-1",
        fromPort: 0,
        toPort: 0,
        cidrBlocks: ["0.0.0.0/0"],
    }],
    tags: {
        Name: "app-sg",
    },
});

// Database security group - only from application servers
const dbSg = new aws.ec2.SecurityGroup("db-sg", {
    vpcId: vpc.id,
    description: "Security group for database",
    ingress: [{
        protocol: "tcp",
        fromPort: 3306,
        toPort: 3306,
        sourceSecurityGroupId: appSg.id, // Only from app servers
    }],
    egress: [{
        protocol: "-1",
        fromPort: 0,
        toPort: 0,
        cidrBlocks: ["0.0.0.0/0"],
    }],
    tags: {
        Name: "db-sg",
    },
});

// Create Network ACL for Subnet Protection
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

// ============================================================================
// Module 6: EC2 Instances and Launch Templates
// ============================================================================

// Create IAM Role for EC2 Instances
// IAM role allows EC2 instances to access AWS services securely
const ec2Role = new aws.iam.Role("ec2-role", {
    assumeRolePolicy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [{
            Action: "sts:AssumeRole",
            Effect: "Allow",
            Principal: {
                Service: "ec2.amazonaws.com",
            },
        }],
    }),
    tags: {
        Name: "ec2-instance-role",
    },
});

// Attach AWS managed policy for Systems Manager access
const ssmPolicy = new aws.iam.RolePolicyAttachment("ec2-ssm-policy", {
    role: ec2Role.name,
    policyArn: "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore",
});

// Instance profile is required for EC2 instances to use IAM roles
const ec2InstanceProfile = new aws.iam.InstanceProfile("ec2-profile", {
    role: ec2Role.name,
    tags: {
        Name: "ec2-instance-profile",
    },
});

// Create Launch Template for Web Servers
// Get the latest Amazon Linux 2023 AMI
const ami = aws.ec2.getAmi({
    filters: [{
        name: "name",
        values: ["al2023-ami-*-x86_64"],
    }],
    owners: ["amazon"],
    mostRecent: true,
});

// Launch Template for web servers
const webLaunchTemplate = new aws.ec2.LaunchTemplate("web-launch-template", {
    namePrefix: "web-server-",
    imageId: ami.then(a => a.id),
    instanceType: "t3.micro",
    vpcSecurityGroupIds: [webSg.id],
    iamInstanceProfile: {
        name: ec2InstanceProfile.name,
    },
    userData: Buffer.from("#!/bin/bash\n        yum update -y\n        yum install -y httpd\n        systemctl start httpd\n        systemctl enable httpd\n        echo \"<h1>Hello from Pulumi!</h1>\" > /var/www/html/index.html\n    ").toString("base64"),
    metadataOptions: {
        httpEndpoint: "enabled",
        httpTokens: "required", // Enforce IMDSv2
        httpPutResponseHopLimit: 1,
    },
    tagSpecifications: [{
        resourceType: "instance",
        tags: {
            Name: "web-server",
            Environment: "production",
        },
    }],
});

// Launch EC2 Instances from Launch Template
// Launch web server instances in public subnets
const webServer1 = new aws.ec2.Instance("web-server-1", {
    launchTemplate: {
        id: webLaunchTemplate.id,
        version: "$Latest", // Use latest template version
    },
    subnetId: publicSubnet1.id,
    tags: {
        Name: "web-server-1",
    },
});

const webServer2 = new aws.ec2.Instance("web-server-2", {
    launchTemplate: {
        id: webLaunchTemplate.id,
        version: "$Latest",
    },
    subnetId: publicSubnet2.id,
    tags: {
        Name: "web-server-2",
    },
});

// Export instance public IPs for easy access
export const webServer1Ip = webServer1.publicIp;
export const webServer2Ip = webServer2.publicIp;

// ============================================================================
// Module 7: Application Load Balancer
// ============================================================================

// Create Target Group for EC2 Instances
// Target Group defines which instances receive traffic
const webTargetGroup = new aws.lb.TargetGroup("web-targets", {
    port: 80,
    protocol: "HTTP",
    vpcId: vpc.id,
    targetType: "instance",
    healthCheck: {
        enabled: true,
        path: "/",
        protocol: "HTTP",
        healthyThreshold: 2,
        unhealthyThreshold: 2,
        timeout: 5,
        interval: 30,
        matcher: "200",
    },
    tags: {
        Name: "web-target-group",
    },
});

// Create Application Load Balancer
// Application Load Balancer in public subnets
const webAlb = new aws.lb.LoadBalancer("web-alb", {
    name: "web-alb",
    loadBalancerType: "application",
    subnets: [publicSubnet1.id, publicSubnet2.id],
    securityGroups: [webSg.id],
    enableDeletionProtection: false, // Set to true in production
    enableHttp2: true,
    tags: {
        Name: "web-alb",
    },
});

// Register EC2 Instances with Target Group
// Register web server instances with target group
const webTarget1 = new aws.lb.TargetGroupAttachment("web-target-1", {
    targetGroupId: webTargetGroup.id,
    targetId: webServer1.id,
    port: 80,
});

const webTarget2 = new aws.lb.TargetGroupAttachment("web-target-2", {
    targetGroupId: webTargetGroup.id,
    targetId: webServer2.id,
    port: 80,
});

// Create Load Balancer Listener
// Listener defines how ALB handles incoming traffic
const webListener = new aws.lb.Listener("web-listener", {
    loadBalancerArn: webAlb.arn,
    port: 80,
    protocol: "HTTP",
    defaultActions: [{
        type: "forward",
        targetGroupArn: webTargetGroup.arn,
    }],
});

// Export ALB DNS name for easy access
export const albDnsName = webAlb.dnsName;

// ============================================================================
// Module 8: RDS Database in Private Subnets
// ============================================================================

// Create DB Subnet Group
// DB Subnet Group defines which subnets RDS can use
// Must span at least 2 AZs for high availability
const dbSubnetGroup = new aws.rds.SubnetGroup("db-subnet-group", {
    name: "main-db-subnet-group",
    subnetIds: [privateSubnet1.id, privateSubnet2.id],
    tags: {
        Name: "main-db-subnet-group",
    },
});

// Create DB Parameter Group
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

// Create RDS MySQL Database Instance
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
export const vpcId = vpc.id;
export const publicSubnetIds = [publicSubnet1.id, publicSubnet2.id];
export const privateSubnetIds = [privateSubnet1.id, privateSubnet2.id];
export const natGatewayId = natGateway.id;
export const webSecurityGroupId = webSg.id;
export const albDnsName = webAlb.dnsName;
export const dbEndpoint = dbInstance.endpoint;
