// Hand-tuned module 02 visuals — Python for Network Automation

import { arrow, box, dataFile, FONT, panel, pythonFile, switchIcon } from "./course1VisualHelpers";

export const MODULE02_COURSE1_VISUALS: Record<string, () => ReturnType<typeof panel>> = {
	"python-powers-network-automation": () =>
		panel(
			"Python at the center of network automation",
			`
    <g id="viz-python">
      <rect x="276" y="200" width="120" height="100" rx="16" fill="#2a1f08" stroke="#f59e0b" stroke-width="2"/>
      <text x="336" y="248" fill="#f59e0b" font-family="monospace" font-size="22" font-weight="900" text-anchor="middle">Python</text>
      <text x="336" y="272" fill="#9fb3c8" font-family="${FONT}" font-size="11" text-anchor="middle">read · change · debug</text>
    </g>
    ${arrow(336, 200, 336, 130, "#f59e0b")}
    ${box(270, 80, 132, 50, "Ansible modules", "#6CC04A", "viz-ansible")}
    ${arrow(396, 250, 470, 200, "#12b5e5")}
    ${box(470, 170, 120, 60, "Netmiko", "#12b5e5", "viz-netmiko")}
    ${arrow(276, 250, 200, 200, "#a78bfa")}
    ${box(80, 170, 120, 60, "REST APIs", "#a78bfa", "viz-api")}
    ${arrow(336, 300, 336, 370, "#12b5e5")}
    ${switchIcon(336, 420, "Lab SW", "viz-switch")}
    <text x="336" y="500" fill="#64748b" font-family="${FONT}" font-size="12" text-anchor="middle">One language — many automation paths</text>`,
			["viz-python", "viz-ansible", "viz-netmiko", "viz-api", "viz-switch"]
		),

	"python-essentials-for-networkers": () =>
		panel(
			"Four Python building blocks",
			`
    <g id="viz-vars">
      <rect x="56" y="90" width="290" height="120" rx="14" fill="#081827" stroke="#12b5e5" stroke-width="2"/>
      <text x="201" y="122" fill="#12b5e5" font-family="${FONT}" font-size="14" font-weight="700" text-anchor="middle">Variables</text>
      <text x="201" y="152" fill="#9fb3c8" font-family="monospace" font-size="11" text-anchor="middle">host = "192.168.1.10"</text>
      <text x="201" y="178" fill="#64748b" font-family="${FONT}" font-size="10" text-anchor="middle">IPs, VLAN IDs, credentials</text>
    </g>
    <g id="viz-func">
      <rect x="374" y="90" width="290" height="120" rx="14" fill="#081827" stroke="#6CC04A" stroke-width="2"/>
      <text x="519" y="122" fill="#6CC04A" font-family="${FONT}" font-size="14" font-weight="700" text-anchor="middle">Functions</text>
      <text x="519" y="152" fill="#9fb3c8" font-family="monospace" font-size="11" text-anchor="middle">def connect(): ...</text>
      <text x="519" y="178" fill="#64748b" font-family="${FONT}" font-size="10" text-anchor="middle">Reusable steps by name</text>
    </g>
    <g id="viz-indent">
      <rect x="56" y="230" width="290" height="130" rx="14" fill="#081827" stroke="#f59e0b" stroke-width="2"/>
      <text x="76" y="258" fill="#f59e0b" font-family="${FONT}" font-size="12" font-weight="700">Indentation</text>
      <text x="76" y="282" fill="#f59e0b" font-family="monospace" font-size="11">if link_up:</text>
      <text x="92" y="300" fill="#9fb3c8" font-family="monospace" font-size="11">send_config()</text>
      <text x="76" y="318" fill="#f59e0b" font-family="monospace" font-size="11">else:</text>
      <text x="92" y="336" fill="#9fb3c8" font-family="monospace" font-size="11">log_error()</text>
      <text x="201" y="352" fill="#64748b" font-family="${FONT}" font-size="10" text-anchor="middle">Groups code like IOS sub-modes</text>
    </g>
    <g id="viz-import">
      <rect x="374" y="230" width="290" height="130" rx="14" fill="#081827" stroke="#a78bfa" stroke-width="2"/>
      <text x="394" y="258" fill="#a78bfa" font-family="${FONT}" font-size="12" font-weight="700">import</text>
      <text x="394" y="282" fill="#a78bfa" font-family="monospace" font-size="10">from netmiko import</text>
      <text x="394" y="300" fill="#a78bfa" font-family="monospace" font-size="10">  ConnectHandler</text>
      <text x="519" y="340" fill="#64748b" font-family="${FONT}" font-size="10" text-anchor="middle">Loads libraries at the top</text>
    </g>`,
			["viz-vars", "viz-func", "viz-indent", "viz-import"]
		),

	"reading-python-without-fear": () =>
		panel(
			"Read a network script bottom-up",
			`
    <g id="viz-editor">
      <rect x="72" y="88" width="420" height="300" rx="14" fill="#020617" stroke="#203a56" stroke-width="1.5"/>
      <text x="92" y="118" fill="#64748b" font-family="monospace" font-size="10"># imports (read last)</text>
      <text x="92" y="138" fill="#a78bfa" font-family="monospace" font-size="10">from netmiko import ConnectHandler</text>
      <text x="92" y="172" fill="#64748b" font-family="monospace" font-size="10"># functions (read second)</text>
      <text x="92" y="192" fill="#6CC04A" font-family="monospace" font-size="10">def push_vlan(conn):</text>
      <text x="108" y="210" fill="#9fb3c8" font-family="monospace" font-size="10">conn.send_config_set(...)</text>
      <text x="92" y="244" fill="#64748b" font-family="monospace" font-size="10"># entry point (start here)</text>
      <text x="92" y="264" fill="#f59e0b" font-family="monospace" font-size="10" font-weight="700">if __name__ == "__main__":</text>
      <text x="108" y="282" fill="#f59e0b" font-family="monospace" font-size="10">main()</text>
    </g>
    <g id="viz-read-order">
      <path d="M520 280 L520 200 L540 200 L540 130" fill="none" stroke="#12b5e5" stroke-width="2"/>
      <polygon points="540,130 532,142 548,142" fill="#12b5e5"/>
      <text x="560" y="268" fill="#12b5e5" font-family="${FONT}" font-size="11" font-weight="700">Start</text>
      <text x="560" y="286" fill="#9fb3c8" font-family="${FONT}" font-size="10">here</text>
    </g>
    <g id="viz-flow-hint">
      <rect x="140" y="410" width="392" height="52" rx="12" fill="#081827" stroke="#12b5e5" stroke-width="1.5"/>
      <text x="336" y="432" fill="#12b5e5" font-family="${FONT}" font-size="11" font-weight="700" text-anchor="middle">Read order: main</text>
      <text x="336" y="450" fill="#9fb3c8" font-family="${FONT}" font-size="10" text-anchor="middle">then functions, then imports</text>
    </g>`,
			["viz-editor", "viz-read-order", "viz-flow-hint"]
		),

	"data-structures-for-device-data": () =>
		panel(
			"Lists vs dictionaries for network data",
			`
    <g id="viz-list">
      <text x="180" y="95" fill="#12b5e5" font-family="${FONT}" font-size="13" font-weight="800" text-anchor="middle">List — ordered commands</text>
      <rect x="80" y="110" width="200" height="36" rx="8" fill="#0b2237" stroke="#12b5e5" stroke-width="1.5"/>
      <text x="100" y="133" fill="#f8fafc" font-family="monospace" font-size="12">[0] vlan 100</text>
      <rect x="80" y="152" width="200" height="36" rx="8" fill="#0b2237" stroke="#12b5e5" stroke-width="1.5"/>
      <text x="100" y="175" fill="#f8fafc" font-family="monospace" font-size="12">[1] name DATA_VLAN</text>
      <rect x="80" y="194" width="200" height="36" rx="8" fill="#0b2237" stroke="#12b5e5" stroke-width="1.5"/>
      <text x="100" y="217" fill="#f8fafc" font-family="monospace" font-size="12">[2] exit</text>
    </g>
    <line x1="336" y1="100" x2="336" y2="280" stroke="#35536f" stroke-width="1"/>
    <g id="viz-dict">
      <text x="500" y="95" fill="#6CC04A" font-family="${FONT}" font-size="13" font-weight="800" text-anchor="middle">Dict — device profile</text>
      <rect x="400" y="120" width="200" height="32" rx="8" fill="#112115" stroke="#6CC04A" stroke-width="1.5"/>
      <text x="420" y="141" fill="#6CC04A" font-family="monospace" font-size="11">host: 192.168.1.10</text>
      <rect x="400" y="158" width="200" height="32" rx="8" fill="#112115" stroke="#6CC04A" stroke-width="1.5"/>
      <text x="420" y="179" fill="#6CC04A" font-family="monospace" font-size="11">device_type: cisco_ios</text>
      <rect x="400" y="196" width="200" height="32" rx="8" fill="#112115" stroke="#6CC04A" stroke-width="1.5"/>
      <text x="420" y="217" fill="#6CC04A" font-family="monospace" font-size="11">username: admin</text>
      <text x="500" y="260" fill="#64748b" font-family="${FONT}" font-size="11" text-anchor="middle">Netmiko expects this shape</text>
    </g>
    <text x="336" y="310" fill="#ef4444" font-family="${FONT}" font-size="12" text-anchor="middle">Wrong shape → silent failures</text>`,
			["viz-list", "viz-dict"]
		),

	"yaml-json-xml-formats": () =>
		panel(
			"Config formats feed Python",
			`
    ${dataFile(60, 120, "devices.yaml", "#6CC04A", ["host: 10.0.0.1", "vlan: 100"], "viz-yaml")}
    ${dataFile(280, 120, "api.json", "#12b5e5", ["{ vlan: 100 }", "state: up"], "viz-json")}
    ${dataFile(500, 120, "netconf.xml", "#a78bfa", ["<vlan-id>100</vlan-id>"], "viz-xml")}
    ${arrow(220, 200, 280, 260, "#6CC04A")}
    ${arrow(360, 200, 336, 260, "#12b5e5")}
    ${arrow(500, 200, 392, 260, "#a78bfa")}
    <g id="viz-python-dict">
      <rect x="240" y="260" width="192" height="90" rx="14" fill="#2a1f08" stroke="#f59e0b" stroke-width="2"/>
      <text x="336" y="295" fill="#f59e0b" font-family="monospace" font-size="13" font-weight="700" text-anchor="middle">Python dict</text>
      <text x="336" y="318" fill="#9fb3c8" font-family="monospace" font-size="11" text-anchor="middle">load → loop → configure</text>
    </g>
    ${arrow(336, 350, 336, 400)}
    ${switchIcon(336, 440, "SW", "viz-switch")}
    <text x="336" y="510" fill="#64748b" font-family="${FONT}" font-size="11" text-anchor="middle">Store data in files — not magic numbers in scripts</text>`,
			["viz-yaml", "viz-json", "viz-xml", "viz-python-dict", "viz-switch"]
		),

	"config-data-from-files": () =>
		panel(
			"YAML file drives many devices",
			`
    <g id="viz-yaml-file">
      <rect x="60" y="140" width="150" height="140" rx="12" fill="#081827" stroke="#6CC04A" stroke-width="2"/>
      <text x="80" y="170" fill="#6CC04A" font-family="monospace" font-size="12" font-weight="700">devices.yaml</text>
      <text x="80" y="194" fill="#9fb3c8" font-family="monospace" font-size="10">switches:</text>
      <text x="90" y="212" fill="#9fb3c8" font-family="monospace" font-size="10">- host: .10</text>
      <text x="90" y="230" fill="#9fb3c8" font-family="monospace" font-size="10">- host: .11</text>
      <text x="90" y="248" fill="#9fb3c8" font-family="monospace" font-size="10">- host: .12</text>
    </g>
    ${arrow(210, 210, 260, 210)}
    ${pythonFile(252, 168, 148, 86, "viz-script", { filename: "loop_switches.py", lines: ["import netmiko", "for sw in hosts:"] })}
    ${arrow(380, 210, 430, 180)}
    ${arrow(380, 210, 430, 210)}
    ${arrow(380, 210, 430, 240)}
    <g id="viz-fleet">
      ${switchIcon(470, 160, "SW1")}
      ${switchIcon(470, 210, "SW2")}
      ${switchIcon(470, 260, "SW3")}
    </g>
    <g id="viz-git">
      <rect x="200" y="320" width="320" height="44" rx="10" fill="#0b2237" stroke="#12b5e5" stroke-width="1.5"/>
      <text x="360" y="348" fill="#12b5e5" font-family="${FONT}" font-size="12" font-weight="700" text-anchor="middle">Version in Git — one change updates all</text>
    </g>`,
			["viz-yaml-file", "viz-script", "viz-fleet", "viz-git"]
		),

	"error-handling-that-saves-outages": () =>
		panel(
			"try / except protects production",
			`
    <g id="viz-try">
      <rect x="100" y="100" width="200" height="180" rx="16" fill="#112115" stroke="#6CC04A" stroke-width="2"/>
      <text x="200" y="130" fill="#6CC04A" font-family="monospace" font-size="13" font-weight="700" text-anchor="middle">try:</text>
      <text x="120" y="158" fill="#9fb3c8" font-family="monospace" font-size="11">conn = ConnectHandler(...)</text>
      <text x="120" y="178" fill="#9fb3c8" font-family="monospace" font-size="11">conn.send_config_set(...)</text>
      <text x="120" y="198" fill="#9fb3c8" font-family="monospace" font-size="11">print(output)</text>
    </g>
    ${arrow(300, 190, 360, 190)}
    <g id="viz-except">
      <rect x="360" y="100" width="200" height="180" rx="16" fill="#1a1215" stroke="#ef4444" stroke-width="2"/>
      <text x="460" y="130" fill="#ef4444" font-family="monospace" font-size="13" font-weight="700" text-anchor="middle">except:</text>
      <text x="380" y="165" fill="#9fb3c8" font-family="${FONT}" font-size="11">Log which host failed</text>
      <text x="380" y="188" fill="#9fb3c8" font-family="${FONT}" font-size="11">Print clear error message</text>
      <text x="380" y="211" fill="#9fb3c8" font-family="${FONT}" font-size="11">conn.disconnect()</text>
    </g>
    <g id="viz-finally">
      <rect x="200" y="310" width="272" height="50" rx="12" fill="#081827" stroke="#f59e0b" stroke-width="2"/>
      <text x="336" y="342" fill="#f59e0b" font-family="${FONT}" font-size="12" font-weight="700" text-anchor="middle">Never blind-retry without reading the error</text>
    </g>`,
			["viz-try", "viz-except", "viz-finally"]
		),

	"netmiko-connection-pattern": () =>
		panel(
			"Netmiko four-step rhythm",
			`
    ${box(50, 180, 100, 64, "1. Connect", "#12b5e5", "viz-step-1", 12)}
    ${arrow(150, 212, 190, 212)}
    <rect x="190" y="198" width="56" height="28" rx="6" fill="#2a1f08" stroke="#f59e0b" stroke-width="2"/>
    <text x="218" y="216" fill="#f59e0b" font-family="monospace" font-size="10" text-anchor="middle">SSH</text>
    ${arrow(246, 212, 286, 212)}
    ${switchIcon(326, 212, "SW", "viz-switch")}
    ${arrow(366, 212, 406, 212)}
    ${box(406, 180, 110, 64, "2. Show/Config", "#6CC04A", "viz-step-2", 11)}
    ${arrow(516, 212, 556, 212)}
    ${box(556, 180, 100, 64, "3. Verify", "#f59e0b", "viz-step-3", 12)}
    <g id="viz-step-4">
      <rect x="280" y="300" width="160" height="56" rx="12" fill="#081827" stroke="#a78bfa" stroke-width="2"/>
      <text x="360" y="334" fill="#a78bfa" font-family="${FONT}" font-size="13" font-weight="700" text-anchor="middle">4. disconnect()</text>
    </g>
    ${arrow(461, 244, 400, 300, "#a78bfa")}
    <text x="336" y="400" fill="#64748b" font-family="${FONT}" font-size="11" text-anchor="middle">Same discipline as a CCNA lab session</text>`,
			["viz-step-1", "viz-step-2", "viz-step-3", "viz-step-4", "viz-switch"]
		),

	"story-beat-recap-python": () =>
		panel(
			"Python theory checkpoint",
			`
    ${arrow(100, 200, 560, 200)}
    ${box(70, 170, 110, 60, "Data types", "#6CC04A", "viz-check-1", 12)}
    ${box(230, 170, 110, 60, "File formats", "#6CC04A", "viz-check-2", 12)}
    ${box(390, 170, 110, 60, "Netmiko", "#12b5e5", "viz-check-3", 12)}
    ${box(550, 170, 90, 60, "Lab", "#f59e0b", "viz-check-4", 12)}
    <text x="336" y="300" fill="#64748b" font-family="${FONT}" font-size="12" text-anchor="middle">Push real configs in the lab next</text>`,
			["viz-check-1", "viz-check-2", "viz-check-3", "viz-check-4"]
		),

	"lab-setup-python-automation": () =>
		panel(
			"Today's automation targets",
			`
    ${switchIcon(336, 260, "Lab SW", "viz-switch")}
    <g id="viz-vlan">
      <rect x="80" y="120" width="100" height="56" rx="10" fill="#081827" stroke="#12b5e5" stroke-width="2"/>
      <text x="130" y="152" fill="#12b5e5" font-family="${FONT}" font-size="12" font-weight="700" text-anchor="middle">VLAN 100</text>
      ${arrow(180, 148, 296, 230, "#12b5e5")}
    </g>
    <g id="viz-intf">
      <rect x="540" y="120" width="100" height="56" rx="10" fill="#081827" stroke="#6CC04A" stroke-width="2"/>
      <text x="590" y="148" fill="#6CC04A" font-family="${FONT}" font-size="11" font-weight="700" text-anchor="middle">Access port</text>
      ${arrow(540, 148, 376, 230, "#6CC04A")}
    </g>
    <g id="viz-ospf">
      <rect x="80" y="340" width="100" height="56" rx="10" fill="#081827" stroke="#f59e0b" stroke-width="2"/>
      <text x="130" y="372" fill="#f59e0b" font-family="${FONT}" font-size="12" font-weight="700" text-anchor="middle">OSPF</text>
      ${arrow(180, 368, 296, 290, "#f59e0b")}
    </g>
    <g id="viz-acl">
      <rect x="540" y="340" width="100" height="56" rx="10" fill="#081827" stroke="#ef4444" stroke-width="2"/>
      <text x="590" y="372" fill="#ef4444" font-family="${FONT}" font-size="12" font-weight="700" text-anchor="middle">ACL</text>
      ${arrow(540, 368, 376, 290, "#ef4444")}
    </g>
    ${pythonFile(248, 388, 176, 88, "viz-script", { filename: "lab_config.py", lines: ["import netmiko", "send_config_set()"] })}
    ${arrow(336, 388, 336, 316, "#f59e0b")}`,
			["viz-switch", "viz-vlan", "viz-intf", "viz-ospf", "viz-acl", "viz-script"]
		),

	"resume-your-lab-environment": () =>
		panel(
			"Resume module 1 lab",
			`
    <g id="viz-term">
      <rect x="100" y="90" width="472" height="280" rx="16" fill="#020617" stroke="#12b5e5" stroke-width="2"/>
      <circle cx="128" cy="118" r="6" fill="#ef4444"/><circle cx="148" cy="118" r="6" fill="#f59e0b"/><circle cx="168" cy="118" r="6" fill="#6CC04A"/>
      <text x="120" y="158" fill="#9fb3c8" font-family="monospace" font-size="13">$ cd automation_project</text>
      <text x="120" y="186" fill="#6CC04A" font-family="monospace" font-size="13">$ source env/bin/activate</text>
      <text x="120" y="214" fill="#64748b" font-family="monospace" font-size="12">(env) $ pip show netmiko</text>
      <text x="120" y="242" fill="#9fb3c8" font-family="monospace" font-size="11">Name: netmiko</text>
      <text x="120" y="262" fill="#9fb3c8" font-family="monospace" font-size="11">Version: 4.x</text>
    </g>
    <g id="viz-ready">
      <circle cx="336" cy="410" r="22" fill="#112115" stroke="#6CC04A" stroke-width="2"/>
      <path d="M326 410l6 6 14-16" fill="none" stroke="#6CC04A" stroke-width="3" stroke-linecap="round"/>
    </g>`,
			["viz-term", "viz-ready"]
		),

	"story-beat-common-mistake-python": () =>
		panel(
			"Hard-coded secrets vs safe pattern",
			`
    <g id="viz-bad">
      <rect x="60" y="110" width="240" height="150" rx="14" fill="#1a1215" stroke="#ef4444" stroke-width="2"/>
      <text x="180" y="140" fill="#ef4444" font-family="${FONT}" font-size="12" font-weight="800" text-anchor="middle">Production script</text>
      <text x="80" y="168" fill="#f8fafc" font-family="monospace" font-size="10">password = "admin123"</text>
      <line x1="75" y1="178" x2="285" y2="178" stroke="#ef4444" stroke-width="2"/>
      <text x="180" y="210" fill="#ef4444" font-family="${FONT}" font-size="11" text-anchor="middle">Secrets in Git</text>
      <text x="180" y="232" fill="#9fb3c8" font-family="${FONT}" font-size="11" text-anchor="middle">No try/except</text>
    </g>
    ${arrow(310, 185, 380, 185)}
    <g id="viz-good">
      <rect x="400" y="110" width="240" height="150" rx="14" fill="#112115" stroke="#6CC04A" stroke-width="2"/>
      <text x="520" y="140" fill="#6CC04A" font-family="${FONT}" font-size="12" font-weight="800" text-anchor="middle">Safer pattern</text>
      <text x="420" y="168" fill="#9fb3c8" font-family="monospace" font-size="10">password = os.getenv(...)</text>
      <text x="420" y="192" fill="#9fb3c8" font-family="monospace" font-size="10">try: connect()</text>
      <text x="420" y="216" fill="#9fb3c8" font-family="monospace" font-size="10">except: log(host)</text>
      <text x="520" y="245" fill="#6CC04A" font-family="${FONT}" font-size="11" text-anchor="middle">Vault / env vars</text>
    </g>`,
			["viz-bad", "viz-good"]
		),

	"certification-alignment-python": () =>
		panel(
			"Exam objective 1.4 alignment",
			`
    <g id="viz-badge">
      <rect x="218" y="70" width="236" height="72" rx="14" fill="#0b2237" stroke="#12b5e5" stroke-width="2"/>
      <text x="336" y="100" fill="#12b5e5" font-family="${FONT}" font-size="14" font-weight="900" text-anchor="middle">CCNP 1.4</text>
      <text x="336" y="122" fill="#9fb3c8" font-family="${FONT}" font-size="11" text-anchor="middle">Python for network configuration</text>
    </g>
    ${arrow(336, 142, 336, 170)}
    <g id="viz-topics">
      ${box(60, 180, 120, 56, "VLAN", "#12b5e5", "viz-vlan", 12)}
      ${box(210, 180, 120, 56, "Interface", "#6CC04A", "viz-intf", 11)}
      ${box(360, 180, 120, 56, "OSPF", "#f59e0b", "viz-ospf", 12)}
      ${box(510, 180, 120, 56, "ACL", "#ef4444", "viz-acl", 12)}
    </g>
    <g id="viz-skill">
      <rect x="160" y="280" width="352" height="60" rx="12" fill="#081827" stroke="#a78bfa" stroke-width="2"/>
      <text x="336" y="308" fill="#a78bfa" font-family="${FONT}" font-size="12" font-weight="700" text-anchor="middle">Explain scripts — don't memorize blindly</text>
      <text x="336" y="328" fill="#64748b" font-family="${FONT}" font-size="11" text-anchor="middle">List vs dict · connect to disconnect</text>
    </g>`,
			["viz-badge", "viz-vlan", "viz-intf", "viz-ospf", "viz-acl", "viz-skill"]
		),

	"python-automation-ready": () =>
		panel(
			"Python complete — APIs next",
			`
    ${box(100, 200, 140, 80, "Python + Netmiko", "#f59e0b", "viz-python", 12)}
    ${arrow(240, 240, 320, 240)}
    ${box(320, 200, 140, 80, "SSH configs", "#12b5e5", "viz-ssh", 12)}
    ${arrow(460, 240, 540, 240)}
    ${box(540, 200, 140, 80, "REST / RESTCONF", "#6CC04A", "viz-api", 11)}
    <text x="336" y="330" fill="#64748b" font-family="${FONT}" font-size="12" text-anchor="middle">Module 3 — programmatic interfaces</text>
    <g id="viz-carry">
      <rect x="180" y="360" width="312" height="44" rx="10" fill="#112115" stroke="#6CC04A" stroke-width="1.5"/>
      <text x="336" y="388" fill="#6CC04A" font-family="${FONT}" font-size="11" font-weight="700" text-anchor="middle">Keep scripts · version YAML · add error handling</text>
    </g>`,
			["viz-python", "viz-ssh", "viz-api", "viz-carry"]
		),
};
