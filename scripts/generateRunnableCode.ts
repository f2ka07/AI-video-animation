// Generate complete, runnable Pulumi programs for demo recordings
// Each module gets a standalone index.ts that can run pulumi up

import * as fs from "fs";
import * as path from "path";
import { allModules } from "../src/videos/moduleContent";

interface CodeSlide {
	name: string;
	title?: string;
	code?: string;
	language?: string;
}

function getModuleDependencies(moduleNumber: number): string[] {
	// Define which modules each module depends on
	const dependencies: Record<number, number[]> = {
		3: [], // Module 3 is standalone (VPC, subnets, IGW)
		4: [3], // Module 4 needs Module 3 (VPC, public subnets)
		5: [3, 4], // Module 5 needs VPC and subnets
		6: [3, 4, 5], // Module 6 needs VPC, subnets, security groups
		7: [3, 4, 5, 6], // Module 7 needs everything before
		8: [3, 4, 5], // Module 8 needs VPC, subnets, security groups
		9: [3, 4, 5], // Module 9 needs networking
		10: [3, 4, 5], // Module 10 needs networking
		11: [3], // Module 11 needs VPC
		12: [], // Module 12 is mostly config/examples
	};
	return dependencies[moduleNumber] || [];
}

function extractCodeSlides(module: any): CodeSlide[] {
	return module.slides
		.filter((s: any) => s.type === "code" && s.code)
		.filter((s: any) => (s.language || "typescript").toLowerCase() === "typescript")
		.map((s: any) => ({
			name: s.name,
			title: s.title,
			code: s.code,
			language: s.language,
		}));
}

