import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { fileName } = await req.json();
    if (!fileName) {
      return NextResponse.json({ error: 'Missing filename' }, { status: 400 });
    }

    // Security check: ensure the filename is just a filename, not a path
    const safeFileName = path.basename(fileName);
    const filePath = path.join(process.cwd(), 'public/images/cardnews', safeFileName);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
