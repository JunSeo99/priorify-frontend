'use client';

import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { Schedule } from '@/types';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';

// ForceGraph3D 동적 임포트
const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full w-full">
      <div className="text-sm text-gray-500">그래프 로딩 중...</div>
    </div>
  )
});

import SpriteText from 'three-spritetext';

interface ScheduleGraphProps {
  onCategoryClick: (category: string) => void;
  graphData: {
    nodes: Array<{
      id: string;
      label: string;
      type: 'user' | 'category' | 'schedule';
      level: number;
    }>;
    edges: Array<{
      source: string;
      target: string;
      type: 'user-category' | 'category-schedule';
    }>;
    schedules: Schedule[];
    metadata: {
      layoutType: string;
      userNodeColor: string;
      categoryNodeColor: string;
    };
  };
}

interface NetworkNode {
  id: string;
  name: string;
  val: number;
  color: string;
  categories?: string[];
  priority?: number;
  startDate?: string;
  endDate?: string;
  group?: string;
  x?: number;
  y?: number;
  z?: number;
  isHighPriority?: boolean;
  isHighlighted?: boolean;
}

interface NetworkLink {
  source: string;
  target: string;
  value: number;
  color?: string;
  distance?: number;
}

interface InternalGraphData {
  nodes: NetworkNode[];
  links: NetworkLink[];
}

// HSL 색상을 RGB로 변환하는 유틸리티 함수
const hslToRgb = (h: number, s: number, l: number) => {
  h /= 360;
  s /= 100;
  l /= 100;
  
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  
  const r = Math.round(hue2rgb(p, q, h + 1/3) * 255);
  const g = Math.round(hue2rgb(p, q, h) * 255);
  const b = Math.round(hue2rgb(p, q, h - 1/3) * 255);
  
  return { r, g, b };
};

// 고급 priority 색상 시스템
const getAdvancedPriorityColor = (priority: number, minPriority: number, maxPriority: number) => {
  const range = maxPriority - minPriority || 1;
  const normalized = (priority - minPriority) / range;
  const integerPart = Math.floor(priority);
  const decimalPart = priority - integerPart;
  
  // 기본 색상 구간 정의
  let baseHue, baseSaturation;
  
  if (normalized >= 0.7) {
    // 높은 우선순위: 빨간색 계열 (0-20도)
    baseHue = 0 + (20 * decimalPart);
    baseSaturation = 75 + (20 * decimalPart); // 75-95%
  } else if (normalized >= 0.4) {
    // 중간 우선순위: 주황색 계열 (20-60도)
    baseHue = 20 + (40 * decimalPart);
    baseSaturation = 70 + (15 * decimalPart); // 70-85%
  } else {
    // 낮은 우선순위: 파란색 계열 (200-240도)
    baseHue = 200 + (40 * decimalPart);
    baseSaturation = 60 + (20 * decimalPart); // 60-80%
  }
  
  // 소수점에 따른 명도 조절 (더 높은 소수점 = 더 진한 색)
  const lightness = normalized >= 0.7 ? 
    45 - (15 * decimalPart) : // 높은 우선순위: 30-45%
    normalized >= 0.4 ? 
      50 - (10 * decimalPart) : // 중간: 40-50%
      60 - (10 * decimalPart);   // 낮은: 50-60%
  
  const rgb = hslToRgb(baseHue, baseSaturation, lightness);
  
  return {
    rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    rgba: (alpha: number) => `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`,
    hex: `#${rgb.r.toString(16).padStart(2, '0')}${rgb.g.toString(16).padStart(2, '0')}${rgb.b.toString(16).padStart(2, '0')}`,
    raw: rgb,
    intensity: decimalPart,
    normalized
  };
};

// 우선순위에 따른 색상 (향상된 버전)
const getPriorityColor = (priority: number, minPriority: number = 1, maxPriority: number = 10, alpha: number = 1) => {
  const colorData = getAdvancedPriorityColor(priority, minPriority, maxPriority);
  return colorData.rgba(alpha);
};

// 우선순위 그라데이션 색상
const getPriorityGlowColor = (priority: number, minPriority: number = 1, maxPriority: number = 10) => {
  const colorData = getAdvancedPriorityColor(priority, minPriority, maxPriority);
  const { raw, intensity } = colorData;
  
  // 소수점 기반으로 그라데이션 강도 조절
  const primaryColor = `rgb(${raw.r}, ${raw.g}, ${raw.b})`;
  const secondaryColor = `rgb(${Math.min(255, raw.r + 30)}, ${Math.min(255, raw.g + 30)}, ${Math.min(255, raw.b + 30)})`;
  
  return [primaryColor, secondaryColor];
};

