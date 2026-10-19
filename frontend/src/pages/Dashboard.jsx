import React, { useEffect, useState } from 'react'
import { Eye, Droplet, Activity, Apple, Bell, Zap, TrendingUp, Calendar, Sparkles } from 'lucide-react'
import { API_BASE } from '../config/api'

// ─── Stat Card ────────────────────────────────────────────────────────
function StatCard({ icon, iconBg, label, value, trend, trendDir, subtext }) {
  return (
    <div className="stat-card" style={{ flex: 1 }}>
      <div className="stat-icon-wrap" style={{ background: iconBg }}>
        {icon}
      </div>
      <div className="stat-number">{value}</div>
      <div className="stat-label">{label}</div>
      {trend && (
        <div className={`stat-trend ${trendDir}`}>
          {trendDir === 'up' ? '↑' : trendDir === 'down' ? '↓' : '•'} {trend}
        </div>
      )}
      {subtext && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>{subtext}</div>}
    </div>
  )
}

// ─── Wellness Ring ────────────────────────────────────────────────────
function WellnessRing({ score = 94 }) {
  const radius = 40
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div style={{ position: 'relative', width: 100, height: 100 }}>
      <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="50" cy="50" r={radius} fill="none"
          stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <circle cx="50" cy="50" r={radius} fill="none"
          stroke="url(#wellnessGrad)" strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1)' }}
        />
        <defs>
          <linearGradient id="wellnessGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ 100</span>
      </div>
    </div>
  )
}

