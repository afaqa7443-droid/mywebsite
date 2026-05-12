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
