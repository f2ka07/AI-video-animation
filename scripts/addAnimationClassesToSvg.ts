// Add CSS classes and group IDs to SVG files based on animation specs
// This prepares SVGs for the CSS-based animation system

import * as fs from "fs";
import * as path from "path";

interface AnimationPhase {
  start: number;
  end: number;
  phase?: number;
  classes?: Record<string, string[]>;
}

interface AnimationSpec {
  diagram: string;
  phases: AnimationPhase[];
}

/**
 * Add group IDs and CSS classes to SVG based on animation spec
 */
function addAnimationClassesToSvg(svgPath: string, specPath: string): void {
  if (!fs.existsSync(specPath)) {
    console.log(`  ⚠ No animation spec found: ${specPath}`);
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

  // Add classes to existing groups with IDs
  for (const [groupId, classes] of Object.entries(groupIdToClasses)) {
    // Find group with this ID
    const groupRegex = new RegExp(`<g\\s+([^>]*id=["']${groupId}["'][^>]*)>`, "i");
    const match = svgContent.match(groupRegex);
    
    if (match) {
      let attributes = match[1];
      
      // Remove existing class attribute
      attributes = attributes.replace(/class=["'][^"']*["']/gi, "");
      
      // Add class attribute with "part" base class
      const allClasses = ["part", ...classes].join(" ");
      attributes += ` class="${allClasses}"`;
      
      const newGroupTag = `<g ${attributes}>`;
      svgContent = svgContent.replace(match[0], newGroupTag);
    } else {
      // Group doesn't exist - need to wrap elements
      console.log(`  ⚠ Group ID "${groupId}" not found in SVG - may need manual grouping`);
    }
  }

  // Add classes to links
  const linkClasses: Record<string, string[]> = {};
  for (const phase of spec.phases) {
    if (phase.animations) {
      for (const [linkId, anim] of Object.entries(phase.animations)) {
        if (anim.flow) {
          if (!linkClasses[linkId]) {
            linkClasses[linkId] = [];
          }
          linkClasses[linkId].push("link");
        }
      }
    }
  }

  // Add classes to lines/paths that should be links
  for (const [linkId, classes] of Object.entries(linkClasses)) {
    // Try to find line/path with id or near the link name
    // This is a heuristic - may need manual adjustment
    const linkPattern = new RegExp(`<(line|path)\\s+([^>]*)>`, "gi");
    // For now, we'll add classes manually or via a mapping
    console.log(`  Note: Link "${linkId}" needs class="${classes.join(" ")} ${linkId}"`);
  }

  // Backup original
  const backupPath = svgPath.replace(".svg", ".backup.svg");
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(svgPath, backupPath);
    console.log(`  Backed up to ${path.basename(backupPath)}`);
  }

  // Write updated SVG
  fs.writeFileSync(svgPath, svgContent, "utf-8");
  console.log(`  ✓ Updated ${path.basename(svgPath)} with animation classes`);
}

/**
 * Process all SVGs in a course
 */
function processCourseSvgs(courseId: string, moduleRange?: string) {
  console.log(`\nAdding animation classes to SVGs for course: ${courseId}\n`);
  
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
      .filter(file => file.endsWith(".svg"))
      .sort();
    
    for (const svgFile of svgFiles) {
      const svgPath = path.join(modulePath, svgFile);
      const specPath = svgPath.replace(".svg", ".animation.json");
      
      console.log(`\nProcessing ${svgFile}...`);
      addAnimationClassesToSvg(svgPath, specPath);
    }
  }
  
  console.log(`\n✅ Done!`);
  console.log(`\nNote: You may need to manually add group IDs to SVG elements`);
  console.log(`      and ensure link elements have the correct class names.`);
}

// CLI
if (require.main === module) {
  const courseId = process.argv[2];
  const moduleRange = process.argv[3];
  
  if (!courseId) {
    console.error("Usage: npx tsx scripts/addAnimationClassesToSvg.ts <courseId> [moduleRange]");
    process.exit(1);
  }
  
  try {
    processCourseSvgs(courseId, moduleRange);
  } catch (error: any) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}
