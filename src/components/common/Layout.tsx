"use client"

import { ReactNode } from 'react';
import { useAuthStore } from '@/store/auth'; // 오류: 모듈에 내보낸 멤버 'useAuthStore'이(가) 없습니다.
import { useRouter } from 'next/navigation';
import { Button } from './Button';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { token, logout } = useAuthStore();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Priorify</h1>
            </div>
            <div className="flex items-center space-x-4">
              {token ? (
                <>
                  <Button
                    variant="secondary"
                    onClick={() => router.push('/priority')}
                  >
                    우선순위 설정
                  </Button>
                  <Button variant="secondary" onClick={logout}>
                    로그아웃
                  </Button>
                </>
              ) : (
                <Button onClick={() => router.push('/auth')}>로그인</Button>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}; 