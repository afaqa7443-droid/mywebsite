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

-- Indexes
CREATE INDEX idx_listings_slug ON listings(slug);
CREATE INDEX idx_listing_media_listing ON listing_media(listing_id, sort_order);
CREATE INDEX idx_reviews_listing ON reviews(listing_id, created_at DESC);
CREATE INDEX idx_review_media_review ON review_media(review_id, sort_order);

-- Auto-update updated_at trigger
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
