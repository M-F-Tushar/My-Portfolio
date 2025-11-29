#!/bin/bash

# Export AI Portfolio Demo
# This script exports a static site and packages reproducible artifacts

set -e

echo "🚀 Exporting AI Portfolio Demo..."

# Create output directory
OUTPUT_DIR="out"
ARTIFACTS_DIR="$OUTPUT_DIR/artifacts"
mkdir -p "$OUTPUT_DIR"
mkdir -p "$ARTIFACTS_DIR"

# 1. Build frontend
echo "📦 Building frontend..."
cd frontend
npm run build
npm run export || next export
cd ..

# Copy exported files
cp -r frontend/out/* "$OUTPUT_DIR/"

# 2. Package backend
echo "📦 Packaging backend..."
mkdir -p "$ARTIFACTS_DIR/backend"
cp -r backend/*.py "$ARTIFACTS_DIR/backend/"
cp backend/requirements.txt "$ARTIFACTS_DIR/backend/"

# 3. Package data
echo "📦 Packaging data..."
mkdir -p "$ARTIFACTS_DIR/data"
cp -r data/sample "$ARTIFACTS_DIR/data/"
cp -r data/sample_embeddings "$ARTIFACTS_DIR/data/"

# 4. Package notebooks
echo "📦 Packaging notebooks..."
mkdir -p "$ARTIFACTS_DIR/notebooks"
cp notebooks/reproduce_demo.ipynb "$ARTIFACTS_DIR/notebooks/"

# 5. Package documentation
echo "📦 Packaging documentation..."
cp README.md "$ARTIFACTS_DIR/"
cp SECURITY.md "$ARTIFACTS_DIR/"
cp LICENSE "$ARTIFACTS_DIR/"
cp .env.example "$ARTIFACTS_DIR/"

# 6. Create archive
echo "📦 Creating archive..."
cd "$OUTPUT_DIR"
tar -czf ai-portfolio-demo.tar.gz artifacts/
cd ..

# 7. Generate manifest
echo "📦 Generating manifest..."
cat > "$OUTPUT_DIR/MANIFEST.md" << EOF
# AI Portfolio Demo - Export Manifest

**Generated**: $(date)

## Contents

### Static Site
- \`index.html\` - Homepage
- \`projects/\` - Project pages
- \`chat/\` - Chat demo (requires backend)
- \`agent/\` - Agent playground (requires backend)

### Artifacts Archive (\`ai-portfolio-demo.tar.gz\`)

#### Backend
- \`backend/main.py\` - FastAPI application
- \`backend/rag.py\` - RAG system
- \`backend/agent.py\` - Agent implementation
- \`backend/requirements.txt\` - Python dependencies

#### Data
- \`data/sample/documents.csv\` - Sample dataset (15 documents)
- \`data/sample_embeddings/index.faiss\` - Precomputed FAISS index
- \`data/sample_embeddings/metadata.json\` - Document metadata

#### Notebooks
- \`notebooks/reproduce_demo.ipynb\` - End-to-end RAG demo

#### Documentation
- \`README.md\` - Setup and deployment guide
- \`SECURITY.md\` - Security policy
- \`LICENSE\` - MIT License
- \`.env.example\` - Environment variable template

## Running the Demo

### Static Site (No Backend)
\`\`\`bash
cd out
python -m http.server 8080
# Visit http://localhost:8080
\`\`\`

### Full Stack (With Backend)
\`\`\`bash
# Extract artifacts
tar -xzf ai-portfolio-demo.tar.gz

# Install backend dependencies
cd artifacts/backend
pip install -r requirements.txt

# Run backend
uvicorn main:app --port 8000

# Serve frontend (in another terminal)
cd ../../
python -m http.server 3000
\`\`\`

### Jupyter Notebook
\`\`\`bash
# Extract artifacts
tar -xzf ai-portfolio-demo.tar.gz

# Run notebook
jupyter notebook artifacts/notebooks/reproduce_demo.ipynb
\`\`\`

## Reproducibility

All artifacts are self-contained and reproducible:
- ✅ Precomputed embeddings included
- ✅ No API keys required for offline mode
- ✅ Sample dataset provided
- ✅ Complete source code

## File Sizes

- Static site: ~$(du -sh "$OUTPUT_DIR" | cut -f1)
- Artifacts archive: ~$(du -sh "$OUTPUT_DIR/ai-portfolio-demo.tar.gz" | cut -f1)

---

**For questions or issues, see README.md**
EOF

echo "✅ Export complete!"
echo ""
echo "📁 Output directory: $OUTPUT_DIR"
echo "📦 Archive: $OUTPUT_DIR/ai-portfolio-demo.tar.gz"
echo "📄 Manifest: $OUTPUT_DIR/MANIFEST.md"
echo ""
echo "To deploy static site:"
echo "  cd $OUTPUT_DIR && python -m http.server 8080"
