import { create } from 'zustand';
import { Schedule } from '../types';

interface ScheduleState {
  schedules: Schedule[];
  addSchedule: (schedule: Schedule) => void;
  updateSchedule: (id: string, schedule: Partial<Schedule>) => void;
  deleteSchedule: (id: string) => void;
  setSchedules: (schedules: Schedule[]) => void;
}

export const useScheduleStore = create<ScheduleState>((set) => ({
  schedules: [],
  addSchedule: (schedule) =>
    set((state) => ({ schedules: [...state.schedules, schedule] })),
  updateSchedule: (id, schedule) =>
    set((state) => ({
      schedules: state.schedules.map((s) =>
        s.id === id ? { ...s, ...schedule } : s
      ),
    })),
  deleteSchedule: (id) =>
    set((state) => ({
      schedules: state.schedules.filter((s) => s.id !== id),
    })),
  setSchedules: (schedules) => set({ schedules }),
})); 