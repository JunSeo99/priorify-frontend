'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { User } from '@/types';

interface AuthFormData {
  name: string;
  password: string;
  passwordConfirm?: string;
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();
  const { login } = useAuthStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AuthFormData>();

  const onSubmit = async (data: AuthFormData) => {
    try {
      if (isLogin) {
        const response = await authAPI.login({
          name: data.name,
          password: data.password,
        });
        const token = response.headers.authorization?.replace('Bearer ', '');
        if (!token) throw new Error('토큰이 없습니다.');
        login(token, response.data);
        router.push('/schedule');
      } else {
        const response = await authAPI.signup({
          name: data.name,
          password: data.password,
          passwordConfirm: data.passwordConfirm!,
        });
        const token = response.headers.authorization?.replace('Bearer ', '');
        if (!token) throw new Error('토큰이 없습니다.');
        console.log(token);
        login(token, response.data);
        router.push('/priority');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      alert('인증에 실패했습니다.');
    }
  };

  return (
  <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-tr from-[#181C2F] via-[#23243a] to-[#15161D] overflow-hidden">
    {/* Decorative dark background shapes */}
    <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center">
      <div className="h-96 w-96 rounded-full bg-indigo-900/30 blur-3xl animate-pulse"></div>
      <div className="absolute right-10 bottom-10 h-72 w-72 rounded-full bg-purple-900/40 blur-2xl"></div>
    </div>
    <div className="relative z-10 w-full max-w-md rounded-2xl bg-[#23243a]/80 backdrop-blur-lg shadow-2xl p-10 border border-white/10">
      <div className="flex flex-col items-center mb-8">
        {/* Placeholder logo/icon */}
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-700 to-purple-800 shadow-lg">
          <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 1.104-.896 2-2 2s-2-.896-2-2 .896-2 2-2 2 .896 2 2zm0 0c0 1.104.896 2 2 2s2-.896 2-2-.896-2-2-2-2 .896-2 2zm-6 8v-1a4 4 0 014-4h4a4 4 0 014 4v1"/></svg>
        </div>
        <h2 className="text-3xl font-extrabold text-gray-100 drop-shadow-sm select-none">
          {isLogin ? '로그인' : '회원가입'}
        </h2>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-1" htmlFor="name">
            이름
          </label>
          <input
            {...register('name', { required: true })}
            id="name"
            type="text"
            autoComplete="username"
            className={`transition-all duration-200 mt-1 block w-full rounded-lg border border-[#343650] bg-[#181C2F]/80 px-4 py-2 text-gray-100 shadow-inner focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 placeholder-gray-500 ${errors.name ? 'border-red-400' : ''}`}
            placeholder="이름을 입력하세요"
          />
          {errors.name && <span className="text-xs text-red-400 mt-1">이름을 입력하세요.</span>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-1" htmlFor="password">
            비밀번호
          </label>
          <input
            {...register('password', { required: true })}
            id="password"
            type="password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            className={`transition-all duration-200 mt-1 block w-full rounded-lg border border-[#343650] bg-[#181C2F]/80 px-4 py-2 text-gray-100 shadow-inner focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 placeholder-gray-500 ${errors.password ? 'border-red-400' : ''}`}
            placeholder="비밀번호를 입력하세요"
          />
          {errors.password && <span className="text-xs text-red-400 mt-1">비밀번호를 입력하세요.</span>}
        </div>
        {!isLogin && (
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-1" htmlFor="passwordConfirm">
              비밀번호 확인
            </label>
            <input
              {...register('passwordConfirm', { required: !isLogin })}
              id="passwordConfirm"
              type="password"
              autoComplete="new-password"
              className={`transition-all duration-200 mt-1 block w-full rounded-lg border border-[#343650] bg-[#181C2F]/80 px-4 py-2 text-gray-100 shadow-inner focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600/30 placeholder-gray-500 ${errors.passwordConfirm ? 'border-red-400' : ''}`}
              placeholder="비밀번호를 다시 입력하세요"
            />
            {errors.passwordConfirm && <span className="text-xs text-red-400 mt-1">비밀번호를 다시 입력하세요.</span>}
          </div>
        )}
        <button
          type="submit"
          className="transition-all duration-200 w-full rounded-lg bg-gradient-to-r from-indigo-700 to-purple-800 px-4 py-2 text-lg font-semibold text-white shadow-md hover:from-indigo-800 hover:to-purple-900 focus:outline-none focus:ring-2 focus:ring-indigo-800 focus:ring-offset-2"
        >
          {isLogin ? '로그인' : '회원가입'}
        </button>
      </form>
      <div className="mt-6 text-center">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="transition-colors duration-200 text-sm font-medium text-indigo-300 hover:text-purple-300 focus:outline-none"
        >
          {isLogin ? '회원가입하기' : '로그인하기'}
        </button>
      </div>
    </div>
  </div>
);
} 