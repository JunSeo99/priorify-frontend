# Priorify 프론트엔드 개발 계획



## 1. 기술 스택

- **프레임워크**: Next.js 14
- **스타일링**: TailwindCSS
- **상태 관리**: Zustand
- **HTTP 클라이언트**: Axios
- **그래프 시각화**: D3.js
- **폼 관리**: React Hook Form
- **타입 체크**: TypeScript
- **API 통신**: React Query

## 2. 프로젝트 구조

```
src/
├── app/                      # Next.js App Router
│   ├── page.tsx             # 랜딩 페이지
│   ├── auth/                # 인증 관련 페이지
│   ├── priority/            # 우선순위 설정 페이지
│   └── schedule/            # 스케줄 관리 페이지
├── components/              # 재사용 가능한 컴포넌트
│   ├── auth/               # 인증 관련 컴포넌트
│   ├── priority/           # 우선순위 관련 컴포넌트
│   ├── schedule/           # 스케줄 관련 컴포넌트
│   └── common/             # 공통 컴포넌트
├── lib/                    # 유틸리티 함수들
├── hooks/                  # 커스텀 훅
├── store/                  # Zustand 스토어
└── types/                  # TypeScript 타입 정의
```

## 3. 페이지별 구현 사항

### 3.1 인증 페이지 (`/auth`)

#### 회원가입
- 입력 필드:
  - 아이디 (이메일)
  - 비밀번호
  - 비밀번호 확인
  - 이름
- 유효성 검사:
  - 이메일 형식 검증
  - 비밀번호 일치 여부
  - 필수 필드 검증
- 기능:
  - 회원가입 API 호출
  - 성공 시 JWT 저장 및 우선순위 설정 페이지로 이동

#### 로그인
- 입력 필드:
  - 아이디
  - 비밀번호
- 기능:
  - 로그인 API 호출
  - JWT 토큰 저장
  - 스케줄 페이지로 리다이렉트

### 3.2 우선순위 설정 페이지 (`/priority`)

#### 카테고리 선택 UI
- 드래그 앤 드롭으로 우선순위 설정
- 카테고리 목록:
  ```typescript
  const categories = [
    "가사", "취미", "자기개발", "건강", "애인", 
    "가족", "고정비", "친목", "업무", "구입", 
    "학교", "자동차 정비", "시험", "여행", "경제"
  ];
  ```

#### 우선순위 설정
- 상위 우선순위 (1-3순위) 선택
- 하위 우선순위 (1-3순위) 선택
- 저장 시 API 호출

### 3.3 스케줄 관리 페이지 (`/schedule`)

#### 레이아웃
- 3단 그리드 레이아웃
- 반응형 디자인 (모바일/태블릿/데스크톱)

#### 1. 스케줄 입력 섹션
- 입력 필드:
  - 일정 제목
  - 날짜 및 시간 (DateTimePicker)
  - 설명
  - 중요도 (상/중/하)
- 자동 카테고리 분류 (LLaMA API 연동)

#### 2. 스케줄 리스트 섹션
- 탭 구현:
  - 월간 보기 (30일)
  - 주간 보기 (7일)
  - 중요도순 보기
- 필터링 기능
- 정렬 기능
- 무한 스크롤 구현

#### 3. 그래프 시각화 섹션
- D3.js를 활용한 네트워크 그래프
- 기능:
  - 카테고리별 노드 생성
  - 연관 카테고리 간 엣지 연결
  - 줌 인/아웃
  - 드래그 앤 드롭으로 노드 위치 조정
- 인터랙션:
  - 노드 호버 시 상세 정보 표시
  - 노드 클릭 시 해당 카테고리 스케줄 필터링

## 4. 공통 컴포넌트

### 4.1 네비게이션
- 로그인/로그아웃 버튼
- 우선순위 설정 페이지 링크
- 사용자 정보 표시

### 4.2 알림
- 토스트 메시지
- 로딩 스피너
- 에러 메시지

## 5. 상태 관리

### 5.1 Zustand 스토어
```typescript
interface AuthStore {
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

interface ScheduleStore {
  schedules: Schedule[];
  addSchedule: (schedule: Schedule) => void;
  updateSchedule: (id: string, schedule: Schedule) => void;
  deleteSchedule: (id: string) => void;
}

interface PriorityStore {
  highPriorities: Priority[];
  lowPriorities: Priority[];
  setHighPriorities: (priorities: Priority[]) => void;
  setLowPriorities: (priorities: Priority[]) => void;
}
```

## 6. API 통신

### 6.1 API 클라이언트 설정
```typescript
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// JWT 인터셉터
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 6.2 React Query 설정
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    },
  },
});
```


