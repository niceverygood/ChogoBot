module.exports = {
  apps: [{
    name: 'chogobot-backend',
    script: './app.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      PORT: 3003
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3003
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    // 헬스체크 설정
    health_check_grace_period: 3000,
    min_uptime: '10s',
    max_restarts: 5,
    // 클러스터 모드 (필요시)
    exec_mode: 'fork'
  }]
}; 