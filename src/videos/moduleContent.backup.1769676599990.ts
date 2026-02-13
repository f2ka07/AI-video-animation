// Auto-generated course content by AI Planner
// Course: Understanding Agentic AI and the Clawdbot Phenomenon
// Generated: 2026-01-29T08:15:53.131Z

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
}

export const module1Content: ModuleContent = {
	moduleNumber: 1,
	courseId: "understanding-agentic-ai-and-clawdbot",
	title: "Introduction to Agentic AI and the Clawdbot",
	subtitle: "Module 1: Foundations of Agentic AI and the Clawdbot Phenomenon",
	slides: [
		{
			name: "module-intro",
			type: "title",
			script: "Welcome to this course on Agentic AI and the Clawdbot hype. We’ll explore what agentic AI means, why the Clawdbot has sparked intense interest, and why these developments show we're not fully prepared for autonomous AI systems.",
			title: "Introduction to Agentic AI and the Clawdbot",
			points: [],
		},
		{
			name: "what-is-agentic-ai",
			type: "content-two-card",
			script: "Agentic AI refers to artificial intelligence systems that can operate independently, make decisions, and pursue goals without human intervention. Think of them like autonomous agents or robots that act on their own accord, rather than just following fixed instructions.",
			title: "What is Agentic AI?",
			points: ["operate independently","make decisions","pursue goals without humans","autonomous agents or robots"],
		},
		{
			name: "why-agentic-ai-matters",
			type: "content-two-card",
			script: "Agentic AI matters because it changes how we interact with machines. Instead of just tools, these AI can perform complex tasks, adapt, and potentially act unpredictably. This raises important ethical and safety questions about control and responsibility.",
			title: "Why Agentic AI Matters",
			points: ["changes how we interact","perform complex tasks","adapt and act unpredictably","ethical and safety questions"],
		},
		{
			name: "intro-to-clawdbot",
			type: "content-two-card",
			script: "The Clawdbot is a recent AI-driven robot that gained hype for its ability to autonomously operate a claw machine. It uses agentic AI principles to perceive, decide, and act in real time, showcasing how close we are to practical autonomous systems.",
			title: "Introduction to Clawdbot",
			points: ["AI-driven robot","operate a claw machine autonomously","perceive, decide, and act","practical autonomous systems"],
		},
		{
			name: "clawdbot-hype-explained",
			type: "content-two-card",
			script: "The hype around Clawdbot comes from its impressive autonomy and decision-making. People are amazed it can pick prizes like a human with no direct control. But this hype also reveals our unpreparedness for agentic AI's broader impact.",
			title: "Why the Clawdbot Hype?",
			points: ["impressive autonomy","human-like decision-making","no direct control","reveals unpreparedness"],
		},
		{
			name: "basic-agentic-ai-code",
			type: "code",
			script: "Here’s a simple Python example of an agentic AI loop. The agent observes its environment, decides an action, and performs it. This cycle repeats, demonstrating autonomy at a basic level.",
			title: "Basic Agentic AI Loop in Python",
			points: [],
			code: "class SimpleAgent:\n    def __init__(self):\n        self.state = 0\n\n    def observe(self, environment):\n        return environment.get_state()\n\n    def decide(self, observation):\n        if observation > 5:\n            return 'act'\n        else:\n            return 'wait'\n\n    def act(self, action):\n        if action == 'act':\n            self.state += 1\n\n\nenvironment = type('Env', (object,), {'get_state': lambda self: 7})()\nagent = SimpleAgent()\nobs = agent.observe(environment)\naction = agent.decide(obs)\nagent.act(action)\nprint(f\"Agent state: {agent.state}\")",
			language: "python",
		},
		{
			name: "explain-basic-agentic-ai-code",
			type: "content-two-card",
			script: "This code defines a SimpleAgent class with observe, decide, and act methods. It checks the environment's state, decides whether to act or wait, and updates its internal state accordingly. This cycle models basic autonomous behavior.",
			title: "Explaining the Basic Agentic AI Code",
			points: ["SimpleAgent class methods","checks environment's state","decides to act or wait","updates internal state"],
		},
	]
};

