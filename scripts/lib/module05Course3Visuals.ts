import type { VisualResult } from "./premiumVisualArchetypes";
import {
	arrow,
	comparePanels,
	domainBar,
	examAlignment,
	fourStepFlow,
	header,
	labWorkspace,
	panel,
	panelBox,
	recapPath,
} from "./course3VisualHelpers";

export const MODULE05_COURSE3_VISUALS: Record<string, () => VisualResult> = {
	"ops-capstone-intro": () =>
		panel(
			"Operations capstone intro",
			`
    ${header("CAPSTONE", "Course 3 integrates the AUTOCOR track")}
    <g id="viz-c1"><rect x="56" y="130" width="140" height="64" rx="12" fill="#081827" stroke="#12b5e5" stroke-width="2"/>
      <text x="126" y="168" fill="#12b5e5" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="700" text-anchor="middle">C1 Program</text></g>
    <g id="viz-c2"><rect x="210" y="130" width="140" height="64" rx="12" fill="#081827" stroke="#6CC04A" stroke-width="2"/>
      <text x="280" y="168" fill="#6CC04A" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="700" text-anchor="middle">C2 Version</text></g>
    <g id="viz-c3"><rect x="364" y="130" width="140" height="64" rx="12" fill="#112115" stroke="#f59e0b" stroke-width="2"/>
      <text x="434" y="168" fill="#f59e0b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="700" text-anchor="middle">C3 Operate</text></g>
    <g id="viz-c4"><rect x="518" y="130" width="140" height="64" rx="12" fill="#081827" stroke="#a78bfa" stroke-width="2"/>
      <text x="588" y="168" fill="#a78bfa" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="700" text-anchor="middle">C4 AI</text></g>
    ${domainBar("End-to-end ops runbook", "Telemetry + logs + pyATS + TLS in one workflow")}`,
			["viz-c1", "viz-c2", "viz-c3", "viz-c4", "viz-objective"]
		),

	"capstone-integrates-four-modules": () =>
		panel(
			"Capstone integrates four modules",
			`
    ${header("INTEGRATE", "Four course 3 modules in one story")}
    <g id="viz-m1"><rect x="48" y="150" width="150" height="56" rx="10" fill="#081827" stroke="#12b5e5" stroke-width="2"/>
      <text x="123" y="184" fill="#12b5e5" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" font-weight="700" text-anchor="middle">Telemetry</text></g>
    <g id="viz-m2"><rect x="210" y="150" width="150" height="56" rx="10" fill="#081827" stroke="#6CC04A" stroke-width="2"/>
      <text x="285" y="184" fill="#6CC04A" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" font-weight="700" text-anchor="middle">Logging</text></g>
    <g id="viz-m3"><rect x="372" y="150" width="150" height="56" rx="10" fill="#081827" stroke="#f59e0b" stroke-width="2"/>
      <text x="447" y="184" fill="#f59e0b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" font-weight="700" text-anchor="middle">Validation</text></g>
    <g id="viz-m4"><rect x="534" y="150" width="150" height="56" rx="10" fill="#081827" stroke="#a78bfa" stroke-width="2"/>
      <text x="609" y="184" fill="#a78bfa" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" font-weight="700" text-anchor="middle">Security</text></g>
    ${arrow(123, 206, 123, 250)}
    ${arrow(285, 206, 285, 250)}
    ${arrow(447, 206, 447, 250)}
    ${arrow(609, 206, 609, 250)}
    <g id="viz-cap"><rect x="180" y="250" width="360" height="72" rx="14" fill="#112115" stroke="#6CC04A" stroke-width="2"/>
      <text x="360" y="292" fill="#6CC04A" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="13" font-weight="800" text-anchor="middle">Ops capstone pipeline</text></g>`,
			["viz-m1", "viz-m2", "viz-m3", "viz-m4", "viz-cap"]
		),

	"capstone-two-repo-layout": () =>
		panel(
			"Two-repo capstone layout",
			`
    ${header("LAYOUT", "Separate IaC from observe/validate")}
    ${panelBox(
			"viz-iac",
			48,
			120,
			280,
			200,
			"netops_iac_lab (C2)",
			"#6CC04A",
			`<text x="188" y="168" fill="#9fb3c8" font-family="monospace" font-size="10" text-anchor="middle">playbooks/</text>
      <text x="188" y="190" fill="#9fb3c8" font-family="monospace" font-size="10" text-anchor="middle">.gitlab-ci.yml</text>
      <text x="188" y="212" fill="#64748b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" text-anchor="middle">Intent + pipeline</text>`
		)}
    ${panelBox(
			"viz-ops",
			392,
			120,
			280,
			200,
			"netops_ops_lab (C3)",
			"#12b5e5",
			`<text x="532" y="168" fill="#9fb3c8" font-family="monospace" font-size="10" text-anchor="middle">prometheus/</text>
      <text x="532" y="190" fill="#9fb3c8" font-family="monospace" font-size="10" text-anchor="middle">pyats/ learn_snapshots/</text>
      <text x="532" y="212" fill="#64748b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" text-anchor="middle">Observe + validate</text>`
		)}`,
			["viz-iac", "viz-ops"]
		),

	"zero-touch-vs-manual-ops": () =>
		comparePanels(
			"Zero-touch vs manual ops",
			{
				id: "viz-manual",
				title: "Manual ops",
				accent: "#ef4444",
				fill: "#1a1215",
				lines: ["Engineer runs show", "Ad-hoc log grep", "Skip validation gate", "Tribal knowledge"],
			},
			{
				id: "viz-zto",
				title: "Zero-touch ops",
				accent: "#6CC04A",
				fill: "#112115",
				lines: ["Pipeline triggers change", "Telemetry + logs auto", "pyATS gate + rollback", "Documented runbook"],
			}
		),

	"seven-steps-ops-runbook": () =>
		fourStepFlow(
			"Seven-step ops runbook (excerpt)",
			[
				{ id: "viz-s1", label: "Intent", accent: "#12b5e5" },
				{ id: "viz-s2", label: "Pre-learn", accent: "#6CC04A" },
				{ id: "viz-s3", label: "Apply", accent: "#f59e0b" },
				{ id: "viz-s4", label: "Verify", accent: "#a78bfa" },
			],
			"Plus: stream metrics, correlate logs, rollback on fail"
		),

	"four-pillars-capstone-chain": () =>
		panel(
			"Four pillars capstone chain",
			`
    ${header("CHAIN", "Intent → apply → observe → prove")}
    <g id="viz-intent"><rect x="60" y="170" width="120" height="60" rx="10" fill="#081827" stroke="#6CC04A" stroke-width="2"/>
      <text x="120" y="205" fill="#6CC04A" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="700" text-anchor="middle">Git intent</text></g>
    ${arrow(180, 200, 210, 200)}
    <g id="viz-apply"><rect x="210" y="170" width="120" height="60" rx="10" fill="#081827" stroke="#12b5e5" stroke-width="2"/>
      <text x="270" y="205" fill="#12b5e5" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="700" text-anchor="middle">CI apply</text></g>
    ${arrow(330, 200, 360, 200)}
    <g id="viz-observe"><rect x="360" y="170" width="120" height="60" rx="10" fill="#081827" stroke="#f59e0b" stroke-width="2"/>
      <text x="420" y="205" fill="#f59e0b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="700" text-anchor="middle">Telemetry</text></g>
    ${arrow(480, 200, 510, 200)}
    <g id="viz-prove"><rect x="510" y="170" width="120" height="60" rx="10" fill="#081827" stroke="#a78bfa" stroke-width="2"/>
      <text x="570" y="205" fill="#a78bfa" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="700" text-anchor="middle">pyATS</text></g>`,
			["viz-intent", "viz-apply", "viz-observe", "viz-prove"]
		),

	"verify-ops-pipeline-before-close": () =>
		panel(
			"Verify ops pipeline before close",
			`
    ${header("VERIFY", "Close the change with evidence")}
    <g id="viz-checklist">
      <rect x="120" y="130" width="480" height="200" rx="14" fill="#081827" stroke="#6CC04A" stroke-width="2"/>
      <text x="150" y="168" fill="#6CC04A" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11">[x] Stream active on collector</text>
      <text x="150" y="194" fill="#6CC04A" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11">[x] Logs indexed with run_id</text>
      <text x="150" y="220" fill="#6CC04A" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11">[x] pyATS diff: PASS</text>
      <text x="150" y="246" fill="#6CC04A" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11">[x] TLS verify on API calls</text>
      <text x="150" y="272" fill="#9fb3c8" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10">Attach evidence to change ticket</text>
    </g>`,
			["viz-checklist"]
		),

	"capstone-nothing-new-ops": () =>
		panel(
			"Nothing new in capstone",
			`
    ${header("RECAP", "Same tools — integrated workflow")}
    <g id="viz-tools">
      <rect x="80" y="150" width="520" height="120" rx="14" fill="#0b2237" stroke="#049FD9" stroke-width="1.5"/>
      <text x="360" y="188" fill="#12b5e5" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="12" font-weight="700" text-anchor="middle">Prometheus · Fluent Bit · pyATS · Vault · GitLab</text>
      <text x="360" y="218" fill="#9fb3c8" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" text-anchor="middle">Capstone = compose modules 1-4 in order</text>
      <text x="360" y="242" fill="#64748b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" text-anchor="middle">No new exam tricks — execution under pressure</text>
    </g>`,
			["viz-tools"]
		),

	"story-beat-recap-ops-capstone": () =>
		recapPath(["Two repos", "7-step runbook", "Lab capstone"], ["viz-check-1", "viz-check-2", "viz-check-3"]),

	"lab-setup-ops-capstone": () =>
		labWorkspace(
			"Ops capstone lab",
			"netops_ops_lab/",
			["capstone_runbook.md", "jobs/", "evidence/"],
			["$ ./run_capstone.sh --dry-run", "$ pyats diff pre post", "$ ./collect_evidence.sh"]
		),

	"resume-ops-capstone-prerequisites": () =>
		panel(
			"Resume ops capstone prerequisites",
			`
    ${header("RESUME", "Prerequisites from courses 1-3")}
    <g id="viz-pre1"><rect x="60" y="160" width="180" height="64" rx="12" fill="#081827" stroke="#12b5e5" stroke-width="2"/>
      <text x="150" y="198" fill="#12b5e5" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="700" text-anchor="middle">C1: Ansible/API</text></g>
    <g id="viz-pre2"><rect x="270" y="160" width="180" height="64" rx="12" fill="#081827" stroke="#6CC04A" stroke-width="2"/>
      <text x="360" y="198" fill="#6CC04A" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="700" text-anchor="middle">C2: Git + CI/CD</text></g>
    <g id="viz-pre3"><rect x="480" y="160" width="180" height="64" rx="12" fill="#081827" stroke="#f59e0b" stroke-width="2"/>
      <text x="570" y="198" fill="#f59e0b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="700" text-anchor="middle">C3: M1-M4 labs</text></g>`,
			["viz-pre1", "viz-pre2", "viz-pre3"]
		),

	"course-three-objectives-complete": () => examAlignment("3.1-3.6"),

	"ops-capstone-complete": () =>
		panel(
			"Course 3 complete",
			`
    ${header("COMPLETE", "Domain 3.x — operate with proof")}
    <g id="viz-done">
      <rect x="200" y="150" width="320" height="140" rx="18" fill="#112115" stroke="#6CC04A" stroke-width="2"/>
      <circle cx="360" cy="210" r="36" fill="#163119" stroke="#6CC04A" stroke-width="3"/>
      <path d="M348 210l8 8 18-20" fill="none" stroke="#6CC04A" stroke-width="4" stroke-linecap="round"/>
      <text x="360" y="270" fill="#6CC04A" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="14" font-weight="800" text-anchor="middle">Ready for Course 4</text>
    </g>`,
			["viz-done"]
		),
};
