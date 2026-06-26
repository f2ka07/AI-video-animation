// Conceptual visual metaphors for the right panel — never duplicate slide bullets

import {
	buildVisualPanelSvg,
	caption,
	connector,
	deviceBox,
	g,
	nodeCircle,
} from "./premiumVisualPanel";

export interface VisualResult {
	svg: string;
	groupIds: string[];
}

const FONT = "Inter,Segoe UI,Arial,sans-serif";

function panel(ariaLabel: string, content: string, groupIds: string[]): VisualResult {
	return {
		svg: buildVisualPanelSvg({ ariaLabel, visualContent: content }),
		groupIds,
	};
}

export function visualForSlideName(name: string, type: string): VisualResult | null {
	const n = name.toLowerCase();

	if (n.includes("certification-alignment")) return visualExamWorkflow();
	if (n.includes("lab-setup")) return visualLabWorkspace();
	if (n.includes("story-beat-recap")) return visualCheckpointPath();
	if (n.includes("story-beat-common-mistake")) return visualWarningPath();
	if (n.includes("-ready-") || n.includes("bridge") || n.includes("complete")) return visualModuleHandoff();
	if (n.includes("resume") || n.includes("open-your-terminal") || n.includes("choose-your-lab")) {
		return visualTerminalResume();
	}
	if (n.includes("agentless") || (n.includes("controller") && n.includes("-vs-"))) return visualAgentTopology();
	if (type === "comparison" || n.includes("-vs-") || n.includes("declarative-vs")) {
		return visualComparisonSplit(n);
	}
	if (n.includes("manual-cli") || n.includes("copy-paste") || n.includes("saving-config")) {
		return visualScaleStress();
	}
	if (n.includes("evolution")) return visualOpsTimeline();
	if (n.includes("idempotency") || n.includes("idempotent")) return visualIdempotencyLoop();
	if (n.includes("architecture") || n.includes("pillars") || n.includes("integrates-four")) {
		return visualFourPillars();
	}
	if (n.includes("git") && (n.includes("commit") || n.includes("save-point"))) return visualCommitChain();
	if (n.includes("branch") || n.includes("merge") || n.includes("conflict")) return visualBranchGraph();
	if (n.includes("cherry") || n.includes("reset") || n.includes("revert") || n.includes("checkout")) {
		return visualGitCommandGrid();
	}
	if (n.includes("folder-vs") || n.includes("repository")) return visualFolderVsRepo();
	if (n.includes("what-git") || n.includes("plain-language")) return visualGitWatchCommitBranch();
	if (n.includes("cicd") || n.includes("pipeline")) return visualPipelineStages();
	if (n.includes("python")) return visualPythonToDevices();
	if (n.includes("yaml") || n.includes("json") || n.includes("xml") || n.includes("data-structure")) {
		return visualDataFormats();
	}
	if (n.includes("netmiko") || n.includes("connection")) return visualSshSession();
	if (n.includes("restconf") || n.includes("rest-for") || n.includes("what-is-rest") || n.includes("apis-beyond")) {
		return visualRestExchange();
	}
	if (n.includes("yang")) return visualYangTree();
	if (n.includes("http-error") || n.includes("pagination") || n.includes("auth-and-rate")) {
		return visualApiGuardrails();
	}
	if (n.includes("ansible")) return visualPlaybookLayers();
	if (n.includes("terraform")) return visualTerraformFlow();
	if (n.includes("toolchain") || n.includes("orchestration") || n.includes("tool-matrix")) {
		return visualToolchainStack();
	}
	if (n.includes("capstone") || n.includes("enterprise-branch") || n.includes("reference-design")) {
		return visualBranchTopology();
	}
	if (n.includes("runbook") || n.includes("verify")) return visualRunbookFlow();
	if (n.includes("automation") && type === "title") return visualAutomationLoop();
	if (n.includes("what-automation")) return visualAutomationLoop();
	if (n.includes("infrastructure")) return visualFourPillars();
	if (n.includes("telemetry") || n.includes("mdt") || n.includes("gnmi") || n.includes("streaming") || n.includes("polling")) {
		return visualTelemetryStream();
	}
	if (n.includes("syslog") || n.includes("logging") || n.includes("fluent") || n.includes("structured-vs")) {
		return visualLoggingPipeline();
	}
	if (n.includes("pyats") || n.includes("validation") || n.includes("rollback") || n.includes("change-assurance")) {
		return visualValidationGate();
	}
	if (n.includes("tls") || n.includes("pki") || n.includes("cert") || n.includes("secret") || n.includes("vault")) {
		return visualTlsChain();
	}
	if (n.includes("ops-capstone") || n.includes("capstone")) return visualOpsCapstone();
	if (n.includes("mcp") || n.includes("fastmcp")) return visualMcpStack();
	if (n.includes("agent") || n.includes("conversational")) return visualAgentLoop();
	if (n.includes("hallucin") || n.includes("benchmark") || n.includes("evaluate") || n.includes("guardrail")) {
		return visualAiEvaluation();
	}
	if (n.includes("governance") || n.includes("ai-assisted") || n.includes("ai-coding") || n.includes("llm")) {
		return visualAiGovernance();
	}

	return visualAutomationLoop();
}

function visualScaleStress(): VisualResult {
	const ids = ["viz-devices", "viz-engineer", "viz-stress"];
	const content = `
    ${g("viz-devices", "translate(80 120)", `
      ${deviceBox(0, 0, "SW1", "#ef4444")}
      ${deviceBox(80, 0, "SW2", "#ef4444")}
      ${deviceBox(160, 0, "SW3", "#ef4444")}
      ${deviceBox(40, 70, "SW4", "#f59e0b")}
      ${deviceBox(120, 70, "SW5", "#f59e0b")}
      ${deviceBox(200, 70, "SW6", "#f59e0b")}
    `)}
    ${g("viz-engineer", "translate(420 200)", `
      <rect x="0" y="0" width="120" height="90" rx="14" fill="#081827" stroke="#12b5e5" stroke-width="2"/>
      <circle cx="60" cy="28" r="16" fill="#0b2237" stroke="#12b5e5" stroke-width="2"/>
      <rect x="20" y="52" width="80" height="30" rx="8" fill="#0b2237" stroke="#35536f"/>
      <text x="60" y="115" fill="#9fb3c8" font-family="${FONT}" font-size="12" text-anchor="middle">One engineer</text>
    `)}
    ${g("viz-stress", "translate(260 80)", `
      <path d="M300 180 Q360 100 420 180" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="5 6" opacity="0.8"/>
      <path d="M300 200 Q360 280 420 200" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="5 6" opacity="0.8"/>
      <text x="360" y="60" fill="#ef4444" font-family="${FONT}" font-size="14" font-weight="800" text-anchor="middle">Manual CLI</text>
      <text x="360" y="340" fill="#64748b" font-family="${FONT}" font-size="12" text-anchor="middle">Same change × N devices</text>
    `)}
  `;
	return panel("Scale stress from manual CLI", content, ids);
}

