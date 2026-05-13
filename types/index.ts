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

export interface SiteSettings {
  id: number;
  whatsapp_number: string;
  phone_number: string | null;
  updated_at: string;
}

export interface ListingWithMedia extends Listing {
  media: ListingMedia[];
  reviews: (Review & { media: ReviewMedia[] })[];
}
