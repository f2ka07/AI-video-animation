"""Tool registry and execution helpers."""

from __future__ import annotations

from typing import Any, Callable
from pydantic import BaseModel


class Tool(BaseModel):
    """Tool definition with schema and handler."""

    name: str
    description: str
    parameters: dict[str, Any]
    handler: Callable[..., Any]


class ToolRegistry(BaseModel):
    """Registry for managing and executing tools."""

    tools: dict[str, Tool] = {}

    def register(self, tool: Tool) -> None:
        """Register a tool in the registry."""
        self.tools[tool.name] = tool

    def get(self, name: str) -> Tool:
        """Get a tool by name."""
        return self.tools[name]

    def to_openai_tools_schema(self) -> list[dict[str, Any]]:
        """Return tool schema list compatible with function-calling models."""
        out: list[dict[str, Any]] = []
        for tool in self.tools.values():
            out.append(
                {
                    "type": "function",
                    "function": {
                        "name": tool.name,
                        "description": tool.description,
                        "parameters": tool.parameters,
                    },
                }
            )
        return out
