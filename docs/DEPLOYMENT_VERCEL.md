# Vercel Deployment

This project is configured to deploy from the repository root.

Vercel uses:

```json
{
  "installCommand": "npm install",
  "buildCommand": "cd frontend && npm run build",
  "outputDirectory": "frontend/.next",
  "framework": "nextjs"
}
```

## Before Deploying

Run locally:

```powershell
npm run type-check
npm run test
npm run build
```

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
```

`BLOB_READ_WRITE_TOKEN` is needed for resume PDF upload from the admin panel.

## Database

Use PostgreSQL. Good beginner-friendly options:

1. Vercel Postgres
2. Neon
3. Supabase
4. Railway

After deployment, run Prisma migrations against the production database from your machine or from a deployment workflow:

```powershell
cd frontend
npx prisma migrate deploy
npx prisma db seed
```

## Resume Upload

Create a Vercel Blob store and add `BLOB_READ_WRITE_TOKEN` to Vercel. Then log in to `/admin/resume` and upload the PDF.

## Production Checklist

- Environment variables are set in Vercel.
- Database migrations are deployed.
- Seed data created the first admin account.
- Resume PDF is uploaded.
- Unfinished demos and achievements remain hidden.
- Contact form successfully saves a test message.
