# DI & UX — CMS / Admin

A custom Next.js 14 (App Router) build that lets the client edit site content directly. Auth is Clerk, content + media live in Supabase, and the public site revalidates on save.

## What's in this branch

```
app/
  layout.tsx              # root layout, ClerkProvider, fonts, metadata from page_seo
  page.tsx                # home page (server component, reads from Supabase)
  article/, case-study/, team/, contact/   # placeholder routes (port pending)
  api/revalidate/route.ts # webhook for out-of-band content updates
  admin/
    layout.tsx            # Clerk-protected shell + sidebar
    nav.tsx               # client nav with active-route highlighting
    page.tsx              # dashboard (counts + tiles)
    sign-in/[[...sign-in]]/page.tsx
    actions.ts            # Server Actions (saveHomeAction, uploadAction)
    home/
      page.tsx            # server component, loads current home_content
      editor.tsx          # full form, react-hook-form + Zod
    case-studies/, articles/, team/, seo/  # placeholders for follow-up turns
components/
  site/                   # public-site components (Nav stub, LegacyScripts)
  admin/                  # ui.tsx (Field/Input/Button/Card/Toast), ImageUploader.tsx
lib/
  supabase/server.ts      # getPublicClient (RLS) + getServiceClient (bypasses RLS)
  supabase/types.ts       # HomeContent, CaseStudy, Article, TeamMember, PageSeo
  cms/home.ts             # getHomeContent / updateHomeContent + safe defaults
  cms/seo.ts              # per-page SEO read/write
  cms/storage.ts          # uploadMedia / deleteMedia
middleware.ts             # Clerk gate on /admin/*
supabase/
  migrations/0001_init.sql   # all tables + RLS policies + seed
  storage.md                  # bucket setup notes
styles/                   # legacy CSS, imported via app/globals.css
public/scripts/           # legacy interaction scripts, loaded after hydration
_legacy/                  # original static HTML kept for reference
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure env

```bash
cp .env.example .env.local
```

Fill in:
- Clerk publishable + secret keys
- Supabase URL + anon key + **service-role key**
- `REVALIDATE_SECRET` (any long random string)

### 3. Provision Supabase

In the Supabase SQL editor, run the contents of `supabase/migrations/0001_init.sql`. Then create a public bucket called `media` (see `supabase/storage.md`).

### 4. Configure Clerk

In the Clerk dashboard, set the sign-in URL to `/admin/sign-in`. Disable sign-ups for the single-client setup, or restrict allowed emails in **User & Authentication → Restrictions**.

### 5. Run

```bash
npm run dev
```

- Public site: <http://localhost:3000>
- Admin: <http://localhost:3000/admin>

## How saving works

1. The editor calls `saveHomeAction(values)` (Server Action).
2. The action authenticates via Clerk, validates with Zod, writes via the service-role client, then calls `revalidatePath('/', 'page')`.
3. The next public-site request renders the updated content.

For out-of-band edits (someone changes a row directly in Supabase), trigger a refresh via:

```
POST /api/revalidate?secret=$REVALIDATE_SECRET&path=/
```

Wire this up as a Supabase database webhook on the relevant tables.

## Patterns used in the Home editor (template for the rest)

- **Server Component** loads current data → passes to a **Client Component** form.
- **`react-hook-form` + `@hookform/resolvers/zod`** owns the form state and client validation.
- **Server Action** runs the same Zod schema as the source of truth — never trust the client.
- Field-level server errors round-trip back via `setError(path, …)`.
- **`useTransition`** gives loading state during the action.
- Sticky save bar shows "unsaved changes" / "all changes saved" and disables Save until dirty.
- **Drag-drop image upload** via `<ImageUploader prefix="hero" />` — uploads through the service role, returns the public URL, stored on the row.

## What's complete vs. pending

| Area | Status |
| --- | --- |
| Project scaffold (Next 14, TS, Tailwind, Clerk, Supabase) | ✅ |
| Supabase schema for all five content types | ✅ |
| Clerk-protected `/admin` | ✅ |
| Admin shell + dashboard | ✅ |
| Shared form primitives | ✅ |
| Image uploader (drag-drop, validation, storage) | ✅ |
| **Home page editor (end-to-end)** | ✅ |
| Home page public render reading from Supabase | ✅ |
| `/api/revalidate` webhook | ✅ |
| Case studies CRUD | ⏳ schema + placeholder ready |
| Articles CRUD + Tiptap rich text + draft state | ⏳ schema + placeholder ready |
| Team CRUD | ⏳ schema + placeholder ready |
| Per-page SEO editor | ⏳ schema + placeholder ready |
| Case-study / article / team / contact public pages | ⏳ placeholder pages render the nav and footer |

Follow-up turns will reuse the patterns established in the Home editor — there's no new architecture needed, just more editors.

## Legacy site

The original static HTML lives in `_legacy/`. The interaction scripts (`praxis.js`, `chrome.js`, `smooth.js`, `tweaks.js`) are copied to `public/scripts/` with URLs rewritten to Next.js routes. They are loaded via `<LegacyScripts>` so the kinetic rotator, scroll effects, and HUD chrome continue to work without rewriting them in React.
