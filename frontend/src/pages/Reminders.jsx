import React, { useState, useEffect } from 'react'
import { Bell, Plus, Trash2, Clock, Calendar } from 'lucide-react'
import { API_BASE } from '../config/api'

export default function Reminders({ user }) {
  const [reminders, setReminders] = useState([])
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('')
  const [type, setType] = useState('general')

  useEffect(() => {
    fetch(`${API_BASE}/api/reminders/`)
      .then(r => r.json())
      .then(data => setReminders(data.reminders))
      .catch(e => console.error("Failed to fetch reminders", e))
  }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!title || !time) return

    const newReminder = {
      id: Date.now(),
      title,
      time,
      type
    }

    try {
      const res = await fetch(`${API_BASE}/api/reminders/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReminder)
      })
      const data = await res.json()
      setReminders(data.reminders)
      setTitle('')
      setTime('')
    } catch (e) {
      console.error("Failed to add reminder", e)
    }
  }

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/reminders/${id}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      setReminders(data.reminders)
    } catch (e) {
      console.error("Failed to delete reminder", e)
    }
  }

  return (
    <div className="animate-fade-in">
      <h1 className="page-title">Personal Health Reminders</h1>
      
      <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 400px' }}>
        <div className="card">
          <div className="card-header"><Bell size={24} color="var(--primary)" /> Active Reminders</div>
          
          {reminders.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {reminders.map(r => (
                <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', background: 'rgba(0,0,0,0.2)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.75rem', background: 'rgba(91, 108, 249, 0.1)', borderRadius: '12px' }}>
                      <Clock size={20} color="var(--primary)" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{r.title}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Type: {r.type.toUpperCase()}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.2rem' }}>{r.time}</div>
                    <button 
                      onClick={() => handleDelete(r.id)}
                      style={{ background: 'transparent', border: 'none', color: 'rgba(239, 68, 68, 0.5)', cursor: 'pointer', padding: '0.5rem' }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(239, 68, 68, 0.5)'}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No reminders set. Add one to stay on track!</p>
          )}
        </div>

        <div className="card">
          <div className="card-header"><Plus size={20} /> Add New Reminder</div>
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Reminder Title</label>
              <input 
                type="text" 
                placeholder="e.g., Take eye drops" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Time</label>
              <input 
                type="time" 
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Reminder Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="general">General Health</option>
                <option value="eye">Eye Care</option>
                <option value="oral">Oral Hygiene</option>
              </select>
            </div>

            <button type="submit" className="btn btn-block" style={{ marginTop: '0.5rem' }}>
              Create Reminder
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
