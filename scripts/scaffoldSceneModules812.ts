/**
 * Scaffold scene-based modules 8-12 for agentic-ai-for-beginners.
 * Creates SVG diagrams, animation specs, and Remotion scene components.
 */
import * as fs from "fs";
import * as path from "path";

const COURSE_ID = "agentic-ai-for-beginners";
const ROOT = path.join(__dirname, "..");
const COURSE = path.join(ROOT, "courses", COURSE_ID);

type Section = {
	svg: string;
	title: string;
	subtitle: string;
	sections: [string, string, string, string];
	phases: Array<{
		label: string;
		triggerWords: string[];
		highlight: string;
	}>;
};

type ModuleDef = {
	num: number;
	title: string;
	introOpening: string;
	introTagline: string;
	footer: string;
	concept: Section;
	architecture: Section;
	application: Section;
	examTerms: string[];
	recapPoints: string[];
};

const ALL_SECTIONS = ["section-1", "section-2", "section-3", "section-4"];

function buildAnimationSpec(diagram: string, sectionSummary: string, phases: Section["phases"]) {
	const introPhase = {
		start: 0,
		end: 8,
		show: ["main", ...ALL_SECTIONS],
		dim: ALL_SECTIONS,
		highlight: [] as string[],
		label: sectionSummary,
		triggerWords: ["let", "now", "how", "the", "this"],
	};
	const built = [
		introPhase,
		...phases.map((p) => {
			const dim = ALL_SECTIONS.filter((s) => s !== p.highlight);
			return {
				start: 0,
				end: 120,
				show: ["main", ...ALL_SECTIONS],
				dim,
				highlight: [p.highlight],
				label: p.label,
				triggerWords: p.triggerWords,
			};
		}),
	];
	return JSON.stringify({ diagram, sectionSummary, phases: built }, null, 2) + "\n";
}

function buildSvg(title: string, subtitle: string, sections: [string, string, string, string]): string {
	const rows = sections
		.map(
			(text, i) => `
  <g id="section-${i + 1}">
    <rect x="120" y="${110 + i * 95}" width="960" height="75" rx="10" fill="${["#8b5cf6", "#3b82f6", "#10b981", "#64748b"][i]}" stroke="#cbd5e1" stroke-width="2"/>
    <text x="600" y="${150 + i * 95}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="16" font-weight="600" fill="#ffffff">${text.replace(/&/g, "&amp;")}</text>
  </g>`
		)
		.join("");
	return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 520" width="1200" height="520">
  <g id="main">
    <rect width="1200" height="520" fill="#f8fafc"/>
    <text x="600" y="40" text-anchor="middle" font-family="system-ui, sans-serif" font-size="24" font-weight="600" fill="#1e293b">${title.replace(/&/g, "&amp;")}</text>
    <text x="600" y="68" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" fill="#64748b">${subtitle.replace(/&/g, "&amp;")}</text>
  </g>${rows}
</svg>
`;
}

function buildIntro(mod: ModuleDef): string {
	return `import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { SceneProps, COLORS } from '../../shared/types';

interface Module${String(mod.num).padStart(2, "0")}IntroProps extends SceneProps {}

export const Module${String(mod.num).padStart(2, "0")}Intro: React.FC<Module${String(mod.num).padStart(2, "0")}IntroProps> = ({ durationInFrames }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const openingSpring = spring({ frame, fps, config: { damping: 12, stiffness: 70 }, durationInFrames: fps * 1.5 });
	const titleSpring = spring({ frame, fps, config: { damping: 10, stiffness: 80 }, delay: fps * 2, durationInFrames: fps * 1.2 });
	const taglineSpring = spring({ frame, fps, config: { damping: 14, stiffness: 90 }, delay: fps * 3, durationInFrames: fps * 0.8 });
	const openingFadeOut = interpolate(frame, [fps * 1.8, fps * 2.5], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
	const lineSpring = spring({ frame, fps, config: { damping: 18, stiffness: 60 }, delay: fps * 2.5 });

	return (
		<div style={{ width: '100%', height: '100%', background: COLORS.dark.background, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontFamily: 'system-ui, sans-serif', position: 'relative' }}>
			<div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 1400, padding: '0 80px' }}>
				<p style={{ fontSize: 46, fontWeight: 500, margin: 0, marginBottom: 50, opacity: openingSpring * openingFadeOut, color: COLORS.dark.muted, lineHeight: 1.4 }}>
					${mod.introOpening}
				</p>
				<h1 style={{ fontSize: 110, fontWeight: 800, margin: 0, opacity: titleSpring, color: '#ffffff', letterSpacing: '-0.02em' }}>
					${mod.title}
				</h1>
				<p style={{ fontSize: 36, marginTop: 30, opacity: taglineSpring, color: COLORS.dark.muted }}>
					${mod.introTagline}
				</p>
				<div style={{ width: interpolate(lineSpring, [0, 1], [0, 200]), height: 4, background: COLORS.dark.accent, margin: '40px auto 0', borderRadius: 2 }} />
				<p style={{ fontSize: 18, marginTop: 24, opacity: interpolate(taglineSpring, [0, 1], [0, 0.6]), color: COLORS.dark.muted }}>${mod.footer}</p>
			</div>
		</div>
	);
};
`;
}

function buildDiagram(mod: ModuleDef, diagramNum: 1 | 2 | 3, section: Section, slideSuffix: string): string {
	const modPadded = String(mod.num).padStart(2, "0");
	const comp = `Module${modPadded}Diagram${diagramNum}`;
	const animName = section.svg.replace(".svg", `-${slideSuffix}.animation.json`);
	const sectionLabel = slideSuffix.charAt(0).toUpperCase() + slideSuffix.slice(1);
	return `import React from 'react';
