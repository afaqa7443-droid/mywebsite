# AGENTS.md

## Project overview

E-commerce site for a used-mobile startup. ~10 listings initially, never more than ~100–150.

## Stack & deployment

- **Framework**: Next.js (Vercel-native)
- **Hosting**: Vercel (free tier)
- **Database**: TBD — must be free-tier (e.g. SQLite via Turso, MongoDB Atlas free, Supabase free, or similar)
- **Payments**: None — contact-only via WhatsApp (must) and phone call (optional)

## Features

- Listing pages with videos, images, description, quantity
- Reviews with pictures and ratings
- Admin console (friend logs in to CRUD listings)
- Contact links (WhatsApp required, phone optional)

## Conventions

+----------------+--------------------------------------------------+
| Directory      | Purpose                                          |
+----------------+--------------------------------------------------+
| .vercel/       | Vercel output — gitignored, never commit         |
| .env*.local    | Local secrets — gitignored, never commit         |
+----------------+--------------------------------------------------+

## Commands (placeholder — populate as project develops)

- `npm run dev` — local dev server
- `npm run build` — production build
- `npm run lint` — lint check
- `npm run typecheck` — TypeScript check (if applicable)
