# Setup Instructions

## Quick Start

Before running the application, you need to:

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..

# Install backend dependencies
cd backend
pip install -r requirements.txt
cd ..
```

### 2. Generate Embeddings

After installing backend dependencies, generate the FAISS index:

```bash
python scripts/generate_embeddings.py
```

This will create `data/sample_embeddings/index.faiss` from the sample dataset.

### 3. Configure Environment (Optional)

The app works offline without API keys, but for real LLM functionality:

```bash
cp .env.example .env
# Edit .env and add your OPENROUTER_API_KEY
```

### 4. Run Development Servers

```bash
# Option 1: Run both servers with one command
npm run dev

# Option 2: Run separately
# Terminal 1 - Backend
cd backend
uvicorn main:app --reload --port 8000

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Visit **http://localhost:3000**

## Docker Alternative

```bash
docker-compose up --build
```

## Troubleshooting

**Issue**: `ModuleNotFoundError: No module named 'numpy'`
- **Solution**: Run `pip install -r backend/requirements.txt`

**Issue**: FAISS index not found
- **Solution**: Run `python scripts/generate_embeddings.py`

**Issue**: Frontend build errors
- **Solution**: Run `cd frontend && npm install`

**Issue**: Port already in use
- **Solution**: Change ports in `.env` or kill existing processes
