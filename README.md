# 🚀 AI/ML Portfolio - Production-Ready Platform

A comprehensive, enterprise-grade portfolio platform designed for AI/ML Engineers, featuring advanced content management, AI-powered interactions, and modern web technologies.

![Portfolio Banner](frontend/public/og-image.png)

## 🌟 Overview

This is a full-stack portfolio application that combines a stunning, responsive frontend with a powerful AI backend. Built with modern technologies and best practices, it provides everything needed to showcase your work, manage content dynamically, and demonstrate AI/ML capabilities.

**Live Demo**: [Your Portfolio URL]

## ✨ Key Features

### 🎨 Frontend Showcase
- **Interactive Neural Network Background** - Particle-based animated background with hover effects
- **Dynamic Sections**:
  - Hero section with profile and CTA
  - About section with professional summary
  - Skills display with categories and proficiency levels
  - Experience timeline with achievements
  - Featured projects gallery with filtering
  - Education & certifications
  - Research publications section
  - Awards & achievements showcase
  - GitHub activity integration with live stats
  - Testimonials/social proof
  - Contact form with email integration

### 🛠️ Content Management System
Complete admin dashboard for managing all content without code changes:
- **Profile Management** - Edit name, title, bio, social links, avatar
- **Projects** - Create/edit with markdown content, upload images, set featured items
- **Skills** - Organize by category with proficiency levels
- **Experience** - Add companies, roles, periods, achievements
- **Education** - Manage degrees, schools, relevant coursework
- **Certifications** - Track professional certifications with URLs
- **Blog Posts** - Write posts with markdown, tags, publish/draft states
- **Testimonials** - Collect and display social proof
- **Publications** - Showcase research papers and preprints
- **Achievements** - Display awards, competitions, scholarships
- **Contact Submissions** - View messages from visitors
- **Analytics Dashboard** - Monitor visitor statistics
- **Navigation Customization** - Control menu items and order

### 🤖 AI/ML Features
- **RAG Chat System** - Retrieval-Augmented Generation for querying knowledge base
- **Agent Playground** - Multi-step task execution and demonstration
- **Semantic Search** - FAISS-powered vector search with embeddings
- **LLM Integration** - Support for OpenAI, OpenRouter, Anthropic Claude
- **Offline Mode** - Graceful fallback when backend unavailable

### 🛡️ Enterprise Security
- **JWT Authentication** - Secure token-based admin access
- **Rate Limiting** - Redis-backed sliding window protection
- **CSRF Protection** - Cross-site request forgery prevention
- **Content Security Policy** - XSS and injection protection
- **SQL Injection Prevention** - Prisma ORM with parameterized queries
- **Secure Headers** - HSTS, frame options, XSS protection
- **Image Upload Validation** - File type and size restrictions

### ⚡ Performance & SEO
- **Server-Side Rendering** - Next.js 14 with SSR for optimal SEO
- **Edge Caching** - 60s cache with stale-while-revalidate
- **Image Optimization** - WebP/AVIF formats, lazy loading
- **Dynamic Sitemap** - Auto-generated from database content
- **Robots.txt** - Search engine optimization
- **OpenGraph & Twitter Cards** - Rich social media previews
- **Structured Data** - JSON-LD for better search visibility
- **Mobile Responsive** - Optimized for all devices

### 🎬 Animations & UX
- **Framer Motion** - Smooth page transitions and animations
- **Motion Wrappers** - Reusable animation components (fade, stagger, hover)
- **3D Tilt Effects** - Interactive card tilting
- **Glassmorphism Design** - Modern card-based UI with backdrop blur
- **Dark Mode** - Theme switching with persistence
- **Loading Skeletons** - Smooth loading states
- **Toast Notifications** - User feedback for actions

---

## 🏗️ Architecture

### Tech Stack

**Frontend**
- **Framework**: Next.js 14 (TypeScript, React 18)
- **Styling**: Tailwind CSS 3.4 with custom theme
- **UI Components**: Custom component library
- **Animations**: Framer Motion 11
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Database ORM**: Prisma

**Backend**
- **Framework**: FastAPI 0.110+ (Python 3.11+)
- **AI/ML**:
  - Sentence Transformers (embeddings)
  - FAISS (vector search)
  - OpenAI SDK
  - OpenRouter integration
- **Rate Limiting**: Custom middleware with Redis
- **Testing**: pytest, pytest-asyncio

