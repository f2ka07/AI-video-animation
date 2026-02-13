// Copy timings from course directory to public/timings/
// This is a simpler alternative to activateCourse when content.json doesn't exist

import * as fs from "fs";
import * as path from "path";

/**
 * Copy timings for a course to public/timings/
 */
function copyTimingsToPublic(courseId: string): void {
  console.log(`\nCopying timings for course: ${courseId}\n`);
  
  const courseTimingsDir = path.join(__dirname, "../courses", courseId, "timings");
  const publicTimingsDir = path.join(__dirname, "../public/timings");
  
  // Check if course timings directory exists
  if (!fs.existsSync(courseTimingsDir)) {
    throw new Error(`Timings directory not found: ${courseTimingsDir}`);
  }
  
  // Ensure public/timings directory exists
  if (!fs.existsSync(publicTimingsDir)) {
    fs.mkdirSync(publicTimingsDir, { recursive: true });
    console.log(`Created ${publicTimingsDir}`);
  }
  
  // Clear existing timings
  const existingFiles = fs.readdirSync(publicTimingsDir).filter(f => f.endsWith('.json'));
  for (const file of existingFiles) {
    fs.unlinkSync(path.join(publicTimingsDir, file));
  }
  console.log(`Cleared ${existingFiles.length} existing timing files`);
  
  // Copy course timings
  const timingFiles = fs.readdirSync(courseTimingsDir).filter(f => f.endsWith('.json'));
  
  if (timingFiles.length === 0) {
    console.log(`⚠ No timing files found in ${courseTimingsDir}`);
    return;
  }
  
  let copiedCount = 0;
  for (const file of timingFiles) {
    const sourcePath = path.join(courseTimingsDir, file);
    const destPath = path.join(publicTimingsDir, file);
    
    fs.copyFileSync(sourcePath, destPath);
    copiedCount++;
    console.log(`  Copied ${file}`);
  }
  
  console.log(`\n✅ Copied ${copiedCount} timing file(s) to public/timings/`);
  console.log(`\nNote: Restart Remotion Studio to see changes`);
}

// CLI
if (require.main === module) {
  const courseId = process.argv[2];
  
  if (!courseId) {
    console.error("Usage: npx tsx scripts/copyTimingsToPublic.ts <courseId>");
    console.error("Example: npx tsx scripts/copyTimingsToPublic.ts agentic-ai-for-beginners");
    process.exit(1);
  }
  
  try {
    copyTimingsToPublic(courseId);
  } catch (error: any) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}
