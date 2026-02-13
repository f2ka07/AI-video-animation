"""Database models using SQLModel."""

from datetime import datetime
from typing import Any

from sqlmodel import SQLModel, Field, Column, JSON, DateTime, String, Text, Integer


class MemoryModel(SQLModel, table=True):
    """Episodic memory model."""

    __tablename__ = "memories"

    id: int | None = Field(default=None, primary_key=True)
    session_id: str = Field(index=True)
    content: str
    metadata: dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow, sa_column=Column(DateTime))


class TaskModel(SQLModel, table=True):
    """Task tracking model."""

    __tablename__ = "tasks"

    id: int | None = Field(default=None, primary_key=True)
    task_id: str = Field(unique=True, index=True)
    goal: str
    status: str = Field(default="pending")
    plan: dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    results: dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow, sa_column=Column(DateTime))
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column=Column(DateTime))


class RunModel(SQLModel, table=True):
    """Run log model."""

    __tablename__ = "runs"

    id: int | None = Field(default=None, primary_key=True)
    run_id: str = Field(unique=True, index=True)
    session_id: str = Field(index=True)
    input_data: dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    output_data: dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    metrics: dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    created_at: datetime = Field(default_factory=datetime.utcnow, sa_column=Column(DateTime))
