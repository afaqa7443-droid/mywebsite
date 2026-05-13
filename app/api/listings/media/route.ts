import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { verifyApiSession } from '@/lib/auth';

export async function POST(request: Request) {
  if (!verifyApiSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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

  // Revalidate after media change
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

export async function DELETE(request: Request) {
  if (!verifyApiSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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

  // Revalidate after media deletion
  const { data: listing } = await supabase
    .from('listings')
    .select('slug')
    .eq('id', listingId)
    .single();

  if (listing) {
    revalidatePath(`/listings/${listing.slug}`);
  }

  return NextResponse.json({ success: true });
}
