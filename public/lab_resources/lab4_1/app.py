"""Lab 4.1: Deployment and Streaming API Exposure

Convert agent from notebook to callable service.
"""

from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json

from agentic_core.schemas import Message
from agentic_core.agents import Agent, AgentConfig
from agentic_core.models.schemas import AgentInvokeRequest, AgentInvokeResponse

app = FastAPI(title="Agentic AI Agent Service", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

agent_config = AgentConfig(
    name="api_agent",
    system_prompt="You are a helpful AI assistant.",
    use_tools=False,
)
agent = Agent(agent_config)


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy"}


@app.post("/v1/agent/invoke", response_model=AgentInvokeResponse)
async def invoke_agent(request: AgentInvokeRequest):
    """Invoke agent with a query."""
    messages = [Message(role="user", content=request.query)]
    response = await agent.act(messages)

    return AgentInvokeResponse(
        response=response.messages[0].content,
        tool_calls=[tc.model_dump() for tc in response.tool_calls],
        metadata=response.metadata,
        session_id=request.session_id,
    )


@app.post("/v1/agent/stream")
async def stream_agent(request: AgentInvokeRequest):
    """Stream agent response using Server-Sent Events."""
    async def generate():
        messages = [Message(role="user", content=request.query)]
        response = await agent.act(messages)

        content = response.messages[0].content
        words = content.split()

        for i, word in enumerate(words):
            chunk = {
                "type": "token",
                "content": word + " ",
                "index": i,
            }
            yield f"data: {json.dumps(chunk)}\n\n"
            await asyncio.sleep(0.05)

        final = {
            "type": "done",
            "metadata": response.metadata,
        }
        yield f"data: {json.dumps(final)}\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")


if __name__ == "__main__":
    import uvicorn
    import sys

    use_reload = "--reload" in sys.argv and sys.platform != "win32"
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=use_reload,
        loop="asyncio" if sys.platform == "win32" else "auto",
    )
