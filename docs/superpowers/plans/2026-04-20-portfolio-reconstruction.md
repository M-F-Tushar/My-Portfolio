# Portfolio Reconstruction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the current portfolio into a Vercel-first, cinematic public portfolio with a simple private single-owner admin panel for no-code content updates.

**Architecture:** Replace the current frontend/admin implementation with a single Next.js App Router application inside `frontend/`. Use Prisma with PostgreSQL, route handlers for API mutations, HTTP-only cookie admin auth, Vercel Blob-compatible media storage, and database-driven public pages. Remove FastAPI/Docker/demo complexity from the launch path after the new app is working.

**Tech Stack:** Next.js 14.2 patched App Router, React 18, TypeScript, Prisma, PostgreSQL, Tailwind CSS, Framer Motion, lucide-react, bcryptjs, jsonwebtoken or jose, zod, Vercel Blob, Jest/Testing Library, Playwright browser smoke checks.

---

## Scope Notes

This is a large reconstruction. Implement it in phases and keep each phase shippable:

1. Foundation: package/config/schema/auth/data access.
2. Admin CMS: private section-based forms.
3. Public portfolio: cinematic frontend and content-driven pages.
4. Storage/contact/resume: durable uploads and saved inbox.
5. Cleanup/deployment: remove unused old complexity, update docs, verify Vercel path.

Do not delete old implementation files until replacement routes are functional and tests cover the new behavior.

---

## Target File Structure

Create or rebuild these areas:

```text
frontend/
  app/
    (public)/
      page.tsx
      projects/page.tsx
      resume/page.tsx
      demos/page.tsx
    admin/
      layout.tsx
      page.tsx
      login/page.tsx
      profile/page.tsx
      hero/page.tsx
      skills/page.tsx
      projects/page.tsx
      demos/page.tsx
      experience/page.tsx
      education/page.tsx
      certifications/page.tsx
      achievements/page.tsx
      resume/page.tsx
      social/page.tsx
      contact-submissions/page.tsx
      settings/page.tsx
    api/
      admin/[resource]/route.ts
      auth/login/route.ts
      auth/logout/route.ts
      auth/me/route.ts
      contact/route.ts
      media/upload/route.ts
    layout.tsx
    globals.css
    not-found.tsx
  components/
    admin/
    public/
    ui/
  lib/
    admin/
    auth/
    content/
    media/
    validations/
    db.ts
    env.ts
  prisma/
    schema.prisma
    seed.ts
  __tests__/
```

Retire these after replacement is verified:

```text
frontend/pages/
frontend/components/legacy or old unused components
backend/
tests/ backend-specific tests
docker-compose.yml
Dockerfile
vercel.json rewrites to backend
```

---

## Task 1: Create a Safe Reconstruction Branch

**Files:**
- Modify: none

- [ ] **Step 1: Check current status**

Run:

```powershell
git status --short
```

Expected:

```text
 M frontend/.env.example
?? .superpowers/
?? PORTFOLIO_REPOSITORY_AUDIT.md
```

Do not stage unrelated existing changes unless the owner explicitly wants them included.

- [ ] **Step 2: Create branch**

Run:

```powershell
git switch -c codex/portfolio-reconstruction
```

Expected:

```text
Switched to a new branch 'codex/portfolio-reconstruction'
```

- [ ] **Step 3: Commit only this plan if not already committed**

Run:

```powershell
git status --short
```

If this plan file is uncommitted, stage only:

```powershell
git add docs\superpowers\plans\2026-04-20-portfolio-reconstruction.md
git commit -m "docs: add portfolio reconstruction implementation plan"
```

Expected:

```text
Commit succeeds with message: docs: add portfolio reconstruction implementation plan
```

---

## Task 2: Normalize Dependencies and Scripts

**Files:**
- Modify: `package.json`
- Modify: `frontend/package.json`
- Modify: `frontend/next.config.js`
- Modify: `frontend/tsconfig.json`
- Create: `frontend/.env.example`

- [ ] **Step 1: Update root scripts**

Replace the root `scripts` block in `package.json` with:

```json
{
  "dev": "npm run dev:frontend",
  "dev:frontend": "cd frontend && npm run dev",
  "build": "cd frontend && npm run build",
  "start": "cd frontend && npm start",
  "test": "npm run test:frontend",
  "test:frontend": "cd frontend && npm run test",
  "lint": "npm run lint:frontend",
  "lint:frontend": "cd frontend && npm run lint",
  "type-check": "cd frontend && npm run type-check",
  "db:generate": "cd frontend && npx prisma generate",
  "db:migrate": "cd frontend && npx prisma migrate dev",
  "db:seed": "cd frontend && npm run db:seed"
}
```

This removes FastAPI/Docker launch scripts from the primary launch path.

- [ ] **Step 2: Update root metadata**

In `package.json`, replace template metadata:

```json
"description": "Admin-managed AI/ML engineering portfolio for an undergraduate CS student",
"repository": {
  "type": "git",
  "url": "https://github.com/M-F-Tushar/My-Portfolio"
},
"author": "Mahir Faysal Tusher"
```

- [ ] **Step 3: Update frontend dependencies**

In `frontend/package.json`, keep existing useful dependencies and add:

```json
"@vercel/blob": "^0.27.3",
"zod": "^3.25.76"
```

Update vulnerable framework dependencies:

```json
"next": "14.2.35",
"axios": "^1.15.0"
```

If npm cannot resolve `axios@^1.15.0`, remove axios entirely and use native `fetch` in new code.

- [ ] **Step 4: Update frontend scripts**

Use:

```json
"scripts": {
  "dev": "next dev -p 3000",
  "build": "prisma generate && next build",
  "start": "next start",
  "lint": "next lint",
  "test": "jest",
  "type-check": "tsc --noEmit",
  "db:seed": "tsx prisma/seed.ts"
}
```

- [ ] **Step 5: Replace frontend env example**

Use this exact `frontend/.env.example` content:

```env
# Database: use a PostgreSQL database for development and production.
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"

# Site
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Auth
JWT_SECRET="replace-with-a-random-64-character-secret"
CSRF_SECRET="replace-with-another-random-64-character-secret"

# Storage
BLOB_READ_WRITE_TOKEN=""

# Contact email notifications are optional.
RESEND_API_KEY=""
RESEND_FROM_EMAIL="onboarding@resend.dev"
RESEND_TO_EMAIL=""
```

- [ ] **Step 6: Install packages**

Run:

```powershell
npm install
```

Expected:

```text
Packages installed successfully. The exact npm audit line can vary by lockfile state.
```

- [ ] **Step 7: Verify package state**

Run:

```powershell
npm run type-check
```

Expected at this point:

```text
May fail because old files still exist.
```

Do not stop; type-check becomes mandatory after old files are retired.

---

## Task 3: Replace Prisma Schema With Portfolio CMS Model

**Files:**
- Modify: `frontend/prisma/schema.prisma`
- Modify: `frontend/prisma/seed.ts`
- Create: `frontend/lib/db.ts`

- [ ] **Step 1: Replace schema**

Replace `frontend/prisma/schema.prisma` with:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

enum ProjectStatus {
  COMPLETED
  IN_PROGRESS
  COMING_SOON
}

enum DemoStatus {
  HIDDEN
  COMING_SOON
  CASE_STUDY_ONLY
  EXTERNAL_DEMO
  EMBEDDED_DEMO
}

enum AchievementType {
  AWARD
  HACKATHON
  COMPETITION
  SCHOLARSHIP
  RECOGNITION
}

model AdminUser {
  id           Int       @id @default(autoincrement())
  email        String    @unique
  passwordHash String
  lastLoginAt  DateTime?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}

