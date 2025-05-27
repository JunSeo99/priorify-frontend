'use client';

import { useState, useMemo, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { statisticsAPI } from '@/lib/api';
import { ComprehensiveStatistics } from '@/types';
import { useRouter, usePathname } from 'next/navigation';

const PRIORITY_COLORS = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#10b981'
};

const COMPLETION_COLORS = {
  completed: '#10b981',
  active: '#3b82f6'
};

const GRADIENT_COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#c084fc'];

const mockUserData = {
  name: "송준서",
  email: "test@dankook.ac.kr"
};

const StatCard = ({ title, value, subtitle, icon, trend, color = "blue" }: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  trend?: { value: number; isPositive: boolean };
  color?: string;
}) => {
  const getValueColorClass = (color: string) => {
    switch (color) {
      case 'green':
        return 'text-green-600';
      case 'yellow':
        return 'text-yellow-600';
      case 'purple':
        return 'text-purple-600';
      case 'red':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div className="backdrop-blur-sm bg-white/80 border border-blue-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl">{icon}</div>
        {trend && (
          <div className={`flex items-center text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            <span className="mr-1">{trend.isPositive ? '↗' : '↘'}</span>
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      <div className={`text-3xl font-bold mb-1 ${getValueColorClass(color)}`}>
        {value}
      </div>
      <div className="text-sm text-gray-600 font-medium">{title}</div>
      {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="backdrop-blur-sm bg-white/95 border border-blue-200 rounded-xl p-3 shadow-lg">
        <p className="font-medium text-gray-900 mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' ? 
              (entry.value % 1 === 0 ? entry.value : entry.value.toFixed(2)) : entry.value}
            {entry.dataKey === 'completionRate' ? '%' : ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const TimeHeatmapChart = ({ data, timeRange }: { data: any[]; timeRange: number }) => {
  const timeLabels = ['새벽\n0-6', '아침\n6-12', '오후\n12-18', '밤\n18-24'];

  const getVerticalLabels = (timeRange: number) => {
    switch (timeRange) {
      case 7:
        return ['월', '화', '수', '목', '금', '토', '일'];
      case 30:
        return ['1주', '2주', '3주', '4주', '5주'];
      case 90:
        return ['1달', '2달', '3달'];
      default:
        return ['월', '화', '수', '목', '금', '토', '일'];
    }
  };

  const verticalLabels = getVerticalLabels(timeRange);

  const heatmapData = useMemo(() => {
    const rows = verticalLabels.length;
    const grid = Array.from({ length: rows }, (_, row) => 
      Array.from({ length: 4 }, (_, timeSlot) => ({
        row,
        timeSlot,
        timeLabel: timeLabels[timeSlot],
        rowLabel: verticalLabels[row],
        avgPriority: 0,
        totalCount: 0,
        totalPriority: 0
      }))
    ).flat();

    if (timeRange === 7) {
      data.forEach(item => {
        const dayIndex = item._id.dayOfWeek === 1 ? 6 : item._id.dayOfWeek - 2;
        const hour = item._id.hour;
        let timeSlot = 0;
        if (hour >= 0 && hour < 6) timeSlot = 0;
        else if (hour >= 6 && hour < 12) timeSlot = 1;
        else if (hour >= 12 && hour < 18) timeSlot = 2;
        else timeSlot = 3;
        const cellIndex = dayIndex * 4 + timeSlot;
        if (grid[cellIndex] && dayIndex >= 0 && dayIndex < 7) {
          grid[cellIndex].totalCount += item.scheduleCount;
          grid[cellIndex].totalPriority += item.totalPriority;
        }
      });
    } else if (timeRange === 30) {
      const weekData = Array.from({ length: 5 }, () => Array.from({ length: 4 }, () => ({ totalCount: 0, totalPriority: 0 })));
      data.forEach(item => {
        const dayOfWeek = item._id.dayOfWeek === 1 ? 0 : item._id.dayOfWeek - 1;
        const weekIndex = dayOfWeek % 5;
        const hour = item._id.hour;
        let timeSlot = 0;
        if (hour >= 0 && hour < 6) timeSlot = 0;
        else if (hour >= 6 && hour < 12) timeSlot = 1;
        else if (hour >= 12 && hour < 18) timeSlot = 2;
        else timeSlot = 3;
        weekData[weekIndex][timeSlot].totalCount += item.scheduleCount;
        weekData[weekIndex][timeSlot].totalPriority += item.totalPriority;
      });
      weekData.forEach((week, weekIndex) => {
        week.forEach((timeData, timeSlot) => {
          const cellIndex = weekIndex * 4 + timeSlot;
          if (grid[cellIndex]) {
            grid[cellIndex].totalCount = timeData.totalCount;
            grid[cellIndex].totalPriority = timeData.totalPriority;
          }
        });
      });
    } else if (timeRange === 90) {
      const monthData = Array.from({ length: 3 }, () => Array.from({ length: 4 }, () => ({ totalCount: 0, totalPriority: 0 })));
      data.forEach(item => {
        const dayOfWeek = item._id.dayOfWeek === 1 ? 0 : item._id.dayOfWeek - 1;
        const monthIndex = dayOfWeek % 3;
        const hour = item._id.hour;
        let timeSlot = 0;
        if (hour >= 0 && hour < 6) timeSlot = 0;
        else if (hour >= 6 && hour < 12) timeSlot = 1;
        else if (hour >= 12 && hour < 18) timeSlot = 2;
        else timeSlot = 3;
        monthData[monthIndex][timeSlot].totalCount += item.scheduleCount;
        monthData[monthIndex][timeSlot].totalPriority += item.totalPriority;
      });
      monthData.forEach((month, monthIndex) => {
        month.forEach((timeData, timeSlot) => {
          const cellIndex = monthIndex * 4 + timeSlot;
          if (grid[cellIndex]) {
            grid[cellIndex].totalCount = timeData.totalCount;
            grid[cellIndex].totalPriority = timeData.totalPriority;
          }
        });
      });
    }

    grid.forEach(cell => {
      if (cell.totalCount > 0) cell.avgPriority = cell.totalPriority / cell.totalCount;
      if (isNaN(cell.avgPriority)) cell.avgPriority = 0;
    });
    return grid;
  }, [data, timeRange, verticalLabels, timeLabels]);

  const maxValue = Math.max(1, ...heatmapData.map(d => d.avgPriority));
  const maxCount = Math.max(1, ...heatmapData.map(d => d.totalCount));

  const getPeriodDescription = (timeRange: number) => {
    switch (timeRange) {
      case 7: return '최근 7일 요일별 시간대 활동';
      case 30: return '최근 30일 주차별 시간대 활동';
      case 90: return '최근 3개월 월별 시간대 활동';
      default: return '시간대별 활동 패턴';
    }
  };

  return (
    <div className="w-full">
      <div className="mb-3 p-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-md border border-blue-100">
        <div className="text-xs font-semibold text-blue-700 mb-0.5">
          {getPeriodDescription(timeRange)}
        </div>
        <div className="text-[11px] text-blue-600">
          색이 진할수록 평균 우선순위가 높습니다.
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[380px]">
          {/* 시간대 라벨 (가로축) */}
          <div className={`grid gap-1 mb-1.5`} style={{ gridTemplateColumns: '50px repeat(4, 1fr)' }}>
            <div></div> {/* 빈 공간 */}
            {timeLabels.map((label, index) => (
              <div key={index} className="text-center">
                <div className="text-[11px] font-medium text-gray-500 whitespace-pre-line bg-gray-100 rounded py-1 px-0.5">
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* 히트맵 그리드 */}
          <div className="space-y-1">
            {verticalLabels.map((label, rowIndex) => (
              <div key={label} className={`grid gap-1`} style={{ gridTemplateColumns: '50px repeat(4, 1fr)' }}>
                {/* 세로축 라벨 */}
                <div className="flex items-center justify-center">
                  <div className="text-[11px] font-medium text-gray-500 bg-gray-100 rounded py-1.5 px-1 w-full text-center">
                    {label}
                  </div>
                </div>
                
                {/* 시간대별 셀 */}
                {Array.from({ length: 4 }, (_, timeSlot) => {
                  const cell = heatmapData.find(d => d.row === rowIndex && d.timeSlot === timeSlot);
                  const intensity = cell?.avgPriority && maxValue > 0 ? cell.avgPriority / maxValue : 0;
                  
                  return (
                    <div
                      key={`${rowIndex}-${timeSlot}`}
                      className="aspect-square rounded border border-gray-200 relative group cursor-pointer transition-all duration-150 hover:scale-105 hover:shadow-sm min-h-[50px]"
                      style={{
                        backgroundColor: intensity > 0 
                          ? `rgba(59, 130, 246, ${0.05 + intensity * 0.65})` 
                          : '#fafafa',
                        borderColor: intensity > 0.5 ? '#3b82f6' : '#eef2f7'
                      }}
                      title={`${label} ${timeLabels[timeSlot].replace('\n',' ')}: ${cell?.totalCount || 0}개, P: ${cell?.avgPriority?.toFixed(1) || 0}`}
                    >
                      {cell && cell.totalCount > 0 ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-0.5 leading-tight">
                          <span className={`text-xs font-bold ${intensity > 0.5 ? 'text-white' : 'text-gray-600'}`}>
                            {cell.totalCount}
                          </span>
                          <span className={`text-[10px] ${intensity > 0.55 ? 'text-blue-100' : 'text-gray-400'}`}>
                            {cell.avgPriority.toFixed(1)}
                          </span>
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-gray-300 text-[10px]">-</span>
                        </div>
                      )}
                      {intensity > 0.05 && (
                        <div className="absolute top-1 right-1">
                          <div 
                            className="w-2 h-2 rounded-full border border-white/50 shadow-xs"
                            style={{
                              backgroundColor: intensity > 0.65 ? '#ef4444' : intensity > 0.35 ? '#f59e0b' : '#10b981'
                            }}
                          ></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 범례 */}
      <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-1.5 sm:space-y-0">
        <div className="flex items-center space-x-2.5">
          <div className="text-[11px] text-gray-500 font-medium">P-강도:</div>
          <div className="flex items-center space-x-1.5">
            {[ {color: '#10b981', label: '낮음'}, {color: '#f59e0b', label: '보통'}, {color: '#ef4444', label: '높음'}].map(item => (
            <div key={item.label} className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}}></div>
              <span className="text-[10px] text-gray-500">{item.label}</span>
            </div>
            ))}
          </div>
        </div>
        <div className="text-[11px] text-gray-400 font-medium">
          총 {heatmapData.reduce((sum, cell) => sum + cell.totalCount, 0)}개 일정
        </div>
      </div>
    </div>
  );
};

export default function StatisticsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [timeRange, setTimeRange] = useState(7);
  const [statistics, setStatistics] = useState<ComprehensiveStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const response = await statisticsAPI.getComprehensiveStatistics(timeRange);
        setStatistics(response.data);
        setError(null);
      } catch (err) {
        console.error('통계 데이터 조회 실패:', err);
        setError('통계 데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [timeRange]);

  const priorityChartData = useMemo(() => {
    if (!statistics) return [];
    const { priorityDistribution } = statistics;
    return [
      { name: '높은 우선순위', value: priorityDistribution.high, percentage: priorityDistribution.highPercentage, color: PRIORITY_COLORS.high },
      { name: '중간 우선순위', value: priorityDistribution.medium, percentage: priorityDistribution.mediumPercentage, color: PRIORITY_COLORS.medium },
      { name: '낮은 우선순위', value: priorityDistribution.low, percentage: priorityDistribution.lowPercentage, color: PRIORITY_COLORS.low }
    ];
  }, [statistics]);

  const categoryPerformanceData = useMemo(() => {
    if (!statistics) return [];
    return statistics.categoryStats
      .sort((a, b) => b.totalSchedules - a.totalSchedules)
      .slice(0, 8)
      .map(stat => ({
        category: stat._id,
        totalSchedules: stat.totalSchedules,
        completionRate: Math.round(stat.completionRate * 100),
        avgPriority: stat.avgPriority,
        totalHours: stat.totalDuration
      }));
  }, [statistics]);

  const completionChartData = useMemo(() => {
    if (!statistics) return [];
    const { completionStats } = statistics;
    return [
      { name: '완료됨', value: completionStats.completed, color: COMPLETION_COLORS.completed },
      { name: '진행중', value: completionStats.active, color: COMPLETION_COLORS.active }
    ];
  }, [statistics]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="backdrop-blur-sm bg-white/80 border border-blue-200 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-gray-700 text-lg">통계 데이터를 불러오는 중...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !statistics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="backdrop-blur-sm bg-white/80 border border-red-200 rounded-2xl p-8 shadow-lg">
          <div className="text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">데이터 로딩 실패</h2>
            <p className="text-gray-600">{error || '통계 데이터를 불러올 수 없습니다.'}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzYjgyZjYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
      <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>

      <div className="relative z-10 p-6 sm:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          {/* 헤더 */}
          <div className="mb-12 sm:mb-16">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  통계 대시보드
                </h1>
                <p className="text-lg sm:text-xl text-gray-600">
                  {mockUserData.name}님의 우선순위와 일정 패턴을 분석합니다
                </p>
              </div>
              {/* 새로고침 버튼 등 추가 가능 */}
            </div>
          </div>
          
          {/* 상단 탭 네비게이션 */}
          <div className="backdrop-blur-sm bg-white/80 border border-blue-200 rounded-2xl shadow-lg mb-10 p-2">
            <div className="flex space-x-2">
              <button 
                onClick={() => router.push('/schedule')}
                className={`flex-1 sm:flex-none px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300 
                  ${pathname === '/schedule' 
                    ? 'text-white bg-blue-500 shadow-md hover:bg-blue-600' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}
                `}
              >
                대시보드
              </button>
              <button 
                onClick={() => router.push('/schedule')} // 현재는 /schedule로 이동, 추후 별도 목록 페이지로 변경 가능
                className={`flex-1 sm:flex-none px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300 
                ${'/schedule/list' === pathname // pathname.startsWith('/schedule/list') 등으로 변경 가능
                  ? 'text-white bg-blue-500 shadow-md hover:bg-blue-600' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}
              `}
              >
                일정 목록
              </button>
              <button 
                onClick={() => router.push('/statistics')}
                className={`flex-1 sm:flex-none px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300 
                  ${pathname === '/statistics' 
                    ? 'text-white bg-blue-500 shadow-md hover:bg-blue-600' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'}
                `}
              >
                통계
              </button>
            </div>
          </div>

          {/* 시간 범위 선택 */}
          <div className="mb-8">
            <div className="flex justify-center">
              <div className="backdrop-blur-sm bg-white/80 border border-blue-200 rounded-2xl p-2 shadow-lg">
                <div className="flex space-x-1">
                  {[{
                    key: 7,
                    label: '최근 7일'
                  }, {
                    key: 30,
                    label: '최근 30일'
                  }, {
                    key: 90,
                    label: '최근 3개월'
                  }].map((option) => (
                    <button
                      key={option.key}
                      onClick={() => setTimeRange(option.key)}
                      className={`px-6 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        timeRange === option.key
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 주요 지표 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="총 일정 수"
              value={statistics.summary.totalSchedules}
              subtitle={`${statistics.summary.totalCategories}개 카테고리`}
              icon="📅"
              color="blue"
            />
            <StatCard
              title="전체 완료율"
              value={`${Math.round(statistics.summary.overallCompletionRate * 100)}%`}
              subtitle={`${statistics.summary.totalCompleted}/${statistics.summary.totalSchedules} 완료`}
              icon="✅"
              color="green"
              trend={{
                value: 12,
                isPositive: true
              }}
            />
            <StatCard
              title="평균 우선순위"
              value={statistics.summary.avgPriority.toFixed(1)}
              subtitle="10점 만점"
              icon="⭐"
              color="yellow"
            />
            <StatCard
              title="총 소요 시간"
              value={`${statistics.summary.totalHours.toFixed(1)}h`}
              subtitle={`평균 ${statistics.summary.avgHoursPerSchedule.toFixed(1)}h/일정`}
              icon="⏰"
              color="purple"
            />
          </div>

          {/* 첫 번째 행: 우선순위 분포 & 완료 현황 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="backdrop-blur-sm bg-white/80 border border-blue-200 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <span className="mr-2">🎯</span>
                우선순위 분포
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={priorityChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {priorityChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                {priorityChartData.map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <div 
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: item.color }}
                      ></div>
                    </div>
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.value}개 ({item.percentage.toFixed(1)}%)</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="backdrop-blur-sm bg-white/80 border border-blue-200 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <span className="mr-2">📊</span>
                완료 현황
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={completionChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {completionChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center space-x-8 mt-4">
                {completionChartData.map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <div 
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: item.color }}
                      ></div>
                    </div>
                    <div className="text-sm font-medium text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.value}개</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 두 번째 행: 카테고리별 성과 */}
          <div className="backdrop-blur-sm bg-white/80 border border-blue-200 rounded-2xl p-6 shadow-lg mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <span className="mr-2">📈</span>
              카테고리별 성과 분석
            </h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryPerformanceData} margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 60
                }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="category" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    yAxisId="left"
                    dataKey="totalSchedules" 
                    name="일정 수"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    yAxisId="right"
                    dataKey="completionRate" 
                    name="완료율(%)"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 세 번째 행: 시간대별 히트맵, 우선순위 설정, 상위 카테고리 (2단 또는 3단 그리드) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2 backdrop-blur-sm bg-white/80 border border-blue-200 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">🕐</span>
                시간대별 우선순위 히트맵
              </h3>
              <TimeHeatmapChart data={statistics.timeBasedPriority} timeRange={timeRange} />
            </div>

            <div className="space-y-8">
              <div className="backdrop-blur-sm bg-white/80 border border-blue-200 rounded-2xl p-6 shadow-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">⚙️</span>
                  우선순위 설정
                </h4>
                <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar-sm">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">높은 우선순위</h5>
                    <div className="space-y-2">
                      {statistics.prioritySettings.highPriorities.map((priority, index) => (
                        <div key={index} className="flex items-center justify-between bg-red-50 rounded-lg p-2.5">
                          <div className="flex items-center space-x-2.5">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span className="text-xs font-medium text-gray-700">{priority.category}</span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <span className="text-[11px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full">
                              {priority.rank}순위
                            </span>
                            <span className="text-[11px] text-gray-500">
                              W: {priority.weight}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">낮은 우선순위</h5>
                    <div className="space-y-2">
                      {statistics.prioritySettings.lowPriorities.map((priority, index) => (
                        <div key={index} className="flex items-center justify-between bg-green-50 rounded-lg p-2.5">
                          <div className="flex items-center space-x-2.5">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs font-medium text-gray-700">{priority.category}</span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <span className="text-[11px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                              {priority.rank}순위
                            </span>
                            <span className="text-[11px] text-gray-500">
                              W: {priority.weight}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 네 번째 행: 상위 카테고리 (기존 레이아웃 유지 또는 다른 곳으로 이동) */}
          <div className="backdrop-blur-sm bg-white/80 border border-blue-200 rounded-2xl p-6 shadow-lg">
              <h4 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <span className="mr-2">🏆</span>
                상위 카테고리 상세
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryPerformanceData.slice(0, 6).map((category, index) => (
                  <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="text-lg font-bold text-blue-600">#{index + 1}</div>
                        <div className="font-medium text-gray-900 truncate" title={category.category}>{category.category}</div>
                      </div>
                      <div className="text-xs text-gray-500 whitespace-nowrap">{category.totalSchedules}개</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center p-1 bg-white/50 rounded">
                        <div className="font-semibold text-green-600">{category.completionRate}%</div>
                        <div className="text-gray-500">완료율</div>
                      </div>
                      <div className="text-center p-1 bg-white/50 rounded">
                        <div className="font-semibold text-yellow-600">{category.avgPriority.toFixed(1)}</div>
                        <div className="text-gray-500">P.평균</div>
                      </div>
                      <div className="text-center p-1 bg-white/50 rounded">
                        <div className="font-semibold text-purple-600">{category.totalHours.toFixed(1)}h</div>
                        <div className="text-gray-500">총시간</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

        </div>
      </div>
    </div>
  );
} 