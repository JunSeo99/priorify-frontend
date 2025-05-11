'use client';

import { useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import Image from 'next/image';
import Link from 'next/link';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
        };
        oauth2: {
          initCodeClient: (config: any) => {
            requestCode: () => void;
          };
        };
      };
    };
  }
}

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();

  // 구글 로그인 콜백 함수
  const handleGoogleResponse = useCallback(async (response: any) => {
    try {
      // 구글에서 받은 ID 토큰을 서버에 전송
      const googleResponse = await authAPI.googleLogin(response.credential);
      
      // 서버에서 JWT 토큰 받아오기
      const token = googleResponse.headers.authorization?.replace('Bearer ', '') || 
                    googleResponse.data.token;
                    
      if (!token) throw new Error('토큰이 없습니다.');
      
      // 로그인 처리
      login(token, googleResponse.data.user || googleResponse.data);
      
      // 로그인 성공 후 리다이렉트
      router.push('/schedule');
    } catch (error) {
      console.error('Google OAuth 인증 에러:', error);
      alert('구글 로그인에 실패했습니다.');
    }
  }, [login, router]);

  // URL 코드 파라미터 처리
  useEffect(() => {
    // URL에서 code 파라미터가 있는지 확인 (OAuth 콜백)
    const code = searchParams.get('code');
    
    if (code) {
      const handleCallback = async () => {
        try {
          const response = await authAPI.handleGoogleCallback(code);
          const token = response.headers.authorization?.replace('Bearer ', '') || 
                        response.data.token;
                        
          if (!token) throw new Error('토큰이 없습니다.');
          
          // 로그인 처리
          login(token, response.data.user || response.data);
          
          // 로그인 성공 후 리다이렉트
          router.push('/schedule');
        } catch (error) {
          console.error('Google OAuth 콜백 처리 에러:', error);
          alert('인증에 실패했습니다.');
        }
      };
      
      handleCallback();
    }
  }, [searchParams, login, router]);

  // 구글 OAuth 초기화
  useEffect(() => {
    // 구글 OAuth 스크립트 로딩
    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      
      script.onload = initializeGoogleAuth;
      
      return () => {
        document.body.removeChild(script);
      };
    } else {
      initializeGoogleAuth();
    }
    
    function initializeGoogleAuth() {
      if (window.google && window.google.accounts) {
        // 구글 리다이렉트 방식 OAuth 초기화
        const googleLoginButton = document.getElementById('google-signin-button');
        if (googleLoginButton) {
          googleLoginButton.addEventListener('click', () => {
            // 리다이렉트 방식 OAuth 시작
            window.google!.accounts.oauth2.initCodeClient({
              client_id: GOOGLE_CLIENT_ID,
              scope: 'email profile openid',
              redirect_uri: window.location.origin + '/auth/callback',
              ux_mode: 'redirect',
              select_account: true,
            }).requestCode();
          });
        }
      }
    }
  }, []);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
        <div className="h-96 w-96 rounded-full bg-blue-600/20 blur-3xl animate-pulse"></div>
        <div className="absolute right-10 bottom-10 h-72 w-72 rounded-full bg-indigo-600/20 blur-2xl"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white/90 backdrop-blur-lg shadow-2xl p-10 border border-gray-100">
        <div className="flex flex-col items-center mb-10">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
            <span className="text-2xl text-white">🚀</span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 drop-shadow-sm select-none">
            Priorify
          </h2>
          <p className="mt-2 text-center text-gray-600">
            구글 계정으로 간편하게 로그인하고<br/> 우선순위 기반 일정 관리를 시작해보세요!
          </p>
        </div>
        
        <div className="space-y-6">
          {/* 커스텀 구글 로그인 버튼 */}
          <button
            id="google-signin-button"
            className="w-full flex items-center justify-center py-3 px-4 rounded-lg bg-white border border-gray-300 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Image 
              src="/images/google-logo.svg" 
              alt="Google" 
              width={20} 
              height={20} 
              className="mr-2" 
            />
            <span className="text-gray-700 font-medium">Google 계정으로 로그인</span>
          </button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">또는</span>
            </div>
          </div>
          
          <button
            onClick={() => router.push('/')}
            className="transition-all duration-200 w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-base font-semibold text-white shadow-md hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            메인 페이지로 돌아가기
          </button>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>로그인 시 Priorify의 <Link href="/terms" className="text-blue-600 hover:text-blue-800">서비스 약관</Link>과 <Link href="/privacy" className="text-blue-600 hover:text-blue-800">개인정보 처리방침</Link>에 동의하게 됩니다.</p>
        </div>
      </div>
    </div>
  );
} 