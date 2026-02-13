// Content structure for all modules
// This is the ONLY file you need to edit - just add your scripts and metadata here
// Everything else is auto-generated from this

import { DiagramScene } from "../diagrams/sceneTypes";

export interface SlideContent {
	name: string; // Used for audio file name and slideName prop
	type: "title" | "content-two-card" | "content-single" | "code" | "code-diagram" | "comparison";
	script: string; // Narration text (will be converted to audio)
	title?: string; // Slide title (not needed for title slides)
	subtitle?: string; // Only for title slides
	points?: string[]; // For content slides
	code?: string; // For code slides
	language?: string; // For code slides (default: "typescript")
	scene?: DiagramScene; // For code-diagram slides
	leftItems?: string[]; // For comparison slides
	rightItems?: string[]; // For comparison slides
	leftTitle?: string; // For comparison slides
	rightTitle?: string; // For comparison slides
	imageSrc?: string; // For two-card layout (e.g., "assets/vpc.svg")
}

export interface ModuleContent {
	moduleNumber: number;
	title: string; // Module title
	subtitle: string; // Module subtitle
	slides: SlideContent[];
}

// ============================================================================
// MODULE 1: Pulumi and IaC Fundamentals
// ============================================================================
export const module1Content: ModuleContent = {
	moduleNumber: 1,
	title: "AWS Infrastructure as Code with Pulumi",
	subtitle: "Module 1: Pulumi and IaC Fundamentals",
	slides: [
		{
			name: "title",
			type: "title",
			script: "If you deploy on A W S and you're still clicking around in the console, you're wasting time and introducing risk. Infrastructure as Code lets you treat infrastructure exactly like application code. It becomes repeatable, auditable, and automated instead of tribal knowledge. In this series we're going to use Pulumi to build real A W S infrastructure using TypeScript. By the end, you'll be able to provision VPCs, manage multiple environments, export outputs, and destroy infrastructure cleanly with a single command. This is the workflow modern DevOps and platform teams use in production.",
			subtitle: "Module 1: Pulumi and IaC Fundamentals",
		},
		{
			name: "whyIaC",
			type: "content-two-card",
			script: "So why Infrastructure as Code? Five reasons. One: repeatability. You can rebuild the same environment a hundred times with zero drift. Two: version control. Changes are reviewed, not silently edited in production. Three: automation. Provisioning and teardown become scripts instead of manual work. Four: reduced human error and faster recovery during incidents. And five: your infrastructure becomes documentation you can execute.",
			title: "Why Infrastructure as Code?",
			points: [
				"Repeatable and consistent deployments",
				"Version control for infrastructure changes",
				"Automated provisioning and teardown",
				"Reduced human error and faster recovery",
				"Documentation as executable code",
			],
			imageSrc: "assets/region.svg",
		},
		{
			name: "comparison",
			type: "comparison",
			script: "Traditional Infrastructure as Code tools like Terraform and CloudFormation use domain-specific languages like H C L and Y A M L. They work, but they're constrained. Limited programming constructs, separate testing workflows, and slower developer feedback loops. Pulumi takes a different approach. You write infrastructure using real programming languages like TypeScript and Python. You get IDE autocomplete, reusable functions, unit tests, and proper error handling. The developer ergonomics are simply better.",
			title: "Pulumi vs Terraform & CloudFormation",
			leftTitle: "Traditional IaC",
			leftItems: [
				"Domain-specific languages (HCL, YAML)",
				"Limited programming constructs",
				"Separate tooling for testing",
				"Steeper learning curve",
			],
			rightTitle: "Pulumi",
			rightItems: [
				"Real programming languages (TypeScript, Python)",
				"Full IDE support and autocomplete",
				"Native testing and validation",
				"Better developer ergonomics",
			],
		},
		{
			name: "workflow",
			type: "content-single",
			script: "The Pulumi workflow is simple. Initialize a project. Preview the changes. Apply them. And optionally destroy them. The commands map directly. pulumi init creates your project. pulumi preview shows planned changes. pulumi up deploys to A W S. pulumi destroy tears everything down. And pulumi config manages per-environment settings.",
			title: "Pulumi Workflow Commands",
			points: [
				"pulumi init - Initialize a new project",
				"pulumi preview - See planned changes",
				"pulumi up - Deploy infrastructure",
				"pulumi destroy - Remove all resources",
				"pulumi config - Manage configuration",
			],
		},
		{
			name: "initCode",
			type: "code",
			script: "Let's initialize a project. Run: pulumi new aws-typescript. Pulumi generates a full project structure. index dot ts contains the infrastructure code. pulumi dot yaml stores project metadata. pulumi dot dev dot yaml stores stack configuration. And package dot json manages dependencies. Each file has a specific purpose.",
			title: "Initialize Pulumi Project",
			code: `# Create a new Pulumi project
pulumi new aws-typescript

# This creates:
# - index.ts (main infrastructure code)
# - Pulumi.yaml (project metadata)
# - Pulumi.dev.yaml (stack configuration)
# - package.json (dependencies)`,
			language: "bash",
		},
		{
			name: "whyTypeScript",
			type: "content-two-card",
			script: "Why TypeScript for DevOps? Type safety catches errors before deployment. IntelliSense speeds up authoring. The ecosystem integrates cleanly with A W S SDKs. It's familiar to most engineers. And it's easy to test and refactor.",
			title: "Why TypeScript for DevOps?",
			points: [
				"Type safety catches errors before deployment",
				"Excellent IDE autocomplete and IntelliSense",
				"Rich ecosystem of AWS SDK and libraries",
				"Familiar to many developers",
				"Easy to test and refactor",
			],
			imageSrc: "assets/vpc.svg",
		},
		{
			name: "typescriptCode",
			type: "code",
			script: "Let's walk through a simple Pulumi example. We import the A W S library. We create a VPC using the new keyword. We set the CIDR block to ten dot zero dot zero dot zero slash sixteen. We enable DNS hostnames and DNS support. We add organizational tags like Name and Environment. And finally we export the VPC ID so it can be consumed by other stacks.",
			title: "TypeScript Infrastructure Code",
			code: `import * as aws from "@pulumi/aws";

// Create a VPC with type safety
const vpc = new aws.ec2.Vpc("main-vpc", {
    cidrBlock: "10.0.0.0/16",
    enableDnsHostnames: true,
    enableDnsSupport: true,
    tags: {
        Name: "main-vpc",
        Environment: "production",
    },
});

// Export the VPC ID
export const vpcId = vpc.id;`,
			language: "typescript",
		},
		{
			name: "summary",
			type: "content-two-card",
			script: "To summarize module one. Infrastructure as Code gives you repeatable and version-controlled infrastructure. Pulumi offers a better developer experience than traditional tools. TypeScript brings type safety to infrastructure code. And the workflow is init, preview, up, destroy, and config. In the next module, we'll configure A W S credentials for deployment.",
			title: "Module 1 Summary",
			points: [
				"IaC provides repeatable, version-controlled infrastructure",
				"Pulumi offers better developer experience than traditional tools",
				"TypeScript brings type safety to infrastructure code",
				"Pulumi workflow: init, preview, up, destroy, config",
				"Next: Project setup and AWS credentials",
			],
			imageSrc: "assets/region.svg",
		},
	],
};

