"""Memory store for episodic memory and state persistence."""

from datetime import datetime
from typing import Any

from sqlalchemy import create_engine, Column, String, Text, DateTime, JSON, Integer
from sqlalchemy.orm import declarative_base, sessionmaker, Session

from .config import get_settings

settings = get_settings()

Base = declarative_base()


class Memory(Base):
    """Episodic memory entry."""

    __tablename__ = "memories"

    id = Column(Integer, primary_key=True, autoincrement=True)
    session_id = Column(String, nullable=False, index=True)
    content = Column(Text, nullable=False)
    meta_data = Column("metadata", JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)


class Task(Base):
    """Task tracking entry."""

    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, autoincrement=True)
    task_id = Column(String, unique=True, nullable=False, index=True)
    goal = Column(Text, nullable=False)
    status = Column(String, default="pending")
    plan = Column(JSON, default=dict)
    results = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Run(Base):
    """Run log entry."""

    __tablename__ = "runs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    run_id = Column(String, unique=True, nullable=False, index=True)
    session_id = Column(String, nullable=False, index=True)
    input_data = Column(JSON, default=dict)
    output_data = Column(JSON, default=dict)
    metrics = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)


class MemoryStore:
    """Interface for memory and state persistence."""

    def __init__(self, db_url: str | None = None):
        """Initialize memory store with database connection."""
        self.db_url = db_url or settings.db_url
        self.engine = create_engine(self.db_url, echo=False)
        Base.metadata.create_all(self.engine)
        self.SessionLocal = sessionmaker(bind=self.engine)

    def get_session(self) -> Session:
        """Get a database session."""
        return self.SessionLocal()

    def add_memory(
        self,
        session_id: str,
        content: str,
        metadata: dict[str, Any] | None = None,
    ) -> int:
        """Add a memory entry."""
        session = self.get_session()
        try:
            memory = Memory(
                session_id=session_id,
                content=content,
                meta_data=metadata or {},
            )
            session.add(memory)
            session.commit()
            return memory.id
        finally:
            session.close()

    def get_memories(
        self,
        session_id: str,
        limit: int = 10,
    ) -> list[dict[str, Any]]:
        """Retrieve memories for a session."""
        session = self.get_session()
        try:
            memories = (
                session.query(Memory)
                .filter(Memory.session_id == session_id)
                .order_by(Memory.created_at.desc())
                .limit(limit)
                .all()
            )
            return [
                {
                    "id": m.id,
                    "content": m.content,
                    "metadata": m.meta_data,
                    "created_at": m.created_at.isoformat(),
                }
                for m in memories
            ]
        finally:
            session.close()

    def create_task(
        self,
        task_id: str,
        goal: str,
        plan: dict[str, Any] | None = None,
    ) -> str:
        """Create a new task."""
        session = self.get_session()
        try:
            task = Task(
                task_id=task_id,
                goal=goal,
                plan=plan or {},
                status="pending",
            )
            session.add(task)
            session.commit()
            return task.task_id
        finally:
            session.close()

    def update_task(
        self,
        task_id: str,
        status: str | None = None,
        results: dict[str, Any] | None = None,
    ) -> None:
        """Update a task."""
        session = self.get_session()
        try:
            task = session.query(Task).filter(Task.task_id == task_id).first()
            if task:
                if status:
                    task.status = status
                if results:
                    task.results = results
                task.updated_at = datetime.utcnow()
                session.commit()
        finally:
            session.close()

    def get_task(self, task_id: str) -> dict[str, Any] | None:
        """Get a task by ID."""
        session = self.get_session()
        try:
            task = session.query(Task).filter(Task.task_id == task_id).first()
            if task:
                return {
                    "task_id": task.task_id,
                    "goal": task.goal,
                    "status": task.status,
                    "plan": task.plan,
                    "results": task.results,
                    "created_at": task.created_at.isoformat(),
                    "updated_at": task.updated_at.isoformat(),
                }
            return None
        finally:
            session.close()

    def log_run(
        self,
        run_id: str,
        session_id: str,
        input_data: dict[str, Any],
        output_data: dict[str, Any],
        metrics: dict[str, Any] | None = None,
    ) -> None:
        """Log a run."""
        session = self.get_session()
        try:
            run = Run(
                run_id=run_id,
                session_id=session_id,
                input_data=input_data,
                output_data=output_data,
                metrics=metrics or {},
            )
            session.add(run)
            session.commit()
        finally:
            session.close()
