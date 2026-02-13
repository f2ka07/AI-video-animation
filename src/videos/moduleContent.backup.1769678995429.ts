// Auto-generated course content by restoreCourse API
// Course: Agentic AI in Software Engineering
// Course ID: agentic-ai-software-engineering
// Restored: 2026-01-29T09:28:50.600Z

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
	courseId: "agentic-ai-software-engineering",
	title: "Introduction to Agentic AI",
	subtitle: "Module 1: Understanding Agentic AI Basics",
	slides: [
		{
			name: "intro-agentic-ai",
			type: "title",
			script: "Agentic AI is transforming software engineering by enabling machines to act autonomously with purpose. In this module, we explore what Agentic AI means, why it matters, and how it differs from traditional AI approaches.",
			title: "What is Agentic AI?",
			points: ["Agentic AI enables machines to act autonomously","Machines act with purpose","Transforms software engineering","Differs from traditional AI"],
		},
		{
			name: "agentic-ai-definition",
			type: "content-two-card",
			script: "Agentic AI refers to artificial intelligence systems that can independently make decisions and carry out tasks to achieve goals. Unlike reactive AI, agentic AI plans, adapts, and learns from experience, making it more like a digital agent than a programmed tool.",
			title: "Defining Agentic AI",
			points: ["AI systems that make decisions independently","Carry out tasks to achieve goals","Plans, adapts, and learns from experience","More like a digital agent than a tool"],
		},
		{
			name: "agentic-vs-traditional",
			type: "comparison",
			script: "Traditional AI typically responds to inputs with fixed outputs, lacking autonomy. Agentic AI, by contrast, actively plans, decides, and executes actions on its own. Think of traditional AI as a calculator, while agentic AI is more like a self-driving car navigating complex roads.",
			title: "Agentic AI vs Traditional AI",
			leftTitle: "Traditional AI",
			leftItems: ["Responds to inputs with fixed outputs","No autonomous decision making","Limited adaptability","Function-specific"],
			rightTitle: "Agentic AI",
			rightItems: ["Plans and decides independently","Autonomous action execution","Learns and adapts over time","Goal-oriented behavior"],
		},
		{
			name: "agentic-ai-simple-code",
			type: "code",
			script: "Here's a simple Python example showing an agent that chooses actions based on goals. The agent decides what to do next by evaluating options and selecting the best one to reach its objective.",
			title: "Basic Agentic AI Example",
			code: "class Agent:\n    def __init__(self, goal):\n        self.goal = goal\n\n    def decide(self, options):\n        # Choose option closest to goal\n        return min(options, key=lambda x: abs(x - self.goal))\n\nagent = Agent(goal=10)\naction = agent.decide([7, 15, 9, 20])\nprint(f\"Chosen action: {action}\")",
			language: "python",
		},
		{
			name: "agentic-ai-code-explanation",
			type: "content-two-card",
			script: "This code defines an Agent class with a goal. The decide method picks the option closest to the goal. The agent evaluates possible actions and autonomously selects the one that best advances its objective, demonstrating basic agentic behavior.",
			title: "Explaining the Agent Code",
			points: ["Agent has a specific goal","Decide method evaluates options","Selects option closest to goal","Demonstrates autonomous decision making"],
		},
		{
			name: "agentic-ai-impact-overview",
			type: "content-two-card",
			script: "Agentic AI is quietly changing software engineering by automating complex decision-making, improving efficiency, and enabling new capabilities. It helps developers by handling routine tasks, suggesting solutions, and even writing code autonomously.",
			title: "Impact of Agentic AI on Software Engineering",
			points: ["Automates complex decision-making","Improves development efficiency","Handles routine tasks","Writes code autonomously"],
		},
	]
};