**Database & Infrastructure**
- **Development**: SQLite (local dev)
- **Production**: PostgreSQL (Supabase)
- **Caching**: Redis (Upstash)
- **Email**: Resend API
- **Deployment**: Vercel (serverless + edge functions)
- **Analytics**: Google Analytics (via Sentry)

### Project Structure

```
My-Portfolio/
├── frontend/                          # Next.js application
│   ├── components/
│   │   ├── sections/                 # Page sections
│   │   │   ├── HeroSection.tsx
│   │   │   ├── AboutSection.tsx
│   │   │   ├── SkillsSection.tsx
│   │   │   ├── ExperienceSection.tsx
│   │   │   ├── ProjectsSection.tsx
│   │   │   ├── EducationSection.tsx
│   │   │   ├── PublicationsSection.tsx    # NEW: Research papers
│   │   │   ├── AchievementsSection.tsx    # NEW: Awards display
│   │   │   ├── GitHubSection.tsx          # NEW: GitHub integration
│   │   │   └── ContactSection.tsx
│   │   ├── admin/                    # Admin UI components
│   │   │   ├── ImageUpload.tsx       # NEW: Image upload widget
│   │   │   ├── MarkdownEditor.tsx    # NEW: MD editor with preview
│   │   │   └── StatusMessage.tsx     # NEW: Status notifications
│   │   ├── motion/                   # Animation components
│   │   │   └── MotionWrapper.tsx     # NEW: Reusable animations
│   │   ├── NeuralNetworkBg.tsx       # NEW: Particle background
│   │   ├── Nav.tsx, Footer.tsx
│   │   ├── SEO.tsx, Skeleton.tsx
│   │   └── TestimonialCard.tsx
│   ├── pages/
│   │   ├── index.tsx                 # Home page
│   │   ├── chat.tsx                  # RAG demo
│   │   ├── agent.tsx                 # Agent playground
│   │   ├── admin/                    # Admin dashboard (14 pages)
│   │   │   ├── index.tsx             # Dashboard
│   │   │   ├── login.tsx
│   │   │   ├── profile.tsx
│   │   │   ├── projects.tsx
│   │   │   ├── skills.tsx
│   │   │   ├── experience.tsx
│   │   │   ├── education.tsx
│   │   │   ├── certifications.tsx    # NEW
│   │   │   ├── testimonials.tsx      # NEW
│   │   │   ├── blog-posts.tsx        # NEW
│   │   │   ├── contact-submissions.tsx # NEW
│   │   │   ├── analytics.tsx
│   │   │   ├── social-links.tsx
│   │   │   └── navigation.tsx
│   │   └── api/                      # API routes (24+ endpoints)
│   │       ├── auth/                 # Authentication
│   │       ├── admin/                # Protected CRUD operations
│   │       │   ├── upload.ts         # NEW: File upload
│   │       │   ├── blog-posts.ts     # NEW
│   │       │   ├── certifications.ts # NEW
│   │       │   ├── testimonials.ts   # NEW
│   │       │   ├── contact-submissions.ts # NEW
│   │       │   └── dashboard-stats.ts # NEW
│   │       ├── chat.ts               # RAG endpoint
│   │       ├── agent.ts              # Agent execution
│   │       ├── contact.ts            # Contact form
│   │       └── sitemap.xml.ts
│   ├── lib/
│   │   ├── prisma.ts                 # Database client
│   │   ├── AuthContext.tsx           # Auth state
│   │   ├── ThemeContext.tsx          # Dark/light theme
│   │   ├── config.ts                 # Environment config
│   │   └── analytics.ts
│   ├── hooks/                        # Custom React hooks
│   ├── styles/
│   │   └── globals.css               # Tailwind + custom styles
│   ├── prisma/
│   │   ├── schema.prisma             # Database schema (14 models)
│   │   └── dev.db                    # SQLite dev database
│   ├── public/
│   │   └── uploads/                  # NEW: Uploaded images
│   └── [config files]
│
├── backend/                          # FastAPI application
│   ├── main.py                       # API server, middleware
│   ├── rag.py                        # RAG system implementation
│   ├── agent.py                      # Agent task execution
│   └── requirements.txt
│
├── content/                          # Documentation
├── data/                             # Embeddings and datasets
├── scripts/                          # Build utilities
├── tests/                            # Test suites
└── [config files]
```

### Database Schema

The application uses **14 Prisma models** for comprehensive data management:

#### Core Models
- **Profile** - Personal information, bio, contact details
- **SocialLink** - GitHub, LinkedIn, Twitter, etc.
- **Skill** - Technical skills with categories and proficiency
- **Experience** - Work history with achievements
- **Project** - Portfolio projects with markdown content
- **Education** - Academic background
- **Certification** - Professional certifications
- **NavItem** - Navigation menu customization
- **User** - Admin authentication

#### Content Models (Phase 2)
- **Testimonial** - Client/colleague testimonials
- **BlogPost** - Technical blog articles
- **ContactSubmission** - Visitor messages

#### Research Models (Phase 3)
- **Publication** - Research papers and publications
- **Achievement** - Awards, competitions, scholarships

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm 9+
- **Python** 3.11+
- **PostgreSQL** Database (Supabase recommended)
- **Redis** instance (Upstash recommended)

### Local Development Setup

#### 1. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/My-Portfolio.git
cd My-Portfolio
```

#### 2. Frontend Setup

```bash
cd frontend
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration:
# - DATABASE_URL (PostgreSQL connection string)
# - UPSTASH_REDIS_REST_URL and TOKEN
# - RESEND_API_KEY (for contact form)
# - JWT_SECRET (generate with: openssl rand -base64 32)
# - NEXT_PUBLIC_GA_ID (optional, for analytics)

# Initialize database
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

Frontend will run at `http://localhost:3000`

#### 3. Backend Setup

```bash
cd backend
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration:
# - OPENAI_API_KEY or OPENROUTER_API_KEY
# - REDIS_URL

# Start FastAPI server
uvicorn main:app --reload --port 8000
```

Backend will run at `http://localhost:8000`

#### 4. Run Both Servers Concurrently

From project root:

```bash
npm run dev
```

This starts both frontend and backend servers simultaneously.

### First-Time Setup

#### Create Admin User

```bash
cd frontend
npx prisma studio
```

