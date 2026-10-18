import React, { useEffect, useState, useMemo } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import {
  Clock, Eye, Smile, Filter, Activity, TrendingUp, Calendar, AlertCircle, Sparkles, CheckCircle2
} from 'lucide-react'
import { API_BASE } from '../config/api'

// Custom tooltip with high contrast and executive medical styling
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{
        background: 'rgba(13, 21, 38, 0.95)',
        border: '1px solid rgba(99, 102, 241, 0.4)',
        borderRadius: '10px',
        padding: '0.75rem 1rem',
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(10px)',
        color: '#f8fafc'
      }}>
        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
          📅 {label}
        </div>
        <div style={{ fontSize: '1rem', fontWeight: 700, color: '#6ee7b7' }}>
          {payload[0].value}% Confidence
        </div>
        <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '2px' }}>
          Screenings recorded: {data.scan_count || 1}
        </div>
      </div>
    );
  }
  return null;
};

export default function History({ user }) {
  const [history, setHistory] = useState([])
  const [graphData, setGraphData] = useState([])
  const [filterType, setFilterType] = useState('all') // 'all' | 'eye' | 'oral'
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        const histRes = await fetch(`${API_BASE}/api/history/${user.user_id}`)
        const histData = await histRes.json()
        setHistory(histData.history || [])

        const graphRes = await fetch(`${API_BASE}/api/history/graph/${user.user_id}`)
        const graphDataRes = await graphRes.json()
        setGraphData(graphDataRes.graph_data || [])
      } catch (e) {
        console.error("Failed to fetch history", e)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  // Filter history records
  const filteredHistory = useMemo(() => {
    if (filterType === 'all') return history;
    return history.filter(item => {
      const type = (item.scan_type || '').toLowerCase();
      if (filterType === 'eye') return type.includes('eye');
      if (filterType === 'oral') return type.includes('oral') || type.includes('mouth');
      return true;
    });
  }, [history, filterType]);

  // Derived metrics
  const totalScans = history.length;
  const avgConfidence = history.length > 0
    ? (history.reduce((acc, curr) => acc + (curr.confidence || 0), 0) / history.length).toFixed(1)
    : '0';

  const normalScans = history.filter(h => (h.detected_condition || '').toLowerCase() === 'normal').length;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 className="page-title" style={{ marginBottom: '0.25rem' }}>Screening History &amp; Trends</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Temporal tracking of automated computer-vision screenings and model confidence
        </p>
      </div>

      {/* ─── Metric Highlight Cards ─── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '1.75rem'
      }}>
        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Total Screenings</span>
            <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={16} color="var(--primary)" />
            </div>
          </div>
          <div className="stat-value">{totalScans}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Registered health evaluations</div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Avg Model Confidence</span>
            <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={16} color="var(--success)" />
            </div>
          </div>
          <div className="stat-value" style={{ color: '#6ee7b7' }}>{avgConfidence}%</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Reliability across inferences</div>
        </div>

        <div className="stat-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Clear / Normal Scans</span>
            <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'rgba(6,182,212,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={16} color="var(--accent)" />
            </div>
          </div>
          <div className="stat-value" style={{ color: '#67e8f9' }}>{normalScans}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No high-risk markers flagged</div>
        </div>
      </div>

      {/* ─── Graphical Trend View ─── */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.75rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>
              Confidence Trend Progression
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Temporal trajectory of machine-learning model certainty (Last 30 Days)
            </span>
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.25)',
            padding: '4px 10px',
            borderRadius: '99px',
            fontSize: '0.75rem',
            color: 'var(--primary-light)'
          }}>
            <Sparkles size={13} />
            <span>AI Calibration Metric</span>
          </div>
        </div>

        {graphData.length > 0 ? (
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={graphData} margin={{ top: 15, right: 25, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.06)" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#64748b" 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                />
                <YAxis 
                  stroke="#64748b" 
                  domain={[0, 100]} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickFormatter={(val) => `${val}%`}
                  tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="avg_confidence" 
                  stroke="#818cf8" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#confidenceGradient)"
                  dot={{ r: 6, fill: '#6366f1', stroke: '#ffffff', strokeWidth: 2 }}
                  activeDot={{ r: 9, fill: '#8b5cf6', stroke: '#ffffff', strokeWidth: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '240px',
            color: 'var(--text-muted)',
            textAlign: 'center'
          }}>
            <Activity size={40} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
            <p style={{ fontWeight: 600 }}>No screening data logged yet</p>
            <p style={{ fontSize: '0.82rem' }}>Complete your first AI scan in the Diagnostics tab to initialize your history graph.</p>
          </div>
        )}
      </div>

      {/* ─── Detailed Scans Log ─── */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={18} color="var(--primary)" />
            Screening Records ({filteredHistory.length})
          </h3>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.04)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border)' }}>
            <button
              onClick={() => setFilterType('all')}
              style={{
                background: filterType === 'all' ? 'var(--primary)' : 'transparent',
                color: filterType === 'all' ? '#ffffff' : 'var(--text-muted)',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 12px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              All Scans
            </button>
            <button
              onClick={() => setFilterType('eye')}
              style={{
                background: filterType === 'eye' ? 'var(--primary)' : 'transparent',
                color: filterType === 'eye' ? '#ffffff' : 'var(--text-muted)',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 12px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              👁️ Eye Only
            </button>
            <button
              onClick={() => setFilterType('oral')}
              style={{
                background: filterType === 'oral' ? 'var(--primary)' : 'transparent',
                color: filterType === 'oral' ? '#ffffff' : 'var(--text-muted)',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 12px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              🦷 Oral Only
            </button>
          </div>
        </div>

        {filteredHistory.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {filteredHistory.map((record) => {
              const isNormal = (record.detected_condition || '').toLowerCase() === 'normal';
              const isEye = (record.scan_type || '').toLowerCase().includes('eye');
              const accentColor = isNormal ? 'var(--success)' : 'var(--warning)';

              return (
                <div 
                  key={record.id} 
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1.1rem 1.25rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border)',
                    borderLeft: `4px solid ${accentColor}`,
                    borderRadius: '12px',
                    transition: 'all 0.2s ease',
                    flexWrap: 'wrap',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: 42,
                      height: 42,
                      borderRadius: '10px',
                      background: isEye ? 'rgba(6,182,212,0.15)' : 'rgba(245,158,11,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem'
                    }}>
                      {isEye ? '👁️' : '🦷'}
                    </div>

                    <div>
                      <div style={{
                        fontWeight: 700,
                        fontSize: '1rem',
                        color: '#ffffff',
                        marginBottom: '0.2rem'
                      }}>
                        {record.detected_condition}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span>Mode: <strong style={{ color: '#cbd5e1' }}>{record.scan_type?.toUpperCase()}</strong></span>
                        <span>•</span>
                        <span>{new Date(record.timestamp).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      background: isNormal ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                      color: isNormal ? '#6ee7b7' : '#fcd34d',
                      border: `1px solid ${isNormal ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
                      padding: '4px 12px',
                      borderRadius: '99px',
                      fontSize: '0.8rem',
                      fontWeight: 700
                    }}>
                      {record.confidence ? `${record.confidence.toFixed(1)}% Confidence` : 'Screened'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
            <AlertCircle size={32} style={{ opacity: 0.4, marginBottom: '0.5rem' }} />
            <p>No screening entries match this filter.</p>
          </div>
        )}
      </div>
    </div>
  )
}
