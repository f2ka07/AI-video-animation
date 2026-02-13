"""Planning and task decomposition for agentic systems."""

from __future__ import annotations

import json
from typing import Any
from pydantic import BaseModel, Field

from .schemas import Message
from .llm_client import run_chat


class PlanStep(BaseModel):
    """Single step in a plan."""

    id: str
    description: str
    tool_name: str | None = None
    arguments: dict[str, Any] = Field(default_factory=dict)
    depends_on: list[str] = Field(default_factory=list)


class Plan(BaseModel):
    """Complete plan with goal and ordered steps."""

    goal: str
    steps: list[PlanStep]


class Planner:
    """Abstract planner interface."""

    async def create_plan(self, goal: str, context: list[Message] | None = None) -> Plan:
        """Create a new plan for the given goal."""
        raise NotImplementedError

    async def refine_plan(
        self,
        goal: str,
        current_plan: Plan,
        feedback: str,
        context: list[Message] | None = None,
    ) -> Plan:
        """Refine an existing plan based on feedback."""
        raise NotImplementedError


class LLMPlanner(Planner):
    """LLM-based planner using the 'planner' role model."""

    system_prompt = (
        "You are a planning agent. Break the user's goal into ordered steps. "
        "Each step should have a short ID, description, optional tool name, and arguments JSON. "
        "Return ONLY valid JSON (no markdown, no explanation) with this exact structure:\n"
        '{"goal": "the goal", "steps": [{"id": "step1", "description": "...", "tool_name": null, "arguments": {}, "depends_on": []}]}'
    )

    async def create_plan(self, goal: str, context: list[Message] | None = None) -> Plan:
        """Create a plan using LLM reasoning."""
        msgs: list[Message] = [
            Message(role="system", content=self.system_prompt),
            Message(role="user", content=f"Goal: {goal}"),
        ]
        if context:
            msgs = context + msgs

        resp = await run_chat("planner", msgs)
        content = resp["choices"][0]["message"]["content"]

        # Try to extract JSON from response
        data = self._parse_json_response(content)
        return Plan(**data)

    def _parse_json_response(self, content: str) -> dict:
        """Parse JSON from LLM response, handling markdown code blocks."""
        content = content.strip()
        if content.startswith("```json"):
            content = content[7:]
        elif content.startswith("```"):
            content = content[3:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()

        try:
            return json.loads(content)
        except json.JSONDecodeError:
            return {
                "goal": "Parsed from text response",
                "steps": [
                    {
                        "id": "step_1",
                        "description": content[:100] if content else "Plan generation",
                        "tool_name": None,
                        "arguments": {},
                        "depends_on": [],
                    }
                ],
            }

    async def refine_plan(
        self,
        goal: str,
        current_plan: Plan,
        feedback: str,
        context: list[Message] | None = None,
    ) -> Plan:
        """Refine a plan based on feedback."""
        msgs: list[Message] = [
            Message(role="system", content=self.system_prompt),
            Message(
                role="user",
                content=(
                    f"Goal: {goal}\n"
                    f"Current plan:\n{current_plan.model_dump_json(indent=2)}\n"
                    f"Feedback to incorporate:\n{feedback}"
                ),
            ),
        ]
        if context:
            msgs = context + msgs

        resp = await run_chat("planner", msgs)
        content = resp["choices"][0]["message"]["content"]
        data = self._parse_json_response(content)
        return Plan(**data)
