import React, { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';

const ChatBox = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: '안녕하세요! 처갓집양념치킨 가맹 상담 챗봇 ChogoBot입니다. 🐔\n\n가맹 창업에 대한 궁금한 점이 있으시면 언제든 문의해 주세요!\n\n• 창업 비용 및 초기 투자금\n• 치킨 재료와 품질 정책\n• 가맹 지원 제도 및 혜택\n• 포상 제도 및 수익성\n• 교육 프로그램 등\n\n무엇을 도와드릴까요? 😊',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentSuggestedQuestions, setCurrentSuggestedQuestions] = useState([
    "창업비용", "가맹 지원", "운영 경험"
  ]);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const messagesEndRef = useRef(null);

  // 마크다운 설정
  marked.setOptions({
    breaks: true, // 줄바꿈을 <br>로 변환
    gfm: true,    // GitHub Flavored Markdown 사용
  });

  // 마크다운을 HTML로 변환하는 함수
  const renderMarkdown = (content) => {
    return marked.parse(content);
  };

  // 사용자 메시지 개수 계산
  const getUserMessageCount = () => {
    return messages.filter(msg => msg.type === 'user').length;
  };

  // 상담사 연결 버튼 표시 여부
  const shouldShowConnectButton = () => {
    return getUserMessageCount() >= 5;
  };

  // 자동 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentSuggestedQuestions]);

  // 메시지 전송 (일반)
  const sendMessage = async (e) => {
    e.preventDefault();
    await handleSendMessage(inputMessage);
    setInputMessage('');
  };

  // 추천 질문 전송
  const sendSuggestedQuestion = async (question) => {
    await handleSendMessage(question);
  };

  // 공통 메시지 전송 로직
  const handleSendMessage = async (messageContent) => {
    if (!messageContent.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageContent,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageContent,
          conversationHistory: messages.filter(msg => msg.type === 'user' || msg.type === 'bot').map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.content
          }))
        }),
      });

      const data = await response.json();

      if (data.success) {
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: data.message,
          timestamp: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, botMessage]);
        
        // 새로운 추천 질문 업데이트
        if (data.suggestedQuestions && Array.isArray(data.suggestedQuestions)) {
          setCurrentSuggestedQuestions(data.suggestedQuestions);
        }
      } else {
        throw new Error(data.error || '응답을 받을 수 없습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        content: `오류가 발생했습니다: ${error.message}`,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // 엔터키 처리 (모바일에서는 Shift+Enter만 줄바꿈)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  // 송신 아이콘 SVG
  const SendIcon = () => (
    <svg className="send-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="currentColor"/>
    </svg>
  );

  // 상담사 연결 모달 컴포넌트
  const ConnectModal = () => {
    if (!showConnectModal) return null;

    return (
      <div className="modal-overlay" onClick={() => setShowConnectModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">상담사 연결</h2>
            <button 
              className="modal-close-button"
              onClick={() => setShowConnectModal(false)}
              aria-label="닫기"
            >
              ✕
            </button>
          </div>
          <div className="modal-body">
            <div className="contact-info">
              <div className="contact-icon">📞</div>
              <div className="contact-details">
                <h3>가맹문의</h3>
                <a href="tel:010-4054-8153" className="phone-number">
                  010-4054-8153
                </a>
                <p className="contact-note">
                  전문 상담사가 친절하게 안내해드립니다.
                </p>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button 
              className="modal-confirm-button"
              onClick={() => setShowConnectModal(false)}
            >
              확인
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="chatbox-container">
      {/* 헤더 */}
      <div className="chatbox-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-container">
              <img 
                src="/chogobot-logo.png" 
                alt="ChogoBot Logo" 
                className="logo-image"
                onError={(e) => {
                  // 이미지 로드 실패 시 폴백 텍스트
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div className="logo-fallback" style={{display: 'none'}}>
                🐔
              </div>
            </div>
            <div className="title-section">
              <h1 className="chatbox-title">처갓집 양념치킨</h1>
              <p className="chatbox-subtitle">가맹사업 문의 AI 챗봇</p>
            </div>
          </div>
          <div className="status-indicator">
            <div className="status-dot"></div>
            <span className="status-text">온라인</span>
          </div>
        </div>
      </div>

      {/* 상담사 연결 버튼 (조건부 표시) */}
      {shouldShowConnectButton() && (
        <div className="connect-button-container">
          <button 
            className="connect-button"
            onClick={() => setShowConnectModal(true)}
          >
            📞 상담사 연결하기
          </button>
        </div>
      )}

      {/* 메시지 영역 */}
      <div className="chatbox-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message-container ${message.type}`}
          >
            <div className={`message-bubble ${message.type}`}>
              <div 
                className="message-content"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
              />
              <p className={`message-timestamp ${message.type}`}>
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}
        
        {/* 로딩 인디케이터 */}
        {isLoading && (
          <div className="loading-container">
            <div className="loading-bubble">
              <div className="loading-dots">
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
              </div>
              <span className="loading-text">답변 중...</span>
            </div>
          </div>
        )}

        {/* 추천 질문 메시지 (채팅창 안에 표시) */}
        {!isLoading && messages.length > 0 && (
          <div className="message-container suggested">
            <div className="message-bubble suggested">
              <p className="suggested-title">💡 이런 질문은 어떠세요?</p>
              <div className="suggested-buttons-inline">
                {currentSuggestedQuestions.map((question, index) => (
                  <button
                    key={`${question}-${index}`}
                    onClick={() => sendSuggestedQuestion(question)}
                    className="suggested-button-inline"
                    disabled={isLoading}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 (항상 표시) */}
      <div className="chatbox-input">
        <form onSubmit={sendMessage} className="input-form">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요..."
            disabled={isLoading}
            className="input-field"
            rows={1}
            style={{
              resize: 'none',
              minHeight: '2.75rem',
              maxHeight: '6rem',
              overflow: 'hidden'
            }}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="send-button"
            aria-label="메시지 전송"
          >
            {isLoading ? (
              <div className="spinner"></div>
            ) : (
              <SendIcon />
            )}
          </button>
        </form>
      </div>

      {/* 상담사 연결 모달 */}
      <ConnectModal />
    </div>
  );
};

export default ChatBox; 