"""Lab 2.1: Tool Interface Design and Function Schemas

Design and register external tools with argument schemas.
"""

import asyncio
import sys
from pathlib import Path
from typing import Any

project_root = Path(__file__).parent.parent
src_dir = project_root / "src"
if str(src_dir) not in sys.path:
    sys.path.insert(0, str(src_dir))

from agentic_core.schemas import Message
from agentic_core.agents import Agent, AgentConfig
from agentic_core.tools import Tool, ToolRegistry


async def lookup_travel_info(city: str, dates: str, budget: float) -> dict[str, Any]:
    """Lookup travel information."""
    return {
        "city": city,
        "dates": dates,
        "budget": budget,
        "hotels": ["Hotel A", "Hotel B"],
        "flights": ["Flight 1", "Flight 2"],
    }


def validate_tool_args(tool: Tool, arguments: dict[str, Any]) -> tuple[bool, str | None]:
    """Validate tool arguments against schema."""
    required = tool.parameters.get("required", [])
    properties = tool.parameters.get("properties", {})

    for field in required:
        if field not in arguments:
            return False, f"Missing required field: {field}"

    for field, value in arguments.items():
        if field in properties:
            expected_type = properties[field].get("type")
            if expected_type == "string" and not isinstance(value, str):
                return False, f"Field {field} must be string"
            elif expected_type == "number" and not isinstance(value, (int, float)):
                return False, f"Field {field} must be number"

    return True, None


async def main() -> None:
    """Run tool interface design demo."""
    registry = ToolRegistry()
    registry.register(
        Tool(
            name="lookup_travel_info",
            description="Lookup travel information for a city with dates and budget",
            parameters={
                "type": "object",
                "properties": {
                    "city": {"type": "string", "description": "City name"},
                    "dates": {"type": "string", "description": "Travel dates (YYYY-MM-DD format)"},
                    "budget": {"type": "number", "description": "Budget in USD"},
                },
                "required": ["city", "dates", "budget"],
            },
            handler=lookup_travel_info,
        )
    )

    agent_config = AgentConfig(
        name="travel_agent",
        system_prompt=(
            "You are a travel assistant. When users ask about travel, "
            "use the lookup_travel_info tool. Always ask for missing information."
        ),
        use_tools=True,
    )
    agent = Agent(agent_config, tools=registry)

    print("Test 1: Complete arguments")
    messages = [Message(role="user", content="Find travel info for Paris, dates 2024-06-01 to 2024-06-07, budget 2000")]
    response = await agent.act(messages)
    print(f"Response: {response.messages[0].content}")

    print("\nTest 2: Missing arguments")
    messages = [Message(role="user", content="Find travel info for Paris")]
    response = await agent.act(messages)
    print(f"Response: {response.messages[0].content}")

    for tool_call in response.tool_calls:
        tool = registry.get(tool_call.tool_name)
        is_valid, error = validate_tool_args(tool, tool_call.arguments)
        if is_valid:
            result = await tool.handler(**tool_call.arguments)
            print(f"Tool result: {result}")
        else:
            print(f"Validation failed: {error}")


if __name__ == "__main__":
    asyncio.run(main())