function visualOpsTimeline(): VisualResult {
	const ids = ["viz-step-cli", "viz-step-script", "viz-step-api", "viz-step-git"];
	const content = `
    ${connector("viz-line", 100, 200, 620, 200, true)}
    ${nodeCircle("viz-step-cli", 130, 200, 36, "#12b5e5", "#082f49", "M20 20h24M32 12v24", "CLI")}
    ${nodeCircle("viz-step-script", 280, 200, 36, "#6CC04A", "#163119", "M14 32l8-16 8 16 8-16", "Scripts")}
    ${nodeCircle("viz-step-api", 430, 200, 36, "#f59e0b", "#3a2508", "M12 20h32M20 12v24", "APIs")}
    ${nodeCircle("viz-step-git", 580, 200, 36, "#a78bfa", "#2b2350", "M20 28h16M28 20v16", "Git / IaC")}
    ${caption("viz-cap", 360, 320, "Operations maturity over time")}
  `;
	return panel("Network operations evolution timeline", content, ids);
}

function visualAutomationLoop(): VisualResult {
	const ids = ["viz-intent", "viz-apply", "viz-verify", "viz-record"];
	const content = `
    ${connector("viz-loop-1", 360, 120, 500, 200)}
    ${connector("viz-loop-2", 500, 280, 360, 360)}
    ${connector("viz-loop-3", 220, 280, 220, 200)}
    ${connector("viz-loop-4", 220, 120, 360, 120)}
    ${nodeCircle("viz-intent", 360, 100, 40, "#12b5e5", "#082f49", "M20 20h24M32 12v24", "Intent")}
    ${nodeCircle("viz-apply", 520, 240, 40, "#6CC04A", "#163119", "M14 32l8-16 8 16", "Apply")}
    ${nodeCircle("viz-verify", 360, 380, 40, "#f59e0b", "#3a2508", "M16 24l8 8 16-18", "Verify")}
    ${nodeCircle("viz-record", 200, 240, 40, "#a78bfa", "#2b2350", "M12 20h32M20 12v24", "Record")}
    ${caption("viz-cap", 360, 480, "Repeatable automation workflow")}
  `;
	return panel("Automation workflow loop", content, ids);
}

function visualComparisonSplit(name: string): VisualResult {
	const leftIsDeclarative = name.includes("declarative") || name.includes("low-code") || name.includes("agentless");
	const ids = ["viz-left-meta", "viz-right-meta", "viz-divider"];

	const leftVisual = leftIsDeclarative
		? `<g id="viz-left-meta">
        <rect x="60" y="100" width="200" height="160" rx="16" fill="#112115" stroke="#6CC04A" stroke-width="2"/>
        <circle cx="160" cy="150" r="28" fill="#163119" stroke="#6CC04A" stroke-width="2"/>
        <text x="160" y="156" fill="#6CC04A" font-family="${FONT}" font-size="22" font-weight="900" text-anchor="middle">OK</text>
        <text x="160" y="210" fill="#9fb3c8" font-family="${FONT}" font-size="12" text-anchor="middle">Desired state</text>
        <text x="160" y="230" fill="#64748b" font-family="${FONT}" font-size="11" text-anchor="middle">Outcome-first</text>
      </g>`
		: `<g id="viz-left-meta">
        <rect x="60" y="100" width="200" height="160" rx="16" fill="#1a1215" stroke="#ef4444" stroke-width="2"/>
        <text x="90" y="140" fill="#f8fafc" font-family="monospace" font-size="13">1. conf t</text>
        <text x="90" y="165" fill="#f8fafc" font-family="monospace" font-size="13">2. vlan 100</text>
        <text x="90" y="190" fill="#f8fafc" font-family="monospace" font-size="13">3. name HR</text>
        <text x="90" y="215" fill="#64748b" font-family="monospace" font-size="13">4. ...</text>
        <text x="160" y="250" fill="#9fb3c8" font-family="${FONT}" font-size="12" text-anchor="middle">Step sequence</text>
      </g>`;

	const rightVisual = leftIsDeclarative
		? `<g id="viz-right-meta">
        <rect x="400" y="100" width="200" height="160" rx="16" fill="#1a1215" stroke="#ef4444" stroke-width="2"/>
        <text x="430" y="140" fill="#f8fafc" font-family="monospace" font-size="13">1. conf t</text>
        <text x="430" y="165" fill="#f8fafc" font-family="monospace" font-size="13">2. vlan 100</text>
        <text x="430" y="190" fill="#f8fafc" font-family="monospace" font-size="13">3. name HR</text>
        <text x="500" y="250" fill="#9fb3c8" font-family="${FONT}" font-size="12" text-anchor="middle">Command steps</text>
      </g>`
		: `<g id="viz-right-meta">
        <rect x="400" y="100" width="200" height="160" rx="16" fill="#112115" stroke="#6CC04A" stroke-width="2"/>
        <circle cx="500" cy="150" r="28" fill="#163119" stroke="#6CC04A" stroke-width="2"/>
        <text x="500" y="156" fill="#6CC04A" font-family="${FONT}" font-size="22" font-weight="900" text-anchor="middle">OK</text>
        <text x="500" y="210" fill="#9fb3c8" font-family="${FONT}" font-size="12" text-anchor="middle">Target outcome</text>
      </g>`;

	const content = `
    <line id="viz-divider" x1="360" y1="80" x2="360" y2="400" stroke="#35536f" stroke-width="2"/>
    <text x="360" y="300" fill="#64748b" font-family="${FONT}" font-size="14" font-weight="700" text-anchor="middle">vs</text>
    ${leftVisual}
    ${rightVisual}
    ${caption("viz-cap", 360, 440, "Two mental models — same network, different control")}
  `;
	return panel("Comparison visual metaphor", content, ids);
}

