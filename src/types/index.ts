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