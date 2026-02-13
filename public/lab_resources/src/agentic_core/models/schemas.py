"""API request/response schemas."""

from typing import Any
from pydantic import BaseModel, Field


class AgentInvokeRequest(BaseModel):
    """Request to invoke an agent."""

    query: str
    session_id: str | None = None
    context: list[dict[str, Any]] | None = None
    metadata: dict[str, Any] | None = None


class AgentInvokeResponse(BaseModel):
    """Response from agent invocation."""

    response: str
    tool_calls: list[dict[str, Any]] = Field(default_factory=list)
    metadata: dict[str, Any] = Field(default_factory=dict)
    session_id: str | None = None


class PlanRequest(BaseModel):
    """Request to create a plan."""

    goal: str
    context: list[dict[str, Any]] | None = None


class PlanResponse(BaseModel):
    """Response with a plan."""

    plan: dict[str, Any]
    goal: str


class EvaluationRequest(BaseModel):
    """Request for evaluation."""

    output: Any
    criteria: dict[str, Any]


class EvaluationResponse(BaseModel):
    """Response from evaluation."""

    passed: bool
    score: float
    feedback: str
    details: dict[str, Any] = Field(default_factory=dict)
