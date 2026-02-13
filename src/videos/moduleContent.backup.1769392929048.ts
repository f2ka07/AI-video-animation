// Auto-generated course content from SSML pipeline
// Course: Agentic Ai For Beginners
// Generated: 2026-01-26T02:01:27.279Z

export interface SlideContent {
	name: string;
	type: "title" | "content-two-card" | "content-single" | "code" | "code-diagram" | "comparison";
	script: string;
	title?: string;
	subtitle?: string;
	points?: string[];
	code?: string;
	language?: string;
	imageSrc?: string;
	animation?: "git-machine" | "none";
	leftTitle?: string;
	leftItems?: string[];
	rightTitle?: string;
	rightItems?: string[];
	scene?: string;
}

export interface ModuleContent {
	moduleNumber: number;
	courseId: string;
	title: string;
	subtitle: string;
	slides: SlideContent[];
}

export const module1Content: ModuleContent = {
	moduleNumber: 1,
	courseId: "agentic-ai-for-beginners",
	title: "",
	subtitle: "Module 1: ",
	slides: [
		{
			name: "module-1-title",
			type: "title",
			script: "The age of typing prompts into a chat window is ending. For the past two years, the world has marveled at large language models. We've asked them questions. We've watched them write poems and debug code. We've been impressed, entertained, and sometimes alarmed. But here's what most people missed: those interactions were never the destination. They were the warmup. The real shift is happening now. And it's not about better prompts or smarter models. It's about something far more consequential: the transition from AI as a tool you talk to, into AI as a system that works. Welcome to the era of Agentic AI.",
			title: "",
			points: [
				"The age of typing prompts into a chat window is ending",
				"For the past two years, the world has marveled at large language models",
				"from AI as interface, to AI as infrastructure.",
				"What does an agentic system actually look like",
			],
		},
		{
			name: "module-1-concept",
			type: "content-single",
			script: "Let's start by understanding what we're leaving behind. When you type a prompt into ChatGPT or Claude, you're making a single call to a language model. You send input, the model generates output, and the interaction ends. This is called single-call inference. It's useful. It's accessible. And for production workloads, it's fundamentally limited. Single-call systems have no memory between interactions. They cannot plan across multiple steps. They cannot use external tools. They cannot verify their own outputs. And they cannot adapt based on feedback. In short, they respond. They don't work. Agentic AI is different. An agent is not a chatbot with extra features. It's a system architecture. It's a pipeline that orchestrates language models alongside planning, memory, tool use, safety checks, and human oversight. When we say \"agentic,\" we mean the AI can perceive its environment, reason about goals, take actions, observe results, and iterate. It operates in loops, not single shots. It retrieves information when needed. It calls external tools. It remembers context across steps. And critically, it can be interrupted, corrected, and supervised. This is the transition: from AI as interface, to AI as infrastructure.",
			title: "Concept",
			points: [
				"from AI as interface, to AI as infrastructure.",
			],
		},
		{
			name: "module-1-architecture",
			type: "content-single",
			script: "What does an agentic system actually look like? At the highest level, an agent is a pipeline with five core components. First, planning. The agent must decompose a goal into subtasks, decide on an execution order, and adapt when things go wrong. This is where reasoning models earn their value. Planning isn't just thinking. It's structured decision-making under uncertainty. Second, tools. An agent without tools is just a language model with extra steps. Tools are the interfaces that let agents interact with the real world: APIs, databases, file systems, code interpreters, search engines, and more. Tool use is what makes agents useful beyond conversation. Third, memory. Agents need to retain information across steps. Short-term memory holds the current task context. Long-term memory stores knowledge that persists across sessions. Without memory, agents would repeat mistakes indefinitely. Fourth, safety loops. This includes guardrails that filter harmful outputs, policy checks that enforce business rules, and evaluation layers that assess whether the agent is on track. Safety isn't optional in production. It's load-bearing. Fifth, human-in-the-loop. Not every decision should be automated. Agentic systems must know when to pause, escalate, and defer to human judgment. This is especially critical for high-stakes domains like healthcare, finance, and legal. Here's the mental model that matters: agents are pipelines, not personas. They're not characters you chat with. They're systems you deploy.",
			title: "Architecture",
			points: [
				"What does an agentic system actually look like",
				"At the highest level, an agent is a pipeline with five core components",
				"This is where reasoning models earn their value",
			],
		},
		{
			name: "module-1-application",
			type: "content-single",
			script: "Why are enterprises making this transition now? Three drivers dominate. First, reliability. Single-call systems are brittle. They hallucinate. They miss context. They can't recover from errors. Agentic architectures introduce checkpoints, retries, and verification steps. They're designed for failure tolerance, not just accuracy. Second, traceability. In regulated industries, you need to know what the AI did, why it did it, and what data it used. Agentic systems can log every step, every tool call, every memory access. This audit trail is non-negotiable for compliance. Third, integration. Enterprises don't run isolated models. They run systems that connect to CRMs, ERPs, data warehouses, and internal APIs. Agentic architectures are built for integration. They treat external tools as first-class citizens. The result is a new category of workload: AI that doesn't just answer questions, but executes workflows. AI that doesn't just generate content, but manages processes. AI that doesn't just assist, but operates.",
			title: "Application",
			points: [
				"Why are enterprises making this transition now",
				"Three drivers dominate",
				"Single-call systems are brittle",
				"They can't recover from errors",
			],
		},
		{
			name: "module-1-exam-mapping",
			type: "content-single",
			script: "If you're preparing for the NVIDIA certification, this module maps to several key areas. You'll need to understand why the industry is shifting from prompt-based interaction to agentic architectures. You'll need to recognize the limitations of single-call inference and articulate why loops, tools, and memory are essential. You'll also need vocabulary alignment. Terms like \"agent loop,\" \"tool use,\" \"grounding,\" and \"human-in-the-loop\" appear throughout the exam. This module establishes the conceptual foundation for those terms. Think of this as the orientation layer. The rest of the course builds on these ideas.",
			title: "Exam Mapping",
			points: [
				"You'll also need vocabulary alignment",
			],
		},
		{
			name: "module-1-recap",
			type: "content-single",
			script: "Let's lock in the key points. Prompting was never the product. It was the user interface for early adoption. The real value of large language models emerges when they're embedded in pipelines, not chat windows. Agents are not chatbots. They're architectures. They combine planning, tools, memory, safety, and human oversight into systems that can execute real work. Enterprises are adopting agentic AI because they need reliability, traceability, and integration. These aren't nice-to-haves. They're requirements. And NVIDIA is at the center of this transition. The certification you're preparing for is designed to validate that you understand not just how models work, but how agentic systems are built, deployed, and operated. This is the new baseline. Let's build on it.",
			title: "Recap",
			points: [
				"Let's lock in the key points",
				"Prompting was never the product",
				"It was the user interface for early adoption",
			],
		},
	],
};