// ============================================================================
// MODULE 2: Project Setup and AWS Credentials
// ============================================================================
export const module2Content: ModuleContent = {
	moduleNumber: 2,
	title: "Project Setup and AWS Credentials",
	subtitle: "Module 2: Getting Started with Pulumi",
	slides: [
		{
			name: "title",
			type: "title",
			script: "In this module, we'll set up your development environment and configure A W S credentials. You'll install the Pulumi CLI, configure your A W S access, create a new project, and verify everything works with an initial deployment.",
			subtitle: "Module 2: Getting Started with Pulumi",
		},
		{
			name: "installPulumi",
			type: "code",
			script: "First, let's install the Pulumi CLI. On macOS and Linux, you can use the install script. On Windows, download and run the PowerShell installer. After installation, verify it works by running pulumi version.",
			title: "Install Pulumi CLI",
			code: `# macOS / Linux
curl -fsSL https://get.pulumi.com | sh

# Windows (PowerShell)
(New-Object Net.WebClient).DownloadFile(
  "https://get.pulumi.com/install.ps1",
  "$env:USERPROFILE\\install-pulumi.ps1"
)
& "$env:USERPROFILE\\install-pulumi.ps1"

# Verify installation
pulumi version`,
			language: "bash",
		},
		{
			name: "configureAWS",
			type: "code",
			script: "Next, configure your A W S credentials. You can use aws configure for interactive setup, or set environment variables. Verify your configuration with aws sts get-caller-identity to confirm you have the right permissions.",
			title: "Configure AWS CLI Credentials",
			code: `# Configure AWS CLI with credentials
aws configure

# Or set environment variables
export AWS_ACCESS_KEY_ID=your-access-key
export AWS_SECRET_ACCESS_KEY=your-secret-key
export AWS_DEFAULT_REGION=us-east-1

# Verify configuration
aws sts get-caller-identity`,
			language: "bash",
		},
		{
			name: "newProject",
			type: "code",
			script: "Now create a new Pulumi project using the aws-typescript template. This generates a complete project structure with index dot ts for your infrastructure code, Pulumi dot yaml for project metadata, and package dot json for dependencies.",
			title: "Create New Pulumi Project",
			code: `# Create a new Pulumi project
pulumi new aws-typescript

# This creates:
# - index.ts (main infrastructure code)
# - Pulumi.yaml (project metadata)
# - Pulumi.dev.yaml (stack configuration)
# - package.json (dependencies)`,
			language: "bash",
		},
		{
			name: "initialUp",
			type: "code",
			script: "Finally, run pulumi preview to see what will be created, then pulumi up to deploy. This confirms your A W S credentials are working and Pulumi can communicate with A W S. Check the A W S console to verify resources were created.",
			title: "Initial pulumi up - Confirm Connectivity",
			code: `# Preview changes before applying
pulumi preview

# Apply the infrastructure
pulumi up

# Confirm in AWS console that resources were created
# This verifies your AWS credentials are working correctly`,
			language: "bash",
		},
		{
			name: "summary",
			type: "content-two-card",
			script: "To summarize module two. You've installed the Pulumi CLI, configured A W S credentials, created a new project, and verified connectivity with an initial deployment. In the next module, we'll provision a basic VPC stack with subnets and route tables.",
			title: "Module 2 Summary",
			points: [
				"Pulumi CLI installed and verified",
				"AWS credentials configured and tested",
				"New Pulumi project created with aws-typescript template",
				"Initial pulumi up confirms connectivity",
				"Next: Provisioning a Basic VPC Stack",
			],
			imageSrc: "assets/vpc.svg",
		},
	],
};

// ============================================================================
// MODULE 3: Basic VPC Stack (Test Module)
// ============================================================================
export const module3Content: ModuleContent = {
	moduleNumber: 3,
	title: "Provisioning a Basic VPC Stack",
	subtitle: "Module 3: Building Your First Infrastructure",
	slides: [
		{
			name: "title",
			type: "title",
			script: "In this module, you'll build your first real infrastructure: a production-ready VPC with public subnets, internet connectivity, and proper routing. We'll start with networking fundamentals, then implement each component step by step. By the end, you'll understand not just what each resource does, but why it's needed and how they work together.",
			subtitle: "Module 3: Building Your First Infrastructure",
		},
		{
			name: "vpcBasics",
			type: "content-two-card",
			script: "Before we write code, let's understand the building blocks. A VPC, or Virtual Private Cloud, is your isolated network in AWS. Think of it as your own private data center in the cloud, completely separate from other customers. Subnets divide your VPC into smaller networks, and you typically place one subnet per availability zone for high availability. Route tables act as traffic directors, telling packets where to go: whether to stay within the VPC, reach another subnet, or exit to the internet. Understanding these relationships is crucial for building reliable infrastructure.",
			title: "VPC Networking Fundamentals",
			points: [
				"VPC: Your isolated network boundary in AWS",
				"Subnets: Logical divisions within a VPC, usually one per AZ",
				"Route Tables: Control how traffic flows between networks",
				"Internet Gateway: Provides internet access for public subnets",
			],
			imageSrc: "assets/vpc.svg",
		},
		{
			name: "createVPC",
			type: "code-diagram",
			script: "Let's create our VPC. We're using the CIDR block ten dot zero dot zero dot zero slash sixteen, which gives us over sixty-five thousand IP addresses. The slash sixteen means the first sixteen bits are fixed, leaving sixteen bits for host addresses. We enable DNS hostnames and DNS support so instances can resolve each other by name instead of just IP addresses. This makes your infrastructure much easier to manage. Notice we're using tags to identify this resource clearly in the AWS console.",
			title: "Create VPC with DNS Support",
			code: `import * as aws from "@pulumi/aws";

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
});`,
			language: "typescript",
			scene: {
				id: "vpc-basic-scene",
				title: "VPC Architecture",
				layout: "vpc-public-private",
				nodes: [
					{ id: "vpc-1", label: "Main VPC", type: "vpc" },
				],
				groups: [
					{
						id: "vpc-1",
						label: "Main VPC (10.0.0.0/16)",
						type: "vpc",
						children: [],
					},
				],
				edges: [],
			},
		},
		{
			name: "createSubnets",
			type: "code-diagram",
			script: "Now we create public subnets. The word public means these subnets can reach the internet directly. We're creating two subnets in different availability zones: us-east-1a and us-east-1b. This provides redundancy - if one zone fails, your infrastructure keeps running. Each subnet gets a slash twenty-four CIDR block, which is two-fifty-six IP addresses. Notice the mapPublicIpOnLaunch flag is set to true - this automatically assigns public IP addresses to instances launched here, which is required for internet access. The subnet CIDRs, ten dot zero dot one dot zero and ten dot zero dot two dot zero, are non-overlapping subsets of our VPC's ten dot zero dot zero dot zero range.",
			title: "Create Public Subnets Across Availability Zones",
			code: `// Create public subnets in different AZs for high availability
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
});`,
			language: "typescript",
			scene: {
				id: "vpc-subnets-scene",
				title: "VPC with Public Subnets",
				layout: "vpc-public-private",
				nodes: [
					{ id: "vpc-1", label: "Main VPC", type: "vpc" },
					{ id: "subnet-1", label: "Public Subnet 1", type: "subnet_public" },
					{ id: "subnet-2", label: "Public Subnet 2", type: "subnet_public" },
				],
				groups: [
					{
						id: "vpc-1",
						label: "Main VPC (10.0.0.0/16)",
						type: "vpc",
						children: ["subnet-1", "subnet-2"],
					},
				],
				edges: [],
			},
		},
		{
			name: "createRouteTable",
			type: "code-diagram",
			script: "To enable internet access, we need two things: an internet gateway and a route table. The internet gateway is AWS's managed service that connects your VPC to the internet. It's like the front door of your network. The route table contains routing rules. Here, we're adding a default route - zero dot zero dot zero dot zero slash zero - which means all traffic that doesn't match more specific routes goes to the internet gateway. This is how public subnets get internet connectivity. Without this route, instances in your subnets would be isolated, unable to reach the internet even with public IPs.",
			title: "Create Internet Gateway and Route Table",
			code: `// Internet Gateway provides internet connectivity for the VPC
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
});`,
			language: "typescript",
			scene: {
				id: "vpc-igw-scene",
				title: "VPC with Internet Gateway",
				layout: "vpc-public-private",
				nodes: [
					{ id: "vpc-1", label: "Main VPC", type: "vpc" },
					{ id: "subnet-1", label: "Public Subnet 1", type: "subnet_public" },
					{ id: "subnet-2", label: "Public Subnet 2", type: "subnet_public" },
					{ id: "igw-1", label: "Internet Gateway", type: "internet_gateway" },
				],
				groups: [
					{
						id: "vpc-1",
						label: "Main VPC (10.0.0.0/16)",
						type: "vpc",
						children: ["subnet-1", "subnet-2"],
					},
				],
				edges: [
					{ id: "edge-igw-vpc", from: "igw-1", to: "vpc-1", kind: "traffic", label: "Internet Access" },
				],
			},
		},
		{
			name: "summary",
			type: "content-two-card",
			script: "Let's recap what we built. We created a VPC with a ten dot zero dot zero dot zero slash sixteen CIDR block, giving us a large address space. We deployed two public subnets across different availability zones for redundancy, each with two-fifty-six IP addresses. We configured an internet gateway to provide internet connectivity, and a route table with a default route that directs all internet traffic through the gateway. This is a production-ready foundation. In the next module, we'll add private subnets and a NAT gateway, which allows private resources to access the internet securely without exposing them directly.",
			title: "Module 3 Summary",
			points: [
				"VPC with 10.0.0.0/16 CIDR provides 65,536 IP addresses",
				"Two public subnets across AZs ensure high availability",
				"Internet Gateway enables direct internet connectivity",
				"Route table with default route (0.0.0.0/0) directs traffic to IGW",
				"Next: Private subnets and NAT Gateway for secure outbound access",
			],
			imageSrc: "assets/region.svg",
		},
	],
};

