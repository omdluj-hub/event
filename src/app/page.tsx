'use client';

import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import ReservationModal from '@/components/ReservationModal';

interface ImageResponse {
  eventImage: string | null;
  cardnewsImages: string[];
}

export default function Home() {
  const [images, setImages] = useState<ImageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/images')
      .then(res => res.json())
      .then(data => {
        setImages(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load images:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header / Clinic Info */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-green-700 tracking-tight">후한의원 구미점</h1>
            <p className="text-sm text-gray-500 mt-1 uppercase tracking-wider">Hoo Korean Medicine Clinic Gumi</p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-sm">
            <div>
              <p className="font-semibold text-gray-700 mb-0.5">상담 및 예약</p>
              <p className="text-lg font-bold text-green-600">054-474-1075</p>
            </div>
            <div>
              <p className="font-semibold text-gray-700 mb-0.5">진료시간</p>
              <p>월·화·수·금 10:30 - 20:30 / 토 10:00 - 14:00</p>
              <p className="text-xs text-gray-400 mt-0.5">(점심 13:00-14:00 / 토요일 점심시간 없음 / 목·일·공휴일 휴진)</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto py-8 px-4 md:py-12 space-y-12">
        {/* Main Event Image */}
        <section className="animate-fade-in">
          {images?.eventImage ? (
            <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={images.eventImage}
                alt="Main Event"
                className="w-full h-auto block"
              />
            </div>
          ) : (
            <div className="h-64 bg-gray-200 rounded-2xl flex items-center justify-center text-gray-400 border-2 border-dashed">
              진행중인 이벤트가 없습니다.
            </div>
          )}
        </section>

        {/* Action Button Section */}
        <section className="flex justify-center animate-bounce-subtle">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="group relative inline-flex items-center justify-center px-10 py-5 font-bold text-white transition-all duration-200 bg-green-600 font-pj rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 shadow-xl hover:bg-green-700 active:scale-95"
          >
            <span className="text-xl">✨ 4월 이벤트 간편 예약하기</span>
          </button>
        </section>

        {/* Cardnews Slider */}
        <section className="space-y-6 max-w-2xl mx-auto">
          <div className="relative group">
            {images && images.cardnewsImages.length > 0 ? (
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 3500, disableOnInteraction: false }}
                className="pb-14"
              >
                {images.cardnewsImages.map((src, index) => (
                  <SwiperSlide key={index}>
                    <div className="relative aspect-square rounded-xl overflow-hidden shadow-xl border border-gray-100 bg-white">
                      <img
                        src={src}
                        alt={`Cardnews ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="text-center py-12 text-gray-400">등록된 카드뉴스가 없습니다.</div>
            )}
          </div>
        </section>

        {/* Map & Quick Contact Section */}
        <section className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Map Area */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <span className="w-1 h-6 bg-green-600 rounded-full"></span>
                오시는 길
              </h3>
              <div className="w-full h-80 rounded-2xl overflow-hidden shadow-md border border-gray-200">
                <iframe 
                  src="https://maps.google.com/maps?q=%ED%9B%84%ED%95%9C%EC%9D%98%EC%9B%90%20%EA%B5%AC%EB%AF%B8%EC%A0%90&t=&z=17&ie=UTF8&iwloc=&output=embed" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy"
                ></iframe>
              </div>
              <p className="text-sm text-gray-600 px-2">
                경상북도 구미시 인동가산로 9-3 노블레스타워 4층
              </p>
            </div>

            {/* Contact Buttons Area */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <span className="w-1 h-6 bg-green-600 rounded-full"></span>
                빠른 상담 및 예약
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <a 
                  href="https://naver.me/5N15Owng" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-6 bg-white border-2 border-green-500 rounded-2xl shadow-sm hover:bg-green-50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
                      <span className="font-bold text-lg">N</span>
                    </div>
                    <div>
                      <p className="font-bold text-lg text-gray-800">네이버 예약</p>
                      <p className="text-sm text-gray-500">대기 없이 편리하게 예약하세요</p>
                    </div>
                  </div>
                  <span className="text-green-500 group-hover:translate-x-1 transition-transform">→</span>
                </a>

                <a 
                  href="https://pf.kakao.com/_JEGuu" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-6 bg-white border-2 border-yellow-400 rounded-2xl shadow-sm hover:bg-yellow-50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-yellow-900">
                      <span className="font-bold text-lg">K</span>
                    </div>
                    <div>
                      <p className="font-bold text-lg text-gray-800">카카오톡 상담</p>
                      <p className="text-sm text-gray-500">궁금한 점을 실시간으로 물어보세요</p>
                    </div>
                  </div>
                  <span className="text-yellow-600 group-hover:translate-x-1 transition-transform">→</span>
                </a>

                <div className="p-6 bg-gray-100 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center text-white text-xl">
                    📞
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Representative Call</p>
                    <p className="font-bold text-xl text-gray-800">054-474-1075</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Buttons */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-[100]">
        {/* Floating Reservation Banner */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-16 h-16 bg-green-600 rounded-full shadow-2xl flex flex-col items-center justify-center text-white hover:scale-110 transition-transform hover:bg-green-500 group relative"
          title="이벤트 예약"
        >
          <span className="text-2xl mb-[-4px]">📅</span>
          <span className="text-[10px] font-bold">예약</span>
          {/* Tooltip-like badge */}
          <span className="absolute right-full mr-3 bg-white text-green-600 px-3 py-1.5 rounded-lg text-xs font-bold shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-green-100">
            실시간 이벤트 예약하기
          </span>
        </button>

        <a 
          href="https://pf.kakao.com/_JEGuu" 
          target="_blank"
          rel="noopener noreferrer"
          className="w-16 h-16 bg-yellow-400 rounded-full shadow-2xl flex items-center justify-center text-3xl hover:scale-110 transition-transform hover:bg-yellow-300"
          title="카카오톡 상담"
        >
          💬
        </a>
        <a 
          href="https://naver.me/5N15Owng" 
          target="_blank"
          rel="noopener noreferrer"
          className="w-16 h-16 bg-green-500 rounded-full shadow-2xl flex items-center justify-center text-white text-2xl font-bold hover:scale-110 transition-transform hover:bg-green-400"
          title="네이버 예약"
        >
          N
        </a>
      </div>

      {/* Reservation Modal */}
      <ReservationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">후한의원 구미점</h2>
            <p className="text-sm leading-relaxed opacity-80">
              구미 지역의 피부와 다이어트 건강을 책임지는 후한의원입니다.<br />
              환자 한 분 한 분을 정성스럽게 진료하여 건강한 내일을 약속드립니다.
            </p>
            <div className="pt-4 border-t border-gray-700 text-xs text-gray-500">
              <a href="/admin" className="hover:text-gray-400 transition-colors">
                © 2024 후한의원 구미점. All rights reserved.
              </a>
            </div>
          </div>
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-4">
              <span className="text-green-500 font-bold w-20 shrink-0">ADDRESS</span>
              <p>경상북도 구미시 인동가산로 9-3 노블레스타워 4층</p>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-green-500 font-bold w-20 shrink-0">TEL</span>
              <p>054-474-1075</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