export const module2Content: ModuleContent = {
	moduleNumber: 2,
	courseId: "agentic-ai-for-beginners",
	title: "",
	subtitle: "Module 2: ",
	slides: [
		{
			name: "module-2-title",
			type: "title",
			script: "Every demo you've ever seen of a language model lied to you. Not intentionally. But structurally. Because every demo showed you a single interaction: a prompt goes in, a response comes out. Clean. Impressive. Complete. But that's not how work gets done. Real work is messy. It spans multiple steps. It requires looking things up, making decisions, handling errors, and circling back when something breaks. Real work is a loop, not a line. And that loop is exactly what separates a language model from an agent. In this module, we go inside the loop. We break down the components. And we show you what it actually means to build AI that works.",
			title: "",
			points: [
				"Every demo you've ever seen of a language model lied to you",
				"But that's not how work gets done",
				"Let's define the term clearly",
				"The key word is \"loop",
			],
		},
		{
			name: "module-2-concept",
			type: "content-single",
			script: "Let's define the term clearly. An agent is a system that uses a language model as its reasoning core, but wraps that model in a control loop that allows it to plan, act, observe, and adapt. The key word is \"loop.\" In single-call inference, you make one request, get one response, and you're done. The model has no awareness of what came before or what comes next. Every interaction is isolated. In agentic systems, the model operates inside a cycle. It receives a goal. It plans steps to achieve that goal. It executes an action. It observes the result. And then it decides what to do next. This cycle repeats until the goal is complete, the task is escalated, or the system hits a defined stopping condition. This is the agent loop. It's the foundational pattern behind every agentic system. But the loop alone isn't enough. To be useful, agents need components.",
			title: "Concept",
			points: [
				"Let's define the term clearly",
				"The key word is \"loop",
			],
		},
		{
			name: "module-2-architecture",
			type: "content-single",
			script: "There are six core components in a production agentic architecture. You've seen a preview in Module 01. Now let's go deeper. Planning. This is the agent's ability to break a complex goal into smaller subtasks, sequence them logically, and adjust when things don't go as expected. Planning can be explicit, using a structured planner module, or implicit, where the language model itself reasons through the steps. In practice, most production agents use a hybrid approach: a structured planner for high-level orchestration, with the language model handling flexible reasoning within each step. Tool Use. An agent without tools is just a chatbot with a loop. Tools are the interfaces that let agents interact with the world beyond text. This includes APIs for retrieving data, code interpreters for executing logic, search engines for grounding responses in real information, and connectors for enterprise systems like databases and CRMs. Tool use is what makes agents actionable. It's the bridge between reasoning and reality. Memory. Agents need to remember. Short-term memory, often called working memory, holds the context for the current task: what's been done, what's pending, what results have been observed. Long-term memory persists across sessions. It stores facts, preferences, and history that inform future behavior. Without memory, agents would be stateless. They'd forget what they just did. They'd repeat mistakes. They'd lose track of goals. Retrieval and Grounding. This is how agents access external knowledge. Retrieval typically involves a vector database or search index that lets the agent find relevant documents, code, or data on demand. Grounding means the agent's responses are anchored in retrieved facts, not just the model's parametric knowledge. This reduces hallucination and increases accuracy, especially in domain-specific applications. Safety and Policy. Production agents must operate within guardrails. This includes content filters that block harmful outputs, policy engines that enforce business rules, and evaluation layers that assess whether the agent's behavior is aligned with expectations. Safety isn't an add-on. It's a core architectural layer. In enterprise contexts, policy enforcement often involves legal, compliance, and risk teams. Human-in-the-Loop. Not every decision should be automated. Agentic systems need mechanisms for escalation: moments where the agent pauses, presents its state, and requests human input. This is critical for high-stakes domains, ambiguous situations, and cases where the agent's confidence is low. Human-in-the-loop is how you maintain oversight without sacrificing autonomy. These six components, planning, tools, memory, retrieval, safety, and HITL, form the anatomy of an agent. If any one is missing, the system is incomplete.",
			title: "Architecture",
			points: [
				"There are six core components in a production agentic architecture",
				"You've seen a preview in Module 01",
			],
		},
		{
			name: "module-2-application",
			type: "content-single",
			script: "Now let's connect this to how real work gets done. Consider a support automation workflow. A customer submits a ticket. An agentic system receives the ticket, retrieves the customer's history from a CRM, identifies relevant knowledge base articles, formulates a response, and routes the ticket if escalation is needed. That's not one call. That's a loop with multiple tool invocations, memory access, retrieval, and potentially human handoff. Or consider a research workflow. An analyst needs a summary of recent market activity for a specific sector. An agent receives the request, queries multiple data sources, synthesizes findings, checks for consistency, and generates a report. If the data is conflicting, the agent flags it for review. Again, that's a loop. Multiple steps. Multiple tools. Memory. Grounding. Safety checks. Enterprises are adopting agentic systems because their workloads are not single-call problems. They're multi-step processes that require coordination, verification, and adaptation. Agents are the architectural pattern that fits these requirements. The shift from demos to workloads is the shift from single calls to loops.",
			title: "Application",
			points: [
				"Now let's connect this to how real work gets done",
				"Consider a support automation workflow",
				"A customer submits a ticket",
			],
		},
		{
			name: "module-2-exam-mapping",
			type: "content-single",
			script: "For the NVIDIA certification, this module establishes core vocabulary and concepts you'll see throughout the exam. You need to understand what distinguishes an agent from a simple language model call. The answer is the loop: planning, acting, observing, adapting. You need to recognize the six components and understand their roles. Expect questions that ask you to identify which component is responsible for a given function, or to diagnose what's missing when a system fails. You should also be able to distinguish between one-shot inference and agentic inference. The exam tests whether you understand that production workloads require loops, not isolated calls. Finally, pay attention to the terminology: agent loop, tool use, grounding, retrieval, working memory, long-term memory, guardrails, HITL. These terms will appear in questions, and precise understanding matters.",
			title: "Exam Mapping",
			points: [
				"The answer is the loop: planning, acting, observing, adapting",
				"You need to recognize the six components and understand their roles",
			],
		},
		{
			name: "module-2-recap",
			type: "content-single",
			script: "Let's consolidate what we covered. An agent is a system that wraps a language model in a control loop. That loop enables planning, action, observation, and adaptation. It's what transforms a model from a responder into a worker. The agent loop has six core components: planning, tools, memory, retrieval, safety, and human-in-the-loop. Each component addresses a specific limitation of single-call inference. Demos show you single calls. Real workloads require loops. That's the fundamental distinction this module teaches. Enterprises are adopting agents because their problems are multi-step, multi-tool, and require verification. Agents are the architecture that fits. And for the certification, you need to know this inside and out. The loop is the foundation. Everything else builds on it.",
			title: "Recap",
			points: [
				"Let's consolidate what we covered",
				"An agent is a system that wraps a language model in a control loop",
				"That loop enables planning, action, observation, and adaptation",
				"It's what transforms a model from a responder into a worker",
			],
		},
	],
};