// ============================================================================
// MODULE 4: Private Subnets and NAT Gateway
// ============================================================================
export const module4Content: ModuleContent = {
	moduleNumber: 4,
	title: "Private Subnets and NAT Gateway",
	subtitle: "Module 4: Securing Your Infrastructure",
	slides: [
		{
			name: "title",
			type: "title",
			script: "In this module, we'll add private subnets to your VPC and configure a NAT Gateway for secure outbound internet access. Private subnets are essential for databases, application servers, and other resources that shouldn't be directly exposed to the internet. You'll learn the critical difference between public and private subnets, how NAT Gateway enables secure outbound connectivity, and why this architecture is the foundation of production-grade AWS infrastructure.",
			subtitle: "Module 4: Securing Your Infrastructure",
			title: "Module 4: Securing Your Infrastructure"
		},
		{
			name: "publicVsPrivate",
			type: "comparison",
			script: "Understanding the difference between public and private subnets is crucial. Public subnets have a direct route to the internet through an internet gateway. Instances here get public IP addresses and can be accessed from the internet. This is perfect for load balancers and bastion hosts. Private subnets have no direct internet route. Instances here only have private IP addresses and cannot be reached from the internet. This is where you place databases, application servers, and sensitive workloads. However, private subnets can still access the internet outbound through a NAT Gateway, which allows them to download updates, call APIs, or reach external services without exposing them to incoming traffic.",
			title: "Public vs Private Subnets",
			leftTitle: "Public Subnets",
			leftItems: [
				"Direct route to internet via IGW",
				"Instances get public IP addresses",
				"Accessible from the internet",
				"Use for: Load balancers, bastion hosts"
			],
			rightTitle: "Private Subnets",
			rightItems: [
				"No direct internet route",
				"Only private IP addresses",
				"Cannot be reached from internet",
				"Use for: Databases, app servers, sensitive workloads"
			]
		},
		{
			name: "createPrivateSubnets",
			type: "code",
			script: "Let's create private subnets. Notice these are very similar to public subnets, but with key differences. We're using CIDR blocks ten dot zero dot three dot zero and ten dot zero dot four dot zero, continuing our subnet allocation. Most importantly, map Public Ip On Launch is set to false - these instances won't get public IPs. We're placing them in the same availability zones as our public subnets to ensure each zone has both public and private subnets. This allows you to deploy resources across zones while maintaining network isolation. The private subnets will house your application servers and databases, protected from direct internet access.",
			title: "Create Private Subnets",
			code: `// Create private subnets in the same AZs as public subnets
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
});`
		},
		{
			name: "createElasticIP",
			type: "code",
			script: "Before creating the NAT Gateway, we need an Elastic IP address. An Elastic IP is a static, public IP address that you allocate to your AWS account. Unlike regular public IPs that change when instances restart, Elastic IPs persist. The NAT Gateway needs this static IP because it acts as the outbound gateway for all private subnet traffic. When instances in private subnets need to reach the internet, their traffic goes through the NAT Gateway, which uses this Elastic IP as its source address. This allows return traffic to find its way back. We'll allocate the Elastic IP first, then attach it to the NAT Gateway.",
			title: "Allocate Elastic IP for NAT Gateway",
			code: `// Elastic IP provides a static public IP address
// Required for NAT Gateway to maintain consistent outbound IP
const natEip = new aws.ec2.Eip("nat-eip", {
    domain: "vpc",
    tags: {
        Name: "nat-gateway-eip",
    },
});`
		},
		{
			name: "createNATGateway",
			type: "code",
			script: "Now we create the NAT Gateway. This is a managed AWS service that enables instances in private subnets to access the internet. The NAT Gateway must be placed in a public subnet because it needs internet connectivity itself. We're placing it in public subnet one. The NAT Gateway uses the Elastic IP we just created. When an instance in a private subnet makes an outbound request, the NAT Gateway translates the private IP to its public Elastic IP, sends the request, and then translates the response back. This is Network Address Translation, or NAT. The key benefit: private subnet instances can initiate outbound connections, but nothing from the internet can initiate connections to them. This is a fundamental security pattern.",
			title: "Create NAT Gateway in Public Subnet",
			code: `// NAT Gateway must be in a public subnet
// It provides outbound internet access for private subnets
const natGateway = new aws.ec2.NatGateway("main-nat", {
    allocationId: natEip.id,
    subnetId: publicSubnet1.id, // Must be in public subnet
    tags: {
        Name: "main-nat-gateway",
    },
    // Note: NAT Gateway creation takes a few minutes
});`
		},
		{
			name: "createPrivateRouteTable",
			type: "code",
			script: "Finally, we create a route table for the private subnets. This route table has a default route pointing to the NAT Gateway instead of the internet gateway. This means all internet-bound traffic from private subnets goes through the NAT Gateway, which provides the secure outbound access we discussed. Notice there's no route that allows inbound traffic from the internet - that's the security benefit. We'll associate this route table with both private subnets, completing our secure network architecture. Now you have a production-ready VPC with public subnets for internet-facing resources and private subnets for protected workloads, all with proper routing configured.",
			title: "Create Route Table for Private Subnets",
			code: `// Route table for private subnets
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
);`
		},
		{
			name: "summary",
			type: "content-two-card",
			script: "Let's recap what we built. We created private subnets with no public IP assignment, providing network isolation for sensitive workloads. We allocated an Elastic IP to give the NAT Gateway a static public address. We deployed a NAT Gateway in a public subnet, enabling secure outbound internet access for private resources. And we configured a private route table that routes all internet traffic through the NAT Gateway, ensuring no inbound connections are possible. This architecture follows AWS best practices: public subnets for internet-facing resources, private subnets for protected workloads, and NAT Gateway for secure outbound access. In the next module, we'll add security groups and network ACLs to add another layer of protection.",
			title: "Module 4 Summary",
			points: [
				"Private subnets isolate sensitive workloads from internet",
				"Elastic IP provides static public IP for NAT Gateway",
				"NAT Gateway enables secure outbound internet access",
				"Private route table routes traffic through NAT (not IGW)",
				"Next: Security Groups and Network ACLs"
			]
		}
	]
};

// ============================================================================
// MODULE 5: Security Groups and Network ACLs
// ============================================================================
export const module5Content: ModuleContent = {
	moduleNumber: 5,
	title: "Security Groups and Network ACLs",
	subtitle: "Module 5: Network Security Layers",
	slides: [
		{
			name: "title",
			type: "title",
			script: "In this module, we'll add two critical layers of network security to your infrastructure: Security Groups and Network ACLs. These are your first line of defense, controlling traffic at both the instance level and subnet level. You'll learn the difference between stateful and stateless firewalls, how to create least-privilege security rules, and why defense in depth is essential for production infrastructure. By the end, you'll understand how to properly secure your VPC resources.",
			subtitle: "Module 5: Network Security Layers",
		},
		{
			name: "securityGroupsBasics",
			type: "content-two-card",
			script: "Security Groups are stateful firewalls that act at the instance level. Think of them as virtual firewalls for your EC2 instances. They're stateful, meaning if you allow traffic out, the response is automatically allowed back in. Security Groups are evaluated first before Network ACLs, and they support both allow rules only - you can't explicitly deny traffic. Each instance can have multiple security groups, and rules are evaluated together. This is your primary security mechanism for controlling access to your instances.",
			title: "Security Groups: Instance-Level Firewall",
			points: [
				"Stateful firewall at the instance level",
				"Only allow rules (no explicit deny)",
				"Automatic return traffic allowed",
				"Multiple security groups per instance",
				"Evaluated before Network ACLs",
			],
			imageSrc: "assets/vpc.svg",
		},
		{
			name: "networkACLsBasics",
			type: "content-two-card",
			script: "Network ACLs are stateless firewalls that operate at the subnet level. Unlike Security Groups, they can both allow and deny traffic explicitly. They're stateless, meaning you must create separate rules for inbound and outbound traffic, including return traffic. Network ACLs are evaluated after Security Groups, providing a second layer of defense. They're useful for creating subnet-level rules and blocking specific IP ranges. However, for most use cases, Security Groups are sufficient and easier to manage.",
			title: "Network ACLs: Subnet-Level Firewall",
			points: [
				"Stateless firewall at the subnet level",
				"Can allow and deny traffic explicitly",
				"Separate rules for inbound and outbound",
				"Evaluated after Security Groups",
				"Useful for subnet-level blocking",
			],
			imageSrc: "assets/vpc.svg",
		},
		{
			name: "createSecurityGroups",
			type: "code",
			script: "Let's create security groups following the principle of least privilege. We'll create three security groups: one for web servers that allows HTTP and HTTPS from anywhere, one for application servers that only accepts traffic from the web security group, and one for databases that only accepts traffic from the application security group. Notice how we reference other security groups using sourceSecurityGroupId - this creates a dependency chain. The web security group allows ports eighty and four-forty-three from any IP using CIDR block zero dot zero dot zero dot zero slash zero. The application security group only allows traffic from the web security group on port eight-thousand. And the database security group only allows MySQL traffic on port three-thousand-three-hundred-thirty-six from the application security group. This creates a secure, layered architecture.",
			title: "Create Security Groups with Least Privilege",
			code: `// Web server security group - allows HTTP/HTTPS from internet
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
});`,
			language: "typescript",
		},
		{
			name: "createNetworkACL",
			type: "code",
			script: "Now let's create a Network ACL for additional subnet-level protection. Network ACLs have numbered rules that are evaluated in order. Lower numbers are evaluated first. We'll create a default deny-all Network ACL, then add explicit allow rules. The inbound rules allow HTTP, HTTPS, and ephemeral ports for return traffic. Ephemeral ports, typically ten-thousand-two-four through sixty-five-thousand-five-thirty-five, are used for return traffic from outbound connections. The outbound rules allow all traffic since we're using a default route. Network ACLs are optional for most use cases, but they provide an extra layer of security and can be useful for compliance requirements.",
			title: "Create Network ACL for Subnet Protection",
			code: `// Network ACL provides subnet-level firewall
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
});`,
			language: "typescript",
		},
		{
			name: "summary",
			type: "content-two-card",
			script: "Let's recap what we've learned. Security Groups are stateful, instance-level firewalls that are your primary security mechanism. They only support allow rules and automatically handle return traffic. Network ACLs are stateless, subnet-level firewalls that can explicitly deny traffic and provide a second layer of defense. We created a three-tier security group architecture: web servers accessible from the internet, application servers only accessible from web servers, and databases only accessible from application servers. This follows the principle of least privilege. Network ACLs add subnet-level protection, though Security Groups are usually sufficient for most use cases. In the next module, we'll launch EC2 instances using these security groups.",
			title: "Module 5 Summary",
			points: [
				"Security Groups: Stateful, instance-level firewall (primary defense)",
				"Network ACLs: Stateless, subnet-level firewall (secondary defense)",
				"Three-tier architecture: Web → App → Database security groups",
				"Least privilege: Only allow necessary traffic",
				"Next: Launch EC2 instances with security groups",
			],
			imageSrc: "assets/vpc.svg",
		},
	],
};

