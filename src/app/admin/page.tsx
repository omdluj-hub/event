'use client';

import { useEffect, useState } from 'react';
import ImageManager from '@/components/ImageManager';
import AdminReservationList from '@/components/AdminReservationList';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'images' | 'reservations'>('images');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const password = prompt('관리자 비밀번호를 입력하세요.');        
    if (password === 'gnrnal1075') {
      setIsAuthenticated(true);
    } else {
      alert('비밀번호가 틀렸습니다.');
      window.location.href = '/';
    }
    setLoading(false);
  }, []);

  if (loading) return <div className="p-10 text-center">불러오는 중...</div>;
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">관리자 페이지</h1>
            <p className="text-gray-500 mt-1">홈페이지 콘텐츠 및 예약 신청을 관리합니다.</p>
          </div>
          
          <nav className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-200">
            <button
              onClick={() => setActiveTab('images')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'images' 
                ? 'bg-green-600 text-white shadow-md' 
                : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              이미지 관리
            </button>
            <button
              onClick={() => setActiveTab('reservations')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'reservations' 
                ? 'bg-green-600 text-white shadow-md' 
                : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              이벤트 예약 내역
            </button>
          </nav>
        </header>

        <main className="animate-fade-in">
          {activeTab === 'images' ? (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-green-500 rounded-full"></span>
                메인 및 카드뉴스 이미지 관리
              </h2>
              <ImageManager />
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-green-500 rounded-full"></span>
                실시간 예약 신청 목록
              </h2>
              <AdminReservationList />
            </div>
          )}
        </main>

        <footer className="mt-12 text-center text-gray-400 text-sm">
          &copy; 2024 후한의원 구미점 관리 시스템
        </footer>
      </div>
    </div>
  );
}
