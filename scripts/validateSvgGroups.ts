// Validate that SVG files have semantic group IDs
// Helps identify which SVGs need group IDs added

import * as fs from "fs";
import * as path from "path";

interface ValidationResult {
  file: string;
  hasGroups: boolean;
  groupIds: string[];
  missingGroups: string[];
  suggestions: string[];
}

/**
 * Extract group IDs from SVG content
 */
function extractGroupIds(svgContent: string): string[] {
  const groupRegex = /<g\s+[^>]*id=["']([^"']+)["'][^>]*>/gi;
  const ids: string[] = [];
  let match;
  
  while ((match = groupRegex.exec(svgContent)) !== null) {
    ids.push(match[1]);
  }
  
  return [...new Set(ids)];
}

/**
 * Get suggested group names from animation spec if it exists
 */
function getSuggestedGroups(animationSpecPath: string): string[] {
  if (!fs.existsSync(animationSpecPath)) {
    return [];
  }
  
  try {
    const spec = JSON.parse(fs.readFileSync(animationSpecPath, "utf-8"));
    const allGroups = new Set<string>();
    
    if (spec.phases && Array.isArray(spec.phases)) {
      for (const phase of spec.phases) {
        if (phase.show) allGroups.add(...phase.show);
        if (phase.dim) allGroups.add(...phase.dim);
        if (phase.highlight) allGroups.add(...phase.highlight);
      }
    }
    
    return Array.from(allGroups);
  } catch {
    return [];
  }
}

/**
 * Validate a single SVG file
 */
function validateSvgFile(svgPath: string): ValidationResult {
  const content = fs.readFileSync(svgPath, "utf-8");
  const groupIds = extractGroupIds(content);
  const hasGroups = groupIds.length > 0;
  
  // Check for animation spec
  const svgName = path.basename(svgPath, ".svg");
  const specPath = svgPath.replace(".svg", ".animation.json");
  const suggestedGroups = getSuggestedGroups(specPath);
  
  // Find missing groups (in spec but not in SVG)
  const missingGroups = suggestedGroups.filter(g => !groupIds.includes(g));
  
  return {
    file: path.basename(svgPath),
    hasGroups,
    groupIds,
    missingGroups,
    suggestions: suggestedGroups,
  };
}

/**
 * Main validation function
 */
function validateAllSvgs(courseId: string, moduleRange?: string) {
  console.log(`\nValidating SVG group IDs for course: ${courseId}\n`);
  
  const svgBaseDir = path.join(__dirname, "../courses", courseId, "course/diagrams/svg");
  
  if (!fs.existsSync(svgBaseDir)) {
    throw new Error(`SVG directory not found: ${svgBaseDir}`);
  }
  
  // Get module directories
  const moduleDirs = fs.readdirSync(svgBaseDir)
    .filter(item => {
      const itemPath = path.join(svgBaseDir, item);
      return fs.statSync(itemPath).isDirectory() && item.startsWith("module");
    })
    .sort();
  
  // Filter by range if specified
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
    } else {
      const num = parseInt(moduleRange);
      modulesToProcess = moduleDirs.filter(dir => {
        const modNum = parseInt(dir.replace("module", ""));
        return modNum === num;
      });
    }
  }
  
  const results: ValidationResult[] = [];
  
  for (const moduleDir of modulesToProcess) {
    const modulePath = path.join(svgBaseDir, moduleDir);
    const svgFiles = fs.readdirSync(modulePath)
      .filter(file => file.endsWith(".svg"))
      .sort();
    
    for (const svgFile of svgFiles) {
      const svgPath = path.join(modulePath, svgFile);
      const result = validateSvgFile(svgPath);
      results.push(result);
    }
  }
  
  // Report results
  console.log(`Found ${results.length} SVG file(s)\n`);
  
  let validCount = 0;
  let missingCount = 0;
  
  for (const result of results) {
    if (result.hasGroups) {
      console.log(`✓ ${result.file}`);
      console.log(`  Groups: ${result.groupIds.join(", ")}`);
      
      if (result.missingGroups.length > 0) {
        console.log(`  ⚠ Missing from SVG (but in spec): ${result.missingGroups.join(", ")}`);
        missingCount++;
      } else {
        validCount++;
      }
    } else {
      console.log(`✗ ${result.file}`);
      console.log(`  No group IDs found`);
      
      if (result.suggestions.length > 0) {
        console.log(`  Suggested groups (from spec): ${result.suggestions.join(", ")}`);
      } else {
        console.log(`  No animation spec found - add groups manually`);
      }
      missingCount++;
    }
    console.log("");
  }
  
  console.log(`\nSummary:`);
  console.log(`  ✓ Valid: ${validCount}`);
  console.log(`  ✗ Need groups: ${missingCount}`);
  
  if (missingCount > 0) {
    console.log(`\nNext steps:`);
    console.log(`  1. Open SVG files in Inkscape, Figma, or similar editor`);
    console.log(`  2. Group related elements and assign IDs to <g> elements`);
    console.log(`  3. Use semantic names like: "single-call", "agent-flow", "tools", etc.`);
    console.log(`  4. Re-run this script to validate`);
  }
}

// CLI
if (require.main === module) {
  const courseId = process.argv[2];
  const moduleRange = process.argv[3];
  
  if (!courseId) {
    console.error("Usage: npx tsx scripts/validateSvgGroups.ts <courseId> [moduleRange]");
    console.error("Example: npx tsx scripts/validateSvgGroups.ts agentic-ai-for-beginners");
    console.error("Example: npx tsx scripts/validateSvgGroups.ts agentic-ai-for-beginners 1-3");
    process.exit(1);
  }
  
  try {
    validateAllSvgs(courseId, moduleRange);
  } catch (error: any) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}
