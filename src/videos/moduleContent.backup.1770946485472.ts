// Auto-generated course content by AI Planner
// Course: Agentic AI Labs Deep Dive
// Generated: 2026-02-13T00:21:51.060Z

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
	courseId: "agentic-ai-labs-deep-dive",
	title: "Getting Started with Agentic AI Labs",
	subtitle: "Explore the Environment Smoke Test and Minimal Acting Agent",
	slides: [
		{
			name: "hook-intro-agentic-ai",
			type: "title",
			script: "Ever wonder how to test if your AI environment is ready or build a minimal acting agent? Let’s kick off with the first two labs in Agentic AI Labs. You’ll see how to validate your setup and create the simplest agent that takes actions. It’s all about setting a solid foundation!",
			title: "Kickstart Your Agentic AI Journey",
			points: [
				"Test your AI environment",
				"Build a minimal acting agent",
				"Set the foundation for agents"
			]
		},
		{
			name: "environment-smoke-test-overview",
			type: "content-two-card",
			script: "Lab 1.1 is all about the Environment Smoke Test. It’s a quick check to ensure your AI environment and dependencies are correctly set up. Think of it as a quick health check before diving deeper into agent building.",
			title: "Lab 1.1: Environment Smoke Test",
			points: [
				"Verify AI environment setup",
				"Check dependencies quickly",
				"Prevent early errors"
			]
		},
		{
			name: "environment-smoke-test-code",
			type: "code",
			script: "Here’s a snippet from Lab 1.1 that runs a simple environment check. Notice how it tries to initialize and perform a basic action. If this passes, you’re good to go!",
			title: "Smoke Test Code Snippet",
			language: "python"
		},
		{
			name: "explanation-environment-smoke-test",
			type: "content-single",
			script: "In this environment smoke test, we initialize the AI environment and execute a basic action. The code checks for errors during initialization and verifies that the environment responds correctly. This ensures that all dependencies are installed and functioning, providing a solid base for developing more complex agents.",
			title: "Understanding the Smoke Test",
			points: [
				"Initialize AI environment",
				"Execute basic action",
				"Verify environment response"
			]
		},
		{
			name: "minimal-acting-agent-intro",
			type: "content-two-card",
			script: "Moving on to Lab 1.2, the Minimal Acting Agent. This lab teaches you how to build an agent that performs the simplest possible action loop. It helps grasp the core mechanics of agents without any complexity.",
			title: "Lab 1.2: Minimal Acting Agent",
			points: [
				"Build basic acting agent",
				"Understand agent loop",
				"Focus on simple actions"
			]
		},
		{
			name: "minimal-acting-agent-code",
			type: "code",
			script: "Here’s a key snippet that shows the agent’s action loop. It just picks a constant action and executes it repeatedly. This simplicity helps us grasp how agents interact with environments.",
			title: "Minimal Agent Action Loop",
			language: "python"
		},
		{
			name: "explanation-minimal-acting-agent",
			type: "content-single",
			script: "The minimal acting agent repeatedly performs a simple action within the environment. The agent initializes, selects a constant action, and executes it in a loop. This basic structure helps beginners understand how agents operate and interact with environments, laying the groundwork for more advanced agent behaviors.",
			title: "Understanding the Minimal Agent",
			points: [
				"Initialize agent",
				"Select constant action",
				"Execute in loop"
			]
		},
		{
			name: "why-start-simple",
			type: "content-two-card",
			script: "Why start with these simple labs? Because before building complex AI agents, you need solid basics. These labs prevent wasting time debugging environment glitches or convoluted agent logic. It’s like learning to walk before you run.",
			title: "Why These Labs Matter",
			points: [
				"Avoid early bugs",
				"Grasp core agent concepts",
				"Build confidence moving forward"
			]
		},
		{
			name: "big-takeaway-agentic-ai-start",
			type: "content-two-card",
			script: "The big takeaway? Always verify your AI environment first, then build a minimal agent to understand the action loop. These first steps give you a rock-solid base for all the advanced labs ahead.",
			title: "The Big Takeaway",
			points: [
				"Test your environment first",
				"Build minimal acting agents",
				"Set up for success"
			]
		}
	]
};

