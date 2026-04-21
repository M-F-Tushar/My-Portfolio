# Quick Start

Use this when you only want to run and edit the portfolio.

```powershell
npm install
Copy-Item frontend\.env.example frontend\.env.local
```

Edit `frontend/.env.local`, then run:

```powershell
npm run db:generate
npm run db:seed
npm run dev
```

Open:

- Public site: `http://localhost:3000`
- Admin panel: `http://localhost:3000/admin/login`

## Your Normal Editing Flow

1. Log in to `/admin`.
2. Open the page for the section you want to edit.
3. Change values in the form.
4. Save.
5. Visit the public page to review the result.

Use:

- `Skills` when you learn a new technology.
- `Projects` when you add a portfolio project or case-study link.
- `Resume` to upload a direct PDF.
- `Contact Inbox` to review visitor messages.
- `Achievements` and `Demos` when you are ready to show real entries.

No blog or articles are part of this portfolio.