export const module2Content: ModuleContent = {
	moduleNumber: 2,
	courseId: "agentic-ai-software-engineering",
	title: "Core Concepts of Agentic AI in Software Development",
	subtitle: "Module 2: Understanding Agentic AI Components",
	slides: [
		{
			name: "agentic-components-intro",
			type: "title",
			script: "To build agentic AI systems, we need to understand its core components: goal-setting, environment perception, decision-making, and learning. This module breaks down these elements and how they work together.",
			title: "Core Components of Agentic AI",
			points: ["Goal-setting","Environment perception","Decision-making","Learning"],
		},
		{
			name: "goal-setting-explained",
			type: "content-two-card",
			script: "Goal-setting defines what the agent aims to achieve. Without clear goals, the agent cannot act purposefully. Goals guide decisions and help prioritize actions toward a desired outcome.",
			title: "Goal-Setting in Agentic AI",
			points: ["Defines agent's objectives","Enables purposeful actions","Guides decision making","Prioritizes actions"],
		},
		{
			name: "environment-perception",
			type: "content-two-card",
			script: "Environment perception means the agent senses and understands its surroundings. This can include input data, system state, or external conditions. Perception allows the agent to adapt its behavior based on context.",
			title: "Environment Perception",
			points: ["Senses surroundings","Understands input data","Monitors system state","Adapts behavior based on context"],
		},
		{
			name: "decision-making-process",
			type: "content-two-card",
			script: "Decision-making is how the agent selects an action from many options. It evaluates possible outcomes and picks the one most aligned with its goals. This process can use rules, probabilities, or learned experience.",
			title: "Agentic AI Decision-Making",
			points: ["Selects actions from options","Evaluates possible outcomes","Aligns actions with goals","Uses rules or learned experience"],
		},
		{
			name: "learning-in-agentic-ai",
			type: "content-two-card",
			script: "Learning allows the agent to improve over time by analyzing past actions and outcomes. Through learning, the agent adapts to new situations, becoming more effective and efficient at achieving its goals.",
			title: "Learning and Adaptation",
			points: ["Improves over time","Analyzes past actions","Adapts to new situations","Increases effectiveness"],
		},
		{
			name: "agentic-ai-decision-code",
			type: "code",
			script: "This Python example shows an agent that perceives an environment state, evaluates options, and decides actions using a scoring function aligned with its goal. It also updates its knowledge based on outcomes, demonstrating learning.",
			title: "Agentic AI Decision and Learning Example",
			code: "class Agent:\n    def __init__(self, goal):\n        self.goal = goal\n        self.knowledge = {}\n\n    def perceive(self, environment):\n        return environment.get('state', 0)\n\n    def decide(self, options):\n        scored = {opt: -abs(opt - self.goal) for opt in options}\n        return max(scored, key=scored.get)\n\n    def learn(self, action, outcome):\n        self.knowledge[action] = outcome\n\n# Environment simulation\nenv = {'state': 5}\nagent = Agent(goal=10)\nstate = agent.perceive(env)\noptions = [state, state+2, state+5]\naction = agent.decide(options)\noutcome = 100 - abs(action - agent.goal)  # hypothetical reward\nagent.learn(action, outcome)\nprint(f\"Action: {action}, Outcome: {outcome}\")",
			language: "python",
		},
		{
			name: "agentic-ai-code-explanation",
			type: "content-two-card",
			script: "The agent first perceives the environment state, then decides among options by scoring how close each option is to the goal. After acting, it learns by storing the outcome linked to the action, enabling improved future decisions.",
			title: "Explaining Agent Decision and Learning Code",
			points: ["Perceives environment state","Scores options by closeness to goal","Selects highest scoring action","Stores outcomes to learn"],
		},
	]
};

