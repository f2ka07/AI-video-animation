"""Lab 10.1: Human-In-The-Loop Oversight

Teach controlled autonomy.
"""

import asyncio

from agentic_core.schemas import Message
from agentic_core.agents import Agent, AgentConfig
from agentic_core.tools import Tool, ToolRegistry


async def send_email(to: str, subject: str, body: str) -> dict:
    """Send an email (requires approval)."""
    return {"status": "sent", "to": to, "subject": subject}


async def main() -> None:
    """Run HITL demo."""
    registry = ToolRegistry()
    registry.register(
        Tool(
            name="send_email",
            description="Send an email. Requires human approval for high-impact actions.",
            parameters={
                "type": "object",
                "properties": {
                    "to": {"type": "string"},
                    "subject": {"type": "string"},
                    "body": {"type": "string"},
                },
                "required": ["to", "subject", "body"],
            },
            handler=send_email,
        )
    )

    agent_config = AgentConfig(
        name="email_agent",
        system_prompt=(
            "You are an email assistant. When asked to send emails, "
            "use the send_email tool. Always wait for approval before sending."
        ),
        use_tools=True,
    )
    agent = Agent(agent_config, tools=registry)

    query = "Send an email to client@example.com with subject 'Important Update' and body 'Please review'"
    print(f"User request: {query}\n")

    messages = [Message(role="user", content=query)]
    response = await agent.act(messages)

    print("Agent response:")
    print(response.messages[0].content)

    pending_actions = []
    for tool_call in response.tool_calls:
        if tool_call.tool_name == "send_email":
            pending_actions.append(tool_call)

    if pending_actions:
        print("\n=== Pending Actions Requiring Approval ===")
        for action in pending_actions:
            print(f"\nAction: {action.tool_name}")
            print(f"Arguments: {action.arguments}")

            approval = input("\nApprove this action? (yes/no): ").lower().strip()

            if approval == "yes":
                print("Action approved. Executing...")
                tool = registry.get(action.tool_name)
                result = await tool.handler(**action.arguments)
                print(f"Result: {result}")
            else:
                print("Action rejected by user.")
                print("Agent will be notified of the rejection.")

            print(f"\nDecision logged: {approval}")


if __name__ == "__main__":
    asyncio.run(main())
