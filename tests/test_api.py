import pytest
from httpx import AsyncClient
from backend.main import app


@pytest.mark.asyncio
async def test_health_check():
    """Test the health check endpoint"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/api/health")
    
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert data["status"] == "healthy"
    assert "version" in data


@pytest.mark.asyncio
async def test_query_endpoint():
    """Test the RAG query endpoint"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/api/query",
            json={
                "query": "What is RAG?",
                "history": []
            }
        )
    
    assert response.status_code == 200
    data = response.json()
    assert "response" in data
    assert "sources" in data
    assert isinstance(data["sources"], list)


@pytest.mark.asyncio
async def test_query_with_history():
    """Test query endpoint with conversation history"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/api/query",
            json={
                "query": "Tell me more",
                "history": [
                    {"role": "user", "content": "What is RAG?"},
                    {"role": "assistant", "content": "RAG is..."}
                ]
            }
        )
    
    assert response.status_code == 200
    data = response.json()
    assert "response" in data


@pytest.mark.asyncio
async def test_agent_endpoint_disabled():
    """Test agent endpoint when disabled"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/api/agent",
            json={"task": "Analyze the system"}
        )
    
    # Should return 403 when agent is disabled
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_invalid_query():
    """Test query endpoint with missing data"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/api/query",
            json={}
        )
    
    assert response.status_code == 422  # Validation error