model SiteSettings {
  id              Int      @id @default(1)
  siteName        String   @default("Mahir Faysal Tusher")
  seoTitle        String   @default("Mahir Faysal Tusher | AI/ML Engineering Portfolio")
  seoDescription  String   @default("Undergraduate Computer Science student building toward AI Engineering, ML Engineering, LLM systems, and MLOps.")
  showDemosInNav  Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model MediaAsset {
  id        Int      @id @default(autoincrement())
  url       String
  key       String?
  fileName  String
  mimeType  String
  fileSize  Int
  altText   String?
  createdAt DateTime @default(now())
}

model Profile {
  id                 Int      @id @default(1)
  displayName        String   @default("Mahir Faysal Tusher")
  role               String   @default("Undergraduate CS Student | AI/ML Engineering Path")
  shortBio           String   @default("Undergraduate Computer Science student building practical AI systems across LLMs, machine learning, and MLOps.")
  about              String   @default("I am building a professional foundation in AI Engineering, ML Engineering, LLM applications, and MLOps through projects, coursework, and continuous experimentation.")
  location           String   @default("Chandpur, Bangladesh")
  email              String   @default("www.mahirfaysaltushar@gmail.com")
  currentFocus       String   @default("LLMs, machine learning systems, production-ready AI workflows, and MLOps foundations.")
  yearsLabel         String   @default("CS Undergraduate")
  projectsLabel      String   @default("AI/ML Projects")
  profileImageId     Int?
  profileImage       MediaAsset? @relation(fields: [profileImageId], references: [id])
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}

model Hero {
  id              Int      @id @default(1)
  eyebrow         String   @default("AI Engineering Portfolio")
  headline        String   @default("Building practical AI systems from classroom foundations to production thinking.")
  subheadline     String   @default("Undergraduate CS student focused on LLMs, machine learning, and MLOps.")
  primaryLabel    String   @default("View Projects")
  primaryHref     String   @default("/projects")
  secondaryLabel  String   @default("Download Resume")
  secondaryHref   String   @default("/resume")
  featuredChips   String   @default("[\"LLMs\",\"Machine Learning\",\"MLOps\"]")
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model SkillCategory {
  id        Int      @id @default(autoincrement())
  name      String   @unique
  sortOrder Int      @default(0)
  visible   Boolean  @default(true)
  skills    Skill[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Skill {
  id          Int           @id @default(autoincrement())
  name        String
  proficiency Int           @default(70)
  sortOrder   Int           @default(0)
  visible     Boolean       @default(true)
  categoryId  Int
  category    SkillCategory @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}

model Project {
  id               Int           @id @default(autoincrement())
  title            String
  slug             String        @unique
  description      String
  category         String
  techStack        String        @default("[]")
  imageId          Int?
  image            MediaAsset?   @relation(fields: [imageId], references: [id])
  githubUrl        String?
  liveDemoUrl      String?
  caseStudyUrl     String?
  status           ProjectStatus @default(IN_PROGRESS)
  featured         Boolean       @default(false)
  visible          Boolean       @default(true)
  sortOrder        Int           @default(0)
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt
}

model Demo {
  id          Int        @id @default(autoincrement())
  title       String
  description String
  domain      String
  status      DemoStatus @default(HIDDEN)
  externalUrl String?
  embedConfig String?
  visible     Boolean    @default(false)
  sortOrder   Int        @default(0)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

model Experience {
  id           Int      @id @default(autoincrement())
  organization String
  role         String
  period       String
  location     String?
  summary      String?
  bullets      String   @default("[]")
  techStack    String   @default("[]")
  visible      Boolean  @default(true)
  sortOrder    Int      @default(0)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

model Education {
  id          Int      @id @default(autoincrement())
  degree      String
  institution String
  period      String
  location    String?
  coursework  String   @default("[]")
  gpa         String?
  description String?
  visible     Boolean  @default(true)
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Certification {
  id            Int      @id @default(autoincrement())
  name          String
  issuer        String?
  date          String?
  credentialUrl String?
  visible       Boolean  @default(true)
  sortOrder     Int      @default(0)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Achievement {
  id           Int             @id @default(autoincrement())
  title        String
  type         AchievementType @default(RECOGNITION)
  organization String?
  date         String?
  description  String?
  url          String?
  visible      Boolean         @default(false)
  sortOrder    Int             @default(0)
  createdAt    DateTime        @default(now())
  updatedAt    DateTime        @updatedAt
}

model ResumeAsset {
  id              Int      @id @default(1)
  mediaId         Int?
  media           MediaAsset? @relation(fields: [mediaId], references: [id])
  highlights      String   @default("[]")
  lastUpdatedDate String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model SocialLink {
  id        Int      @id @default(autoincrement())
  label     String
  platform  String
  url       String
  visible   Boolean  @default(true)
  sortOrder Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model ContactSubmission {
  id        Int      @id @default(autoincrement())
  name      String
  email     String
  message   String
  read      Boolean  @default(false)
  archived  Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

- [ ] **Step 2: Create database helper**

Create `frontend/lib/db.ts`:

```ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

- [ ] **Step 3: Replace seed**

Create a seed that inserts professional starter content and a single admin.

Use `frontend/prisma/seed.ts`:

```ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {},
  });

  await prisma.profile.upsert({
    where: { id: 1 },
    update: {},
    create: {},
  });

  await prisma.hero.upsert({
    where: { id: 1 },
    update: {},
    create: {},
  });

  await prisma.resumeAsset.upsert({
    where: { id: 1 },
    update: {},
    create: {
      highlights: JSON.stringify([
        'Undergraduate Computer Science student focused on AI/ML engineering',
        'Building foundations in LLM applications, machine learning, and MLOps',
        'Open to internships, research opportunities, and practical AI projects',
      ]),
    },
  });

  const categories = [
    ['AI and LLMs', ['LLM Fundamentals', 'Prompt Engineering', 'RAG Concepts']],
    ['Machine Learning', ['Python', 'Scikit-learn', 'Model Evaluation']],
    ['Data and MLOps', ['Pandas', 'Experiment Tracking', 'Deployment Basics']],
    ['Programming and Tools', ['TypeScript', 'Git', 'SQL']],
    ['Cloud and Deployment', ['Vercel', 'Docker Basics', 'API Design']],
  ] as const;

  for (let i = 0; i < categories.length; i++) {
    const [name, skills] = categories[i];
    const category = await prisma.skillCategory.upsert({
      where: { name },
      update: { sortOrder: i },
      create: { name, sortOrder: i },
    });

    for (let j = 0; j < skills.length; j++) {
      const existing = await prisma.skill.findFirst({
        where: { name: skills[j], categoryId: category.id },
      });
      if (!existing) {
        await prisma.skill.create({
          data: {
            name: skills[j],
            categoryId: category.id,
            proficiency: 70,
            sortOrder: j,
          },
        });
      }
    }
  }

  const projects = [
    {
      title: 'AI Portfolio Platform',
      slug: 'ai-portfolio-platform',
      description: 'An admin-managed professional portfolio for AI/ML engineering growth, projects, resume, and contact workflow.',
      category: 'Full Stack',
      techStack: JSON.stringify(['Next.js', 'Prisma', 'PostgreSQL', 'Vercel']),
      status: 'IN_PROGRESS' as const,
      featured: true,
      sortOrder: 0,
    },
    {
      title: 'ML Learning Lab',
      slug: 'ml-learning-lab',
      description: 'A growing collection of machine learning experiments, model evaluation notes, and reproducible notebooks.',
      category: 'Machine Learning',
      techStack: JSON.stringify(['Python', 'Scikit-learn', 'Pandas']),
      status: 'IN_PROGRESS' as const,
      featured: true,
      sortOrder: 1,
    },
  ];

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project,
    });
  }

  await prisma.education.upsert({
    where: { id: 1 },
    update: {},
    create: {
      degree: 'B.Sc. in Computer Science',
      institution: 'Your University',
      period: 'Current',
      location: 'Bangladesh',
      coursework: JSON.stringify(['Data Structures', 'Algorithms', 'Database Systems', 'Machine Learning']),
      description: 'Coursework and projects focused on software engineering foundations and applied AI/ML growth.',
      sortOrder: 0,
    },
  });

  const socials = [
    { label: 'GitHub', platform: 'github', url: 'https://github.com/M-F-Tushar', sortOrder: 0 },
    { label: 'LinkedIn', platform: 'linkedin', url: 'https://www.linkedin.com/', sortOrder: 1 },
    { label: 'Email', platform: 'email', url: 'mailto:www.mahirfaysaltushar@gmail.com', sortOrder: 2 },
  ];

  for (const social of socials) {
    const existing = await prisma.socialLink.findFirst({ where: { platform: social.platform } });
    if (existing) {
      await prisma.socialLink.update({ where: { id: existing.id }, data: social });
    } else {
      await prisma.socialLink.create({ data: social });
    }
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe123!ChangeMe123!';
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: { email: adminEmail, passwordHash },
  });

  console.log(`Seed complete. Admin email: ${adminEmail}`);
  console.log('If you used the default password, change it immediately after login.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

- [ ] **Step 4: Generate and migrate**

Run:

```powershell
cd frontend
npx prisma generate
npx prisma migrate dev --name portfolio_reconstruction
npm run db:seed
```

Expected:

```text
Generated Prisma Client
The following migration(s) have been created and applied
Seed complete. Admin email: admin@example.com
```

---

## Task 4: Add Environment Validation and Shared Utilities

**Files:**
- Create: `frontend/lib/env.ts`
- Create: `frontend/lib/content/json.ts`
- Create: `frontend/lib/validations/common.ts`

- [ ] **Step 1: Add env helper**

Create `frontend/lib/env.ts`:

```ts
const requiredServerVars = ['DATABASE_URL', 'JWT_SECRET'] as const;

export function getRequiredEnv(name: (typeof requiredServerVars)[number] | 'DIRECT_URL' | 'CSRF_SECRET') {
  const value = process.env[name];
  if (!value && process.env.NODE_ENV === 'production') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value || '';
}

export const env = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  jwtSecret: getRequiredEnv('JWT_SECRET') || 'local-development-secret-change-me',
  csrfSecret: process.env.CSRF_SECRET || 'local-development-csrf-change-me',
  blobToken: process.env.BLOB_READ_WRITE_TOKEN || '',
  resendApiKey: process.env.RESEND_API_KEY || '',
  resendFromEmail: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
  resendToEmail: process.env.RESEND_TO_EMAIL || '',
};
```

- [ ] **Step 2: Add JSON helpers**

Create `frontend/lib/content/json.ts`:

```ts
export function parseStringArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

export function stringifyStringArray(values: unknown): string {
  if (!Array.isArray(values)) return '[]';
  return JSON.stringify(values.filter((item): item is string => typeof item === 'string' && item.trim().length > 0));
}

export function toSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
```

- [ ] **Step 3: Add shared validation**

Create `frontend/lib/validations/common.ts`:

```ts
import { z } from 'zod';

export const optionalUrl = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((value) => (value && value.length > 0 ? value : null))
  .refine((value) => !value || value.startsWith('http') || value.startsWith('mailto:'), {
    message: 'URL must start with http, https, or mailto',
  });

export const visibleSchema = z.object({
  visible: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});
```

- [ ] **Step 4: Verify**

Run:

```powershell
cd frontend
npm run type-check
```

Expected:

```text
If legacy files still import removed types, this command can fail now. Continue only if every error points to old pages/components that Task 13 removes; fix errors in newly added `lib/` files before moving on.
```

Proceed; final type-check is required after replacement.

---

## Task 5: Implement Admin Authentication

**Files:**
- Create: `frontend/lib/auth/session.ts`
- Create: `frontend/lib/validations/auth.ts`
- Create: `frontend/app/api/auth/login/route.ts`
- Create: `frontend/app/api/auth/logout/route.ts`
- Create: `frontend/app/api/auth/me/route.ts`
- Create: `frontend/middleware.ts`
- Create: `frontend/app/admin/login/page.tsx`

- [ ] **Step 1: Add auth validation**

Create `frontend/lib/validations/auth.ts`:

```ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

- [ ] **Step 2: Add session helper**

Create `frontend/lib/auth/session.ts`:

```ts
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { env } from '@/lib/env';

export const SESSION_COOKIE = 'portfolio_admin_session';

export interface AdminSession {
  adminId: number;
  email: string;
}

export function signAdminSession(session: AdminSession) {
  return jwt.sign(session, env.jwtSecret, { expiresIn: '7d' });
}

export function verifyAdminSession(token: string | undefined): AdminSession | null {
  if (!token) return null;
  try {
    return jwt.verify(token, env.jwtSecret) as AdminSession;
  } catch {
    return null;
  }
}

export function getCurrentAdmin(): AdminSession | null {
  const token = cookies().get(SESSION_COOKIE)?.value;
  return verifyAdminSession(token);
}

export function requireAdmin(): AdminSession {
  const admin = getCurrentAdmin();
  if (!admin) {
    throw new Error('Unauthorized');
  }
  return admin;
}
```

- [ ] **Step 3: Add login API route**

Create `frontend/app/api/auth/login/route.ts`:

```ts
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { loginSchema } from '@/lib/validations/auth';
import { SESSION_COOKIE, signAdminSession } from '@/lib/auth/session';

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 400 });
  }

  const admin = await prisma.adminUser.findUnique({
    where: { email: parsed.data.email },
  });

  if (!admin) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
  }

  const validPassword = await bcrypt.compare(parsed.data.password, admin.passwordHash);
  if (!validPassword) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
  }

  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { lastLoginAt: new Date() },
  });

  const response = NextResponse.json({
    admin: { id: admin.id, email: admin.email },
  });

  response.cookies.set(SESSION_COOKIE, signAdminSession({ adminId: admin.id, email: admin.email }), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
```

- [ ] **Step 4: Add logout route**

Create `frontend/app/api/auth/logout/route.ts`:

```ts
import { NextResponse } from 'next/server';
import { SESSION_COOKIE } from '@/lib/auth/session';

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
  return response;
}
```

- [ ] **Step 5: Add current admin route**

Create `frontend/app/api/auth/me/route.ts`:

```ts
import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth/session';

