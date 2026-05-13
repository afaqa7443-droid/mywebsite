import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyApiSession } from '@/lib/auth';

export async function POST(request: Request) {
  if (!verifyApiSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const bucket = formData.get('bucket') as string;

  if (!file || !bucket) {
    return NextResponse.json(
      { error: 'File and bucket are required' },
      { status: 400 }
    );
  }

  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);

  return NextResponse.json({ url: urlData.publicUrl, path: data.path });
}
