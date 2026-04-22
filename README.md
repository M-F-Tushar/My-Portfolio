# Mahir Faysal Tusher - AI/ML Engineering Portfolio

This repository contains a professional, admin-managed portfolio website for an undergraduate Computer Science student building toward AI Engineering, ML Engineering, LLM applications, and MLOps.

The project is designed around one main idea: the public portfolio should look polished for employers, while the owner can maintain content from a private admin panel instead of editing code for every update.

## Current Project Shape

This is no longer a simple static portfolio. It is a full Next.js application with:

- A public portfolio website.
- A private owner-only admin panel.
- PostgreSQL content storage through Prisma.
- Resume PDF upload support through Vercel Blob.
- Contact form submissions stored for review.
- Project, skill, education, experience, certification, achievement, demo, resume, and social link management.
- Vercel deployment configuration for preview and production builds.

The old FastAPI, Pages Router, Docker, and legacy experiments are kept under `archive/` for reference. The active application lives in `frontend/`.

## Product Goals

This portfolio is built to support an AI/ML engineering identity, not a generic personal website.

It should help a recruiter, evaluator, professor, or hiring manager quickly understand:

- What direction the candidate is pursuing.
- Which technical areas are being built up.
- Which projects show practical evidence.
- Where the resume, links, demos, and case studies are located.
- How to contact the candidate.

There is intentionally no blog or article system in this portfolio. Project cards can link to an external case-study site when those pages are ready.

## Public Pages

`/`

The main portfolio homepage. It presents the candidate identity, technical stack, featured projects, experience timeline, education timeline, and contact form.

`/projects`

A public project gallery. Each card can show the project category, stack, status, GitHub link, demo link, and case-study link.

`/resume`

A dedicated resume page where visitors can preview or download the uploaded PDF resume.

`/demos`

A future demo area. Demos are hidden by default until they are ready to publish.

`/#contact`

The public contact form. Messages are saved privately in the admin contact inbox.

## Admin Panel

The private admin panel starts at:

```text
/admin/login
```

The admin panel is intended for one owner. It controls both public content and private review workflows.

Admin sections:

- `Profile`: name, role, bio, location, email, current focus, and profile image.
- `Hero`: homepage headline, subtitle, buttons, and chips.
- `Skills`: skill categories and individual skills.
- `Projects`: public project cards, status, visibility, featured flag, and links.
- `Demos`: future interactive demos, hidden until ready.
- `Experience`: timeline entries for work, learning, internships, or project-based experience.
- `Education`: education timeline, coursework, GPA, and descriptions.
- `Certifications`: credentials and certificate links.
- `Achievements`: awards, hackathons, competitions, scholarships, and recognition. Hidden by default.
- `Resume`: direct PDF upload and resume highlights.
- `Social Links`: GitHub, LinkedIn, email, and other public links.
- `Contact Inbox`: submitted contact messages, read state, and archive state.
- `Settings`: site name, SEO title, SEO description, and navigation options.

## Maintenance Philosophy

The website should be easy to maintain without becoming hard-coded.

Normal content updates should happen from `/admin`, for example:

- Add a new skill after learning it.
- Add a new project card.
- Hide unfinished demos.
- Upload a new resume PDF.
- Add a certificate.
- Publish a hackathon or achievement only when ready.
- Review contact messages.

Code changes should mostly be reserved for layout, design system, new data models, new admin capabilities, and deployment fixes.

## Tech Stack

Frontend and app framework:

- Next.js 14 App Router
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- lucide-react icons
- tsparticles for interactive visual effects

Backend and data:

- Next.js Route Handlers
- Prisma ORM
- PostgreSQL
- JWT-based owner session cookie
- bcrypt password hashing
- Zod validation

Storage and integrations:

- Vercel Blob for resume/media upload
- Resend fields reserved for optional email notifications
- Vercel for hosting and preview deployments

Testing and quality:

- Jest
- React Testing Library
- TypeScript type-checking
- Next.js production build verification

## Repository Layout

```text
.
|-- frontend/
|   |-- app/
|   |   |-- (public)/              Public website routes
|   |   |-- admin/                 Private admin dashboard routes
|   |   |-- api/                   Auth, admin, media, and contact API routes
|   |-- components/
|   |   |-- admin/                 Admin UI components
|   |   |-- public/                Public portfolio components
|   |   |-- motion/                Shared motion helpers
|   |-- lib/                       Auth, database, env, validation, content helpers
|   |-- prisma/
|   |   |-- schema.prisma          Database schema
|   |   |-- seed.ts                Initial content and admin seed
|   |-- public/                    Static public assets
|   |-- __tests__/                 Jest tests
|
|-- archive/                       Legacy code kept for reference
|-- docs/                          Admin, environment, and deployment guides
|-- content/                       Supporting content workspace
|-- data/                          Supporting data workspace
|-- notebooks/                     Notebook workspace
|-- scripts/                       Utility scripts
|-- vercel.json                    Vercel build/output configuration
|-- package.json                   Root workspace scripts
```

## Data Model Overview

The active Prisma schema includes:

- `AdminUser`
- `SiteSettings`
- `MediaAsset`
- `Profile`
- `Hero`
- `SkillCategory`
- `Skill`
- `Project`
- `Demo`
- `Experience`
- `Education`
- `Certification`
- `Achievement`
- `ResumeAsset`
- `SocialLink`
- `ContactSubmission`

Visibility fields are important. Projects, skills, demos, achievements, and other sections can be hidden until they are ready for public review.

## Environment Variables

Local environment values belong in:

```text
frontend/.env.local
```

Never commit `.env.local`.

Use the examples as templates:

```text
.env.example
.env.production.example
frontend/.env.example
frontend/.env.local.example
```

