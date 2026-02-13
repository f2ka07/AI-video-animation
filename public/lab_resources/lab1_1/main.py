"""Lab 1.1: Environment Smoke Test

Verify the student environment can run inference, retrieve embeddings and store state without costs.
"""

import asyncio
import sys
from pathlib import Path

project_root = Path(__file__).parent.parent
src_dir = project_root / "src"
if str(src_dir) not in sys.path:
    sys.path.insert(0, str(src_dir))

from agentic_core.config import get_settings
from agentic_core.schemas import Message
from agentic_core.llm_client import run_chat
from agentic_core.embeddings import embed_text
from agentic_core.memory_store import MemoryStore


async def main() -> None:
    """Run environment smoke test."""
    settings = get_settings()
    print("Settings loaded. LLM provider:", settings.llm_provider)

    print("\n[1/3] Testing LLM inference...")
    msg = Message(role="user", content="Say 'OK' if you can read this.")
    try:
        resp = await run_chat("planner", [msg])
        text = resp["choices"][0]["message"]["content"]
        if "OK" in text.upper():
            print("LLM: OK")
        else:
            print(f"LLM: Unexpected response: {text[:50]}")
    except Exception as e:
        print(f"LLM: ERROR - {e}")

    print("\n[2/3] Testing embeddings...")
    try:
        embedding = embed_text("test text")
        if embedding and len(embedding) > 0:
            print(f"Embeddings: OK (dimension: {len(embedding)})")
        else:
            print("Embeddings: Failed")
    except Exception as e:
        print(f"Embeddings: ERROR - {e}")

    print("\n[3/3] Testing database...")
    try:
        store = MemoryStore()
        memory_id = store.add_memory("test_session", "test content")
        memories = store.get_memories("test_session", limit=1)
        if memories:
            print("DB: OK")
        else:
            print("DB: Failed")
    except Exception as e:
        print(f"DB: ERROR - {e}")

    print("\nEnvironment smoke test complete!")


if __name__ == "__main__":
    asyncio.run(main())
