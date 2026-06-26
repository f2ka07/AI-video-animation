import type { VisualResult } from "./premiumVisualArchetypes";
import {
	arrow,
	bridgeTitle,
	codeBlock,
	collectorIcon,
	comparePanels,
	compactHeader,
	domainBar,
	examAlignment,
	fourStepFlow,
	header,
	labWorkspace,
	moduleHandoff,
	panel,
	panelBox,
	recapPath,
	routerIcon,
} from "./course3VisualHelpers";

export const MODULE01_COURSE3_VISUALS: Record<string, () => VisualResult> = {
	"snapshots-arent-enough": () =>
		panel(
			"Why snapshots are not enough",
			`
    ${compactHeader("COURSE 3", "Operate what you deployed — health after deploy")}
    ${panelBox(
			"viz-snapshot",
			48,
			92,
			296,
			168,
			"Show command snapshot",
			"#ef4444",
			`${codeBlock(72, 124, 248, 72, [
				"$ show int | inc errors",
				"T+0 OK  T+5 OK",
				"# spike missed at T+2",
			])}
      <text x="196" y="244" fill="#ef4444" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" font-weight="700" text-anchor="middle">Silent drift between polls</text>`,
			"#1a1215"
		)}
    ${panelBox(
			"viz-stream",
			376,
			92,
			296,
			168,
			"Model-driven telemetry",
			"#12b5e5",
			`${codeBlock(400, 124, 248, 72, [
				"device --gRPC--> collector",
				"YANG: interfaces-state",
				"push on change",
			])}
      <text x="524" y="244" fill="#12b5e5" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" font-weight="700" text-anchor="middle">Live structured state</text>`
		)}
    ${domainBar("Exam 3.1 — telemetry architecture", "Prove health after deploy — not just config push")}`,
			["viz-snapshot", "viz-stream", "viz-objective"]
		),

	"polling-vs-streaming": () =>
		comparePanels(
			"Polling vs streaming telemetry",
			{
				id: "viz-poll",
				title: "SNMP poll",
				accent: "#64748b",
				fill: "#1a1215",
				lines: ["Sample every N minutes", "NMS pulls on a timer", "Gaps between samples", "Misses short spikes"],
			},
			{
				id: "viz-stream",
				title: "gRPC stream",
				accent: "#6CC04A",
				fill: "#112115",
				lines: ["Push on interval or change", "Persistent session", "Device is publisher", "Feeds validation + dashboards"],
			}
		),

	"what-model-driven-telemetry-means": () =>
		panel(
			"Model-driven telemetry contract",
			`
    ${header("CONCEPT", "MDT = YANG-modeled data contract")}
    <g id="viz-device">${routerIcon(160, 220, "IOS-XE", "viz-router")}</g>
    ${arrow(204, 220, 280, 220, "viz-arrow")}
    <g id="viz-model">
      <rect x="280" y="150" width="200" height="140" rx="14" fill="#112115" stroke="#6CC04A" stroke-width="2"/>
      <text x="380" y="180" fill="#6CC04A" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="800" text-anchor="middle">YANG model</text>
      ${codeBlock(296, 192, 168, 72, [
				"interfaces-state/",
				"  interface/statistics",
				"typed counters",
			])}
    </g>
    ${arrow(480, 220, 556, 220)}
    <g id="viz-consumer">${collectorIcon(600, 220, "Collector")}</g>
    <text x="360" y="340" fill="#64748b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" text-anchor="middle">Model is the contract — not hand-parsed text</text>`,
			["viz-device", "viz-model", "viz-consumer"]
		),

	"snmp-poll-vs-gnmi-subscribe": () =>
		comparePanels(
			"SNMP poll vs gNMI subscribe",
			{
				id: "viz-snmp",
				title: "SNMP poll",
				accent: "#64748b",
				fill: "#1a1215",
				lines: ["NMS pulls on timer", "MIB/OID based", "Answer and forget", "Legacy gear"],
			},
			{
				id: "viz-gnmi",
				title: "gNMI subscribe",
				accent: "#12b5e5",
				fill: "#081827",
				lines: ["Subscribe to YANG paths", "Structured typed data", "Session stays open", "On-change or periodic"],
			}
		),

	"mdt-architecture-components": () =>
		fourStepFlow(
			"Four MDT architecture components",
			[
				{ id: "viz-producer", label: "Producer", accent: "#12b5e5" },
				{ id: "viz-transport", label: "Transport", accent: "#6CC04A" },
				{ id: "viz-subscription", label: "Subscription", accent: "#f59e0b" },
				{ id: "viz-consumer", label: "Consumer", accent: "#a78bfa" },
			],
			"Device agent → gRPC → path policy → Prometheus/Grafana/scripts"
		),

	"yang-models-in-telemetry": () =>
		panel(
			"YANG models in telemetry",
			`
    ${header("YANG", "Paths define what you can stream")}
    <g id="viz-tree">
      <rect x="80" y="120" width="260" height="220" rx="14" fill="#081827" stroke="#12b5e5" stroke-width="2"/>
      <text x="104" y="148" fill="#12b5e5" font-family="monospace" font-size="11" font-weight="700">Cisco-IOS-XE-interfaces-oper</text>
      <text x="120" y="176" fill="#9fb3c8" font-family="monospace" font-size="10">+-- interfaces-state</text>
      <text x="136" y="198" fill="#9fb3c8" font-family="monospace" font-size="10">+-- interface[name]</text>
      <text x="152" y="220" fill="#6CC04A" font-family="monospace" font-size="10">+-- statistics</text>
      <text x="168" y="242" fill="#64748b" font-family="monospace" font-size="10">in-octets, out-errors</text>
    </g>
    <g id="viz-verify">
      <rect x="380" y="120" width="280" height="220" rx="14" fill="#020617" stroke="#35536f" stroke-width="1.5"/>
      <text x="400" y="148" fill="#64748b" font-family="monospace" font-size="10">$ show platform software</text>
      <text x="400" y="168" fill="#64748b" font-family="monospace" font-size="10">  yang-management process</text>
      <text x="400" y="200" fill="#f59e0b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="700">Wrong path = empty stream</text>
      <text x="400" y="228" fill="#9fb3c8" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10">Match model to IOS XE version</text>
    </g>`,
			["viz-tree", "viz-verify"]
		),

	"dial-out-vs-dial-in": () =>
		comparePanels(
			"Dial-out vs dial-in telemetry",
			{
				id: "viz-dial-out",
				title: "Dial-out (push)",
				accent: "#6CC04A",
				fill: "#112115",
				lines: ["Device connects to collector", "Destination IP + port", "IOS XE MDT subscription", "Firewall: egress from device"],
			},
			{
				id: "viz-dial-in",
				title: "Dial-in (subscribe)",
				accent: "#12b5e5",
				fill: "#081827",
				lines: ["Collector connects to device", "gNMI client to :57400", "Client opens subscription", "Firewall: inbound to device"],
			}
		),

	"story-beat-recap-telemetry": () =>
		recapPath(
			["Poll vs stream", "MDT components", "Lab next"],
			["viz-check-1", "viz-check-2", "viz-check-3"]
		),

	"lab-setup-telemetry": () =>
		labWorkspace(
			"Telemetry lab workspace",
			"netops_ops_lab/",
			["docker-compose.yml", "prometheus/", "collector/"],
			["$ mkdir netops_ops_lab", "$ docker compose up -d", "$ curl localhost:9090/-/healthy"]
		),

	"certification-alignment-telemetry": () => examAlignment("3.1"),

	"telemetry-ready-for-logging": () => moduleHandoff("Module 2: Logging", ["viz-done", "viz-arrow", "viz-next"]),
};
