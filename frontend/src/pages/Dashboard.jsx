import React, { useEffect, useState } from 'react'
import {
  Eye, Droplet, Activity, Apple, Bell, Zap, TrendingUp, Calendar,
  Sparkles, Info, ChevronRight, Moon, Flame, Heart, RefreshCw, CheckCircle, Shield
} from 'lucide-react'
import { API_BASE } from '../config/api'

// ─── Smooth Count-Up Hook ──────────────────────────────────────────────────
function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const stepTime = 16
    const totalSteps = duration / stepTime
    const increment = target / totalSteps

    const timer = setInterval(() => {
      start += increment
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.round(start))
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [target, duration])

  return count
}

// ─── ŌURA Metric Circle Badge with Animated Ring (Screen 3) ────────────────
function OuraCircleMetric({ icon: Icon, value, label, ringColor = "#38bdf8", pct = 88, active = false, delay = "0s" }) {
  const radius = 22
  const circ = 2 * Math.PI * radius
  const offset = circ - (pct / 100) * circ

  return (
    <div className="oura-metric-circle-item" style={{ animation: `fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay} both` }}>
      <div className={`oura-circle-badge ${active ? 'active' : ''}`} style={{ width: 56, height: 56 }}>
        {/* Animated Background Ring */}
        <svg width="56" height="56" style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
          <circle cx="28" cy="28" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" />
          <circle
            cx="28" cy="28" r={radius} fill="none"
            stroke={ringColor} strokeWidth="2.5" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
          />
        </svg>

        <Icon size={13} style={{ color: ringColor, marginBottom: 1, zIndex: 1 }} />
        <span className="oura-circle-value" style={{ fontSize: '0.98rem', zIndex: 1 }}>{value}</span>
      </div>
      <span className="oura-circle-label" style={{ marginTop: '0.2rem' }}>{label}</span>
    </div>
  )
}

// ─── ŌURA Arc Gauge Dial with Animated Stroke & Counter (Screen 3) ────────
function OuraArcDial({ score = 94, subtitle = "Making progress" }) {
  const animatedScore = useCountUp(score, 1400)
  const radius = 80
  const circumference = Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="oura-hero-arc-container">
      {/* Background Breathing Ambient Aura */}
      <div style={{
        position: 'absolute', top: '15%', width: '180px', height: '180px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(56, 189, 248, 0.16) 0%, transparent 70%)',
        filter: 'blur(20px)',
        pointerEvents: 'none',
        animation: 'beaconPing 4s ease-in-out infinite',
      }} />

      <div className="oura-arc-wrap">
        <svg width="220" height="125" viewBox="0 0 220 125" style={{ overflow: 'visible' }}>
          {/* Background Track Arc */}
          <path
            d="M 20 110 A 80 80 0 0 1 200 110"
            fill="none"
            stroke="rgba(255, 255, 255, 0.07)"
            strokeWidth="9"
            strokeLinecap="round"
          />
          {/* Milestone tick */}
          <circle cx="200" cy="110" r="3" fill="rgba(255,255,255,0.4)" />

          {/* Active Animated Progress Arc */}
          <path
            d="M 20 110 A 80 80 0 0 1 200 110"
            fill="none"
            stroke="url(#ouraArcGradient)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 1.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
          />

          <defs>
            <linearGradient id="ouraArcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="65%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#86a378" />
            </linearGradient>
          </defs>
        </svg>

        <div className="oura-arc-center-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: 2 }}>
            <Flame size={16} color="var(--oura-cyan)" style={{ animation: 'ambientBreath 3s infinite' }} />
            <span className="oura-arc-sublabel" style={{ margin: 0 }}>WELLNESS READINESS</span>
          </div>
          <div className="oura-arc-number">
            {animatedScore}<span style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--oura-cyan)' }}>%</span>
          </div>
        </div>
      </div>

      <h2 className="oura-editorial-header" style={{ marginTop: '0.75rem' }}>{subtitle}</h2>
      <p className="oura-editorial-desc">
        Today's clinical screening baseline is aligned with optimal health. Your retina and oral biometrics are within steady ranges.
      </p>
    </div>
  )
}

