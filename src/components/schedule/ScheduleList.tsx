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

const priorityStats = useMemo(() => {
    if (schedules.length === 0) return { min: 1, max: 10, range: 9 };
    
    const priorities = schedules.map(s => s.priority);
    const min = Math.min(...priorities);
    const max = Math.max(...priorities);
    const range = max - min || 1; // 0으로 나누기 방지
    
    return { min, max, range };
  }, [schedules]);

  const normalizePriority = (priority: number) => {
    return (priority - priorityStats.min) / priorityStats.range;
  };

  const getPriorityColor = (priority: number) => {
    const normalized = normalizePriority(priority);
    
    if (normalized >= 0.7) {
      // 높은 우선순위: 모던한 빨간색
      return {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
        dot: 'bg-red-500'
      };
    } else if (normalized >= 0.4) {
      // 중간 우선순위: 모던한 주황색
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        dot: 'bg-amber-500'
      };
    } else {
      // 낮은 우선순위: 모던한 파란색
      return {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        dot: 'bg-blue-500'
      };
    }
  };

  const getPriorityText = (priority: number) => {
    const normalized = normalizePriority(priority);
    
    if (normalized >= 0.7) {
      return '높음';
    } else if (normalized >= 0.4) {
      return '보통';
    } else {
      return '낮음';
    }
  };

  const getPriorityIcon = (priority: number) => {
    const normalized = normalizePriority(priority);
    
    if (normalized >= 0.7) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      );
    } else if (normalized >= 0.4) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
        </svg>
      );
    } else {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      );
    }
  };

  const getCategoryColors = (categories: string[]) => {
    const colors = [
      'bg-purple-50 text-purple-700 border-purple-200',
      'bg-pink-50 text-pink-700 border-pink-200', 
      'bg-cyan-50 text-cyan-700 border-cyan-200',
      'bg-emerald-50 text-emerald-700 border-emerald-200',
      'bg-rose-50 text-rose-700 border-rose-200',
      'bg-indigo-50 text-indigo-700 border-indigo-200',
      'bg-sky-50 text-sky-700 border-sky-200',
      'bg-orange-50 text-orange-700 border-orange-200'
    ];
    
    return categories.map((_, index) => colors[index % colors.length]);
  };

  if (schedules.length === 0) {
    return (
      <div className="py-16 flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <p className="text-gray-600 font-medium mb-1">일정이 없습니다</p>
        <p className="text-gray-500 text-sm">새 일정을 추가해보세요</p>
      </div>
    );
  }

  // 우선순위가 높은 순으로 정렬 (높은 priority 값이 먼저)
  const sortedSchedules = useMemo(() => {
    return [...schedules].sort((a, b) => {
      // 먼저 완료 상태로 분류 (미완료가 먼저)
      if (a.status !== b.status) {
        if (a.status === 'completed') return 1;
        if (b.status === 'completed') return -1;
      }
      // 같은 완료 상태 내에서 우선순위로 정렬 (높은 값이 먼저)
      return b.priority - a.priority;
    });
  }, [schedules]);

  return (
    <div className="space-y-1">
      {sortedSchedules.map((schedule, index) => {
        const priorityColors = getPriorityColor(schedule.priority);
        const isCompleted = schedule.status === 'completed';
        const categoryColors = getCategoryColors(schedule.categories);
        
        return (
          <div
            key={schedule.id}
            className={`group flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors duration-200 border-l-4 ${
              isCompleted 
                ? 'opacity-60 border-l-gray-300' 
                : `border-l-transparent hover:${priorityColors.border.replace('border-', 'border-l-')}`
            }`}
          >
            {/* 체크박스 */}
            <button
              onClick={() => onToggleComplete(schedule.id)}
              disabled={isUpdating}
              className={`flex-shrink-0 w-5 h-5 rounded border-2 transition-all duration-200 ${
                isCompleted 
                  ? 'bg-green-500 border-green-500' 
                  : 'border-gray-300 hover:border-gray-400'
              } flex items-center justify-center disabled:opacity-50`}
            >
              {isCompleted && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>

            {/* 우선순위 표시 */}
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${priorityColors.dot}`}></div>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border ${priorityColors.bg} ${priorityColors.text} ${priorityColors.border}`}>
                {getPriorityIcon(schedule.priority)}
                {getPriorityText(schedule.priority)}
              </span>
            </div>

            {/* 메인 콘텐츠 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h3 className={`font-medium transition-all duration-200 ${
                  isCompleted ? 'line-through text-gray-500' : 'text-gray-900'
                }`}>
                  {schedule.title}
                </h3>
                
                {/* 카테고리 태그 */}
                <div className="flex gap-1">
                  {schedule.categories.slice(0, 2).map((category, index) => (
                    <span 
                      key={category}
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${categoryColors[index]}`}
                    >
                      {category}
                    </span>
                  ))}
                  {schedule.categories.length > 2 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
                      +{schedule.categories.length - 2}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{schedule.startDate} ~ {schedule.endDate}</span>
                </div>
                
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  isCompleted 
                    ? 'bg-green-50 text-green-700' 
                    : 'bg-blue-50 text-blue-700'
                }`}>
                  {isCompleted ? '완료됨' : '진행중'}
                </span>
                
                <span className="text-xs text-gray-400">
                  우선순위: {schedule.priority.toFixed(1)}
                </span>
              </div>
            </div>

            {/* 액션 버튼 */}
            <div className="flex-shrink-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={() => onToggleComplete(schedule.id)}
                disabled={isUpdating}
                className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded transition-colors duration-200 disabled:opacity-50 ${
                  isCompleted
                    ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                    : 'text-green-600 bg-green-50 hover:bg-green-100'
                }`}
              >
                {isUpdating ? (
                  <>
                    <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin"></div>
                    처리중
                  </>
                ) : (
                  <>
                    {isCompleted ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {isCompleted ? '취소' : '완료'}
                  </>
                )}
              </button>
              
              <button
                onClick={() => onDelete(schedule.id)}
                disabled={isDeleting}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded text-red-600 bg-red-50 hover:bg-red-100 transition-colors duration-200 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin"></div>
                    삭제중
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    삭제
                  </>
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}; 