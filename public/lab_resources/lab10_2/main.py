"""Lab 10.2: Multi-Agent Collaboration

Show benefits of role specialization and message passing.
"""

import asyncio

from agentic_core.schemas import Message
from agentic_core.agents import Agent, AgentConfig, ResearcherAgent, CriticAgent, WriterAgent, MultiAgentOrchestrator


async def main() -> None:
    """Run multi-agent collaboration demo."""
    researcher = ResearcherAgent(
        AgentConfig(
            name="researcher",
            role="researcher",
            system_prompt="You are a researcher. Gather facts and information. Be thorough and accurate.",
            use_tools=False,
        )
    )

    critic = CriticAgent(
        AgentConfig(
            name="critic",
            role="critic",
            system_prompt="You are a critic. Check information for consistency, accuracy, and completeness. Reject bad info.",
            use_tools=False,
        )
    )

    writer = WriterAgent(
        AgentConfig(
            name="writer",
            role="writer",
            system_prompt="You are a writer. Synthesize information into clear, well-structured output.",
            use_tools=False,
        )
    )

    orchestrator = MultiAgentOrchestrator(
        agents={
            "researcher": researcher,
            "critic": critic,
            "writer": writer,
        }
    )

    query = "Research and write a summary about the benefits of exercise"
    print(f"Query: {query}\n")
    history = [Message(role="user", content=query)]

    print("Running multi-agent round...")
    responses = await orchestrator.run_round(
        history=history,
        order=["researcher", "critic", "writer"],
    )

    print("\n=== Researcher Response ===")
    print(responses["researcher"].messages[0].content)

    print("\n=== Critic Response ===")
    print(responses["critic"].messages[0].content)

    print("\n=== Writer Response ===")
    print(responses["writer"].messages[0].content)

    print("\nMulti-agent collaboration complete!")


if __name__ == "__main__":
    asyncio.run(main())
