import { useForm } from 'react-hook-form';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Schedule } from '@/types';

interface ScheduleFormProps {
  onSubmit: (data: Omit<Schedule, 'id' | 'category' | 'completed'>) => void;
}

export const ScheduleForm = ({ onSubmit }: ScheduleFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Omit<Schedule, 'id' | 'category' | 'completed'>>();

  const onSubmitForm = (data: Omit<Schedule, 'id' | 'category' | 'completed'>) => {
    onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      <Input
        label="제목"
        {...register('title', { required: '제목을 입력해주세요' })}
        error={errors.title?.message}
      />
      <Input
        label="날짜 및 시간"
        type="datetime-local"
        {...register('datetime', { required: '날짜와 시간을 선택해주세요' })}
        error={errors.datetime?.message}
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          중요도
        </label>
        <select
          {...register('importance', { required: '중요도를 선택해주세요' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">선택해주세요</option>
          <option value="HIGH">상</option>
          <option value="MEDIUM">중</option>
          <option value="LOW">하</option>
        </select>
        {errors.importance && (
          <p className="mt-1 text-sm text-red-500">{errors.importance.message}</p>
        )}
      </div>
      <Input
        label="설명"
        {...register('description')}
        as="textarea"
        className="h-24"
      />
      <Button type="submit" className="w-full">
        일정 추가
      </Button>
    </form>
  );
}; 