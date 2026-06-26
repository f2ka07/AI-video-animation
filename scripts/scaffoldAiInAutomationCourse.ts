/**
 * Scaffold Course 4: AI in Automation (structure-first)
 */
import * as fs from "fs";
import * as path from "path";

const COURSE_ID = "ai-in-automation-networks";
const COURSE_NAME =
  "AI in Automation: Build Intelligent and Agent Driven Network Automation";
const ASSET = `assets/${COURSE_ID}`;
const ROOT = path.join(__dirname, "../courses", COURSE_ID);
const SVG_ROOT = path.join(ROOT, "course/diagrams/svg");

type Slide = Record<string, unknown> & { name: string; type: string };

interface ModuleDef {
  moduleNumber: number;
  title: string;
  subtitle: string;
  slides: Slide[];
}

const img = (name: string, mod: number) =>
  `${ASSET}/module${String(mod).padStart(2, "0")}/${name}.svg`;

function svg(label: string, title: string, subtitle: string, body?: string) {
  const b = (body || subtitle).slice(0, 90);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 900" role="img" aria-label="${title}">
  <rect width="800" height="900" fill="#071525"/>
  <g id="main">
    <text x="40" y="48" fill="#049FD9" font-family="Inter,sans-serif" font-size="13" font-weight="800" letter-spacing=".18em">${label}</text>
    <text x="40" y="96" fill="#fff" font-family="Inter,sans-serif" font-size="28" font-weight="800">${title}</text>
    <text x="40" y="132" fill="#94a3b8" font-family="Inter,sans-serif" font-size="16">${subtitle}</text>
    <g transform="translate(400 400)">
      <rect x="-280" y="-70" width="560" height="140" rx="16" fill="#0f172a" stroke="#6CC04A" stroke-width="2"/>
      <text y="8" text-anchor="middle" fill="#94a3b8" font-family="Inter,sans-serif" font-size="14">${b}</text>
    </g>
  </g>
</svg>`;
}

function titleSlide(
  mod: number,
  name: string,
  title: string,
  script: string,
  label = `COURSE 4 · MODULE ${mod}`
) {
  return { name, type: "title", title, script, imageSrc: img(name, mod) };
}

function card(
  mod: number,
  name: string,
  title: string,
  script: string,
  points: string[]
) {
  return {
    name,
    type: "content-two-card",
    title,
    script,
    points,
    imageSrc: img(name, mod),
  };
}

function single(
  mod: number,
  name: string,
  title: string,
  script: string,
  points: string[]
) {
  return {
    name,
    type: "content-single",
    title,
    script,
    points,
    imageSrc: img(name, mod),
  };
}

function compare(
  mod: number,
  name: string,
  title: string,
  script: string,
  leftTitle: string,
  leftItems: string[],
  rightTitle: string,
  rightItems: string[]
) {
  return {
    name,
    type: "comparison",
    title,
    script,
    leftTitle,
    leftItems,
    rightTitle,
    rightItems,
    imageSrc: img(name, mod),
  };
}

function beat(
  mod: number,
  name: string,
  title: string,
  script: string,
  points: string[],
  resolution = false
) {
  return {
    name,
    type: "story-beat",
    beat: resolution ? "resolution" : "recap",
    title,
    script,
    points,
    imageSrc: img(name, mod),
  };
}

function lab(mod: number, name: string, title: string, script: string, points: string[]) {
  return {
    name,
    type: "content-single",
    title,
    script,
    points,
    imageSrc: img(name, mod),
  };
}

function code(
  name: string,
  title: string,
  script: string,
  code: string,
  language: string,
  codeContext: string,
  visibleLineRange: [number, number],
  points?: string[]
) {
  const slide: Slide = {
    name,
    type: points ? "bullets-code" : "code",
    title,
    script,
    code,
    language,
    codeContext,
    visibleLineRange,
  };
  if (points) slide.points = points;
  return slide;
}

const modules: ModuleDef[] = [
  {
    moduleNumber: 1,
    title: "AI Assisted Automation",
    subtitle: "Benefits, Risks, and Governance of AI-Generated Code",
    slides: [
      titleSlide(
        1,
        "secure-ops-to-ai-bridge",
        "From Secure Ops to AI Assistance",
        "Courses one through three built automate, version, observe, validate, and secure network operations. Course four adds large language models to draft automation — with exam objectives four point one and four point two governing benefits, risks, privacy, IP ownership, validation, and security interpretation. The lab generates Ansible from a prompt, reviews output, and runs lint and check mode before any device touch."
      ),
      card(
        1,
        "ai-coding-workflows-plain-language",
        "AI Coding Workflows",
        "Prompt with platform constraints, generate a draft, human review, then validate with linters and check mode. Skipping review fails governance and exam four point one validation expectations.",
        ["Prompt with constraints", "Human review required", "Lint and check mode"]
      ),
      single(
        1,
        "benefits-of-ai-assisted-coding",
        "Benefits for Network Teams",
        "Exam four point one — faster drafts, lower syntax friction, boilerplate generation, and format translation — when paired with the same CI gates as human-written code.",
        ["4.1 — speed and boilerplate", "Lower Python barrier", "Always validate output"]
      ),
      card(
        1,
        "risks-privacy-ip-ownership",
        "Risks: Privacy and IP",
        "Four point one risks — data privacy when pasting configs to public LLMs, IP ownership per corporate policy, and missing validation on hallucinated APIs.",
        ["No secrets in public prompts", "Know IP policy", "Validate like human code"]
      ),
      single(
        1,
        "code-validation-after-generation",
        "Validate AI-Generated Code",
        "ansible-lint, yamllint, schema checks, and ansible-playbook check mode are mandatory. Store prompts and outputs in the change ticket for audit.",
        ["Same CI gates as human code", "Check mode before merge", "Audit prompt and output"]
      ),
      card(
        1,
        "security-risks-ai-automation",
        "Security Risks in AI Solutions",
        "Exam four point two — prompt injection, over-privileged tools, data exfiltration, and insecure generated defaults such as disabled TLS verification.",
        ["4.2 — prompt injection", "Over-privileged agents", "Mitigate with approval and sandbox"]
      ),
      single(
        1,
        "governance-for-ai-automation",
        "Governance and Policy",
        "Written AI usage policy, approved providers, forbidden data classes in prompts, and logging of tool calls align with course three secret management.",
        ["Corporate AI policy", "Approved models only", "Log prompts and tools"]
      ),
      compare(
        1,
        "human-review-vs-auto-merge",
        "Human Review vs Auto-Merge",
        "AI output must not auto-merge to main. Human review catches logic errors linters miss.",
        "Human in review",
        ["Diff and check mode", "Meets policy", "Production safe"],
        "Auto-merge AI",
        ["Skips judgment", "Logic bugs slip through", "Fails governance"]
      ),
      beat(
        1,
        "story-beat-recap-ai-assisted",
        "Theory Complete — AI Code Lab Next",
        "Next: netops_ai_lab, prompt for VLAN playbook, review, lint, and check mode. Lab topology only in prompts.",
        ["4.1 and 4.2 covered", "Generate review validate", "No prod secrets in prompts"]
      ),
      lab(
        1,
        "lab-setup-ai-lab",
        "Start netops_ai_lab",
        "Create netops_ai_lab with prompts, generated, and reviews folders beside iac and ops labs.",
        ["prompts/ generated/ reviews/", "Lab data only", "Document human sign-off"]
      ),
      code(
        "save-network-automation-prompt",
        "Step 1: Write the Prompt",
        "Structured prompt file for IOS XE VLAN Ansible with idempotency constraints.",
        "mkdir -p netops_ai_lab/{prompts,generated,reviews}\ncat > netops_ai_lab/prompts/vlan_playbook.md << 'EOF'\nTask: Idempotent IOS XE VLAN playbook from intended/vlans.yaml\nConstraints: ansible-lint clean, check mode safe, no credentials\nEOF",
        "bash",
        "netops_ai_lab/",
        [1, 4]
      ),
      code(
        "generate-playbook-with-llm",
        "Step 2: Save Generated Draft",
        "Save model output to generated/ and log ai-draft in reviews.",
        "cat > netops_ai_lab/generated/ai_deploy_vlans.yml << 'EOF'\n---\n- hosts: localhost\n  connection: local\n  tasks:\n    - ansible.builtin.debug: { msg: \"check mode VLAN apply\" }\nEOF\necho ai-draft >> netops_ai_lab/reviews/review.log",
        "yaml",
        "netops_ai_lab/generated/",
        [1, 6]
      ),
      code(
        "lint-generated-playbook",
        "Step 3: Lint Generated Code",
        "Run ansible-lint and intent validation before human approval.",
        "cp netops_ai_lab/generated/ai_deploy_vlans.yml ../netops_iac_lab/playbooks/\nansible-lint ../netops_iac_lab/playbooks/ai_deploy_vlans.yml\npython ../netops_ops_lab/scripts/validate_intent_secure.py ../netops_iac_lab/intended/vlans.yaml",
        "bash",
        "netops_iac_lab/",
        [1, 3]
      ),
      code(
        "check-mode-ai-playbook",
        "Step 4: Check Mode",
        "Check mode is required validation for four point one.",
        "ansible-playbook playbooks/ai_deploy_vlans.yml --check --diff\necho human-approved >> ../netops_ai_lab/reviews/review.log",
        "bash",
        "netops_iac_lab/",
        [1, 2]
      ),
      code(
        "troubleshoot-unsafe-ai-output",
        "Troubleshoot Bad AI Output",
        "Reject hallucinated modules, hard-coded secrets, and destructive tasks without guards.",
        "grep -E \"password:|api_key|disable.*tls\" netops_ai_lab/generated/*.yml",
        "bash",
        "netops_ai_lab/",
        [1, 1],
        ["Hallucinated APIs", "Secrets in output — reject", "Re-prompt with constraints"]
      ),
      single(
        1,
        "certification-alignment-ai-assisted",
        "Exam Objectives 4.1 and 4.2",
        "Module one maps to benefits, risks, validation, and security risk interpretation for AI network automation.",
        ["4.1 benefits risks validation", "4.2 security controls", "Module 2 — MCP"]
      ),
      beat(
        1,
        "ai-assisted-ready-for-mcp",
        "AI Code Review Complete — MCP Next",
        "Module two builds FastMCP server for exam four point three — expose network data safely to AI clients.",
        ["Governed AI workflow", "Exam 4.1 4.2 done", "Module 2 FastMCP"],
        true
      ),
    ],
  },
  {
    moduleNumber: 2,
    title: "MCP and AI Integration",
    subtitle: "FastMCP Servers for Network Context",
    slides: [
      titleSlide(
        2,
        "mcp-bridge-from-module-one",
        "From Reviewed Code to MCP Tools",
        "Module one governed AI-generated playbooks. Module two implements exam four point three — construct an MCP server to provide network information to an AI agent using Python FastMCP. MCP — Model Context Protocol — standardizes how LLM clients discover and call tools. Your server exposes read-only intent and inventory, not arbitrary config push."
      ),
      single(
        2,
        "what-mcp-means-plain-language",
        "MCP in Plain Language",
        "MCP is a client-server protocol: the AI client lists tools, calls them with JSON arguments, and receives structured results. FastMCP is a Python framework that registers functions as tools quickly.",
        ["Client discovers tools", "Server returns structured data", "FastMCP in Python"]
      ),
      card(
        2,
        "mcp-architecture-components",
        "MCP Architecture",
        "Host runs the LLM client. MCP server exposes tools — list_vlans, get_device_status. Transport is often stdio or HTTP. Results ground the model in real data instead of guesses.",
        ["Host — LLM client", "Server — FastMCP tools", "Transport — stdio or SSE"]
      ),
      compare(
        2,
        "fastmcp-vs-ad-hoc-api",
        "FastMCP vs Ad-Hoc API",
        "Ad-hoc REST scripts per integration do not scale. MCP gives a standard tool catalog the agent can reason about.",
        "FastMCP MCP server",
        ["Standard tool schema", "Reusable across agents", "Exam 4.3 pattern"],
        "Ad-hoc scripts",
        ["Custom per integration", "Harder for agents", "No standard discovery"]
      ),
      card(
        2,
        "tool-orchestration-patterns",
        "Tool Orchestration",
        "Read-only tools first — intent, inventory, telemetry summary. Write tools behind human approval in module three. Least privilege per tool reduces four point two risk.",
        ["Read before write tools", "Structured JSON responses", "Least privilege tools"]
      ),
      single(
        2,
        "expose-network-data-safely",
        "Expose Network Data Safely",
        "Tools return slices of netops_iac_lab intent and lab inventory — never production secrets. Rate-limit and authenticate MCP transport in real deployments.",
        ["Intent and inventory only in lab", "No credentials in tool output", "Auth on MCP transport"]
      ),
      beat(
        2,
        "story-beat-recap-mcp",
        "Theory Complete — FastMCP Lab Next",
        "Build netops_ai_lab/mcp_server.py with list_vlans and get_inventory tools.",
        ["4.3 MCP server", "Read-only tools first", "FastMCP Python lab"]
      ),
      lab(
        2,
        "lab-setup-mcp",
        "Extend netops_ai_lab for MCP",
        "Add mcp/ folder with server.py and requirements-mcp.txt including mcp and fastmcp packages.",
        ["mcp/server.py", "requirements-mcp.txt", "Read-only tools only"]
      ),
      code(
        "install-fastmcp-dependencies",
        "Install FastMCP",
        "Virtualenv for MCP server dependencies.",
        "cd netops_ai_lab\npython3 -m venv venv-mcp\nsource venv-mcp/bin/activate\ncat > requirements-mcp.txt << 'EOF'\nmcp>=1.0.0\nfastmcp>=0.1.0\npyyaml>=6.0\nEOF\npip install -r requirements-mcp.txt",
        "bash",
        "netops_ai_lab/",
        [1, 8]
      ),
      code(
        "build-fastmcp-server-skeleton",
        "FastMCP Server Skeleton",
        "Exam four point three — construct MCP server with FastMCP.",
        "cat > mcp/server.py << 'EOF'\nfrom mcp.server.fastmcp import FastMCP\nmcp = FastMCP(\"netops-lab\")\n\n@mcp.tool()\ndef ping() -> str:\n    return \"netops mcp server ready\"\n\nif __name__ == \"__main__\":\n    mcp.run()\nEOF",
        "python",
        "netops_ai_lab/mcp/",
        [1, 10]
      ),
      code(
        "add-list-vlans-tool",
        "Tool: list_vlans",
        "Expose VLAN intent from netops_iac_lab as MCP tool.",
        "cat >> mcp/server.py << 'EOF'\nimport yaml\nfrom pathlib import Path\n\n@mcp.tool()\ndef list_vlans() -> list:\n    p = Path(\"../netops_iac_lab/intended/vlans.yaml\")\n    data = yaml.safe_load(p.read_text())\n    return data.get(\"vlans\", [])\nEOF",
        "python",
        "netops_ai_lab/mcp/",
        [1, 8]
      ),
      code(
        "add-inventory-tool",
        "Tool: get_lab_inventory",
        "Return lab device list for agent grounding.",
        "cat >> mcp/server.py << 'EOF'\n\n@mcp.tool()\ndef get_lab_inventory() -> list:\n    return [{\"name\": \"lab-sw1\", \"role\": \"access\", \"os\": \"iosxe\"}]\nEOF\npython mcp/server.py",
        "python",
        "netops_ai_lab/mcp/",
        [1, 6]
      ),
      code(
        "test-mcp-tools-manually",
        "Verify MCP Tools",
        "Confirm tools start and return JSON-serializable data.",
        "source venv-mcp/bin/activate\npython -c \"from mcp.server import Server; print('mcp ok')\"\n# run server: python mcp/server.py",
        "bash",
        "netops_ai_lab/",
        [1, 3]
      ),
      code(
        "troubleshoot-mcp-server",
        "Troubleshoot MCP Server",
        "Import errors — check venv. Empty VLAN list — verify path to iac repo. Serialization errors — return dicts not custom objects.",
        "python -c \"import yaml; print(yaml.safe_load(open('../netops_iac_lab/intended/vlans.yaml')))\"",
        "bash",
        "netops_ai_lab/",
        [1, 1],
        ["Check venv and imports", "Verify intent file path", "JSON-serializable returns"]
      ),
      single(
        2,
        "certification-alignment-mcp",
        "Exam Objective 4.3",
        "Construct MCP server with FastMCP exposing network information tools to an AI agent.",
        ["4.3 FastMCP server", "Tool schema and transport", "Module 3 — conversational agent"]
      ),
      beat(
        2,
        "mcp-ready-for-agents",
        "MCP Complete — Agents Next",
        "Module three wires an LLM conversational agent to these MCP tools — exam four point four.",
        ["MCP server running", "Exam 4.3 practiced", "Module 3 agent"],
        true
      ),
    ],
  },
  {
    moduleNumber: 3,
    title: "Agentic Network Operations",
    subtitle: "Conversational Agents with LLM Orchestration",
    slides: [
      titleSlide(
        3,
        "agents-bridge-from-mcp",
        "From MCP Tools to Conversational Agent",
        "Module two exposed network data as MCP tools. Module three implements exam four point four — construct a conversational agent that leverages LLMs for network automation. The agent loops: user question, tool calls, observation, answer — with human approval before any write action."
      ),
      single(
        3,
        "conversational-agent-plain-language",
        "Conversational Agent in Plain Language",
        "The user asks in natural language. The LLM plans which MCP tools to call, interprets results, and responds. Write actions require human-in-the-loop approval.",
        ["4.4 — LLM plus tools", "Natural language interface", "Human approves writes"]
      ),
      card(
        3,
        "llm-orchestration-patterns",
        "LLM Orchestration",
        "Single-agent loop is enough for AUTOCOR lab. Planner selects tools, executor calls MCP, summarizer formats answer for the engineer.",
        ["Plan — pick tools", "Act — MCP calls", "Summarize for human"]
      ),
      card(
        3,
        "agent-loop-think-act-observe",
        "Think, Act, Observe",
        "Think — model decides next step. Act — invoke list_vlans or get_lab_inventory. Observe — append tool JSON to context. Repeat until answer or approval gate.",
        ["Think — plan step", "Act — call MCP tool", "Observe — tool result"]
      ),
      compare(
        3,
        "human-in-loop-vs-full-auto",
        "Human in Loop vs Full Auto",
        "Production network agents approve config changes. Full auto without approval fails four point two security story.",
        "Human in loop",
        ["Approve writes", "Audit trail", "Exam production pattern"],
        "Full automation",
        ["No approval gate", "Prompt injection risk", "Lab read-only only"]
      ),
      single(
        3,
        "network-operator-agent-design",
        "Network Operator Agent Design",
        "Scope the agent to operator tasks — what VLANs are defined, is device in inventory — not open-ended shell access.",
        ["Read-only default", "Narrow tool set", "Refuse out-of-scope requests"]
      ),
      beat(
        3,
        "story-beat-recap-agents",
        "Theory Complete — Agent Lab Next",
        "Build agent/agent.py connecting LLM client to MCP tools from module two.",
        ["4.4 conversational agent", "Human approval gate", "MCP tool grounding"]
      ),
      lab(
        3,
        "lab-setup-agent",
        "Agent Lab Setup",
        "netops_ai_lab/agent/ with agent.py and config.yaml for model endpoint — use enterprise or local sandbox only.",
        ["agent/agent.py", "config.yaml — model endpoint", "No prod API keys in Git"]
      ),
      code(
        "agent-config-llm-client",
        "Agent Config and LLM Client",
        "Load model URL and API key from environment.",
        "mkdir -p agent\ncat > agent/config.yaml << 'EOF'\nmodel: ${LLM_MODEL:-gpt-4o-mini}\nmcp_command: python ../mcp/server.py\nEOF\ncat > .env.example << 'EOF'\nLLM_API_KEY=change-me\nLLM_MODEL=gpt-4o-mini\nEOF",
        "yaml",
        "netops_ai_lab/agent/",
        [1, 8]
      ),
      code(
        "wire-mcp-tools-to-agent",
        "Wire MCP Tools",
        "Agent discovers FastMCP tools at startup.",
        "cat > agent/agent.py << 'EOF'\nimport os\n# Pseudocode: connect MCP client, list tools, bind to LLM\nTOOLS = [\"list_vlans\", \"get_lab_inventory\"]\ndef run_turn(user_msg: str) -> str:\n    return f\"plan tools for: {user_msg}\"\nEOF",
        "python",
        "netops_ai_lab/agent/",
        [1, 6]
      ),
      code(
        "conversational-network-query",
        "Query: List VLANs",
        "User asks which VLANs exist — agent calls list_vlans MCP tool.",
        "python -c \"\nfrom agent.agent import run_turn\nprint(run_turn('What VLANs are in intent?'))\n\"",
        "python",
        "netops_ai_lab/",
        [1, 3]
      ),
      code(
        "agent-proposes-change",
        "Agent Proposes Change",
        "Agent drafts playbook change but does not apply — awaits approval.",
        "python -c \"\nprint('PROPOSAL: add VLAN 400 OPS_AGENT — awaiting human approve')\n\"",
        "python",
        "netops_ai_lab/",
        [1, 2]
      ),
      code(
        "human-approval-gate",
        "Human Approval Gate",
        "Engineer types approve or reject before any write to iac repo.",
        "read -p \"Approve agent proposal? [y/N] \" ans\n[[ \"$ans\" == \"y\" ]] && echo approved >> reviews/review.log || echo rejected >> reviews/review.log",
        "bash",
        "netops_ai_lab/",
        [1, 2]
      ),
      code(
        "troubleshoot-agent-hallucination",
        "Troubleshoot Agent Hallucination",
        "If agent cites VLANs not in tool output, re-ground with mandatory tool call or lower temperature.",
        "# compare agent answer to: python -c \"import yaml; print(yaml.safe_load(open('../netops_iac_lab/intended/vlans.yaml')))\"",
        "bash",
        "netops_ai_lab/",
        [1, 1],
        ["Force tool call first", "Compare to MCP output", "Module 4 benchmarks accuracy"]
      ),
      single(
        3,
        "certification-alignment-agents",
        "Exam Objective 4.4",
        "Construct conversational agent leveraging LLMs and MCP for network automation with human approval on writes.",
        ["4.4 LLM agent", "MCP tool grounding", "Module 4 — evaluate accuracy"]
      ),
      beat(
        3,
        "agents-ready-for-evaluation",
        "Agents Complete — Evaluation Next",
        "Module four benchmarks agent recommendations — exam four point five.",
        ["Agent with approval gate", "Exam 4.4 practiced", "Module 4 benchmarks"],
        true
      ),
    ],
  },
  {
    moduleNumber: 4,
    title: "AI Evaluation",
    subtitle: "Accuracy, Hallucinations, and Safety Measurement",
    slides: [
      titleSlide(
        4,
        "evaluation-bridge-from-agents",
        "From Agents to Measured Accuracy",
        "Module three built a conversational agent. Module four implements exam four point five — evaluate the accuracy of AI recommendations on a network automation solution. You will measure hallucinations, define golden Q&A pairs, score tool-grounded answers, and tune prompts from failed cases."
      ),
      single(
        4,
        "why-evaluate-ai-recommendations",
        "Why Evaluate AI Output",
        "Four point five — accuracy is not vibes. Benchmark against known answers on lab intent and inventory. Track regression when prompts or models change.",
        ["4.5 — measure accuracy", "Golden Q&A dataset", "Regression on model change"]
      ),
      card(
        4,
        "hallucinations-in-network-context",
        "Hallucinations in NetOps",
        "Models invent VLANs, wrong IOS commands, or devices not in inventory. Grounding with MCP tools reduces but does not eliminate hallucinations — measure remainders.",
        ["Invented VLANs or APIs", "MCP grounding helps", "Benchmark catches drift"]
      ),
      single(
        4,
        "accuracy-metrics-plain-language",
        "Accuracy Metrics",
        "Exact match on structured fields, tool-call success rate, and human rubric score on explanations. Report precision on VLAN list questions in lab benchmark.",
        ["Tool call success rate", "Field exact match", "Human rubric optional"]
      ),
      card(
        4,
        "benchmark-dataset-design",
        "Golden Dataset Design",
        "Ten to twenty lab questions with expected answers from ground truth files — vlans.yaml, inventory JSON. Include trick questions with false premises.",
        ["Q&A from ground truth", "Include negative cases", "Version dataset in Git"]
      ),
      single(
        4,
        "safety-guardrails-for-agents",
        "Safety Guardrails",
        "Refuse write without approval, refuse out-of-scope commands, strip secrets from logs. Tie to course three TLS and course four governance.",
        ["Approval on writes", "Scope limits", "No secrets in eval logs"]
      ),
      beat(
        4,
        "story-beat-recap-evaluation",
        "Theory Complete — Benchmark Lab Next",
        "Create benchmarks/golden_qa.jsonl and run eval script against agent.",
        ["4.5 accuracy evaluation", "Golden dataset", "Score and tune prompts"]
      ),
      lab(
        4,
        "lab-setup-benchmark",
        "Benchmark Lab Setup",
        "netops_ai_lab/benchmarks/ with golden_qa.jsonl and run_eval.py.",
        ["benchmarks/golden_qa.jsonl", "benchmarks/run_eval.py", "results/ for scores"]
      ),
      code(
        "create-golden-qa-pairs",
        "Create Golden Q&A",
        "Expected answers derived from lab intent files.",
        "mkdir -p benchmarks results\ncat > benchmarks/golden_qa.jsonl << 'EOF'\n{\"q\":\"How many VLANs in intent?\",\"expect_contains\":\"100\"}\n{\"q\":\"Name lab switch?\",\"expect_contains\":\"lab-sw1\"}\nEOF",
        "bash",
        "netops_ai_lab/benchmarks/",
        [1, 4]
      ),
      code(
        "run-agent-benchmark",
        "Run Benchmark Script",
        "Score agent answers against expect_contains strings.",
        "cat > benchmarks/run_eval.py << 'EOF'\nimport json, sys\nfrom agent.agent import run_turn\nok=0\nfor line in open(\"golden_qa.jsonl\"):\n    row=json.loads(line)\n    ans=run_turn(row[\"q\"])\n    ok+=1 if row[\"expect_contains\"] in ans else 0\nprint(f\"score {ok}\")\nEOF\npython benchmarks/run_eval.py | tee results/score.txt",
        "python",
        "netops_ai_lab/benchmarks/",
        [1, 10]
      ),
      code(
        "review-failed-benchmark-cases",
        "Review Failures",
        "Inspect rows where expect_contains missing — tune prompt or add mandatory tool call.",
        "grep -v score results/score.txt\n# re-run after prompt fix",
        "bash",
        "netops_ai_lab/",
        [1, 2]
      ),
      code(
        "tune-prompt-from-eval",
        "Tune Prompt from Results",
        "Add system instruction: always call list_vlans before answering VLAN questions.",
        "cat >> agent/system_prompt.txt << 'EOF'\nAlways call list_vlans MCP tool before answering VLAN questions.\nCite only data returned by tools.\nEOF",
        "bash",
        "netops_ai_lab/agent/",
        [1, 4]
      ),
      code(
        "troubleshoot-low-accuracy",
        "Troubleshoot Low Scores",
        "Low score causes — no tool call, wrong MCP path, model ignoring system prompt. Fix grounding before swapping models.",
        "python benchmarks/run_eval.py",
        "bash",
        "netops_ai_lab/benchmarks/",
        [1, 1],
        ["Mandatory tool call", "Verify MCP data path", "Tune system prompt first"]
      ),
      single(
        4,
        "certification-alignment-evaluation",
        "Exam Objective 4.5",
        "Evaluate accuracy of AI recommendations using benchmarks, golden data, and failure review.",
        ["4.5 accuracy evaluation", "Hallucination measurement", "Capstone — full assistant"]
      ),
      beat(
        4,
        "evaluation-ready-for-capstone",
        "Evaluation Complete — Capstone Next",
        "Capstone integrates AI code review, MCP, agent, and benchmarks into one network assistant.",
        ["Benchmark pipeline in lab", "Exam 4.5 practiced", "Module 5 capstone"],
        true
      ),
    ],
  },
  {
    moduleNumber: 5,
    title: "AI Powered Network Assistant Capstone",
    subtitle: "Integrate AI, MCP, Agents, and Evaluation",
    slides: [
      titleSlide(
        5,
        "ai-capstone-intro",
        "Capstone: AI Network Assistant",
        "Welcome to the course four capstone. netops_ai_lab now has governed AI code workflow, FastMCP server, conversational agent with human approval, and accuracy benchmarks. The capstone runs one operator session: ask about VLAN intent, receive grounded answer, propose a lab change, human approves, validate, and log evaluation score — covering objectives four point one through four point five.",
        "COURSE 4 CAPSTONE"
      ),
      card(
        5,
        "capstone-integrates-four-modules",
        "What the Capstone Integrates",
        "Module one governance on generated code. Module two MCP tools. Module three agent with approval. Module four benchmark score. Course one through three repos supply ground truth data.",
        ["AI review plus MCP plus agent", "Benchmark score recorded", "Uses iac and ops lab data"]
      ),
      single(
        5,
        "capstone-lab-layout",
        "Capstone Lab Layout",
        "netops_ai_lab tree: prompts, generated, reviews, mcp, agent, benchmarks. Sibling repos netops_iac_lab and netops_ops_lab provide intent, validation scripts, and telemetry context.",
        ["netops_ai_lab/ all modules", "iac intent ground truth", "ops validation scripts"]
      ),
      compare(
        5,
        "assistant-vs-chatbot",
        "Assistant vs Raw Chatbot",
        "Raw chatbot hallucinates VLANs. Assistant must call MCP tools, pass benchmark, and require approval on writes.",
        "AI network assistant",
        ["MCP grounded", "Benchmarked", "Human approval"],
        "Raw LLM chat",
        ["Hallucination risk", "No tool audit", "Fails exam story"]
      ),
      card(
        5,
        "six-steps-ai-capstone-runbook",
        "Six Steps in Order",
        "Start MCP server and agent. Run benchmark baseline. Operator asks VLAN question. Agent proposes change. Human approves and validate. Record score and review log.",
        ["Start MCP and agent", "Benchmark baseline", "Query propose approve validate"]
      ),
      single(
        5,
        "five-objectives-capstone-chain",
        "Five Objectives in One Chain",
        "4.1 governed code, 4.2 security controls, 4.3 MCP, 4.4 agent, 4.5 evaluation — evidenced in one capstone run log.",
        ["4.1–4.5 in one session", "reviews/review.log audit", "results/score.txt metric"]
      ),
      single(
        5,
        "verify-capstone-before-close",
        "Verify Before You Close",
        "MCP tools return live intent. Benchmark score meets threshold you set — e.g. eighty percent on golden_qa. Approval logged before any iac file edit.",
        ["MCP returns real VLANs", "Benchmark threshold met", "Approval in review.log"]
      ),
      card(
        5,
        "capstone-nothing-new-ai",
        "Nothing New to Install",
        "Reuse modules one through four artifacts. Fix the owning module if MCP, agent, or benchmark fails.",
        ["All pieces from modules 1–4", "Three-course repos for data", "Repair module if gate fails"]
      ),
      beat(
        5,
        "story-beat-recap-ai-capstone",
        "Ready for Capstone Lab",
        "Code slides walk six steps line by line. Lab and sandbox models only.",
        ["Six-step runbook", "Both ai and iac repos open", "Code slides next"]
      ),
      lab(
        5,
        "lab-setup-ai-capstone",
        "Capstone Lab Setup",
        "Start MCP server, agent REPL, and open reviews log tail. Confirm benchmark golden file exists.",
        ["python mcp/server.py &", "LLM_API_KEY from .env", "benchmarks/golden_qa.jsonl ready"]
      ),
      card(
        5,
        "resume-ai-capstone-prerequisites",
        "Resume Modules 1–4",
        "Governed generated playbook exists. MCP list_vlans works. Agent run_turn works. run_eval.py produces score.",
        ["Module 1–4 green", "iac vlans.yaml present", "venv-mcp activated"]
      ),
      code(
        "capstone-start-mcp-and-agent",
        "Step 1: Start Stack",
        "Launch MCP server and verify tools.",
        "cd netops_ai_lab\nsource venv-mcp/bin/activate\npython mcp/server.py &\npython -c \"from agent.agent import run_turn; print(run_turn('ping'))\"",
        "bash",
        "netops_ai_lab/",
        [1, 4]
      ),
      code(
        "capstone-run-benchmark-baseline",
        "Step 2: Benchmark Baseline",
        "Record accuracy before capstone session.",
        "python benchmarks/run_eval.py | tee results/capstone-baseline.txt",
        "bash",
        "netops_ai_lab/benchmarks/",
        [1, 1]
      ),
      code(
        "capstone-operator-vlan-query",
        "Step 3: Operator Query",
        "Natural language question grounded by MCP.",
        "python -c \"\nfrom agent.agent import run_turn\nprint(run_turn('List VLANs defined in intent and their names'))\n\"",
        "python",
        "netops_ai_lab/",
        [1, 4]
      ),
      code(
        "capstone-propose-and-approve",
        "Step 4: Propose and Approve",
        "Agent proposes VLAN 400 — human must approve.",
        "echo 'PROPOSAL: VLAN 400 AI_CAPSTONE' | tee -a reviews/review.log\nread -p \"Approve? [y/N] \" a\n[[ \"$a\" == \"y\" ]] && echo capstone-approved >> reviews/review.log",
        "bash",
        "netops_ai_lab/",
        [1, 3]
      ),
      code(
        "capstone-validate-proposed-change",
        "Step 5: Validate After Approval",
        "Run secure validation from course three on any iac edit.",
        "python ../netops_ops_lab/scripts/validate_intent_secure.py ../netops_iac_lab/intended/vlans.yaml\nansible-lint ../netops_iac_lab/playbooks/ai_deploy_vlans.yml",
        "bash",
        "netops_ai_lab/",
        [1, 2]
      ),
      code(
        "capstone-final-benchmark-and-tag",
        "Step 6: Final Score and Tag",
        "Re-run benchmark and tag completion.",
        "python benchmarks/run_eval.py | tee results/capstone-final.txt\ngit -C ../netops_iac_lab tag -a course4-capstone -m \"AI in Automation capstone\"",
        "bash",
        "netops_ai_lab/",
        [1, 2]
      ),
      single(
        5,
        "course-four-objectives-complete",
        "Course Four Objectives Complete",
        "Objectives four point one through four point five practiced in capstone: governed AI code, security risks, MCP server, conversational agent, accuracy evaluation.",
        ["4.1 through 4.5 complete", "CCNP AUTOCOR course 4 done", "Four-course arc complete"]
      ),
      beat(
        5,
        "ai-capstone-complete",
        "AI in Automation — Complete",
        "You finish course four with an auditable AI assistant workflow grounded in MCP, guarded by human approval, and measured by benchmarks — built on automate, IaC, and secure operations from courses one through three.",
        ["netops_ai_lab reference", "All AUTOCOR 4.x objectives", "Intelligent agent-driven automation"],
        true
      ),
    ],
  },
];

function writeSvgs() {
  for (const mod of modules) {
    const dir = path.join(SVG_ROOT, `module${String(mod.moduleNumber).padStart(2, "0")}`);
    fs.mkdirSync(dir, { recursive: true });
    for (const slide of mod.slides) {
      if (!("imageSrc" in slide) || !slide.imageSrc) continue;
      const name = slide.name as string;
      const title = (slide.title as string) || name;
      const label =
        mod.moduleNumber === 5 && name === "ai-capstone-intro"
          ? "COURSE 4 CAPSTONE"
          : `COURSE 4 · M${mod.moduleNumber}`;
      const svgPath = path.join(dir, `${name}.svg`);
      const animPath = path.join(dir, `${name}.animation.json`);
      fs.writeFileSync(
        svgPath,
        svg(label, title, mod.subtitle, (slide.points as string[])?.[0])
      );
      fs.writeFileSync(
        animPath,
        JSON.stringify(
          {
            diagram: `${name}.svg`,
            phases: [{ start: 0, end: 10, show: ["main"], dim: [], highlight: [] }],
          },
          null,
          2
        )
      );
    }
  }
}

function main() {
  fs.mkdirSync(ROOT, { recursive: true });
  const content = {
    courseName: COURSE_NAME,
    courseId: COURSE_ID,
    modules,
  };
  fs.writeFileSync(path.join(ROOT, "content.json"), JSON.stringify(content, null, 2));
  writeSvgs();
  const slideCount = modules.reduce((n, m) => n + m.slides.length, 0);
  console.log(`Created ${COURSE_ID}: ${modules.length} modules, ${slideCount} slides`);
}

main();
