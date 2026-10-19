import { useState } from 'react'
import {
  Activity, Camera, Home, MessageSquare, Apple, Bell, LogOut,
  MapPin, Stethoscope, Clock, Menu, X, Sparkles, Moon, Heart, Flame
} from 'lucide-react'
import Dashboard from './pages/Dashboard'
import Diagnostics from './pages/Diagnostics'
import Chatbot from './components/Chatbot'
import Login from './pages/Login'
import History from './pages/History'
import Appointments from './pages/Appointments'
import SymptomChecker from './pages/SymptomChecker'
import Reminders from './pages/Reminders'
import DietTips from './pages/DietTips'

const NAV_SECTIONS = [
  {
    label: 'CLINICAL',
    items: [
      { key: 'dashboard', icon: Home, label: 'Readiness & Radar' },
      { key: 'scan', icon: Camera, label: 'AI Diagnostic Scan' },
      { key: 'symptom-checker', icon: Stethoscope, label: 'Symptom Radar' },
    ]
  },
  {
    label: 'BIOMETRICS',
    items: [
      { key: 'history', icon: Clock, label: 'Scan History' },
      { key: 'reminders', icon: Bell, label: 'Care Reminders' },
      { key: 'diet-tips', icon: Apple, label: 'Nutrition & Diet' },
    ]
  },
  {
    label: 'NETWORK',
    items: [
      { key: 'appointments', icon: MapPin, label: 'Verified Clinics' },
    ]
  },
]

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [user, setUser] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':      return <Dashboard user={user} setActiveTab={setActiveTab} />
      case 'scan':           return <Diagnostics user={user} />
      case 'history':        return <History user={user} />
      case 'appointments':   return <Appointments user={user} />
      case 'symptom-checker': return <SymptomChecker user={user} setActiveTab={setActiveTab} />
      case 'reminders':      return <Reminders user={user} />
      case 'diet-tips':      return <DietTips user={user} />
      default:               return <Dashboard user={user} setActiveTab={setActiveTab} />
    }
  }

  if (!user) {
    return <Login onLogin={setUser} />
  }

  const userInitials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'M'

  return (
    <div className="app-container">
      {/* ─── ŌURA Sidebar ─── */}
      <aside className={`sidebar ${mobileMenuOpen ? 'sidebar-mobile-open' : ''}`}>
        {/* Brand Emblem */}
        <div className="logo">
          <div className="logo-icon-wrap">
            {/* Ōura circular ring glyph */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="4.5" strokeDasharray="3 3" />
            </svg>
            <span className="logo-pulse-dot" />
          </div>
          <span className="logo-text">DR • GLANCE</span>
        </div>

        {/* Navigation Sections */}
        <nav className="nav-links">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <div className="nav-section-label">{section.label}</div>
              {section.items.map(({ key, icon: Icon, label }) => (
                <div
                  key={key}
                  className={`nav-item ${activeTab === key ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab(key)
                    setMobileMenuOpen(false)
                  }}
                >
                  <Icon size={17} className="nav-icon" />
                  <span className="nav-label">{label}</span>
                  {activeTab === key && <span className="nav-active-pill" />}
                </div>
              ))}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer" style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {/* User Profile Capsule */}
          <div className="sidebar-user">
            <div className="sidebar-avatar">{userInitials}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.name || 'Member'}</div>
              <div className="sidebar-user-email">{user?.email || 'Active session'}</div>
            </div>
          </div>

          {/* Logout */}
          <div
            className="nav-item"
            onClick={() => setUser(null)}
            style={{ color: 'var(--oura-coral)', cursor: 'pointer' }}
          >
            <LogOut size={16} className="nav-icon" style={{ color: 'var(--oura-coral)' }} />
            <span className="nav-label">Sign Out</span>
          </div>

          <div className="sidebar-version">ŌURA BIO-SYSTEM v3.0</div>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <main className="main-content">
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          <span>Menu</span>
        </button>

        {renderContent()}
      </main>

      <Chatbot />
    </div>
  )
}

export default App
