import React, { useState } from 'react'
import { API_BASE } from '../config/api'
import { Sparkles, Shield, ArrowRight, Eye, Smile, Activity, Check, Zap, Scan } from 'lucide-react'
import DrGlanceLogo from '../components/DrGlanceLogo'

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

  // Direct 1-Click Entrance to Dashboard (Bypasses manual auth for reviewers)
  const handleDirectDemoLogin = () => {
    onLogin({
      user_id: 1,
      name: 'Dr. Tisa (Clinical Reviewer)',
      email: 'reviewer@drglance.ai',
      role: 'Clinical Evaluator'
    })
  }

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
      overflowX: 'hidden',
      overflowY: 'auto',
      fontFamily: "var(--font-body, 'Plus Jakarta Sans', sans-serif)",
      background: '#090a0f',
      color: '#ffffff',
      flexWrap: 'wrap',
    }}>
      {/* ── Left Editorial Panel with Cinematic Teeth & Oral Video ── */}
      <div style={{
        flex: '1 1 54%',
        minWidth: '360px',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '3.5rem 4.5rem',
        background: 'radial-gradient(ellipse 85% 65% at 20% 15%, rgba(139, 92, 246, 0.16) 0%, transparent 65%), radial-gradient(ellipse 70% 60% at 85% 85%, rgba(224, 122, 95, 0.12) 0%, transparent 60%), #090a0f',
        borderRight: '1px solid rgba(255, 255, 255, 0.07)',
      }}>
        {/* Brand Header */}
        <div style={{ padding: '0.25rem 0' }}>
          <DrGlanceLogo size="lg" variant="horizontal" />
        </div>

        {/* Central Editorial Narrative & Video Graphics */}
        <div style={{ maxWidth: '540px', margin: '2rem 0' }}>
          <span className="oura-category-tag" style={{ color: 'var(--oura-cyan, #38bdf8)', marginBottom: '0.75rem' }}>
            <Sparkles size={13} /> INTELLIGENT CLINICAL SCREENING
          </span>

          <h1 style={{
            fontFamily: "var(--font-serif, 'Newsreader', serif)",
            fontSize: '2.8rem',
            fontWeight: 400,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            marginBottom: '1rem',
          }}>
            Your biometrics. Decoded at a single glance.
          </h1>

          <p style={{
            color: 'var(--text-2, #9ca3af)',
            fontSize: '0.96rem',
            lineHeight: 1.6,
            marginBottom: '1.75rem',
            fontWeight: 400,
          }}>
            Instant, clinical-grade eye &amp; oral screening powered by deep neural computer vision. Click the interactive oral scanner below to enter directly into the dashboard.
          </p>

          {/* ─── Video Graphics: 3D Oral & Teeth Biometric Scan ─── */}
          <div style={{ marginBottom: '2.25rem' }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: '0.65rem',
            }}>
              <span style={{
                fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                color: 'var(--oura-cyan, #38bdf8)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem'
              }}>
                <Scan size={14} /> LIVE TOMOGRAPHY ENGINE · TEETH &amp; ORAL BIOFILM
              </span>
              <span style={{ fontSize: '0.7rem', color: '#34d399', fontWeight: 600 }}>
                ● Click to Enter Dashboard
              </span>
            </div>

            <div
              className="dental-video-card"
              onClick={handleDirectDemoLogin}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleDirectDemoLogin() }}
              role="button"
              tabIndex={0}
              aria-label="Click teeth and oral video graphics to enter dashboard directly"
              style={{ height: '230px', position: 'relative' }}
            >
              {/* High-Performance Looping Video */}
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                poster="https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5a/Video_of_teeth_segmentation_using_Avizo_software.webm/800px--Video_of_teeth_segmentation_using_Avizo_software.webm.jpg"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  filter: 'brightness(0.92) contrast(1.18)',
                }}
              >
                <source src="/oral-teeth-scan.webm" type="video/webm" />
                <source src="/oral-teeth-scan.mp4" type="video/mp4" />
              </video>

              {/* Dynamic Laser Scanning Line */}
              <div className="dental-laser-beam" />

              {/* Video HUD Overlays */}
              <div className="video-scan-overlay">
                {/* Top telemetry strip */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.45rem',
                    padding: '0.35rem 0.75rem', borderRadius: '9999px',
                    background: 'rgba(9, 10, 15, 0.85)', backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(56, 189, 248, 0.4)',
                    fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', color: '#fff'
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399' }} />
                    <span>MANDIBULAR ARCH · ENAMEL SCAN</span>
                  </div>
                  <div style={{
                    padding: '0.35rem 0.65rem', borderRadius: '9999px',
                    background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    fontSize: '0.68rem', color: 'var(--oura-cyan)', fontWeight: 600
                  }}>
                    ROI Locked · 60fps
                  </div>
                </div>

                {/* Center Medical Reticle Target */}
                <div style={{
                  alignSelf: 'center',
                  width: '140px', height: '65px',
                  border: '1px dashed rgba(56, 189, 248, 0.5)',
                  borderRadius: '10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative',
                }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--oura-cyan)', boxShadow: '0 0 12px var(--oura-cyan)' }} />
                </div>

                {/* Floating Launch Call-To-Action Pill */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <div
                    className="launch-cta-pill"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
                      padding: '0.6rem 1.4rem', borderRadius: '9999px',
                      background: 'rgba(9, 10, 15, 0.92)',
                      border: '1.5px solid var(--oura-cyan)',
                      color: '#ffffff',
                      fontSize: '0.84rem', fontWeight: 700, letterSpacing: '0.04em',
                      backdropFilter: 'blur(12px)',
                    }}
                  >
                    <Zap size={15} color="var(--oura-cyan)" />
                    <span>CLICK VIDEO TO ENTER DASHBOARD</span>
                    <ArrowRight size={14} color="var(--oura-cyan)" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature list with minimal luxury styling */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {FEATURES.map((item, idx) => (
              <div key={idx} style={{
                display: 'flex', alignItems: 'flex-start', gap: '1rem',
                padding: '0.8rem 1.1rem',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '14px',
                backdropFilter: 'blur(10px)',
              }}>
                <span style={{ fontSize: '1.15rem', lineHeight: 1 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.15rem' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-2, #9ca3af)', lineHeight: 1.4 }}>
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
        flex: '1 1 46%',
        minWidth: '360px',
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
          padding: '2.5rem',
          boxShadow: '0 24px 70px rgba(0, 0, 0, 0.7)',
          position: 'relative', zIndex: 1,
        }}>
          {/* Form Header Logo Mark */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
            <DrGlanceLogo size={42} variant="mark" glow={true} />
            <div style={{ fontSize: '0.78rem', color: 'var(--text-3, #94a3b8)', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '0.5rem', fontWeight: 600 }}>
              {isLogin ? 'Clinical Access' : 'Member Registration'}
            </div>
          </div>

          {/* Direct 1-Click Dashboard Entrance for Evaluators */}
          <button
            type="button"
            onClick={handleDirectDemoLogin}
            className="oura-btn"
            style={{
              width: '100%',
              marginBottom: '1.5rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.55rem',
              padding: '0.85rem',
              fontSize: '0.88rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.22) 0%, rgba(16, 185, 129, 0.22) 100%)',
              border: '1.5px solid rgba(56, 189, 248, 0.5)',
              color: '#ffffff',
              boxShadow: '0 0 20px rgba(56, 189, 248, 0.25)',
            }}
          >
            <Zap size={15} color="var(--oura-cyan)" /> Enter Dashboard (Instant Access)
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />
            <span style={{ fontSize: '0.68rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>OR SIGN IN WITH ACCOUNT</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />
          </div>

          {/* Toggle pill (Login / Sign Up) */}
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '9999px',
            padding: '4px',
            marginBottom: '1.75rem',
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

          {error && (
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              background: 'rgba(224, 122, 95, 0.1)',
              border: '1px solid rgba(224, 122, 95, 0.3)',
              color: 'var(--oura-coral, #e07a5f)',
              fontSize: '0.82rem',
              marginBottom: '1.25rem',
              lineHeight: 1.4,
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            {!isLogin && (
              <div className="input-group" style={{ margin: 0 }}>
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Alex Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                />
              </div>
            )}

            <div className="input-group" style={{ margin: 0 }}>
              <label>Clinical ID / Email</label>
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

            {/* Pure white pill button */}
            <button
              type="submit"
              disabled={loading}
              className="oura-btn"
              style={{
                marginTop: '0.5rem',
                width: '100%',
                padding: '0.85rem',
                fontSize: '0.92rem',
              }}
            >
              {loading ? 'Validating Telemetry...' : (isLogin ? 'Sign In to Account' : 'Create Member Account')}
            </button>
          </form>

          {/* Toggle mode helper link */}
          <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.82rem', color: 'var(--text-3, #6b7280)' }}>
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