export const module2Content: ModuleContent = {
	moduleNumber: 2,
	courseId: "agentic-ai-labs-deep-dive",
	title: "Exploring Agentic AI Labs 2.1 and 3.1: Intermediate Agent Concepts",
	subtitle: "Understand agent states, observations, and simple decision making",
	slides: [
		{
			name: "hook-intermediate-agent-concepts",
			type: "title",
			script: "Ready to level up? Labs 2.1 and 3.1 introduce key agent concepts like states, observations, and even simple decision making. We’ll break down what these mean and how the code brings them to life.",
			title: "Level Up Your Agent Skills",
			points: ["Agent states explained","Observations and inputs","Simple decision making"],
		},
		{
			name: "lab-2-1-overview",
			type: "content-two-card",
			script: "Lab 2.1 focuses on the agent’s internal state and how it updates based on observations. This is crucial because agents need memory or context to make smarter decisions rather than blind actions.",
			title: "Lab 2.1: Agent State Updates",
			points: ["Internal agent state","Update with observations","Enable context awareness"],
		},
		{
			name: "lab-2-1-code",
			type: "code",
			script: "Here’s a snippet from Lab 2.1 showing how the agent updates its state from observations. Notice the state dictionary that accumulates info over time.",
			title: "Agent State Update Code",
			code: "def update_state(state, observation):\n    state['last_obs'] = observation\n    state['steps'] += 1\n    return state",
			language: "python",
		},
		{
			name: "lab-3-1-overview",
			type: "content-two-card",
			script: "Lab 3.1 introduces simple decision making. The agent now uses its state and observations to choose actions dynamically, not just fixed moves. This is a big step towards intelligent behavior.",
			title: "Lab 3.1: Basic Decision Making",
			points: ["Dynamic action selection","Leverages agent state","Moves beyond fixed actions"],
		},
		{
			name: "lab-3-1-code",
			type: "code",
			script: "Here’s the decision logic snippet. The agent picks an action based on the current observation, like moving left if it sees an obstacle.",
			title: "Decision Making Code Snippet",
			code: "def decide_action(state, observation):\n    if observation == 'obstacle':\n        return 'move_right'\n    return 'move_forward'",
			language: "python",
		},
		{
			name: "why-intermediate-matters",
			type: "content-two-card",
			script: "Why should you care about these concepts? Because understanding state and decision making lets you build agents that react intelligently, not just blindly. This foundation is vital for all future agent complexity.",
			title: "Why This Matters",
			points: ["Build smarter agents","Use memory for decisions","Prepare for complex tasks"],
		},
		{
			name: "conclusion-intermediate-agent",
			type: "content-two-card",
			script: "To wrap up, Labs 2.1 and 3.1 show how agents keep track of context and make simple decisions. Master these, and you’re well on your way to creating truly agentic AI.",
			title: "What This Means for You",
			points: ["Agents need memory","Dynamic actions beat fixed","Foundation for intelligence"],
		},
	]
};

export const module3Content: ModuleContent = {
	moduleNumber: 3,
	courseId: "agentic-ai-labs-deep-dive",
	title: "Mastering Advanced Agent Skills: Labs 4.1 to 6.1",
	subtitle: "State management, action policies, and environment interaction",
	slides: [
		{
			name: "hook-advanced-agent-skills",
			type: "title",
			script: "You’ve got the basics down, now let’s tackle Labs 4.1 through 6.1. We’ll dive into advanced state management, smarter action policies, and deeper environment interactions. Ready to see how agents get really powerful?",
			title: "Unlock Advanced Agent Skills",
			points: ["Advanced state management","Smarter action policies","Improved environment interaction"],
		},
		{
			name: "lab-4-1-overview",
			type: "content-two-card",
			script: "Lab 4.1 focuses on managing complex agent states, including nested data and timers. This helps agents handle tasks over multiple steps and keep track of progress or delays.",
			title: "Lab 4.1: Complex State Management",
			points: ["Nested state structures","Timers and counters","Track multi-step tasks"],
		},
		{
			name: "lab-4-1-code",
			type: "code",
			script: "See this snippet where the agent manages a countdown timer within its state, useful for delaying actions or waiting periods.",
			title: "State Timer Code Snippet",
			code: "if 'timer' not in state:\n    state['timer'] = 5\nelse:\n    state['timer'] -= 1",
			language: "python",
		},
		{
			name: "lab-5-1-5-2-overview",
			type: "content-two-card",
			script: "Labs 5.1 and 5.2 introduce action policies — rules that guide the agent’s choices based on state and observation. Think of policies as the agent’s strategy to decide what to do next.",
			title: "Labs 5.1 & 5.2: Action Policies",
			points: ["Define agent strategies","Use state and observations","Guide action selection"],
		},
		{
			name: "lab-5-1-code",
			type: "code",
			script: "Here’s a policy function that picks an action based on a simple heuristic — if the path is clear, move forward; otherwise, turn.",
			title: "Action Policy Code Example",
			code: "def policy(state, obs):\n    if obs == 'clear_path':\n        return 'move_forward'\n    return 'turn_right'",
			language: "python",
		},
		{
			name: "lab-6-1-overview",
			type: "content-two-card",
			script: "Lab 6.1 expands environment interaction by letting agents query environment info and adapt actions accordingly. This interaction loop makes agents more responsive and effective.",
			title: "Lab 6.1: Environment Interaction",
			points: ["Query environment state","Adaptive actions","Responsive agents"],
		},
		{
			name: "lab-6-1-code",
			type: "code",
			script: "Check out this snippet where the agent queries environment sensors and adjusts its move based on detected obstacles.",
			title: "Environment Query Code",
			code: "sensors = env.get_sensors()\nif sensors['front'] == 'clear':\n    action = 'move_forward'\nelse:\n    action = 'turn_left'",
			language: "python",
		},
		{
			name: "advanced-skills-importance",
			type: "content-two-card",
			script: "Why get comfortable with these advanced skills? Because real-world agents deal with complex states and unpredictable environments. Mastering these labs means your agents can handle real challenges.",
			title: "Why These Skills Matter",
			points: ["Handle complex tasks","Make strategic decisions","Adapt to changing environments"],
		},
		{
			name: "conclusion-advanced-agent-skills",
			type: "content-two-card",
			script: "Labs 4.1 to 6.1 unlock your agent’s potential with smarter state handling, policies, and environment awareness. This is where your AI starts to feel truly agentic and effective.",
			title: "Where We Go From Here",
			points: ["Manage complex states","Use strategic policies","Interact intelligently"],
		},
	]
};

