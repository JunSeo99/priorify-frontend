'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/common/Button';
import { CATEGORIES, Priority } from '@/types';
import { priorityAPI } from '@/lib/api';
import { usePriorityStore } from '@/store/priority';
import { PriorityList } from '@/components/priority/PriorityList';

const CATEGORY_EMOJIS: Record<string, string> = {
  "가사": "🏠",
  "취미": "🎨",
  "자기개발": "📚",
  "건강": "💪",
  "애인": "❤️",
  "가족": "👨‍👩‍👧‍👦",
  "고정비": "💰",
  "친목": "🤝",
  "업무": "💼",
  "구입": "🛍️",
  "학교": "🎓",
  "자동차 정비": "🚗",
  "시험": "✍️",
  "여행": "✈️",
  "경제": "📈"
};

export default function PriorityPage() {
  const router = useRouter();
  const { 
    highPriorities, 
    lowPriorities, 
    setHighPriorities, 
    setLowPriorities 
  } = usePriorityStore();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // 사용 가능한 카테고리 계산
  const availableCategories = useMemo(() => {
    const selectedCategories = [...highPriorities, ...lowPriorities].map(p => p.category);
    return CATEGORIES.filter(category => !selectedCategories.includes(category));
  }, [highPriorities, lowPriorities]);

  // 현재 선택 단계 계산
  const currentStep = useMemo(() => {
    if (highPriorities.length < 3) return 'high';
    if (lowPriorities.length < 3) return 'low';
    return 'complete';
  }, [highPriorities.length, lowPriorities.length]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handlePriorityAssign = () => {
    if (!selectedCategory) return;

    if (currentStep === 'high') {
      setHighPriorities([...highPriorities, { 
        category: selectedCategory, 
        rank: highPriorities.length + 1 
      }]);
    } else if (currentStep === 'low') {
      setLowPriorities([...lowPriorities, { 
        category: selectedCategory, 
        rank: lowPriorities.length + 1 
      }]);
    }
    setSelectedCategory(null);
  };

  const handleSave = async () => {
    if (currentStep !== 'complete') {
      alert('상위 우선순위 3개와 하위 우선순위 3개를 모두 선택해주세요.');
      return;
    }

    try {
      await Promise.all([
        priorityAPI.setHighPriorities(highPriorities),
        priorityAPI.setLowPriorities(lowPriorities)
      ]);

      router.push('/schedule');
    } catch (error) {
      console.error('Priority save error:', error);
      alert('우선순위 저장에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-slate-800">
          우선순위 설정
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">
              {currentStep === 'high' ? '상위 우선순위 선택' : 
               currentStep === 'low' ? '하위 우선순위 선택' : 
               '우선순위 설정 완료'}
            </h2>
            <div className="text-sm font-medium text-slate-600">
              {currentStep === 'high' && `${highPriorities.length}/3 선택됨`}
              {currentStep === 'low' && `${lowPriorities.length}/3 선택됨`}
            </div>
          </div>

          {currentStep !== 'complete' && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {availableCategories.map((category) => (
                  <div
                    key={category}
                    className={`p-4 rounded-lg text-center cursor-pointer
                              transition-all duration-200 hover:shadow-sm
                              border ${
                                selectedCategory === category 
                                ? 'bg-blue-100 border-blue-400' 
                                : 'bg-slate-100 border-slate-200 hover:bg-slate-200'
                              }`}
                    onClick={() => handleCategorySelect(category)}
                  >
                    <div className="text-2xl mb-2">{CATEGORY_EMOJIS[category]}</div>
                    <span className="font-semibold text-slate-700">{category}</span>
                  </div>
                ))}
              </div>

              {selectedCategory && (
                <div className="mt-8 flex justify-center">
                  <Button
                    onClick={handlePriorityAssign}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold
                             transition-all duration-200 hover:bg-blue-700"
                  >
                    {currentStep === 'high' ? '상위' : '하위'} 우선순위로 지정
                    {currentStep === 'high' 
                      ? ` (${highPriorities.length + 1}/3)` 
                      : ` (${lowPriorities.length + 1}/3)`}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4 text-slate-800">
              상위 우선순위 {highPriorities.length}/3
            </h3>
            <PriorityList
              priorities={highPriorities}
              type="high"
            />
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4 text-slate-800">
              하위 우선순위 {lowPriorities.length}/3
            </h3>
            <PriorityList
              priorities={lowPriorities}
              type="low"
            />
          </div>
        </div>

        <div className="text-center">
          <Button 
            onClick={handleSave}
            className={`px-8 py-3 rounded-lg font-bold transition-all duration-200
                      ${currentStep === 'complete'
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                        : 'bg-gray-300 cursor-not-allowed text-gray-600'}`}
            disabled={currentStep !== 'complete'}
          >
            {currentStep === 'complete' 
              ? '저장하고 계속하기' 
              : '모든 우선순위를 선택해주세요'}
          </Button>
        </div>
      </div>
    </div>
  );
} 