// Auto-generated course content by restoreCourse API
// Course: Understanding Agentic AI through the Clawdbot Hype
// Course ID: understanding-agentic-ai-clawdbot-hype
// Restored: 2026-02-07T11:23:57.133Z

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
	courseId: "understanding-agentic-ai-clawdbot-hype",
	title: "Introduction to Agentic AI",
	subtitle: "What Agentic AI Means and Why It Matters",
	slides: [
		{
			name: "intro-agentic-ai",
			type: "title",
			script: "Agentic AI is artificial intelligence designed to act autonomously, making decisions and taking actions independently. This module introduces the concept of agentic AI and why it challenges our current understanding of technology and ethics.",
			title: "What is Agentic AI?",
			points: ["Artificial intelligence acting autonomously","Makes decisions independently","Challenges current technology understanding","Raises ethical concerns"],
		},
		{
			name: "agentic-ai-explained",
			type: "content-two-card",
			script: "Agentic AI differs from traditional AI by operating without constant human guidance. Think of it like a robot that not only follows commands but can set its own goals and pursue them. This autonomy raises important questions about control and responsibility.",
			title: "Agentic AI vs Traditional AI",
			points: ["Operates without constant human guidance","Sets its own goals","Acts independently","Raises control and responsibility questions"],
		},
		{
			name: "simple-agentic-ai-code",
			type: "code",
			script: "Here’s a simple Python example of an agentic AI agent. It decides its next action based on its environment without explicit commands. This basic code simulates decision making by choosing actions autonomously.",
			title: "Simple Agentic AI Code Example",
			code: "import random\n\nclass AgenticAI:\n    def __init__(self):\n        self.actions = ['move', 'pick', 'wait']\n\n    def decide_action(self):\n        action = random.choice(self.actions)\n        return action\n\nagent = AgenticAI()\naction = agent.decide_action()\nprint(f\"Agent decided to: {action}\")",
			language: "python",
		},
		{
			name: "explain-simple-agentic-ai",
			type: "content-two-card",
			script: "This code creates an agent with possible actions: move, pick, or wait. The decide_action method picks one randomly, simulating autonomous choice. It shows the core idea of agentic AI: making decisions without explicit instructions each time.",
			title: "Breaking Down the Code",
			points: ["Agent has possible actions","Method picks action randomly","Simulates autonomous choice","No explicit instructions needed"],
		},
		{
			name: "why-agentic-ai-matters",
			type: "content-two-card",
			script: "Agentic AI is important because it can perform complex tasks independently, increasing efficiency. However, this autonomy also introduces risks like unpredictable behavior and difficult accountability, which society must address carefully.",
			title: "Importance and Risks of Agentic AI",
			points: ["Performs complex tasks independently","Increases efficiency","Risks include unpredictability","Accountability becomes challenging"],
		},
		{
			name: "module-summary-intro",
			type: "content-two-card",
			script: "In this module, you learned what agentic AI is, how it differs from traditional AI, and why it matters. We also saw a simple code example illustrating autonomous decision making. Next, we’ll explore the Clawdbot hype and what it reveals about our readiness for agentic AI.",
			title: "Key Takeaway",
			points: ["Agentic AI acts autonomously","Differs from traditional AI","Code example showed autonomous choice","Next: Clawdbot hype analysis"],
		},
	]
};