// ─── Diet Card ────────────────────────────────────────────────────────
function DietFoodCard({ emoji, name, benefit }) {
  return (
    <div className="diet-card">
      <div className="diet-emoji">{emoji}</div>
      <div className="diet-name">{name}</div>
      <div className="diet-benefit">{benefit}</div>
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────
export default function Dashboard({ user, setActiveTab }) {
  const [tips, setTips] = useState(null)
  const [diet, setDiet] = useState(null)
  const [scanCount, setScanCount] = useState(7)

  useEffect(() => {
    // Fetch diet and tips from backend
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

  const firstName = user?.name ? user.name.split(' ')[0] : 'User'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const DIET_FOODS = [
    { emoji: '🥕', name: 'Carrots', benefit: 'Rich in beta-carotene for eye health' },
    { emoji: '🐟', name: 'Salmon', benefit: 'Omega-3s reduce dry eye risk' },
    { emoji: '🥦', name: 'Broccoli', benefit: 'Vitamins C & E protect vision' },
    { emoji: '🫐', name: 'Blueberries', benefit: 'Antioxidants protect retinas' },
    { emoji: '🥬', name: 'Spinach', benefit: 'Lutein & zeaxanthin for eyes' },
    { emoji: '🧄', name: 'Garlic', benefit: 'Antibacterial oral health boost' },
    { emoji: '🍵', name: 'Green Tea', benefit: 'Catechins fight oral bacteria' },
  ]

  return (
    <div className="animate-fade-in">
      {/* ─── Hero Header ─── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '2rem',
        flexWrap: 'wrap', gap: '1.5rem',
      }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {greeting} ☀️
          </div>
          <h1 className="page-title" style={{ marginBottom: 0 }}>
            Welcome back, {firstName}!
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Here's your health snapshot for today
          </p>
        </div>

        {/* Wellness Ring */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '1.25rem',
          background: 'rgba(99,102,241,0.08)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: '20px', padding: '1rem 1.5rem',
          backdropFilter: 'blur(12px)',
        }}>
          <WellnessRing score={94} />
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>Wellness Score</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--success)' }}>Excellent</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>↑ 2 pts from last week</div>
          </div>
        </div>
      </div>

      {/* ─── Stat Cards Row ─── */}
      <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <StatCard
          icon={<Eye size={22} color="#06b6d4" />}
          iconBg="linear-gradient(135deg, rgba(6,182,212,0.2), rgba(6,182,212,0.05))"
          label="Last Eye Scan"
          value="Normal"
          trend="98% confidence"
          trendDir="up"
        />
        <StatCard
          icon={<Droplet size={22} color="#f59e0b" />}
          iconBg="linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.05))"
          label="Last Oral Scan"
          value="Plaque"
          trend="Action needed"
          trendDir="down"
        />
        <StatCard
          icon={<Activity size={22} color="#6366f1" />}
          iconBg="linear-gradient(135deg, rgba(99,102,241,0.2), rgba(99,102,241,0.05))"
          label="Scans This Month"
          value={String(scanCount)}
          trend="↑ 3 from last month"
          trendDir="up"
        />
        <StatCard
          icon={<TrendingUp size={22} color="#10b981" />}
          iconBg="linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.05))"
          label="Wellness Score"
          value="94"
          trend="Excellent"
          trendDir="up"
          subtext="Top 15% of users"
        />
      </div>

      {/* ─── Quick Actions ─── */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          Quick Actions
        </div>
        <div className="quick-actions">
          <button
            className="quick-action-btn"
            onClick={() => setActiveTab && setActiveTab('scan')}
          >
            <span style={{
              width: 42, height: 42, borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(6,182,212,0.25), rgba(6,182,212,0.08))',
              border: '1px solid rgba(6,182,212,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.35rem',
              flexShrink: 0
            }}>👁️</span>
            <div>
              <div className="action-title">Start Eye Screening</div>
              <div className="action-sub">Deep neural network eye health analysis</div>
            </div>
          </button>
          <button
            className="quick-action-btn"
            onClick={() => setActiveTab && setActiveTab('scan')}
          >
            <span style={{
              width: 42, height: 42, borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(245,158,11,0.25), rgba(245,158,11,0.08))',
              border: '1px solid rgba(245,158,11,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.35rem',
              flexShrink: 0
            }}>🦷</span>
            <div>
              <div className="action-title">Start Oral Screening</div>
              <div className="action-sub">Plaque, gum &amp; caries inspection</div>
            </div>
          </button>
        </div>
      </div>

      {/* ─── Main Grid ─── */}
      <div className="dashboard-grid">
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Daily Tips */}
          <div className="card">
            <div className="card-header">
              <Sparkles size={18} color="var(--accent)" />
              Daily Health Tips
              <span className="badge badge-info" style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>Today</span>
            </div>
            {tips ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    marginBottom: '0.75rem', padding: '0.5rem 0.75rem',
                    background: 'rgba(6,182,212,0.08)', borderRadius: '8px',
                    border: '1px solid rgba(6,182,212,0.15)',
                  }}>
                    <span>👁️</span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--accent)' }}>Eye Care</span>
                  </div>
                  <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {tips.eye.map((t, i) => (
                      <li key={i} style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{t}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    marginBottom: '0.75rem', padding: '0.5rem 0.75rem',
                    background: 'rgba(245,158,11,0.08)', borderRadius: '8px',
                    border: '1px solid rgba(245,158,11,0.15)',
                  }}>
                    <span>👄</span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--warning)' }}>Oral Care</span>
                  </div>
                  <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {tips.oral.map((t, i) => (
                      <li key={i} style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div>
                {[1, 2, 3].map(i => (
                  <div key={i} className="shimmer" style={{ height: '16px', marginBottom: '0.75rem', width: `${70 + i * 8}%` }} />
                ))}
              </div>
            )}
          </div>

          {/* Diet Recommendations horizontal scroll */}
          <div className="card">
            <div className="card-header">
              <Apple size={18} color="var(--success)" />
              Recommended Foods
              <span className="badge badge-success" style={{ marginLeft: 'auto', fontSize: '0.7rem' }}>Personalized</span>
            </div>
            {diet ? (
              <div className="diet-scroll">
                {diet.eye?.map((item, i) => (
                  <DietFoodCard
                    key={`eye-${i}`}
                    emoji={DIET_FOODS[i % DIET_FOODS.length].emoji}
                    name={item.food}
                    benefit={item.benefit}
                  />
                ))}
                {diet.oral?.map((item, i) => (
                  <DietFoodCard
                    key={`oral-${i}`}
                    emoji={DIET_FOODS[(i + 3) % DIET_FOODS.length].emoji}
                    name={item.food}
                    benefit={item.benefit}
                  />
                ))}
              </div>
            ) : (
              <div className="diet-scroll">
                {DIET_FOODS.map((f, i) => (
                  <DietFoodCard key={i} emoji={f.emoji} name={f.name} benefit={f.benefit} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Reminders Widget */}
          <div className="card" style={{ margin: 0 }}>
            <div className="card-header">
              <Bell size={18} color="var(--warning)" />
              Upcoming Reminders
              <span className="sidebar-badge" style={{ marginLeft: 'auto' }}>2</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {[
                { label: 'Drink Water 💧', time: '14:00', color: 'primary' },
                { label: '20-20-20 Eye Break 👁️', time: '15:30', color: 'success' },
                { label: 'Brush Teeth 🦷', time: '20:00', color: 'warning' },
                { label: 'Eye Drops 💊', time: '22:00', color: 'primary' },
              ].map((r, i) => (
                <div key={i} className="timeline-item">
                  <div className={`timeline-dot ${r.color === 'success' ? 'success' : r.color === 'warning' ? 'warning' : ''}`} />
                  <div className="timeline-content">
                    <div className="timeline-title">{r.label}</div>
                  </div>
                  <div className="timeline-time">{r.time}</div>
                </div>
              ))}
            </div>
            <button
              className="btn btn-secondary"
              style={{ width: '100%', marginTop: '1rem', borderRadius: '12px' }}
              onClick={() => setActiveTab && setActiveTab('reminders')}
            >
              <Bell size={14} /> Manage Reminders
            </button>
          </div>

          {/* Next Appointment Teaser */}
          <div className="card" style={{ margin: 0, background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(6,182,212,0.06))', borderColor: 'rgba(99,102,241,0.2)' }}>
            <div className="card-header">
              <Calendar size={18} color="var(--primary)" />
              Next Appointment
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: 52, height: 52, borderRadius: '14px',
                background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'white', lineHeight: 1 }}>28</div>
                <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>OCT</div>
              </div>
              <div>
                <div style={{ fontWeight: 600, marginBottom: '0.2rem' }}>Dr. Sarah Chen</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Ophthalmologist · 10:30 AM</div>
                <span className="badge badge-success" style={{ marginTop: '0.5rem', display: 'inline-block' }}>Confirmed</span>
              </div>
            </div>
            <button
              className="btn btn-secondary"
              style={{ width: '100%', marginTop: '1rem', borderRadius: '12px', fontSize: '0.85rem' }}
              onClick={() => setActiveTab && setActiveTab('appointments')}
            >
              <Zap size={14} /> View All Appointments
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
