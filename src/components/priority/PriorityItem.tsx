'use client';

import { Todo } from '@/types';

interface PriorityItemProps {
  todo: Todo;
}

export function PriorityItem({ todo }: PriorityItemProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-2 cursor-move">
      <h3 className="font-semibold text-gray-800">{todo.title}</h3>
      <p className="text-sm text-gray-600">{todo.description}</p>
    </div>
  );
} 