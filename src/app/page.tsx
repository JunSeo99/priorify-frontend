"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";

export default function Home() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Intersection Observer for scroll animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            entry.target.classList.remove('opacity-0', 'translate-y-8');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Observe all elements with scroll-animate class
    const elements = document.querySelectorAll('.scroll-animate');
    elements.forEach((el) => {
      el.classList.add('opacity-0', 'translate-y-8', 'transition-all', 'duration-700', 'ease-out');
      observerRef.current?.observe(el);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-blue-50">
      {/* 배경 장식 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-50/20 rounded-full blur-3xl"></div>
      </div>

      {/* 히어로 섹션 */}
      <section className="relative z-10 py-20 sm:py-28 md:py-36">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center">
            {/* 배지 */}
            <div className="inline-flex items-center justify-center mb-8 sm:mb-10 scroll-animate">
              <div className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-bold text-gray-800 shadow-lg border border-blue-200">
                <span className="mr-2 text-lg sm:text-xl">🚀</span> 
                AI 기반 스마트 일정 관리
              </div>
            </div>

            {/* 메인 타이틀 */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-gray-900 mb-8 sm:mb-10 scroll-animate">
              <span className="block mb-2">우선순위에 따른</span>
              <span className="block text-blue-600">
                스마트한 일정 관리
              </span>
            </h1>

            {/* 서브 타이틀 */}
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-10 sm:mb-14 leading-relaxed scroll-animate">
              복잡한 일정 속에서 <span className="font-semibold text-blue-600">정말 중요한 일</span>이 무엇인지<br/>
              AI가 자동으로 분석하고 우선순위를 알려드립니다
            </p>

            {/* CTA 버튼 */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-14 sm:mb-18 scroll-animate">
              <Link 
                href="/priority"
                className="group relative overflow-hidden rounded-2xl bg-blue-500 px-10 sm:px-14 py-4 sm:py-5 text-base sm:text-lg font-bold text-white shadow-xl hover:shadow-2xl transition-all duration-300 ease-out hover:scale-102 active:scale-98 hover:bg-blue-600"
              >
                <span className="relative flex items-center justify-center">
                  우선순위 설정하기
                  <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              
              <Link 
                href="/auth"
                className="group rounded-2xl border-2 border-blue-200 bg-white/90 backdrop-blur-sm px-10 sm:px-14 py-4 sm:py-5 text-base sm:text-lg font-bold text-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 ease-out hover:scale-102 hover:border-blue-300 hover:bg-blue-50 active:scale-98"
              >
                <span className="flex items-center justify-center">
                  Google 연동하기
                  <svg className="ml-2 w-5 h-5 text-blue-500" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </span>
              </Link>
            </div>

            {/* 핵심 가치 배지 */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 scroll-animate">
              {[
                { name: "자동 분류", icon: "🏷️", color: "bg-blue-100 text-blue-700" },
                { name: "우선순위 분석", icon: "📊", color: "bg-purple-100 text-purple-700" },
                { name: "시각적 관계도", icon: "🕸️", color: "bg-indigo-100 text-indigo-700" },
                { name: "Google 연동", icon: "📅", color: "bg-green-100 text-green-700" },
                { name: "스마트 알림", icon: "🔔", color: "bg-pink-100 text-pink-700" }
              ].map((feature, index) => (
                <div 
                  key={feature.name}
                  className={`inline-flex items-center rounded-full ${feature.color} px-4 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-medium shadow-md border border-white/50 transition-all duration-300 hover:scale-102`}
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <span className="mr-2">{feature.icon}</span>
                  {feature.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 핵심 기능 섹션 */}
      <section className="relative z-10 py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16 sm:mb-20 scroll-animate">
            <div className="inline-flex items-center justify-center mb-6 sm:mb-8">
              <span className="text-2xl sm:text-3xl font-bold text-gray-800">✨ 핵심 기능</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 sm:mb-8">
              복잡한 일정을 간단하게
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              AI가 당신의 일정을 분석하여 정말 중요한 일에 집중할 수 있도록 도와드립니다
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {/* 기능 1: 자동 분류 */}
            <div className="group backdrop-blur-sm bg-white/80 rounded-2xl sm:rounded-3xl shadow-xl border border-blue-100 p-8 sm:p-10 hover:shadow-2xl transition-all duration-300 ease-out hover:scale-102 scroll-animate">
              <div className="mb-8 inline-flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-2xl bg-blue-200 text-white shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span className="text-2xl sm:text-3xl">🏷️</span>
              </div>
              <h3 className="mb-6 text-xl sm:text-2xl font-bold text-gray-900">똑똑한 자동 분류</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                일정을 입력하면 AI가 자동으로 <span className="font-semibold text-blue-600">25개 카테고리</span>로 분류해드립니다. 
                더 이상 일일이 태그를 달 필요가 없어요.
              </p>
              <div className="flex flex-wrap gap-2">
                {["업무", "학업", "건강", "가족"].map((category) => (
                  <span key={category} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {category}
                  </span>
                ))}
              </div>
            </div>

            {/* 기능 2: 우선순위 분석 */}
            <div className="group backdrop-blur-sm bg-white/80 rounded-2xl sm:rounded-3xl shadow-xl border border-purple-100 p-8 sm:p-10 hover:shadow-2xl transition-all duration-300 ease-out hover:scale-102 scroll-animate">
              <div className="mb-8 inline-flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-2xl bg-purple-200 text-white shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span className="text-2xl sm:text-3xl">⚡</span>
              </div>
              <h3 className="mb-6 text-xl sm:text-2xl font-bold text-gray-900">스마트 우선순위</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                마감일과 중요도를 종합하여 <span className="font-semibold text-purple-600">가장 먼저 해야 할 일</span>을 
                자동으로 찾아드립니다.
              </p>
              <div className="bg-purple-50 rounded-xl p-4 text-sm text-purple-700 border border-purple-200">
                "오늘 가장 중요한 일 3가지를 알려드릴게요!"
              </div>
            </div>

            {/* 기능 3: 시각적 관계도 */}
            <div className="group backdrop-blur-sm bg-white/80 rounded-2xl sm:rounded-3xl shadow-xl border border-indigo-100 p-8 sm:p-10 hover:shadow-2xl transition-all duration-300 ease-out hover:scale-102 md:col-span-2 lg:col-span-1 scroll-animate">
              <div className="mb-8 inline-flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-2xl bg-red-200 text-white shadow-lg group-hover:shadow-xl transition-all duration-300">
                <span className="text-2xl sm:text-3xl">🕸️</span>
              </div>
              <h3 className="mb-6 text-xl sm:text-2xl font-bold text-gray-900">한눈에 보는 관계도</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                비슷한 일정들을 연결하여 <span className="font-semibold text-indigo-600">패턴과 관계</span>를 
                시각적으로 보여드립니다.
              </p>
              <div className="text-sm text-gray-500">
                연관된 일정 • 반복 패턴 • 시간 분배 현황
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 문제 해결 섹션 */}
      <section className="relative z-10 py-20 sm:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16 sm:mb-20 scroll-animate">
            <div className="inline-flex items-center justify-center mb-6 sm:mb-8">
              <span className="text-2xl sm:text-3xl font-bold text-gray-800">🎯 이런 고민 있으신가요?</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 sm:mb-8">
              Priorify가 해결해드립니다
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 items-center">
            {/* 문제점들 */}
            <div className="space-y-8 sm:space-y-10">
              {[
                {
                  problem: "할 일이 너무 많아서 뭐부터 해야 할지 모르겠어요",
                  solution: "AI가 우선순위를 자동으로 분석해서 가장 중요한 일부터 알려드려요",
                  icon: "😵‍💫",
                  color: "bg-red-400"
                },
                {
                  problem: "일정을 카테고리별로 정리하기가 번거로워요",
                  solution: "일정을 입력하면 자동으로 25개 카테고리로 분류해드려요",
                  icon: "📝",
                  color: "bg-blue-400"
                },
                {
                  problem: "중요한 일정을 놓치는 경우가 자주 있어요",
                  solution: "마감일과 중요도를 고려해서 놓치면 안 되는 일을 미리 알려드려요",
                  icon: "⏰",
                  color: "bg-purple-400"
                }
              ].map((item, index) => (
                <div key={index} className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10 scroll-animate">
                  <div className="flex items-start space-x-6">
                    <div className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full ${item.color} flex items-center justify-center text-white text-xl sm:text-2xl shadow-lg`}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <div className="mb-4">
                        <span className="text-red-600 font-medium text-sm">문제</span>
                        <p className="text-gray-700 font-medium text-base sm:text-lg">{item.problem}</p>
                      </div>
                      <div>
                        <span className="text-green-600 font-medium text-sm">해결</span>
                        <p className="text-gray-600 text-base sm:text-lg">{item.solution}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 결과 미리보기 */}
            <div className="backdrop-blur-sm bg-white/80 rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10 scroll-animate">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-8 sm:mb-10 text-center">이렇게 달라져요!</h3>
              
              <div className="space-y-6 sm:space-y-8">
                <div className="bg-green-50 rounded-xl p-5 sm:p-6 border border-green-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-green-800 text-base sm:text-lg">오늘의 최우선 할 일</span>
                    <span className="text-xs bg-green-200 text-green-800 px-3 py-1 rounded-full">1순위</span>
                  </div>
                  <p className="text-green-700 text-sm sm:text-base">📚 기말고사 준비 (D-3)</p>
                </div>

                <div className="bg-blue-50 rounded-xl p-5 sm:p-6 border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-blue-800 text-base sm:text-lg">연관된 일정들</span>
                    <span className="text-xs bg-blue-200 text-blue-800 px-3 py-1 rounded-full">그룹</span>
                  </div>
                  <p className="text-blue-700 text-sm sm:text-base">💼 프로젝트 회의 → 📊 보고서 작성 → 📧 이메일 발송</p>
                </div>

                <div className="bg-purple-50 rounded-xl p-5 sm:p-6 border border-purple-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-purple-800 text-base sm:text-lg">이번 주 패턴</span>
                    <span className="text-xs bg-purple-200 text-purple-800 px-3 py-1 rounded-full">분석</span>
                  </div>
                  <p className="text-purple-700 text-sm sm:text-base">🏃‍♂️ 운동 일정이 3번 연기되었어요. 시간을 조정해보세요!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 사용 방법 섹션 */}
      <section className="relative z-10 py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16 sm:mb-20 scroll-animate">
            <div className="inline-flex items-center justify-center mb-6 sm:mb-8">
              <span className="text-2xl sm:text-3xl font-bold text-gray-800">🚀 시작하기</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 sm:mb-8">
              간단한 3단계로 시작
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              복잡한 설정 없이 바로 사용할 수 있습니다
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 relative">
            {/* 연결선 (데스크톱에서만) */}
            <div className="hidden md:block absolute top-14 left-1/6 w-2/3 h-px bg-blue-200 z-0"></div>
            
            {[
              {
                step: "1",
                title: "우선순위 설정",
                desc: "중요한 카테고리와 덜 중요한 카테고리를 선택하세요",
                icon: "⚙️",
                color: "bg-blue-500"
              },
              {
                step: "2", 
                title: "Google Calendar 연동",
                desc: "기존 일정을 자동으로 가져와 분석합니다",
                icon: "🔗",
                color: "bg-indigo-500"
              },
              {
                step: "3",
                title: "스마트 일정 관리",
                desc: "AI가 분석한 우선순위와 관계도를 확인하세요",
                icon: "📊",
                color: "bg-purple-500"
              }
            ].map((item, index) => (
              <div key={item.step} className="relative z-10 text-center group scroll-animate">
                <div className={`mb-8 sm:mb-10 mx-auto flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-full ${item.color} text-white text-2xl sm:text-3xl font-bold shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110`}>
                  {item.step}
                </div>
                <div className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10 group-hover:shadow-2xl transition-all duration-300 group-hover:scale-102">
                  <div className="text-3xl sm:text-4xl mb-4 sm:mb-6">{item.icon}</div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-base sm:text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="relative z-10 py-20 sm:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="mx-auto text-center scroll-animate">
            <div className="backdrop-blur-sm bg-white/80 rounded-3xl sm:rounded-[2rem] shadow-2xl border border-gray-100 p-10 sm:p-14 md:p-18">
              <div className="text-4xl sm:text-5xl md:text-6xl mb-8 sm:mb-10">🎯</div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 sm:mb-8">
                지금 바로 시작하세요
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 mb-10 sm:mb-14 max-w-2xl mx-auto leading-relaxed">
                AI가 분석하는 스마트한 일정 관리로<br/>
                더 효율적인 시간을 만들어보세요
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
                <Link
                  href="/priority"
                  className="group relative overflow-hidden rounded-2xl bg-blue-500 px-10 sm:px-14 py-4 sm:py-5 text-base sm:text-lg font-bold text-white shadow-xl hover:shadow-2xl transition-all duration-300 ease-out hover:scale-102 hover:bg-blue-600 active:scale-98"
                >
                  <span className="relative flex items-center justify-center">
                    무료로 시작하기
                    <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
                
                <Link
                  href="/schedule"
                  className="group rounded-2xl border-2 border-blue-200 bg-white/90 backdrop-blur-sm px-10 sm:px-14 py-4 sm:py-5 text-base sm:text-lg font-bold text-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 ease-out hover:scale-102 hover:border-blue-300 hover:bg-blue-50 active:scale-98"
                >
                  <span className="flex items-center justify-center">
                    데모 보기
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 py-16 sm:py-20 border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-14">
            {/* 프로젝트 정보 */}
            <div className="md:col-span-2">
              <h3 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-6">
                Priorify
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed text-base sm:text-sm">
                AI 기반 우선순위 분석으로 더 스마트한 일정 관리를 제공하는 
                오픈소스 프로젝트입니다.
              </p>
              <div className="flex space-x-4">
                <a href="https://github.com/JunSeo99" 
                   className="text-gray-400 hover:text-blue-600 transition-colors"
                   target="_blank" rel="noopener noreferrer">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.981 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.598 1.028 2.688 0 3.848-2.339 4.698-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            {/* 리포지토리 */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-6">Repository</h4>
              <ul className="space-y-3">
                <li>
                  <a href="https://github.com/JunSeo99/priorify-frontend" 
                     className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                     target="_blank" rel="noopener noreferrer">
                    Frontend
                  </a>
                </li>
                <li>
                  <a href="https://github.com/JunSeo99/priorify-backend" 
                     className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                     target="_blank" rel="noopener noreferrer">
                    Backend
                  </a>
                </li>
                <li>
                  <a href="https://github.com/JunSeo99/priorify-backend-text2vec" 
                     className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                     target="_blank" rel="noopener noreferrer">
                    Text2Vec
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 sm:mt-16 pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-500 mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} Priorify. All rights reserved.
              </p>
              <p className="text-sm text-gray-500">
                Made with ❤️ by Team 16
              </p>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.7s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
