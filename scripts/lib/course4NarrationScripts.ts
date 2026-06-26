/**
 * Course 4 narration — problem-first teaching prose (Course 1 style).
 * No exam numbering; no per-module certification checkpoints.
 */
export const COURSE4_NARRATION_SCRIPTS: Record<string, string> = {
	// ── Module 1: AI-assisted drafting with human gates ──
	"secure-ops-to-ai-bridge":
		"Picture a Tuesday night change window. A VLAN standardization request lands in your queue and someone pastes the ask into a chat model. Ten minutes later you have an Ansible playbook that looks almost right. That is the moment this course addresses. Courses one through three taught you to automate, version intent, observe the network, validate changes, and secure your toolchain. Course four adds large language models as a drafting assistant — not as a replacement for your judgment. We will build a workflow you can defend in a real change review: prompt, human review, lint, check mode, and an audit trail before any device touch.",

	"ai-coding-workflows-plain-language":
		"Before we open a model, define the workflow in plain language. You describe the task and constraints in a structured prompt — platform, idempotency, forbidden patterns like embedded passwords. The model returns a draft. A human engineer reads the diff the same way they would review a colleague's pull request. Only after that review do you run ansible-lint, yamllint, and ansible-playbook in check mode. Treat those steps as non-optional. Skipping review is how plausible-looking YAML reaches production and breaks at two in the morning.",

	"benefits-of-ai-assisted-coding":
		"Used well, a model is a fast first pair of hands for boilerplate. It can draft the repetitive skeleton of a VLAN playbook, suggest Ansible task structure when you are new to a module, or translate between JSON intent and YAML when you are tired of indentation errors. None of that removes your networking judgment. The VLAN numbers still must match your design standard. The target devices still must come from inventory. AI accelerates the blank page; you still own the change ticket.",

	"risks-privacy-ip-ownership":
		"Speed without guardrails creates exposure you may not see on a CCNA lab. Pasting a production running-config into a public model can leak customer addressing, VPN details, or credentials in comments. Your employer may have rules about who owns generated code and which providers you may use. Models also invent APIs that sound real — iosxe_restconf.push_vlan might read convincingly even when no such call exists. The fix is the same discipline you already practice: validate before merge, and never treat fluent prose as proof of correctness.",

	"code-validation-after-generation":
		"Here is the habit that separates a demo from production practice. Run the same gates on AI output that you run on human-written playbooks: ansible-lint, yamllint, schema checks on intent files, then ansible-playbook with check and diff. Store the prompt and the generated file in the change ticket so an auditor can reconstruct what the model was asked and what it returned. If check mode fails, you re-prompt with tighter constraints — you do not hand-patch unsafe YAML just to make the pipeline green.",

	"security-risks-ai-automation":
		"New attack surfaces appear when models and tools enter the workflow. Prompt injection tries to override your instructions inside user text. Over-privileged tools let an assistant push configuration you never approved. Sensitive context sent to the wrong endpoint becomes a data leak. Generated scripts sometimes disable TLS verification or embed API keys because the model pattern-matched insecure examples from the internet. Design for least privilege, sandbox tool access, and explicit human approval before any write.",

	"governance-for-ai-automation":
		"Governance is how policy survives contact with a busy team. Publish which models and endpoints are approved, which data classes must never appear in prompts, and how long you retain prompt logs. Align that with secret management from course three — configuration in Git, credentials from the environment, not from chat history. The assistant is a power tool; your change process still owns the blast radius.",

	"human-review-vs-auto-merge":
		"A green linter result is not a network design review. Linters catch syntax and many style problems; they do not catch applying VLAN 400 to the wrong site or trusting a hallucinated module name. A human reviewer reads the diff, runs check mode, and confirms the change matches intent from netops_iac_lab. Auto-merging AI output to main might save five minutes in a lab and cost hours in an outage when the model guessed wrong.",

	"story-beat-recap-ai-assisted":
		"Pause before the lab. You have seen why teams reach for models, what can go wrong, how validation and governance keep speed safe, and why human review stays in the loop. Next you will live the workflow in netops_ai_lab: write a prompt for a VLAN playbook, save the draft, lint it, and run check mode. Use lab topology only in prompts. If a step fails, fix it before continuing — the habit matters more than the speed.",

	"lab-setup-ai-lab":
		"Welcome to the lab portion. Today you will not touch production devices. Create netops_ai_lab beside your IaC and ops repos with three folders: prompts for what you ask the model, generated for raw output, and reviews for human sign-off. That separation mirrors how mature teams keep untrusted drafts away from merged playbooks until review passes. Every command appears on screen; pause when you need to catch up.",

	"save-network-automation-prompt":
		"Step one writes the prompt as a file, not as a disposable chat message. State the task, target platform, idempotency requirement, and constraints such as ansible-lint clean and no credentials in output. Saving under prompts lets you diff prompt versions, re-run generation after a failure, and show auditors exactly what you asked the model during a change review.",

	"generate-playbook-with-llm":
		"Step two saves model output into generated and logs ai-draft in reviews. That log line matters: it proves generation happened before a human signed off. Treat everything in generated as untrusted until lint and check mode pass. Do not copy it straight into your production playbooks folder without the validation steps that follow.",

	"lint-generated-playbook":
		"Step three copies the draft into your IaC playbooks path only for validation, then runs ansible-lint and the secure intent validator from course three. These gates catch unsafe modules, style violations, and intent mismatches while failure is still cheap. If lint fails, tighten the prompt constraints and generate again rather than arguing with the linter.",

	"check-mode-ai-playbook":
		"Step four runs ansible-playbook with check and diff so you see planned changes without applying them. Read the output the way you would read a dry-run on a real change. When the plan matches intent, log human-approved in reviews. That single log entry is evidence your governance workflow was followed.",

	"troubleshoot-unsafe-ai-output":
		"When a draft fails review, search before you discard. Grep for passwords, API keys, and disabled TLS settings. Reject hallucinated module names and destructive tasks without guards. The model is not malicious — it pattern-completes from training data that included bad examples. Fix the prompt, regenerate, and validate again.",

	"ai-assisted-ready-for-mcp":
		"You now have a defensible AI drafting workflow with artifacts to show in a review: prompt file, generated draft, lint results, check mode output, and approval log. That is the foundation intelligent automation builds on. Module two tackles the next problem models have on their own: they do not know your VLANs unless you give them safe read access through MCP.",

	// ── Module 2: MCP for grounded answers ──
	"mcp-bridge-from-module-one":
		"A draft playbook is only half the story. Ask a model which VLANs exist on SW2 without live data and it will guess convincingly. Module two solves that grounding problem. You will build an MCP server in Python with FastMCP — a small program that exposes read-only tools returning real data from netops_iac_lab. The model stops inventing inventory and starts citing what your tools return.",

	"what-mcp-means-plain-language":
		"MCP stands for Model Context Protocol. In everyday terms it is a standard way for an AI client to discover tools, call them with JSON arguments, and receive structured results. FastMCP is a Python library that turns ordinary functions into those tools with less boilerplate. You focus on what the tool should return — VLAN list, device inventory — not on reinventing RPC glue for every integration.",

	"mcp-architecture-components":
		"Three pieces work together. The host runs the LLM client that decides when to call a tool. The MCP server registers tools such as list_vlans and answers with JSON the model can parse. Transport is often stdio in a lab or HTTP when you deploy further. When each piece is clear, troubleshooting is easier: is the client calling the wrong tool, or is the server returning bad data?",

	"fastmcp-vs-ad-hoc-api":
		"Teams often start with one-off REST scripts per integration. That works once, then every new assistant needs custom glue and nobody agrees on schemas. MCP gives you a catalog of tools the client can discover automatically. One server can serve multiple clients, and you audit tool definitions in one place. That is why we standardize on MCP instead of copying curl examples into every prompt.",

	"tool-orchestration-patterns":
		"Design tools the way you design firewall rules: start permissive for reads, strict for writes. Return intent slices, inventory rows, or telemetry summaries as JSON. Defer push_config until module three and keep writes behind human approval. Small, focused tools are easier to test, easier to benchmark later, and harder for an attacker or a confused model to abuse.",

	"expose-network-data-safely":
		"Expose the minimum data the assistant needs — not full running configs, not secrets. In this lab, tools read netops_iac_lab YAML and a simple inventory file. In production you authenticate MCP transport, rate-limit calls, and log which tool returned what. Narrow scope in the lab trains the habit you will need when the same pattern touches real devices.",

	"story-beat-recap-mcp":
		"You understand why MCP exists and how to expose data without handing the model the keys to the kingdom. Next you build netops_ai_lab/mcp/server.py with list_vlans and get_lab_inventory. Keep both tools read-only so the agent in module three can answer questions without pushing configuration on its own.",

	"lab-setup-mcp":
		"Extend netops_ai_lab with an mcp folder: server.py and requirements-mcp.txt. Use a dedicated virtualenv so MCP package versions do not fight with your Ansible or ops tooling. Isolated environments are boring until an upgrade breaks one stack — then you will be glad you separated them.",

	"install-fastmcp-dependencies":
		"Create venv-mcp inside netops_ai_lab and install FastMCP plus PyYAML for reading intent files. Pin versions in requirements-mcp.txt so a teammate or CI job gets the same behavior you tested. Activate this venv before every MCP command in the module.",

	"build-fastmcp-server-skeleton":
		"Start with the smallest server that runs: instantiate FastMCP, register a ping tool, and start the entry point. Confirm the process stays up before you add network logic. The same incremental approach you used for Python scripts in course one applies here — prove the pipe works, then add VLAN data.",

	"add-list-vlans-tool":
		"list_vlans reads VLAN intent from netops_iac_lab and returns structured data. Point at the real YAML file on disk so answers trace back to ground truth. This is the difference between an assistant that cites inventory and one that improvises VLAN IDs from training data.",

	"add-inventory-tool":
		"get_lab_inventory tells the client which devices exist in the sandbox. Return plain dicts and lists so MCP can serialize them. Start the server and confirm both tools register without import errors before you connect an LLM.",

	"test-mcp-tools-manually":
		"Test tools before you test the model. Verify imports inside venv-mcp and confirm the server starts cleanly. If list_vlans returns an empty list, fix paths and YAML before you blame the assistant — most grounding failures are plumbing, not intelligence.",

	"troubleshoot-mcp-server":
		"Import errors usually mean the wrong virtualenv is active. Empty VLAN lists often mean server.py points at the wrong relative path to netops_iac_lab. Serialization errors mean you returned a custom Python object instead of JSON-friendly dicts. Fix the tool layer first; agents are only as honest as the data you give them.",

	"mcp-ready-for-agents":
		"Your MCP server returns real VLAN and inventory data from the lab. Module three puts a conversational layer on top so an operator can ask which VLANs exist without writing Python. Writes still wait for human approval — we are building an assistant, not an unsupervised config pusher.",

	// ── Module 3: Conversational agent ──
	"agents-bridge-from-mcp":
		"Tools alone do not help the on-call engineer at three in the morning if they still need to know Python to invoke them. Module three builds a conversational agent: the operator asks in plain language, the LLM plans tool calls, reads MCP results, and answers. When a change is proposed, the workflow stops for human approval — the same gate you used for AI-generated playbooks in module one.",

	"conversational-agent-plain-language":
		"A conversational agent is not magic chat. It is orchestration: route the question, call list_vlans or get_lab_inventory when needed, append tool JSON to context, and summarize for the engineer. Write actions stay blocked until a human types approve. That pattern keeps the helpful parts of natural language without giving up change control.",

	"llm-orchestration-patterns":
		"In this lab one agent loop is enough: plan which tool to call, execute through MCP, observe the result, respond or ask for approval. Larger deployments sometimes split planner and executor roles; the idea is the same. The model proposes steps; your tool registry and approval gates enforce what is actually allowed.",

	"agent-loop-think-act-observe":
		"Think is the model deciding the next step from the user question and conversation so far. Act is invoking an MCP tool with concrete arguments. Observe is feeding tool output back into context before the model speaks again. Loop until you have an answer or until a proposed write needs a human. Skipping observe is how agents answer from memory instead of from your network.",

	"human-in-loop-vs-full-auto":
		"Read-only questions — what VLANs are defined, is lab-sw1 in inventory — can run end to end in the lab. Pushing configuration without approval is a different class of risk. Production teams require explicit sign-off because prompt injection and model mistakes have real blast radius. Practice full automation only on reads until your benchmarks in module four prove the assistant is trustworthy.",

	"network-operator-agent-design":
		"Scope the agent like you scope a firewall policy. Allow VLAN and inventory queries; refuse arbitrary shell commands and out-of-scope requests. Put lab topology in the system prompt so the model knows which devices exist. A narrow agent is easier to test, easier to explain in a change review, and easier to sleep on when you are on call.",

	"story-beat-recap-agents":
		"You have seen how agents plan, call tools, and pause for approval. Next you wire agent/agent.py to the MCP server from module two and walk through a VLAN question, a proposed change, and an explicit approve or reject step. Keep API keys in the environment, not in Git.",

	"lab-setup-agent":
		"Create netops_ai_lab/agent with agent.py and config.yaml for the model endpoint. Secrets live in .env, loaded at runtime. Use an approved enterprise endpoint or a local sandbox model — the lab is for learning workflow, not for leaking production keys into a repo.",

	"agent-config-llm-client":
		"config.yaml holds non-secret settings: model name and how to launch the MCP server. .env holds LLM_API_KEY. That split is the same pattern course three used for automation credentials: version the recipe, inject the secrets.",

	"wire-mcp-tools-to-agent":
		"At startup the agent discovers which MCP tools exist and binds them to the LLM client. The pseudocode lists list_vlans and get_lab_inventory so you see the allowed surface area before you add real orchestration. If a tool is not registered, the model should not be able to call it.",

	"conversational-network-query":
		"Ask which VLANs exist in intent and watch the trace: the agent should plan a list_vlans call, not invent IDs. Compare the answer to netops_iac_lab YAML. This is your first proof that grounding works end to end.",

	"agent-proposes-change":
		"When the operator asks for a new VLAN, the agent prints a proposal and stops. Nothing writes to Git automatically. Separating recommendation from execution is how you keep automation fast without making it irreversible.",

	"human-approval-gate":
		"The engineer types approve or reject and the choice lands in reviews.log. That log is evidence for auditors and for your future self when debugging why a file changed. Treat it as required, not ceremonial.",

	"troubleshoot-agent-hallucination":
		"If the agent cites VLANs that never appeared in tool output, force a tool call before answering or tighten the system prompt. Compare responses to YAML ground truth. Module four adds benchmarks so you can measure how often hallucinations still slip through instead of arguing from one bad example.",

	"agents-ready-for-evaluation":
		"You have a conversational agent grounded in MCP with approval on writes. The remaining question is quantitative: how often is it right? Module four builds golden questions and a score you can track when prompts or models change.",

	// ── Module 4: Benchmarks and trust ──
	"evaluation-bridge-from-agents":
		"An assistant that sounds confident is not the same as one that is correct. Module four teaches measurement: golden questions with known answers, pass-fail scoring, and prompt tuning from failed rows. You will stop debating whether the model feels smart and start showing whether it returns the same VLANs your intent files contain.",

	"why-evaluate-ai-recommendations":
		"Operators trust tools that fail predictably and measurably, not tools that fail rarely but spectacularly. A benchmark suite turns trust into data. Run it when you change prompts, swap models, or add a new tool. Regression should show up in scores before it shows up in a production ticket.",

	"hallucinations-in-network-context":
		"In networking, hallucination is not abstract — it is VLAN 999 on an interface that does not exist, or an IOS command from the wrong platform. MCP grounding reduces guesses but does not eliminate them. Count what remains after grounding so you know whether to widen the agent's scope.",

	"accuracy-metrics-plain-language":
		"Start simple. For structured answers, check whether the VLAN list or device name matches ground truth. Track how often the agent calls the right tool before answering. Optional human rubrics help judge explanation quality, but field match and tool success are enough for the lab baseline.",

	"benchmark-dataset-design":
		"Build ten to twenty questions from files you already trust — vlans.yaml, inventory JSON. Include negative cases: false premises the agent should refuse, or questions that require a tool call instead of memory. Version the dataset in Git like any test fixture so scores are comparable over time.",

	"safety-guardrails-for-agents":
		"Guardrails are the policies you already believe, enforced in code: no writes without approval, refuse out-of-scope commands, strip secrets from eval logs. They connect back to TLS and secret handling from earlier courses — intelligent automation still sits on secure operations, not beside it.",

	"story-beat-recap-evaluation":
		"You know why benchmarks matter and how to design them. Next you create benchmarks/golden_qa.jsonl and run_eval.py against your agent. Treat failed rows as engineering work: mandatory tool calls, path fixes, or stronger system prompts.",

	"lab-setup-benchmark":
		"Add netops_ai_lab/benchmarks with golden_qa.jsonl and run_eval.py. Store results under results so you can compare runs after prompt tuning and again in the capstone.",

	"create-golden-qa-pairs":
		"Each line pairs a natural language question with expect_contains text from lab intent. Ground truth comes from YAML you trust, not from whatever the model answered yesterday. That keeps the benchmark honest when you upgrade models.",

	"run-agent-benchmark":
		"run_eval.py calls run_turn for each question and checks for expected substrings. A simple pass count is enough to start; production teams often log per-question detail. Save output to results for the capstone evidence pack.",

	"review-failed-benchmark-cases":
		"Read failed questions beside raw answers. Decide whether you need a mandatory tool call, a corrected MCP path, or a stronger system prompt. Change one thing, re-run, and compare — the same scientific habit you use for flaky automation jobs.",

	"tune-prompt-from-eval":
		"Add instructions such as always call list_vlans before answering VLAN questions and cite only tool-returned data. Prompt tuning often beats model swapping for grounding failures and costs less operational risk.",

	"troubleshoot-low-accuracy":
		"Low scores usually trace to skipped tool calls, wrong file paths, or weak system prompts. Fix grounding before you blame the model. Re-run on the same golden set after each change so improvement is visible.",

	"evaluation-ready-for-capstone":
		"You can score the agent against golden questions and tune from failures. The capstone runs the full pipeline — draft, tools, conversation, measurement — in one operator session you could demonstrate to a teammate.",

	// ── Module 5: Capstone ──
	"ai-capstone-intro":
		"This is the integration lab. netops_ai_lab already contains governed AI drafting, an MCP server, a conversational agent with approval gates, and a benchmark suite. You will run one realistic operator session: ask about VLAN intent, receive a grounded answer, let the agent propose a lab change, approve it explicitly, validate, and record scores. Nothing new to install — only the discipline to run the steps in order.",

	"capstone-integrates-four-modules":
		"Module one gave you reviewed AI-generated code. Module two grounded answers in real intent. Module three let operators ask questions in plain language. Module four measures accuracy. Courses one through three still supply the IaC and validation scripts underneath. The capstone proves those pieces work together, not in isolation.",

	"capstone-lab-layout":
		"Know where artifacts live before you start. netops_ai_lab holds prompts, generated drafts, reviews, mcp, agent, and benchmarks. netops_iac_lab and netops_ops_lab supply intent YAML and validation scripts. When something fails, you fix the owning folder instead of patching the capstone script.",

	"assistant-vs-chatbot":
		"A generic chatbot guesses from training data. Your network assistant calls MCP tools, logs approvals, and passes benchmarks you defined. That difference is what makes the workflow auditable — an auditor can follow tool calls and review.log, not just read a polished paragraph.",

	"six-steps-ai-capstone-runbook":
		"Run six steps in order: start MCP and agent, record a benchmark baseline, ask a VLAN question, let the agent propose a change, approve and validate, then record the final score. Skipping a step breaks the story you would tell in a change review about how the assistant was used safely.",

	"five-objectives-capstone-chain":
		"One session chains every skill you built: governed code generation, safe tool exposure, conversational queries with approval, and measured accuracy. reviews/review.log shows who approved what; results/score.txt shows whether the assistant still passes after the full workflow.",

	"verify-capstone-before-close":
		"Before you close the lab, confirm MCP returns live intent data, your benchmark meets the threshold you set, and approval is logged before any IaC edit. These checks mirror a production readiness review — proof the system is safe to rely on, not a formality to rush through.",

	"capstone-nothing-new-ai":
		"If MCP, agent, or benchmark fails here, return to the module that owns that component. The capstone is integration, not a second chance to learn FastMCP from scratch. Reuse what you built; repair what is broken.",

	"story-beat-recap-ai-capstone":
		"The following code slides walk the six-step runbook line by line. Keep both AI and IaC repos open, use sandbox models only, and treat the runbook as evidence you could attach to a real change ticket.",

	"lab-setup-ai-capstone":
		"Start the MCP server in the background, launch the agent, and confirm golden_qa.jsonl exists. Tail reviews.log so approvals appear as you go. Baseline the benchmark before you change prompts mid-session.",

	"resume-ai-capstone-prerequisites":
		"Confirm modules one through four are green: governed playbook exists, list_vlans works, run_turn responds, run_eval.py prints a score. Activate venv-mcp and verify netops_iac_lab/intended/vlans.yaml is present. Starting the capstone on a broken foundation wastes time.",

	"capstone-start-mcp-and-agent":
		"Step one launches MCP and sanity-checks the agent with a simple query. Both processes must stay healthy before operator questions or benchmarks in later steps.",

	"capstone-run-benchmark-baseline":
		"Step two records accuracy before the session changes behavior. capstone-baseline.txt gives you a before picture when you compare final scores.",

	"capstone-operator-vlan-query":
		"Step three is the operator moment: a natural language VLAN question that should trigger MCP grounding. The answer must match intent files, not model memory.",

	"capstone-propose-and-approve":
		"Step four logs a VLAN proposal and waits for explicit approval. Nothing in netops_iac_lab changes until you type yes and append capstone-approved to reviews.",

	"capstone-validate-proposed-change":
		"Step five runs secure validation from course three and ansible-lint on the AI-generated playbook. Validation after approval shows you still enforce gates even when the assistant drafted the change.",

	"capstone-final-benchmark-and-tag":
		"Step six re-runs the benchmark, saves capstone-final.txt, and optionally tags the IaC repo to mark completion. Compare final score to baseline — that delta is part of your evidence pack.",

	"ai-capstone-complete":
		"You finish course four with something concrete: an auditable assistant workflow grounded in MCP, guarded by human approval, and measured by benchmarks — built on automate, version, and secure operations from courses one through three. Intelligent automation here means safer operations with a paper trail, not shortcuts around the judgment you already earned as a network engineer.",
};

