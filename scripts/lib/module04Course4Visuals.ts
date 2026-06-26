import type { VisualResult } from "./premiumVisualArchetypes";
import {
	course4Bridge,
	fourStepFlow,
	guardrailBar,
	labWorkspace,
	moduleHandoffDetail,
	panel,
	panelBox,
	recapPathLabeled,
	compactHeader,
} from "./course4VisualHelpers";

export const MODULE04_COURSE4_VISUALS: Record<string, () => VisualResult> = {
	"evaluation-bridge-from-agents": () =>
		course4Bridge(
			"From Agents to Measured Accuracy",
			"Sounds confident",
			"Is it correct?",
			"Benchmark score",
			"Fluent answers",
			"Compare to YAML",
			"golden_qa.jsonl"
		),

	"why-evaluate-ai-recommendations": () =>
		panel(
			"Why Evaluate AI Output",
			`
    ${compactHeader("WHY MEASURE", "Accuracy is not a vibe check")}
    ${panelBox("viz-trust", 48, 100, 296, 160, "Sounds smart", "#f59e0b",
			`<text x="196" y="140" fill="#9fb3c8" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" text-anchor="middle">Confident natural language</text>
      <text x="196" y="162" fill="#9fb3c8" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" text-anchor="middle">Operators may trust tone</text>
      <text x="196" y="244" fill="#f59e0b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" font-weight="700" text-anchor="middle">May still be wrong</text>`)}
    ${panelBox("viz-prove", 376, 100, 296, 160, "Measured score", "#6CC04A",
			`<text x="524" y="140" fill="#9fb3c8" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" text-anchor="middle">golden_qa.jsonl</text>
      <text x="524" y="162" fill="#9fb3c8" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" text-anchor="middle">Re-run on model change</text>
      <text x="524" y="244" fill="#6CC04A" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" font-weight="700" text-anchor="middle">Regression before prod</text>`, "#112115")}`,
			["viz-trust", "viz-prove"]
		),

	"hallucinations-in-network-context": () =>
		panel(
			"Hallucinations in NetOps",
			`
    ${compactHeader("HALLUCINATION", "Invented VLANs and APIs")}
    <g id="viz-fake"><rect x="80" y="120" width="520" height="160" rx="14" fill="#1a1215" stroke="#ef4444" stroke-width="2"/>
      <text x="120" y="156" fill="#ef4444" font-family="monospace" font-size="10">VLAN 999 on Gi0/99 — interface invented</text>
      <text x="120" y="180" fill="#9fb3c8" font-family="monospace" font-size="10">iosxe_restconf.push_vlan() — API fake</text>
      <text x="120" y="210" fill="#9fb3c8" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10">MCP grounding reduces — does not eliminate</text>
      <text x="120" y="240" fill="#64748b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10">Count what remains in your benchmark</text></g>`,
			["viz-fake"]
		),

	"accuracy-metrics-plain-language": () =>
		fourStepFlow(
			"Accuracy Metrics",
			[
				{ id: "viz-match", label: "Field match", accent: "#12b5e5" },
				{ id: "viz-tool", label: "Tool success", accent: "#6CC04A" },
				{ id: "viz-score", label: "Pass count", accent: "#f59e0b" },
				{ id: "viz-tune", label: "Tune prompt", accent: "#a78bfa" },
			],
			"VLAN list match · tool-call rate · simple lab baseline"
		),

	"benchmark-dataset-design": () =>
		panel(
			"Golden Dataset Design",
			`
    ${compactHeader("GOLDEN Q&A", "Ground truth from lab files")}
    <g id="viz-cases">
      <rect x="100" y="120" width="520" height="180" rx="14" fill="#081827" stroke="#12b5e5" stroke-width="2"/>
      <text x="140" y="156" fill="#12b5e5" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="700">From vlans.yaml + inventory</text>
      <text x="140" y="182" fill="#9fb3c8" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10">Q: List VLANs — expect_contains from intent</text>
      <text x="140" y="204" fill="#9fb3c8" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10">Negative: refuse push without approval</text>
      <text x="140" y="226" fill="#9fb3c8" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10">Trick: false premise — agent must correct</text>
      <text x="140" y="260" fill="#64748b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10">Version in Git like any test fixture</text>
    </g>`,
			["viz-cases"]
		),

	"safety-guardrails-for-agents": () =>
		panel(
			"Safety Guardrails",
			`
    ${compactHeader("GUARDRAILS", "Policy enforced in code")}
    <g id="viz-input"><rect x="48" y="110" width="200" height="64" rx="12" fill="#081827" stroke="#12b5e5" stroke-width="2"/>
      <text x="148" y="142" fill="#12b5e5" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" font-weight="700" text-anchor="middle">Refuse out-of-scope</text>
      <text x="148" y="160" fill="#64748b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="9" text-anchor="middle">No arbitrary shell</text></g>
    <g id="viz-tool"><rect x="260" y="110" width="200" height="64" rx="12" fill="#081827" stroke="#6CC04A" stroke-width="2"/>
      <text x="360" y="142" fill="#6CC04A" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" font-weight="700" text-anchor="middle">Approve writes</text>
      <text x="360" y="160" fill="#64748b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="9" text-anchor="middle">Human gate required</text></g>
    <g id="viz-output"><rect x="472" y="110" width="200" height="64" rx="12" fill="#081827" stroke="#f59e0b" stroke-width="2"/>
      <text x="572" y="142" fill="#f59e0b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" font-weight="700" text-anchor="middle">Strip secrets</text>
      <text x="572" y="160" fill="#64748b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="9" text-anchor="middle">From eval logs</text></g>
    ${guardrailBar("Secure ops foundation first", "Intelligent automation on top")}`,
			["viz-input", "viz-tool", "viz-output", "viz-guardrail"]
		),

	"story-beat-recap-evaluation": () =>
		recapPathLabeled(
			"Theory Complete — Benchmark Lab Next",
			"Create golden_qa.jsonl",
			["Why measure", "Golden dataset", "Run eval next"],
			["viz-check-1", "viz-check-2", "viz-check-3"]
		),

	"lab-setup-benchmark": () =>
		labWorkspace(
			"Benchmark Lab Setup",
			"netops_ai_lab/benchmarks/",
			["golden_qa.jsonl", "run_eval.py", "results/"],
			["$ python run_eval.py", "# review pass/fail", "$ tee results/score.txt"]
		),

	"evaluation-ready-for-capstone": () =>
		moduleHandoffDetail(
			"Evaluation Complete — Capstone Next",
			"Benchmark pipeline ready",
			"Scores you can defend",
			"Full operator session",
			"Draft · MCP · agent · measure"
		),
};
