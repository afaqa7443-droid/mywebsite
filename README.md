# PhoneMarket — Used Mobiles E-commerce

A lightweight e-commerce site for a used-mobile startup. Built for small inventories (~10–150 items). No payments — contact buyers via WhatsApp.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Hosting** | Vercel (free tier) |
| **Database** | Supabase Postgres (free tier) |
| **Storage** | Supabase Storage (images, videos) |
| **Styling** | Tailwind CSS with CSS custom properties |
| **Auth** | Env-var admin password + session cookie |

## Features

### Public
- **Listing grid** — responsive (1–4 columns) with image, price, stock badge
- **Listing detail** — media gallery (images + video), condition/stock badges, reviews
- **Contact** — WhatsApp button (required) and phone call button (optional)
- **Reviews** — ratings, text, images/video, anonymous support (`*` name)
- **Dark mode** — system-default with manual toggle

### Admin
- **Dashboard** — sortable table of all listings with edit/delete
- **Create/Edit listing** — form with auto-slug, media upload, price in paise
- **Review management** — add/edit/delete reviews per listing
- **Site settings** — set global WhatsApp number for all contact buttons

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase free account

### Setup

```bash
# Clone the repo
git clone https://github.com/afaqa7443-droid/mywebsite.git
cd mywebsite

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local
```

### Supabase Setup

1. Create a free project at [supabase.com](https://supabase.com)
2. Copy your **Project URL** and **anon public key** from Project Settings → API
3. Fill them into `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ADMIN_PASSWORD=choose-a-secure-password
   ```
4. Open **SQL Editor** in Supabase dashboard and run:
   - [`supabase/migrations/001_schema.sql`](supabase/migrations/001_schema.sql) — creates listings, reviews, media tables
   - [`supabase/migrations/002_settings.sql`](supabase/migrations/002_settings.sql) — creates site_settings table
5. Create two **public storage buckets** in Supabase Storage:
   - `listing-media`
   - `review-media`

### Run Locally

```bash
npm run dev
# Open http://localhost:3000
```

### Login

Visit `/login` and enter your `ADMIN_PASSWORD` to access the admin dashboard.

## Deploy to Vercel

1. Push to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add these environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_PASSWORD`
4. Deploy 🚀

## Project Structure

```
├── app/
│   ├── page.tsx                    # Homepage
│   ├── listings/[slug]/page.tsx    # Listing detail
│   ├── login/page.tsx              # Admin login
│   ├── admin/                      # Admin dashboard, CRUD, reviews, settings
│   └── api/                        # REST API routes
├── components/
│   ├── public/                     # Navbar, Footer, ListingCard, MediaGallery, etc.
│   └── admin/                      # DataTable, ListingForm, ReviewForm, etc.
├── lib/                            # Supabase client, auth, utilities
├── types/                          # TypeScript type definitions
└── supabase/migrations/            # Database schema
```

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | Lint check |
| `npm run typecheck` | TypeScript check |
