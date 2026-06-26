import type { VisualResult } from "./premiumVisualArchetypes";
import {
	comparePanels,
	course4Bridge,
	fourStepFlow,
	labWorkspace,
	moduleHandoffDetail,
	panel,
	recapPathLabeled,
	compactHeader,
	mcpStack,
} from "./course4VisualHelpers";

export const MODULE02_COURSE4_VISUALS: Record<string, () => VisualResult> = {
	"mcp-bridge-from-module-one": () =>
		course4Bridge(
			"From Reviewed Code to MCP Tools",
			"Governed playbook",
			"Which VLANs on SW2?",
			"MCP read tools",
			"Prompt · review · lint",
			"Model guesses without data",
			"list_vlans from intent"
		),

	"what-mcp-means-plain-language": () =>
		panel(
			"MCP in Plain Language",
			`
    ${compactHeader("MCP", "Model Context Protocol + FastMCP")}
    <g id="viz-contract">
      <rect x="120" y="120" width="480" height="140" rx="14" fill="#0b2237" stroke="#6CC04A" stroke-width="2"/>
      <text x="360" y="156" fill="#6CC04A" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="13" font-weight="800" text-anchor="middle">Client discovers tools via schema</text>
      <text x="360" y="182" fill="#9fb3c8" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" text-anchor="middle">Call with JSON arguments</text>
      <text x="360" y="204" fill="#9fb3c8" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" text-anchor="middle">FastMCP registers Python functions</text>
      <text x="360" y="234" fill="#64748b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" text-anchor="middle">Less glue — more network logic</text>
    </g>`,
			["viz-contract"]
		),

	"mcp-architecture-components": () =>
		panel(
			"MCP Architecture",
			`${compactHeader("ARCHITECTURE", "Host · server · tools · transport")}
    ${mcpStack()}
    <text x="360" y="300" fill="#64748b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" text-anchor="middle">stdio in lab · HTTP in production</text>`,
			["viz-client", "viz-mcp", "viz-tools"]
		),

	"fastmcp-vs-ad-hoc-api": () =>
		comparePanels(
			"FastMCP vs Ad-Hoc API",
			{
				id: "viz-fastmcp",
				title: "MCP / FastMCP",
				accent: "#6CC04A",
				fill: "#112115",
				lines: ["One server many clients", "Discoverable schema", "Audit tool registry", "Reusable servers"],
			},
			{
				id: "viz-adhoc",
				title: "Ad-hoc scripts",
				accent: "#ef4444",
				fill: "#1a1215",
				lines: ["Custom glue per tool", "No discovery", "Hard to audit", "Fragile prompts"],
			}
		),

	"tool-orchestration-patterns": () =>
		fourStepFlow(
			"Tool Orchestration",
			[
				{ id: "viz-read", label: "Read first", accent: "#12b5e5" },
				{ id: "viz-json", label: "JSON out", accent: "#6CC04A" },
				{ id: "viz-write", label: "Write later", accent: "#f59e0b" },
				{ id: "viz-approve", label: "Approve", accent: "#a78bfa" },
			],
			"Read-only intent · writes behind human approval · least privilege"
		),

	"expose-network-data-safely": () =>
		panel(
			"Expose Network Data Safely",
			`
    ${compactHeader("SAFE TOOLS", "Minimum data the assistant needs")}
    <g id="viz-allow"><rect x="80" y="120" width="240" height="140" rx="14" fill="#112115" stroke="#6CC04A" stroke-width="2"/>
      <text x="200" y="156" fill="#6CC04A" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="800" text-anchor="middle">Allowed reads</text>
      <text x="200" y="182" fill="#9fb3c8" font-family="monospace" font-size="9" text-anchor="middle">list_vlans (intent YAML)</text>
      <text x="200" y="202" fill="#9fb3c8" font-family="monospace" font-size="9" text-anchor="middle">get_lab_inventory</text>
      <text x="200" y="234" fill="#64748b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="9" text-anchor="middle">Lab topology only</text></g>
    <g id="viz-deny"><rect x="400" y="120" width="240" height="140" rx="14" fill="#1a1215" stroke="#ef4444" stroke-width="2"/>
      <text x="520" y="156" fill="#ef4444" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="800" text-anchor="middle">Denied without approval</text>
      <text x="520" y="182" fill="#9fb3c8" font-family="monospace" font-size="9" text-anchor="middle">push_config</text>
      <text x="520" y="202" fill="#9fb3c8" font-family="monospace" font-size="9" text-anchor="middle">full running-config</text>
      <text x="520" y="234" fill="#ef4444" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="9" text-anchor="middle">No credentials in output</text></g>`,
			["viz-allow", "viz-deny"]
		),

	"story-beat-recap-mcp": () =>
		recapPathLabeled(
			"Theory Complete — FastMCP Lab Next",
			"Build server.py next",
			["MCP architecture", "Read-only tools", "Lab next"],
			["viz-check-1", "viz-check-2", "viz-check-3"]
		),

	"lab-setup-mcp": () =>
		labWorkspace(
			"Extend netops_ai_lab for MCP",
			"netops_ai_lab/mcp/",
			["server.py", "requirements-mcp.txt", "venv-mcp/"],
			["$ python -m venv venv-mcp", "$ pip install fastmcp", "$ python server.py"]
		),

	"mcp-ready-for-agents": () =>
		moduleHandoffDetail(
			"MCP Complete — Agents Next",
			"MCP returns real data",
			"list_vlans · get_lab_inventory",
			"Conversational layer",
			"Writes need human approval"
		),
};
