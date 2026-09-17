import { useState } from 'react'
import { Activity, Camera, Home, Plus, MessageSquare, Apple, Bell, Menu, Timer, LogOut, MapPin, ClipboardList, Stethoscope } from 'lucide-react'
import Dashboard from './pages/Dashboard'
import Diagnostics from './pages/Diagnostics'
import Chatbot from './components/Chatbot'
import Login from './pages/Login'
import History from './pages/History'
import Appointments from './pages/Appointments'
import SymptomChecker from './pages/SymptomChecker'
import Reminders from './pages/Reminders'
import DietTips from './pages/DietTips'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [user, setUser] = useState(null)

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard': return <Dashboard user={user} />
      case 'scan': return <Diagnostics user={user} />
      case 'history': return <History user={user} />
      case 'appointments': return <Appointments user={user} />
      case 'symptom-checker': return <SymptomChecker user={user} />
      case 'reminders': return <Reminders user={user} />
      case 'diet-tips': return <DietTips user={user} />
      default: return <Dashboard user={user} />
    }
  }

  if (!user) {
    return <Login onLogin={setUser} />
  }

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="logo">
          <Activity color="#5b6cf9" size={28} />
          Dr. Glance AI
        </div>
        
        <nav className="nav-links">
          <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}><Menu size={20} /> Overview</div>
          <div className={`nav-item ${activeTab === 'scan' ? 'active' : ''}`} onClick={() => setActiveTab('scan')}><Camera size={20} /> AI Diagnostics</div>
          <div className={`nav-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}><Timer size={20} /> History</div>
          <div className={`nav-item ${activeTab === 'appointments' ? 'active' : ''}`} onClick={() => setActiveTab('appointments')}><MapPin size={20} /> Find Doctor</div>
          <div className={`nav-item ${activeTab === 'symptom-checker' ? 'active' : ''}`} onClick={() => setActiveTab('symptom-checker')}><Stethoscope size={20} /> Symptom Checker</div>
          <div className={`nav-item ${activeTab === 'reminders' ? 'active' : ''}`} onClick={() => setActiveTab('reminders')}><Bell size={20} /> Reminders</div>
          <div className={`nav-item ${activeTab === 'diet-tips' ? 'active' : ''}`} onClick={() => setActiveTab('diet-tips')}><Apple size={20} /> Diet & Tips</div>
        </nav>
        <div style={{ marginTop: 'auto' }}>
          <div className="nav-item" onClick={() => setUser(null)}><LogOut size={20} /> Logout</div>
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
