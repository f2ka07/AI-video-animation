"""Lab 5.1: Planning and Task Decomposition

Implement planner that creates and executes subtasks.
"""

import asyncio
import sys
from pathlib import Path

project_root = Path(__file__).parent.parent
src_dir = project_root / "src"
if str(src_dir) not in sys.path:
    sys.path.insert(0, str(src_dir))

from agentic_core.schemas import Message
from agentic_core.planning import LLMPlanner, Plan


async def execute_plan_step(step, context: dict) -> dict:
    """Execute a single plan step (mock implementation)."""
    print(f"  Executing step {step.id}: {step.description}")
    if step.tool_name:
        print(f"    Tool: {step.tool_name}, Args: {step.arguments}")
    return {"step_id": step.id, "status": "completed", "result": f"Result of {step.id}"}


async def main() -> None:
    """Run planning demo."""
    planner = LLMPlanner()

    goal = "Create a 7-day fitness plan with shopping list and schedule"
    print(f"Goal: {goal}\n")

    print("Creating plan...")
    plan = await planner.create_plan(goal)
    print(f"\nPlan created with {len(plan.steps)} steps:")
    for i, step in enumerate(plan.steps, 1):
        print(f"{i}. [{step.id}] {step.description}")
        if step.depends_on:
            print(f"   Depends on: {', '.join(step.depends_on)}")

    print("\nExecuting plan...")
    context = {}
    results = {}
    for step in plan.steps:
        if step.depends_on:
            for dep_id in step.depends_on:
                if dep_id not in results:
                    print(f"  Error: Dependency {dep_id} not satisfied")
                    continue

        result = await execute_plan_step(step, context)
        results[step.id] = result
        context[step.id] = result

    print("\nPlan execution complete!")
    print(f"Completed {len(results)} steps")


if __name__ == "__main__":
    asyncio.run(main())
