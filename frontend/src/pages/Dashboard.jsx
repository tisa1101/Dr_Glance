import React, { useEffect, useState } from 'react'
import {
  Eye, Droplet, Activity, Apple, Bell, Zap, TrendingUp, Calendar,
  Sparkles, Info, ChevronRight, Moon, Flame, Heart, RefreshCw, CheckCircle, Shield
} from 'lucide-react'
import { API_BASE } from '../config/api'

// ─── ŌURA Metric Circle Badge (Screen 3) ──────────────────────────────────
function OuraCircleMetric({ icon: Icon, value, label, active }) {
  return (
    <div className="oura-metric-circle-item">
      <div className={`oura-circle-badge ${active ? 'active' : ''}`}>
        <Icon size={14} className="oura-circle-icon" />
        <span className="oura-circle-value">{value}</span>
      </div>
      <span className="oura-circle-label">{label}</span>
    </div>
  )
}

// ─── ŌURA Arc Gauge Dial (Screen 3) ───────────────────────────────────────
function OuraArcDial({ score = 94, subtitle = "Making progress" }) {
  // SVG semi-circle gauge (180 degrees)
  const radius = 80
  const circumference = Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="oura-hero-arc-container">
      <div className="oura-arc-wrap">
        <svg width="220" height="125" viewBox="0 0 220 125" style={{ overflow: 'visible' }}>
          {/* Background Arc */}
          <path
            d="M 20 110 A 80 80 0 0 1 200 110"
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="9"
            strokeLinecap="round"
          />
          {/* Milestone tick */}
          <circle cx="200" cy="110" r="3" fill="rgba(255,255,255,0.4)" />
          {/* Progress Arc */}
          <path
            d="M 20 110 A 80 80 0 0 1 200 110"
            fill="none"
            stroke="url(#ouraArcGradient)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
          />
          <defs>
            <linearGradient id="ouraArcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="70%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#86a378" />
            </linearGradient>
          </defs>
        </svg>

        <div className="oura-arc-center-content">
          <Flame size={18} color="rgba(255,255,255,0.8)" style={{ marginBottom: 2 }} />
          <div className="oura-arc-sublabel">WELLNESS READINESS</div>
          <div className="oura-arc-number">{score}%</div>
        </div>
      </div>

      <h2 className="oura-editorial-header">{subtitle}</h2>
      <p className="oura-editorial-desc">
        Today's clinical screening baseline is aligned with optimal health. Your retina and oral biometrics are within steady ranges.
      </p>
    </div>
  )
}

