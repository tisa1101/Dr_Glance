import React, { useEffect, useState } from 'react'
import { Activity, Droplet, Sun, Bell, Apple, HeartPulse } from 'lucide-react'

export default function Dashboard({ user }) {
  const [tips, setTips] = useState(null)
  const [diet, setDiet] = useState(null)

  useEffect(() => {
    // Fetch diet and tips from backend
    fetch('http://127.0.0.1:8000/api/diet/tips')
      .then(r => r.json())
      .then(data => setTips(data.tips))
      .catch(e => console.log('Mock/Offline tip fetch', e))

    const dietEndpoint = user ? `http://127.0.0.1:8000/api/diet/diet/${user.user_id}` : 'http://127.0.0.1:8000/api/diet/diet'
    fetch(dietEndpoint)
      .then(r => r.json())
      .then(data => setDiet(data.diet))
      .catch(e => console.log('Mock/Offline diet fetch', e))
  }, [user])

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Welcome back, {user ? user.name.split(' ')[0] : 'User'} 👋</h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(34, 197, 94, 0.1)', padding: '0.75rem 1.5rem', borderRadius: '99px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
          <HeartPulse size={24} color="var(--success)" />
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Wellness Score</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--success)' }}>94 / 100</div>
          </div>
        </div>
      </div>
      
      <div className="dashboard-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Quick Stats */}
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <div className="card" style={{ flex: 1, margin: 0, borderTop: '4px solid #5b6cf9' }}>
              <div className="card-header"><Activity size={24} color="#5b6cf9" /> Last Eye Scan</div>
              <p style={{ fontSize: '1.75rem', fontWeight: 600 }}>Normal</p>
              <p className="badge badge-success" style={{ marginTop: '1rem', display: 'inline-block' }}>98% Confidence</p>
            </div>
            <div className="card" style={{ flex: 1, margin: 0, borderTop: '4px solid #eab308' }}>
              <div className="card-header"><Droplet size={24} color="#eab308" /> Last Oral Scan</div>
              <p style={{ fontSize: '1.75rem', fontWeight: 600 }}>Plaque Detected</p>
              <p className="badge badge-warning" style={{ marginTop: '1rem', display: 'inline-block' }}>Action Needed</p>
            </div>
          </div>

          {/* Daily Tips */}
          <div className="card">
            <div className="card-header"><Sun size={20} color="#22d3ee" /> Daily Health Tips</div>
            {tips ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>👁️ Eye Care</h4>
                  <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {tips.eye.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>👄 Oral Care</h4>
                  <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {tips.oral.map((t, i) => <li key={i}>{t}</li>)}
                  </ul>
                </div>
              </div>
            ) : (
              <p>Loading daily tips...</p>
            )}
          </div>
        </div>

        {/* Side Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Diet Recommendations */}
          <div className="card" style={{ margin: 0 }}>
            <div className="card-header"><Apple size={20} /> Personalized Diet Plan</div>
            {diet ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid var(--primary)' }}>
                  <h4 style={{ color: 'var(--primary)', marginBottom: '0.25rem' }}>{diet.eye[0]?.food}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{diet.eye[0]?.benefit}</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid var(--accent)' }}>
                  <h4 style={{ color: 'var(--accent)', marginBottom: '0.25rem' }}>{diet.oral[0]?.food}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{diet.oral[0]?.benefit}</p>
                </div>
              </div>
            ) : (
              <p>Loading diet suggestions...</p>
            )}
          </div>

          {/* Reminders Widget */}
          <div className="card" style={{ margin: 0 }}>
            <div className="card-header"><Bell size={20} /> Upcoming Reminders</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                <span>Drink Water</span>
                <span style={{ color: 'var(--primary)' }}>14:00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                <span>20-20-20 Break</span>
                <span style={{ color: 'var(--primary)' }}>15:30</span>
              </div>
            </div>
            <button className="btn btn-secondary" style={{ width: '100%', marginTop: '1rem' }}>+ Add Reminder</button>
          </div>
        </div>
      </div>
    </div>
  )
}
