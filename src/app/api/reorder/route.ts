import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { sortedNames } = await req.json(); // ['image1.jpg', 'image2.jpg', ...]
    if (!sortedNames || !Array.isArray(sortedNames)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const cardnewsDir = path.join(process.cwd(), 'public/images/cardnews');
    
    // 파일 이름 앞에 순서를 나타내는 접두사를 붙여 파일명을 변경합니다.
    // 예: 01_original.jpg, 02_next.jpg
    sortedNames.forEach((name, index) => {
      const oldPath = path.join(cardnewsDir, name);
      // 기존에 숫자가 붙어있을 수 있으므로 순수 파일명 추출
      const pureName = name.replace(/^\d+_/, '');
      const newName = `${String(index + 1).padStart(3, '0')}_${pureName}`;
      const newPath = path.join(cardnewsDir, newName);
      
      if (fs.existsSync(oldPath)) {
        fs.renameSync(oldPath, newPath);
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reorder error:', error);
    return NextResponse.json({ error: 'Reorder failed' }, { status: 500 });
  }
}
