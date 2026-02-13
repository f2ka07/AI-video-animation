// Save word timings to per-module JSON files
// This is the scalable replacement for saveWordTimings.ts

import * as fs from "fs";
import * as path from "path";

interface WordTiming {
  text: string;
  start: number;
  end: number;
}

interface LineMapping {
  id: string;
  line: number;
  wordRange: [number, number];
}

interface SlideTimings {
  words: WordTiming[];
}

interface ModuleTimings {
  moduleNumber: number;
  title: string;
  slides: Record<string, SlideTimings>;
  lineMappings: Record<string, LineMapping[]>;
}

// Course-specific timing directories
// Timings are stored in: courses/{courseId}/timings/module{N}.json

/**
 * Get the timings directory for a specific course
 */
function getTimingsDir(courseId: string): string {
  return path.join(__dirname, "../courses", courseId, "timings");
}

/**
 * Ensure the timings directory exists for a course
 */
function ensureTimingsDir(courseId: string): void {
  const dir = getTimingsDir(courseId);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Get the file path for a module's timing data
 */
function getTimingsPath(courseId: string, moduleNumber: number): string {
  return path.join(getTimingsDir(courseId), `module${moduleNumber}.json`);
}

/**
 * Load existing module timings (or create empty structure)
 */
export function loadModuleTimings(courseId: string, moduleNumber: number, title?: string): ModuleTimings {
  const filePath = getTimingsPath(courseId, moduleNumber);
  
  if (fs.existsSync(filePath)) {
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(content);
    } catch (error) {
      console.warn(`Failed to parse ${filePath}, creating new:`, error);
    }
  }
  
  // Return empty structure
  return {
    moduleNumber,
    title: title || `Module ${moduleNumber}`,
    slides: {},
    lineMappings: {},
  };
}

/**
 * Save module timings to JSON file
 */
export function saveModuleTimings(courseId: string, data: ModuleTimings): void {
  ensureTimingsDir(courseId);
  const filePath = getTimingsPath(courseId, data.moduleNumber);
  
  // Pretty-print JSON for readability
  const content = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, content, "utf-8");
  
  console.log(`Saved timings for module ${data.moduleNumber} to ${filePath}`);
}

/**
 * Save word timings for a specific slide
 */
export function saveSlideTimings(
  courseId: string,
  moduleNumber: number,
  slideName: string,
  words: WordTiming[],
  moduleTitle?: string
): void {
  const data = loadModuleTimings(courseId, moduleNumber, moduleTitle);
  
  data.slides[slideName] = { words };
  
  saveModuleTimings(courseId, data);
  console.log(`  Saved ${words.length} word timings for ${slideName}`);
}

/**
 * Save line mappings for a specific slide
 */
export function saveLineMappings(
  courseId: string,
  moduleNumber: number,
  slideName: string,
  mappings: LineMapping[]
): void {
  const data = loadModuleTimings(courseId, moduleNumber);
  
  data.lineMappings[slideName] = mappings;
  
  saveModuleTimings(courseId, data);
  console.log(`  Saved ${mappings.length} line mappings for ${slideName}`);
}

/**
 * Update module title
 */
export function updateModuleTitle(courseId: string, moduleNumber: number, title: string): void {
  const data = loadModuleTimings(courseId, moduleNumber, title);
  data.title = title;
  saveModuleTimings(courseId, data);
}

/**
 * CLI usage
 */
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 4) {
    console.log("Usage: npx tsx saveTimingsJson.ts <courseId> <moduleNumber> <slideName> <timingsJsonString>");
    console.log("Example: npx tsx saveTimingsJson.ts my-course 1 title '[{\"text\":\"Hello\",\"start\":0,\"end\":0.5}]'");
    process.exit(1);
  }
  
  const courseId = args[0];
  const moduleNumber = parseInt(args[1]);
  const slideName = args[2];
  const timingsJson = args[3];
  
  try {
    const words: WordTiming[] = JSON.parse(timingsJson);
    saveSlideTimings(courseId, moduleNumber, slideName, words);
    console.log("Done!");
  } catch (error) {
    console.error("Failed to parse timings JSON:", error);
    process.exit(1);
  }
}
