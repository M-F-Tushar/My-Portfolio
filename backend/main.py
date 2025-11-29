from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
from dotenv import load_dotenv

from rag import RAGSystem
from agent import SimpleAgent

load_dotenv()

app = FastAPI(
    title="AI Portfolio API",
    description="Backend API for AI/ML portfolio with RAG and agent capabilities",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize systems
rag_system = RAGSystem()
agent = SimpleAgent()


class QueryRequest(BaseModel):
    query: str
    history: Optional[List[Dict[str, str]]] = []


class QueryResponse(BaseModel):
    response: str
    sources: List[Dict[str, str]]
    offline: bool = False


class AgentRequest(BaseModel):
    task: str


class AgentResponse(BaseModel):
    steps: List[Dict[str, Any]]
    status: str


@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "version": "1.0.0",
        "rag_enabled": rag_system.is_available(),
        "agent_enabled": os.getenv("AGENT_ENABLED", "false").lower() == "true"
    }


@app.post("/api/query", response_model=QueryResponse)
async def query_rag(request: QueryRequest):
    """
    RAG query endpoint
    
    Retrieves relevant documents and generates a response using LLM
    """
    try:
        result = await rag_system.query(
            query=request.query,
            history=request.history
        )
        
        return QueryResponse(
            response=result["response"],
            sources=result.get("sources", []),
            offline=result.get("offline", False)
        )
    except Exception as e:
        # Graceful fallback
        return QueryResponse(
            response=f"I encountered an error processing your query. Running in offline mode. Error: {str(e)}",
            sources=[],
            offline=True
        )


@app.post("/api/agent", response_model=AgentResponse)
async def run_agent(request: AgentRequest):
    """
    Agent execution endpoint
    
    Runs a multi-step agent task in a sandboxed environment
    """
    if os.getenv("AGENT_ENABLED", "false").lower() != "true":
        raise HTTPException(
            status_code=403,
            detail="Agent is disabled. Enable it in .env by setting AGENT_ENABLED=true"
        )
    
    try:
        result = await agent.execute(task=request.task)
        
        return AgentResponse(
            steps=result["steps"],
            status=result["status"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("BACKEND_PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
