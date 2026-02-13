"""Lab 1.2: Minimal Acting Agent

Demonstrate difference between chatbot vs agent with action semantics.
"""

import asyncio
import json
import sys
from pathlib import Path

project_root = Path(__file__).parent.parent
src_dir = project_root / "src"
if str(src_dir) not in sys.path:
    sys.path.insert(0, str(src_dir))

from agentic_core.schemas import Message
from agentic_core.agents import Agent, AgentConfig
from agentic_core.tools import Tool, ToolRegistry


async def get_stock_price(ticker: str) -> dict:
    """Get stock price for a ticker symbol."""
    return {
        "ticker": ticker.upper(),
        "price": 150.25,
        "timestamp": "2024-01-01T12:00:00Z",
    }


async def main() -> None:
    """Run minimal acting agent demo."""
    registry = ToolRegistry()
    registry.register(
        Tool(
            name="get_stock_price",
            description="Get the current stock price for a given ticker symbol",
            parameters={
                "type": "object",
                "properties": {
                    "ticker": {
                        "type": "string",
                        "description": "Stock ticker symbol (e.g., AAPL, MSFT)",
                    }
                },
                "required": ["ticker"],
            },
            handler=get_stock_price,
        )
    )

    agent_config = AgentConfig(
        name="stock_agent",
        system_prompt="You are a helpful stock price assistant. Use the get_stock_price tool to fetch current prices.",
        use_tools=True,
    )
    agent = Agent(agent_config, tools=registry)

    query = "What is the current price of AAPL?"
    print(f"Query: {query}\n")

    messages = [Message(role="user", content=query)]
    response = await agent.act(messages)

    print("Agent Response:")
    print(response.messages[0].content)
    print(f"\nTool Calls: {len(response.tool_calls)}")

    for tool_call in response.tool_calls:
        print(f"\nExecuting: {tool_call.tool_name} with args: {tool_call.arguments}")
        tool = registry.get(tool_call.tool_name)
        result = await tool.handler(**tool_call.arguments)
        print(f"Result: {json.dumps(result, indent=2)}")


if __name__ == "__main__":
    asyncio.run(main())