// 우선순위 텍스트 (향상된 버전)
const getAdvancedPriorityText = (priority: number, minPriority: number = 1, maxPriority: number = 10) => {
  const range = maxPriority - minPriority || 1;
  const normalized = (priority - minPriority) / range;
  const decimalPart = priority - Math.floor(priority);
  
  if (normalized >= 0.7) {
    return decimalPart >= 0.7 ? '최우선' : decimalPart >= 0.3 ? '긴급' : '높음';
  }
  if (normalized >= 0.4) {
    return decimalPart >= 0.7 ? '중요' : decimalPart >= 0.3 ? '보통+' : '보통';
  }
  return decimalPart >= 0.7 ? '여유' : decimalPart >= 0.3 ? '낮음+' : '낮음';
};

// 마감일 가중치 계산
const getTimeWeight = (endDate: string) => {
  const now = new Date();
  const dueDate = new Date(endDate);
  const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 0) return 1.8;
  if (diffDays <= 1) return 1.6;
  if (diffDays <= 3) return 1.4;
  if (diffDays <= 7) return 1.2;
  if (diffDays <= 14) return 1.1;
  return 1;
};

// 카테고리 색상
const CATEGORY_COLORS: Record<string, string> = {
  '가사': '#8b5cf6',
  '취미': '#ec4899',
  '자기개발': '#06b6d4',
  '건강': '#10b981',
  '애인': '#f43f5e',
  '가족': '#8b5cf6',
  '고정비': '#6366f1',
  '친목': '#0ea5e9',
  '업무': '#3b82f6',
  '구입': '#d946ef',
  '학교': '#4f46e5',
  '자동차 정비': '#f97316',
  '시험': '#ef4444',
  '여행': '#10b981',
  '경제': '#84cc16',
};

const DEFAULT_COLORS = [
  '#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f97316', 
  '#6366f1', '#0ea5e9', '#f59e0b', '#14b8a6', '#ef4444',
  '#22c55e', '#3b82f6', '#a855f7', '#f43f5e', '#0891b2'
];

const getCategoryColor = (category: string) => {
  return CATEGORY_COLORS[category] || DEFAULT_COLORS[Math.abs(hashCode(category)) % DEFAULT_COLORS.length];
};

const hashCode = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
};

