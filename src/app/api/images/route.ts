import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const imagesDir = path.join(process.cwd(), 'public/images');
  const cardnewsDir = path.join(imagesDir, 'cardnews');

  try {
    const allFiles = fs.readdirSync(imagesDir);
    const eventImage = allFiles.find(file => file.startsWith('event') && /\.(jpg|jpeg|png|webp)$/i.test(file)) || null;

    let cardnewsImages: string[] = [];
    if (fs.existsSync(cardnewsDir)) {
      cardnewsImages = fs.readdirSync(cardnewsDir)
        .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
        .sort((a, b) => {
          // Try to sort numerically if filenames contain numbers
          const numA = parseInt(a.match(/\d+/)?.[0] || '0');
          const numB = parseInt(b.match(/\d+/)?.[0] || '0');
          return numA - numB;
        });
    }

    return NextResponse.json({
      eventImage: eventImage ? `/images/${eventImage}` : null,
      cardnewsImages: cardnewsImages.map(file => `/images/cardnews/${file}`),
    });
  } catch (error) {
    console.error('Failed to list images:', error);
    return NextResponse.json({ error: 'Failed to list images' }, { status: 500 });
  }
}