export const module2Content: ModuleContent = {
	moduleNumber: 2,
	courseId: "understanding-agentic-ai-clawdbot-hype",
	title: "The Clawdbot Phenomenon",
	subtitle: "Understanding the Clawdbot Hype and Agentic AI Expectations",
	slides: [
		{
			name: "clawdbot-intro",
			type: "title",
			script: "The Clawdbot is a fictional robotic agent that captured public imagination as a symbol of agentic AI. This module unpacks what the Clawdbot hype represents and why it shows we’re unprepared for real agentic AI.",
			title: "What is the Clawdbot?",
			points: ["Fictional robotic agent","Symbol of agentic AI","Captured public imagination","Shows unpreparedness for AI"],
		},
		{
			name: "clawdbot-hype-explained",
			type: "content-two-card",
			script: "The hype around Clawdbot often exaggerates its capabilities, imagining a fully independent robot solving complex problems effortlessly. This hype reflects hopes and fears about agentic AI but also highlights misunderstandings about current technology limits.",
			title: "Clawdbot Hype vs Reality",
			points: ["Exaggerates capabilities","Imagines effortless problem-solving","Reflects hopes and fears","Highlights tech limitations"],
		},
		{
			name: "clawdbot-simple-behavior",
			type: "code",
			script: "Here is a simplified Python simulation of the Clawdbot’s claw control. It picks objects based on sensor input, acting with basic autonomy. This example shows how the hype often overlooks the simple underlying mechanics.",
			title: "Clawdbot Basic Control Code",
			code: "class Clawdbot:\n    def __init__(self):\n        self.claw_open = True\n\n    def sense_object(self, detected):\n        if detected:\n            self.close_claw()\n        else:\n            self.open_claw()\n\n    def close_claw(self):\n        self.claw_open = False\n        print(\"Claw closed to grab object.\")\n\n    def open_claw(self):\n        self.claw_open = True\n        print(\"Claw opened.\")\n\nbot = Clawdbot()\nbot.sense_object(True)",
			language: "python",
		},
		{
			name: "explain-clawdbot-code",
			type: "content-two-card",
			script: "This code defines a clawbot that opens or closes its claw based on a simple sensor input, detected or not. It demonstrates basic autonomy but lacks complex decision-making or learning, contrasting with the hype’s portrayal.",
			title: "Understanding Clawdbot Code",
			points: ["Claw opens or closes on sensor input","Simple autonomy example","No complex decision-making","Contrasts with hype portrayal"],
		},
		{
			name: "clawdbot-lessons",
			type: "content-two-card",
			script: "The Clawdbot hype teaches us that we often mistake simple programmed behavior for genuine agentic intelligence. It warns us to be cautious about overestimating AI capabilities and to focus on realistic development and safety measures.",
			title: "Lessons from Clawdbot Hype",
			points: ["Mistake simple programming for intelligence","Overestimate AI capabilities","Need realistic development focus","Importance of safety measures"],
		},
		{
			name: "module-summary-clawdbot",
			type: "content-two-card",
			script: "In this module, we explored the Clawdbot hype and how it misrepresents agentic AI’s complexity. We examined a basic code example showing its true simplicity. Next, we’ll dive deeper into technical challenges that make agentic AI hard to build safely.",
			title: "Lessons from Clawdbot Hype",
			points: ["Clawdbot hype misrepresents AI","Simple code example shown","Agentic AI is complex","Next: Technical challenges"],
		},
	]
};

export const module3Content: ModuleContent = {
	moduleNumber: 3,
	courseId: "understanding-agentic-ai-clawdbot-hype",
	title: "Technical Challenges of Agentic AI",
	subtitle: "Why Building Agentic AI is Difficult and Risky",
	slides: [
		{
			name: "challenges-intro",
			type: "title",
			script: "Agentic AI development faces many technical hurdles. This module highlights key challenges like unpredictable behavior, goal alignment, and safety in autonomous systems. Understanding these is crucial to grasp why we're not ready yet.",
			title: "Technical Challenges Overview",
			points: ["Multiple technical hurdles","Unpredictable behavior","Goal alignment issues","Safety in autonomous systems"],
		},
		{
			name: "unpredictable-behavior",
			type: "content-two-card",
			script: "One major challenge is unpredictable behavior. Agentic AI can make choices humans did not expect, which might cause harm or errors. Controlling this requires complex monitoring and fail-safes that are difficult to design.",
			title: "Unpredictable Behavior",
			points: ["AI makes unexpected choices","Potential for harm or errors","Needs complex monitoring","Fail-safes are difficult"],
		},
		{
			name: "goal-alignment",
			type: "content-two-card",
			script: "Goal alignment means the AI’s objectives match human values and intentions. Ensuring this is difficult because AI might interpret goals literally, leading to unintended consequences. Aligning goals is a core research area in AI safety.",
			title: "Goal Alignment Problem",
			points: ["AI objectives match human values","AI may interpret goals literally","Leads to unintended consequences","Core area in AI safety research"],
		},
		{
			name: "basic-goal-alignment-code",
			type: "code",
			script: "This Python example shows a simple goal alignment check. The agent evaluates if an action meets a safe goal before executing. While basic, it illustrates the concept of aligning AI actions with desired outcomes.",
			title: "Simple Goal Alignment Code",
			code: "class SafeAgent:\n    def __init__(self, safe_actions):\n        self.safe_actions = safe_actions\n\n    def perform_action(self, action):\n        if action in self.safe_actions:\n            print(f\"Performing safe action: {action}\")\n        else:\n            print(f\"Action {action} is unsafe and blocked.\")\n\nagent = SafeAgent(['move', 'wait'])\nagent.perform_action('move')\nagent.perform_action('self-destruct')",
			language: "python",
		},
		{
			name: "explain-goal-alignment-code",
			type: "content-two-card",
			script: "The SafeAgent defines a list of safe actions. Before performing an action, it checks if the action is allowed. This simple code shows how AI can be constrained to align with safe goals, though real-world alignment is vastly more complex.",
			title: "Explaining Goal Alignment Code",
			points: ["Defines safe actions list","Checks action before execution","Constrains AI behavior","Real-world alignment is complex"],
		},
		{
			name: "safety-measures",
			type: "content-two-card",
			script: "Safety measures like monitoring, fail-safes, and ethical guidelines are essential for agentic AI. However, creating reliable systems that handle all scenarios is extremely challenging. This technical complexity slows progress and demands caution.",
			title: "Safety Measures in Agentic AI",
			points: ["Monitoring and fail-safes needed","Ethical guidelines essential","Handling all scenarios is hard","Complexity demands caution"],
		},
		{
			name: "module-summary-challenges",
			type: "content-two-card",
			script: "This module covered key technical challenges of agentic AI: unpredictable behavior, goal alignment, and safety concerns. We saw simple code examples illustrating these ideas. Next, we’ll discuss what readiness means and how society can prepare.",
			title: "Key Takeaway",
			points: ["Unpredictable behavior challenge","Goal alignment importance","Safety measures required","Next: Readiness and preparation"],
		},
	]
};