// ─── Daytime Stress Dotted Graph (Screen 1) ────────────────────────────────
function DaytimeStressGraph() {
  const points = [
    { x: 30, y: 75 },
    { x: 60, y: 55 },
    { x: 90, y: 70 },
    { x: 120, y: 95 },
    { x: 150, y: 80 },
    { x: 180, y: 60 },
    { x: 210, y: 50 },
    { x: 240, y: 35 },
    { x: 270, y: 40 },
    { x: 300, y: 65 },
    { x: 330, y: 70 },
    { x: 360, y: 80 },
  ]

  const pathD = points.reduce((acc, pt, idx) => (
    idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`
  ), '')

  return (
    <div style={{ position: 'relative', width: '100%', padding: '1rem 0' }}>
      <svg width="100%" height="160" viewBox="0 0 390 140" style={{ overflow: 'visible' }}>
        {/* Horizontal guide lines */}
        {[30, 60, 90, 120].map((y, i) => (
          <line
            key={i}
            x1="20" y1={y} x2="310" y2={y}
            stroke="rgba(255, 255, 255, 0.05)"
            strokeDasharray="3 3"
          />
        ))}

        {/* Labels on right */}
        <text x="320" y="34" fill="rgba(255,255,255,0.35)" fontSize="9" fontFamily="inherit">Stressed</text>
        <text x="320" y="64" fill="rgba(255,255,255,0.35)" fontSize="9" fontFamily="inherit">Engaged</text>
        <text x="320" y="94" fill="rgba(255,255,255,0.35)" fontSize="9" fontFamily="inherit">Relaxed</text>
        <text x="320" y="124" fill="rgba(255,255,255,0.35)" fontSize="9" fontFamily="inherit">Restored</text>

        {/* Connected Line */}
        <path
          d={pathD}
          fill="none"
          stroke="rgba(255, 255, 255, 0.7)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Nodes */}
        {points.map((pt, i) => (
          <circle
            key={i}
            cx={pt.x} cy={pt.y}
            r="3.5"
            fill="#ffffff"
            stroke="#090a0f"
            strokeWidth="1.5"
          />
        ))}
      </svg>

      {/* Time marks */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        padding: '0.25rem 2rem 0 1rem', fontSize: '0.72rem',
        color: 'var(--text-3)', fontWeight: 500
      }}>
        <span>9am</span>
        <span>12pm</span>
        <span>6pm</span>
        <span>12am</span>
      </div>
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────
export default function Dashboard({ user, setActiveTab }) {
  const [tips, setTips] = useState(null)
  const [diet, setDiet] = useState(null)
  const [activeStrainStatus, setActiveStrainStatus] = useState('minor')
  const [restMode, setRestMode] = useState(false)
  const [movementToggle, setMovementToggle] = useState(true)
  const [activityToggle, setActivityToggle] = useState(false)

  useEffect(() => {
    fetch(`${API_BASE}/api/diet/tips`)
      .then(r => r.json())
      .then(data => setTips(data.tips))
      .catch(e => console.log('Mock/Offline tip fetch', e))

    const dietEndpoint = user
      ? `${API_BASE}/api/diet/diet/${user.user_id}`
      : `${API_BASE}/api/diet/diet`
    fetch(dietEndpoint)
      .then(r => r.json())
      .then(data => setDiet(data.diet))
      .catch(e => console.log('Mock/Offline diet fetch', e))
  }, [user])

  const firstName = user?.name ? user.name.split(' ')[0] : 'Member'

  return (
    <div className="animate-fade-in" style={{ maxWidth: 1180, margin: '0 auto' }}>
      {/* ─── Top Ōura Navigation & Pill Bar ─── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{
            fontSize: '0.75rem', fontWeight: 600,
            padding: '0.35rem 0.95rem', borderRadius: '9999px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#ffffff',
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            cursor: 'default',
          }}>
            <Calendar size={13} color="var(--oura-cyan)" /> Today
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>·</span>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-2)' }}>
            Welcome, <strong style={{ color: '#fff' }}>{firstName}</strong>
          </span>
        </div>

        <button
          onClick={() => setActiveTab && setActiveTab('scan')}
          className="oura-btn oura-btn-outline"
          style={{ padding: '0.45rem 1.15rem', fontSize: '0.8rem' }}
        >
          <Sparkles size={14} color="var(--oura-cyan)" /> Quick Check-in
        </button>
      </div>

      {/* ─── Top Metric Circles Carousel (Screen 3) ─── */}
      <div className="oura-metric-bar">
        <OuraCircleMetric icon={CrownIcon} value="88" label="Readiness" active />
        <OuraCircleMetric icon={Eye} value="94" label="Vision Score" active />
        <OuraCircleMetric icon={Sparkles} value="91" label="Oral Health" active />
        <OuraCircleMetric icon={Flame} value="7" label="Scans Total" />
        <OuraCircleMetric icon={Heart} value="68" label="Resting bpm" />
      </div>

      {/* ─── Main Two-Column Layout ─── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.15fr 0.85fr',
        gap: '1.75rem',
        alignItems: 'start',
      }}>
        {/* Left Column: Hero Arc & Symptom Radar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Card 1: ŌURA Hero Arc Gauge (Screen 3) */}
          <div className="card aura-glow-cyan">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="oura-category-tag">
                <Sparkles size={12} /> CLINICAL BIOMETRICS
              </span>
              <Info size={16} color="var(--text-3)" style={{ cursor: 'pointer' }} />
            </div>

            <OuraArcDial score={94} subtitle="Making progress" />

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '0.5rem' }}>
              <button
                className="oura-btn"
                onClick={() => setActiveTab && setActiveTab('scan')}
              >
                Start AI Scan
              </button>
              <button
                className="oura-btn oura-btn-outline"
                onClick={() => setActiveTab && setActiveTab('history')}
              >
                View History
              </button>
            </div>
          </div>

          {/* Card 2: Symptom Radar (Screen 2) */}
          <div className="card aura-glow-terracotta">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="oura-category-tag coral">
                SYMPTOM RADAR
              </span>
              <Info size={16} color="var(--text-3)" style={{ cursor: 'pointer' }} />
            </div>

            <h2 className="oura-serif-title" style={{ marginTop: '0.4rem' }}>
              {activeStrainStatus === 'major'
                ? 'Major signs of strain'
                : activeStrainStatus === 'minor'
                ? 'Minor signs of eye strain'
                : 'Zero signs of strain'}
            </h2>
            <p className="page-subtitle" style={{ marginBottom: '1.25rem' }}>
              {activeStrainStatus === 'major'
                ? 'Your biometrics show elevated retinal stress. Take extra care today and rest if you feel fatigue.'
                : activeStrainStatus === 'minor'
                ? 'Mild digital screen fatigue detected. Schedule a 20-20-20 visual rest pause and maintain hydration.'
                : 'All biometrics are within optimal baseline limits. Continue your routine.'}
            </p>

            {/* 3 Status Capsules */}
            <div className="oura-status-group">
              <div
                className={`oura-status-item ${activeStrainStatus === 'none' ? 'active' : ''}`}
                onClick={() => setActiveStrainStatus('none')}
              >
                <div className="oura-status-dot-circle petrol" />
                <span className="oura-status-label">No signs</span>
              </div>
              <div
                className={`oura-status-item ${activeStrainStatus === 'minor' ? 'active' : ''}`}
                onClick={() => setActiveStrainStatus('minor')}
              >
                <div className="oura-status-dot-circle sage" />
                <span className="oura-status-label">Minor signs</span>
              </div>
              <div
                className={`oura-status-item ${activeStrainStatus === 'major' ? 'active' : ''}`}
                onClick={() => setActiveStrainStatus('major')}
              >
                <div className="oura-status-dot-circle coral" />
                <span className="oura-status-label">Major signs</span>
              </div>
            </div>

            {/* Turn on Rest Mode Pill Button */}
            <button
              className="oura-btn oura-btn-outline"
              style={{
                width: '100%',
                marginBottom: '1.75rem',
                borderColor: restMode ? 'var(--oura-coral)' : 'rgba(255, 255, 255, 0.2)',
                background: restMode ? 'rgba(224, 122, 95, 0.15)' : 'rgba(255, 255, 255, 0.04)',
              }}
              onClick={() => setRestMode(!restMode)}
            >
              {restMode ? '✓ Rest Mode Active' : 'Turn on Rest Mode'}
            </button>

            {/* Section: Biometrics Under Strain */}
            <div style={{ fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-3)', fontWeight: 700, marginBottom: '0.5rem' }}>
              Biometrics under strain
            </div>

            <div className="oura-metric-list">
              <div className="oura-metric-row">
                <div className="oura-metric-left">
                  <h4>RETINAL FATIGUE INDEX</h4>
                  <div className="val">+1.2° <span style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>dev</span></div>
                </div>
                <span className="oura-capsule-badge coral">Elevated &gt;</span>
              </div>

              <div className="oura-metric-row">
                <div className="oura-metric-left">
                  <h4>ORAL TISSUE TENSION</h4>
                  <div className="val">Baseline</div>
                </div>
                <span className="oura-capsule-badge sage">Optimal &gt;</span>
              </div>

              <div className="oura-metric-row">
                <div className="oura-metric-left">
                  <h4>SCREEN EXPOSURE STRAIN</h4>
                  <div className="val">4h 45m</div>
                </div>
                <span className="oura-capsule-badge coral">Elevated &gt;</span>
              </div>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '0.75rem', lineHeight: 1.45 }}>
              The estimate is based on a unique neural combination of all your clinical scan data over time.
            </p>
          </div>
        </div>

        {/* Right Column: Daytime Stress, Sleep Recovery, & Diet */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Card 3: Daytime Stress (Screen 1) */}
          <div className="card aura-glow-violet">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="oura-category-tag" style={{ color: '#c084fc' }}>
                DAYTIME STRESS
              </span>
              <Info size={16} color="var(--text-3)" style={{ cursor: 'pointer' }} />
            </div>

            <DaytimeStressGraph />

            {/* Toggles (Screen 1) */}
            <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.5rem' }}>
              <div className="oura-toggle-row">
                <span className="oura-toggle-label">
                  <Activity size={16} color="var(--text-2)" /> Daily eye rest reminders
                </span>
                <label className="oura-switch">
                  <input
                    type="checkbox"
                    checked={movementToggle}
                    onChange={() => setMovementToggle(!movementToggle)}
                  />
                  <span className="oura-slider" />
                </label>
              </div>

              <div className="oura-toggle-row">
                <span className="oura-toggle-label">
                  <Sparkles size={16} color="var(--text-2)" /> Symptom radar notifications
                </span>
                <label className="oura-switch">
                  <input
                    type="checkbox"
                    checked={activityToggle}
                    onChange={() => setActivityToggle(!activityToggle)}
                  />
                  <span className="oura-slider" />
                </label>
              </div>
            </div>

            {/* Bottom mini tiles (Screen 1) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1.25rem' }}>
              <div style={{
                padding: '0.85rem 1rem', borderRadius: '16px',
                background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-3)', fontWeight: 700 }}>STRESSED</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>45m</div>
                </div>
                <ChevronRight size={16} color="var(--text-3)" />
              </div>

              <div style={{
                padding: '0.85rem 1rem', borderRadius: '16px',
                background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-3)', fontWeight: 700 }}>RESTORED</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>1h 15m</div>
                </div>
                <ChevronRight size={16} color="var(--text-3)" />
              </div>
            </div>
          </div>

          {/* Card 4: Biometric Sleep & Tissue Recovery Hypnogram (Screen 5) */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="oura-category-tag">
                <Moon size={12} /> TISSUE RESTORATION &amp; SLEEP
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--oura-cyan)', fontWeight: 600 }}>Score 84</span>
            </div>

            <div style={{ margin: '0.75rem 0 0.25rem' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>TIME ASLEEP</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#ffffff' }}>7h 16m</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-2)' }}>Total restoration cycle 8h 16m</div>
            </div>

            {/* Hypnogram segmented bar */}
            <div className="oura-hypnogram">
              <div className="oura-hypno-seg awake" style={{ width: '12%' }}>Awake</div>
              <div className="oura-hypno-seg rem" style={{ width: '25%' }}>REM</div>
              <div className="oura-hypno-seg light" style={{ width: '45%' }}>Light</div>
              <div className="oura-hypno-seg deep" style={{ width: '18%' }}>Deep</div>
            </div>

            <div className="oura-hypno-legend">
              <div className="oura-hypno-legend-item">
                <span className="oura-hypno-dot" style={{ background: '#64748b' }} />
                <span>Awake 1h 0m</span>
              </div>
              <div className="oura-hypno-legend-item">
                <span className="oura-hypno-dot" style={{ background: 'var(--oura-ice)' }} />
                <span>REM 1h 50m (25%)</span>
              </div>
              <div className="oura-hypno-legend-item">
                <span className="oura-hypno-dot" style={{ background: 'var(--oura-cyan)' }} />
                <span>Light 4h 1m (55%)</span>
              </div>
              <div className="oura-hypno-legend-item">
                <span className="oura-hypno-dot" style={{ background: 'var(--oura-deep-blue)' }} />
                <span>Deep 1h 25m</span>
              </div>
            </div>
          </div>

          {/* Card 5: Nutrition & Care Guidelines */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="oura-category-tag sage">
                <Apple size={12} /> CELLULAR NOURISHMENT
              </span>
              <span className="badge badge-success">Personalized</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {(diet?.eye?.slice(0, 2) || [
                { food: 'Wild Salmon', benefit: 'Rich in Omega-3 DHA for retinal cellular membrane resilience' },
                { food: 'Blueberries', benefit: 'Anthocyanins support microvascular eye circulation' }
              ]).map((item, idx) => (
                <div key={idx} style={{
                  padding: '0.85rem 1rem', borderRadius: '14px',
                  background: 'var(--card-inner)', border: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex', alignItems: 'center', gap: '0.75rem'
                }}>
                  <span style={{ fontSize: '1.25rem' }}>{idx === 0 ? '🐟' : '🫐'}</span>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff' }}>{item.food}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-2)' }}>{item.benefit}</div>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="oura-btn oura-btn-outline"
              style={{ width: '100%', marginTop: '1rem', padding: '0.6rem 1rem', fontSize: '0.82rem' }}
              onClick={() => setActiveTab && setActiveTab('diet-tips')}
            >
              Explore Full Nutrition Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function CrownIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
  )
}
