import type { VisualResult } from "./premiumVisualArchetypes";
import {
	arrow,
	comparePanels,
	fourStepFlow,
	guardrailBar,
	labWorkspace,
	panel,
	panelBox,
	recapPathLabeled,
	compactHeader,
} from "./course4VisualHelpers";

export const MODULE05_COURSE4_VISUALS: Record<string, () => VisualResult> = {
	"ai-capstone-intro": () =>
		panel(
			"Capstone: AI Network Assistant",
			`
    ${compactHeader("CAPSTONE", "One realistic operator session")}
    <g id="viz-m1"><rect x="48" y="110" width="150" height="56" rx="10" fill="#081827" stroke="#a78bfa" stroke-width="2"/>
      <text x="123" y="144" fill="#a78bfa" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" font-weight="700" text-anchor="middle">Governed draft</text></g>
    <g id="viz-m2"><rect x="210" y="110" width="150" height="56" rx="10" fill="#081827" stroke="#12b5e5" stroke-width="2"/>
      <text x="285" y="144" fill="#12b5e5" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" font-weight="700" text-anchor="middle">MCP query</text></g>
    <g id="viz-m3"><rect x="372" y="110" width="150" height="56" rx="10" fill="#081827" stroke="#6CC04A" stroke-width="2"/>
      <text x="447" y="144" fill="#6CC04A" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" font-weight="700" text-anchor="middle">Human approve</text></g>
    <g id="viz-m4"><rect x="534" y="110" width="150" height="56" rx="10" fill="#081827" stroke="#f59e0b" stroke-width="2"/>
      <text x="609" y="144" fill="#f59e0b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" font-weight="700" text-anchor="middle">Benchmark score</text></g>
    ${guardrailBar("Nothing new to install", "Run six steps in order")}`,
			["viz-m1", "viz-m2", "viz-m3", "viz-m4", "viz-guardrail"]
		),

	"capstone-integrates-four-modules": () =>
		panel(
			"What the Capstone Integrates",
			`
    ${compactHeader("INTEGRATE", "M1-M4 in one pipeline")}
    ${arrow(120, 200, 560, 200, "viz-flow")}
    <g id="viz-code"><rect x="60" y="170" width="110" height="60" rx="10" fill="#081827" stroke="#a78bfa" stroke-width="2"/>
      <text x="115" y="205" fill="#a78bfa" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" font-weight="700" text-anchor="middle">Reviewed code</text></g>
    <g id="viz-mcp"><rect x="190" y="170" width="110" height="60" rx="10" fill="#081827" stroke="#12b5e5" stroke-width="2"/>
      <text x="245" y="205" fill="#12b5e5" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" font-weight="700" text-anchor="middle">MCP data</text></g>
    <g id="viz-agent"><rect x="320" y="170" width="110" height="60" rx="10" fill="#081827" stroke="#6CC04A" stroke-width="2"/>
      <text x="375" y="205" fill="#6CC04A" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" font-weight="700" text-anchor="middle">Agent query</text></g>
    <g id="viz-eval"><rect x="450" y="170" width="110" height="60" rx="10" fill="#081827" stroke="#f59e0b" stroke-width="2"/>
      <text x="505" y="205" fill="#f59e0b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" font-weight="700" text-anchor="middle">Measure</text></g>
    <g id="viz-cap"><rect x="570" y="170" width="90" height="60" rx="10" fill="#112115" stroke="#6CC04A" stroke-width="2"/>
      <text x="615" y="205" fill="#6CC04A" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" font-weight="700" text-anchor="middle">Evidence</text></g>`,
			["viz-code", "viz-mcp", "viz-agent", "viz-eval", "viz-cap"]
		),

	"capstone-lab-layout": () =>
		panel(
			"Capstone Lab Layout",
			`
    ${compactHeader("LAYOUT", "Know where artifacts live")}
    ${panelBox("viz-tree", 80, 100, 560, 200, "netops_ai_lab/", "#12b5e5",
			`<text x="120" y="140" fill="#9fb3c8" font-family="monospace" font-size="10">prompts/ generated/ reviews/</text>
      <text x="120" y="162" fill="#9fb3c8" font-family="monospace" font-size="10">mcp/server.py  agent/agent.py</text>
      <text x="120" y="184" fill="#9fb3c8" font-family="monospace" font-size="10">benchmarks/golden_qa.jsonl</text>
      <text x="120" y="206" fill="#9fb3c8" font-family="monospace" font-size="10">../netops_iac_lab/intended/</text>
      <text x="120" y="244" fill="#64748b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" text-anchor="middle">Fix owning module if a gate fails</text>`)}`,
			["viz-tree"]
		),

	"assistant-vs-chatbot": () =>
		comparePanels(
			"Assistant vs Raw Chatbot",
			{
				id: "viz-assistant",
				title: "Network assistant",
				accent: "#6CC04A",
				fill: "#112115",
				lines: ["MCP tool calls logged", "Benchmark threshold", "Human approval", "Auditable trail"],
			},
			{
				id: "viz-chatbot",
				title: "Raw chatbot",
				accent: "#64748b",
				fill: "#1a1215",
				lines: ["Guesses from training", "No tool audit", "No approval gate", "Hallucination risk"],
			}
		),

	"six-steps-ai-capstone-runbook": () =>
		fourStepFlow(
			"Six Steps in Order",
			[
				{ id: "viz-s1", label: "Start stack", accent: "#a78bfa" },
				{ id: "viz-s2", label: "Baseline", accent: "#12b5e5" },
				{ id: "viz-s3", label: "VLAN query", accent: "#6CC04A" },
				{ id: "viz-s4", label: "Approve", accent: "#f59e0b" },
			],
			"+ validate · final benchmark · review.log evidence"
		),

	"five-objectives-capstone-chain": () =>
		panel(
			"The Full Pipeline in One Session",
			`
    ${compactHeader("PIPELINE", "One session — full evidence pack")}
    <g id="viz-chain">
      <rect x="60" y="130" width="600" height="100" rx="14" fill="#0b2237" stroke="#049FD9" stroke-width="1.5"/>
      <text x="360" y="162" fill="#12b5e5" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="700" text-anchor="middle">Governed code → MCP → agent → approval → benchmark</text>
      <text x="360" y="188" fill="#9fb3c8" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" text-anchor="middle">reviews/review.log + results/score.txt</text>
      <text x="360" y="210" fill="#64748b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" text-anchor="middle">Evidence you could attach to a change ticket</text>
    </g>`,
			["viz-chain"]
		),

	"verify-capstone-before-close": () =>
		panel(
			"Verify Before You Close",
			`
    ${compactHeader("VERIFY", "Production readiness review")}
    <g id="viz-checklist">
      <rect x="120" y="120" width="480" height="180" rx="14" fill="#081827" stroke="#6CC04A" stroke-width="2"/>
      <text x="150" y="156" fill="#6CC04A" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11">[x] MCP returns live intent VLANs</text>
      <text x="150" y="182" fill="#6CC04A" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11">[x] Benchmark meets your threshold</text>
      <text x="150" y="208" fill="#6CC04A" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11">[x] Approval logged before IaC edit</text>
      <text x="150" y="234" fill="#6CC04A" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11">[x] No secrets in prompt archive</text>
      <text x="150" y="268" fill="#9fb3c8" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10">Safe to rely on — not a formality</text>
    </g>`,
			["viz-checklist"]
		),

	"capstone-nothing-new-ai": () =>
		panel(
			"Nothing New to Install",
			`
    ${compactHeader("RECAP", "Reuse modules 1-4 artifacts")}
    <g id="viz-tools">
      <rect x="80" y="140" width="560" height="100" rx="14" fill="#0b2237" stroke="#a78bfa" stroke-width="1.5"/>
      <text x="360" y="178" fill="#a78bfa" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="12" font-weight="700" text-anchor="middle">Same LLM · FastMCP · Agent · Benchmark</text>
      <text x="360" y="204" fill="#9fb3c8" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" text-anchor="middle">Courses 1-3 supply IaC + validation scripts</text>
      <text x="360" y="226" fill="#64748b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" text-anchor="middle">Repair the owning module — do not patch around it</text>
    </g>`,
			["viz-tools"]
		),

	"story-beat-recap-ai-capstone": () =>
		recapPathLabeled(
			"Ready for Capstone Lab",
			"Six-step runbook next",
			["Both repos open", "Sandbox model", "Code slides next"],
			["viz-check-1", "viz-check-2", "viz-check-3"]
		),

	"lab-setup-ai-capstone": () =>
		labWorkspace(
			"Capstone Lab Setup",
			"netops_ai_lab/",
			["mcp/server.py", "agent/agent.py", "benchmarks/golden_qa.jsonl"],
			["$ python mcp/server.py &", "$ tail -f reviews/review.log  # approvals", "$ python benchmarks/run_eval.py"]
		),

	"resume-ai-capstone-prerequisites": () =>
		panel(
			"Resume Modules 1–4",
			`
    ${compactHeader("PREREQS", "Green before you start")}
    <g id="viz-pre1"><rect x="60" y="150" width="180" height="64" rx="12" fill="#081827" stroke="#a78bfa" stroke-width="2"/>
      <text x="150" y="182" fill="#a78bfa" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" font-weight="700" text-anchor="middle">Governed playbook</text>
      <text x="150" y="200" fill="#64748b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="9" text-anchor="middle">lint + check mode</text></g>
    <g id="viz-pre2"><rect x="270" y="150" width="180" height="64" rx="12" fill="#081827" stroke="#12b5e5" stroke-width="2"/>
      <text x="360" y="182" fill="#12b5e5" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" font-weight="700" text-anchor="middle">MCP + agent</text>
      <text x="360" y="200" fill="#64748b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="9" text-anchor="middle">list_vlans · run_turn</text></g>
    <g id="viz-pre3"><rect x="480" y="150" width="180" height="64" rx="12" fill="#081827" stroke="#f59e0b" stroke-width="2"/>
      <text x="570" y="182" fill="#f59e0b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" font-weight="700" text-anchor="middle">run_eval.py score</text>
      <text x="570" y="200" fill="#64748b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="9" text-anchor="middle">venv-mcp active</text></g>`,
			["viz-pre1", "viz-pre2", "viz-pre3"]
		),

	"ai-capstone-complete": () =>
		panel(
			"AI in Automation — Complete",
			`
    ${compactHeader("COMPLETE", "Auditable assistant workflow")}
    <g id="viz-done">
      <rect x="180" y="140" width="360" height="140" rx="18" fill="#112115" stroke="#6CC04A" stroke-width="2"/>
      <circle cx="360" cy="200" r="36" fill="#163119" stroke="#6CC04A" stroke-width="3"/>
      <path d="M348 200l8 8 18-20" fill="none" stroke="#6CC04A" stroke-width="4" stroke-linecap="round"/>
      <text x="360" y="248" fill="#6CC04A" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="12" font-weight="800" text-anchor="middle">MCP · approval · benchmark</text>
      <text x="360" y="268" fill="#9fb3c8" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" text-anchor="middle">Safer ops — not shortcuts around judgment</text>
    </g>`,
			["viz-done"]
		),
};
