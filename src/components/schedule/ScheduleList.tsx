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
  const importanceColor = {
    HIGH: 'bg-red-100',
    MEDIUM: 'bg-yellow-100',
    LOW: 'bg-green-100',
  };

  return (
    <div className="space-y-4">
      {schedules.map((schedule) => (
        <div
          key={schedule.id}
          className={`p-4 rounded-lg shadow ${
            importanceColor[schedule.importance]
          } ${schedule.completed ? 'opacity-50' : ''}`}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{schedule.title}</h3>
            <div className="flex items-center space-x-2">
              <Button
                variant="secondary"
                onClick={() => onToggleComplete(schedule.id)}
              >
                {schedule.completed ? '완료 취소' : '완료'}
              </Button>
              <Button
                variant="danger"
                onClick={() => onDelete(schedule.id)}
              >
                삭제
              </Button>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            <p>
              날짜: {format(new Date(schedule.datetime), 'yyyy-MM-dd HH:mm')}
            </p>
            <p>카테고리: {schedule.category}</p>
            <p>중요도: {schedule.importance}</p>
            {schedule.description && (
              <p className="mt-2">{schedule.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}; 