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
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 섹션 */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            일정 분석 대시보드
          </h1>
          <p className="text-gray-600 text-lg">스마트하게 일정을 관리하고 분석하세요</p>
        </div>

        {/* 상단 탭 네비게이션 (문서 스타일) */}
        <div className="border-b border-gray-200 mb-8">
          <div className="flex space-x-8">
            <button className="border-b-2 border-blue-600 py-2 px-1 text-sm font-medium text-blue-600">
              대시보드
            </button>
            <button className="py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
              일정 목록
            </button>
            <button className="py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700">
              통계
            </button>
          </div>
        </div>

        {/* 요약 통계 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">전체 일정</h3>
            <p className="text-3xl font-semibold text-gray-900">{schedules.length}개</p>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">완료된 일정</h3>
            <p className="text-3xl font-semibold text-gray-900">{completedSchedules.length}개</p>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">완료율</h3>
            <p className="text-3xl font-semibold text-gray-900">{completionRate}%</p>
          </div>
        </div>

        {/* 컨텐츠 섹션 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 왼쪽: 일정 목록 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 카테고리별 일정 분포 */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">카테고리별 일정 분포</h2>
                <p className="text-sm text-gray-500">일정 분포를 카테고리별로 확인하세요</p>
              </div>
              <div className="flex items-center mb-4">
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                    <span className="text-xs text-gray-600">높은 중요도</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                    <span className="text-xs text-gray-600">중간 중요도</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    <span className="text-xs text-gray-600">낮은 중요도</span>
                  </div>
                </div>
              </div>
              <div className="h-[300px]">
                <ScheduleGraph
                  schedules={schedules}
                  onCategoryClick={setSelectedCategory}
                />
              </div>
            </div>

            {/* 일정 목록 */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">일정 목록</h2>
                  <p className="text-sm text-gray-500">모든 일정을 확인하고 관리하세요</p>
                </div>
                <div className="flex items-center space-x-2">
                  {selectedCategory && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {selectedCategory}
                    </span>
                  )}
                  {selectedCategory && (
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="text-xs text-gray-500 hover:text-gray-700 transition-colors flex items-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      필터 초기화
                    </button>
                  )}
                </div>
              </div>
              <div className="border rounded-md">
                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                  <ScheduleList
                    schedules={filteredSchedules}
                    onToggleComplete={handleToggleComplete}
                    onDelete={handleDelete}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽: 사이드바 (새 일정 폼) */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">새로운 일정</h2>
                  <p className="text-sm text-gray-500">새 일정을 빠르게 추가하세요</p>
                </div>
                <ScheduleForm onSubmit={handleSubmit} />
              </div>

              {/* 문서 사이트 스타일의 명령어 박스 */}
              <div className="mt-6 bg-gray-50 rounded-lg border border-gray-200 shadow-sm p-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">유용한 단축키</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-800">Ctrl + N</code>
                    <span className="text-xs text-gray-600">새 일정 만들기</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-800">Ctrl + D</code>
                    <span className="text-xs text-gray-600">일정 삭제</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-800">Ctrl + F</code>
                    <span className="text-xs text-gray-600">일정 검색</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 