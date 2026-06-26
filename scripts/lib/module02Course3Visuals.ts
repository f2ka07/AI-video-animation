import type { VisualResult } from "./premiumVisualArchetypes";
import {
	arrow,
	bridgeTitle,
	codeBlock,
	comparePanels,
	domainBar,
	examAlignment,
	fourStepFlow,
	header,
	labWorkspace,
	moduleHandoff,
	panel,
	panelBox,
	recapPath,
} from "./course3VisualHelpers";

export const MODULE02_COURSE3_VISUALS: Record<string, () => VisualResult> = {
	"telemetry-to-logging-bridge": () =>
		bridgeTitle(
			"From telemetry to logging",
			"Telemetry stream",
			"Metrics alone?",
			"Logging + RCA",
			["viz-from", "viz-bridge", "viz-to"]
		),

	"metrics-without-logs-blind-spots": () =>
		panel(
			"Metrics without logs blind spots",
			`
    ${header("GAP", "Counters without context")}
    ${panelBox(
			"viz-metrics",
			48,
			120,
			296,
			200,
			"Prometheus metrics",
			"#12b5e5",
			`<text x="196" y="168" fill="#9fb3c8" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" text-anchor="middle">CPU 42%  errors 0</text>
      <text x="196" y="196" fill="#64748b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" text-anchor="middle">Green dashboard</text>
      <text x="196" y="224" fill="#64748b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" text-anchor="middle">No who/what/when</text>`
		)}
    ${panelBox(
			"viz-blind",
			376,
			120,
			296,
			200,
			"Missing log context",
			"#ef4444",
			`<text x="524" y="168" fill="#ef4444" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" font-weight="700" text-anchor="middle">Automation failed at 02:14</text>
      <text x="524" y="196" fill="#9fb3c8" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" text-anchor="middle">Which playbook? Which device?</text>
      <text x="524" y="224" fill="#64748b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" text-anchor="middle">Metrics did not explain why</text>`,
			"#1a1215"
		)}
    ${domainBar("Exam 3.2 — logging strategy", "Correlate events to automation runs")}`,
			["viz-metrics", "viz-blind", "viz-objective"]
		),

	"what-logging-strategy-means": () =>
		panel(
			"Logging strategy for automation",
			`
    ${header("STRATEGY", "Collect, route, retain, search")}
    <g id="viz-collect"><rect x="60" y="160" width="120" height="70" rx="12" fill="#081827" stroke="#12b5e5" stroke-width="2"/>
      <text x="120" y="202" fill="#12b5e5" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="700" text-anchor="middle">Collect</text></g>
    ${arrow(180, 195, 220, 195)}
    <g id="viz-route"><rect x="220" y="160" width="120" height="70" rx="12" fill="#081827" stroke="#6CC04A" stroke-width="2"/>
      <text x="280" y="202" fill="#6CC04A" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="700" text-anchor="middle">Route</text></g>
    ${arrow(340, 195, 380, 195)}
    <g id="viz-search"><rect x="380" y="160" width="120" height="70" rx="12" fill="#081827" stroke="#f59e0b" stroke-width="2"/>
      <text x="440" y="202" fill="#f59e0b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="700" text-anchor="middle">Search</text></g>
    ${arrow(500, 195, 540, 195)}
    <g id="viz-act"><rect x="540" y="160" width="120" height="70" rx="12" fill="#081827" stroke="#a78bfa" stroke-width="2"/>
      <text x="600" y="202" fill="#a78bfa" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="700" text-anchor="middle">Automate</text></g>
    <text x="360" y="300" fill="#64748b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" text-anchor="middle">Syslog + app logs feed RCA workflows</text>`,
			["viz-collect", "viz-route", "viz-search", "viz-act"]
		),

	"syslog-vs-application-logs": () =>
		comparePanels(
			"Syslog vs application logs",
			{
				id: "viz-syslog",
				title: "Syslog (device)",
				accent: "#f59e0b",
				lines: ["Network device events", "Facility + severity", "Link up/down, ACL hits", "Central syslog server"],
			},
			{
				id: "viz-app",
				title: "Application logs",
				accent: "#12b5e5",
				lines: ["Ansible / Python / CI", "Structured JSON fields", "run_id, device, result", "ELK / Loki / Splunk"],
			}
		),

	"logging-architecture-components": () =>
		fourStepFlow(
			"Logging architecture components",
			[
				{ id: "viz-source", label: "Sources", accent: "#12b5e5" },
				{ id: "viz-agent", label: "Forwarder", accent: "#6CC04A" },
				{ id: "viz-store", label: "Store", accent: "#f59e0b" },
				{ id: "viz-query", label: "Query", accent: "#a78bfa" },
			],
			"Devices + runners → Fluent Bit → index → search/alert"
		),

	"structured-vs-unstructured-logs": () =>
		panel(
			"Structured vs unstructured logs",
			`
    ${header("FORMAT", "Parse once — query many times")}
    ${panelBox(
			"viz-unstructured",
			48,
			120,
			296,
			200,
			"Unstructured",
			"#ef4444",
			`${codeBlock(72, 156, 248, 72, [
				"ERROR: vlan push failed",
				"on SW2 - check output",
			])}
      <text x="196" y="260" fill="#ef4444" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" text-anchor="middle">Regex fragile</text>`
		)}
    ${panelBox(
			"viz-structured",
			376,
			120,
			296,
			200,
			"Structured JSON",
			"#6CC04A",
			`${codeBlock(400, 156, 248, 88, [
				'{"device":"SW2",',
				' "vlan":100,',
				' "result":"failed"}',
			])}
      <text x="524" y="260" fill="#6CC04A" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" text-anchor="middle">Filter by field</text>`,
			"#112115"
		)}`,
			["viz-unstructured", "viz-structured"]
		),

	"event-workflows-for-automation": () =>
		panel(
			"Event workflows for automation",
			`
    ${header("WORKFLOW", "Log event triggers action")}
    <g id="viz-trigger"><rect x="80" y="170" width="140" height="64" rx="12" fill="#1a1215" stroke="#ef4444" stroke-width="2"/>
      <text x="150" y="208" fill="#ef4444" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="700" text-anchor="middle">Alert: error spike</text></g>
    ${arrow(220, 202, 280, 202)}
    <g id="viz-enrich"><rect x="280" y="170" width="140" height="64" rx="12" fill="#081827" stroke="#f59e0b" stroke-width="2"/>
      <text x="350" y="208" fill="#f59e0b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="700" text-anchor="middle">Correlate logs</text></g>
    ${arrow(420, 202, 480, 202)}
    <g id="viz-action"><rect x="480" y="170" width="140" height="64" rx="12" fill="#112115" stroke="#6CC04A" stroke-width="2"/>
      <text x="550" y="208" fill="#6CC04A" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="700" text-anchor="middle">Run playbook</text></g>`,
			["viz-trigger", "viz-enrich", "viz-action"]
		),

	"root-cause-analysis-plain-language": () =>
		panel(
			"Root cause analysis",
			`
    ${header("RCA", "Timeline ties symptoms to change")}
    <g id="viz-timeline">
      <line x1="80" y1="220" x2="640" y2="220" stroke="#35536f" stroke-width="2"/>
      <circle cx="160" cy="220" r="10" fill="#12b5e5"/><text x="160" y="248" fill="#9fb3c8" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="9" text-anchor="middle">Deploy</text>
      <circle cx="320" cy="220" r="10" fill="#f59e0b"/><text x="320" y="248" fill="#9fb3c8" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="9" text-anchor="middle">Syslog flap</text>
      <circle cx="480" cy="220" r="10" fill="#ef4444"/><text x="480" y="248" fill="#9fb3c8" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="9" text-anchor="middle">Ticket</text>
      <circle cx="600" cy="220" r="10" fill="#6CC04A"/><text x="600" y="248" fill="#9fb3c8" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="9" text-anchor="middle">Fix</text>
    </g>
    <text x="360" y="300" fill="#64748b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" text-anchor="middle">Logs + metrics + change record = RCA</text>`,
			["viz-timeline"]
		),

	"diagnose-automation-from-logs": () =>
		panel(
			"Diagnose automation from logs",
			`
    ${header("DEBUG", "Trace the failed run")}
  <g id="viz-log">${codeBlock(80, 130, 560, 140, [
		'{"run_id":"a91f","device":"R1",',
		' "task":"vlan_push","status":"failed",',
		' "error":"RESTCONF 409 conflict"}',
		"# search: run_id=a91f",
	])}</g>
    <g id="viz-fix"><rect x="200" y="300" width="320" height="64" rx="12" fill="#112115" stroke="#6CC04A" stroke-width="2"/>
      <text x="360" y="338" fill="#6CC04A" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="12" font-weight="700" text-anchor="middle">Replay + fix idempotency</text></g>`,
			["viz-log", "viz-fix"]
		),

	"story-beat-recap-logging": () =>
		recapPath(["Strategy", "Structured logs", "Lab next"], ["viz-check-1", "viz-check-2", "viz-check-3"]),

	"lab-setup-logging": () =>
		labWorkspace(
			"Logging lab workspace",
			"netops_ops_lab/",
			["fluent-bit.conf", "logs/", "docker-compose.yml"],
			["$ docker compose up -d loki", "$ logger-test --device R1", "$ curl localhost:3100/ready"]
		),

	"certification-alignment-logging": () => examAlignment("3.2"),

	"logging-ready-for-validation": () => moduleHandoff("Module 3: pyATS validation"),
};
