"""Capstone: FastAPI application for autonomous research assistant."""

import sys
from pathlib import Path

project_root = Path(__file__).parent.parent.parent
src_dir = project_root / "src"
if str(src_dir) not in sys.path:
    sys.path.insert(0, str(src_dir))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from agentic_core.models.schemas import AgentInvokeRequest, AgentInvokeResponse
from .pipeline import AutonomousResearchPipeline

app = FastAPI(title="Autonomous Research Assistant", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pipeline = AutonomousResearchPipeline()


@app.get("/health")
async def health():
    """Health check."""
    return {"status": "healthy", "service": "autonomous_research_assistant"}


@app.post("/v1/research", response_model=AgentInvokeResponse)
async def research(request: AgentInvokeRequest):
    """Execute autonomous research task."""
    try:
        result = await pipeline.execute_research(request.query, request.session_id)
        return AgentInvokeResponse(
            response=result["response"],
            tool_calls=result.get("tool_calls", []),
            metadata=result.get("metadata", {}),
            session_id=request.session_id,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
