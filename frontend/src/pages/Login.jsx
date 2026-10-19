import React, { useState } from 'react'
import { API_BASE } from '../config/api'

const FEATURES = [
  { icon: '👁️', text: 'AI-powered retinal & eye disease screening' },
  { icon: '🦷', text: 'Instant oral health analysis with deep learning' },
  { icon: '📊', text: 'Personalized wellness scores & health trends' },
  { icon: '🔒', text: 'HIPAA-compliant, end-to-end encrypted data' },
]

const FLOATING_ICONS = [
  { icon: '👁️', style: { top: '12%', left: '10%', animationDelay: '0s', animationDuration: '4s' } },
  { icon: '🦷', style: { top: '30%', right: '8%', animationDelay: '1s', animationDuration: '5s' } },
  { icon: '❤️', style: { top: '60%', left: '6%', animationDelay: '2s', animationDuration: '3.5s' } },
  { icon: '🩺', style: { bottom: '20%', right: '12%', animationDelay: '0.5s', animationDuration: '4.5s' } },
  { icon: '🧬', style: { top: '50%', left: '25%', animationDelay: '1.5s', animationDuration: '6s' } },
  { icon: '💊', style: { bottom: '35%', right: '22%', animationDelay: '3s', animationDuration: '5s' } },
]

