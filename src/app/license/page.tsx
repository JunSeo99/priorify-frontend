'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function LicensePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            
            <h1 className="text-4xl font-bold text-white mb-4">오픈소스 라이선스 고지</h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Priorify 프로젝트에서 사용된 모든 오픈소스 라이브러리<br/>라이선스 정보/GitHub 링크/Hugging Face 링크
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Frontend Libraries */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mr-4 p-2">
                    {/* React Logo */}
                    <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z"/>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Frontend</h2>
                    <p className="text-blue-100">React & Next.js 기반</p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900">Next.js</h3>
                  <p className="text-sm text-gray-600 mb-1">MIT License</p>
                  <a href="https://github.com/vercel/next.js" className="text-xs text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    GitHub →
                  </a>
                </div>
                <div className="border-l-4 border-cyan-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900">React</h3>
                  <p className="text-sm text-gray-600 mb-1">MIT License</p>
                  <a href="https://github.com/facebook/react" className="text-xs text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    GitHub →
                  </a>
                </div>
                <div className="border-l-4 border-teal-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900">Tailwind CSS</h3>
                  <p className="text-sm text-gray-600 mb-1">MIT License</p>
                  <a href="https://github.com/tailwindlabs/tailwindcss" className="text-xs text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    GitHub →
                  </a>
                </div>
                <div className="border-l-4 border-indigo-500 pl-4">
                  <h3 className="text-base font-medium text-gray-900">Heroicons</h3>
                  <p className="text-sm text-gray-600 mb-1">MIT License</p>
                  <a href="https://github.com/tailwindlabs/heroicons" className="text-xs text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    GitHub →
                  </a>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="text-base font-medium text-gray-900">TanStack Query</h3>
                  <p className="text-sm text-gray-600 mb-1">MIT License</p>
                  <a href="https://github.com/TanStack/query" className="text-xs text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    GitHub →
                  </a>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="text-base font-medium text-gray-900">Zustand</h3>
                  <p className="text-sm text-gray-600 mb-1">MIT License</p>
                  <a href="https://github.com/pmndrs/zustand" className="text-xs text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    GitHub →
                  </a>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <h3 className="text-base font-medium text-gray-900">React Hook Form</h3>
                  <p className="text-sm text-gray-600 mb-1">MIT License</p>
                  <a href="https://github.com/react-hook-form/react-hook-form" className="text-xs text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    GitHub →
                  </a>
                </div>
                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="text-base font-medium text-gray-900">Axios</h3>
                  <p className="text-sm text-gray-600 mb-1">MIT License</p>
                  <a href="https://github.com/axios/axios" className="text-xs text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    GitHub →
                  </a>
                </div>
              </div>
            </div>

            {/* Data Visualization & UI Libraries */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="bg-gradient-to-r from-violet-500 to-purple-500 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mr-4 p-2">
                    {/* D3.js Logo */}
                    <svg className="w-8 h-8 text-violet-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.568 14.794c-.113.827-.908 1.478-1.897 1.478-.989 0-1.784-.651-1.897-1.478H12c0 1.657 1.343 3 3 3s3-1.343 3-3h-1.432zM9 9c-.552 0-1-.448-1-1s.448-1 1-1 1 .448 1 1-.448 1-1 1zm6 0c-.552 0-1-.448-1-1s.448-1 1-1 1 .448 1 1-.448 1-1 1z"/>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">시각화 & UI</h2>
                    <p className="text-purple-100">데이터 시각화 및 인터랙션</p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="border-l-4 border-violet-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900">Nivo</h3>
                  <p className="text-sm text-gray-600 mb-2">MIT License</p>
                  <div className="bg-gray-50 rounded-lg p-3 mb-2">
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• @nivo/core</li>
                      <li>• @nivo/network</li>
                      <li>• @nivo/circle-packing</li>
                    </ul>
                  </div>
                  <a href="https://github.com/plouc/nivo" className="text-xs text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    GitHub →
                  </a>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900">D3.js</h3>
                  <p className="text-sm text-gray-600 mb-1">BSD-3-Clause License</p>
                  <a href="https://github.com/d3/d3" className="text-xs text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    GitHub →
                  </a>
                </div>
                <div className="border-l-4 border-pink-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900">React Force Graph 3D</h3>
                  <p className="text-sm text-gray-600 mb-1">MIT License</p>
                  <a href="https://github.com/vasturiano/react-force-graph" className="text-xs text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    GitHub →
                  </a>
                </div>
                <div className="border-l-4 border-indigo-500 pl-4">
                  <h3 className="text-base font-medium text-gray-900">DnD Kit</h3>
                  <p className="text-sm text-gray-600 mb-2">MIT License</p>
                  <div className="bg-gray-50 rounded-lg p-3 mb-2">
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• @dnd-kit/core</li>
                      <li>• @dnd-kit/sortable</li>
                      <li>• @dnd-kit/utilities</li>
                    </ul>
                  </div>
                  <a href="https://github.com/clauderic/dnd-kit" className="text-xs text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    GitHub →
                  </a>
                </div>
                <div className="border-l-4 border-cyan-500 pl-4">
                  <h3 className="text-base font-medium text-gray-900">Next Themes</h3>
                  <p className="text-sm text-gray-600 mb-1">MIT License</p>
                  <a href="https://github.com/pacocoursey/next-themes" className="text-xs text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    GitHub →
                  </a>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="text-base font-medium text-gray-900">Date-fns</h3>
                  <p className="text-sm text-gray-600 mb-1">MIT License</p>
                  <a href="https://github.com/date-fns/date-fns" className="text-xs text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    GitHub →
                  </a>
                </div>
                <div className="border-l-4 border-emerald-500 pl-4">
                  <h3 className="text-base font-medium text-gray-900">Three SpriteText</h3>
                  <p className="text-sm text-gray-600 mb-1">MIT License</p>
                  <a href="https://github.com/vasturiano/three-spritetext" className="text-xs text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    GitHub →
                  </a>
                </div>
              </div>
            </div>

            {/* Backend Libraries */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mr-4 p-2">
                    {/* Spring Boot Logo */}
                    <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.205 16.392c-2.469 3.289-7.741 2.179-11.122 2.338 0 0-.599.034-1.201.133 0 0 .228-.097.519-.198 2.374-.821 3.496-.986 4.939-1.727 2.71-1.388 5.408-4.413 5.957-7.555-1.032 3.022-4.17 5.623-7.027 6.679-1.955.722-5.492 1.424-5.493 1.424a5.28 5.28 0 0 1-.143-.076c-2.405-1.17-2.475-6.38 1.894-8.059 1.916-.736 3.747-.332 5.818-.825 2.208-.525 4.766-2.18 5.805-4.344 1.165 3.458 2.565 8.866.054 12.21zm.042-13.28a9.212 9.212 0 0 1-1.065 1.89 9.982 9.982 0 0 0-7.167-3.031C6.492 1.971 2 6.463 2 11.985a9.983 9.983 0 0 0 3.205 7.334l.22.194a10.001 10.001 0 1 1 14.822-16.401z"/>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Backend</h2>
                    <p className="text-green-100">Spring Boot 기반</p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900">Spring Boot</h3>
                  <p className="text-sm text-gray-600 mb-2">Apache License 2.0</p>
                  <div className="bg-gray-50 rounded-lg p-3 mb-2">
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• spring-boot-starter</li>
                      <li>• spring-boot-starter-web</li>
                      <li>• spring-boot-starter-security</li>
                      <li>• spring-boot-starter-data-mongodb</li>
                      <li>• spring-boot-starter-validation</li>
                    </ul>
                  </div>
                  <a href="https://github.com/spring-projects/spring-boot" className="text-xs text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    GitHub →
                  </a>
                </div>
                <div className="border-l-4 border-emerald-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900">Google API Client</h3>
                  <p className="text-sm text-gray-600 mb-2">Apache License 2.0</p>
                  <div className="bg-gray-50 rounded-lg p-3 mb-2">
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• google-api-client</li>
                      <li>• google-oauth-client-jetty</li>
                      <li>• google-api-services-calendar</li>
                    </ul>
                  </div>
                  <a href="https://github.com/googleapis/google-api-java-client" className="text-xs text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    GitHub →
                  </a>
                </div>
                <div className="space-y-3">
                  <div className="border-l-4 border-teal-500 pl-4">
                    <h3 className="text-base font-medium text-gray-900">RxJava</h3>
                    <p className="text-sm text-gray-600 mb-1">Apache License 2.0</p>
                    <a href="https://github.com/ReactiveX/RxJava" className="text-xs text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                      GitHub →
                    </a>
                  </div>
                  <div className="border-l-4 border-cyan-500 pl-4">
                    <h3 className="text-base font-medium text-gray-900">JJWT</h3>
                    <p className="text-sm text-gray-600 mb-1">Apache License 2.0</p>
                    <a href="https://github.com/jwtk/jjwt" className="text-xs text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                      GitHub →
                    </a>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="text-base font-medium text-gray-900">Lombok</h3>
                    <p className="text-sm text-gray-600 mb-1">MIT License</p>
                    <a href="https://github.com/projectlombok/lombok" className="text-xs text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                      GitHub →
                    </a>
                  </div>
                  <div className="border-l-4 border-indigo-500 pl-4">
                    <h3 className="text-base font-medium text-gray-900">JUnit</h3>
                    <p className="text-sm text-gray-600 mb-1">Eclipse Public License v2.0</p>
                    <a href="https://github.com/junit-team/junit5" className="text-xs text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                      GitHub →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text2Vec Libraries Row */}
          <div className="mt-8">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mr-4 p-2">
                    {/* Python Logo */}
                    <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z"/>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Text2Vec (Python AI/ML)</h2>
                    <p className="text-purple-100">자연어 처리 및 머신러닝</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h3 className="text-base font-semibold text-gray-900">FastAPI</h3>
                    <p className="text-sm text-gray-600 mb-1">MIT License</p>
                    <a href="https://github.com/tiangolo/fastapi" className="text-xs text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                      GitHub →
                    </a>
                  </div>
                  <div className="border-l-4 border-pink-500 pl-4">
                    <h3 className="text-base font-semibold text-gray-900">Sentence Transformers</h3>
                    <p className="text-sm text-gray-600 mb-1">Apache License 2.0</p>
                    <a href="https://github.com/UKPLab/sentence-transformers" className="text-xs text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                      GitHub →
                    </a>
                  </div>
                  <div className="border-l-4 border-violet-500 pl-4">
                    <h3 className="text-base font-semibold text-gray-900">PyTorch</h3>
                    <p className="text-sm text-gray-600 mb-1">BSD License</p>
                    <a href="https://github.com/pytorch/pytorch" className="text-xs text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                      GitHub →
                    </a>
                  </div>
                  <div className="border-l-4 border-fuchsia-500 pl-4">
                    <h3 className="text-base font-semibold text-gray-900">Transformers</h3>
                    <p className="text-sm text-gray-600 mb-1">Apache License 2.0</p>
                    <a href="https://github.com/huggingface/transformers" className="text-xs text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                      GitHub →
                    </a>
                  </div>
                  <div className="border-l-4 border-rose-500 pl-4">
                    <h3 className="text-base font-semibold text-gray-900">FAISS</h3>
                    <p className="text-sm text-gray-600 mb-1">MIT License</p>
                    <a href="https://github.com/facebookresearch/faiss" className="text-xs text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                      GitHub →
                    </a>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h3 className="text-base font-semibold text-gray-900">Pydantic</h3>
                    <p className="text-sm text-gray-600 mb-1">MIT License</p>
                    <a href="https://github.com/pydantic/pydantic" className="text-xs text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                      GitHub →
                    </a>
                  </div>
                  <div className="border-l-4 border-amber-500 pl-4">
                    <h3 className="text-base font-semibold text-gray-900">Uvicorn</h3>
                    <p className="text-sm text-gray-600 mb-1">BSD License</p>
                    <a href="https://github.com/encode/uvicorn" className="text-xs text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                      GitHub →
                    </a>
                  </div>
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <h3 className="text-base font-semibold text-gray-900">NumPy</h3>
                    <p className="text-sm text-gray-600 mb-1">BSD License</p>
                    <a href="https://github.com/numpy/numpy" className="text-xs text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                      GitHub →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hugging Face Models Row */}
          <div className="mt-8">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mr-4 p-2">
                    {/* Hugging Face Logo */}
                    <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10zm-1.5-6.268a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zm-3-3a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0z"/>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Hugging Face Models</h2>
                    <p className="text-yellow-100">사전 훈련된 한국어 NLP 모델</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <h3 className="text-lg font-semibold text-gray-900">KoELECTRA-small-v3-modu-ner</h3>
                    <p className="text-sm text-gray-600 mb-2">Apache License 2.0</p>
                    <p className="text-xs text-gray-500 mb-2">한국어 개체명 인식(NER) 모델</p>
                    <a href="https://huggingface.co/Leo97/KoELECTRA-small-v3-modu-ner" className="text-xs text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                      Hugging Face →
                    </a>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h3 className="text-lg font-semibold text-gray-900">ko-sroberta-multitask</h3>
                    <p className="text-sm text-gray-600 mb-2">Apache License 2.0</p>
                    <p className="text-xs text-gray-500 mb-2">한국어 문장 임베딩 모델</p>
                    <a href="https://huggingface.co/jhgan/ko-sroberta-multitask" className="text-xs text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                      Hugging Face →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Section */}
           <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">라이선스 준수</h3>
              <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
                Priorify는 단국대학교 오픈소스 기초 수업에서 개발된 프로젝트로, 모든 오픈소스 라이브러리의 라이선스를 존중하고 준수합니다. 
                각 라이브러리의 기여자들에게 감사드리며, 오픈소스 생태계 발전에 기여하고자 합니다.
              </p>
              <div className="flex justify-center space-x-4">
                <Link 
                  href="/"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  홈으로 돌아가기
                </Link>
                <Link 
                  href="/terms"
                  className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                >
                  서비스 약관
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 