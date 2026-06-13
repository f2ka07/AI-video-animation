/**
 * Replace scaffolded stacked-bar SVGs (modules 8-12) with richer layouts
 * and larger typography. Group IDs unchanged: main, section-1..4.
 */
import * as fs from "fs";
import * as path from "path";

const ROOT = path.join(__dirname, "..", "courses", "agentic-ai-for-beginners", "course", "diagrams", "svg");

const ARROW = `<marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6"/></marker>`;

function wrap(title: string, body: string, sections: string, footer = ""): string {
	return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 720" width="1200" height="720">
  <defs>${ARROW}</defs>
  <g id="main">
    <rect width="1200" height="720" fill="#f8fafc"/>
    ${footer ? `<text x="600" y="700" text-anchor="middle" font-family="system-ui,sans-serif" font-size="16" fill="#94a3b8">${footer}</text>` : ""}
  </g>
  ${sections}
</svg>
`;
}

function card(
	id: string,
	x: number,
	y: number,
	w: number,
	h: number,
	fill: string,
	stroke: string,
	title: string,
	body: string,
	titleSize = 24
): string {
	const lines = body.split("|");
	const bodyY = y + 52;
	return `<g id="${id}">
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="${fill}" stroke="${stroke}" stroke-width="3"/>
    <text x="${x + w / 2}" y="${y + 36}" text-anchor="middle" font-family="system-ui,sans-serif" font-size="${titleSize}" font-weight="700" fill="${fill === "#ffffff" || fill.startsWith("#f") ? "#1e293b" : "#ffffff"}">${title}</text>
    ${lines.map((line, i) => `<text x="${x + w / 2}" y="${bodyY + i * 26}" text-anchor="middle" font-family="system-ui,sans-serif" font-size="18" fill="${fill === "#ffffff" ? "#475569" : fill.startsWith("#f") ? "#64748b" : "#e2e8f0"}">${line}</text>`).join("\n    ")}
  </g>`;
}

const DIAGRAMS: Record<string, string> = {};

// --- Module 8 ---
DIAGRAMS["module08/reasoning-reflection-cycle.svg"] = wrap(
	"",
	"",
	`
  ${card("section-1", 80, 120, 240, 200, "#8b5cf6", "#7c3aed", "Decompose", "Break goals into|ordered subtasks", 26)}
  <line x1="320" y1="220" x2="380" y2="220" stroke="#3b82f6" stroke-width="3" marker-end="url(#arrow)"/>
  ${card("section-2", 380, 120, 240, 200, "#3b82f6", "#2563eb", "Plan", "Explicit lists or|implicit reasoning", 26)}
  <line x1="620" y1="220" x2="680" y2="220" stroke="#3b82f6" stroke-width="3" marker-end="url(#arrow)"/>
  ${card("section-3", 680, 120, 240, 200, "#10b981", "#059669", "Reflect", "Critique, verify,|refine output", 26)}
  <path d="M920 320 C 960 420, 760 480, 600 520 C 440 480, 240 420, 200 320" fill="none" stroke="#64748b" stroke-width="3" stroke-dasharray="8,6"/>
  <polygon points="210,318 200,300 220,308" fill="#64748b"/>
  ${card("section-4", 420, 480, 360, 180, "#f1f5f9", "#64748b", "Hybrid Production Loop", "Planner structure +|flexible model execution", 24)}
  <text x="600" y="90" text-anchor="middle" font-family="system-ui,sans-serif" font-size="20" font-weight="600" fill="#64748b">Reasoning cycle: decompose, plan, act, reflect</text>
`,
	"Robust agents loop until quality threshold is met"
);

DIAGRAMS["module08/memory-failure-map.svg"] = wrap(
	"",
	"",
	`
  <text x="600" y="90" text-anchor="middle" font-family="system-ui,sans-serif" font-size="20" font-weight="600" fill="#64748b">Match each failure mode to the memory layer that fixes it</text>
  ${card("section-1", 60, 130, 520, 240, "#ede9fe", "#8b5cf6", "Forgotten instruction", "Symptom: original goal lost|after several tool calls|Fix: Working memory", 22)}
  ${card("section-2", 620, 130, 520, 240, "#dbeafe", "#3b82f6", "Missing context", "Symptom: cannot answer|without prior session facts|Fix: Long-term memory", 22)}
  ${card("section-3", 60, 400, 520, 240, "#d1fae5", "#10b981", "Looping reasoning", "Symptom: same action repeats|with no progress|Fix: Session context", 22)}
  ${card("section-4", 620, 400, 520, 240, "#fef3c7", "#f59e0b", "Noisy retrieval", "Symptom: irrelevant chunks|pollute the prompt|Fix: Memory hygiene", 22)}
`,
	"Design memory for the failures you expect in production"
);

DIAGRAMS["module08/memory-implementation-patterns.svg"] = wrap(
	"",
	"",
	`
  <text x="600" y="90" text-anchor="middle" font-family="system-ui,sans-serif" font-size="20" font-weight="600" fill="#64748b">Implementation patterns for production agent memory</text>
  ${card("section-1", 100, 140, 450, 220, "#8b5cf6", "#7c3aed", "Reflection step", "Critic reviews output|Retry with feedback|Use on high-stakes answers", 24)}
  <line x1="550" y1="250" x2="650" y2="250" stroke="#3b82f6" stroke-width="3" marker-end="url(#arrow)"/>
  ${card("section-2", 650, 140, 450, 220, "#3b82f6", "#2563eb", "Working state", "Structured goal + steps|Re-inject every model call|Never assume recall", 24)}
  <line x1="875" y1="360" x2="875" y2="420" stroke="#3b82f6" stroke-width="3" marker-end="url(#arrow)"/>
  <line x1="325" y1="360" x2="325" y2="420" stroke="#3b82f6" stroke-width="3" marker-end="url(#arrow)"/>
  ${card("section-3", 100, 420, 450, 220, "#10b981", "#059669", "Long-term store", "Vector DB or facts DB|Freshness + citation rules|Ground every claim", 24)}
  <line x1="550" y1="530" x2="650" y2="530" stroke="#3b82f6" stroke-width="3" marker-end="url(#arrow)"/>
  ${card("section-4", 650, 420, 450, 220, "#ef4444", "#dc2626", "Anti-loop guards", "Detect repeated tools|Max-step limits|Escalate to human", 24)}
`,
	"Latency vs quality: reflection trades speed for accuracy"
);

// --- Module 9 ---
DIAGRAMS["module09/gpu-inference-tradeoffs.svg"] = wrap(
	"",
	"",
	`
  <text x="600" y="90" text-anchor="middle" font-family="system-ui,sans-serif" font-size="20" font-weight="600" fill="#64748b">Agents multiply inference calls - GPUs favor parallel batches</text>
  ${card("section-1", 80, 140, 320, 480, "#ede9fe", "#8b5cf6", "Agent load", "5-20 model calls|per user turn|Latency stacks fast", 26)}
  <polygon points="600,180 780,520 420,520" fill="none" stroke="#cbd5e1" stroke-width="4"/>
  <text x="600" y="360" text-anchor="middle" font-family="system-ui,sans-serif" font-size="22" font-weight="700" fill="#1e293b">Tradeoff</text>
  ${card("section-2", 460, 140, 280, 200, "#3b82f6", "#2563eb", "Low latency", "Small batches|Real-time chat|Every ms counts", 22)}
  ${card("section-3", 460, 380, 280, 200, "#10b981", "#059669", "High throughput", "Large batches|Background jobs|Cost per token", 22)}
  ${card("section-4", 800, 260, 320, 240, "#f1f5f9", "#64748b", "Measure first", "Baseline p50/p95|Token cost per request|Then optimize", 24)}
`,
	"Right batch size depends on workload - not one global answer"
);

DIAGRAMS["module09/triton-tensorrt-stack.svg"] = wrap(
	"",
	"",
	`
  <text x="600" y="90" text-anchor="middle" font-family="system-ui,sans-serif" font-size="20" font-weight="600" fill="#64748b">Serving layer on top of optimized model graphs</text>
  ${card("section-1", 350, 120, 500, 110, "#64748b", "#475569", "Incoming requests", "Variable arrival rate from agent loops", 22)}
  <line x1="600" y1="230" x2="600" y2="260" stroke="#3b82f6" stroke-width="3" marker-end="url(#arrow)"/>
  ${card("section-2", 200, 260, 380, 150, "#3b82f6", "#2563eb", "Triton batching", "Dynamic batch queue|2-5x throughput|Adds wait latency", 22)}
  ${card("section-3", 620, 260, 380, 150, "#06b6d4", "#0891b2", "Concurrency", "Multi-model on GPU|Scale across devices|Watch memory limits", 22)}
  <line x1="600" y1="410" x2="600" y2="440" stroke="#3b82f6" stroke-width="3" marker-end="url(#arrow)"/>
  ${card("section-4", 250, 440, 700, 200, "#10b981", "#059669", "TensorRT engine", "Compiled execution graph|20-40% lower latency|One-time compile cost", 26)}
`,
	"Triton serves - TensorRT optimizes the graph underneath"
);

DIAGRAMS["module09/inference-optimization-guide.svg"] = wrap(
	"",
	"",
	`
  <text x="600" y="90" text-anchor="middle" font-family="system-ui,sans-serif" font-size="20" font-weight="600" fill="#64748b">Choose optimizations based on workload goals</text>
  ${card("section-1", 40, 140, 360, 500, "#dbeafe", "#3b82f6", "Use batching when", "Throughput beats latency|High-volume APIs|Research pipelines", 24)}
  ${card("section-2", 420, 140, 360, 500, "#d1fae5", "#10b981", "Use concurrency when", "Multiple models active|GPU under 80% util|Many parallel users", 24)}
  ${card("section-3", 800, 140, 360, 500, "#ede9fe", "#8b5cf6", "Use TensorRT when", "Latency-critical path|Fixed production model|Cost per token matters", 24)}
  ${card("section-4", 300, 580, 600, 100, "#f1f5f9", "#94a3b8", "Always compare against baseline after each change", "", 20)}
`,
	"Turn one knob at a time - measure, compare, keep or revert"
);

// --- Module 10 ---
DIAGRAMS["module10/rag-pipeline-stages.svg"] = wrap(
	"",
	"",
	`
  <text x="600" y="90" text-anchor="middle" font-family="system-ui,sans-serif" font-size="20" font-weight="600" fill="#64748b">End-to-end retrieval pipeline for grounding agent responses</text>
  ${card("section-1", 40, 200, 250, 360, "#e2e8f0", "#94a3b8", "Ingest", "PDF / web extract|Chunk + overlap|Attach metadata", 24)}
  <line x1="290" y1="380" x2="320" y2="380" stroke="#3b82f6" stroke-width="3" marker-end="url(#arrow)"/>
  ${card("section-2", 320, 200, 250, 360, "#8b5cf6", "#7c3aed", "Embed", "Semantic vectors|Store in vector DB|Similar meaning clusters", 24)}
  <line x1="570" y1="380" x2="600" y2="380" stroke="#3b82f6" stroke-width="3" marker-end="url(#arrow)"/>
  ${card("section-3", 600, 200, 250, 360, "#3b82f6", "#2563eb", "Search", "Top-k similarity|Hybrid + rerank|Return best chunks", 24)}
  <line x1="850" y1="380" x2="880" y2="380" stroke="#3b82f6" stroke-width="3" marker-end="url(#arrow)"/>
  ${card("section-4", 880, 200, 280, 360, "#10b981", "#059669", "Inject", "Format for prompt|Cite every source|Reduce hallucination", 24)}
`,
	"Quality tunables: chunk size, top-k, reranker, freshness filters"
);

DIAGRAMS["module10/retrieval-vs-tools.svg"] = wrap(
	"",
	"",
	`
  <text x="600" y="90" text-anchor="middle" font-family="system-ui,sans-serif" font-size="20" font-weight="600" fill="#64748b">Two ways agents connect to external knowledge and systems</text>
  ${card("section-1", 60, 150, 500, 480, "#dbeafe", "#3b82f6", "Retrieval (read)", "Search knowledge bases|Semantic + keyword|No side effects", 26)}
  ${card("section-2", 640, 150, 500, 480, "#fef3c7", "#f59e0b", "Tool calls (act)", "Live APIs and SQL|Defined schemas|Can change state", 26)}
  <rect x="420" y="300" width="360" height="180" rx="20" fill="#f1f5f9" stroke="#64748b" stroke-width="3" stroke-dasharray="6,4"/>
  <g id="section-3">
    <text x="600" y="360" text-anchor="middle" font-family="system-ui,sans-serif" font-size="24" font-weight="700" fill="#1e293b">Often both</text>
    <text x="600" y="400" text-anchor="middle" font-family="system-ui,sans-serif" font-size="18" fill="#475569">Retrieve policy context</text>
    <text x="600" y="430" text-anchor="middle" font-family="system-ui,sans-serif" font-size="18" fill="#475569">then call refund API</text>
  </g>
  <g id="section-4">
    <rect x="200" y="560" width="800" height="120" rx="14" fill="#ede9fe" stroke="#8b5cf6" stroke-width="3"/>
    <text x="600" y="610" text-anchor="middle" font-family="system-ui,sans-serif" font-size="22" font-weight="700" fill="#6d28d9">Schema enforcement</text>
    <text x="600" y="645" text-anchor="middle" font-family="system-ui,sans-serif" font-size="18" fill="#7c3aed">Validate tool args and JSON outputs - reject hallucinated fields</text>
  </g>
`,
	"Retrieval grounds reasoning; tools execute with validated inputs"
);

DIAGRAMS["module10/rag-implementation-patterns.svg"] = wrap(
	"",
	"",
	`
  <text x="600" y="90" text-anchor="middle" font-family="system-ui,sans-serif" font-size="20" font-weight="600" fill="#64748b">From raw documents to cited, grounded answers</text>
  ${card("section-1", 80, 160, 300, 200, "#e2e8f0", "#94a3b8", "Extract", "PDF + web readers|Strip boilerplate|Preserve structure", 22)}
  <line x1="380" y1="260" x2="420" y2="260" stroke="#3b82f6" stroke-width="3" marker-end="url(#arrow)"/>
  ${card("section-2", 420, 160, 300, 200, "#8b5cf6", "#7c3aed", "Chunk + embed", "512 tokens + overlap|Store source metadata|Index in vector DB", 22)}
  <line x1="720" y1="260" x2="760" y2="260" stroke="#3b82f6" stroke-width="3" marker-end="url(#arrow)"/>
  ${card("section-3", 760, 160, 360, 200, "#3b82f6", "#2563eb", "Retrieve + cite", "Top-k with rerank|Format with sources|Never invent citations", 22)}
  <line x1="940" y1="360" x2="940" y2="400" stroke="#3b82f6" stroke-width="3" marker-end="url(#arrow)"/>
  ${card("section-4", 300, 400, 600, 240, "#10b981", "#059669", "Validate + retry", "Schema-check tool calls|Timeouts on external APIs|Idempotent actions", 24)}
`,
	"Ground every factual claim in retrieved or tool-returned data"
);

// --- Module 11 ---
DIAGRAMS["module11/eval-harness-dimensions.svg"] = wrap(
	"",
	"",
	`
  <text x="600" y="90" text-anchor="middle" font-family="system-ui,sans-serif" font-size="20" font-weight="600" fill="#64748b">Four dimensions every agent eval harness should score</text>
  ${card("section-1", 80, 140, 500, 250, "#dbeafe", "#3b82f6", "Correctness", "Right answer for the task|Model-as-judge or rules|Block bad deploys", 26)}
  ${card("section-2", 620, 140, 500, 250, "#ede9fe", "#8b5cf6", "Structure", "Valid JSON / schema|Required fields present|Parse failures fail CI", 26)}
  ${card("section-3", 80, 420, 500, 250, "#d1fae5", "#10b981", "Grounding", "Claims in retrieved context|Citation verification|Catch hallucinations", 26)}
  ${card("section-4", 620, 420, 500, 250, "#fef3c7", "#f59e0b", "Regression", "Same test set every release|Compare before vs after|Fail build on drop", 26)}
`,
	"Automate eval in CI - agents drift without continuous measurement"
);

DIAGRAMS["module11/production-monitoring-stack.svg"] = wrap(
	"",
	"",
	`
  <text x="600" y="90" text-anchor="middle" font-family="system-ui,sans-serif" font-size="20" font-weight="600" fill="#64748b">Production signals for agentic workloads</text>
  ${card("section-1", 60, 150, 520, 220, "#3b82f6", "#2563eb", "Latency", "p50 / p95 / p99|Variable step count|Alert on spikes", 26)}
  ${card("section-2", 620, 150, 520, 220, "#f59e0b", "#d97706", "Cost", "Tokens per request|Budget thresholds|Loop-driven overruns", 26)}
  ${card("section-3", 60, 400, 520, 220, "#10b981", "#059669", "Stability", "Same input - same output?|Detect config drift|Model update impact", 26)}
  ${card("section-4", 620, 400, 520, 220, "#8b5cf6", "#7c3aed", "Tracing", "Trace ID per request|Plan, tool, observe steps|Reconstruct failures", 26)}
  <rect x="200" y="640" width="800" height="50" rx="10" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="2"/>
  <text x="600" y="672" text-anchor="middle" font-family="system-ui,sans-serif" font-size="18" fill="#475569">Dashboard + alerts: latency spike, error rate, cost overrun</text>
`,
	"Observability is not optional for multi-step agents"
);

DIAGRAMS["module11/eval-monitoring-practice.svg"] = wrap(
	"",
	"",
	`
  <text x="600" y="90" text-anchor="middle" font-family="system-ui,sans-serif" font-size="20" font-weight="600" fill="#64748b">Operational playbook for eval and observability</text>
  ${card("section-1", 100, 180, 240, 400, "#8b5cf6", "#7c3aed", "Harness", "Curated test cases|Auto-score each dimension|Run on every PR", 24)}
  <line x1="340" y1="380" x2="400" y2="380" stroke="#3b82f6" stroke-width="3" marker-end="url(#arrow)"/>
  ${card("section-2", 400, 180, 240, 400, "#3b82f6", "#2563eb", "Metrics", "Emit to Prometheus|Steps per request|Tool error rate", 24)}
  <line x1="640" y1="380" x2="700" y2="380" stroke="#3b82f6" stroke-width="3" marker-end="url(#arrow)"/>
  ${card("section-3", 700, 180, 240, 400, "#f59e0b", "#d97706", "Alerts", "p95 latency breach|Cost budget exceeded|Error rate jump", 24)}
  <line x1="940" y1="380" x2="1000" y2="380" stroke="#3b82f6" stroke-width="3" marker-end="url(#arrow)"/>
  ${card("section-4", 860, 180, 280, 400, "#10b981", "#059669", "Diagnose", "Follow trace to root cause|Which step failed?|Fix that layer", 24)}
`,
	"When users report a bad answer, traces show exactly where it broke"
);

// --- Module 12 ---
DIAGRAMS["module12/agent-threat-model.svg"] = wrap(
	"",
	"",
	`
  <text x="600" y="90" text-anchor="middle" font-family="system-ui,sans-serif" font-size="20" font-weight="600" fill="#64748b">Threats to autonomous agents in production</text>
  ${card("section-1", 100, 200, 320, 380, "#fecaca", "#ef4444", "Prompt injection", "Malicious instructions|hidden in user input|Treat input as data only", 24)}
  ${card("section-2", 440, 200, 320, 380, "#fed7aa", "#f97316", "Misuse", "Harmful outputs|Unauthorized tools|Rate limits + policy", 24)}
  ${card("section-3", 780, 200, 320, 380, "#dbeafe", "#3b82f6", "Human oversight", "Approve high-stakes acts|Escalation workflows|Accountability", 24)}
  <rect x="250" y="560" width="700" height="120" rx="16" fill="#f1f5f9" stroke="#64748b" stroke-width="3"/>
  <g id="section-4">
    <text x="600" y="610" text-anchor="middle" font-family="system-ui,sans-serif" font-size="24" font-weight="700" fill="#1e293b">Defense in depth</text>
    <text x="600" y="650" text-anchor="middle" font-family="system-ui,sans-serif" font-size="18" fill="#475569">Sanitize input, filter output, separate system prompts from user content</text>
  </g>
`,
	"Safety is load-bearing - not a launch-week afterthought"
);

DIAGRAMS["module12/safety-guardrails-architecture.svg"] = wrap(
	"",
	"",
	`
  <text x="600" y="90" text-anchor="middle" font-family="system-ui,sans-serif" font-size="20" font-weight="600" fill="#64748b">Safety layers around the agent control loop</text>
  <rect x="80" y="200" width="160" height="320" rx="12" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2"/>
  <text x="160" y="360" text-anchor="middle" font-family="system-ui,sans-serif" font-size="20" font-weight="600" fill="#475569">User</text>
  <line x1="240" y1="360" x2="300" y2="360" stroke="#3b82f6" stroke-width="3" marker-end="url(#arrow)"/>
  ${card("section-1", 300, 260, 220, 200, "#dbeafe", "#3b82f6", "HITL gate", "Pause risky actions|Human approves|Sync or async queue", 22)}
  <line x1="520" y1="360" x2="580" y2="360" stroke="#3b82f6" stroke-width="3" marker-end="url(#arrow)"/>
  <rect x="580" y="220" width="200" height="280" rx="16" fill="#8b5cf6" stroke="#7c3aed" stroke-width="3"/>
  <text x="680" y="300" text-anchor="middle" font-family="system-ui,sans-serif" font-size="22" font-weight="700" fill="#fff">Agent</text>
  <text x="680" y="340" text-anchor="middle" font-family="system-ui,sans-serif" font-size="17" fill="#e9d5ff">Plan / act / observe</text>
  <line x1="780" y1="360" x2="840" y2="360" stroke="#3b82f6" stroke-width="3" marker-end="url(#arrow)"/>
  ${card("section-2", 840, 260, 220, 200, "#fecaca", "#ef4444", "Safety filter", "Block harmful output|PII redaction|Policy check", 22)}
  <line x1="950" y1="460" x2="950" y2="500" stroke="#3b82f6" stroke-width="3" marker-end="url(#arrow)"/>
  ${card("section-3", 300, 500, 360, 160, "#fef3c7", "#f59e0b", "Audit trail", "Immutable action log|Who approved what|Compliance evidence", 22)}
  ${card("section-4", 700, 500, 360, 160, "#d1fae5", "#10b981", "Transparency", "Disclose AI involvement|Show sources used|Build user trust", 22)}
`,
	"Nothing high-stakes executes without a logged approval path"
);

DIAGRAMS["module12/compliance-design-patterns.svg"] = wrap(
	"",
	"",
	`
  <text x="600" y="90" text-anchor="middle" font-family="system-ui,sans-serif" font-size="20" font-weight="600" fill="#64748b">Design agents for regulated enterprise environments</text>
  ${card("section-1", 80, 140, 500, 250, "#dbeafe", "#3b82f6", "Regulatory map", "HIPAA, GDPR, SOX|Industry-specific rules|Data residency", 24)}
  ${card("section-2", 620, 140, 500, 250, "#ede9fe", "#8b5cf6", "Data handling", "Mask sensitive fields|Authorized models only|Retention policy", 24)}
  ${card("section-3", 80, 420, 500, 250, "#d1fae5", "#10b981", "Approval paths", "High-stakes routing|Escalation SLAs|Train reviewers", 24)}
  ${card("section-4", 620, 420, 500, 250, "#fef3c7", "#f59e0b", "Privacy", "Clear consent|Opt-out flows|Honor deletion", 24)}
`,
	"Compliance is architecture - not a checklist after launch"
);

for (const [rel, content] of Object.entries(DIAGRAMS)) {
	const out = path.join(ROOT, rel);
	fs.mkdirSync(path.dirname(out), { recursive: true });
	fs.writeFileSync(out, content);
	console.log(`  Redesigned ${rel}`);
}

console.log(`\nDone: ${Object.keys(DIAGRAMS).length} diagrams. Run copySvgsToPublic next.`);
