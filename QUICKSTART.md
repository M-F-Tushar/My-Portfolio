# Quick Start Guide

## ✅ Setup Complete!

All dependencies are installed and embeddings are generated. You're ready to run the AI portfolio!

## 🚀 Run the Application

### Option 1: Run Both Servers (Recommended)

Open **two separate terminals** in the `ai-portfolio` directory:

**Terminal 1 - Backend:**
```powershell
cd C:\Users\User\OneDrive\Documents\Portfolio\ai-portfolio\backend
uvicorn main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```powershell
cd C:\Users\User\OneDrive\Documents\Portfolio\ai-portfolio\frontend
npm run dev
```

Then visit: **http://localhost:3000**

### Option 2: Use npm Script (if concurrently works)

```powershell
cd C:\Users\User\OneDrive\Documents\Portfolio\ai-portfolio
npm run dev
```

## 📱 What to Explore

1. **Homepage** (`/`) - Hero section + project gallery
2. **Project Pages** (`/projects/llm-chatbot`, `/projects/rag-system`, `/projects/agent-demo`)
3. **Chat Demo** (`/chat`) - RAG-powered Q&A with source attribution
4. **Agent Playground** (`/agent`) - Multi-step AI agent (enable safety toggle first)

## 🔑 Optional: Add OpenRouter API Key

The app works offline, but for real LLM responses:

1. Copy `.env.example` to `.env`:
   ```powershell
   copy .env.example .env
   ```

2. Edit `.env` and add your OpenRouter API key:
   ```
   OPENROUTER_API_KEY=sk-or-v1-your-key-here
   ```

3. Restart the backend server

## ✏️ Personalize Your Portfolio

Replace TODO markers in these files:

- **README.md** - GitHub username, bio, contact links
- **ABOUT.md** - Your experience, education, skills
- **frontend/components/Footer.tsx** - Social media links
- **LICENSE** - Your name

## 🧪 Run Tests

```powershell
# Backend tests
cd backend
pytest tests/ -v

# Frontend type-check
cd frontend
npm run type-check
```

## 📦 Deploy

### Vercel
```powershell
npm i -g vercel
vercel --prod
```

### Docker
```powershell
docker-compose up --build
```

## 🎯 Current Status

✅ Dependencies installed
✅ FAISS embeddings generated (15 documents, 384 dimensions)
✅ Frontend ready (Next.js + TypeScript)
✅ Backend ready (FastAPI + RAG + Agent)
✅ Sample projects created
✅ Tests available

**You're all set! Start the servers and explore your AI portfolio!**
