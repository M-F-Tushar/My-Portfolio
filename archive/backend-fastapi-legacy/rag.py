import os
import json
import numpy as np
from typing import List, Dict, Any, Optional
from sentence_transformers import SentenceTransformer
import faiss
from dotenv import load_dotenv

load_dotenv()


class LLMClient:
    """Base LLM client with provider abstraction"""
    
    def __init__(self):
        self.provider = os.getenv("LLM_PROVIDER", "mock")
        self.client = None
        self._initialize_client()
    
    def _initialize_client(self):
        """Initialize the appropriate LLM client based on provider"""
        if self.provider == "openrouter":
            try:
                from openai import OpenAI
                self.client = OpenAI(
                    base_url="https://openrouter.ai/api/v1",
                    api_key=os.getenv("OPENROUTER_API_KEY"),
                )
                self.model = os.getenv("OPENROUTER_MODEL", "anthropic/claude-3.5-sonnet")
            except Exception as e:
                print(f"OpenRouter initialization failed: {e}. Falling back to mock.")
                self.provider = "mock"
        
        elif self.provider == "openai":
            try:
                from openai import OpenAI
                self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
                self.model = os.getenv("OPENAI_MODEL", "gpt-4-turbo")
            except Exception as e:
                print(f"OpenAI initialization failed: {e}. Falling back to mock.")
                self.provider = "mock"
    
    async def generate(self, prompt: str, max_tokens: int = 500) -> str:
        """Generate response from LLM"""
        if self.provider == "mock":
            return self._mock_response(prompt)
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=max_tokens,
                temperature=0.7,
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"LLM generation failed: {e}. Using mock response.")
            return self._mock_response(prompt)
    
    def _mock_response(self, prompt: str) -> str:
        """Fallback mock response"""
        if "rag" in prompt.lower():
            return "RAG (Retrieval-Augmented Generation) combines information retrieval with language generation. It retrieves relevant documents from a knowledge base and uses them to generate informed responses."
        elif "agent" in prompt.lower():
            return "AI agents are autonomous systems that can perceive their environment, make decisions, and take actions to achieve specific goals. They often use multi-step reasoning and tool use."
        else:
            return "I'm running in offline mode with precomputed responses. To use real LLM capabilities, please configure your API key in the .env file."


class RAGSystem:
    """Retrieval-Augmented Generation system"""
    
    def __init__(self):
        self.embedding_model_name = os.getenv(
            "EMBEDDING_MODEL",
            "sentence-transformers/all-MiniLM-L6-v2"
        )
        self.index_path = os.getenv(
            "FAISS_INDEX_PATH",
            "./data/sample_embeddings/index.faiss"
        )
        self.metadata_path = os.getenv(
            "FAISS_INDEX_PATH",
            "./data/sample_embeddings/metadata.json"
        ).replace("index.faiss", "metadata.json")
        
        self.embedding_model = None
        self.index = None
        self.metadata = []
        self.llm_client = LLMClient()
        
        self._load_index()
    
    def _load_index(self):
        """Load FAISS index and metadata"""
        try:
            # Load embedding model
            self.embedding_model = SentenceTransformer(self.embedding_model_name)
            
            # Load FAISS index
            if os.path.exists(self.index_path):
                self.index = faiss.read_index(self.index_path)
            else:
                print(f"Warning: FAISS index not found at {self.index_path}")
                self.index = None
            
            # Load metadata
            if os.path.exists(self.metadata_path):
                with open(self.metadata_path, 'r') as f:
                    self.metadata = json.load(f)
            else:
                print(f"Warning: Metadata not found at {self.metadata_path}")
                self.metadata = []
        
        except Exception as e:
            print(f"Error loading RAG system: {e}")
            self.embedding_model = None
            self.index = None
    
    def is_available(self) -> bool:
        """Check if RAG system is available"""
        return self.embedding_model is not None and self.index is not None
    
    async def query(
        self,
        query: str,
        history: Optional[List[Dict[str, str]]] = None,
        k: int = 5
    ) -> Dict[str, Any]:
        """
        Query the RAG system
        
        Args:
            query: User query string
            history: Conversation history
            k: Number of documents to retrieve
        
        Returns:
            Dict with response, sources, and offline flag
        """
        if not self.is_available():
            return {
                "response": "RAG system is not available. Running in offline mode.",
                "sources": [],
                "offline": True
            }
        
        try:
            # Compute query embedding
            query_embedding = self.embedding_model.encode([query])[0]
            query_embedding = np.array([query_embedding], dtype=np.float32)
            
            # Search FAISS index
            distances, indices = self.index.search(query_embedding, k)
            
            # Retrieve documents
            retrieved_docs = []
            sources = []
            for idx in indices[0]:
                if idx < len(self.metadata):
                    doc = self.metadata[idx]
                    retrieved_docs.append(doc["text"])
                    sources.append({
                        "title": doc.get("title", f"Document {idx}"),
                        "url": doc.get("url", "#")
                    })
            
            # Build prompt
            context = "\n\n".join(retrieved_docs)
            prompt = f"""Based on the following context, answer the user's question.

Context:
{context}

Question: {query}

Answer:"""
            
            # Generate response
            response = await self.llm_client.generate(prompt)
            
            return {
                "response": response,
                "sources": sources,
                "offline": self.llm_client.provider == "mock"
            }
        
        except Exception as e:
            print(f"RAG query error: {e}")
            return {
                "response": f"Error processing query: {str(e)}",
                "sources": [],
                "offline": True
            }
