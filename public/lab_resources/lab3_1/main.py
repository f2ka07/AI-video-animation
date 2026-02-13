"""Lab 3.1: Evaluation and Self-Repair

Introduce correctness loops.
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
from agentic_core.eval_pipeline import UnitTestEvaluator, SelfRepairPipeline


async def code_generation_agent(prompt: str) -> str:
    """Mock code generation agent."""
    from agentic_core.llm_client import run_chat

    system_prompt = (
        "You are a code generation assistant. Write ONLY the function definition, "
        "no example usage, no if __name__ blocks. Just the function code."
    )
    messages = [
        Message(role="system", content=system_prompt),
        Message(role="user", content=f"Write a Python function that: {prompt}"),
    ]
    response = await run_chat("tool", messages)
    return response["choices"][0]["message"]["content"]


def test_add_function(code: str) -> bool:
    """Test if the generated function works correctly."""
    try:
        code_clean = code.strip()
        if code_clean.startswith("```python"):
            code_clean = code_clean[9:]
        elif code_clean.startswith("```"):
            code_clean = code_clean[3:]
        if code_clean.endswith("```"):
            code_clean = code_clean[:-3]
        code_clean = code_clean.strip()

        namespace = {}
        exec(code_clean, namespace)

        if "add" not in namespace:
            return False

        add_func = namespace["add"]
        result = add_func(2, 3)
        return result == 5
    except Exception:
        return False


async def main() -> None:
    """Run evaluation and self-repair demo."""
    prompt = "takes two numbers and returns their sum. Function name should be 'add'"

    print("=== Initial Code Generation ===")
    initial_code = await code_generation_agent(prompt)
    print(f"Generated code:\n{initial_code}\n")

    evaluator = UnitTestEvaluator(test_add_function)
    eval_result = await evaluator.evaluate(initial_code)
    print(f"Initial evaluation: {'PASSED' if eval_result['passed'] else 'FAILED'}")
    print(f"Feedback: {eval_result['feedback']}\n")

    if not eval_result["passed"]:
        print("=== Self-Repair Loop ===")
        agent_config = AgentConfig(
            name="code_agent",
            system_prompt=(
                "You are a code generation agent. Generate ONLY the function definition. "
                "Do not include example usage or if __name__ blocks. Just the function code."
            ),
            use_tools=False,
        )
        agent = Agent(agent_config)

        pipeline = SelfRepairPipeline(agent, evaluator, max_repair_attempts=3)

        repair_prompt = (
            f"Write a Python function that: {prompt}. "
            "Return ONLY the function definition, no example usage, no if __name__ blocks."
        )
        messages = [Message(role="user", content=repair_prompt)]
        result = await pipeline.execute_with_repair(
            messages,
            evaluation_criteria={"test_function": test_add_function},
        )

        print(f"Repair attempts: {result['total_attempts']}")
        for attempt in result["attempts"]:
            print(f"\nAttempt {attempt['attempt']}:")
            print(f"  Evaluation: {'PASSED' if attempt['evaluation']['passed'] else 'FAILED'}")
            print(f"  Feedback: {attempt['evaluation']['feedback']}")

        if result["success"]:
            print("\nSelf-repair successful!")
            final_code = result["final_response"].messages[-1].content
            print(f"Final code:\n{final_code}")
        else:
            print("\nSelf-repair failed after all attempts")


if __name__ == "__main__":
    asyncio.run(main())