export const module4Content: ModuleContent = {
	moduleNumber: 4,
	courseId: "agentic-ai-labs-deep-dive",
	title: "Agentic AI Labs 7.1 to 9.1: Learning and Planning",
	subtitle: "Implementing learning loops, planning strategies, and goal-directed behavior",
	slides: [
		{
			name: "hook-learning-planning",
			type: "title",
			script: "Now it’s time to bring in learning and planning! Labs 7.1 to 9.1 focus on letting agents learn from experience and plan their actions to reach goals. This is where AI really starts to shine.",
			title: "Teach Your Agent to Learn and Plan",
			points: ["Learning from experience","Planning strategies","Goal-directed behavior"],
		},
		{
			name: "lab-7-1-overview",
			type: "content-two-card",
			script: "Lab 7.1 introduces learning loops — agents update their knowledge or policies based on feedback from the environment. It’s like trial and error but automated.",
			title: "Lab 7.1: Learning Loops",
			points: ["Update policies dynamically","Use environment feedback","Automate trial and error"],
		},
		{
			name: "lab-7-1-code",
			type: "code",
			script: "Here’s a learning snippet where the agent updates a simple value estimate based on a reward received after an action.",
			title: "Learning Update Code",
			code: "value_estimate += learning_rate * (reward - value_estimate)",
			language: "python",
		},
		{
			name: "lab-8-1-overview",
			type: "content-two-card",
			script: "Lab 8.1 adds planning. Agents now simulate future steps internally to pick the best action sequence. Planning lets agents anticipate outcomes rather than just react.",
			title: "Lab 8.1: Planning Strategies",
			points: ["Simulate future steps","Evaluate action sequences","Anticipate outcomes"],
		},
		{
			name: "lab-8-1-code",
			type: "code",
			script: "This snippet shows a simple planning loop where the agent evaluates possible next actions and picks the highest-scoring one.",
			title: "Planning Loop Code",
			code: "best_score = -float('inf')\nbest_action = None\nfor action in possible_actions:\n    score = simulate(action)\n    if score > best_score:\n        best_score = score\n        best_action = action",
			language: "python",
		},
		{
			name: "lab-9-1-overview",
			type: "content-two-card",
			script: "Lab 9.1 focuses on goal-directed behavior — agents set and pursue goals using both learned knowledge and planning. This combines everything learned so far into purposeful action.",
			title: "Lab 9.1: Goal-Directed Agents",
			points: ["Set clear goals","Use learning and planning","Pursue purposeful action"],
		},
		{
			name: "lab-9-1-code",
			type: "code",
			script: "Here’s code that shows how an agent updates its goal and chooses actions to minimize distance to that goal.",
			title: "Goal Pursuit Code",
			code: "if distance_to_goal > threshold:\n    action = planner.plan_towards(goal)\nelse:\n    action = 'idle'",
			language: "python",
		},
		{
			name: "why-learn-plan-goal",
			type: "content-two-card",
			script: "Why integrate learning, planning, and goal-setting? Because this lets agents move from reactive machines to intelligent beings that improve and act with purpose. It’s a game changer.",
			title: "Why it Changes the Game",
			points: ["Agents improve over time","Plan ahead effectively","Act with clear purpose"],
		},
		{
			name: "conclusion-learning-planning",
			type: "content-two-card",
			script: "Wrapping up, Labs 7.1 to 9.1 empower your agent with learning, planning, and goals. Mastering these makes your AI truly agentic and ready for complex real-world tasks.",
			title: "The Power of Learning and Planning",
			points: ["Learn from experience","Plan future actions","Pursue goals effectively"],
		},
	]
};

