import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* 히어로 섹션 */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 py-20 md:py-28">
        <div className="absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 transform opacity-20">
          <svg width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(300,300)">
              <path d="M151,-182.8C192.2,-143.3,221.8,-89.3,234.6,-31.2C247.3,27,243.2,89.4,211.7,135.5C180.2,181.6,121.2,211.5,60.9,224.7C0.7,237.8,-60.7,234.3,-113.2,210.4C-165.7,186.5,-209.2,142.3,-225.6,91C-242,39.8,-231.3,-18.5,-210.2,-72.5C-189.1,-126.6,-157.7,-176.5,-115.2,-215.6C-72.7,-254.7,-19.2,-283.1,29.4,-274.9C77.9,-266.7,109.8,-222.3,151,-182.8Z" fill="#3b82f6" />
            </g>
          </svg>
        </div>
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-8"> */}
            <div className="flex flex-col justify-center">
              <div className="mb-2 inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 w-45">
                <span className="mr-1">✨</span> 더 스마트한 일정 관리
              </div>
              <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">우선순위에 따른</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  스마트한 일정 관리 🚀
                </span>
              </h1>
              <p className="mb-8 text-xl text-gray-600">
                가장 중요한 일에 집중하세요! 🎯 
                <br/>Priorify가 중요한 일정을 한눈에 보여드립니다.
              </p>
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Link 
                  href="/schedule"
                  className="rounded-lg bg-blue-600 px-6 py-3 text-center text-base font-medium text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out transform hover:-translate-y-1"
                >
                  <span className="inline-flex items-center">
                    시작하기 <span className="ml-1">⚡</span>
                  </span>
                </Link>
                <Link 
                  href="/auth"
                  className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-center text-base font-medium text-gray-700 shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200 ease-in-out"
                >
                  로그인
                </Link>
              </div>
            </div>
            {/* <div className="hidden md:flex items-center justify-center">
              <div className="relative h-[350px] w-[350px] sm:h-[450px] sm:w-[450px]">
                <Image
                  src="/images/calendar-illustration.svg"
                  alt="우선순위 기반 일정 관리"
                  fill
                  style={{ objectFit: "contain" }}
                  priority
                  className="drop-shadow-xl"
                />
              </div>
            </div> */}
          </div>
        {/* </div> */}
      </section>

      {/* 특징 섹션 */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-3">
              <span className="mr-2 text-2xl font-bold text-black">🔍 What is Priorify?</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              우선순위 기반의 일정 관리
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
              중요한 일에 집중하고 효율적으로 시간을 관리하세요
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* 특징 1 */}
            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">카테고리 기반 분류</h3>
              <p className="text-gray-600">
                일정을 카테고리별로 분류하고 우선순위를 설정하여 중요한 일정에 집중하세요.
              </p>
            </div>

            {/* 특징 2 */}
            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                <span className="text-2xl">🔗</span>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">시각화 그래프</h3>
              <p className="text-gray-600">
                네트워크 그래프를 통해 일정 간의 관계를 시각적으로 파악하고 패턴을 분석하세요.
              </p>
            </div>

            {/* 특징 3 */}
            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">효율성 분석</h3>
              <p className="text-gray-600">
                완료율과 우선순위 기반의 분석을 통해 시간 관리 효율성을 높이세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 사용 단계 섹션 */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-3">
              <span className="mr-2 text-2xl font-bold text-black">🔄 How to start</span>
              {/* <span className="h-px w-10 bg-blue-500"></span> */}
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              간단 3단계로 시작하기
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
              누구나 쉽게 사용할 수 있는 직관적인 프로세스
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3 relative">
            {/* <div className="hidden md:block absolute top-24 left-1/6 w-2/3 h-px bg-gray-200 z-0"></div> */}
            
            {/* 단계 1 */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white text-2xl font-bold">1</div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">우선순위 설정 ⚙️</h3>
              <p className="text-gray-600">카테고리별 우선순위를 설정하고 중요도를 정의하세요</p>
            </div>
            
            {/* 단계 2 */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white text-2xl font-bold">2</div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">일정 등록 ✏️</h3>
              <p className="text-gray-600">일정을 등록하면 자동으로 카테고리와 중요도가 분류됩니다</p>
            </div>
            
            {/* 단계 3 */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white text-2xl font-bold">3</div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">시각화 확인 👀</h3>
              <p className="text-gray-600">네트워크 그래프로 일정 간의 관계와 패턴을 파악하세요</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-4xl mb-4 block">🚀</span>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              지금 바로 시작하세요
            </h2>
            <p className="mt-4 text-lg text-blue-100">
              Priorify로 더 효율적인 시간 관리가 가능합니다
            </p>
            <div className="mt-8">
              <Link
                href="/auth"
                className="rounded-lg bg-white px-8 py-4 text-base font-bold text-blue-600 shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600 transition duration-200 ease-in-out transform hover:-translate-y-1"
              >
                무료로 시작하기 →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-gray-50 py-12 border-t border-gray-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 프로젝트 정보 */}
            <div className="col-span-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Priorify</h3>
              <p className="text-sm text-gray-600 mb-4">
                우선순위 기반의 스마트한 일정 관리 서비스
              </p>
            </div>

            {/* 리포지토리 */}
            <div className="col-span-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Repository</h3>
              <ul className="space-y-2">
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

            {/* 법적 문서 */}
            <div className="col-span-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms" 
                        className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    이용약관
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" 
                        className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    개인정보 처리방침
                  </Link>
                </li>
                <li>
                  <Link href="/license" 
                        className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                    오픈소스 라이선스
                  </Link>
                </li>
              </ul>
            </div>

          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-500 mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} Priorify. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <a href="https://github.com/JunSeo99" 
                   className="text-gray-400 hover:text-gray-500 transition-colors"
                   target="_blank" rel="noopener noreferrer">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
