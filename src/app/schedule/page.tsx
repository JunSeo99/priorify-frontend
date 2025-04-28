'use client';

import { useEffect, useState } from 'react';
import { useScheduleStore } from '@/store/schedule';
import { scheduleAPI } from '@/lib/api';
import { Schedule } from '@/types';
import { ScheduleForm } from '@/components/schedule/ScheduleForm';
import { ScheduleList } from '@/components/schedule/ScheduleList';
import { ScheduleGraph } from '@/components/schedule/ScheduleGraph';
import { CATEGORIES } from '@/types';

// 가상 데이터 생성을 위한 유틸리티 함수
const generateMockSchedules = (): Schedule[] => {
  const mockSchedules: Schedule[] = [];
  const importanceLevels: ('HIGH' | 'MEDIUM' | 'LOW')[] = ['HIGH', 'MEDIUM', 'LOW'];
  
  // 현재 날짜를 기준으로 과거 7일부터 미래 7일까지의 랜덤 일정 생성
  for (let i = 0; i < 15; i++) {
    const date = new Date();
    date.setDate(date.getDate() - 7 + i);
    
    const randomCategory = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const randomImportance = importanceLevels[Math.floor(Math.random() * importanceLevels.length)];
    
    mockSchedules.push({
      id: `mock-${i}`,
      title: `${randomCategory} 관련 일정 ${i + 1}`,
      description: `${randomCategory}에 대한 상세 설명입니다.`,
      datetime: date.toISOString(),
      category: randomCategory,
      importance: randomImportance,
      completed: Math.random() > 0.7, // 30% 확률로 완료 상태
    });
  }
  
  return mockSchedules;
};

// 가상의 API 응답 시뮬레이션
const mockAPI = {
  getSchedules: () => Promise.resolve({ data: generateMockSchedules() }),
  createSchedule: (data: Partial<Schedule>) => 
    Promise.resolve({ 
      data: {
        ...data,
        id: `mock-${Date.now()}`,
        datetime: data.datetime || new Date().toISOString(),
      } as Schedule 
    }),
  toggleCompletion: (id: string) => Promise.resolve(),
  deleteSchedule: (id: string) => Promise.resolve(),
};

export default function SchedulePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { schedules, setSchedules, addSchedule, deleteSchedule, updateSchedule } =
    useScheduleStore();

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        // 실제 API 대신 목업 API 사용
        const response = await mockAPI.getSchedules();
        setSchedules(response.data);
      } catch (error) {
        console.error('Failed to fetch schedules:', error);
        alert('일정을 불러오는데 실패했습니다.');
      }
    };

    fetchSchedules();
  }, [setSchedules]);

  const getRandomCategory = () => {
    const randomIndex = Math.floor(Math.random() * CATEGORIES.length);
    return CATEGORIES[randomIndex];
  };

  const handleSubmit = async (
    data: Omit<Schedule, 'id' | 'category' | 'completed'>
  ) => {
    try {
      // 실제 API 대신 목업 API 사용
      const response = await mockAPI.createSchedule({
        ...data,
        category: getRandomCategory(),
        completed: false,
      });
      addSchedule(response.data);
    } catch (error) {
      console.error('Failed to create schedule:', error);
      alert('일정 생성에 실패했습니다.');
    }
  };

  const handleToggleComplete = async (id: string) => {
    try {
      await mockAPI.toggleCompletion(id);
      const schedule = schedules.find((s) => s.id === id);
      if (schedule) {
        updateSchedule(id, { completed: !schedule.completed });
      }
    } catch (error) {
      console.error('Failed to toggle completion:', error);
      alert('일정 상태 변경에 실패했습니다.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await mockAPI.deleteSchedule(id);
      deleteSchedule(id);
    } catch (error) {
      console.error('Failed to delete schedule:', error);
      alert('일정 삭제에 실패했습니다.');
    }
  };

  const filteredSchedules = selectedCategory
    ? schedules.filter((s) => s.category === selectedCategory)
    : schedules;

  const completedSchedules = schedules.filter((s) => s.completed);
  const completionRate = schedules.length > 0
    ? Math.round((completedSchedules.length / schedules.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      {/* 헤더 섹션 */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
          일정 분석 대시보드
        </h1>
        <p className="text-gray-600">일정을 한눈에 파악하고 관리하세요</p>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* 메인 그래프 섹션 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* 왼쪽: 대형 그래프 */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 h-[600px]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">카테고리별 일정 분포</h2>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span className="text-sm text-gray-600">높은 중요도</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                    <span className="text-sm text-gray-600">중간 중요도</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span className="text-sm text-gray-600">낮은 중요도</span>
                  </div>
                </div>
              </div>
              <div className="h-[500px]">
                <ScheduleGraph
                  schedules={schedules}
                  onCategoryClick={setSelectedCategory}
                />
              </div>
            </div>
          </div>

          {/* 오른쪽: 통계 카드 */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold opacity-90 mb-2">전체 일정</h3>
              <p className="text-4xl font-bold">{schedules.length}개</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold opacity-90 mb-2">완료된 일정</h3>
              <p className="text-4xl font-bold">{completedSchedules.length}개</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold opacity-90 mb-2">완료율</h3>
              <p className="text-4xl font-bold">{completionRate}%</p>
            </div>
          </div>
        </div>

        {/* 하단 섹션 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 일정 추가 폼 */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">새로운 일정</h2>
                <span className="text-sm text-gray-500">빠른 추가</span>
              </div>
              <ScheduleForm onSubmit={handleSubmit} />
            </div>
          </div>

          {/* 일정 목록 */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">일정 목록</h2>
                <div className="flex items-center gap-4">
                  {selectedCategory && (
                    <span className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {selectedCategory}
                    </span>
                  )}
                  {selectedCategory && (
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      필터 초기화
                    </button>
                  )}
                </div>
              </div>
              <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                <ScheduleList
                  schedules={filteredSchedules}
                  onToggleComplete={handleToggleComplete}
                  onDelete={handleDelete}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 