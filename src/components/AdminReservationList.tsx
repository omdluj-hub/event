'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Reservation {
  id: string;
  customer_name: string;
  customer_phone: string;
  main_category: string;
  sub_category: string;
  reservation_date: string;
  reservation_time: string;
  status: string;
  created_at: string;
}

export default function AdminReservationList() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setReservations(data);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('reservations')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      fetchReservations();
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">데이터를 불러오는 중...</div>;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 uppercase text-xs font-bold tracking-wider">
              <th className="px-6 py-4">신청일시</th>
              <th className="px-6 py-4">고객명</th>
              <th className="px-6 py-4">연락처</th>
              <th className="px-6 py-4">이벤트 항목</th>
              <th className="px-6 py-4">방문 희망일시</th>
              <th className="px-6 py-4">상태</th>
              <th className="px-6 py-4">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reservations.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                  접수된 예약 내역이 없습니다.
                </td>
              </tr>
            ) : (
              reservations.map((res) => (
                <tr key={res.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(res.created_at).toLocaleString('ko-KR')}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-800">{res.customer_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{res.customer_phone}</td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-green-600 font-bold mb-1">{res.main_category}</div>
                    <div className="text-sm text-gray-700">{res.sub_category}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-800">{res.reservation_date}</div>
                    <div className="text-sm text-gray-500">{res.reservation_time}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      res.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      res.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {res.status === 'pending' ? '대기' : 
                       res.status === 'confirmed' ? '확정' : '취소'}
                    </span>
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    {res.status === 'pending' && (
                      <button 
                        onClick={() => updateStatus(res.id, 'confirmed')}
                        className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                      >
                        확정
                      </button>
                    )}
                    {res.status !== 'cancelled' && (
                      <button 
                        onClick={() => updateStatus(res.id, 'cancelled')}
                        className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200"
                      >
                        취소
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
