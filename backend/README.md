# ChogoBot Backend API Server

Node.js + Express 기반의 AI 챗봇 백엔드 서버입니다.

## 📁 프로젝트 구조

```
backend/
├── app.js                 # Express 서버 메인 파일
├── routes/chat.js         # 채팅 라우트 (/api/chat)
├── services/gptService.js # OpenAI GPT API 서비스
├── db/index.js           # MySQL 데이터베이스 연결
├── .env                  # 환경 변수 설정
└── package.json          # 의존성 관리
```

## 🚀 설치 및 실행

### 1. 의존성 설치
```bash
cd backend
npm install
```

### 2. 환경 변수 설정
`.env` 파일을 편집하여 다음 정보를 입력하세요:

```env
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASS=your_database_password
DB_NAME=chogobot_db

# Server Configuration
PORT=3001
```

### 3. MySQL 데이터베이스 설정 (선택사항)
채팅 로그를 저장하려면 다음 테이블을 생성하세요:

```sql
CREATE DATABASE chogobot_db;
USE chogobot_db;

CREATE TABLE chat_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_message TEXT NOT NULL,
    bot_response TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 4. 서버 실행
```bash
# 프로덕션 모드
npm start

# 개발 모드 (nodemon 사용)
npm run dev
```

## 📡 API 엔드포인트

### GET /
- 서버 상태 확인 및 기본 정보

### POST /api/chat
- 채팅 메시지 처리
- **요청 본문:**
  ```json
  {
    "message": "안녕하세요!",
    "conversationHistory": [] // 선택사항
  }
  ```
- **응답:**
  ```json
  {
    "success": true,
    "message": "안녕하세요! 어떻게 도와드릴까요?",
    "timestamp": "2024-06-25T09:45:00.000Z",
    "usage": {
      "prompt_tokens": 10,
      "completion_tokens": 15,
      "total_tokens": 25
    }
  }
  ```

### GET /api/health
- 채팅 서비스 상태 확인

## 🔧 포트 충돌 해결

포트 3001이 이미 사용 중인 경우:
1. `.env` 파일에서 `PORT=3002` 로 변경
2. 또는 다른 포트로 실행: `PORT=3002 npm start`

## 🔑 필수 설정

1. **OpenAI API 키**: `.env` 파일에 유효한 OpenAI API 키를 설정해야 합니다.
2. **CORS 설정**: 현재 `localhost:3000`, `localhost:3001`에서의 요청만 허용합니다.

## 📝 사용 예시

```bash
# 서버 실행 후 테스트
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "안녕하세요!"}'
```

## 🛠 개발 정보

- **Node.js**: v14 이상
- **Express**: 웹 프레임워크
- **OpenAI API**: GPT-3.5-turbo 모델 사용
- **MySQL**: 채팅 로그 저장 (선택사항)
- **CORS**: 프론트엔드 연동 지원 