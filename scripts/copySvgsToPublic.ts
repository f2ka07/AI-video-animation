// Copy SVG files and animation specs from course directory to public/assets/
// Makes them accessible to Remotion via staticFile()

import * as fs from "fs";
import * as path from "path";

/**
 * Copy SVGs and animation specs for a course to public/assets/
 */
function copySvgsToPublic(courseId: string): void {
  console.log(`\nCopying SVGs and animation specs for course: ${courseId}\n`);
  
  const courseSvgsDir = path.join(__dirname, "../courses", courseId, "course/diagrams/svg");
  const publicAssetsDir = path.join(__dirname, "../public/assets", courseId);
  
  // Check if course SVGs directory exists
  if (!fs.existsSync(courseSvgsDir)) {
    throw new Error(`SVG directory not found: ${courseSvgsDir}`);
  }
  
  // Ensure public/assets/{courseId} directory exists
  if (!fs.existsSync(publicAssetsDir)) {
    fs.mkdirSync(publicAssetsDir, { recursive: true });
    console.log(`Created ${publicAssetsDir}`);
  }
  
  // Get all module directories
  const moduleDirs = fs.readdirSync(courseSvgsDir)
    .filter(item => {
      const itemPath = path.join(courseSvgsDir, item);
      return fs.statSync(itemPath).isDirectory() && item.startsWith("module");
    })
    .sort();
  
  let totalSvgs = 0;
  let totalSpecs = 0;
  
  for (const moduleDir of moduleDirs) {
    const modulePath = path.join(courseSvgsDir, moduleDir);
    const publicModulePath = path.join(publicAssetsDir, moduleDir);
    
    // Create module directory in public
    if (!fs.existsSync(publicModulePath)) {
      fs.mkdirSync(publicModulePath, { recursive: true });
    }
    
    // Copy SVG files
    const svgFiles = fs.readdirSync(modulePath)
      .filter(file => file.endsWith(".svg"))
      .sort();
    
    for (const svgFile of svgFiles) {
      const sourcePath = path.join(modulePath, svgFile);
      const destPath = path.join(publicModulePath, svgFile);
      
      fs.copyFileSync(sourcePath, destPath);
      totalSvgs++;
      console.log(`  Copied ${moduleDir}/${svgFile}`);
      
      // Also copy animation spec if it exists
      const specName = svgFile.replace(".svg", ".animation.json");
      const specSourcePath = path.join(modulePath, specName);
      const specDestPath = path.join(publicModulePath, specName);
      
      if (fs.existsSync(specSourcePath)) {
        fs.copyFileSync(specSourcePath, specDestPath);
        totalSpecs++;
        console.log(`    + ${specName}`);
      }
    }
  }
  
  console.log(`\n✅ Copied ${totalSvgs} SVG file(s) and ${totalSpecs} animation spec(s)`);
  console.log(`   Location: public/assets/${courseId}/`);
  console.log(`\nNote: Restart Remotion Studio to see changes`);
}

// CLI
if (require.main === module) {
  const courseId = process.argv[2];
  
  if (!courseId) {
    console.error("Usage: npx tsx scripts/copySvgsToPublic.ts <courseId>");
    console.error("Example: npx tsx scripts/copySvgsToPublic.ts agentic-ai-for-beginners");
    process.exit(1);
  }
  
  try {
    copySvgsToPublic(courseId);
  } catch (error: any) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}
