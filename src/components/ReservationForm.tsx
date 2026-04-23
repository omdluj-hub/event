'use client';

import { useState } from 'react';

const EVENT_DATA = {
  '피부 이벤트': [
    '여드름 흉터 - 트랜스테라피 1개 (5만원)',
    '여드름 흉터 - 트랜스테라피 면적당 (20만원~)',
    '등가슴여드름/모공각화증 - 등여드름(상부) 2주 5세트 (17.1만원)',
    '등가슴여드름/모공각화증 - 가슴여드름(전체) 2주 5세트 (17.1만원)',
    '등가슴여드름/모공각화증 - 팔모공각화증(전체) 2주 5세트 (20만원)',
    '등가슴여드름/모공각화증 - 종아리모공각화증(한부위) 2주 5세트 (20만원)',
  ],
  '다이어트 이벤트': [
    '다요정 - 2주 체험분 90정 (7만원)',
    '다요정 - 3개월분 (39만원)',
    '비톡스 프로그램 - 10일 비움탕 5일 + 다요스틱 5일 (16만원)',
    '비톡스 프로그램 - 7일 비움탕 3일 + 미감S 4일 (9.9만원)',
    '다요스틱 - 2주 체험분 (8만원)',
    '다요스틱 - 3개월분 (65만원)',
    '두배더블 프로그램 - 3개월 결제 시 (유지기 9개월 추가처방)',
    '두배더블 프로그램 - 2개월 결제 시 (유지기 4개월 추가처방)',
  ]
};

type MainCategory = keyof typeof EVENT_DATA;

export default function ReservationForm() {
  const [mainCategory, setMainCategory] = useState<MainCategory | ''>('');
  const [subCategory, setSubCategory] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mainCategory,
          subCategory,
          date,
          time,
          name,
          phone
        }),
      });

      if (!response.ok) {
        throw new Error('예약 신청에 실패했습니다.');
      }

      setSuccess(true);
      // Reset form
      setMainCategory('');
      setSubCategory('');
      setDate('');
      setTime('');
      setName('');
      setPhone('');
    } catch (err: any) {
      setError(err.message || '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100 mt-8 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800">이벤트 간편 예약</h3>
        <p className="text-gray-500 mt-2">원하시는 이벤트와 시간을 선택해 주시면 빠르게 예약해 드립니다.</p>
      </div>

      {success ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            ✅
          </div>
          <h4 className="text-xl font-bold text-green-800 mb-2">예약 신청이 완료되었습니다!</h4>
          <p className="text-green-700">관리자가 확인 후 연락드리겠습니다.</p>
          <button 
            onClick={() => setSuccess(false)}
            className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            추가 예약하기
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 이벤트 선택 (대분류) */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">이벤트 분류</label>
              <select
                required
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                value={mainCategory}
                onChange={(e) => {
                  setMainCategory(e.target.value as MainCategory);
                  setSubCategory(''); // 대분류 변경 시 소분류 초기화
                }}
              >
                <option value="">선택해주세요</option>
                <option value="피부 이벤트">피부 이벤트</option>
                <option value="다이어트 이벤트">다이어트 이벤트</option>
              </select>
            </div>

            {/* 이벤트 항목 (소분류) */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">상세 항목</label>
              <select
                required
                disabled={!mainCategory}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all disabled:bg-gray-100 disabled:text-gray-400"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
              >
                <option value="">선택해주세요</option>
                {mainCategory && EVENT_DATA[mainCategory].map((item, idx) => (
                  <option key={idx} value={item}>{item}</option>
                ))}
              </select>
            </div>
            
            {/* 방문 희망일 */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">방문 희망일</label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            {/* 방문 희망시간 */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">방문 희망시간</label>
              <select
                required
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              >
                <option value="">선택해주세요</option>
                <option value="10:30">오전 10:30</option>
                <option value="11:00">오전 11:00</option>
                <option value="11:30">오전 11:30</option>
                <option value="12:00">오후 12:00</option>
                <option value="12:30">오후 12:30</option>
                <option value="14:00">오후 02:00</option>
                <option value="15:00">오후 03:00</option>
                <option value="16:00">오후 04:00</option>
                <option value="17:00">오후 05:00</option>
                <option value="18:00">오후 06:00</option>
                <option value="19:00">오후 07:00</option>
                <option value="20:00">오후 08:00</option>
              </select>
            </div>

            {/* 이름 */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">예약자 성함</label>
              <input
                type="text"
                required
                placeholder="홍길동"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* 연락처 */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">연락처</label>
              <input
                type="tel"
                required
                placeholder="010-0000-0000"
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? '신청 중...' : '예약 신청하기'}
          </button>
        </form>
      )}
    </div>
  );
}
