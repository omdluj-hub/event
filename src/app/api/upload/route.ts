import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const type = formData.get('type') as string; // 'event' or 'cardnews'
    const file = formData.get('file') as File;

    if (!file || !type) {
      return NextResponse.json({ error: 'Missing file or type' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = file.name;
    const imagesDir = path.join(process.cwd(), 'public/images');

    if (type === 'event') {
      // Remove existing event images
      const files = fs.readdirSync(imagesDir);
      files.forEach(f => {
        if (f.startsWith('event')) {
          fs.unlinkSync(path.join(imagesDir, f));
        }
      });
      
      // Save new event image. Using the original filename or a standardized one?
      // User said "교체할 수 있도록". Let's use the original filename but ensure it starts with 'event'
      const newFileName = fileName.startsWith('event') ? fileName : `event_${Date.now()}_${fileName}`;
      fs.writeFileSync(path.join(imagesDir, newFileName), buffer);
    } else if (type === 'cardnews') {
      const cardnewsDir = path.join(imagesDir, 'cardnews');
      if (!fs.existsSync(cardnewsDir)) {
        fs.mkdirSync(cardnewsDir, { recursive: true });
      }
      fs.writeFileSync(path.join(cardnewsDir, fileName), buffer);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