function ScheduleGraphComponent({ onCategoryClick, graphData }: ScheduleGraphProps) {
  const graphRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<NetworkNode | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);
  const [showFocusControls, setShowFocusControls] = useState(false);
  const [internalGraphData, setInternalGraphData] = useState<InternalGraphData>({ nodes: [], links: [] });
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const schedules = graphData?.schedules || [];
  
  // Priority 통계 계산 (MinMax 스케일러용)
  const priorityStats = useMemo(() => {
    if (schedules.length === 0) return { min: 1, max: 10, range: 9 };
    
    const priorities = schedules.map(s => s.priority);
    const min = Math.min(...priorities);
    const max = Math.max(...priorities);
    const range = max - min || 1;
    
    return { min, max, range };
  }, [schedules]);

  // 우선순위 가중치 (소수점 고려) - 컴포넌트 내부로 이동
  const getPriorityWeight = useCallback((priority: number) => {
    const normalized = (priority - priorityStats.min) / priorityStats.range;
    const decimalPart = priority - Math.floor(priority);
    
    const baseWeight = normalized >= 0.7 ? 2.5 : normalized >= 0.4 ? 2.0 : 1.5;
    return baseWeight + (0.5 * decimalPart); // 소수점에 따른 추가 가중치
  }, [priorityStats]);

  // 컨테이너 크기 측정
  const updateDimensions = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    if (!containerRef.current) {
      if (dimensions.width === 0 || dimensions.height === 0) {
        setDimensions({ width: 800, height: 600 });
      }
      return;
    }
    
    const { width, height } = containerRef.current.getBoundingClientRect();
    
    if (width > 10 && height > 10) {
      setDimensions(prev => {
        if (prev.width === width && prev.height === height) {
          return prev;
        }
        return { width, height };
      });
    } else if (dimensions.width === 0 || dimensions.height === 0) {
      setDimensions({ width: 800, height: 600 });
    }
  }, [dimensions.width, dimensions.height]);
  
  // 초기 마운트
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    setIsMounted(true);
    
    const initTimer = setTimeout(() => {
      updateDimensions();
    }, 100);
    
    return () => {
      clearTimeout(initTimer);
    };
  }, [updateDimensions]);
  
  // 리사이즈 이벤트 처리
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    window.addEventListener('resize', updateDimensions);
    
    const intervalCheck = setInterval(() => {
      if (dimensions.width === 0 || dimensions.height === 0) {
        updateDimensions();
      }
    }, 1000);
    
    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener('resize', updateDimensions);
      clearInterval(intervalCheck);
    };
  }, [updateDimensions, dimensions.width, dimensions.height]);
  
  // 그래프 크기 조정
  const handleResize = useCallback(() => {
    if (typeof window === 'undefined' || !graphRef.current) return;
    
    try {
      const width = Math.max(300, dimensions.width);
      const height = Math.max(300, dimensions.height);
      
      graphRef.current.width(width);
      graphRef.current.height(height);
      
      if (graphRef.current.centerAt) {
        graphRef.current.centerAt(0, 0, 0);
      }
      
      if (graphRef.current.zoomToFit) {
        graphRef.current.zoomToFit(500, 30);
      }
    } catch (error) {
      console.error('그래프 크기 조정 중 오류:', error);
    }
  }, [dimensions.width, dimensions.height]);

  useEffect(() => {
    if (!isMounted || !graphRef.current) return;
    
    if (dimensions.width >= 10 && dimensions.height >= 10) {
      handleResize();
      
      const timer = setTimeout(() => {
        try {
          if (graphRef.current) {
            const charge = graphRef.current.d3Force('charge');
            const link = graphRef.current.d3Force('link');
            
            if (charge) charge.strength(-180);
            if (link) link.distance((link: NetworkLink) => link.value * 20);
            
            highlightHighPriorityNodes();
          }
        } catch (error) {
          console.error('그래프 초기화 중 오류:', error);
        }
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [dimensions, handleResize, isMounted]);
  
  // 높은 우선순위 일정 강조
  const highlightHighPriorityNodes = () => {
    if (typeof window === 'undefined') return;
    
    try {
      if (!graphRef.current) return;
      
      const normalizedThreshold = 0.7; // 상위 30%
      const highPrioritySchedules = schedules.filter(s => {
        const normalized = (s.priority - priorityStats.min) / priorityStats.range;
        return normalized >= normalizedThreshold;
      });
      
      if (highPrioritySchedules.length > 0) {
        const fov = graphRef.current._camera?.fov || 45;
        if (graphRef.current._camera) {
          graphRef.current._camera.fov = Math.max(35, fov - 5);
          graphRef.current._camera.updateProjectionMatrix();
        }
        
        graphRef.current.cameraPosition({ 
          x: 100,
          y: 50, 
          z: 300
        }, { x: 0, y: 0, z: 0 }, 1000);
      }
    } catch (error) {
      console.error('중요 일정 강조 중 오류:', error);
    }
  };
  
  // 최고 우선순위 스케줄 (향상된 버전)
  const highestPrioritySchedule = useMemo(() => {
    if (!Array.isArray(schedules) || schedules.length === 0) return null;

    const normalizedThreshold = 0.7;
    const highPrioritySchedules = schedules.filter(s => {
      if (!s || typeof s.priority !== 'number') return false;
      const normalized = (s.priority - priorityStats.min) / priorityStats.range;
      return normalized >= normalizedThreshold;
    });
    
    if (highPrioritySchedules.length > 0) {
      return highPrioritySchedules.sort((a, b) => {
        // 먼저 priority로 정렬, 그 다음 마감일로 정렬
        if (b.priority !== a.priority) {
          return b.priority - a.priority;
        }
        const dateA = new Date(a.endDate);
        const dateB = new Date(b.endDate);
        return dateA.getTime() - dateB.getTime();
      })[0];
    }
    
    return null;
  }, [schedules, priorityStats]);

  // 그래프 데이터 생성 (향상된 색상 시스템 적용)
  const computedGraphData: InternalGraphData = useMemo(() => {
    if (!Array.isArray(schedules) || schedules.length === 0) {
      return { nodes: [], links: [] };
    }
    
    const nodes: NetworkNode[] = [];
    const links: NetworkLink[] = [];
    
    try {
      const validSchedules = schedules.filter(s => s && s.id && s.title);
      
      if (validSchedules.length === 0) {
        return { nodes: [], links: [] };
      }
      
      // 모든 카테고리 수집
      const categoriesSet = new Set<string>();
      validSchedules.forEach(s => {
        if (s.categories && s.categories.length > 0) {
          s.categories.forEach(cat => categoriesSet.add(cat));
        } else {
          categoriesSet.add('기타');
        }
      });
      const categories = Array.from(categoriesSet);
      
      // 높은 우선순위 카테고리 (MinMax 기반)
      const highPrioritySchedules = validSchedules.filter(s => {
        const normalized = (s.priority - priorityStats.min) / priorityStats.range;
        return normalized >= 0.7;
      });
      const highPriorityCategories = new Set<string>();
      highPrioritySchedules.forEach(s => {
        if (s.categories && s.categories.length > 0) {
          s.categories.forEach(cat => highPriorityCategories.add(cat));
        } else {
          highPriorityCategories.add('기타');
        }
      });
      
      // 루트 노드
      nodes.push({
        id: 'root',
        name: '일정 관리',
        val: 6,
        color: isDark ? '#60a5fa' : '#3b82f6',
        group: 'root'
      });
      
      // 카테고리 노드
      categories.forEach(category => {
        const categoryId = `category-${category}`;
        const categorySchedules = validSchedules.filter(s => 
          (s.categories && s.categories.includes(category)) || 
          (!s.categories || s.categories.length === 0) && category === '기타'
        );
        
        const isHighPriority = highPriorityCategories.has(category);
        const categorySize = Math.max(3.5, Math.min(6.0, 
          categorySchedules.length / 2 + (isHighPriority ? 3.5 : 2.5)));
        
        nodes.push({
          id: categoryId,
          name: category,
          val: categorySize,
          color: getCategoryColor(category),
          group: 'category',
          categories: [category],
          isHighPriority
        });
        
        links.push({
          source: 'root',
          target: categoryId,
          value: isHighPriority ? 7 : 5,
          color: getCategoryColor(category)
        });
      });
      
      // 일정 노드 (향상된 색상 시스템 적용)
      validSchedules.forEach(schedule => {
        const nodeId = `schedule-${schedule.id}`;
        const scheduleCategories = (schedule.categories && schedule.categories.length > 0) 
          ? schedule.categories 
          : ['기타'];
        const priority = schedule.priority || 1;
        const timeWeight = getTimeWeight(schedule.endDate);
        const priorityWeight = getPriorityWeight(priority);
        
        const size = timeWeight * priorityWeight * (priority >= priorityStats.min + (priorityStats.range * 0.7) ? 1.2 : 1);
        
        nodes.push({
          id: nodeId,
          name: schedule.title,
          val: size,
          color: getPriorityColor(priority, priorityStats.min, priorityStats.max),
          group: 'schedule',
          categories: scheduleCategories,
          priority: priority,
          startDate: schedule.startDate,
          endDate: schedule.endDate
        });
        
        // 각 카테고리와 연결
        scheduleCategories.forEach(category => {
          const normalized = (priority - priorityStats.min) / priorityStats.range;
          links.push({
            source: `category-${category}`,
            target: nodeId,
            value: normalized >= 0.7 ? 3 : 2,
            color: getPriorityColor(priority, priorityStats.min, priorityStats.max, 0.6)
          });
        });
      });
      
      // 같은 우선순위 일정 간 연결 (향상된 버전)
      const processedLinks = new Set<string>();
      
      validSchedules.forEach(schedule => {
        const nodeId = `schedule-${schedule.id}`;
        const priority = schedule.priority || 1;
        
        const samePrioritySchedules = validSchedules.filter(s => 
          s.id !== schedule.id && Math.abs(s.priority - priority) <= 0.5 // 더 세밀한 기준
        );
        
        const maxLinks = 2;
        const randomSchedules = samePrioritySchedules
          .sort(() => 0.5 - Math.random())
          .slice(0, maxLinks);
        
        randomSchedules.forEach(otherSchedule => {
          const linkKey1 = `${schedule.id}-${otherSchedule.id}`;
          const linkKey2 = `${otherSchedule.id}-${schedule.id}`;
          
          if (!processedLinks.has(linkKey1) && !processedLinks.has(linkKey2)) {
            links.push({
              source: nodeId,
              target: `schedule-${otherSchedule.id}`,
              value: 1,
              color: getPriorityColor(priority, priorityStats.min, priorityStats.max, 0.2)
            });
            
            processedLinks.add(linkKey1);
          }
        });
      });
    } catch (error) {
      console.error('그래프 데이터 생성 중 오류:', error);
    }
    
    return { nodes, links };
  }, [schedules, isDark, priorityStats]);
  
  // 그래프 데이터 상태 업데이트
  useEffect(() => {
    setInternalGraphData(computedGraphData);
  }, [computedGraphData]);

  // 노드 포커스
  const focusOnNode = useCallback((nodeId: string | null) => {
    if (!graphRef.current || !nodeId) return;
    
    try {
      setHighlightedNodeId(nodeId);
      
      setInternalGraphData(prev => {
        const updatedNodes = prev.nodes.map(node => ({
          ...node,
          isHighlighted: node.id === nodeId
        }));
        
        return {
          ...prev,
          nodes: updatedNodes
        };
      });
      
      const node = internalGraphData.nodes.find(n => n.id === nodeId);
      
      if (!node) return;
      
      const distance = 150;
      const distRatio = 1 + distance / Math.hypot(node.x || 0, node.y || 0, node.z || 0);
      
      graphRef.current.cameraPosition(
        { x: (node.x || 0) * distRatio, y: (node.y || 0) * distRatio, z: (node.z || 0) * distRatio },
        node,
        1500
      );
    } catch (error) {
      console.error('노드 포커스 중 오류:', error);
    }
  }, [internalGraphData]);
  
  // 포커스 해제
  const clearFocus = useCallback(() => {
    if (!graphRef.current) return;
    
    try {
      setHighlightedNodeId(null);
      
      setInternalGraphData(prev => {
        const updatedNodes = prev.nodes.map(node => ({
          ...node,
          isHighlighted: false
        }));
        
        return {
          ...prev,
          nodes: updatedNodes
        };
      });
      
      graphRef.current.cameraPosition(
        { x: 0, y: 0, z: 500 },
        { x: 0, y: 0, z: 0 },
        1000
      );
      
      setTimeout(() => {
        if (graphRef.current?.zoomToFit) {
          graphRef.current.zoomToFit(500, 40);
        }
      }, 1100);
    } catch (error) {
      console.error('포커스 해제 중 오류:', error);
    }
  }, []);

  useEffect(() => {
    setShowFocusControls(!!highestPrioritySchedule);
  }, [highestPrioritySchedule]);

  if (!isMounted) {
    return (
      <div className="relative h-full w-full min-h-[400px] flex items-center justify-center" ref={containerRef}>
        <div className="text-sm text-gray-500">그래프 컴포넌트 초기화 중...</div>
      </div>
    );
  }
  
  if (!schedules.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full gap-4 py-8" ref={containerRef}>
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

  return (
    <div className="relative h-full w-full" ref={containerRef} style={{ height: '100%', width: '100%', minHeight: '400px' }}>
      <ForceGraph3D
        ref={graphRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={internalGraphData}
        nodeLabel={node => node ? String(node.name || '') : ''}
        backgroundColor={isDark ? '#111827' : '#f8fafc'}
        nodeThreeObject={(node: NetworkNode) => {
          try {
            if (!node) return null;
            
            const nodeName = typeof node.name === 'string' ? node.name : '';
            const sprite = new SpriteText(nodeName);
            
            if (node.group === 'root') {
              sprite.color = '#ffffff';
              sprite.textHeight = 10;
              sprite.backgroundColor = node.color || '#3b82f6';
              sprite.padding = 5;
              sprite.borderRadius = 6;
              sprite.fontWeight = '800';
              sprite.fontFace = '"Pretendard", "Inter", system-ui, sans-serif';
              sprite.strokeWidth = 0.7;
              sprite.strokeColor = isDark ? '#000000' : '#ffffff';
            } else if (node.group === 'category') {
              sprite.color = '#ffffff';
              sprite.textHeight = node.isHighPriority ? 8 : 7;
              sprite.backgroundColor = node.color || getCategoryColor(node.categories?.[0] || '');
              sprite.padding = node.isHighPriority ? 4.5 : 4;
              sprite.borderRadius = 5;
              sprite.fontWeight = node.isHighPriority ? '800' : '700';
              sprite.fontFace = '"Pretendard", "Inter", system-ui, sans-serif';
              sprite.strokeWidth = 0.6;
              sprite.strokeColor = 'rgba(0,0,0,0.5)';
            } else {
              // 스케줄 노드의 고급 스타일링
              const priority = node.priority || 1;
              const normalized = (priority - priorityStats.min) / priorityStats.range;
              const decimalPart = priority - Math.floor(priority);
              
              sprite.textHeight = normalized >= 0.7 ? 
                6.5 + (decimalPart * 1) : // 6.5-7.5
                5.5 + (decimalPart * 0.5); // 5.5-6.0
              sprite.fontFace = '"Pretendard", "Inter", system-ui, sans-serif';
              
              if (node.isHighlighted) {
                sprite.backgroundColor = isDark ? 'rgba(239, 68, 68, 0.95)' : 'rgba(239, 68, 68, 0.98)';
                sprite.padding = 4.5 + (decimalPart * 0.5);
                sprite.color = '#ffffff';
                sprite.textHeight = 7 + (decimalPart * 0.5);
              } else if (normalized >= 0.7) {
                const colorData = getAdvancedPriorityColor(priority, priorityStats.min, priorityStats.max);
                sprite.backgroundColor = colorData.rgba(0.9 + (decimalPart * 0.1));
                sprite.padding = 4 + (decimalPart * 0.5);
                sprite.color = '#ffffff';
              } else {
                sprite.backgroundColor = isDark ? 'rgba(100, 116, 139, 0.8)' : 'rgba(255, 255, 255, 0.95)';
                sprite.color = isDark ? '#ffffff' : '#1e293b';
                sprite.padding = 3.5 + (decimalPart * 0.3);
              }
              
              sprite.borderRadius = 5;
              sprite.fontWeight = normalized >= 0.7 ? 
                `${700 + (decimalPart * 100)}` : 
                `${600 + (decimalPart * 50)}`;
              sprite.strokeWidth = 0.5 + (decimalPart * 0.3);
              sprite.strokeColor = isDark ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.3)';
            }
            
            return sprite;
          } catch (error) {
            console.error('노드 렌더링 중 오류:', error);
            return null;
          }
        }}
        nodeThreeObjectExtend={false}
        nodeRelSize={6.5}
        nodeOpacity={0.8}
        nodeColor={(node: NetworkNode) => {
          try {
            if (!node) return '#666666';
            
            if (node.isHighlighted) {
              return '#ef4444';
            }
            
            if (node.group === 'schedule' && node.priority) {
              const glowColors = getPriorityGlowColor(node.priority, priorityStats.min, priorityStats.max);
              return glowColors[0];
            }
            return node.color || '#666666';
          } catch (error) {
            console.error('노드 색상 설정 중 오류:', error);
            return '#666666';
          }
        }}
        nodeVal={(node: NetworkNode) => {
          try {
            if (!node) return 1;
            
            if (node.isHighlighted) {
              return (node.val || 1) * 1.5;
            }
            
            if (node.group === 'schedule' && node.priority) {
              const normalized = (node.priority - priorityStats.min) / priorityStats.range;
              const decimalPart = node.priority - Math.floor(node.priority);
              
              if (normalized >= 0.7) {
                return (node.val || 1) * (1.3 + (decimalPart * 0.2));
              }
            } else if (node.group === 'category' && node.isHighPriority) {
              return (node.val || 1) * 1.2;
            }
            return node.val || 1;
          } catch (error) {
            console.error('노드 크기 설정 중 오류:', error);
            return 1;
          }
        }}
        linkColor={(link: NetworkLink) => {
          try {
            return link && link.color ? link.color : 'rgba(180, 180, 180, 0.2)';
          } catch (error) {
            console.error('링크 색상 설정 중 오류:', error);
            return 'rgba(180, 180, 180, 0.2)';
          }
        }}
        linkWidth={(link: NetworkLink) => {
          try {
            return link && link.value ? link.value * 0.3 : 0.5;
          } catch (error) {
            console.error('링크 너비 설정 중 오류:', error);
            return 0.5;
          }
        }}
        linkOpacity={0.25}
        linkCurvature={0.12}
        linkDirectionalParticles={0}
        linkDirectionalParticleSpeed={0}
        nodeResolution={32}
        d3VelocityDecay={0.35}
        d3AlphaDecay={0.03}
        cooldownTicks={120}
        cooldownTime={2500}
        
        rendererConfig={{
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true,
          powerPreference: 'high-performance'
        }}
        
        enableNodeDrag={true}
        enableNavigationControls={true}
        showNavInfo={false}
        controlType="orbit"
        
        onNodeHover={(node: NetworkNode | null) => {
          setHoveredNode(node);
          try {
            const scene = graphRef.current?.scene?.();
            if (scene && scene.canvas && scene.canvas.style) {
              scene.canvas.style.cursor = node ? 'pointer' : 'default';
            }
          } catch (error) {
            console.error('커서 스타일 설정 중 오류:', error);
          }
        }}
        onNodeClick={(node: NetworkNode) => {
          if (node.group === 'category' && node.categories?.[0]) {
            onCategoryClick(node.categories[0]);
          } else if (node.group === 'schedule' && node.categories?.[0]) {
            onCategoryClick(node.categories[0]);
          } else if (node.group === 'root' && graphRef.current?.zoomToFit) {
            try {
              graphRef.current.centerAt(0, 0, 0);
              graphRef.current.zoomToFit(500, 50);
            } catch (error) {
              console.error('줌 아웃 중 오류:', error);
            }
          }
          
          try {
            if (node.group !== 'root' && graphRef.current?.cameraPosition) {
              const distance = 120;
              const distRatio = 1 + distance / Math.hypot(node.x || 0, node.y || 0, node.z || 0);
              graphRef.current.cameraPosition(
                { x: (node.x || 0) * distRatio, y: (node.y || 0) * distRatio, z: (node.z || 0) * distRatio },
                node,
                1000
              );
            }
          } catch (error) {
            console.error('카메라 이동 중 오류:', error);
          }
        }}
      />
      
      {/* 로딩 오버레이 */}
      {(dimensions.width < 10 || dimensions.height < 10) && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <div className="text-sm text-gray-500">그래프 영역 계산 중...</div>
            <button 
              onClick={() => {
                setDimensions({ width: 800, height: 600 });
                setTimeout(() => updateDimensions(), 100);
              }}
              className="mt-4 px-4 py-2 text-xs bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
            >
              다시 시도
            </button>
          </div>
        </div>
      )}

      {/* 호버 툴팁 (향상된 버전) */}
      {hoveredNode && (
        <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 rounded-xl p-4 text-sm max-w-[320px] z-10 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95 transition-all duration-200">
          <div className="font-semibold text-gray-900 dark:text-white mb-2 text-base">{hoveredNode.name}</div>
          {hoveredNode.group === 'schedule' && (
            <>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: hoveredNode.color }}></span>
                <span className="text-gray-700 dark:text-gray-300">
                  우선순위: {getAdvancedPriorityText(hoveredNode.priority || 1, priorityStats.min, priorityStats.max)}
                  <span className="ml-1 text-xs font-mono">({hoveredNode.priority?.toFixed(1)})</span>
                </span>
              </div>
              <div className="mb-2 text-xs text-gray-500">
                <span>정규화 값: {(((hoveredNode.priority || 1) - priorityStats.min) / priorityStats.range)?.toFixed(3)}</span>
                <span className="ml-2">소수점: {((hoveredNode.priority || 1) % 1)?.toFixed(3)}</span>
              </div>
              {hoveredNode.categories && hoveredNode.categories.length > 0 && (
                <div className="mb-2">
                  <span className="text-gray-700 dark:text-gray-300 text-xs">카테고리:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {hoveredNode.categories.map((category, index) => (
                      <span 
                        key={category}
                        className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium"
                        style={{ 
                          backgroundColor: getCategoryColor(category) + '20',
                          color: getCategoryColor(category)
                        }}
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {hoveredNode.startDate && (
                <div className="text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{hoveredNode.startDate} ~ {hoveredNode.endDate}</span>
                </div>
              )}
            </>
          )}
          {hoveredNode.group === 'category' && (
            <div className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>이 카테고리의 일정을 보려면 클릭하세요</span>
            </div>
          )}
        </div>
      )}
      
      {/* 향상된 범례 */}
      <div className="absolute top-2 left-2 bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 shadow-lg border border-gray-100 dark:border-gray-700 rounded-xl p-4 text-xs z-10 backdrop-blur-sm">
        <div className="font-medium text-gray-800 dark:text-white mb-3 text-sm">우선순위 색상 스케일</div>
        <div className="mb-2 text-xs text-gray-500">
          범위: {priorityStats.min.toFixed(1)} ~ {priorityStats.max.toFixed(1)}
        </div>
        <div className="flex flex-col gap-2">
          {[0.9, 0.6, 0.3].map(normalizedValue => {
            const samplePriority = priorityStats.min + (normalizedValue * priorityStats.range);
            const colorData = getAdvancedPriorityColor(samplePriority, priorityStats.min, priorityStats.max);
            return (
              <div key={normalizedValue} className="flex items-center gap-2">
                <span 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: colorData.rgb }}
                ></span>
                <span className="text-gray-700 dark:text-gray-300">
                  {getAdvancedPriorityText(samplePriority, priorityStats.min, priorityStats.max)}
                  <span className="ml-1 text-xs opacity-70">({samplePriority.toFixed(1)})</span>
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600 text-xs text-gray-500">
          💡 소수점이 높을수록 더 진한 색상
        </div>
      </div>
      
      {/* 컨트롤 버튼 */}
      <div className="absolute bottom-4 left-4 flex gap-2 z-10">
        <button 
          onClick={() => {
            try {
              if (graphRef.current) {
                graphRef.current.centerAt(0, 0, 0);
                graphRef.current.zoomToFit(500, 50);
              }
            } catch (error) {
              console.error('전체 보기 중 오류:', error);
            }
          }} 
          className="p-2.5 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 border border-gray-100 dark:border-gray-700"
          title="전체 보기"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 110-2h4a1 1 0 011 1v4a1 1 0 11-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 112 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 110 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 110-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>
        
        {/* 우선순위 높은 일정 포커스 */}
        {showFocusControls && (
          <div className="flex gap-2">
            <button 
              onClick={() => {
                if (highestPrioritySchedule && highestPrioritySchedule.id) {
                  focusOnNode(`schedule-${highestPrioritySchedule.id}`);
                }
              }} 
              className={`p-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border ${
                highlightedNodeId ? 'bg-red-500 border-red-600 text-white' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-900'
              }`}
              title={`최우선 일정 보기 (${highestPrioritySchedule?.priority.toFixed(1)})`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${highlightedNodeId ? 'text-white' : 'text-red-500 dark:text-red-400'}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </button>
            
            {highlightedNodeId && (
              <button 
                onClick={clearFocus} 
                className="p-2.5 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 border border-gray-100 dark:border-gray-700"
                title="포커스 해제"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* 최우선 일정 정보 패널 (향상된 버전) */}
      {highlightedNodeId && highestPrioritySchedule && (
        <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 rounded-xl p-4 max-w-[300px] z-10 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
          <div className="flex items-center gap-2 mb-1">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ 
                backgroundColor: getPriorityColor(highestPrioritySchedule.priority, priorityStats.min, priorityStats.max) 
              }}
            ></div>
            <h3 className="font-bold text-gray-900 dark:text-white">
              {getAdvancedPriorityText(highestPrioritySchedule.priority, priorityStats.min, priorityStats.max)} 일정
            </h3>
          </div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{highestPrioritySchedule.title}</h4>
          <div className="mb-2 text-xs text-gray-500">
            <span>우선순위: {highestPrioritySchedule.priority.toFixed(1)}</span>
            <span className="ml-2">정규화: {((highestPrioritySchedule.priority - priorityStats.min) / priorityStats.range).toFixed(3)}</span>
          </div>
          <div className="flex items-center gap-2 mb-2 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-gray-700 dark:text-gray-300">
              {highestPrioritySchedule.startDate} ~ {highestPrioritySchedule.endDate}
            </span>
          </div>
          {highestPrioritySchedule.categories && highestPrioritySchedule.categories.length > 0 && (
            <div className="mb-2">
              <div className="flex flex-wrap gap-1">
                {highestPrioritySchedule.categories.map((category, index) => (
                  <span 
                    key={category}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                    style={{ 
                      backgroundColor: getCategoryColor(category) + '20',
                      color: getCategoryColor(category)
                    }}
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export const ScheduleGraph = ScheduleGraphComponent;
export default ScheduleGraphComponent; 