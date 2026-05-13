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
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">Edit Listing</h1>
      <ListingForm listing={{ ...listing, media: media ?? [] }} />
    </div>
  );
}
