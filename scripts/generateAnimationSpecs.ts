// Generate animation.json from word timings
// Uses concept→trigger map to detect when each diagram concept is first said; phases follow narration order.

import * as fs from "fs";
import * as path from "path";
import { loadModuleTimings } from "./saveTimingsJson";

const PUBLIC_TIMINGS = path.join(__dirname, "../public/timings");

/** Load module timings from public/timings (what Remotion uses). Prefer over course timings when present. */
function loadModuleTimingsFromPublic(moduleNumber: number): { slides: Record<string, { words: Array<{ text: string; start: number; end: number }> }> } | null {
  const p = path.join(PUBLIC_TIMINGS, `module${moduleNumber}.json`);
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, "utf-8"));
  } catch {
    return null;
  }
}

interface AnimationPhase {
  start: number;
  end: number;
  show: string[];
  dim: string[];
  highlight: string[];
  triggerWords?: string[];
}

interface AnimationSpec {
  diagram: string;
  phases: AnimationPhase[];
}

/** Shared map: group ID → words that mark when it's mentioned in the script. Enables automated phase order from narration. */
function getTriggerWords(groupId: string): string[] {
  const m: Record<string, string[]> = {
    planner: ["first", "planning", "planner"],
    planning: ["first", "planning", "planner"],
    tools: ["second", "tools"],
    memory: ["third", "memory"],
    environment: ["fourth", "environment", "safety"],
    evaluator: ["fifth", "evaluator", "human-in-the-loop"],
    retrieval: ["retrieval", "grounding"],
    safety: ["safety"],
    hitl: ["hitl", "human-in-the-loop", "human in the loop"],
    prompting: ["prompting", "direct"],
    agentic: ["agentic", "agent"],
    boundary: ["boundary", "interface"],
    user: ["user"],
    reliability: ["reliability"],
    traceability: ["traceability"],
    integration: ["integration"],
    "single-call": ["single", "call", "one-shot"],
    "agent-flow": ["agent", "loop", "flow"],
    loop: ["loop"],
    plan: ["plan", "planning"],
    act: ["act", "action"],
    observe: ["observe", "observation"],
    adapt: ["adapt"],
    main: ["main"],
  };
  const lower = groupId.toLowerCase().replace(/\s+/g, "-");
  return m[lower] ?? [lower];
}

/**
 * Generate phases from trigger-word detection: find when each concept is first said,
 * sort by time (narration order), build one phase per concept. Automated, no per-slide edits.
 * alwaysShow groups (e.g. "main") are prepended to every phase's show.
 */
function generatePhasesFromTriggerWords(
  words: Array<{ text: string; start: number; end: number }>,
  suggestedGroups: string[],
  alwaysShow: string[] = []
): AnimationPhase[] {
  const hits: { group: string; start: number; triggers: string[] }[] = [];
  for (const g of suggestedGroups) {
    const triggers = getTriggerWords(g);
    const lower = triggers.map((t) => t.toLowerCase());
    const first = words.find((w) => {
      const wnorm = (w.text || "").toLowerCase().replace(/[.,!?;:]$/, "").trim();
      return lower.some((t) => wnorm === t || wnorm.replace(/-/g, " ") === t.replace(/-/g, " "));
    });
    if (first) hits.push({ group: g, start: first.start, triggers });
  }
  if (hits.length === 0) return [];
  hits.sort((a, b) => a.start - b.start);
  const lastEnd = words.length ? (words[words.length - 1]?.end ?? 0) : 0;
  const phases: AnimationPhase[] = [];
  const ordered = hits.map((h) => h.group);
  for (let i = 0; i < hits.length; i++) {
    const start = Math.round(hits[i].start * 10) / 10;
    const end = i < hits.length - 1 ? Math.round(hits[i + 1].start * 10) / 10 : Math.round(lastEnd * 10) / 10;
    const show = [...alwaysShow, ...ordered.slice(0, i + 1)];
    const dim = ordered.slice(i + 1);
    phases.push({
      start,
      end,
      show,
      dim,
      highlight: [hits[i].group],
      triggerWords: hits[i].triggers,
    });
  }
  return phases;
}

/**
 * Fallback: sentence boundaries + progressive reveal when no suggested groups or no trigger matches.
 */
function detectSentenceBoundaries(words: Array<{ text: string; start: number; end: number }>): number[] {
  const boundaries: number[] = [0];
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const nextWord = words[i + 1];
    const endsSentence = /[.!?]$/.test(word.text);
    const hasPause = nextWord && (nextWord.start - word.end) > 0.5;
    if (endsSentence || hasPause) boundaries.push(word.end);
  }
  if (words.length > 0) boundaries.push(words[words.length - 1].end);
  return [...new Set(boundaries)].sort((a, b) => a - b);
}