// ============================================================================
// MODULE 6: EC2 Instances and Launch Templates
// ============================================================================
export const module6Content: ModuleContent = {
	moduleNumber: 6,
	title: "EC2 Instances and Launch Templates",
	subtitle: "Module 6: Launching Compute Resources",
	slides: [
		{
			name: "title",
			type: "title",
			script: "In this module, we'll launch EC2 instances in your VPC using Launch Templates. Launch Templates are the modern way to define instance configurations, replacing Launch Configurations. You'll learn how to launch instances in both public and private subnets, attach security groups, configure user data scripts, and use IAM instance profiles for secure access to AWS services. By the end, you'll be able to deploy compute resources that follow AWS best practices.",
			subtitle: "Module 6: Launching Compute Resources",
		},
		{
			name: "launchTemplateBasics",
			type: "content-two-card",
			script: "Launch Templates are versioned, reusable configurations for EC2 instances. Unlike Launch Configurations, they support both EC2 and Auto Scaling, and you can create multiple versions. Launch Templates define everything about your instance: the AMI, instance type, security groups, IAM roles, user data, and more. They're immutable - when you update a template, you create a new version. This makes them perfect for infrastructure as code, as you can version control your instance configurations and roll back if needed.",
			title: "Launch Templates: Versioned Instance Configurations",
			points: [
				"Versioned, reusable instance configurations",
				"Support both EC2 and Auto Scaling",
				"Immutable - updates create new versions",
				"Define AMI, instance type, security groups, IAM roles",
				"Perfect for infrastructure as code",
			],
			imageSrc: "assets/vpc.svg",
		},
		{
			name: "createIAMRole",
			type: "code",
			script: "Before creating instances, we need an IAM role for our EC2 instances. This role allows instances to access AWS services securely without storing credentials. We'll create a role that allows reading from Systems Manager Parameter Store, which is useful for storing configuration. The role includes a trust policy that allows EC2 service to assume it, and a permissions policy that grants the necessary access. We'll also create an instance profile, which is the container for the IAM role that EC2 instances use.",
			title: "Create IAM Role for EC2 Instances",
			code: `// IAM role allows EC2 instances to access AWS services securely
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
});`,
			language: "typescript",
		},
		{
			name: "createLaunchTemplate",
			type: "code",
			script: "Now we'll create a Launch Template for our web servers. We're using the latest Amazon Linux 2023 AMI, which is optimized for AWS. The template specifies a t3.micro instance type, which is eligible for the free tier. We attach the web security group we created earlier, and the IAM instance profile for secure AWS access. The user data script installs and starts a simple web server. Notice how we're using the latest AMI lookup - this ensures we always get the most recent, patched version. The template also includes metadata options to enable IMDSv2, which is a security best practice.",
			title: "Create Launch Template for Web Servers",
			code: `// Get the latest Amazon Linux 2023 AMI
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
    userData: Buffer.from("#!/bin/bash\\n        yum update -y\\n        yum install -y httpd\\n        systemctl start httpd\\n        systemctl enable httpd\\n        echo \\"<h1>Hello from Pulumi!</h1>\\" > /var/www/html/index.html\\n    ").toString("base64"),
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
});`,
			language: "typescript",
		},
		{
			name: "launchInstances",
			type: "code",
			script: "Finally, we'll launch EC2 instances using our Launch Template. We're launching one instance in each public subnet for high availability. The instances will automatically get public IP addresses because we set mapPublicIpOnLaunch to true on the public subnets. Each instance uses the Launch Template we created, which includes the AMI, instance type, security groups, and user data. Once launched, these instances will be accessible via HTTP on port eighty from the internet, thanks to our security group configuration. The instances can also access AWS services through the IAM role we attached.",
			title: "Launch EC2 Instances from Launch Template",
			code: `// Launch web server instances in public subnets
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
export const webServer2Ip = webServer2.publicIp;`,
			language: "typescript",
		},
		{
			name: "summary",
			type: "content-two-card",
			script: "Let's recap what we built. We created an IAM role and instance profile that allows EC2 instances to securely access AWS services without storing credentials. We created a Launch Template that defines our instance configuration: the AMI, instance type, security groups, IAM role, and user data script. Launch Templates are versioned and immutable, making them perfect for infrastructure as code. We launched EC2 instances in public subnets using the Launch Template, and they're now accessible via HTTP. The instances can access AWS services through the IAM role, and they follow security best practices with IMDSv2 enabled. In the next module, we'll add a Load Balancer to distribute traffic across these instances.",
			title: "Module 6 Summary",
			points: [
				"IAM roles provide secure AWS service access without credentials",
				"Launch Templates: Versioned, immutable instance configurations",
				"Instances launched in public subnets with security groups",
				"User data scripts automate instance configuration",
				"Next: Application Load Balancer for traffic distribution",
			],
			imageSrc: "assets/vpc.svg",
		},
	],
};

