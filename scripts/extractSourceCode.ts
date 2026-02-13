// Extract all Pulumi code from moduleContent.ts and save to public/source_code
// Organized by module and slide name

import * as fs from "fs";
import * as path from "path";
import { allModules } from "../src/videos/moduleContent";

function getFileExtension(language?: string): string {
	const extMap: Record<string, string> = {
		typescript: "ts",
		javascript: "js",
		bash: "sh",
		shell: "sh",
		yaml: "yaml",
		yml: "yaml",
		json: "json",
		python: "py",
		go: "go",
	};
	return extMap[language?.toLowerCase() || "typescript"] || "ts";
}

function sanitizeFileName(name: string): string {
	// Replace invalid filename characters
	return name.replace(/[<>:"/\\|?*]/g, "-");
}

function combineModuleCode(module: any): string {
	const codeSlides = module.slides.filter((s: any) => s.type === "code" && s.code);
	
	if (codeSlides.length === 0) {
		return "";
	}

	// Check if any slide uses TypeScript (most common)
	const hasTypeScript = codeSlides.some((s: any) => 
		(s.language || "typescript").toLowerCase() === "typescript"
	);

	// Combine all TypeScript code slides
	if (hasTypeScript) {
		let combined = `// Complete Pulumi code for ${module.title}\n`;
		combined += `// Module ${module.moduleNumber}\n`;
		combined += `// \n`;
		combined += `// NOTE: This file combines all TypeScript code from this module.\n`;
		combined += `// Some resources may depend on resources from previous modules.\n`;
		combined += `// Review and adjust variable references as needed.\n\n`;
		
		// Add imports only once
		combined += `import * as aws from "@pulumi/aws";\n`;
		combined += `import * as pulumi from "@pulumi/pulumi";\n\n`;

		// Track if we've seen imports to avoid duplicates
		const seenImports = new Set<string>();
		
		for (const slide of codeSlides) {
			if ((slide.language || "typescript").toLowerCase() === "typescript") {
				combined += `// ============================================================================\n`;
				combined += `// ${slide.title || slide.name}\n`;
				combined += `// ============================================================================\n`;
				
				// Remove duplicate import statements from slide code
				let slideCode = slide.code;
				// Remove import lines that we already have
				slideCode = slideCode.replace(/^import\s+.*?from\s+["']@pulumi\/aws["'];?\s*$/gm, "");
				slideCode = slideCode.replace(/^import\s+.*?from\s+["']@pulumi\/pulumi["'];?\s*$/gm, "");
				slideCode = slideCode.trim();
				
				combined += slideCode + "\n\n";
			}
		}

		// Add exports for important resources
		combined += `// ============================================================================\n`;
		combined += `// Exports\n`;
		combined += `// ============================================================================\n`;
		combined += `// Uncomment and adjust these exports based on what you need:\n`;
		combined += `// export const vpcId = vpc.id;\n`;
		combined += `// export const subnetIds = [publicSubnet1.id, publicSubnet2.id];\n`;
		
		return combined;
	}

	return "";
}

function main() {
	const outputBaseDir = path.join(__dirname, "../public/source_code");
	
	// Create base directory
	if (!fs.existsSync(outputBaseDir)) {
		fs.mkdirSync(outputBaseDir, { recursive: true });
	}

	let totalFiles = 0;
	let totalModules = 0;
	let totalCombined = 0;

	console.log("Extracting source code from all modules...\n");

	for (const module of allModules) {
		const moduleDir = path.join(outputBaseDir, `module${module.moduleNumber}`);
		
		// Create module directory
		if (!fs.existsSync(moduleDir)) {
			fs.mkdirSync(moduleDir, { recursive: true });
		}

		let moduleFileCount = 0;

		// Extract individual slide code files
		for (const slide of module.slides) {
			// Only process code slides
			if (slide.type === "code" && slide.code) {
				const language = slide.language || "typescript";
				const extension = getFileExtension(language);
				const fileName = sanitizeFileName(`${slide.name}.${extension}`);
				const filePath = path.join(moduleDir, fileName);

				// Add header comment for individual files
				let codeContent = `// ${slide.title || slide.name}\n`;
				codeContent += `// This is a code snippet from Module ${module.moduleNumber}\n`;
				codeContent += `// Note: This file may reference variables from other slides\n`;
				codeContent += `// For a complete, runnable version, see index.ts in this directory\n\n`;
				codeContent += slide.code;

				// Write code to file
				fs.writeFileSync(filePath, codeContent, "utf-8");
				
				console.log(`  ✓ Module ${module.moduleNumber}: ${slide.name} (${language})`);
				moduleFileCount++;
				totalFiles++;
			}
		}

		// Create combined, complete file for TypeScript modules
		const combinedCode = combineModuleCode(module);
		if (combinedCode) {
			const combinedPath = path.join(moduleDir, "index.ts");
			fs.writeFileSync(combinedPath, combinedCode, "utf-8");
			console.log(`  ✓ Module ${module.moduleNumber}: index.ts (complete combined file)`);
			totalCombined++;
		}

		if (moduleFileCount > 0) {
			totalModules++;
			console.log(`Module ${module.moduleNumber}: ${moduleFileCount} code files + 1 combined file\n`);
		}
	}

	// Create README in source_code directory
	const readmePath = path.join(outputBaseDir, "README.md");
	const readmeContent = `# Source Code Files

This directory contains all Pulumi code examples from the course modules.

## Structure

Each module has its own directory:
- \`module1/\` - Module 1 code examples
- \`module2/\` - Module 2 code examples
- \`module3/\` - Module 3 code examples
- ... and so on

## File Naming

Files are named after the slide they appear in:
- \`{slideName}.{extension}\`
- Example: \`createVPC.ts\`, \`initCode.sh\`

## Languages

Code files use appropriate extensions:
- TypeScript: \`.ts\`
- Bash/Shell: \`.sh\`
- YAML: \`.yaml\`
- JSON: \`.json\`
- Python: \`.py\`

## File Types

### Individual Slide Files
- Named after the slide: \`{slideName}.{extension}\`
- These are code snippets from individual slides
- May reference variables from other slides
- Useful for understanding individual concepts

### Complete Combined Files
- \`index.ts\` - Complete, combined code for the module
- Includes all TypeScript code from the module
- Has proper imports and structure
- More runnable, but may still need adjustments

## Usage

### For Learning
- Use individual slide files to understand each concept
- See how code builds incrementally

### For Implementation
- Start with \`index.ts\` for a complete starting point
- Combine with code from other modules as needed
- Adjust variable names and add missing dependencies

## Important Notes

⚠️ **These files are educational examples:**
- They may reference resources created in previous slides
- You may need to combine code from multiple files
- Some variables may need to be defined or imported
- Always test in a development environment first

## Total Files

- Modules with code: ${totalModules}
- Individual code files: ${totalFiles}
- Combined files: ${totalCombined}

Generated automatically from moduleContent.ts
`;

	fs.writeFileSync(readmePath, readmeContent, "utf-8");

	console.log("✅ Source code extraction complete!");
	console.log(`   Total modules: ${totalModules}`);
	console.log(`   Total files: ${totalFiles}`);
	console.log(`   Output directory: ${outputBaseDir}`);
}

main();