export async function GET() {
  const admin = getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ admin: null }, { status: 401 });
  }
  return NextResponse.json({ admin });
}
```

- [ ] **Step 6: Protect admin routes with middleware**

Replace `frontend/middleware.ts` with:

```ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE, verifyAdminSession } from '@/lib/auth/session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/admin') || pathname === '/admin/login') {
    return NextResponse.next();
  }

  const session = verifyAdminSession(request.cookies.get(SESSION_COOKIE)?.value);
  if (!session) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
```

- [ ] **Step 7: Add login page**

Create `frontend/app/admin/login/page.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      setError('Invalid email or password.');
      setLoading(false);
      return;
    }

    router.push(searchParams.get('next') || '/admin');
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-xl border border-slate-800 bg-slate-900 p-6 space-y-4">
        <div>
          <p className="text-sm text-cyan-300">Private Admin</p>
          <h1 className="text-2xl font-semibold">Sign in</h1>
        </div>
        <label className="block">
          <span className="text-sm text-slate-300">Email</span>
          <input className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <label className="block">
          <span className="text-sm text-slate-300">Password</span>
          <input className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </label>
        {error && <p className="text-sm text-red-300" role="alert">{error}</p>}
        <button className="w-full rounded-md bg-cyan-400 px-4 py-2 font-medium text-slate-950 disabled:opacity-60" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </main>
  );
}
```

- [ ] **Step 8: Verify login route**

Run:

```powershell
cd frontend
npm run type-check
```

Expected:

```text
If legacy files still import removed types, this command can fail now. Continue only if every error points to old pages/components that Task 13 removes; fix errors in newly added auth files before moving on.
```

Task 16 includes the browser verification for `/admin/login`.

---

## Task 6: Create Admin Layout and Reusable Admin Components

**Files:**
- Create: `frontend/app/admin/layout.tsx`
- Create: `frontend/app/admin/page.tsx`
- Create: `frontend/components/admin/AdminShell.tsx`
- Create: `frontend/components/admin/AdminTable.tsx`
- Create: `frontend/components/admin/FormField.tsx`
- Create: `frontend/components/admin/VisibilityBadge.tsx`

- [ ] **Step 1: Create admin shell**

Create `frontend/components/admin/AdminShell.tsx`:

```tsx
import Link from 'next/link';
import { getCurrentAdmin } from '@/lib/auth/session';

