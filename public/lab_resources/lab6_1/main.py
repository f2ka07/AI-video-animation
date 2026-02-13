"""Lab 6.1: Retrieval-Augmented Generation (RAG)

Ground agent in external knowledge.
"""

import asyncio
import sys
from pathlib import Path

project_root = Path(__file__).parent.parent
src_dir = project_root / "src"
if str(src_dir) not in sys.path:
    sys.path.insert(0, str(src_dir))

from agentic_core.schemas import Message
from agentic_core.agents import Agent, AgentConfig
from agentic_core.vectorstore import VectorStore
from agentic_core.llm_client import run_chat


async def main() -> None:
    """Run RAG demo."""
    vs = VectorStore(collection_name="rag_demo")

    documents = [
        "Python is a high-level programming language known for its simplicity.",
        "Machine learning is a subset of artificial intelligence.",
        "Vector databases store embeddings for similarity search.",
    ]
    print("Indexing documents...")
    vs.add_texts(
        texts=documents,
        metadatas=[{"source": f"doc_{i}"} for i in range(len(documents))],
        ids=[f"doc_{i}" for i in range(len(documents))],
    )
    print(f"Indexed {len(documents)} documents\n")

    query = "What is Python?"
    print(f"Query: {query}\n")

    results = vs.search(query, n_results=2)
    print("Retrieved documents:")
    for i, result in enumerate(results, 1):
        print(f"{i}. {result['text']}")
        print(f"   Source: {result['metadata'].get('source', 'unknown')}\n")

    context = "\n".join([f"- {r['text']}" for r in results])
    augmented_prompt = f"""Answer the question using only the provided context.

Context:
{context}

Question: {query}

Answer:"""

    messages = [Message(role="user", content=augmented_prompt)]
    response = await run_chat("tool", messages)

    print("Generated Answer:")
    print(response["choices"][0]["message"]["content"])

    print("\nCitations:")
    for i, result in enumerate(results, 1):
        print(f"[{i}] {result['metadata'].get('source', 'unknown')}")


if __name__ == "__main__":
    asyncio.run(main())
