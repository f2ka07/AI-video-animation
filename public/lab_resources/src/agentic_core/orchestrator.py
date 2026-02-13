"""Multi-agent orchestration and message loop coordination."""

from typing import Any

from .agents import Agent, MultiAgentOrchestrator
from .schemas import Message, AgentResponse
from .planning import Plan, PlanStep


class WorkflowOrchestrator:
    """Orchestrates multi-agent workflows with planning integration."""

    def __init__(self, agents: dict[str, Agent], planner=None):
        """Initialize orchestrator with agents and optional planner."""
        self.agents = agents
        self.planner = planner
        self.orchestrator = MultiAgentOrchestrator(agents=agents)

    async def execute_plan(
        self,
        plan: Plan,
        initial_context: list[Message] | None = None,
    ) -> dict[str, Any]:
        """Execute a plan using the available agents."""
        context = initial_context or []
        results = {}

        for step in plan.steps:
            if step.depends_on:
                for dep_id in step.depends_on:
                    if dep_id not in results:
                        raise ValueError(f"Dependency {dep_id} not found for step {step.id}")

            agent_name = self._select_agent_for_step(step)
            if agent_name not in self.agents:
                raise ValueError(f"Agent {agent_name} not found")

            agent = self.agents[agent_name]

            step_messages = list(context)
            step_messages.append(
                Message(
                    role="user",
                    content=f"Execute step: {step.description}\nTool: {step.tool_name}\nArguments: {step.arguments}",
                )
            )

            response = await agent.act(step_messages)

            results[step.id] = {
                "step": step,
                "response": response,
                "success": True,
            }

            context.extend(response.messages)

        return {
            "plan": plan,
            "results": results,
            "final_context": context,
        }

    def _select_agent_for_step(self, step: PlanStep) -> str:
        """Select appropriate agent for a plan step."""
        if self.agents:
            return list(self.agents.keys())[0]
        raise ValueError("No agents available")

    async def run_multi_agent_round(
        self,
        history: list[Message],
        agent_order: list[str],
        metadata: dict[str, Any] | None = None,
    ) -> dict[str, AgentResponse]:
        """Run a round of multi-agent interaction."""
        return await self.orchestrator.run_round(history, agent_order, metadata)