export const module3Content: ModuleContent = {
	moduleNumber: 3,
	courseId: "agentic-ai-for-beginners",
	title: "",
	subtitle: "Module 3: ",
	slides: [
		{
			name: "module-3-title",
			type: "title",
			script: "When most people hear NVIDIA, they think of graphics cards. Gamers. GPUs. Maybe cryptocurrency mining. But that's the old story. The new story is this: NVIDIA is no longer just a hardware company. It's a full-stack AI platform provider. From the silicon in the data center to the APIs developers call in production, NVIDIA now touches every layer of the AI system. And if you want to understand how agentic AI gets deployed at scale, you need to understand this stack. Not as marketing. As architecture. This module walks you through the layers. From hardware to application. From CUDA to NIM. And by the end, you'll understand why enterprises building agentic systems are betting on this platform.",
			title: "",
			points: [
				"When most people hear NVIDIA, they think of graphics cards",
				"Maybe cryptocurrency mining",
				"Let's frame the problem before we introduce the solution",
				"Building AI systems at production scale is hard",
			],
		},
		{
			name: "module-3-concept",
			type: "content-single",
			script: "Let's frame the problem before we introduce the solution. Building AI systems at production scale is hard. Not because the models are hard, although they are, but because the infrastructure is complex. You need GPUs. You need software that extracts performance from those GPUs. You need inference servers that handle requests at scale. You need model deployment that's reliable and reproducible. And you need integration surfaces that connect your AI to the rest of your enterprise. Historically, companies built this themselves. They stitched together open-source tools, custom scripts, and cloud services. It worked, but it was fragile. Every layer was a potential failure point. Every upgrade was a risk. NVIDIA's response is to provide a unified stack. Not just hardware. Not just software. A coherent platform where each layer is designed to work with the others. This is what we call the NVIDIA AI Platform Stack. The goal is simple: reduce the complexity of deploying AI at scale. Let engineers focus on applications, not infrastructure plumbing.",
			title: "Concept",
			points: [
				"Let's frame the problem before we introduce the solution",
				"Building AI systems at production scale is hard",
				"You need software that extracts performance from those GPUs",
			],
		},
		{
			name: "module-3-architecture",
			type: "content-single",
			script: "The stack has five major layers. Let's walk through each. Layer 1: Hardware. At the base is NVIDIA's GPU hardware. This includes the data center GPUs like the H100 and the newer Blackwell architecture, networking fabric like NVLink and InfiniBand for multi-GPU communication, and high-bandwidth memory designed for large model workloads. The hardware layer is purpose-built for AI. It's optimized for the matrix operations that dominate deep learning, and it scales from single GPUs to clusters with thousands of nodes. For engineers, this layer is about throughput, latency, and memory constraints. For technical leaders, it's about capital expenditure, vendor relationships, and long-term roadmap alignment. Layer 2: Acceleration. On top of the hardware sits the acceleration layer. This is where CUDA lives. CUDA is NVIDIA's parallel computing platform. It's the software interface that lets developers write code that runs on GPUs. But raw CUDA is low-level. Most AI workloads don't use it directly. Instead, they use libraries built on CUDA: cuDNN for deep learning primitives, cuBLAS for linear algebra, and most importantly, TensorRT. TensorRT is NVIDIA's inference optimization toolkit. It takes a trained model and compiles it into a highly optimized execution graph. The result is faster inference with lower latency and higher throughput. TensorRT is the engine that makes production inference economically viable. Layer 3: Inference Serving. Once you have an optimized model, you need to serve it. That's where Triton Inference Server comes in. Triton is NVIDIA's open-source inference serving platform. It handles the mechanics of running models in production: request batching, model versioning, multi-model serving, GPU scheduling, and health monitoring. Triton supports multiple model formats, including TensorRT, PyTorch, TensorFlow, and ONNX. It provides HTTP and gRPC APIs out of the box. And it integrates with Kubernetes for orchestration. For any serious production deployment, Triton is the default starting point. Layer 4: Model and Runtime Surfaces. This is where NeMo and NIM enter the picture. NeMo is NVIDIA's framework for building, customizing, and training large language models. It provides tools for data processing, model architecture, fine-tuning, and alignment. If you're training or customizing models, NeMo is the toolkit. NIM, NVIDIA Inference Microservices, is the deployment surface. NIMs are pre-packaged, optimized containers that wrap a model with TensorRT optimization and Triton serving. You pull a NIM, run it, and you have a production-ready inference endpoint. No manual optimization. No infrastructure configuration. Just deploy. NIMs are designed for agentic workloads. They provide low-latency, high-throughput inference with built-in support for streaming, function calling, and tool use. If you're building agents, NIMs are how you deploy the underlying models. Layer 5: Application Layer. At the top of the stack is the application layer. This is where your agentic system lives. It's where you orchestrate NIMs with planning logic, tool integrations, memory systems, and safety layers. NVIDIA provides blueprints and reference architectures, but this layer is where your differentiation happens. The stack below, hardware through NIM, is platform. The application layer is where you build.",
			title: "Architecture",
			points: [
				"Acceleration.",
				"Inference Serving.",
				"Model and Runtime Surfaces.",
				"Application Layer.",
			],
		},
		{
			name: "module-3-application",
			type: "content-single",
			script: "Why does this stack matter for agentic AI? Because agents are latency-sensitive, compute-intensive, and operationally complex. They make multiple model calls per user interaction. They require fast inference for responsive loops. And they need reliable deployment that doesn't break under load. The NVIDIA stack addresses each of these. TensorRT optimizes the model. Triton handles serving at scale. NIM packages everything for deployment. The result is infrastructure that can support agentic workloads without custom engineering at every layer. Compare this to the alternative: calling a third-party API for every inference. You're subject to their latency, their rate limits, their pricing, and their availability. For enterprise workloads that require control, compliance, and cost predictability, that's often unacceptable. The NVIDIA stack gives you another option: run the inference yourself, on your infrastructure, with tooling designed for the task. For many enterprises, that's the deciding factor. From an engineer's perspective, the stack reduces time-to-production. You don't have to build the inference pipeline from scratch. You focus on the application logic. From a technical leader's perspective, the stack reduces risk. You're building on a supported platform with a clear upgrade path and enterprise support. You're not dependent on a fragile chain of open-source tools.",
			title: "Application",
			points: [
				"Why does this stack matter for agentic AI",
				"They make multiple model calls per user interaction",
				"They require fast inference for responsive loops",
			],
		},
		{
			name: "module-3-exam-mapping",
			type: "content-single",
			script: "For the certification exam, you'll need to understand the platform stack at a conceptual level. Expect questions about the role of each layer. What does TensorRT do? What problem does Triton solve? What is a NIM, and why would you use one? You should understand the relationship between layers. TensorRT optimizes models, Triton serves them, NIM packages both for deployment. That flow is testable. Pay attention to deployment contexts. The exam may ask about on-premises versus cloud versus edge deployment. Understand the tradeoffs: latency, cost, control, compliance. NIM is particularly important. It's NVIDIA's primary interface for agentic deployment. Know what it includes, know how it's used, and know why it simplifies production inference. Finally, understand why a unified stack matters. The exam tests platform understanding, not just component knowledge. You should be able to articulate why enterprises choose an integrated platform over piecemeal solutions.",
			title: "Exam Mapping",
			points: [
				"Expect questions about the role of each layer",
				"What does TensorRT do",
				"What problem does Triton solve",
			],
		},
		{
			name: "module-3-recap",
			type: "content-single",
			script: "Let's lock in the essentials. NVIDIA is not just a GPU company. It's a full-stack AI platform provider. From hardware to application, the stack is designed to reduce the complexity of deploying AI at scale. The five layers are hardware, acceleration with CUDA and TensorRT, inference serving with Triton, model surfaces with NeMo and NIM, and the application layer where your agent lives. For agentic workloads, this stack provides the low-latency, high-throughput, and operationally stable infrastructure required for production loops. NIMs are the deployment surface for agentic AI. They package optimized models in containers ready for production. And for the certification, you need to understand the stack as a coherent system. Know the layers. Know the components. Know why they matter. This is the platform that agentic AI runs on. Now you know how it works.",
			title: "Recap",
			points: [
				"Let's lock in the essentials",
				"NVIDIA is not just a GPU company",
				"It's a full-stack AI platform provider",
			],
		},
	],
};