import { BaseDiagramScene } from '../../shared/BaseDiagramScene';
import { SceneProps } from '../../shared/types';

interface ${comp}Props extends SceneProps {}

export const ${comp}: React.FC<${comp}Props> = ({ durationInFrames, cuePoints = [] }) => (
	<BaseDiagramScene
		durationInFrames={durationInFrames}
		cuePoints={cuePoints}
		title="${section.title}"
		subtitle="${section.subtitle}"
		sectionLabel="${sectionLabel}"
		svgPath="assets/${COURSE_ID}/module${modPadded}/${section.svg}"
		animationSpecPath="assets/${COURSE_ID}/module${modPadded}/${animName}"
		layout="full"
		slideName="module-${mod.num}-${slideSuffix}"
		moduleNumber={${mod.num}}
	/>
);
`;
}

function buildRecap(mod: ModuleDef): string {
	const modPadded = String(mod.num).padStart(2, "0");
	const examTerms = mod.examTerms.map((t) => `\t\t'${t.replace(/'/g, "\\'")}',`).join("\n");
	const recapPoints = mod.recapPoints.map((t) => `\t\t'${t.replace(/'/g, "\\'")}',`).join("\n");
	return `import React from 'react';
import { useCurrentFrame, useVideoConfig, spring } from 'remotion';
import { SceneProps, COLORS } from '../../shared/types';

interface Module${modPadded}RecapProps extends SceneProps {}

export const Module${modPadded}Recap: React.FC<Module${modPadded}RecapProps> = ({ durationInFrames }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const isExamSegment = durationInFrames < 1200;
	const titleSpring = spring({ frame, fps, config: { damping: 20, stiffness: 120 }, durationInFrames: fps * 0.4 });
	const examTerms = [\n${examTerms}\n\t];
	const recapPoints = [\n${recapPoints}\n\t];
	const points = isExamSegment ? examTerms : recapPoints;
	const title = isExamSegment ? 'Exam Focus' : 'Key Takeaways';
	const subtitle = isExamSegment ? 'Certification terms and scenario matching' : 'Module ${modPadded}: ${mod.title}';

	return (
		<div style={{ width: '100%', height: '100%', background: COLORS.dark.background, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 100, fontFamily: 'system-ui, sans-serif' }}>
			<h2 style={{ fontSize: 64, fontWeight: 800, margin: 0, marginBottom: 16, opacity: titleSpring, color: '#fff' }}>{title}</h2>
			<p style={{ fontSize: 24, color: COLORS.dark.muted, marginBottom: 48 }}>{subtitle}</p>
			<div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
				{points.map((point, i) => {
					const s = spring({ frame, fps, config: { damping: 20, stiffness: 120 }, delay: fps * (0.4 + i * 0.2), durationInFrames: fps * 0.5 });
					return (
						<div key={i} style={{ opacity: s, padding: '18px 24px', background: 'rgba(30,41,59,0.65)', borderRadius: 12, borderLeft: '4px solid #3b82f6' }}>
							<p style={{ margin: 0, fontSize: 28, color: '#f1f5f9', lineHeight: 1.5 }}>{point}</p>
						</div>
					);
				})}
			</div>
		</div>
	);
};
`;
}

