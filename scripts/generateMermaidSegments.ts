// Generate mermaidSource per segment using local heuristics (no API).
// Builds flowcharts from segment bullet points.
//
// Run: npx tsx scripts/generateMermaidSegments.ts <courseId> [options]
// Example: npx tsx scripts/generateMermaidSegments.ts agentic-ai-for-beginners
//
// Options:
//   --slide <name>       Only process this slide
//   --module N           Only process this module
//   --include-content    Also process content-single slides classified as diagram
//   --overwrite          Regenerate mermaidSource even when it exists
//   --add-highlights     Add highlightNodes to existing diagrams (first 1-2 nodes)
//   --dry-run            Preview changes without writing
//
// No API required - derives diagrams from segment points.

import * as fs from "fs";
import * as path from "path";

interface ContentSlide {
	name: string;
	type: string;
	script?: string;
	title?: string;
	mermaidSource?: string;
	points?: string[];
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

interface SegmentDef {
	points?: string[];
	keyWords?: string[][];
	phraseTimes?: { start: number; end: number }[];
	mermaidSource?: string;
}

interface SlideSplitDef {
	splitAt: number[];
	segments?: SegmentDef[];
}

type SlideSplitsJson = Record<string, SlideSplitDef>;

// Quality: flowchart LR for linear flows; TB for stacked comparisons.
// Concise labels; use <br> for line breaks. Match narration; use script phrases.
// Dull, theme-close; distinct hue difference so boxes are clearly different.
const HIGHLIGHT_STYLE_A = "fill:#1e3a5f,stroke:#3b82f6,stroke-width:2px";
const HIGHLIGHT_STYLE_B = "fill:#374151,stroke:#6b7280,stroke-width:2px";
const NODE_IDS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const MAX_NODES = 6;
const MAX_LABEL_LEN = 40;
const TRAILING_FRAGMENTS = new Set(["this", "that", "the", "and", "or", "it", "is", "are", "to", "for", "in", "on", "of", "as", "when", "which", "who", "what"]);

const GARBLED_REPLACEMENTS: [RegExp | string, string][] = [
	["Track p50 p95 p99 deterministic reports", "Track p50 p95 p99 latency percentiles"],
	[/Output stability For workflows log whether the output\b/, "Output stability For deterministic workflows log whether the output changed"],
	["Regression did a change make things", "Regression: did a change make things worse?"],
	["For correctness you might use a model as judge a separate model scores the output", "For correctness: use model-as-judge to score output"],
	["For correctness you might use a model as judge a separate model scores the", "For correctness: use model-as-judge to score output"],
	["They cannot use external tools They", "They cannot use external tools"],
	["An agent is", "An agent is a system architecture"],
	["orchestrates language", "orchestrates language models"],
	["at the highest level an", "at the highest level an agent"],
	["structured decision-making under", "structured decision-making under uncertainty"],
	["that filter harmful", "that filter harmful outputs"],
	["must know when to pause escalate and", "must know when to pause escalate and defer"],
	["know what the ai", "know what the AI did"],
	["Did why it did it and what data it used agentic systems", "why it did it and what data it used"],
	["Call every memory access", "Log every memory access"],
	["architectures are built for", "architectures are built for integration"],
	["the result is", "the result is a new category of workload"],
	["ai that doesn't", "AI that doesn't just assist but operates"],
	["look like at the highest level an", "look like at the highest level? An agent"],
	["Is where reasoning models earn their", "This is where reasoning models earn their value"],
	["on an execution order and adapt when", "decide on execution order and adapt when"],
	["Interfaces that let agents interact with the real world apis", "Interfaces let agents interact with the real world: APIs"],
	["More tool use is what makes agents useful beyond conversation third", "Tool use makes agents useful beyond conversation. Third: memory"],
	["The current task context long-term memory stores", "Current task context; long-term memory stores knowledge"],
	["Without memory agents would repeat", "Without memory agents would repeat mistakes"],
	["Outputs policy", "Output and policy checks"],
	["evaluation layers that assess", "evaluation layers that assess quality"],
	["Should be automated agentic systems", "Should be automated. Agentic systems"],
	["making a single call to", "making a single call to a language model"],
	["Claude you're making a single call to", "Claude you're making a single call to a language model"],
	["search engines for", "search engines for retrieval"],
	["that lets the", "that lets the agent find relevant context"],
	["the agent flags it for review Again that's a", "the agent flags it for review. Again that's human-in-the-loop"],
	["require coordination verification and", "require coordination verification and human oversight"],
	["where each layer is", "where each layer is built for the next"],
	["you have an optimized model you need to", "you have an optimized model you need to serve it"],
	["provides HTTP APIs out of the box And it", "provides HTTP APIs out of the box"],
	["with a clear upgrade path and", "with a clear upgrade path"],
	["infrastructure required for", "infrastructure required for production agents"],
	["They package", "They package models and tools for deployment"],
	["sustained operational process that", "sustained operational process that runs continuously"],
	["You control the", "You control the deployment"],
	["when connectivity", "when connectivity is limited"],
	["Each deployment model is a", "Each deployment model is a trade-off"],
	["On Prem for Compliance and", "On-prem for compliance and data sovereignty"],
	["the loop connects to", "the loop connects to the real world"],
	["route complex cases to", "route complex cases to humans"],
	["accesses customer", "accesses customer data and history"],
	["Given a research question the", "Given a research question the agent searches and synthesizes"],
	["When you outgrow a", "When you outgrow a single instance"],
	["Batch size of four or", "Batch size of four or more"],
	["Embeddings are stored in a", "Embeddings are stored in a vector index"],
	["outputs They", "outputs. They"],
	["validate the arguments against a", "validate the arguments against a schema"],
	["Use an", "Use an embedding model"],
	["Include the source in the", "Include the source in the response"],
	["you've introduced a", "you've introduced a regression"],
	["model states a fact not in the", "model states a fact not in the retrieved context"],
	["making a", "making a decision"],
	["wait for human response or", "wait for human response or async"],
	["Transparency builds trust and", "Transparency builds trust and enables oversight"],
];

function truncateAtWord(text: string, maxLen: number): string {
	if (text.length <= maxLen) return text;
	const atSpace = text.lastIndexOf(" ", maxLen);
	const cut = atSpace > 0 ? atSpace : maxLen;
	return text.slice(0, cut).trim();
}

function fixGarbledPhrase(text: string): string {
	for (const [pattern, replacement] of GARBLED_REPLACEMENTS) {
		if (typeof pattern === "string") {
			if (text.includes(pattern)) return text.replace(pattern, replacement);
		} else {
			if (pattern.test(text)) return text.replace(pattern, replacement);
		}
	}
	return text;
}

function toMermaidLabel(text: string): string {
	let s = fixGarbledPhrase(text)
		.replace(/["\\]/g, "#quote;")
		.replace(/\s+/g, " ")
		.trim();
	const words = s.split(" ").filter((w) => w.length > 0);
	while (words.length > 1 && TRAILING_FRAGMENTS.has(words[words.length - 1].toLowerCase())) words.pop();
	s = words.join(" ");
	if (s.length > MAX_LABEL_LEN) {
		const first = truncateAtWord(s, MAX_LABEL_LEN - 2);
		const rest = s.slice(first.length).trim();
		const second = rest ? truncateAtWord(rest, MAX_LABEL_LEN - 2) : "";
		s = second ? first + "<br>" + second : first;
	}
	return s ? s.charAt(0).toUpperCase() + s.slice(1) : "Concept";
}

function isComparisonStyle(points: string[]): boolean {
	const text = points.join(" ").toLowerCase();
	return /\b(vs\.?|versus|compare|compared|comparison|first|second|third|either|or\s)\b/.test(text) && points.length >= 2;
}

function generateMermaidFromPoints(segmentPoints: string[]): { mermaidSource: string; highlightNodes: string[] } {
	const raw = segmentPoints
		.map((p) => toMermaidLabel(p))
		.filter((p) => p.length >= 3)
		.slice(0, MAX_NODES);
	const phrases = [...new Map(raw.map((p) => [p.toLowerCase(), p])).values()];
	if (phrases.length === 0) {
		return {
			mermaidSource: "flowchart LR\n    A[Key concept]",
			highlightNodes: ["A"],
		};
	}
	const useTB = isComparisonStyle(segmentPoints) && phrases.length >= 2;
	const dir = useTB ? "TB" : "LR";
	const parts: string[] = [];
	for (let i = 0; i < phrases.length; i++) {
		const id = NODE_IDS[i];
		const label = phrases[i];
		const safe = /[()[\]]/.test(label) ? `["${label.replace(/"/g, "#quote;")}"]` : `[${label}]`;
		parts.push(`${id}${safe}`);
	}
	const mermaidSource = `flowchart ${dir}\n    ` + parts.join(" --> ");
	// Highlight only the last node so the border moves with narration (current concept per segment)
	const lastIdx = phrases.length - 1;
	const highlightNodes = [NODE_IDS[lastIdx]];
	return { mermaidSource, highlightNodes };
}

/** Strip existing style lines from mermaid */
function stripStyleLines(source: string): string {
	return source
		.split("\n")
		.filter((line) => !/^\s*style\s+\w+\s+/.test(line.trim()))
		.join("\n")
		.trim();
}

/** Fix common Mermaid parse errors */
function sanitizeMermaidSource(source: string): string {
	let s = source.replace(/<br\s*\/>/gi, "<br>");
	s = s.replace(/\[([^\]]*)\]/g, (_, content) => {
		if (content.startsWith('"') && content.endsWith('"') && content.length >= 2) {
			const inner = content.slice(1, -1).replace(/"/g, "#quote;");
			return '["' + inner + '"]';
		}
		return "[" + content.replace(/"/g, "#quote;") + "]";
	});
	return s;
}

function getAudioDuration(courseId: string, slideName: string): number {
	try {
		const mod = slideName.match(/module-(\d+)-/)?.[1];
		if (!mod) return 60;
		const key = `${courseId}/module${mod}-${slideName}`;
		const { getAudioDuration: getDur } = require("../src/utils/audioDuration") as {
			getAudioDuration: (k: string) => number;
		};
		return getDur(key) ?? 60;
	} catch {
		return 60;
	}
}

function slideBelongsToModule(slideName: string, moduleNum: number): boolean {
	const m = slideName.match(/module-(\d+)-/);
	return m ? parseInt(m[1], 10) === moduleNum : false;
}

function main() {
	const args = process.argv.slice(2);
	const courseId = args.find((a) => !a.startsWith("--")) ?? "";
	const slideFilter = args.includes("--slide")
		? args[args.indexOf("--slide") + 1]
		: undefined;
	const moduleFilter = args.includes("--module")
		? parseInt(args[args.indexOf("--module") + 1], 10)
		: undefined;
	const overwrite = args.includes("--overwrite");
	const addHighlights = args.includes("--add-highlights");
	const dryRun = args.includes("--dry-run");
	const includeContent = args.includes("--include-content");

	if (!courseId) {
		console.error("Usage: npx tsx scripts/generateMermaidSegments.ts <courseId> [--module N] [--slide <name>] [--include-content] [--overwrite] [--add-highlights] [--dry-run]");
		console.error("Example: npx tsx scripts/generateMermaidSegments.ts agentic-ai-for-beginners");
		process.exit(1);
	}
	if (moduleFilter !== undefined && isNaN(moduleFilter)) {
		console.error("--module requires a valid number");
		process.exit(1);
	}

	const coursePath = path.join(__dirname, "../courses", courseId);
	const contentPath = path.join(coursePath, "content.json");
	const splitsPath = path.join(coursePath, "slide-splits.json");

	if (!fs.existsSync(contentPath) || !fs.existsSync(splitsPath)) {
		console.error(`Missing content.json or slide-splits.json in ${coursePath}`);
		process.exit(1);
	}

	const content: ContentJson = JSON.parse(fs.readFileSync(contentPath, "utf-8"));
	const splits: SlideSplitsJson = JSON.parse(fs.readFileSync(splitsPath, "utf-8"));

	let classificationMap: Record<string, "diagram" | "bullets"> = {};
	const classificationPath = path.join(coursePath, "slide-visual-classification.json");
	if (includeContent) {
		if (fs.existsSync(classificationPath)) {
			classificationMap = JSON.parse(fs.readFileSync(classificationPath, "utf-8"));
		} else {
			console.warn("--include-content used but slide-visual-classification.json not found. Run: npx tsx scripts/classifySlideVisual.ts " + courseId);
		}
	}

	const slidesByName = new Map<string, ContentSlide>();
	for (const mod of content.modules) {
		for (const slide of mod.slides) {
			slidesByName.set(slide.name, slide);
		}
	}

	function shouldProcessSlide(slideName: string, slide: ContentSlide | undefined): boolean {
		if (!slide) return false;
		if (slide.type === "mermaid") return true;
		if (includeContent && (slide.type === "content-single" || slide.type === "content-two-card")) {
			return classificationMap[slideName] === "diagram";
		}
		return false;
	}

	let updated = 0;

	for (const [slideName, splitDef] of Object.entries(splits)) {
		if (slideFilter && slideName !== slideFilter) continue;
		if (moduleFilter !== undefined && !slideBelongsToModule(slideName, moduleFilter)) continue;
		if (!splitDef?.splitAt?.length || !splitDef.segments?.length) continue;

		const slide = slidesByName.get(slideName);
		if (addHighlights) {
			if (!slide) continue;
		} else if (!shouldProcessSlide(slideName, slide)) {
			continue;
		}

		const fullDur = getAudioDuration(courseId, slideName);
		const boundaries = [0, ...splitDef.splitAt, fullDur];

		for (let j = 0; j < splitDef.segments.length; j++) {
			const seg = splitDef.segments[j];
			if (!seg) continue;

			const points = seg.points?.length ? seg.points : ["(no bullets)"];

			if (addHighlights) {
				if (!seg.mermaidSource) continue;
				const baseMermaid = stripStyleLines(seg.mermaidSource);
				if (!baseMermaid) continue;
				const nodeMatch = baseMermaid.match(/\b([A-Z])\s*\[/g);
				const nodeIds = nodeMatch ? [...new Set(nodeMatch.map((m) => m.trim().charAt(0)))] : [];
				const highlightNodes = nodeIds.length > 0 ? [nodeIds[nodeIds.length - 1]] : [];
				if (highlightNodes.length > 0) {
					seg.mermaidSource = baseMermaid + "\n" + `style ${highlightNodes[0]} ${HIGHLIGHT_STYLE_A}`;
					updated++;
					console.log(`  ${slideName} segment ${j + 1}/${splitDef.segments.length} (highlights)`);
				}
				continue;
			}

			if (seg.mermaidSource && !overwrite) continue;

			const { mermaidSource, highlightNodes } = generateMermaidFromPoints(points);
			const withStyle =
				highlightNodes.length > 0
					? mermaidSource + "\n" + `style ${highlightNodes[0]} ${HIGHLIGHT_STYLE_A}`
					: mermaidSource;
			seg.mermaidSource = sanitizeMermaidSource(withStyle);
			updated++;
			console.log(`  ${slideName} segment ${j + 1}/${splitDef.segments.length}`);
		}
	}

	if (updated > 0 && !dryRun) {
		fs.writeFileSync(splitsPath, JSON.stringify(splits, null, 2), "utf-8");
		console.log(`\nWrote ${updated} segment(s) to ${splitsPath}`);
		console.log("Run: npm run sync-slide-splits");
	} else if (dryRun && updated > 0) {
		console.log(`\n[dry-run] Would update ${updated} segment(s)`);
	} else {
		console.log("\nNo updates (use --overwrite to regenerate, or --slide <name> to target a slide)");
	}
}

main();
