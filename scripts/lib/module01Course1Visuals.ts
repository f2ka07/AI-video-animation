// Hand-tuned module 01 visuals for course 1 — coordinates relative to inner card (48,48 origin)

import { buildVisualPanelSvg } from "./premiumVisualPanel";
import type { VisualResult } from "./premiumVisualArchetypes";

const FONT = "Inter,Segoe UI,Arial,sans-serif";

function panel(ariaLabel: string, content: string, groupIds: string[] = []): VisualResult {
	return {
		svg: buildVisualPanelSvg({ ariaLabel, visualContent: content }),
		groupIds,
	};
}

function box(
	x: number,
	y: number,
	w: number,
	h: number,
	label: string,
	accent: string,
	id?: string
): string {
	const idAttr = id ? ` id="${id}"` : "";
	return `<g${idAttr}>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="#081827" stroke="${accent}" stroke-width="2"/>
    <text x="${x + w / 2}" y="${y + h / 2 + 5}" fill="${accent}" font-family="${FONT}" font-size="14" font-weight="700" text-anchor="middle">${label}</text>
  </g>`;
}

function arrow(x1: number, y1: number, x2: number, y2: number, id?: string): string {
	const idAttr = id ? ` id="${id}"` : "";
	return `<line${idAttr} x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#049FD9" stroke-width="3" stroke-linecap="round"/>`;
}

function switchIcon(cx: number, cy: number, id?: string): string {
	const idAttr = id ? ` id="${id}"` : "";
	return `<g${idAttr}>
    <rect x="${cx - 40}" y="${cy - 28}" width="80" height="56" rx="10" fill="#081827" stroke="#12b5e5" stroke-width="2"/>
    <path d="M${cx - 20} ${cy + 12}h40M${cx} ${cy - 8}v40" stroke="#12b5e5" stroke-width="2" stroke-linecap="round"/>
    <text x="${cx}" y="${cy + 44}" fill="#9fb3c8" font-family="${FONT}" font-size="11" text-anchor="middle">SW1</text>
  </g>`;
}

