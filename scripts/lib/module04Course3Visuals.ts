import type { VisualResult } from "./premiumVisualArchetypes";
import {
	arrow,
	bridgeTitle,
	codeBlock,
	comparePanels,
	examAlignment,
	fourStepFlow,
	header,
	labWorkspace,
	moduleHandoff,
	panel,
	panelBox,
	recapPath,
} from "./course3VisualHelpers";

export const MODULE04_COURSE3_VISUALS: Record<string, () => VisualResult> = {
	"validation-to-security-bridge": () =>
		bridgeTitle("Security bridge", "Validation gates", "Plaintext OK?", "TLS + vault", [
			"viz-from",
			"viz-bridge",
			"viz-to",
		]),

	"plaintext-secrets-risk": () =>
		panel(
			"Plaintext secrets risk",
			`
    ${header("RISK", "Secrets in Git and logs")}
    ${panelBox(
			"viz-bad",
			48,
			120,
			296,
			220,
			"Anti-pattern",
			"#ef4444",
			`${codeBlock(72, 156, 248, 100, [
				"password: admin123",
				"api_key=sk-live-...",
				"# committed to Git",
			])}
      <text x="196" y="280" fill="#ef4444" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" font-weight="700" text-anchor="middle">Audit fail + leak</text>`,
			"#1a1215"
		)}
    ${panelBox(
			"viz-good",
			376,
			120,
			296,
			220,
			"Secure pattern",
			"#6CC04A",
			`${codeBlock(400, 156, 248, 100, [
				"vault read secret/data/net",
				"env: NET_USER from CI var",
				"TLS verify=True",
			])}
      <text x="524" y="280" fill="#6CC04A" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" font-weight="700" text-anchor="middle">Secrets outside repo</text>`,
			"#112115"
		)}`,
			["viz-bad", "viz-good"]
		),

	"what-tls-protects-in-automation": () =>
		panel(
			"What TLS protects",
			`
    ${header("TLS", "Confidentiality + integrity in flight")}
    <g id="viz-client"><rect x="80" y="180" width="120" height="80" rx="12" fill="#081827" stroke="#12b5e5" stroke-width="2"/>
      <text x="140" y="225" fill="#12b5e5" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="700" text-anchor="middle">Runner</text></g>
    <g id="viz-tunnel">
      <rect x="240" y="195" width="240" height="50" rx="10" fill="#112115" stroke="#6CC04A" stroke-width="2"/>
      <text x="360" y="225" fill="#6CC04A" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="800" text-anchor="middle">TLS 1.2+ encrypted channel</text>
    </g>
    <g id="viz-server"><rect x="520" y="180" width="120" height="80" rx="12" fill="#081827" stroke="#12b5e5" stroke-width="2"/>
      <text x="580" y="225" fill="#12b5e5" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="700" text-anchor="middle">Device API</text></g>
    <text x="360" y="310" fill="#64748b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" text-anchor="middle">RESTCONF, gNMI, Ansible — all need TLS in production</text>`,
			["viz-client", "viz-tunnel", "viz-server"]
		),

	"pki-plain-language": () =>
		panel(
			"PKI plain language",
			`
    ${header("PKI", "Trust chain from CA to service")}
    <g id="viz-ca"><rect x="300" y="110" width="120" height="56" rx="12" fill="#0b2237" stroke="#f59e0b" stroke-width="2"/>
      <text x="360" y="144" fill="#f59e0b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="12" font-weight="800" text-anchor="middle">Root CA</text></g>
  <line x1="360" y1="166" x2="360" y2="200" stroke="#35536f" stroke-width="2"/>
    <g id="viz-inter"><rect x="300" y="200" width="120" height="56" rx="12" fill="#081827" stroke="#12b5e5" stroke-width="2"/>
      <text x="360" y="234" fill="#12b5e5" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="700" text-anchor="middle">Intermediate</text></g>
  <line x1="360" y1="256" x2="360" y2="290" stroke="#35536f" stroke-width="2"/>
    <g id="viz-cert"><rect x="280" y="290" width="160" height="64" rx="12" fill="#112115" stroke="#6CC04A" stroke-width="2"/>
      <text x="360" y="328" fill="#6CC04A" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="700" text-anchor="middle">Service cert</text></g>`,
			["viz-ca", "viz-inter", "viz-cert"]
		),

	"obtain-ca-signed-cert-process": () =>
		fourStepFlow(
			"Obtain CA-signed certificate",
			[
				{ id: "viz-csr", label: "CSR", accent: "#12b5e5" },
				{ id: "viz-sign", label: "CA sign", accent: "#6CC04A" },
				{ id: "viz-install", label: "Install", accent: "#f59e0b" },
				{ id: "viz-verify", label: "Verify", accent: "#a78bfa" },
			],
			"Generate key → submit CSR → deploy cert chain → openssl s_client"
		),

	"self-signed-vs-ca-signed": () =>
		comparePanels(
			"Self-signed vs CA-signed",
			{
				id: "viz-self",
				title: "Self-signed",
				accent: "#f59e0b",
				lines: ["Quick lab setup", "Browser/trust warnings", "No enterprise chain", "Rotate manually"],
			},
			{
				id: "viz-ca",
				title: "CA-signed",
				accent: "#6CC04A",
				lines: ["Enterprise trust chain", "Automated renewal", "Audit-friendly", "Production standard"],
			}
		),

	"deploy-tls-on-automation-services": () =>
		panel(
			"Deploy TLS on automation services",
			`
    ${header("DEPLOY", "Terminate TLS on automation endpoints")}
    <g id="viz-ansible"><rect x="60" y="160" width="150" height="70" rx="12" fill="#081827" stroke="#12b5e5" stroke-width="2"/>
      <text x="135" y="202" fill="#12b5e5" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="700" text-anchor="middle">Ansible API</text></g>
    <g id="viz-restconf"><rect x="230" y="160" width="150" height="70" rx="12" fill="#081827" stroke="#6CC04A" stroke-width="2"/>
      <text x="305" y="202" fill="#6CC04A" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="700" text-anchor="middle">RESTCONF</text></g>
    <g id="viz-gnmi"><rect x="400" y="160" width="150" height="70" rx="12" fill="#081827" stroke="#f59e0b" stroke-width="2"/>
      <text x="475" y="202" fill="#f59e0b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="700" text-anchor="middle">gNMI</text></g>
    <g id="viz-gitlab"><rect x="570" y="160" width="90" height="70" rx="12" fill="#081827" stroke="#a78bfa" stroke-width="2"/>
      <text x="615" y="202" fill="#a78bfa" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" font-weight="700" text-anchor="middle">GitLab</text></g>
    <text x="360" y="290" fill="#64748b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" text-anchor="middle">Same cert practices across toolchains</text>`,
			["viz-ansible", "viz-restconf", "viz-gnmi", "viz-gitlab"]
		),

	"secure-coding-three-pillars": () =>
		panel(
			"Secure coding three pillars",
			`
    ${header("SECURE CODE", "Exam 3.5 pillars")}
    <g id="viz-p1"><rect x="70" y="160" width="160" height="90" rx="14" fill="#081827" stroke="#12b5e5" stroke-width="2"/>
      <text x="150" y="210" fill="#12b5e5" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="12" font-weight="800" text-anchor="middle">Input validation</text></g>
    <g id="viz-p2"><rect x="280" y="160" width="160" height="90" rx="14" fill="#081827" stroke="#6CC04A" stroke-width="2"/>
      <text x="360" y="210" fill="#6CC04A" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="12" font-weight="800" text-anchor="middle">AuthN / AuthZ</text></g>
    <g id="viz-p3"><rect x="490" y="160" width="160" height="90" rx="14" fill="#081827" stroke="#f59e0b" stroke-width="2"/>
      <text x="570" y="210" fill="#f59e0b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="12" font-weight="800" text-anchor="middle">Secret storage</text></g>`,
			["viz-p1", "viz-p2", "viz-p3"]
		),

	"input-validation-for-automation": () =>
		panel(
			"Input validation for automation",
			`
    ${header("VALIDATE INPUT", "Never trust inventory blindly")}
    <g id="viz-input">${codeBlock(80, 130, 260, 100, ["device: SW2", "vlan: 9999", "interface: ../../etc"])}</g>
    ${arrow(340, 180, 400, 180)}
    <g id="viz-guard">${codeBlock(400, 130, 260, 100, ["schema.validate()", "vlan 1-4094 only", "reject path traversal"])}</g>`,
			["viz-input", "viz-guard"]
		),

	"authentication-vs-secret-storage": () =>
		comparePanels(
			"Authentication vs secret storage",
			{
				id: "viz-authn",
				title: "Authentication",
				accent: "#12b5e5",
				lines: ["Who is calling API?", "Tokens / certs / RBAC", "Per-service identity", "Short-lived creds"],
			},
			{
				id: "viz-secrets",
				title: "Secret storage",
				accent: "#a78bfa",
				lines: ["Where passwords live", "Vault / CI variables", "Never in Git", "Rotation policy"],
			}
		),

	"secret-management-practices": () =>
		panel(
			"Secret management practices",
			`
    ${header("VAULT", "Central secret lifecycle")}
    <g id="viz-vault"><rect x="260" y="120" width="200" height="100" rx="14" fill="#0b2237" stroke="#a78bfa" stroke-width="2"/>
      <text x="360" y="158" fill="#a78bfa" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="13" font-weight="800" text-anchor="middle">HashiCorp Vault</text>
      <text x="360" y="182" fill="#9fb3c8" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="10" text-anchor="middle">dynamic creds + audit log</text></g>
    <g id="viz-rotate"><rect x="100" y="260" width="160" height="64" rx="12" fill="#081827" stroke="#6CC04A" stroke-width="2"/>
      <text x="180" y="298" fill="#6CC04A" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="700" text-anchor="middle">Rotate</text></g>
    <g id="viz-audit"><rect x="460" y="260" width="160" height="64" rx="12" fill="#081827" stroke="#f59e0b" stroke-width="2"/>
      <text x="540" y="298" fill="#f59e0b" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="11" font-weight="700" text-anchor="middle">Audit access</text></g>`,
			["viz-vault", "viz-rotate", "viz-audit"]
		),

	"story-beat-recap-security": () =>
		recapPath(["TLS + PKI", "Secure coding", "Lab next"], ["viz-check-1", "viz-check-2", "viz-check-3"]),

	"lab-setup-security": () =>
		labWorkspace(
			"Security lab workspace",
			"netops_ops_lab/",
			["certs/", "vault-policy.hcl", "tls/"],
			["$ openssl req -new -keyout svc.key", "$ vault write pki/issue/...", "$ curl --cacert ca.pem https://..."]
		),

	"certification-alignment-security": () => examAlignment("3.4-3.5"),

	"security-ready-for-capstone": () => moduleHandoff("Module 5: Ops capstone"),
};