function visualIdempotencyLoop(): VisualResult {
	const ids = ["viz-run-once", "viz-run-again", "viz-same-state"];
	const content = `
    ${g("viz-run-once", "translate(140 140)", `
      <rect width="160" height="70" rx="14" fill="#0b2237" stroke="#12b5e5" stroke-width="2"/>
      <text x="80" y="42" fill="#12b5e5" font-family="${FONT}" font-size="14" font-weight="700" text-anchor="middle">Run #1</text>
    `)}
    ${g("viz-run-again", "translate(420 140)", `
      <rect width="160" height="70" rx="14" fill="#2a1f08" stroke="#f59e0b" stroke-width="2"/>
      <text x="80" y="42" fill="#f59e0b" font-family="${FONT}" font-size="14" font-weight="700" text-anchor="middle">Run #5</text>
    `)}
    ${connector("viz-arrow-1", 300, 175, 420, 175)}
    ${connector("viz-arrow-2", 220, 240, 220, 320)}
    ${connector("viz-arrow-3", 500, 240, 500, 320)}
    ${g("viz-same-state", "translate(220 340)", `
      <rect width="280" height="90" rx="16" fill="#112115" stroke="#6CC04A" stroke-width="2"/>
      <text x="140" y="38" fill="#6CC04A" font-family="${FONT}" font-size="16" font-weight="800" text-anchor="middle">Same correct state</text>
      <text x="140" y="62" fill="#9fb3c8" font-family="${FONT}" font-size="12" text-anchor="middle">No duplicate VLANs or drift</text>
    `)}
  `;
	return panel("Idempotent runs converge to one state", content, ids);
}

function visualAgentTopology(): VisualResult {
	const ids = ["viz-runner", "viz-devices", "viz-controller"];
	const content = `
    ${g("viz-runner", "translate(80 260)", `
      <rect width="100" height="80" rx="12" fill="#0b2237" stroke="#12b5e5" stroke-width="2"/>
      <text x="50" y="48" fill="#12b5e5" font-family="${FONT}" font-size="13" font-weight="700" text-anchor="middle">Runner</text>
    `)}
    ${g("viz-devices", "translate(300 120)", `
      ${deviceBox(0, 0, "SW-A", "#6CC04A")}
      ${deviceBox(90, 60, "SW-B", "#6CC04A")}
      ${deviceBox(180, 0, "SW-C", "#6CC04A")}
      <text x="120" y="150" fill="#9fb3c8" font-family="${FONT}" font-size="12" text-anchor="middle">Agentless SSH/API</text>
    `)}
    ${g("viz-controller", "translate(480 220)", `
      <rect width="140" height="120" rx="16" fill="#1f1b2e" stroke="#a78bfa" stroke-width="2"/>
      <text x="70" y="50" fill="#a78bfa" font-family="${FONT}" font-size="14" font-weight="800" text-anchor="middle">Controller</text>
      <text x="70" y="78" fill="#9fb3c8" font-family="${FONT}" font-size="11" text-anchor="middle">Jobs · audit · RBAC</text>
    `)}
    ${connector("viz-link-1", 180, 300, 300, 180)}
    ${connector("viz-link-2", 480, 280, 390, 180)}
  `;
	return panel("Agentless runner vs central controller", content, ids);
}

function visualFourPillars(): VisualResult {
	const ids = ["viz-pillar-1", "viz-pillar-2", "viz-pillar-3", "viz-pillar-4"];
	const pillar = (id: string, x: number, y: number, label: string, accent: string) =>
		`<g id="${id}">
      <rect x="${x}" y="${y}" width="130" height="90" rx="14" fill="#081827" stroke="${accent}" stroke-width="2"/>
      <text x="${x + 65}" y="${y + 52}" fill="${accent}" font-family="${FONT}" font-size="13" font-weight="800" text-anchor="middle">${label}</text>
    </g>`;
	const content = `
    ${pillar("viz-pillar-1", 80, 120, "Truth", "#12b5e5")}
    ${pillar("viz-pillar-2", 250, 120, "Inventory", "#6CC04A")}
    ${pillar("viz-pillar-3", 420, 120, "Runner", "#f59e0b")}
    ${pillar("viz-pillar-4", 250, 280, "Validate", "#a78bfa")}
    ${connector("viz-flow-1", 210, 165, 250, 165)}
    ${connector("viz-flow-2", 380, 165, 420, 165)}
    ${connector("viz-flow-3", 485, 210, 315, 280)}
    ${caption("viz-cap", 360, 420, "Reliable automation architecture")}
  `;
	return panel("Four architecture pillars", content, ids);
}

function visualExamWorkflow(): VisualResult {
	const ids = ["viz-exam-1", "viz-exam-2", "viz-exam-3"];
	const content = `
    ${connector("viz-exam-line", 120, 180, 600, 180)}
    ${nodeCircle("viz-exam-1", 160, 180, 34, "#12b5e5", "#082f49", "M20 20h24M32 12v24", "Learn")}
    ${nodeCircle("viz-exam-2", 360, 180, 34, "#6CC04A", "#163119", "M16 24l8 8 16-18", "Lab")}
    ${nodeCircle("viz-exam-3", 560, 180, 34, "#f59e0b", "#3a2508", "M22 53L34 27l12 26H22z", "Exam")}
    <g id="viz-badge">
      <rect x="240" y="280" width="240" height="100" rx="18" fill="#0b2237" stroke="#12b5e5" stroke-width="2"/>
      <text x="360" y="320" fill="#12b5e5" font-family="${FONT}" font-size="14" font-weight="900" text-anchor="middle">CCNP AUTOMATION</text>
      <text x="360" y="348" fill="#9fb3c8" font-family="${FONT}" font-size="12" text-anchor="middle">Objective mapped to lab</text>
    </g>
  `;
	return panel("Certification alignment workflow", content, [...ids, "viz-badge"]);
}

