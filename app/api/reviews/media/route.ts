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
    .from('review_media')
    .insert({
      review_id: body.review_id,
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
  if (!verifyApiSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const reviewId = searchParams.get('review_id');

  if (!reviewId) {
    return NextResponse.json({ error: 'review_id required' }, { status: 400 });
  }

  const { error } = await supabase
    .from('review_media')
    .delete()
    .eq('review_id', reviewId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
