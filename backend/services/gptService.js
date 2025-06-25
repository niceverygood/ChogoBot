const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

class GPTService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    if (!this.apiKey) {
      console.error('❌ OPENAI_API_KEY is not set in environment variables');
    }
    
    // 시스템 프롬프트 로드
    this.systemPrompt = this.loadSystemPrompt();
  }

  loadSystemPrompt() {
    try {
      const promptPath = path.join(__dirname, '../data/systemPrompt.txt');
      const systemPrompt = fs.readFileSync(promptPath, 'utf8');
      console.log('✅ 처갓집양념치킨 시스템 프롬프트 로드 완료');
      return systemPrompt;
    } catch (error) {
      console.error('❌ 시스템 프롬프트 로드 실패:', error.message);
      return 'You are ChogoBot, a helpful AI assistant for 처갓집양념치킨 franchise consultation. Please respond in Korean and be friendly and informative.';
    }
  }

  async getChatResponse(message, conversationHistory = []) {
    try {
      const messages = [
        {
          role: 'system',
          content: this.systemPrompt
        },
        ...conversationHistory,
        {
          role: 'user',
          content: message
        }
      ];

      const response = await axios.post(
        OPENAI_API_URL,
        {
          model: 'gpt-3.5-turbo',
          messages: messages,
          max_tokens: 1000,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        message: response.data.choices[0].message.content,
        usage: response.data.usage
      };
    } catch (error) {
      console.error('GPT Service Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.error?.message || 'OpenAI API 호출 중 오류가 발생했습니다.'
      };
    }
  }

  async getSuggestedQuestions(conversationHistory = []) {
    try {
      const suggestedQuestionsPrompt = `
당신은 처갓집양념치킨 가맹 상담 전문가입니다. 
지금까지의 대화 내용을 바탕으로 고객이 다음에 궁금해할 만한 추천 질문 3개를 생성해주세요.

조건:
1. 각 질문은 15자 이내의 짧은 제목 형태로 작성
2. 처갓집양념치킨 가맹 사업과 관련된 내용
3. 고객의 관심사와 대화 흐름을 고려
4. 아직 언급되지 않은 새로운 주제 우선

응답 형식은 반드시 다음과 같이 JSON 배열로만 제공:
["질문1", "질문2", "질문3"]

예시:
["창업 비용", "지원 제도", "수익성"]
`;

      const messages = [
        {
          role: 'system',
          content: suggestedQuestionsPrompt
        },
        ...conversationHistory,
        {
          role: 'user',
          content: '위 대화를 바탕으로 추천 질문 3개를 생성해주세요.'
        }
      ];

      const response = await axios.post(
        OPENAI_API_URL,
        {
          model: 'gpt-3.5-turbo',
          messages: messages,
          max_tokens: 200,
          temperature: 0.3
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const suggestedText = response.data.choices[0].message.content.trim();
      
      try {
        // JSON 파싱 시도
        const suggested = JSON.parse(suggestedText);
        if (Array.isArray(suggested) && suggested.length === 3) {
          return {
            success: true,
            questions: suggested
          };
        }
      } catch (parseError) {
        console.error('JSON 파싱 실패:', parseError);
      }

      // 기본 추천 질문으로 폴백
      return {
        success: true,
        questions: ["창업 비용", "가맹 지원", "운영 노하우"]
      };

    } catch (error) {
      console.error('Suggested Questions Error:', error.response?.data || error.message);
      return {
        success: true,
        questions: ["창업 비용", "가맹 지원", "운영 노하우"]
      };
    }
  }
}

module.exports = new GPTService(); 