export const module3Content: ModuleContent = {
	moduleNumber: 3,
	courseId: "agentic-ai-software-engineering",
	title: "Building Agentic AI Tools for Developers",
	subtitle: "Module 3: Practical Agentic AI in Software Engineering",
	slides: [
		{
			name: "agentic-tools-intro",
			type: "title",
			script: "Agentic AI is increasingly used to build developer tools that automate coding, testing, and debugging. This module explores how agentic AI improves software development workflows.",
			title: "Agentic AI Developer Tools",
			points: ["Automates coding tasks","Enhances testing and debugging","Improves workflows","Supports developers"],
		},
		{
			name: "code-generation-agent",
			type: "content-two-card",
			script: "One common application is code generation agents that understand requirements and write code automatically. These agents analyze input, plan implementation steps, and generate code snippets or entire modules.",
			title: "Code Generation Agents",
			points: ["Understand requirements","Plan implementation steps","Generate code snippets","Automate coding"],
		},
		{
			name: "code-generation-example",
			type: "code",
			script: "This Python example simulates a simple code generation agent. Given a function description, it selects a template and fills in details, illustrating automated code writing.",
			title: "Simple Code Generation Example",
			code: "class CodeGenAgent:\n    def __init__(self):\n        self.templates = {\n            'add': 'def add(a, b):\\n    return a + b',\n            'multiply': 'def multiply(a, b):\\n    return a * b'\n        }\n\n    def generate(self, task):\n        return self.templates.get(task, '# Task not supported')\n\nagent = CodeGenAgent()\nprint(agent.generate('add'))",
			language: "python",
		},
		{
			name: "code-generation-explanation",
			type: "content-two-card",
			script: "The agent holds templates for common tasks. When given a task like 'add', it returns a pre-written function matching that description. This simple approach shows how agents can automate repetitive coding jobs.",
			title: "Explaining the Code Generation Agent",
			points: ["Stores code templates","Matches task to template","Returns corresponding code","Automates repetitive tasks"],
		},
		{
			name: "debugging-agent",
			type: "content-two-card",
			script: "Agentic AI can also assist with debugging by analyzing error messages and code context, then suggesting fixes. These agents help developers find and resolve issues faster and more accurately.",
			title: "Debugging Assistance with Agentic AI",
			points: ["Analyzes error messages","Understands code context","Suggests fixes","Speeds up bug resolution"],
		},
		{
			name: "debugging-agent-example",
			type: "code",
			script: "Here’s a basic Python debugging agent that takes an error message and code snippet, then suggests a fix based on predefined rules. It demonstrates how agents can interpret and respond to errors.",
			title: "Simple Debugging Agent Code",
			code: "class DebugAgent:\n    def suggest_fix(self, error_msg, code):\n        if 'NameError' in error_msg:\n            return 'Check variable names for typos.'\n        elif 'TypeError' in error_msg:\n            return 'Verify data types in operations.'\n        else:\n            return 'Further analysis needed.'\n\nagent = DebugAgent()\nerror = 'NameError: name x is not defined'\ncode_snippet = 'print(x)'\nprint(agent.suggest_fix(error, code_snippet))",
			language: "python",
		},
		{
			name: "debugging-agent-explanation",
			type: "content-two-card",
			script: "This agent looks for keywords in the error message and returns advice accordingly. It’s a simple rule-based approach, but it illustrates how agents automate problem-solving tasks to help developers quickly identify issues.",
			title: "Understanding the Debugging Agent",
			points: ["Checks error message keywords","Returns advice based on error type","Uses rule-based approach","Automates problem solving"],
		},
	]
};

export const module4Content: ModuleContent = {
	moduleNumber: 4,
	courseId: "agentic-ai-software-engineering",
	title: "Advanced Agentic AI Techniques in Software Engineering",
	subtitle: "Module 4: Deepening Agentic AI Capabilities",
	slides: [
		{
			name: "advanced-agentic-intro",
			type: "title",
			script: "Building more advanced agentic AI involves incorporating planning algorithms, reinforcement learning, and multi-agent cooperation. This module introduces these techniques and their role in software engineering.",
			title: "Advanced Agentic AI Techniques",
			points: ["Planning algorithms","Reinforcement learning","Multi-agent cooperation","Enhanced software engineering"],
		},
		{
			name: "planning-algorithms",
			type: "content-two-card",
			script: "Planning algorithms enable agents to map out sequences of actions to achieve complex goals. Instead of reactive responses, agents anticipate future states and make informed choices accordingly.",
			title: "Planning Algorithms",
			points: ["Map out action sequences","Achieve complex goals","Anticipate future states","Make informed choices"],
		},
		{
			name: "planning-code-example",
			type: "code",
			script: "Here is a simple Python example using a breadth-first search to plan steps from a start state to a goal state, illustrating basic planning in an agentic AI context.",
			title: "Planning Algorithm Example",
			code: "from collections import deque\n\ndef bfs(start, goal, neighbors):\n    queue = deque([(start, [start])])\n    visited = set()\n    while queue:\n        (state, path) = queue.popleft()\n        if state == goal:\n            return path\n        for next_state in neighbors(state):\n            if next_state not in visited:\n                visited.add(next_state)\n                queue.append((next_state, path + [next_state]))\n    return None\n\ndef neighbors(state):\n    return [state + 1, state * 2]\n\npath = bfs(1, 7, neighbors)\nprint(f\"Planned path: {path}\")",
			language: "python",
		},
		{
			name: "planning-code-explanation",
			type: "content-two-card",
			script: "This code performs a breadth-first search to find a path from a start number to a goal number using neighbor states. It demonstrates how agents can plan sequences of actions to reach objectives.",
			title: "Explaining Planning Code",
			points: ["Uses breadth-first search","Finds path from start to goal","Explores neighbor states","Plans action sequences"],
		},
		{
			name: "reinforcement-learning-intro",
			type: "content-two-card",
			script: "Reinforcement learning lets agents learn optimal behavior through trial and error by maximizing rewards. This approach helps agents improve without explicit instructions, key for complex software tasks.",
			title: "Reinforcement Learning",
			points: ["Learns through trial and error","Maximizes rewards","Improves without explicit instructions","Useful for complex tasks"],
		},
		{
			name: "rl-simple-code",
			type: "code",
			script: "This simplified Python example shows an agent learning to choose actions with higher rewards over iterations, illustrating basic reinforcement learning principles.",
			title: "Simple Reinforcement Learning Example",
			code: "import random\n\nclass RLAgent:\n    def __init__(self):\n        self.q_values = {0: 0, 1: 0}\n\n    def choose_action(self):\n        return max(self.q_values, key=self.q_values.get)\n\n    def learn(self, action, reward):\n        self.q_values[action] += 0.1 * (reward - self.q_values[action])\n\nagent = RLAgent()\nfor _ in range(10):\n    action = agent.choose_action()\n    reward = random.choice([1, 0])  # Random reward\n    agent.learn(action, reward)\n    print(f\"Action: {action}, Q-values: {agent.q_values}\")",
			language: "python",
		},
		{
			name: "rl-code-explanation",
			type: "content-two-card",
			script: "The agent tracks Q-values representing action quality. It chooses the best action and updates Q-values based on received rewards. Over time, the agent learns which actions yield higher rewards, improving performance.",
			title: "Understanding Reinforcement Learning Code",
			points: ["Tracks action Q-values","Chooses best action","Updates values from rewards","Learns to improve over time"],
		},
		{
			name: "multi-agent-systems",
			type: "content-two-card",
			script: "Multi-agent systems involve multiple agents working together or competing to solve problems. Cooperation among agents can accelerate software tasks like distributed debugging or collaborative code generation.",
			title: "Multi-Agent Cooperation",
			points: ["Multiple agents collaborate","Solve problems collectively","Accelerate complex tasks","Enable distributed workflows"],
		},
	]
};

