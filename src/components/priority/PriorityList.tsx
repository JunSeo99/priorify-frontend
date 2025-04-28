'use client';

import { Priority } from '@/types';
import { useMemo } from 'react';

interface PriorityListProps {
  priorities: Priority[];
  type: 'high' | 'low';
}

export function PriorityList({ priorities, type }: PriorityListProps) {
  const sortedPriorities = useMemo(() => {
    return [...priorities].sort((a, b) => a.rank - b.rank);
  }, [priorities]);

  const emptyMessage = type === 'high' ? '상위' : '하위';

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg min-h-[200px]">
        {sortedPriorities.length > 0 ? (
          <div className="space-y-2">
            {sortedPriorities.map((priority) => (
              <div 
                key={`${priority.category}-${priority.rank}`}
                className="bg-white rounded-lg shadow p-4"
              >
                <h3 className="font-semibold text-gray-800">
                  {priority.category} ({priority.rank}순위)
                </h3>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[160px]">
            <p className="text-gray-500 text-center">
              {emptyMessage} 우선순위가 설정되지 않았습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 