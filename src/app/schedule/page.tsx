'use client';

import { useEffect, useState, useCallback } from 'react';
import { useScheduleStore } from '@/store/schedule';
import { scheduleAPI } from '@/lib/api';
import { Schedule } from '@/types';
import { ScheduleList } from '@/components/schedule/ScheduleList';
import dynamic from 'next/dynamic';

const ScheduleGraph = dynamic(
  () => import('@/components/schedule/ScheduleGraph'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[400px] flex items-center justify-center backdrop-blur-sm bg-white/80 border border-blue-200 rounded-2xl shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium text-gray-600">그래프 로딩 중...</span>
        </div>
      </div>
    )
  }
);

// 그래프 데이터 타입 정의
interface GraphNode {
  id: string;
  label: string;
  type: 'user' | 'category' | 'schedule';
  level: number;
}

interface GraphEdge {
  source: string;
  target: string;
  type: 'user-category' | 'category-schedule';
}

interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  schedules: Schedule[];
  metadata: {
    layoutType: string;
    userNodeColor: string;
    categoryNodeColor: string;
  };
}

// 로딩 상태 타입
interface LoadingState {
  graph: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
}

// 에러 상태 타입
interface ErrorState {
  graph: string | null;
  operation: string | null;
}

export default function SchedulePage() {
  // 상태 관리
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState<LoadingState>({
    graph: true,
    creating: false,
    updating: false,
    deleting: false,
  });
  const [errors, setErrors] = useState<ErrorState>({
    graph: null,
    operation: null,
  });

  const { schedules, setSchedules, addSchedule, deleteSchedule, updateSchedule } = useScheduleStore();

  // 에러 상태 업데이트 헬퍼
  const updateError = useCallback((key: keyof ErrorState, message: string | null) => {
    setErrors(prev => ({ ...prev, [key]: message }));
  }, []);

  // 로딩 상태 업데이트 헬퍼
  const updateLoading = useCallback((key: keyof LoadingState, value: boolean) => {
    setLoading(prev => ({ ...prev, [key]: value }));
  }, []);

  // 그래프 및 일정 데이터 가져오기
  const fetchGraphData = useCallback(async () => {
    try {
      updateLoading('graph', true);
      updateError('graph', null);
      
      const response = await scheduleAPI.getGraphData();
      console.log(response.data);
      setGraphData(response.data);
      
      // 스케줄 데이터도 함께 업데이트
      if (response.data.schedules) {
        setSchedules(response.data.schedules);
      }
    } catch (error) {
      console.error('Failed to fetch graph data:', error);
      updateError('graph', error instanceof Error ? error.message : '그래프 데이터를 불러오는데 실패했습니다.');
    } finally {
      updateLoading('graph', false);
    }
  }, [updateLoading, updateError, setSchedules]);

  // 초기 데이터 로딩
  useEffect(() => {
    fetchGraphData();
  }, [fetchGraphData]);

  // 일정 생성
  const handleSubmit = async (data: Omit<Schedule, 'id' | 'status'>) => {
    try {
      updateLoading('creating', true);
      updateError('operation', null);
      
      const response = await scheduleAPI.createSchedule({
        ...data,
        status: 'active',
      });
      
      addSchedule(response.data);
      fetchGraphData();
      
    } catch (error) {
      console.error('Failed to create schedule:', error);
      updateError('operation', '일정 생성에 실패했습니다.');
    } finally {
      updateLoading('creating', false);
    }
  };

  // 일정 완료 상태 토글
  const handleToggleComplete = async (id: string) => {
    try {
      updateLoading('updating', true);
      updateError('operation', null);
      
      await scheduleAPI.toggleCompletion(id);
      
      const schedule = schedules.find((s) => s.id === id);
      if (schedule) {
        const newStatus = schedule.status === 'completed' ? 'active' : 'completed';
        updateSchedule(id, { status: newStatus });
      }
    } catch (error) {
      console.error('Failed to toggle completion:', error);
      updateError('operation', '일정 상태 변경에 실패했습니다.');
    } finally {
      updateLoading('updating', false);
    }
  };

  // 일정 삭제
  const handleDelete = async (id: string) => {
    if (!confirm('정말로 이 일정을 삭제하시겠습니까?')) {
      return;
    }

    try {
      updateLoading('deleting', true);
      updateError('operation', null);
      
      await scheduleAPI.deleteSchedule(id);
      deleteSchedule(id);
      fetchGraphData();
      
    } catch (error) {
      console.error('Failed to delete schedule:', error);
      updateError('operation', '일정 삭제에 실패했습니다.');
    } finally {
      updateLoading('deleting', false);
    }
  };

  // 데이터 새로고침
  const handleRefresh = useCallback(() => {
    fetchGraphData();
  }, [fetchGraphData]);

  // 필터링된 일정 (카테고리 배열 처리)
  const filteredSchedules = selectedCategory
    ? schedules.filter((s) => s.categories && s.categories.includes(selectedCategory))
    : schedules;

  // 통계 계산
  const completedSchedules = schedules.filter((s) => s.status === 'completed');
  const completionRate = schedules.length > 0
    ? Math.round((completedSchedules.length / schedules.length) * 100)
    : 0;

  // 에러 컴포넌트
  const ErrorMessage = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
    <div className="backdrop-blur-sm bg-red-50/90 border border-red-200 rounded-xl p-4 shadow-lg">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-red-800">{message}</p>
        </div>
        {onRetry && (
          <div className="ml-auto">
            <button
              onClick={onRetry}
              className="text-sm font-medium text-red-600 hover:text-red-500 transition-colors duration-200 underline"
            >
              다시 시도
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
      {/* 배경 장식 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-50/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 p-6 sm:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          {/* 헤더 섹션 */}
          <div className="mb-12 sm:mb-16">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  일정 분석 대시보드
                </h1>
                <p className="text-lg sm:text-xl text-gray-600">스마트하게 일정을 관리하고 분석하세요</p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={loading.graph}
                className="inline-flex items-center justify-center space-x-2 px-6 py-3 text-sm font-semibold text-gray-700 backdrop-blur-sm bg-white/90 border border-blue-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-out hover:scale-101 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <svg className={`w-4 h-4 ${loading.graph ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>새로고침</span>
              </button>
            </div>
          </div>

          {/* 전역 에러 메시지 */}
          {errors.operation && (
            <div className="mb-8">
              <ErrorMessage 
                message={errors.operation} 
                onRetry={() => updateError('operation', null)} 
              />
            </div>
          )}

          {/* 상단 탭 네비게이션 */}
          <div className="backdrop-blur-sm bg-white/80 border border-blue-200 rounded-2xl shadow-lg mb-10 p-2">
            <div className="flex space-x-2">
              <button className="flex-1 sm:flex-none px-6 py-3 text-sm font-semibold text-white bg-blue-500 rounded-xl shadow-md transition-all duration-300 hover:bg-blue-600">
                대시보드
              </button>
              <button className="flex-1 sm:flex-none px-6 py-3 text-sm font-semibold text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300">
                일정 목록
              </button>
              <button className="flex-1 sm:flex-none px-6 py-3 text-sm font-semibold text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300">
                통계
              </button>
            </div>
          </div>

          {/* 요약 통계 섹션 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
            <div className="backdrop-blur-sm bg-white/80 rounded-2xl border border-blue-200 shadow-xl p-6 sm:p-8 hover:shadow-2xl transition-all duration-300 ease-out hover:scale-101">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">전체 일정</h3>
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              {loading.graph ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-500">로딩 중...</span>
                </div>
              ) : (
                <p className="text-3xl sm:text-4xl font-bold text-gray-900">{schedules.length}개</p>
              )}
            </div>
            
            <div className="backdrop-blur-sm bg-white/80 rounded-2xl border border-green-200 shadow-xl p-6 sm:p-8 hover:shadow-2xl transition-all duration-300 ease-out hover:scale-101">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">완료된 일정</h3>
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              {loading.graph ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-green-300 border-t-green-600 rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-500">로딩 중...</span>
                </div>
              ) : (
                <p className="text-3xl sm:text-4xl font-bold text-gray-900">{completedSchedules.length}개</p>
              )}
            </div>
            
            <div className="backdrop-blur-sm bg-white/80 rounded-2xl border border-purple-200 shadow-xl p-6 sm:p-8 hover:shadow-2xl transition-all duration-300 ease-out hover:scale-101 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">완료율</h3>
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              {loading.graph ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-500">로딩 중...</span>
                </div>
              ) : (
                <p className="text-3xl sm:text-4xl font-bold text-gray-900">{completionRate}%</p>
              )}
            </div>
          </div>

          {/* 컨텐츠 섹션 */}
          <div className="space-y-8 sm:space-y-12">
            {/* 카테고리별 일정 분포 */}
            <div className="backdrop-blur-sm bg-white/80 rounded-2xl sm:rounded-3xl border border-blue-200 shadow-xl p-6 sm:p-8 lg:p-10">
              <div className="mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">카테고리별 일정 분포</h2>
                <p className="text-base sm:text-lg text-gray-600">일정 분포를 카테고리별로 확인하세요</p>
              </div>
              
              {errors.graph ? (
                <ErrorMessage message={errors.graph} onRetry={fetchGraphData} />
              ) : (
                <>
                  <div className="flex items-center mb-6">
                    <div className="flex flex-wrap gap-4 sm:gap-6">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm"></span>
                        <span className="text-sm font-medium text-gray-600">높은 우선순위</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm"></span>
                        <span className="text-sm font-medium text-gray-600">중간 우선순위</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-blue-500 shadow-sm"></span>
                        <span className="text-sm font-medium text-gray-600">낮은 우선순위</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-[400px] max-h-[400px] border border-blue-200 rounded-2xl overflow-hidden shadow-inner bg-white/50">
                    {loading.graph ? (
                      <div className="h-full flex items-center justify-center">
                        <div className="flex items-center space-x-3">
                          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm font-medium text-gray-600">그래프 로딩 중...</span>
                        </div>
                      </div>
                    ) : graphData ? (
                      <ScheduleGraph
                        graphData={graphData}
                        onCategoryClick={setSelectedCategory}
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <span className="text-sm text-gray-500">그래프 데이터가 없습니다.</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* 일정 목록 */}
            <div className="backdrop-blur-sm bg-white/80 rounded-2xl sm:rounded-3xl border border-blue-200 shadow-xl p-6 sm:p-8 lg:p-10">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">일정 목록</h2>
                  <p className="text-base sm:text-lg text-gray-600">모든 일정을 확인하고 관리하세요</p>
                </div>
                <div className="flex items-center space-x-3">
                  {selectedCategory && (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                      {selectedCategory}
                    </span>
                  )}
                  {selectedCategory && (
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      필터 초기화
                    </button>
                  )}
                </div>
              </div>
              
              <div className="border border-blue-200 rounded-2xl overflow-hidden shadow-inner bg-white/50">
                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                  {loading.graph ? (
                    <div className="p-12 flex items-center justify-center">
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm font-medium text-gray-600">일정 로딩 중...</span>
                      </div>
                    </div>
                  ) : filteredSchedules.length > 0 ? (
                    <ScheduleList
                      schedules={filteredSchedules}
                      onToggleComplete={handleToggleComplete}
                      onDelete={handleDelete}
                      isUpdating={loading.updating}
                      isDeleting={loading.deleting}
                    />
                  ) : (
                    <div className="p-12 text-center">
                      <div className="text-gray-400 mb-4">
                        <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <p className="text-base font-medium text-gray-500">
                        {selectedCategory ? `${selectedCategory} 카테고리에 일정이 없습니다.` : '등록된 일정이 없습니다.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 