// ─── Daytime Stress Dotted Graph with Draw-In & Tooltips (Screen 1) ────────
function DaytimeStressGraph() {
  const points = [
    { x: 30,  y: 75, time: '9:00 AM',  state: 'Engaged',  score: '72%' },
    { x: 60,  y: 55, time: '10:15 AM', state: 'Stressed', score: '61%' },
    { x: 90,  y: 70, time: '11:30 AM', state: 'Engaged',  score: '75%' },
    { x: 120, y: 95, time: '1:00 PM',  state: 'Relaxed',  score: '84%' },
    { x: 150, y: 80, time: '2:15 PM',  state: 'Engaged',  score: '78%' },
    { x: 180, y: 60, time: '3:30 PM',  state: 'Stressed', score: '64%' },
    { x: 210, y: 50, time: '4:45 PM',  state: 'Stressed', score: '58%' },
    { x: 240, y: 35, time: '6:00 PM',  state: 'Strained', score: '50%' },
    { x: 270, y: 40, time: '7:30 PM',  state: 'Stressed', score: '55%' },
    { x: 300, y: 65, time: '9:00 PM',  state: 'Engaged',  score: '74%' },
    { x: 330, y: 70, time: '10:30 PM', state: 'Relaxed',  score: '82%' },
    { x: 360, y: 110, time: '11:45 PM', state: 'Restored', score: '94%' },
  ]

  const [activePoint, setActivePoint] = useState(points[points.length - 1])

  const pathD = points.reduce((acc, pt, idx) => (
    idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`
  ), '')

  return (
    <div style={{ position: 'relative', width: '100%', padding: '0.75rem 0' }}>
      {/* Live Tooltip Pill */}
      {activePoint && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0.45rem 0.95rem', borderRadius: '9999px',
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)',
          marginBottom: '0.75rem', fontSize: '0.76rem', color: '#ffffff',
          backdropFilter: 'blur(10px)',
          animation: 'fadeIn 0.2s ease',
        }}>
          <span style={{ color: 'var(--text-3)' }}>{activePoint.time}</span>
          <span style={{ fontWeight: 600, color: 'var(--oura-cyan)' }}>State: {activePoint.state}</span>
          <span style={{ color: '#34d399', fontWeight: 600 }}>HRV Sync: {activePoint.score}</span>
        </div>
      )}

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
        <text x="320" y="124" fill="rgba(52,211,153,0.8)" fontSize="9" fontWeight="600" fontFamily="inherit">Restored</text>

        {/* Animated Spline Path */}
        <path
          d={pathD}
          fill="none"
          stroke="rgba(255, 255, 255, 0.75)"
          strokeWidth="2.2"
          strokeLinecap="round"
          className="animated-ecg-path"
        />

        {/* Interactive Nodes */}
        {points.map((pt, i) => {
          const isSelected = activePoint === pt
          const isLatest = i === points.length - 1

          return (
            <g key={i} style={{ cursor: 'pointer' }} onMouseEnter={() => setActivePoint(pt)}>
              {/* Concentric Ping Beacon on current real-time point */}
              {isLatest && (
                <circle
                  cx={pt.x} cy={pt.y}
                  r="10"
                  fill="none"
                  stroke="var(--oura-cyan)"
                  strokeWidth="1.5"
                  className="beacon-ring"
                />
              )}

              {/* Node Dot */}
              <circle
                cx={pt.x} cy={pt.y}
                r={isSelected ? "5" : "3.5"}
                fill={isSelected ? "var(--oura-cyan)" : "#ffffff"}
                stroke="#090a0f"
                strokeWidth="1.5"
                style={{ transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
              />
            </g>
          )
        })}
      </svg>

      {/* Time axis marks */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        padding: '0.35rem 2rem 0 1rem', fontSize: '0.72rem',
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
  const [activeHypnoStage, setActiveHypnoStage] = useState(null)

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

  // Dynamic card aura morphing based on selected strain state
  const strainAuraClass = activeStrainStatus === 'major'
    ? 'aura-glow-terracotta'
    : activeStrainStatus === 'minor'
    ? 'aura-glow-emerald'
    : 'aura-glow-cyan'

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

      {/* ─── Top Metric Circles Carousel with Animated Rings (Screen 3) ─── */}
      <div className="oura-metric-bar">
        <OuraCircleMetric icon={CrownIcon} value="88" label="Readiness" ringColor="var(--oura-amber)" pct={88} active delay="0s" />
        <OuraCircleMetric icon={Eye} value="94" label="Vision Score" ringColor="var(--oura-cyan)" pct={94} active delay="0.06s" />
        <OuraCircleMetric icon={Sparkles} value="91" label="Oral Health" ringColor="var(--oura-sage)" pct={91} delay="0.12s" />
        <OuraCircleMetric icon={Flame} value="7" label="Scans Total" ringColor="var(--oura-coral)" pct={70} delay="0.18s" />
        <OuraCircleMetric icon={Heart} value="68" label="Resting bpm" ringColor="var(--oura-blue)" pct={68} delay="0.24s" />
      </div>

      {/* ─── Main Two-Column Layout ─── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.15fr 0.85fr',
        gap: '1.75rem',
        alignItems: 'start',
      }}>
        {/* Left Column: Hero Arc & Reactive Symptom Radar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Card 1: ŌURA Hero Arc Gauge (Screen 3) */}
          <div className="card aura-glow-cyan stagger-1">
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

          {/* Card 2: Symptom Radar with Dynamic Color Aura Morphing (Screen 2) */}
          <div className={`card ${strainAuraClass} stagger-2`} style={{ transition: 'background 0.5s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className={`oura-category-tag ${activeStrainStatus === 'major' ? 'coral' : activeStrainStatus === 'minor' ? 'sage' : ''}`}>
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

            {/* 3 Status Capsules with Pulsing Ripples */}
            <div className="oura-status-group">
              <div
                className={`oura-status-item ${activeStrainStatus === 'none' ? 'active' : ''}`}
                onClick={() => setActiveStrainStatus('none')}
              >
                <div className={`oura-status-dot-circle petrol ${activeStrainStatus === 'none' ? 'pulse-active' : ''}`} />
                <span className="oura-status-label">No signs</span>
              </div>
              <div
                className={`oura-status-item ${activeStrainStatus === 'minor' ? 'active' : ''}`}
                onClick={() => setActiveStrainStatus('minor')}
              >
                <div className={`oura-status-dot-circle sage ${activeStrainStatus === 'minor' ? 'pulse-active' : ''}`} />
                <span className="oura-status-label">Minor signs</span>
              </div>
              <div
                className={`oura-status-item ${activeStrainStatus === 'major' ? 'active' : ''}`}
                onClick={() => setActiveStrainStatus('major')}
              >
                <div className={`oura-status-dot-circle coral ${activeStrainStatus === 'major' ? 'pulse-active' : ''}`} />
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
                transition: 'all 0.3s ease',
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
          <div className="card aura-glow-violet stagger-2">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="oura-category-tag" style={{ color: '#c084fc' }}>
                DAYTIME STRESS
              </span>
              <Info size={16} color="var(--text-3)" style={{ cursor: 'pointer' }} />
            </div>

            <DaytimeStressGraph />

            {/* Toggles (Screen 1) */}
            <div style={{ marginTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.5rem' }}>
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
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                transition: 'transform 0.2s ease', cursor: 'pointer',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
              >
                <div>
                  <div style={{ fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-3)', fontWeight: 700 }}>STRESSED</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>45m</div>
                </div>
                <ChevronRight size={16} color="var(--text-3)" />
              </div>

              <div style={{
                padding: '0.85rem 1rem', borderRadius: '16px',
                background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                transition: 'transform 0.2s ease', cursor: 'pointer',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
              >
                <div>
                  <div style={{ fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-3)', fontWeight: 700 }}>RESTORED</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>1h 15m</div>
                </div>
                <ChevronRight size={16} color="var(--text-3)" />
              </div>
            </div>
          </div>

          {/* Card 4: Biometric Sleep & Tissue Recovery Hypnogram (Screen 5) */}
          <div className="card aura-glow-indigo stagger-3">
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

            {/* Hypnogram segmented bar with interactive hover */}
            <div className="oura-hypnogram">
              <div
                className="oura-hypno-seg awake"
                style={{ width: '12%', opacity: activeHypnoStage && activeHypnoStage !== 'awake' ? 0.35 : 1 }}
                onMouseEnter={() => setActiveHypnoStage('awake')}
                onMouseLeave={() => setActiveHypnoStage(null)}
              >
                Awake
              </div>
              <div
                className="oura-hypno-seg rem"
                style={{ width: '25%', opacity: activeHypnoStage && activeHypnoStage !== 'rem' ? 0.35 : 1 }}
                onMouseEnter={() => setActiveHypnoStage('rem')}
                onMouseLeave={() => setActiveHypnoStage(null)}
              >
                REM
              </div>
              <div
                className="oura-hypno-seg light"
                style={{ width: '45%', opacity: activeHypnoStage && activeHypnoStage !== 'light' ? 0.35 : 1 }}
                onMouseEnter={() => setActiveHypnoStage('light')}
                onMouseLeave={() => setActiveHypnoStage(null)}
              >
                Light
              </div>
              <div
                className="oura-hypno-seg deep"
                style={{ width: '18%', opacity: activeHypnoStage && activeHypnoStage !== 'deep' ? 0.35 : 1 }}
                onMouseEnter={() => setActiveHypnoStage('deep')}
                onMouseLeave={() => setActiveHypnoStage(null)}
              >
                Deep
              </div>
            </div>

            {activeHypnoStage ? (
              <div style={{
                fontSize: '0.76rem', color: 'var(--oura-cyan)',
                padding: '0.35rem 0.6rem', background: 'rgba(255,255,255,0.04)',
                borderRadius: '8px', marginBottom: '0.5rem',
                animation: 'fadeIn 0.2s ease',
              }}>
                {activeHypnoStage === 'deep' && '★ Deep Sleep (1h 25m): Peak cellular ocular rejuvenation & tissue recovery'}
                {activeHypnoStage === 'rem' && '✦ REM Sleep (1h 50m): Neural retinal pathways consolidation & visual refresh'}
                {activeHypnoStage === 'light' && '• Light Sleep (4h 1m): Muscular relaxation & tear film stability'}
                {activeHypnoStage === 'awake' && '○ Awake (1h 0m): Brief transitions during nocturnal restoration'}
              </div>
            ) : null}

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
          <div className="card aura-glow-emerald stagger-3">
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
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  transition: 'transform 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(3px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
                >
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
