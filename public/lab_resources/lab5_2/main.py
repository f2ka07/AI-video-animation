"""Lab 5.2: Memory and State Persistence

Enable long-horizon reasoning.
"""

import asyncio
import sys
import uuid
from pathlib import Path

project_root = Path(__file__).parent.parent
src_dir = project_root / "src"
if str(src_dir) not in sys.path:
    sys.path.insert(0, str(src_dir))

from agentic_core.schemas import Message
from agentic_core.memory_store import MemoryStore
from agentic_core.planning import LLMPlanner


async def main() -> None:
    """Run memory demo."""
    store = MemoryStore()
    session_id = "demo_session"

    goal = "Plan a course and refine over 3 iterations"
    print(f"Goal: {goal}\n")

    unique_task_id = f"task_{uuid.uuid4().hex[:8]}"
    task_id = store.create_task(unique_task_id, goal)
    print(f"Created task: {task_id}")

    planner = LLMPlanner()
    plan = await planner.create_plan(goal)
    store.update_task(task_id, results={"initial_plan": plan.model_dump()})

    store.add_memory(
        session_id,
        f"Created plan for: {goal}",
        metadata={"task_id": task_id, "plan_steps": len(plan.steps)},
    )

    print("\nRetrieved memories:")
    memories = store.get_memories(session_id, limit=5)
    for mem in memories:
        print(f"- {mem['content']}")
        print(f"  Metadata: {mem['metadata']}")

    print("\n--- Iteration 2: Refining plan ---")
    feedback = "Add more detail to each step"
    refined_plan = await planner.refine_plan(goal, plan, feedback)
    store.update_task(task_id, results={"refined_plan": refined_plan.model_dump()})
    store.add_memory(
        session_id,
        "Refined plan based on feedback",
        metadata={"iteration": 2, "feedback": feedback},
    )

    print("\n--- Iteration 3: Final refinement ---")
    feedback2 = "Make steps more actionable"
    final_plan = await planner.refine_plan(goal, refined_plan, feedback2)
    store.update_task(task_id, status="completed", results={"final_plan": final_plan.model_dump()})
    store.add_memory(
        session_id,
        "Completed final plan refinement",
        metadata={"iteration": 3, "status": "completed"},
    )

    print("\nFinal task state:")
    task = store.get_task(task_id)
    if task:
        print(f"Status: {task['status']}")
        print(f"Created: {task['created_at']}")
        print(f"Updated: {task['updated_at']}")

    print("\nAll session memories:")
    all_memories = store.get_memories(session_id, limit=10)
    for mem in all_memories:
        print(f"- [{mem['created_at']}] {mem['content']}")


if __name__ == "__main__":
    asyncio.run(main())
