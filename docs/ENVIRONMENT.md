# Environment Variables

Environment variables are private settings the app needs but should not store in source code. Examples are database passwords, login secrets, and upload tokens.

For local development, put them in:

```text
frontend/.env.local
```

For Vercel, put the same keys in:

```text
Vercel project -> Settings -> Environment Variables
```

## Why `.env.local` Exists

The code uses names like `DATABASE_URL` and `JWT_SECRET`, but the real values are different for each owner and deployment. `.env.local` lets your computer provide those values privately.

Do not commit `.env.local`. It can contain passwords and secret tokens.

## How To Create It

From the repository root:

```powershell
Copy-Item frontend\.env.example frontend\.env.local
```

Then open `frontend/.env.local` and replace every placeholder you plan to use.

## Required Variables

`DATABASE_URL`

The PostgreSQL connection string used by the app. Get it from your database provider, such as Vercel Postgres, Neon, Supabase, or Railway.

`DIRECT_URL`

The direct PostgreSQL connection string used by Prisma. For most providers, use the direct connection URL if they provide one. If your provider gives only one URL, use the same value as `DATABASE_URL`.

`NEXT_PUBLIC_SITE_URL`

Your site URL. Locally use:

```env
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

On Vercel use your real domain:

```env
NEXT_PUBLIC_SITE_URL="https://your-domain.com"
```

`JWT_SECRET`

A long random secret used to sign your private admin login session.

`CSRF_SECRET`

A second long random secret reserved for request protection.

## Optional Variables

`BLOB_READ_WRITE_TOKEN`

Required only when you want resume PDF uploads through the admin panel. Create a Vercel Blob store and copy the read/write token.

`RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_TO_EMAIL`

Reserved for email notification support. Contact messages are saved in the database even when these are empty.

## Easy Secret Generation

If you have Node installed, run:

```powershell
node -e "console.log(crypto.randomBytes(48).toString('hex'))"
```

Run it twice: once for `JWT_SECRET`, once for `CSRF_SECRET`.

## Example Local File

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
JWT_SECRET="paste-a-long-random-secret-here"
CSRF_SECRET="paste-another-long-random-secret-here"
BLOB_READ_WRITE_TOKEN=""
RESEND_API_KEY=""
RESEND_FROM_EMAIL="onboarding@resend.dev"
RESEND_TO_EMAIL=""
```

## Common Mistakes

- Do not use the example placeholders unchanged.
- Do not add spaces around `=`.
- Keep quotes around URLs and long secrets.
- Restart `npm run dev` after changing `.env.local`.
- Add the production values in Vercel too; local `.env.local` does not automatically upload to Vercel.