function visualLabWorkspace(): VisualResult {
	const ids = ["viz-folder", "viz-terminal", "viz-check"];
	const content = `
    ${g("viz-folder", "translate(80 100)", `
      <rect width="220" height="200" rx="16" fill="#081827" stroke="#203a56" stroke-width="1.5"/>
      <text x="24" y="40" fill="#12b5e5" font-family="monospace" font-size="14" font-weight="700">lab/</text>
      <text x="40" y="72" fill="#9fb3c8" font-family="monospace" font-size="13">intended/</text>
      <text x="56" y="100" fill="#6CC04A" font-family="monospace" font-size="13">config.yaml</text>
      <text x="40" y="132" fill="#64748b" font-family="monospace" font-size="12">scripts/</text>
    `)}
    ${g("viz-terminal", "translate(340 120)", `
      <rect width="280" height="180" rx="14" fill="#020617" stroke="#12b5e5" stroke-width="2"/>
      <circle cx="24" cy="24" r="6" fill="#ef4444"/><circle cx="44" cy="24" r="6" fill="#f59e0b"/><circle cx="64" cy="24" r="6" fill="#6CC04A"/>
      <text x="20" y="60" fill="#6CC04A" font-family="monospace" font-size="12">$ python -m venv .venv</text>
      <text x="20" y="84" fill="#9fb3c8" font-family="monospace" font-size="12">$ source .venv/bin/activate</text>
      <text x="20" y="108" fill="#9fb3c8" font-family="monospace" font-size="12">$ pip install -r requirements.txt</text>
    `)}
    ${g("viz-check", "translate(280 360)", `
      <circle cx="80" cy="40" r="28" fill="#112115" stroke="#6CC04A" stroke-width="3"/>
      <path d="M68 40l8 8 18-20" fill="none" stroke="#6CC04A" stroke-width="4" stroke-linecap="round"/>
      <text x="80" y="90" fill="#9fb3c8" font-family="${FONT}" font-size="12" text-anchor="middle">Workspace ready</text>
    `)}
  `;
	return panel("Lab workspace setup", content, ids);
}

function visualModuleHandoff(): VisualResult {
	const ids = ["viz-from", "viz-arrow", "viz-to"];
	const content = `
    ${g("viz-from", "translate(100 200)", `
      <rect width="180" height="100" rx="16" fill="#112115" stroke="#6CC04A" stroke-width="2"/>
      <text x="90" y="58" fill="#6CC04A" font-family="${FONT}" font-size="15" font-weight="800" text-anchor="middle">This module</text>
    `)}
    ${g("viz-arrow", "translate(300 235)", `
      <path d="M0 0 H120" stroke="#049FD9" stroke-width="4" stroke-linecap="round"/>
      <polygon points="120,0 108,-8 108,8" fill="#049FD9"/>
    `)}
    ${g("viz-to", "translate(440 200)", `
      <rect width="180" height="100" rx="16" fill="#0b2237" stroke="#12b5e5" stroke-width="2"/>
      <text x="90" y="58" fill="#12b5e5" font-family="${FONT}" font-size="15" font-weight="800" text-anchor="middle">Next module</text>
    `)}
    ${caption("viz-cap", 360, 380, "Skills carry forward across the track")}
  `;
	return panel("Module handoff", content, ids);
}

function visualCheckpointPath(): VisualResult {
	const ids = ["viz-check-1", "viz-check-2", "viz-check-3"];
	const content = `
    ${connector("viz-path", 120, 200, 600, 200)}
    ${nodeCircle("viz-check-1", 180, 200, 30, "#6CC04A", "#112115", "M16 24l8 8 16-18", "Concepts")}
    ${nodeCircle("viz-check-2", 360, 200, 30, "#6CC04A", "#112115", "M16 24l8 8 16-18", "Terms")}
    ${nodeCircle("viz-check-3", 540, 200, 30, "#12b5e5", "#082f49", "M20 20h24M32 12v24", "Lab next")}
    ${caption("viz-cap", 360, 320, "Theory checkpoint before hands-on")}
  `;
	return panel("Recap checkpoint path", content, ids);
}

function visualWarningPath(): VisualResult {
	const ids = ["viz-warn", "viz-fix"];
	const content = `
    ${g("viz-warn", "translate(120 140)", `
      <polygon points="120,0 220,180 20,180" fill="#2a1f08" stroke="#f59e0b" stroke-width="3"/>
      <text x="120" y="120" fill="#f59e0b" font-family="${FONT}" font-size="28" font-weight="900" text-anchor="middle">!</text>
      <text x="120" y="210" fill="#9fb3c8" font-family="${FONT}" font-size="13" text-anchor="middle">Common pitfall</text>
    `)}
    ${connector("viz-warn-arrow", 260, 230, 380, 230)}
    ${g("viz-fix", "translate(400 160)", `
      <rect width="200" height="140" rx="16" fill="#112115" stroke="#6CC04A" stroke-width="2"/>
      <text x="100" y="50" fill="#6CC04A" font-family="${FONT}" font-size="14" font-weight="800" text-anchor="middle">Safer pattern</text>
      <text x="100" y="80" fill="#9fb3c8" font-family="${FONT}" font-size="12" text-anchor="middle">Pause · verify · retry</text>
    `)}
  `;
	return panel("Common mistake vs safer pattern", content, ids);
}

function visualTerminalResume(): VisualResult {
	const ids = ["viz-term", "viz-cursor"];
	const content = `
    ${g("viz-term", "translate(120 80)", `
      <rect width="480" height="320" rx="18" fill="#020617" stroke="#12b5e5" stroke-width="2"/>
      <circle cx="28" cy="28" r="7" fill="#ef4444"/><circle cx="50" cy="28" r="7" fill="#f59e0b"/><circle cx="72" cy="28" r="7" fill="#6CC04A"/>
      <text x="24" y="72" fill="#64748b" font-family="monospace" font-size="13"># Resume where you left off</text>
      <text x="24" y="104" fill="#6CC04A" font-family="monospace" font-size="14">$ cd ~/netops_lab</text>
      <text x="24" y="136" fill="#9fb3c8" font-family="monospace" font-size="14">$ source .venv/bin/activate</text>
    `)}
    ${g("viz-cursor", "translate(200 148)", `
      <rect width="10" height="18" fill="#12b5e5" opacity="0.9"/>
    `)}
  `;
	return panel("Resume lab terminal", content, ids);
}

function visualCommitChain(): VisualResult {
	const ids = ["viz-c1", "viz-c2", "viz-c3"];
	const content = `
    ${connector("viz-chain-1", 180, 200, 280, 200)}
    ${connector("viz-chain-2", 380, 200, 480, 200)}
    <g id="viz-c1"><circle cx="140" cy="200" r="32" fill="#082f49" stroke="#12b5e5" stroke-width="3"/><text x="140" y="206" fill="#f8fafc" font-family="monospace" font-size="14" text-anchor="middle">c1</text></g>
    <g id="viz-c2"><circle cx="340" cy="200" r="32" fill="#082f49" stroke="#12b5e5" stroke-width="3"/><text x="340" y="206" fill="#f8fafc" font-family="monospace" font-size="14" text-anchor="middle">c2</text></g>
    <g id="viz-c3"><circle cx="540" cy="200" r="32" fill="#163119" stroke="#6CC04A" stroke-width="3"/><text x="540" y="206" fill="#f8fafc" font-family="monospace" font-size="14" text-anchor="middle">c3</text></g>
    ${caption("viz-cap", 360, 320, "Each commit is a labeled snapshot")}
  `;
	return panel("Git commit chain", content, ids);
}

