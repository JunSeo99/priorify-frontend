export interface User {
  userId: string;
  name: string;
  email: string;
}

export interface UserResponseDto {
  userId: string;
  name: string;
  email: string;
  message: string;
}

export interface Todo {
  id: string;
  title: string;
  description: string;
  priority: number;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Schedule {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  categories: string[];
  priority: number;
  status: string;
}

export interface Priority {
  category: string;
  rank: number;
}

export interface ScheduleDetail {
  title: string;
  priority: number;
  urgency: number;
  categoryWeight: number;
  status: string;
  startAt: string;
}

export interface CategoryStat {
  _id: string;
  totalSchedules: number;
  totalPriority: number;
  avgPriority: number;
  maxPriority: number;
  minPriority: number;
  avgUrgency: number;
  avgCategoryWeight: number;
  completedCount: number;
  completionRate: number;
  totalDuration: number;
  avgDuration: number;
  scheduleDetails: ScheduleDetail[];
}

export interface StatsSummary {
  totalSchedules: number;
  totalCompleted: number;
  overallCompletionRate: number;
  totalPriority: number;
  avgPriority: number;
  totalHours: number;
  avgHoursPerSchedule: number;
  totalCategories: number;
}

export interface PriorityDistribution {
  high: number;
  medium: number;
  low: number;
  highPercentage: number;
  mediumPercentage: number;
  lowPercentage: number;
}

export interface TimeBasedPriority {
  _id: {
    hour: number;
    dayOfWeek: number;
  };
  scheduleCount: number;
  avgPriority: number;
  totalPriority: number;
}

export interface CompletionStats {
  total: number;
  completed: number;
  active: number;
  completionRate: number;
}

export interface PrioritySettings {
  highPriorities: Array<{
    category: string;
    rank: number;
    weight: number;
  }>;
  lowPriorities: Array<{
    category: string;
    rank: number;
    weight: number;
  }>;
  defaultWeight: number;
}

export interface ComprehensiveStatistics {
  categoryStats: CategoryStat[];
  summary: StatsSummary;
  priorityDistribution: PriorityDistribution;
  timeBasedPriority: TimeBasedPriority[];
  completionStats: CompletionStats;
  prioritySettings: PrioritySettings;
}

export type Category =
  | "가사"
  | "취미"
  | "휴식"
  | "건강"
  | "미용"
  | "차량 관리"
  | "반려 동물"
  | "가족"
  | "연애"
  | "친목"
  | "업무"
  | "학업"
  | "시험"
  | "여행"
  | "경제"
  | "출장"
  | "구매"
  | "예약"
  | "정기 지출"
  | "재무"
  | "세금"
  | "봉사"
  | "통화"
  | "종교"
  | "치료";

export const CATEGORIES: Category[] = [
  "가사", "취미", "휴식", "건강", "미용",
  "차량 관리", "반려 동물", "가족", "연애", "친목",
  "업무", "학업", "시험", "여행", "경제",
  "출장", "구매", "예약", "정기 지출", "재무",
  "세금", "봉사", "통화", "종교", "치료"
]; 