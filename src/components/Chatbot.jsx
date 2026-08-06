import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './Chatbot.css'

// Preset quick questions for fast user interaction
const QUICK_PROMPTS = [
  { label: '🚀 Top Skills', query: 'What are your main tech skills?' },
  { label: '📁 Featured Projects', query: 'Tell me about your projects' },
  { label: '💼 Available for Hire?', query: 'Are you open for freelance or full-time roles?' },
  { label: '📬 Contact Info', query: 'How can I get in touch with you?' },
]

// Portfolio Knowledge Base Response Engine
const getPortfolioResponse = (userInput) => {
  const query = userInput.toLowerCase().trim()

  if (query.includes('skill') || query.includes('tech') || query.includes('stack') || query.includes('language')) {
    return "My primary stack includes **React 19, JavaScript (ES6+), Framer Motion, CSS3 / HTML5, 3D Canvas / Three.js**, and modern web tooling like Vite and Node.js. I focus on high-performance, visually captivating interfaces!"
  }

  if (query.includes('project') || query.includes('work') || query.includes('portfolio') || query.includes('demo')) {
    return "I've built interactive 3D web applications, sleek portfolio templates, creative agency sites, and full-stack web apps. Check out the **Work** section right on this page to see detailed case studies!"
  }

  if (query.includes('hire') || query.includes('job') || query.includes('freelance') || query.includes('available') || query.includes('opportunity')) {
    return "Yes! I am currently available for select freelance projects, full-time remote roles, and creative collaborations. Feel free to reach out via the Contact section below!"
  }

  if (query.includes('contact') || query.includes('email') || query.includes('reach') || query.includes('touch') || query.includes('message')) {
    return "You can get in touch by using the **Contact Form** on this website, or connect via GitHub and LinkedIn linked in the footer. I usually reply within 24 hours!"
  }

  if (query.includes('hello') || query.includes('hi') || query.includes('hey') || query.includes('sup') || query.includes('who are you')) {
    return "Hello there! 👋 I'm the portfolio AI assistant. I can answer questions about skills, projects, work experience, or availability. How can I help you today?"
  }

  return "Thanks for asking! As an interactive portfolio assistant, I can share details about tech skills, featured projects, experience, and contact info. Feel free to use the quick buttons below or ask a question!"
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: "Hi! 👋 Welcome to my portfolio. How can I help you explore today?",
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

    // Add User Message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text.trim(),
      time: timestamp,
    }

    setMessages((prev) => [...prev, userMsg])
    if (!textToSend) setInputValue('')
    setIsTyping(true)

    // Simulate natural AI thinking delay
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
    }, 700)
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
        text: "Chat reset. Feel free to ask anything else about my portfolio!",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ])
  }

  return (
    <div className="chatbot-wrapper">
      {/* Floating Trigger Launcher Button */}
      <motion.button
        className="chatbot-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close Portfolio Chatbot" : "Open Portfolio Chatbot"}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <div className="chatbot-toggle-pulse" />
        <span className="chatbot-status-badge">
          <span className="chatbot-badge-pulse" />
        </span>
        
        <div className="chatbot-toggle-icon">
          {isOpen ? (
            /* Close Cross Icon */
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            /* Sparkle Chat Icon */
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          )}
        </div>
      </motion.button>

      {/* Animated Chat Window Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-window"
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <div className="chatbot-header">
              <div className="chatbot-header-info">
                <div className="chatbot-avatar">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  <span className="chatbot-avatar-dot" />
                </div>
                <div>
                  <h3 className="chatbot-header-title">Portfolio Assistant</h3>
                  <span className="chatbot-header-subtitle">Online & Ready</span>
                </div>
              </div>

              <div className="chatbot-header-actions">
                <button
                  className="chatbot-icon-btn"
                  onClick={handleClearChat}
                  title="Clear Conversation"
                  aria-label="Clear chat messages"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
                <button
                  className="chatbot-icon-btn"
                  onClick={() => setIsOpen(false)}
                  title="Minimize"
                  aria-label="Minimize chatbot window"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
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
                <div className="chatbot-typing-indicator">
                  <div className="chatbot-typing-dot" />
                  <div className="chatbot-typing-dot" />
                  <div className="chatbot-typing-dot" />
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
                  placeholder="Ask a question..."
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
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
