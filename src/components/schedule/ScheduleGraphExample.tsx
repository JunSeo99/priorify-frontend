// 'use client';

// import { useState } from 'react';
// import { Schedule, Category, CATEGORIES } from '@/types';
// import { ScheduleGraph } from './ScheduleGraph';

// // 현실적인 가짜 일정 데이터
// const MOCK_SCHEDULES: Schedule[] = [
//   {
//     id: '1',
//     title: '민수와 저녁 약속',
//     description: '강남역 2번 출구 스시야마 레스토랑에서 만나기로 함',
//     datetime: new Date(new Date().setHours(20, 0, 0, 0)).toISOString(),
//     importance: 'MEDIUM',
//     category: '친목',
//     completed: false
//   },
//   {
//     id: '2',
//     title: '여자친구 생일',
//     description: '케이크와 선물 준비 (향수와 꽃다발 구매 필수!)',
//     datetime: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
//     importance: 'HIGH',
//     category: '애인',
//     completed: false
//   },
//   {
//     id: '3',
//     title: '팀 프로젝트 회의',
//     description: '온라인 화상회의, 다음 스프린트 계획 논의',
//     datetime: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
//     importance: 'HIGH',
//     category: '업무',
//     completed: false
//   },
//   {
//     id: '4',
//     title: '팀 회식',
//     description: '퇴근 후 강남역 삼겹살 집, 회식비 지원 예정',
//     datetime: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
//     importance: 'MEDIUM',
//     category: '친목',
//     completed: false
//   },
//   {
//     id: '5',
//     title: '코딩 스터디',
//     description: '알고리즘 스터디, LeetCode 문제 5개 풀어오기',
//     datetime: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
//     importance: 'MEDIUM',
//     category: '자기개발',
//     completed: false
//   },
//   {
//     id: '6',
//     title: '헬스장 PT',
//     description: '상체 운동 날, 단백질 보충제 챙겨가기',
//     datetime: new Date(new Date().setHours(18, 30, 0, 0)).toISOString(),
//     importance: 'LOW',
//     category: '건강',
//     completed: false
//   },
//   {
//     id: '7',
//     title: '아버지 생신',
//     description: '저녁 식사 예약, 선물로 등산화 사드리기',
//     datetime: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
//     importance: 'HIGH',
//     category: '가족',
//     completed: false
//   },
//   {
//     id: '8',
//     title: '월세 납부',
//     description: '자동이체 확인',
//     datetime: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString(),
//     importance: 'HIGH',
//     category: '고정비',
//     completed: false
//   },
//   {
//     id: '9',
//     title: '노트북 구매',
//     description: '쿠팡에서 할인 중인 맥북 프로 구매 검토',
//     datetime: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
//     importance: 'MEDIUM',
//     category: '구입',
//     completed: false
//   },
//   {
//     id: '10',
//     title: '블로그 포스팅',
//     description: 'React 상태 관리 라이브러리 비교 글 작성',
//     datetime: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
//     importance: 'LOW',
//     category: '자기개발',
//     completed: false
//   },
//   {
//     id: '11',
//     title: '면접 준비',
//     description: '기술 면접 질문 리스트 검토 및 예상 답변 정리',
//     datetime: new Date(new Date().setDate(new Date().getDate() + 4)).toISOString(),
//     importance: 'HIGH',
//     category: '업무',
//     completed: false
//   },
//   {
//     id: '12',
//     title: '차량 정비',
//     description: '엔진오일 교체 및 타이어 공기압 확인',
//     datetime: new Date(new Date().setDate(new Date().getDate() + 6)).toISOString(),
//     importance: 'MEDIUM',
//     category: '자동차 정비',
//     completed: false
//   },
//   {
//     id: '13',
//     title: '기말고사 대비',
//     description: '알고리즘 기말고사 준비, 예상 문제 풀이',
//     datetime: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
//     importance: 'HIGH',
//     category: '학교',
//     completed: false
//   },
//   {
//     id: '14',
//     title: '제주도 여행 계획',
//     description: '여름휴가 계획, 항공권 및 숙소 예약',
//     datetime: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(),
//     importance: 'LOW',
//     category: '여행',
//     completed: false
//   },
//   {
//     id: '15',
//     title: '투자 포트폴리오 점검',
//     description: '주식 및 암호화폐 포트폴리오 리밸런싱',
//     datetime: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString(),
//     importance: 'MEDIUM',
//     category: '경제',
//     completed: false
//   }
// ];

// export default function ScheduleGraphExample() {
//   const [filteredCategory, setFilteredCategory] = useState<string | null>(null);
  
//   // 카테고리 필터링 기능
//   const filteredSchedules = filteredCategory
//     ? MOCK_SCHEDULES.filter(s => s.category === filteredCategory)
//     : MOCK_SCHEDULES;
  
//   const handleCategoryClick = (category: string) => {
//     // 현재 필터링된 카테고리를 다시 클릭하면 필터 해제
//     if (category === filteredCategory) {
//       setFilteredCategory(null);
//     } else {
//       setFilteredCategory(category);
//     }
//   };
  
//   return (
//     <div className="flex flex-col h-full">
//       <div className="bg-white dark:bg-gray-800 p-4 shadow-sm rounded-lg mb-4">
//         <h2 className="text-xl font-bold text-gray-900 dark:text-white">일정 그래프 시각화</h2>
        
//         {filteredCategory && (
//           <div className="mt-2 flex items-center">
//             <div 
//               className="px-3 py-1 text-sm rounded-full flex items-center gap-2 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
//             >
//               <span>카테고리: {filteredCategory}</span>
//               <button 
//                 onClick={() => setFilteredCategory(null)}
//                 className="hover:text-blue-900 dark:hover:text-blue-100"
//               >
//                 ✕
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
      
//       <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden" style={{ height: 'calc(100vh - 200px)', minHeight: '500px' }}>
//         <ScheduleGraph 
//           schedules={filteredSchedules}
//           onCategoryClick={handleCategoryClick}
//         />
//       </div>
      
//       <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
//         * 그래프의 노드를 클릭하여 카테고리별 일정을 확인하세요.
//       </div>
//     </div>
//   );
// } 