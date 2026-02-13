"""Lab 7.1: NVIDIA Platform Integration

Demonstrates NVIDIA platform components:
- NeMo Guardrails (safety/compliance)
- NIM client (model-serving microservice)
"""

import asyncio
import sys
from pathlib import Path

project_root = Path(__file__).parent.parent
src_dir = project_root / "src"
if str(src_dir) not in sys.path:
    sys.path.insert(0, str(src_dir))

lab_dir = Path(__file__).parent
if str(lab_dir) not in sys.path:
    sys.path.insert(0, str(lab_dir))

from guardrails_demo import main as guardrails_main
from nim_client_demo import main as nim_main


async def run_all_demos() -> None:
    """Run all demos in sequence."""
    print("=" * 60)
    print("Lab 7.1: NVIDIA Platform Integration")
    print("=" * 60)
    print()

    print("\n" + "=" * 60)
    await guardrails_main()

    print("\n" + "=" * 60)
    await nim_main()

    print("\n" + "=" * 60)
    print("All demos completed!")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(run_all_demos())
