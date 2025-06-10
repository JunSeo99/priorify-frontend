import { create } from 'zustand';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  googleAccessToken: string | null;
  setUser: (user: User) => void;
  login: (token: string, user: User, googleAccessToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  googleAccessToken: typeof window !== 'undefined' ? localStorage.getItem('googleAccessToken') : null,
  setUser: (user) => set({ user }),
  login: (token, user, googleAccessToken) => {
    console.log('login 함수 호출됨:');
    console.log('- token:', token);
    console.log('- user:', user);
    console.log('- googleAccessToken:', googleAccessToken);
    console.log('- googleAccessToken type:', typeof googleAccessToken);
    
    localStorage.setItem('token', token);
    localStorage.setItem('googleAccessToken', typeof googleAccessToken === 'string' ? googleAccessToken : JSON.stringify(googleAccessToken));
    
    console.log('localStorage에 저장된 값들:');
    console.log('- token:', localStorage.getItem('token'));
    console.log('- googleAccessToken:', localStorage.getItem('googleAccessToken'));
    
    set({ token, user, googleAccessToken });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('googleAccessToken');
    set({ token: null, user: null, googleAccessToken: null });
  },
})); 