export const module2Content: ModuleContent = {
	moduleNumber: 2,
	courseId: "understanding-agentic-ai-and-clawdbot",
	title: "How Clawdbot Works: Perception, Decision, and Action",
	subtitle: "Module 2: The Technical Mechanics Behind the Clawdbot",
	slides: [
		{
			name: "clawdbot-overview",
			type: "content-two-card",
			script: "The Clawdbot operates by perceiving its environment using cameras, processing that data to make decisions, and then controlling motors to act. Each step requires specialized AI techniques working together seamlessly.",
			title: "Clawdbot Operational Overview",
			points: ["perceiving environment with cameras","processing data to decide","controlling motors to act","AI techniques working together"],
		},
		{
			name: "clawdbot-perception",
			type: "content-two-card",
			script: "Clawdbot’s perception uses computer vision to recognize prizes inside the claw machine. It processes images to detect shapes, colors, and positions, enabling it to understand what it can try to grab.",
			title: "Clawdbot Perception with Computer Vision",
			points: ["uses computer vision","recognizes prizes","detects shapes, colors, positions","understands what to grab"],
		},
		{
			name: "clawdbot-perception-code",
			type: "code",
			script: "Here’s a simplified Python snippet using OpenCV to detect objects by color in an image. This is similar to how Clawdbot identifies prizes inside the claw machine.",
			title: "Object Detection Using OpenCV",
			points: [],
			code: "import cv2\nimport numpy as np\n\n# Load image\nimage = cv2.imread('claw_machine.jpg')\n\n# Convert to HSV color space\nhsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)\n\n# Define color range for prize detection\nlower_color = np.array([30, 150, 50])\nupper_color = np.array([85, 255, 255])\n\n# Create mask\nmask = cv2.inRange(hsv, lower_color, upper_color)\n\n# Find contours\ncontours, _ = cv2.findContours(mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)\n\nprint(f\"Detected {len(contours)} objects\")",
			language: "python",
		},
		{
			name: "explain-perception-code",
			type: "content-two-card",
			script: "This code loads an image and converts it to HSV color space, which helps isolate colors better than RGB. It then creates a mask for a color range and finds contours representing objects of that color, detecting possible prizes.",
			title: "Explaining the Perception Code",
			points: ["loads image and converts HSV","isolates colors better than RGB","creates mask for color range","finds contours as objects"],
		},
		{
			name: "clawdbot-decision-making",
			type: "content-two-card",
			script: "After perceiving objects, Clawdbot decides which prize to target. It uses decision algorithms weighing object size, position, and ease of grab. This maximizes success chances while minimizing effort.",
			title: "Clawdbot Decision-Making Process",
			points: ["decides which prize to target","weighs size, position, ease","maximizes success chances","minimizes effort"],
		},
		{
			name: "decision-making-code",
			type: "code",
			script: "This Python example simulates decision-making by scoring detected objects. The highest score determines the target prize, demonstrating a basic prioritization algorithm.",
			title: "Prize Selection Decision Algorithm",
			points: [],
			code: "objects = [\n    {'size': 10, 'distance': 5},\n    {'size': 7, 'distance': 3},\n    {'size': 12, 'distance': 8}\n]\n\ndef score(obj):\n    return obj['size'] / obj['distance']\n\nbest = max(objects, key=score)\nprint(f\"Selected prize with size {best['size']} and distance {best['distance']}\")",
			language: "python",
		},
		{
			name: "explain-decision-code",
			type: "content-two-card",
			script: "The code defines objects with size and distance attributes. The score function calculates the ratio to prioritize larger, closer items. The max function picks the object with the best score, simulating Clawdbot’s target choice.",
			title: "Explaining the Decision Code",
			points: ["objects have size and distance","score prioritizes large, close items","max selects best scored object","simulates target choice"],
		},
		{
			name: "clawdbot-action-control",
			type: "content-two-card",
			script: "Once a prize is chosen, Clawdbot controls motors to position the claw and attempt a grab. This requires precise timing and coordination between sensors and mechanical parts to succeed.",
			title: "Clawdbot Action and Motor Control",
			points: ["controls motors to position claw","attempts to grab prize","requires precise timing","coordinates sensors and mechanics"],
		},
		{
			name: "motor-control-code",
			type: "code",
			script: "Here is a simple code example controlling a motor’s position using Python. It simulates moving the claw to the X and Y coordinates for grabbing.",
			title: "Simulated Motor Control Code",
			points: [],
			code: "class Motor:\n    def __init__(self):\n        self.position = 0\n\n    def move_to(self, position):\n        print(f\"Moving from {self.position} to {position}\")\n        self.position = position\n\nx_motor = Motor()\ny_motor = Motor()\n\nx_target = 10\ny_target = 5\n\nx_motor.move_to(x_target)\ny_motor.move_to(y_target)",
			language: "python",
		},
		{
			name: "explain-motor-control-code",
			type: "content-two-card",
			script: "This Motor class simulates a motor that can move to a target position. We create two motors representing X and Y axes. The code moves each motor to the target coordinates, mimicking claw positioning.",
			title: "Explaining the Motor Control Code",
			points: ["Motor class simulates movement","two motors for X and Y axes","moves motors to target positions","mimics claw positioning"],
		},
	]
};