export const module5Content: ModuleContent = {
	moduleNumber: 5,
	courseId: "agentic-ai-labs-deep-dive",
	title: "Final Labs and Capstone: Mastery of Agentic AI",
	subtitle: "Integrating everything with labs 10.1 to 10.3 and the Capstone project",
	slides: [
		{
			name: "hook-final-labs-capstone",
			type: "title",
			script: "You’ve come a long way! Now let’s conquer the final labs, 10.1 to 10.3, and the Capstone. These bring everything together—complex agents, multi-goal management, and real-world challenges. Let’s see how it all fits.",
			title: "Bringing It All Together",
			points: ["Complex agent integration","Multi-goal management","Real-world challenges"],
		},
		{
			name: "lab-10-1-overview",
			type: "content-two-card",
			script: "Lab 10.1 focuses on multi-goal agents—agents that juggle several objectives and prioritize them smartly. This is critical for real-world scenarios where agents can’t just chase one goal.",
			title: "Lab 10.1: Multi-Goal Agents",
			points: ["Manage multiple goals","Prioritize effectively","Handle goal conflicts"],
		},
		{
			name: "lab-10-1-code",
			type: "code",
			script: "Here’s how the agent ranks goals by priority and picks the highest priority goal to pursue next.",
			title: "Goal Prioritization Code",
			code: "goals = [{'name': 'A', 'priority': 2}, {'name': 'B', 'priority': 5}]\ngoals.sort(key=lambda g: g['priority'], reverse=True)\ncurrent_goal = goals[0]",
			language: "python",
		},
		{
			name: "lab-10-2-10-3-overview",
			type: "content-two-card",
			script: "Labs 10.2 and 10.3 add robustness and adaptability. Agents learn to recover from failures, adjust plans, and optimize goal achievement under constraints.",
			title: "Labs 10.2 & 10.3: Robustness and Adaptability",
			points: ["Failure recovery","Plan adjustment","Optimize goals"],
		},
		{
			name: "lab-10-2-code",
			type: "code",
			script: "This snippet shows the agent checking for failure and triggering a replanning process to adapt.",
			title: "Failure Recovery Code",
			code: "if env.failed:\n    plan = replanner.replan(state)",
			language: "python",
		},
		{
			name: "capstone-overview",
			type: "content-two-card",
			script: "The Capstone project ties everything together. You build an agent that integrates all learned skills, handles complex environments, and achieves multi-goal objectives. It’s your ultimate test and showcase.",
			title: "Capstone Project Overview",
			points: ["Integrate all skills","Handle complex environments","Achieve multi-goal success"],
		},
		{
			name: "capstone-code",
			type: "code",
			script: "Here’s a glimpse of the Capstone’s main loop where the agent continuously updates state, selects goals, plans, acts, and learns.",
			title: "Capstone Main Loop Code",
			code: "while True:\n    state = agent.update_state(env.observe())\n    goal = agent.select_goal(state)\n    plan = agent.plan(goal)\n    action = plan.next()\n    env.step(action)\n    agent.learn(env.feedback())",
			language: "python",
		},
		{
			name: "final-thoughts",
			type: "content-two-card",
			script: "Why finish with these labs and the Capstone? Because mastery means integration. Separately these skills are powerful; together they create agents ready for the toughest AI challenges.",
			title: "Why Mastery Matters",
			points: ["Integrate diverse skills","Build resilient agents","Prepare for real AI tasks"],
		},
		{
			name: "final-big-takeaway",
			type: "content-two-card",
			script: "The big takeaway? The Agentic AI Labs guide you step-by-step from environment checks to building complex, adaptable agents. Master them, and you’re ready to push AI boundaries in the real world.",
			title: "Your Agentic AI Journey Complete",
			points: ["Stepwise skill building","From simple to complex","Agents ready for real world"],
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