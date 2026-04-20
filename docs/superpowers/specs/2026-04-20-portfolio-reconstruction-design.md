# Portfolio Reconstruction Design

Date: 2026-04-20

## Summary

Reconstruct the current portfolio inside the same repository as a professional, Vercel-first, admin-managed portfolio for an undergraduate Computer Science student building toward AI Engineering, ML Engineering, LLM systems, and MLOps.

The rebuilt project should keep routine updates out of code. The owner should be able to log into a private admin panel and edit profile content, hero copy, skills, projects, experience, education, certifications, achievements, resume PDF, social links, contact submissions, and future AI/ML demo entries.

The public site should use the approved **Technical Cinematic** direction: a premium dark AI-engineering identity with a full-bleed animated hero, refined hover effects, scroll motion, recruiter-readable sections, and strong project/social proof.

## Approved Decisions

- Keep the current repository.
- Replace the current frontend/admin implementation inside the repo rather than repairing it piece by piece.
- Deploy on Vercel.
- Use a private single-owner admin panel.
- Admin panel controls portfolio content and future AI/ML demo entries.
- No public signup, team management, or user roles.
- No blog/articles section.
- Projects appear as cards in the portfolio.
- Project cards can link to GitHub, live demo, and an external case study/blog page.
- Homepage shows featured projects only.
- A separate `/projects` page lists all visible projects.
- AI/ML demos are a separate future-ready area, hidden publicly until real demos exist.
- Achievements and hackathons are editable from admin, hidden publicly until real visible entries exist.
- Contact form submissions are saved for admin review.
- Resume is uploaded as a direct PDF and displayed on a dedicated `/resume` page with preview and download.
- Admin should be simple, practical, and section-based rather than cinematic.

## Goals

1. Create a professional first impression for internships, entry-level AI/ML roles, research credibility, and freelance/client trust.
2. Let the owner maintain the site through admin forms without routine code edits.
3. Remove launch-time complexity that currently creates fragility: separate FastAPI demo backend, inconsistent Docker/Vercel setup, broken test paths, and placeholder data.
4. Keep the system future-ready for real AI/ML demos without forcing demo infrastructure before the owner has demos.
5. Make deployment and local setup understandable for a non-web-developer.

## Non-Goals

- Do not build public user accounts.
- Do not build a multi-author CMS.
- Do not build a blog/articles system.
- Do not build working embedded AI demos in the first reconstruction unless later requested as a separate feature.
- Do not keep the current FastAPI/RAG/agent backend as part of the launch version.
- Do not depend on runtime writes to `public/uploads` on Vercel.

## Recommended Architecture

Use one Next.js application as the source of truth for both the public portfolio and private admin panel.

### Application Shape

- `frontend/`: rebuilt Next.js app.
- Public routes render portfolio content from the database.
- Admin routes provide authenticated editing screens.
- API routes handle CRUD, contact submissions, authentication, and file upload orchestration.
- Prisma manages the database schema.
- Vercel hosts the app.
- Production database should be PostgreSQL.
- Local development can use SQLite initially for simplicity, with a clear path to PostgreSQL before launch.

### Why This Architecture

This avoids the most fragile part of the current project: multiple backend systems with different deployment assumptions. A single Next.js app is easier to understand, deploy, and debug on Vercel. Prisma keeps the data model explicit. The admin panel gives the owner no-code control over portfolio content.

## Public Website Design

### Visual Thesis

A dark cinematic AI-engineering portfolio with precise typography, full-bleed animated technical visuals, restrained cyan/electric accents, and polished motion that feels professional rather than decorative.

### Interaction Thesis

- Hero entrance sequence: name, title, CTA, and visual field animate in with staggered timing.
- Scroll-linked depth: hero visual fades/transforms into content sections as the user scrolls.
- Hover affordances: project cards, skill groups, navigation, and buttons respond with subtle glow, lift, border, or reveal states.

### Homepage Order

1. Hero
2. About
3. Skills
4. Featured Projects
5. Experience
6. Education and Certifications
7. Achievements and Hackathons, only when visible entries exist
8. Contact

### Public Routes

- `/`: homepage.
- `/projects`: all visible project cards with filtering by category, status, and technology.
- `/resume`: PDF preview and download page.
- `/demos`: future-ready demos page, hidden from navigation until enabled.
- `/admin/login`: admin login.
- `/admin/*`: private admin screens.

