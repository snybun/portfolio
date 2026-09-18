import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './Chatbot.css'

// Preset quick inquiries for direct portfolio exploration
const QUICK_PROMPTS = [
  { label: 'Tech Stack', query: 'What is your main tech stack?' },
  { label: 'Featured Work', query: 'Tell me about your featured projects' },
  { label: 'Availability', query: 'Are you open for freelance or full-time roles?' },
  { label: 'Contact', query: 'How can I get in touch with you?' },
]

// Portfolio Knowledge Engine - Direct, minimal, professional
const getPortfolioResponse = (userInput) => {
  const query = userInput.toLowerCase().trim()

  if (query.includes('skill') || query.includes('tech') || query.includes('stack') || query.includes('language')) {
    return "Mark's core stack includes **React 19, JavaScript (ES6+), Framer Motion, Modern CSS, Three.js / WebGL**, and Node.js. He specializes in high-performance interfaces, clean typography, and fluid web interactions."
  }

  if (query.includes('project') || query.includes('work') || query.includes('portfolio') || query.includes('demo') || query.includes('case')) {
    return "Featured work includes interactive 3D web applications, minimal design systems, and modern front-end experiences. You can inspect the detailed case studies in the **Work** section above."
  }

  if (query.includes('hire') || query.includes('job') || query.includes('freelance') || query.includes('available') || query.includes('opportunity')) {
    return "Mark is currently open for select freelance contracts, creative collaborations, and full-time engineering roles. Feel free to connect using the **Contact** section below."
  }

  if (query.includes('contact') || query.includes('email') || query.includes('reach') || query.includes('touch') || query.includes('message')) {
    return "You can get in touch using the **Contact Form** at the bottom of the page, or connect via GitHub and LinkedIn linked in the footer."
  }

  if (query.includes('hello') || query.includes('hi') || query.includes('hey') || query.includes('sup') || query.includes('who are you')) {
    return "Hello. This is Mark's portfolio guide. You can ask about his tech stack, featured projects, or availability."
  }

  return "I can share details on Mark's technical stack, featured case studies, and availability. Choose one of the quick tags below or enter an inquiry."
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: "Hello. Feel free to ask about Mark's technical stack, featured work, or availability.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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

  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputValue
    if (!text.trim()) return

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text.trim(),
      time: timestamp,
    }

    setMessages((prev) => [...prev, userMsg])
    if (!textToSend) setInputValue('')
    setIsTyping(true)

    // Minimal delay simulating inquiry response
    setTimeout(() => {
      const responseText = getPortfolioResponse(text)
      const assistantMsg = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, assistantMsg])
      setIsTyping(false)
    }, 500)
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
        text: "Conversation cleared. Feel free to ask another question.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ])
  }

  return (
    <div className="chatbot-root">
      {/* Animated Window */}
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
                <div className="chatbot-avatar">M.</div>
                <div>
                  <h3 className="chatbot-header-title">Mark / Inquiries</h3>
                  <span className="chatbot-header-subtitle">Portfolio Guide</span>
                </div>
              </div>

              <div className="chatbot-header-actions">
                <button
                  className="chatbot-icon-btn"
                  onClick={handleClearChat}
                  title="Clear Conversation"
                  aria-label="Clear chat messages"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
                <button
                  className="chatbot-icon-btn"
                  onClick={() => setIsOpen(false)}
                  title="Close"
                  aria-label="Close chatbot window"
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
                    {msg.text.split('**').map((part, index) => 
                      index % 2 === 1 ? <strong key={index}>{part}</strong> : part
                    )}
                  </div>
                  <span className="chatbot-msg-time">{msg.time}</span>
                </div>
              ))}

              {isTyping && (
                <div className="chatbot-typing-indicator" aria-label="Typing">
                  <span className="chatbot-typing-dot" />
                  <span className="chatbot-typing-dot" />
                  <span className="chatbot-typing-dot" />
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
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
                  placeholder="Type an inquiry..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  type="submit"
                  className="chatbot-send-btn"
                  disabled={!inputValue.trim()}
                  aria-label="Send message"
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

      {/* Floating Toggle Launcher Button */}
      <motion.button
        className={`chatbot-toggle-btn ${isOpen ? 'chatbot-toggle-btn--active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close Inquiries" : "Open Inquiries"}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        transition={{ duration: 0.15 }}
      >
        {isOpen ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span className="chatbot-toggle-label">Inquiries</span>
          </>
        )}
      </motion.button>
    </div>
  )
}
