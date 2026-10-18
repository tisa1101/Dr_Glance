import { useState } from 'react'
import { Activity, Camera, Home, MessageSquare, Apple, Bell, LogOut, MapPin, Stethoscope, Clock } from 'lucide-react'
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
    label: 'MAIN',
    items: [
      { key: 'dashboard', icon: Home, label: 'Overview' },
      { key: 'scan', icon: Camera, label: 'AI Diagnostics' },
    ]
  },
  {
    label: 'HEALTH',
    items: [
      { key: 'history', icon: Clock, label: 'History' },
      { key: 'appointments', icon: MapPin, label: 'Find Doctor' },
      { key: 'symptom-checker', icon: Stethoscope, label: 'Symptom Checker' },
    ]
  },
  {
    label: 'TOOLS',
    items: [
      { key: 'reminders', icon: Bell, label: 'Reminders' },
      { key: 'diet-tips', icon: Apple, label: 'Diet & Tips' },
    ]
  },
]

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [user, setUser] = useState(null)

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
    : 'U'

  return (
    <div className="app-container">
      <aside className="sidebar">
        {/* Logo */}
        <div className="logo">
          <div className="logo-icon-wrap">
            <Activity size={20} color="white" />
            <span className="logo-pulse-dot" />
          </div>
          <span className="logo-text">DRGLANCE</span>
        </div>

        {/* Navigation */}
        <nav className="nav-links">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <div className="nav-section-label">{section.label}</div>
              {section.items.map(({ key, icon: Icon, label }) => (
                <div
                  key={key}
                  className={`nav-item ${activeTab === key ? 'active' : ''}`}
                  onClick={() => setActiveTab(key)}
                >
                  <Icon size={18} className="nav-icon" />
                  <span className="nav-label">{label}</span>
                  <span className="nav-active-pill" />
                </div>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          {/* User Info */}
          <div className="sidebar-user">
            <div className="sidebar-avatar">{userInitials}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.name || 'User'}</div>
              <div className="sidebar-user-email">{user?.email || ''}</div>
            </div>
          </div>

          {/* Logout */}
          <div
            className="nav-item"
            onClick={() => setUser(null)}
            style={{ color: 'var(--danger)', marginTop: '0.25rem' }}
          >
            <LogOut size={18} className="nav-icon" style={{ color: 'var(--danger)' }} />
            <span className="nav-label">Logout</span>
          </div>

          {/* Version */}
          <div className="sidebar-version">v2.0 Clinical AI</div>
        </div>
      </aside>

      <main className="main-content">
        {renderContent()}
      </main>

      <Chatbot />
    </div>
  )
}

export default App