export const module3Content: ModuleContent = {
	moduleNumber: 3,
	courseId: "understanding-agentic-ai-and-clawdbot",
	title: "The Challenges and Risks of Agentic AI",
	subtitle: "Module 3: Understanding the Risks and Why We Are Not Ready",
	slides: [
		{
			name: "agentic-ai-challenges",
			type: "content-two-card",
			script: "Agentic AI presents challenges like unpredictability, ethical dilemmas, and control difficulties. Because these systems act autonomously, their behavior can be unexpected and hard to regulate.",
			title: "Challenges of Agentic AI",
			points: ["unpredictability","ethical dilemmas","control difficulties","hard to regulate"],
		},
		{
			name: "ethical-concerns",
			type: "content-two-card",
			script: "Ethical concerns include accountability for AI actions, potential harm, and bias in decision-making. If AI agents make harmful choices, assigning responsibility becomes complex.",
			title: "Ethical Concerns in Agentic AI",
			points: ["accountability for AI actions","potential harm","bias in decisions","complex responsibility"],
		},
		{
			name: "unpredictability-example-code",
			type: "code",
			script: "This Python example shows how a simple autonomous agent might behave unpredictably due to random decision-making, illustrating how even basic agents can surprise us.",
			title: "Unpredictable Behavior Example",
			points: [],
			code: "import random\n\nclass RandomAgent:\n    def decide(self):\n        return random.choice(['move_left', 'move_right', 'stay'])\n\nagent = RandomAgent()\nfor _ in range(5):\n    action = agent.decide()\n    print(f\"Agent action: {action}\")",
			language: "python",
		},
		{
			name: "explain-unpredictability-code",
			type: "content-two-card",
			script: "This RandomAgent decides its next action randomly from three options. This randomness can lead to unpredictable behavior, showing why controlling agentic AI can be difficult.",
			title: "Explaining the Unpredictability Code",
			points: ["RandomAgent chooses random actions","three possible movement options","behavior can be unpredictable","difficulty in control"],
		},
		{
			name: "technical-control-difficulties",
			type: "content-two-card",
			script: "Controlling agentic AI technically is tough because they learn and adapt. Static rules often fail, meaning we must design dynamic oversight and fail-safes to keep them aligned with human values.",
			title: "Technical Control Difficulties",
			points: ["AI learn and adapt","static rules often fail","need dynamic oversight","fail-safes for alignment"],
		},
		{
			name: "alignment-problem-code",
			type: "code",
			script: "Here’s a simple reinforcement learning example where an agent maximizes rewards but might learn harmful behaviors if not properly constrained, illustrating the alignment problem.",
			title: "Reinforcement Learning and Alignment",
			points: [],
			code: "import random\n\nclass RLAgent:\n    def __init__(self):\n        self.total_reward = 0\n\n    def act(self):\n        action = random.choice(['safe_action', 'risky_action'])\n        reward = 1 if action == 'safe_action' else 5\n        self.total_reward += reward\n        return action, reward\n\nagent = RLAgent()\nfor _ in range(3):\n    action, reward = agent.act()\n    print(f\"Action: {action}, Reward: {reward}\")\nprint(f\"Total reward: {agent.total_reward}\")",
			language: "python",
		},
		{
			name: "explain-alignment-code",
			type: "content-two-card",
			script: "This RLAgent chooses between safe and risky actions. Risky actions yield higher rewards but may cause harm. Without proper constraints, the agent might prefer risky choices, showing the alignment challenge.",
			title: "Explaining the Alignment Code",
			points: ["chooses safe or risky actions","risky gives higher reward","may cause harm","shows alignment challenge"],
		},
		{
			name: "summary-risks",
			type: "content-two-card",
			script: "In summary, agentic AI’s autonomy brings unpredictability, ethical issues, and control challenges. The Clawdbot hype highlights we lack sufficient frameworks to handle these risks responsibly.",
			title: "Summary of Agentic AI Risks",
			points: ["autonomy brings unpredictability","ethical issues arise","control challenges exist","lack sufficient frameworks"],
		},
	]
};

