# Used Mobiles E-commerce — Design Spec

## Stack

- **Framework**: Next.js (App Router) on Vercel (free tier)
- **Database**: Supabase (Postgres free tier — 500MB DB + 1GB storage)
- **Auth**: Hardcoded env var (`ADMIN_PASSWORD`) — no external auth provider
- **Payments**: None — contact-only (WhatsApp required, phone optional)
- **Styling**: Tailwind CSS with CSS custom properties for easy re-branding

## Site Structure

```
/
├── /                    — Homepage (listing grid)
├── /listings/[slug]     — Individual listing detail page
└── /admin/
    ├── /login           — Password gate
    ├── /                — Dashboard (listings table)
    ├── /new             — Create listing
    ├── /[id]/edit       — Edit listing
    └── /reviews         — Manage reviews per listing
```

## Database Schema (Supabase Postgres)

```sql
CREATE TABLE listings (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT UNIQUE NOT NULL,
  title         TEXT NOT NULL,
  brand         TEXT NOT NULL,
  model         TEXT NOT NULL,
  price         INTEGER NOT NULL,
  condition     TEXT NOT NULL CHECK (condition IN ('Excellent','Good','Fair')),
  quantity      INTEGER NOT NULL DEFAULT 1,
  description   TEXT NOT NULL,
  whatsapp_link TEXT NOT NULL,
  phone_link    TEXT,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE listing_media (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id  UUID REFERENCES listings(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('image','video')),
  sort_order  INTEGER DEFAULT 0
);

CREATE TABLE reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id  UUID REFERENCES listings(id) ON DELETE CASCADE,
  reviewer    TEXT NOT NULL,
  rating      INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text        TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE review_media (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id   UUID REFERENCES reviews(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('image','video')),
  sort_order  INTEGER DEFAULT 0
);
```

Supabase Storage buckets: `listing-media`, `review-media`.

## Rendering Strategy

- **Public pages**: Server Components with `revalidate` (ISR) — pages rebuild when listings change
- **Admin pages**: Client components with server action / API route mutations
- **After admin mutation**: `revalidatePath()` to refresh ISR cache

## Auth Flow

1. Admin visits `/admin/*` → middleware checks cookie → redirects to `/admin/login` if missing
2. Login form POSTs to `/api/auth` with password → if matches `ADMIN_PASSWORD` env var, sets `httpOnly` session cookie
3. Middleware checks cookie on every admin route access

## Features

### Public

- **Homepage**: Responsive grid of listing cards (image, title, price, stock badge)
- **Listing detail**: Media gallery (images + video), full description, condition/stock badges, WhatsApp + Call buttons, reviews section
- **Reviews**: Displayed below listing details — rating stars, reviewer name, text, optional media. "Anonymous" reviews show `*` as name.

### Admin

- **Dashboard**: Table of all listings with sort, edit, delete actions
- **Create/Edit listing**: Form with all fields, drag-and-drop media uploader, auto-slug from title
- **Review management**: Per-listing review list, add/edit/delete reviews with optional media
- **Media upload**: Drag-and-drop to Supabase Storage, attach to listings or reviews

## Component Tree

```
Public:
  Navbar (logo, WhatsApp/Call links)
  ListingGrid
    └── ListingCard (image, price, title, stock badge)
  MediaGallery (main image + thumbnail strip)
  ReviewCard (rating, reviewer, text, media)
  ContactButtons (WhatsApp, optional Call)
  Footer

Admin:
  AdminLayout (sidebar nav, auth guard)
    ├── LoginForm (single password field)
    ├── DataTable (sortable listings table)
    ├── ListingForm (all fields + MediaUploader)
    │   └── MediaUploader (drag-drop → Supabase)
    └── ReviewForm (add/edit review + media)
```

## Routes (API)

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/auth` | Verify admin password, set cookie |
| GET | `/api/listings` | List all listings |
| POST | `/api/listings` | Create listing (admin only) |
| GET | `/api/listings/[id]` | Get single listing |
| PUT | `/api/listings/[id]` | Update listing (admin only) |
| DELETE | `/api/listings/[id]` | Delete listing (admin only) |
| POST | `/api/reviews` | Create review (admin only) |
| PUT | `/api/reviews/[id]` | Update review (admin only) |
| DELETE | `/api/reviews/[id]` | Delete review (admin only) |
| POST | `/api/upload` | Upload media to Supabase Storage |

## Branding

- Generic Tailwind theme applied via CSS variables in `tailwind.config.ts`
- Colors, fonts, spacing all controlled by theme tokens — swap branding later by editing a single config