function generatePhasesFromBoundaries(
  boundaries: number[],
  suggestedGroups: string[] = []
): AnimationPhase[] {
  const phases: AnimationPhase[] = [];
  const n = Math.min(boundaries.length - 1, Math.max(1, suggestedGroups.length || 5));
  for (let i = 0; i < n; i++) {
    const start = boundaries[i];
    const end = boundaries[i + 1] ?? boundaries[boundaries.length - 1];
    let show: string[] = [];
    let dim: string[] = [];
    let highlight: string[] = [];
    if (suggestedGroups.length > 0) {
      const k = Math.min(Math.ceil((suggestedGroups.length * (i + 1)) / n), suggestedGroups.length);
      show = suggestedGroups.slice(0, k);
      dim = suggestedGroups.slice(k);
      if (show.length) highlight = [show[show.length - 1]];
    } else {
      show = i === 0 ? ["main"] : ["main", `section-${i}`];
      highlight = i === 0 ? [] : [`section-${i}`];
    }
    phases.push({
      start: Math.round(start * 10) / 10,
      end: Math.round(end * 10) / 10,
      show,
      dim,
      highlight,
    });
  }
  return phases;
}

/**
 * Generate animation spec for a single diagram
 */
function generateAnimationSpec(
  courseId: string,
  moduleNumber: number,
  slideName: string,
  svgFileName: string,
  suggestedGroups: string[] = []
): AnimationSpec | null {
  let timings = loadModuleTimingsFromPublic(moduleNumber);
  if (!timings) timings = loadModuleTimings(courseId, moduleNumber);
  
  if (!timings?.slides?.[slideName]?.words?.length) {
    return null;
  }
  
  const words = timings.slides[slideName].words;
  if (words.length === 0) {
    console.log(`  ⚠ No words in timings for ${slideName}, skipping`);
    return null;
  }

  const alwaysShow = getAlwaysShowGroups(moduleNumber, svgFileName);
  let phases: AnimationPhase[];
  if (suggestedGroups.length > 0) {
    phases = generatePhasesFromTriggerWords(words, suggestedGroups, alwaysShow);
    if (phases.length === 0) {
      const boundaries = detectSentenceBoundaries(words);
      phases = generatePhasesFromBoundaries(boundaries, suggestedGroups);
      if (alwaysShow.length > 0) {
        phases = phases.map((p) => ({ ...p, show: [...alwaysShow, ...p.show], dim: p.dim }));
      }
    }
  } else {
    const boundaries = detectSentenceBoundaries(words);
    phases = generatePhasesFromBoundaries(boundaries, []);
    if (alwaysShow.length > 0) {
      phases = phases.map((p) => ({ ...p, show: [...alwaysShow, ...p.show] }));
    }
  }

  return {
    diagram: svgFileName,
    phases,
  };
}

/**
 * Map diagram → slide name so we use the correct script timings (concept / architecture / application).
 */
function getSlideForDiagram(moduleNumber: number, diagramName: string): string | null {
  const key = `module${String(moduleNumber).padStart(2, "0")}/${diagramName.replace(".svg", "")}`;
  const map: Record<string, string> = {
    "module01/agentic-architecture-high-level": "module-1-architecture",
    "module01/direct-prompting-vs-agentic": "module-1-concept",
    "module01/enterprise-adoption-drivers": "module-1-application",
    "module02/agent-loop-pattern": "module-2-concept",
    "module02/agent-components": "module-2-architecture",
    "module02/agent-vs-singlecall": "module-2-application",
    "module03/nvidia-ai-stack-overview": "module-3-concept",
    "module03/inference-pipeline": "module-3-architecture",
    "module03/deployment-surfaces": "module-3-application",
    "module04/inference-pipeline-full": "module-4-concept",
    "module04/workload-matrix": "module-4-architecture",
    "module04/pipeline-constraints-triangle": "module-4-application",
    "module05/deployment-decision-matrix": "module-5-concept",
    "module05/integration-surfaces": "module-5-architecture",
    "module05/ops-lifecycle": "module-5-application",
    "module06/industry-usecase-grid": "module-6-concept",
    "module06/adoption-curve": "module-6-architecture",
    "module06/value-driver-spider": "module-6-application",
  };
  return map[key] ?? null;
}

/**
 * Get suggested groups from UPDATE.md or module specs
 */
