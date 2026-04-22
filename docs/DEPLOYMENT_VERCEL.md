# Vercel Deployment

This project deploys to Vercel as a Next.js application.

Important project setting:

```text
Root Directory: frontend
```

Because Vercel builds from `frontend`, commands in `vercel.json` run inside that directory.

Current Vercel config:

```json
{
  "installCommand": "npm install",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

Do not use `cd frontend && npm run build` while the Vercel root directory is `frontend`. That makes Vercel look for `frontend/frontend`, which fails with:

```text
cd: frontend: No such file or directory
```

## Before Deploying

Run these checks locally from the repository root:

```powershell
npm run type-check
npm run test
npm run build
```

The root build command still works locally because it enters `frontend` before running the app build.

## Environment Variables

Add these in Vercel project settings:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
NEXT_PUBLIC_SITE_URL="https://your-domain.com"
JWT_SECRET="long-random-secret"
CSRF_SECRET="another-long-random-secret"
BLOB_READ_WRITE_TOKEN="vercel-blob-token"
RESEND_API_KEY=""
RESEND_FROM_EMAIL="onboarding@resend.dev"
RESEND_TO_EMAIL=""
ADMIN_EMAIL="owner@example.com"
ADMIN_PASSWORD="change-this-before-real-use"
```

`BLOB_READ_WRITE_TOKEN` is needed for resume PDF upload from the admin panel.

`ADMIN_EMAIL` and `ADMIN_PASSWORD` are used when seeding the first admin account.

## Database

Use PostgreSQL. Beginner-friendly options include:

1. Vercel Postgres
2. Neon
3. Supabase
4. Railway

For the current schema-first project, the simplest first setup is:

```powershell
cd frontend
npx prisma db push
npm run db:seed
```

If you later add committed Prisma migrations, production deployment should use:

```powershell
cd frontend
npx prisma migrate deploy
npm run db:seed
```

## Resume Upload

Create a Vercel Blob store and add `BLOB_READ_WRITE_TOKEN` to Vercel. Then log in to `/admin/resume` and upload the PDF.

## Production Checklist

- Vercel root directory is `frontend`.
- `vercel.json` build command is `npm run build`.
- Environment variables are set in Vercel.
- PostgreSQL tables exist.
- Seed data created the first admin account.
- Resume PDF is uploaded.
- Unfinished demos and achievements remain hidden.
- Contact form successfully saves a test message.
- Preview protection is configured the way you want.