function visualBranchGraph(): VisualResult {
	const ids = ["viz-main", "viz-feature", "viz-merge"];
	const content = `
    <path id="viz-main" d="M100 280 H580" stroke="#12b5e5" stroke-width="4" stroke-linecap="round"/>
    <path id="viz-feature" d="M220 280 C220 180 400 180 400 280" fill="none" stroke="#6CC04A" stroke-width="4" stroke-linecap="round"/>
    <circle cx="100" cy="280" r="10" fill="#12b5e5"/>
    <circle cx="400" cy="280" r="10" fill="#6CC04A"/>
    <circle cx="580" cy="280" r="10" fill="#12b5e5"/>
    ${g("viz-merge", "translate(380 120)", `
      <circle cx="20" cy="20" r="18" fill="#2a1f08" stroke="#f59e0b" stroke-width="2"/>
      <text x="20" y="26" fill="#f59e0b" font-family="${FONT}" font-size="16" font-weight="900" text-anchor="middle">?</text>
      <text x="20" y="60" fill="#9fb3c8" font-family="${FONT}" font-size="11" text-anchor="middle">merge</text>
    `)}
    ${caption("viz-cap", 360, 380, "Branch, experiment, integrate")}
  `;
	return panel("Git branch and merge", content, ids);
}

function visualGitCommandGrid(): VisualResult {
	const ids = ["viz-cmd-1", "viz-cmd-2", "viz-cmd-3", "viz-cmd-4"];
	const cmd = (id: string, x: number, y: number, label: string, accent: string) =>
		`<g id="${id}"><rect x="${x}" y="${y}" width="140" height="80" rx="14" fill="#081827" stroke="${accent}" stroke-width="2"/><text x="${x + 70}" y="${y + 48}" fill="${accent}" font-family="monospace" font-size="12" font-weight="700" text-anchor="middle">${label}</text></g>`;
	const content = `
    ${cmd("viz-cmd-1", 100, 140, "cherry-pick", "#6CC04A")}
    ${cmd("viz-cmd-2", 300, 140, "revert", "#12b5e5")}
    ${cmd("viz-cmd-3", 100, 280, "reset", "#a78bfa")}
    ${cmd("viz-cmd-4", 300, 280, "checkout", "#f59e0b")}
    ${caption("viz-cap", 360, 420, "Four recovery and selection tools")}
  `;
	return panel("Git command toolkit", content, ids);
}

function visualFolderVsRepo(): VisualResult {
	const ids = ["viz-folder-side", "viz-repo-side"];
	const content = `
    ${g("viz-folder-side", "translate(80 120)", `
      <rect width="200" height="220" rx="16" fill="#1a1215" stroke="#ef4444" stroke-width="2"/>
      <path d="M30 50h60l20 30h90v120H30z" fill="#081827" stroke="#ef4444" stroke-width="2"/>
      <text x="100" y="200" fill="#ef4444" font-family="${FONT}" font-size="13" font-weight="700" text-anchor="middle">Folder</text>
      <text x="100" y="222" fill="#64748b" font-family="${FONT}" font-size="11" text-anchor="middle">files only</text>
    `)}
    ${g("viz-repo-side", "translate(400 120)", `
      <rect width="200" height="220" rx="16" fill="#112115" stroke="#6CC04A" stroke-width="2"/>
      <path d="M30 50h60l20 30h90v120H30z" fill="#081827" stroke="#6CC04A" stroke-width="2"/>
      <circle cx="160" cy="170" r="22" fill="#163119" stroke="#6CC04A" stroke-width="2"/>
      <text x="160" y="176" fill="#6CC04A" font-family="monospace" font-size="11" text-anchor="middle">.git</text>
      <text x="100" y="200" fill="#6CC04A" font-family="${FONT}" font-size="13" font-weight="700" text-anchor="middle">Repository</text>
    `)}
    ${caption("viz-cap", 360, 400, "History layer makes the difference")}
  `;
	return panel("Folder versus Git repository", content, ids);
}

function visualGitWatchCommitBranch(): VisualResult {
	const ids = ["viz-watch", "viz-commit", "viz-branch"];
	const content = `
    ${connector("viz-flow", 140, 200, 580, 200)}
    ${nodeCircle("viz-watch", 140, 200, 34, "#12b5e5", "#082f49", "M24 28h20M34 18v20", "watch")}
    ${nodeCircle("viz-commit", 360, 200, 34, "#6CC04A", "#163119", "M16 24l8 8 16-18", "commit")}
    ${nodeCircle("viz-branch", 580, 200, 34, "#f59e0b", "#3a2508", "M20 28h16M28 20v16", "branch")}
    ${caption("viz-cap", 360, 320, "Git watches, snapshots, and isolates change")}
  `;
	return panel("Git core operations", content, ids);
}

function visualPipelineStages(): VisualResult {
	const ids = ["viz-stage-1", "viz-stage-2", "viz-stage-3", "viz-stage-4"];
	const stage = (id: string, x: number, label: string, accent: string) =>
		`<g id="${id}"><rect x="${x}" y="180" width="110" height="70" rx="12" fill="#081827" stroke="${accent}" stroke-width="2"/><text x="${x + 55}" y="222" fill="${accent}" font-family="${FONT}" font-size="12" font-weight="700" text-anchor="middle">${label}</text></g>`;
	const content = `
    ${connector("viz-pipe", 130, 215, 590, 215)}
    ${stage("viz-stage-1", 80, "build", "#12b5e5")}
    ${stage("viz-stage-2", 220, "test", "#6CC04A")}
    ${stage("viz-stage-3", 360, "validate", "#f59e0b")}
    ${stage("viz-stage-4", 500, "deploy", "#a78bfa")}
    ${caption("viz-cap", 360, 320, "CI/CD pipeline stages")}
  `;
	return panel("Pipeline stages", content, ids);
}

function visualPythonToDevices(): VisualResult {
	const ids = ["viz-python", "viz-link", "viz-net"];
	const content = `
    ${g("viz-python", "translate(120 200)", `
      <rect width="120" height="100" rx="16" fill="#0b2237" stroke="#12b5e5" stroke-width="2"/>
      <text x="60" y="58" fill="#12b5e5" font-family="monospace" font-size="18" font-weight="900" text-anchor="middle">.py</text>
    `)}
    ${connector("viz-link", 240, 250, 360, 250)}
    ${g("viz-net", "translate(360 140)", `
      ${deviceBox(0, 0, "R1", "#6CC04A")}
      ${deviceBox(100, 60, "SW1", "#6CC04A")}
      ${deviceBox(200, 0, "SW2", "#6CC04A")}
    `)}
    ${caption("viz-cap", 360, 380, "Python orchestrates device sessions")}
  `;
	return panel("Python to network devices", content, ids);
}