const MODULES: ModuleDef[] = [
	{
		num: 8,
		title: "Reasoning, Planning, and Memory",
		introOpening: "In Module 02 we covered the agent loop. Now: how reasoning fails and how memory fixes it.",
		introTagline: "Reflection patterns, failure modes, and the right memory model.",
		footer: "Module 08 - Reasoning, Planning, and Memory",
		concept: {
			svg: "reasoning-reflection-cycle.svg",
			title: "Reasoning and Reflection",
			subtitle: "Task decomposition, explicit vs implicit planning, and self-correction patterns.",
			sections: ["Task Decomposition: break goals into subtasks", "Step Planning: explicit lists or implicit reasoning", "Reflection: critique, verify, refine outputs", "Hybrid: planner structure + flexible execution"],
			phases: [
				{ label: "How agents decompose tasks into steps", highlight: "section-1", triggerWords: ["decompos", "subtask", "summarize"] },
				{ label: "Explicit vs implicit step planning", highlight: "section-2", triggerWords: ["plan", "explicit", "implicit"] },
				{ label: "Reflection and self-correction patterns", highlight: "section-3", triggerWords: ["reflect", "critique", "verification"] },
				{ label: "Production hybrid: planner + flexible model", highlight: "section-4", triggerWords: ["hybrid", "production", "accuracy"] },
			],
		},
		architecture: {
			svg: "memory-failure-map.svg",
			title: "Memory Types and Failure Modes",
			subtitle: "Map each reasoning failure to the memory layer that fixes it.",
			sections: ["Working Memory: goal, steps, instructions in session", "Long-Term Memory: vector stores and structured facts", "Session Context: recent turns and loop detection", "Memory Hygiene: TTL, summarization, retrieval filters"],
			phases: [
				{ label: "Working memory fixes forgotten instructions", highlight: "section-1", triggerWords: ["working", "instruction", "forget"] },
				{ label: "Long-term memory fixes missing context", highlight: "section-2", triggerWords: ["long-term", "long", "context", "vector"] },
				{ label: "Session context helps detect looping", highlight: "section-3", triggerWords: ["session", "loop", "repetition"] },
				{ label: "Hygiene keeps retrieval useful", highlight: "section-4", triggerWords: ["hygiene", "ttl", "filter", "summar"] },
			],
		},
		application: {
			svg: "memory-implementation-patterns.svg",
			title: "Implementing Memory and Guards",
			subtitle: "Critique steps, structured state, retrieval filters, and anti-loop guards.",
			sections: ["Reflection: add critique step after major outputs", "Working State: re-inject goal and instruction every call", "Long-Term: freshness filters and citation requirements", "Anti-Loop: max steps, repeated action detection"],
			phases: [
				{ label: "Add a critique step for high-stakes outputs", highlight: "section-1", triggerWords: ["reflect", "critique", "retry"] },
				{ label: "Structured working memory state object", highlight: "section-2", triggerWords: ["working", "state", "re-inject"] },
				{ label: "Long-term retrieval with freshness and citations", highlight: "section-3", triggerWords: ["long-term", "vector", "citation", "freshness"] },
				{ label: "Anti-loop guards and max-step limits", highlight: "section-4", triggerWords: ["loop", "anti-loop", "max-step", "escalat"] },
			],
		},
		examTerms: ["task decomposition, reflection, working vs long-term memory", "match failure modes to memory fixes", "memory hygiene, TTL, anti-loop guards"],
		recapPoints: ["Reasoning fails: forgotten instructions, missing context, looping.", "Working memory, long-term retrieval, and session guards each fix a failure mode.", "Reflection patterns improve quality; hygiene keeps memory useful."],
	},
	{
		num: 9,
		title: "NVIDIA Inference Optimization",
		introOpening: "Module 03 mapped the stack. Now the levers that move latency and cost at scale.",
		introTagline: "Batching, concurrency, TensorRT, and the latency-throughput tradeoff.",
		footer: "Module 09 - NVIDIA Inference Optimization",
		concept: {
			svg: "gpu-inference-tradeoffs.svg",
			title: "GPU Inference at Agent Scale",
			subtitle: "Multiple model calls per request and the latency-cost tradeoff.",
			sections: ["Agent Load: many inference calls per user interaction", "GPU vs CPU: parallel batch-oriented compute", "Latency vs Throughput: small batches vs large batches", "Measure First: baseline before optimizing"],
			phases: [
				{ label: "Agents multiply inference calls per interaction", highlight: "section-1", triggerWords: ["calls", "interaction", "agent"] },
				{ label: "GPUs excel at parallel batched workloads", highlight: "section-2", triggerWords: ["gpu", "parallel", "batch"] },
				{ label: "Batching trades latency for throughput", highlight: "section-3", triggerWords: ["latency", "throughput", "tradeoff"] },
				{ label: "Baseline metrics before turning optimizations on", highlight: "section-4", triggerWords: ["baseline", "measure", "scale"] },
			],
		},
		architecture: {
			svg: "triton-tensorrt-stack.svg",
			title: "Triton and TensorRT in Production",
			subtitle: "Dynamic batching, concurrent serving, and compiled model graphs.",
			sections: ["Triton: request routing and GPU scheduling", "Dynamic Batching: queue requests, raise throughput", "Concurrency: multiple models or GPU instances", "TensorRT: optimized execution graph for fixed models"],
			phases: [
				{ label: "Triton manages serving mechanics", highlight: "section-1", triggerWords: ["triton", "serving", "scheduling"] },
				{ label: "Dynamic batching increases throughput", highlight: "section-2", triggerWords: ["batch", "dynamic", "throughput"] },
				{ label: "Concurrency across models and GPUs", highlight: "section-3", triggerWords: ["concurr", "multiple", "gpu"] },
				{ label: "TensorRT compiles models for lower latency", highlight: "section-4", triggerWords: ["tensorrt", "optimiz", "compil"] },
			],
		},
		application: {
			svg: "inference-optimization-guide.svg",
			title: "When to Apply Each Optimization",
			subtitle: "Choose batching, concurrency, and TensorRT based on workload goals.",
			sections: ["Batching: background and high-volume APIs", "Concurrency: multi-model or saturated GPUs", "TensorRT: latency-critical fixed models", "Compare: measure after each change"],
			phases: [
				{ label: "Batch when throughput beats latency", highlight: "section-1", triggerWords: ["batch", "throughput", "background"] },
				{ label: "Add concurrency when GPUs have headroom", highlight: "section-2", triggerWords: ["concurr", "utilization", "scale"] },
				{ label: "TensorRT for latency and cost critical paths", highlight: "section-3", triggerWords: ["tensorrt", "latency", "cost"] },
				{ label: "Measure, compare, then decide", highlight: "section-4", triggerWords: ["baseline", "compare", "measure"] },
			],
		},
		examTerms: ["batching vs latency tradeoff", "Triton dynamic batching and concurrency", "when TensorRT applies"],
		recapPoints: ["GPUs favor batched parallel inference.", "Triton batching and concurrency raise throughput; TensorRT cuts latency.", "Measure baseline, then optimize for your agent workload."],
	},
	{
		num: 10,
		title: "Knowledge Integration and RAG",
		introOpening: "Module 04 showed the pipeline. Now the retrieval layer in depth.",
		introTagline: "Ingest, embed, search, inject - and when to call tools instead.",
		footer: "Module 10 - Knowledge Integration and RAG",
		concept: {
			svg: "rag-pipeline-stages.svg",
			title: "Retrieval Pipeline End to End",
			subtitle: "Ingestion, chunking, embedding, search, and context injection.",
			sections: ["Ingestion: documents chunked with overlap and metadata", "Embedding: semantic vectors stored in a vector DB", "Search: top-k similarity, hybrid, and reranking", "Grounding: inject chunks with citations into the prompt"],
			phases: [
				{ label: "Ingest and chunk source documents", highlight: "section-1", triggerWords: ["ingest", "chunk", "metadata"] },
				{ label: "Embed chunks into vector storage", highlight: "section-2", triggerWords: ["embed", "vector", "semantic"] },
				{ label: "Search with top-k and reranking", highlight: "section-3", triggerWords: ["search", "retriev", "rerank"] },
				{ label: "Inject context and cite sources", highlight: "section-4", triggerWords: ["inject", "ground", "citation"] },
			],
		},
		architecture: {
			svg: "retrieval-vs-tools.svg",
			title: "Retrieval vs Tool Calls",
			subtitle: "Read-only knowledge search vs actions with side effects.",
			sections: ["Retrieval: search policies, docs, and knowledge bases", "Tool Calls: live data, APIs, and side effects", "Combined: retrieve context then execute via tools", "Schema Enforcement: validate inputs and structured outputs"],
			phases: [
				{ label: "Retrieval for read-only knowledge search", highlight: "section-1", triggerWords: ["retriev", "knowledge", "search"] },
				{ label: "Tools for actions and live data", highlight: "section-2", triggerWords: ["tool", "action", "api"] },
				{ label: "Use both: ground then execute", highlight: "section-3", triggerWords: ["both", "based", "process"] },
				{ label: "Enforce schemas on tool and JSON outputs", highlight: "section-4", triggerWords: ["schema", "valid", "structured"] },
			],
		},
		application: {
			svg: "rag-implementation-patterns.svg",
			title: "Building RAG from PDFs and Web",
			subtitle: "Extraction, chunk overlap, citations, validation, and retries.",
			sections: ["Extract text from PDFs and web pages", "Chunk with overlap; store source metadata", "Return citations; never invent sources", "Validate tool args; retry with timeouts"],
			phases: [
				{ label: "Extract and chunk PDF and web content", highlight: "section-1", triggerWords: ["pdf", "web", "chunk"] },
				{ label: "Embed, search, and attach metadata", highlight: "section-2", triggerWords: ["embed", "vector", "metadata"] },
				{ label: "Format prompts with verifiable citations", highlight: "section-3", triggerWords: ["citation", "source", "verify"] },
				{ label: "Validate, retry, and handle tool errors", highlight: "section-4", triggerWords: ["valid", "retry", "timeout"] },
			],
		},
		examTerms: ["ingestion through grounding pipeline", "retrieval vs tool calling", "schema enforcement and hallucination reduction"],
		recapPoints: ["Pipeline: ingest, chunk, embed, search, inject.", "Retrieval for knowledge; tools for actions; use both when needed.", "Cite sources and enforce schemas on every tool call."],
	},
	{
		num: 11,
		title: "Evaluation and Monitoring",
		introOpening: "Deployment is half the story. Once live, how do you know the agent still works?",
		introTagline: "Evaluation harnesses, telemetry, and failure diagnosis.",
		footer: "Module 11 - Evaluation and Monitoring",
		concept: {
			svg: "eval-harness-dimensions.svg",
			title: "Evaluation Harness Dimensions",
			subtitle: "Correctness, structure, grounding, and regression testing.",
			sections: ["Correctness: did the agent get the right answer?", "Structure: valid JSON and required fields", "Grounding: claims supported by context or tools", "Regression: same test set before and after changes"],
			phases: [
				{ label: "Score correctness of agent outputs", highlight: "section-1", triggerWords: ["correct", "answer", "quality"] },
				{ label: "Validate structure and schema", highlight: "section-2", triggerWords: ["structure", "json", "schema"] },
				{ label: "Check grounding against retrieved context", highlight: "section-3", triggerWords: ["ground", "hallucin", "citation"] },
				{ label: "Block releases that regress scores", highlight: "section-4", triggerWords: ["regression", "ci", "deploy"] },
			],
		},
		architecture: {
			svg: "production-monitoring-stack.svg",
			title: "Production Monitoring Stack",
			subtitle: "Latency, cost, stability, and distributed tracing.",
			sections: ["Latency: p50, p95, p99 per request", "Cost: token usage and budget alerts", "Stability: detect output drift on same inputs", "Tracing: follow each plan, tool, and observation step"],
			phases: [
				{ label: "Track latency percentiles end to end", highlight: "section-1", triggerWords: ["latency", "p95", "p99"] },
				{ label: "Log token cost per request and user", highlight: "section-2", triggerWords: ["cost", "token", "budget"] },
				{ label: "Detect output stability drift", highlight: "section-3", triggerWords: ["stability", "drift", "output"] },
				{ label: "Trace IDs through the agent loop", highlight: "section-4", triggerWords: ["trace", "telemetry", "step"] },
			],
		},
		application: {
			svg: "eval-monitoring-practice.svg",
			title: "Implementing Eval and Observability",
			subtitle: "Automated harnesses, dashboards, alerts, and trace-based diagnosis.",
			sections: ["Harness: test set with automated scoring in CI", "Metrics: dashboards for latency, errors, steps", "Alerts: spikes in latency, errors, or cost", "Diagnosis: traces show where the loop broke"],
			phases: [
				{ label: "Build automated evaluation in CI", highlight: "section-1", triggerWords: ["harness", "test", "automate"] },
				{ label: "Emit metrics to dashboards", highlight: "section-2", triggerWords: ["monitor", "dashboard", "metric"] },
				{ label: "Alert on latency and error spikes", highlight: "section-3", triggerWords: ["alert", "spike", "threshold"] },
				{ label: "Diagnose failures with traces", highlight: "section-4", triggerWords: ["diagnos", "trace", "fail"] },
			],
		},
		examTerms: ["eval dimensions: correctness, structure, grounding", "latency, cost, tracing in production", "detecting hallucinations and regressions"],
		recapPoints: ["Automate eval harnesses and run them in CI.", "Monitor latency, cost, and stability with traces.", "Design observability before you need to debug production."],
	},
	{
		num: 12,
		title: "Safety and Guardrails",
		introOpening: "Autonomous agents can act wrongly. Safety is load-bearing for production.",
		introTagline: "Prompt injection, misuse, human approval, and audit trails.",
		footer: "Module 12 - Safety and Guardrails",
		concept: {
			svg: "agent-threat-model.svg",
			title: "Agent Threat Model",
			subtitle: "Prompt injection, misuse, and why human oversight is the backstop.",
			sections: ["Prompt Injection: malicious instructions in user input", "Misuse: harmful outputs and unauthorized tool use", "Human Oversight: approve high-stakes actions", "Defense: sanitize input, filter output, enforce policy"],
			phases: [
				{ label: "Prompt injection manipulates agent behavior", highlight: "section-1", triggerWords: ["injection", "ignore", "manipul"] },
				{ label: "Misuse and harmful agent actions", highlight: "section-2", triggerWords: ["misuse", "harmful", "abuse"] },
				{ label: "Human oversight for high-stakes decisions", highlight: "section-3", triggerWords: ["human", "oversight", "approval"] },
				{ label: "Layer defenses at input and output", highlight: "section-4", triggerWords: ["defense", "filter", "sanitiz"] },
			],
		},
		architecture: {
			svg: "safety-guardrails-architecture.svg",
			title: "Safety Architecture Patterns",
			subtitle: "Approval gates, policy filters, audit logs, and transparency.",
			sections: ["Human-in-the-Loop: pause and approve risky actions", "Safety Filter: block harmful or non-compliant output", "Audit Trail: immutable log of actions and approvals", "Transparency: disclose AI use and cite sources"],
			phases: [
				{ label: "Approval workflow for sensitive actions", highlight: "section-1", triggerWords: ["human-in-the-loop", "approval", "escalat"] },
				{ label: "Output safety policy filter", highlight: "section-2", triggerWords: ["filter", "policy", "harmful"] },
				{ label: "Append-only audit trail", highlight: "section-3", triggerWords: ["audit", "log", "compliance"] },
				{ label: "Transparency and traceability to users", highlight: "section-4", triggerWords: ["transparen", "traceabil", "disclose"] },
			],
		},
		application: {
			svg: "compliance-design-patterns.svg",
			title: "Designing for Compliance",
			subtitle: "Industry requirements, data handling, privacy, and approval workflows.",
			sections: ["Identify regulatory requirements for your industry", "Data handling: masking, authorization, retention", "Map high-stakes decisions to approval paths", "Privacy: consent, opt-out, and deletion"],
			phases: [
				{ label: "Map industry compliance requirements", highlight: "section-1", triggerWords: ["compliance", "hipaa", "gdpr", "regulat"] },
				{ label: "Control sensitive data flows", highlight: "section-2", triggerWords: ["data", "mask", "retention"] },
				{ label: "Approval paths for high-stakes actions", highlight: "section-3", triggerWords: ["approval", "escalat", "stake"] },
				{ label: "Privacy practices users can trust", highlight: "section-4", triggerWords: ["privacy", "consent", "deletion"] },
			],
		},
		examTerms: ["prompt injection defenses", "human-in-the-loop and audit trails", "compliance and transparency requirements"],
		recapPoints: ["Defend against injection and misuse at input and output.", "Gate risky actions with human approval and audit logs.", "Build safety and transparency in from day one."],
	},
];

