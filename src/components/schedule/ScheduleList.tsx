import { format } from 'date-fns';
import { Schedule } from '@/types';
import { useMemo } from 'react';

interface ScheduleListProps {
  schedules: Schedule[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

export const ScheduleList = ({
  schedules,
  onToggleComplete,
  onDelete,
  isUpdating = false,
  isDeleting = false,
}: ScheduleListProps) => {
  // MinMax 스케일러를 위한 priority 통계 계산
  const priorityStats = useMemo(() => {
    if (schedules.length === 0) return { min: 1, max: 10, range: 9 };
    
    const priorities = schedules.map(s => s.priority);
    const min = Math.min(...priorities);
    const max = Math.max(...priorities);
    const range = max - min || 1; // 0으로 나누기 방지
    
    return { min, max, range };
  }, [schedules]);

  // Priority 정규화 함수 (0-1 범위)
  const normalizePriority = (priority: number) => {
    return (priority - priorityStats.min) / priorityStats.range;
  };

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
    const normalized = normalizePriority(priority);
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
      intensity: decimalPart
    };
  };

  const getPriorityStyles = (priority: number) => {
    const colors = getPriorityColor(priority);
    const normalized = normalizePriority(priority);
    const decimalPart = priority - Math.floor(priority);
    
    // 글로우 효과 강도
    const glowIntensity = decimalPart > 0.5 ? 'drop-shadow-lg' : 'drop-shadow-md';
    
    return {
      badge: '', // 커스텀 스타일로 대체
      customStyle: {
        backgroundColor: colors.background,
        color: colors.text,
        borderColor: colors.border,
        borderWidth: `${1 + decimalPart}px`,
        boxShadow: `0 0 ${4 + (8 * decimalPart)}px ${colors.glow}`,
        transform: `scale(${1 + (0.1 * decimalPart)})`,
        fontWeight: decimalPart > 0.7 ? '800' : decimalPart > 0.4 ? '700' : '600'
      },
      icon: normalized >= 0.7 ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2 + decimalPart} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      ) : normalized >= 0.4 ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2 + decimalPart} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2 + decimalPart} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      ),
    };
  };

  const getPriorityText = (priority: number) => {
    const normalized = normalizePriority(priority);
    const decimalPart = priority - Math.floor(priority);
    
    if (normalized >= 0.7) {
      return decimalPart >= 0.7 ? '최우선' : decimalPart >= 0.3 ? '긴급' : '높음';
    }
    if (normalized >= 0.4) {
      return decimalPart >= 0.7 ? '중요' : decimalPart >= 0.3 ? '보통+' : '보통';
    }
    return decimalPart >= 0.7 ? '여유' : decimalPart >= 0.3 ? '낮음+' : '낮음';
  };

  const getCategoryColors = (categories: string[]) => {
    const colors = [
      'bg-purple-100 text-purple-800',
      'bg-pink-100 text-pink-800', 
      'bg-cyan-100 text-cyan-800',
      'bg-emerald-100 text-emerald-800',
      'bg-rose-100 text-rose-800',
      'bg-indigo-100 text-indigo-800',
      'bg-sky-100 text-sky-800',
      'bg-orange-100 text-orange-800'
    ];
    
    return categories.map((_, index) => colors[index % colors.length]);
  };

  if (schedules.length === 0) {
    return (
      <div className="py-12 flex flex-col items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-gray-300 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p className="text-gray-500 text-sm mb-2">일정이 없습니다</p>
        <p className="text-gray-400 text-xs">새 일정을 추가해보세요</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {/* Priority 범례 */}
      <div className="pb-4 mb-4 border-b border-gray-100">
        <div className="text-xs text-gray-500 mb-2">
          우선순위 범위: {priorityStats.min.toFixed(1)} ~ {priorityStats.max.toFixed(1)}
          <span className="ml-2 italic">소수점이 높을수록 더 진한 색상과 강한 효과</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {[...new Set(schedules.map(s => Math.floor(normalizePriority(s.priority) * 10) / 10))]
            .sort((a, b) => b - a)
            .slice(0, 5)
            .map(normalizedValue => {
              const samplePriority = priorityStats.min + (normalizedValue * priorityStats.range);
              const colors = getPriorityColor(samplePriority);
              return (
                <div 
                  key={normalizedValue}
                  className="px-2 py-1 rounded text-xs font-medium transition-all"
                  style={{
                    backgroundColor: colors.background,
                    color: colors.text,
                    boxShadow: `0 0 4px ${colors.glow}`
                  }}
                >
                  {samplePriority.toFixed(1)}
                </div>
              );
            })
          }
        </div>
      </div>

      {schedules.map((schedule) => {
        const priorityStyles = getPriorityStyles(schedule.priority);
        const isCompleted = schedule.status === 'completed';
        const categoryColors = getCategoryColors(schedule.categories);
        
        return (
          <div
            key={schedule.id}
            className={`py-4 px-1 transition-all duration-200 ${isCompleted ? 'bg-gray-50 opacity-75' : ''}`}
          >
            <div className="flex items-start">
              {/* 체크박스 */}
              <div className="mr-3 mt-1">
                <button
                  onClick={() => onToggleComplete(schedule.id)}
                  disabled={isUpdating}
                  className={`w-5 h-5 rounded border transition-all ${
                    isCompleted 
                      ? 'bg-blue-500 border-blue-500' 
                      : 'border-gray-300 hover:border-blue-400'
                  } flex items-center justify-center disabled:opacity-50`}
                >
                  {isCompleted && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              </div>
              
              {/* 내용 */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <h3 className={`text-base font-medium transition-all ${
                    isCompleted ? 'line-through text-gray-500' : 'text-gray-900'
                  }`}>
                    {schedule.title}
                  </h3>
                  
                  {/* 고급 우선순위 배지 */}
                  <span 
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium transition-all duration-300 hover:scale-105"
                    style={priorityStyles.customStyle}
                  >
                    {priorityStyles.icon && (
                      <span className="mr-1">{priorityStyles.icon}</span>
                    )}
                    {getPriorityText(schedule.priority)}
                    <span className="ml-1 opacity-75 text-xs">
                      {schedule.priority.toFixed(1)}
                    </span>
                  </span>
                  
                  {/* 카테고리들 */}
                  <div className="flex flex-wrap gap-1">
                    {schedule.categories.map((category, index) => (
                      <span 
                        key={category}
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium transition-all hover:scale-105 ${categoryColors[index]}`}
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {schedule.startDate} ~ {schedule.endDate}
                  </div>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium transition-all ${
                      isCompleted ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {isCompleted ? '완료됨' : '진행중'}
                    </span>
                  </div>
                  <div className="flex items-center text-xs">
                    <span className="text-gray-400">
                      정규화: {normalizePriority(schedule.priority).toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => onToggleComplete(schedule.id)}
                    disabled={isUpdating}
                    className={`px-2 py-1 text-xs rounded-md transition-all disabled:opacity-50 hover:scale-105 ${
                      isCompleted
                        ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                        : 'text-green-600 bg-green-50 hover:bg-green-100'
                    }`}
                  >
                    {isUpdating ? (
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin"></div>
                        처리중...
                      </div>
                    ) : (
                      isCompleted ? '완료 취소' : '완료 처리'
                    )}
                  </button>
                  <button
                    onClick={() => onDelete(schedule.id)}
                    disabled={isDeleting}
                    className="px-2 py-1 text-xs rounded-md text-red-600 bg-red-50 hover:bg-red-100 transition-all disabled:opacity-50 hover:scale-105"
                  >
                    {isDeleting ? (
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin"></div>
                        삭제중...
                      </div>
                    ) : (
                      '삭제'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}; 