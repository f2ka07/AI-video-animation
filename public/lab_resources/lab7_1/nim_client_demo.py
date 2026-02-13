"""Lab 7.1: NVIDIA Platform Integration - NIM Client Demo"""

import asyncio
import os
import sys
from pathlib import Path

project_root = Path(__file__).parent.parent
src_dir = project_root / "src"
if str(src_dir) not in sys.path:
    sys.path.insert(0, str(src_dir))

from agentic_core.schemas import Message
from agentic_core.llm_client import run_chat


async def main() -> None:
    """Demo NIM client integration."""
    print("=== NVIDIA NIM Client Demo ===\n")

    if not os.getenv("NVIDIA_NIM_BASE_URL"):
        print("NVIDIA NIM not configured. Set NVIDIA_NIM_BASE_URL and NVIDIA_NIM_API_KEY in .env")
        return

    os.environ["LLM_PROVIDER"] = "nim"

    query = "Explain what NVIDIA NIM is"
    messages = [Message(role="user", content=query)]

    print(f"Query: {query}\n")
    print("Calling NIM endpoint...")

    try:
        response = await run_chat("tool", messages)
        print(f"Response: {response['choices'][0]['message']['content']}")
    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    asyncio.run(main())
