import { useForm, Controller } from 'react-hook-form';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Schedule, CATEGORIES } from '@/types';
import { useState, useMemo } from 'react';

interface ScheduleFormProps {
  onSubmit: (data: Omit<Schedule, 'id' | 'status'>) => void;
  isLoading?: boolean;
  existingSchedules?: Schedule[]; // 색상 스케일링을 위한 기존 일정들
}

export const ScheduleForm = ({ onSubmit, isLoading = false, existingSchedules = [] }: ScheduleFormProps) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<Omit<Schedule, 'id' | 'status'>>({
    defaultValues: {
      priority: 5.0
    }
  });

  const watchedPriority = watch('priority', 5.0);

  // Priority 통계 계산 (MinMax 스케일러용)
  const priorityStats = useMemo(() => {
    if (existingSchedules.length === 0) return { min: 1, max: 10, range: 9 };
    
    const priorities = existingSchedules.map(s => s.priority);
    const min = Math.min(...priorities, 1);
    const max = Math.max(...priorities, 10);
    const range = max - min || 1;
    
    return { min, max, range };
  }, [existingSchedules]);

  // HSL 색상을 RGB로 변환
  const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360;
    s /= 100;
    l /= 100;
    
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    const r = Math.round(hue2rgb(p, q, h + 1/3) * 255);
    const g = Math.round(hue2rgb(p, q, h) * 255);
    const b = Math.round(hue2rgb(p, q, h - 1/3) * 255);
    
    return { r, g, b };
  };

  // 고급 priority 색상 시스템
  const getPriorityColor = (priority: number) => {
    const range = priorityStats.max - priorityStats.min || 1;
    const normalized = (priority - priorityStats.min) / range;
    const integerPart = Math.floor(priority);
    const decimalPart = priority - integerPart;
    
    // 기본 색상 구간 정의
    let baseHue, baseSaturation;
    
    if (normalized >= 0.7) {
      // 높은 우선순위: 빨간색 계열 (0-20도)
      baseHue = 0 + (20 * decimalPart);
      baseSaturation = 75 + (20 * decimalPart); // 75-95%
    } else if (normalized >= 0.4) {
      // 중간 우선순위: 주황색 계열 (20-60도)
      baseHue = 20 + (40 * decimalPart);
      baseSaturation = 70 + (15 * decimalPart); // 70-85%
    } else {
      // 낮은 우선순위: 파란색 계열 (200-240도)
      baseHue = 200 + (40 * decimalPart);
      baseSaturation = 60 + (20 * decimalPart); // 60-80%
    }
    
    // 소수점에 따른 명도 조절 (더 높은 소수점 = 더 진한 색)
    const lightness = normalized >= 0.7 ? 
      50 - (15 * decimalPart) : // 높은 우선순위: 35-50%
      normalized >= 0.4 ? 
        55 - (10 * decimalPart) : // 중간: 45-55%
        65 - (10 * decimalPart);   // 낮은: 55-65%
    
    const rgb = hslToRgb(baseHue, baseSaturation, lightness);
    
    return {
      background: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      text: lightness < 50 ? 'white' : 'black',
      border: `rgb(${Math.max(0, rgb.r - 30)}, ${Math.max(0, rgb.g - 30)}, ${Math.max(0, rgb.b - 30)})`,
      glow: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.3 + (0.4 * decimalPart)})`,
      intensity: decimalPart,
      normalized
    };
  };

  const getPriorityText = (priority: number) => {
    const range = priorityStats.max - priorityStats.min || 1;
    const normalized = (priority - priorityStats.min) / range;
    const decimalPart = priority - Math.floor(priority);
    
    if (normalized >= 0.7) {
      return decimalPart >= 0.7 ? '최우선' : decimalPart >= 0.3 ? '긴급' : '높음';
    }
    if (normalized >= 0.4) {
      return decimalPart >= 0.7 ? '중요' : decimalPart >= 0.3 ? '보통+' : '보통';
    }
    return decimalPart >= 0.7 ? '여유' : decimalPart >= 0.3 ? '낮음+' : '낮음';
  };

  const getPriorityIcon = (priority: number) => {
    const range = priorityStats.max - priorityStats.min || 1;
    const normalized = (priority - priorityStats.min) / range;
    const decimalPart = priority - Math.floor(priority);
    const strokeWidth = 2 + decimalPart;

    if (normalized >= 0.7) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      );
    } else if (normalized >= 0.4) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    } else {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      );
    }
  };

  // 카테고리 색상
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      '가사': '#8b5cf6',
      '취미': '#ec4899',
      '자기개발': '#06b6d4',
      '건강': '#10b981',
      '애인': '#f43f5e',
      '가족': '#8b5cf6',
      '고정비': '#6366f1',
      '친목': '#0ea5e9',
      '업무': '#3b82f6',
      '구입': '#d946ef',
      '학교': '#4f46e5',
      '자동차 정비': '#f97316',
      '시험': '#ef4444',
      '여행': '#10b981',
      '경제': '#84cc16',
    };
    
    const defaultColors = [
      '#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f97316', 
      '#6366f1', '#0ea5e9', '#f59e0b', '#14b8a6', '#ef4444'
    ];
    
    return colors[category] || defaultColors[Math.abs(category.length) % defaultColors.length];
  };

  const onSubmitForm = (data: Omit<Schedule, 'id' | 'status'>) => {
    onSubmit({
      ...data,
      categories: selectedCategories,
      priority: Number(data.priority)
    });
    reset();
    setSelectedCategories([]);
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const removeCategory = (category: string) => {
    setSelectedCategories(prev => prev.filter(c => c !== category));
  };

  const currentPriorityColors = getPriorityColor(watchedPriority || 5.0);

  return (
    <div className="space-y-6">
      {/* Priority 미리보기 패널 */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-800">우선순위 미리보기</h3>
          <div className="text-xs text-gray-500">
            범위: {priorityStats.min.toFixed(1)} ~ {priorityStats.max.toFixed(1)}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div 
            className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2"
            style={{
              backgroundColor: currentPriorityColors.background,
              color: currentPriorityColors.text,
              borderColor: currentPriorityColors.border,
              borderWidth: `${1 + currentPriorityColors.intensity}px`,
              boxShadow: `0 0 ${4 + (8 * currentPriorityColors.intensity)}px ${currentPriorityColors.glow}`,
              transform: `scale(${1 + (0.05 * currentPriorityColors.intensity)})`,
            }}
          >
            {getPriorityIcon(watchedPriority || 5.0)}
            <span>{getPriorityText(watchedPriority || 5.0)}</span>
            <span className="text-xs opacity-75">({(watchedPriority || 5.0).toFixed(1)})</span>
          </div>
          
          <div className="text-xs text-gray-600 space-y-1">
            <div>정규화: {((watchedPriority - priorityStats.min) / priorityStats.range).toFixed(3)}</div>
            <div>소수점: {((watchedPriority || 5.0) % 1).toFixed(3)}</div>
          </div>
        </div>
        
        <div className="mt-3 text-xs text-gray-500 italic">
          💡 소수점이 높을수록 더 진한 색상과 강한 효과가 적용됩니다
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
        <Input
          label="제목"
          {...register('title', { required: '제목을 입력해주세요' })}
          error={errors.title?.message}
        />
        
        <Input
          label="시작 날짜 및 시간"
          type="datetime-local"
          {...register('startDate', { required: '시작 날짜와 시간을 선택해주세요' })}
          error={errors.startDate?.message}
        />
        
        <Input
          label="종료 날짜 및 시간"
          type="datetime-local"
          {...register('endDate', { required: '종료 날짜와 시간을 선택해주세요' })}
          error={errors.endDate?.message}
        />
        
        {/* 멀티셀렉트 카테고리 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            카테고리 선택
          </label>
          
          {/* 선택된 카테고리 태그들 */}
          {selectedCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3 p-3 bg-gray-50 rounded-lg border">
              {selectedCategories.map((category) => (
                <span
                  key={category}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full transition-all hover:scale-105"
                  style={{
                    backgroundColor: getCategoryColor(category) + '20',
                    color: getCategoryColor(category),
                    borderColor: getCategoryColor(category) + '40',
                    borderWidth: '1px'
                  }}
                >
                  {category}
                  <button
                    type="button"
                    onClick={() => removeCategory(category)}
                    className="hover:bg-black/10 rounded-full p-0.5 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
          
          {/* 카테고리 선택 그리드 */}
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-lg p-2 bg-white">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => toggleCategory(category)}
                className={`p-2 text-xs rounded-md border transition-all duration-200 text-left hover:scale-105 ${
                  selectedCategories.includes(category)
                    ? 'text-white border-2 shadow-md'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
                style={selectedCategories.includes(category) ? {
                  backgroundColor: getCategoryColor(category),
                  borderColor: getCategoryColor(category)
                } : {}}
              >
                {category}
              </button>
            ))}
          </div>
          
          {selectedCategories.length === 0 && (
            <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              최소 하나의 카테고리를 선택해주세요
            </p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            우선순위 (1-10, 소수점 가능)
          </label>
          <Input
            type="number"
            min="1"
            max="10"
            step="0.1"
            {...register('priority', { 
              required: '우선순위를 입력해주세요',
              min: { value: 1, message: '우선순위는 1 이상이어야 합니다' },
              max: { value: 10, message: '우선순위는 10 이하여야 합니다' },
              valueAsNumber: true
            })}
            error={errors.priority?.message}
            placeholder="예: 7.3 (소수점으로 세밀한 조절 가능)"
          />
          <div className="mt-2 text-xs text-gray-500 space-y-1">
            <div>• <strong>정수 부분</strong>: 기본 우선순위 레벨 결정</div>
            <div>• <strong>소수점 부분</strong>: 같은 레벨 내에서 세밀한 강도 조절</div>
            <div>• 소수점이 높을수록 더 진한 색상과 강한 시각적 효과</div>
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading || selectedCategories.length === 0}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              일정 추가 중...
            </div>
          ) : (
            '일정 추가'
          )}
        </Button>
      </form>
    </div>
  );
}; 