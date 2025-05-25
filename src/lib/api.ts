import axios from 'axios';
import { Priority, Schedule } from '../types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true
});

// JWT 인터셉터
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auth API
export const authAPI = {
  // 구글 OAuth 인증 처리
  googleLogin: (idToken: string) => {
    return api.post('/api/auth/google', { idToken });
  },
  
  // 구글 OAuth 콜백 처리
  handleGoogleCallback: (code: string) =>
    api.get(`/api/auth/oauth2/callback/google?code=${code}`),
    
  // 기존 로그인 메서드 (사용하지 않지만 참조를 위해 유지)
  signup: (data: { name: string; password: string; passwordConfirm: string }) =>
    api.post('/api/auth/signup', data),
  login: (data: { name: string; password: string }) =>
    api.post('/api/auth/login', data),
};

// Priority API
export const priorityAPI = {
  setPriorities: (highPriorities: Priority[], lowPriorities: Priority[]) =>
    api.post('/api/priorities', { highPriorities, lowPriorities }),
  getPriorities: () =>
    api.get(`/api/priorities`),
};

// Schedule API
export const scheduleAPI = {
  createSchedule: (schedule: Omit<Schedule, 'id'>) =>
    api.post('/api/schedules', schedule),
  updateSchedule: (id: string, schedule: Partial<Schedule>) =>
    api.put(`/api/schedules/${id}`, schedule),
  deleteSchedule: (id: string) =>
    api.delete(`/api/schedules/${id}`),
  getSchedules: () =>
    api.get('/api/schedules'),
  getSchedulesByRange: (start: string, end: string) =>
    api.get('/api/schedules/range', { params: { start, end } }),
  toggleCompletion: (id: string) =>
    api.patch(`/api/schedules/${id}/toggle-completion`),
  getGraphData: () =>
    api.get('/api/schedules/graph'),
};

export default api; 