// ============================================================================
// MODULE 7: Application Load Balancer
// ============================================================================
export const module7Content: ModuleContent = {
	moduleNumber: 7,
	title: "Application Load Balancer",
	subtitle: "Module 7: Distributing Traffic",
	slides: [
		{
			name: "title",
			type: "title",
			script: "In this module, we'll add an Application Load Balancer to distribute traffic across your EC2 instances. Load balancers are essential for high availability, scalability, and fault tolerance. You'll learn how to create an ALB, configure target groups, set up health checks, and create listeners that route traffic based on rules. By the end, you'll have a production-ready load balancing setup that can handle traffic spikes and instance failures gracefully.",
			subtitle: "Module 7: Distributing Traffic",
		},
		{
			name: "albBasics",
			type: "content-two-card",
			script: "Application Load Balancers operate at Layer 7 of the OSI model, meaning they understand HTTP and HTTPS protocols. They can route traffic based on content, such as URL paths, host headers, or query strings. ALBs are highly available by default - AWS automatically distributes them across multiple availability zones. They integrate with AWS Certificate Manager for SSL termination, and they support WebSocket and HTTP/2 protocols. ALBs are the recommended choice for most web applications, providing advanced routing capabilities and integration with AWS services.",
			title: "Application Load Balancer: Layer 7 Routing",
			points: [
				"Operates at Layer 7 (HTTP/HTTPS)",
				"Content-based routing (path, host, headers)",
				"Highly available across multiple AZs",
				"SSL termination with ACM integration",
				"Supports WebSocket and HTTP/2",
			],
			imageSrc: "assets/vpc.svg",
		},
		{
			name: "createTargetGroup",
			type: "code",
			script: "First, we create a Target Group. This defines which instances will receive traffic from the load balancer. We're using instance targets, meaning we'll register EC2 instances directly. The target group is configured for HTTP traffic on port eighty, and it's associated with our VPC. We configure health checks that ping the root path every thirty seconds. If an instance fails two consecutive health checks, it's marked unhealthy and traffic stops routing to it. Once it passes health checks again, traffic resumes. This provides automatic failover.",
			title: "Create Target Group for EC2 Instances",
			code: `// Target Group defines which instances receive traffic
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
});`,
			language: "typescript",
		},
		{
			name: "createLoadBalancer",
			type: "code",
			script: "Now we create the Application Load Balancer itself. It must be placed in public subnets because it needs internet connectivity. We're using internet-facing scheme, which means it gets a public DNS name. The load balancer is associated with our web security group, which allows HTTP and HTTPS traffic. We enable deletion protection to prevent accidental deletion in production. The load balancer automatically distributes across the availability zones of the subnets we specify. AWS manages the load balancer infrastructure, so you don't need to worry about scaling or availability.",
			title: "Create Application Load Balancer",
			code: `// Application Load Balancer in public subnets
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
});`,
			language: "typescript",
		},
		{
			name: "registerTargets",
			type: "code",
			script: "We register our EC2 instances with the target group. This tells the load balancer which instances should receive traffic. We register both web servers we created earlier. The load balancer will now distribute incoming requests across these instances. If one instance becomes unhealthy, traffic automatically routes to the healthy instance. We can add or remove instances from the target group at any time, and the load balancer will automatically adjust. This provides both high availability and the ability to scale.",
			title: "Register EC2 Instances with Target Group",
			code: `// Register web server instances with target group
const webTarget1 = new aws.lb.TargetGroupAttachment("web-target-1", {
    targetGroupId: webTargetGroup.id,
    targetId: webServer1.id,
    port: 80,
});

const webTarget2 = new aws.lb.TargetGroupAttachment("web-target-2", {
    targetGroupId: webTargetGroup.id,
    targetId: webServer2.id,
    port: 80,
});`,
			language: "typescript",
		},
		{
			name: "createListener",
			type: "code",
			script: "Finally, we create a listener that defines how the load balancer handles incoming traffic. We're creating an HTTP listener on port eighty that forwards all traffic to our target group. In production, you'd typically create an HTTPS listener on port four-forty-three with an SSL certificate from AWS Certificate Manager. The listener uses a default action to forward traffic to the target group. You can also add rules to route different paths to different target groups, enabling advanced routing scenarios like microservices architectures.",
			title: "Create Load Balancer Listener",
			code: `// Listener defines how ALB handles incoming traffic
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
export const albDnsName = webAlb.dnsName;`,
			language: "typescript",
		},
		{
			name: "summary",
			type: "content-two-card",
			script: "Let's recap what we built. We created a Target Group that defines which EC2 instances receive traffic, with health checks that automatically detect and remove unhealthy instances. We created an Application Load Balancer in public subnets that distributes traffic across availability zones. We registered our EC2 instances with the target group, enabling automatic traffic distribution. And we created a listener that forwards HTTP traffic to the target group. The load balancer provides high availability, automatic failover, and the ability to scale by adding more instances. In the next module, we'll add a database in private subnets to complete our three-tier architecture.",
			title: "Module 7 Summary",
			points: [
				"Target Groups define which instances receive traffic",
				"Health checks automatically detect and remove unhealthy instances",
				"ALB distributes traffic across AZs for high availability",
				"Listeners route traffic based on rules",
				"Next: RDS Database in private subnets",
			],
			imageSrc: "assets/vpc.svg",
		},
	],
};

// ============================================================================
// MODULE 8: RDS Database in Private Subnets
// ============================================================================
export const module8Content: ModuleContent = {
	moduleNumber: 8,
	title: "RDS Database in Private Subnets",
	subtitle: "Module 8: Secure Database Deployment",
	slides: [
		{
			name: "title",
			type: "title",
			script: "In this module, we'll deploy an RDS MySQL database in private subnets, completing our three-tier architecture. RDS is AWS's managed relational database service, handling backups, patching, and high availability. You'll learn how to create a DB subnet group, configure a database instance with proper security, and understand why databases belong in private subnets. By the end, you'll have a production-ready database setup that follows AWS security best practices.",
			subtitle: "Module 8: Secure Database Deployment",
		},
		{
			name: "rdsBasics",
			type: "content-two-card",
			script: "Amazon RDS is a managed relational database service that supports multiple database engines: MySQL, PostgreSQL, MariaDB, Oracle, and SQL Server. RDS handles routine database tasks like backups, software patching, monitoring, and scaling. For high availability, you can enable Multi-AZ deployment, which creates a standby replica in a different availability zone. RDS databases should always be placed in private subnets to prevent direct internet access. Only your application servers should be able to connect to the database, which we'll enforce using security groups.",
			title: "Amazon RDS: Managed Database Service",
			points: [
				"Managed service for relational databases",
				"Supports MySQL, PostgreSQL, MariaDB, Oracle, SQL Server",
				"Automatic backups, patching, and monitoring",
				"Multi-AZ for high availability",
				"Always deploy in private subnets",
			],
			imageSrc: "assets/vpc.svg",
		},
		{
			name: "createDBSubnetGroup",
			type: "code",
			script: "First, we create a DB Subnet Group. This tells RDS which subnets it can use when creating the database. RDS requires subnets in at least two availability zones for high availability. We're using our private subnets, which ensures the database won't have public IP addresses. The subnet group spans multiple availability zones, allowing RDS to create Multi-AZ deployments if needed. This is a requirement before creating any RDS instance.",
			title: "Create DB Subnet Group",
			code: `// DB Subnet Group defines which subnets RDS can use
// Must span at least 2 AZs for high availability
const dbSubnetGroup = new aws.rds.SubnetGroup("db-subnet-group", {
    name: "main-db-subnet-group",
    subnetIds: [privateSubnet1.id, privateSubnet2.id],
    tags: {
        Name: "main-db-subnet-group",
    },
});`,
			language: "typescript",
		},
		{
			name: "createDBParameterGroup",
			type: "code",
			script: "We create a DB Parameter Group to customize database settings. Parameter groups are like configuration files for your database engine. We're setting some MySQL-specific parameters: enabling general query logging for debugging, setting the maximum connections, and configuring the character set. Parameter groups allow you to tune database performance and behavior without modifying the database directly. You can create custom parameter groups or use the default ones provided by AWS.",
			title: "Create DB Parameter Group",
			code: `// Parameter Group customizes database engine settings
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
});`,
			language: "typescript",
		},
		{
			name: "createDBInstance",
			type: "code",
			script: "Now we create the RDS database instance. We're using MySQL 8.0 with a db.t3.micro instance class, which is suitable for development and testing. The database is placed in the DB subnet group we created, ensuring it's in private subnets. We attach the database security group we created earlier, which only allows connections from application servers. We enable automated backups with a seven-day retention period, and we set the backup window to occur during low-traffic hours. The database is publicly accessible set to false, which is a security best practice. We also set deletion protection to prevent accidental deletion.",
			title: "Create RDS MySQL Database Instance",
			code: `// RDS MySQL database instance in private subnets
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
export const dbEndpoint = dbInstance.endpoint;`,
			language: "typescript",
		},
		{
			name: "summary",
			type: "content-two-card",
			script: "Let's recap what we built. We created a DB Subnet Group spanning private subnets in multiple availability zones, which is required for RDS high availability. We created a DB Parameter Group to customize MySQL settings. We deployed an RDS MySQL instance in private subnets with the database security group, ensuring only application servers can connect. The database has automated backups enabled and is not publicly accessible. This completes our three-tier architecture: web servers in public subnets behind a load balancer, application servers in private subnets, and a database in private subnets. In the next module, we'll learn how to export values and share resources between stacks.",
			title: "Module 8 Summary",
			points: [
				"DB Subnet Group spans private subnets in multiple AZs",
				"DB Parameter Group customizes database engine settings",
				"RDS instance in private subnets with database security group",
				"Automated backups and Multi-AZ support available",
				"Next: Outputs and Stack References",
			],
			imageSrc: "assets/vpc.svg",
		},
	],
};