function scaffoldModule(mod: ModuleDef) {
	const modPadded = String(mod.num).padStart(2, "0");
	const sceneDir = path.join(COURSE, "course", "remotion", "scenes", `module${modPadded}`);
	const svgDir = path.join(COURSE, "course", "diagrams", "svg", `module${modPadded}`);
	fs.mkdirSync(sceneDir, { recursive: true });
	fs.mkdirSync(svgDir, { recursive: true });

	const sections: Array<{ key: "concept" | "architecture" | "application"; data: Section }> = [
		{ key: "concept", data: mod.concept },
		{ key: "architecture", data: mod.architecture },
		{ key: "application", data: mod.application },
	];

	for (const { key, data } of sections) {
		fs.writeFileSync(path.join(svgDir, data.svg), buildSvg(data.title, data.subtitle, data.sections));
		fs.writeFileSync(
			path.join(svgDir, data.svg.replace(".svg", `-${key}.animation.json`)),
			buildAnimationSpec(data.svg, data.subtitle, data.phases)
		);
	}

	fs.writeFileSync(path.join(sceneDir, `Module${modPadded}Intro.tsx`), buildIntro(mod));
	fs.writeFileSync(path.join(sceneDir, `Module${modPadded}Diagram1.tsx`), buildDiagram(mod, 1, mod.concept, "concept"));
	fs.writeFileSync(path.join(sceneDir, `Module${modPadded}Diagram2.tsx`), buildDiagram(mod, 2, mod.architecture, "architecture"));
	fs.writeFileSync(path.join(sceneDir, `Module${modPadded}Diagram3.tsx`), buildDiagram(mod, 3, mod.application, "application"));
	fs.writeFileSync(path.join(sceneDir, `Module${modPadded}Recap.tsx`), buildRecap(mod));
	fs.writeFileSync(
		path.join(sceneDir, "index.ts"),
		`// Module ${modPadded}: ${mod.title} - Scene exports
export { Module${modPadded}Intro } from './Module${modPadded}Intro';
export { Module${modPadded}Diagram1 } from './Module${modPadded}Diagram1';
export { Module${modPadded}Diagram2 } from './Module${modPadded}Diagram2';
export { Module${modPadded}Diagram3 } from './Module${modPadded}Diagram3';
export { Module${modPadded}Recap } from './Module${modPadded}Recap';
`
	);

	console.log(`  Scaffolded module ${mod.num}: ${mod.title}`);
}

for (const mod of MODULES) {
	scaffoldModule(mod);
}

console.log("\nDone. Next:");
console.log("  npx tsx scripts/copySvgsToPublic.ts agentic-ai-for-beginners");
console.log("  npx tsx scripts/generateModulesFromScenes.ts agentic-ai-for-beginners 8-12");