const navItems = [
  ['Dashboard', '/admin'],
  ['Profile', '/admin/profile'],
  ['Hero', '/admin/hero'],
  ['Skills', '/admin/skills'],
  ['Projects', '/admin/projects'],
  ['Demos', '/admin/demos'],
  ['Experience', '/admin/experience'],
  ['Education', '/admin/education'],
  ['Certifications', '/admin/certifications'],
  ['Achievements', '/admin/achievements'],
  ['Resume', '/admin/resume'],
  ['Social Links', '/admin/social'],
  ['Contact Inbox', '/admin/contact-submissions'],
  ['Settings', '/admin/settings'],
] as const;

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const admin = getCurrentAdmin();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white p-4 lg:block">
        <Link href="/admin" className="block text-lg font-semibold">Portfolio Admin</Link>
        <p className="mt-1 text-xs text-slate-500">{admin?.email}</p>
        <nav className="mt-6 space-y-1">
          {navItems.map(([label, href]) => (
            <Link key={href} href={href} className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-950">
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="flex h-14 items-center justify-between px-4">
            <Link href="/" className="text-sm text-slate-600 hover:text-slate-950">View site</Link>
            <form action="/api/auth/logout" method="post">
              <button className="rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50">Sign out</button>
            </form>
          </div>
        </header>
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create admin layout**

Create `frontend/app/admin/layout.tsx`:

```tsx
import AdminShell from '@/components/admin/AdminShell';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
```

- [ ] **Step 3: Create dashboard page**

Create `frontend/app/admin/page.tsx`:

```tsx
import { prisma } from '@/lib/db';

export default async function AdminDashboardPage() {
  const [projects, featuredProjects, unreadMessages, resume] = await Promise.all([
    prisma.project.count({ where: { visible: true } }),
    prisma.project.count({ where: { visible: true, featured: true } }),
    prisma.contactSubmission.count({ where: { read: false, archived: false } }),
    prisma.resumeAsset.findUnique({ where: { id: 1 }, include: { media: true } }),
  ]);

  const cards = [
    ['Visible projects', projects],
    ['Featured projects', featuredProjects],
    ['Unread messages', unreadMessages],
    ['Resume uploaded', resume?.media ? 'Yes' : 'No'],
  ];

  return (
    <div>
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-slate-600">Manage your public portfolio without editing code.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value]) => (
          <div key={label} className="rounded-lg border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create form field helper**

Create `frontend/components/admin/FormField.tsx`:

```tsx
interface FormFieldProps {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  textarea?: boolean;
  required?: boolean;
}

export function FormField({ label, name, defaultValue, type = 'text', textarea, required }: FormFieldProps) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {textarea ? (
        <textarea name={name} defaultValue={defaultValue ?? ''} required={required} rows={5} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
      ) : (
        <input name={name} type={type} defaultValue={defaultValue ?? ''} required={required} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2" />
      )}
    </label>
  );
}
```

- [ ] **Step 5: Create visibility badge**

Create `frontend/components/admin/VisibilityBadge.tsx`:

```tsx
export function VisibilityBadge({ visible }: { visible: boolean }) {
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-medium ${visible ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
      {visible ? 'Visible' : 'Hidden'}
    </span>
  );
}
```

- [ ] **Step 6: Verify admin shell**

Run:

```powershell
cd frontend
npm run build
```

Expected:

```text
May fail until public App Router layout is added and old routes are retired.
```

Proceed to public layout next.

---

## Task 7: Build Public Layout and Cinematic Design System

**Files:**
- Create/Modify: `frontend/app/layout.tsx`
- Create/Modify: `frontend/app/globals.css`
- Create: `frontend/components/public/PublicNav.tsx`
- Create: `frontend/components/public/HeroVisual.tsx`
- Create: `frontend/components/public/SectionReveal.tsx`
- Create: `frontend/components/public/ProjectCard.tsx`
- Create: `frontend/components/public/ContactForm.tsx`

- [ ] **Step 1: Create root layout**

Create `frontend/app/layout.tsx`:

```tsx
import type { Metadata } from 'next';
import './globals.css';
import { prisma } from '@/lib/db';
import { env } from '@/lib/env';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  return {
    metadataBase: new URL(env.siteUrl),
    title: settings?.seoTitle || 'AI/ML Engineering Portfolio',
    description: settings?.seoDescription || 'Undergraduate CS student building toward AI/ML engineering.',
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Create global styles**

Replace `frontend/app/globals.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: dark;
  --background: #050812;
  --foreground: #e8f7ff;
  --muted: #92a4b8;
  --panel: rgba(10, 18, 32, 0.72);
  --line: rgba(125, 236, 255, 0.16);
  --accent: #5ee7ff;
  --accent-2: #8bffb0;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background:
    radial-gradient(circle at top left, rgba(94, 231, 255, 0.14), transparent 32rem),
    radial-gradient(circle at bottom right, rgba(139, 255, 176, 0.08), transparent 26rem),
    var(--background);
  color: var(--foreground);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

a {
  color: inherit;
  text-decoration: none;
}

.cinematic-shell {
  min-height: 100vh;
  background-image:
    linear-gradient(rgba(94, 231, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(94, 231, 255, 0.05) 1px, transparent 1px);
  background-size: 56px 56px;
}

.container-wide {
  width: min(1180px, calc(100% - 32px));
  margin-inline: auto;
}

.glass-panel {
  border: 1px solid var(--line);
  background: var(--panel);
  backdrop-filter: blur(18px);
}

.text-gradient {
  background: linear-gradient(90deg, #ffffff, var(--accent), var(--accent-2));
  -webkit-background-clip: text;
  color: transparent;
}

.focus-ring:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
```

- [ ] **Step 3: Create public nav**

Create `frontend/components/public/PublicNav.tsx`:

```tsx
import Link from 'next/link';
import { prisma } from '@/lib/db';

export default async function PublicNav() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  const links = [
    ['Home', '/'],
    ['Projects', '/projects'],
    ...(settings?.showDemosInNav ? [['Demos', '/demos']] : []),
    ['Resume', '/resume'],
    ['Contact', '/#contact'],
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-cyan-300/10 bg-slate-950/70 backdrop-blur-xl">
      <nav className="container-wide flex h-16 items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">Mahir Faysal Tusher</Link>
        <div className="hidden items-center gap-6 md:flex">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="focus-ring text-sm text-slate-300 transition-colors hover:text-cyan-200">
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
```

- [ ] **Step 4: Create hero visual**

Create `frontend/components/public/HeroVisual.tsx`:

```tsx
'use client';

import { motion } from 'framer-motion';

export default function HeroVisual() {
  const nodes = Array.from({ length: 18 }, (_, index) => ({
    id: index,
    left: `${8 + ((index * 17) % 84)}%`,
    top: `${10 + ((index * 23) % 76)}%`,
    delay: index * 0.08,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(94,231,255,0.22),transparent_32rem)]" />
      {nodes.map((node) => (
        <motion.span
          key={node.id}
          className="absolute h-1.5 w-1.5 rounded-full bg-cyan-200 shadow-[0_0_18px_rgba(94,231,255,0.9)]"
          style={{ left: node.left, top: node.top }}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: [0.25, 1, 0.25], scale: [0.8, 1.45, 0.8] }}
          transition={{ duration: 4, repeat: Infinity, delay: node.delay }}
        />
      ))}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}
```

- [ ] **Step 5: Create section reveal**

Create `frontend/components/public/SectionReveal.tsx`:

```tsx
'use client';

import { motion } from 'framer-motion';

export default function SectionReveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.section
      className={className}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-120px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  );
}
```

- [ ] **Step 6: Verify styling compiles**

Run:

```powershell
cd frontend
npm run build
```

Expected:

```text
If the build fails here, every error must be from not-yet-created public pages. Fix any CSS syntax error, missing import, or invalid component export before continuing.
```

---

## Task 8: Build Public Homepage

**Files:**
- Create: `frontend/app/(public)/page.tsx`
- Create: `frontend/components/public/HomeSections.tsx`
- Create: `frontend/components/public/ProjectCard.tsx`
- Create: `frontend/components/public/ContactForm.tsx`
- Create: `frontend/app/api/contact/route.ts`
- Create: `frontend/lib/validations/contact.ts`

- [ ] **Step 1: Create contact validation**

Create `frontend/lib/validations/contact.ts`:

```ts
import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(180),
  message: z.string().trim().min(10).max(5000),
});
```

- [ ] **Step 2: Create contact route**

Create `frontend/app/api/contact/route.ts`:

```ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { contactSchema } from '@/lib/validations/contact';

export async function POST(request: Request) {
  const parsed = contactSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please provide a valid name, email, and message.' }, { status: 400 });
  }

  await prisma.contactSubmission.create({ data: parsed.data });

  return NextResponse.json({
    message: 'Thanks for reaching out. Your message has been saved and I will review it soon.',
  });
}
```

- [ ] **Step 3: Create contact form**

Create `frontend/components/public/ContactForm.tsx`:

```tsx
'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('loading');
    setMessage('');

    const formData = new FormData(event.currentTarget);
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message'),
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      setStatus('error');
      setMessage(data.error || 'Message could not be sent.');
      return;
    }

    event.currentTarget.reset();
    setStatus('success');
    setMessage(data.message);
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel space-y-4 rounded-2xl p-6">
      <label className="block">
        <span className="text-sm text-slate-300">Name</span>
        <input name="name" autoComplete="name" required className="mt-1 w-full rounded-md border border-cyan-200/15 bg-slate-950/80 px-3 py-2 text-white" />
      </label>
      <label className="block">
        <span className="text-sm text-slate-300">Email</span>
        <input name="email" type="email" autoComplete="email" required className="mt-1 w-full rounded-md border border-cyan-200/15 bg-slate-950/80 px-3 py-2 text-white" />
      </label>
      <label className="block">
        <span className="text-sm text-slate-300">Message</span>
        <textarea name="message" required rows={5} className="mt-1 w-full rounded-md border border-cyan-200/15 bg-slate-950/80 px-3 py-2 text-white" />
      </label>
      {message && <p role="status" aria-live="polite" className={status === 'error' ? 'text-red-300' : 'text-cyan-200'}>{message}</p>}
      <button disabled={status === 'loading'} className="rounded-md bg-cyan-300 px-5 py-2 font-medium text-slate-950 transition-colors hover:bg-cyan-200 disabled:opacity-60">
        {status === 'loading' ? 'Sending...' : 'Send message'}
      </button>
    </form>
  );
}
```

- [ ] **Step 4: Create project card**

Create `frontend/components/public/ProjectCard.tsx`:

```tsx
import Link from 'next/link';
import type { Project } from '@prisma/client';
import { parseStringArray } from '@/lib/content/json';

export default function ProjectCard({ project }: { project: Project }) {
  const techStack = parseStringArray(project.techStack);

  return (
    <article className="glass-panel group rounded-2xl p-5 transition-transform duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">{project.category}</p>
        <span className="rounded-full border border-cyan-200/20 px-2 py-1 text-xs text-slate-300">{project.status.replace('_', ' ').toLowerCase()}</span>
      </div>
      <h3 className="mt-4 text-xl font-semibold text-white">{project.title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-300">{project.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {techStack.map((tech) => (
          <span key={tech} className="rounded-full bg-cyan-200/10 px-2 py-1 text-xs text-cyan-100">{tech}</span>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-3 text-sm">
        {project.githubUrl && <Link href={project.githubUrl} target="_blank" className="text-cyan-200 hover:text-white">GitHub</Link>}
        {project.liveDemoUrl && <Link href={project.liveDemoUrl} target="_blank" className="text-cyan-200 hover:text-white">Live demo</Link>}
        {project.caseStudyUrl && <Link href={project.caseStudyUrl} target="_blank" className="text-cyan-200 hover:text-white">Case study</Link>}
      </div>
    </article>
  );
}
```

- [ ] **Step 5: Create homepage**

Create `frontend/app/(public)/page.tsx`:

```tsx
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { parseStringArray } from '@/lib/content/json';
import PublicNav from '@/components/public/PublicNav';
import HeroVisual from '@/components/public/HeroVisual';
import SectionReveal from '@/components/public/SectionReveal';
import ProjectCard from '@/components/public/ProjectCard';
import ContactForm from '@/components/public/ContactForm';

export default async function HomePage() {
  const [profile, hero, skillCategories, projects, experience, education, certifications, achievements, socials] = await Promise.all([
    prisma.profile.findUnique({ where: { id: 1 } }),
    prisma.hero.findUnique({ where: { id: 1 } }),
    prisma.skillCategory.findMany({ where: { visible: true }, include: { skills: { where: { visible: true }, orderBy: { sortOrder: 'asc' } } }, orderBy: { sortOrder: 'asc' } }),
    prisma.project.findMany({ where: { visible: true, featured: true }, orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }], take: 6 }),
    prisma.experience.findMany({ where: { visible: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.education.findMany({ where: { visible: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.certification.findMany({ where: { visible: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.achievement.findMany({ where: { visible: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.socialLink.findMany({ where: { visible: true }, orderBy: { sortOrder: 'asc' } }),
  ]);

  return (
    <div className="cinematic-shell">
      <PublicNav />
      <main>
        <section className="relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden px-4 py-24">
          <HeroVisual />
          <div className="container-wide relative z-10">
            <p className="text-sm uppercase tracking-[0.28em] text-cyan-200">{hero?.eyebrow}</p>
            <h1 className="mt-5 max-w-5xl text-5xl font-black leading-[0.95] tracking-tight text-white md:text-7xl">
              {profile?.displayName}
              <span className="block text-gradient">{hero?.headline}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">{hero?.subheadline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={hero?.primaryHref || '/projects'} className="rounded-md bg-cyan-300 px-5 py-3 font-medium text-slate-950 transition-colors hover:bg-cyan-200">{hero?.primaryLabel || 'View Projects'}</Link>
              <Link href={hero?.secondaryHref || '/resume'} className="rounded-md border border-cyan-200/25 px-5 py-3 font-medium text-cyan-100 transition-colors hover:border-cyan-200/60">{hero?.secondaryLabel || 'Resume'}</Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {parseStringArray(hero?.featuredChips).map((chip) => (
                <span key={chip} className="rounded-full border border-cyan-200/20 px-3 py-1 text-sm text-cyan-100">{chip}</span>
              ))}
            </div>
          </div>
        </section>

        <SectionReveal className="container-wide py-20">
          <h2 className="text-3xl font-semibold">About</h2>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">{profile?.about}</p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-300">
            <span>{profile?.role}</span>
            <span>{profile?.location}</span>
            <span>{profile?.currentFocus}</span>
          </div>
        </SectionReveal>

        <SectionReveal className="container-wide py-20">
          <h2 className="text-3xl font-semibold">Skills</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {skillCategories.map((category) => (
              <div key={category.id} className="glass-panel rounded-2xl p-5">
                <h3 className="font-semibold text-cyan-100">{category.name}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span key={skill.id} className="rounded-full bg-white/5 px-2 py-1 text-xs text-slate-200">{skill.name}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </SectionReveal>

        <SectionReveal className="container-wide py-20">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold">Featured Projects</h2>
              <p className="mt-2 text-slate-400">Selected work showing practical AI, ML, and software engineering growth.</p>
            </div>
            <Link href="/projects" className="text-sm text-cyan-200 hover:text-white">View all</Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => <ProjectCard key={project.id} project={project} />)}
          </div>
        </SectionReveal>

        <SectionReveal className="container-wide py-20">
          <h2 className="text-3xl font-semibold">Experience</h2>
          <div className="mt-8 space-y-4">
            {experience.map((item) => (
              <div key={item.id} className="glass-panel rounded-2xl p-5">
                <p className="text-sm text-cyan-200">{item.period}</p>
                <h3 className="mt-2 text-xl font-semibold">{item.role}</h3>
                <p className="text-slate-300">{item.organization}</p>
                {item.summary && <p className="mt-3 text-slate-400">{item.summary}</p>}
              </div>
            ))}
          </div>
        </SectionReveal>

        <SectionReveal className="container-wide py-20">
          <h2 className="text-3xl font-semibold">Education & Certifications</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {education.map((item) => (
              <div key={item.id} className="glass-panel rounded-2xl p-5">
                <h3 className="text-xl font-semibold">{item.degree}</h3>
                <p className="mt-2 text-slate-300">{item.institution}</p>
                <p className="text-sm text-cyan-200">{item.period}</p>
              </div>
            ))}
            {certifications.map((item) => (
              <div key={item.id} className="glass-panel rounded-2xl p-5">
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <p className="mt-2 text-slate-300">{item.issuer}</p>
              </div>
            ))}
          </div>
        </SectionReveal>

        {achievements.length > 0 && (
          <SectionReveal className="container-wide py-20">
            <h2 className="text-3xl font-semibold">Achievements & Hackathons</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {achievements.map((item) => (
                <div key={item.id} className="glass-panel rounded-2xl p-5">
                  <p className="text-sm text-cyan-200">{item.type.toLowerCase()}</p>
                  <h3 className="mt-2 text-xl font-semibold">{item.title}</h3>
                  {item.description && <p className="mt-2 text-slate-300">{item.description}</p>}
                </div>
              ))}
            </div>
          </SectionReveal>
        )}

        <SectionReveal className="container-wide grid gap-8 py-20 md:grid-cols-[0.8fr_1.2fr]" id="contact">
          <div>
            <h2 className="text-3xl font-semibold">Contact</h2>
            <p className="mt-4 text-slate-300">Open to internships, research collaboration, practical AI projects, and freelance opportunities.</p>
            <div className="mt-6 space-y-2 text-sm text-slate-300">
              {socials.map((social) => <Link key={social.id} href={social.url} className="block text-cyan-200 hover:text-white">{social.label}</Link>)}
            </div>
          </div>
          <ContactForm />
        </SectionReveal>
      </main>
    </div>
  );
}
```

- [ ] **Step 6: Verify homepage route**

Run:

```powershell
cd frontend
npm run build
```

Expected:

```text
If the build fails here, every error must be from legacy `frontend/pages` files or old components that Task 13 removes. Fix any error in the new App Router files before continuing.
```

---

## Task 9: Build Projects, Resume, and Demos Public Pages

**Files:**
- Create: `frontend/app/(public)/projects/page.tsx`
- Create: `frontend/app/(public)/resume/page.tsx`
- Create: `frontend/app/(public)/demos/page.tsx`

- [ ] **Step 1: Create projects page**

Create `frontend/app/(public)/projects/page.tsx`:

```tsx
import PublicNav from '@/components/public/PublicNav';
import ProjectCard from '@/components/public/ProjectCard';
import { prisma } from '@/lib/db';

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    where: { visible: true },
    orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }, { updatedAt: 'desc' }],
  });

  return (
    <div className="cinematic-shell min-h-screen">
      <PublicNav />
      <main className="container-wide py-16">
        <h1 className="text-5xl font-black">Projects</h1>
        <p className="mt-4 max-w-2xl text-slate-300">Project cards with links to GitHub, live demos, and external case studies.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => <ProjectCard key={project.id} project={project} />)}
        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Create resume page**

Create `frontend/app/(public)/resume/page.tsx`:

```tsx
import Link from 'next/link';
import PublicNav from '@/components/public/PublicNav';
import { prisma } from '@/lib/db';
import { parseStringArray } from '@/lib/content/json';

export default async function ResumePage() {
  const resume = await prisma.resumeAsset.findUnique({
    where: { id: 1 },
    include: { media: true },
  });
  const highlights = parseStringArray(resume?.highlights);

  return (
    <div className="cinematic-shell min-h-screen">
      <PublicNav />
      <main className="container-wide py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-5xl font-black">Resume</h1>
            <p className="mt-4 text-slate-300">Preview or download the latest PDF resume.</p>
          </div>
          {resume?.media && (
            <Link href={resume.media.url} target="_blank" className="rounded-md bg-cyan-300 px-5 py-3 font-medium text-slate-950 hover:bg-cyan-200">
              Download PDF
            </Link>
          )}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
          <aside className="glass-panel rounded-2xl p-5">
            <h2 className="font-semibold">Highlights</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              {highlights.map((item) => <li key={item}>- {item}</li>)}
            </ul>
            {resume?.lastUpdatedDate && <p className="mt-5 text-xs text-slate-500">Last updated: {resume.lastUpdatedDate}</p>}
          </aside>
          <section className="glass-panel min-h-[720px] rounded-2xl p-3">
            {resume?.media ? (
              <iframe title="Resume PDF preview" src={resume.media.url} className="h-[720px] w-full rounded-xl bg-white" />
            ) : (
              <div className="flex h-[720px] items-center justify-center text-slate-400">Resume PDF has not been uploaded yet.</div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 3: Create future demos page**

Create `frontend/app/(public)/demos/page.tsx`:

```tsx
import PublicNav from '@/components/public/PublicNav';
import { prisma } from '@/lib/db';

export default async function DemosPage() {
  const demos = await prisma.demo.findMany({
    where: { visible: true },
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <div className="cinematic-shell min-h-screen">
      <PublicNav />
      <main className="container-wide py-16">
        <h1 className="text-5xl font-black">AI/ML Demos</h1>
        <p className="mt-4 max-w-2xl text-slate-300">Future-ready demos for LLM, ML, and MLOps work.</p>
        {demos.length === 0 ? (
          <div className="glass-panel mt-10 rounded-2xl p-8 text-slate-300">Demos are being prepared and will appear here when ready.</div>
        ) : (
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {demos.map((demo) => (
              <article key={demo.id} className="glass-panel rounded-2xl p-5">
                <p className="text-sm text-cyan-200">{demo.domain}</p>
                <h2 className="mt-2 text-xl font-semibold">{demo.title}</h2>
                <p className="mt-3 text-slate-300">{demo.description}</p>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
```

- [ ] **Step 4: Verify public pages**

Run:

```powershell
cd frontend
npm run build
```

Expected:

```text
New public routes compile, legacy conflicts may remain until cleanup.
```

---

## Task 10: Implement Admin CRUD Routes and Forms

**Files:**
- Create: `frontend/lib/admin/resources.ts`
- Create: `frontend/app/api/admin/[resource]/route.ts`
- Create: `frontend/components/admin/ResourceEditor.tsx`
- Create/Modify: all `/admin/*/page.tsx` section pages

- [ ] **Step 1: Define resource configuration**

Create `frontend/lib/admin/resources.ts`:

```ts
export const resourceLabels = {
  skills: 'Skills',
  projects: 'Projects',
  demos: 'Demos',
  experience: 'Experience',
  education: 'Education',
  certifications: 'Certifications',
  achievements: 'Achievements',
  social: 'Social Links',
} as const;

export type AdminResource = keyof typeof resourceLabels;

export function isAdminResource(value: string): value is AdminResource {
  return value in resourceLabels;
}
```

- [ ] **Step 2: Create route handler skeleton**

Create `frontend/app/api/admin/[resource]/route.ts`:

```ts
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import { isAdminResource } from '@/lib/admin/resources';

export async function GET(_request: Request, { params }: { params: { resource: string } }) {
  requireAdmin();
  if (!isAdminResource(params.resource)) {
    return NextResponse.json({ error: 'Unknown resource' }, { status: 404 });
  }

  switch (params.resource) {
    case 'projects':
      return NextResponse.json(await prisma.project.findMany({ orderBy: { sortOrder: 'asc' } }));
    case 'demos':
      return NextResponse.json(await prisma.demo.findMany({ orderBy: { sortOrder: 'asc' } }));
    case 'experience':
      return NextResponse.json(await prisma.experience.findMany({ orderBy: { sortOrder: 'asc' } }));
    case 'education':
      return NextResponse.json(await prisma.education.findMany({ orderBy: { sortOrder: 'asc' } }));
    case 'certifications':
      return NextResponse.json(await prisma.certification.findMany({ orderBy: { sortOrder: 'asc' } }));
    case 'achievements':
      return NextResponse.json(await prisma.achievement.findMany({ orderBy: { sortOrder: 'asc' } }));
    case 'social':
      return NextResponse.json(await prisma.socialLink.findMany({ orderBy: { sortOrder: 'asc' } }));
    case 'skills':
      return NextResponse.json(await prisma.skillCategory.findMany({ include: { skills: true }, orderBy: { sortOrder: 'asc' } }));
  }
}
```

This route is read-only. Mutations live in the section pages below as server actions with explicit field lists and validation. Do not add a weak generic mutation that accepts arbitrary fields without validation.

- [ ] **Step 3: Create profile admin page**

Create `frontend/app/admin/profile/page.tsx`:

```tsx
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth/session';
import { FormField } from '@/components/admin/FormField';

async function saveProfile(formData: FormData) {
  'use server';
  requireAdmin();
  await prisma.profile.update({
    where: { id: 1 },
    data: {
      displayName: String(formData.get('displayName') || ''),
      role: String(formData.get('role') || ''),
      shortBio: String(formData.get('shortBio') || ''),
      about: String(formData.get('about') || ''),
      location: String(formData.get('location') || ''),
      email: String(formData.get('email') || ''),
      currentFocus: String(formData.get('currentFocus') || ''),
    },
  });
  revalidatePath('/');
  revalidatePath('/admin/profile');
}

export default async function ProfileAdminPage() {
  const profile = await prisma.profile.findUnique({ where: { id: 1 } });

  return (
    <div>
      <h1 className="text-3xl font-semibold">Profile</h1>
      <form action={saveProfile} className="mt-6 max-w-3xl space-y-4 rounded-lg border border-slate-200 bg-white p-6">
        <FormField label="Display name" name="displayName" defaultValue={profile?.displayName} required />
        <FormField label="Role" name="role" defaultValue={profile?.role} required />
        <FormField label="Short bio" name="shortBio" defaultValue={profile?.shortBio} textarea required />
        <FormField label="About" name="about" defaultValue={profile?.about} textarea required />
        <FormField label="Location" name="location" defaultValue={profile?.location} />
        <FormField label="Email" name="email" type="email" defaultValue={profile?.email} />
        <FormField label="Current focus" name="currentFocus" defaultValue={profile?.currentFocus} textarea />
        <button className="rounded-md bg-slate-950 px-4 py-2 text-white">Save profile</button>
      </form>
    </div>
  );
}
```

- [ ] **Step 4: Create hero admin page**

Create `frontend/app/admin/hero/page.tsx`:

```tsx
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth/session';
import { FormField } from '@/components/admin/FormField';
import { stringifyStringArray } from '@/lib/content/json';

async function saveHero(formData: FormData) {
  'use server';
  requireAdmin();
  const chips = String(formData.get('featuredChips') || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  await prisma.hero.update({
    where: { id: 1 },
    data: {
      eyebrow: String(formData.get('eyebrow') || ''),
      headline: String(formData.get('headline') || ''),
      subheadline: String(formData.get('subheadline') || ''),
      primaryLabel: String(formData.get('primaryLabel') || ''),
      primaryHref: String(formData.get('primaryHref') || ''),
      secondaryLabel: String(formData.get('secondaryLabel') || ''),
      secondaryHref: String(formData.get('secondaryHref') || ''),
      featuredChips: stringifyStringArray(chips),
    },
  });
  revalidatePath('/');
  revalidatePath('/admin/hero');
}

export default async function HeroAdminPage() {
  const hero = await prisma.hero.findUnique({ where: { id: 1 } });

  return (
    <div>
      <h1 className="text-3xl font-semibold">Hero</h1>
      <form action={saveHero} className="mt-6 max-w-3xl space-y-4 rounded-lg border border-slate-200 bg-white p-6">
        <FormField label="Eyebrow" name="eyebrow" defaultValue={hero?.eyebrow} />
        <FormField label="Headline" name="headline" defaultValue={hero?.headline} textarea required />
        <FormField label="Subheadline" name="subheadline" defaultValue={hero?.subheadline} textarea required />
        <FormField label="Primary button label" name="primaryLabel" defaultValue={hero?.primaryLabel} />
        <FormField label="Primary button link" name="primaryHref" defaultValue={hero?.primaryHref} />
        <FormField label="Secondary button label" name="secondaryLabel" defaultValue={hero?.secondaryLabel} />
        <FormField label="Secondary button link" name="secondaryHref" defaultValue={hero?.secondaryHref} />
        <FormField label="Featured chips, comma separated" name="featuredChips" defaultValue={hero?.featuredChips} />
        <button className="rounded-md bg-slate-950 px-4 py-2 text-white">Save hero</button>
      </form>
    </div>
  );
}
```

- [ ] **Step 5: Implement the section admin pages**

Create each section page with the form-first pattern shown in profile and hero. Use these exact files and editable fields:

```text
frontend/app/admin/skills/page.tsx
  SkillCategory: name, description, sortOrder, visible
  Skill: categoryId, name, level, description, sortOrder, visible

frontend/app/admin/projects/page.tsx
  Project: title, slug, summary, description, techStack, role, status, imageUrl, githubUrl, liveUrl, caseStudyUrl, featured, visible, sortOrder

frontend/app/admin/demos/page.tsx
  Demo: title, summary, demoUrl, repositoryUrl, videoUrl, imageUrl, enabled, visible, sortOrder

frontend/app/admin/experience/page.tsx
  Experience: company, role, location, startDate, endDate, description, highlights, visible, sortOrder

frontend/app/admin/education/page.tsx
  Education: institution, degree, field, location, startDate, endDate, description, visible, sortOrder

frontend/app/admin/certifications/page.tsx
  Certification: title, issuer, issueDate, credentialUrl, visible, sortOrder

frontend/app/admin/achievements/page.tsx
  Achievement: title, organization, date, description, type, url, visible, sortOrder

frontend/app/admin/social/page.tsx
  SocialLink: label, href, icon, visible, sortOrder

frontend/app/admin/settings/page.tsx
  SiteSettings: siteTitle, siteDescription, showDemosInNav, showAchievementsWhenEmpty, contactEmail
```

Each page must include these server actions by name:

```text
createItem(formData)
updateItem(id, formData)
deleteItem(id)
```

Each server action must call `requireAdmin()`, validate required fields before writing, convert comma/newline fields with `stringifyStringArray()`, convert checkbox values with `formData.get('field') === 'on'`, and call `revalidatePath()` for the related public route. Projects must revalidate `/` and `/projects`; demos must revalidate `/` and `/demos`; resume/settings/social/skills/experience/education/certifications/achievements must revalidate `/`; all pages must revalidate their own admin route.

Use this delete button pattern in every list item:

```tsx
<button
  formAction={deleteItem.bind(null, item.id)}
  className="rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-700"
>
  Delete
</button>
```

- [ ] **Step 6: Verify admin pages**

Run:

```powershell
cd frontend
npm run type-check
npm run build
```

Expected:

```text
Both should pass after old conflicting files are removed.
```

If old files still fail compilation, move to cleanup task.

---

## Task 11: Implement Media Upload and Resume Admin

**Files:**
- Create: `frontend/lib/media/upload.ts`
- Create: `frontend/app/api/media/upload/route.ts`
- Create: `frontend/app/admin/resume/page.tsx`

- [ ] **Step 1: Add media validation/upload helper**

Create `frontend/lib/media/upload.ts`:

```ts
export const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'] as const;
export const allowedPdfTypes = ['application/pdf'] as const;

export function assertAllowedFile(file: File, mode: 'image' | 'pdf') {
  const allowed = mode === 'image' ? allowedImageTypes : allowedPdfTypes;
  if (!allowed.includes(file.type as never)) {
    throw new Error(mode === 'image' ? 'Only JPG, PNG, and WebP images are allowed.' : 'Only PDF files are allowed.');
  }
  const maxSize = mode === 'image' ? 5 * 1024 * 1024 : 10 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error(mode === 'image' ? 'Image must be smaller than 5 MB.' : 'PDF must be smaller than 10 MB.');
  }
}
```

- [ ] **Step 2: Add upload route**

Create `frontend/app/api/media/upload/route.ts`:

```ts
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/session';
import { prisma } from '@/lib/db';
import { assertAllowedFile } from '@/lib/media/upload';

export async function POST(request: Request) {
  requireAdmin();
  const formData = await request.formData();
  const file = formData.get('file');
  const mode = formData.get('mode') === 'pdf' ? 'pdf' : 'image';

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Missing file.' }, { status: 400 });
  }

  try {
    assertAllowedFile(file, mode);
    const blob = await put(file.name, file, { access: 'public' });
    const media = await prisma.mediaAsset.create({
      data: {
        url: blob.url,
        key: blob.pathname,
        fileName: file.name,
        mimeType: file.type,
        fileSize: file.size,
      },
    });
    return NextResponse.json({ media });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Upload failed.' }, { status: 400 });
  }
}
```

- [ ] **Step 3: Add resume admin page**

Create `frontend/app/admin/resume/page.tsx`:

```tsx
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth/session';
import { parseStringArray, stringifyStringArray } from '@/lib/content/json';
import { FormField } from '@/components/admin/FormField';

async function saveResume(formData: FormData) {
  'use server';
  requireAdmin();
  const highlights = String(formData.get('highlights') || '')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
  await prisma.resumeAsset.update({
    where: { id: 1 },
    data: {
      highlights: stringifyStringArray(highlights),
      lastUpdatedDate: String(formData.get('lastUpdatedDate') || ''),
    },
  });
  revalidatePath('/resume');
}

export default async function ResumeAdminPage() {
  const resume = await prisma.resumeAsset.findUnique({ where: { id: 1 }, include: { media: true } });
  const highlights = parseStringArray(resume?.highlights).join('\n');

  return (
    <div>
      <h1 className="text-3xl font-semibold">Resume</h1>
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-600">Current PDF: {resume?.media?.fileName || 'No PDF uploaded'}</p>
        <p className="mt-2 text-sm text-slate-500">After Step 4, add the PDF uploader here and save the returned media id to `ResumeAsset.mediaId`.</p>
      </div>
      <form action={saveResume} className="mt-6 max-w-3xl space-y-4 rounded-lg border border-slate-200 bg-white p-6">
        <FormField label="Last updated date" name="lastUpdatedDate" defaultValue={resume?.lastUpdatedDate} />
        <FormField label="Highlights, one per line" name="highlights" defaultValue={highlights} textarea />
        <button className="rounded-md bg-slate-950 px-4 py-2 text-white">Save resume details</button>
      </form>
    </div>
  );
}
```

- [ ] **Step 4: Complete upload UI**

Create `frontend/components/admin/MediaUpload.tsx`:

```tsx
'use client';

import { useState, type ChangeEvent } from 'react';

type MediaAsset = {
  id: number;
  url: string;
  fileName: string;
  mimeType: string;
};

type MediaUploadProps = {
  mode: 'image' | 'pdf';
  onUploaded: (media: MediaAsset) => void;
};

export function MediaUpload({ mode, onUploaded }: MediaUploadProps) {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const body = new FormData();
    body.append('file', file);
    body.append('mode', mode);
    setStatus('uploading');
    setMessage('');

    const response = await fetch('/api/media/upload', {
      method: 'POST',
      body,
    });
    const result = await response.json();

    if (!response.ok) {
      setStatus('error');
      setMessage(result.error || 'Upload failed.');
      return;
    }

    setStatus('done');
    setMessage(`${result.media.fileName} uploaded.`);
    onUploaded(result.media);
  }

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept={mode === 'pdf' ? 'application/pdf' : 'image/jpeg,image/png,image/webp'}
        onChange={upload}
        className="block w-full text-sm text-slate-700"
      />
      {status !== 'idle' ? <p className="text-sm text-slate-500">{status === 'uploading' ? 'Uploading...' : message}</p> : null}
    </div>
  );
}
```

Then create `frontend/components/admin/ResumePdfUpload.tsx`:

```tsx
'use client';

import { useTransition } from 'react';
import { MediaUpload } from './MediaUpload';

type ResumePdfUploadProps = {
  saveMedia: (mediaId: number) => Promise<void>;
};

export function ResumePdfUpload({ saveMedia }: ResumePdfUploadProps) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="rounded-lg border border-dashed border-slate-300 p-4">
      <MediaUpload
        mode="pdf"
        onUploaded={(media) => {
          startTransition(async () => {
            await saveMedia(media.id);
          });
        }}
      />
      {pending ? <p className="mt-2 text-sm text-slate-500">Saving resume link...</p> : null}
    </div>
  );
}
```

Update `frontend/app/admin/resume/page.tsx` with:

```tsx
import { ResumePdfUpload } from '@/components/admin/ResumePdfUpload';

async function saveResumeMedia(mediaId: number) {
  'use server';
  requireAdmin();
  await prisma.resumeAsset.update({ where: { id: 1 }, data: { mediaId } });
  revalidatePath('/resume');
  revalidatePath('/admin/resume');
}
```

Render `<ResumePdfUpload saveMedia={saveResumeMedia} />` below the current PDF line.

- [ ] **Step 5: Verify media validation**

Run a manual upload test from admin after login:

```text
Upload a PDF smaller than 10 MB.
Upload a .txt file and confirm it is rejected.
Upload an SVG and confirm it is rejected.
```

Expected:

```text
PDF succeeds. TXT and SVG fail with clear messages.
```

---

## Task 12: Build Contact Inbox Admin

**Files:**
- Create: `frontend/app/admin/contact-submissions/page.tsx`

- [ ] **Step 1: Create inbox page**

Create `frontend/app/admin/contact-submissions/page.tsx`:

```tsx
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth/session';

async function markRead(formData: FormData) {
  'use server';
  requireAdmin();
  await prisma.contactSubmission.update({
    where: { id: Number(formData.get('id')) },
    data: { read: true },
  });
  revalidatePath('/admin/contact-submissions');
}

async function archiveMessage(formData: FormData) {
  'use server';
  requireAdmin();
  await prisma.contactSubmission.update({
    where: { id: Number(formData.get('id')) },
    data: { archived: true },
  });
  revalidatePath('/admin/contact-submissions');
}

export default async function ContactSubmissionsPage() {
  const submissions = await prisma.contactSubmission.findMany({
    where: { archived: false },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <h1 className="text-3xl font-semibold">Contact Inbox</h1>
      <div className="mt-6 space-y-4">
        {submissions.map((submission) => (
          <article key={submission.id} className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold">{submission.name}</h2>
                <a href={`mailto:${submission.email}`} className="text-sm text-blue-600">{submission.email}</a>
              </div>
              <span className={submission.read ? 'text-sm text-slate-500' : 'text-sm font-medium text-emerald-700'}>{submission.read ? 'Read' : 'Unread'}</span>
            </div>
            <p className="mt-4 whitespace-pre-wrap text-slate-700">{submission.message}</p>
            <div className="mt-4 flex gap-3">
              <form action={markRead}>
                <input type="hidden" name="id" value={submission.id} />
                <button className="rounded-md border border-slate-300 px-3 py-1.5 text-sm">Mark read</button>
              </form>
              <form action={archiveMessage}>
                <input type="hidden" name="id" value={submission.id} />
                <button className="rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-700">Archive</button>
              </form>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify inbox**

Run the app, submit a contact form, then visit `/admin/contact-submissions`.

Expected:

```text
The new message appears as unread. Mark read changes it to read. Archive removes it from the list.
```

---

## Task 13: Retire Legacy Pages and Backend Complexity

**Files:**
- Move/Delete after verification:
  - `frontend/pages/`
  - old unused `frontend/components/*`
  - `backend/`
  - `tests/`
  - `docker-compose.yml`
  - `Dockerfile`
  - backend rewrites in `vercel.json`

- [ ] **Step 1: Confirm App Router routes exist**

Run:

```powershell
Get-ChildItem frontend\app -Recurse -File | Select-Object FullName
```

Expected includes:

```text
frontend\app\(public)\page.tsx
frontend\app\(public)\projects\page.tsx
frontend\app\(public)\resume\page.tsx
frontend\app\admin\page.tsx
frontend\app\admin\login\page.tsx
```

- [ ] **Step 2: Move legacy pages to quarantine**

Create:

```text
frontend/_legacy/
```

Move old files there first instead of deleting:

```powershell
New-Item -ItemType Directory -Force frontend\_legacy | Out-Null
Move-Item -LiteralPath frontend\pages -Destination frontend\_legacy\pages
```

Expected:

```text
frontend/pages no longer exists.
frontend/_legacy/pages exists.
```

- [ ] **Step 3: Remove backend rewrites**

Replace `vercel.json` with:

```json
{
  "buildCommand": "cd frontend && npm run build",
  "outputDirectory": "frontend/.next",
  "installCommand": "npm install"
}
```

- [ ] **Step 4: Remove backend from root scripts**

Confirm `package.json` no longer includes:

```text
dev:backend
lint:backend
test:backend
docker:*
export
```

- [ ] **Step 5: Decide backend archive**

If the owner wants to preserve the old AI demo backend for reference, move it:

```powershell
New-Item -ItemType Directory -Force archive | Out-Null
Move-Item -LiteralPath backend -Destination archive\backend-fastapi-demo
Move-Item -LiteralPath tests -Destination archive\backend-tests
```

If the owner wants a cleaner repository, delete those paths in a separate cleanup commit after confirming the new app is functional.

- [ ] **Step 6: Verify no old imports remain**

Run:

```powershell
Select-String -Path frontend\**\*.ts,frontend\**\*.tsx -Pattern "pages/api|@/components/sections|backend|FastAPI|RAGSystem|SimpleAgent" -CaseSensitive:$false
```

Expected:

```text
No matches in active app files.
```

---

## Task 14: Add Tests

**Files:**
- Create: `frontend/__tests__/content-json.test.ts`
- Create: `frontend/__tests__/contact-validation.test.ts`
- Create: `frontend/__tests__/project-visibility.test.ts`
- Modify: `frontend/jest.config.js`
- Modify: `frontend/jest.setup.js`

- [ ] **Step 1: Add JSON helper tests**

Create `frontend/__tests__/content-json.test.ts`:

```ts
import { parseStringArray, stringifyStringArray, toSlug } from '@/lib/content/json';

describe('content json helpers', () => {
  it('parses string arrays safely', () => {
    expect(parseStringArray('["LLM","MLOps"]')).toEqual(['LLM', 'MLOps']);
    expect(parseStringArray('bad json')).toEqual([]);
    expect(parseStringArray('{"x":1}')).toEqual([]);
  });

  it('stringifies only non-empty strings', () => {
    expect(stringifyStringArray(['AI', '', 1, 'ML'])).toBe('["AI","ML"]');
  });

  it('creates clean slugs', () => {
    expect(toSlug('My AI/ML Project!')).toBe('my-aiml-project');
  });
});
```

- [ ] **Step 2: Add contact validation tests**

Create `frontend/__tests__/contact-validation.test.ts`:

```ts
import { contactSchema } from '@/lib/validations/contact';

describe('contact validation', () => {
  it('accepts valid contact submissions', () => {
    const result = contactSchema.safeParse({
      name: 'Mahir',
      email: 'mahir@example.com',
      message: 'I would like to discuss an internship opportunity.',
    });
    expect(result.success).toBe(true);
  });

  it('rejects short messages', () => {
    const result = contactSchema.safeParse({
      name: 'Mahir',
      email: 'mahir@example.com',
      message: 'Hi',
    });
    expect(result.success).toBe(false);
  });
});
```

- [ ] **Step 3: Add browser mocks**

Update `frontend/jest.setup.js`:

```js
import '@testing-library/jest-dom';

global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  disconnect() {}
  unobserve() {}
};

global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {}
  disconnect() {}
  unobserve() {}
};
```

- [ ] **Step 4: Run tests**

Run:

```powershell
cd frontend
npm run test -- --runInBand
```

Expected:

```text
PASS __tests__/content-json.test.ts
PASS __tests__/contact-validation.test.ts
```

---

## Task 15: Update Documentation

**Files:**
- Replace: `README.md`
- Replace: `SETUP.md`
- Replace: `QUICKSTART.md`
- Create: `docs/DEPLOYMENT_VERCEL.md`
- Create: `docs/ADMIN_GUIDE.md`

- [ ] **Step 1: Replace README summary**

README must clearly say:

```markdown
# Mahir Faysal Tusher Portfolio

Admin-managed AI/ML engineering portfolio for an undergraduate Computer Science student.

## What This Site Includes

- Cinematic public portfolio
- Private single-owner admin panel
- Editable profile, hero, skills, projects, experience, education, certifications, achievements, resume, social links, and contact inbox
- Featured project cards with GitHub, live demo, and external case-study links
- Dedicated resume preview/download page
- Future-ready AI/ML demos section

## Local Development

1. Copy `frontend/.env.example` to `frontend/.env.local`.
2. Fill in PostgreSQL database credentials and secrets.
3. Run `npm install`.
4. Run `cd frontend && npx prisma migrate dev`.
5. Run `cd frontend && npm run db:seed`.
6. Run `npm run dev`.
```

- [ ] **Step 2: Add admin guide**

Create `docs/ADMIN_GUIDE.md` with:

```markdown
# Admin Guide

The admin panel is private and intended only for the site owner.

## Login

Visit `/admin/login`.

## Editing Content

Each portfolio section has a designated admin page:

- Profile
- Hero
- Skills
- Projects
- Demos
- Experience
- Education
- Certifications
- Achievements
- Resume
- Social Links
- Contact Inbox
- Settings

Use visibility toggles to hide content until it is ready.

## Projects

Projects are shown as cards. Use the external case study URL to link to a separate blog or case-study website.

## Demos

Demos can stay hidden until real demos are ready.

## Resume

Upload a PDF and update the highlights shown on `/resume`.
```

- [ ] **Step 3: Add Vercel deployment guide**

Create `docs/DEPLOYMENT_VERCEL.md` with:

```markdown
# Vercel Deployment

## Required Services

- Vercel project
- PostgreSQL database
- Vercel Blob for file uploads

## Required Environment Variables

- DATABASE_URL
- DIRECT_URL
- JWT_SECRET
- CSRF_SECRET
- NEXT_PUBLIC_SITE_URL
- BLOB_READ_WRITE_TOKEN

## Deploy

1. Import the repository into Vercel.
2. Set the root directory to the repository root.
3. Use build command: `cd frontend && npm run build`.
4. Use output directory: `frontend/.next`.
5. Add all required environment variables.
6. Deploy.
7. Run Prisma migrations against the production database.
8. Log into `/admin/login` and replace starter content.
```

- [ ] **Step 4: Verify docs have no mojibake**

Run:

```powershell
Select-String -Path README.md,SETUP.md,QUICKSTART.md,docs\*.md -Pattern "ð|â|�"
```

Expected:

```text
No matches.
```

---

## Task 16: Final Verification

**Files:**
- Modify only if verification reveals issues.

- [ ] **Step 1: Type-check**

Run:

```powershell
npm run type-check
```

Expected:

```text
Exit code 0.
```

- [ ] **Step 2: Lint**

Run:

```powershell
npm run lint
```

Expected:

```text
Exit code 0.
```

- [ ] **Step 3: Tests**

Run:

```powershell
npm run test
```

Expected:

```text
All test suites pass.
```

- [ ] **Step 4: Build**

Run:

```powershell
npm run build
```

Expected:

```text
Compiled successfully.
```

- [ ] **Step 5: Browser smoke check**

Start dev server:

```powershell
npm run dev
```

Visit:

```text
http://localhost:3000
http://localhost:3000/projects
http://localhost:3000/resume
http://localhost:3000/admin/login
```

Expected:

```text
Homepage renders with cinematic hero.
Projects page shows visible projects.
Resume page shows fallback or PDF preview.
Admin login page renders.
No raw database error appears.
No app-level console errors appear.
```

- [ ] **Step 6: Admin smoke check**

Log in with seeded admin credentials.

Expected:

```text
Admin dashboard loads.
Profile page saves edits.
Hero page saves edits.
Projects page can add or edit a project.
Contact submission appears after public form submit.
```

- [ ] **Step 7: Security checks**

Verify:

```text
/admin redirects to /admin/login when logged out.
Invalid login fails.
PDF upload rejects non-PDF files.
Image upload rejects SVG.
Hidden achievements do not appear on homepage.
Hidden demos do not appear in navigation.
```

- [ ] **Step 8: Commit final reconstruction**

Run:

```powershell
git status --short
git add package.json package-lock.json vercel.json README.md SETUP.md QUICKSTART.md docs frontend
git commit -m "feat: reconstruct admin-managed AI portfolio"
```

Expected:

```text
Commit succeeds with message: feat: reconstruct admin-managed AI portfolio
```

---

## Implementation Order Recommendation

Use this sequence for execution:

1. Task 1
2. Task 2
3. Task 3
4. Task 4
5. Task 5
6. Task 6
7. Task 7
8. Task 8
9. Task 9
10. Task 10
11. Task 11
12. Task 12
13. Task 13
14. Task 14
15. Task 15
16. Task 16

Do not jump to visual polish before admin auth, database, and content model are working. The admin-managed foundation is the main reason this reconstruction exists.
