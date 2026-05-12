# Used Mobiles E-commerce — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a deployable used-mobiles e-commerce site with public listing pages, admin CRUD, Supabase backend, and WhatsApp contact flow.

**Architecture:** Next.js App Router with ISR for public pages, client components for admin, Supabase Postgres + Storage. Admin auth via env-var password checked in middleware.

**Tech Stack:** Next.js 14+, Supabase (free tier), Tailwind CSS, Vercel deployment

---

### Task 1: Scaffold Next.js + Tailwind + Supabase

**Files:**
- Create: `package.json`
- Create: `next.config.js`
- Create: `tsconfig.json`
- Create: `tailwind.config.ts`
- Create: `app/globals.css`
- Create: `app/layout.tsx`
- Create: `lib/supabase.ts`
- Create: `types/index.ts`
- Create: `.env.local.example`
- Create: `postcss.config.js`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "used-mobiles",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "@supabase/supabase-js": "^2.45.0"
  },
  "devDependencies": {
    "@types/node": "^20.14.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "typescript": "^5.5.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

- [ ] **Step 2: Create next.config.js**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
};

module.exports = nextConfig;
```

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "es2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Create tailwind.config.ts**

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: 'var(--brand-50)',
          100: 'var(--brand-100)',
          200: 'var(--brand-200)',
          500: 'var(--brand-500)',
          600: 'var(--brand-600)',
          700: 'var(--brand-700)',
        },
        accent: {
          50: 'var(--accent-50)',
          500: 'var(--accent-500)',
          600: 'var(--accent-600)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 5: Create app/globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --brand-50: #f0fdf4;
  --brand-100: #dcfce7;
  --brand-200: #bbf7d0;
  --brand-500: #22c55e;
  --brand-600: #16a34a;
  --brand-700: #15803d;
  --accent-50: #eff6ff;
  --accent-500: #3b82f6;
  --accent-600: #2563eb;
  --font-sans: system-ui, -apple-system, sans-serif;
}
```

- [ ] **Step 6: Create app/layout.tsx**

```tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PhoneMarket — Used Phones',
  description: 'Browse trusted used phones at great prices.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 7: Create lib/supabase.ts**

```ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

- [ ] **Step 8: Create types/index.ts**

```ts
export interface Listing {
  id: string;
  slug: string;
  title: string;
  brand: string;
  model: string;
  price: number;
  condition: 'Excellent' | 'Good' | 'Fair';
  quantity: number;
  description: string;
  whatsapp_link: string;
  phone_link: string | null;
  created_at: string;
  updated_at: string;
}

export interface ListingMedia {
  id: string;
  listing_id: string;
  url: string;
  type: 'image' | 'video';
  sort_order: number;
}

export interface Review {
  id: string;
  listing_id: string;
  reviewer: string;
  rating: number;
  text: string | null;
  created_at: string;
}

export interface ReviewMedia {
  id: string;
  review_id: string;
  url: string;
  type: 'image' | 'video';
  sort_order: number;
}

export interface ListingWithMedia extends Listing {
  media: ListingMedia[];
  reviews: (Review & { media: ReviewMedia[] })[];
}
```

- [ ] **Step 9: Create .env.local.example**

```
# Supabase (get these from your Supabase project dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx

# Admin access
ADMIN_PASSWORD=change-me-to-something-secure
```

- [ ] **Step 10: Create postcss.config.js**

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 11: Create AGENTS.md update or just run install**

Run: `npm install`
Expected: All dependencies installed without errors.

- [ ] **Step 12: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 13: Commit**

```bash
git add -A && git commit -m "chore: scaffold Next.js + Tailwind + Supabase setup"
```

---

### Task 2: Shared UI Components (Public)

**Files:**
- Create: `components/public/Navbar.tsx`
- Create: `components/public/Footer.tsx`
- Create: `components/public/ListingCard.tsx`
- Create: `components/public/ListingGrid.tsx`
- Create: `components/public/MediaGallery.tsx`
- Create: `components/public/ReviewCard.tsx`
- Create: `components/public/ContactButtons.tsx`
- Create: `lib/utils.ts`

- [ ] **Step 1: Create lib/utils.ts**

```ts
export function formatPrice(paise: number): string {
  const rupees = paise / 100;
  return `₹${rupees.toLocaleString('en-IN')}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function waLink(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return `https://wa.me/${digits}`;
}