export const module5Content: ModuleContent = {
	moduleNumber: 5,
	courseId: "agentic-ai-software-engineering",
	title: "Future and Ethical Considerations of Agentic AI",
	subtitle: "Module 5: Responsible Use and Impact",
	slides: [
		{
			name: "future-agentic-ai",
			type: "title",
			script: "Agentic AI continues evolving, promising smarter software development tools and autonomous systems. This final module discusses future trends, ethical challenges, and how developers can responsibly adopt agentic AI.",
			title: "The Future of Agentic AI",
			points: ["Evolving smarter tools","Autonomous software systems","Ethical challenges","Responsible adoption"],
		},
		{
			name: "ethical-challenges",
			type: "content-two-card",
			script: "As agents gain autonomy, concerns about accountability, bias, and transparency grow. Developers must ensure agentic AI systems are fair, explainable, and do not cause unintended harm.",
			title: "Ethical Challenges in Agentic AI",
			points: ["Accountability for agent actions","Preventing bias","Ensuring transparency","Avoiding unintended harm"],
		},
		{
			name: "responsible-adoption",
			type: "content-two-card",
			script: "Responsible adoption means integrating agentic AI with human oversight, thorough testing, and clear documentation. Combining AI strengths with human judgment creates trustworthy software engineering practices.",
			title: "Responsible Adoption Practices",
			points: ["Human oversight","Thorough testing","Clear documentation","Combine AI with human judgment"],
		},
		{
			name: "agentic-ai-limitations",
			type: "content-two-card",
			script: "Agentic AI is powerful but not perfect. It can make mistakes, misunderstand goals, or behave unpredictably. Recognizing these limitations helps developers design safer, more reliable systems.",
			title: "Limitations of Agentic AI",
			points: ["Can make mistakes","May misunderstand goals","Unpredictable behavior risks","Need for safety measures"],
		},
		{
			name: "closing-summary",
			type: "content-two-card",
			script: "Agentic AI is quietly reshaping software engineering by automating decision-making and empowering developers. Understanding its concepts, tools, and responsibilities prepares you to leverage agentic AI effectively and ethically.",
			title: "Course Summary",
			points: ["Automates decision-making","Empowers developers","Requires ethical responsibility","Leverage concepts and tools"],
		},
	]
};

export const allModules: ModuleContent[] = [
	module1Content,
	module2Content,
	module3Content,
	module4Content,
	module5Content
];