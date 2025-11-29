# Run in Google Colab

Click the badge below to open the RAG demo notebook in Google Colab:

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/YOUR_USERNAME/ai-portfolio/blob/main/notebooks/reproduce_demo.ipynb)

## Instructions

1. Click the badge above to open the notebook in Colab
2. Run the first cell to install dependencies
3. Execute all cells sequentially
4. The notebook will:
   - Load the sample dataset
   - Compute embeddings using sentence-transformers
   - Build a FAISS index
   - Run sample queries
   - Visualize results

## Requirements

No API keys required! The notebook uses:
- Free sentence-transformers models
- Local FAISS indexing
- Sample dataset included in the repository

## Expected Runtime

- Total: ~2-3 minutes
- Embedding computation: ~30 seconds
- Index building: ~5 seconds
- Queries: <1 second each

## Outputs

The notebook produces:
- Similarity search results for 3 sample queries
- Visualization of similarity scores
- Saved FAISS index (optional)

## Troubleshooting

**Issue**: Import errors
- **Solution**: Run the first cell to install dependencies

**Issue**: File not found
- **Solution**: Ensure you're running from the repository root or adjust paths

**Issue**: Out of memory
- **Solution**: Reduce batch size in encoding step
