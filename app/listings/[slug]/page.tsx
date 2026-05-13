import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { formatPrice, waLink } from '@/lib/utils';
import type { Listing, Review, ReviewMedia } from '@/types';
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

  let reviewsWithMedia: (Review & { media: ReviewMedia[] })[] = [];
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

  const { data: siteSettings } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .single();

  const conditionColor = {
    Excellent: 'text-green-700 bg-green-50',
    Good: 'text-amber-700 bg-amber-50',
    Fair: 'text-red-700 bg-red-50',
  }[listing.condition as Listing['condition']];

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
                whatsappLink={waLink(siteSettings?.whatsapp_number ?? listing.whatsapp_link)}
                phoneLink={
                  siteSettings?.phone_number || listing.phone_link
                    ? `tel:${siteSettings?.phone_number || listing.phone_link}`
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
              {listing.reviews.map((review: Review & { media: ReviewMedia[] }) => (
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