#### 회원가입
```yaml
POST /api/auth/signup
tags:
  - Auth
summary: 새로운 사용자 등록
requestBody:
  required: true
  content:
    application/json:
      schema:
        type: object
        properties:
          username:
            type: string
            example: "user@example.com"
          password:
            type: string
            example: "password123"
          name:
            type: string
            example: "홍길동"
responses:
  201:
    description: 회원가입 성공
    content:
      application/json:
        schema:
          type: object
          properties:
            token:
              type: string
            userId:
              type: string
  400:
    description: 잘못된 요청
```

#### 로그인
```yaml
POST /api/auth/login
tags:
  - Auth
summary: 사용자 로그인
requestBody:
  required: true
  content:
    application/json:
      schema:
        type: object
        properties:
          username:
            type: string
          password:
            type: string
responses:
  200:
    description: 로그인 성공
    content:
      application/json:
        schema:
          type: object
          properties:
            token:
              type: string
            userId:
              type: string
  401:
    description: 인증 실패
```

### 9.2 우선순위 API

#### 상위 우선순위 설정
```yaml
POST /api/priorities/high
tags:
  - Priority
summary: 상위 우선순위 설정
security:
  - bearerAuth: []
requestBody:
  required: true
  content:
    application/json:
      schema:
        type: array
        items:
          type: object
          properties:
            category:
              type: string
            rank:
              type: integer
              minimum: 1
              maximum: 3
responses:
  200:
    description: 우선순위 설정 성공
  401:
    description: 인증되지 않은 요청
```

#### 하위 우선순위 설정
```yaml
POST /api/priorities/low
tags:
  - Priority
summary: 하위 우선순위 설정
security:
  - bearerAuth: []
requestBody:
  required: true
  content:
    application/json:
      schema:
        type: array
        items:
          type: object
          properties:
            category:
              type: string
            rank:
              type: integer
              minimum: 1
              maximum: 3
responses:
  200:
    description: 우선순위 설정 성공
  401:
    description: 인증되지 않은 요청
```

#### 우선순위 조회
```yaml
GET /api/priorities/{type}
tags:
  - Priority
summary: 우선순위 조회 (type: high 또는 low)
security:
  - bearerAuth: []
responses:
  200:
    description: 우선순위 조회 성공
    content:
      application/json:
        schema:
          type: array
          items:
            type: object
            properties:
              category:
                type: string
              rank:
                type: integer
  401:
    description: 인증되지 않은 요청
```

### 9.3 스케줄 API

#### 스케줄 생성
```yaml
POST /api/schedules
tags:
  - Schedule
summary: 새로운 스케줄 생성
security:
  - bearerAuth: []
requestBody:
  required: true
  content:
    application/json:
      schema:
        type: object
        properties:
          title:
            type: string
          description:
            type: string
          datetime:
            type: string
            format: date-time
          importance:
            type: string
            enum: [HIGH, MEDIUM, LOW]
responses:
  201:
    description: 스케줄 생성 성공
  401:
    description: 인증되지 않은 요청
```

#### 스케줄 수정
```yaml
PUT /api/schedules/{scheduleId}
tags:
  - Schedule
summary: 기존 스케줄 수정
security:
  - bearerAuth: []
parameters:
  - name: scheduleId
    in: path
    required: true
    schema:
      type: string
requestBody:
  required: true
  content:
    application/json:
      schema:
        type: object
        properties:
          title:
            type: string
          description:
            type: string
          datetime:
            type: string
            format: date-time
          importance:
            type: string
            enum: [HIGH, MEDIUM, LOW]
responses:
  200:
    description: 스케줄 수정 성공
  404:
    description: 스케줄을 찾을 수 없음
```

#### 스케줄 삭제
```yaml
DELETE /api/schedules/{scheduleId}
tags:
  - Schedule
summary: 스케줄 삭제
security:
  - bearerAuth: []
parameters:
  - name: scheduleId
    in: path
    required: true
    schema:
      type: string
responses:
  200:
    description: 스케줄 삭제 성공
  404:
    description: 스케줄을 찾을 수 없음
```

#### 스케줄 조회
```yaml
GET /api/schedules
tags:
  - Schedule
summary: 사용자의 모든 스케줄 조회
security:
  - bearerAuth: []
responses:
  200:
    description: 스케줄 조회 성공
    content:
      application/json:
        schema:
          type: array
          items:
            type: object
            properties:
              id:
                type: string
              title:
                type: string
              description:
                type: string
              datetime:
                type: string
                format: date-time
              importance:
                type: string
              category:
                type: string
              completed:
                type: boolean
```

