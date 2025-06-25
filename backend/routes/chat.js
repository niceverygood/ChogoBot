const express = require('express');
const router = express.Router();
const gptService = require('../services/gptService');
const { pool } = require('../db');

// POST /api/chat - 채팅 메시지 처리
router.post('/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    // 입력 검증
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({
        success: false,
        error: '메시지를 입력해주세요.'
      });
    }

    // GPT 응답과 추천 질문을 병렬로 요청
    const [gptResponse, suggestedQuestionsResponse] = await Promise.all([
      gptService.getChatResponse(message, conversationHistory),
      gptService.getSuggestedQuestions([
        ...conversationHistory,
        { role: 'user', content: message }
      ])
    ]);

    if (!gptResponse.success) {
      return res.status(500).json({
        success: false,
        error: gptResponse.error
      });
    }

    // 성공적인 응답 (추천 질문 포함)
    res.json({
      success: true,
      message: gptResponse.message,
      suggestedQuestions: suggestedQuestionsResponse.questions || ["창업 비용", "가맹 지원", "운영 노하우"],
      timestamp: new Date().toISOString(),
      usage: gptResponse.usage
    });

    // 선택적: 채팅 로그를 데이터베이스에 저장
    try {
      if (pool) {
        await pool.execute(
          'INSERT INTO chat_logs (user_message, bot_response, created_at) VALUES (?, ?, NOW())',
          [message, gptResponse.message]
        );
      }
    } catch (dbError) {
      console.warn('채팅 로그 저장 실패 (DB 연결 없음):', dbError.message);
      // 데이터베이스 저장 실패해도 응답은 정상적으로 반환
    }

  } catch (error) {
    console.error('Chat route error:', error);
    res.status(500).json({
      success: false,
      error: '서버 내부 오류가 발생했습니다.'
    });
  }
});

// GET /api/chat/health - 헬스 체크
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Chat service is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 