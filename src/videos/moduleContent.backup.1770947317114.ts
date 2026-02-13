// Auto-generated course content by AI Planner
// Course: Agentic AI Labs Mastery
// Generated: 2026-02-13T01:34:45.468Z

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
	courseId: string;  // Course this module belongs to (for audio/video paths)
	title: string;
	subtitle: string;
	slides: SlideContent[];
	videoCategory?: "standard" | "short"; // "short" = portrait 1080x1920, 5s per slide
}

export const module1Content: ModuleContent = {
	moduleNumber: 1,
	courseId: "agentic-ai-labs-mastery",
	title: "Environment Setup and Testing",
	subtitle: "Ensuring a Robust Foundation for Your AI Projects",
	slides: [
		{
			name: "intro-environment-smoke-test",
			type: "title",
			script: "In this module, we'll explore the crucial first step in AI development: setting up and testing your environment. This ensures everything is configured correctly, preventing future headaches. Think of it as laying a strong foundation before building a house.",
			title: "Introduction to Environment Setup",
			points: [],
		},
		{
			name: "importance-of-environment-setup",
			type: "content-two-card",
			script: "Setting up your environment correctly is vital. It ensures compatibility and prevents errors down the line. This process checks all components are working together seamlessly, much like a pre-flight checklist for pilots.",
			title: "Why Environment Setup Matters",
			points: ["Ensures compatibility","Prevents errors","Components work together"],
		},
		{
			name: "environment-smoke-test-overview",
			type: "content-two-card",
			script: "The Environment Smoke Test is a basic check to ensure all parts of your AI setup are operational. It verifies that your tools and libraries are installed correctly and can communicate with each other.",
			title: "Understanding Environment Smoke Test",
			points: ["Basic check for setup","Tools and libraries installation","Communication verification"],
		},
		{
			name: "smoke-test-code-example",
			type: "code",
			script: "Let's look at a simple smoke test script. This script checks if essential libraries like NumPy and TensorFlow are installed and functioning. If they are, it prints a confirmation message.",
			title: "Smoke Test Code Example",
			code: "import numpy as np\nimport tensorflow as tf\n\nprint('NumPy version:', np.__version__)\nprint('TensorFlow version:', tf.__version__)",
			language: "python",
		},
		{
			name: "code-explanation-smoke-test",
			type: "code-diagram",
			script: "The first line imports NumPy, a library for numerical operations. The second imports TensorFlow, used for machine learning. The print statements then confirm their versions, ensuring both are installed correctly.",
			title: "Line-by-Line Code Explanation",
			code: "import numpy as np\nimport tensorflow as tf\n\nprint('NumPy version:', np.__version__)\nprint('TensorFlow version:', tf.__version__)",
			language: "python",
		},
		{
			name: "common-pitfalls-environment-setup",
			type: "content-two-card",
			script: "Common mistakes in environment setup include missing dependencies and version mismatches. Always check documentation for version compatibility and ensure all required libraries are installed.",
			title: "Avoiding Common Pitfalls",
			points: ["Missing dependencies","Version mismatches","Check documentation"],
		},
		{
			name: "strategic-foundation-takeaway",
			type: "title",
			script: "A solid environment setup is the cornerstone of successful AI development. By ensuring all components work together from the start, you lay the groundwork for smooth progress. Think of it as setting the stage for your AI journey.",
			title: "Building a Solid Foundation",
			points: [],
		},
	]
};