function visualDataFormats(): VisualResult {
	const ids = ["viz-yaml", "viz-json", "viz-xml"];
	const content = `
    ${g("viz-yaml", "translate(100 160)", `<rect width="140" height="90" rx="12" fill="#112115" stroke="#6CC04A" stroke-width="2"/><text x="70" y="52" fill="#6CC04A" font-family="monospace" font-size="16" font-weight="700" text-anchor="middle">YAML</text>`)}
    ${g("viz-json", "translate(290 160)", `<rect width="140" height="90" rx="12" fill="#0b2237" stroke="#12b5e5" stroke-width="2"/><text x="70" y="52" fill="#12b5e5" font-family="monospace" font-size="16" font-weight="700" text-anchor="middle">JSON</text>`)}
    ${g("viz-xml", "translate(480 160)", `<rect width="140" height="90" rx="12" fill="#1f1b2e" stroke="#a78bfa" stroke-width="2"/><text x="70" y="52" fill="#a78bfa" font-family="monospace" font-size="16" font-weight="700" text-anchor="middle">XML</text>`)}
    ${caption("viz-cap", 360, 320, "Structured data for automation")}
  `;
	return panel("Config data formats", content, ids);
}

function visualSshSession(): VisualResult {
	const ids = ["viz-client", "viz-ssh", "viz-device"];
	const content = `
    ${g("viz-client", "translate(100 220)", `<rect width="100" height="70" rx="10" fill="#0b2237" stroke="#12b5e5" stroke-width="2"/><text x="50" y="42" fill="#12b5e5" font-family="${FONT}" font-size="12" text-anchor="middle">Script</text>`)}
    ${g("viz-ssh", "translate(240 235)", `<rect width="120" height="40" rx="8" fill="#2a1f08" stroke="#f59e0b" stroke-width="2"/><text x="60" y="26" fill="#f59e0b" font-family="monospace" font-size="12" font-weight="700" text-anchor="middle">SSH :22</text>`)}
    ${g("viz-device", "translate(420 200)", deviceBox(0, 0, "SW1", "#6CC04A"))}
    ${connector("viz-wire-1", 200, 255, 240, 255)}
    ${connector("viz-wire-2", 360, 255, 420, 230)}
  `;
	return panel("SSH connection session", content, ids);
}

function visualRestExchange(): VisualResult {
	const ids = ["viz-request", "viz-api", "viz-response"];
	const content = `
    ${g("viz-request", "translate(80 200)", `<rect width="140" height="60" rx="10" fill="#0b2237" stroke="#12b5e5" stroke-width="2"/><text x="70" y="36" fill="#12b5e5" font-family="monospace" font-size="12" text-anchor="middle">GET /data</text>`)}
    ${connector("viz-req-arrow", 220, 230, 300, 230)}
    ${g("viz-api", "translate(300 170)", `<rect width="120" height="120" rx="14" fill="#112115" stroke="#6CC04A" stroke-width="2"/><text x="60" y="68" fill="#6CC04A" font-family="${FONT}" font-size="14" font-weight="800" text-anchor="middle">API</text>`)}
    ${connector("viz-res-arrow", 420, 230, 500, 230)}
    ${g("viz-response", "translate(500 200)", `<rect width="140" height="60" rx="10" fill="#1f1b2e" stroke="#a78bfa" stroke-width="2"/><text x="70" y="36" fill="#a78bfa" font-family="monospace" font-size="12" text-anchor="middle">200 JSON</text>`)}
  `;
	return panel("REST request and response", content, ids);
}

function visualYangTree(): VisualResult {
	const ids = ["viz-root", "viz-branch-a", "viz-branch-b"];
	const content = `
    ${g("viz-root", "translate(330 100)", `<circle cx="30" cy="30" r="24" fill="#082f49" stroke="#12b5e5" stroke-width="2"/><text x="30" y="35" fill="#12b5e5" font-family="${FONT}" font-size="11" text-anchor="middle">root</text>`)}
    ${connector("viz-t1", 360, 154, 240, 220)}
    ${connector("viz-t2", 360, 154, 480, 220)}
    ${g("viz-branch-a", "translate(200 220)", `<rect width="100" height="50" rx="10" fill="#112115" stroke="#6CC04A" stroke-width="2"/><text x="50" y="30" fill="#6CC04A" font-family="${FONT}" font-size="11" text-anchor="middle">interfaces</text>`)}
    ${g("viz-branch-b", "translate(440 220)", `<rect width="100" height="50" rx="10" fill="#112115" stroke="#6CC04A" stroke-width="2"/><text x="50" y="30" fill="#6CC04A" font-family="${FONT}" font-size="11" text-anchor="middle">vlans</text>`)}
    ${caption("viz-cap", 360, 360, "YANG models structure device data")}
  `;
	return panel("YANG data tree", content, ids);
}

function visualApiGuardrails(): VisualResult {
	const ids = ["viz-auth", "viz-limit", "viz-error"];
	const content = `
    ${nodeCircle("viz-auth", 160, 200, 32, "#12b5e5", "#082f49", "M20 28h16M28 20v16", "auth")}
    ${nodeCircle("viz-limit", 360, 200, 32, "#f59e0b", "#3a2508", "M12 20h32M20 12v24", "limits")}
    ${nodeCircle("viz-error", 560, 200, 32, "#ef4444", "#1a1215", "M22 53L34 27l12 26H22z", "errors")}
    ${connector("viz-guard-1", 192, 200, 328, 200)}
    ${connector("viz-guard-2", 392, 200, 528, 200)}
    ${caption("viz-cap", 360, 320, "Production API guardrails")}
  `;
	return panel("API auth limits and errors", content, ids);
}

