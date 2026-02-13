// Align original script text with Whisper timings
// This fixes transcription errors by replacing Whisper's text with the actual script words
// while preserving the timing information from Whisper

import * as fs from "fs";
import * as path from "path";
import { parseModuleContent, ModuleContent } from "./parseModuleContent";
import { loadModuleTimings, saveModuleTimings, ModuleTimings } from "./saveTimingsJson";

interface WordTiming {
  text: string;
  start: number;
  end: number;
}

/**
 * Normalize text for word splitting (handles punctuation, quotes, etc.)
 */
function normalizeText(text: string): string {
  // Replace smart quotes and other special characters
  return text
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/…/g, "...")
    .replace(/—/g, "-")
    .replace(/–/g, "-");
}

/**
 * Split script into words, preserving approximate word boundaries
 */
function splitIntoWords(script: string): string[] {
  const normalized = normalizeText(script);
  // Split on whitespace and punctuation, but keep words
  const words: string[] = [];
  const tokens = normalized.match(/\S+/g) || [];
  
  for (const token of tokens) {
    // Handle punctuation at word boundaries
    const wordMatch = token.match(/^([\w'-]+)([.,!?;:])?$/i);
    if (wordMatch) {
      words.push(wordMatch[1]);
      if (wordMatch[2]) {
        // Treat punctuation as separate "word" for timing purposes
        // But we'll merge it back in alignment
      }
    } else {
      // Fallback: just add the token
      words.push(token.replace(/[^\w'-]/g, ''));
    }
  }
  
  return words.filter(w => w.length > 0);
}

/**
 * Align script words with Whisper timings proportionally
 */
function alignWords(
  scriptWords: string[],
  whisperTimings: WordTiming[]
): WordTiming[] {
  if (whisperTimings.length === 0) {
    return [];
  }

  if (scriptWords.length === 0) {
    return whisperTimings;
  }

  // Calculate total duration from Whisper
  const totalDuration = whisperTimings[whisperTimings.length - 1].end;

  // If counts are similar, do 1:1 mapping
  if (Math.abs(scriptWords.length - whisperTimings.length) <= 2) {
    const aligned: WordTiming[] = [];
    const maxLen = Math.max(scriptWords.length, whisperTimings.length);
    
    for (let i = 0; i < maxLen; i++) {
      const scriptWord = scriptWords[i] || scriptWords[scriptWords.length - 1];
      const whisperTiming = whisperTimings[i] || whisperTimings[whisperTimings.length - 1];
      
      aligned.push({
        text: scriptWord,
        start: whisperTiming.start,
        end: whisperTiming.end,
      });
    }
    
    return aligned;
  }

  // Otherwise, distribute script words proportionally across Whisper timings
  const aligned: WordTiming[] = [];
  const scriptWordCount = scriptWords.length;
  const whisperCount = whisperTimings.length;
  
  // Calculate timing intervals from Whisper
  const intervals: Array<{ start: number; end: number; duration: number }> = [];
  for (let i = 0; i < whisperTimings.length; i++) {
    const timing = whisperTimings[i];
    intervals.push({
      start: timing.start,
      end: timing.end,
      duration: timing.end - timing.start,
    });
  }
  
  // Distribute script words proportionally
  let scriptIndex = 0;
  let cumulativeScriptTime = 0;
  const totalScriptTime = totalDuration; // Use Whisper's total duration as reference
  
  for (let i = 0; i < intervals.length && scriptIndex < scriptWords.length; i++) {
    const interval = intervals[i];
    const intervalDuration = interval.end - interval.start;
    
    // Calculate how many script words should fit in this interval
    // Based on proportion of remaining script words vs remaining intervals
    const remainingScriptWords = scriptWords.length - scriptIndex;
    const remainingIntervals = intervals.length - i;
    const wordsPerInterval = remainingScriptWords / remainingIntervals;
    
    const wordsInThisInterval = Math.ceil(wordsPerInterval);
    const actualWords = Math.min(wordsInThisInterval, remainingScriptWords);
    
    // Distribute words evenly within this interval
    for (let j = 0; j < actualWords && scriptIndex < scriptWords.length; j++) {
      const wordStart = interval.start + (intervalDuration * j) / actualWords;
      const wordEnd = interval.start + (intervalDuration * (j + 1)) / actualWords;
      
      aligned.push({
        text: scriptWords[scriptIndex],
        start: wordStart,
        end: wordEnd,
      });
      
      scriptIndex++;
    }
  }
  
  // Handle any remaining script words
  if (scriptIndex < scriptWords.length) {
    const lastTiming = whisperTimings[whisperTimings.length - 1];
    const remainingWords = scriptWords.length - scriptIndex;
    const extraDuration = 0.1; // Small duration for extra words
    
    for (let i = scriptIndex; i < scriptWords.length; i++) {
      aligned.push({
        text: scriptWords[i],
        start: lastTiming.end + (i - scriptIndex) * extraDuration,
        end: lastTiming.end + (i - scriptIndex + 1) * extraDuration,
      });
    }
  }
  
  return aligned;
}

/**
 * Parse module content and extract courseId
 */
function parseModulesWithCourseId(filePath: string): Array<ModuleContent & { courseId: string }> {
  const content = fs.readFileSync(filePath, 'utf-8');
  const modules = parseModuleContent(filePath);
  
  // Extract courseId from each module
  const moduleRegex = /export const module(\d+)Content: ModuleContent = \{([\s\S]*?)\};/g;
  let match;
  let moduleIndex = 0;
  
  while ((match = moduleRegex.exec(content)) !== null && moduleIndex < modules.length) {
    const moduleBody = match[2];
    const courseIdMatch = moduleBody.match(/courseId:\s*"([^"]+)"/);
    
    if (courseIdMatch) {
      (modules[moduleIndex] as any).courseId = courseIdMatch[1];
    }
    
    moduleIndex++;
  }
  
  return modules as Array<ModuleContent & { courseId: string }>;
}

/**
 * Align timings for a single module
 */
function alignModuleTimings(
  courseId: string,
  moduleNumber: number,
  scriptText: string,
  slideName: string
): void {
  console.log(`\nAligning timings for ${slideName}...`);
  
  // Load existing timings
  const timings = loadModuleTimings(courseId, moduleNumber);
  
  if (!timings.slides[slideName]) {
    console.log(`  ⚠ No timings found for ${slideName}, skipping`);
    return;
  }
  
  const whisperTimings = timings.slides[slideName].words;
  if (whisperTimings.length === 0) {
    console.log(`  ⚠ No word timings found for ${slideName}, skipping`);
    return;
  }
  
  // Split script into words
  const scriptWords = splitIntoWords(scriptText);
  console.log(`  Script words: ${scriptWords.length}`);
  console.log(`  Whisper words: ${whisperTimings.length}`);
  
  // Align words
  const alignedTimings = alignWords(scriptWords, whisperTimings);
  
  // Update timings
  timings.slides[slideName].words = alignedTimings;
  saveModuleTimings(courseId, timings);
  
  console.log(`  ✓ Aligned ${alignedTimings.length} words`);
  console.log(`  Duration: ${alignedTimings[alignedTimings.length - 1].end.toFixed(2)}s`);
}

/**
 * Main function
 */
async function alignAllTimings(courseId: string, moduleRange?: string) {
  console.log(`\nAligning script text with Whisper timings for course: ${courseId}\n`);
  
  // Load module content
  const moduleContentPath = path.join(__dirname, "../src/videos/moduleContent.ts");
  if (!fs.existsSync(moduleContentPath)) {
    throw new Error(`Module content file not found: ${moduleContentPath}`);
  }
  
  const modules = parseModulesWithCourseId(moduleContentPath);
  
  // Filter modules if range specified
  let modulesToProcess = modules;
  if (moduleRange) {
    const rangeParts = moduleRange.split("-");
    if (rangeParts.length === 2) {
      const start = parseInt(rangeParts[0]);
      const end = parseInt(rangeParts[1]);
      modulesToProcess = modules.filter(m => m.moduleNumber >= start && m.moduleNumber <= end);
    } else {
      const num = parseInt(moduleRange);
      modulesToProcess = modules.filter(m => m.moduleNumber === num);
    }
  }
  
  console.log(`Processing ${modulesToProcess.length} module(s)...\n`);
  
  let totalAligned = 0;
  
  for (const module of modulesToProcess) {
    // Verify course ID matches
    if (module.courseId !== courseId) {
      console.log(`\n⚠ Skipping module ${module.moduleNumber}: courseId mismatch (${module.courseId} vs ${courseId})`);
      continue;
    }
    
    console.log(`\n=== Module ${module.moduleNumber}: ${module.title} ===`);
    
    for (const slide of module.slides) {
      if (!slide.script || slide.script.trim().length === 0) {
        console.log(`  ⚠ Skipping ${slide.name}: no script text`);
        continue;
      }
      
      alignModuleTimings(courseId, module.moduleNumber, slide.script, slide.name);
      totalAligned++;
    }
  }
  
  console.log(`\n✅ Alignment complete!`);
  console.log(`   Aligned ${totalAligned} slide(s)`);
  console.log(`\nNext step: Activate the course to copy corrected timings to public/timings/`);
}

// CLI
if (require.main === module) {
  const courseId = process.argv[2];
  const moduleRange = process.argv[3];
  
  if (!courseId) {
    console.error("Usage: npx tsx scripts/alignScriptWithTimings.ts <courseId> [moduleRange]");
    console.error("Example: npx tsx scripts/alignScriptWithTimings.ts agentic-ai-for-beginners");
    console.error("Example: npx tsx scripts/alignScriptWithTimings.ts agentic-ai-for-beginners 1-3");
    process.exit(1);
  }
  
  alignAllTimings(courseId, moduleRange).catch(console.error);
}
