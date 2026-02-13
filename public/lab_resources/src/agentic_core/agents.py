"""Agent base classes and role-specific agents."""

from __future__ import annotations

import json
from typing import Any, Literal
from pydantic import BaseModel, Field

from .schemas import Message, AgentResponse, ToolCall
from .llm_client import run_chat
from .tools import ToolRegistry

AgentRole = Literal["researcher", "critic", "writer", "generic"]


class AgentConfig(BaseModel):
    """Configuration for an agent."""

    name: str
    role: AgentRole = "generic"
    system_prompt: str
    use_tools: bool = True
    max_turns: int = 8


class Agent:
    """Base agent abstraction."""

    def __init__(self, config: AgentConfig, tools: ToolRegistry | None = None) -> None:
        self.config = config
        self.tools = tools

    async def act(
        self,
        messages: list[Message],
        metadata: dict[str, Any] | None = None,
    ) -> AgentResponse:
        """Single reasoning + (optional) tool-call step."""
        sys_msg = Message(role="system", content=self.config.system_prompt)
        msgs = [sys_msg] + messages

        tools_spec: list[dict[str, Any]] | None = None
        if self.tools and self.config.use_tools:
            tools_spec = self.tools.to_openai_tools_schema()

        resp = await run_chat(
            role="tool" if self.config.use_tools else "planner",
            messages=msgs,
            tools=tools_spec,
        )

        msg = resp["choices"][0]["message"]
        tool_calls: list[ToolCall] = []

        if self.config.use_tools and msg.get("tool_calls"):
            for tc in msg["tool_calls"]:
                args = tc["function"].get("arguments", {})
                if isinstance(args, str):
                    args = json.loads(args)
                tool_calls.append(
                    ToolCall(
                        tool_name=tc["function"]["name"],
                        arguments=args,
                    )
                )

        return AgentResponse(
            messages=[Message(role="assistant", content=msg.get("content") or "")],
            tool_calls=tool_calls,
            metadata={"raw": resp, **(metadata or {})},
        )


class ResearcherAgent(Agent):
    """Agent specialized for research tasks."""

    pass


class CriticAgent(Agent):
    """Agent specialized for critical evaluation."""

    pass


class WriterAgent(Agent):
    """Agent specialized for writing and synthesis."""

    pass


class MultiAgentOrchestrator:
    """Very simple in-process coordinator for role agents."""

    def __init__(self, agents: dict[str, Agent] | None = None):
        """Initialize orchestrator with agents."""
        self.agents = agents or {}

    async def run_round(
        self,
        history: list[Message],
        order: list[str],
        metadata: dict[str, Any] | None = None,
    ) -> dict[str, AgentResponse]:
        """One round: each agent sees full history, appends its response."""
        responses: dict[str, AgentResponse] = {}
        msgs = list(history)

        for name in order:
            agent = self.agents[name]
            resp = await agent.act(msgs, metadata={"agent": name, **(metadata or {})})
            responses[name] = resp
            msgs.extend(resp.messages)

        return responses
