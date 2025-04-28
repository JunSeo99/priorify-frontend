import { create } from 'zustand';
import { Priority } from '../types';

interface PriorityState {
  highPriorities: Priority[];
  lowPriorities: Priority[];
  setHighPriorities: (priorities: Priority[]) => void;
  setLowPriorities: (priorities: Priority[]) => void;
}

export const usePriorityStore = create<PriorityState>((set) => ({
  highPriorities: [],
  lowPriorities: [],
  setHighPriorities: (priorities) => set({ highPriorities: priorities }),
  setLowPriorities: (priorities) => set({ lowPriorities: priorities }),
})); 