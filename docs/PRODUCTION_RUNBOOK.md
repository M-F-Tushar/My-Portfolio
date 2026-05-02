# Production Runbook

This is the end-to-end path from local code to the public Vercel production site.

## Current Pipeline

1. Push to `main` on GitHub.
2. GitHub Actions runs `.github/workflows/ci.yml`.
3. CI installs from the root `package-lock.json`, generates Prisma Client, lints, type-checks, and builds.
4. Vercel deploys the same `main` commit to production.
5. The public production alias is served from Vercel Domains.

The active app is the Next.js project in `frontend/`. The archived FastAPI, Docker, and old Pages Router code under `archive/` is not part of production.

## Local Release Check

Run these from the repository root before pushing:

```powershell
npm ci
npm run db:generate
npm run lint
npm run type-check
npm run test
npm run build
```

## GitHub Check

After pushing:

1. Open GitHub Actions.
2. Confirm the latest `CI/CD Pipeline` run for `main` is green.
3. Confirm the run SHA matches `git rev-parse HEAD`.

## Vercel Check

After CI is green:

1. Open the Vercel project deployments.
2. Confirm the latest production deployment is `READY`.
3. Confirm the deployment commit SHA matches GitHub `main`.
4. Open the production domain and verify:
   - `/`
   - `/projects`
   - `/resume`
   - `/demos`
   - `/admin/login`
   - `/api/health`

Generated deployment URLs can still ask for Vercel login when Deployment Protection is enabled. The production domain can be public while generated preview/deployment URLs remain protected.

## Required Vercel Settings

Project setting:

```text
Root Directory: frontend
```

Build settings:

```json
{
  "installCommand": "npm install",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

Environment variables:

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
NEXT_PUBLIC_SITE_URL="https://your-production-domain.com"
JWT_SECRET="long-random-secret"
CSRF_SECRET="another-long-random-secret"
BLOB_READ_WRITE_TOKEN="vercel-blob-token"
RESEND_API_KEY=""
RESEND_FROM_EMAIL="onboarding@resend.dev"
RESEND_TO_EMAIL=""
ADMIN_EMAIL="owner@example.com"
ADMIN_PASSWORD="change-this-before-real-use"
```

## Supabase Backend Readiness

Use Supabase as the production PostgreSQL provider like this:

1. Create a Supabase project.
2. Copy the pooled connection string into `DATABASE_URL`.
3. Copy the direct connection string into `DIRECT_URL`.
4. Add both values to Vercel for Production and Preview.
5. From a trusted local terminal with the production env loaded, run:

```powershell
npm run db:push
npm run db:seed
```

6. Visit `/api/health`. It should return `database: "ok"`.
7. Log in to `/admin/login`.
8. Submit one contact form test and confirm it appears in `Contact Inbox`.

If `/api/health` returns `503` with `database: "error"`, the app code deployed but the database URL, user, password, host, or Supabase project state is wrong.

## Custom Domain Readiness

When adding a real domain:

1. Add the domain in Vercel Project Settings -> Domains.
2. Add the DNS record Vercel asks for at the domain registrar.
3. Wait for Vercel to show the domain as valid and SSL-ready.
4. Update `NEXT_PUBLIC_SITE_URL` in Vercel to the final `https://...` domain.
5. Redeploy production.
6. Check `/robots.txt`, `/sitemap.xml`, Open Graph metadata, and the main pages.

For apex domains, Vercel usually gives an `A` record. For `www`, it usually gives a `CNAME`. Use exactly the records Vercel shows for the domain.

## Deployment Protection

The earlier Vercel dashboard `403 Forbidden` came from Deployment Protection plus iframe restrictions. The code now allows Vercel dashboard framing, but generated deployment URLs can still show Vercel Authentication when Standard Protection is enabled.

Use one of these settings:

- Public portfolio: turn Vercel Authentication off for production/deployment URLs.
- Private previews: keep protection on for previews, but use the production domain when sharing the portfolio publicly.
