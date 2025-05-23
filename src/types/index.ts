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
  | "자기개발"
  | "건강"
  | "애인"
  | "가족"
  | "고정비"
  | "친목"
  | "업무"
  | "구입"
  | "학교"
  | "자동차 정비"
  | "시험"
  | "여행"
  | "경제";

export const CATEGORIES: Category[] = [
  "가사", "취미", "자기개발", "건강", "애인",
  "가족", "고정비", "친목", "업무", "구입",
  "학교", "자동차 정비", "시험", "여행", "경제"
]; 