import React, { useEffect, useState } from 'react'
import {
  Eye, Droplet, Activity, Apple, Bell, Zap, TrendingUp, Calendar,
  Sparkles, Info, ChevronRight, Moon, Flame, Heart, RefreshCw, CheckCircle, Shield,
  Sun, Plus, Compass, Clock, Check
} from 'lucide-react'
import { API_BASE } from '../config/api'

// ─── Count-Up Hook for Silky Metric Interpolation ──────────────────────────
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

// ─── 1. Cinematic Mountain Dawn Hero (Screen 1) ───────────────────────────
function MountainDawnHero({ score = 88, setActiveTab }) {
  const animatedScore = useCountUp(score, 1400)
  const radius = 90
  const circumference = Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="mountain-dawn-hero animate-fade-in">
      {/* Alpine Mountain Silhouette Background */}
      <svg
        viewBox="0 0 1200 480"
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%',
          opacity: 0.45, pointerEvents: 'none', zIndex: 0
        }}
        preserveAspectRatio="none"
      >
        {/* Distant Mountain Peak */}
        <polygon
          points="0,480 320,160 480,260 600,90 740,240 980,120 1200,480"
          fill="#0c233c"
          opacity="0.6"
        />
        {/* Midground Ridge */}
        <polygon
          points="0,480 180,290 380,340 600,190 820,310 1040,230 1200,480"
          fill="#07192b"
          opacity="0.85"
        />
        {/* Foreground Ridge */}
        <polygon
          points="0,480 260,360 460,410 600,320 780,390 1000,330 1200,480"
          fill="#090a0f"
        />
      </svg>

      {/* Atmospheric Mist Layer */}
      <div className="mountain-mist-layer" />

      {/* Floating Crown / Milestone Arc Dial */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 560, width: '100%' }}>
        <div className="oura-arc-wrap" style={{ width: 250, height: 140, margin: '0 auto 1rem' }}>
          <svg width="250" height="140" viewBox="0 0 250 140" style={{ overflow: 'visible' }}>
            {/* Background Arc Track */}
            <path
              d="M 20 125 A 90 90 0 0 1 230 125"
              fill="none"
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="9"
              strokeLinecap="round"
            />
            {/* Milestone Tick Label (100) */}
            <text x="234" y="129" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="inherit">100</text>
            <circle cx="230" cy="125" r="3.5" fill="rgba(255,255,255,0.6)" />

            {/* Glowing Active Arc */}
            <path
              d="M 20 125 A 90 90 0 0 1 230 125"
              fill="none"
              stroke="url(#alpineDawnGradient)"
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 1.8s cubic-bezier(0.16, 1, 0.3, 1)' }}
            />

            <defs>
              <linearGradient id="alpineDawnGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="55%" stopColor="#7dd3fc" />
                <stop offset="85%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
          </svg>

          {/* Central Number & Crown */}
          <div className="oura-arc-center-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: 2 }}>
              <CrownIcon size={14} className="text-amber-400" />
              <span className="oura-arc-sublabel" style={{ margin: 0, color: 'rgba(255,255,255,0.7)' }}>READINESS</span>
            </div>
            <div className="oura-arc-number" style={{ fontSize: '3.2rem', textShadow: '0 0 25px rgba(56, 189, 248, 0.3)' }}>
              {animatedScore}
            </div>
          </div>
        </div>

        {/* Editorial Heading */}
        <h1 className="oura-serif-title" style={{ fontSize: '2.5rem', marginBottom: '0.45rem' }}>
          Go get ’em!
        </h1>

        <p style={{
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '0.98rem',
          lineHeight: 1.55,
          maxWidth: 480,
          margin: '0 auto 1.5rem',
          fontWeight: 400,
        }}>
          A restful circadian cycle has elevated your retinal microvascular resilience and oral tissue recovery. If there are high-focus tasks on your schedule, today is the day to tackle them!
        </p>

        {/* Action Button Pills */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button
            className="oura-btn"
            onClick={() => setActiveTab && setActiveTab('scan')}
          >
            Start Clinical Scan
          </button>
          <button
            className="oura-btn oura-btn-outline"
            onClick={() => setActiveTab && setActiveTab('history')}
          >
            Learn more
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── 2. Precision 2x2 Bento Vitals Matrix (Screen 2) ──────────────────────
function BentoVitalsMatrix({ setActiveTab }) {
  return (
    <div className="bento-section">
      {/* ── Group 1: Readiness ── */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h3 className="bento-section-header">
          <Sparkles size={17} color="var(--oura-cyan)" /> Readiness
        </h3>

        <div className="bento-grid-2x2">
          {/* Bento Card 1: Readiness Score */}
          <div
            className="bento-card"
            onClick={() => setActiveTab && setActiveTab('history')}
          >
            <div className="bento-card-header">
              <span>Readiness Score</span>
              <ChevronRight size={16} />
            </div>

            <div style={{ margin: '1rem 0 0.5rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--oura-cyan)', fontWeight: 600, marginBottom: '0.2rem' }}>
                Optimal
              </div>
              <div className="bento-card-val" style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
                88 <CrownIcon size={18} />
              </div>
            </div>

            <div style={{ fontSize: '0.74rem', color: 'var(--text-3)' }}>
              Resting heart rate &amp; HRV steady
            </div>
          </div>

          {/* Bento Card 2: Symptom Radar with Glowing Crescent Arc */}
          <div
            className="bento-card aura-glow-cyan"
            onClick={() => setActiveTab && setActiveTab('symptom-checker')}
          >
            <div className="bento-card-header">
              <span>Symptom Radar</span>
              <ChevronRight size={16} />
            </div>

            {/* Glowing Scanning Crescent Radar Arc */}
            <div className="crescent-radar-arc">
              <svg width="100%" height="56" viewBox="0 0 200 56" style={{ overflow: 'visible' }}>
                <path
                  d="M 15 50 A 85 45 0 0 1 185 50"
                  fill="none"
                  stroke="rgba(56, 189, 248, 0.15)"
                  strokeWidth="3"
                />
                <path
                  d="M 30 50 A 70 35 0 0 1 170 50"
                  fill="none"
                  stroke="url(#crescentRadarGrad)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <circle cx="100" cy="15" r="4" fill="var(--oura-cyan)" className="beacon-ring" />
                <defs>
                  <linearGradient id="crescentRadarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="transparent" />
                    <stop offset="50%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div>
              <div className="bento-card-val" style={{ fontSize: '1.4rem' }}>
                No signs
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-3)', marginTop: '0.15rem' }}>
                No active retinal or mucosal strain
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Group 2: Sleep & Restoration ── */}
      <div>
        <h3 className="bento-section-header">
          <Moon size={17} color="#c084fc" /> Sleep &amp; Regeneration
        </h3>

        <div className="bento-grid-2x2">
          {/* Bento Card 3: Sleep Score */}
          <div
            className="bento-card"
            onClick={() => setActiveTab && setActiveTab('history')}
          >
            <div className="bento-card-header">
              <span>Sleep Score</span>
              <ChevronRight size={16} />
            </div>

            <div style={{ margin: '1rem 0 0.5rem' }}>
              <div style={{ fontSize: '0.85rem', color: '#34d399', fontWeight: 600, marginBottom: '0.2rem' }}>
                Good
              </div>
              <div className="bento-card-val">
                84
              </div>
            </div>

            <div style={{ fontSize: '0.74rem', color: 'var(--text-3)' }}>
              7h 16m total restful nocturnal cycle
            </div>
          </div>

          {/* Bento Card 4: Body Clock with Dual Alignment Slider */}
          <div
            className="bento-card aura-glow-violet"
            onClick={() => setActiveTab && setActiveTab('reminders')}
          >
            <div className="bento-card-header">
              <span>Body Clock</span>
              <ChevronRight size={16} />
            </div>

            {/* Dual Alignment Slider Track */}
            <div className="alignment-track-wrap">
              <svg width="100%" height="32" viewBox="0 0 200 32" style={{ overflow: 'visible' }}>
                {/* Upper curve */}
                <path d="M 10 24 Q 100 8 190 24" fill="none" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="2" />
                {/* Lower glow curve */}
                <path d="M 20 28 Q 100 12 180 28" fill="none" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="2" />
                {/* Alignment Indicator Bead */}
                <circle cx="100" cy="16" r="4.5" fill="#ffffff" stroke="#090a0f" strokeWidth="1.5" />
                <circle cx="112" cy="18" r="3.5" fill="var(--oura-cyan)" />
              </svg>
            </div>

            <div>
              <div className="bento-card-val" style={{ fontSize: '1.4rem' }}>
                Aligned
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-3)', marginTop: '0.15rem' }}>
                Circadian synchronization on track
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── 3. Generative Biometric Waveform & AI Advisor Card (Screen 3) ────────
function GenerativeWaveformCard({ setActiveTab }) {
  return (
    <div className="card aura-glow-cyan" style={{ marginBottom: '2rem' }}>
      {/* Category Dual-Badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <span className="oura-category-tag coral" style={{ margin: 0 }}>NEEDS CARE</span>
          <span className="oura-category-tag" style={{ margin: 0 }}>THRIVING</span>
        </div>
        <Info size={16} color="var(--text-3)" style={{ cursor: 'pointer' }} />
      </div>

      {/* Undulating Generative 3D Ribbon Waveform */}
      <div className="generative-waveform-container">
        <svg width="100%" height="160" viewBox="0 0 500 160" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id="ribbonGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="45%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
            <linearGradient id="ribbonGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e07a5f" />
              <stop offset="50%" stopColor="#86a378" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>

          {/* Multiple Sinusoidal Biometric Flow Ribbons */}
          {[
            { offset: 0, opacity: 0.9, stroke: 'url(#ribbonGrad1)', width: 2.2 },
            { offset: 8, opacity: 0.7, stroke: 'url(#ribbonGrad1)', width: 1.8 },
            { offset: 16, opacity: 0.5, stroke: 'url(#ribbonGrad2)', width: 1.5 },
            { offset: 24, opacity: 0.35, stroke: 'url(#ribbonGrad2)', width: 1.2 },
            { offset: 32, opacity: 0.2, stroke: '#38bdf8', width: 1 },
          ].map((ribbon, idx) => (
            <path
              key={idx}
              d={`M 0 ${80 + idx * 3} Q 120 ${35 + idx * 2} 240 ${85 + idx * 3} T 500 ${75 + idx * 2}`}
              fill="none"
              stroke={ribbon.stroke}
              strokeWidth={ribbon.width}
              opacity={ribbon.opacity}
              className="animated-ribbon"
              style={{ animationDelay: `${idx * 0.4}s` }}
            />
          ))}

          {/* Floating Metric Marker Nodes */}
          <g transform="translate(140, 52)">
            <circle cx="0" cy="0" r="14" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" />
            <text x="0" y="4" textAnchor="middle" fill="#fff" fontSize="11">💧</text>
          </g>

          <g transform="translate(320, 68)">
            <circle cx="0" cy="0" r="14" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" />
            <text x="0" y="4" textAnchor="middle" fill="#fff" fontSize="11">🌙</text>
          </g>

          <g transform="translate(420, 92)">
            <circle cx="0" cy="0" r="14" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.2)" />
            <text x="0" y="4" textAnchor="middle" fill="#fff" fontSize="11">👁️</text>
          </g>
        </svg>
      </div>

      {/* Editorial Headline */}
      <h2 className="oura-serif-title" style={{ fontSize: '1.95rem', marginTop: '0.5rem', marginBottom: '0.45rem' }}>
        Rising retinal health, with a slight dip in blink rate
      </h2>

      <p style={{ color: 'var(--text-2)', fontSize: '0.92rem', lineHeight: 1.55, marginBottom: '1.4rem' }}>
        You've maintained steady microvascular ocular blood flow with hydration. Just be mindful to pause every 45 minutes to restore tear film moisture as you work.
      </p>

      {/* Pill CTA with Star Sparkles */}
      <button
        className="oura-btn"
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          color: '#ffffff',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: 'none',
          gap: '0.5rem'
        }}
        onClick={() => {
          // Open Chatbot directly
          const chatBtn = document.querySelector('[aria-label="Open clinical health assistant"]')
          if (chatBtn) chatBtn.click()
        }}
      >
        <Sparkles size={15} color="var(--oura-cyan)" /> Dive in with Clinical Advisor
      </button>
    </div>
  )
}

