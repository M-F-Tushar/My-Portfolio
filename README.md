# AI/ML Engineering Portfolio

This repository now contains a professional, admin-managed portfolio for an undergraduate Computer Science student building toward AI Engineering, ML Engineering, LLM systems, and MLOps.

The public website is built with Next.js App Router and a private owner-only admin panel. The goal is simple maintenance: you update content from `/admin` instead of editing code whenever you learn a new skill, add a project, upload a resume, or review contact messages.

## What Is Included

- Public portfolio homepage with a cinematic AI/ML identity.
- Dedicated `/projects`, `/resume`, and `/demos` pages.
- Private `/admin` panel protected by a single owner login.
- Admin pages for profile, hero, skills, projects, demos, experience, education, certifications, achievements, resume, social links, settings, and contact inbox.
- Contact form submissions saved in the database for review.
- Resume PDF upload through Vercel Blob, with public preview and download.
- Hidden-by-default demos and achievements so unfinished items do not appear publicly.
- PostgreSQL-backed content model using Prisma.
- Vercel-ready build configuration.

## Project Structure

```text
frontend/
  app/                 Next.js App Router public pages, admin pages, and API routes
  components/admin/    Private admin interface components
  components/public/   Public portfolio components
  lib/                 Auth, database, validation, content, and media helpers
  prisma/              Database schema and seed data
  __tests__/           Active Jest tests

archive/               Old FastAPI, Docker, Pages Router, and legacy test code kept for reference
docs/                  Setup, admin, environment, and deployment guides
```

## Quick Start

1. Install dependencies:

```powershell
npm install
```

2. Create your local environment file:

```powershell
Copy-Item frontend\.env.example frontend\.env.local
```

3. Fill in `frontend/.env.local`. Start with `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, and `CSRF_SECRET`.

4. Generate Prisma and seed initial content:

```powershell
npm run db:generate
npm run db:seed
```

5. Run the site:

```powershell
npm run dev
```

Open `http://localhost:3000`.

## Admin Panel

Go to `http://localhost:3000/admin/login`.

The seed script creates the first admin user from your environment values when configured. Use the admin panel for normal updates instead of changing source files.

See [docs/ADMIN_GUIDE.md](docs/ADMIN_GUIDE.md) for what each admin section controls.

## Environment Setup

Environment variables are private settings such as database URLs, login secrets, and upload tokens. They belong in `frontend/.env.local` on your computer and in Vercel project environment variables in production.

Do not commit `.env.local`.

See [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md) for where to find each value and how to replace placeholders safely.

## Verification

```powershell
npm run type-check
npm run test
npm run build
```

## Deployment

This project is configured for Vercel from the repository root. See [docs/DEPLOYMENT_VERCEL.md](docs/DEPLOYMENT_VERCEL.md).
