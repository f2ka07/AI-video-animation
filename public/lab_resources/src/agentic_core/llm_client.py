"""LLM client abstraction with provider support."""

import os
from typing import Any, Sequence

from litellm import acompletion

from .config import get_settings
from .schemas import Message

settings = get_settings()


async def _to_openai_messages(messages: Sequence[Message]) -> list[dict[str, Any]]:
    """Convert Message objects to OpenAI-compatible format."""
    return [msg.model_dump(exclude_none=True) for msg in messages]


async def run_chat(
    role: str,
    messages: Sequence[Message],
    tools: list[dict[str, Any]] | None = None,
    tool_choice: str | None = None,
    **kwargs: Any,
) -> dict[str, Any]:
    """
    Single LLM entrypoint. Role is logical role: planner | tool | critic | guardrails.
    Returns raw LiteLLM response dict.
    """
    provider = settings.llm_provider

    # Choose model per role
    if role == "planner":
        model = settings.llm_model_planner
    elif role == "critic":
        model = settings.llm_model_critic
    else:
        model = settings.llm_model_tool

    # Build model identifier based on provider
    if provider == "groq":
        # LiteLLM requires groq/ prefix for Groq models
        model_name = f"groq/{model}"
    elif provider == "together":
        model_name = f"together_ai/{model}"
    elif provider == "nim":
        # NIM uses custom base URL
        model_name = model
        if settings.nvidia_nim_base_url:
            os.environ["NVIDIA_NIM_BASE_URL"] = settings.nvidia_nim_base_url
        if settings.nvidia_nim_api_key:
            os.environ["NVIDIA_NIM_API_KEY"] = settings.nvidia_nim_api_key
    else:
        model_name = model

    # Provider-specific config happens via env vars; LiteLLM reads them.
    openai_messages = await _to_openai_messages(messages)

    # Set API keys from settings
    if provider == "groq" and settings.groq_api_key:
        os.environ["GROQ_API_KEY"] = settings.groq_api_key
    elif provider == "together" and settings.together_api_key:
        os.environ["TOGETHER_API_KEY"] = settings.together_api_key

    # Prepare request parameters
    request_params: dict[str, Any] = {
        "model": model_name,
        "messages": openai_messages,
        **kwargs,
    }

    # Only add tools if provided and not None
    if tools:
        request_params["tools"] = tools
        if tool_choice:
            request_params["tool_choice"] = tool_choice

    try:
        resp = await acompletion(**request_params)
        return resp
    except Exception as e:
        # Provide more context for debugging
        error_msg = str(e)
        if "400" in error_msg or "Bad Request" in error_msg:
            # Check if it's a tool calling issue
            if tools:
                raise ValueError(
                    f"Tool calling may not be supported for model {model_name}. "
                    f"Error: {error_msg}. "
                    f"Try using a model that supports function calling."
                ) from e
        raise
