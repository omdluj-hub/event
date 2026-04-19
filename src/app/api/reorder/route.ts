import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { sortedNames } = await req.json(); // Full public URLs or names
    if (!sortedNames || !Array.isArray(sortedNames)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    // Since we can't easily "rename" in Supabase Storage API without copy+delete,
    // and filenames are our only sort key in the simple GET list,
    // we will prefix them with numbers.
    
    for (let i = 0; i < sortedNames.length; i++) {
      const url = sortedNames[i];
      // Extract filename from URL (Supabase public URL format)
      const fileNameWithParams = url.split('/').pop() || '';
      const oldFileName = fileNameWithParams.split('?')[0]; // remove query params if any
      
      const pureName = oldFileName.replace(/^\d+_/, '');
      const newFileName = `${String(i + 1).padStart(3, '0')}_${pureName}`;
      
      if (oldFileName !== newFileName) {
        // Copy to new name
        const { error: copyError } = await supabase.storage
          .from('event-images')
          .copy(`cardnews/${oldFileName}`, `cardnews/${newFileName}`);
        
        if (!copyError) {
          // Delete old
          await supabase.storage.from('event-images').remove([`cardnews/${oldFileName}`]);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Supabase reorder error:', error);
    return NextResponse.json({ error: 'Reorder failed' }, { status: 500 });
  }
}