export const module4Content: ModuleContent = {
	moduleNumber: 4,
	courseId: "agentic-ai-for-beginners",
	title: "",
	subtitle: "Module 4: ",
	slides: [
		{
			name: "module-4-title",
			type: "title",
			script: "There's a reason every AI demo feels slightly unreal. It's because demos are designed to impress, not to survive. They show the model doing something clever once. They don't show the model doing it ten thousand times a day, under load, with errors, with edge cases, with users who don't follow instructions. Demos are theater. Workloads are engineering. And if you want to understand agentic AI in production, you have to think in workloads, not demos. You have to think in pipelines, not prompts. This module bridges that gap. We'll define what a workload actually means in the AI context. We'll break down the inference pipeline that powers agentic systems. And we'll show you how to think about the constraints that shape every production deployment.",
			title: "",
			points: [
				"There's a reason every AI demo feels slightly unreal",
				"It's because demos are designed to impress, not to survive",
				"Let's define our terms",
				"A workload is a sustained, operational process that delivers value continuously",
			],
		},
		{
			name: "module-4-concept",
			type: "content-single",
			script: "Let's define our terms. A workload is a sustained, operational process that delivers value continuously. It's not a one-time request. It's an ongoing function of the business. In traditional software, workloads are things like transaction processing, data pipelines, and API services. They run continuously. They handle variable traffic. They need to be reliable, observable, and scalable. AI workloads are the same, but with inference at the core. An AI workload is a process that continuously receives requests, runs model inference, and returns results. It's not someone typing a prompt into a chat window. It's a system that handles hundreds or thousands of inference calls per minute, day after day. The distinction matters because workloads have requirements that demos ignore. Workloads must be reliable. They need retry logic, error handling, and graceful degradation. They can't just fail silently. Workloads must be traceable. Every inference call needs to be logged with inputs, outputs, latency, and metadata. When something goes wrong, you need to diagnose it. Workloads must be reproducible. Given the same inputs, the system should produce consistent outputs. This is harder with probabilistic models, but it's still a design requirement. Workloads must be cost-efficient. Running inference isn't free. At scale, every millisecond of latency and every token of output has a cost. Workloads are designed to optimize that cost. In short, workloads are production. Demos are prototypes.",
			title: "Concept",
			points: [
				"Let's define our terms",
				"A workload is a sustained, operational process that delivers value continuously",
				"It's not a one-time request",
				"It's an ongoing function of the business",
			],
		},
		{
			name: "module-4-architecture",
			type: "content-single",
			script: "At the core of every AI workload is an inference pipeline. This is the sequence of steps that takes a request from intake to output. For agentic systems, the pipeline is more complex than for simple inference. Let's walk through the full sequence. Request Intake. The pipeline begins when a request arrives. This could be an API call, a message from a queue, or an event from another system. The intake layer validates the request, authenticates the caller, and routes the request to the appropriate handler. Retrieval. Before the model runs, the system often needs to retrieve relevant context. This might mean querying a vector database for similar documents, fetching data from an enterprise system, or looking up user history. Retrieval provides the grounding that makes responses accurate and relevant. Grounding. Once context is retrieved, it needs to be formatted and injected into the model's input. This is grounding: anchoring the model's response in specific facts and data rather than relying solely on parametric knowledge. Grounding reduces hallucination and increases domain accuracy. Planning. For agentic workloads, the next step is often planning. The system decomposes the request into subtasks, determines the execution order, and prepares the agent loop. Planning may involve a separate model call or a structured planner module. Model Inference. This is where the language model runs. The prepared prompt, including retrieved context and task instructions, goes into the model. The model generates output. For agentic systems, this happens multiple times per request as the agent iterates through its loop. Tool Execution. If the model's output includes tool calls, the pipeline executes them. This might mean calling an API, running a code interpreter, or querying a database. Tool execution is where the agent interacts with the world beyond text. Memory Update. After each step, the pipeline updates the agent's memory. Working memory holds the current context. Long-term memory may be updated with facts or outcomes that should persist. Safety and Policy. Before returning output, the pipeline runs safety checks. This includes content filtering, policy enforcement, and evaluation layers. If the output violates rules, it's blocked or modified. Human-in-the-Loop. For high-stakes or low-confidence cases, the pipeline may pause and escalate to a human. This step is optional but critical for certain workloads. Output and Evaluation. Finally, the response is returned to the caller. The pipeline logs the interaction for observability. Evaluation metrics are captured: latency, token usage, success rate, and any anomalies. That's the full pipeline. Ten stages, from intake to output. For agentic systems, this pipeline runs every time the agent completes a loop iteration. It's the backbone of production AI.",
			title: "Architecture",
			points: [
				"At the core of every AI workload is an inference pipeline",
				"This is the sequence of steps that takes a request from intake to output",
				"For agentic systems, the pipeline is more complex than for simple inference",
				"Let's walk through the full sequence",
			],
		},
		{
			name: "module-4-application",
			type: "content-single",
			script: "Let's ground this in real examples. Knowledge Automation. An enterprise deploys an agent to answer employee questions about company policies. The pipeline retrieves relevant policy documents, grounds the model in those documents, and generates an answer. Each query runs through the full pipeline. The system handles thousands of queries per day. Customer Support. A support agent receives tickets, retrieves customer history, formulates responses, and routes complex cases to humans. The pipeline includes tool execution for CRM updates and policy checks for compliance. Analytics and Research. An analyst requests a market summary. The agent queries multiple data sources, synthesizes findings, checks for consistency, and generates a report. The pipeline includes multiple retrieval steps and evaluation layers. Document Workflows. A legal team uses an agent to review contracts. The pipeline retrieves relevant clauses, compares against templates, flags anomalies, and generates summaries for review. Memory tracks previous reviews for consistency. In every case, the workload is a pipeline, not a single call. The enterprise need is continuous, auditable, and scalable inference. Pipeline Constraints. Every pipeline operates under constraints. The three primary constraints are latency, accuracy, and cost. You rarely get to optimize for all three. Faster inference may sacrifice accuracy. Higher accuracy may increase cost. Lower cost may increase latency. Engineers think about these tradeoffs in terms of batching, caching, model selection, and hardware allocation. Technical leaders think about them in terms of SLAs, budget, and business impact. Both perspectives matter.",
			title: "Application",
			points: [
				"Let's ground this in real examples",
				"Each query runs through the full pipeline",
			],
		},
		{
			name: "module-4-exam-mapping",
			type: "content-single",
			script: "For the NVIDIA certification, you need to understand the inference pipeline deeply. Expect questions that test your knowledge of pipeline stages. What happens during retrieval? What is grounding? Where does tool execution occur? You should be able to describe the flow from intake to output. Understand the distinction between workloads and one-off inference. The exam tests whether you recognize that production AI requires pipelines, not isolated calls. Pay attention to pipeline constraints. Questions may present scenarios and ask you to identify the tradeoff: is this a latency problem, a cost problem, or an accuracy problem? Know how retrieval and grounding work together. This is a testable concept. Retrieval fetches data. Grounding integrates it into the model's input. Both are necessary for accurate, domain-specific responses. Finally, understand the role of observability. Workloads require logging, metrics, and evaluation. The exam may ask about what should be captured and why.",
			title: "Exam Mapping",
			points: [
				"Expect questions that test your knowledge of pipeline stages",
				"What happens during retrieval",
				"Where does tool execution occur",
			],
		},
		{
			name: "module-4-recap",
			type: "content-single",
			script: "Let's consolidate. Demos are not workloads. Demos show a model doing something once. Workloads are sustained, operational processes that run continuously and require reliability, traceability, and cost efficiency. The inference pipeline is the backbone of every AI workload. For agentic systems, it includes intake, retrieval, grounding, planning, model inference, tool execution, memory, safety, human-in-the-loop, and output evaluation. Enterprises adopt agentic AI because their problems are workload-shaped: multi-step, multi-tool, continuous, and auditable. Every pipeline operates under constraints: latency, accuracy, and cost. Production systems are designed around these tradeoffs. And for the certification, you need to understand the pipeline as a system. Know the stages. Know the constraints. Know how workloads differ from demos. This is how AI works in production. Now you know the architecture.",
			title: "Recap",
			points: [
				"Demos are not workloads",
				"Demos show a model doing something once",
				"The inference pipeline is the backbone of every AI workload",
			],
		},
	],
};

