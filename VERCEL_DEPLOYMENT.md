# 🚀 Vercel 프론트엔드 배포 가이드

## ⚡ 간단한 배포 방법 (권장)

### 1단계: Vercel Dashboard 설정

1. **Vercel Dashboard**에 접속 (https://vercel.com/dashboard)
2. **"New Project"** 클릭
3. **GitHub repository** 연결
   - Repository: `niceverygood/ChogoBot`
   - Branch: `main`

### 2단계: 프로젝트 설정

**중요**: 다음 설정을 반드시 변경하세요:

```
Framework Preset: Create React App
Root Directory: frontend
Build Command: npm run build
Output Directory: build
Install Command: npm install
```

### 3단계: 환경 변수 설정 (선택사항)

필요시 Environment Variables 추가:
```
REACT_APP_API_URL=http://3.107.198.3:3003
```

### 4단계: 배포 실행

**"Deploy"** 버튼 클릭 → 자동 배포 시작

---

## 🔧 수동 배포 방법

### CLI 배포
```bash
# Vercel CLI 설치
npm i -g vercel

# 프론트엔드 폴더에서 배포
cd frontend
vercel --prod
```

### 로컬 빌드 테스트
```bash
cd frontend
npm install
npm run build
npm start
```

---

## 🌐 API 연동 설정

프론트엔드는 자동으로 환경을 감지합니다:

- **개발환경**: `http://localhost:3003` (로컬 백엔드)
- **프로덕션**: `http://3.107.198.3:3003` (EC2 백엔드)

---

## 🔄 자동 배포

GitHub의 `main` 브랜치에 푸시하면 Vercel이 자동으로 재배포합니다.

---

## 🚨 문제 해결

### 빌드 오류
- **Root Directory**가 `frontend`로 설정되었는지 확인
- **Build Command**가 `npm run build`인지 확인

### API 연결 오류
- EC2 백엔드 서버가 실행 중인지 확인: `http://3.107.198.3:3003`
- CORS 설정이 올바른지 확인

### 캐시 문제
```bash
# Vercel에서 캐시 지우기
vercel --prod --force
```

---

## 📞 지원

배포 중 문제가 발생하면:
1. Vercel Dashboard의 **Functions** 탭에서 로그 확인
2. **Deployments** 탭에서 빌드 로그 확인
3. EC2 백엔드 상태 확인: `curl http://3.107.198.3:3003` 