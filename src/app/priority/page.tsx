'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { useGesture } from '@use-gesture/react';
import { Button } from '@/components/common/Button';
import { CATEGORIES, Priority } from '@/types';
import { priorityAPI } from '@/lib/api';
import { usePriorityStore } from '@/store/priority';
import { PriorityList } from '@/components/priority/PriorityList';

const CATEGORY_EMOJIS: Record<string, string> = {
  "가사": "🏠",
  "취미": "🎨",
  "휴식": "🛌",
  "건강": "💪",
  "미용": "💅",
  "차량 관리": "🚗",
  "반려 동물": "🐾",
  "가족": "👨‍👩‍👧‍👦",
  "연애": "❤️",
  "친목": "🤝",
  "업무": "💼",
  "학업": "📚",
  "시험": "✍️",
  "여행": "✈️",
  "경제": "📈",
  "출장": "🧳",
  "구매": "🛍️",
  "예약": "📅",
  "정기 지출": "💰",
  "재무": "📊",
  "세금": "📝",
  "봉사": "🤲",
  "통화": "📞",
  "종교": "🙏",
  "치료": "🏥"
};

export default function PriorityPage() {
  const router = useRouter();
  const { 
    highPriorities, 
    lowPriorities, 
    setHighPriorities, 
    setLowPriorities 
  } = usePriorityStore();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [draggedCategory, setDraggedCategory] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dropZone, setDropZone] = useState<'high' | 'normal' | 'low' | null>(null);
  const [dropIndex, setDropIndex] = useState<number>(-1);
  const [dragStartPosition, setDragStartPosition] = useState({ x: 0, y: 0 });
  const [draggedItemRect, setDraggedItemRect] = useState<DOMRect | null>(null);

  // 드롭 존 참조
  const highZoneRef = useRef<HTMLDivElement>(null);
  const normalZoneRef = useRef<HTMLDivElement>(null);
  const lowZoneRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 보통 우선순위 카테고리 (높은/낮은 우선순위에 배치되지 않은 것들)
  const normalPriorities = useMemo(() => {
    const assignedCategories = [...highPriorities, ...lowPriorities].map(p => p.category);
    return CATEGORIES.filter(category => !assignedCategories.includes(category));
  }, [highPriorities, lowPriorities]);

  // 완료 상태 확인 (최소 높은 우선순위 1개, 낮은 우선순위 1개)
  const isComplete = highPriorities.length >= 1 && lowPriorities.length >= 1;

  // 터치/클릭으로 카테고리 이동
  const moveCategoryToHigh = (category: string, insertIndex?: number) => {
    // 기존 위치에서 제거
    const newLowPriorities = lowPriorities.filter(p => p.category !== category);
    setLowPriorities(newLowPriorities);
    
    // 높은 우선순위에 추가
    const newItem: Priority = { category, rank: 0 };
    let newHighPriorities = [...highPriorities.filter(p => p.category !== category)];
    
    // 삽입 위치가 지정된 경우
    if (insertIndex !== undefined && insertIndex >= 0) {
      newHighPriorities.splice(insertIndex, 0, newItem);
    } else {
      newHighPriorities.push(newItem);
    }
    
    // rank 재정렬
    const reorderedHighPriorities = newHighPriorities.map((item, index): Priority => ({ 
      ...item, 
      rank: index + 1 
    }));
    
    setHighPriorities(reorderedHighPriorities);
    setSelectedCategory(null);
  };

  const moveCategoryToLow = (category: string, insertIndex?: number) => {
    // 기존 위치에서 제거
    const newHighPriorities = highPriorities.filter(p => p.category !== category);
    setHighPriorities(newHighPriorities);
    
    // 낮은 우선순위에 추가
    const newItem: Priority = { category, rank: 0 };
    let newLowPriorities = [...lowPriorities.filter(p => p.category !== category)];
    
    // 삽입 위치가 지정된 경우
    if (insertIndex !== undefined && insertIndex >= 0) {
      newLowPriorities.splice(insertIndex, 0, newItem);
    } else {
      newLowPriorities.push(newItem);
    }
    
    // rank 재정렬
    const reorderedLowPriorities = newLowPriorities.map((item, index): Priority => ({ 
      ...item, 
      rank: index + 1 
    }));
    
    setLowPriorities(reorderedLowPriorities);
    setSelectedCategory(null);
  };

  const moveCategoryToNormal = (category: string) => {
    // 우선순위에서 제거
    const newHighPriorities = highPriorities.filter(p => p.category !== category);
    const newLowPriorities = lowPriorities.filter(p => p.category !== category);
    
    setHighPriorities(newHighPriorities);
    setLowPriorities(newLowPriorities);
    setSelectedCategory(null);
  };

  // 드롭 존 감지 함수
  const getDropZone = (x: number, y: number): 'high' | 'normal' | 'low' | null => {
    const zones = [
      { ref: highZoneRef, type: 'high' as const },
      { ref: normalZoneRef, type: 'normal' as const },
      { ref: lowZoneRef, type: 'low' as const }
    ];

    for (const zone of zones) {
      if (zone.ref.current) {
        const rect = zone.ref.current.getBoundingClientRect();
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
          return zone.type;
        }
      }
    }
    return null;
  };

  // 드롭 인덱스 계산 함수
  const getDropIndex = (x: number, y: number, zone: 'high' | 'low'): number => {
    const priorities = zone === 'high' ? highPriorities : lowPriorities;
    const zoneRef = zone === 'high' ? highZoneRef : lowZoneRef;
    
    if (!zoneRef.current) return -1;
    
    const categoryItems = zoneRef.current.querySelectorAll('[data-category]');
    
    for (let i = 0; i < categoryItems.length; i++) {
      const item = categoryItems[i] as HTMLElement;
      const rect = item.getBoundingClientRect();
      const itemMiddleY = rect.top + rect.height / 2;
      
      if (y < itemMiddleY) {
        return i;
      }
    }
    
    return priorities.length; // 마지막에 삽입
  };

  // 현재 카테고리가 어느 존에 있는지 확인
  const getCurrentZone = (category: string): 'high' | 'normal' | 'low' => {
    if (highPriorities.find(p => p.category === category)) return 'high';
    if (lowPriorities.find(p => p.category === category)) return 'low';
    return 'normal';
  };

  // 클릭된 위치에서 카테고리 찾기
  const getCategoryAtPosition = (x: number, y: number): string | null => {
    const element = document.elementFromPoint(x, y);
    if (element) {
      const categoryElement = element.closest('[data-category]');
      if (categoryElement) {
        return categoryElement.getAttribute('data-category');
      }
    }
    return null;
  };

  // 전역 드래그 제스처 설정
  const bind = useGesture(
    {
      onDrag: ({ down, movement: [mx, my], xy: [x, y], first, last }) => {
        console.log('Global drag:', { down, movement: [mx, my], xy: [x, y], first, last });
        
        if (first) {
          // 드래그 시작 위치에서 카테고리 찾기
          const category = getCategoryAtPosition(x, y);
          if (category) {
            console.log('🟢 Drag started for:', category);
            setDraggedCategory(category);
            setSelectedCategory(null);
            setDragStartPosition({ x, y });
            
            // 드래그되는 아이템의 원래 위치와 크기 저장
            const element = document.querySelector(`[data-category="${category}"]`);
            if (element) {
              setDraggedItemRect(element.getBoundingClientRect());
            }
          }
        }

        if (down && draggedCategory) {
          console.log('🔵 Dragging:', draggedCategory, 'movement:', [mx, my]);
          setDragOffset({ x: mx, y: my });
          const currentDropZone = getDropZone(x, y);
          setDropZone(currentDropZone);
          
          // 드롭 인덱스 계산 (높은/낮은 우선순위 영역에서만)
          if (currentDropZone === 'high' || currentDropZone === 'low') {
            const index = getDropIndex(x, y, currentDropZone);
            setDropIndex(index);
            console.log('Drop index:', index);
          } else {
            setDropIndex(-1);
          }
          
          console.log('Drop zone:', currentDropZone);
        }

        if (last && draggedCategory) {
          console.log('🔴 Drag ended for:', draggedCategory);
          const finalDropZone = getDropZone(x, y);
          console.log('Final drop zone:', finalDropZone, 'Current zone:', getCurrentZone(draggedCategory));
          
          if (finalDropZone && finalDropZone !== getCurrentZone(draggedCategory)) {
            console.log('Moving', draggedCategory, 'from', getCurrentZone(draggedCategory), 'to', finalDropZone);
            switch (finalDropZone) {
              case 'high':
                const highIndex = getDropIndex(x, y, 'high');
                moveCategoryToHigh(draggedCategory, highIndex);
                break;
              case 'low':
                const lowIndex = getDropIndex(x, y, 'low');
                moveCategoryToLow(draggedCategory, lowIndex);
                break;
              case 'normal':
                moveCategoryToNormal(draggedCategory);
                break;
            }
          } else if (finalDropZone === getCurrentZone(draggedCategory) && (finalDropZone === 'high' || finalDropZone === 'low')) {
            // 같은 존 내에서 순서 변경
            const index = getDropIndex(x, y, finalDropZone);
            if (finalDropZone === 'high') {
              moveCategoryToHigh(draggedCategory, index);
            } else {
              moveCategoryToLow(draggedCategory, index);
            }
          }

          // 드래그 상태 초기화
          setDraggedCategory(null);
          setDragOffset({ x: 0, y: 0 });
          setDropZone(null);
          setDropIndex(-1);
          setDragStartPosition({ x: 0, y: 0 });
          setDraggedItemRect(null);
        }
      },
    },
    {
      drag: {
        threshold: 5,
        preventScroll: false,
        filterTaps: true,
      }
    }
  );

  const handleSave = async () => {
    if (!isComplete) {
      alert('높은 우선순위와 낮은 우선순위를 각각 최소 1개씩 설정해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      localStorage.setItem('token', "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI2ODIwZTJkYzM5M2VmOTZmN2I1Y2Q1NTAiLCJpYXQiOjE3NDgxODc0OTgsImV4cCI6MTc0ODI3Mzg5OH0.DgHFK0G8HxelZwGpCHd8-cYq65uRIZ_SvWtgP4IxEay4c_iW2UkAkAQ8xkQtua75WKzsS5zvyEsAk03B2C-71g")
      const response = await priorityAPI.setPriorities(highPriorities, lowPriorities);
      if (response.status === 200) {
        const message = await response.data;
        console.log(message);
        router.push('/schedule');
      } else {
        throw new Error('API 요청 실패');
      }
    } catch (error) {
      console.error('Priority save error:', error);
      alert('우선순위 저장에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const getProgress = () => {
    const totalAssigned = highPriorities.length + lowPriorities.length;
    const minRequired = 6; // 최소 높은 1개 + 낮은 1개
    return Math.min((totalAssigned / minRequired) * 100, 100);
  };

  const getStatusMessage = () => {
    if (highPriorities.length === 0 && lowPriorities.length === 0) {
      return "카테고리를 높은 우선순위 또는 낮은 우선순위로 이동해보세요";
    } else if (highPriorities.length === 0) {
      return "높은 우선순위에 최소 1개 카테고리를 배치해주세요";
    } else if (lowPriorities.length === 0) {
      return "낮은 우선순위에 최소 1개 카테고리를 배치해주세요";
    } else {
      return "원하는 만큼 더 추가하거나 저장하고 계속하세요";
    }
  };

  // 드롭 미리보기 컴포넌트
  const DropPreview = ({ zone, index }: { zone: 'high' | 'low'; index: number }) => {
    if (dropZone !== zone || dropIndex !== index || !draggedCategory) return null;
    
    return (
      <div className={`
        h-1 rounded-full my-1 transition-all duration-200
        ${zone === 'high' ? 'bg-red-400' : 'bg-blue-400'}
        shadow-lg animate-pulse
      `} />
    );
  };

  // 카테고리 아이템 컴포넌트
  const CategoryItem = ({ 
    category, 
    priority, 
    type, 
    onClick 
  }: { 
    category: string; 
    priority?: Priority; 
    type: 'high' | 'normal' | 'low';
    onClick?: () => void;
  }) => {
    const isSelected = selectedCategory === category;
    const isBeingDragged = draggedCategory === category;
    
    return (
      <div
        data-category={category}
        onClick={() => {
          if (!isBeingDragged) {
            setDraggedCategory(null);
            setSelectedCategory(selectedCategory === category ? null : category);
          }
        }}
        className={`
          flex items-center justify-between p-3 sm:p-4 rounded-xl cursor-pointer 
          transition-all duration-300 ease-out touch-none select-none
          ${type === 'high' ? 'bg-gradient-to-r from-red-50 to-pink-50 border border-red-100 hover:shadow-md' : ''}
          ${type === 'low' ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 hover:shadow-md' : ''}
          ${type === 'normal' ? 'bg-white border border-gray-100 hover:shadow-md' : ''}
          ${isSelected 
            ? 'ring-2 ring-blue-400 shadow-lg bg-blue-50/50' 
            : 'hover:scale-[1.005]'
          }
          ${isBeingDragged ? 'opacity-30' : ''}
          active:scale-[0.98] touch-manipulation
        `}
        style={{
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          // 선택된 아이템이 잘리지 않도록 마진 조정
          
        }}
      >
        <div className="flex items-center space-x-3">
          {priority && (
            <div className={`
              w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold text-white
              ${type === 'high' ? 'bg-red-500' : 'bg-blue-500'}
            `}>
              {priority.rank}
            </div>
          )}
          <div className="text-xl sm:text-2xl">
            {CATEGORY_EMOJIS[category]}
          </div>
          <span className={`
            font-semibold text-sm sm:text-base transition-colors duration-200
            ${isSelected ? 'text-blue-700' : 'text-gray-800'}
          `}>
            {category}
          </span>
        </div>
        
        {/* 모바일용 이동 버튼 */}
        <div className="flex space-x-1 sm:hidden">
          {type !== 'high' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                moveCategoryToHigh(category);
              }}
              className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-xs
                         transition-all duration-200 hover:bg-red-600 active:scale-95"
            >
              ↑
            </button>
          )}
          {type !== 'normal' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                moveCategoryToNormal(category);
              }}
              className="w-8 h-8 bg-gray-500 text-white rounded-full flex items-center justify-center text-xs
                         transition-all duration-200 hover:bg-gray-600 active:scale-95"
            >
              ○
            </button>
          )}
          {type !== 'low' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                moveCategoryToLow(category);
              }}
              className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs
                         transition-all duration-200 hover:bg-blue-600 active:scale-95"
            >
              ↓
            </button>
          )}
        </div>

        {/* 데스크톱용 드래그 아이콘 */}
        <div className={`
          hidden sm:block transition-colors duration-200
          ${isSelected ? 'text-blue-500' : 'text-gray-400'}
        `}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </div>
      </div>
    );
  };

  // 드래그 중인 아이템을 포털로 렌더링
  const DraggedItemPortal = () => {
    if (!draggedCategory || !draggedItemRect) return null;

    const draggedPriority = [...highPriorities, ...lowPriorities].find(p => p.category === draggedCategory);
    const draggedType = getCurrentZone(draggedCategory);

    return createPortal(
      <div
        className="fixed pointer-events-none z-[9999]"
        style={{
          left: draggedItemRect.left + dragOffset.x,
          top: draggedItemRect.top + dragOffset.y,
          width: draggedItemRect.width,
          height: draggedItemRect.height,
        }}
      >
        <div
          className={`
            flex items-center justify-between p-3 sm:p-4 rounded-xl
            transition-all duration-200 ease-out touch-none select-none
            ${draggedType === 'high' ? 'bg-gradient-to-r from-red-50 to-pink-50 border border-red-100' : ''}
            ${draggedType === 'low' ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100' : ''}
            ${draggedType === 'normal' ? 'bg-white border border-gray-100' : ''}
            opacity-90 scale-105 shadow-2xl
          `}
          style={{
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
          }}
        >
          <div className="flex items-center space-x-3">
            {draggedPriority && (
              <div className={`
                w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold text-white
                ${draggedType === 'high' ? 'bg-red-500' : 'bg-blue-500'}
              `}>
                {draggedPriority.rank}
              </div>
            )}
            <div className="text-xl sm:text-2xl">
              {CATEGORY_EMOJIS[draggedCategory]}
            </div>
            <span className="font-semibold text-sm sm:text-base text-gray-800">
              {draggedCategory}
            </span>
          </div>
          
          {/* 데스크톱용 드래그 아이콘 */}
          <div className="hidden sm:block text-blue-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div 
      ref={containerRef}
      {...bind()}
      className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50"
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        touchAction: 'none',
      }}
    >
      {/* 드래그 중인 아이템 포털 */}
      <DraggedItemPortal />

      {/* 배경 장식 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 py-6 sm:py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* 헤더 */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              우선순위 설정
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
              모든 카테고리 중에서 <span className="font-bold text-blue-600">중요한 것들</span>과 
              <span className="font-bold text-indigo-600"> 덜 중요한 것들</span>을 자유롭게 선택해주세요
            </p>
            
            {/* 진행 상황 */}
            <div className="max-w-2xl mx-auto px-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">우선순위 배치</h2>
                <span className="text-xs sm:text-sm font-medium text-gray-600 bg-white/80 px-2 sm:px-3 py-1 rounded-full">
                  {highPriorities.length + lowPriorities.length}/{CATEGORIES.length} 배치됨
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 mb-4 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 sm:h-3 rounded-full 
                           transition-all duration-300 ease-out"
                  style={{ 
                    width: `${getProgress()}%`,
                  }}
                ></div>
              </div>
              <p className="text-sm sm:text-base text-gray-600 text-center">
                {getStatusMessage()}
              </p>
            </div>
          </div>

          {/* 우선순위 배치 영역 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8 mb-8 sm:mb-12">
            {/* 높은 우선순위 */}
            <div 
              ref={highZoneRef}
              className={`backdrop-blur-sm bg-white/70 rounded-2xl sm:rounded-3xl shadow-xl border border-white/20 p-6 sm:p-8
                         transition-all duration-200 ${dropZone === 'high' ? 'ring-4 ring-red-300 bg-red-50/50' : ''}`}
            >
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                  <span>높은 우선순위</span>
                </div>
                <span className={`text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full ${
                  highPriorities.length >= 1 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {highPriorities.length}개
                </span>
              </h3>
              <div className="min-h-[200px] sm:min-h-[300px] space-y-2 sm:space-y-3 -mx-6 px-6">
                <DropPreview zone="high" index={0} />
                {highPriorities.map((priority, index) => (
                  <div key={priority.category}>
                    <CategoryItem
                      category={priority.category}
                      priority={priority}
                      type="high"
                      onClick={() => setSelectedCategory(selectedCategory === priority.category ? null : priority.category)}
                    />
                    <DropPreview zone="high" index={index + 1} />
                  </div>
                ))}
                <div className="border-2 border-dashed border-red-200 rounded-xl p-4 sm:p-8 text-center text-gray-400 mx-6">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <p className="font-medium text-sm sm:text-base">중요한 카테고리를</p>
                  <p className="text-xs sm:text-sm">여기로 드래그하세요(최소 1개)</p>
                </div>
              </div>
            </div>

            {/* 보통 우선순위 (모든 카테고리 시작점) */}
            <div 
              ref={normalZoneRef}
              className={`backdrop-blur-sm bg-white/70 rounded-2xl sm:rounded-3xl shadow-xl border border-white/20 p-6 sm:p-8
                         transition-all duration-200 ${dropZone === 'normal' ? 'ring-4 ring-gray-300 bg-gray-50/50' : ''}`}
            >
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-gray-500 rounded-full"></span>
                  <span>보통 우선순위</span>
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-600 bg-gray-100 px-2 sm:px-3 py-1 rounded-full">
                  {normalPriorities.length}개
                </span>
              </h3>
              <div className="min-h-[200px] sm:min-h-[300px] space-y-2 sm:space-y-3 overflow-y-auto -mx-6 px-6">
                {normalPriorities.map((category) => (
                  <CategoryItem
                    key={category}
                    category={category}
                    type="normal"
                    onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                  />
                ))}
                {normalPriorities.length === 0 && (
                  <div className="flex items-center justify-center h-[200px] sm:h-[300px] text-gray-400 mx-6">
                    <div className="text-center">
                      <svg className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="font-medium text-sm sm:text-base">모든 카테고리가</p>
                      <p className="text-xs sm:text-sm">우선순위에 배치되었습니다</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 낮은 우선순위 */}
            <div 
              ref={lowZoneRef}
              className={`backdrop-blur-sm bg-white/70 rounded-2xl sm:rounded-3xl shadow-xl border border-white/20 p-6 sm:p-8
                         transition-all duration-200 ${dropZone === 'low' ? 'ring-4 ring-blue-300 bg-blue-50/50' : ''}`}
            >
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                  <span>낮은 우선순위</span>
                </div>
                <span className={`text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full ${
                  lowPriorities.length >= 1 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {lowPriorities.length}개
                </span>
              </h3>
              <div className="min-h-[200px] sm:min-h-[300px] space-y-2 sm:space-y-3 -mx-6 px-6">
                <DropPreview zone="low" index={0} />
                {lowPriorities.map((priority, index) => (
                  <div key={priority.category}>
                    <CategoryItem
                      category={priority.category}
                      priority={priority}
                      type="low"
                      onClick={() => setSelectedCategory(selectedCategory === priority.category ? null : priority.category)}
                    />
                    <DropPreview zone="low" index={index + 1} />
                  </div>
                ))}
                <div className="border-2 border-dashed border-blue-200 rounded-xl p-4 sm:p-8 text-center text-gray-400 mx-6">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <p className="font-medium text-sm sm:text-base">덜 중요한 카테고리를</p>
                  <p className="text-xs sm:text-sm">여기로 드래그하세요(최소 1개)</p>
                </div>
              </div>
            </div>
          </div>

          {/* 선택된 카테고리 이동 버튼 (데스크톱) */}
          {selectedCategory && (
            <div className="hidden sm:block text-center mb-8">
              <div className="inline-flex items-center space-x-4 bg-white/90 px-6 py-4 rounded-2xl shadow-lg">
                <span className="font-semibold text-gray-800">
                  "{selectedCategory}" 이동:
                </span>
                <div className="flex space-x-2">
                  {!highPriorities.find(p => p.category === selectedCategory) && (
                    <button
                      onClick={() => moveCategoryToHigh(selectedCategory)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      높은 우선순위로
                    </button>
                  )}
                  {(highPriorities.find(p => p.category === selectedCategory) || lowPriorities.find(p => p.category === selectedCategory)) && (
                    <button
                      onClick={() => moveCategoryToNormal(selectedCategory)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      보통 우선순위로
                    </button>
                  )}
                  {!lowPriorities.find(p => p.category === selectedCategory) && (
                    <button
                      onClick={() => moveCategoryToLow(selectedCategory)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      낮은 우선순위로
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 완료 메시지 */}
          {isComplete && (
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center space-x-3 bg-green-50 text-green-700 px-4 sm:px-8 py-3 sm:py-4 rounded-2xl
                             border border-green-200/50">
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-bold text-base sm:text-lg">우선순위 설정이 완료되었습니다!</span>
              </div>
            </div>
          )}

          {/* 도움말 */}
          <div className="text-center mb-6 sm:mb-8">
            <p className="text-sm text-gray-500 mt-3 px-4">
              원하는 만큼 자유롭게 배치하세요.<br/> 각 영역에 최소 1개씩만 있으면 됩니다.
            </p>
          </div>

          {/* 저장 버튼 */}
          <div className="text-center px-4">
            <Button 
              onClick={handleSave}
              disabled={!isComplete || isLoading}
              className={`w-full  px-8 sm:px-12 py-3 sm:py-4 rounded-2xl w-100 font-bold text-base sm:text-lg 
                         transition-all duration-200 ease-out
                         ${isComplete && !isLoading
                           ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-101'
                           : 'bg-gray-300 cursor-not-allowed text-gray-600 shadow-md'
                         }
                         active:scale-98`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>저장 중...</span>
                </div>
              ) : isComplete ? (
                <span className="flex items-center justify-center space-x-2">
                  <span>완료</span>
                </span>
              ) : (
                `높은 우선순위 ${highPriorities.length}개, 낮은 우선순위 ${lowPriorities.length}개`
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 