"""Lab 10.3: Multimodal Agent Capabilities

Integrate multimodal models (text, vision, audio).
"""

import asyncio
from pathlib import Path

from agentic_core.schemas import Message
from agentic_core.agents import Agent, AgentConfig
from agentic_core.llm_client import run_chat


async def process_image(image_path: str) -> str:
    """Process image and return description (mock implementation)."""
    return "Image shows a sunset over mountains with a lake in the foreground."


async def process_audio(audio_path: str) -> str:
    """Process audio and return transcription (mock implementation)."""
    return "The weather today is sunny with a high of 75 degrees."


async def main() -> None:
    """Run multimodal demo."""
    print("=== Scenario 1: Vision Input ===")
    image_path = "sample_image.jpg"
    print(f"Processing image: {image_path}")

    image_description = await process_image(image_path)
    print(f"Image description: {image_description}\n")

    planner_prompt = f"Based on this image description: {image_description}. Create a plan for a photography trip."
    messages = [Message(role="user", content=planner_prompt)]
    response = await run_chat("planner", messages)
    plan = response["choices"][0]["message"]["content"]
    print("Generated plan:")
    print(plan)

    print("\n=== Scenario 2: Audio Input ===")
    audio_path = "sample_audio.wav"
    print(f"Processing audio: {audio_path}")

    transcription = await process_audio(audio_path)
    print(f"Transcription: {transcription}\n")

    agent_config = AgentConfig(
        name="multimodal_agent",
        system_prompt="You are a helpful assistant that can process text, images, and audio.",
        use_tools=False,
    )
    agent = Agent(agent_config)

    query = f"User said: {transcription}. What should I do?"
    messages = [Message(role="user", content=query)]
    response = await agent.act(messages)
    print("Agent response:")
    print(response.messages[0].content)

    print("\n=== Scenario 3: Combined Multimodal ===")
    combined_prompt = f"""
    I have:
    1. An image showing: {image_description}
    2. Audio saying: {transcription}

    How do these relate? What action should I take?
    """
    messages = [Message(role="user", content=combined_prompt)]
    response = await agent.act(messages)
    print("Combined analysis:")
    print(response.messages[0].content)


if __name__ == "__main__":
    asyncio.run(main())
