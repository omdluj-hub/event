import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { fileName } = await req.json();
    if (!fileName) {
      return NextResponse.json({ error: 'Missing filename' }, { status: 400 });
    }

    // In Supabase, the path includes 'cardnews/'
    const filePath = fileName.includes('/') ? fileName : `cardnews/${fileName}`;
    
    const { error } = await supabase.storage.from('event-images').remove([filePath]);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Supabase delete error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
