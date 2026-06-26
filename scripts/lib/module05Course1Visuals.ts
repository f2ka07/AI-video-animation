// Hand-tuned module 05 visuals — Enterprise Branch Capstone

import { arrow, box, FONT, httpVerb, panel, pythonFile, switchIcon, terminalBlock } from "./course1VisualHelpers";

export const MODULE05_COURSE1_VISUALS: Record<string, () => ReturnType<typeof panel>> = {
	"enterprise-branch-capstone": () =>
		panel(
			"Capstone: two switches, same workflow",
			`
    <g id="viz-branch">
      ${switchIcon(200, 200, "branch-sw1", "viz-sw1")}
      ${switchIcon(472, 200, "branch-sw2", "viz-sw2")}
      <line x1="240" y1="200" x2="432" y2="200" stroke="#35536f" stroke-width="2" stroke-dasharray="6 4"/>
      <text x="336" y="180" fill="#12b5e5" font-family="${FONT}" font-size="11" text-anchor="middle">Branch office</text>
    </g>
    <g id="viz-tasks">
      <rect x="140" y="300" width="392" height="70" rx="12" fill="#081827" stroke="#6CC04A" stroke-width="2"/>
      <text x="336" y="326" fill="#6CC04A" font-family="${FONT}" font-size="11" font-weight="700" text-anchor="middle">VLAN · access port · OSPF · ACL</text>
      <text x="336" y="348" fill="#9fb3c8" font-family="${FONT}" font-size="10" text-anchor="middle">One playbook — four CCNA tasks on each switch</text>
    </g>
    <text x="336" y="410" fill="#64748b" font-family="${FONT}" font-size="11" text-anchor="middle">Module 4 pattern, scaled to two devices</text>`,
			["viz-sw1", "viz-sw2", "viz-tasks"]
		),

	"capstone-integrates-four-modules": () =>
		panel(
			"Four modules in one capstone",
			`
    <g id="viz-m1">
      ${box(60, 100, 110, 50, "M1 Git", "#12b5e5", "viz-m1", 11)}
      ${arrow(170, 125, 210, 125)}
      ${box(210, 100, 110, 50, "M2 Python", "#f59e0b", "viz-m2", 10)}
      ${arrow(320, 125, 360, 125)}
      ${box(360, 100, 110, 50, "M3 REST", "#6CC04A", "viz-m3", 11)}
      ${arrow(470, 125, 510, 125)}
      ${box(510, 100, 110, 50, "M4 Ansible", "#a78bfa", "viz-m4", 10)}
    </g>
    <g id="viz-flow">
      <rect x="120" y="200" width="480" height="120" rx="16" fill="#081827" stroke="#12b5e5" stroke-width="2"/>
      <text x="360" y="232" fill="#12b5e5" font-family="${FONT}" font-size="12" font-weight="800" text-anchor="middle">Capstone sequence</text>
      <text x="360" y="258" fill="#a78bfa" font-family="${FONT}" font-size="11" text-anchor="middle">Ansible apply (M4)</text>
      <text x="360" y="280" fill="#f59e0b" font-family="${FONT}" font-size="11" text-anchor="middle">Python verify show vlan (M2)</text>
      <text x="360" y="302" fill="#6CC04A" font-family="${FONT}" font-size="11" text-anchor="middle">RESTCONF GET optional (M3)</text>
    </g>
    <text x="336" y="370" fill="#64748b" font-family="${FONT}" font-size="11" text-anchor="middle">Same tools — fixed order on two lab switches</text>`,
			["viz-m1", "viz-m2", "viz-m3", "viz-m4", "viz-flow"]
		),

	"branch-network-reference-design": () =>
		panel(
			"Branch reference design",
			`
    ${switchIcon(180, 180, "sw1 .10", "viz-sw1")}
    ${switchIcon(492, 180, "sw2 .11", "viz-sw2")}
    <g id="viz-vlan">
      <rect x="80" y="80" width="90" height="44" rx="8" fill="#081827" stroke="#12b5e5" stroke-width="1.5"/>
      <text x="125" y="107" fill="#12b5e5" font-family="${FONT}" font-size="10" font-weight="700" text-anchor="middle">VLAN 100</text>
      ${arrow(125, 124, 180, 160, "#12b5e5")}
      ${arrow(125, 124, 492, 160, "#12b5e5")}
    </g>
    <g id="viz-port">
      <rect x="300" y="80" width="100" height="44" rx="8" fill="#081827" stroke="#6CC04A" stroke-width="1.5"/>
      <text x="350" y="107" fill="#6CC04A" font-family="${FONT}" font-size="10" font-weight="700" text-anchor="middle">Gi1/0/1</text>
    </g>
    <g id="viz-ospf">
      <rect x="80" y="300" width="90" height="44" rx="8" fill="#081827" stroke="#f59e0b" stroke-width="1.5"/>
      <text x="125" y="327" fill="#f59e0b" font-family="${FONT}" font-size="10" font-weight="700" text-anchor="middle">OSPF</text>
      ${arrow(125, 300, 180, 220, "#f59e0b")}
      ${arrow(125, 300, 492, 220, "#f59e0b")}
    </g>
    <g id="viz-acl">
      <rect x="500" y="300" width="100" height="44" rx="8" fill="#081827" stroke="#ef4444" stroke-width="1.5"/>
      <text x="550" y="327" fill="#ef4444" font-family="${FONT}" font-size="10" font-weight="700" text-anchor="middle">BLOCK_TELNET</text>
    </g>
    <text x="336" y="390" fill="#64748b" font-family="${FONT}" font-size="11" text-anchor="middle">Standard CCNA — one playbook instead of two logins</text>`,
			["viz-sw1", "viz-sw2", "viz-vlan", "viz-port", "viz-ospf", "viz-acl"]
		),

	"git-as-source-of-truth": () =>
		panel(
			"Capstone folder layout",
			`
    <g id="viz-root">
      <rect x="200" y="80" width="272" height="280" rx="16" fill="#020617" stroke="#12b5e5" stroke-width="2"/>
      <text x="220" y="112" fill="#12b5e5" font-family="monospace" font-size="12" font-weight="700">automation_project/</text>
      <text x="240" y="142" fill="#64748b" font-family="monospace" font-size="11">capstone/</text>
      <text x="260" y="168" fill="#6CC04A" font-family="monospace" font-size="11">inventory/</text>
      <text x="280" y="190" fill="#9fb3c8" font-family="monospace" font-size="10">branch.yml</text>
      <text x="260" y="216" fill="#12b5e5" font-family="monospace" font-size="11">playbooks/</text>
      <text x="280" y="238" fill="#9fb3c8" font-family="monospace" font-size="10">branch_site.yml</text>
      <text x="260" y="264" fill="#f59e0b" font-family="monospace" font-size="11">scripts/</text>
      <text x="280" y="286" fill="#9fb3c8" font-family="monospace" font-size="10">verify_branch.py</text>
      <text x="280" y="308" fill="#9fb3c8" font-family="monospace" font-size="10">restconf_validate.py</text>
      <text x="280" y="336" fill="#64748b" font-family="${FONT}" font-size="9">Know which file before each slide</text>
    </g>
    <text x="336" y="400" fill="#64748b" font-family="${FONT}" font-size="11" text-anchor="middle">Same project folder since module one</text>`,
			["viz-root"]
		),

	"orchestration-layer-choices": () =>
		panel(
			"Apply left, verify right",
			`
    <g id="viz-apply-side">
      <rect x="56" y="100" width="260" height="200" rx="16" fill="#112115" stroke="#a78bfa" stroke-width="2"/>
      <text x="186" y="132" fill="#a78bfa" font-family="${FONT}" font-size="13" font-weight="800" text-anchor="middle">Apply (M4)</text>
      <text x="186" y="168" fill="#9fb3c8" font-family="monospace" font-size="10" text-anchor="middle">inventory/branch.yml</text>
      <text x="186" y="192" fill="#9fb3c8" font-family="monospace" font-size="10" text-anchor="middle">playbooks/branch_site.yml</text>
      <text x="186" y="220" fill="#f59e0b" font-family="monospace" font-size="10" text-anchor="middle">--check then apply</text>
      <text x="186" y="270" fill="#64748b" font-family="${FONT}" font-size="10" text-anchor="middle">Ansible pushes config</text>
    </g>
    <g id="viz-verify-side">
      <rect x="356" y="100" width="260" height="200" rx="16" fill="#081827" stroke="#6CC04A" stroke-width="2"/>
      <text x="486" y="132" fill="#6CC04A" font-family="${FONT}" font-size="13" font-weight="800" text-anchor="middle">Verify (M2 + M3)</text>
      <text x="486" y="168" fill="#9fb3c8" font-family="monospace" font-size="10" text-anchor="middle">verify_branch.py</text>
      <text x="486" y="192" fill="#9fb3c8" font-family="monospace" font-size="10" text-anchor="middle">show vlan brief</text>
      <text x="486" y="220" fill="#12b5e5" font-family="monospace" font-size="10" text-anchor="middle">restconf_validate.py</text>
      <text x="486" y="270" fill="#64748b" font-family="${FONT}" font-size="10" text-anchor="middle">Read output before stopping</text>
    </g>
    <text x="336" y="350" fill="#ef4444" font-family="${FONT}" font-size="11" text-anchor="middle">Never skip check mode or verify output</text>`,
			["viz-apply-side", "viz-verify-side"]
		),

	"architecture-pillars-in-practice": () =>
		panel(
			"Four capstone files",
			`
    <g id="viz-inv">
      <rect x="60" y="120" width="240" height="80" rx="12" fill="#081827" stroke="#6CC04A" stroke-width="2"/>
      <text x="180" y="150" fill="#6CC04A" font-family="monospace" font-size="11" font-weight="700" text-anchor="middle">branch.yml</text>
      <text x="180" y="176" fill="#9fb3c8" font-family="${FONT}" font-size="10" text-anchor="middle">Who to connect to</text>
    </g>
    <g id="viz-play">
      <rect x="360" y="120" width="240" height="80" rx="12" fill="#081827" stroke="#12b5e5" stroke-width="2"/>
      <text x="480" y="150" fill="#12b5e5" font-family="monospace" font-size="11" font-weight="700" text-anchor="middle">branch_site.yml</text>
      <text x="480" y="176" fill="#9fb3c8" font-family="${FONT}" font-size="10" text-anchor="middle">What to configure</text>
    </g>
    <g id="viz-verify">
      <rect x="60" y="240" width="240" height="80" rx="12" fill="#081827" stroke="#f59e0b" stroke-width="2"/>
      <text x="180" y="270" fill="#f59e0b" font-family="monospace" font-size="11" font-weight="700" text-anchor="middle">verify_branch.py</text>
      <text x="180" y="296" fill="#9fb3c8" font-family="${FONT}" font-size="10" text-anchor="middle">CLI check after apply</text>
    </g>
    <g id="viz-rest">
      <rect x="360" y="240" width="240" height="80" rx="12" fill="#081827" stroke="#a78bfa" stroke-width="2"/>
      <text x="480" y="270" fill="#a78bfa" font-family="monospace" font-size="11" font-weight="700" text-anchor="middle">restconf_validate.py</text>
      <text x="480" y="296" fill="#9fb3c8" font-family="${FONT}" font-size="10" text-anchor="middle">Optional JSON cross-check</text>
    </g>
    <text x="336" y="370" fill="#64748b" font-family="${FONT}" font-size="11" text-anchor="middle">Next slides show each file line by line</text>`,
			["viz-inv", "viz-play", "viz-verify", "viz-rest"]
		),

	"capstone-change-runbook": () =>
		panel(
			"Six steps in order",
			`
    ${box(80, 90, 100, 44, "1. venv", "#12b5e5", "viz-s1", 11)}
    ${box(200, 90, 100, 44, "2. inventory", "#12b5e5", "viz-s2", 10)}
    ${box(320, 90, 100, 44, "3. --check", "#f59e0b", "viz-s3", 10)}
    ${box(440, 90, 100, 44, "4. apply", "#6CC04A", "viz-s4", 12)}
    ${box(200, 160, 120, 44, "5. verify.py", "#f59e0b", "viz-s5", 10)}
    ${box(340, 160, 140, 44, "6. REST optional", "#a78bfa", "viz-s6", 9)}
    ${arrow(180, 112, 200, 112)}
    ${arrow(300, 112, 320, 112)}
    ${arrow(420, 112, 440, 112)}
    ${arrow(490, 134, 380, 160)}
    ${arrow(320, 182, 340, 182)}
    <g id="viz-limit">
      <rect x="140" y="250" width="392" height="56" rx="12" fill="#112115" stroke="#ef4444" stroke-width="1.5"/>
      <text x="336" y="274" fill="#ef4444" font-family="${FONT}" font-size="11" font-weight="700" text-anchor="middle">First run: --limit branch-sw1</text>
      <text x="336" y="294" fill="#9fb3c8" font-family="${FONT}" font-size="10" text-anchor="middle">Test one switch before both</text>
    </g>`,
			["viz-s1", "viz-s2", "viz-s3", "viz-s4", "viz-s5", "viz-s6", "viz-limit"]
		),

	"verify-before-you-close": () =>
		panel(
			"Read verify output",
			`
    ${pythonFile(180, 90, 280, 100, "viz-script", {
			filename: "verify_branch.py",
			lines: ["show vlan brief", "VLAN 100 on both"],
		})}
    <g id="viz-output">
      <rect x="100" y="220" width="472" height="120" rx="14" fill="#020617" stroke="#6CC04A" stroke-width="2"/>
      <text x="120" y="252" fill="#64748b" font-family="monospace" font-size="10">--- 192.168.1.10 show vlan brief ---</text>
      <text x="120" y="274" fill="#6CC04A" font-family="monospace" font-size="10">100   DATA_VLAN    active</text>
      <text x="120" y="300" fill="#64748b" font-family="monospace" font-size="10">--- 192.168.1.11 show vlan brief ---</text>
      <text x="120" y="322" fill="#6CC04A" font-family="monospace" font-size="10">100   DATA_VLAN    active</text>
    </g>
    <text x="336" y="380" fill="#ef4444" font-family="${FONT}" font-size="11" text-anchor="middle">Missing VLAN on either switch = lab not done</text>`,
			["viz-script", "viz-output"]
		),

	"capstone-tool-matrix": () =>
		panel(
			"Nothing new to install",
			`
    <g id="viz-tools">
      ${box(60, 120, 120, 56, "Ansible", "#a78bfa", "viz-ansible", 12)}
      ${box(200, 120, 120, 56, "cisco.ios", "#a78bfa", "viz-ios", 11)}
      ${box(340, 120, 120, 56, "Netmiko", "#f59e0b", "viz-netmiko", 11)}
      ${box(480, 120, 120, 56, "requests", "#6CC04A", "viz-requests", 11)}
      ${box(130, 220, 120, 56, "venv (M1)", "#12b5e5", "viz-venv", 10)}
      ${box(270, 220, 120, 56, "REST (M3)", "#6CC04A", "viz-rest", 11)}
      ${box(410, 220, 140, 56, "Git layout", "#12b5e5", "viz-git", 11)}
    </g>
    <g id="viz-fix">
      <rect x="140" y="310" width="392" height="56" rx="12" fill="#0b2237" stroke="#f59e0b" stroke-width="2"/>
      <text x="336" y="334" fill="#f59e0b" font-family="${FONT}" font-size="11" font-weight="700" text-anchor="middle">Tool fails? Fix the earlier module first</text>
      <text x="336" y="354" fill="#64748b" font-family="${FONT}" font-size="10" text-anchor="middle">RESTCONF step optional if HTTPS unavailable</text>
    </g>`,
			["viz-ansible", "viz-ios", "viz-netmiko", "viz-requests", "viz-venv", "viz-rest", "viz-git", "viz-fix"]
		),

	"story-beat-recap-capstone": () =>
		panel(
			"Capstone recap checkpoint",
			`
    ${arrow(80, 200, 580, 200)}
    ${box(60, 170, 100, 60, "2 SW", "#12b5e5", "viz-check-1", 12)}
    ${box(180, 170, 100, 60, "Folders", "#6CC04A", "viz-check-2", 11)}
    ${box(300, 170, 100, 60, "6 steps", "#f59e0b", "viz-check-3", 11)}
    ${box(420, 170, 90, 60, "Check", "#a78bfa", "viz-check-4", 12)}
    ${box(530, 170, 70, 60, "Lab", "#ef4444", "viz-check-5", 12)}
    <text x="336" y="300" fill="#64748b" font-family="${FONT}" font-size="12" text-anchor="middle">Code slides explain every line next</text>`,
			["viz-check-1", "viz-check-2", "viz-check-3", "viz-check-4", "viz-check-5"]
		),

	"lab-setup-enterprise-branch": () =>
		panel(
			"Capstone lab setup",
			`
    <g id="viz-folders">
      <rect x="120" y="100" width="400" height="180" rx="16" fill="#020617" stroke="#12b5e5" stroke-width="2"/>
      <text x="140" y="132" fill="#12b5e5" font-family="monospace" font-size="12">mkdir -p capstone/{inventory,playbooks,scripts}</text>
      <text x="140" y="162" fill="#9fb3c8" font-family="monospace" font-size="11">capstone/inventory/</text>
      <text x="140" y="186" fill="#9fb3c8" font-family="monospace" font-size="11">capstone/playbooks/</text>
      <text x="140" y="210" fill="#9fb3c8" font-family="monospace" font-size="11">capstone/scripts/</text>
      <text x="140" y="250" fill="#64748b" font-family="${FONT}" font-size="10">Reuse venv + cisco.ios from module 4</text>
    </g>
    <g id="viz-ping">
      ${switchIcon(200, 320, "sw1", "viz-sw1")}
      ${switchIcon(472, 320, "sw2", "viz-sw2")}
      <text x="336" y="390" fill="#ef4444" font-family="${FONT}" font-size="11" text-anchor="middle">Lab switches only — ping before apply</text>
    </g>`,
			["viz-folders", "viz-sw1", "viz-sw2"]
		),

	"resume-all-modules-lab": () =>
		panel(
			"Readiness check modules 1-4",
			`
    ${terminalBlock(80, 80, 512, 260, [
			"$ cd automation_project",
			"$ source env/bin/activate",
			"$ ansible --version",
			"$ pip show netmiko",
			"$ pip show requests",
		], "viz-term")}
    <g id="viz-ready">
      <circle cx="336" cy="380" r="22" fill="#112115" stroke="#6CC04A" stroke-width="2"/>
      <path d="M326 380l6 6 14-16" fill="none" stroke="#6CC04A" stroke-width="3" stroke-linecap="round"/>
      <text x="336" y="420" fill="#64748b" font-family="${FONT}" font-size="11" text-anchor="middle">Fix prior modules before capstone apply</text>
    </g>`,
			["viz-term", "viz-ready"]
		),

	"story-beat-common-mistake-capstone": () =>
		panel(
			"Stopping at ansible ok",
			`
    <g id="viz-bad">
      <rect x="56" y="110" width="260" height="150" rx="14" fill="#1a1215" stroke="#ef4444" stroke-width="2"/>
      <text x="186" y="140" fill="#ef4444" font-family="${FONT}" font-size="12" font-weight="800" text-anchor="middle">Playbook says ok</text>
      <text x="76" y="172" fill="#9fb3c8" font-family="${FONT}" font-size="11">Skipped verify_branch.py</text>
      <text x="76" y="196" fill="#9fb3c8" font-family="${FONT}" font-size="11">VLAN missing on sw2</text>
      <text x="76" y="220" fill="#9fb3c8" font-family="${FONT}" font-size="11">Declared lab complete</text>
      <text x="186" y="248" fill="#ef4444" font-family="${FONT}" font-size="11" text-anchor="middle">False success</text>
    </g>
    ${arrow(326, 185, 390, 185)}
    <g id="viz-good">
      <rect x="400" y="110" width="240" height="150" rx="14" fill="#112115" stroke="#6CC04A" stroke-width="2"/>
      <text x="520" y="140" fill="#6CC04A" font-family="${FONT}" font-size="12" font-weight="800" text-anchor="middle">Read verify output</text>
      <text x="420" y="172" fill="#6CC04A" font-family="monospace" font-size="10">show vlan brief</text>
      <text x="420" y="196" fill="#9fb3c8" font-family="${FONT}" font-size="11">VLAN 100 on both switches</text>
      <text x="420" y="220" fill="#9fb3c8" font-family="${FONT}" font-size="11">Optional manual show checks</text>
      <text x="520" y="248" fill="#6CC04A" font-family="${FONT}" font-size="11" text-anchor="middle">Then close the lab</text>
    </g>`,
			["viz-bad", "viz-good"]
		),

	"certification-alignment-full-course": () =>
		panel(
			"Full course exam alignment",
			`
    <g id="viz-badge">
      <rect x="218" y="60" width="236" height="72" rx="14" fill="#0b2237" stroke="#12b5e5" stroke-width="2"/>
      <text x="336" y="90" fill="#12b5e5" font-family="${FONT}" font-size="14" font-weight="900" text-anchor="middle">CCNP AUTOMATION</text>
      <text x="336" y="112" fill="#9fb3c8" font-family="${FONT}" font-size="11" text-anchor="middle">Objectives 1.1 through 1.6</text>
    </g>
    <g id="viz-modules">
      ${box(50, 160, 100, 50, "M1 Arch", "#12b5e5", "viz-m1", 10)}
      ${box(165, 160, 100, 50, "M2 Python", "#f59e0b", "viz-m2", 9)}
      ${box(280, 160, 100, 50, "M3 APIs", "#6CC04A", "viz-m3", 11)}
      ${box(395, 160, 100, 50, "M4 Tools", "#a78bfa", "viz-m4", 10)}
      ${box(510, 160, 100, 50, "M5 Cap", "#ef4444", "viz-m5", 11)}
    </g>
    <g id="viz-skill">
      <rect x="120" y="250" width="432" height="70" rx="14" fill="#112115" stroke="#6CC04A" stroke-width="2"/>
      <text x="336" y="278" fill="#6CC04A" font-family="${FONT}" font-size="12" font-weight="700" text-anchor="middle">Explain workflows — not memorize commands</text>
      <text x="336" y="300" fill="#64748b" font-family="${FONT}" font-size="11" text-anchor="middle">Git · Python · RESTCONF · Ansible · verify</text>
    </g>`,
			["viz-badge", "viz-m1", "viz-m2", "viz-m3", "viz-m4", "viz-m5", "viz-skill"]
		),

	"course-complete-enterprise-automation": () =>
		panel(
			"Course complete",
			`
    <g id="viz-journey">
      ${box(40, 200, 90, 64, "CLI", "#ef4444", "viz-cli", 12)}
      ${arrow(130, 232, 160, 232)}
      ${box(160, 200, 90, 64, "Python", "#f59e0b", "viz-py", 11)}
      ${arrow(250, 232, 280, 232)}
      ${box(280, 200, 90, 64, "APIs", "#6CC04A", "viz-api", 12)}
      ${arrow(370, 232, 400, 232)}
      ${box(400, 200, 90, 64, "Ansible", "#a78bfa", "viz-ans", 10)}
      ${arrow(490, 232, 520, 232)}
      ${box(520, 200, 120, 64, "Branch lab", "#12b5e5", "viz-cap", 10)}
    </g>
    <g id="viz-habits">
      <rect x="100" y="310" width="472" height="70" rx="14" fill="#081827" stroke="#6CC04A" stroke-width="2"/>
      <text x="336" y="338" fill="#6CC04A" font-family="${FONT}" font-size="12" font-weight="800" text-anchor="middle">Hireable habits</text>
      <text x="336" y="360" fill="#9fb3c8" font-family="${FONT}" font-size="11" text-anchor="middle">Version in Git · check mode · GET before PATCH · verify output</text>
    </g>`,
			["viz-cli", "viz-py", "viz-api", "viz-ans", "viz-cap", "viz-habits"]
		),
};
