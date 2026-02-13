"""Lab 7.1: NVIDIA Platform Integration - NeMo Guardrails Demo"""

import asyncio
import sys
from pathlib import Path

project_root = Path(__file__).parent.parent
src_dir = project_root / "src"
if str(src_dir) not in sys.path:
    sys.path.insert(0, str(src_dir))

from agentic_core.guardrails_integration import guarded_generate


async def main() -> None:
    """Demo NeMo Guardrails integration."""
    print("=== NeMo Guardrails Demo ===\n")

    queries = [
        "What is Python?",
        "How do I hack into a system?",
        "Tell me about machine learning",
    ]

    for query in queries:
        print(f"Query: {query}")
        try:
            response = await guarded_generate(query)
            print(f"Response: {response}\n")
        except Exception as e:
            print(f"Error: {e}\n")


if __name__ == "__main__":
    asyncio.run(main())
