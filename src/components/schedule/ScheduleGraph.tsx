import { ResponsiveNetwork } from '@nivo/network';
import { Schedule } from '@/types';
import { useMemo } from 'react';

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
      return '#ef4444';
    case 'MEDIUM':
      return '#f59e0b';
    case 'LOW':
      return '#3b82f6';
    default:
      return '#6b7280';
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
  const { nodes, links } = useMemo(() => {
    const networkNodes: NetworkData[] = [];
    const networkLinks: NetworkLink[] = [];

    // 루트 노드 추가
    networkNodes.push({
      id: 'root',
      radius: 25,
      color: '#10b981',
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
      const radius = (combinedWeight / 100) * 20 + 8; // 8~28 사이의 크기

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
        distance: 180,
      });

      // 같은 카테고리의 다른 스케줄들과 연결
      categoryGroups[schedule.category].forEach((otherSchedule) => {
        if (otherSchedule.id !== schedule.id) {
          networkLinks.push({
            source: nodeId,
            target: `schedule-${otherSchedule.id}`,
            distance: 100,
          });
        }
      });
    });

    return { nodes: networkNodes, links: networkLinks };
  }, [schedules]);

  if (!schedules.length) {
    return <div className="flex items-center justify-center h-full text-gray-500">데이터가 없습니다</div>;
  }

  return (
    <div style={{ height: '100%', minHeight: '400px' }}>
      <ResponsiveNetwork
        data={{
          nodes,
          links,
        }}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        repulsivity={120}
        iterations={80}
        nodeColor="color"
        nodeBorderWidth={2}
        nodeBorderColor={{
          from: 'color',
          modifiers: [['darker', 0.3]],
        }}
        linkThickness={2}
        linkColor="#999"
        nodeSize={node => (node as NetworkData).radius || 10}
        motionConfig="gentle"
        onClick={(node) => {
          if (node.id !== 'root') {
            const schedule = schedules.find(s => `schedule-${s.id}` === node.id);
            if (schedule) {
              onCategoryClick(schedule.category);
            }
          }
        }}
      />
    </div>
  );
} 