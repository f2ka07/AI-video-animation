// Hand-tuned module 04 visuals — Automation Toolchains

import { arrow, box, dataFile, FONT, panel, switchIcon, terminalBlock } from "./course1VisualHelpers";

export const MODULE04_COURSE1_VISUALS: Record<string, () => ReturnType<typeof panel>> = {
	"toolchains-beyond-single-scripts": () =>
		panel(
			"From scripts to production toolchains",
			`
    <g id="viz-scripts">
      <rect x="80" y="160" width="140" height="80" rx="14" fill="#2a1f08" stroke="#f59e0b" stroke-width="2"/>
      <text x="150" y="196" fill="#f59e0b" font-family="monospace" font-size="12" font-weight="700" text-anchor="middle">Python</text>
      <text x="150" y="218" fill="#9fb3c8" font-family="${FONT}" font-size="10" text-anchor="middle">SSH / RESTCONF</text>
    </g>
    ${arrow(220, 200, 280, 200)}
    <g id="viz-toolchain">
      <rect x="280" y="130" width="160" height="140" rx="16" fill="#081827" stroke="#12b5e5" stroke-width="2"/>
      <text x="360" y="168" fill="#12b5e5" font-family="${FONT}" font-size="13" font-weight="800" text-anchor="middle">Toolchain</text>
      <text x="360" y="194" fill="#6CC04A" font-family="${FONT}" font-size="11" text-anchor="middle">Ansible playbooks</text>
      <text x="360" y="216" fill="#a78bfa" font-family="${FONT}" font-size="11" text-anchor="middle">Terraform plan</text>
      <text x="360" y="238" fill="#f59e0b" font-family="${FONT}" font-size="11" text-anchor="middle">Inventory in Git</text>
    </g>
    ${arrow(440, 200, 500, 200)}
    ${switchIcon(540, 200, "Fleet", "viz-fleet")}
    <text x="336" y="320" fill="#64748b" font-family="${FONT}" font-size="11" text-anchor="middle">Repeatable workflows a teammate can run</text>`,
			["viz-scripts", "viz-toolchain", "viz-fleet"]
		),

	"why-ansible-for-networks": () =>
		panel(
			"Ansible fits network teams",
			`
    <g id="viz-inventory">
      <rect x="60" y="100" width="180" height="120" rx="14" fill="#081827" stroke="#6CC04A" stroke-width="2"/>
      <text x="150" y="130" fill="#6CC04A" font-family="monospace" font-size="11" font-weight="700" text-anchor="middle">inventory.yml</text>
      <text x="80" y="156" fill="#9fb3c8" font-family="monospace" font-size="10">lab_switches:</text>
      <text x="90" y="174" fill="#9fb3c8" font-family="monospace" font-size="10">  switch1: .10</text>
      <text x="90" y="192" fill="#9fb3c8" font-family="monospace" font-size="10">  switch2: .11</text>
    </g>
    ${arrow(240, 160, 290, 160)}
    <g id="viz-playbook">
      <rect x="290" y="100" width="180" height="120" rx="14" fill="#081827" stroke="#12b5e5" stroke-width="2"/>
      <text x="380" y="130" fill="#12b5e5" font-family="monospace" font-size="11" font-weight="700" text-anchor="middle">site.yml</text>
      <text x="310" y="156" fill="#9fb3c8" font-family="monospace" font-size="10">- ios_vlans:</text>
      <text x="310" y="174" fill="#9fb3c8" font-family="monospace" font-size="10">- ios_config:</text>
      <text x="310" y="192" fill="#64748b" font-family="${FONT}" font-size="9">YAML in Git for review</text>
    </g>
    ${arrow(470, 160, 520, 160)}
    <g id="viz-modules">
      <rect x="520" y="120" width="100" height="80" rx="12" fill="#112115" stroke="#f59e0b" stroke-width="2"/>
      <text x="570" y="156" fill="#f59e0b" font-family="${FONT}" font-size="11" font-weight="700" text-anchor="middle">Modules</text>
      <text x="570" y="178" fill="#9fb3c8" font-family="${FONT}" font-size="9" text-anchor="middle">idempotent</text>
    </g>
    <g id="viz-agentless">
      <rect x="160" y="280" width="352" height="50" rx="12" fill="#0b2237" stroke="#6CC04A" stroke-width="2"/>
      <text x="336" y="302" fill="#6CC04A" font-family="${FONT}" font-size="11" font-weight="700" text-anchor="middle">Agentless — SSH or API, no daemon on switches</text>
      <text x="336" y="320" fill="#64748b" font-family="${FONT}" font-size="10" text-anchor="middle">Objective 1.1: VLANs, interfaces, OSPF, ACLs</text>
    </g>`,
			["viz-inventory", "viz-playbook", "viz-modules", "viz-agentless"]
		),

	"ansible-playbook-anatomy": () =>
		panel(
			"Playbook skeleton",
			`
    <g id="viz-yaml">
      <rect x="100" y="80" width="472" height="280" rx="16" fill="#020617" stroke="#12b5e5" stroke-width="2"/>
      <text x="120" y="112" fill="#12b5e5" font-family="monospace" font-size="11">- name: Branch access workflow</text>
      <text x="120" y="136" fill="#6CC04A" font-family="monospace" font-size="11">  hosts: lab_switches</text>
      <text x="120" y="160" fill="#64748b" font-family="monospace" font-size="10">  gather_facts: no</text>
      <text x="120" y="188" fill="#f59e0b" font-family="monospace" font-size="11">  tasks:</text>
      <text x="140" y="212" fill="#9fb3c8" font-family="monospace" font-size="10">- name: Ensure VLAN 100</text>
      <text x="160" y="232" fill="#9fb3c8" font-family="monospace" font-size="10">cisco.ios.ios_vlans:</text>
      <text x="140" y="256" fill="#9fb3c8" font-family="monospace" font-size="10">- name: Configure access port</text>
      <text x="160" y="276" fill="#9fb3c8" font-family="monospace" font-size="10">cisco.ios.ios_config:</text>
      <text x="120" y="310" fill="#64748b" font-family="monospace" font-size="10"># indentation groups parameters</text>
    </g>
    <g id="viz-read-order">
      <rect x="140" y="380" width="392" height="44" rx="10" fill="#112115" stroke="#a78bfa" stroke-width="1.5"/>
      <text x="336" y="408" fill="#a78bfa" font-family="${FONT}" font-size="11" font-weight="700" text-anchor="middle">Read: play name, hosts, task names first</text>
    </g>`,
			["viz-yaml", "viz-read-order"]
		),

	"ansible-modules-and-idempotency": () =>
		panel(
			"Modules, roles, and check mode",
			`
    <g id="viz-desired">
      <rect x="56" y="100" width="240" height="100" rx="14" fill="#112115" stroke="#6CC04A" stroke-width="2"/>
      <text x="176" y="130" fill="#6CC04A" font-family="${FONT}" font-size="12" font-weight="800" text-anchor="middle">Desired state</text>
      <text x="176" y="158" fill="#9fb3c8" font-family="monospace" font-size="10" text-anchor="middle">vlan_id: 100, name: DATA</text>
      <text x="176" y="182" fill="#64748b" font-family="${FONT}" font-size="10" text-anchor="middle">ios_vlans computes diff</text>
    </g>
    <g id="viz-check">
      <rect x="356" y="100" width="240" height="100" rx="14" fill="#081827" stroke="#f59e0b" stroke-width="2"/>
      <text x="476" y="130" fill="#f59e0b" font-family="${FONT}" font-size="12" font-weight="800" text-anchor="middle">--check</text>
      <text x="476" y="158" fill="#9fb3c8" font-family="monospace" font-size="10" text-anchor="middle">ansible-playbook --check</text>
      <text x="476" y="182" fill="#64748b" font-family="${FONT}" font-size="10" text-anchor="middle">Dry run before apply</text>
    </g>
    <g id="viz-roles">
      <rect x="120" y="240" width="160" height="70" rx="10" fill="#081827" stroke="#a78bfa" stroke-width="2"/>
      <text x="200" y="272" fill="#a78bfa" font-family="${FONT}" font-size="11" font-weight="700" text-anchor="middle">Roles</text>
      <text x="200" y="294" fill="#9fb3c8" font-family="${FONT}" font-size="10" text-anchor="middle">Reuse task bundles</text>
    </g>
    <g id="viz-handlers">
      <rect x="320" y="240" width="160" height="70" rx="10" fill="#081827" stroke="#12b5e5" stroke-width="2"/>
      <text x="400" y="272" fill="#12b5e5" font-family="${FONT}" font-size="11" font-weight="700" text-anchor="middle">Handlers</text>
      <text x="400" y="294" fill="#9fb3c8" font-family="${FONT}" font-size="10" text-anchor="middle">Notify on change only</text>
    </g>
    <text x="336" y="360" fill="#64748b" font-family="${FONT}" font-size="11" text-anchor="middle">Run twice — no duplicate VLANs</text>`,
			["viz-desired", "viz-check", "viz-roles", "viz-handlers"]
		),

	"ansible-vs-python-scripts": () =>
		panel(
			"Match the tool to the scenario",
			`
    <g id="viz-fork">
      <rect x="236" y="72" width="200" height="44" rx="12" fill="#0b2237" stroke="#12b5e5" stroke-width="2"/>
      <text x="336" y="100" fill="#12b5e5" font-family="${FONT}" font-size="12" font-weight="800" text-anchor="middle">What is the job?</text>
      <path d="M 336 116 L 200 150" fill="none" stroke="#6CC04A" stroke-width="2"/>
      <path d="M 336 116 L 472 150" fill="none" stroke="#f59e0b" stroke-width="2"/>
    </g>
    <g id="viz-ansible-path">
      <rect x="56" y="150" width="280" height="200" rx="16" fill="#081827" stroke="#6CC04A" stroke-width="2"/>
      <text x="196" y="178" fill="#6CC04A" font-family="${FONT}" font-size="11" font-weight="800" text-anchor="middle">Repeatable fleet change</text>
      <rect x="88" y="194" width="100" height="56" rx="8" fill="#112115" stroke="#6CC04A" stroke-width="1.5"/>
      <text x="138" y="218" fill="#6CC04A" font-family="monospace" font-size="10" font-weight="700" text-anchor="middle">site.yml</text>
      <text x="138" y="236" fill="#9fb3c8" font-family="monospace" font-size="8" text-anchor="middle">ios_vlans</text>
      <line x1="188" y1="222" x2="220" y2="210" stroke="#6CC04A" stroke-width="2"/>
      <line x1="188" y1="222" x2="220" y2="222" stroke="#6CC04A" stroke-width="2"/>
      <line x1="188" y1="222" x2="220" y2="234" stroke="#6CC04A" stroke-width="2"/>
      <line x1="188" y1="222" x2="220" y2="246" stroke="#6CC04A" stroke-width="2"/>
      ${switchIcon(248, 210, "SW1")}
      ${switchIcon(248, 246, "SW2")}
      <rect x="300" y="200" width="28" height="22" rx="4" fill="#081827" stroke="#6CC04A" stroke-width="1.5"/>
      <text x="314" y="215" fill="#6CC04A" font-family="${FONT}" font-size="9" font-weight="700" text-anchor="middle">+N</text>
      <text x="196" y="320" fill="#64748b" font-family="${FONT}" font-size="10" text-anchor="middle">One playbook, many targets</text>
    </g>
    <g id="viz-python-path">
      <rect x="384" y="150" width="280" height="200" rx="16" fill="#2a1f08" stroke="#f59e0b" stroke-width="2"/>
      <text x="524" y="178" fill="#f59e0b" font-family="${FONT}" font-size="11" font-weight="800" text-anchor="middle">One-off or custom logic</text>
      ${switchIcon(424, 230, "SW", "viz-sw-single")}
      <rect x="480" y="194" width="160" height="90" rx="8" fill="#020617" stroke="#203a56" stroke-width="1.5"/>
      <text x="494" y="214" fill="#64748b" font-family="monospace" font-size="8">% odd show format...</text>
      <text x="494" y="230" fill="#9fb3c8" font-family="monospace" font-size="8">Vlan100  DATA  active</text>
      <text x="494" y="246" fill="#9fb3c8" font-family="monospace" font-size="8">* VLAN0100  data_vlan</text>
      <text x="494" y="262" fill="#f59e0b" font-family="monospace" font-size="8">if "Vlan" in line: ...</text>
      <text x="524" y="320" fill="#64748b" font-family="${FONT}" font-size="10" text-anchor="middle">Parse, glue, troubleshoot once</text>
    </g>
    <g id="viz-rest-hint">
      <rect x="200" y="380" width="272" height="44" rx="10" fill="#0b2237" stroke="#12b5e5" stroke-width="1.5"/>
      <text x="336" y="402" fill="#12b5e5" font-family="${FONT}" font-size="10" font-weight="700" text-anchor="middle">Strong HTTP API?</text>
      <text x="336" y="418" fill="#9fb3c8" font-family="monospace" font-size="9" text-anchor="middle">RESTCONF path (module 3)</text>
    </g>`,
			["viz-fork", "viz-ansible-path", "viz-python-path", "viz-rest-hint"]
		),

	"terraform-selection-basics": () =>
		panel(
			"Terraform plan-and-apply",
			`
    <g id="viz-hcl">
      ${dataFile(80, 120, "main.tf", "#a78bfa", ['resource "iosxe_vlan"', '  vlan_id = 100'], "viz-hcl")}
    </g>
    ${arrow(250, 180, 310, 180)}
    <g id="viz-plan">
      <rect x="310" y="140" width="120" height="80" rx="12" fill="#081827" stroke="#f59e0b" stroke-width="2"/>
      <text x="370" y="176" fill="#f59e0b" font-family="monospace" font-size="12" font-weight="700" text-anchor="middle">plan</text>
      <text x="370" y="200" fill="#9fb3c8" font-family="${FONT}" font-size="10" text-anchor="middle">Preview diff</text>
    </g>
    ${arrow(430, 180, 490, 180)}
    <g id="viz-apply">
      <rect x="490" y="140" width="120" height="80" rx="12" fill="#112115" stroke="#6CC04A" stroke-width="2"/>
      <text x="550" y="176" fill="#6CC04A" font-family="monospace" font-size="12" font-weight="700" text-anchor="middle">apply</text>
      <text x="550" y="200" fill="#9fb3c8" font-family="${FONT}" font-size="10" text-anchor="middle">Execute</text>
    </g>
    <g id="viz-state">
      <rect x="200" y="280" width="272" height="70" rx="14" fill="#0b2237" stroke="#12b5e5" stroke-width="2"/>
      <text x="336" y="310" fill="#12b5e5" font-family="${FONT}" font-size="12" font-weight="700" text-anchor="middle">State file tracks reality</text>
      <text x="336" y="332" fill="#64748b" font-family="${FONT}" font-size="10" text-anchor="middle">Drift detection vs declared intent</text>
    </g>
    <text x="336" y="390" fill="#64748b" font-family="${FONT}" font-size="11" text-anchor="middle">Objective 1.2 — selection and construction</text>`,
			["viz-hcl", "viz-plan", "viz-apply", "viz-state"]
		),

	"terraform-vs-ansible-selection": () =>
		panel(
			"Provision layer vs configure layer",
			`
    <g id="viz-tf-layer">
      <rect x="56" y="80" width="608" height="150" rx="16" fill="#1f1b2e" stroke="#a78bfa" stroke-width="2"/>
      <text x="360" y="108" fill="#a78bfa" font-family="${FONT}" font-size="12" font-weight="800" text-anchor="middle">Day 0 — provision lifecycle</text>
      <rect x="88" y="124" width="90" height="50" rx="8" fill="#081827" stroke="#a78bfa" stroke-width="1.5"/>
      <text x="133" y="148" fill="#a78bfa" font-family="monospace" font-size="9" font-weight="700" text-anchor="middle">main.tf</text>
      <text x="133" y="162" fill="#64748b" font-family="monospace" font-size="8" text-anchor="middle">module</text>
      ${arrow(178, 149, 220, 149, "#a78bfa")}
      <rect x="220" y="124" width="72" height="50" rx="8" fill="#081827" stroke="#f59e0b" stroke-width="1.5"/>
      <text x="256" y="154" fill="#f59e0b" font-family="monospace" font-size="10" font-weight="700" text-anchor="middle">plan</text>
      ${arrow(292, 149, 334, 149, "#a78bfa")}
      <rect x="334" y="118" width="100" height="62" rx="8" fill="#081827" stroke="#12b5e5" stroke-width="1.5"/>
      <text x="384" y="142" fill="#12b5e5" font-family="monospace" font-size="9" font-weight="700" text-anchor="middle">terraform</text>
      <text x="384" y="158" fill="#12b5e5" font-family="monospace" font-size="9" text-anchor="middle">.tfstate</text>
      <text x="384" y="172" fill="#64748b" font-family="${FONT}" font-size="8" text-anchor="middle">tracks reality</text>
      ${arrow(434, 149, 476, 149, "#a78bfa")}
      <g id="viz-cloud">
        <rect x="476" y="118" width="160" height="62" rx="10" fill="#081827" stroke="#a78bfa" stroke-width="1.5"/>
        <text x="556" y="144" fill="#a78bfa" font-family="${FONT}" font-size="10" font-weight="700" text-anchor="middle">Cloud / controller</text>
        <text x="556" y="162" fill="#9fb3c8" font-family="monospace" font-size="8" text-anchor="middle">VPC attach · branch template</text>
      </g>
    </g>
    <g id="viz-divider">
      <line x1="120" y1="248" x2="600" y2="248" stroke="#35536f" stroke-width="1" stroke-dasharray="8 6"/>
      <text x="360" y="268" fill="#64748b" font-family="${FONT}" font-size="10" text-anchor="middle">then day-2 operations</text>
    </g>
    <g id="viz-ansible-layer">
      <rect x="56" y="280" width="608" height="150" rx="16" fill="#112115" stroke="#6CC04A" stroke-width="2"/>
      <text x="360" y="308" fill="#6CC04A" font-family="${FONT}" font-size="12" font-weight="800" text-anchor="middle">Day 2 — IOS config at scale</text>
      <rect x="88" y="324" width="100" height="50" rx="8" fill="#081827" stroke="#6CC04A" stroke-width="1.5"/>
      <text x="138" y="348" fill="#6CC04A" font-family="monospace" font-size="9" font-weight="700" text-anchor="middle">inventory</text>
      <text x="138" y="362" fill="#64748b" font-family="monospace" font-size="8" text-anchor="middle">.yml</text>
      ${arrow(188, 349, 230, 349, "#6CC04A")}
      <rect x="230" y="324" width="100" height="50" rx="8" fill="#081827" stroke="#12b5e5" stroke-width="1.5"/>
      <text x="280" y="354" fill="#12b5e5" font-family="monospace" font-size="9" font-weight="700" text-anchor="middle">playbook</text>
      ${arrow(330, 349, 372, 349, "#6CC04A")}
      ${switchIcon(412, 349, "IOS")}
      ${switchIcon(492, 349, "IOS")}
      ${switchIcon(572, 349, "IOS")}
      <text x="360" y="410" fill="#64748b" font-family="${FONT}" font-size="10" text-anchor="middle">VLAN · ACL · routing on heterogeneous gear</text>
    </g>
    <g id="viz-combo">
      <rect x="160" y="450" width="400" height="40" rx="10" fill="#0b2237" stroke="#f59e0b" stroke-width="2"/>
      <text x="360" y="476" fill="#f59e0b" font-family="${FONT}" font-size="11" font-weight="700" text-anchor="middle">Exam answer: TF for cloud, Ansible for devices</text>
    </g>`,
			["viz-tf-layer", "viz-cloud", "viz-divider", "viz-ansible-layer", "viz-combo"]
		),

	"low-code-vs-custom-automation": () =>
		panel(
			"Low-code vs custom automation",
			`
    <g id="viz-lowcode">
      <rect x="56" y="110" width="260" height="160" rx="14" fill="#081827" stroke="#12b5e5" stroke-width="2"/>
      <text x="186" y="140" fill="#12b5e5" font-family="${FONT}" font-size="12" font-weight="800" text-anchor="middle">Low-code / GUI</text>
      <text x="186" y="172" fill="#9fb3c8" font-family="${FONT}" font-size="11" text-anchor="middle">Fast guarded templates</text>
      <text x="186" y="196" fill="#9fb3c8" font-family="${FONT}" font-size="11" text-anchor="middle">Vendor workflows</text>
      <text x="186" y="220" fill="#9fb3c8" font-family="${FONT}" font-size="11" text-anchor="middle">Teams without Python staff</text>
      <text x="186" y="252" fill="#64748b" font-family="${FONT}" font-size="10" text-anchor="middle">Speed over flexibility</text>
    </g>
    <g id="viz-custom">
      <rect x="356" y="110" width="260" height="160" rx="14" fill="#112115" stroke="#6CC04A" stroke-width="2"/>
      <text x="486" y="140" fill="#6CC04A" font-family="${FONT}" font-size="12" font-weight="800" text-anchor="middle">Custom code</text>
      <text x="486" y="172" fill="#9fb3c8" font-family="${FONT}" font-size="11" text-anchor="middle">Exact fit for your process</text>
      <text x="486" y="196" fill="#9fb3c8" font-family="${FONT}" font-size="11" text-anchor="middle">Git + CI tests</text>
      <text x="486" y="220" fill="#9fb3c8" font-family="${FONT}" font-size="11" text-anchor="middle">Audit via pull requests</text>
      <text x="486" y="252" fill="#64748b" font-family="${FONT}" font-size="10" text-anchor="middle">Enterprise with compliance</text>
    </g>
    <g id="viz-decide">
      <rect x="160" y="300" width="352" height="50" rx="12" fill="#0b2237" stroke="#f59e0b" stroke-width="2"/>
      <text x="336" y="322" fill="#f59e0b" font-family="${FONT}" font-size="11" font-weight="700" text-anchor="middle">Decide from business requirements</text>
      <text x="336" y="340" fill="#64748b" font-family="${FONT}" font-size="10" text-anchor="middle">Time, skills, audit — not buzzwords</text>
    </g>`,
			["viz-lowcode", "viz-custom", "viz-decide"]
		),

	"choosing-your-automation-approach": () =>
		panel(
			"Practical selection checklist",
			`
    <g id="viz-q1">
      ${box(80, 100, 240, 56, "How many devices?", "#12b5e5", "viz-q1", 12)}
      ${box(360, 100, 240, 56, "How often repeated?", "#12b5e5", "viz-q2", 12)}
      ${box(80, 180, 240, 56, "RESTCONF / modules?", "#6CC04A", "viz-q3", 11)}
      ${box(360, 180, 240, 56, "TF state mandated?", "#a78bfa", "viz-q4", 11)}
      ${box(80, 260, 240, 56, "Python or YAML skills?", "#f59e0b", "viz-q5", 11)}
      ${box(360, 260, 240, 56, "Auditors need PRs?", "#ef4444", "viz-q6", 11)}
    </g>
    <g id="viz-answer">
      <rect x="140" y="350" width="392" height="50" rx="12" fill="#112115" stroke="#6CC04A" stroke-width="2"/>
      <text x="336" y="372" fill="#6CC04A" font-family="${FONT}" font-size="11" font-weight="700" text-anchor="middle">Match tool to scenario — exam rewards tradeoffs</text>
      <text x="336" y="390" fill="#64748b" font-family="${FONT}" font-size="10" text-anchor="middle">One-off script / Ansible / Terraform / GUI</text>
    </g>`,
			["viz-q1", "viz-q2", "viz-q3", "viz-q4", "viz-q5", "viz-q6", "viz-answer"]
		),

	"story-beat-recap-toolchains": () =>
		panel(
			"Toolchain theory checkpoint",
			`
    ${arrow(80, 200, 580, 200)}
    ${box(60, 170, 100, 60, "Ansible", "#6CC04A", "viz-check-1", 11)}
    ${box(180, 170, 100, 60, "Terraform", "#a78bfa", "viz-check-2", 10)}
    ${box(300, 170, 100, 60, "Selection", "#f59e0b", "viz-check-3", 11)}
    ${box(420, 170, 90, 60, "Check", "#12b5e5", "viz-check-4", 12)}
    ${box(530, 170, 70, 60, "Lab", "#ef4444", "viz-check-5", 12)}
    <text x="336" y="300" fill="#64748b" font-family="${FONT}" font-size="12" text-anchor="middle">Branch workflow in automation_project next</text>`,
			["viz-check-1", "viz-check-2", "viz-check-3", "viz-check-4", "viz-check-5"]
		),

	"lab-setup-full-workflow": () =>
		panel(
			"Full toolchain lab workflow",
			`
    ${dataFile(60, 130, "inventory/lab.yml", "#6CC04A", ["lab_switches:", "  switch1: .10"], "viz-inv")}
    ${arrow(230, 180, 280, 180)}
    <g id="viz-playbook">
      <rect x="280" y="130" width="150" height="100" rx="12" fill="#081827" stroke="#12b5e5" stroke-width="2"/>
      <text x="355" y="160" fill="#12b5e5" font-family="monospace" font-size="10" font-weight="700" text-anchor="middle">site.yml</text>
      <text x="300" y="184" fill="#9fb3c8" font-family="monospace" font-size="9">ios_vlans + ios_config</text>
      <text x="300" y="202" fill="#64748b" font-family="${FONT}" font-size="9">VLAN + access port</text>
    </g>
    ${arrow(430, 180, 480, 180)}
    <g id="viz-flow">
      <rect x="480" y="120" width="120" height="50" rx="8" fill="#081827" stroke="#f59e0b" stroke-width="2"/>
      <text x="540" y="150" fill="#f59e0b" font-family="monospace" font-size="10" text-anchor="middle">--check</text>
      <rect x="480" y="180" width="120" height="50" rx="8" fill="#112115" stroke="#6CC04A" stroke-width="2"/>
      <text x="540" y="210" fill="#6CC04A" font-family="monospace" font-size="10" text-anchor="middle">apply</text>
    </g>
    <g id="viz-tf">
      <rect x="200" y="280" width="272" height="60" rx="12" fill="#1f1b2e" stroke="#a78bfa" stroke-width="2"/>
      <text x="336" y="306" fill="#a78bfa" font-family="monospace" font-size="11" text-anchor="middle">terraform plan (optional)</text>
      <text x="336" y="326" fill="#64748b" font-family="${FONT}" font-size="10" text-anchor="middle">Same CCNA objects — toolchain delivery</text>
    </g>
    ${switchIcon(336, 380, "Lab SW", "viz-switch")}`,
			["viz-inv", "viz-playbook", "viz-flow", "viz-tf", "viz-switch"]
		),

	"resume-lab-ansible-ready": () =>
		panel(
			"Prepare Ansible for the lab",
			`
    ${terminalBlock(80, 80, 512, 240, [
			"$ cd automation_project",
			"$ source env/bin/activate",
			"$ ansible --version",
			"$ ansible-galaxy collection install cisco.ios",
		], "viz-term")}
    <g id="viz-inv-note">
      <rect x="140" y="350" width="392" height="50" rx="12" fill="#112115" stroke="#6CC04A" stroke-width="2"/>
      <text x="336" y="372" fill="#6CC04A" font-family="${FONT}" font-size="11" font-weight="700" text-anchor="middle">Lab credentials in inventory only</text>
      <text x="336" y="390" fill="#64748b" font-family="${FONT}" font-size="10" text-anchor="middle">Vault / env vars in production</text>
    </g>`,
			["viz-term", "viz-inv-note"]
		),

	"story-beat-common-mistake-toolchains": () =>
		panel(
			"Skipping check mode scales mistakes",
			`
    <g id="viz-bad">
      <rect x="56" y="110" width="260" height="150" rx="14" fill="#1a1215" stroke="#ef4444" stroke-width="2"/>
      <text x="186" y="140" fill="#ef4444" font-family="${FONT}" font-size="12" font-weight="800" text-anchor="middle">Skip --check</text>
      <text x="76" y="172" fill="#9fb3c8" font-family="${FONT}" font-size="11">Stale IP in inventory</text>
      <text x="76" y="196" fill="#9fb3c8" font-family="${FONT}" font-size="11">Prod + lab in one group</text>
      <text x="76" y="220" fill="#9fb3c8" font-family="${FONT}" font-size="11">Playbook worked once</text>
      <text x="186" y="248" fill="#ef4444" font-family="${FONT}" font-size="11" text-anchor="middle">VLAN on wrong switch</text>
    </g>
    ${arrow(326, 185, 390, 185)}
    <g id="viz-good">
      <rect x="400" y="110" width="240" height="150" rx="14" fill="#112115" stroke="#6CC04A" stroke-width="2"/>
      <text x="520" y="140" fill="#6CC04A" font-family="${FONT}" font-size="12" font-weight="800" text-anchor="middle">Safer pattern</text>
      <text x="420" y="172" fill="#6CC04A" font-family="monospace" font-size="10">--check --limit switch1</text>
      <text x="420" y="196" fill="#9fb3c8" font-family="${FONT}" font-size="11">Review inventory diffs</text>
      <text x="420" y="220" fill="#9fb3c8" font-family="${FONT}" font-size="11">Archive check output</text>
      <text x="520" y="248" fill="#6CC04A" font-family="${FONT}" font-size="11" text-anchor="middle">Like routing table changes</text>
    </g>`,
			["viz-bad", "viz-good"]
		),

	"certification-alignment-toolchains": () =>
		panel(
			"Exam objectives 1.1, 1.2, 1.5",
			`
    <g id="viz-badge">
      <rect x="218" y="70" width="236" height="72" rx="14" fill="#0b2237" stroke="#12b5e5" stroke-width="2"/>
      <text x="336" y="100" fill="#12b5e5" font-family="${FONT}" font-size="14" font-weight="900" text-anchor="middle">CCNP 1.1 + 1.2 + 1.5</text>
      <text x="336" y="122" fill="#9fb3c8" font-family="${FONT}" font-size="11" text-anchor="middle">Ansible, Terraform, selection</text>
    </g>
    ${arrow(336, 142, 336, 170)}
    <g id="viz-topics">
      ${box(60, 180, 120, 56, "Playbooks", "#6CC04A", "viz-play", 11)}
      ${box(200, 180, 120, 56, "Check mode", "#f59e0b", "viz-check", 11)}
      ${box(340, 180, 120, 56, "TF plan", "#a78bfa", "viz-tf", 12)}
      ${box(480, 180, 120, 56, "Selection", "#12b5e5", "viz-pick", 11)}
    </g>
    <g id="viz-skill">
      <rect x="160" y="280" width="352" height="60" rx="12" fill="#081827" stroke="#a78bfa" stroke-width="2"/>
      <text x="336" y="308" fill="#a78bfa" font-family="${FONT}" font-size="12" font-weight="700" text-anchor="middle">Justify which toolchain fits the team</text>
      <text x="336" y="328" fill="#64748b" font-family="${FONT}" font-size="11" text-anchor="middle">Inventory purpose · when state adds value</text>
    </g>`,
			["viz-badge", "viz-play", "viz-check", "viz-tf", "viz-pick", "viz-skill"]
		),

	"toolchains-ready-capstone-next": () =>
		panel(
			"Toolchains complete — capstone next",
			`
    ${box(60, 200, 100, 64, "Git", "#12b5e5", "viz-git", 12)}
    ${arrow(160, 232, 200, 232)}
    ${box(200, 200, 100, 64, "Ansible", "#6CC04A", "viz-ansible", 11)}
    ${arrow(300, 232, 340, 232)}
    ${box(340, 200, 100, 64, "RESTCONF", "#f59e0b", "viz-api", 10)}
    ${arrow(440, 232, 480, 232)}
    ${box(480, 200, 120, 64, "Capstone", "#a78bfa", "viz-cap", 11)}
    <text x="336" y="320" fill="#64748b" font-family="${FONT}" font-size="12" text-anchor="middle">Enterprise branch deployment end to end</text>
    <g id="viz-habits">
      <rect x="140" y="350" width="392" height="44" rx="10" fill="#112115" stroke="#6CC04A" stroke-width="1.5"/>
      <text x="336" y="378" fill="#6CC04A" font-family="${FONT}" font-size="11" font-weight="700" text-anchor="middle">Check mode · GET-before-PATCH · inventory in Git</text>
    </g>`,
			["viz-git", "viz-ansible", "viz-api", "viz-cap", "viz-habits"]
		),
};
