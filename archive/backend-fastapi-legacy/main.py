from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
import time
from collections import defaultdict
from dotenv import load_dotenv

from rag import RAGSystem
from agent import SimpleAgent

load_dotenv()

# Get allowed origins from environment
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS", 
    "http://localhost:3000,http://localhost:8000"
).split(",")

# Clean up origins (strip whitespace)
ALLOWED_ORIGINS = [origin.strip() for origin in ALLOWED_ORIGINS if origin.strip()]

app = FastAPI(
    title="AI Portfolio API",
    description="Backend API for AI/ML portfolio with RAG and agent capabilities",
    version="1.0.0"
)

# Rate limiting configuration
RATE_LIMIT_REQUESTS = int(os.getenv("RATE_LIMIT_REQUESTS", "60"))
RATE_LIMIT_WINDOW = int(os.getenv("RATE_LIMIT_WINDOW", "60"))  # seconds
rate_limit_store: Dict[str, List[float]] = defaultdict(list)

@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    """Simple rate limiting middleware"""
    client_ip = request.client.host if request.client else "unknown"
    current_time = time.time()
    
    # Clean old entries
    rate_limit_store[client_ip] = [
        t for t in rate_limit_store[client_ip] 
        if current_time - t < RATE_LIMIT_WINDOW
    ]
    
    # Check rate limit
    if len(rate_limit_store[client_ip]) >= RATE_LIMIT_REQUESTS:
        return JSONResponse(
            status_code=429,
            content={"error": "Too many requests. Please try again later."},
            headers={"Retry-After": str(RATE_LIMIT_WINDOW)}
        )
    
    # Record this request
    rate_limit_store[client_ip].append(current_time)
    
    response = await call_next(request)
    return response

@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    """Add security headers to all responses"""
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response

# CORS middleware with environment-based origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-CSRF-Token"],
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