export function ratingStars(rating: number): string {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

export function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
```

- [ ] **Step 2: Create components/public/Navbar.tsx**

```tsx
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-brand-600">
          PhoneMarket
        </Link>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <a
            href="https://wa.me/1234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand-600 hover:text-brand-700"
          >
            WhatsApp
          </a>
          <Link
            href="/admin/login"
            className="rounded-md bg-gray-100 px-3 py-1.5 text-gray-700 hover:bg-gray-200"
          >
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 3: Create components/public/Footer.tsx**

```tsx
export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} PhoneMarket. All rights reserved.
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Create components/public/ListingCard.tsx**

```tsx
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import type { Listing, ListingMedia } from '@/types';

interface Props {
  listing: Listing;
  media: ListingMedia[];
}

export default function ListingCard({ listing, media }: Props) {
  const thumbnail = media.find((m) => m.type === 'image');

  return (
    <Link
      href={`/listings/${listing.slug}`}
      className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
        {thumbnail ? (
          <img
            src={thumbnail.url}
            alt={listing.title}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            No image
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-xs uppercase tracking-wide text-gray-500">
          {listing.brand}
        </p>
        <p className="mt-0.5 font-semibold text-gray-900">{listing.title}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(listing.price)}
          </span>
          {listing.quantity > 0 && (
            <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
              {listing.quantity} in stock
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 5: Create components/public/ListingGrid.tsx**

```tsx
import type { Listing, ListingMedia } from '@/types';
import ListingCard from './ListingCard';

interface Props {
  listings: (Listing & { media: ListingMedia[] })[];
}

export default function ListingGrid({ listings }: Props) {
  if (listings.length === 0) {
    return (
      <div className="py-20 text-center text-gray-500">
        No listings available yet. Check back soon!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} media={listing.media} />
      ))}
    </div>
  );
}
```

- [ ] **Step 6: Create components/public/MediaGallery.tsx**

```tsx
'use client';

import { useState } from 'react';
import type { ListingMedia } from '@/types';

interface Props {
  media: ListingMedia[];
}

export default function MediaGallery({ media }: Props) {
  const images = media.filter((m) => m.type === 'image');
  const videos = media.filter((m) => m.type === 'video');
  const all = [...images, ...videos];
  const [activeIndex, setActiveIndex] = useState(0);

  if (all.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-xl bg-gray-100 text-gray-400">
        No media
      </div>
    );
  }

  const active = all[activeIndex];

  return (
    <div>
      <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-gray-100">
        {active.type === 'image' ? (
          <img
            src={active.url}
            alt=""
            className="h-full w-full object-contain"
          />
        ) : (
          <video
            src={active.url}
            controls
            className="h-full w-full object-contain"
          />
        )}
      </div>
      {all.length > 1 && (
        <div className="mt-2 flex gap-2 overflow-x-auto">
          {all.map((item, i) => (
            <button
              key={item.id}
              onClick={() => setActiveIndex(i)}
              className={`h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
                i === activeIndex ? 'border-brand-500' : 'border-transparent'
              }`}
            >
              {item.type === 'image' ? (
                <img src={item.url} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center bg-gray-800 text-white text-xs">
                  ▶ Video
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 7: Create components/public/ReviewCard.tsx**

```tsx
import { ratingStars, timeAgo } from '@/lib/utils';
import type { Review, ReviewMedia } from '@/types';

interface Props {
  review: Review & { media: ReviewMedia[] };
}

export default function ReviewCard({ review }: Props) {
  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">
            {review.reviewer === '*' ? 'Anonymous' : review.reviewer}
          </span>
          <span className="text-amber-500">{ratingStars(review.rating)}</span>
        </div>
        <span className="text-xs text-gray-400">{timeAgo(review.created_at)}</span>
      </div>
      {review.text && (
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          {review.text}
        </p>
      )}
      {review.media.length > 0 && (
        <div className="mt-2 flex gap-2">
          {review.media.map((m) => (
            <div
              key={m.id}
              className="h-12 w-16 overflow-hidden rounded-md bg-gray-200"
            >
              {m.type === 'image' ? (
                <img src={m.url} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center bg-gray-800 text-white text-xs">
                  ▶
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 8: Create components/public/ContactButtons.tsx**

```tsx
interface Props {
  whatsappLink: string;
  phoneLink?: string | null;
}

export default function ContactButtons({ whatsappLink, phoneLink }: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-5 py-2.5 font-semibold text-white transition hover:bg-green-600"
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        WhatsApp
      </a>
      {phoneLink && (
        <a
          href={phoneLink}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-5 py-2.5 font-semibold text-gray-700 transition hover:bg-gray-200"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
          </svg>
          Call
        </a>
      )}
    </div>
  );
}
```

- [ ] **Step 9: Verify build**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 10: Commit**

```bash
git add -A && git commit -m "feat: add shared UI components and utilities"
```

---

### Task 3: Database Setup (Supabase)

**Files:**
- Create: `supabase/migrations/001_schema.sql`

- [ ] **Step 1: Create migration SQL**

```sql
-- supabase/migrations/001_schema.sql

-- Listings
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

-- Listing media
CREATE TABLE listing_media (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id  UUID REFERENCES listings(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('image','video')),
  sort_order  INTEGER DEFAULT 0
);

-- Reviews
CREATE TABLE reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id  UUID REFERENCES listings(id) ON DELETE CASCADE,
  reviewer    TEXT NOT NULL,
  rating      INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text        TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Review media
CREATE TABLE review_media (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id   UUID REFERENCES reviews(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('image','video')),
  sort_order  INTEGER DEFAULT 0
);

-- Index for slug lookups
CREATE INDEX idx_listings_slug ON listings(slug);

-- Index for listing media ordering
CREATE INDEX idx_listing_media_listing ON listing_media(listing_id, sort_order);

-- Index for reviews per listing
CREATE INDEX idx_reviews_listing ON reviews(listing_id, created_at DESC);

-- Index for review media ordering
CREATE INDEX idx_review_media_review ON review_media(review_id, sort_order);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER listings_updated_at
  BEFORE UPDATE ON listings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

- [ ] **Step 2: Create Supabase project and run migration**

Instructions for the user or next developer:

1. Go to https://supabase.com and create a free project
2. Copy your project URL and anon key from Settings → API
3. Fill them into `.env.local` following `.env.local.example`
4. Go to SQL Editor in Supabase dashboard, paste and run the migration
5. Create two storage buckets: `listing-media` and `review-media` (public)

- [ ] **Step 3: Commit**

```bash
git add supabase/ && git commit -m "feat: add database schema migration"
```

---

### Task 4: Public Pages (Homepage + Listing Detail)

**Files:**
- Create: `app/page.tsx`
- Create: `app/listings/[slug]/page.tsx`

- [ ] **Step 1: Create app/page.tsx (Homepage)**

```tsx
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import ListingGrid from '@/components/public/ListingGrid';

// Revalidate every 60 seconds, or on-demand via revalidatePath()
export const revalidate = 60;

async function getListings() {
  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .order('created_at', { ascending: false });

  if (!listings) return [];

  const { data: media } = await supabase
    .from('listing_media')
    .select('*')
    .in('listing_id', listings.map((l) => l.id));

  return listings.map((listing) => ({
    ...listing,
    media: (media ?? []).filter((m) => m.listing_id === listing.id),
  }));
}

export default async function HomePage() {
  const listings = await getListings();

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Used Phones</h1>
        <p className="mb-8 text-gray-500">
          Trusted, inspected, and priced right.
        </p>
        <ListingGrid listings={listings} />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Create app/listings/[slug]/page.tsx**

```tsx
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { formatPrice, waLink } from '@/lib/utils';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import MediaGallery from '@/components/public/MediaGallery';
import ReviewCard from '@/components/public/ReviewCard';
import ContactButtons from '@/components/public/ContactButtons';

export const revalidate = 60;

async function getListing(slug: string) {
  const { data: listing } = await supabase
    .from('listings')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!listing) return null;

  const { data: media } = await supabase
    .from('listing_media')
    .select('*')
    .eq('listing_id', listing.id)
    .order('sort_order');

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('listing_id', listing.id)
    .order('created_at', { ascending: false });

  let reviewsWithMedia: any[] = [];
  if (reviews && reviews.length > 0) {
    const { data: reviewMedia } = await supabase
      .from('review_media')
      .select('*')
      .in('review_id', reviews.map((r) => r.id))
      .order('sort_order');

    reviewsWithMedia = reviews.map((review) => ({
      ...review,
      media: (reviewMedia ?? []).filter((m) => m.review_id === review.id),
    }));
  }

  return {
    ...listing,
    media: media ?? [],
    reviews: reviewsWithMedia,
  };
}

export default async function ListingPage({
  params,
}: {
  params: { slug: string };
}) {
  const listing = await getListing(params.slug);

  if (!listing) {
    notFound();
  }

  const conditionColor = {
    Excellent: 'text-green-700 bg-green-50',
    Good: 'text-amber-700 bg-amber-50',
    Fair: 'text-red-700 bg-red-50',
  }[listing.condition];

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <a
          href="/"
          className="mb-4 inline-block text-sm text-gray-500 hover:text-gray-700"
        >
          &larr; Back to all listings
        </a>

        <div className="grid gap-8 lg:grid-cols-2">
          <MediaGallery media={listing.media} />

          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">
              {listing.brand} &middot; {listing.model}
            </p>
            <h1 className="mt-1 text-2xl font-bold text-gray-900">
              {listing.title}
            </h1>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {formatPrice(listing.price)}
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                {listing.quantity} in stock
              </span>
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${conditionColor}`}
              >
                {listing.condition}
              </span>
            </div>

            <p className="mt-4 whitespace-pre-line leading-relaxed text-gray-600">
              {listing.description}
            </p>

            <div className="mt-6 border-t border-gray-200 pt-6">
              <h3 className="mb-3 text-sm font-semibold text-gray-900">
                Contact to Buy
              </h3>
              <ContactButtons
                whatsappLink={waLink(listing.whatsapp_link)}
                phoneLink={
                  listing.phone_link
                    ? `tel:${listing.phone_link}`
                    : null
                }
              />
            </div>
          </div>
        </div>

        {listing.reviews.length > 0 && (
          <section className="mt-12 border-t border-gray-200 pt-8">
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              Reviews ({listing.reviews.length})
            </h2>
            <div className="space-y-3">
              {listing.reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Verify build**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: add homepage and listing detail page"
```

---

### Task 5: Admin Auth (Middleware + Login)

**Files:**
- Create: `middleware.ts`
- Create: `app/api/auth/route.ts`
- Create: `app/admin/login/page.tsx`
- Create: `app/admin/layout.tsx`
- Create: `lib/auth.ts`

- [ ] **Step 1: Create lib/auth.ts**

```ts
import { cookies } from 'next/headers';

const ADMIN_COOKIE = 'admin_session';

export function createSession(): string {
  const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
  return token;
}

export function getSessionCookie(): string | undefined {
  return cookies().get(ADMIN_COOKIE)?.value;
}

export function setSessionCookie(value: string) {
  cookies().set(ADMIN_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
}

export function clearSessionCookie() {
  cookies().set(ADMIN_COOKIE, '', { maxAge: 0, path: '/' });
}
```

- [ ] **Step 2: Create app/api/auth/route.ts**

```ts
import { NextResponse } from 'next/server';
import { createSession, setSessionCookie } from '@/lib/auth';

export async function POST(request: Request) {
  const { password } = await request.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: 'Invalid password' },
      { status: 401 }
    );
  }

  const sessionToken = createSession();
  setSessionCookie(sessionToken);

  return NextResponse.json({ success: true });
}
```

- [ ] **Step 3: Create middleware.ts**

```ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_PATHS = ['/admin'];
const LOGIN_PATH = '/admin/login';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes (except login and static files)
  if (
    !pathname.startsWith('/admin') ||
    pathname === LOGIN_PATH ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const session = request.cookies.get('admin_session')?.value;

  if (!session) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
```

- [ ] **Step 4: Create app/admin/login/page.tsx**

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setError('Invalid password');
        return;
      }

      router.push('/admin');
    } catch {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl bg-white p-8 shadow-sm"
      >
        <h1 className="mb-6 text-center text-xl font-bold text-gray-900">
          Admin Login
        </h1>
        <input
          type="password"
          placeholder="Enter admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          autoFocus
        />
        {error && (
          <p className="mb-3 text-sm text-red-600">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading || !password}
          className="w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 5: Create app/admin/layout.tsx**

```tsx
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <aside className="flex w-56 flex-col border-r border-gray-200 bg-gray-50 p-4">
        <Link
          href="/admin"
          className="mb-6 text-lg font-bold text-brand-600"
        >
          Admin
        </Link>
        <nav className="flex flex-col gap-2 text-sm">
          <Link
            href="/admin"
            className="rounded-md px-3 py-2 text-gray-700 hover:bg-gray-200"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/new"
            className="rounded-md px-3 py-2 text-gray-700 hover:bg-gray-200"
          >
            New Listing
          </Link>
          <Link
            href="/admin/reviews"
            className="rounded-md px-3 py-2 text-gray-700 hover:bg-gray-200"
          >
            Reviews
          </Link>
          <a
            href="/"
            className="mt-6 rounded-md px-3 py-2 text-gray-400 hover:bg-gray-200"
          >
            &larr; View Site
          </a>
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
```

- [ ] **Step 6: Verify build**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: add admin auth (middleware + login)"
```

---

### Task 6: Admin API Routes

**Files:**
- Create: `app/api/listings/route.ts`
- Create: `app/api/listings/[id]/route.ts`
- Create: `app/api/reviews/route.ts`
- Create: `app/api/reviews/[id]/route.ts`
- Create: `app/api/upload/route.ts`

- [ ] **Step 1: Create app/api/listings/route.ts**

```ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function GET() {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();

  const { data, error } = await supabase
    .from('listings')
    .insert({
      slug: body.slug,
      title: body.title,
      brand: body.brand,
      model: body.model,
      price: body.price,
      condition: body.condition,
      quantity: body.quantity,
      description: body.description,
      whatsapp_link: body.whatsapp_link,
      phone_link: body.phone_link || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath('/');
  revalidatePath(`/listings/${data.slug}`);

  return NextResponse.json(data, { status: 201 });
}
```

- [ ] **Step 2: Create app/api/listings/[id]/route.ts**

```ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();

  const { data, error } = await supabase
    .from('listings')
    .update({
      slug: body.slug,
      title: body.title,
      brand: body.brand,
      model: body.model,
      price: body.price,
      condition: body.condition,
      quantity: body.quantity,
      description: body.description,
      whatsapp_link: body.whatsapp_link,
      phone_link: body.phone_link || null,
    })
    .eq('id', params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath('/');
  revalidatePath(`/listings/${data.slug}`);

  return NextResponse.json(data);
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath('/');

  return NextResponse.json({ success: true });
}
```

- [ ] **Step 3: Create app/api/reviews/route.ts**

```ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const listingId = searchParams.get('listing_id');

  if (!listingId) {
    return NextResponse.json({ error: 'listing_id required' }, { status: 400 });
  }

  const { data: reviews, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('listing_id', listingId)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Fetch review media
  let reviewsWithMedia: any[] = [];
  if (reviews && reviews.length > 0) {
    const { data: reviewMedia } = await supabase
      .from('review_media')
      .select('*')
      .in('review_id', reviews.map((r) => r.id))
      .order('sort_order');

    reviewsWithMedia = reviews.map((review) => ({
      ...review,
      media: (reviewMedia ?? []).filter((m) => m.review_id === review.id),
    }));
  }

  return NextResponse.json(reviewsWithMedia);
}

export async function POST(request: Request) {
  const body = await request.json();

  const { data, error } = await supabase
    .from('reviews')
    .insert({
      listing_id: body.listing_id,
      reviewer: body.reviewer,
      rating: body.rating,
      text: body.text || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Revalidate the listing page this review belongs to
  const { data: listing } = await supabase
    .from('listings')
    .select('slug')
    .eq('id', body.listing_id)
    .single();

  if (listing) {
    revalidatePath(`/listings/${listing.slug}`);
  }

  return NextResponse.json(data, { status: 201 });
}
```

- [ ] **Step 4: Create app/api/reviews/[id]/route.ts**

```ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();

  const { data: existing } = await supabase
    .from('reviews')
    .select('listing_id')
    .eq('id', params.id)
    .single();

  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { data, error } = await supabase
    .from('reviews')
    .update({
      reviewer: body.reviewer,
      rating: body.rating,
      text: body.text || null,
    })
    .eq('id', params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: listing } = await supabase
    .from('listings')
    .select('slug')
    .eq('id', existing.listing_id)
    .single();

  if (listing) {
    revalidatePath(`/listings/${listing.slug}`);
  }

  return NextResponse.json(data);
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { data: existing } = await supabase
    .from('reviews')
    .select('listing_id')
    .eq('id', params.id)
    .single();

  if (existing) {
    const { data: listing } = await supabase
      .from('listings')
      .select('slug')
      .eq('id', existing.listing_id)
      .single();

    if (listing) {
      revalidatePath(`/listings/${listing.slug}`);
    }
  }

  const { error } = await supabase.from('reviews').delete().eq('id', params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
```

- [ ] **Step 5: Create app/api/upload/route.ts**

```ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const bucket = formData.get('bucket') as string;

  if (!file || !bucket) {
    return NextResponse.json(
      { error: 'File and bucket are required' },
      { status: 400 }
    );
  }

  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);

  return NextResponse.json({ url: urlData.publicUrl, path: data.path });
}
```

- [ ] **Step 6: Verify build**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat: add admin API routes for CRUD + upload"
```

---

### Task 7: Admin Pages (Dashboard + Create/Edit + Reviews)

**Files:**
- Create: `app/admin/page.tsx`
- Create: `app/admin/new/page.tsx`
- Create: `app/admin/[id]/edit/page.tsx`
- Create: `app/admin/reviews/page.tsx`
- Create: `components/admin/DataTable.tsx`
- Create: `components/admin/ListingForm.tsx`
- Create: `components/admin/ReviewForm.tsx`
- Create: `components/admin/MediaUploader.tsx`

- [ ] **Step 1: Create components/admin/MediaUploader.tsx**

```tsx
'use client';

import { useState, useRef } from 'react';

interface Props {
  bucket: string;
  onUpload: (url: string) => void;
  accept?: string;
}

export default function MediaUploader({ bucket, onUpload, accept }: Props) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', bucket);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const { url } = await res.json();
      onUpload(url);
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFile}
        className="block w-full text-sm text-gray-500 file:mr-3 file:rounded-md file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100"
      />
      {uploading && (
        <p className="mt-1 text-xs text-gray-400">Uploading...</p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create components/admin/ListingForm.tsx**

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { slugify } from '@/lib/utils';
import MediaUploader from './MediaUploader';
import type { Listing, ListingMedia } from '@/types';

interface Props {
  listing?: Listing & { media?: ListingMedia[] };
}

export default function ListingForm({ listing }: Props) {
  const router = useRouter();
  const isEdit = !!listing;
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    title: listing?.title ?? '',
    brand: listing?.brand ?? '',
    model: listing?.model ?? '',
    slug: listing?.slug ?? '',
    price: listing ? String(listing.price / 100) : '',
    condition: listing?.condition ?? 'Good',
    quantity: listing ? String(listing.quantity) : '1',
    description: listing?.description ?? '',
    whatsapp_link: listing?.whatsapp_link ?? '',
    phone_link: listing?.phone_link ?? '',
  });

  const [mediaUrls, setMediaUrls] = useState<string[]>(
    listing?.media?.map((m) => m.url) ?? []
  );

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      // Auto-generate slug from title (on create)
      if (name === 'title' && !isEdit) {
        next.slug = slugify(value);
      }
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const priceInPaise = Math.round(parseFloat(form.price) * 100);
    if (isNaN(priceInPaise) || priceInPaise <= 0) {
      setError('Please enter a valid price');
      setSaving(false);
      return;
    }

    const payload = {
      ...form,
      price: priceInPaise,
      quantity: parseInt(form.quantity, 10) || 1,
    };

    try {
      const url = isEdit ? `/api/listings/${listing.id}` : '/api/listings';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save');
      }

      const saved = await res.json();

      // Save media associations
      if (mediaUrls.length > 0) {
        // Delete existing media on edit
        if (isEdit) {
          await fetch(`/api/listings/${listing.id}/media`, { method: 'DELETE' });
        }

        for (let i = 0; i < mediaUrls.length; i++) {
          await fetch('/api/listings/media', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              listing_id: saved.id,
              url: mediaUrls[i],
              type: mediaUrls[i].match(/\.(mp4|webm|mov)$/i) ? 'video' : 'image',
              sort_order: i,
            }),
          });
        }
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Slug
          </label>
          <input
            type="text"
            name="slug"
            value={form.slug}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-500 focus:border-brand-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Brand
          </label>
          <input
            type="text"
            name="brand"
            value={form.brand}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Model
          </label>
          <input
            type="text"
            name="model"
            value={form.model}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Price (₹)
          </label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Quantity
          </label>
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            required
            min="0"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Condition
          </label>
          <select
            name="condition"
            value={form.condition}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          >
            <option value="Excellent">Excellent</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            WhatsApp Number
          </label>
          <input
            type="tel"
            name="whatsapp_link"
            value={form.whatsapp_link}
            onChange={handleChange}
            required
            placeholder="+91 98765 43210"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Phone Number (optional)
          </label>
          <input
            type="tel"
            name="phone_link"
            value={form.phone_link}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Media (Images / Videos)
        </label>
        <MediaUploader
          bucket="listing-media"
          accept="image/*,video/*"
          onUpload={(url) => setMediaUrls((prev) => [...prev, url])}
        />
        {mediaUrls.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {mediaUrls.map((url, i) => (
              <div key={i} className="relative">
                <img
                  src={url}
                  alt=""
                  className="h-16 w-20 rounded-md object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    setMediaUrls((prev) => prev.filter((_, j) => j !== i))
                  }
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : isEdit ? 'Update Listing' : 'Create Listing'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin')}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
```

- [ ] **Step 3: Create components/admin/DataTable.tsx**

```tsx
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';
import type { Listing } from '@/types';

interface Props {
  listings: Listing[];
  onDelete: (id: string) => void;
}

export default function DataTable({ listings, onDelete }: Props) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-4 py-3 font-medium text-gray-600">Title</th>
            <th className="px-4 py-3 font-medium text-gray-600">Brand</th>
            <th className="px-4 py-3 font-medium text-gray-600">Price</th>
            <th className="px-4 py-3 font-medium text-gray-600">Stock</th>
            <th className="px-4 py-3 font-medium text-gray-600">Condition</th>
            <th className="px-4 py-3 font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((listing) => (
            <tr key={listing.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">
                {listing.title}
              </td>
              <td className="px-4 py-3 text-gray-600">{listing.brand}</td>
              <td className="px-4 py-3 text-gray-900">
                {formatPrice(listing.price)}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    listing.quantity > 0
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {listing.quantity}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-600">{listing.condition}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Link
                    href={`/admin/${listing.id}/edit`}
                    className="rounded-md bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => onDelete(listing.id)}
                    className="rounded-md bg-red-50 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {listings.length === 0 && (
        <p className="p-8 text-center text-gray-400">No listings yet.</p>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Create components/admin/ReviewForm.tsx**

```tsx
'use client';

import { useState } from 'react';
import MediaUploader from './MediaUploader';
import type { Review, ReviewMedia } from '@/types';

interface Props {
  review?: Review & { media?: ReviewMedia[] };
  listingId: string;
  onDone: () => void;
}

export default function ReviewForm({ review, listingId, onDone }: Props) {
  const isEdit = !!review;
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [reviewer, setReviewer] = useState(review?.reviewer ?? '');
  const [rating, setRating] = useState(review?.rating ?? 5);
  const [text, setText] = useState(review?.text ?? '');
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const url = isEdit ? `/api/reviews/${review.id}` : '/api/reviews';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: listingId,
          reviewer,
          rating,
          text,
        }),
      });

      if (!res.ok) throw new Error('Failed to save review');

      // Upload review media
      // (simplified: media association for reviews works same pattern as listings)
      onDone();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-gray-200 p-4">
      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Reviewer Name
          </label>
          <input
            type="text"
            value={reviewer}
            onChange={(e) => setReviewer(e.target.value)}
            required
            placeholder="Rahul S. (or * for anonymous)"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Rating
          </label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {'★'.repeat(n) + '☆'.repeat(5 - n)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Review Text
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Media (optional)
        </label>
        <MediaUploader
          bucket="review-media"
          accept="image/*,video/*"
          onUpload={(url) => setMediaUrls((prev) => [...prev, url])}
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : isEdit ? 'Update Review' : 'Add Review'}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
```

- [ ] **Step 5: Create app/admin/page.tsx (Dashboard)**

```tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DataTable from '@/components/admin/DataTable';
import type { Listing } from '@/types';

export default function AdminDashboard() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadListings() {
    const res = await fetch('/api/listings');
    const data = await res.json();
    setListings(data);
    setLoading(false);
  }

  useEffect(() => {
    loadListings();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm('Delete this listing permanently?')) return;
    await fetch(`/api/listings/${id}`, { method: 'DELETE' });
    loadListings();
  }

  if (loading) {
    return <p className="text-gray-400">Loading...</p>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link
          href="/admin/new"
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          + New Listing
        </Link>
      </div>
      <DataTable listings={listings} onDelete={handleDelete} />
    </div>
  );
}
```

- [ ] **Step 6: Create app/admin/new/page.tsx**

```tsx
import ListingForm from '@/components/admin/ListingForm';

export default function NewListingPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">New Listing</h1>
      <ListingForm />
    </div>
  );
}
```

- [ ] **Step 7: Create app/admin/[id]/edit/page.tsx**

```tsx
import { supabase } from '@/lib/supabase';
import ListingForm from '@/components/admin/ListingForm';
import { notFound } from 'next/navigation';

export default async function EditListingPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: listing } = await supabase
    .from('listings')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!listing) notFound();

  const { data: media } = await supabase
    .from('listing_media')
    .select('*')
    .eq('listing_id', params.id)
    .order('sort_order');

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Edit Listing</h1>
      <ListingForm listing={{ ...listing, media: media ?? [] }} />
    </div>
  );
}
```

- [ ] **Step 8: Create app/admin/reviews/page.tsx**

```tsx
'use client';

import { useEffect, useState } from 'react';
import ReviewForm from '@/components/admin/ReviewForm';
import type { Listing, Review, ReviewMedia } from '@/types';

export default function AdminReviewsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListing, setSelectedListing] = useState<string | null>(null);
  const [reviews, setReviews] = useState<(Review & { media: ReviewMedia[] })[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);

  useEffect(() => {
    fetch('/api/listings')
      .then((r) => r.json())
      .then(setListings);
  }, []);

  async function loadReviews(listingId: string) {
    const res = await fetch(`/api/reviews?listing_id=${listingId}`);
    const data = await res.json();
    setReviews(data);
  }

  function selectListing(id: string) {
    setSelectedListing(id);
    setShowForm(false);
    setEditingReview(null);
    loadReviews(id);
  }

  function handleDone() {
    setShowForm(false);
    setEditingReview(null);
    if (selectedListing) loadReviews(selectedListing);
  }

  async function handleDelete(reviewId: string) {
    if (!confirm('Delete this review?')) return;
    await fetch(`/api/reviews/${reviewId}`, { method: 'DELETE' });
    if (selectedListing) loadReviews(selectedListing);
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Reviews</h1>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Select Listing
        </label>
        <select
          value={selectedListing ?? ''}
          onChange={(e) => selectListing(e.target.value)}
          className="w-full max-w-sm rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">Choose a listing...</option>
          {listings.map((l) => (
            <option key={l.id} value={l.id}>
              {l.title}
            </option>
          ))}
        </select>
      </div>

      {selectedListing && (
        <>
          <button
            onClick={() => {
              setEditingReview(null);
              setShowForm(!showForm);
            }}
            className="mb-4 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            {showForm ? 'Cancel' : '+ Add Review'}
          </button>

          {showForm && (
            <ReviewForm
              listingId={selectedListing}
              review={editingReview}
              onDone={handleDone}
            />
          )}

          <div className="mt-4 space-y-3">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-xl border border-gray-200 p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">
                      {review.reviewer === '*' ? 'Anonymous' : review.reviewer}
                    </span>
                    <span className="ml-2 text-amber-500">
                      {'★'.repeat(review.rating) + '☆'.repeat(5 - review.rating)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingReview(review);
                        setShowForm(true);
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="text-xs text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {review.text && (
                  <p className="mt-2 text-sm text-gray-600">{review.text}</p>
                )}
              </div>
            ))}
            {reviews.length === 0 && !showForm && (
              <p className="text-sm text-gray-400">No reviews for this listing.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 9: Add media API routes (for listing_media and review_media CRUD)**

Create: `app/api/listings/media/route.ts`

```ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  const body = await request.json();

  const { data, error } = await supabase
    .from('listing_media')
    .insert({
      listing_id: body.listing_id,
      url: body.url,
      type: body.type,
      sort_order: body.sort_order ?? 0,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const listingId = searchParams.get('listing_id');

  if (!listingId) {
    return NextResponse.json({ error: 'listing_id required' }, { status: 400 });
  }

  const { error } = await supabase
    .from('listing_media')
    .delete()
    .eq('listing_id', listingId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
```

- [ ] **Step 10: Verify build**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 11: Commit**

```bash
git add -A && git commit -m "feat: add admin CRUD pages (dashboard, listings, reviews)"
```

---

### Task 8: Final Integration & Verification

**Files:**
- None (verification pass)

- [ ] **Step 1: Full type check**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 2: Production build**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 3: Manual sanity checks**

Verify:
- [ ] Homepage loads without error (with Supabase running)
- [ ] Admin login page renders
- [ ] Listing detail page renders via `/listings/[slug]`
- [ ] All API routes respond correctly
- [ ] Admin CRUD flow works end-to-end

- [ ] **Step 4: Push and deploy to Vercel**

```bash
git push origin main
```

Then connect the repo to Vercel:
1. Go to https://vercel.com → Add New Project → Import this repo
2. Set env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `ADMIN_PASSWORD`
3. Deploy

- [ ] **Step 5: Final commit (if any fixes needed)**

```bash
git add -A && git commit -m "chore: final fixes after integration"
```
