import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // List root and cardnews folder in parallel
    const [rootResult, cnResult] = await Promise.all([
      supabase.storage.from('event-images').list('', { sortBy: { column: 'name', order: 'asc' } }),
      supabase.storage.from('event-images').list('cardnews', { sortBy: { column: 'name', order: 'asc' } })
    ]);

    if (rootResult.error) throw rootResult.error;
    if (cnResult.error) throw cnResult.error;

    const rootFiles = rootResult.data;
    const cnFiles = cnResult.data;

    const eventFile = rootFiles?.find(f => f.name.startsWith('event'));
    const eventImage = eventFile 
      ? supabase.storage.from('event-images').getPublicUrl(eventFile.name).data.publicUrl 
      : null;

    const cardnewsImages = cnFiles
      ?.filter(f => !f.name.startsWith('.'))
      .map(f => supabase.storage.from('event-images').getPublicUrl(`cardnews/${f.name}`).data.publicUrl) || [];

    return NextResponse.json({
      eventImage,
      cardnewsImages,
    });
  } catch (error) {
    console.error('Failed to list images from Supabase:', error);
    return NextResponse.json({ error: 'Failed to list images' }, { status: 500 });
  }
}
