import React, { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Sparkles } from 'lucide-react'
import { API_BASE } from '../config/api'

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { text: "Greetings. I am your Dr. Glance Clinical AI Assistant. How can I assist with your ocular or oral biometrics today?", sender: 'bot' }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSend = async () => {
    if (!input.trim()) return
    
    const userMsg = input
    setMessages(prev => [...prev, { text: userMsg, sender: 'user' }])
    setInput('')
    setIsTyping(true)
    
    try {
      const response = await fetch(`${API_BASE}/api/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      })
      const data = await response.json()
      
      setMessages(prev => [...prev, { text: data.reply, sender: 'bot' }])
    } catch (e) {
      console.error(e)
      setMessages(prev => [...prev, { 
        text: "Clinical telemetry link interrupted. Please try again shortly.", 
        sender: 'bot' 
      }])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <>
      {/* Floating ŌURA Assistant Button */}
      <div 
        style={{
          position: 'fixed',
          bottom: '2.25rem',
          right: '2.25rem',
          background: 'rgba(18, 20, 28, 0.92)',
          border: '1.5px solid rgba(255, 255, 255, 0.22)',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.65), 0 0 20px rgba(56, 189, 248, 0.2)',
          zIndex: 1000,
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          backdropFilter: 'blur(20px)',
        }}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.08)'
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.45)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.22)'
        }}
        aria-label="Open clinical health assistant"
      >
        {isOpen ? (
          <X color="#ffffff" size={22} />
        ) : (
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles color="var(--oura-cyan, #38bdf8)" size={22} />
            <span style={{
              position: 'absolute', top: -3, right: -3,
              width: 7, height: 7, borderRadius: '50%',
              background: '#34d399', boxShadow: '0 0 6px #34d399'
            }} />
          </div>
        )}
      </div>

      {isOpen && (
        <div 
          className="animate-fade-in"
          style={{
            position: 'fixed',
            bottom: '6.5rem',
            right: '2.25rem',
            width: '380px',
            maxWidth: 'calc(100vw - 2.5rem)',
            background: 'rgba(15, 17, 24, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '24px',
            boxShadow: '0 28px 70px rgba(0, 0, 0, 0.8)',
            zIndex: 1001,
            overflow: 'hidden',
            backdropFilter: 'blur(30px)',
          }}
        >
          {/* Header */}
          <div style={{
            background: 'radial-gradient(ellipse 90% 80% at 50% 0%, rgba(139, 92, 246, 0.18) 0%, transparent 75%), rgba(20, 22, 31, 0.95)',
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div>
              <div style={{
                fontSize: '0.68rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--oura-cyan, #38bdf8)',
                fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: '0.35rem'
              }}>
                <Sparkles size={11} /> CLINICAL ADVISOR
              </div>
              <h3 style={{
                fontFamily: "var(--font-serif, 'Newsreader', serif)",
                fontSize: '1.25rem',
                color: '#ffffff',
                fontWeight: 400,
                marginTop: '0.15rem'
              }}>
                Dr. Glance Neural Assistant
              </h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                width: 28, height: 28,
                color: 'var(--text-2, #9ca3af)',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
              aria-label="Close chat"
            >
              <X size={15} />
            </button>
          </div>
          
          {/* Messages */}
          <div className="chat-container">
            <div className="chat-messages" style={{ height: '320px', padding: '1.25rem' }}>
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`message ${msg.sender}`}
                  style={{
                    maxWidth: '82%',
                    padding: '0.75rem 1rem',
                    borderRadius: '16px',
                    fontSize: '0.86rem',
                    lineHeight: '1.5',
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    background: msg.sender === 'user' ? '#ffffff' : 'rgba(255, 255, 255, 0.04)',
                    color: msg.sender === 'user' ? '#090a0f' : '#fcfcfd',
                    fontWeight: msg.sender === 'user' ? 600 : 400,
                    border: msg.sender === 'user' ? 'none' : '1px solid rgba(255, 255, 255, 0.07)',
                    boxShadow: msg.sender === 'user' ? '0 4px 16px rgba(255, 255, 255, 0.15)' : 'none',
                  }}
                >
                  {msg.text}
                </div>
              ))}
              {isTyping && (
                <div style={{
                  alignSelf: 'flex-start',
                  padding: '0.65rem 1rem',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  fontSize: '0.78rem',
                  color: 'var(--text-2, #9ca3af)',
                  display: 'flex', alignItems: 'center', gap: '0.4rem'
                }}>
                  <span className="animate-spin">✦</span> Analyzing biometrics...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input Row */}
            <div style={{
              padding: '0.85rem 1.15rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.07)',
              background: 'rgba(11, 13, 19, 0.98)'
            }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input 
                  type="text" 
                  placeholder="Inquire regarding symptoms or telemetry..." 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  style={{
                    flex: 1,
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '9999px',
                    color: '#fff',
                    padding: '0.65rem 1.1rem',
                    fontSize: '0.85rem'
                  }}
                />
                <button 
                  className="oura-btn"
                  style={{
                    padding: '0.65rem 1rem',
                    borderRadius: '9999px',
                    flexShrink: 0,
                  }}
                  onClick={handleSend}
                  aria-label="Send message"
                >
                  <Send size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
