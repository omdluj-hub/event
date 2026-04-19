import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: files, error } = await supabase.storage.from('event-images').list('', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' },
    });

    if (error) throw error;

    const eventFile = files.find(f => f.name.startsWith('event'));
    const cardnewsFiles = files
      .filter(f => f.name.startsWith('cardnews/') || (f.name.match(/^\d+_/))) // Handling both old and reordered patterns
      .sort((a, b) => a.name.localeCompare(b.name));

    // Actually, let's keep it simple: event at root, cardnews in a folder
    // But list() doesn't recurse by default. Let's list the root and the cardnews folder.
    
    const { data: rootFiles } = await supabase.storage.from('event-images').list('', { sortBy: { column: 'name', order: 'asc' } });
    const { data: cnFiles } = await supabase.storage.from('event-images').list('cardnews', { sortBy: { column: 'name', order: 'asc' } });

    const eventImage = rootFiles?.find(f => f.name.startsWith('event')) 
      ? supabase.storage.from('event-images').getPublicUrl(rootFiles.find(f => f.name.startsWith('event'))!.name).data.publicUrl 
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