#### 날짜 범위로 스케줄 조회
```yaml
GET /api/schedules/range
tags:
  - Schedule
summary: 특정 기간의 스케줄 조회
security:
  - bearerAuth: []
parameters:
  - name: start
    in: query
    required: true
    schema:
      type: string
      format: date-time
  - name: end
    in: query
    required: true
    schema:
      type: string
      format: date-time
responses:
  200:
    description: 스케줄 조회 성공
    content:
      application/json:
        schema:
          type: array
          items:
            type: object
            properties:
              id:
                type: string
              title:
                type: string
              datetime:
                type: string
                format: date-time
              category:
                type: string
```

#### 스케줄 완료 상태 토글
```yaml
PATCH /api/schedules/{scheduleId}/toggle-completion
tags:
  - Schedule
summary: 스케줄 완료 상태 변경
security:
  - bearerAuth: []
parameters:
  - name: scheduleId
    in: path
    required: true
    schema:
      type: string
responses:
  200:
    description: 상태 변경 성공
  404:
    description: 스케줄을 찾을 수 없음
```

### 9.4 보안 스키마
```yaml
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
``` 

###추가 내용
## 3. 페이지별 기능 명세

### 3.1 인증 페이지 (`/auth`)
- **회원가입**
  - 입력 필드:
    - 아이디 (이메일)
    - 비밀번호
    - 비밀번호 확인
    - 이름
  - 유효성 검증:
    - 이메일 형식
    - 비밀번호 일치 여부
    - 필수 입력 여부
  - **동작:**
    1. 회원가입 요청 → 성공 시 서버로부터 JWT 토큰(JSON Web Token) 반환
    2. 토큰 페이로드에 `userId`(MongoDB ObjectId의 hex string)가 포함됨
    3. 로컬 스토리지에 토큰 저장
    4. 미들웨어(Auth Guard)에서 모든 API 호출 시 토큰 유효성 검증 처리
    5. 성공 시 우선순위 설정 페이지로 이동

- **로그인**
  - 입력 필드:
    - 아이디
    - 비밀번호
  - **동작:**
    1. 로그인 요청 → 성공 시 JWT 반환
    2. 토큰 저장 후 스케줄 관리 페이지로 리다이렉트
    3. Auth Guard가 로그인 상태(토큰 유효) 여부를 확인하여 접근 제어

### 3.2 우선순위 설정 페이지 (`/priority`)
- **카테고리 목록:**
  ```typescript
  const categories = [
    "가사", "취미", "자기개발", "건강", "애인",
    "가족", "고정비", "친목", "업무", "구입",
    "학교", "자동차 정비", "시험", "여행", "경제"
  ];
  ```
- **UI 구성:**
  1. 상위 우선순위 섹션
     - 1순위, 2순위, 3순위 카테고리 선택 드롭다운 또는 드래그 앤 드롭
  2. 하위 우선순위 섹션
     - 최하위(하위 1순위), 하위 2순위, 하위 3순위 선택
  3. **저장 버튼**
     - 설정 완료 시 `POST /api/priorities/high` 및 `/api/priorities/low` 호출
- **동작 흐름:**
  - 선택 상태가 변경될 때마다 로컬 스토어에 임시 저장
  - “저장” 클릭 시 백엔드에 상/하위 우선순위 배열 전송

### 3.3 스케줄 관리 페이지 (`/schedule`)
- **전체 레이아웃:**
  - **3구역 분할 그리드** (responsive)
    1. **스케줄 입력 섹션**
       - 필드: 제목 (e.g. "민수와 6시 약속"), 날짜/시간(DateTimePicker), 설명
       - 중요도(상/중/하) 선택
       - 입력 완료 시 LLaMA API 호출하여 카테고리 분류
       - `POST /api/schedules` 요청
    2. **스케줄 리스트 섹션**
       - **탭 뷰**: 월간(30일), 주간(7일), 중요도순
       - 리스트 항목: 날짜, 제목, 카테고리, 중요도 표시
       - 필터 & 정렬 기능
       - 무한 스크롤 또는 페이지네이션
    3. **그래프 시각화 섹션**
       - D3.js(`react-force-graph` 등) 기반 네트워크 그래프
       - 노드: 카테고리별 그룹핑
       - 엣지: 같은 카테고리 간 연관 스케줄 연결
       - 인터랙션: 노드 호버 시 툴팁, 클릭 시 해당 리스트 필터링
- **공통 버튼**
  - 로그인 상태 감지 후 상단 네비게이션에 **로그아웃** 및 **우선순위 재설정** 버튼
  - 우선순위 재설정 클릭 시 `/priority`로 이동

## 4. 공통 컴포넌트 및 미들웨어

- **Auth Guard (미들웨어)**
  - 모든 API 요청 전 JWT 토큰 검증
  - 실패 시 로그인 페이지로 리다이렉트
- **네비게이션 바**
  - 로그인/로그아웃, 우선순위 설정, 홈으로 이동 링크 포함

---