// ============================================================================
// MODULE 9: Outputs and Stack References
// ============================================================================
export const module9Content: ModuleContent = {
	moduleNumber: 9,
	title: "Outputs and Stack References",
	subtitle: "Module 9: Sharing Resources Between Stacks",
	slides: [
		{
			name: "title",
			type: "title",
			script: "In this module, we'll learn how to export values from your Pulumi stacks and reference resources from other stacks. This is essential for building modular infrastructure where different stacks manage different components. You'll learn about stack outputs, stack references, and how to create dependencies between stacks. By the end, you'll be able to build a network stack, an application stack, and have them work together seamlessly.",
			subtitle: "Module 9: Sharing Resources Between Stacks",
		},
		{
			name: "outputsBasics",
			type: "content-two-card",
			script: "Stack outputs are values that you export from a Pulumi stack, making them available to other stacks or external systems. Outputs can be simple values like strings or numbers, or they can be complex objects. When you run pulumi stack output, you can see all exported values. Outputs are useful for sharing resource identifiers, endpoints, or configuration values between stacks. They're also displayed after a successful deployment, making it easy to see important information like database endpoints or load balancer DNS names.",
			title: "Stack Outputs: Exporting Values",
			points: [
				"Export values from a stack for reuse",
				"Accessible via pulumi stack output command",
				"Can be simple values or complex objects",
				"Displayed after successful deployment",
				"Enable sharing between stacks",
			],
			imageSrc: "assets/vpc.svg",
		},
		{
			name: "createNetworkStack",
			type: "code",
			script: "Let's create a network stack that exports VPC and subnet information. This stack will contain all our networking resources: VPC, subnets, internet gateway, NAT gateway, and route tables. We export the VPC ID, subnet IDs, and security group IDs so other stacks can reference them. This separation of concerns allows you to manage networking separately from application resources. The network stack becomes a foundation that other stacks build upon.",
			title: "Create Network Stack with Outputs",
			code: `// Network stack - exports VPC and subnet information
// This stack manages all networking resources

// ... (VPC, subnets, gateways, route tables created here) ...

// Export values for other stacks to use
export const vpcId = vpc.id;
export const publicSubnetIds = [publicSubnet1.id, publicSubnet2.id];
export const privateSubnetIds = [privateSubnet1.id, privateSubnet2.id];
export const webSecurityGroupId = webSg.id;
export const appSecurityGroupId = appSg.id;
export const dbSecurityGroupId = dbSg.id;
export const natGatewayId = natGateway.id;`,
			language: "typescript",
		},
		{
			name: "createAppStack",
			type: "code",
			script: "Now we create an application stack that references the network stack. We use Pulumi's StackReference to get outputs from the network stack. This creates an implicit dependency - the application stack depends on the network stack. We can then use these referenced values to create resources in the existing VPC. For example, we create EC2 instances using the subnet IDs from the network stack, and we attach security groups that were created in the network stack. This modular approach makes it easy to update networking without affecting applications, and vice versa.",
			title: "Create Application Stack with Stack References",
			code: `// Application stack - references network stack
import * as pulumi from "@pulumi/pulumi";

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
export const webServerId = webServer.id;`,
			language: "typescript",
		},
		{
			name: "stackDependencies",
			type: "content-two-card",
			script: "Stack references create dependencies between stacks. When you run pulumi up on the application stack, Pulumi knows it depends on the network stack and will ensure the network stack is up to date first. This dependency management is automatic and prevents issues where an application stack tries to reference resources that don't exist yet. You can also use stack references to share configuration values, not just resource identifiers. This pattern enables you to build complex, multi-stack architectures where each stack has a clear responsibility.",
			title: "Stack Dependencies and Best Practices",
			points: [
				"Stack references create automatic dependencies",
				"Pulumi ensures dependent stacks are up to date",
				"Each stack has a clear, single responsibility",
				"Enables modular, maintainable infrastructure",
				"Supports team collaboration and separation of concerns",
			],
			imageSrc: "assets/vpc.svg",
		},
		{
			name: "summary",
			type: "content-two-card",
			script: "Let's recap what we learned. Stack outputs allow you to export values from a stack, making them available to other stacks or external systems. Stack references let you import outputs from other stacks, creating dependencies and enabling modular architecture. We created a network stack that exports VPC and subnet information, and an application stack that references those values. This separation of concerns makes infrastructure more maintainable and allows different teams to work on different stacks. Stack dependencies are managed automatically by Pulumi. In the next module, we'll learn how to manage multiple environments using this modular approach.",
			title: "Module 9 Summary",
			points: [
				"Stack outputs export values for reuse",
				"Stack references import values from other stacks",
				"Automatic dependency management between stacks",
				"Modular architecture with clear responsibilities",
				"Next: Multi-Environment Management",
			],
			imageSrc: "assets/vpc.svg",
		},
	],
};

// ============================================================================
// MODULE 10: Multi-Environment Management
// ============================================================================
export const module10Content: ModuleContent = {
	moduleNumber: 10,
	title: "Multi-Environment Management",
	subtitle: "Module 10: Dev, Staging, and Production",
	slides: [
		{
			name: "title",
			type: "title",
			script: "In this module, we'll learn how to manage multiple environments - development, staging, and production - using Pulumi stacks. You'll learn how to use stack configuration to customize resources per environment, manage secrets securely, and implement environment-specific settings. By the end, you'll be able to deploy the same infrastructure code to multiple environments with different configurations, following infrastructure as code best practices.",
			subtitle: "Module 10: Dev, Staging, and Production",
		},
		{
			name: "stackConfigBasics",
			type: "content-two-card",
			script: "Pulumi stacks are isolated instances of your infrastructure. Each stack has its own state file and configuration. You can have multiple stacks for the same project: one for dev, one for staging, and one for production. Stack configuration allows you to set environment-specific values like instance sizes, database classes, or feature flags. Configuration is stored in Pulumi dot YAML files, one per stack. This allows you to use the same code across environments while customizing behavior per environment.",
			title: "Pulumi Stacks: Isolated Environments",
			points: [
				"Each stack is an isolated infrastructure instance",
				"Separate state files and configuration per stack",
				"Same code, different configurations per environment",
				"Configuration stored in Pulumi.{stack}.yaml",
				"Enables dev, staging, and production deployments",
			],
			imageSrc: "assets/vpc.svg",
		},
		{
			name: "createStackConfig",
			type: "code",
			script: "Let's set up stack configuration for different environments. We use Pulumi's config system to read environment-specific values. In the code, we read configuration values with defaults, allowing the same code to work across environments. We create separate Pulumi dot YAML files for each environment: Pulumi dot dev dot YAML for development, Pulumi dot staging dot YAML for staging, and Pulumi dot prod dot YAML for production. Each file contains environment-specific values like instance types, database sizes, and whether to enable expensive features like Multi-AZ.",
			title: "Create Stack Configuration Files",
			code: `// Read stack configuration
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
//   maxInstances: 10`,
			language: "typescript",
		},
		{
			name: "manageSecrets",
			type: "code",
			script: "For sensitive values like database passwords, we use Pulumi secrets. Secrets are encrypted at rest and in transit. You can set secrets using pulumi config set with the --secret flag, or by using the Pulumi service which automatically encrypts secrets. In the code, we read secrets using config.requireSecret, which ensures the value exists and is treated as sensitive. Pulumi will never print secret values in logs or outputs. This is the secure way to handle passwords, API keys, and other sensitive configuration.",
			title: "Manage Secrets Securely",
			code: `// Read secrets from configuration
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
//     secure: AAABAKdJZXl... (encrypted value)`,
			language: "typescript",
		},
		{
			name: "deployMultipleEnvironments",
			type: "code",
			script: "Now we can deploy to multiple environments using the same code. We create stacks for each environment using pulumi stack init, then set environment-specific configuration. When we run pulumi up, it uses the configuration for the current stack. This means we can deploy the exact same infrastructure code to dev, staging, and production, with only configuration differences. This is the power of infrastructure as code - write once, deploy everywhere. We can also use stack references to have staging reference dev resources, or production reference staging, creating a promotion pipeline.",
			title: "Deploy to Multiple Environments",
			code: `// Create stacks for each environment
// pulumi stack init dev
// pulumi stack init staging
// pulumi stack init prod

// Set configuration per environment
// pulumi stack select dev
// pulumi config set instanceType t3.micro
// pulumi config set --secret dbPassword dev-password
// pulumi up

// pulumi stack select staging
// pulumi config set instanceType t3.small
// pulumi config set --secret dbPassword staging-password
// pulumi up

// pulumi stack select prod
// pulumi config set instanceType t3.large
// pulumi config set --secret dbPassword prod-password
// pulumi config set enableMultiAz true
// pulumi up

// All use the same code, different configuration!`,
			language: "bash",
		},
		{
			name: "summary",
			type: "content-two-card",
			script: "Let's recap what we learned. Pulumi stacks provide isolated environments with separate state and configuration. Stack configuration allows you to customize resources per environment using the same code. Secrets are encrypted and handled securely using Pulumi's secret management. We can deploy to multiple environments - dev, staging, and production - using the same infrastructure code with different configurations. This follows the infrastructure as code principle of write once, deploy everywhere. In the next module, we'll explore advanced networking patterns like VPC peering and Transit Gateway.",
			title: "Module 10 Summary",
			points: [
				"Stacks provide isolated environments with separate configuration",
				"Same code, different configs per environment",
				"Secrets are encrypted and handled securely",
				"Write once, deploy everywhere pattern",
				"Next: Advanced Networking Patterns",
			],
			imageSrc: "assets/vpc.svg",
		},
	],
};

