# ChogoBot Frontend

React 기반 AI 챗봇 웹 애플리케이션

## 🚀 기능

- 실시간 채팅 인터페이스
- OpenAI GPT와 연동된 AI 응답
- 반응형 디자인 (Tailwind CSS)
- 자동 스크롤 기능
- 로딩 상태 표시
- 대화 기록 저장

## 📁 프로젝트 구조

```
frontend/
├── src/
│   ├── components/
│   │   └── ChatBox.js          # 메인 채팅 컴포넌트
│   ├── App.js                  # 앱 컴포넌트
│   ├── index.js               # 진입점
│   └── index.css              # 전역 스타일 (Tailwind CSS)
├── public/
├── package.json
├── tailwind.config.js         # Tailwind 설정
└── postcss.config.js          # PostCSS 설정
```

## 🛠 설치 및 실행

### 1. 의존성 설치
```bash
cd frontend
npm install
```

### 2. 개발 서버 실행
```bash
npm start
```

### 3. 빌드
```bash
npm run build
```

## 🔧 환경 설정

### 백엔드 API 연결
ChatBox 컴포넌트에서 백엔드 API 엔드포인트를 설정하세요:
```javascript
const response = await fetch('http://localhost:3003/api/chat', {
  // ...
});
```

### CORS 설정
백엔드에서 프론트엔드 주소를 허용하도록 설정해야 합니다:
- 기본 개발 서버: `http://localhost:3000`

## 🎨 UI/UX 특징

- **반응형 디자인**: 모바일과 데스크톱 모두 지원
- **실시간 피드백**: 입력 중 상태 표시
- **자동 스크롤**: 새 메시지 시 자동으로 스크롤
- **로딩 애니메이션**: 봇 응답 대기 중 표시
- **에러 핸들링**: 네트워크 오류 시 사용자 알림

## 📱 사용법

1. 메시지 입력창에 질문이나 대화 내용 입력
2. "전송" 버튼 클릭 또는 Enter 키 누르기
3. AI 봇의 응답 확인
4. 대화 기록은 자동으로 저장됨

## 🔌 API 통신

### 요청 형식
```javascript
POST /api/chat
Content-Type: application/json

{
  "message": "사용자 메시지",
  "conversationHistory": [
    {"role": "user", "content": "이전 사용자 메시지"},
    {"role": "assistant", "content": "이전 봇 응답"}
  ]
}
```

### 응답 형식
```javascript
{
  "success": true,
  "message": "봇 응답 메시지",
  "timestamp": "2024-06-25T09:00:00.000Z",
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 20,
    "total_tokens": 30
  }
}
```
