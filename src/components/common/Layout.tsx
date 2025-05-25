"use client"

import { ReactNode, useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { token, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 클라이언트 사이드에서만 렌더링 확인
  useEffect(() => {
    setMounted(true);
  }, []);

  const isActivePath = (path: string) => {
    return pathname === path;
  };

  // 서버 사이드 렌더링과 클라이언트 사이드 렌더링의 차이를 방지하기 위한 초기 상태
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
        {/* 배경 장식 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl"></div>
        </div>

        <nav className="relative z-10 backdrop-blur-sm bg-white/90 border-b border-blue-200 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <div className="flex justify-between h-20">
              <div className="flex items-center">
                <div className="flex items-center">
                  <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Priorify</span>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <main className="relative z-10">{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
      {/* 배경 장식 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-50/20 rounded-full blur-3xl"></div>
      </div>

      <nav className="relative z-10 backdrop-blur-sm bg-white/90 border-b border-blue-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link href="/" className="flex items-center group">
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300 group-hover:scale-102">
                  Priorify
                </span>
              </Link>
              <div className="hidden sm:ml-12 sm:flex sm:space-x-10">
                <Link
                  href="/schedule"
                  className={`${
                    isActivePath('/schedule')
                      ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                      : 'border-transparent text-gray-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/30'
                  } inline-flex items-center px-4 py-2 border-b-2 text-sm font-semibold rounded-t-lg transition-all duration-300 ease-out`}
                  prefetch={true}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  일정 관리
                </Link>
                {token && (
                  <Link
                    href="/priority"
                    className={`${
                      isActivePath('/priority')
                        ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                        : 'border-transparent text-gray-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/30'
                    } inline-flex items-center px-4 py-2 border-b-2 text-sm font-semibold rounded-t-lg transition-all duration-300 ease-out`}
                    prefetch={true}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    우선순위 설정
                  </Link>
                )}
              </div>
            </div>
            <div className="hidden sm:flex sm:items-center sm:gap-4">
              {token ? (
                <>
                  <div className="flex items-center px-4 py-2 bg-blue-50/50 rounded-full border border-blue-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium text-blue-700">사용자</span>
                  </div>
                  <button
                    onClick={logout}
                    className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-200"
                  >
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    로그아웃
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                  prefetch={true}
                >
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  로그인
                </Link>
              )}
            </div>
            <div className="flex items-center sm:hidden">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-xl p-3 text-gray-400 hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all duration-300"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">메뉴 열기</span>
                <svg
                  className={`${mobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg
                  className={`${mobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        <div className={`${mobileMenuOpen ? 'block' : 'hidden'} sm:hidden backdrop-blur-sm bg-white/98 border-t border-blue-200`}>
          <div className="pt-4 pb-4 space-y-2 px-6">
            <Link
              href="/schedule"
              className={`${
                isActivePath('/schedule')
                  ? 'bg-blue-100 border-blue-500 text-blue-700'
                  : 'border-transparent text-gray-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700'
              } flex items-center pl-4 pr-4 py-3 border-l-4 text-base font-medium rounded-r-lg transition-all duration-300`}
              onClick={() => setMobileMenuOpen(false)}
              prefetch={true}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              일정 관리
            </Link>
            {token && (
              <Link
                href="/priority"
                className={`${
                  isActivePath('/priority')
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'border-transparent text-gray-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700'
                } flex items-center pl-4 pr-4 py-3 border-l-4 text-base font-medium rounded-r-lg transition-all duration-300`}
                onClick={() => setMobileMenuOpen(false)}
                prefetch={true}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                우선순위 설정
              </Link>
            )}
          </div>
          <div className="pt-4 pb-4 border-t border-blue-200 bg-blue-50/30">
            <div className="px-6 space-y-3">
              {token ? (
                <>
                  <div className="flex items-center px-4 py-2 bg-blue-100 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <span className="text-base font-medium text-blue-700">사용자</span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200"
                  >
                    <svg className="w-4 h-4 mr-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    로그아웃
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                  prefetch={true}
                >
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  로그인
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10">{children}</main>
    </div>
  );
}; 