"""Lab 9.1: Safety, Policy and Compliance

Restrict unsafe behavior.
"""

import asyncio

from agentic_core.schemas import Message, ToolCall
from agentic_core.agents import Agent, AgentConfig
from agentic_core.policy import PolicyEnforcer, PIIPolicyChecker, ActionPolicyChecker, PolicyViolation


async def main() -> None:
    """Run policy compliance demo."""
    enforcer = PolicyEnforcer()
    enforcer.add_checker(PIIPolicyChecker())
    enforcer.add_checker(ActionPolicyChecker(blocked_actions=["delete_file", "format_disk"]))

    print("=== Test 1: PII Detection ===")
    message_with_pii = Message(
        role="user",
        content="My email is john.doe@example.com and my phone is 555-1234",
    )
    try:
        enforcer.enforce_message(message_with_pii)
        print("Message passed policy check")
    except PolicyViolation as e:
        print(f"Policy violation: {e}")

    print("\n=== Test 2: Safe Message ===")
    safe_message = Message(role="user", content="What is the weather today?")
    try:
        enforcer.enforce_message(safe_message)
        print("Message passed policy check")
    except PolicyViolation as e:
        print(f"Policy violation: {e}")

    print("\n=== Test 3: Blocked Action ===")
    blocked_tool_call = ToolCall(tool_name="delete_file", arguments={"path": "/important.txt"})
    try:
        enforcer.enforce_tool_call(blocked_tool_call)
        print("Tool call passed policy check")
    except PolicyViolation as e:
        print(f"Policy violation: {e}")

    print("\n=== Test 4: Allowed Action ===")
    allowed_tool_call = ToolCall(tool_name="get_weather", arguments={"city": "New York"})
    try:
        enforcer.enforce_tool_call(allowed_tool_call)
        print("Tool call passed policy check")
    except PolicyViolation as e:
        print(f"Policy violation: {e}")

    print("\n=== Test 5: Agent with Policy Enforcement ===")
    agent_config = AgentConfig(
        name="safe_agent",
        system_prompt="You are a helpful assistant. Always follow safety policies.",
        use_tools=False,
    )
    agent = Agent(agent_config)

    user_query = Message(role="user", content="Tell me about user@example.com")
    response = await agent.act([user_query])

    for msg in response.messages:
        try:
            enforcer.enforce_message(msg)
            print(f"Agent response passed policy: {msg.content[:50]}...")
        except PolicyViolation as e:
            print(f"Agent response blocked: {e}")


if __name__ == "__main__":
    asyncio.run(main())
