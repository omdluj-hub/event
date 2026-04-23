'use client';

import { useState, useEffect } from 'react';

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

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReservationModal({ isOpen, onClose }: ReservationModalProps) {
  const [step, setStep] = useState(1);
  const [mainCategory, setMainCategory] = useState<MainCategory | ''>('');
  const [subCategory, setSubCategory] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // 모달이 닫힐 때 상태 초기화
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setStep(1);
        setMainCategory('');
        setSubCategory('');
        setDate('');
        setTime('');
        setName('');
        setPhone('');
        setSuccess(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mainCategory, subCategory, date, time, name, phone }),
      });
      if (response.ok) setSuccess(true);
      else alert('예약 신청에 실패했습니다.');
    } catch (err) {
      console.error(err);
      alert('오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative animate-scale-in">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8">
          {success ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">✓</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">예약 신청 완료!</h3>
              <p className="text-gray-500 mb-8">내용 확인 후 곧 연락드리겠습니다.</p>
              <button 
                onClick={onClose}
                className="w-full bg-green-600 text-white font-bold py-4 rounded-2xl hover:bg-green-700 transition-colors"
              >
                닫기
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded-md uppercase tracking-wider">Step {step} / 4</span>
                <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${(step / 4) * 100}%` }}></div>
                </div>
              </div>

              {step === 1 && (
                <div className="animate-slide-in">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">관심 있는 이벤트 분야를 선택해주세요.</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {(Object.keys(EVENT_DATA) as MainCategory[]).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => { setMainCategory(cat); setStep(2); }}
                        className={`p-6 rounded-2xl border-2 text-left transition-all ${mainCategory === cat ? 'border-green-500 bg-green-50' : 'border-gray-100 hover:border-green-200 hover:bg-gray-50'}`}
                      >
                        <span className="text-lg font-bold text-gray-800">{cat}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="animate-slide-in">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">상세 항목을 선택해주세요.</h3>
                  <div className="grid grid-cols-1 gap-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                    {mainCategory && EVENT_DATA[mainCategory].map((item) => (
                      <button
                        key={item}
                        onClick={() => { setSubCategory(item); setStep(3); }}
                        className={`p-4 rounded-xl border-2 text-left text-sm transition-all ${subCategory === item ? 'border-green-500 bg-green-50' : 'border-gray-100 hover:border-green-200 hover:bg-gray-50'}`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setStep(1)} className="mt-6 text-gray-400 text-sm font-medium hover:text-gray-600">← 뒤로가기</button>
                </div>
              )}

              {step === 3 && (
                <div className="animate-slide-in">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">방문 희망 날짜와 시간을 알려주세요.</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">날짜 선택</label>
                      <input 
                        type="date" 
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 outline-none"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">시간 선택</label>
                      <select 
                        className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 outline-none"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                      >
                        <option value="">시간을 선택하세요</option>
                        {['10:30', '11:00', '11:30', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-8">
                    <button onClick={() => setStep(2)} className="text-gray-400 text-sm font-medium hover:text-gray-600">← 뒤로가기</button>
                    <button 
                      disabled={!date || !time}
                      onClick={() => setStep(4)}
                      className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold disabled:bg-gray-200"
                    >
                      다음으로
                    </button>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="animate-slide-in">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">마지막으로 성함과 연락처를 입력해주세요.</h3>
                  <div className="space-y-4">
                    <input 
                      type="text" 
                      placeholder="성함"
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 outline-none"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <input 
                      type="tel" 
                      placeholder="연락처 (예: 010-0000-0000)"
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 outline-none"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-8">
                    <button onClick={() => setStep(3)} className="text-gray-400 text-sm font-medium hover:text-gray-600">← 뒤로가기</button>
                    <button 
                      disabled={!name || !phone || loading}
                      onClick={handleSubmit}
                      className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold disabled:bg-gray-200 flex items-center gap-2"
                    >
                      {loading ? '신청 중...' : '예약 신청하기'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
