// Prepare SVG files for CSS-based animations
// Adds group IDs and CSS classes based on animation specs

import * as fs from "fs";
import * as path from "path";

interface AnimationSpec {
  diagram: string;
  phases: Array<{
    start: number;
    end: number;
    phase?: number;
    classes?: Record<string, string[]>;
  }>;
}

/**
 * Wrap SVG elements in groups with IDs and classes
 */
function prepareSvgForAnimation(svgPath: string, specPath: string): void {
  if (!fs.existsSync(specPath)) {
    console.log(`  ⚠ No animation spec: ${specPath}`);
    return;
  }

  const spec: AnimationSpec = JSON.parse(fs.readFileSync(specPath, "utf-8"));
  let svgContent = fs.readFileSync(svgPath, "utf-8");

  // Collect all group IDs that need classes
  const groupIdToClasses: Record<string, string[]> = {};
  
  for (const phase of spec.phases) {
    if (phase.classes) {
      for (const [className, groupIds] of Object.entries(phase.classes)) {
        for (const groupId of groupIds) {
          if (!groupIdToClasses[groupId]) {
            groupIdToClasses[groupId] = [];
          }
          if (!groupIdToClasses[groupId].includes(className)) {
            groupIdToClasses[groupId].push(className);
          }
        }
      }
    }
  }

  // For each group ID, ensure it exists and has the right classes
  for (const [groupId, classes] of Object.entries(groupIdToClasses)) {
    const groupRegex = new RegExp(`<g\\s+([^>]*id=["']${groupId}["'][^>]*)>`, "i");
    const match = svgContent.match(groupRegex);
    
    if (match) {
      // Group exists - add/update classes
      let attributes = match[1];
      attributes = attributes.replace(/class=["'][^"']*["']/gi, "");
      
      const allClasses = ["part", ...classes].join(" ");
      attributes += ` class="${allClasses}"`;
      
      const newGroupTag = `<g ${attributes}>`;
      svgContent = svgContent.replace(match[0], newGroupTag);
      console.log(`  ✓ Updated group "${groupId}" with classes: ${allClasses}`);
    } else {
      console.log(`  ⚠ Group "${groupId}" not found - elements need to be wrapped in <g id="${groupId}">`);
    }
  }

  // Backup and save
  const backupPath = svgPath.replace(".svg", `.backup.${Date.now()}.svg`);
  if (!fs.existsSync(backupPath.replace(/\.backup\.\d+/, ""))) {
    fs.copyFileSync(svgPath, svgPath.replace(".svg", ".backup.svg"));
  }
  
  fs.writeFileSync(svgPath, svgContent, "utf-8");
  console.log(`  ✓ Updated ${path.basename(svgPath)}`);
}

/**
 * Main function
 */
function prepareAllSvgs(courseId: string, moduleRange?: string) {
  console.log(`\nPreparing SVGs for animation: ${courseId}\n`);
  
  const svgBaseDir = path.join(__dirname, "../courses", courseId, "course/diagrams/svg");
  
  if (!fs.existsSync(svgBaseDir)) {
    throw new Error(`SVG directory not found: ${svgBaseDir}`);
  }
  
  const moduleDirs = fs.readdirSync(svgBaseDir)
    .filter(item => {
      const itemPath = path.join(svgBaseDir, item);
      return fs.statSync(itemPath).isDirectory() && item.startsWith("module");
    })
    .sort();
  
  let modulesToProcess = moduleDirs;
  if (moduleRange) {
    const rangeParts = moduleRange.split("-");
    if (rangeParts.length === 2) {
      const start = parseInt(rangeParts[0]);
      const end = parseInt(rangeParts[1]);
      modulesToProcess = moduleDirs.filter(dir => {
        const modNum = parseInt(dir.replace("module", ""));
        return modNum >= start && modNum <= end;
      });
    }
  }
  
  for (const moduleDir of modulesToProcess) {
    const modulePath = path.join(svgBaseDir, moduleDir);
    console.log(`\n=== ${moduleDir} ===`);
    
    const svgFiles = fs.readdirSync(modulePath)
      .filter(file => file.endsWith(".svg") && !file.includes(".backup"))
      .sort();
    
    for (const svgFile of svgFiles) {
      const svgPath = path.join(modulePath, svgFile);
      const specPath = svgPath.replace(".svg", ".animation.json");
      
      console.log(`\n${svgFile}:`);
      prepareSvgForAnimation(svgPath, specPath);
    }
  }
  
  console.log(`\n✅ Done!`);
}

// CLI
if (require.main === module) {
  const courseId = process.argv[2];
  const moduleRange = process.argv[3];
  
  if (!courseId) {
    console.error("Usage: npx tsx scripts/prepareSvgForAnimation.ts <courseId> [moduleRange]");
    process.exit(1);
  }
  
  try {
    prepareAllSvgs(courseId, moduleRange);
  } catch (error: any) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}
