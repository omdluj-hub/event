'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ImageResponse {
  eventImage: string | null;
  cardnewsImages: string[];
}

// Sortable Item Component
function SortableItem({ src, onDelete }: { src: string; onDelete: (name: string) => void }) {
  const fileName = src.split('/').pop() || '';
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: src });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="group relative bg-white rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow"
    >
      <div {...attributes} {...listeners} className="aspect-square relative cursor-grab active:cursor-grabbing">
        <Image src={src} alt="Cardnews" fill className="object-cover" unoptimized />
      </div>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => onDelete(fileName)}
          className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600 shadow-lg"
          title="삭제"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
export default function AdminPage() {
  const [images, setImages] = useState<ImageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [uploading, setUploading] = useState(false);
  const mainFileRef = useRef<HTMLInputElement>(null);
  const cardnewsFileRef = useRef<HTMLInputElement>(null);

  const fetchImages = async () => {
    try {
      const res = await fetch('/api/images');
      const data = await res.json();
      setImages(data);
    } catch (err) {
      console.error('Failed to load images:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const password = prompt('관리자 비밀번호를 입력하세요.');
    if (password === 'gnrnal1075') {
      setIsAuthenticated(true);
      fetchImages();
    } else {
      alert('비밀번호가 틀렸습니다.');
      window.location.href = '/';
    }
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'event' | 'cardnews') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append('file', files[i]);
      formData.append('type', type);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        if (res.ok) successCount++;
      } catch (err) {
        console.error('Upload failed:', err);
      }
    }

    if (successCount > 0) {
      alert(`${successCount}개의 이미지가 업로드되었습니다.`);
      fetchImages();
    }
    
    setUploading(false);
    e.target.value = '';
  };

  const handleDelete = async (fileName: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      const res = await fetch('/api/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName }),
      });
      if (res.ok) fetchImages();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleClearAll = async () => {
    if (!images?.cardnewsImages.length) return;
    if (!confirm('모든 카드뉴스를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) return;

    setUploading(true);
    try {
      for (const src of images.cardnewsImages) {
        const fileName = src.split('/').pop() || '';
        await fetch('/api/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName }),
        });
      }
      alert('전체 삭제되었습니다.');
      fetchImages();
    } catch (err) {
      console.error('Clear all failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id && images) {
      const oldIndex = images.cardnewsImages.indexOf(active.id as string);
      const newIndex = images.cardnewsImages.indexOf(over.id as string);
      
      const newOrder = arrayMove(images.cardnewsImages, oldIndex, newIndex);
      setImages({ ...images, cardnewsImages: newOrder });

      // 서버에 바뀐 순서 저장
      const sortedNames = newOrder.map(src => src.split('/').pop() || '');
      await fetch('/api/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sortedNames }),
      });
    }
  };

  if (loading) return <div className="p-10 text-center">불러오는 중...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">이미지 관리자</h1>
            <p className="text-sm text-gray-500">이벤트 및 카드뉴스 이미지를 관리합니다.</p>
          </div>
          <a href="/" className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium">
            홈페이지 보기
          </a>
        </div>

        {/* Main Event Section */}
        <section className="bg-white p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-lg font-bold">메인 이벤트 이미지 (1장)</h2>
            <button 
              onClick={() => mainFileRef.current?.click()}
              disabled={uploading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors text-sm"
            >
              이미지 교체
            </button>
            <input type="file" ref={mainFileRef} className="hidden" accept="image/*" onChange={(e) => handleUpload(e, 'event')} />
          </div>
          <div className="bg-gray-50 rounded-xl overflow-hidden flex justify-center p-4">
            {images?.eventImage ? (
              <div className="relative w-full max-w-xl aspect-[16/9] md:aspect-[3/1]">
                <Image src={images.eventImage} alt="Main" fill className="object-cover rounded-lg" unoptimized />
              </div>
            ) : <p className="py-10 text-gray-400">등록된 이미지가 없습니다.</p>}
          </div>
        </section>

        {/* Cardnews Section */}
        <section className="bg-white p-6 rounded-2xl shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b pb-4">
            <div>
              <h2 className="text-lg font-bold">카드뉴스 리스트</h2>
              <p className="text-xs text-gray-400 mt-1">이미지를 드래그하여 순서를 바꿀 수 있습니다.</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleClearAll}
                disabled={uploading || !images?.cardnewsImages.length}
                className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 disabled:opacity-50 text-sm font-medium transition-colors"
              >
                전체 삭제
              </button>
              <button 
                onClick={() => cardnewsFileRef.current?.click()}
                disabled={uploading}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-green-300 transition-colors text-sm font-medium"
              >
                이미지 추가 (다중 선택)
              </button>
              <input type="file" ref={cardnewsFileRef} className="hidden" accept="image/*" multiple onChange={(e) => handleUpload(e, 'cardnews')} />
            </div>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={images?.cardnewsImages || []} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {images?.cardnewsImages.map((src) => (
                  <SortableItem key={src} src={src} onDelete={handleDelete} />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {images?.cardnewsImages.length === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400">등록된 카드뉴스가 없습니다. 이미지를 추가해 주세요.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