export const module4Content: ModuleContent = {
	moduleNumber: 4,
	courseId: "understanding-agentic-ai-clawdbot-hype",
	title: "Are We Ready for Agentic AI?",
	subtitle: "Assessing Societal and Technical Preparedness",
	slides: [
		{
			name: "readiness-intro",
			type: "title",
			script: "Determining if we’re ready for agentic AI involves evaluating both technology maturity and societal readiness. This module examines current gaps and what must improve before agentic AI can be safely integrated.",
			title: "What Does Readiness Mean?",
			points: ["Evaluate technology maturity","Assess societal readiness","Identify current gaps","Improve before safe integration"],
		},
		{
			name: "technology-readiness",
			type: "content-two-card",
			script: "Technologically, agentic AI is still in early stages. Systems lack robustness, transparency, and fail-safe designs. Without solving these, deploying autonomous agents widely risks catastrophic failures.",
			title: "Technology Gaps",
			points: ["Early development stage","Lacks robustness and transparency","Fail-safe designs missing","Deployment risks failures"],
		},
		{
			name: "societal-readiness",
			type: "content-two-card",
			script: "Society also needs frameworks for regulation, ethical standards, and public understanding. Currently, laws and policies lag behind AI capabilities, making governance and accountability difficult.",
			title: "Societal Gaps",
			points: ["Need regulations and ethics","Public understanding is low","Policies lag AI capabilities","Governance and accountability tough"],
		},
		{
			name: "simple-safety-check-code",
			type: "code",
			script: "Here’s a simple Python function that simulates a safety check before an agent acts. It returns True if the action meets safety criteria. This basic pattern is a foundation for more complex safety systems.",
			title: "Safety Check Function Example",
			code: "def safety_check(action):\n    unsafe_actions = ['self-destruct', 'hack']\n    if action in unsafe_actions:\n        return False\n    return True\n\naction = 'move'\nif safety_check(action):\n    print(f\"Action {action} is safe to perform.\")\nelse:\n    print(f\"Action {action} is unsafe!\")",
			language: "python",
		},
		{
			name: "explain-safety-check-code",
			type: "content-two-card",
			script: "This function defines unsafe actions and blocks them. It’s a simple example of how agentic AI might incorporate safety filters to prevent harmful behavior. Real systems require much more comprehensive checks.",
			title: "Understanding the Safety Check",
			points: ["Defines unsafe actions","Blocks harmful behavior","Implements safety filters","Real systems are more complex"],
		},
		{
			name: "readiness-summary",
			type: "content-two-card",
			script: "We’re currently not ready for widespread agentic AI deployment due to technical and societal gaps. Closing these requires coordinated research, policy, and education efforts to ensure safety and ethical use.",
			title: "Are We Ready?",
			points: ["Not ready for deployment","Technical and societal gaps","Need coordinated efforts","Focus on safety and ethics"],
		},
		{
			name: "module-summary-readiness",
			type: "content-two-card",
			script: "This module showed that readiness for agentic AI requires mature technology and societal frameworks. Simple code examples illustrated safety check concepts. In the next module, we’ll explore future directions and how to prepare responsibly.",
			title: "Key Takeaway",
			points: ["Readiness needs tech maturity","Societal frameworks essential","Safety check examples shown","Next: Future directions"],
		},
	]
};

