import React, { useState, useEffect } from 'react'
import { Apple, Sun, Info, Heart, ChevronRight, Activity, Zap } from 'lucide-react'
import { API_BASE } from '../config/api'

export default function DietTips({ user }) {
  const [tips, setTips] = useState(null)
  const [diet, setDiet] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const tipsRes = await fetch(`${API_BASE}/api/diet/tips`)
        const tipsData = await tipsRes.json()
        setTips(tipsData.tips)

        const dietEndpoint = user ? `${API_BASE}/api/diet/diet/${user.user_id}` : `${API_BASE}/api/diet/diet`
        const dietRes = await fetch(dietEndpoint)
        const dietData = await dietRes.json()
        setDiet(dietData.diet)
      } catch (e) {
        console.error("Failed to fetch diet/tips", e)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [user])

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>Loading nutrition guide...</div>

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Personalized Nutrition & Care</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '-1.5rem', marginBottom: '2rem' }}>
          Tailored recommendations based on your recent AI diagnostic history.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Personalized Diet */}
          <div className="card" style={{ margin: 0 }}>
            <div className="card-header"><Apple size={24} color="var(--success)" /> Superfoods For Your Health</div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="diet-section">
                <h4 style={{ marginBottom: '1rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Activity size={18} /> For Eye Health
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {diet?.eye.map((item, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.25rem' }}>{item.food}</div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.benefit}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="diet-section">
                <h4 style={{ marginBottom: '1rem', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Zap size={18} /> For Oral Health
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {diet?.oral.map((item, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.25rem' }}>{item.food}</div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.benefit}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Daily Tips */}
          <div className="card" style={{ margin: 0 }}>
            <div className="card-header"><Sun size={24} color="var(--warning)" /> Expert Daily Tips</div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <h5 style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px', marginBottom: '0.75rem' }}>Eye Care Routine</h5>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {tips?.eye.map((tip, i) => (
                    <li key={i} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.9rem' }}>
                      <ChevronRight size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <h5 style={{ color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '1px', marginBottom: '0.75rem' }}>Oral Care Routine</h5>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {tips?.oral.map((tip, i) => (
                    <li key={i} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.9rem' }}>
                      <ChevronRight size={16} color="var(--accent)" style={{ flexShrink: 0 }} />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="card" style={{ margin: 0, background: 'linear-gradient(135deg, rgba(91, 108, 249, 0.1), rgba(0, 230, 230, 0.1))' }}>
            <div className="card-header"><Heart size={20} /> Pro Tip</div>
            <p style={{ fontSize: '0.95rem' }}>
              Consistency is key! Following these simple dietary adjustments and care routines can improve your wellness score by up to 15% in just two weeks.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
