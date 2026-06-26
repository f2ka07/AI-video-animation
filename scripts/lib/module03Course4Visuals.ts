import type { VisualResult } from "./premiumVisualArchetypes";
import {
	agentLoop,
	comparePanels,
	course4Bridge,
	fourStepFlow,
	labWorkspace,
	moduleHandoffDetail,
	panel,
	recapPathLabeled,
	compactHeader,
} from "./course4VisualHelpers";

export const MODULE03_COURSE4_VISUALS: Record<string, () => VisualResult> = {
	"agents-bridge-from-mcp": () =>
		course4Bridge(
			"From MCP Tools to Conversational Agent",
			"MCP tools live",
			"3 AM on-call?",
			"Plain language",
			"list_vlans works",
			"Engineer needs Python?",
			"Human approve writes"
		),

	"conversational-agent-plain-language": () =>
		panel(
			"Conversational Agent in Plain Language",
			`
    ${compactHeader("AGENT", "Natural language · MCP tools · approval")}
    <g id="viz-user"><rect x="60" y="160" width="120" height="64" rx="12" fill="#081827" stroke="#12b5e5" stroke-width="2"/>
      <text x="120" y="198" fill="#12b5e5" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="700" text-anchor="middle">Operator</text></g>
    <g id="viz-chat"><rect x="220" y="130" width="280" height="120" rx="14" fill="#020617" stroke="#35536f" stroke-width="1.5"/>
      <text x="240" y="162" fill="#9fb3c8" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10">Which VLANs exist in intent?</text>
      <text x="240" y="190" fill="#6CC04A" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10">Plans list_vlans call...</text>
      <text x="240" y="218" fill="#12b5e5" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10">Writes blocked until approve</text></g>
    <g id="viz-tools"><rect x="540" y="160" width="120" height="64" rx="12" fill="#081827" stroke="#f59e0b" stroke-width="2"/>
      <text x="600" y="198" fill="#f59e0b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="700" text-anchor="middle">MCP tools</text></g>`,
			["viz-user", "viz-chat", "viz-tools"]
		),

	"llm-orchestration-patterns": () =>
		fourStepFlow(
			"LLM Orchestration",
			[
				{ id: "viz-plan", label: "Plan", accent: "#12b5e5" },
				{ id: "viz-act", label: "Call MCP", accent: "#6CC04A" },
				{ id: "viz-observe", label: "Observe", accent: "#f59e0b" },
				{ id: "viz-approve", label: "Approve", accent: "#a78bfa" },
			],
			"Plan · act · observe · human approves writes"
		),

	"agent-loop-think-act-observe": () =>
		panel(
			"Think, Act, Observe",
			`${compactHeader("LOOP", "Decide · call tool · feed result back")}
    ${agentLoop()}`,
			["viz-think", "viz-act", "viz-observe"]
		),

	"human-in-loop-vs-full-auto": () =>
		comparePanels(
			"Human in Loop vs Full Auto",
			{
				id: "viz-hitl",
				title: "Human in loop",
				accent: "#6CC04A",
				fill: "#112115",
				lines: ["Approve writes", "Audit trail", "Read + propose", "Production pattern"],
			},
			{
				id: "viz-full",
				title: "Full automation",
				accent: "#ef4444",
				fill: "#1a1215",
				lines: ["Prompt injection risk", "No approval gate", "Read-only in lab", "High blast radius"],
			}
		),

	"network-operator-agent-design": () =>
		panel(
			"Network Operator Agent Design",
			`
    ${compactHeader("DESIGN", "Narrow scope like a firewall policy")}
    <g id="viz-scope"><rect x="80" y="120" width="200" height="100" rx="12" fill="#081827" stroke="#12b5e5" stroke-width="2"/>
      <text x="180" y="158" fill="#12b5e5" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="700" text-anchor="middle">VLAN queries</text>
      <text x="180" y="182" fill="#9fb3c8" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="9" text-anchor="middle">Inventory lookups</text></g>
    <g id="viz-context"><rect x="300" y="120" width="200" height="100" rx="12" fill="#081827" stroke="#6CC04A" stroke-width="2"/>
      <text x="400" y="158" fill="#6CC04A" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="700" text-anchor="middle">Lab topology</text>
      <text x="400" y="182" fill="#9fb3c8" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="9" text-anchor="middle">In system prompt</text></g>
    <g id="viz-guard"><rect x="520" y="120" width="120" height="100" rx="12" fill="#081827" stroke="#f59e0b" stroke-width="2"/>
      <text x="580" y="158" fill="#f59e0b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="700" text-anchor="middle">Refuse shell</text>
      <text x="580" y="182" fill="#9fb3c8" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="9" text-anchor="middle">Out-of-scope</text></g>`,
			["viz-scope", "viz-context", "viz-guard"]
		),

	"story-beat-recap-agents": () =>
		recapPathLabeled(
			"Theory Complete — Agent Lab Next",
			"Wire agent.py next",
			["Think-act-observe", "Approval gate", "Lab next"],
			["viz-check-1", "viz-check-2", "viz-check-3"]
		),

	"lab-setup-agent": () =>
		labWorkspace(
			"Agent Lab Setup",
			"netops_ai_lab/agent/",
			["agent.py", "config.yaml", ".env.example"],
			["$ python agent.py", "# list VLANs on SW2", "# approve when prompted"]
		),

	"agents-ready-for-evaluation": () =>
		moduleHandoffDetail(
			"Agents Complete — Evaluation Next",
			"Agent with approval gate",
			"MCP-grounded queries",
			"Measure accuracy",
			"Golden Q&A benchmark next"
		),
};