Required for production:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
NEXT_PUBLIC_SITE_URL="https://your-domain.com"
JWT_SECRET="long-random-secret"
CSRF_SECRET="another-long-random-secret"
```

Optional, depending on features:

```env
BLOB_READ_WRITE_TOKEN="vercel-blob-read-write-token"
RESEND_API_KEY=""
RESEND_FROM_EMAIL="onboarding@resend.dev"
RESEND_TO_EMAIL=""
ADMIN_EMAIL="owner@example.com"
ADMIN_PASSWORD="change-this-before-real-use"
```

`ADMIN_EMAIL` and `ADMIN_PASSWORD` are used by the seed script when creating the first admin user. If they are not set, the seed falls back to a default development admin. Change this before real deployment.

Generate strong secrets with Node:

```powershell
node -e "console.log(crypto.randomBytes(48).toString('hex'))"
```

Run it once for `JWT_SECRET` and once for `CSRF_SECRET`.

For a beginner-friendly explanation, see [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md).

## Local Setup

Prerequisites:

- Node.js 18 or newer
- npm 9 or newer
- A PostgreSQL database for full admin/database behavior

Install dependencies from the repository root:

```powershell
npm install
```

Create the local environment file:

```powershell
Copy-Item frontend\.env.example frontend\.env.local
```

Edit `frontend/.env.local` and replace the placeholder values.

Generate the Prisma client:

```powershell
npm run db:generate
```

Create database tables.

For the current schema-first setup, the simplest first-time option is:

```powershell
cd frontend
npx prisma db push
```

Then seed the database:

```powershell
cd ..
npm run db:seed
```

Run the development server:

```powershell
npm run dev
```

Open:

```text
http://localhost:3000
```

Admin login:

```text
http://localhost:3000/admin/login
```

## Root Scripts

Run these from the repository root:

```powershell
npm run dev
npm run build
npm run test
npm run type-check
npm run lint
npm run db:generate
npm run db:migrate
npm run db:seed
```

Important notes:

- `npm run dev` starts the Next.js app from `frontend/`.
- `npm run build` runs the production build from `frontend/`.
- `npm run db:migrate` uses Prisma migrate dev. Use it when you are intentionally creating a migration during development.
- If you only need to sync the current schema to a fresh database, `cd frontend && npx prisma db push` is the simpler setup path.

## Verification Before Pushing

Use this checklist before pushing changes:

```powershell
npm run type-check
npm run test
npm run build
```

These checks verify:

- TypeScript compiles.
- Jest tests pass.
- Prisma client generation succeeds.
- Next.js can create a production build.

## Deployment

The project is deployed on Vercel.

Important Vercel setting:

```text
Root Directory: frontend
```

Because Vercel builds inside `frontend`, `vercel.json` intentionally uses:

```json
{
  "installCommand": "npm install",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

Do not change the build command back to `cd frontend && npm run build` unless the Vercel root directory is also changed back to the repository root. That mismatch causes the deployment error:

```text
cd: frontend: No such file or directory
```

Required production setup:

- Add production environment variables in Vercel.
- Connect a production PostgreSQL database.
- Sync or migrate the Prisma schema.
- Seed the first admin user.
- Add a Vercel Blob token if resume PDF uploads should work.
- Upload the real resume from `/admin/resume`.
- Keep demos, achievements, and hackathons hidden until real content is ready.

See [docs/DEPLOYMENT_VERCEL.md](docs/DEPLOYMENT_VERCEL.md) for the focused deployment checklist.

## Resume Workflow

The resume system is PDF-first.

Recommended workflow:

1. Prepare the final PDF.
2. Add `BLOB_READ_WRITE_TOKEN` to local/Vercel environment variables.
3. Log in to `/admin/resume`.
4. Upload the PDF.
5. Review `/resume`.
6. Confirm preview and download both work.

## Project Workflow

Project cards are intentionally concise.

Each project can include:

- Title
- Category
- Short description
- Tech stack
- Status
- GitHub URL
- Live demo URL
- Case-study URL
- Featured flag
- Visibility flag

For deeper project writing, use the `caseStudyUrl` field to link to a separate external site with:

- Case study
- Situation
- Problem
- Solution
- Technical architecture
- Results
- Screenshots
- Other supporting material

## Content Publishing Rules

Use these rules to keep the portfolio professional:

- Keep the homepage text concise and technical.
- Prefer tags and evidence over long generic paragraphs.
- Publish only projects that support the AI/ML direction.
- Hide incomplete demos.
- Hide achievements and hackathons until real entries are ready.
- Keep project cards short, then link to external case studies for depth.
- Keep the resume current.
- Test the contact form after deployment.

## Common Issues

`cd: frontend: No such file or directory` on Vercel

The Vercel project is building from `frontend`, so the build command must be `npm run build`, not `cd frontend && npm run build`.

Admin login fails

Check `JWT_SECRET`, `DATABASE_URL`, and whether the admin user was seeded.

Resume upload fails

Check `BLOB_READ_WRITE_TOKEN` and confirm the token is set in the same environment where the upload is running.

Public pages show fallback content

The public site can render fallback content when no database URL is available or database loading fails. Connect and seed PostgreSQL to show admin-managed content.

Contact messages do not appear

Check the database connection and the `ContactSubmission` table. Email notification variables are optional; database storage is the important path.

Preview deployment asks for Vercel login

The deployment is ready, but Vercel preview protection is enabled. View while logged in, or adjust deployment protection settings in Vercel if public preview access is needed.

## Supporting Docs

- [Admin Guide](docs/ADMIN_GUIDE.md)
- [Environment Variables](docs/ENVIRONMENT.md)
- [Vercel Deployment](docs/DEPLOYMENT_VERCEL.md)

## License

MIT
