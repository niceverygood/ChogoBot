#!/bin/bash

# EC2 배포 스크립트
# 사용법: ./deploy.sh your-ec2-ip your-key.pem

if [ "$#" -ne 2 ]; then
    echo "사용법: $0 <EC2-IP> <KEY-FILE.pem>"
    echo "예시: $0 54.123.45.67 my-key.pem"
    exit 1
fi

EC2_IP=$1
KEY_FILE=$2
EC2_USER="ubuntu"

echo "🚀 EC2에 ChogoBot 백엔드 배포 시작..."

# 1. 파일 압축 (민감한 파일 제외)
echo "📦 프로젝트 파일 압축 중..."
tar --exclude='.git' \
    --exclude='node_modules' \
    --exclude='frontend' \
    --exclude='backend/.env' \
    --exclude='.DS_Store' \
    -czf chogobot-backend.tar.gz backend/ package.json

# 2. EC2에 파일 업로드
echo "📤 EC2에 파일 업로드 중..."
scp -i "$KEY_FILE" chogobot-backend.tar.gz "$EC2_USER@$EC2_IP:~/"
scp -i "$KEY_FILE" backend/.env "$EC2_USER@$EC2_IP:~/backend.env"

# 3. EC2에서 배포 실행
echo "🔧 EC2에서 설치 및 배포 실행 중..."
ssh -i "$KEY_FILE" "$EC2_USER@$EC2_IP" << 'EOF'
    # 시스템 업데이트
    sudo apt update
    sudo apt upgrade -y

    # Node.js 18 설치
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs

    # PM2 설치
    sudo npm install -g pm2

    # MySQL 클라이언트 설치
    sudo apt-get install -y mysql-client

    # 기존 애플리케이션 정지
    pm2 stop chogobot-backend || true

    # 프로젝트 디렉토리 생성
    mkdir -p ~/chogobot

    # 파일 압축 해제
    tar -xzf chogobot-backend.tar.gz -C ~/chogobot/

    # 환경 변수 파일 이동
    mv backend.env ~/chogobot/backend/.env

    # 프로젝트 디렉토리로 이동
    cd ~/chogobot

    # 의존성 설치
    cd backend
    npm install --production

    # PM2로 애플리케이션 시작
    pm2 start app.js --name "chogobot-backend" --env production

    # PM2 프로세스 목록 확인
    pm2 list

    # 부팅시 자동 시작 설정
    pm2 startup
    pm2 save

    echo "✅ 배포 완료!"
    echo "🌐 Backend URL: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):3003"
EOF

# 4. 임시 파일 정리
rm chogobot-backend.tar.gz

echo "🎉 배포가 완료되었습니다!"
echo "📝 다음 단계:"
echo "   1. EC2 보안 그룹에서 3003 포트가 열려있는지 확인"
echo "   2. 데이터베이스 연결 설정 확인"
echo "   3. http://$EC2_IP:3003 에서 API 테스트" 