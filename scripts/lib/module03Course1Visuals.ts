// Hand-tuned module 03 visuals — APIs and Network Programmability

import {
	arrow,
	box,
	FONT,
	httpVerb,
	panel,
	pythonFile,
	statusBadge,
	switchIcon,
	terminalBlock,
} from "./course1VisualHelpers";

export const MODULE03_COURSE1_VISUALS: Record<string, () => ReturnType<typeof panel>> = {
	"apis-beyond-ssh-scraping": () =>
		panel(
			"Screen scraping vs structured API",
			`
    <g id="viz-scrape">
      <rect x="56" y="90" width="240" height="200" rx="14" fill="#1a1215" stroke="#ef4444" stroke-width="2"/>
      <text x="176" y="118" fill="#ef4444" font-family="${FONT}" font-size="12" font-weight="800" text-anchor="middle">SSH + regex</text>
      <text x="76" y="148" fill="#9fb3c8" font-family="monospace" font-size="9">Vlan100  DATA_VLAN active</text>
      <text x="76" y="166" fill="#9fb3c8" font-family="monospace" font-size="9">Vlan200  VOICE      active</text>
      <text x="76" y="190" fill="#64748b" font-family="monospace" font-size="9">... reformatted output ...</text>
      <line x1="70" y1="210" x2="282" y2="210" stroke="#ef4444" stroke-width="2"/>
      <text x="176" y="238" fill="#ef4444" font-family="${FONT}" font-size="11" text-anchor="middle">Vendor changes format</text>
      <text x="176" y="258" fill="#9fb3c8" font-family="${FONT}" font-size="10" text-anchor="middle">Script breaks silently</text>
    </g>
    <g id="viz-vs">
      <text x="336" y="200" fill="#64748b" font-family="${FONT}" font-size="22" font-weight="900" text-anchor="middle">vs</text>
    </g>
    <g id="viz-api">
      <rect x="376" y="90" width="240" height="200" rx="14" fill="#112115" stroke="#6CC04A" stroke-width="2"/>
      <text x="496" y="118" fill="#6CC04A" font-family="${FONT}" font-size="12" font-weight="800" text-anchor="middle">RESTCONF GET</text>
      <text x="396" y="152" fill="#9fb3c8" font-family="monospace" font-size="9">{</text>
      <text x="408" y="170" fill="#6CC04A" font-family="monospace" font-size="9">"id": 100,</text>
      <text x="408" y="188" fill="#6CC04A" font-family="monospace" font-size="9">"name": "DATA_VLAN"</text>
      <text x="396" y="206" fill="#9fb3c8" font-family="monospace" font-size="9">}</text>
      <text x="496" y="248" fill="#6CC04A" font-family="${FONT}" font-size="11" text-anchor="middle">Typed fields from YANG</text>
      <text x="496" y="268" fill="#9fb3c8" font-family="${FONT}" font-size="10" text-anchor="middle">Predictable automation</text>
    </g>
    <text x="336" y="340" fill="#64748b" font-family="${FONT}" font-size="11" text-anchor="middle">Request objects — not paragraphs to parse</text>`,
			["viz-scrape", "viz-vs", "viz-api"]
		),

	"what-is-rest": () =>
		panel(
			"REST building blocks",
			`
    <g id="viz-url">
      <rect x="80" y="88" width="512" height="44" rx="10" fill="#0b2237" stroke="#12b5e5" stroke-width="2"/>
      <text x="336" y="116" fill="#12b5e5" font-family="monospace" font-size="11" text-anchor="middle">https://device/restconf/data/native/vlan</text>
      <text x="336" y="148" fill="#64748b" font-family="${FONT}" font-size="10" text-anchor="middle">URL identifies the resource</text>
    </g>
    <g id="viz-verbs">
      ${httpVerb(100, 180, "GET", "#6CC04A", "viz-get")}
      ${httpVerb(200, 180, "PATCH", "#f59e0b")}
      ${httpVerb(310, 180, "POST", "#12b5e5")}
      ${httpVerb(410, 180, "DELETE", "#ef4444")}
      <text x="336" y="232" fill="#9fb3c8" font-family="${FONT}" font-size="11" text-anchor="middle">HTTP verbs tell the server what to do</text>
    </g>
    <g id="viz-status">
      ${statusBadge(120, 270, "200", "OK", "#6CC04A")}
      ${statusBadge(280, 270, "401", "Auth fail", "#f59e0b")}
      ${statusBadge(440, 270, "404", "Not found", "#ef4444")}
      <text x="336" y="360" fill="#64748b" font-family="${FONT}" font-size="11" text-anchor="middle">Status codes signal success or failure</text>
    </g>`,
			["viz-url", "viz-verbs", "viz-status"]
		),

	"rest-for-network-engineers": () =>
		panel(
			"REST mapped to CLI habits",
			`
    <g id="viz-get-map">
      <rect x="56" y="100" width="260" height="140" rx="14" fill="#081827" stroke="#12b5e5" stroke-width="2"/>
      <text x="186" y="132" fill="#12b5e5" font-family="${FONT}" font-size="13" font-weight="800" text-anchor="middle">GET request</text>
      <text x="186" y="162" fill="#9fb3c8" font-family="monospace" font-size="10" text-anchor="middle">structured show vlan</text>
      <text x="186" y="188" fill="#64748b" font-family="${FONT}" font-size="10" text-anchor="middle">JSON fields, not screen text</text>
      <text x="186" y="218" fill="#6CC04A" font-family="${FONT}" font-size="11" font-weight="700" text-anchor="middle">Read state</text>
    </g>
    <g id="viz-patch-map">
      <rect x="356" y="100" width="260" height="140" rx="14" fill="#081827" stroke="#f59e0b" stroke-width="2"/>
      <text x="486" y="132" fill="#f59e0b" font-family="${FONT}" font-size="13" font-weight="800" text-anchor="middle">PATCH request</text>
      <text x="486" y="162" fill="#9fb3c8" font-family="monospace" font-size="10" text-anchor="middle">targeted configure delta</text>
      <text x="486" y="188" fill="#64748b" font-family="${FONT}" font-size="10" text-anchor="middle">One object, not full config</text>
      <text x="486" y="218" fill="#f59e0b" font-family="${FONT}" font-size="11" font-weight="700" text-anchor="middle">Change state</text>
    </g>
    ${arrow(186, 240, 186, 290, "#12b5e5")}
    ${arrow(486, 240, 486, 290, "#f59e0b")}
    ${switchIcon(186, 330, "SW1")}
    ${switchIcon(486, 330, "SW1")}
    <g id="viz-judgment">
      <rect x="160" y="390" width="352" height="44" rx="10" fill="#112115" stroke="#a78bfa" stroke-width="1.5"/>
      <text x="336" y="418" fill="#a78bfa" font-family="${FONT}" font-size="11" font-weight="700" text-anchor="middle">CCNA judgment still decides what should exist</text>
    </g>`,
			["viz-get-map", "viz-patch-map", "viz-judgment"]
		),

	"restconf-vs-netconf": () =>
		panel(
			"Two transports to structured data",
			`
    <g id="viz-restconf">
      <rect x="56" y="100" width="260" height="220" rx="16" fill="#081827" stroke="#6CC04A" stroke-width="2"/>
      <text x="186" y="132" fill="#6CC04A" font-family="${FONT}" font-size="14" font-weight="800" text-anchor="middle">RESTCONF</text>
      <text x="186" y="162" fill="#9fb3c8" font-family="monospace" font-size="10" text-anchor="middle">HTTP + JSON</text>
      <rect x="96" y="180" width="180" height="56" rx="8" fill="#112115" stroke="#12b5e5" stroke-width="1.5"/>
      <text x="186" y="214" fill="#12b5e5" font-family="monospace" font-size="10" text-anchor="middle">requests.get()</text>
      <text x="186" y="260" fill="#64748b" font-family="${FONT}" font-size="10" text-anchor="middle">Python / Postman friendly</text>
      <text x="186" y="296" fill="#6CC04A" font-family="${FONT}" font-size="10" text-anchor="middle">RFC 8040</text>
    </g>
    <g id="viz-netconf">
      <rect x="356" y="100" width="260" height="220" rx="16" fill="#081827" stroke="#a78bfa" stroke-width="2"/>
      <text x="486" y="132" fill="#a78bfa" font-family="${FONT}" font-size="14" font-weight="800" text-anchor="middle">NETCONF</text>
      <text x="486" y="162" fill="#9fb3c8" font-family="monospace" font-size="10" text-anchor="middle">XML over SSH</text>
      <rect x="396" y="180" width="180" height="56" rx="8" fill="#1f1b2e" stroke="#a78bfa" stroke-width="1.5"/>
      <text x="486" y="214" fill="#a78bfa" font-family="monospace" font-size="10" text-anchor="middle">&lt;rpc&gt; ... &lt;/rpc&gt;</text>
      <text x="486" y="260" fill="#64748b" font-family="${FONT}" font-size="10" text-anchor="middle">SP / orchestrator stacks</text>
      <text x="486" y="296" fill="#a78bfa" font-family="${FONT}" font-size="10" text-anchor="middle">Mature pipeline integrations</text>
    </g>
    <g id="viz-yang-shared">
      <rect x="200" y="350" width="272" height="50" rx="12" fill="#0b2237" stroke="#12b5e5" stroke-width="2"/>
      <text x="336" y="372" fill="#12b5e5" font-family="${FONT}" font-size="11" font-weight="700" text-anchor="middle">Same YANG models underneath</text>
      <text x="336" y="390" fill="#9fb3c8" font-family="${FONT}" font-size="10" text-anchor="middle">Different vehicle, same map</text>
    </g>`,
			["viz-restconf", "viz-netconf", "viz-yang-shared"]
		),

	"yang-explained-plain-language": () =>
		panel(
			"YANG is the map; RESTCONF is the vehicle",
			`
    <g id="viz-map">
      <rect x="80" y="100" width="360" height="240" rx="16" fill="#0b2237" stroke="#12b5e5" stroke-width="2"/>
      <text x="260" y="130" fill="#12b5e5" font-family="${FONT}" font-size="13" font-weight="800" text-anchor="middle">YANG model (schema)</text>
      <rect x="120" y="150" width="120" height="70" rx="8" fill="#081827" stroke="#6CC04A" stroke-width="1.5"/>
      <text x="180" y="178" fill="#6CC04A" font-family="monospace" font-size="10" text-anchor="middle">vlan-list</text>
      <text x="180" y="198" fill="#9fb3c8" font-family="monospace" font-size="9" text-anchor="middle">id, name</text>
      <rect x="280" y="150" width="120" height="70" rx="8" fill="#081827" stroke="#f59e0b" stroke-width="1.5"/>
      <text x="340" y="178" fill="#f59e0b" font-family="monospace" font-size="10" text-anchor="middle">interface</text>
      <text x="340" y="198" fill="#9fb3c8" font-family="monospace" font-size="9" text-anchor="middle">mode, vlan</text>
      <text x="260" y="260" fill="#64748b" font-family="${FONT}" font-size="10" text-anchor="middle">Containers you already configure by hand</text>
      <text x="260" y="310" fill="#9fb3c8" font-family="${FONT}" font-size="10" text-anchor="middle">Cisco-IOS-XE-native on lab IOS-XE</text>
    </g>
    <g id="viz-vehicle">
      <rect x="480" y="180" width="120" height="80" rx="12" fill="#112115" stroke="#6CC04A" stroke-width="2"/>
      <text x="540" y="218" fill="#6CC04A" font-family="${FONT}" font-size="12" font-weight="800" text-anchor="middle">RESTCONF</text>
      <text x="540" y="240" fill="#9fb3c8" font-family="${FONT}" font-size="10" text-anchor="middle">HTTP ride</text>
      ${arrow(440, 220, 480, 220, "#6CC04A")}
    </g>
    <text x="336" y="390" fill="#64748b" font-family="${FONT}" font-size="11" text-anchor="middle">Find the container — do not memorize the whole tree</text>`,
			["viz-map", "viz-vehicle"]
		),

	"yang-structure-basics": () =>
		panel(
			"Leaf, container, and list",
			`
    <g id="viz-tree">
      <rect x="240" y="80" width="160" height="48" rx="10" fill="#081827" stroke="#12b5e5" stroke-width="2"/>
      <text x="320" y="110" fill="#12b5e5" font-family="${FONT}" font-size="12" font-weight="700" text-anchor="middle">native (root)</text>
      ${arrow(320, 128, 320, 150)}
      <rect x="200" y="150" width="120" height="44" rx="8" fill="#081827" stroke="#f59e0b" stroke-width="2"/>
      <text x="260" y="178" fill="#f59e0b" font-family="${FONT}" font-size="11" font-weight="700" text-anchor="middle">container</text>
      ${arrow(260, 194, 260, 216)}
      <rect x="160" y="216" width="100" height="36" rx="6" fill="#112115" stroke="#6CC04A" stroke-width="1.5"/>
      <text x="210" y="239" fill="#6CC04A" font-family="monospace" font-size="10" text-anchor="middle">leaf: id=100</text>
      ${arrow(320, 194, 380, 216)}
      <rect x="340" y="216" width="120" height="80" rx="8" fill="#081827" stroke="#a78bfa" stroke-width="2"/>
      <text x="400" y="240" fill="#a78bfa" font-family="${FONT}" font-size="11" font-weight="700" text-anchor="middle">list</text>
      <text x="400" y="262" fill="#9fb3c8" font-family="monospace" font-size="9" text-anchor="middle">vlan 100</text>
      <text x="400" y="278" fill="#9fb3c8" font-family="monospace" font-size="9" text-anchor="middle">vlan 200</text>
    </g>
    <g id="viz-ccna">
      <rect x="100" y="330" width="472" height="56" rx="12" fill="#0b2237" stroke="#ef4444" stroke-width="1.5"/>
      <text x="336" y="354" fill="#ef4444" font-family="${FONT}" font-size="11" font-weight="700" text-anchor="middle">Validation error = missing leaf or bad value</text>
      <text x="336" y="374" fill="#9fb3c8" font-family="${FONT}" font-size="10" text-anchor="middle">Read the message instead of guessing</text>
    </g>`,
			["viz-tree", "viz-ccna"]
		),

	"restconf-urls-and-methods": () =>
		panel(
			"RESTCONF path anatomy",
			`
    <g id="viz-path">
      <rect x="60" y="100" width="600" height="56" rx="12" fill="#020617" stroke="#203a56" stroke-width="1.5"/>
      <text x="80" y="134" fill="#64748b" font-family="monospace" font-size="10">/restconf/data</text>
      <text x="220" y="134" fill="#12b5e5" font-family="monospace" font-size="10">/Cisco-IOS-XE-native:native</text>
      <text x="480" y="134" fill="#6CC04A" font-family="monospace" font-size="10">/vlan</text>
    </g>
    <g id="viz-get-flow">
      ${httpVerb(100, 200, "GET", "#6CC04A")}
      ${arrow(168, 216, 240, 216)}
      <rect x="240" y="196" width="200" height="40" rx="8" fill="#081827" stroke="#6CC04A" stroke-width="1.5"/>
      <text x="340" y="222" fill="#9fb3c8" font-family="monospace" font-size="9" text-anchor="middle">.../vlan-list=100</text>
      ${arrow(440, 216, 500, 216)}
      <text x="540" y="222" fill="#6CC04A" font-family="monospace" font-size="11" text-anchor="middle">JSON</text>
    </g>
    <g id="viz-patch-flow">
      ${httpVerb(100, 280, "PATCH", "#f59e0b")}
      ${arrow(188, 296, 240, 296)}
      <rect x="240" y="276" width="200" height="40" rx="8" fill="#081827" stroke="#f59e0b" stroke-width="1.5"/>
      <text x="340" y="302" fill="#9fb3c8" font-family="monospace" font-size="9" text-anchor="middle">.../vlan + body</text>
      ${arrow(440, 296, 500, 296)}
      <text x="540" y="302" fill="#f59e0b" font-family="monospace" font-size="11" text-anchor="middle">204</text>
    </g>
    <g id="viz-headers">
      <rect x="120" y="350" width="480" height="52" rx="10" fill="#112115" stroke="#a78bfa" stroke-width="2"/>
      <text x="360" y="372" fill="#a78bfa" font-family="monospace" font-size="10" text-anchor="middle">Accept: application/yang-data+json</text>
      <text x="360" y="390" fill="#a78bfa" font-family="monospace" font-size="10" text-anchor="middle">Content-Type: application/yang-data+json</text>
    </g>`,
			["viz-path", "viz-get-flow", "viz-patch-flow", "viz-headers"]
		),

	"api-auth-and-rate-limits": () =>
		panel(
			"Auth gate and rate limit",
			`
    <g id="viz-client">
      ${pythonFile(80, 120, 160, 88, "viz-script", { filename: "restconf.py", lines: ["auth=BasicAuth(...)", "requests.get(...)"] })}
      ${arrow(240, 164, 300, 164, "#f59e0b")}
    </g>
    <g id="viz-gate">
      <rect x="300" y="120" width="120" height="88" rx="14" fill="#081827" stroke="#f59e0b" stroke-width="2"/>
      <text x="360" y="152" fill="#f59e0b" font-family="${FONT}" font-size="12" font-weight="800" text-anchor="middle">Auth</text>
      <text x="360" y="174" fill="#9fb3c8" font-family="monospace" font-size="9" text-anchor="middle">Basic / token</text>
      <text x="360" y="192" fill="#64748b" font-family="${FONT}" font-size="9" text-anchor="middle">Lab vs prod</text>
    </g>
    ${arrow(420, 164, 480, 164, "#6CC04A")}
    ${switchIcon(520, 164, "API", "viz-device")}
    <g id="viz-rate">
      <rect x="200" y="260" width="320" height="100" rx="14" fill="#1a1215" stroke="#ef4444" stroke-width="2"/>
      <text x="360" y="292" fill="#ef4444" font-family="${FONT}" font-size="12" font-weight="800" text-anchor="middle">429 Too Many Requests</text>
      <text x="360" y="318" fill="#9fb3c8" font-family="${FONT}" font-size="11" text-anchor="middle">Backoff + log — not tight loops</text>
      <text x="360" y="340" fill="#64748b" font-family="${FONT}" font-size="10" text-anchor="middle">Secrets in env / vault, not source code</text>
    </g>`,
			["viz-script", "viz-gate", "viz-device", "viz-rate"]
		),

	"http-errors-and-pagination": () =>
		panel(
			"Status codes and pagination",
			`
    <g id="viz-4xx">
      <rect x="56" y="100" width="260" height="130" rx="14" fill="#1a1215" stroke="#ef4444" stroke-width="2"/>
      <text x="186" y="130" fill="#ef4444" font-family="${FONT}" font-size="12" font-weight="800" text-anchor="middle">4xx — your request</text>
      ${statusBadge(80, 148, "400", "Bad JSON", "#ef4444")}
      ${statusBadge(186, 148, "403", "No permission", "#f59e0b")}
      <text x="186" y="218" fill="#9fb3c8" font-family="${FONT}" font-size="10" text-anchor="middle">Fix payload before retry</text>
    </g>
    <g id="viz-5xx">
      <rect x="356" y="100" width="260" height="130" rx="14" fill="#081827" stroke="#a78bfa" stroke-width="2"/>
      <text x="486" y="130" fill="#a78bfa" font-family="${FONT}" font-size="12" font-weight="800" text-anchor="middle">5xx — server trouble</text>
      ${statusBadge(400, 148, "500", "Server error", "#a78bfa")}
      <text x="486" y="218" fill="#9fb3c8" font-family="${FONT}" font-size="10" text-anchor="middle">Investigate before blind retry</text>
    </g>
    <g id="viz-pages">
      <rect x="140" y="270" width="160" height="70" rx="10" fill="#081827" stroke="#12b5e5" stroke-width="2"/>
      <text x="220" y="300" fill="#12b5e5" font-family="${FONT}" font-size="11" font-weight="700" text-anchor="middle">Page 1</text>
      <text x="220" y="322" fill="#9fb3c8" font-family="monospace" font-size="9" text-anchor="middle">10 of 500 hosts</text>
      ${arrow(300, 305, 360, 305)}
      <rect x="360" y="270" width="160" height="70" rx="10" fill="#081827" stroke="#6CC04A" stroke-width="2"/>
      <text x="440" y="300" fill="#6CC04A" font-family="${FONT}" font-size="11" font-weight="700" text-anchor="middle">Page 2</text>
      <text x="440" y="322" fill="#9fb3c8" font-family="monospace" font-size="9" text-anchor="middle">follow next link</text>
    </g>
    <text x="336" y="390" fill="#64748b" font-family="${FONT}" font-size="11" text-anchor="middle">Log like syslog — decide if retry is safe</text>`,
			["viz-4xx", "viz-5xx", "viz-pages"]
		),

	"story-beat-recap-apis": () =>
		panel(
			"API theory checkpoint",
			`
    ${arrow(80, 200, 580, 200)}
    ${box(60, 170, 90, 60, "REST", "#6CC04A", "viz-check-1", 12)}
    ${box(170, 170, 90, 60, "YANG", "#6CC04A", "viz-check-2", 12)}
    ${box(280, 170, 100, 60, "RESTCONF", "#12b5e5", "viz-check-3", 11)}
    ${box(400, 170, 90, 60, "Auth", "#f59e0b", "viz-check-4", 12)}
    ${box(510, 170, 90, 60, "Lab", "#a78bfa", "viz-check-5", 12)}
    <text x="336" y="300" fill="#64748b" font-family="${FONT}" font-size="12" text-anchor="middle">Python requests over HTTPS next</text>`,
			["viz-check-1", "viz-check-2", "viz-check-3", "viz-check-4", "viz-check-5"]
		),

	"lab-setup-restconf": () =>
		panel(
			"RESTCONF lab flow",
			`
    <g id="viz-arrows">
      <line x1="136" y1="151" x2="296" y2="210" stroke="#6CC04A" stroke-width="3" stroke-linecap="round"/>
      <path d="M 520 151 L 408 151 L 376 210" fill="none" stroke="#f59e0b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="336" y1="314" x2="336" y2="238" stroke="#12b5e5" stroke-width="3" stroke-linecap="round"/>
      <line x1="336" y1="362" x2="336" y2="388" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/>
    </g>
    ${switchIcon(336, 210, "Lab SW", "viz-switch")}
    <g id="viz-step-1">
      <circle cx="108" cy="108" r="14" fill="#112115" stroke="#6CC04A" stroke-width="2"/>
      <text x="108" y="113" fill="#6CC04A" font-family="${FONT}" font-size="11" font-weight="800" text-anchor="middle">1</text>
      ${httpVerb(80, 130, "GET", "#6CC04A")}
      <text x="108" y="182" fill="#6CC04A" font-family="${FONT}" font-size="10" text-anchor="middle">Query VLAN</text>
    </g>
    <g id="viz-step-2">
      <circle cx="564" cy="108" r="14" fill="#112115" stroke="#f59e0b" stroke-width="2"/>
      <text x="564" y="113" fill="#f59e0b" font-family="${FONT}" font-size="11" font-weight="800" text-anchor="middle">2</text>
      ${httpVerb(520, 130, "PATCH", "#f59e0b")}
      <text x="552" y="182" fill="#f59e0b" font-family="${FONT}" font-size="10" text-anchor="middle">Push change</text>
    </g>
    <g id="viz-step-3">
      <circle cx="286" cy="330" r="14" fill="#112115" stroke="#12b5e5" stroke-width="2"/>
      <text x="286" y="335" fill="#12b5e5" font-family="${FONT}" font-size="11" font-weight="800" text-anchor="middle">3</text>
      ${httpVerb(308, 314, "GET", "#12b5e5")}
      <text x="336" y="366" fill="#12b5e5" font-family="${FONT}" font-size="10" text-anchor="middle">Verify state</text>
    </g>
    ${pythonFile(228, 388, 216, 88, "viz-script", {
			filename: "restconf_lab.py",
			lines: ["requests.get / patch", "raise_for_status()"],
		})}
    <g id="viz-caption">
      <rect x="120" y="492" width="432" height="40" rx="10" fill="#081827" stroke="#203a56" stroke-width="1.5"/>
      <text x="336" y="518" fill="#9fb3c8" font-family="${FONT}" font-size="11" text-anchor="middle">Query, push, verify — explicit HTTP error handling</text>
    </g>`,
			["viz-arrows", "viz-switch", "viz-step-1", "viz-step-2", "viz-step-3", "viz-script", "viz-caption"]
		),

	"resume-lab-install-restconf-tools": () =>
		panel(
			"Prepare lab for RESTCONF",
			`
    ${terminalBlock(80, 80, 512, 220, [
			"$ cd automation_project",
			"$ source env/bin/activate",
			"(env) $ pip install requests",
			"(env) $ ping 192.168.1.10",
		], "viz-term")}
    <g id="viz-https">
      <rect x="140" y="330" width="392" height="56" rx="12" fill="#112115" stroke="#6CC04A" stroke-width="2"/>
      <text x="336" y="354" fill="#6CC04A" font-family="${FONT}" font-size="11" font-weight="700" text-anchor="middle">HTTPS reachability before RESTCONF</text>
      <text x="336" y="374" fill="#64748b" font-family="${FONT}" font-size="10" text-anchor="middle">Lab only: verify=False for self-signed certs</text>
    </g>`,
			["viz-term", "viz-https"]
		),

	"story-beat-common-mistake-restconf": () =>
		panel(
			"Wrong headers break RESTCONF",
			`
    <g id="viz-bad">
      <rect x="56" y="110" width="260" height="160" rx="14" fill="#1a1215" stroke="#ef4444" stroke-width="2"/>
      <text x="186" y="140" fill="#ef4444" font-family="${FONT}" font-size="12" font-weight="800" text-anchor="middle">Copied from old blog</text>
      <text x="76" y="170" fill="#9fb3c8" font-family="monospace" font-size="9">PATCH without Content-Type</text>
      <text x="76" y="190" fill="#9fb3c8" font-family="monospace" font-size="9">Wrong YANG path</text>
      <text x="76" y="210" fill="#9fb3c8" font-family="monospace" font-size="9">HTML error read as OK</text>
      <text x="186" y="250" fill="#ef4444" font-family="${FONT}" font-size="11" text-anchor="middle">Silent failure</text>
    </g>
    ${arrow(326, 190, 390, 190)}
    <g id="viz-good">
      <rect x="400" y="110" width="240" height="160" rx="14" fill="#112115" stroke="#6CC04A" stroke-width="2"/>
      <text x="520" y="140" fill="#6CC04A" font-family="${FONT}" font-size="12" font-weight="800" text-anchor="middle">Safer pattern</text>
      <text x="420" y="170" fill="#6CC04A" font-family="monospace" font-size="9">Accept: yang-data+json</text>
      <text x="420" y="190" fill="#6CC04A" font-family="monospace" font-size="9">Content-Type: yang-data+json</text>
      <text x="420" y="210" fill="#9fb3c8" font-family="${FONT}" font-size="10">GET before and after PATCH</text>
      <text x="520" y="250" fill="#6CC04A" font-family="${FONT}" font-size="11" text-anchor="middle">Platform docs, not memory</text>
    </g>`,
			["viz-bad", "viz-good"]
		),

	"certification-alignment-apis": () =>
		panel(
			"Exam objectives 1.3 and 1.6",
			`
    <g id="viz-badge">
      <rect x="218" y="70" width="236" height="72" rx="14" fill="#0b2237" stroke="#12b5e5" stroke-width="2"/>
      <text x="336" y="100" fill="#12b5e5" font-family="${FONT}" font-size="14" font-weight="900" text-anchor="middle">CCNP 1.3 + 1.6</text>
      <text x="336" y="122" fill="#9fb3c8" font-family="${FONT}" font-size="11" text-anchor="middle">RESTCONF + API consumption</text>
    </g>
    ${arrow(336, 142, 336, 170)}
    <g id="viz-topics">
      ${box(60, 180, 130, 56, "YANG paths", "#6CC04A", "viz-yang", 11)}
      ${box(210, 180, 130, 56, "HTTP codes", "#f59e0b", "viz-http", 11)}
      ${box(360, 180, 130, 56, "Auth", "#12b5e5", "viz-auth", 12)}
      ${box(510, 180, 120, 56, "Pagination", "#a78bfa", "viz-page", 10)}
    </g>
    <g id="viz-skill">
      <rect x="160" y="280" width="352" height="60" rx="12" fill="#081827" stroke="#a78bfa" stroke-width="2"/>
      <text x="336" y="308" fill="#a78bfa" font-family="${FONT}" font-size="12" font-weight="700" text-anchor="middle">Explain URL + payload + status — not memorize</text>
      <text x="336" y="328" fill="#64748b" font-family="${FONT}" font-size="11" text-anchor="middle">RESTCONF vs NETCONF tradeoffs</text>
    </g>`,
			["viz-badge", "viz-yang", "viz-http", "viz-auth", "viz-page", "viz-skill"]
		),

	"apis-programmability-ready": () =>
		panel(
			"API layer complete — toolchains next",
			`
    ${box(80, 200, 120, 72, "SSH + Netmiko", "#f59e0b", "viz-ssh", 11)}
    ${arrow(200, 236, 260, 236)}
    ${box(260, 200, 120, 72, "RESTCONF", "#6CC04A", "viz-rest", 12)}
    ${arrow(380, 236, 440, 236)}
    ${box(440, 200, 140, 72, "Ansible / TF", "#12b5e5", "viz-tools", 11)}
    <text x="336" y="320" fill="#64748b" font-family="${FONT}" font-size="12" text-anchor="middle">Module 4 — toolchain selection</text>
    <g id="viz-habit">
      <rect x="160" y="350" width="352" height="44" rx="10" fill="#112115" stroke="#6CC04A" stroke-width="1.5"/>
      <text x="336" y="378" fill="#6CC04A" font-family="${FONT}" font-size="11" font-weight="700" text-anchor="middle">GET before PATCH — document YANG paths in Git</text>
    </g>`,
			["viz-ssh", "viz-rest", "viz-tools", "viz-habit"]
		),
};