function visualPlaybookLayers(): VisualResult {
	const ids = ["viz-inv", "viz-play", "viz-mod"];
	const content = `
    ${g("viz-inv", "translate(200 120)", `<rect width="320" height="50" rx="10" fill="#0b2237" stroke="#12b5e5" stroke-width="2"/><text x="160" y="32" fill="#12b5e5" font-family="${FONT}" font-size="13" font-weight="700" text-anchor="middle">inventory</text>`)}
    ${g("viz-play", "translate(220 200)", `<rect width="280" height="50" rx="10" fill="#112115" stroke="#6CC04A" stroke-width="2"/><text x="140" y="32" fill="#6CC04A" font-family="${FONT}" font-size="13" font-weight="700" text-anchor="middle">playbook</text>`)}
    ${g("viz-mod", "translate(240 280)", `<rect width="240" height="50" rx="10" fill="#1f1b2e" stroke="#a78bfa" stroke-width="2"/><text x="120" y="32" fill="#a78bfa" font-family="${FONT}" font-size="13" font-weight="700" text-anchor="middle">modules</text>`)}
    ${connector("viz-stack-1", 360, 170, 360, 200)}
    ${connector("viz-stack-2", 360, 250, 360, 280)}
  `;
	return panel("Ansible playbook layers", content, ids);
}

function visualTerraformFlow(): VisualResult {
	const ids = ["viz-plan", "viz-apply"];
	const content = `
    ${g("viz-plan", "translate(140 180)", `<rect width="180" height="100" rx="14" fill="#0b2237" stroke="#12b5e5" stroke-width="2"/><text x="90" y="58" fill="#12b5e5" font-family="monospace" font-size="16" font-weight="700" text-anchor="middle">plan</text>`)}
    ${connector("viz-tf-arrow", 320, 230, 400, 230)}
    ${g("viz-apply", "translate(400 180)", `<rect width="180" height="100" rx="14" fill="#112115" stroke="#6CC04A" stroke-width="2"/><text x="90" y="58" fill="#6CC04A" font-family="monospace" font-size="16" font-weight="700" text-anchor="middle">apply</text>`)}
    ${caption("viz-cap", 360, 340, "Terraform intent to infrastructure")}
  `;
	return panel("Terraform plan and apply", content, ids);
}

function visualToolchainStack(): VisualResult {
	const ids = ["viz-layer-1", "viz-layer-2", "viz-layer-3"];
	const content = `
    ${g("viz-layer-1", "translate(180 280)", `<rect width="360" height="50" rx="10" fill="#081827" stroke="#64748b" stroke-width="2"/><text x="180" y="32" fill="#9fb3c8" font-family="${FONT}" font-size="12" text-anchor="middle">devices</text>`)}
    ${g("viz-layer-2", "translate(200 210)", `<rect width="320" height="50" rx="10" fill="#0b2237" stroke="#12b5e5" stroke-width="2"/><text x="160" y="32" fill="#12b5e5" font-family="${FONT}" font-size="12" text-anchor="middle">automation tools</text>`)}
    ${g("viz-layer-3", "translate(220 140)", `<rect width="280" height="50" rx="10" fill="#112115" stroke="#6CC04A" stroke-width="2"/><text x="140" y="32" fill="#6CC04A" font-family="${FONT}" font-size="12" text-anchor="middle">Git + CI/CD</text>`)}
  `;
	return panel("Automation toolchain stack", content, ids);
}

function visualBranchTopology(): VisualResult {
	const ids = ["viz-hq", "viz-wan", "viz-branch"];
	const content = `
    ${g("viz-hq", "translate(120 180)", `<rect width="100" height="80" rx="12" fill="#0b2237" stroke="#12b5e5" stroke-width="2"/><text x="50" y="48" fill="#12b5e5" font-family="${FONT}" font-size="12" font-weight="700" text-anchor="middle">HQ</text>`)}
    ${connector("viz-wan", 220, 220, 400, 220)}
    ${g("viz-branch", "translate(400 160)", `
      ${deviceBox(0, 40, "SW", "#6CC04A")}
      ${deviceBox(100, 0, "RTR", "#f59e0b")}
      <text x="70" y="120" fill="#9fb3c8" font-family="${FONT}" font-size="12" text-anchor="middle">Branch site</text>
    `)}
    ${caption("viz-cap", 360, 360, "Reference branch topology")}
  `;
	return panel("Enterprise branch topology", content, ids);
}

function visualRunbookFlow(): VisualResult {
	const ids = ["viz-pre", "viz-change", "viz-post"];
	const content = `
    ${nodeCircle("viz-pre", 140, 220, 30, "#12b5e5", "#082f49", "M16 24l8 8 16-18", "pre-check")}
    ${nodeCircle("viz-change", 360, 220, 30, "#f59e0b", "#3a2508", "M20 20h24M32 12v24", "change")}
    ${nodeCircle("viz-post", 580, 220, 30, "#6CC04A", "#163119", "M16 24l8 8 16-18", "verify")}
    ${connector("viz-rb-1", 170, 220, 330, 220)}
    ${connector("viz-rb-2", 390, 220, 550, 220)}
  `;
	return panel("Change runbook flow", content, ids);
}

function visualTelemetryStream(): VisualResult {
	const ids = ["viz-device", "viz-stream", "viz-collector"];
	const content = `
    ${g("viz-device", "translate(100 200)", deviceBox(0, 0, "RTR", "#12b5e5"))}
    ${connector("viz-arrow", 160, 220, 280, 220)}
    ${g("viz-stream", "translate(280 180)", `<rect width="120" height="80" rx="12" fill="#112115" stroke="#6CC04A" stroke-width="2"/><text x="60" y="48" fill="#6CC04A" font-family="${FONT}" font-size="11" font-weight="700" text-anchor="middle">gRPC stream</text>`)}
    ${connector("viz-arrow2", 400, 220, 480, 220)}
    ${g("viz-collector", "translate(480 180)", `<rect width="120" height="80" rx="12" fill="#0b2237" stroke="#12b5e5" stroke-width="2"/><text x="60" y="48" fill="#12b5e5" font-family="${FONT}" font-size="11" font-weight="700" text-anchor="middle">Collector</text>`)}
    ${caption("viz-cap", 360, 340, "Model-driven telemetry path")}
  `;
	return panel("Telemetry streaming path", content, ids);
}

function visualLoggingPipeline(): VisualResult {
	const ids = ["viz-source", "viz-forward", "viz-index"];
	const content = `
    ${nodeCircle("viz-source", 140, 220, 30, "#f59e0b", "#3a2508", "M12 20h32M20 12v24", "syslog")}
    ${nodeCircle("viz-forward", 360, 220, 30, "#12b5e5", "#082f49", "M20 28h16M28 20v16", "forward")}
    ${nodeCircle("viz-index", 580, 220, 30, "#6CC04A", "#163119", "M16 24l8 8 16-18", "search")}
    ${connector("viz-l1", 170, 220, 330, 220)}
    ${connector("viz-l2", 390, 220, 550, 220)}
  `;
	return panel("Logging pipeline", content, ids);
}

