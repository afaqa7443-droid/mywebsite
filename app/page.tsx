import { supabase } from '@/lib/supabase';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import ListingGrid from '@/components/public/ListingGrid';

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