// ============================================================================
// MODULE 11: Advanced Networking
// ============================================================================
export const module11Content: ModuleContent = {
	moduleNumber: 11,
	title: "Advanced Networking Patterns",
	subtitle: "Module 11: VPC Peering and Transit Gateway",
	slides: [
		{
			name: "title",
			type: "title",
			script: "In this module, we'll explore advanced AWS networking patterns: VPC Peering and Transit Gateway. These technologies allow you to connect multiple VPCs together, enabling complex architectures like multi-region deployments, shared services, and hub-and-spoke topologies. You'll learn when to use each approach and how to implement them with Pulumi. By the end, you'll understand how to build enterprise-grade network architectures.",
			subtitle: "Module 11: VPC Peering and Transit Gateway",
		},
		{
			name: "vpcPeeringBasics",
			type: "content-two-card",
			script: "VPC Peering creates a direct network connection between two VPCs, allowing them to communicate as if they were on the same network. Peering is one-to-one - each peering connection connects exactly two VPCs. It's useful for connecting VPCs in the same region or different regions. Peering is non-transitive, meaning if VPC A peers with VPC B, and VPC B peers with VPC C, VPC A cannot reach VPC C through the peering. You must create separate peering connections for each pair. Peering is cost-effective for simple, point-to-point connections.",
			title: "VPC Peering: Direct VPC Connections",
			points: [
				"Direct connection between two VPCs",
				"One-to-one relationship (non-transitive)",
				"Works within same region or across regions",
				"Cost-effective for simple connections",
				"Requires route table configuration",
			],
			imageSrc: "assets/vpc.svg",
		},
		{
			name: "createVPCPeering",
			type: "code",
			script: "Let's create a VPC peering connection between two VPCs. We create the peering connection, then accept it. Both VPCs must accept the peering for it to become active. Then we add routes in both VPCs' route tables to route traffic to the peer VPC's CIDR block through the peering connection. We also need to update security groups to allow traffic from the peer VPC. Without the route table entries, the VPCs can't communicate even though the peering is established. This is a common mistake - the peering connection alone isn't enough.",
			title: "Create VPC Peering Connection",
			code: `// VPC Peering between two VPCs
const vpc1 = new aws.ec2.Vpc("vpc1", {
    cidrBlock: "10.0.0.0/16",
    // ... configuration ...
});

const vpc2 = new aws.ec2.Vpc("vpc2", {
    cidrBlock: "10.1.0.0/16",
    // ... configuration ...
});

// Create peering connection
const peering = new aws.ec2.VpcPeeringConnection("vpc-peering", {
    vpcId: vpc1.id,
    peerVpcId: vpc2.id,
    autoAccept: true, // Auto-accept if same account
    tags: {
        Name: "vpc1-to-vpc2",
    },
});

// Add routes in VPC1 to reach VPC2
const vpc1Route = new aws.ec2.Route("vpc1-to-vpc2", {
    routeTableId: vpc1RouteTable.id,
    destinationCidrBlock: "10.1.0.0/16", // VPC2's CIDR
    vpcPeeringConnectionId: peering.id,
});

// Add routes in VPC2 to reach VPC1
const vpc2Route = new aws.ec2.Route("vpc2-to-vpc1", {
    routeTableId: vpc2RouteTable.id,
    destinationCidrBlock: "10.0.0.0/16", // VPC1's CIDR
    vpcPeeringConnectionId: peering.id,
});`,
			language: "typescript",
		},
		{
			name: "transitGatewayBasics",
			type: "content-two-card",
			script: "Transit Gateway is AWS's managed service for connecting VPCs, VPNs, and on-premises networks. Unlike VPC Peering, Transit Gateway is transitive - you connect multiple VPCs to a central hub, and they can all communicate with each other. This creates a hub-and-spoke topology. Transit Gateway supports up to five-thousand attachments and can span multiple regions. It's ideal for complex architectures with many VPCs or when you need centralized routing and management. Transit Gateway uses route tables to control which attachments can communicate.",
			title: "Transit Gateway: Centralized Hub",
			points: [
				"Central hub for connecting multiple VPCs",
				"Transitive routing (hub-and-spoke topology)",
				"Supports VPCs, VPNs, and Direct Connect",
				"Scales to thousands of attachments",
				"Centralized routing and management",
			],
			imageSrc: "assets/vpc.svg",
		},
		{
			name: "createTransitGateway",
			type: "code",
			script: "Let's create a Transit Gateway and attach multiple VPCs to it. We create the Transit Gateway first, then create attachments for each VPC. Each attachment connects a VPC subnet to the Transit Gateway. We create route tables in the Transit Gateway to control which attachments can communicate. By default, attachments in the same route table can communicate with each other. We also add routes in each VPC's route tables to send traffic destined for other VPCs to the Transit Gateway. This creates a fully connected network where all VPCs can communicate through the central hub.",
			title: "Create Transit Gateway with VPC Attachments",
			code: `// Create Transit Gateway
const tgw = new aws.ec2.TransitGateway("main-tgw", {
    description: "Main Transit Gateway",
    amazonSideAsn: 64512,
    tags: {
        Name: "main-tgw",
    },
});

// Attach VPC1 to Transit Gateway
const vpc1Attachment = new aws.ec2.TransitGatewayVpcAttachment("vpc1-attachment", {
    subnetIds: [vpc1Subnet1.id, vpc1Subnet2.id],
    transitGatewayId: tgw.id,
    vpcId: vpc1.id,
    tags: {
        Name: "vpc1-attachment",
    },
});

// Attach VPC2 to Transit Gateway
const vpc2Attachment = new aws.ec2.TransitGatewayVpcAttachment("vpc2-attachment", {
    subnetIds: [vpc2Subnet1.id, vpc2Subnet2.id],
    transitGatewayId: tgw.id,
    vpcId: vpc2.id,
    tags: {
        Name: "vpc2-attachment",
    },
});

// Create Transit Gateway route table
const tgwRouteTable = new aws.ec2.TransitGatewayRouteTable("main-tgw-rt", {
    transitGatewayId: tgw.id,
    tags: {
        Name: "main-tgw-rt",
    },
});

// Associate attachments with route table
const vpc1Association = new aws.ec2.TransitGatewayRouteTableAssociation("vpc1-assoc", {
    transitGatewayAttachmentId: vpc1Attachment.id,
    transitGatewayRouteTableId: tgwRouteTable.id,
});

const vpc2Association = new aws.ec2.TransitGatewayRouteTableAssociation("vpc2-assoc", {
    transitGatewayAttachmentId: vpc2Attachment.id,
    transitGatewayRouteTableId: tgwRouteTable.id,
});

// Add routes in VPC route tables to reach other VPCs via TGW
const vpc1ToVpc2Route = new aws.ec2.Route("vpc1-to-vpc2-via-tgw", {
    routeTableId: vpc1RouteTable.id,
    destinationCidrBlock: "10.1.0.0/16",
    transitGatewayId: tgw.id,
});`,
			language: "typescript",
		},
		{
			name: "summary",
			type: "content-two-card",
			script: "Let's recap what we learned. VPC Peering creates direct, one-to-one connections between VPCs. It's non-transitive and requires route table configuration in both VPCs. Peering is cost-effective for simple, point-to-point connections. Transit Gateway is a managed hub that connects multiple VPCs in a hub-and-spoke topology. It's transitive, scales to thousands of attachments, and provides centralized routing. Transit Gateway is ideal for complex architectures with many VPCs. Both technologies require proper route table configuration to enable communication. In the next module, we'll learn how to integrate this infrastructure with CI/CD pipelines.",
			title: "Module 11 Summary",
			points: [
				"VPC Peering: Direct, one-to-one VPC connections",
				"Transit Gateway: Centralized hub for multiple VPCs",
				"Both require route table configuration",
				"Choose peering for simple, TGW for complex architectures",
				"Next: CI/CD Integration and Best Practices",
			],
			imageSrc: "assets/vpc.svg",
		},
	],
};

