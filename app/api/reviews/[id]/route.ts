import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { verifyApiSession } from '@/lib/auth';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!verifyApiSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
  if (!verifyApiSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