### Navigation

Default public navigation:

- Home
- Projects
- Resume
- Contact

Optional navigation appears only when relevant:

- Demos, when public demos are enabled.
- Achievements, if a dedicated page is later added.

## Public Content Behavior

### Hero

Admin-editable fields:

- Display name
- Role/title
- Short headline
- Supporting summary
- Primary CTA label/link
- Secondary CTA label/link
- Featured skill chips
- Profile photo/avatar

Default draft direction:

> Undergraduate CS student building practical AI systems across LLMs, machine learning, and MLOps.

The exact text remains editable from admin.

### About

Admin-editable fields:

- Short bio
- Longer about text
- Current focus areas
- Location
- Email
- Highlights such as years learning, projects completed, core domains

### Skills

Skills are grouped by admin-managed categories.

Recommended default categories:

- AI and LLMs
- Machine Learning
- Data and MLOps
- Programming and Tools
- Cloud and Deployment

Each skill supports:

- Name
- Category
- Proficiency or confidence level
- Sort order
- Visibility

### Projects

Homepage shows only featured visible projects.

`/projects` shows all visible projects.

Each project card supports:

- Title
- Short description
- Category
- Tech stack
- Screenshot/image
- GitHub URL
- Live demo URL
- External case study/blog URL
- Status: completed, in progress, coming soon
- Featured flag
- Visibility flag
- Sort order

No internal case study pages are required in the rebuilt portfolio. Deeper case studies live on an external website and are linked from cards.

### AI/ML Demos

Demos are managed separately from projects.

Each demo supports:

- Title
- Short description
- Domain: LLM, RAG, Computer Vision, MLOps, Agent, Data
- Status: hidden, coming soon, case study only, external demo, embedded demo
- External URL
- Optional embed configuration for later
- Visibility
- Sort order

Public demos stay hidden until the owner adds real visible entries.

### Experience

Admin-editable entries for:

- Internships
- Work experience
- Research assistant roles
- Volunteering
- Leadership
- Relevant academic/project roles

Each entry supports:

- Organization
- Role
- Start/end period
- Location or remote flag
- Summary
- Bullet achievements
- Tech stack
- Visibility
- Sort order

### Education and Certifications

Education supports:

- Degree
- Institution
- Period
- Location
- Relevant coursework
- GPA field, optional and hidden if empty
- Description

Certifications support:

- Name
- Issuer
- Date
- Credential URL
- Visibility
- Sort order

### Achievements and Hackathons

Public section appears only when at least one visible entry exists.

Entries support:

- Title
- Type: award, hackathon, competition, scholarship, recognition
- Organization
- Year/date
- Description
- URL
- Visibility
- Sort order

### Resume

`/resume` supports:

- PDF preview
- Download button
- Last updated date
- Short highlights summary from admin
- Fallback download link if browser PDF preview fails

Admin supports direct PDF upload through durable storage.

### Contact

Public contact form fields:

- Name
- Email
- Message

Behavior:

- Saves every valid submission in the database.
- Marks new submissions as unread.
- Sends optional email notification if email provider is configured.
- Shows a clear success or error state.

## Admin Panel Design

### Admin Philosophy

The admin panel should be simple, practical, and form-first. It should not copy the cinematic public design. It should feel like a clean control room with a sidebar, tables, forms, status badges, and clear save/delete actions.

### Admin Routes

- `/admin`: dashboard overview.
- `/admin/profile`: profile and about content.
- `/admin/hero`: hero text, CTAs, featured chips.
- `/admin/skills`: skill categories and skills.
- `/admin/projects`: project cards and links.
- `/admin/demos`: future AI/ML demo entries.
- `/admin/experience`: experience entries.
- `/admin/education`: education entries.
- `/admin/certifications`: certification entries.
- `/admin/achievements`: awards, hackathons, competitions.
- `/admin/resume`: resume PDF upload and resume page highlights.
- `/admin/social`: social/profile links.
- `/admin/contact-submissions`: saved contact messages.
- `/admin/settings`: SEO defaults, navigation visibility, site settings.

### Admin Dashboard

Dashboard should show:

- Profile completion checklist
- Visible project count
- Featured project count
- Unread contact messages
- Resume upload status
- Hidden sections waiting for content

### Admin Editing Pattern

Each content area should use:

- List/table view
- Add button
- Edit form
- Visibility toggle
- Featured toggle where relevant
- Sort order field or move up/down controls
- Save and cancel actions
- Delete with confirmation