export const module5Content: ModuleContent = {
	moduleNumber: 5,
	courseId: "agentic-ai-for-beginners",
	title: "",
	subtitle: "Module 5: ",
	slides: [
		{
			name: "module-5-title",
			type: "title",
			script: "Here's a truth that gets lost in the AI hype: building a model is only half the job. The other half is deployment. Getting the model from a notebook into production. Running it reliably, securely, and at scale. Integrating it with the systems that actually run the business. This is where most AI projects stall. Not because the model doesn't work. But because deployment is hard. Integration is harder. And nobody prepared for it. Agentic AI makes this even more challenging. Agents don't just run inference. They call tools. They access data. They interact with enterprise systems. The deployment model you choose determines what's possible and what's not. This module is about those choices. Where you deploy. How you integrate. And what it takes to move from demo to production.",
			title: "",
			points: [
				"building a model is only half the job.",
				"Vendor-Hosted AI.",
				"Deployment is only half the challenge",
				"The other half is integration",
			],
		},
		{
			name: "module-5-concept",
			type: "content-single",
			script: "Let's start with deployment models. A deployment model defines where your AI system runs, who operates it, and what infrastructure supports it. There are four primary models, each with distinct tradeoffs. SaaS: Vendor-Hosted AI. In this model, you access AI through a third-party service. You call an API. The vendor runs the infrastructure. Examples include OpenAI's API, Anthropic's Claude API, and various cloud-hosted services. SaaS is the fastest path to production. You don't manage GPUs. You don't configure servers. You just integrate and go. But there are limitations. You're subject to the vendor's rate limits, latency, and pricing. Your data goes to their servers, which raises compliance and privacy concerns. And you have no control over the model's behavior beyond what the API exposes. Cloud GPU Rental. In this model, you run your own inference infrastructure, but on rented cloud GPUs. Providers like AWS, GCP, and Azure offer GPU instances. You deploy your models using tools like Triton and NIM. You control the configuration, but you don't own the hardware. This model offers flexibility. You can scale up and down based on demand. You can run custom models with custom optimizations. But you're still dependent on cloud availability, and costs can escalate quickly at scale. Enterprise On-Premises. In this model, you run AI on infrastructure you own. The hardware sits in your data center. You control everything: the GPUs, the network, the software stack. On-premises deployment is driven by compliance and data sovereignty. Some industries, finance, healthcare, government, require that sensitive data never leaves the organization's infrastructure. On-prem is the only option that fully satisfies those requirements. The tradeoff is capital expenditure and operational complexity. You need hardware. You need a team to manage it. And upgrades require planning. Hybrid and Edge. Hybrid models combine cloud and on-prem. You might train in the cloud and deploy on-prem. Or run primary inference in the cloud with on-prem fallback. Edge deployment pushes inference to devices at the network edge: robots, vehicles, industrial equipment. This minimizes latency and enables autonomous operation when connectivity is limited. Each deployment model is a choice about control, cost, compliance, and capability. There's no universal answer. The right choice depends on your constraints.",
			title: "Concept",
			points: [
				"Vendor-Hosted AI.",
			],
		},
		{
			name: "module-5-architecture",
			type: "content-single",
			script: "Deployment is only half the challenge. The other half is integration. An agentic system that can't connect to enterprise data and tools is useless. Integration surfaces are the interfaces that make that connection possible. API Integrations. The most common integration surface is the API. Your agent calls external APIs to retrieve data, execute actions, and interact with other systems. This includes both internal APIs, like your CRM or ERP, and external APIs, like payment processors or data providers. API integration requires authentication, error handling, rate limiting, and versioning. It's not just about making calls. It's about making calls reliably. Tool Interfaces. For agentic systems, tools are a specialized form of integration. A tool is a function the agent can invoke: run a SQL query, execute code, search a knowledge base, send an email. Tool interfaces define what the agent can do. They're the bridge between language model reasoning and real-world action. Data Connectors. Agents often need access to structured data: databases, data warehouses, document repositories. Data connectors provide that access. They handle authentication, query execution, and result formatting. For retrieval-augmented generation, vector database connectors are essential. Policy Gateways. In enterprise environments, not all actions are permitted. Policy gateways enforce rules about what the agent can access and what actions require approval. They integrate with identity systems, compliance engines, and audit logs. Policy isn't separate from integration. It's part of it.",
			title: "Architecture",
			points: [
				"Deployment is only half the challenge",
				"The other half is integration",
				"An agentic system that can't connect to enterprise data and tools is useless",
				"Integration surfaces are the interfaces that make that connection possible",
			],
		},
		{
			name: "module-5-application",
			type: "content-single",
			script: "Let's connect deployment and integration to business drivers. SaaS for Velocity. Startups and innovation teams choose SaaS because it's fast. You can have a working prototype in days. The tradeoff is that you're locked into the vendor's capabilities and pricing. For early-stage exploration, that's acceptable. For production scale, it may not be. Cloud for Flexibility. Teams that need custom models or specific optimizations choose cloud GPU rental. You get the control of self-hosting without the capital expense of owned hardware. Cloud is also the default for variable workloads. You scale up for peaks and down for troughs. On-Prem for Compliance and Sovereignty. Regulated industries, or organizations with strict data policies, choose on-premises. The driver isn't cost. It's control. When you can't send data to a third party, you bring the compute to the data. Edge for Latency and Autonomy. Industrial applications, autonomous systems, and remote deployments use edge inference. When network latency is unacceptable, or connectivity is unreliable, you run the model at the edge. Enterprise Blockers. Deployment decisions aren't just technical. They're organizational. Common blockers include procurement friction, which slows hardware acquisition. Compliance requirements that limit cloud options. Safety alignment that requires guardrails not available in SaaS. And integration debt, the accumulated complexity of connecting to legacy systems de facto. For engineers, deployment is about infrastructure. For technical leaders, it's about risk, cost, and organizational readiness.",
			title: "Application",
			points: [
				"Let's connect deployment and integration to business drivers",
				"Startups and innovation teams choose SaaS because it's fast",
				"You can have a working prototype in days",
				"The tradeoff is that you're locked into the vendor's capabilities and pricing",
			],
		},
		{
			name: "module-5-exam-mapping",
			type: "content-single",
			script: "For the certification, you need to understand deployment models and integration surfaces. Expect questions that ask you to match deployment models to business requirements. If a scenario describes data sovereignty, the answer is likely on-premises. If it describes rapid iteration, the answer is likely SaaS. Understand the tradeoffs. Cloud offers flexibility but ongoing cost. On-prem offers control but requires capital. SaaS offers speed but limited customization. Edge offers low latency but constrained resources. Know the integration surfaces. APIs, tools, data connectors, and policy gateways are all testable. You should be able to describe what each does and when it's needed. Pay attention to operational concerns. The exam may ask about SLAs, monitoring, evaluation, and update processes. Deployment isn't just about getting the system running. It's about keeping it running. Finally, understand why integration matters for agentic systems specifically. Agents need tools. Tools require integration. Without robust integration surfaces, agents can't act.",
			title: "Exam Mapping",
			points: [
				"If a scenario describes data sovereignty, the answer is likely on-premises",
				"If it describes rapid iteration, the answer is likely SaaS",
			],
		},
		{
			name: "module-5-recap",
			type: "content-single",
			script: "Let's lock in the key points. Deployment models define where your AI runs. SaaS is fastest but least controlled. Cloud offers flexibility and scale. On-prem offers control and compliance. Edge offers low latency for autonomous systems. Choose based on your constraints. Integration surfaces are how agentic systems connect to the enterprise. APIs for external calls. Tools for agent actions. Data connectors for retrieval. Policy gateways for governance. Business drivers shape deployment choices. Velocity pushes toward SaaS. Flexibility pushes toward cloud. Compliance pushes toward on-prem. Latency pushes toward edge. Deployment is where AI becomes real. It's where models become systems. And for agentic AI, it's where the loop connects to the world. For the certification, know the models, know the surfaces, and know how to match them to requirements. This is the bridge from architecture to operations. You've now crossed it.",
			title: "Recap",
			points: [
				"Let's lock in the key points",
				"Deployment models define where your AI runs",
				"SaaS is fastest but least controlled",
				"Cloud offers flexibility and scale",
			],
		},
	],
};

