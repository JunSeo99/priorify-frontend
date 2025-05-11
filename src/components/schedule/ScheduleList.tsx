import { format } from 'date-fns';
import { Schedule } from '@/types';
import { Button } from '../common/Button';

interface ScheduleListProps {
  schedules: Schedule[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ScheduleList = ({
  schedules,
  onToggleComplete,
  onDelete,
}: ScheduleListProps) => {
  const getImportanceStyles = (importance: string) => {
    switch (importance) {
      case 'HIGH':
        return {
          badge: 'bg-red-100 text-red-800',
          border: 'border-red-200',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          ),
        };
      case 'MEDIUM':
        return {
          badge: 'bg-amber-100 text-amber-800',
          border: 'border-amber-200',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          ),
        };
      case 'LOW':
        return {
          badge: 'bg-blue-100 text-blue-800',
          border: 'border-blue-200',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          ),
        };
      default:
        return {
          badge: 'bg-gray-100 text-gray-800',
          border: 'border-gray-200',
          icon: null,
        };
    }
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
      {schedules.map((schedule) => {
        const importanceStyles = getImportanceStyles(schedule.importance);
        
        return (
          <div
            key={schedule.id}
            className={`py-4 px-1 ${schedule.completed ? 'bg-gray-50' : ''}`}
          >
            <div className="flex items-start">
              {/* 체크박스 */}
              <div className="mr-3 mt-1">
                <button
                  onClick={() => onToggleComplete(schedule.id)}
                  className={`w-5 h-5 rounded border ${schedule.completed ? 'bg-blue-500 border-blue-500' : 'border-gray-300'} flex items-center justify-center`}
                >
                  {schedule.completed && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              </div>
              
              {/* 내용 */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <h3 className={`text-base font-medium ${schedule.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {schedule.title}
                  </h3>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${importanceStyles.badge}`}>
                    {importanceStyles.icon && (
                      <span className="mr-1">{importanceStyles.icon}</span>
                    )}
                    {schedule.importance === 'HIGH' ? '높음' : schedule.importance === 'MEDIUM' ? '중간' : '낮음'}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    {schedule.category}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {format(new Date(schedule.datetime), 'yyyy년 MM월 dd일 HH:mm')}
                  </div>
                </div>
                
                {schedule.description && (
                  <div className="mt-2 mb-2 text-sm text-gray-600 bg-gray-50 p-2 rounded border border-gray-100">
                    {schedule.description}
                  </div>
                )}
                
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => onToggleComplete(schedule.id)}
                    className={`px-2 py-1 text-xs rounded-md ${
                      schedule.completed
                        ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                        : 'text-green-600 bg-green-50 hover:bg-green-100'
                    } transition-colors`}
                  >
                    {schedule.completed ? '완료 취소' : '완료 처리'}
                  </button>
                  <button
                    onClick={() => onDelete(schedule.id)}
                    className="px-2 py-1 text-xs rounded-md text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                  >
                    삭제
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