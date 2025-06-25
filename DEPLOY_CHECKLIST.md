# ✅ EC2 배포 체크리스트

## 🔧 배포 전 준비사항

### AWS 설정
- [ ] EC2 인스턴스 생성 완료
- [ ] 보안 그룹에서 포트 3003, 80, 443, 22 열기
- [ ] Key Pair (.pem 파일) 다운로드
- [ ] 탄력적 IP 할당 (선택사항)

### 데이터베이스 설정
- [ ] AWS RDS MySQL 인스턴스 생성 또는
- [ ] EC2에 MySQL 설치 계획 수립
- [ ] 데이터베이스 연결 정보 확인

### 로컬 환경 확인
- [ ] `.env` 파일에 모든 환경 변수 설정 완료
- [ ] OpenAI API 키 유효성 확인
- [ ] 로컬에서 백엔드 정상 작동 확인

## 🚀 배포 실행

### 1단계: 배포 스크립트 실행
```bash
# 실행 권한 확인
ls -la deploy.sh

# 배포 실행
./deploy.sh [EC2_IP] [KEY_FILE.pem]
```

### 2단계: 배포 후 확인
- [ ] EC2에 SSH 접속 가능
- [ ] PM2 프로세스 상태 확인: `pm2 list`
- [ ] API 엔드포인트 응답 확인: `curl http://EC2_IP:3003`
- [ ] 데이터베이스 연결 확인
- [ ] 로그 확인: `pm2 logs chogobot-backend`

## 🧪 테스트

### API 테스트
```bash
# 기본 엔드포인트 테스트
curl http://YOUR_EC2_IP:3003

# 채팅 API 테스트
curl -X POST http://YOUR_EC2_IP:3003/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "안녕하세요"}'
```

### 프론트엔드 연동 테스트
- [ ] React 앱에서 API URL을 EC2 주소로 변경
- [ ] CORS 정책 확인
- [ ] 채팅 기능 정상 작동 확인

## 🔒 보안 점검

- [ ] EC2 보안 그룹에서 불필요한 포트 차단
- [ ] SSH 접근을 특정 IP로 제한
- [ ] RDS 보안 그룹에서 EC2만 접근 허용
- [ ] 환경 변수에 민감한 정보 노출 여부 확인

## 📊 모니터링 설정

- [ ] PM2 자동 시작 설정 확인: `pm2 startup`
- [ ] 로그 로테이션 설정
- [ ] CloudWatch 모니터링 설정 (선택사항)
- [ ] 헬스체크 엔드포인트 설정

## 🔄 백업 및 업데이트 계획

- [ ] 데이터베이스 백업 전략 수립
- [ ] 코드 업데이트 프로세스 문서화
- [ ] 롤백 계획 수립

## 🌐 도메인 및 HTTPS (선택사항)

- [ ] 도메인 구매 및 DNS 설정
- [ ] Let's Encrypt SSL 인증서 설정
- [ ] Nginx 리버스 프록시 설정
- [ ] HTTPS 리다이렉션 설정

## 📞 배포 완료 후 확인사항

1. **서비스 접근 확인**
   - http://YOUR_EC2_IP:3003 접속 가능
   - API 응답 정상

2. **성능 확인**
   - 응답 시간 측정
   - 메모리 사용량 확인
   - CPU 사용률 확인

3. **로그 확인**
   - 에러 로그 없음
   - 정상적인 요청 로그 기록

4. **데이터베이스 확인**
   - 연결 정상
   - 테이블 생성 확인
   - 데이터 입력/조회 테스트

## 🚨 문제 발생시 대응

### 일반적인 문제와 해결책

1. **502 Bad Gateway**
   ```bash
   pm2 restart chogobot-backend
   sudo systemctl restart nginx
   ```

2. **데이터베이스 연결 실패**
   ```bash
   # 연결 정보 확인
   cat ~/chogobot/backend/.env
   # MySQL 클라이언트로 직접 연결 테스트
   mysql -h DB_HOST -u DB_USER -p
   ```

3. **메모리 부족**
   ```bash
   # 프로세스 메모리 사용량 확인
   pm2 monit
   # 시스템 메모리 확인
   free -h
   ```

## 📋 배포 완료 보고

배포 완료 후 다음 정보를 정리:

- **서버 정보**: EC2 인스턴스 ID, IP 주소
- **접속 URL**: http://YOUR_EC2_IP:3003
- **데이터베이스**: RDS 엔드포인트 또는 로컬 MySQL
- **배포 시간**: YYYY-MM-DD HH:MM
- **버전**: Git 커밋 해시
- **테스트 결과**: 성공/실패 여부 