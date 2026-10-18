import React, { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send } from 'lucide-react'

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { text: "Hello! I'm Dr. Glance AI. How can I help you with your eye or oral health today?", sender: 'bot' }
  ])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return
    
    const userMsg = input
    setMessages(prev => [...prev, { text: userMsg, sender: 'user' }])
    setInput('')
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      })
      const data = await response.json()
      
      setMessages(prev => [...prev, { text: data.reply, sender: 'bot' }])
    } catch (e) {
      console.error(e)
      setMessages(prev => [...prev, { 
        text: "I'm having trouble connecting to my server. Please try again later.", 
        sender: 'bot' 
      }])
    }
  }

  return (
    <>
      <div 
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: 'var(--primary)',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(91, 108, 249, 0.4)',
          zIndex: 1000,
          transition: 'transform 0.3s ease'
        }}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        {isOpen ? <X color="white" size={28} /> : <MessageSquare color="white" size={28} />}
      </div>

      {isOpen && (
        <div 
          className="animate-fade-in"
          style={{
            position: 'fixed',
            bottom: '6rem',
            right: '2rem',
            width: '360px',
            maxWidth: 'calc(100vw - 2.5rem)',
            background: 'var(--bg-3, #0d1526)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '16px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
            zIndex: 1001,
            overflow: 'hidden'
          }}
        >
          <div style={{
            background: 'linear-gradient(135deg, var(--primary, #6366f1), #4f46e5)',
            padding: '1rem 1.25rem',
            color: 'white',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>Health Assistant AI</span>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', padding: 0 }}
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="chat-container" style={{ background: '#0a0f1d' }}>
            <div className="chat-messages" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              padding: '1rem',
              height: '300px',
              overflowY: 'auto'
            }}>
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`message ${msg.sender}`}
                  style={{
                    maxWidth: '82%',
                    padding: '0.625rem 0.875rem',
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    lineHeight: '1.45',
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    background: msg.sender === 'user' ? 'linear-gradient(135deg, #6366f1, #7c3aed)' : 'rgba(255,255,255,0.06)',
                    color: 'white',
                    border: msg.sender === 'user' ? 'none' : '1px solid rgba(255,255,255,0.08)'
                  }}
                >
                  {msg.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            <div style={{
              padding: '0.75rem 1rem',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              background: '#0d1526'
            }}>
              <div className="chat-input-row" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input 
                  type="text" 
                  placeholder="Ask about your health..." 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '8px',
                    color: '#fff',
                    padding: '0.6rem 0.75rem',
                    fontSize: '0.85rem'
                  }}
                />
                <button 
                  className="btn" 
                  style={{ padding: '0.6rem 0.85rem', flexShrink: 0 }}
                  onClick={handleSend}
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
