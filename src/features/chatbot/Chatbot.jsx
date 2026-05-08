import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Trash2, Bot, User, Minimize2 } from 'lucide-react';
import { useChatbot } from '../../hooks/useChatbot';
import { motion, AnimatePresence } from 'framer-motion';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const { messages, sendMessage, isTyping, clearChat } = useChatbot();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, isTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        className="chatbot-trigger flex-center shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-window card glass"
            initial={{ opacity: 0, y: 50, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: 50, scale: 0.9, x: 20 }}
          >
            <div className="chat-header">
              <div className="flex-center" style={{ gap: '12px' }}>
                <div className="bot-avatar"><Bot size={20} /></div>
                <div>
                  <h4>AstroAI Assistant</h4>
                  <p className="status">{isTyping ? 'Typing...' : 'Online'}</p>
                </div>
              </div>
              <div className="header-actions">
                <button onClick={clearChat} title="Clear Chat"><Trash2 size={18} /></button>
                <button onClick={() => setIsOpen(false)}><Minimize2 size={18} /></button>
              </div>
            </div>

            <div className="chat-messages">
              {messages.map((msg, idx) => (
                <div key={idx} className={`message-wrapper ${msg.role}`}>
                  <div className="message-bubble">
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="message-wrapper assistant">
                  <div className="message-bubble typing">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className="chat-input" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Ask about ISS or News..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isTyping}
              />
              <button type="submit" disabled={!input.trim() || isTyping} className="send-btn">
                <Send size={20} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .chatbot-trigger {
          position: fixed;
          bottom: 32px;
          right: 32px;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: var(--accent-primary);
          color: white;
          z-index: 1000;
        }

        .chatbot-window {
          position: fixed;
          bottom: 110px;
          right: 32px;
          width: 400px;
          height: 600px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          padding: 0;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }

        .chat-header {
          padding: 20px;
          background: var(--accent-primary);
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .bot-avatar {
          background: rgba(255,255,255,0.2);
          padding: 8px;
          border-radius: 10px;
        }

        .chat-header h4 { margin: 0; font-size: 1rem; }
        .status { font-size: 0.75rem; opacity: 0.8; margin: 0; }

        .header-actions { display: flex; gap: 12px; }
        .header-actions button { color: white; opacity: 0.8; transition: opacity 0.2s; }
        .header-actions button:hover { opacity: 1; }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          background: var(--bg-primary);
        }

        .message-wrapper {
          display: flex;
          width: 100%;
        }

        .message-wrapper.user { justify-content: flex-end; }
        .message-wrapper.assistant { justify-content: flex-start; }

        .message-bubble {
          max-width: 80%;
          padding: 12px 16px;
          border-radius: 16px;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .user .message-bubble {
          background: var(--accent-primary);
          color: white;
          border-bottom-right-radius: 4px;
        }

        .assistant .message-bubble {
          background: var(--bg-secondary);
          color: var(--text-primary);
          border: 1px solid var(--border-color);
          border-bottom-left-radius: 4px;
        }

        .typing span {
          display: inline-block;
          width: 6px;
          height: 6px;
          background: var(--text-muted);
          border-radius: 50%;
          margin: 0 2px;
          animation: bounce 1.4s infinite ease-in-out both;
        }
        .typing span:nth-child(1) { animation-delay: -0.32s; }
        .typing span:nth-child(2) { animation-delay: -0.16s; }

        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1.0); }
        }

        .chat-input {
          padding: 20px;
          background: var(--bg-secondary);
          border-top: 1px solid var(--border-color);
          display: flex;
          gap: 12px;
        }

        .chat-input input {
          flex: 1;
          border: 1px solid var(--border-color);
          background: var(--bg-primary);
          color: var(--text-primary);
          padding: 10px 16px;
          border-radius: 12px;
          outline: none;
        }

        .send-btn {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: var(--accent-primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .send-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        @media (max-width: 500px) {
          .chatbot-window {
            width: calc(100% - 40px);
            right: 20px;
            bottom: 100px;
          }
        }
      `}</style>
    </>
  );
};

export default Chatbot;
