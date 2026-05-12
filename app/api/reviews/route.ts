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