// ============================================================================
// MODULE 12: CI/CD Integration and Best Practices
// ============================================================================
export const module12Content: ModuleContent = {
	moduleNumber: 12,
	title: "CI/CD Integration and Best Practices",
	subtitle: "Module 12: Production-Ready Workflows",
	slides: [
		{
			name: "title",
			type: "title",
			script: "In this final module, we'll integrate Pulumi with CI/CD pipelines and cover production best practices. You'll learn how to automate infrastructure deployments using GitHub Actions, implement proper testing strategies, manage secrets in CI/CD, and follow security best practices. By the end, you'll have a complete understanding of how to run Pulumi in production with proper automation, testing, and security controls.",
			subtitle: "Module 12: Production-Ready Workflows",
		},
		{
			name: "cicdBasics",
			type: "content-two-card",
			script: "CI/CD integration automates your infrastructure deployments, ensuring consistency and reducing human error. Continuous Integration runs tests and validates your infrastructure code on every change. Continuous Deployment automatically deploys to environments after validation. This enables infrastructure changes to go through the same review process as application code. CI/CD pipelines can run Pulumi preview to show changes before applying, run pulumi up to deploy, and run pulumi destroy for cleanup. This creates a reliable, repeatable deployment process.",
			title: "CI/CD for Infrastructure as Code",
			points: [
				"Automate infrastructure deployments",
				"Run tests and validation on every change",
				"Consistent, repeatable deployment process",
				"Infrastructure changes go through code review",
				"Reduces human error and deployment time",
			],
			imageSrc: "assets/vpc.svg",
		},
		{
			name: "githubActionsWorkflow",
			type: "code",
			script: "Let's create a GitHub Actions workflow for Pulumi. The workflow runs on pull requests and pushes to main. It sets up Node.js, installs Pulumi CLI, and configures AWS credentials using GitHub Secrets. On pull requests, it runs pulumi preview to show what would change. On pushes to main, it runs pulumi up to deploy. We use Pulumi's service backend to store state, which enables team collaboration. The workflow also runs on a schedule for drift detection, ensuring infrastructure matches the code. This creates a complete CI/CD pipeline for infrastructure.",
			title: "GitHub Actions Workflow for Pulumi",
			code: `# .github/workflows/pulumi.yml
name: Pulumi Infrastructure

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]
  schedule:
    - cron: '0 2 * * *' # Daily at 2 AM for drift detection

jobs:
  preview:
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Pulumi CLI
        uses: pulumi/actions@v3
      
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: \${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Install Dependencies
        run: npm ci
      
      - name: Pulumi Preview
        run: pulumi preview --stack dev
        env:
          PULUMI_ACCESS_TOKEN: \${{ secrets.PULUMI_ACCESS_TOKEN }}

  deploy:
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    needs: []
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Pulumi CLI
        uses: pulumi/actions@v3
      
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: \${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Install Dependencies
        run: npm ci
      
      - name: Pulumi Up
        run: pulumi up --stack dev --yes
        env:
          PULUMI_ACCESS_TOKEN: \${{ secrets.PULUMI_ACCESS_TOKEN }}`,
			language: "yaml",
		},
		{
			name: "testingStrategies",
			type: "content-two-card",
			script: "Testing infrastructure code is crucial for catching errors before deployment. Unit tests validate individual resources and functions. Integration tests deploy infrastructure in a test environment and verify it works. Policy as Code tests enforce security and compliance rules. You can use Pulumi's testing framework to write unit tests that mock AWS API calls. For integration tests, deploy to a test stack and run validation scripts. Policy as Code uses tools like Pulumi Policy or Open Policy Agent to enforce rules like requiring encryption or preventing public access. Together, these testing strategies ensure your infrastructure is correct, secure, and compliant.",
			title: "Infrastructure Testing Strategies",
			points: [
				"Unit tests: Validate resources and functions",
				"Integration tests: Deploy and verify in test environment",
				"Policy as Code: Enforce security and compliance",
				"Catch errors before production deployment",
				"Ensure infrastructure correctness and security",
			],
			imageSrc: "assets/vpc.svg",
		},
		{
			name: "securityBestPractices",
			type: "code",
			script: "Let's review security best practices for production Pulumi deployments. Always use Pulumi secrets for sensitive values - never hardcode passwords or API keys. Use IAM roles with least privilege - only grant the minimum permissions needed. Enable deletion protection on critical resources like databases and load balancers. Use separate stacks for different environments to isolate failures. Enable audit logging to track who made what changes. Use Pulumi's policy framework to enforce security rules automatically. Store state in a secure backend like Pulumi Cloud or encrypted S3. And always review preview output before applying changes in production.",
			title: "Security Best Practices",
			code: `// Security Best Practices Checklist:

// 1. Use Pulumi secrets for sensitive values
const dbPassword = config.requireSecret("dbPassword");

// 2. Enable deletion protection on critical resources
const db = new aws.rds.Instance("db", {
    deletionProtection: true, // Prevent accidental deletion
    // ...
});

// 3. Use least privilege IAM roles
const role = new aws.iam.Role("role", {
    // Only grant necessary permissions
});

// 4. Enable encryption
const s3Bucket = new aws.s3.Bucket("bucket", {
    serverSideEncryptionConfiguration: {
        rule: {
            applyServerSideEncryptionByDefault: {
                sseAlgorithm: "AES256",
            },
        },
    },
});

// 5. Use separate stacks per environment
// pulumi stack init dev
// pulumi stack init prod

// 6. Enable audit logging
// Configure in Pulumi Cloud or use AWS CloudTrail

// 7. Review preview before applying
// Always run: pulumi preview --stack prod`,
			language: "typescript",
		},
		{
			name: "productionChecklist",
			type: "content-two-card",
			script: "Here's a production readiness checklist. Use version control for all infrastructure code and require code reviews. Implement CI/CD pipelines for automated deployments. Use separate stacks for each environment with appropriate configurations. Enable monitoring and alerting for your infrastructure. Implement backup and disaster recovery procedures. Use Infrastructure as Code for all resources - no manual changes. Document your architecture and deployment procedures. Train your team on Pulumi and AWS best practices. Regularly review and update your infrastructure. And always test changes in non-production environments first.",
			title: "Production Readiness Checklist",
			points: [
				"Version control and code reviews for all infrastructure",
				"CI/CD pipelines for automated deployments",
				"Separate stacks per environment",
				"Monitoring, alerting, and disaster recovery",
				"Documentation and team training",
			],
			imageSrc: "assets/vpc.svg",
		},
		{
			name: "summary",
			type: "content-two-card",
			script: "Congratulations! You've completed the full course on AWS Infrastructure as Code with Pulumi. Let's recap what we covered. We started with Pulumi fundamentals and IaC concepts. We set up projects and configured AWS credentials. We built a complete VPC with public and private subnets, NAT Gateway, and proper routing. We added security groups and Network ACLs for defense in depth. We launched EC2 instances, created load balancers, and deployed databases. We learned about stack outputs, multi-environment management, advanced networking, and CI/CD integration. You now have the knowledge to build production-ready infrastructure using Pulumi and TypeScript. Keep practicing, keep learning, and remember: infrastructure as code is a journey, not a destination.",
			title: "Course Summary and Next Steps",
			points: [
				"Complete AWS infrastructure with Pulumi and TypeScript",
				"Production-ready patterns and best practices",
				"Multi-environment management and CI/CD integration",
				"Security, testing, and monitoring strategies",
				"Ready to build real-world infrastructure!",
			],
			imageSrc: "assets/region.svg",
		},
	],
};

// ============================================================================
// ADD YOUR MODULES HERE
// ============================================================================
// Just copy the module3Content structure above and fill in your content
// The system will automatically generate everything else!

// Export all modules
// ============================================================================
// MODULE 20: Are Solo Developers Replacing Small Companies?
// ============================================================================
export const module20Content: ModuleContent = {
	moduleNumber: 20,
	title: "Are Solo Developers Replacing Small Companies?",
	subtitle: "The One Person Company Era Just Started",
	slides: [
		{
			name: "slide-2",
			type: "content-two-card",
			script: "Start from history. Software used to require teams, budgets and infrastructure. Then show the collapse of those barriers. Cloud platforms removed servers. AI removed boilerplate coding. No code removed interfaces. Stripe removed payments. Open A I removed customer support. Everything that used to require a department now exists as an A P I.",
			title: "The Evolution",
			points: [
				"Cloud platforms removed servers",
				"AI removed boilerplate coding",
				"No-code removed interfaces",
				"Stripe removed payments",
				"OpenAI removed customer support",
				"Everything is now an API"
			]
		}
	]
};

// ============================================================================
// MODULE 19: The shocking part isn’t that one person can build a product. It is that one person can now run the entire business stack that used to require employees. This is why investors are calling them micro multinationals.
// ============================================================================
export const module19Content: ModuleContent = {
	moduleNumber: 19,
	title: "The shocking part isn’t that one person can build a product.",
	subtitle: "one person can build a product",
	slides: [
		{
			name: "title",
			type: "title",
			script: "Welcome to The shocking part isn’t that one person can build a product. It is that one person can now run the entire business stack that used to require employees. This is why investors are calling them micro multinationals.",
			subtitle: "one person can build a product",
			title: "one person can build a product"
		}
	]
};

export const allModules: ModuleContent[] = [module1Content,
	module2Content,
	module3Content,
	module4Content,
	module5Content,
	module6Content,
	module7Content,
	module8Content,
	module9Content,
	module10Content,
	module11Content,
	module12Content,
	module20Content,
	module19Content
];
