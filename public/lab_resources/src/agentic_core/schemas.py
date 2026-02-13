"""Core data schemas for agentic AI system."""

from typing import Any, Literal
from pydantic import BaseModel, Field

Role = Literal["system", "user", "assistant", "tool"]


class Message(BaseModel):
    """Chat message with role and content."""

    role: Role
    content: str
    name: str | None = None


class ToolParam(BaseModel):
    """Tool parameter definition."""

    name: str
    type: str
    description: str | None = None


class ToolSchema(BaseModel):
    """Tool schema for function calling."""

    name: str
    description: str | None = None
    parameters: dict[str, Any] = Field(default_factory=dict)


class ToolCall(BaseModel):
    """Tool call with name and arguments."""

    tool_name: str
    arguments: dict[str, Any]


class AgentResponse(BaseModel):
    """Agent response with messages, tool calls, and metadata."""

    messages: list[Message]
    tool_calls: list[ToolCall] = Field(default_factory=list)
    final_output: Any | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)
