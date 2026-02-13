"""Evaluation pipeline with self-repair and feedback integration."""

from typing import Any, Callable

from .schemas import Message, AgentResponse
from .agents import Agent


class Evaluator:
    """Evaluates agent outputs against criteria."""

    async def evaluate(
        self,
        output: Any,
        criteria: dict[str, Any],
    ) -> dict[str, Any]:
        """Evaluate output against criteria."""
        return {
            "passed": True,
            "score": 1.0,
            "feedback": "Evaluation complete",
            "details": {},
        }


class UnitTestEvaluator(Evaluator):
    """Evaluator using unit tests."""

    def __init__(self, test_function: Callable[[Any], bool]):
        """Initialize with a test function."""
        self.test_function = test_function

    async def evaluate(
        self,
        output: Any,
        criteria: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        """Run unit test on output."""
        try:
            result = self.test_function(output)
            return {
                "passed": result,
                "score": 1.0 if result else 0.0,
                "feedback": "Test passed" if result else "Test failed",
                "details": {"test_result": result},
            }
        except Exception as e:
            return {
                "passed": False,
                "score": 0.0,
                "feedback": f"Test error: {str(e)}",
                "details": {"error": str(e)},
            }


class SelfRepairPipeline:
    """Pipeline for self-repair with evaluation feedback."""

    def __init__(
        self,
        agent: Agent,
        evaluator: Evaluator,
        max_repair_attempts: int = 3,
    ):
        """Initialize self-repair pipeline."""
        self.agent = agent
        self.evaluator = evaluator
        self.max_repair_attempts = max_repair_attempts

    async def execute_with_repair(
        self,
        initial_messages: list[Message],
        evaluation_criteria: dict[str, Any],
    ) -> dict[str, Any]:
        """Execute agent task with self-repair loop."""
        messages = list(initial_messages)
        attempts = []

        for attempt_num in range(self.max_repair_attempts):
            response = await self.agent.act(messages)

            eval_result = await self.evaluator.evaluate(
                response.final_output or response.messages[-1].content,
                evaluation_criteria,
            )

            attempts.append(
                {
                    "attempt": attempt_num + 1,
                    "response": response,
                    "evaluation": eval_result,
                }
            )

            if eval_result.get("passed", False):
                return {
                    "success": True,
                    "final_response": response,
                    "attempts": attempts,
                    "total_attempts": attempt_num + 1,
                }

            if attempt_num < self.max_repair_attempts - 1:
                repair_message = Message(
                    role="user",
                    content=f"Previous attempt failed evaluation. Feedback: {eval_result.get('feedback', 'No feedback')}. Please fix and try again.",
                )
                messages.append(repair_message)
                messages.extend(response.messages)

        return {
            "success": False,
            "final_response": attempts[-1]["response"],
            "attempts": attempts,
            "total_attempts": self.max_repair_attempts,
        }
