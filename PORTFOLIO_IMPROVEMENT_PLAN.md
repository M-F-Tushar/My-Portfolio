# 🚀 Portfolio Improvement Plan - Complete Guideline

**Document Version:** 1.0  
**Last Updated:** December 6, 2025  
**Total Tasks:** 49  
**Estimated Timeline:** 4 weeks

---

## 📑 Table of Contents

1. [Overview](#overview)
2. [PART A: 🤖 AGENT TASKS (AI Can Do)](#part-a--agent-tasks-ai-can-do)
3. [PART B: 👤 MANUAL TASKS (You Must Do)](#part-b--manual-tasks-you-must-do)
4. [Progress Tracker](#progress-tracker)
5. [Quick Reference Links](#quick-reference-links)

---

## Overview

This improvement plan is divided into **TWO MAIN PARTS**:

| Part | Type | Description | Action |
|------|------|-------------|--------|
| **PART A** | 🤖 Agent Tasks | Code changes, configurations, new components | Just ask the AI agent to implement |
| **PART B** | 👤 Manual Tasks | Content, images, external services, deployment | You must do these yourself |

### Priority Indicators

| Icon | Priority | Description |
|------|----------|-------------|
| 🔴 | Critical | Must complete before launch |
| 🟡 | Important | Complete within 2 weeks |
| 🟢 | Nice-to-have | Can do post-launch |

### Current Portfolio Status

| Aspect | Status | Notes |
|--------|--------|-------|
| Architecture | ✅ Solid | Next.js + FastAPI + Prisma |
| Content | ❌ Placeholder | Needs real content |
| Security | ⚠️ Needs fixes | CORS, CSRF, rate limiting |
| UI/UX | ⚠️ Basic | Needs polish and features |
| SEO | ⚠️ Incomplete | Hardcoded URLs, missing assets |
| Accessibility | ⚠️ Basic | Missing skip links, ARIA |

---

---

# PART A: 🤖 AGENT TASKS (AI Can Do)

> **How to use**: Simply tell the AI agent: *"Implement Task A.1"* or *"Do all Phase 1 agent tasks"*

---

## A.1 Environment & Configuration (Phase 1 - Critical)

### [ ] 🔴 Task A.1.1: Create Environment Variable System
**Time**: 15 minutes

**What I'll do**:
- Create `frontend/.env.example` with all required variables
- Create `backend/.env.example` with all required variables  
- Update `SEO.tsx` to use `NEXT_PUBLIC_SITE_URL` environment variable
- Create `lib/config.ts` utility for centralized configuration
- Remove all hardcoded `yourportfolio.com` references

---

### [ ] 🔴 Task A.1.2: Update Document Head with Favicon Links
**Time**: 10 minutes

**What I'll do**:
- Update `frontend/pages/_document.tsx` to include all favicon link tags
- Add `site.webmanifest` reference
- Add theme-color meta tag
- Add apple-touch-icon links

---

## A.2 Security Fixes (Phase 1 - Critical)

### [ ] 🔴 Task A.2.1: Fix CORS Configuration
**Time**: 15 minutes

**What I'll do**:
- Update `backend/main.py` to use environment variable for allowed origins
- Remove wildcard `*` from CORS configuration
- Add proper error handling for invalid origins

---

### [ ] 🔴 Task A.2.2: Add CSRF Protection to Contact Form
**Time**: 25 minutes

**What I'll do**:
- Create CSRF token generation utility
- Add CSRF token validation middleware
- Update contact form API to require and validate CSRF token
- Update contact form frontend to include CSRF token

---

### [ ] 🔴 Task A.2.3: Implement Rate Limiting
**Time**: 25 minutes

**What I'll do**:
- Install `slowapi` for FastAPI rate limiting
- Add rate limiting to contact form (5 requests/hour/IP)
- Add rate limiting to other sensitive endpoints
- Return user-friendly error messages when rate limited

---

### [ ] 🔴 Task A.2.4: Add Security Headers
**Time**: 15 minutes

**What I'll do**:
- Add security headers in `next.config.js`:
  - X-Frame-Options
  - X-Content-Type-Options
  - Referrer-Policy
  - X-XSS-Protection
- Configure basic Content Security Policy

---

## A.3 SEO Improvements (Phase 1 - Critical)

### [ ] 🔴 Task A.3.1: Create Dynamic Sitemap Generator
**Time**: 30 minutes

**What I'll do**:
- Create `pages/sitemap.xml.tsx` for dynamic generation
- Include all static pages (home, chat, agent)
- Include all project pages from database
- Set proper lastmod dates
- Delete old static `sitemap.xml`

---

### [ ] 🔴 Task A.3.2: Create Dynamic Robots.txt
**Time**: 15 minutes

**What I'll do**:
- Create `pages/robots.txt.tsx` for dynamic generation
- Use environment variable for sitemap URL
- Ensure proper Allow/Disallow rules
- Delete old static `robots.txt`

---

## A.4 Email Integration (Phase 1 - Critical)

### [ ] 🔴 Task A.4.1: Implement Email Sending with Resend
**Time**: 30 minutes

**What I'll do**:
- Install Resend package (`npm install resend`)
- Update contact API (`pages/api/contact.ts`) to send actual emails
- Format email nicely with contact details
- Add proper error handling and validation
- Send confirmation response

---

## A.5 UI/UX Enhancements (Phase 2 - Important)

### [ ] 🟡 Task A.5.1: Implement Dark Mode
**Time**: 1.5 hours

**What I'll do**:
- Create ThemeContext with localStorage persistence
- Add dark mode toggle button to navigation
- Define dark color scheme in Tailwind config
- Update all components to support dark mode
- Respect `prefers-color-scheme` system preference
- Add smooth transition between modes

---

### [ ] 🟡 Task A.5.2: Add Skip-to-Content Accessibility Link
**Time**: 15 minutes

**What I'll do**:
- Add hidden skip link as first focusable element in `_app.tsx`
- Style to be visible only on keyboard focus
- Link to main content area with proper ID
- Improves WCAG accessibility compliance

---

### [ ] 🟡 Task A.5.3: Add Loading Skeleton Components
**Time**: 45 minutes

**What I'll do**:
- Create reusable skeleton components (card, text, image)
- Replace "Loading..." text with skeleton UI
- Add shimmer animation effect using Tailwind
- Implement for profile, projects, and experience sections

---

### [ ] 🟡 Task A.5.4: Add Scroll-Triggered Animations
**Time**: 1 hour

**What I'll do**:
- Implement Intersection Observer for sections
- Add fade-in animations when sections come into view
- Stagger animations for list items (projects, skills, experience)
- Respect `prefers-reduced-motion` preference

---

### [ ] 🟡 Task A.5.5: Add Active Section Highlighting in Navigation
**Time**: 30 minutes

**What I'll do**:
- Track current section via scroll position
- Highlight active nav item with visual indicator
- Smooth transitions between states
- Update on scroll and click

---

## A.6 New Sections & Components (Phase 2 - Important)

### [ ] 🟡 Task A.6.1: Create Testimonials Section
**Time**: 1.5 hours

**What I'll do**:
- Add Testimonial model to Prisma schema
- Run database migration
- Create TestimonialCard component
- Build Testimonials section with grid/carousel layout
- Add testimonials management to admin dashboard

---

### [ ] 🟡 Task A.6.2: Create Blog Section Structure
**Time**: 2 hours

**What I'll do**:
- Add Post model to Prisma schema (title, slug, content, date, tags)
- Create blog index page `/blog`
- Create blog post page `/blog/[slug]`
- Add reading time calculation
- Create blog management in admin dashboard
- Style with existing design system

---

### [ ] 🟡 Task A.6.3: Add Skills Progress Bars
**Time**: 45 minutes

**What I'll do**:
- Add proficiency level field (1-100) to Skill model
- Create animated progress bar component
- Update skills section with visual bars
- Add proficiency editing to admin dashboard

---

### [ ] 🟡 Task A.6.4: Add Project Filtering & Search
**Time**: 1.5 hours

**What I'll do**:
- Add filter buttons for tech categories
- Implement search by title/description
- Add URL query params for shareable filter states
- Smooth filter/search animations
- Show "no results" state

---

### [ ] 🟡 Task A.6.5: Add GitHub Activity Widget
**Time**: 1 hour

**What I'll do**:
- Create GitHub contribution graph component
- Fetch recent repos/activity via GitHub API
- Cache data to avoid rate limits
- Link to GitHub profile
- Handle API errors gracefully

---

## A.7 Analytics & Tracking (Phase 2 - Important)

### [ ] 🟡 Task A.7.1: Implement Google Analytics Integration
**Time**: 30 minutes

**What I'll do**:
- Add GA4 script to `_document.tsx`
- Create analytics utility functions
- Track page views automatically
- Add event tracking for key actions (contact submit, resume download)
- Respect Do Not Track browser preference

---

## A.8 Performance & SEO (Phase 2 - Important)

### [ ] 🟡 Task A.8.1: Optimize Image Configuration
**Time**: 45 minutes

**What I'll do**:
- Configure Next.js Image component properly
- Add blur placeholders for images
- Set up image domains in `next.config.js`
- Implement proper lazy loading
- Add WebP format support

---

### [ ] 🟡 Task A.8.2: Add Structured Data for Projects
**Time**: 30 minutes

**What I'll do**:
- Add Article schema for project pages
- Add BreadcrumbList schema for navigation
- Enhance existing Person schema with more details
- Add SoftwareApplication schema for projects

---

## A.9 Advanced UI Features (Phase 3 - Nice-to-have)

### [ ] 🟢 Task A.9.1: Add Page Transitions
**Time**: 1.5 hours

**What I'll do**:
- Install Framer Motion (if not present)
- Add AnimatePresence wrapper in `_app.tsx`
- Create smooth page transition animations
- Keep transitions under 300ms for performance

---

### [ ] 🟢 Task A.9.2: Add Hero Section Animations
**Time**: 2 hours

**What I'll do**:
- Add animated gradient background
- Create subtle floating particle effects
- Add typing animation for tagline/title
- Implement scroll indicator animation

---

### [ ] 🟢 Task A.9.3: Add PDF Portfolio Export
**Time**: 2.5 hours

**What I'll do**:
- Create print-friendly portfolio view
- Implement PDF generation using react-pdf or similar
- Include key sections: about, skills, projects, contact
- Add download button to portfolio

---

### [ ] 🟢 Task A.9.4: Set Up i18n Structure
**Time**: 3 hours

**What I'll do**:
- Install and configure next-i18next
- Create translation file structure (`locales/en/`, `locales/bn/`)
- Add language switcher component to navigation
- Set up English as default language
- Prepare structure for additional languages

---

### [ ] 🟢 Task A.9.5: Add Admin Analytics Dashboard
**Time**: 4 hours

**What I'll do**:
- Create admin analytics page
- Display page views and popular content
- Show contact form submission stats
- Add charts using Recharts library
- Create summary cards with key metrics

---

## A.10 Maintenance & DevOps (Phase 4 - Ongoing)

### [ ] 🟢 Task A.10.1: Set Up Dependabot
**Time**: 15 minutes

**What I'll do**:
- Create `.github/dependabot.yml` configuration
- Set up weekly dependency update checks
- Configure auto-merge for patch updates
- Set up PR labels for updates

---

### [ ] 🟢 Task A.10.2: Add Health Check Endpoint
**Time**: 20 minutes

**What I'll do**:
- Create `/api/health` endpoint
- Check database connectivity
- Return system status
- Document for uptime monitoring setup

---

### [ ] 🟢 Task A.10.3: Add Error Tracking with Sentry
**Time**: 30 minutes

**What I'll do**:
- Install Sentry SDK
- Configure for frontend and backend
- Set up error boundaries
- Add environment-based configuration

---

---

# PART B: 👤 MANUAL TASKS (You Must Do)

> **These tasks require YOUR action** - content creation, design decisions, account setup, and deployment

---

## B.1 Environment Setup (Phase 1 - Critical)

### [ ] 🔴 Task B.1.1: Choose Your Domain
**Time**: 15 minutes

**Options**:
| Option | Cost | Example |
|--------|------|---------|
| Custom Domain | $10-15/year | `yourname.com` |
| Vercel Free | Free | `yourname.vercel.app` |

**Where to buy domains**:
- [Namecheap](https://namecheap.com) - Affordable
- [Cloudflare](https://cloudflare.com/products/registrar/) - At cost pricing
- [Google Domains](https://domains.google) - Easy setup

**Checklist**:
- [ ] Domain decided
- [ ] Domain purchased (if custom)

---

### [ ] 🔴 Task B.1.2: Create Environment Variable Files
**Time**: 15 minutes

**After agent creates `.env.example` files, you must**:

1. **Create `frontend/.env.local`**:
   ```env
   # Your actual domain
   NEXT_PUBLIC_SITE_URL=https://your-actual-domain.com
   
   # API URL
   NEXT_PUBLIC_API_URL=http://localhost:8000
   
   # Database
   DATABASE_URL="file:./dev.db"
   
   # JWT Secret (generate below)
   JWT_SECRET=paste-generated-secret-here
   
   # Email (after Task B.5.1)
   RESEND_API_KEY=re_xxxxxxxxxxxx
   CONTACT_EMAIL=your@email.com
   
   # Analytics (after Task B.6.1)
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

2. **Create `backend/.env.local`**:
   ```env
   FRONTEND_URL=https://your-actual-domain.com
   ALLOWED_ORIGINS=https://your-actual-domain.com,http://localhost:3000
   AGENT_ENABLED=false
   ```

3. **Generate JWT Secret** (run in PowerShell):
   ```powershell
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

**Checklist**:
- [ ] `frontend/.env.local` created
- [ ] `backend/.env.local` created
- [ ] JWT secret generated and added
- [ ] Tested locally

---

## B.2 Visual Assets (Phase 1 - Critical)

### [ ] 🔴 Task B.2.1: Create Favicon & App Icons
**Time**: 30-45 minutes

**Step 1: Create or obtain a logo** (512x512px PNG)
- Design yourself: [Figma](https://figma.com), [Canva](https://canva.com)
- Use your initials as simple logo
- Hire designer: [Fiverr](https://fiverr.com) ($5-50)

**Step 2: Generate all icon sizes**
1. Go to [RealFaviconGenerator](https://realfavicongenerator.net/)
2. Upload your 512x512 image
3. Configure colors and settings
4. Download the generated package

**Step 3: Place files in `frontend/public/`**
```
frontend/public/
├── favicon.ico
├── favicon-16x16.png
├── favicon-32x32.png
├── apple-touch-icon.png
├── android-chrome-192x192.png
├── android-chrome-512x512.png
└── site.webmanifest
```

**Step 4: Update `site.webmanifest`**:
```json
{
  "name": "Your Name - AI/ML Portfolio",
  "short_name": "Portfolio",
  "icons": [
    { "src": "/android-chrome-192x192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/android-chrome-512x512.png", "sizes": "512x512", "type": "image/png" }
  ],
  "theme_color": "#667eea",
  "background_color": "#ffffff",
  "display": "standalone"
}
```

**Checklist**:
- [ ] Logo/icon created (512x512px)
- [ ] All sizes generated
- [ ] Files placed in `frontend/public/`
- [ ] `site.webmanifest` updated
- [ ] Favicon shows in browser tab

---

### [ ] 🔴 Task B.2.2: Create Open Graph (OG) Image
**Time**: 45 minutes

**Requirements**: 1200x630px, PNG, under 100KB

**Design tools**:
- [Canva](https://canva.com) - Easy templates
- [Figma](https://figma.com) - More control
- [OG Image Generator](https://og-image.vercel.app) - Quick option

**Suggested layout**:
```
┌─────────────────────────────────────────────────┐
│                                                 │
│   [Photo]     Your Name                         │
│               AI/ML Engineer                    │
│                                                 │
│   ─────────────────────────────────────         │
│   Building intelligent systems that work        │
│                                                 │
│                       yourportfolio.com         │
└─────────────────────────────────────────────────┘
```

**Steps**:
1. Design image (1200x630px)
2. Export as PNG
3. Compress with [TinyPNG](https://tinypng.com) (under 100KB)
4. Save to `frontend/public/og-image.png`
5. Test with [Facebook Debugger](https://developers.facebook.com/tools/debug/)

**Checklist**:
- [ ] OG image designed
- [ ] Correct dimensions (1200x630px)
- [ ] File optimized (<100KB)
- [ ] Saved to `frontend/public/og-image.png`
- [ ] Tested with sharing tools

---

### [ ] 🔴 Task B.2.3: Get Professional Headshot
**Time**: 30 min - 2 hours

**Option A: Professional Photography** (Best)
- Cost: $100-300
- Find local photographer
- Timeframe: 1-2 weeks

**Option B: AI Headshot** (Quick)
- [HeadshotPro](https://headshotpro.com) - $29
- [Aragon](https://aragon.ai) - $35
- Upload casual photos → get professional results
- Timeframe: 24-48 hours

**Option C: DIY Photo** (Free)
- Natural light (near window)
- Plain background
- Professional attire
- Take 20+ shots, pick best
- Edit with phone or free tools

**Requirements**:
- Square aspect ratio (400x400px minimum)
- Good lighting, clear face
- Professional appearance
- File size: under 100KB

**Save locations**:
- `frontend/public/images/headshot.jpg`
- `frontend/public/images/about-photo.jpg` (can be same or different)

**Checklist**:
- [ ] Headshot obtained
- [ ] Cropped to square
- [ ] Optimized (<100KB)
- [ ] Saved to correct location

---

### [ ] 🔴 Task B.2.4: Create Resume PDF
**Time**: 1-2 hours

**Resume tools**:
- [Overleaf](https://overleaf.com) - LaTeX templates (most professional)
- [FlowCV](https://flowcv.io) - Free, modern
- [Canva](https://canva.com/resumes) - Beautiful templates

**Required sections**:
```
HEADER
├── Full Name
├── Email | Phone | LinkedIn | GitHub
└── Portfolio URL

PROFESSIONAL SUMMARY (2-3 lines)

EXPERIENCE
├── Role | Company | Dates
└── 3-4 bullet points with METRICS

SKILLS
├── Languages: Python, TypeScript...
├── ML/AI: PyTorch, TensorFlow...
└── Tools: Docker, AWS, Git...

EDUCATION

PROJECTS (optional)

CERTIFICATIONS (optional)
```

**Tips**:
- Use action verbs: "Built", "Led", "Reduced"
- Include metrics: "Reduced latency by 40%"
- Keep to 1-2 pages
- ATS-friendly format

**Save to**: `frontend/public/resume.pdf`

**Checklist**:
- [ ] Resume created
- [ ] Proofread by someone else
- [ ] Saved as PDF
- [ ] Placed in `frontend/public/resume.pdf`
- [ ] File size under 500KB

---

## B.3 Content Creation (Phase 1 - Critical)

### [ ] 🔴 Task B.3.1: Write Your Bio & About Content
**Time**: 1 hour

**You need THREE pieces of content**:

**1. SHORT BIO** (for hero section, 2-3 sentences):
```
Example:
"AI/ML Engineer with 5+ years building production machine learning 
systems. I specialize in LLMs, RAG systems, and turning cutting-edge 
research into real-world solutions."
```

**2. EXTENDED SUMMARY** (for about section, 2-3 paragraphs):
```
Example:

I'm a passionate AI/ML Engineer who loves building intelligent 
systems that solve real problems. With a background in [your field], 
I've spent [X] years developing production ML systems.

My expertise spans the full ML lifecycle - from data engineering 
and model development to deployment and monitoring. I'm particularly 
excited about Large Language Models and making AI accessible.

When I'm not coding, you'll find me [hobbies]. I believe in 
continuous learning and sharing knowledge.
```

**3. TAGLINE** (one catchy line):
- "Building AI that works in the real world"
- "From Data to Deployment"
- "Making ML Production-Ready"

**How to update**:
1. Go to Admin: `http://localhost:3000/admin/profile`
2. Fill in all profile fields
3. Save changes
4. Also update `ABOUT.md` file to match

**Checklist**:
- [ ] Short bio written
- [ ] Extended summary written
- [ ] Tagline created
- [ ] Updated via admin dashboard
- [ ] `ABOUT.md` updated

---

### [ ] 🔴 Task B.3.2: Add Your Experience & Education
**Time**: 45 minutes

**Via Admin Dashboard** (`http://localhost:3000/admin/experience`):

**For each job**:
```
Role: Senior ML Engineer
Company: Company Name
Period: Jan 2022 - Present

Achievements:
• Built production RAG system serving 10K+ queries/day
• Reduced model inference time by 60%
• Led team of 3 engineers on chatbot project

Tech Stack: Python, PyTorch, FastAPI, PostgreSQL, Docker
```

**For education** (`/admin/education`):
```
Degree: M.S. Computer Science
School: University Name
Period: 2018 - 2020
Details: Focus on Machine Learning and NLP
```

**For certifications**:
- AWS Machine Learning Specialty
- Google Cloud Professional ML Engineer
- Any relevant certifications

**Checklist**:
- [ ] All work experience added (with metrics!)
- [ ] Education added
- [ ] Certifications added
- [ ] Verified in preview

---

### [ ] 🔴 Task B.3.3: Add Your Real Projects
**Time**: 2-3 hours

**For each project, gather**:

```
Title: AI-Powered Recommendation Engine

Description (50-100 words):
Built a collaborative filtering recommendation system that 
increased user engagement by 35%. Processes millions of 
interactions daily with real-time personalized recommendations.

Tech Stack: Python, TensorFlow, FastAPI, PostgreSQL, Redis

Links:
• GitHub: https://github.com/username/project
• Live Demo: https://demo.example.com

Featured: Yes (for your top 2-3 projects)

Screenshots:
• Save to frontend/public/projects/project-name/
```

**Create screenshots**:
- Take screenshots of your project UI
- Use mockup tools: [Screely](https://screely.com), [MockupBro](https://mockupbro.com)
- Optimize images with TinyPNG

**Add via Admin Dashboard**: `http://localhost:3000/admin/projects`

**Write detailed content** for each project page:
```markdown
## Overview
Brief introduction.

## Problem
What problem were you solving?

## Solution
Technical approach and implementation.

## Results
Metrics, outcomes, impact.

## Lessons Learned
What you'd do differently.
```

**Checklist**:
- [ ] All projects listed
- [ ] Descriptions written with metrics
- [ ] Screenshots/images added
- [ ] GitHub/demo links added
- [ ] 2-3 marked as "Featured"
- [ ] Detailed content for project pages

---

## B.4 Project Screenshots (Phase 1 - Critical)

### [ ] 🔴 Task B.4.1: Create Project Screenshots
**Time**: 1-2 hours

**For each project**:

1. **Take screenshots**:
   - Full page screenshots of key UI states
   - Use browser at 1920x1080 resolution
   - Show the most impressive features

2. **Create mockups** (optional but professional):
   - [Screely](https://screely.com) - Browser mockups
   - [MockupBro](https://mockupbro.com) - Device mockups
   - [Smartmockups](https://smartmockups.com) - Various devices

3. **Optimize images**:
   - Compress with [TinyPNG](https://tinypng.com)
   - Target: under 200KB per image
   - Format: PNG or WebP

4. **Organize files**:
   ```
   frontend/public/projects/
   ├── recommendation-engine/
   │   ├── screenshot-1.png
   │   ├── screenshot-2.png
   │   └── demo.gif (optional)
   ├── chatbot/
   │   └── ...
   └── rag-system/
       └── ...
   ```

**Checklist**:
- [ ] Screenshots taken for all projects
- [ ] Images optimized (<200KB each)
- [ ] Files organized in folders
- [ ] Images referenced in project data

---

## B.5 External Services Setup (Phase 1 - Critical)

### [ ] 🔴 Task B.5.1: Set Up Email Service (Resend)
**Time**: 30 minutes

**Step 1: Create Resend account**
1. Go to [resend.com](https://resend.com)
2. Sign up with email
3. Verify your email

**Step 2: Get API Key**
1. Go to Dashboard → API Keys
2. Click "Create API Key"
3. Copy the key (starts with `re_`)

**Step 3: Add to environment**
```env
# In frontend/.env.local
RESEND_API_KEY=re_xxxxxxxxxxxx
CONTACT_EMAIL=your@email.com
```

**Step 4: (Optional) Verify domain**
- Improves email deliverability
- Go to Domains → Add Domain
- Add DNS records as instructed
- Wait for verification

**Checklist**:
- [ ] Resend account created
- [ ] API key generated
- [ ] Added to `.env.local`
- [ ] Domain verified (optional)

---

## B.6 Analytics Setup (Phase 2 - Important)

### [ ] 🟡 Task B.6.1: Set Up Google Analytics
**Time**: 30 minutes

**Step 1: Create GA4 property**
1. Go to [analytics.google.com](https://analytics.google.com)
2. Create account (if needed)
3. Create new property
4. Set up Web data stream
5. Copy Measurement ID (G-XXXXXXXXXX)

**Step 2: Add to environment**
```env
# In frontend/.env.local
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**Step 3: Verify tracking**
1. Deploy or run locally
2. Visit your site
3. Check GA4 Real-time view
4. Should see yourself as active user

**Alternative: Plausible Analytics** (Privacy-focused)
- [plausible.io](https://plausible.io) - €9/month
- No cookie banner required
- GDPR compliant

**Checklist**:
- [ ] GA4 property created
- [ ] Measurement ID obtained
- [ ] Added to environment variables
- [ ] Tracking verified

---

## B.7 Social Media Optimization (Phase 2 - Important)

### [ ] 🟡 Task B.7.1: Optimize Your GitHub Profile
**Time**: 30 minutes

**Actions**:

1. **Complete profile**:
   - Professional photo (same as portfolio)
   - Clear bio with your specialty
   - Add portfolio URL
   - Add location

2. **Create profile README**:
   - Create repository: `YOUR_USERNAME/YOUR_USERNAME`
   - Add `README.md` with:
     - Introduction
     - Skills/tech stack
     - Featured projects
     - Contact info

3. **Pin best repositories** (up to 6):
   - Most impressive projects
   - Add clear descriptions
   - Add topics/tags

4. **Clean up repositories**:
   - Archive unused repos
   - Add READMEs to all projects
   - Add topics for discoverability

**Checklist**:
- [ ] Profile completed
- [ ] Profile README created
- [ ] 6 best repos pinned
- [ ] All repos have descriptions

---

### [ ] 🟡 Task B.7.2: Optimize LinkedIn Profile
**Time**: 30 minutes

**Actions**:

1. **Update headline**:
   - Current role + specialty
   - Example: "AI/ML Engineer | Building Production ML Systems"

2. **Add portfolio to contact info**:
   - Edit contact info
   - Add website URL

3. **Update Featured section**:
   - Add portfolio link
   - Add key projects
   - Add any articles/posts

4. **Request recommendations**:
   - Ask 2-3 colleagues
   - Use for testimonials on portfolio

**Checklist**:
- [ ] Headline updated
- [ ] Portfolio URL added
- [ ] Featured section updated
- [ ] Recommendations requested

---

### [ ] 🟡 Task B.7.3: Update Portfolio Social Links
**Time**: 10 minutes

**Via Admin Dashboard**: `http://localhost:3000/admin/social-links`

Add all your profiles:
- GitHub (required)
- LinkedIn (required)
- Twitter/X (if active)
- Email
- Any other relevant profiles

**Checklist**:
- [ ] All social links added
- [ ] Links verified working
- [ ] Icons displaying correctly

---

## B.8 Testimonials (Phase 2 - Important)

### [ ] 🟡 Task B.8.1: Collect Testimonials
**Time**: Ongoing (1-2 weeks for responses)

**Step 1: Identify 3-5 people**
- Former managers
- Colleagues you collaborated with
- Clients or stakeholders
- Open source maintainers you contributed to

**Step 2: Send request**
```
Subject: Quick favor - testimonial for my portfolio?

Hi [Name],

Hope you're doing well! I'm updating my professional portfolio 
and would really appreciate a brief testimonial about our work 
together at [Company/Project].

If you have 5 minutes, could you write 2-3 sentences about:
- What we worked on
- My skills or work style  
- Any specific impact

Happy to return the favor!

Best,
[Your name]
```

**Step 3: When received**
- Get permission to use on website
- Ask for current title and company
- Ask for photo (or use LinkedIn with permission)

**Step 4: Add via Admin Dashboard**
- Name, Title, Company
- Photo URL
- Testimonial text

**Checklist**:
- [ ] 3-5 people identified
- [ ] Requests sent
- [ ] Testimonials received (aim for 3+)
- [ ] Added to portfolio

---

## B.9 Deployment (Phase 1 - Critical)

### [ ] 🔴 Task B.9.1: Set Up Production Database
**Time**: 30 minutes

**Recommended options** (all have free tiers):

| Service | Database | Free Tier |
|---------|----------|-----------|
| [PlanetScale](https://planetscale.com) | MySQL | 5GB |
| [Supabase](https://supabase.com) | PostgreSQL | 500MB |
| [Railway](https://railway.app) | PostgreSQL | $5 credit |
| [Neon](https://neon.tech) | PostgreSQL | 3GB |

**Steps (using PlanetScale as example)**:
1. Create account at [planetscale.com](https://planetscale.com)
2. Create new database
3. Get connection string
4. Update `DATABASE_URL` in production environment

**Checklist**:
- [ ] Database service chosen
- [ ] Database created
- [ ] Connection string obtained
- [ ] Tested connection

---

### [ ] 🔴 Task B.9.2: Deploy Frontend to Vercel
**Time**: 45 minutes

**Step 1: Create Vercel account**
- Go to [vercel.com](https://vercel.com)
- Sign up with GitHub (recommended)

**Step 2: Import project**
1. Click "Add New Project"
2. Select your GitHub repository
3. Configure:
   - Framework: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build` (default)

**Step 3: Set environment variables**
Go to Project Settings → Environment Variables:
```
NEXT_PUBLIC_SITE_URL = https://your-domain.vercel.app
DATABASE_URL = your-production-database-url
JWT_SECRET = your-jwt-secret
RESEND_API_KEY = re_xxxxxxxxxxxx
CONTACT_EMAIL = your@email.com
NEXT_PUBLIC_GA_ID = G-XXXXXXXXXX
```

**Step 4: Deploy**
- Click Deploy
- Wait for build to complete
- Test the live site

**Step 5: Connect custom domain** (if purchased)
1. Go to Settings → Domains
2. Add your domain
3. Update DNS at registrar:
   - A Record: `@` → `76.76.21.21`
   - CNAME: `www` → `cname.vercel-dns.com`
4. Wait for SSL (automatic)

**Checklist**:
- [ ] Vercel account created
- [ ] Project imported
- [ ] Environment variables set
- [ ] Build successful
- [ ] Site accessible
- [ ] Custom domain connected (optional)
- [ ] SSL working

---

### [ ] 🟡 Task B.9.3: Deploy Backend (if using FastAPI)
**Time**: 45 minutes

**Option A: Railway** (Recommended)
1. Go to [railway.app](https://railway.app)
2. Create new project
3. Connect GitHub repo
4. Set root directory to `backend`
5. Add environment variables
6. Deploy

**Option B: Render**
1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repo
4. Configure build command: `pip install -r requirements.txt`
5. Configure start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

**After deployment**:
- Update `NEXT_PUBLIC_API_URL` in frontend
- Redeploy frontend

**Checklist**:
- [ ] Backend platform chosen
- [ ] Backend deployed
- [ ] API accessible
- [ ] Frontend updated with API URL
- [ ] End-to-end test passed

---

## B.10 Content Creation (Phase 3 - Nice-to-have)

### [ ] 🟢 Task B.10.1: Write Blog Posts
**Time**: 4-8 hours per post

**Suggested AI/ML topics**:
- "Building Production RAG Systems: Lessons Learned"
- "Fine-tuning LLMs: A Practical Guide"
- "From Jupyter to Production: MLOps Best Practices"
- "Prompt Engineering Patterns That Work"

**Post structure**:
```markdown
# Title

Introduction (hook the reader)

## The Problem
What are you addressing?

## The Solution
Your approach with code examples

## Implementation
Step-by-step guide

## Results & Lessons
What you learned

## Conclusion
Summary and call-to-action
```

**Checklist**:
- [ ] 2-3 topics chosen
- [ ] First post written
- [ ] Published via admin
- [ ] Shared on social media

---

### [ ] 🟢 Task B.10.2: Create Project Demo Videos
**Time**: 2-4 hours per video

**Tools needed**:
- Screen recording: OBS Studio (free), Loom
- Editing: DaVinci Resolve (free), iMovie
- Microphone: USB mic or built-in

**Video structure** (2-3 min max):
- **Hook** (15 sec): What does this do?
- **Problem** (30 sec): What problem does it solve?
- **Demo** (1-2 min): Show it working
- **Tech** (30 sec): Brief architecture
- **Results** (15 sec): Metrics

**Tips**:
- Write script first
- Do 2-3 takes
- Add captions
- Host on YouTube

**Checklist**:
- [ ] Recording setup ready
- [ ] Script written
- [ ] Video recorded
- [ ] Edited and uploaded
- [ ] Embedded in portfolio

---

### [ ] 🟢 Task B.10.3: Translate Content (if adding i18n)
**Time**: Varies

**After agent sets up i18n structure**:
1. Identify target languages
2. Translate content yourself or hire translator
3. Add translation JSON files
4. Test all pages

---

## B.11 Ongoing Maintenance (Phase 4)

### [ ] 🟡 Task B.11.1: Monthly Content Updates
**Frequency**: Monthly

**Checklist**:
- [ ] Add new projects
- [ ] Update skills
- [ ] Refresh bio if needed
- [ ] Add certifications
- [ ] Update resume PDF
- [ ] Write blog post

---

### [ ] 🟡 Task B.11.2: Monthly Performance Check
**Frequency**: Monthly

**Run these checks**:
1. [PageSpeed Insights](https://pagespeed.web.dev/) - Target: 90+
2. [Lighthouse](https://developers.google.com/web/tools/lighthouse) - All metrics 90+
3. Check Core Web Vitals in Google Search Console

**Target metrics**:
| Metric | Target |
|--------|--------|
| Performance | > 90 |
| Accessibility | > 95 |
| Best Practices | > 95 |
| SEO | > 95 |

---

### [ ] 🟡 Task B.11.3: Quarterly Security Audit
**Frequency**: Every 3 months

**Run these commands**:
```powershell
cd frontend
npm audit
npm audit fix
npm outdated
npm update
```

**Also**:
- Rotate JWT secret
- Update API keys if needed
- Review access logs

---

---

# Progress Tracker

## Summary by Type

| Type | Total | Completed |
|------|-------|-----------|
| 🤖 Agent Tasks | 27 | 0 |
| 👤 Manual Tasks | 22 | 0 |
| **Total** | **49** | **0** |

## Summary by Phase

| Phase | 🤖 Agent | 👤 Manual | Total |
|-------|----------|-----------|-------|
| Phase 1: Critical | 9 | 10 | 19 |
| Phase 2: Important | 12 | 6 | 18 |
| Phase 3: Nice-to-have | 5 | 3 | 8 |
| Phase 4: Ongoing | 3 | 3 | 6 |

---

## Agent Tasks Checklist (PART A)

### Phase 1 - Critical 🔴
- [ ] A.1.1: Create environment variable system
- [ ] A.1.2: Update document head with favicon links
- [ ] A.2.1: Fix CORS configuration
- [ ] A.2.2: Add CSRF protection
- [ ] A.2.3: Implement rate limiting
- [ ] A.2.4: Add security headers
- [ ] A.3.1: Create dynamic sitemap
- [ ] A.3.2: Create dynamic robots.txt
- [ ] A.4.1: Implement email sending

### Phase 2 - Important 🟡
- [ ] A.5.1: Implement dark mode
- [ ] A.5.2: Add skip-to-content link
- [ ] A.5.3: Add loading skeletons
- [ ] A.5.4: Add scroll animations
- [ ] A.5.5: Add active nav highlighting
- [ ] A.6.1: Create testimonials section
- [ ] A.6.2: Create blog structure
- [ ] A.6.3: Add skills progress bars
- [ ] A.6.4: Add project filtering
- [ ] A.6.5: Add GitHub widget
- [ ] A.7.1: Implement Google Analytics
- [ ] A.8.1: Optimize images
- [ ] A.8.2: Add structured data

### Phase 3 - Nice-to-have 🟢
- [ ] A.9.1: Add page transitions
- [ ] A.9.2: Add hero animations
- [ ] A.9.3: Add PDF export
- [ ] A.9.4: Set up i18n
- [ ] A.9.5: Add admin analytics

### Phase 4 - Maintenance
- [ ] A.10.1: Set up Dependabot
- [ ] A.10.2: Add health check endpoint
- [ ] A.10.3: Add Sentry error tracking

---

## Manual Tasks Checklist (PART B)

### Phase 1 - Critical 🔴
- [ ] B.1.1: Choose domain
- [ ] B.1.2: Create environment files
- [ ] B.2.1: Create favicon & icons
- [ ] B.2.2: Create OG image
- [ ] B.2.3: Get professional headshot
- [ ] B.2.4: Create resume PDF
- [ ] B.3.1: Write bio & about
- [ ] B.3.2: Add experience & education
- [ ] B.3.3: Add real projects
- [ ] B.4.1: Create project screenshots
- [ ] B.5.1: Set up email service
- [ ] B.9.1: Set up production database
- [ ] B.9.2: Deploy to Vercel

### Phase 2 - Important 🟡
- [ ] B.6.1: Set up Google Analytics
- [ ] B.7.1: Optimize GitHub profile
- [ ] B.7.2: Optimize LinkedIn
- [ ] B.7.3: Update social links
- [ ] B.8.1: Collect testimonials
- [ ] B.9.3: Deploy backend

### Phase 3 - Nice-to-have 🟢
- [ ] B.10.1: Write blog posts
- [ ] B.10.2: Create demo videos
- [ ] B.10.3: Translate content

### Phase 4 - Maintenance
- [ ] B.11.1: Monthly content updates
- [ ] B.11.2: Monthly performance check
- [ ] B.11.3: Quarterly security audit

---

#### [ ] 🔴 🤖 Task 1.1.1: Create Environment Variable System
**Time**: 15 minutes

**What the agent will do**:
- Create `frontend/.env.example` with template variables
- Create `backend/.env.example` with template variables
- Update `SEO.tsx` to use `NEXT_PUBLIC_SITE_URL` instead of hardcoded URL
- Update `sitemap.xml` generation to be dynamic
- Update `robots.txt` to use environment variable for sitemap URL
- Create `lib/config.ts` utility for centralized configuration

---

#### [ ] 🔴 👤 Task 1.1.2: Configure Your Environment Variables
**Time**: 15 minutes

**What YOU need to do**:

1. **Choose your domain**:
   - Custom domain: `yourname.com` (purchase from Namecheap, Cloudflare, Google Domains)
   - Free option: `yourname.vercel.app` (provided by Vercel)

2. **Create `frontend/.env.local`** (copy from `.env.example` after agent creates it):
   ```env
   # Your actual production domain
   NEXT_PUBLIC_SITE_URL=https://your-actual-domain.com
   
   # API URL (use localhost for development)
   NEXT_PUBLIC_API_URL=http://localhost:8000
   
   # Database (Prisma)
   DATABASE_URL="file:./dev.db"
   
   # JWT Secret (generate a random 32+ character string)
   JWT_SECRET=your-super-secret-jwt-key-here-min-32-chars
   
   # Email service (after setting up Resend/SendGrid)
   RESEND_API_KEY=re_xxxxxxxxxxxx
   CONTACT_EMAIL=your@email.com
   ```

3. **Create `backend/.env.local`**:
   ```env
   # Frontend URL for CORS
   FRONTEND_URL=https://your-actual-domain.com
   
   # Allowed origins (comma-separated)
   ALLOWED_ORIGINS=https://your-actual-domain.com,http://localhost:3000
   
   # Agent feature toggle
   AGENT_ENABLED=false
   ```

4. **Generate JWT Secret** (run in terminal):
   ```powershell
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

5. **IMPORTANT**: Never commit `.env.local` files to git!

**Checklist**:
- [ ] Domain decided
- [ ] `frontend/.env.local` created
- [ ] `backend/.env.local` created
- [ ] JWT secret generated and added
- [ ] Tested locally with new variables

---

### 1.2 Missing Static Assets

#### [ ] 🔴 🤖 Task 1.2.1: Create Favicon & Icons Structure
**Time**: 20 minutes

**What the agent will do**:
- Create placeholder `site.webmanifest` file
- Update `_document.tsx` to include all favicon link tags
- Add meta tags for theme color and app name
- Create public folder structure for icons

---

#### [ ] 🔴 👤 Task 1.2.2: Create Your Favicon & Icons
**Time**: 30 minutes

**What YOU need to do**:

1. **Create or obtain a logo/icon** (512x512px PNG):
   - Design yourself using Figma, Canva, or Photoshop
   - Or use your initials as a simple logo
   - Or hire on Fiverr ($5-50)

2. **Generate all icon sizes** using [RealFaviconGenerator](https://realfavicongenerator.net/):
   - Upload your 512x512 image
   - Configure settings (background color, etc.)
   - Download the generated package

3. **Extract and place files** in `frontend/public/`:
   ```
   frontend/public/
   ├── favicon.ico
   ├── favicon-16x16.png
   ├── favicon-32x32.png
   ├── apple-touch-icon.png (180x180)
   ├── android-chrome-192x192.png
   ├── android-chrome-512x512.png
   └── site.webmanifest (update with your info)
   ```

4. **Update `site.webmanifest`** with your details:
   ```json
   {
     "name": "Your Name - Portfolio",
     "short_name": "Portfolio",
     "icons": [
       { "src": "/android-chrome-192x192.png", "sizes": "192x192", "type": "image/png" },
       { "src": "/android-chrome-512x512.png", "sizes": "512x512", "type": "image/png" }
     ],
     "theme_color": "#667eea",
     "background_color": "#ffffff",
     "display": "standalone"
   }
   ```

**Checklist**:
- [ ] Logo/icon designed (512x512px)
- [ ] All sizes generated via RealFaviconGenerator
- [ ] Files placed in `frontend/public/`
- [ ] `site.webmanifest` updated
- [ ] Favicon shows in browser tab

---

#### [ ] 🔴 👤 Task 1.2.3: Create Open Graph Image
**Time**: 45 minutes

**What YOU need to do**:

1. **Design OG image** (1200x630px):
   - Tools: [Canva](https://canva.com), Figma, Photoshop
   - Include: Your name, title, maybe photo
   - Style: Match your portfolio's colors/design

2. **Suggested layout**:
   ```
   ┌────────────────────────────────────────────┐
   │                                            │
   │   [Your Photo]     Your Name               │
   │                    AI/ML Engineer          │
   │                                            │
   │   ───────────────────────────────────      │
   │   Building intelligent systems             │
   │                                            │
   │                    yourportfolio.com       │
   └────────────────────────────────────────────┘
   ```

3. **Export and optimize**:
   - Save as PNG: `frontend/public/og-image.png`
   - Optimize with [TinyPNG](https://tinypng.com/) (keep under 100KB)

4. **Test with**:
   - [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
   - [Twitter Card Validator](https://cards-dev.twitter.com/validator)
   - [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

**Checklist**:
- [ ] OG image designed (1200x630px)
- [ ] File optimized (<100KB)
- [ ] Saved to `frontend/public/og-image.png`
- [ ] Tested with sharing debugger tools

---

#### [ ] 🔴 👤 Task 1.2.4: Create Your Resume PDF
**Time**: 1-2 hours

**What YOU need to do**:

1. **Create professional resume**:
   - Tools: [Overleaf](https://overleaf.com) (LaTeX), [FlowCV](https://flowcv.io), [Canva](https://canva.com/resumes)
   - Length: 1-2 pages maximum
   - Format: Clean, ATS-friendly

2. **Required sections**:
   ```
   HEADER
   - Full Name
   - Email | Phone | LinkedIn | GitHub | Portfolio URL
   
   PROFESSIONAL SUMMARY (2-3 lines)
   - Who you are, what you do, key achievements
   
   EXPERIENCE
   - Role | Company | Dates
   - 3-4 bullet points with metrics
   
   SKILLS
   - Languages: Python, TypeScript, SQL...
   - ML/AI: PyTorch, TensorFlow, LangChain...
   - Tools: Docker, AWS, Git...
   
   EDUCATION
   - Degree | University | Year
   
   PROJECTS (optional)
   - Key projects with brief descriptions
   
   CERTIFICATIONS (optional)
   - Relevant certifications
   ```

3. **Pro tips**:
   - Use action verbs: "Built", "Led", "Reduced", "Implemented"
   - Include metrics: "Reduced latency by 40%", "Increased accuracy to 95%"
   - Tailor to AI/ML roles
   - Proofread multiple times!

4. **Save and place**:
   - Export as PDF
   - Save to `frontend/public/resume.pdf`
   - File size: Keep under 500KB

**Checklist**:
- [ ] Resume created and proofread
- [ ] Saved as PDF
- [ ] Placed in `frontend/public/resume.pdf`
- [ ] Download button tested

---

### 1.3 Profile Content

#### [ ] 🔴 👤 Task 1.3.1: Get Professional Headshot
**Time**: 30 min - 2 hours

**What YOU need to do**:

**Option A: Professional Photographer** (Best quality)
- Cost: $100-300
- Book a headshot session
- Get digital files
- Timeframe: 1-2 weeks

**Option B: AI Headshot** (Quick & affordable)
- Services: [HeadshotPro](https://headshotpro.com), [Aragon](https://aragon.ai)
- Cost: $20-50
- Upload casual photos, get professional results
- Timeframe: 24-48 hours

**Option C: DIY Photo** (Free)
- Requirements:
  - Natural light (near window, overcast day)
  - Plain background (wall, backdrop)
  - Good camera/smartphone
  - Professional attire
- Tips:
  - Take 20+ photos, choose best
  - Eye level, slight smile
  - Shoulders at slight angle

**Image specifications**:
- Dimensions: 400x400px minimum (square)
- Format: JPG or WebP
- File size: Under 100KB (use TinyPNG)
- Save to: `frontend/public/images/headshot.jpg`

**Also create about section image**:
- Can be same as headshot or different (working, casual professional)
- Save to: `frontend/public/images/about-photo.jpg`

**Checklist**:
- [ ] Headshot obtained
- [ ] Cropped to square (400x400px+)
- [ ] Optimized (<100KB)
- [ ] Saved to `frontend/public/images/headshot.jpg`
- [ ] About photo saved to `frontend/public/images/about-photo.jpg`

---

#### [ ] 🔴 👤 Task 1.3.2: Write Your Bio & About Content
**Time**: 1 hour

**What YOU need to do**:

1. **Write SHORT BIO** (for hero section, 2-3 sentences):
   ```
   Example:
   "AI/ML Engineer with 5+ years of experience building production 
   machine learning systems. I specialize in LLMs, RAG systems, and 
   turning cutting-edge research into real-world solutions."
   ```

2. **Write EXTENDED SUMMARY** (for about section, 2-3 paragraphs):
   ```
   Example:
   
   I'm a passionate AI/ML Engineer who loves building intelligent 
   systems that solve real problems. With a background in [your background], 
   I've spent the last [X] years developing production ML systems for 
   companies like [companies or industries].
   
   My expertise spans the full ML lifecycle - from data engineering and 
   model development to deployment and monitoring. I'm particularly 
   excited about Large Language Models, Retrieval-Augmented Generation, 
   and making AI accessible and reliable for end users.
   
   When I'm not coding, you'll find me [hobbies/interests]. I believe 
   in continuous learning and love sharing knowledge through [blog/talks/open source].
   ```

3. **Write your TAGLINE** (one catchy line):
   - "Building AI that works in the real world"
   - "From Data to Deployment"
   - "Making ML Production-Ready"

4. **Update via Admin Dashboard**:
   - Go to `http://localhost:3000/admin/profile`
   - Update all profile fields
   - Save changes

5. **Also update `ABOUT.md`** to match your new content

**Checklist**:
- [ ] Short bio written (2-3 sentences)
- [ ] Extended summary written (2-3 paragraphs)
- [ ] Tagline created
- [ ] Updated via admin dashboard
- [ ] `ABOUT.md` updated
- [ ] Verified content displays correctly

---

#### [ ] 🔴 👤 Task 1.3.3: Add Your Experience & Education
**Time**: 45 minutes

**What YOU need to do**:

1. **List your work experience** (via admin dashboard):
   
   For each position:
   ```
   Role: Senior ML Engineer
   Company: Company Name
   Period: Jan 2022 - Present
   
   Achievements (use bullet points):
   - Built production RAG system serving 10K+ queries/day
   - Reduced model inference time by 60% through optimization
   - Led team of 3 engineers on chatbot project
   
   Tech Stack: Python, PyTorch, FastAPI, PostgreSQL, Docker
   ```

2. **Add education**:
   ```
   Degree: M.S. Computer Science
   School: University Name
   Period: 2018 - 2020
   Details: Focus on Machine Learning and NLP
   ```

3. **Add certifications** (if any):
   - AWS Machine Learning Specialty
   - Google Cloud Professional ML Engineer
   - Deep Learning Specialization (Coursera)

**Checklist**:
- [ ] All work experience added
- [ ] Education added
- [ ] Certifications added
- [ ] Verified in preview

---

### 1.4 Security Fixes

#### [ ] 🔴 🤖 Task 1.4.1: Fix CORS Configuration
**Time**: 15 minutes

**What the agent will do**:
- Update `backend/main.py` CORS middleware
- Use environment variable for allowed origins
- Restrict to only your domain(s)
- Add proper error handling

---

#### [ ] 🔴 🤖 Task 1.4.2: Add CSRF Protection
**Time**: 25 minutes

**What the agent will do**:
- Create CSRF token generation utility
- Add token endpoint in API
- Update contact form to include CSRF token
- Validate token on submission

---

#### [ ] 🔴 🤖 Task 1.4.3: Implement Rate Limiting
**Time**: 25 minutes

**What the agent will do**:
- Install and configure `slowapi` for FastAPI
- Add rate limiting to contact form (5 requests/hour/IP)
- Add rate limiting to other sensitive endpoints
- Return user-friendly error messages

---

#### [ ] 🔴 🤖 Task 1.4.4: Add Security Headers
**Time**: 15 minutes

**What the agent will do**:
- Add security headers in `next.config.js`
- Include: X-Frame-Options, X-Content-Type-Options, etc.
- Configure Content Security Policy basics

---

### 1.5 SEO Fixes

#### [ ] 🔴 🤖 Task 1.5.1: Create Dynamic Sitemap
**Time**: 30 minutes

**What the agent will do**:
- Create `pages/sitemap.xml.tsx` for dynamic generation
- Include all static pages
- Include all project pages dynamically
- Set proper lastmod dates
- Remove static `sitemap.xml`

---

#### [ ] 🔴 🤖 Task 1.5.2: Update Robots.txt Generation
**Time**: 15 minutes

**What the agent will do**:
- Create dynamic `robots.txt` generation
- Use environment variable for sitemap URL
- Ensure proper Allow/Disallow rules

---

### 1.6 Projects Content

#### [ ] 🔴 👤 Task 1.6.1: Add Your Real Projects
**Time**: 2-3 hours

**What YOU need to do**:

1. **Gather information for each project**:
   ```
   Title: AI-Powered Recommendation Engine
   
   Description (50-100 words):
   Built a collaborative filtering recommendation system that increased 
   user engagement by 35%. The system processes millions of user 
   interactions daily and provides personalized recommendations in 
   real-time using matrix factorization and neural networks.
   
   Tech Stack: Python, TensorFlow, FastAPI, PostgreSQL, Redis, Docker
   
   Links:
   - GitHub: https://github.com/username/project
   - Live Demo: https://demo.example.com (if available)
   
   Featured: Yes (for top 3 projects)
   
   Detailed Content (for project page):
   [Write 500-1000 words about the project, challenges, solutions, results]
   ```

2. **Create/gather screenshots**:
   - Take screenshots of your project UI
   - Use browser mockup tools: [Screely](https://screely.com), [MockupBro](https://mockupbro.com)
   - Save to `frontend/public/projects/project-name/`

3. **Add via Admin Dashboard**:
   - Go to `http://localhost:3000/admin/projects`
   - Add each project with all details
   - Upload images
   - Mark 2-3 as "Featured"

4. **Write detailed content** for each project page (Markdown):
   ```markdown
   ## Overview
   Brief introduction to the project.
   
   ## Problem
   What problem were you solving?
   
   ## Solution
   How did you solve it? Technical approach.
   
   ## Architecture
   System design, key components.
   
   ## Results
   Metrics, outcomes, impact.
   
   ## Lessons Learned
   What you'd do differently.
   ```

**Checklist**:
- [ ] All projects listed with descriptions
- [ ] Screenshots/images added
- [ ] GitHub/demo links added
- [ ] Tech stacks listed
- [ ] Featured projects marked
- [ ] Detailed content written

---

### 1.7 Contact Form Setup

#### [ ] 🔴 👤 Task 1.7.1: Set Up Email Service
**Time**: 45 minutes

**What YOU need to do**:

1. **Choose email service** (recommended: Resend):
   
   | Service | Free Tier | Setup Difficulty |
   |---------|-----------|------------------|
   | [Resend](https://resend.com) | 3,000/month | Easy ⭐ |
   | [SendGrid](https://sendgrid.com) | 100/day | Medium |
   | [Mailgun](https://mailgun.com) | 5,000/month | Medium |

2. **Set up Resend** (recommended):
   - Go to [resend.com](https://resend.com)
   - Sign up with email
   - Go to API Keys → Create API Key
   - Copy the key (starts with `re_`)

3. **Add to environment variables**:
   ```env
   # In frontend/.env.local
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
   CONTACT_EMAIL=your-email@example.com
   ```

4. **(Optional) Verify your domain** for better deliverability:
   - In Resend dashboard → Domains → Add Domain
   - Add DNS records as instructed
   - Wait for verification (5-30 minutes)

**Checklist**:
- [ ] Email service account created
- [ ] API key generated
- [ ] Added to `.env.local`
- [ ] Domain verified (optional but recommended)

---

#### [ ] 🔴 🤖 Task 1.7.2: Implement Email Sending
**Time**: 30 minutes

**What the agent will do**:
- Install Resend package
- Update contact API to send actual emails
- Format email nicely with contact details
- Add error handling and validation
- Send confirmation to user (optional)

---

### 1.8 Deployment

#### [ ] 🔴 👤 Task 1.8.1: Deploy to Vercel
**Time**: 1-2 hours

**What YOU need to do**:

1. **Create Vercel account**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub (recommended)

2. **Import project**:
   - Click "Add New Project"
   - Select your GitHub repository
   - Configure:
     - Framework: Next.js
     - Root Directory: `frontend`
     - Build Command: `npm run build`

3. **Set environment variables** in Vercel:
   - Go to Project Settings → Environment Variables
   - Add all variables from your `.env.local`:
   ```
   NEXT_PUBLIC_SITE_URL = https://your-domain.vercel.app
   NEXT_PUBLIC_API_URL = https://your-backend-url
   DATABASE_URL = your-production-database-url
   JWT_SECRET = your-jwt-secret
   RESEND_API_KEY = your-resend-key
   CONTACT_EMAIL = your@email.com
   ```

4. **Set up production database**:
   - Option A: [PlanetScale](https://planetscale.com) (MySQL, free tier)
   - Option B: [Supabase](https://supabase.com) (PostgreSQL, free tier)
   - Option C: [Railway](https://railway.app) (PostgreSQL, free tier)
   - Option D: [Neon](https://neon.tech) (PostgreSQL, free tier)

5. **Connect custom domain** (optional):
   - In Vercel: Settings → Domains
   - Add your domain
   - Update DNS at your registrar:
     - A Record: `@` → `76.76.21.21`
     - CNAME: `www` → `cname.vercel-dns.com`

6. **Deploy backend** (if using FastAPI):
   - Option A: [Railway](https://railway.app)
   - Option B: [Render](https://render.com)
   - Option C: [Fly.io](https://fly.io)

**Checklist**:
- [ ] Vercel account created
- [ ] Project imported
- [ ] Environment variables set
- [ ] Production database set up
- [ ] Frontend deployed and working
- [ ] Backend deployed (if applicable)
- [ ] Custom domain configured (optional)
- [ ] SSL working (automatic with Vercel)

---

## Phase 2: Core Enhancements (Week 2-3)

> **Goal**: Add polish, better UX, and professional features

---

### 2.1 UI/UX Improvements

#### [ ] 🟡 🤖 Task 2.1.1: Implement Dark Mode
**Time**: 1.5 hours

**What the agent will do**:
- Create theme context with localStorage persistence
- Add dark mode toggle button to navigation
- Define dark color scheme in Tailwind
- Add smooth transition between modes
- Respect `prefers-color-scheme` system preference

---

#### [ ] 🟡 🤖 Task 2.1.2: Add Skip-to-Content Link
**Time**: 15 minutes

**What the agent will do**:
- Add hidden skip link as first focusable element
- Style to be visible only on focus
- Link to main content area
- Improves accessibility (WCAG compliance)

---

#### [ ] 🟡 🤖 Task 2.1.3: Add Loading Skeletons
**Time**: 45 minutes

**What the agent will do**:
- Create skeleton components for cards, text, images
- Replace "Loading..." text with skeleton UI
- Add shimmer animation effect
- Implement for all data-fetching components

---

#### [ ] 🟡 🤖 Task 2.1.4: Add Scroll-Triggered Animations
**Time**: 1 hour

**What the agent will do**:
- Implement Intersection Observer for sections
- Add fade-in animations when sections come into view
- Stagger animations for list items
- Respect `prefers-reduced-motion`

---

#### [ ] 🟡 🤖 Task 2.1.5: Add Active Section Highlighting in Nav
**Time**: 30 minutes

**What the agent will do**:
- Track current section via scroll position
- Highlight active nav item
- Smooth transitions between states

---

### 2.2 New Sections

#### [ ] 🟡 🤖 Task 2.2.1: Create Testimonials Section
**Time**: 1.5 hours

**What the agent will do**:
- Add Testimonial model to Prisma schema
- Create testimonial card component
- Build testimonials section with carousel/grid
- Add to admin dashboard for management

---

#### [ ] 🟡 👤 Task 2.2.2: Collect Testimonials
**Time**: Ongoing (1-2 weeks)

**What YOU need to do**:

1. **Identify 3-5 people to ask**:
   - Former managers
   - Colleagues you worked with
   - Clients or stakeholders
   - Open source maintainers you contributed to

2. **Send request** (email or LinkedIn):
   ```
   Subject: Quick favor - testimonial for my portfolio?
   
   Hi [Name],
   
   Hope you're doing well! I'm updating my portfolio and would love 
   a brief testimonial about our work together at [Company/Project].
   
   If you have 5 minutes, could you write 2-3 sentences about:
   - What we worked on
   - My skills or work style
   - Any specific impact
   
   Happy to return the favor anytime!
   
   Thanks,
   [Your name]
   ```

3. **When received**:
   - Get permission to use on website
   - Ask for their current title and company
   - Ask for a photo (or use LinkedIn photo with permission)

4. **Add via Admin Dashboard**:
   - Name, Title, Company
   - Photo URL
   - Testimonial text

**Checklist**:
- [ ] 3-5 people identified
- [ ] Requests sent
- [ ] Testimonials received
- [ ] Added to portfolio

---

#### [ ] 🟡 🤖 Task 2.2.3: Create Blog Section Structure
**Time**: 2 hours

**What the agent will do**:
- Add Post model to Prisma schema
- Create blog index page `/blog`
- Create blog post page `/blog/[slug]`
- Add MDX support for rich content
- Include reading time calculation
- Add to admin dashboard

---

#### [ ] 🟡 🤖 Task 2.2.4: Add Skills Progress Bars
**Time**: 45 minutes

**What the agent will do**:
- Add proficiency level field to Skill model
- Create animated progress bar component
- Update skills section with visual bars
- Group by category with proper hierarchy

---

### 2.3 Enhanced Features

#### [ ] 🟡 🤖 Task 2.3.1: Add Project Filtering & Search
**Time**: 1.5 hours

**What the agent will do**:
- Add filter buttons for tech categories
- Implement search by title/description
- Add URL query params for shareable filters
- Smooth filter animations

---

#### [ ] 🟡 🤖 Task 2.3.2: Add GitHub Activity Widget
**Time**: 1 hour

**What the agent will do**:
- Integrate GitHub contribution graph
- Show recent repositories/activity
- Cache data to avoid rate limits
- Link to GitHub profile

---

#### [ ] 🟡 👤 Task 2.3.3: Set Up Google Analytics
**Time**: 30 minutes

**What YOU need to do**:

1. **Create GA4 property**:
   - Go to [analytics.google.com](https://analytics.google.com)
   - Create account if needed
   - Create new property
   - Set up web data stream
   - Copy Measurement ID (G-XXXXXXXXXX)

2. **Add to environment variables**:
   ```env
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

3. **Agent will implement** the tracking code

**Checklist**:
- [ ] GA4 property created
- [ ] Measurement ID obtained
- [ ] Added to environment variables
- [ ] Tracking verified in GA4 Real-time view

---

#### [ ] 🟡 🤖 Task 2.3.4: Implement Google Analytics Code
**Time**: 30 minutes

**What the agent will do**:
- Add GA4 script to `_document.tsx`
- Create analytics utility functions
- Track page views
- Add event tracking for key actions
- Respect Do Not Track preference

---

### 2.4 Performance & SEO

#### [ ] 🟡 🤖 Task 2.4.1: Optimize Images
**Time**: 45 minutes

**What the agent will do**:
- Configure Next.js Image component properly
- Add blur placeholders for images
- Set up proper image domains in config
- Implement lazy loading
- Add WebP format support

---

#### [ ] 🟡 🤖 Task 2.4.2: Add Structured Data for Projects
**Time**: 30 minutes

**What the agent will do**:
- Add Article schema for project pages
- Add BreadcrumbList schema
- Improve existing Person schema
- Test with Google Rich Results Test

---

#### [ ] 🟡 👤 Task 2.4.3: Optimize Social Media Profiles
**Time**: 1 hour

**What YOU need to do**:

1. **GitHub Profile**:
   - Complete bio with portfolio link
   - Add profile README (create `username/username` repo)
   - Pin your best 6 repositories
   - Add topics to all repos

2. **LinkedIn**:
   - Update headline with your title
   - Add portfolio link to contact info
   - Update featured section with projects
   - Request recommendations

3. **Twitter/X** (optional):
   - Add portfolio link to bio
   - Pin a tweet about your work

4. **Update social links** in admin dashboard

**Checklist**:
- [ ] GitHub profile optimized
- [ ] LinkedIn updated
- [ ] Other socials updated
- [ ] Links added to portfolio

---

## Phase 3: Advanced Features (Week 4+)

> **Goal**: Add impressive features that differentiate your portfolio

---

### 3.1 Content Creation

#### [ ] 🟢 👤 Task 3.1.1: Write Blog Posts
**Time**: 4-8 hours per post

**What YOU need to do**:

1. **Choose topics** (AI/ML focused):
   - "Building Production RAG Systems: Lessons Learned"
   - "Fine-tuning LLMs: A Practical Guide"
   - "From Jupyter to Production: MLOps Best Practices"
   - "Prompt Engineering Patterns That Work"

2. **Write using this structure**:
   ```markdown
   # Title
   
   Introduction (hook the reader)
   
   ## The Problem
   What issue are you addressing?
   
   ## The Solution
   Your approach, with code examples
   
   ## Implementation Details
   Step-by-step guide
   
   ## Results & Lessons
   What you learned
   
   ## Conclusion
   Summary and call-to-action
   ```

3. **Add via Admin Dashboard** or create `.md` files

**Checklist**:
- [ ] 2-3 blog post ideas chosen
- [ ] First post written
- [ ] Post published
- [ ] Shared on social media

---

#### [ ] 🟢 👤 Task 3.1.2: Create Project Demo Videos
**Time**: 2-4 hours per video

**What YOU need to do**:

1. **Tools needed**:
   - Screen recording: OBS Studio (free), Loom, or QuickTime
   - Editing: DaVinci Resolve (free), iMovie, or Premiere
   - Microphone: Any USB mic or built-in

2. **Video structure** (2-3 minutes max):
   - Hook: What does this do? (15 sec)
   - Problem: What problem does it solve? (30 sec)
   - Demo: Show it working (1-2 min)
   - Tech: Brief architecture overview (30 sec)
   - Results: Metrics and impact (15 sec)

3. **Tips**:
   - Write script or bullet points first
   - Do 2-3 takes, pick the best
   - Add captions (accessibility + engagement)
   - Host on YouTube (unlisted or public)

4. **Embed in project pages**

**Checklist**:
- [ ] Recording setup ready
- [ ] Script written
- [ ] Video recorded and edited
- [ ] Uploaded to YouTube
- [ ] Embedded in portfolio

---

### 3.2 Advanced UI

#### [ ] 🟢 🤖 Task 3.2.1: Add Page Transitions
**Time**: 1.5 hours

**What the agent will do**:
- Install and configure Framer Motion
- Add page transition animations
- Create smooth enter/exit effects
- Keep transitions under 300ms

---

#### [ ] 🟢 🤖 Task 3.2.2: Add Hero Section Animations
**Time**: 2 hours

**What the agent will do**:
- Add animated gradient background
- Create floating particle effects
- Add typing animation for tagline
- Implement scroll indicator

---

#### [ ] 🟢 🤖 Task 3.2.3: Add PDF Portfolio Export
**Time**: 2.5 hours

**What the agent will do**:
- Create print-friendly portfolio view
- Generate PDF using react-pdf
- Include key sections, projects, contact
- Add download button

---

### 3.3 Internationalization

#### [ ] 🟢 🤖 Task 3.3.1: Set Up i18n Structure
**Time**: 3 hours

**What the agent will do**:
- Install and configure next-i18next
- Create translation file structure
- Add language switcher component
- Set up English as default

---

#### [ ] 🟢 👤 Task 3.3.2: Translate Content
**Time**: Varies by language

**What YOU need to do**:
- Identify target languages
- Translate content (or hire translator)
- Add translation files
- Test all pages in each language

---

### 3.4 Admin Enhancements

#### [ ] 🟢 🤖 Task 3.4.1: Add Analytics Dashboard
**Time**: 4 hours

**What the agent will do**:
- Create admin analytics page
- Display page views, popular content
- Show contact form submissions
- Add charts with Recharts
- Pull data from GA4 API (if configured)

---

## Phase 4: Ongoing Maintenance

> **Goal**: Keep portfolio current, secure, and performing well

---

### 4.1 Regular Tasks

#### [ ] 🟡 👤 Task 4.1.1: Monthly Content Updates
**Frequency**: Monthly

**Checklist**:
- [ ] Add new projects as completed
- [ ] Update skills with new technologies
- [ ] Refresh bio if role changes
- [ ] Add new certifications
- [ ] Update resume PDF
- [ ] Publish new blog posts

---

#### [ ] 🟡 👤 Task 4.1.2: Monthly Performance Check
**Frequency**: Monthly

**What YOU need to do**:

1. **Run Lighthouse audit**:
   - Open DevTools → Lighthouse
   - Run audit on desktop and mobile
   - Target: 90+ on all metrics

2. **Check Core Web Vitals**:
   - [PageSpeed Insights](https://pagespeed.web.dev/)
   - Target: LCP < 2.5s, FID < 100ms, CLS < 0.1

3. **Fix any issues found**

**Checklist**:
- [ ] Lighthouse audit run
- [ ] Core Web Vitals checked
- [ ] Issues addressed

---

#### [ ] 🟡 👤 Task 4.1.3: Quarterly Security Audit
**Frequency**: Every 3 months

**What YOU need to do**:

1. **Run dependency audit**:
   ```powershell
   cd frontend
   npm audit
   npm audit fix
   ```

2. **Update dependencies**:
   ```powershell
   npm outdated
   npm update
   ```

3. **Rotate secrets**:
   - Generate new JWT secret
   - Update API keys if needed
   - Update in deployment platform

**Checklist**:
- [ ] `npm audit` run
- [ ] Dependencies updated
- [ ] Secrets rotated
- [ ] Tested after updates

---

### 4.2 Automation

#### [ ] 🟢 🤖 Task 4.2.1: Set Up Dependabot
**Time**: 15 minutes

**What the agent will do**:
- Create `.github/dependabot.yml`
- Configure weekly dependency updates
- Set up auto-merge for patches

---

#### [ ] 🟢 🤖 Task 4.2.2: Add Uptime Monitoring
**Time**: 20 minutes

**What the agent will do**:
- Document setup for UptimeRobot or Better Uptime
- Create health check endpoint
- Configure alert thresholds

---

#### [ ] 🟢 🤖 Task 4.2.3: Add Error Tracking
**Time**: 30 minutes

**What the agent will do**:
- Set up Sentry integration
- Add to frontend and backend
- Configure error alerts

---

## Progress Tracker

### Phase 1: Critical (15 tasks)
| # | Task | Type | Status |
|---|------|------|--------|
| 1.1.1 | Create env variable system | 🤖 | [ ] |
| 1.1.2 | Configure env variables | 👤 | [ ] |
| 1.2.1 | Create favicon structure | 🤖 | [ ] |
| 1.2.2 | Create favicon & icons | 👤 | [ ] |
| 1.2.3 | Create OG image | 👤 | [ ] |
| 1.2.4 | Create resume PDF | 👤 | [ ] |
| 1.3.1 | Get professional headshot | 👤 | [ ] |
| 1.3.2 | Write bio & about | 👤 | [ ] |
| 1.3.3 | Add experience & education | 👤 | [ ] |
| 1.4.1 | Fix CORS | 🤖 | [ ] |
| 1.4.2 | Add CSRF protection | 🤖 | [ ] |
| 1.4.3 | Add rate limiting | 🤖 | [ ] |
| 1.4.4 | Add security headers | 🤖 | [ ] |
| 1.5.1 | Create dynamic sitemap | 🤖 | [ ] |
| 1.5.2 | Update robots.txt | 🤖 | [ ] |
| 1.6.1 | Add real projects | 👤 | [ ] |
| 1.7.1 | Set up email service | 👤 | [ ] |
| 1.7.2 | Implement email sending | 🤖 | [ ] |
| 1.8.1 | Deploy to Vercel | 👤 | [ ] |

**Phase 1 Progress**: 0 / 19 complete

### Phase 2: Core Enhancements (16 tasks)
| # | Task | Type | Status |
|---|------|------|--------|
| 2.1.1 | Implement dark mode | 🤖 | [ ] |
| 2.1.2 | Add skip-to-content | 🤖 | [ ] |
| 2.1.3 | Add loading skeletons | 🤖 | [ ] |
| 2.1.4 | Add scroll animations | 🤖 | [ ] |
| 2.1.5 | Add active nav highlighting | 🤖 | [ ] |
| 2.2.1 | Create testimonials section | 🤖 | [ ] |
| 2.2.2 | Collect testimonials | 👤 | [ ] |
| 2.2.3 | Create blog structure | 🤖 | [ ] |
| 2.2.4 | Add skills progress bars | 🤖 | [ ] |
| 2.3.1 | Add project filtering | 🤖 | [ ] |
| 2.3.2 | Add GitHub widget | 🤖 | [ ] |
| 2.3.3 | Set up Google Analytics | 👤 | [ ] |
| 2.3.4 | Implement GA code | 🤖 | [ ] |
| 2.4.1 | Optimize images | 🤖 | [ ] |
| 2.4.2 | Add structured data | 🤖 | [ ] |
| 2.4.3 | Optimize social profiles | 👤 | [ ] |

**Phase 2 Progress**: 0 / 16 complete

### Phase 3: Advanced (9 tasks)
| # | Task | Type | Status |
|---|------|------|--------|
| 3.1.1 | Write blog posts | 👤 | [ ] |
| 3.1.2 | Create demo videos | 👤 | [ ] |
| 3.2.1 | Add page transitions | 🤖 | [ ] |
| 3.2.2 | Add hero animations | 🤖 | [ ] |
| 3.2.3 | Add PDF export | 🤖 | [ ] |
| 3.3.1 | Set up i18n | 🤖 | [ ] |
| 3.3.2 | Translate content | 👤 | [ ] |
| 3.4.1 | Add analytics dashboard | 🤖 | [ ] |

**Phase 3 Progress**: 0 / 8 complete

### Phase 4: Maintenance (6 tasks)
| # | Task | Type | Status |
|---|------|------|--------|
| 4.1.1 | Monthly content updates | 👤 | [ ] |
| 4.1.2 | Monthly performance check | 👤 | [ ] |
| 4.1.3 | Quarterly security audit | 👤 | [ ] |
| 4.2.1 | Set up Dependabot | 🤖 | [ ] |
| 4.2.2 | Add uptime monitoring | 🤖 | [ ] |
| 4.2.3 | Add error tracking | 🤖 | [ ] |

**Phase 4 Progress**: 0 / 6 complete

---

## Quick Reference Links

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Vercel Docs](https://vercel.com/docs)
- [FastAPI Docs](https://fastapi.tiangolo.com/)

### Design Tools
- [Figma](https://figma.com) - Design
- [Canva](https://canva.com) - Quick graphics
- [TinyPNG](https://tinypng.com) - Image compression
- [RealFaviconGenerator](https://realfavicongenerator.net) - Favicons
- [Coolors](https://coolors.co) - Color palettes

### Hosting & Services
- [Vercel](https://vercel.com) - Frontend hosting
- [Railway](https://railway.app) - Backend hosting
- [PlanetScale](https://planetscale.com) - MySQL database
- [Supabase](https://supabase.com) - PostgreSQL database
- [Resend](https://resend.com) - Email service

### Testing Tools
- [PageSpeed Insights](https://pagespeed.web.dev)
- [WAVE Accessibility](https://wave.webaim.org)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Google Rich Results Test](https://search.google.com/test/rich-results)

### Analytics & Monitoring
- [Google Analytics](https://analytics.google.com)
- [Plausible](https://plausible.io) - Privacy-focused alternative
- [UptimeRobot](https://uptimerobot.com) - Uptime monitoring
- [Sentry](https://sentry.io) - Error tracking

---

## Notes

Use this space to track your progress, decisions, and ideas:

```
[Your notes here]




```

---

**Document created**: December 6, 2025  
**Repository**: M-F-Tushar/My-Portfolio  
**Questions?** Ask the AI agent for help with any 🤖 task!