export const module6Content: ModuleContent = {
	moduleNumber: 6,
	courseId: "agentic-ai-for-beginners",
	title: "",
	subtitle: "Module 6: ",
	slides: [
		{
			name: "module-6-title",
			type: "title",
			script: "For the past five modules, we've talked about architecture. Components. Pipelines. Platforms. But architecture is not the goal. The goal is work. Real work. The kind that fills enterprise budgets and quarterly reports. The kind that justifies headcount and infrastructure investments. Agentic AI is not an academic concept. It's a business category. And businesses buy it because it solves problems they couldn't solve before, or solves them faster, cheaper, and more reliably than the alternatives. In this final module, we ground everything we've learned in reality. We look at where agentic AI is being deployed today. We examine the value drivers that justify adoption. And we trace the path from pilot to production at scale. This is where theory meets the org chart.",
			title: "",
			points: [
				"For the past five modules, we've talked about architecture",
				"But architecture is not the goal",
				"why do enterprises buy AI?",
				"Robotics and Simulation.",
			],
		},
		{
			name: "module-6-concept",
			type: "content-single",
			script: "Let's start with a framing question: why do enterprises buy AI? Not because it's interesting. Not because it's new. Enterprises buy AI because it solves operational problems that matter to the business. Those problems fall into a few categories. Automation. Replacing manual, repetitive work with systems that run continuously. This includes document processing, data entry, routine customer interactions, and report generation. Speed. Accelerating processes that previously took days or weeks. Research synthesis, compliance reviews, onboarding workflows, and analysis pipelines. Consistency. Ensuring that processes produce the same quality output every time, regardless of who's involved or how busy the team is. Traceability. Creating audit trails for regulated processes. Knowing what happened, when, and why. Scalability. Handling volume that would be impossible with human teams alone. Thousands of support tickets. Millions of documents. Continuous monitoring. These are the value drivers that justify agentic AI. When you're evaluating a use case, ask: which of these drivers applies? If none do, the use case probably isn't ready.",
			title: "Concept",
			points: [
				"why do enterprises buy AI?",
			],
		},
		{
			name: "module-6-architecture",
			type: "content-single",
			script: "Now let's look at the use cases themselves. Where is agentic AI being deployed in enterprise settings? Knowledge Management. Every organization has institutional knowledge trapped in documents, wikis, emails, and people's heads. Agentic systems can surface this knowledge on demand. An employee asks a question. The agent retrieves relevant documents, synthesizes an answer, and provides citations. This is retrieval-augmented generation at enterprise scale. The agent doesn't just search. It reasons across sources and produces coherent responses. Customer Operations. Support, sales, and success teams handle high volumes of customer interactions. Agentic systems can triage tickets, answer common questions, draft responses, and route complex cases to humans. The agent integrates with CRM systems, accesses customer history, and applies company policies. This isn't a chatbot. It's an operational system that handles real workflow. Research and Analysis. Analysts spend enormous time gathering data, cleaning it, and synthesizing findings. Agentic systems can automate much of this. Given a research question, the agent queries data sources, retrieves documents, cross-references findings, and generates structured reports. Humans review the output, but the heavy lifting is automated. Document Automation. Contracts, invoices, reports, and regulatory filings are the lifeblood of enterprise operations. Agentic systems can extract data from documents, compare against templates, flag anomalies, and route for approval. This reduces processing time from days to minutes and catches errors that humans miss. Data Workflows. Data engineering teams maintain pipelines that move data from source systems to warehouses to analytics platforms. Agentic systems can monitor these pipelines, diagnose failures, suggest fixes, and even execute routine maintenance. The agent becomes an operational copilot for the data team. Adjacent Domains: Robotics and Simulation. Beyond traditional software, agentic systems are appearing in robotics, where they coordinate with perception and control systems, and in simulation environments, where they test scenarios at scale before real-world deployment. These use cases share a common pattern: they're multi-step, tool-intensive, and require integration with enterprise systems. That's what makes them agentic.",
			title: "Architecture",
			points: [
				"Robotics and Simulation.",
			],
		},
		{
			name: "module-6-application",
			type: "content-single",
			script: "Understanding use cases is necessary but not sufficient. You also need to understand how enterprises adopt. Adoption happens in stages. Stage 1: Pilot. The organization runs a limited proof-of-concept. Usually a single use case with a small team. The goal is to validate feasibility: does the technology work for our problem? Pilots are time-boxed and resource-constrained. Many never progress further. Stage 2: Integration. A successful pilot leads to integration. The system connects to production data and workflows. Security reviews happen. Compliance teams get involved. This stage is where most friction occurs. Integration is harder than prototyping. Stage 3: Scale Out. Once integrated, the system expands to more users, more use cases, or higher volume. This requires operational maturity: monitoring, alerting, SLAs, and support processes. Scaling is not just technical. It's organizational. Stage 4: Platform Standardization. At maturity, the organization treats agentic AI as a platform capability. Shared infrastructure. Reusable components. Governance frameworks. This is rare but represents the destination. At this stage, agentic AI is not a project. It's part of how the organization operates. Most enterprises are in the pilot or integration phase. The path to platform standardization is long and requires sustained investment. Adoption Blockers. Common blockers include unclear ROI, making it hard to justify continued investment. Data quality issues that undermine model performance. Integration complexity that stalls implementation. Organizational resistance from teams who see AI as a threat. And governance gaps where policies haven't caught up with technology. For technical leaders, adoption is as much about change management as it is about technology. For engineers, it's about building systems that can survive the friction of real organizations.",
			title: "Application",
			points: [
				"Integration.",
				"Platform Standardization.",
			],
		},
		{
			name: "module-6-exam-mapping",
			type: "content-single",
			script: "For the certification, you need to demonstrate understanding of where agentic AI applies and how enterprises adopt it. Expect questions that present scenarios and ask you to identify the appropriate use case category. Is this knowledge management, customer ops, research, or document automation? Understand the value drivers. Questions may ask you to identify which driver justifies a given deployment: automation, speed, consistency, traceability, or scalability. Know the adoption stages. The exam may ask about what distinguishes pilot from integration, or what's required for scale-out. Pay attention to maturity indicators. Platform standardization, governance frameworks, and shared infrastructure are signs of mature adoption. The exam tests whether you can recognize these patterns. Finally, understand the adjacent domains. Robotics and simulation are mentioned in the curriculum. Know that agentic systems are expanding beyond traditional software into physical and simulated environments.",
			title: "Exam Mapping",
			points: [
				"Is this knowledge management, customer ops, research, or document automation",
				"Understand the value drivers",
			],
		},
		{
			name: "module-6-recap",
			type: "content-single",
			script: "Let's consolidate everything from this module. Agentic AI is a business category, not just a technology. Enterprises adopt it because it delivers value: automation, speed, consistency, traceability, and scalability. The primary use cases today are knowledge management, customer operations, research and analysis, document automation, and data workflows. Each is multi-step, tool-intensive, and requires enterprise integration. Adoption happens in stages: pilot, integration, scale-out, and platform standardization. Most organizations are early in this journey. The path forward requires sustained investment and organizational alignment. For the certification, understand the use cases, the value drivers, and the adoption patterns. This is the practical grounding for everything else in the curriculum. And with that, we've completed the foundation. You now understand what agentic AI is, how it works, what platform it runs on, how it's deployed, and where it's applied. The rest is practice. Good luck on the exam.",
			title: "Recap",
			points: [
				"Let's consolidate everything from this module",
				"Agentic AI is a business category, not just a technology",
			],
		},
	],
};

export const allModules: ModuleContent[] = [
	module1Content,
	module2Content,
	module3Content,
	module4Content,
	module5Content,
	module6Content
];