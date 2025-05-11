import { ResponsiveNetwork } from '@nivo/network';
import { Schedule } from '@/types';
import { useMemo, useState, useEffect } from 'react';

interface ScheduleGraphProps {
  schedules: Schedule[];
  onCategoryClick: (category: string) => void;
}

interface NetworkData {
  id: string;
  radius?: number;
  color?: string;
  label?: string;
}

interface NetworkLink {
  source: string;
  target: string;
  distance?: number;
}

const getImportanceColor = (importance: string) => {
  switch (importance) {
    case 'HIGH':
      return '#dc2626'; // red-600
    case 'MEDIUM':
      return '#ea580c'; // orange-600
    case 'LOW':
      return '#2563eb'; // blue-600
    default:
      return '#4b5563'; // gray-600
  }
};

const getImportanceColorName = (importance: string) => {
  switch (importance) {
    case 'HIGH':
      return '높음';
    case 'MEDIUM':
      return '중간';
    case 'LOW':
      return '낮음';
    default:
      return '기본';
  }
};

const getTimeWeight = (date: string) => {
  const now = new Date();
  const dueDate = new Date(date);
  const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  // 가까울수록 큰 가중치
  if (diffDays <= 1) return 100;
  if (diffDays <= 3) return 80;
  if (diffDays <= 7) return 60;
  if (diffDays <= 14) return 40;
  return 20;
};

const getImportanceWeight = (importance: string) => {
  switch (importance) {
    case 'HIGH':
      return 100;
    case 'MEDIUM':
      return 60;
    case 'LOW':
      return 30;
    default:
      return 10;
  }
};

export function ScheduleGraph({ schedules, onCategoryClick }: ScheduleGraphProps) {
  const [hoveredNode, setHoveredNode] = useState<NetworkData | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const { nodes, links } = useMemo(() => {
    const networkNodes: NetworkData[] = [];
    const networkLinks: NetworkLink[] = [];

    // 루트 노드 추가
    networkNodes.push({
      id: 'root',
      radius: 22,
      color: '#0284c7', // sky-600
      label: '일정',
    });

    // 카테고리별로 스케줄 그룹화
    const categoryGroups = schedules.reduce((acc, schedule) => {
      if (!acc[schedule.category]) {
        acc[schedule.category] = [];
      }
      acc[schedule.category].push(schedule);
      return acc;
    }, {} as Record<string, Schedule[]>);

    // 각 스케줄을 노드로 변환
    schedules.forEach((schedule) => {
      const nodeId = `schedule-${schedule.id}`;
      // 시간 가중치와 중요도 가중치를 결합하여 노드 크기 결정
      const timeWeight = getTimeWeight(schedule.datetime);
      const importanceWeight = getImportanceWeight(schedule.importance);
      const combinedWeight = (timeWeight + importanceWeight) / 2;
      const radius = (combinedWeight / 100) * 16 + 7; // 7~23 사이의 크기로 조정하여 더 깔끔하게

      networkNodes.push({
        id: nodeId,
        radius,
        color: getImportanceColor(schedule.importance),
        label: schedule.title,
      });

      // 루트와 스케줄 노드 연결
      networkLinks.push({
        source: 'root',
        target: nodeId,
        distance: 150,
      });

      // 같은 카테고리의 다른 스케줄들과 연결
      categoryGroups[schedule.category].forEach((otherSchedule) => {
        if (otherSchedule.id !== schedule.id) {
          networkLinks.push({
            source: nodeId,
            target: `schedule-${otherSchedule.id}`,
            distance: 80,
          });
        }
      });
    });

    return { nodes: networkNodes, links: networkLinks };
  }, [schedules]);

  if (!schedules.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 py-8">
        <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-sm text-gray-500">일정 데이터가 없습니다</p>
        <button className="px-4 py-2 text-xs text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors">
          새 일정 추가
        </button>
      </div>
    );
  }

  if (!isMounted) {
    return (
      <div className="relative h-full min-h-[300px] flex items-center justify-center">
        <div className="text-sm text-gray-500">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-[300px]">
      <ResponsiveNetwork
        data={{
          nodes,
          links,
        }}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        repulsivity={100}
        iterations={80}
        nodeColor="color"
        nodeBorderWidth={1}
        nodeBorderColor={{
          from: 'color',
          modifiers: [['darker', 0.3]],
        }}
        linkThickness={1}
        linkColor={{ from: 'source.color', modifiers: [['opacity', 0.3]] }}
        nodeSize={node => (node as NetworkData).radius || 8}
        motionConfig="gentle"
        onClick={(node) => {
          if (node.id !== 'root') {
            const schedule = schedules.find(s => `schedule-${s.id}` === node.id);
            if (schedule) {
              onCategoryClick(schedule.category);
            }
          }
        }}
        onMouseEnter={(node) => {
          setHoveredNode(node as NetworkData);
        }}
        onMouseLeave={() => {
          setHoveredNode(null);
        }}
      />
      
      {/* 호버 툴팁 */}
      {hoveredNode && hoveredNode.id !== 'root' && (
        <div className="absolute bottom-4 right-4 bg-white shadow-md border border-gray-200 rounded-md p-3 text-xs max-w-[220px]">
          <div className="font-medium text-gray-900 mb-1">{hoveredNode.label}</div>
          {(() => {
            const scheduleId = hoveredNode.id.replace('schedule-', '');
            const schedule = schedules.find(s => s.id === scheduleId);
            if (schedule) {
              return (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: hoveredNode.color }}></span>
                    <span className="text-gray-600">중요도: {getImportanceColorName(schedule.importance)}</span>
                  </div>
                  <div className="text-gray-600">
                    카테고리: {schedule.category}
                  </div>
                  <div className="text-gray-600">
                    날짜: {new Date(schedule.datetime).toLocaleDateString('ko-KR')}
                  </div>
                </>
              );
            }
            return null;
          })()}
        </div>
      )}
      
      {/* 범례 */}
      <div className="absolute top-2 right-2 bg-white bg-opacity-80 border border-gray-200 rounded-md p-2 text-xs">
        <div className="font-medium text-gray-700 mb-1">중요도</div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#dc2626]"></span>
            <span className="text-gray-600">높음</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ea580c]"></span>
            <span className="text-gray-600">중간</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb]"></span>
            <span className="text-gray-600">낮음</span>
          </div>
        </div>
      </div>
    </div>
  );
} 