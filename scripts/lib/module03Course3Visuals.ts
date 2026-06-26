import type { VisualResult } from "./premiumVisualArchetypes";
import {
	arrow,
	bridgeTitle,
	codeBlock,
	comparePanels,
	examAlignment,
	fourStepFlow,
	header,
	labWorkspace,
	moduleHandoff,
	panel,
	panelBox,
	recapPath,
} from "./course3VisualHelpers";

export const MODULE03_COURSE3_VISUALS: Record<string, () => VisualResult> = {
	"logging-to-validation-bridge": () =>
		bridgeTitle("Validation bridge", "Logs + metrics", "Deploy OK?", "pyATS proof", [
			"viz-from",
			"viz-bridge",
			"viz-to",
		]),

	"deploy-success-without-proof": () =>
		panel(
			"Deploy success without proof",
			`
    ${header("RISK", "Green pipeline ≠ healthy network")}
    ${panelBox(
			"viz-pipeline",
			48,
			120,
			296,
			200,
			"CI/CD passed",
			"#6CC04A",
			`<text x="196" y="168" fill="#6CC04A" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="700" text-anchor="middle">ansible-playbook: OK</text>
      <text x="196" y="196" fill="#9fb3c8" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" text-anchor="middle">Merge to main</text>
      <text x="196" y="224" fill="#64748b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" text-anchor="middle">No state check on device</text>`
		)}
    ${panelBox(
			"viz-reality",
			376,
			120,
			296,
			200,
			"Device reality",
			"#ef4444",
			`<text x="524" y="168" fill="#ef4444" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="700" text-anchor="middle">VLAN 100 missing</text>
      <text x="524" y="196" fill="#9fb3c8" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" text-anchor="middle">Silent partial apply</text>
      <text x="524" y="224" fill="#64748b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" text-anchor="middle">Outage at 03:00</text>`,
			"#1a1215"
		)}`,
			["viz-pipeline", "viz-reality"]
		),

	"what-change-validation-means": () =>
		panel(
			"Change validation meaning",
			`
    ${header("VALIDATE", "Intent vs operational state")}
    <g id="viz-intent"><rect x="80" y="160" width="200" height="100" rx="14" fill="#112115" stroke="#6CC04A" stroke-width="2"/>
      <text x="180" y="192" fill="#6CC04A" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="12" font-weight="800" text-anchor="middle">Intent (Git)</text>
      <text x="180" y="218" fill="#9fb3c8" font-family="monospace" font-size="10" text-anchor="middle">vlan 100 on Gi1/0/1</text></g>
    ${arrow(280, 210, 340, 210)}
    <g id="viz-compare"><rect x="340" y="160" width="120" height="100" rx="14" fill="#0b2237" stroke="#f59e0b" stroke-width="2"/>
      <text x="400" y="210" fill="#f59e0b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="12" font-weight="800" text-anchor="middle">diff</text></g>
    ${arrow(460, 210, 520, 210)}
    <g id="viz-state"><rect x="520" y="160" width="200" height="100" rx="14" fill="#081827" stroke="#12b5e5" stroke-width="2"/>
      <text x="620" y="192" fill="#12b5e5" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="12" font-weight="800" text-anchor="middle">Live state</text>
      <text x="620" y="218" fill="#9fb3c8" font-family="monospace" font-size="10" text-anchor="middle">show / gNMI get</text></g>`,
			["viz-intent", "viz-compare", "viz-state"]
		),

	"testing-strategy-for-automation": () =>
		fourStepFlow(
			"Testing strategy for automation",
			[
				{ id: "viz-unit", label: "Unit", accent: "#12b5e5" },
				{ id: "viz-lab", label: "Lab", accent: "#6CC04A" },
				{ id: "viz-canary", label: "Canary", accent: "#f59e0b" },
				{ id: "viz-prod", label: "Prod", accent: "#a78bfa" },
			],
			"Lint → CML/pyATS → subset → full rollout"
		),

	"pyats-plain-language": () =>
		panel(
			"pyATS plain language",
			`
    ${header("pyATS", "Learn snapshot → compare → diff")}
    <g id="viz-learn">${codeBlock(80, 130, 240, 100, ["pyats learn device", "# captures structured state", "testbed.yaml"])}</g>
    <g id="viz-diff">${codeBlock(400, 130, 240, 100, ["pyats diff learn1 learn2", "# highlights drift", "JSON / text report"])}</g>
    <text x="360" y="280" fill="#64748b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" text-anchor="middle">Same tool before and after change</text>`,
			["viz-learn", "viz-diff"]
		),

	"pyats-architecture-components": () =>
		fourStepFlow(
			"pyATS architecture components",
			[
				{ id: "viz-testbed", label: "Testbed", accent: "#12b5e5" },
				{ id: "viz-learn", label: "Learn", accent: "#6CC04A" },
				{ id: "viz-compare", label: "Compare", accent: "#f59e0b" },
				{ id: "viz-report", label: "Report", accent: "#a78bfa" },
			],
			"YAML inventory → Genie parsers → diff engine → pass/fail gate"
		),

	"pre-change-vs-post-change-validation": () =>
		comparePanels(
			"Pre-change vs post-change validation",
			{
				id: "viz-pre",
				title: "Pre-change",
				accent: "#12b5e5",
				lines: ["Baseline learn snapshot", "Capture before push", "Know starting state", "Rollback reference"],
			},
			{
				id: "viz-post",
				title: "Post-change",
				accent: "#6CC04A",
				lines: ["Learn after apply", "Diff against baseline", "Fail pipeline on drift", "Trigger rollback"],
			}
		),

	"change-assurance-workflow": () =>
		panel(
			"Change assurance workflow",
			`
    ${header("WORKFLOW", "Intent → apply → verify")}
    <g id="viz-step1"><rect x="60" y="170" width="110" height="60" rx="10" fill="#081827" stroke="#12b5e5" stroke-width="2"/>
      <text x="115" y="205" fill="#12b5e5" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="700" text-anchor="middle">Pre-learn</text></g>
    ${arrow(170, 200, 200, 200)}
    <g id="viz-step2"><rect x="200" y="170" width="110" height="60" rx="10" fill="#081827" stroke="#6CC04A" stroke-width="2"/>
      <text x="255" y="205" fill="#6CC04A" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="700" text-anchor="middle">Apply</text></g>
    ${arrow(310, 200, 340, 200)}
    <g id="viz-step3"><rect x="340" y="170" width="110" height="60" rx="10" fill="#081827" stroke="#f59e0b" stroke-width="2"/>
      <text x="395" y="205" fill="#f59e0b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="700" text-anchor="middle">Post-learn</text></g>
    ${arrow(450, 200, 480, 200)}
    <g id="viz-step4"><rect x="480" y="170" width="110" height="60" rx="10" fill="#081827" stroke="#a78bfa" stroke-width="2"/>
      <text x="535" y="205" fill="#a78bfa" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="700" text-anchor="middle">Gate</text></g>`,
			["viz-step1", "viz-step2", "viz-step3", "viz-step4"]
		),

	"automated-rollback-when-validation-fails": () =>
		panel(
			"Automated rollback on validation fail",
			`
    ${header("ROLLBACK", "Fail closed — revert intent")}
    <g id="viz-fail"><rect x="100" y="150" width="180" height="80" rx="12" fill="#1a1215" stroke="#ef4444" stroke-width="2"/>
      <text x="190" y="195" fill="#ef4444" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="12" font-weight="800" text-anchor="middle">pyATS diff: FAIL</text></g>
    ${arrow(280, 190, 340, 190)}
    <g id="viz-rollback"><rect x="340" y="150" width="180" height="80" rx="12" fill="#112115" stroke="#f59e0b" stroke-width="2"/>
      <text x="430" y="195" fill="#f59e0b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="12" font-weight="800" text-anchor="middle">git revert + apply</text></g>
    ${arrow(520, 190, 580, 190)}
    <g id="viz-verify"><rect x="500" y="260" width="180" height="80" rx="12" fill="#112115" stroke="#6CC04A" stroke-width="2"/>
      <text x="590" y="305" fill="#6CC04A" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="12" font-weight="800" text-anchor="middle">Re-learn: OK</text></g>`,
			["viz-fail", "viz-rollback", "viz-verify"]
		),

	"story-beat-recap-validation": () =>
		recapPath(["Pre/post learn", "pyATS gate", "Lab next"], ["viz-check-1", "viz-check-2", "viz-check-3"]),

	"lab-setup-pyats": () =>
		labWorkspace(
			"pyATS lab workspace",
			"netops_ops_lab/",
			["testbed.yaml", "jobs/", "learn_snapshots/"],
			["$ pip install pyats[full]", "$ pyats learn device --testbed testbed.yaml", "$ pyats diff learn1 learn2"]
		),

	"certification-alignment-validation": () => examAlignment("3.3"),

	"validation-ready-for-security": () => moduleHandoff("Module 4: TLS and secrets"),
};
