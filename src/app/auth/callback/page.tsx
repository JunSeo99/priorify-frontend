'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { authAPI } from '@/lib/api';

// 로딩 컴포넌트
const LoadingSpinner = () => (
  <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50">
    <div className="text-center">
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
        <svg className="h-6 w-6 text-blue-600 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900">로그인 처리 중...</h3>
      <p className="mt-1 text-sm text-gray-500">잠시만 기다려 주세요.</p>
    </div>
  </div>
);

// 실제 콜백 처리 컴포넌트
function AuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();
  
  useEffect(() => {
    // URL에서 code 파라미터 확인
    const code = searchParams.get('code');
    
    if (code) {
      const handleCallback = async () => {
        try {
          // 백엔드 서버에 코드 전송하여 토큰 받기
          const response = await authAPI.handleGoogleCallback(code);
          const token = response.headers.authorization?.replace('Bearer ', '') || 
                      response.data.token;
          const googleAccessToken = response.data.googleAccessToken;
          if (!token) throw new Error('토큰이 없습니다.');
          
          // 로그인 처리
          login(token, googleAccessToken, response.data.user || response.data);
          // 로그인 성공 후, 우선순위가 설정 되어있지 않다면 우선순위 페이지로 이동
          console.log(response.data);
          if (response.data.user.highPriorities.length === 0 || response.data.user.lowPriorities.length === 0) {
            router.push('/priority');
            return;
          }

          // 로그인 성공 후 리다이렉트
          router.push('/schedule');
        } catch (error) {
          console.error('구글 OAuth 콜백 처리 에러:', error);
          alert('인증에 실패했습니다.');
          router.push('/auth');
        }
      };
      
      handleCallback();
    } else {
      // 코드가 없으면 로그인 페이지로 돌아감
      router.push('/auth');
    }
  }, [searchParams, login, router]);
  
  return <LoadingSpinner />;
}

// 메인 페이지 컴포넌트
export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AuthCallbackHandler />
    </Suspense>
  );
} 