export const module4Content: ModuleContent = {
	moduleNumber: 4,
	courseId: "understanding-agentic-ai-and-clawdbot",
	title: "Preparing for Agentic AI: Best Practices and Future Directions",
	subtitle: "Module 4: How to Responsibly Develop and Manage Agentic AI",
	slides: [
		{
			name: "need-for-preparation",
			type: "content-two-card",
			script: "Preparing for agentic AI means developing technical, ethical, and policy frameworks. We need to ensure these systems benefit society while minimizing risks and unintended consequences.",
			title: "Why Preparation is Critical",
			points: ["develop technical frameworks","ethical and policy frameworks","benefit society","minimize risks and consequences"],
		},
		{
			name: "technical-safeguards",
			type: "content-two-card",
			script: "Technical safeguards include robust testing, simulation environments, and fail-safe mechanisms. These help detect issues early and prevent harmful behavior before deployment in real settings.",
			title: "Technical Safeguards for Agentic AI",
			points: ["robust testing","simulation environments","fail-safe mechanisms","prevent harmful behavior"],
		},
		{
			name: "fail-safe-code-example",
			type: "code",
			script: "This Python code shows a simple fail-safe wrapper that stops an agent’s action if it violates safety rules, demonstrating how we can enforce constraints programmatically.",
			title: "Fail-Safe Action Wrapper Code",
			points: [],
			code: "class SafeAgent:\n    def __init__(self, agent):\n        self.agent = agent\n\n    def safe_act(self):\n        action = self.agent.decide()\n        if action == 'unsafe':\n            print(\"Action blocked: unsafe\")\n            return None\n        else:\n            print(f\"Action allowed: {action}\")\n            return action\n\nclass ExampleAgent:\n    def decide(self):\n        return 'unsafe'\n\nagent = ExampleAgent()\nsafe_agent = SafeAgent(agent)\nsafe_agent.safe_act()",
			language: "python",
		},
		{
			name: "explain-fail-safe-code",
			type: "content-two-card",
			script: "The SafeAgent wraps another agent and checks its decided action. If the action is deemed unsafe, it blocks it. Otherwise, it allows the action. This method programmatically enforces safety constraints.",
			title: "Explaining the Fail-Safe Code",
			points: ["wraps another agent","checks decided action","blocks unsafe actions","enforces safety constraints"],
		},
		{
			name: "ethical-guidelines",
			type: "content-two-card",
			script: "Adopting clear ethical guidelines is essential. These include transparency, accountability, fairness, and respect for human values. They guide AI developers and users toward responsible agentic AI deployment.",
			title: "Ethical Guidelines for Agentic AI",
			points: ["transparency","accountability","fairness","respect human values"],
		},
		{
			name: "policy-and-regulation",
			type: "content-two-card",
			script: "Policymakers must create regulations that balance innovation with safety. Policies should require rigorous testing, data privacy protections, and mechanisms for human oversight of agentic AI systems.",
			title: "Policy and Regulation Needs",
			points: ["balance innovation and safety","require rigorous testing","data privacy protections","human oversight mechanisms"],
		},
		{
			name: "future-directions",
			type: "content-two-card",
			script: "Future progress lies in interdisciplinary collaboration, improved AI interpretability, and better alignment techniques. These advances will help us manage agentic AI responsibly as complexity grows.",
			title: "Future Directions in Agentic AI",
			points: ["interdisciplinary collaboration","improved AI interpretability","better alignment techniques","manage complexity responsibly"],
		},
		{
			name: "module-summary",
			type: "content-two-card",
			script: "In summary, preparing for agentic AI requires technical safeguards, ethical frameworks, strong policies, and ongoing research. This comprehensive approach will help us harness AI benefits while controlling risks effectively.",
			title: "Module Summary and Takeaways",
			points: ["technical safeguards needed","ethical frameworks essential","strong policies required","ongoing research important"],
		},
	]
};