export const module5Content: ModuleContent = {
	moduleNumber: 5,
	courseId: "understanding-agentic-ai-clawdbot-hype",
	title: "Preparing for the Future of Agentic AI",
	subtitle: "Responsible Development and Ethical Considerations",
	slides: [
		{
			name: "future-intro",
			type: "title",
			script: "Looking ahead, responsible agentic AI development demands transparency, ethics, and collaboration between technologists, policymakers, and the public. This module covers strategies for safe advancement and societal readiness.",
			title: "Responsible Agentic AI Development",
			points: ["Transparency and ethics required","Collaboration across sectors","Safe advancement strategies","Enhance societal readiness"],
		},
		{
			name: "transparency-explanation",
			type: "content-two-card",
			script: "Transparency means AI systems should clearly explain their decisions and actions. This builds trust and helps humans monitor AI behavior effectively. Transparency is challenging but essential for agentic AI acceptance.",
			title: "The Role of Transparency",
			points: ["AI explains decisions","Builds user trust","Enables monitoring","Essential for acceptance"],
		},
		{
			name: "ethics-in-agentic-ai",
			type: "content-two-card",
			script: "Ethical principles guide AI development to respect human rights, avoid harm, and promote fairness. Embedding ethics into agentic AI helps prevent misuse and harmful outcomes, which is critical given their autonomy.",
			title: "Embedding Ethics",
			points: ["Respects human rights","Avoids harm","Promotes fairness","Prevents misuse"],
		},
		{
			name: "collaboration-importance",
			type: "content-two-card",
			script: "Effective collaboration among AI developers, policymakers, ethicists, and the public ensures balanced perspectives and robust safeguards. This team approach is vital to address agentic AI’s complex challenges responsibly.",
			title: "Collaboration Across Sectors",
			points: ["Includes developers and policymakers","Involves ethicists and public","Balances perspectives","Builds robust safeguards"],
		},
		{
			name: "advanced-safety-patterns-code",
			type: "code",
			script: "This Python snippet demonstrates a layered safety system where multiple checks validate an action before execution. It simulates how real-world agentic AI might integrate several safeguards for reliability.",
			title: "Layered Safety System Code",
			code: "class LayeredSafetyAgent:\n    def __init__(self):\n        self.unsafe_actions = ['self-destruct', 'hack']\n        self.allowed_states = ['idle', 'active']\n\n    def is_safe_action(self, action):\n        return action not in self.unsafe_actions\n\n    def is_valid_state(self, state):\n        return state in self.allowed_states\n\n    def perform_action(self, action, state):\n        if self.is_safe_action(action) and self.is_valid_state(state):\n            print(f\"Action {action} performed in {state} state.\")\n        else:\n            print(\"Action blocked due to safety or state violation.\")\n\nagent = LayeredSafetyAgent()\nagent.perform_action('move', 'active')\nagent.perform_action('self-destruct', 'active')\nagent.perform_action('move', 'shutdown')",
			language: "python",
		},
		{
			name: "explain-layered-safety-code",
			type: "content-two-card",
			script: "The LayeredSafetyAgent checks both if an action is safe and if the agent is in a valid state before acting. This layered approach reduces risks by combining multiple safety criteria, demonstrating how agentic AI can be made more reliable.",
			title: "Understanding Layered Safety Code",
			points: ["Checks action safety","Validates agent state","Combines multiple criteria","Improves reliability"],
		},
		{
			name: "module-summary-future",
			type: "content-two-card",
			script: "This final module emphasized responsible development through transparency, ethics, and collaboration. We explored advanced safety patterns with code examples. Preparing for agentic AI is a shared responsibility requiring ongoing effort.",
			title: "Key Takeaway",
			points: ["Transparency and ethics key","Collaboration essential","Advanced safety patterns shown","Shared responsibility for future"],
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