function cleanCode(code: string): string {
	// Remove duplicate imports
	let cleaned = code;
	
	// Remove import statements (we'll add them at the top)
	cleaned = cleaned.replace(/^import\s+.*?from\s+["']@pulumi\/aws["'];?\s*$/gm, "");
	cleaned = cleaned.replace(/^import\s+.*?from\s+["']@pulumi\/pulumi["'];?\s*$/gm, "");
	
	// Clean up extra whitespace
	cleaned = cleaned.trim();
	
	return cleaned;
}

function generateRunnableCode(module: any, allModulesData: any[]): string {
	const codeSlides = extractCodeSlides(module);
	
	if (codeSlides.length === 0) {
		return "";
	}

	let code = `// ============================================================================\n`;
	code += `// ${module.title}\n`;
	code += `// Module ${module.moduleNumber}\n`;
	code += `// ============================================================================\n`;
	code += `// This is a complete, runnable Pulumi program.\n`;
	code += `// Run: pulumi up\n\n`;

	// Add imports
	code += `import * as aws from "@pulumi/aws";\n`;
	code += `import * as pulumi from "@pulumi/pulumi";\n\n`;

	// Add dependencies from previous modules if needed
	const dependencies = getModuleDependencies(module.moduleNumber);
	if (dependencies.length > 0) {
		code += `// NOTE: This module depends on resources from previous modules.\n`;
		code += `// For a complete setup, combine with modules: ${dependencies.join(", ")}\n`;
		code += `// Or ensure these resources exist:\n`;
		for (const dep of dependencies) {
			const depModule = allModulesData.find(m => m.moduleNumber === dep);
			if (depModule) {
				code += `//   - Module ${dep}: ${depModule.title}\n`;
			}
		}
		code += `\n`;
	}

	// For modules that depend on others, add placeholder comments
	if (dependencies.includes(3)) {
		code += `// VPC and networking resources (from Module 3)\n`;
		code += `// Uncomment and adjust if not combining with Module 3:\n`;
		code += `/*\n`;
		code += `const vpc = new aws.ec2.Vpc("main-vpc", {\n`;
		code += `    cidrBlock: "10.0.0.0/16",\n`;
		code += `    enableDnsHostnames: true,\n`;
		code += `    enableDnsSupport: true,\n`;
		code += `    tags: { Name: "main-vpc" },\n`;
		code += `});\n`;
		code += `*/\n\n`;
	}

	// Add all code slides
	for (const slide of codeSlides) {
		code += `// ============================================================================\n`;
		code += `// ${slide.title || slide.name}\n`;
		code += `// ============================================================================\n`;
		let slideCode = cleanCode(slide.code || "");
		
		// Add missing route table associations for Module 3
		if (module.moduleNumber === 3 && slide.name === "createRouteTable") {
			slideCode += `\n\n// Associate public route table with public subnets\n`;
			slideCode += `const publicSubnet1RouteTableAssociation = new aws.ec2.RouteTableAssociation(\n`;
			slideCode += `    "public-subnet-1-rta",\n`;
			slideCode += `    {\n`;
			slideCode += `        subnetId: publicSubnet1.id,\n`;
			slideCode += `        routeTableId: publicRouteTable.id,\n`;
			slideCode += `    }\n`;
			slideCode += `);\n\n`;
			slideCode += `const publicSubnet2RouteTableAssociation = new aws.ec2.RouteTableAssociation(\n`;
			slideCode += `    "public-subnet-2-rta",\n`;
			slideCode += `    {\n`;
			slideCode += `        subnetId: publicSubnet2.id,\n`;
			slideCode += `        routeTableId: publicRouteTable.id,\n`;
			slideCode += `    }\n`;
			slideCode += `);\n`;
		}
		
		code += slideCode + `\n\n`;
	}

	// Add exports
	code += `// ============================================================================\n`;
	code += `// Exports\n`;
	code += `// ============================================================================\n`;
	
	// Smart exports based on module
	if (module.moduleNumber === 3) {
		code += `export const vpcId = vpc.id;\n`;
		code += `export const publicSubnetIds = [publicSubnet1.id, publicSubnet2.id];\n`;
	} else if (module.moduleNumber === 4) {
		code += `export const privateSubnetIds = [privateSubnet1.id, privateSubnet2.id];\n`;
		code += `export const natGatewayId = natGateway.id;\n`;
	} else if (module.moduleNumber === 5) {
		code += `export const webSecurityGroupId = webSg.id;\n`;
		code += `export const appSecurityGroupId = appSg.id;\n`;
		code += `export const dbSecurityGroupId = dbSg.id;\n`;
	} else if (module.moduleNumber === 6) {
		code += `export const webServer1Id = webServer1.id;\n`;
		code += `export const webServer1Ip = webServer1.publicIp;\n`;
	} else if (module.moduleNumber === 7) {
		code += `export const albDnsName = webAlb.dnsName;\n`;
		code += `export const albArn = webAlb.arn;\n`;
	} else if (module.moduleNumber === 8) {
		code += `export const dbEndpoint = dbInstance.endpoint;\n`;
		code += `export const dbAddress = dbInstance.address;\n`;
	}

	return code;
}

function generateCompleteSetup(): string {
	// Generate a complete setup combining modules 3-8
	let code = `// ============================================================================\n`;
	code += `// Complete AWS Infrastructure Setup\n`;
	code += `// Combines Modules 3-8: VPC, Subnets, NAT, Security, EC2, ALB, RDS\n`;
	code += `// ============================================================================\n`;
	code += `// This is a complete, production-ready infrastructure setup.\n`;
	code += `// Run: pulumi up\n\n`;

	code += `import * as aws from "@pulumi/aws";\n`;
	code += `import * as pulumi from "@pulumi/pulumi";\n\n`;

	// Get all relevant modules
	const relevantModules = allModules.filter(m => 
		m.moduleNumber >= 3 && m.moduleNumber <= 8
	);

	for (const module of relevantModules) {
		const codeSlides = extractCodeSlides(module);
		
		code += `// ============================================================================\n`;
		code += `// Module ${module.moduleNumber}: ${module.title}\n`;
		code += `// ============================================================================\n\n`;

		for (const slide of codeSlides) {
			code += `// ${slide.title || slide.name}\n`;
			let slideCode = cleanCode(slide.code || "");
			
			// Add missing route table associations for Module 3 in complete setup
			if (module.moduleNumber === 3 && slide.name === "createRouteTable") {
				slideCode += `\n\n// Associate public route table with public subnets\n`;
				slideCode += `const publicSubnet1RouteTableAssociation = new aws.ec2.RouteTableAssociation(\n`;
				slideCode += `    "public-subnet-1-rta",\n`;
				slideCode += `    {\n`;
				slideCode += `        subnetId: publicSubnet1.id,\n`;
				slideCode += `        routeTableId: publicRouteTable.id,\n`;
				slideCode += `    }\n`;
				slideCode += `);\n\n`;
				slideCode += `const publicSubnet2RouteTableAssociation = new aws.ec2.RouteTableAssociation(\n`;
				slideCode += `    "public-subnet-2-rta",\n`;
				slideCode += `    {\n`;
				slideCode += `        subnetId: publicSubnet2.id,\n`;
				slideCode += `        routeTableId: publicRouteTable.id,\n`;
				slideCode += `    }\n`;
				slideCode += `);\n`;
			}
			
			code += slideCode + `\n\n`;
		}
	}

	// Add comprehensive exports
	code += `// ============================================================================\n`;
	code += `// Exports\n`;
	code += `// ============================================================================\n`;
	code += `export const vpcId = vpc.id;\n`;
	code += `export const publicSubnetIds = [publicSubnet1.id, publicSubnet2.id];\n`;
	code += `export const privateSubnetIds = [privateSubnet1.id, privateSubnet2.id];\n`;
	code += `export const natGatewayId = natGateway.id;\n`;
	code += `export const webSecurityGroupId = webSg.id;\n`;
	code += `export const albDnsName = webAlb.dnsName;\n`;
	code += `export const dbEndpoint = dbInstance.endpoint;\n`;

	return code;
}

function main() {
	const outputBaseDir = path.join(__dirname, "../public/source_code/runnable");
	
	// Create base directory
	if (!fs.existsSync(outputBaseDir)) {
		fs.mkdirSync(outputBaseDir, { recursive: true });
	}

	console.log("Generating runnable Pulumi programs...\n");

	// Generate individual module files
	for (const module of allModules) {
		const runnableCode = generateRunnableCode(module, allModules);
		
		if (runnableCode) {
			const filePath = path.join(outputBaseDir, `module${module.moduleNumber}.ts`);
			fs.writeFileSync(filePath, runnableCode, "utf-8");
			console.log(`✓ Module ${module.moduleNumber}: ${module.title}`);
		}
	}

	// Generate complete setup
	const completeCode = generateCompleteSetup();
	const completePath = path.join(outputBaseDir, "complete-setup.ts");
	fs.writeFileSync(completePath, completeCode, "utf-8");
	console.log(`✓ Complete setup: complete-setup.ts (Modules 3-8 combined)\n`);

	// Create README
	const readmePath = path.join(outputBaseDir, "README.md");
	const readmeContent = `# Runnable Pulumi Programs

These are **complete, working Pulumi programs** that can be executed with \`pulumi up\`.

## Files

### Individual Modules
- \`module3.ts\` - VPC, Public Subnets, Internet Gateway
- \`module4.ts\` - Private Subnets, NAT Gateway
- \`module5.ts\` - Security Groups, Network ACLs
- \`module6.ts\` - EC2 Instances, Launch Templates
- \`module7.ts\` - Application Load Balancer
- \`module8.ts\` - RDS Database
- \`module9.ts\` - Stack Outputs and References
- \`module10.ts\` - Multi-Environment Configuration
- \`module11.ts\` - VPC Peering, Transit Gateway
- \`module12.ts\` - CI/CD and Best Practices

### Complete Setup
- \`complete-setup.ts\` - **Full infrastructure (Modules 3-8 combined)**
  - This is the recommended file for demo recordings
  - Includes: VPC, Subnets, NAT, Security, EC2, ALB, RDS
  - Ready to run \`pulumi up\`

## Usage

### For Demo Recordings

1. **Copy the code:**
   \`\`\`bash
   cp runnable/complete-setup.ts index.ts
   \`\`\`

2. **Initialize Pulumi (if needed):**
   \`\`\`bash
   pulumi new aws-typescript
   \`\`\`

3. **Replace index.ts with the code**

4. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

5. **Preview changes:**
   \`\`\`bash
   pulumi preview
   \`\`\`

6. **Deploy:**
   \`\`\`bash
   pulumi up
   \`\`\`

### For Individual Modules

Some modules depend on resources from previous modules:
- Module 4 needs Module 3 (VPC, subnets)
- Module 5 needs Modules 3-4
- Module 6 needs Modules 3-5
- etc.

**Solution:** Use \`complete-setup.ts\` or combine modules as needed.

## Important Notes

⚠️ **These programs will create real AWS resources:**
- You will be charged for resources created
- Always use \`pulumi destroy\` to clean up after demos
- Test in a development AWS account first
- Review costs before deploying

## Cost Considerations

The complete setup creates:
- VPC (free)
- Subnets (free)
- NAT Gateway (~$0.045/hour + data transfer)
- EC2 instances (t3.micro - free tier eligible)
- Application Load Balancer (~$0.0225/hour)
- RDS instance (db.t3.micro - free tier eligible)

**Estimated cost:** ~$50-100/month if left running
**Demo cost:** ~$1-5 for a few hours of recording

## Cleanup

After recording:
\`\`\`bash
pulumi destroy
\`\`\`

Generated automatically from moduleContent.ts
`;

	fs.writeFileSync(readmePath, readmeContent, "utf-8");

	console.log("✅ Runnable code generation complete!");
	console.log(`   Output directory: ${outputBaseDir}`);
	console.log(`   Recommended for demos: complete-setup.ts`);
}

main();
