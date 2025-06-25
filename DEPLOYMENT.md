# 🚀 ChogoBot EC2 배포 가이드

## 📋 배포 준비사항

### 1. AWS EC2 인스턴스 설정
```bash
# EC2 인스턴스 스펙 권장사항
- AMI: Ubuntu 22.04 LTS
- Instance Type: t3.micro (프리티어) 또는 t3.small
- Storage: 8GB 이상
- Key Pair: 새로 생성하거나 기존 것 사용
```

### 2. 보안 그룹 설정
다음 포트들을 인바운드 규칙에 추가:
```
- SSH (22): 0.0.0.0/0 (개발시만, 운영시에는 특정 IP로 제한)
- HTTP (80): 0.0.0.0/0
- HTTPS (443): 0.0.0.0/0
- Custom TCP (3003): 0.0.0.0/0 (API 포트)
```

## 🔧 데이터베이스 설정 옵션

### 옵션 1: AWS RDS (권장)
```bash
# RDS MySQL 8.0 인스턴스 생성
# .env 파일에서 DB_HOST를 RDS 엔드포인트로 변경
DB_HOST=your-rds-endpoint.region.rds.amazonaws.com
DB_USER=admin
DB_PASS=your-secure-password
DB_NAME=chogobot_db
```

### 옵션 2: EC2에 MySQL 직접 설치
```bash
# EC2에서 MySQL 설치 (배포 스크립트에 추가)
sudo apt install mysql-server -y
sudo mysql_secure_installation

# 데이터베이스 생성
sudo mysql -u root -p
CREATE DATABASE chogobot_db;
CREATE USER 'chogobot'@'localhost' IDENTIFIED BY 'your-password';
GRANT ALL PRIVILEGES ON chogobot_db.* TO 'chogobot'@'localhost';
FLUSH PRIVILEGES;
```

## 🚀 배포 실행

### 1. 자동 배포 (권장)
```bash
# 배포 스크립트 실행
./deploy.sh YOUR_EC2_IP YOUR_KEY_FILE.pem

# 예시:
./deploy.sh 54.123.45.67 my-ec2-key.pem
```

### 2. 수동 배포
```bash
# 1. 파일 업로드
scp -i your-key.pem -r backend/ ubuntu@your-ec2-ip:~/chogobot/
scp -i your-key.pem backend/.env ubuntu@your-ec2-ip:~/chogobot/backend/

# 2. EC2 접속
ssh -i your-key.pem ubuntu@your-ec2-ip

# 3. 의존성 설치 및 실행
cd ~/chogobot/backend
npm install --production
pm2 start ecosystem.config.js --env production
```

## 🔒 환경 변수 설정

EC2의 `.env` 파일에서 다음 설정을 확인:

```env
# 프로덕션 설정
NODE_ENV=production

# OpenAI API
OPENAI_API_KEY=your-openai-api-key

# 데이터베이스 (RDS 사용시)
DB_HOST=your-rds-endpoint.region.rds.amazonaws.com
DB_USER=admin
DB_PASS=your-secure-password
DB_NAME=chogobot_db

# 서버 설정
PORT=3003
```

## 🌐 Nginx 설정 (선택사항)

### 1. Nginx 설치
```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 2. 설정 파일 복사
```bash
sudo cp nginx.conf /etc/nginx/sites-available/chogobot
sudo ln -s /etc/nginx/sites-available/chogobot /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

## 📊 모니터링 및 관리

### PM2 명령어
```bash
# 프로세스 상태 확인
pm2 list

# 로그 확인
pm2 logs chogobot-backend

# 애플리케이션 재시작
pm2 restart chogobot-backend

# 애플리케이션 중지
pm2 stop chogobot-backend

# 메모리 사용량 확인
pm2 monit
```

### 시스템 모니터링
```bash
# 시스템 리소스 확인
htop
df -h
free -h

# 네트워크 포트 확인
sudo netstat -tulpn | grep :3003
```

## 🔧 트러블슈팅

### 일반적인 문제들

1. **포트 접근 불가**
   ```bash
   # 방화벽 확인
   sudo ufw status
   sudo ufw allow 3003
   ```

2. **데이터베이스 연결 오류**
   ```bash
   # MySQL 연결 테스트
   mysql -h DB_HOST -u DB_USER -p DB_NAME
   ```

3. **메모리 부족**
   ```bash
   # 스왑 파일 생성
   sudo fallocate -l 1G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   ```

## 🔄 업데이트 배포

```bash
# 새 버전 배포
./deploy.sh YOUR_EC2_IP YOUR_KEY_FILE.pem

# 또는 Git을 통한 업데이트
ssh -i your-key.pem ubuntu@your-ec2-ip
cd ~/chogobot
git pull origin main
cd backend
npm install --production
pm2 restart chogobot-backend
```

## 📈 성능 최적화

### PM2 클러스터 모드
```javascript
// ecosystem.config.js 수정
module.exports = {
  apps: [{
    name: 'chogobot-backend',
    script: './app.js',
    instances: 'max', // CPU 코어 수만큼 인스턴스 생성
    exec_mode: 'cluster'
  }]
};
```

### 로그 로테이션
```bash
# PM2 로그 로테이션 설정
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

## 📞 지원

배포 중 문제가 발생하면:
1. 로그 확인: `pm2 logs chogobot-backend`
2. 시스템 로그: `sudo journalctl -u nginx -f`
3. API 테스트: `curl http://your-ec2-ip:3003` 