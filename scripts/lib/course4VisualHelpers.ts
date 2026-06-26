// Premium diagram helpers for Course 4 (ai-in-automation-networks)
// Reuses Course 3 layout primitives; adds AI/MCP/agent-specific builders.

import type { VisualResult } from "./premiumVisualArchetypes";
import {
	FONT,
	arrow,
	bridgeTitle,
	codeBlock,
	compactHeader,
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

export {
	FONT,
	arrow,
	bridgeTitle,
	codeBlock,
	compactHeader,
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
};

export function aiPipeline(
	ariaLabel: string,
	steps: Array<{ id: string; label: string; accent: string }>,
	caption: string
): VisualResult {
	return fourStepFlow(ariaLabel, steps, caption);
}

export function course4Bridge(
	ariaLabel: string,
	from: string,
	middle: string,
	to: string,
	fromSub = "",
	middleSub = "",
	toSub = ""
): VisualResult {
	return panel(
		ariaLabel,
		`
    ${compactHeader("BRIDGE", ariaLabel)}
    <g id="viz-from">
      <rect x="48" y="110" width="200" height="100" rx="14" fill="#112115" stroke="#6CC04A" stroke-width="2"/>
      <text x="148" y="148" fill="#6CC04A" font-family="${FONT}" font-size="11" font-weight="800" text-anchor="middle">${from}</text>
      ${fromSub ? `<text x="148" y="172" fill="#9fb3c8" font-family="${FONT}" font-size="9" text-anchor="middle">${fromSub}</text>` : ""}
    </g>
    ${arrow(248, 160, 288, 160, "viz-bridge-line")}
    <g id="viz-bridge">
      <rect x="288" y="110" width="144" height="100" rx="14" fill="#0b2237" stroke="#12b5e5" stroke-width="2"/>
      <text x="360" y="148" fill="#12b5e5" font-family="${FONT}" font-size="11" font-weight="800" text-anchor="middle">${middle}</text>
      ${middleSub ? `<text x="360" y="172" fill="#9fb3c8" font-family="${FONT}" font-size="9" text-anchor="middle">${middleSub}</text>` : ""}
    </g>
    ${arrow(432, 160, 472, 160)}
    <g id="viz-to">
      <rect x="472" y="110" width="200" height="100" rx="14" fill="#112115" stroke="#f59e0b" stroke-width="2"/>
      <text x="572" y="148" fill="#f59e0b" font-family="${FONT}" font-size="11" font-weight="800" text-anchor="middle">${to}</text>
      ${toSub ? `<text x="572" y="172" fill="#9fb3c8" font-family="${FONT}" font-size="9" text-anchor="middle">${toSub}</text>` : ""}
    </g>`,
		["viz-from", "viz-bridge", "viz-to"]
	);
}

/** Module completion handoff with evidence + next step (matches resolution story beats). */
export function moduleHandoffDetail(
	ariaLabel: string,
	doneTitle: string,
	doneSub: string,
	nextTitle: string,
	nextSub: string
): VisualResult {
	return panel(
		ariaLabel,
		`
    ${compactHeader("CHECKPOINT", ariaLabel)}
    <g id="viz-done">
      <rect x="56" y="130" width="280" height="130" rx="14" fill="#112115" stroke="#6CC04A" stroke-width="2"/>
      <text x="196" y="172" fill="#6CC04A" font-family="${FONT}" font-size="13" font-weight="800" text-anchor="middle">${doneTitle}</text>
      <text x="196" y="200" fill="#9fb3c8" font-family="${FONT}" font-size="10" text-anchor="middle">${doneSub}</text>
      <text x="196" y="222" fill="#64748b" font-family="${FONT}" font-size="9" text-anchor="middle">Artifacts in netops_ai_lab</text>
    </g>
    ${arrow(336, 195, 384, 195, "viz-arrow")}
    <g id="viz-next">
      <rect x="384" y="130" width="280" height="130" rx="14" fill="#0b2237" stroke="#12b5e5" stroke-width="2"/>
      <text x="524" y="172" fill="#12b5e5" font-family="${FONT}" font-size="13" font-weight="800" text-anchor="middle">${nextTitle}</text>
      <text x="524" y="200" fill="#9fb3c8" font-family="${FONT}" font-size="10" text-anchor="middle">${nextSub}</text>
    </g>`,
		["viz-done", "viz-arrow", "viz-next"]
	);
}

/** Recap path with custom aria label and header (matches story-beat slide titles). */
export function recapPathLabeled(
	ariaLabel: string,
	headerTitle: string,
	items: string[],
	ids: string[]
): VisualResult {
	const boxes = items
		.map((item, i) => {
			const x = 70 + i * 170;
			return `<g id="${ids[i]}">
        <rect x="${x}" y="150" width="140" height="64" rx="12" fill="#112115" stroke="#6CC04A" stroke-width="2"/>
        <text x="${x + 70}" y="188" fill="#9fb3c8" font-family="${FONT}" font-size="10" font-weight="700" text-anchor="middle">${item}</text>
      </g>${i < items.length - 1 ? arrow(x + 140, 182, x + 170, 182) : ""}`;
		})
		.join("");
	return panel(ariaLabel, `${compactHeader("RECAP", headerTitle)}${boxes}`, ids);
}

export function mcpStack(ids = ["viz-client", "viz-mcp", "viz-tools"]): string {
	return `
    <g id="${ids[0]}"><rect x="60" y="160" width="160" height="80" rx="12" fill="#081827" stroke="#12b5e5" stroke-width="2"/>
      <text x="140" y="195" fill="#12b5e5" font-family="${FONT}" font-size="11" font-weight="700" text-anchor="middle">LLM client</text>
      <text x="140" y="218" fill="#64748b" font-family="${FONT}" font-size="9" text-anchor="middle">orchestrator</text></g>
    ${arrow(220, 200, 280, 200)}
    <g id="${ids[1]}"><rect x="280" y="150" width="160" height="100" rx="12" fill="#0b2237" stroke="#6CC04A" stroke-width="2"/>
      <text x="360" y="188" fill="#6CC04A" font-family="${FONT}" font-size="11" font-weight="800" text-anchor="middle">MCP server</text>
      <text x="360" y="212" fill="#9fb3c8" font-family="${FONT}" font-size="9" text-anchor="middle">tool registry</text></g>
    ${arrow(440, 200, 500, 200)}
    <g id="${ids[2]}"><rect x="500" y="160" width="160" height="80" rx="12" fill="#081827" stroke="#f59e0b" stroke-width="2"/>
      <text x="580" y="195" fill="#f59e0b" font-family="${FONT}" font-size="11" font-weight="700" text-anchor="middle">Network tools</text>
      <text x="580" y="218" fill="#64748b" font-family="${FONT}" font-size="9" text-anchor="middle">read-only first</text></g>`;
}

export function agentLoop(ids = ["viz-think", "viz-act", "viz-observe"]): string {
	return `
    <g id="${ids[0]}"><circle cx="200" cy="210" r="40" fill="#082f49" stroke="#12b5e5" stroke-width="3"/>
      <text x="200" y="216" fill="#f8fafc" font-family="${FONT}" font-size="11" font-weight="800" text-anchor="middle">Think</text></g>
    ${arrow(240, 210, 310, 210)}
    <g id="${ids[1]}"><circle cx="360" cy="210" r="40" fill="#163119" stroke="#6CC04A" stroke-width="3"/>
      <text x="360" y="216" fill="#f8fafc" font-family="${FONT}" font-size="11" font-weight="800" text-anchor="middle">Act</text></g>
    ${arrow(400, 210, 470, 210)}
    <g id="${ids[2]}"><circle cx="520" cy="210" r="40" fill="#3a2508" stroke="#f59e0b" stroke-width="3"/>
      <text x="520" y="216" fill="#f8fafc" font-family="${FONT}" font-size="11" font-weight="800" text-anchor="middle">Observe</text></g>
    <path d="M520 250 Q360 320 200 250" fill="none" stroke="#a78bfa" stroke-width="2" stroke-dasharray="6 5"/>`;
}

export function guardrailBar(text: string, sub: string): string {
	return domainBar(text, sub, "viz-guardrail", 388);
}

/** Softer certification slide — avoids syllabus numbering on diagrams */
export function certificationPanel(skills: string, subtitle: string): VisualResult {
	return panel(
		"Certification alignment",
		`
    ${compactHeader("CERT PREP", "How this module maps")}
    <g id="viz-badge">
      <rect x="80" y="110" width="560" height="150" rx="14" fill="#0b2237" stroke="#12b5e5" stroke-width="2"/>
      <text x="360" y="148" fill="#12b5e5" font-family="${FONT}" font-size="13" font-weight="800" text-anchor="middle">Skills you practiced</text>
      <text x="360" y="178" fill="#9fb3c8" font-family="${FONT}" font-size="11" text-anchor="middle">${skills}</text>
      <text x="360" y="210" fill="#64748b" font-family="${FONT}" font-size="10" text-anchor="middle">${subtitle}</text>
    </g>
    ${domainBar("CCNP Automation scenarios", "Prove skills with lab artifacts")}`,
		["viz-badge", "viz-guardrail"]
	);
}