export const module2Content: ModuleContent = {
	moduleNumber: 2,
	courseId: "agentic-ai-labs-mastery",
	title: "Creating a Minimal Acting Agent",
	subtitle: "Building the Simplest Intelligent Agent",
	slides: [
		{
			name: "intro-minimal-acting-agent",
			type: "title",
			script: "In this module, we'll construct a minimal acting agent. This is the simplest form of an AI agent that can perceive its environment and take actions. Imagine it as teaching a robot to react to basic commands.",
			title: "Introduction to Minimal Acting Agent",
			points: [],
		},
		{
			name: "concept-of-acting-agent",
			type: "content-two-card",
			script: "An acting agent perceives its environment through sensors and acts upon it with actuators. This basic capability allows it to interact with and alter its surroundings, much like a thermostat adjusting temperature.",
			title: "What is an Acting Agent?",
			points: ["Perceives environment","Acts with actuators","Interacts and alters surroundings"],
		},
		{
			name: "minimal-agent-code-example",
			type: "code",
			script: "Here's a simple code example of a minimal acting agent. It observes an input and makes a decision based on predefined rules. This demonstrates the basic decision-making capabilities of an agent.",
			title: "Minimal Acting Agent Code",
			code: "class MinimalAgent:\n    def __init__(self, threshold):\n        self.threshold = threshold\n\n    def act(self, input_value):\n        if input_value > self.threshold:\n            return 'Action: Increase'\n        else:\n            return 'Action: Decrease'",
			language: "python",
		},
		{
			name: "code-explanation-minimal-agent",
			type: "code-diagram",
			script: "The class MinimalAgent initializes with a threshold. The act method compares input_value to this threshold, returning 'Increase' or 'Decrease' based on the comparison, demonstrating simple decision logic.",
			title: "Line-by-Line Code Explanation",
			code: "class MinimalAgent:\n    def __init__(self, threshold):\n        self.threshold = threshold\n\n    def act(self, input_value):\n        if input_value > self.threshold:\n            return 'Action: Increase'\n        else:\n            return 'Action: Decrease'",
			language: "python",
		},
		{
			name: "common-pitfalls-acting-agent",
			type: "content-two-card",
			script: "A common mistake is setting inappropriate thresholds, leading to incorrect actions. Test various scenarios to determine the optimal threshold for your agent's environment.",
			title: "Avoiding Common Pitfalls",
			points: ["Inappropriate thresholds","Incorrect actions","Test various scenarios"],
		},
		{
			name: "strategic-agent-takeaway",
			type: "title",
			script: "Creating a minimal acting agent is a stepping stone in AI. It equips you with foundational skills in decision-making and interaction, forming the basis for more complex agents. It's like learning the alphabet before writing sentences.",
			title: "From Simple to Complex",
			points: [],
		},
	]
};

export const module3Content: ModuleContent = {
	moduleNumber: 3,
	courseId: "agentic-ai-labs-mastery",
	title: "Designing Tool Interfaces",
	subtitle: "Crafting Effective Interfaces for AI Tools",
	slides: [
		{
			name: "intro-tool-interface-design",
			type: "title",
			script: "This module focuses on designing interfaces for AI tools. A well-crafted interface ensures seamless interaction between the agent and its tools, similar to a user-friendly dashboard in a car.",
			title: "Introduction to Tool Interface Design",
			points: [],
		},
		{
			name: "importance-of-interface-design",
			type: "content-two-card",
			script: "Interface design is crucial as it dictates how effectively an agent can use its tools. A poorly designed interface can hinder performance, much like a cluttered control panel in an airplane.",
			title: "Why Interface Design Matters",
			points: ["Dictates tool usage","Affects agent performance","Poor design hinders"],
		},
		{
			name: "interface-design-code-example",
			type: "code",
			script: "Consider this code for a simple tool interface. It defines how an agent can access and utilize a tool, ensuring clear communication and functionality.",
			title: "Tool Interface Code Example",
			code: "class ToolInterface:\n    def __init__(self, tool_name):\n        self.tool_name = tool_name\n\n    def use_tool(self, command):\n        print(f'Using {self.tool_name} with command: {command}')",
			language: "python",
		},
		{
			name: "code-explanation-interface-design",
			type: "code-diagram",
			script: "The ToolInterface class initializes with a tool name. The use_tool method takes a command, printing a message that simulates tool usage, illustrating basic interface functionality.",
			title: "Line-by-Line Code Explanation",
			code: "class ToolInterface:\n    def __init__(self, tool_name):\n        self.tool_name = tool_name\n\n    def use_tool(self, command):\n        print(f'Using {self.tool_name} with command: {command}')",
			language: "python",
		},
		{
			name: "common-pitfalls-interface-design",
			type: "content-two-card",
			script: "A common mistake is overcomplicating interfaces, making them difficult to use. Aim for simplicity and clarity to enhance usability, ensuring that the interface serves its purpose effectively.",
			title: "Avoiding Common Pitfalls",
			points: ["Overcomplicating interfaces","Difficult to use","Aim for simplicity"],
		},
		{
			name: "strategic-interface-takeaway",
			type: "title",
			script: "Effective interface design is the bridge between an agent and its tools. By ensuring clarity and functionality, you empower the agent to perform optimally. It's like giving a pilot a clear flight path.",
			title: "Empowering Through Design",
			points: [],
		},
	]
};

