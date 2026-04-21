import pytest
import numpy as np
from backend.rag import RAGSystem, LLMClient


@pytest.fixture
def rag_system():
    """Fixture to create RAG system instance"""
    return RAGSystem()


@pytest.fixture
def llm_client():
    """Fixture to create LLM client instance"""
    return LLMClient()


def test_rag_system_initialization(rag_system):
    """Test RAG system initializes correctly"""
    assert rag_system is not None
    assert rag_system.embedding_model_name is not None
    assert rag_system.llm_client is not None


def test_rag_is_available(rag_system):
    """Test RAG availability check"""
    # May be False if index not generated yet
    is_available = rag_system.is_available()
    assert isinstance(is_available, bool)


@pytest.mark.asyncio
async def test_rag_query_basic(rag_system):
    """Test basic RAG query"""
    result = await rag_system.query(
        query="What is RAG?",
        k=5
    )
    
    assert "response" in result
    assert "sources" in result
    assert "offline" in result
    assert isinstance(result["response"], str)
    assert isinstance(result["sources"], list)


@pytest.mark.asyncio
async def test_rag_query_with_history(rag_system):
    """Test RAG query with conversation history"""
    history = [
        {"role": "user", "content": "Hello"},
        {"role": "assistant", "content": "Hi there!"}
    ]
    
    result = await rag_system.query(
        query="What is FAISS?",
        history=history,
        k=3
    )
    
    assert "response" in result
    assert len(result["response"]) > 0


def test_llm_client_initialization(llm_client):
    """Test LLM client initializes correctly"""
    assert llm_client is not None
    assert llm_client.provider in ["openrouter", "openai", "mock"]


@pytest.mark.asyncio
async def test_llm_generate(llm_client):
    """Test LLM generation"""
    response = await llm_client.generate(
        prompt="What is 2+2?",
        max_tokens=50
    )
    
    assert isinstance(response, str)
    assert len(response) > 0


@pytest.mark.asyncio
async def test_llm_mock_response(llm_client):
    """Test LLM mock response fallback"""
    # Force mock mode
    llm_client.provider = "mock"
    
    response = await llm_client.generate("Tell me about RAG")
    
    assert isinstance(response, str)
    assert "rag" in response.lower() or "retrieval" in response.lower()
