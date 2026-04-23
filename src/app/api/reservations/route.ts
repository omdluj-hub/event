import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mainCategory, subCategory, date, time, name, phone } = body;

    // Validate input
    if (!mainCategory || !subCategory || !date || !time || !name || !phone) {
      return NextResponse.json({ error: '모든 항목을 입력해주세요.' }, { status: 400 });
    }

    // Insert into Supabase reservations table
    const { data, error } = await supabase
      .from('reservations')
      .insert([
        {
          main_category: mainCategory,
          sub_category: subCategory,
          reservation_date: date,
          reservation_time: time,
          customer_name: name,
          customer_phone: phone,
          status: 'pending' // default status
        }
      ]);

    if (error) {
      console.error('Supabase Insert Error:', error);
      return NextResponse.json({ error: '데이터베이스 저장에 실패했습니다.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Reservation API Error:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
