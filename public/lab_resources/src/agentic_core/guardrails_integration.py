"""NeMo Guardrails integration wrapper."""

from pathlib import Path
from typing import Any

from .config import get_settings
from .llm_client import run_chat

settings = get_settings()

_rails = None


def build_rails(config_dir: str | Path | None = None):
    """Build NeMo Guardrails instance."""
    try:
        from nemoguardrails import LLMRails

        if config_dir is None:
            base_dir = Path(__file__).resolve().parent.parent
            config_dir = base_dir / "configs" / "guardrails"

        async def llm_wrapper(messages: list[dict], **kwargs):
            from .schemas import Message

            msg_objects = [Message(**msg) for msg in messages]
            response = await run_chat("guardrails", msg_objects, **kwargs)
            return response["choices"][0]["message"]["content"]

        rails = LLMRails(
            config_dir=str(config_dir),
            llm=llm_wrapper,
        )
        return rails
    except ImportError:
        return None


def get_rails():
    """Get or create NeMo Guardrails instance."""
    global _rails
    if _rails is None:
        _rails = build_rails()
    return _rails


async def guarded_generate(prompt: str) -> str:
    """Generate text with guardrails."""
    rails = get_rails()
    if rails is None:
        from .schemas import Message

        messages = [Message(role="user", content=prompt)]
        response = await run_chat("guardrails", messages)
        return response["choices"][0]["message"]["content"]

    result = rails.generate(prompt=prompt)
    return result.output if hasattr(result, "output") else str(result)