## Data Model

Recommended Prisma models:

- `AdminUser`
- `SiteSettings`
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
- `MediaAsset`

### Auth Model

`AdminUser` should support:

- Email
- Password hash
- Created/updated timestamps
- Last login timestamp

Only one admin user is required. The system should prevent public registration.

### Media Model

`MediaAsset` should support:

- URL
- Storage key
- File name
- MIME type
- File size
- Alt text
- Created timestamp

Use it for profile image, project screenshots, and resume PDF.

## Storage

Use durable storage for uploads. For a Vercel-first project, the recommended first choice is Vercel Blob.

Files that should use durable storage:

- Resume PDF
- Profile image
- Project screenshots
- Optional achievement/certification images later

Do not rely on saving files to `frontend/public/uploads` at runtime.

## Security

Required security behavior:

- Private admin login.
- HTTP-only session cookie.
- Strong production secret validation.
- No fallback production JWT/CSRF secrets.
- CSRF protection or same-site server action protection for admin mutations.
- Rate limiting for login and contact form.
- File upload validation for type and size.
- PDF uploads limited to `application/pdf`.
- Image uploads limited to safe image MIME types.
- SVG uploads disabled unless a later sanitization feature is explicitly added.
- Contact submissions sanitized and validated.

## Deployment

Target: Vercel.

Required production environment variables:

- `DATABASE_URL`
- `DIRECT_URL`, if Prisma provider requires it
- `JWT_SECRET` or equivalent session secret
- `CSRF_SECRET`, if CSRF tokens are used
- `NEXT_PUBLIC_SITE_URL`
- Blob/storage token variables
- Email provider variables, optional until email notifications are enabled

Deployment should include:

- Clear setup guide for Vercel.
- Database migration workflow.
- Admin bootstrap instructions.
- Separate local development instructions.

## Migration and Replacement Strategy

The current repository should not be deleted. Instead:

1. Preserve the repository and git history.
2. Rebuild `frontend/` as the clean source of truth.
3. Remove or quarantine current broken/demo-only implementation pieces after the new app is working.
4. Replace current placeholder seed data with professional starter content.
5. Keep old AI backend code out of the launch path unless it is later rebuilt as a dedicated demo feature.

This approach avoids losing useful history while still allowing a clean professional rebuild.

## Alternatives Considered

### Repair Current Project

Pros:

- Reuses existing admin pages and data models.
- Less initial replacement work.

Cons:

- Current env setup, tests, project routing, admin CSRF wiring, demo backend, and deployment story are inconsistent.
- Risk of spending time fixing template complexity instead of building the desired portfolio.

Decision: not recommended.

### Use a Ready-Made CMS

Pros:

- Built-in admin patterns.
- Faster to create content collections.

Cons:

- Introduces a new CMS framework for the owner to understand.
- Can make deployment and customization harder for a non-web-developer.
- May be more powerful than this single-owner portfolio needs.

Decision: keep as fallback, not the first choice.

### Static Portfolio With Data Files

Pros:

- Simplest deployment.
- Very reliable.

Cons:

- Requires code/file editing for content changes.
- Does not match the owner's definition of easy maintenance.

Decision: rejected.

## Testing and Verification Expectations

The implementation should include:

- Unit tests for content visibility logic.
- API/action tests for protected admin mutations.
- Contact form validation tests.
- Project visibility/featured filtering tests.
- Resume upload validation tests.
- Browser smoke checks for homepage, projects page, resume page, admin login, and contact form.
- Build, lint, and type-check commands that pass locally and in CI.

## Launch Criteria

The rebuild is launch-ready when:

- Fresh local setup is documented and repeatable.
- Public homepage renders without database or console errors.
- Admin login works.
- Profile, skills, projects, resume, and contact submissions can be managed from admin.
- Homepage shows only visible sections with real entries.
- Empty demo and achievement sections do not appear publicly.
- Resume page previews and downloads the uploaded PDF.
- Vercel deployment succeeds.
- No placeholder content appears in public pages.
- `lint`, `type-check`, `build`, and core tests pass.

## Open Future Enhancements

These are intentionally deferred:

- Embedded AI demos.
- Public demo playgrounds.
- Internal project case study pages.
- Advanced analytics dashboard.
- Multi-user admin roles.
- Blog/articles.
- Newsletter.