1. Open Prisma Studio (http://localhost:5555)
2. Navigate to "User" model
3. Add new record:
   - username: `admin`
   - email: `your@email.com`
   - password: Use bcrypt hash (generate at https://bcrypt-generator.com/)
   - role: `admin`

#### Initial Content

Access admin dashboard at `http://localhost:3000/admin`:

1. Login with admin credentials
2. Fill out Profile section
3. Add Skills, Experience, Projects
4. Configure Navigation and Social Links

---

## 🌍 Deployment

### Vercel Deployment (Recommended)

This project is optimized for **Vercel** deployment with hybrid architecture (Next.js frontend + Python serverless functions).

#### Step-by-Step Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Next.js
     - **Root Directory**: `.` (project root)
     - **Build Command**: `cd frontend && npm run build`
     - **Output Directory**: `frontend/.next`

3. **Environment Variables**

   Add these in Vercel dashboard (Settings → Environment Variables):

   ```env
   # Database
   DATABASE_URL=postgresql://user:pass@host/db
   DIRECT_URL=postgresql://user:pass@host/db

   # Redis (Upstash)
   UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
   UPSTASH_REDIS_REST_TOKEN=your_token

   # Authentication
   JWT_SECRET=your_generated_secret

   # Email (Resend)
   RESEND_API_KEY=re_xxx
   RESEND_FROM_EMAIL=noreply@yourdomain.com
   RESEND_TO_EMAIL=your@email.com

   # AI (Optional - for RAG/Agent features)
   OPENAI_API_KEY=sk-xxx
   OPENROUTER_API_KEY=sk-or-v1-xxx

   # Analytics (Optional)
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

   # Production URLs
   NEXT_PUBLIC_API_URL=https://your-domain.vercel.app
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically:
     - Build Next.js frontend
     - Compile Python backend to serverless functions
     - Deploy to global edge network

5. **Post-Deployment**
   - Run Prisma migrations: `npx prisma db push` from local with production DATABASE_URL
   - Create admin user via Prisma Studio
   - Test all features

### Alternative: Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# Access at http://localhost:3000
```

---

## 📚 API Documentation

### Public Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Home page |
| `/api/profile` | GET | Get profile data |
| `/api/profile/skills` | GET | Get all skills |
| `/api/profile/experience` | GET | Get experience timeline |
| `/api/profile/projects` | GET | Get all projects |
| `/api/profile/education` | GET | Get education history |
| `/api/profile/certifications` | GET | Get certifications |
| `/api/profile/publications` | GET | Get research publications |
| `/api/profile/achievements` | GET | Get awards & achievements |
| `/api/profile/testimonials` | GET | Get testimonials |
| `/api/profile/social-links` | GET | Get social media links |
| `/api/contact` | POST | Submit contact form |
| `/api/chat` | POST | Query RAG system |
| `/api/agent` | POST | Execute agent task |

### Admin Endpoints (Protected)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | Admin login |
| `/api/auth/check` | GET | Check auth status |
| `/api/auth/logout` | POST | Logout |
| `/api/admin/profile` | GET, PUT | Manage profile |
| `/api/admin/skills` | GET, POST, PUT, DELETE | Manage skills |
| `/api/admin/experience` | GET, POST, PUT, DELETE | Manage experience |
| `/api/admin/projects` | GET, POST, PUT, DELETE | Manage projects |
| `/api/admin/education` | GET, POST, PUT, DELETE | Manage education |
| `/api/admin/certifications` | GET, POST, PUT, DELETE | Manage certifications |
| `/api/admin/testimonials` | GET, POST, PUT, DELETE | Manage testimonials |
| `/api/admin/blog-posts` | GET, POST, PUT, DELETE | Manage blog posts |
| `/api/admin/contact-submissions` | GET, PUT, DELETE | View messages |
| `/api/admin/social-links` | GET, POST, PUT, DELETE | Manage social links |
| `/api/admin/navigation` | GET, POST, PUT, DELETE | Customize navigation |
| `/api/admin/dashboard-stats` | GET | Get analytics stats |
| `/api/admin/upload` | POST | Upload images |

---

## 🎨 Component Library

### New Components

#### 1. NeuralNetworkBg
Interactive particle network background with hover effects.

```tsx
import NeuralNetworkBg from '@/components/NeuralNetworkBg';

<div className="relative">
  <NeuralNetworkBg />
  <div className="relative z-10">{/* Content */}</div>
</div>
```

**Features:**
- Responsive particle count (30 mobile, 80 desktop)
- Interactive grab and repulse modes
- Performance optimized with FPS limit
- Disabled interactions on mobile for performance

#### 2. AchievementsSection
Display awards, competitions, scholarships, and recognition.

```tsx
import AchievementsSection from '@/components/sections/AchievementsSection';

<AchievementsSection achievements={achievements} />
```

**Achievement Types:**
- `award` - Awards and recognitions
- `competition` - Competition wins
- `scholarship` - Scholarships and grants
- `recognition` - Other recognitions

#### 3. GitHubSection
Fetches and displays GitHub stats, contribution graph, and repositories.

```tsx
import GitHubSection from '@/components/sections/GitHubSection';

<GitHubSection username="your-github-username" maxRepos={6} />
```

**Features:**
- Live GitHub API integration
- Repository stats (stars, forks, language)
- Contribution activity graph
- Repository topics display
- Error handling and loading states

#### 4. PublicationsSection
Showcase research papers, preprints, and academic work.

```tsx
import PublicationsSection from '@/components/sections/PublicationsSection';

<PublicationsSection publications={publications} />
```

**Publication Types:**
- `conference` - Conference papers
- `journal` - Journal articles
- `preprint` - ArXiv, bioRxiv preprints
- `thesis` - Master's/PhD theses

#### 5. Motion Wrappers
Reusable animation components powered by Framer Motion.

```tsx
import { MotionFade, StaggerContainer, StaggerItem } from '@/components/motion/MotionWrapper';

// Fade animations
<MotionFade direction="up" delay={0.2}>
  <h1>Animated Heading</h1>
</MotionFade>

// Stagger children
<StaggerContainer>
  <StaggerItem><Card /></StaggerItem>
  <StaggerItem><Card /></StaggerItem>
</StaggerContainer>
```

**Available Components:**
- `MotionFade` - Fade in with direction (up/down/left/right)
- `MotionSection` - Animated section wrapper
- `StaggerContainer` - Parent for staggered animations
- `StaggerItem` - Child items with stagger effect
- `HoverCard` - Card with hover lift effect
- `GlowHover` - Hover glow effect

#### 6. Admin Components

**ImageUpload** - Upload and preview images

```tsx
import ImageUpload from '@/components/admin/ImageUpload';

<ImageUpload
  value={imageUrl}
  onChange={setImageUrl}
  label="Project Image"
/>
```

**MarkdownEditor** - Edit with preview and toolbar

```tsx
import MarkdownEditor from '@/components/admin/MarkdownEditor';

<MarkdownEditor
  value={content}
  onChange={setContent}
  label="Project Description"
  placeholder="Write your content..."
/>
```

**StatusMessage** - Toast notifications

```tsx
import StatusMessage from '@/components/admin/StatusMessage';

<StatusMessage
  type="success"
  message="Project saved successfully!"
/>
```

---

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)

```env
# Database (Required)
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
DIRECT_URL="postgresql://user:pass@host:5432/db?sslmode=require"

# Redis (Required for rate limiting)
UPSTASH_REDIS_REST_URL="https://xxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your_token"

# Authentication (Required)
JWT_SECRET="your-secret-key-min-32-chars"

# Email (Required for contact form)
RESEND_API_KEY="re_xxx"
RESEND_FROM_EMAIL="noreply@yourdomain.com"
RESEND_TO_EMAIL="your@email.com"

# Public URLs
NEXT_PUBLIC_API_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Analytics (Optional)
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

#### Backend (.env)

```env
# AI/ML (Optional - for RAG/Agent)
OPENAI_API_KEY="sk-xxx"
OPENROUTER_API_KEY="sk-or-v1-xxx"

# Redis (for rate limiting)
REDIS_URL="redis://localhost:6379"
```

### Customization

#### 1. Theme Colors (tailwind.config.js)

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: { /* Your brand color */ },
        electric: { /* Accent color */ },
        dark: { /* Background shades */ }
      }
    }
  }
}
```

#### 2. Site Metadata (frontend/lib/config.ts)

```ts
export const siteConfig = {
  name: 'Your Name',
  title: 'AI/ML Engineer',
  description: 'Your portfolio description',
  url: 'https://yoursite.com',
  ogImage: '/og-image.png'
}
```

#### 3. Navigation (Admin Dashboard)

Login to `/admin/navigation` to customize menu items.

---

## 🧪 Testing

### Frontend Tests

```bash
cd frontend
npm run test        # Run Jest tests
npm run test:watch  # Watch mode
npm run test:coverage  # Coverage report
```

### Backend Tests

```bash
cd backend
source venv/bin/activate
pytest tests/ -v    # Run all tests
pytest tests/test_rag.py  # Specific test file
```

### Linting

```bash
# Frontend
cd frontend
npm run lint

# Backend
cd backend
flake8 .
```

---

## 📊 Performance

### Lighthouse Scores (Target)
- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 95+
- **SEO**: 100

### Optimizations Applied
- Server-side rendering (SSR)
- Image optimization (WebP/AVIF)
- Code splitting and lazy loading
- Edge caching (60s)
- Minified CSS/JS
- Redis caching
- Database query optimization

---

## 🛠️ Development

### Available Scripts

```bash
# Root level
npm run dev              # Run frontend + backend
npm run dev:frontend     # Frontend only
npm run dev:backend      # Backend only
npm run build            # Production build
npm run test             # Run all tests
npm run lint             # Lint all code

# Frontend
cd frontend
npm run dev              # Dev server (port 3000)
npm run build            # Production build
npm run start            # Start production server
npm run type-check       # TypeScript check
npx prisma studio        # Database GUI

# Backend
cd backend
uvicorn main:app --reload     # Dev server (port 8000)
pytest tests/ -v              # Run tests
```

### Database Commands

```bash
# Generate Prisma client
npx prisma generate

# Push schema changes
npx prisma db push

# Create migration
npx prisma migrate dev --name your_migration_name

# Open Prisma Studio
npx prisma studio

# Reset database (caution!)
npx prisma migrate reset
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

MIT License - feel free to use this as a template for your own portfolio!

---

## 🙏 Acknowledgments

- **Next.js** - React framework
- **FastAPI** - Python web framework
- **Prisma** - Database toolkit
- **Framer Motion** - Animation library
- **Tailwind CSS** - Utility-first CSS
- **Vercel** - Deployment platform
- **Supabase** - PostgreSQL hosting
- **Upstash** - Redis hosting
- **Resend** - Email API

---

## 📧 Support

For questions or issues:
- Open an [Issue](https://github.com/YOUR_USERNAME/My-Portfolio/issues)
- Email: your@email.com
- Twitter: [@yourhandle](https://twitter.com/yourhandle)

---

## 🚀 Roadmap

- [ ] Multi-language support (i18n)
- [ ] Blog with comments system
- [ ] Real-time chat widget
- [ ] Advanced analytics dashboard
- [ ] PDF resume generator
- [ ] Project case studies
- [ ] Video testimonials
- [ ] Newsletter integration

---

**Built with ❤️ by [Your Name](https://yoursite.com)**

⭐ Star this repo if you find it helpful!