export const module5Content: ModuleContent = {
	moduleNumber: 5,
	courseId: "understanding-agentic-ai-and-clawdbot",
	title: "Putting It All Together: Building a Simple Agentic AI Simulation",
	subtitle: "Module 5: Practical Implementation of an Agentic AI System",
	slides: [
		{
			name: "simulation-intro",
			type: "content-two-card",
			script: "Now we’ll build a simple agentic AI simulation combining perception, decision, and action. This hands-on example will reinforce how autonomous agents operate in real scenarios.",
			title: "Building an Agentic AI Simulation",
			points: ["combine perception, decision, action","hands-on example","reinforce autonomous operation","real scenarios"],
		},
		{
			name: "full-simulation-code",
			type: "code",
			script: "This Python code simulates an agent detecting colored objects, selecting a target based on size and distance, and moving a simulated claw to grab the prize.",
			title: "Complete Agentic AI Simulation Code",
			points: [],
			code: "import random\n\nclass Environment:\n    def __init__(self):\n        self.objects = [\n            {'color': 'red', 'size': 10, 'distance': 5},\n            {'color': 'blue', 'size': 7, 'distance': 3},\n            {'color': 'green', 'size': 12, 'distance': 8}\n        ]\n\n    def get_objects(self):\n        return self.objects\n\nclass Agent:\n    def perceive(self, environment):\n        return environment.get_objects()\n\n    def decide(self, objects):\n        def score(obj):\n            return obj['size'] / obj['distance']\n        return max(objects, key=score)\n\n    def act(self, target):\n        print(f\"Moving claw to {target['color']} object at distance {target['distance']}\")\n        print(\"Attempting to grab...\")\n        success = random.choice([True, False])\n        if success:\n            print(\"Grab successful!\")\n        else:\n            print(\"Grab failed.\")\n\n# Simulation run\nenv = Environment()\nagent = Agent()\n\nobjects = agent.perceive(env)\ntarget = agent.decide(objects)\nagent.act(target)",
			language: "python",
		},
		{
			name: "explain-full-simulation",
			type: "content-two-card",
			script: "The Environment holds objects with attributes. The Agent perceives these objects, decides which to target using a scoring function, and acts by moving the claw and attempting a grab with a success chance. This simulates agentic AI behavior.",
			title: "Explaining the Simulation Code",
			points: ["Environment holds objects","Agent perceives objects","decides target via scoring","acts with grab attempt"],
		},
		{
			name: "improving-simulation",
			type: "content-two-card",
			script: "To improve this simulation, we could add real sensor data, use machine learning for decision-making, and incorporate feedback loops for learning from successes and failures.",
			title: "Improving the Agentic AI Simulation",
			points: ["add real sensor data","machine learning decisions","feedback loops for learning","improve success rates"],
		},
		{
			name: "course-summary",
			type: "content-two-card",
			script: "This course covered the basics of agentic AI, the Clawdbot example, challenges and risks, preparation strategies, and a practical simulation. Together, these build a strong foundation for understanding autonomous AI systems.",
			title: "Course Summary",
			points: ["basics of agentic AI","Clawdbot example","challenges and risks","preparation strategies","practical simulation"],
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