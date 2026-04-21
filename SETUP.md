# Setup Guide

## 1. Install

Run this from the repository root:

```powershell
npm install
```

## 2. Create `.env.local`

The app reads private settings from `frontend/.env.local` while running locally.

```powershell
Copy-Item frontend\.env.example frontend\.env.local
```

Then open `frontend/.env.local` and replace the placeholder values.

Minimum required values:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
JWT_SECRET="replace-with-a-long-random-secret"
CSRF_SECRET="replace-with-another-long-random-secret"
```

For resume uploads, also add:

```env
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
```

Full explanation: [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md).

## 3. Prepare the Database

After the database URL is correct:

```powershell
npm run db:generate
npm run db:migrate
npm run db:seed
```

Use `db:migrate` when you want Prisma to create or update tables in a development database.

## 4. Run Locally

```powershell
npm run dev
```

Public site: `http://localhost:3000`

Admin login: `http://localhost:3000/admin/login`

## 5. Check Before Deployment

```powershell
npm run type-check
npm run test
npm run build
```

If build fails because an environment variable is missing, add it to `frontend/.env.local` locally or to Vercel project settings in production.
