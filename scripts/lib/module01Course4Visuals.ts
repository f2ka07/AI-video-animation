import type { VisualResult } from "./premiumVisualArchetypes";
import {
	aiPipeline,
	codeBlock,
	comparePanels,
	guardrailBar,
	labWorkspace,
	moduleHandoffDetail,
	panel,
	panelBox,
	recapPathLabeled,
	compactHeader,
} from "./course4VisualHelpers";

export const MODULE01_COURSE4_VISUALS: Record<string, () => VisualResult> = {
	"secure-ops-to-ai-bridge": () =>
		panel(
			"From Secure Ops to AI Assistance",
			`
    ${compactHeader("CHANGE WINDOW", "VLAN request → model drafts a playbook")}
    ${panelBox(
			"viz-scenario",
			48,
			92,
			296,
			168,
			"Tuesday night scenario",
			"#f59e0b",
			`<text x="196" y="132" fill="#9fb3c8" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" text-anchor="middle">VLAN standardization in queue</text>
      <text x="196" y="154" fill="#9fb3c8" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" text-anchor="middle">Paste ask into chat model</text>
      <text x="196" y="176" fill="#9fb3c8" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" text-anchor="middle">Playbook looks almost right</text>
      <text x="196" y="244" fill="#f59e0b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" font-weight="700" text-anchor="middle">Speed is not approval</text>`,
			"#1a1215"
		)}
    ${panelBox(
			"viz-workflow",
			376,
			92,
			296,
			168,
			"Defensible workflow",
			"#a78bfa",
			`<text x="524" y="132" fill="#9fb3c8" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" text-anchor="middle">Prompt with constraints</text>
      <text x="524" y="154" fill="#9fb3c8" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" text-anchor="middle">Human review + diff</text>
      <text x="524" y="176" fill="#9fb3c8" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" text-anchor="middle">Lint and check mode</text>
      <text x="524" y="244" fill="#a78bfa" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" font-weight="700" text-anchor="middle">Audit trail before device touch</text>`
		)}
    ${guardrailBar("Automate · version · observe · secure", "LLM drafts — you own the change ticket")}`,
			["viz-scenario", "viz-workflow", "viz-guardrail"]
		),

	"ai-coding-workflows-plain-language": () =>
		aiPipeline(
			"AI Coding Workflows",
			[
				{ id: "viz-prompt", label: "Prompt", accent: "#12b5e5" },
				{ id: "viz-review", label: "Review", accent: "#f59e0b" },
				{ id: "viz-lint", label: "Lint", accent: "#6CC04A" },
				{ id: "viz-check", label: "Check", accent: "#a78bfa" },
			],
			"Non-optional gates — skipping review reaches production unsafe"
		),

	"benefits-of-ai-assisted-coding": () =>
		panel(
			"When AI Helps Network Engineers",
			`
    ${compactHeader("BENEFITS", "Accelerate the blank page")}
    <g id="viz-speed"><rect x="60" y="110" width="180" height="72" rx="12" fill="#081827" stroke="#12b5e5" stroke-width="2"/>
      <text x="150" y="142" fill="#12b5e5" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="700" text-anchor="middle">Faster drafts</text>
      <text x="150" y="162" fill="#64748b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="9" text-anchor="middle">VLAN playbook skeleton</text></g>
    <g id="viz-barrier"><rect x="270" y="110" width="180" height="72" rx="12" fill="#081827" stroke="#6CC04A" stroke-width="2"/>
      <text x="360" y="142" fill="#6CC04A" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="700" text-anchor="middle">Less YAML friction</text>
      <text x="360" y="162" fill="#64748b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="9" text-anchor="middle">JSON ↔ YAML translate</text></g>
    <g id="viz-validate"><rect x="480" y="110" width="180" height="72" rx="12" fill="#081827" stroke="#f59e0b" stroke-width="2"/>
      <text x="570" y="142" fill="#f59e0b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="700" text-anchor="middle">You own design</text>
      <text x="570" y="162" fill="#64748b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="9" text-anchor="middle">VLAN numbers still yours</text></g>
    <text x="360" y="230" fill="#64748b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" text-anchor="middle">AI speeds drafting — not the change ticket</text>`,
			["viz-speed", "viz-barrier", "viz-validate"]
		),

	"risks-privacy-ip-ownership": () =>
		panel(
			"When Speed Creates Exposure",
			`
    ${compactHeader("RISKS", "Speed without guardrails")}
    ${panelBox("viz-privacy", 48, 100, 296, 160, "Data privacy", "#ef4444",
			`<text x="196" y="140" fill="#9fb3c8" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" text-anchor="middle">No prod configs in public LLMs</text>
      <text x="196" y="162" fill="#9fb3c8" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" text-anchor="middle">No secrets in prompts</text>
      <text x="196" y="244" fill="#ef4444" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" font-weight="700" text-anchor="middle">Customer data can leak</text>`, "#1a1215")}
    ${panelBox("viz-ip", 376, 100, 296, 160, "Hallucinated APIs", "#f59e0b",
			`<text x="524" y="140" fill="#9fb3c8" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" text-anchor="middle">iosxe_restconf.push_vlan()</text>
      <text x="524" y="162" fill="#9fb3c8" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" text-anchor="middle">Sounds real — may not exist</text>
      <text x="524" y="244" fill="#f59e0b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" font-weight="700" text-anchor="middle">Validate like human code</text>`)}`,
			["viz-privacy", "viz-ip"]
		),

	"code-validation-after-generation": () =>
		panel(
			"Validate AI-Generated Code",
			`
    ${compactHeader("VALIDATE", "Same CI gates as human-written code")}
    <g id="viz-lint">${codeBlock(80, 110, 560, 120, [
			"$ ansible-lint site.yml",
			"$ yamllint inventory/",
			"$ ansible-playbook site.yml --check",
			"# store prompt + output in ticket",
		])}</g>
    <g id="viz-gate"><rect x="200" y="260" width="320" height="56" rx="12" fill="#112115" stroke="#6CC04A" stroke-width="2"/>
      <text x="360" y="294" fill="#6CC04A" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="12" font-weight="800" text-anchor="middle">Re-prompt if check mode fails</text></g>`,
			["viz-lint", "viz-gate"]
		),

	"security-risks-ai-automation": () =>
		panel(
			"New Threats in AI Workflows",
			`
    ${compactHeader("SECURITY", "Threats in everyday workflows")}
    <g id="viz-inject"><rect x="48" y="110" width="200" height="64" rx="12" fill="#1a1215" stroke="#ef4444" stroke-width="2"/>
      <text x="148" y="148" fill="#ef4444" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="700" text-anchor="middle">Prompt injection</text></g>
    <g id="viz-priv"><rect x="260" y="110" width="200" height="64" rx="12" fill="#081827" stroke="#f59e0b" stroke-width="2"/>
      <text x="360" y="148" fill="#f59e0b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="700" text-anchor="middle">Over-privileged tools</text></g>
    <g id="viz-exfil"><rect x="472" y="110" width="200" height="64" rx="12" fill="#081827" stroke="#a78bfa" stroke-width="2"/>
      <text x="572" y="148" fill="#a78bfa" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="700" text-anchor="middle">Disabled TLS in output</text></g>
    <text x="360" y="220" fill="#64748b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" text-anchor="middle">Sandbox · approval · least privilege</text>`,
			["viz-inject", "viz-priv", "viz-exfil"]
		),

	"governance-for-ai-automation": () =>
		panel(
			"Governance and Policy",
			`
    ${compactHeader("GOVERNANCE", "Policy survives a busy team")}
    <g id="viz-policy"><rect x="80" y="120" width="520" height="160" rx="14" fill="#081827" stroke="#12b5e5" stroke-width="2"/>
      <text x="120" y="156" fill="#12b5e5" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="700">Approved models and endpoints</text>
      <text x="120" y="182" fill="#9fb3c8" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10">Forbidden data classes in prompts</text>
      <text x="120" y="204" fill="#9fb3c8" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10">Log prompts and tool calls</text>
      <text x="120" y="226" fill="#9fb3c8" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10">Secrets from environment — not chat</text>
      <text x="120" y="256" fill="#64748b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10">Aligns with Course 3 secret management</text></g>`,
			["viz-policy"]
		),

	"human-review-vs-auto-merge": () =>
		comparePanels(
			"Human Review vs Auto-Merge",
			{
				id: "viz-human",
				title: "Human in review",
				accent: "#6CC04A",
				fill: "#112115",
				lines: ["Diff and check mode", "Catches logic errors", "Meets policy", "Production safe"],
			},
			{
				id: "viz-auto",
				title: "Auto-merge AI",
				accent: "#ef4444",
				fill: "#1a1215",
				lines: ["Green linter only", "Wrong VLAN site", "Skips judgment", "Outage risk"],
			}
		),

	"story-beat-recap-ai-assisted": () =>
		recapPathLabeled(
			"Theory Complete — AI Code Lab Next",
			"Pause before the lab",
			["Concepts first", "Lint · check mode", "Lab next"],
			["viz-check-1", "viz-check-2", "viz-check-3"]
		),

	"lab-setup-ai-lab": () =>
		labWorkspace(
			"Start netops_ai_lab",
			"netops_ai_lab/",
			["prompts/", "generated/", "reviews/ sign-off"],
			["$ mkdir netops_ai_lab", "$ ansible-lint site.yml", "$ ansible-playbook --check"]
		),

	"ai-assisted-ready-for-mcp": () =>
		moduleHandoffDetail(
			"AI Code Review Complete — MCP Next",
			"Governed draft workflow",
			"Prompt · lint · check · review.log",
			"FastMCP next",
			"Human approval still required"
		),
};