export default function Login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup'
      const payload = isLogin ? { email, password } : { name, email, password }

      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.detail || 'An error occurred')
        setLoading(false)
        return
      }

      onLogin(data) // pass user info to app
    } catch (err) {
      setError('Failed to connect to server')
      setLoading(false)
    }
  }

  const switchMode = () => {
    setIsLogin(!isLogin)
    setError('')
    setName('')
    setEmail('')
    setPassword('')
  }

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      fontFamily: "'Inter', sans-serif",
      background: '#030712',
    }}>
      {/* ── Left Panel ── */}
      <div style={{
        flex: '0 0 52%',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '4rem 3.5rem',
        background: 'linear-gradient(135deg, #0d1117 0%, #0f172a 40%, #1e1b4b 70%, #0d1117 100%)',
      }}>
        {/* Mesh overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse 70% 60% at 30% 30%, rgba(99,102,241,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 50% 50% at 80% 70%, rgba(6,182,212,0.14) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 60% 10%, rgba(139,92,246,0.12) 0%, transparent 50%)
          `,
          pointerEvents: 'none',
        }} />

        {/* Grid pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          pointerEvents: 'none',
        }} />

        {/* Floating icons */}
        {FLOATING_ICONS.map((item, i) => (
          <div key={i} style={{
            position: 'absolute',
            fontSize: '2rem',
            opacity: 0.15,
            animation: `float ${item.style.animationDuration} ease-in-out infinite`,
            animationDelay: item.style.animationDelay,
            ...item.style,
          }}>
            {item.icon}
          </div>
        ))}

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '440px', width: '100%' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
            <div style={{
              width: '50px', height: '50px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              borderRadius: '14px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.5rem',
              boxShadow: '0 0 24px rgba(99,102,241,0.4)',
            }}>
              👁️
            </div>
            <div>
              <div style={{
                fontSize: '1.5rem', fontWeight: 800,
                background: 'linear-gradient(135deg, #fff 0%, #06b6d4 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text', letterSpacing: '-0.5px',
              }}>
                DRGLANCE
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', letterSpacing: '0.05em', fontWeight: 500 }}>
                Clinical AI Platform
              </div>
            </div>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: '2.6rem', fontWeight: 900, lineHeight: 1.15,
            marginBottom: '1rem', letterSpacing: '-1px',
            background: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            AI-Powered<br />
            <span style={{
              background: 'linear-gradient(90deg, #6366f1, #06b6d4)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Clinical Screening</span>
          </h1>

          <p style={{ color: '#64748b', marginBottom: '2.5rem', fontSize: '1rem', lineHeight: 1.6 }}>
            Get instant, accurate AI diagnostics for eye and oral health — right from your device.
          </p>

          {/* Feature bullets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '0.85rem',
                padding: '0.75rem 1rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px',
                backdropFilter: 'blur(8px)',
              }}>
                <span style={{
                  width: '32px', height: '32px',
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(6,182,212,0.2))',
                  borderRadius: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1rem', flexShrink: 0,
                }}>
                  {f.icon}
                </span>
                <span style={{ fontSize: '0.88rem', color: '#cbd5e1', fontWeight: 400 }}>{f.text}</span>
              </div>
            ))}
          </div>

          {/* Bottom badge */}
          <div style={{
            marginTop: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.5rem 1rem', background: 'rgba(16,185,129,0.1)',
            border: '1px solid rgba(16,185,129,0.2)', borderRadius: '99px',
            width: 'fit-content',
          }}>
            <div style={{ width: 8, height: 8, background: '#10b981', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600 }}>
              v2.0 Clinical AI — Now Live
            </span>
          </div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div style={{
        flex: '0 0 48%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: 'rgba(5, 10, 20, 0.97)',
        position: 'relative',
      }}>
        <div style={{
          width: '100%', maxWidth: '420px',
          background: 'rgba(15,23,42,0.8)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '24px',
          padding: '2.5rem',
          boxShadow: '0 24px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
          animation: 'fadeIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        }}>
          {/* Toggle tabs */}
          <div style={{
            display: 'flex',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '14px',
            padding: '0.3rem',
            marginBottom: '2rem',
          }}>
            {['Login', 'Sign Up'].map((label, i) => {
              const active = (i === 0) === isLogin
              return (
                <button key={i} onClick={() => { setIsLogin(i === 0); setError('') }} style={{
                  flex: 1, padding: '0.65rem', borderRadius: '10px', border: 'none',
                  fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '0.9rem',
                  cursor: 'pointer', transition: 'all 0.25s ease',
                  background: active ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
                  color: active ? 'white' : '#64748b',
                  boxShadow: active ? '0 4px 12px rgba(99,102,241,0.35)' : 'none',
                }}>
                  {label}
                </button>
              )
            })}
          </div>

          <h2 style={{
            fontSize: '1.5rem', fontWeight: 700,
            marginBottom: '0.4rem', color: '#f8fafc', letterSpacing: '-0.3px',
          }}>
            {isLogin ? 'Welcome back 👋' : 'Create account 🎉'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
            {isLogin ? 'Sign in to access your health dashboard.' : 'Start your AI health journey today.'}
          </p>

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
              color: '#f87171', padding: '0.75rem 1rem', borderRadius: '12px',
              marginBottom: '1.25rem', fontSize: '0.88rem', display: 'flex',
              alignItems: 'center', gap: '0.5rem',
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {!isLogin && (
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.1rem' }}>👤</span>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{
                    width: '100%', padding: '0.85rem 1rem 0.85rem 2.75rem',
                    borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(0,0,0,0.25)', color: 'white',
                    fontFamily: "'Inter', sans-serif", fontSize: '0.9rem',
                    outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none' }}
                />
              </div>
            )}

            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.1rem' }}>✉️</span>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%', padding: '0.85rem 1rem 0.85rem 2.75rem',
                  borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(0,0,0,0.25)', color: 'white',
                  fontFamily: "'Inter', sans-serif", fontSize: '0.9rem',
                  outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none' }}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.1rem' }}>🔒</span>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%', padding: '0.85rem 1rem 0.85rem 2.75rem',
                  borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(0,0,0,0.25)', color: 'white',
                  fontFamily: "'Inter', sans-serif", fontSize: '0.9rem',
                  outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocus={e => { e.target.style.borderColor = 'rgba(99,102,241,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none' }}
              />
            </div>

            <button type="submit" disabled={loading} style={{
              marginTop: '0.5rem',
              background: loading ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: 'white', border: 'none',
              padding: '0.9rem 1.75rem', borderRadius: '99px',
              fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: '0.95rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.25s ease',
              boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            }}
            onMouseEnter={e => { if (!loading) { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 24px rgba(99,102,241,0.5)' }}}
            onMouseLeave={e => { e.target.style.transform = 'none'; e.target.style.boxShadow = '0 4px 16px rgba(99,102,241,0.4)' }}>
              {loading ? '⏳ Processing...' : (isLogin ? '🚀 Sign In' : '✨ Create Account')}
            </button>
          </form>

          {/* Switch mode */}
          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#64748b', fontSize: '0.88rem' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span
              onClick={switchMode}
              style={{ color: '#6366f1', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline', textDecorationColor: 'rgba(99,102,241,0.4)' }}
            >
              {isLogin ? 'Sign up free' : 'Login here'}
            </span>
          </p>

          {/* Footer note */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: '#334155' }}>
              🔒 Encrypted · HIPAA Compliant · No data sold
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
