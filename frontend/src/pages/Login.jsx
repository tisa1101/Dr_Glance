import React, { useState } from 'react'
import { API_BASE } from '../config/api'
import { Sparkles, Shield, ArrowRight, Eye, Smile, Activity, Check } from 'lucide-react'

const FEATURES = [
  { icon: '👁️', title: 'Retinal & Ocular Analysis', text: 'Screening for cataract, glaucoma, diabetic retinopathy & fatigue' },
  { icon: '🦷', title: 'Oral Biofilm & Tissue Inspection', text: 'Instant detection of plaque, gingivitis, caries & oral lesions' },
  { icon: '📈', title: 'Longitudinal Wellness Tracking', text: 'Personalized readiness trends and predictive tissue recovery' },
  { icon: '🔒', title: 'Zero-Knowledge Privacy', text: 'All clinical biometric telemetry encrypted at rest & in transit' },
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
        setError(data.detail || 'Authentication failed. Please verify credentials.')
        setLoading(false)
        return
      }

      onLogin(data)
    } catch (err) {
      setError('Failed to connect to clinical server. Please ensure backend is active.')
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
      minHeight: '100vh',
      width: '100vw',
      overflow: 'hidden',
      fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)",
      background: '#090a0f',
      color: '#ffffff',
    }}>
      {/* ── Left Editorial Panel (Ōura Bio-Wellness Aesthetics) ── */}
      <div style={{
        flex: '0 0 54%',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '4.5rem 5rem',
        background: 'radial-gradient(ellipse 85% 65% at 20% 15%, rgba(139, 92, 246, 0.16) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 85% 85%, rgba(224, 122, 95, 0.12) 0%, transparent 60%), #090a0f',
        borderRight: '1px solid rgba(255, 255, 255, 0.07)',
      }}>
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: 38, height: 38, borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1.5px solid rgba(255, 255, 255, 0.22)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 16px rgba(255, 255, 255, 0.08)',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="4.5" strokeDasharray="3 3" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase' }}>
              DR • GLANCE
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-3, #6b7280)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              CLINICAL BIOMETRICS
            </div>
          </div>
        </div>

        {/* Central Editorial Narrative */}
        <div style={{ maxWidth: '480px', margin: '3rem 0' }}>
          <span className="oura-category-tag" style={{ color: 'var(--oura-cyan, #38bdf8)', marginBottom: '0.75rem' }}>
            <Sparkles size={13} /> INTELLIGENT HEALTH SCREENING
          </span>

          <h1 style={{
            fontFamily: "var(--font-serif, 'Newsreader', serif)",
            fontSize: '3.1rem',
            fontWeight: 400,
            lineHeight: 1.12,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            marginBottom: '1.25rem',
          }}>
            Your biometrics. Decoded at a single glance.
          </h1>

          <p style={{
            color: 'var(--text-2, #9ca3af)',
            fontSize: '1rem',
            lineHeight: 1.6,
            marginBottom: '2.5rem',
            fontWeight: 400,
          }}>
            Instant, clinical-grade eye &amp; oral screening powered by deep neural computer vision. Understand tissue vitality and daily systemic readiness.
          </p>

          {/* Feature list with minimal luxury styling */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {FEATURES.map((item, idx) => (
              <div key={idx} style={{
                display: 'flex', alignItems: 'flex-start', gap: '1rem',
                padding: '0.9rem 1.15rem',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '16px',
                backdropFilter: 'blur(10px)',
              }}>
                <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.15rem' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-2, #9ca3af)', lineHeight: 1.4 }}>
                    {item.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
            padding: '0.4rem 0.95rem', borderRadius: '9999px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '0.75rem', color: 'var(--text-2, #9ca3af)',
          }}>
            <Shield size={12} color="var(--oura-cyan, #38bdf8)" />
            HIPAA-Ready Architecture · End-to-End Encrypted
          </span>
        </div>
      </div>

      {/* ── Right Authentication Card ── */}
      <div style={{
        flex: '0 0 46%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem',
        background: '#090a0f',
        position: 'relative',
      }}>
        {/* Subtle background glow */}
        <div style={{
          position: 'absolute',
          width: '320px', height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          width: '100%', maxWidth: '420px',
          background: 'rgba(18, 20, 28, 0.88)',
          backdropFilter: 'blur(28px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '26px',
          padding: '2.75rem',
          boxShadow: '0 24px 70px rgba(0, 0, 0, 0.7)',
          position: 'relative', zIndex: 1,
        }}>
          {/* Toggle pill (Login / Sign Up) */}
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '9999px',
            padding: '4px',
            marginBottom: '2rem',
          }}>
            {['Sign In', 'Create Account'].map((label, i) => {
              const active = (i === 0) === isLogin
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => { setIsLogin(i === 0); setError('') }}
                  style={{
                    flex: 1, padding: '0.65rem', borderRadius: '9999px', border: 'none',
                    fontFamily: 'inherit', fontWeight: 600, fontSize: '0.86rem',
                    cursor: 'pointer', transition: 'all 0.2s ease',
                    background: active ? '#ffffff' : 'transparent',
                    color: active ? '#090a0f' : 'var(--text-2, #9ca3af)',
                    boxShadow: active ? '0 4px 16px rgba(255, 255, 255, 0.15)' : 'none',
                  }}
                >
                  {label}
                </button>
              )
            })}
          </div>

          <h2 style={{
            fontFamily: "var(--font-serif, 'Newsreader', serif)",
            fontSize: '1.9rem',
            fontWeight: 400,
            marginBottom: '0.35rem',
            color: '#ffffff',
            letterSpacing: '-0.01em',
          }}>
            {isLogin ? 'Welcome back' : 'Join Dr. Glance'}
          </h2>
          <p style={{ color: 'var(--text-2, #9ca3af)', fontSize: '0.88rem', marginBottom: '1.75rem' }}>
            {isLogin ? 'Access your clinical health telemetry and scan logs.' : 'Begin your intelligent biometric assessment.'}
          </p>

          {/* Error Message Banner */}
          {error && (
            <div style={{
              background: 'rgba(224, 122, 95, 0.12)',
              border: '1px solid rgba(224, 122, 95, 0.3)',
              color: '#fca5a5',
              padding: '0.75rem 1rem',
              borderRadius: '14px',
              marginBottom: '1.25rem',
              fontSize: '0.82rem',
              lineHeight: 1.4,
            }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {!isLogin && (
              <div className="input-group" style={{ margin: 0 }}>
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Elena Rostova"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="input-group" style={{ margin: 0 }}>
              <label>Email Address</label>
              <input
                type="email"
                placeholder="member@drglance.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group" style={{ margin: 0 }}>
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Pure white pill button as in ŌURA app */}
            <button
              type="submit"
              disabled={loading}
              className="oura-btn"
              style={{
                marginTop: '0.75rem',
                width: '100%',
                padding: '0.85rem',
                fontSize: '0.92rem',
              }}
            >
              {loading ? 'Validating Telemetry...' : (isLogin ? 'Enter Dashboard' : 'Create Member Account')}
            </button>
          </form>

          {/* Toggle mode helper link */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.82rem', color: 'var(--text-3, #6b7280)' }}>
            {isLogin ? 'New to Dr. Glance? ' : 'Already have an account? '}
            <span
              onClick={switchMode}
              style={{ color: '#ffffff', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}
            >
              {isLogin ? 'Create one now' : 'Sign in'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
