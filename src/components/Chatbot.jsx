import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchAIResponse } from '../services/aiService'
import './Chatbot.css'

// Quick inquiry tags in all lowercase
const QUICK_PROMPTS = [
  { label: 'stack', query: 'what is your tech stack?' },
  { label: 'projects', query: 'tell me about your featured projects' },
  { label: 'experience', query: 'what is your work experience?' },
  { label: 'availability', query: 'are you open for freelance or full-time roles?' },
  { label: 'contact', query: 'how can i get in touch with you?' },
]

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: "hey, i'm mark's portfolio assistant. ask me anything about his projects, skills, experience, or availability.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isTyping, isOpen])

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputValue
    if (!text.trim()) return

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase()

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text.trim().toLowerCase(),
      time: timestamp,
    }

    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    if (!textToSend) setInputValue('')
    setIsTyping(true)

    try {
      const responseText = await fetchAIResponse(text, nextMessages)
      const assistantMsg = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: responseText.toLowerCase(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase(),
      }
      setMessages((prev) => [...prev, assistantMsg])
    } catch (err) {
      console.error('Failed to get AI response:', err)
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: "sorry, i ran into an issue answering that. feel free to ask again or reach out directly.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase(),
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleClearChat = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'assistant',
        text: "chat cleared. what else would you like to know?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase(),
      },
    ])
  }

  return (
    <div className="chatbot-root">
      {/* Animated Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-window"
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <div className="chatbot-header">
              <div className="chatbot-header-info">
                <div className="chatbot-avatar">m.</div>
                <div>
                  <h3 className="chatbot-header-title">mark</h3>
                  <span className="chatbot-header-subtitle">portfolio assistant</span>
                </div>
              </div>

              <div className="chatbot-header-actions">
                <button
                  className="chatbot-icon-btn"
                  onClick={handleClearChat}
                  title="clear chat"
                  aria-label="clear chat messages"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
                <button
                  className="chatbot-icon-btn"
                  onClick={() => setIsOpen(false)}
                  title="close"
                  aria-label="close chat window"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages Body */}
            <div className="chatbot-messages">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`chatbot-msg-row chatbot-msg-row--${msg.sender}`}
                >
                  <div className="chatbot-msg-bubble">
                    {msg.text}
                  </div>
                  <span className="chatbot-msg-time">{msg.time}</span>
                </div>
              ))}

              {isTyping && (
                <div className="chatbot-typing-indicator" aria-label="typing">
                  <span className="chatbot-typing-dot" />
                  <span className="chatbot-typing-dot" />
                  <span className="chatbot-typing-dot" />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestion Chips */}
            <div className="chatbot-presets">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  className="chatbot-preset-chip"
                  onClick={() => handleSendMessage(prompt.query)}
                >
                  {prompt.label}
                </button>
              ))}
            </div>

            {/* Input Footer */}
            <div className="chatbot-footer">
              <form
                className="chatbot-input-form"
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendMessage()
                }}
              >
                <input
                  type="text"
                  className="chatbot-input"
                  placeholder="type a message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  type="submit"
                  className="chatbot-send-btn"
                  disabled={!inputValue.trim()}
                  aria-label="send message"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="19" x2="12" y2="5" />
                    <polyline points="5 12 12 5 19 12" />
                  </svg>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Launcher Button - Just the Icon */}
      <motion.button
        className="chatbot-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "close chat" : "open chat"}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        transition={{ duration: 0.15 }}
      >
        {isOpen ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </motion.button>
    </div>
  )
}
