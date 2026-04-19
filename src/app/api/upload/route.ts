import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const type = formData.get('type') as string;
    const file = formData.get('file') as File;

    if (!file || !type) {
      return NextResponse.json({ error: 'Missing file or type' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const fileName = file.name;

    if (type === 'event') {
      // Delete old event images
      const { data: oldFiles } = await supabase.storage.from('event-images').list();
      const filesToDelete = oldFiles?.filter(f => f.name.startsWith('event')).map(f => f.name) || [];
      if (filesToDelete.length > 0) {
        await supabase.storage.from('event-images').remove(filesToDelete);
      }

      const newFileName = fileName.startsWith('event') ? fileName : `event_${Date.now()}_${fileName}`;
      await supabase.storage.from('event-images').upload(newFileName, buffer, {
        contentType: file.type,
        upsert: true
      });
    } else if (type === 'cardnews') {
      // Use timestamp prefix to maintain some order or prevent name collision
      const safeName = `cardnews/${Date.now()}_${fileName}`;
      await supabase.storage.from('event-images').upload(safeName, buffer, {
        contentType: file.type,
        upsert: true
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Supabase upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
