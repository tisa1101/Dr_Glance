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
            width: '350px',
            background: 'var(--bg-card)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '16px',
            boxShadow: '0 12px 48px rgba(0,0,0,0.5)',
            zIndex: 999,
            overflow: 'hidden'
          }}
        >
          <div style={{ background: 'var(--primary)', padding: '1rem', color: 'white', fontWeight: 600 }}>
            Health Assistant AI
          </div>
          
          <div className="chat-container">
            <div className="chat-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`message ${msg.sender}`}>
                  {msg.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="chat-input">
                <input 
                  type="text" 
                  placeholder="Ask about your health..." 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button 
                  className="btn" 
                  style={{ padding: '0.75rem' }}
                  onClick={handleSend}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
