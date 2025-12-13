# 🚀 Professional AI/ML Portfolio

A high-performance, intelligent portfolio website built for AI/ML Engineers. This project combines a modern, responsive design with a powerful backend for agentic capabilities, content management, and robust security.

![Portfolio Banner](frontend/public/og-image.png)

## ✨ Key Features

*   **🤖 AI Agent Backend**: Integrated FastAPI backend for RAG (Retrieval Augmented Generation) and agentic workflows.
*   **📊 Dynamic Content Management**: Admin dashboard to manage Projects, Experience, Skills, and Blog posts without code changes.
*   **🛡️ Enterprise-Grade Security**:
    *   **Rate Limiting**: Redis-based sliding window rate limiting on all API routes.
    *   **Authentication**: Secure JWT-based admin authentication.
    *   **Protection**: CSRF protection, secure headers, and SQL injection prevention.
*   **⚡ High Performance**:
    *   **Next.js 14**: Server-Side Rendering (SSR) and Edge Middleware.
    *   **PostgreSQL**: Production-grade relational database (via Supabase).
    *   **Redis**: High-speed caching and rate limiting (via Upstash).
*   **🎨 Professional UI/UX**: Glassmorphism design, 3D tilt effects, and Framer Motion animations.

## 🛠️ Tech Stack

*   **Frontend**: Next.js 14 (TypeScript), Tailwind CSS, Framer Motion
*   **Backend**: FastAPI (Python), LangChain (AI Agent)
*   **Database**: PostgreSQL (Supabase) + Prisma ORM
*   **Cache/Rate Limiting**: Upstash Redis
*   **Deployment**: Vercel (Frontend & Backend serverless)

## 🚀 Quick Start (Local Development)

### Prerequisites
*   Node.js 18+
*   Python 3.11+
*   PostgreSQL Database (Supabase recommended)
*   Redis (Upstash recommended)

### 1. Clone & Setup
```bash
git clone https://github.com/M-F-Tushar/My-Portfolio.git
cd My-Portfolio
```

### 2. Frontend Setup
```bash
cd frontend
npm install

# Setup Environment Variables
cp .env.example .env
# Edit .env and add your DATABASE_URL, UPSTASH_REDIS_REST_URL, etc.

# Run Database Migrations
npx prisma migrate dev

# Start Dev Server
npm run dev
```

### 3. Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload
```

## 🌍 Deployment (Vercel)

This project is optimized for deployment on **Vercel**.

1.  **Push** your code to GitHub.
2.  **Import** the project in [Vercel](https://vercel.com).
    *   **Root Directory**: Select `.` (Project Root).
    *   **Framework**: Next.js.
3.  **Environment Variables**: Copy all variables from your `frontend/.env` to Vercel.
4.  **Deploy**!

> **Note**: This is a hybrid deployment. Vercel automatically handles the Next.js frontend and compiles the `backend/` folder into Serverless Python Functions.

## 📄 License

MIT License - feel free to use this as a template for your own portfolio!
