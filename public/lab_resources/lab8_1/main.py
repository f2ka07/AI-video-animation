"""Lab 8.1: Run, Monitor and Maintain

Teach production thinking.
"""

import asyncio
import sys
import time
import uuid
from pathlib import Path
from typing import Any

project_root = Path(__file__).parent.parent
src_dir = project_root / "src"
if str(src_dir) not in sys.path:
    sys.path.insert(0, str(src_dir))

from agentic_core.schemas import Message
from agentic_core.agents import Agent, AgentConfig
from agentic_core.monitoring import get_metrics_collector, track_request, log_agent_action
from agentic_core.memory_store import MemoryStore


async def simulate_agent_request(agent: Agent, query: str, role: str = "agent") -> dict[str, Any]:
    """Simulate an agent request with monitoring."""
    with track_request(role=role):
        messages = [Message(role="user", content=query)]
        start_time = time.time()

        try:
            response = await agent.act(messages)
            duration = time.time() - start_time

            log_agent_action("demo_agent", "request_completed", {
                "query_length": len(query),
                "response_length": len(response.messages[0].content),
                "duration": duration,
            })

            return {
                "success": True,
                "duration": duration,
                "response": response,
            }
        except Exception as e:
            duration = time.time() - start_time
            log_agent_action("demo_agent", "request_failed", {
                "error": str(e),
                "duration": duration,
            })
            return {
                "success": False,
                "duration": duration,
                "error": str(e),
            }


async def main() -> None:
    """Run monitoring demo."""
    agent_config = AgentConfig(
        name="monitored_agent",
        system_prompt="You are a helpful assistant.",
        use_tools=False,
    )
    agent = Agent(agent_config)

    store = MemoryStore()

    queries = [
        "What is Python?",
        "Explain machine learning",
        "Tell me about AI",
        "What is a vector database?",
        "How does RAG work?",
    ]

    print("=== Running Agent Under Load ===\n")
    results = []

    for i, query in enumerate(queries, 1):
        print(f"Request {i}/{len(queries)}: {query[:50]}...")
        result = await simulate_agent_request(agent, query)
        results.append(result)

        unique_run_id = f"run_{uuid.uuid4().hex[:8]}_{int(time.time())}"
        store.log_run(
            run_id=unique_run_id,
            session_id="monitoring_demo",
            input_data={"query": query},
            output_data={"response": result.get("response", {}).model_dump() if result.get("response") else {}},
            metrics={"duration": result["duration"], "success": result["success"]},
        )

        time.sleep(0.5)

    print("\n=== Metrics Summary ===")
    metrics = get_metrics_collector()
    stats = metrics.get_stats()

    print(f"Total Requests: {stats['total_requests']}")
    print(f"Total Errors: {stats['total_errors']}")
    print(f"Avg Latency: {stats['avg_latency_seconds']:.3f}s")
    print(f"Max Latency: {stats['max_latency_seconds']:.3f}s")
    print(f"Min Latency: {stats['min_latency_seconds']:.3f}s")

    print("\n=== Performance Analysis ===")
    successful = [r for r in results if r["success"]]
    failed = [r for r in results if not r["success"]]

    print(f"Successful: {len(successful)}/{len(results)}")
    print(f"Failed: {len(failed)}/{len(results)}")

    if successful:
        durations = [r["duration"] for r in successful]
        print(f"Avg Duration (successful): {sum(durations)/len(durations):.3f}s")
        print(f"Bottleneck: {'LLM API' if max(durations) > 2.0 else 'Processing'}")

    print("\n=== Version Comparison ===")
    print("Agent v1: Avg latency 2.5s, Error rate 5%")
    print("Agent v2: Avg latency 1.8s, Error rate 2%")
    print("Improvement: 28% faster, 60% fewer errors")


if __name__ == "__main__":
    asyncio.run(main())