function visualValidationGate(): VisualResult {
	const ids = ["viz-learn", "viz-apply", "viz-gate"];
	const content = `
    ${nodeCircle("viz-learn", 140, 220, 30, "#12b5e5", "#082f49", "M16 24l8 8 16-18", "learn")}
    ${nodeCircle("viz-apply", 360, 220, 30, "#f59e0b", "#3a2508", "M20 20h24M32 12v24", "apply")}
    ${nodeCircle("viz-gate", 580, 220, 30, "#6CC04A", "#163119", "M16 24l8 8 16-18", "gate")}
    ${connector("viz-v1", 170, 220, 330, 220)}
    ${connector("viz-v2", 390, 220, 550, 220)}
  `;
	return panel("Validation gate workflow", content, ids);
}

function visualTlsChain(): VisualResult {
	const ids = ["viz-client", "viz-tls", "viz-server"];
	const content = `
    ${g("viz-client", "translate(80 190)", `<rect width="100" height="60" rx="10" fill="#081827" stroke="#12b5e5" stroke-width="2"/><text x="50" y="38" fill="#12b5e5" font-family="${FONT}" font-size="11" font-weight="700" text-anchor="middle">Client</text>`)}
    ${g("viz-tls", "translate(250 200)", `<rect width="220" height="40" rx="8" fill="#112115" stroke="#6CC04A" stroke-width="2"/><text x="110" y="26" fill="#6CC04A" font-family="${FONT}" font-size="11" font-weight="700" text-anchor="middle">TLS encrypted</text>`)}
    ${g("viz-server", "translate(540 190)", `<rect width="100" height="60" rx="10" fill="#081827" stroke="#12b5e5" stroke-width="2"/><text x="50" y="38" fill="#12b5e5" font-family="${FONT}" font-size="11" font-weight="700" text-anchor="middle">API</text>`)}
  `;
	return panel("TLS protection in flight", content, ids);
}

function visualOpsCapstone(): VisualResult {
	const ids = ["viz-telemetry", "viz-logs", "viz-validate", "viz-secure"];
	const content = `
    ${box(60, 160, 120, 70, "Telemetry", "#12b5e5", "viz-telemetry")}
    ${box(200, 160, 120, 70, "Logging", "#6CC04A", "viz-logs")}
    ${box(340, 160, 120, 70, "pyATS", "#f59e0b", "viz-validate")}
    ${box(480, 160, 120, 70, "TLS", "#a78bfa", "viz-secure")}
    ${caption("viz-cap", 360, 300, "Course 3 ops capstone chain")}
  `;
	return panel("Operations capstone", content, ids);
}

function box(x: number, y: number, w: number, h: number, label: string, accent: string, id: string): string {
	return `<g id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="#081827" stroke="${accent}" stroke-width="2"/><text x="${x + w / 2}" y="${y + h / 2 + 5}" fill="${accent}" font-family="${FONT}" font-size="11" font-weight="700" text-anchor="middle">${label}</text></g>`;
}

function visualMcpStack(): VisualResult {
	const ids = ["viz-client", "viz-mcp", "viz-tools"];
	const content = `
    ${g("viz-client", "translate(100 190)", `<rect width="120" height="60" rx="10" fill="#081827" stroke="#12b5e5" stroke-width="2"/><text x="60" y="36" fill="#12b5e5" font-family="${FONT}" font-size="11" font-weight="700" text-anchor="middle">Client</text>`)}
    ${connector("viz-c1", 220, 220, 300, 220)}
    ${g("viz-mcp", "translate(300 180)", `<rect width="120" height="80" rx="10" fill="#0b2237" stroke="#6CC04A" stroke-width="2"/><text x="60" y="36" fill="#6CC04A" font-family="${FONT}" font-size="11" font-weight="700" text-anchor="middle">MCP</text>`)}
    ${connector("viz-c2", 420, 220, 500, 220)}
    ${g("viz-tools", "translate(500 190)", `<rect width="120" height="60" rx="10" fill="#081827" stroke="#f59e0b" stroke-width="2"/><text x="60" y="36" fill="#f59e0b" font-family="${FONT}" font-size="11" font-weight="700" text-anchor="middle">Tools</text>`)}
  `;
	return panel("MCP architecture", content, ids);
}

function visualAgentLoop(): VisualResult {
	const ids = ["viz-think", "viz-act", "viz-observe"];
	const content = `
    ${nodeCircle("viz-think", 180, 220, 32, "#12b5e5", "#082f49", "M20 20h24M32 12v24", "Think")}
    ${nodeCircle("viz-act", 360, 220, 32, "#6CC04A", "#163119", "M16 24l8 8 16-18", "Act")}
    ${nodeCircle("viz-observe", 540, 220, 32, "#f59e0b", "#3a2508", "M22 53L34 27l12 26H22z", "Observe")}
    ${connector("viz-a1", 212, 220, 328, 220)}
    ${connector("viz-a2", 392, 220, 508, 220)}
  `;
	return panel("Agent think-act-observe loop", content, ids);
}

function visualAiEvaluation(): VisualResult {
	const ids = ["viz-bench", "viz-score", "viz-guard"];
	const content = `
    ${box(80, 160, 160, 70, "Benchmark", "#12b5e5", "viz-bench")}
    ${box(280, 160, 160, 70, "Score", "#f59e0b", "viz-score")}
    ${box(480, 160, 160, 70, "Guardrails", "#6CC04A", "viz-guard")}
    ${caption("viz-cap", 360, 300, "Evaluate before trusting agent output")}
  `;
	return panel("AI evaluation pipeline", content, ids);
}

function visualAiGovernance(): VisualResult {
	const ids = ["viz-prompt", "viz-review", "viz-policy"];
	const content = `
    ${nodeCircle("viz-prompt", 140, 220, 30, "#a78bfa", "#2b2350", "M20 28h16M28 20v16", "prompt")}
    ${nodeCircle("viz-review", 360, 220, 30, "#f59e0b", "#3a2508", "M16 24l8 8 16-18", "review")}
    ${nodeCircle("viz-policy", 580, 220, 30, "#6CC04A", "#163119", "M12 20h32M20 12v24", "policy")}
    ${connector("viz-g1", 170, 220, 330, 220)}
    ${connector("viz-g2", 390, 220, 550, 220)}
  `;
	return panel("AI governance workflow", content, ids);
}
