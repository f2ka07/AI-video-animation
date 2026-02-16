// Classify each slide as diagram or bullets using local heuristics (no API).
// Output: courses/{courseId}/slide-visual-classification.json
//
// Run: npx tsx scripts/classifySlideVisual.ts <courseId> [options]
// Options:
//   --slide <name>    Only process this slide
//   --module N        Only process this module
//   --refine          Apply module-level balance (alternate diagram/bullets to avoid long runs)
//   --refine-only     Skip Phase 1; only run refinement (requires existing classification)
//   --dry-run         Preview without writing
//
// No API required - uses keyword and structure heuristics.

import * as fs from "fs";
import * as path from "path";

interface ContentSlide {
	name: string;
	type: string;
	script?: string;
	title?: string;
}

interface ContentModule {
	moduleNumber: number;
	title: string;
	slides: ContentSlide[];
}

interface ContentJson {
	courseId: string;
	courseName: string;
	modules: ContentModule[];
}

type Classification = "diagram" | "bullets";

// Quality: prefer diagrams for flows, architectures, processes, relationships.
// Reserve bullets only for: simple lists, exam tips, key takeaways, definitions.
// When uncertain, prefer diagram (more engaging). Target 50-70% diagrams.
const DIAGRAM_KEYWORDS = [
	"pipeline", "flow", "architecture", "process", "components", "steps", "workflow",
	"system", "agent", "loop", "connect", "relationship", "orchestrat", "planner",
	"executor", "router", "retriev", "chain", "sequence", "phase", "stage",
	"first", "second", "third", "then", "next", "finally", "how things",
	"structure", "model", "framework", "compare", "versus", "vs ",
	"reliability", "traceability", "integration", "drivers", "workflows"
];

const BULLETS_ONLY = ["recap", "exam-mapping"];

function classifySlideLocal(slideName: string, title: string, script: string): Classification {
	const text = `${(title || "").toLowerCase()} ${(script || "").toLowerCase()}`;
	const slideLower = slideName.toLowerCase();

	if (BULLETS_ONLY.some((s) => slideLower.includes(s))) return "bullets";
	if (slideLower.includes("architecture") || slideLower.includes("flow") || slideLower.includes("process") || slideLower.includes("concept") || slideLower.includes("application")) return "diagram";

	const diagramScore = DIAGRAM_KEYWORDS.filter((k) => text.includes(k)).length;
	const bulletsScore = ["exam", "tips", "key takeaways", "definition", "vocabulary", "certification", "prepare"].filter((k) => text.includes(k)).length;

	if (bulletsScore > diagramScore && diagramScore === 0) return "bullets";
	if (diagramScore > 0) return "diagram";

	return "diagram";
}

function refineModuleLocal(
	slides: { name: string; title: string; script: string }[],
	current: Record<string, Classification>
): Record<string, Classification> {
	const changes: Record<string, Classification> = {};
	let diagramRun = 0;
	let bulletsRun = 0;
	const MAX_RUN = 2;

	for (let i = 0; i < slides.length; i++) {
		const s = slides[i];
		const c = current[s.name] ?? "bullets";
		if (c === "diagram") {
			diagramRun++;
			bulletsRun = 0;
		} else {
			bulletsRun++;
			diagramRun = 0;
		}
		if (bulletsRun >= MAX_RUN && diagramRun === 0) {
			const diagramScore = DIAGRAM_KEYWORDS.filter((k) =>
				`${(s.title || "").toLowerCase()} ${(s.script || "").toLowerCase()}`.includes(k)
			).length;
			if (diagramScore >= 1) {
				changes[s.name] = "diagram";
				bulletsRun = 0;
				diagramRun = 1;
			}
		}
	}
	return changes;
}

function main() {
	const args = process.argv.slice(2);
	const courseId = args.find((a) => !a.startsWith("--")) ?? "";
	const slideFilter = args.includes("--slide") ? args[args.indexOf("--slide") + 1] : undefined;
	const moduleFilter = args.includes("--module")
		? parseInt(args[args.indexOf("--module") + 1], 10)
		: undefined;
	const dryRun = args.includes("--dry-run");
	const refine = args.includes("--refine");
	const refineOnly = args.includes("--refine-only");

	if (!courseId) {
		console.error("Usage: npx tsx scripts/classifySlideVisual.ts <courseId> [--module N] [--slide <name>] [--refine] [--refine-only] [--dry-run]");
		process.exit(1);
	}
	if (moduleFilter !== undefined && isNaN(moduleFilter)) {
		console.error("--module requires a valid number");
		process.exit(1);
	}

	const coursePath = path.join(__dirname, "../courses", courseId);
	const contentPath = path.join(coursePath, "content.json");
	const outputPath = path.join(coursePath, "slide-visual-classification.json");

	if (!fs.existsSync(contentPath)) {
		console.error(`content.json not found in ${coursePath}`);
		process.exit(1);
	}

	const content: ContentJson = JSON.parse(fs.readFileSync(contentPath, "utf-8"));
	let result: Record<string, Classification> = {};
	if (fs.existsSync(outputPath)) {
		result = JSON.parse(fs.readFileSync(outputPath, "utf-8"));
	}

	const slides: { name: string; title: string; script: string }[] = [];
	for (const mod of content.modules || []) {
		if (moduleFilter !== undefined && mod.moduleNumber !== moduleFilter) continue;
		for (const slide of mod.slides || []) {
			if (slide.type !== "content-single" && slide.type !== "content-two-card") continue;
			if (slideFilter && slide.name !== slideFilter) continue;
			slides.push({
				name: slide.name,
				title: slide.title ?? "",
				script: slide.script ?? "",
			});
		}
	}

	if (!refineOnly) {
		console.log("Phase 1: Classifying slides (local heuristics)...");
		for (const slide of slides) {
			const classification = classifySlideLocal(slide.name, slide.title, slide.script);
			result[slide.name] = classification;
			console.log(`  ${slide.name} -> ${classification}`);
		}
	} else {
		if (Object.keys(result).length === 0) {
			console.error("--refine-only requires existing slide-visual-classification.json. Run Phase 1 first.");
			process.exit(1);
		}
		console.log("Skipping Phase 1 (--refine-only)");
	}

	if (refine || refineOnly) {
		console.log("\nPhase 2: Module-level balance (avoid long bullet runs)...");
		const slidesByModule = new Map<number, { name: string; title: string; script: string }[]>();
		for (const slide of slides) {
			const modNum = parseInt(slide.name.match(/module-(\d+)-/)?.[1] ?? "0", 10);
			if (!slidesByModule.has(modNum)) slidesByModule.set(modNum, []);
			slidesByModule.get(modNum)!.push(slide);
		}
		for (const mod of content.modules || []) {
			if (moduleFilter !== undefined && mod.moduleNumber !== moduleFilter) continue;
			const modSlides = slidesByModule.get(mod.moduleNumber) ?? [];
			if (modSlides.length === 0) continue;
			console.log(`  Module ${mod.moduleNumber}: ${mod.title}...`);
			const changes = refineModuleLocal(modSlides, result);
			if (Object.keys(changes).length > 0) {
				for (const [name, val] of Object.entries(changes)) {
					result[name] = val;
					console.log(`    ${name}: -> ${val}`);
				}
			} else {
				console.log("    (no changes)");
			}
		}
	}

	if (!dryRun && Object.keys(result).length > 0) {
		fs.writeFileSync(outputPath, JSON.stringify(result, null, 2), "utf-8");
		console.log(`\nWrote ${outputPath}`);
	} else if (dryRun) {
		console.log("\n[dry-run] No file written");
	}
}

main();