/** On-slide polish — learning titles and bullets, not requirement checklists */
export const COURSE4_SLIDE_POLISH: Record<
	string,
	{ title?: string; points?: string[]; leftItems?: string[]; rightItems?: string[] }
> = {
	"benefits-of-ai-assisted-coding": {
		title: "When AI Helps Network Engineers",
		points: ["Faster first drafts", "Less syntax friction", "You still own the design"],
	},
	"risks-privacy-ip-ownership": {
		title: "When Speed Creates Exposure",
	},
	"security-risks-ai-automation": {
		title: "New Threats in AI Workflows",
	},
	"story-beat-recap-ai-assisted": {
		points: ["Concepts before commands", "Generate, review, validate", "Lab topology only in prompts"],
	},
	"conversational-agent-plain-language": {
		points: ["Natural language in", "Tool calls in the middle", "Human approves writes"],
	},
	"fastmcp-vs-ad-hoc-api": {
		leftItems: ["Standard tool schema", "Reusable across clients", "One server to maintain"],
	},
	"human-in-loop-vs-full-auto": {
		leftItems: ["Approve writes", "Audit trail", "Production pattern"],
	},
	"story-beat-recap-mcp": {
		points: ["MCP architecture clear", "Read-only tools first", "Build server.py next"],
	},
	"mcp-ready-for-agents": {
		points: ["Tools return real data", "Server tested", "Agent wiring next"],
	},
	"story-beat-recap-agents": {
		points: ["Think-act-observe loop", "Approval gate in place", "Build agent.py next"],
	},
	"agents-ready-for-evaluation": {
		points: ["Agent answers queries", "Writes need approval", "Benchmarks next"],
	},
	"why-evaluate-ai-recommendations": {
		points: ["Trust from data", "Golden Q&A dataset", "Re-run on model change"],
	},
	"story-beat-recap-evaluation": {
		points: ["Why measurement matters", "Golden dataset design", "Run eval script next"],
	},
	"evaluation-ready-for-capstone": {
		points: ["Scores you can defend", "Prompt tuning practiced", "Full pipeline next"],
	},
	"five-objectives-capstone-chain": {
		title: "The Full Pipeline in One Session",
		points: ["Code, tools, agent, metrics", "review.log audit trail", "results/score.txt accuracy"],
	},
	"ai-capstone-complete": {
		points: ["netops_ai_lab reference", "Auditable workflow", "Four-course foundation"],
	},
};
