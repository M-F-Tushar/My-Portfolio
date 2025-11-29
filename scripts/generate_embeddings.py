"""
Script to generate FAISS index from sample documents

Run this script to create the precomputed embeddings:
    python scripts/generate_embeddings.py
"""

import json
import numpy as np
from sentence_transformers import SentenceTransformer
import faiss
import os

def generate_embeddings():
    print("Loading embedding model...")
    model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
    
    print("Loading documents...")
    metadata_path = "data/sample_embeddings/metadata.json"
    with open(metadata_path, 'r') as f:
        documents = json.load(f)
    
    print(f"Encoding {len(documents)} documents...")
    texts = [doc['text'] for doc in documents]
    embeddings = model.encode(texts, show_progress_bar=True)
    
    print("Creating FAISS index...")
    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(np.array(embeddings, dtype=np.float32))
    
    print("Saving index...")
    os.makedirs("data/sample_embeddings", exist_ok=True)
    faiss.write_index(index, "data/sample_embeddings/index.faiss")
    
    print(f"✓ Successfully created FAISS index with {index.ntotal} vectors")
    print(f"  Dimension: {dimension}")
    print(f"  Index size: {os.path.getsize('data/sample_embeddings/index.faiss') / 1024:.2f} KB")

if __name__ == "__main__":
    generate_embeddings()
