"""Capstone: Integrated agent pipeline."""

import sys
from pathlib import Path
from typing import Any

project_root = Path(__file__).parent.parent.parent
src_dir = project_root / "src"
if str(src_dir) not in sys.path:
    sys.path.insert(0, str(src_dir))

from agentic_core.schemas import Message
from agentic_core.planning import LLMPlanner
from agentic_core.agents import Agent, AgentConfig, ResearcherAgent, CriticAgent, WriterAgent
from agentic_core.vectorstore import VectorStore
from agentic_core.memory_store import MemoryStore
from agentic_core.eval_pipeline import Evaluator
from agentic_core.policy import PolicyEnforcer, PIIPolicyChecker
from agentic_core.monitoring import log_agent_action


class AutonomousResearchPipeline:
    """Integrated pipeline for autonomous research."""

    def __init__(self):
        """Initialize pipeline components."""
        self.planner = LLMPlanner()
        self.vectorstore = VectorStore(collection_name="research")
        self.memory = MemoryStore()

        self.researcher = ResearcherAgent(
            AgentConfig(
                name="researcher",
                role="researcher",
                system_prompt="You are a research agent. Gather accurate information.",
                use_tools=False,
            )
        )
        self.critic = CriticAgent(
            AgentConfig(
                name="critic",
                role="critic",
                system_prompt="You are a critic. Verify information accuracy.",
                use_tools=False,
            )
        )
        self.writer = WriterAgent(
            AgentConfig(
                name="writer",
                role="writer",
                system_prompt="You are a writer. Synthesize information clearly.",
                use_tools=False,
            )
        )

        self.policy = PolicyEnforcer()
        self.policy.add_checker(PIIPolicyChecker())

    async def execute_research(self, query: str, session_id: str | None = None) -> dict[str, Any]:
        """Execute complete research pipeline."""
        session_id = session_id or "default"

        log_agent_action("pipeline", "research_started", {"query": query})

        plan = await self.planner.create_plan(f"Research and answer: {query}")

        rag_results = self.vectorstore.search(query, n_results=3)
        context = "\n".join([r["text"] for r in rag_results])

        research_messages = [
            Message(role="user", content=f"Research: {query}\n\nContext: {context}"),
        ]
        research_response = await self.researcher.act(research_messages)

        critic_messages = research_messages + research_response.messages
        critic_response = await self.critic.act(critic_messages)

        writer_messages = critic_messages + critic_response.messages
        writer_response = await self.writer.act(writer_messages)

        self.memory.add_memory(
            session_id,
            f"Research completed: {query}",
            metadata={"plan_steps": len(plan.steps)},
        )

        try:
            self.policy.enforce_message(writer_response.messages[0])
        except Exception as e:
            log_agent_action("pipeline", "policy_violation", {"error": str(e)})

        log_agent_action("pipeline", "research_completed", {"query": query})

        return {
            "response": writer_response.messages[0].content,
            "tool_calls": [],
            "metadata": {
                "plan": plan.model_dump(),
                "rag_results": len(rag_results),
                "steps_completed": len(plan.steps),
            },
        }