function getSuggestedGroups(moduleNumber: number, diagramName: string): string[] {
  // Map from UPDATE.md suggestions
  const groupMap: Record<string, string[]> = {
    "module01": {
      "direct-prompting-vs-agentic": ["prompting", "agentic", "boundary", "user"],
      "agentic-architecture-high-level": ["planner", "memory", "tools", "environment", "evaluator"],
      "enterprise-adoption-drivers": ["reliability", "traceability", "integration"],
    },
    "module02": {
      "agent-vs-singlecall": ["single-call", "agent-flow", "tools"],
      "agent-loop-pattern": ["loop", "plan", "act", "observe", "adapt"],
      "agent-components": ["planning", "tools", "memory", "retrieval", "safety", "hitl"],
      "agent-roles-grid": ["roles", "perspectives"],
    },
  };
  
  const moduleKey = `module${String(moduleNumber).padStart(2, "0")}`;
  const baseName = diagramName.replace(".svg", "");
  
  return groupMap[moduleKey]?.[baseName] || [];
}

/** Diagrams that always include "main" in every phase's show (e.g. background/title). */
function getAlwaysShowGroups(moduleNumber: number, diagramName: string): string[] {
  const key = `module${String(moduleNumber).padStart(2, "0")}/${diagramName.replace(".svg", "")}`;
  const withMain = ["module01/enterprise-adoption-drivers"];
  return withMain.includes(key) ? ["main"] : [];
}

/**
 * Main function
 */
function generateAllAnimationSpecs(courseId: string, moduleRange?: string) {
  console.log(`\nGenerating animation specs for course: ${courseId}\n`);
  
  // Find all SVG files
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
  
  console.log(`Processing ${modulesToProcess.length} module(s)...\n`);
  
  let totalGenerated = 0;
  
  for (const moduleDir of modulesToProcess) {
    const moduleNumber = parseInt(moduleDir.replace("module", ""));
    const modulePath = path.join(svgBaseDir, moduleDir);
    
    console.log(`\n=== ${moduleDir} ===`);
    
    // Find all SVG files in this module
    const svgFiles = fs.readdirSync(modulePath)
      .filter(file => file.endsWith(".svg"))
      .sort();
    
    for (const svgFile of svgFiles) {
      const svgName = svgFile.replace(".svg", "");
      
      const mappedSlide = getSlideForDiagram(moduleNumber, svgName);
      const possibleSlideNames = mappedSlide
        ? [mappedSlide]
        : [
            `module-${moduleNumber}-concept`,
            `module-${moduleNumber}-architecture`,
            `module-${moduleNumber}-application`,
            `module-${moduleNumber}-diagram1`,
            `module-${moduleNumber}-diagram2`,
            `module-${moduleNumber}-diagram3`,
          ];
      
      const suggestedGroups = getSuggestedGroups(moduleNumber, svgName);
      
      let spec: AnimationSpec | null = null;
      for (const slideName of possibleSlideNames) {
        spec = generateAnimationSpec(courseId, moduleNumber, slideName, svgFile, suggestedGroups);
        if (spec) break;
      }
      
      if (!spec) {
        console.log(`  ⚠ Could not generate spec for ${svgFile} (no matching slide timings)`);
        // Generate a basic spec anyway
        spec = {
          diagram: svgFile,
          phases: [
            {
              start: 0,
              end: 10,
              show: suggestedGroups.length > 0 ? [suggestedGroups[0]] : ["main"],
              dim: suggestedGroups.slice(1),
              highlight: [],
            },
          ],
        };
      }
      
      // Save animation spec
      const specPath = path.join(modulePath, `${svgName}.animation.json`);
      fs.writeFileSync(specPath, JSON.stringify(spec, null, 2));
      console.log(`  ✓ Generated ${svgName}.animation.json`);
      console.log(`    Phases: ${spec.phases.length}, Groups: ${suggestedGroups.length > 0 ? suggestedGroups.join(", ") : "none (add manually)"}`);
      
      totalGenerated++;
    }
  }
  
  console.log(`\n✅ Generated ${totalGenerated} animation spec(s)`);
  console.log(`\nNext steps:`);
  console.log(`  1. Review and adjust phase timings in the .animation.json files`);
  console.log(`  2. Update show/dim/highlight arrays with actual SVG group IDs`);
  console.log(`  3. Ensure SVG files have semantic group IDs (<g id="...">)`);
}

// CLI
if (require.main === module) {
  const courseId = process.argv[2];
  const moduleRange = process.argv[3];
  
  if (!courseId) {
    console.error("Usage: npx tsx scripts/generateAnimationSpecs.ts <courseId> [moduleRange]");
    console.error("Example: npx tsx scripts/generateAnimationSpecs.ts agentic-ai-for-beginners");
    console.error("Example: npx tsx scripts/generateAnimationSpecs.ts agentic-ai-for-beginners 1-3");
    process.exit(1);
  }
  
  try {
    generateAllAnimationSpecs(courseId, moduleRange);
  } catch (error: any) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}