export const MODULE01_COURSE1_VISUALS: Record<string, () => VisualResult> = {
	"manual-cli-challenges": () =>
		panel(
			"Manual CLI scale stress",
			`
    <g id="viz-devices">
      ${[0, 1, 2, 3, 4, 5]
				.map((i) => {
					const col = i % 3;
					const row = Math.floor(i / 3);
					const x = 100 + col * 72;
					const y = 100 + row * 64;
					const accent = i < 3 ? "#ef4444" : "#f59e0b";
					return `<rect x="${x}" y="${y}" width="52" height="38" rx="8" fill="#081827" stroke="${accent}" stroke-width="2"/>
        <text x="${x + 26}" y="${y + 54}" fill="#9fb3c8" font-family="${FONT}" font-size="10" text-anchor="middle">SW${i + 1}</text>`;
				})
				.join("")}
    </g>
    <g id="viz-engineer">
      <rect x="430" y="200" width="110" height="80" rx="12" fill="#0b2237" stroke="#12b5e5" stroke-width="2"/>
      <circle cx="485" cy="228" r="14" fill="#082f49" stroke="#12b5e5" stroke-width="2"/>
      <text x="485" y="300" fill="#9fb3c8" font-family="${FONT}" font-size="12" text-anchor="middle">One engineer</text>
    </g>
    <g id="viz-stress">
      <path d="M320 180 Q380 120 440 180" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="6 5"/>
      <path d="M320 220 Q380 280 440 220" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="6 5"/>
      <text x="380" y="90" fill="#ef4444" font-family="${FONT}" font-size="13" font-weight="800" text-anchor="middle">Same change on every switch</text>
    </g>`,
			["viz-devices", "viz-engineer", "viz-stress"]
		),

	"evolution-of-network-operations": () =>
		panel(
			"Operations evolution timeline",
			`
    ${arrow(130, 220, 560, 220, "viz-line")}
    ${box(80, 180, 100, 80, "CLI", "#12b5e5", "viz-step-cli")}
    ${box(210, 180, 100, 80, "Scripts", "#6CC04A", "viz-step-script")}
    ${box(340, 180, 100, 80, "APIs", "#f59e0b", "viz-step-api")}
    ${box(470, 180, 100, 80, "Git/IaC", "#a78bfa", "viz-step-git")}
    <text x="336" y="320" fill="#64748b" font-family="${FONT}" font-size="12" text-anchor="middle">Each step removes copy-paste</text>`,
			["viz-step-cli", "viz-step-script", "viz-step-api", "viz-step-git"]
		),

	"what-automation-means": () =>
		panel(
			"Automation workflow pipeline",
			`
    ${arrow(175, 210, 225, 210)}
    ${arrow(325, 210, 375, 210)}
    ${arrow(475, 210, 525, 210)}
    ${box(60, 170, 115, 80, "Describe", "#12b5e5", "viz-step-1")}
    ${box(210, 170, 115, 80, "Push", "#6CC04A", "viz-step-2")}
    ${box(360, 170, 115, 80, "Verify", "#f59e0b", "viz-step-3")}
    ${box(510, 170, 115, 80, "Record", "#a78bfa", "viz-step-4")}
    <text x="336" y="300" fill="#64748b" font-family="${FONT}" font-size="12" text-anchor="middle">Repeatable workflow — you keep the judgment</text>`,
			["viz-step-1", "viz-step-2", "viz-step-3", "viz-step-4"]
		),

	"declarative-vs-imperative": () =>
		panel(
			"Declarative outcome vs imperative steps",
			`
    ${switchIcon(336, 280, "viz-switch")}
    <g id="viz-declarative">
      <rect x="80" y="80" width="200" height="72" rx="14" fill="#112115" stroke="#6CC04A" stroke-width="2"/>
      <text x="180" y="110" fill="#6CC04A" font-family="${FONT}" font-size="13" font-weight="800" text-anchor="middle">Desired state</text>
      <text x="180" y="132" fill="#9fb3c8" font-family="monospace" font-size="12" text-anchor="middle">vlan 100 on Gi0/1</text>
      ${arrow(180, 152, 300, 250)}
    </g>
    <g id="viz-imperative">
      <rect x="392" y="80" width="200" height="110" rx="14" fill="#1a1215" stroke="#ef4444" stroke-width="2"/>
      <text x="412" y="108" fill="#f8fafc" font-family="monospace" font-size="12">1. conf t</text>
      <text x="412" y="128" fill="#f8fafc" font-family="monospace" font-size="12">2. vlan 100</text>
      <text x="412" y="148" fill="#f8fafc" font-family="monospace" font-size="12">3. int Gi0/1</text>
      <text x="492" y="175" fill="#ef4444" font-family="${FONT}" font-size="11" text-anchor="middle">step by step</text>
      ${arrow(492, 190, 370, 250)}
    </g>`,
			["viz-switch", "viz-declarative", "viz-imperative"]
		),

	"importance-of-idempotency": () =>
		panel(
			"Idempotent runs converge",
			`
    ${box(100, 100, 130, 60, "Run #1", "#12b5e5", "viz-run-once")}
    ${box(442, 100, 130, 60, "Run #5", "#f59e0b", "viz-run-again")}
    ${arrow(230, 130, 300, 200)}
    ${arrow(442, 130, 372, 200)}
    <g id="viz-same-state">
      <rect x="236" y="200" width="200" height="90" rx="16" fill="#112115" stroke="#6CC04A" stroke-width="2"/>
      <circle cx="336" cy="235" r="22" fill="#163119" stroke="#6CC04A" stroke-width="2"/>
      <text x="336" y="241" fill="#6CC04A" font-family="${FONT}" font-size="18" font-weight="900" text-anchor="middle">OK</text>
      <text x="336" y="272" fill="#9fb3c8" font-family="${FONT}" font-size="12" text-anchor="middle">Same VLAN state — no duplicates</text>
    </g>`,
			["viz-run-once", "viz-run-again", "viz-same-state"]
		),

	"agentless-vs-controller": () =>
		panel(
			"Agentless runner vs controller",
			`
    <line x1="336" y1="60" x2="336" y2="340" stroke="#35536f" stroke-width="1"/>
    <g id="viz-agentless">
      <text x="168" y="78" fill="#12b5e5" font-family="${FONT}" font-size="12" font-weight="800" text-anchor="middle">Agentless</text>
      <rect x="88" y="200" width="90" height="64" rx="10" fill="#0b2237" stroke="#12b5e5" stroke-width="2"/>
      <text x="133" y="238" fill="#12b5e5" font-family="${FONT}" font-size="12" font-weight="700" text-anchor="middle">Runner</text>
      <line x1="178" y1="210" x2="230" y2="120" stroke="#6CC04A" stroke-width="2"/>
      <line x1="178" y1="232" x2="230" y2="180" stroke="#6CC04A" stroke-width="2"/>
      <line x1="178" y1="254" x2="230" y2="240" stroke="#6CC04A" stroke-width="2"/>
      <rect x="230" y="104" width="48" height="34" rx="6" fill="#081827" stroke="#6CC04A" stroke-width="2"/>
      <rect x="230" y="164" width="48" height="34" rx="6" fill="#081827" stroke="#6CC04A" stroke-width="2"/>
      <rect x="230" y="224" width="48" height="34" rx="6" fill="#081827" stroke="#6CC04A" stroke-width="2"/>
      <text x="254" y="300" fill="#64748b" font-family="${FONT}" font-size="10" text-anchor="middle">SSH/API only</text>
    </g>
    <g id="viz-controller">
      <text x="504" y="78" fill="#a78bfa" font-family="${FONT}" font-size="12" font-weight="800" text-anchor="middle">Controller</text>
      <rect x="430" y="104" width="48" height="34" rx="6" fill="#081827" stroke="#a78bfa" stroke-width="2"/>
      <rect x="430" y="164" width="48" height="34" rx="6" fill="#081827" stroke="#a78bfa" stroke-width="2"/>
      <rect x="430" y="224" width="48" height="34" rx="6" fill="#081827" stroke="#a78bfa" stroke-width="2"/>
      <line x1="454" y1="138" x2="504" y2="230" stroke="#a78bfa" stroke-width="2"/>
      <line x1="454" y1="198" x2="504" y2="250" stroke="#a78bfa" stroke-width="2"/>
      <line x1="454" y1="258" x2="504" y2="270" stroke="#a78bfa" stroke-width="2"/>
      <rect x="454" y="230" width="100" height="72" rx="12" fill="#1f1b2e" stroke="#a78bfa" stroke-width="2"/>
      <text x="504" y="272" fill="#a78bfa" font-family="${FONT}" font-size="12" font-weight="800" text-anchor="middle">Controller</text>
      <text x="504" y="330" fill="#64748b" font-family="${FONT}" font-size="10" text-anchor="middle">Audit · RBAC · jobs</text>
    </g>`,
			["viz-agentless", "viz-controller"]
		),

	"architecture-patterns-overview": () =>
		panel(
			"Four architecture pillars",
			`
    ${box(60, 160, 120, 70, "Truth", "#12b5e5", "viz-pillar-1")}
    ${box(200, 160, 120, 70, "Inventory", "#6CC04A", "viz-pillar-2")}
    ${box(340, 160, 120, 70, "Runner", "#f59e0b", "viz-pillar-3")}
    ${box(480, 160, 120, 70, "Validate", "#a78bfa", "viz-pillar-4")}
    ${arrow(180, 195, 200, 195)}
    ${arrow(320, 195, 340, 195)}
    ${arrow(460, 195, 480, 195)}
    <text x="336" y="300" fill="#64748b" font-family="${FONT}" font-size="12" text-anchor="middle">Source of truth through validation</text>`,
			["viz-pillar-1", "viz-pillar-2", "viz-pillar-3", "viz-pillar-4"]
		),

	"story-beat-recap": () =>
		panel(
			"Theory checkpoint",
			`
    ${arrow(100, 200, 560, 200)}
    ${box(70, 170, 100, 60, "Concepts", "#6CC04A", "viz-check-1")}
    ${box(250, 170, 100, 60, "Terms", "#6CC04A", "viz-check-2")}
    ${box(430, 170, 100, 60, "Lab next", "#12b5e5", "viz-check-3")}
    <text x="336" y="300" fill="#64748b" font-family="${FONT}" font-size="12" text-anchor="middle">Ready for hands-on setup</text>`,
			["viz-check-1", "viz-check-2", "viz-check-3"]
		),

	"lab-setup-introduction": () =>
		panel(
			"Lab workspace",
			`
    <g id="viz-folder">
      <rect x="80" y="100" width="200" height="180" rx="14" fill="#081827" stroke="#203a56" stroke-width="1.5"/>
      <text x="104" y="132" fill="#12b5e5" font-family="monospace" font-size="13" font-weight="700">automation_project/</text>
      <text x="120" y="158" fill="#9fb3c8" font-family="monospace" font-size="12">inventory.yml</text>
      <text x="120" y="180" fill="#6CC04A" font-family="monospace" font-size="12">requirements.txt</text>
    </g>
    <g id="viz-terminal">
      <rect x="320" y="110" width="280" height="170" rx="12" fill="#020617" stroke="#12b5e5" stroke-width="2"/>
      <circle cx="344" cy="132" r="5" fill="#ef4444"/><circle cx="360" cy="132" r="5" fill="#f59e0b"/><circle cx="376" cy="132" r="5" fill="#6CC04A"/>
      <text x="336" y="162" fill="#6CC04A" font-family="monospace" font-size="12">$ python3 --version</text>
      <text x="336" y="184" fill="#9fb3c8" font-family="monospace" font-size="12">$ python3 -m venv env</text>
      <text x="336" y="206" fill="#9fb3c8" font-family="monospace" font-size="12">$ source env/bin/activate</text>
    </g>
    <g id="viz-check">
      <circle cx="336" cy="340" r="24" fill="#112115" stroke="#6CC04A" stroke-width="2"/>
      <path d="M324 340l8 8 16-18" fill="none" stroke="#6CC04A" stroke-width="3" stroke-linecap="round"/>
    </g>`,
			["viz-folder", "viz-terminal", "viz-check"]
		),

	"choose-your-lab-environment": () =>
		panel(
			"Pick your lab environment",
			`
    ${box(70, 140, 120, 70, "WSL2", "#12b5e5", "viz-env-1")}
    ${box(210, 140, 120, 70, "Mac Terminal", "#6CC04A", "viz-env-2")}
    ${box(350, 140, 120, 70, "Linux VM", "#f59e0b", "viz-env-3")}
    ${box(490, 140, 120, 70, "Cloud lab", "#a78bfa", "viz-env-4")}
    <text x="336" y="280" fill="#64748b" font-family="${FONT}" font-size="12" text-anchor="middle">Pick one — stay with it for the course</text>`,
			["viz-env-1", "viz-env-2", "viz-env-3", "viz-env-4"]
		),

	"open-your-terminal": () =>
		panel(
			"Open your terminal",
			`
    <g id="viz-term">
      <rect x="100" y="90" width="472" height="280" rx="16" fill="#020617" stroke="#12b5e5" stroke-width="2"/>
      <circle cx="128" cy="118" r="6" fill="#ef4444"/><circle cx="148" cy="118" r="6" fill="#f59e0b"/><circle cx="168" cy="118" r="6" fill="#6CC04A"/>
      <text x="120" y="158" fill="#64748b" font-family="monospace" font-size="13">$ pwd</text>
      <text x="120" y="182" fill="#9fb3c8" font-family="monospace" font-size="13">/home/student</text>
      <text x="120" y="214" fill="#64748b" font-family="monospace" font-size="13">$ ls</text>
      <text x="120" y="238" fill="#9fb3c8" font-family="monospace" font-size="13">Documents  labs</text>
    </g>
    <rect id="viz-cursor" x="200" y="248" width="8" height="16" fill="#12b5e5"/>`,
			["viz-term", "viz-cursor"]
		),

	"story-beat-common-mistake": () =>
		panel(
			"Common mistake vs safer pattern",
			`
    <g id="viz-warn">
      <polygon points="160,100 240,220 80,220" fill="#2a1f08" stroke="#f59e0b" stroke-width="2"/>
      <text x="160" y="185" fill="#f59e0b" font-family="${FONT}" font-size="22" font-weight="900" text-anchor="middle">!</text>
      <text x="160" y="250" fill="#9fb3c8" font-family="${FONT}" font-size="12" text-anchor="middle">Skip venv / wrong folder</text>
    </g>
    ${arrow(260, 180, 360, 180)}
    <g id="viz-fix">
      <rect x="380" y="130" width="180" height="100" rx="14" fill="#112115" stroke="#6CC04A" stroke-width="2"/>
      <text x="470" y="170" fill="#6CC04A" font-family="${FONT}" font-size="14" font-weight="800" text-anchor="middle">Activate venv</text>
      <text x="470" y="195" fill="#9fb3c8" font-family="${FONT}" font-size="12" text-anchor="middle">cd project first</text>
    </g>`,
			["viz-warn", "viz-fix"]
		),

	"certification-alignment": () =>
		panel(
			"CCNP exam alignment",
			`
    ${arrow(120, 200, 540, 200)}
    ${box(80, 170, 90, 60, "Learn", "#12b5e5", "viz-exam-1")}
    ${box(250, 170, 90, 60, "Lab", "#6CC04A", "viz-exam-2")}
    ${box(420, 170, 90, 60, "Exam", "#f59e0b", "viz-exam-3")}
    <g id="viz-badge">
      <rect x="218" y="280" width="236" height="80" rx="14" fill="#0b2237" stroke="#12b5e5" stroke-width="2"/>
      <text x="336" y="312" fill="#12b5e5" font-family="${FONT}" font-size="14" font-weight="900" text-anchor="middle">CCNP AUTOMATION</text>
      <text x="336" y="336" fill="#9fb3c8" font-family="${FONT}" font-size="11" text-anchor="middle">Foundation module objectives</text>
    </g>`,
			["viz-exam-1", "viz-exam-2", "viz-exam-3", "viz-badge"]
		),

	"automation-as-infrastructure": () =>
		panel(
			"Automation as infrastructure",
			`
    ${box(100, 160, 140, 80, "Git repo", "#12b5e5", "viz-git")}
    ${arrow(240, 200, 300, 200)}
    ${box(300, 160, 140, 80, "Pipeline", "#6CC04A", "viz-pipe")}
    ${arrow(440, 200, 500, 200)}
    ${switchIcon(540, 200, "viz-net")}
    <text x="336" y="300" fill="#64748b" font-family="${FONT}" font-size="12" text-anchor="middle">Versioned intent drives the network</text>`,
			["viz-git", "viz-pipe", "viz-net"]
		),
};