// ─── 4. Main Exported Dashboard ───────────────────────────────────────────
export default function Dashboard({ user, setActiveTab }) {
  const [tips, setTips] = useState(null)
  const [diet, setDiet] = useState(null)

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

  return (
    <div className="animate-fade-in" style={{ maxWidth: 1180, margin: '0 auto', paddingBottom: '3rem' }}>
      {/* ── 1. The Alpine Mountain Dawn Hero (Screen 1) ── */}
      <MountainDawnHero score={88} setActiveTab={setActiveTab} />

      {/* ── 2-Column Split: Bento Vitals Matrix + Generative Waveforms ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.05fr 0.95fr',
        gap: '2rem',
        alignItems: 'start',
      }}>
        {/* Left: 2x2 Bento Vitals Matrix (Screen 2) */}
        <div>
          <BentoVitalsMatrix setActiveTab={setActiveTab} />
        </div>

        {/* Right: Generative Biometric Waveforms & Insights (Screen 3) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <GenerativeWaveformCard setActiveTab={setActiveTab} />

          {/* Clinical Nutrition Card */}
          <div className="card aura-glow-emerald">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="oura-category-tag sage">
                <Apple size={12} /> BIOMETRIC NOURISHMENT
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
              Explore Full Clinical Diet Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function CrownIcon({ size = 16, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
  )
}