export const module4Content: ModuleContent = {
	moduleNumber: 4,
	courseId: "agentic-ai-labs-mastery",
	title: "Evaluation and Self-Repair",
	subtitle: "Ensuring AI Reliability Through Continuous Improvement",
	slides: [
		{
			name: "intro-evaluation-self-repair",
			type: "title",
			script: "In this module, we'll explore how evaluation and self-repair enhance AI reliability. This process involves assessing performance and making necessary adjustments, akin to regular maintenance checks on a car.",
			title: "Introduction to Evaluation and Self-Repair",
			points: [],
		},
		{
			name: "importance-of-evaluation",
			type: "content-two-card",
			script: "Evaluation is critical for identifying areas of improvement. It ensures the AI system operates at peak performance, similar to how athletes review their performance to enhance skills.",
			title: "Why Evaluation Matters",
			points: ["Identifies improvement areas","Ensures peak performance","Review to enhance skills"],
		},
		{
			name: "self-repair-concept",
			type: "content-two-card",
			script: "Self-repair involves automatic detection and correction of errors within the AI system. This capability minimizes downtime and enhances reliability, much like a self-healing material that repairs itself.",
			title: "Understanding Self-Repair",
			points: ["Automatic error detection","Minimizes downtime","Enhances reliability"],
		},
		{
			name: "evaluation-code-example",
			type: "code",
			script: "Here's a code snippet demonstrating a basic evaluation function. This function checks the system's output against expected results, providing feedback on performance accuracy.",
			title: "Evaluation Code Example",
			code: "def evaluate_performance(actual, expected):\n    if actual == expected:\n        return 'Performance is optimal.'\n    else:\n        return 'Performance needs improvement.'",
			language: "python",
		},
		{
			name: "code-explanation-evaluation",
			type: "code-diagram",
			script: "The evaluate_performance function compares actual output to expected results. If they match, it confirms optimal performance; otherwise, it indicates a need for improvement, providing immediate feedback.",
			title: "Line-by-Line Code Explanation",
			code: "def evaluate_performance(actual, expected):\n    if actual == expected:\n        return 'Performance is optimal.'\n    else:\n        return 'Performance needs improvement.'",
			language: "python",
		},
		{
			name: "self-repair-code-example",
			type: "code",
			script: "Consider this self-repair function. It identifies errors and attempts to correct them, ensuring the system continues to function smoothly without manual intervention.",
			title: "Self-Repair Code Example",
			code: "def self_repair(system_state):\n    if system_state == 'error':\n        print('Attempting to repair...')\n        # Logic to repair\n        return 'System repaired'\n    return 'System operational'",
			language: "python",
		},
		{
			name: "code-explanation-self-repair",
			type: "code-diagram",
			script: "The self_repair function checks the system's state. If an error is detected, it attempts a repair, simulating a self-correcting mechanism that maintains system functionality.",
			title: "Line-by-Line Code Explanation",
			code: "def self_repair(system_state):\n    if system_state == 'error':\n        print('Attempting to repair...')\n        # Logic to repair\n        return 'System repaired'\n    return 'System operational'",
			language: "python",
		},
		{
			name: "common-pitfalls-evaluation",
			type: "content-two-card",
			script: "A common issue is relying solely on manual evaluations, which can be time-consuming. Implement automated checks to streamline the process and ensure continuous monitoring.",
			title: "Avoiding Common Pitfalls",
			points: ["Relying on manual evaluations","Time-consuming","Implement automated checks"],
		},
		{
			name: "strategic-evaluation-takeaway",
			type: "title",
			script: "Evaluation and self-repair are vital for maintaining AI integrity. By continuously assessing and adjusting, you ensure reliability and performance, much like tuning an instrument for perfect harmony.",
			title: "Continuous Improvement for Reliability",
			points: [],
		},
	]
};

export const allModules: ModuleContent[] = [
	module1Content,
	module2Content,
	module3Content,
	module4Content
];