import React, { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Clock } from 'lucide-react'

export default function History({ user }) {
  const [history, setHistory] = useState([])
  const [graphData, setGraphData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        const histRes = await fetch(`http://127.0.0.1:8000/api/history/${user.user_id}`)
        const histData = await histRes.json()
        setHistory(histData.history)

        const graphRes = await fetch(`http://127.0.0.1:8000/api/history/graph/${user.user_id}`)
        const graphDataRes = await graphRes.json()
        setGraphData(graphDataRes.graph_data)
      } catch (e) {
        console.error("Failed to fetch history", e)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  if (loading) return <div>Loading history...</div>

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      <h1 className="page-title">Health History</h1>
      
      <div className="card" style={{ height: '400px', marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Confidence Trend (Last 30 Days)</h3>
        {graphData.length > 0 ? (
          <ResponsiveContainer width="100%" height="80%">
            <LineChart data={graphData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="avg_confidence" stroke="var(--primary)" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-muted)' }}>
            No chart data available. Take more scans!
          </div>
        )}
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={20} /> Past Scans
        </h3>
        {history.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {history.map((record) => (
              <div key={record.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.25rem', color: record.detected_condition.toLowerCase() === 'normal' ? 'var(--success)' : 'var(--warning)' }}>
                    {record.detected_condition}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Type: {record.scan_type.toUpperCase()} | Date: {new Date(record.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className="badge badge-success">
                  {record.confidence.toFixed(1)}% Confidence
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)' }}>No previous scans found.</p>
        )}
      </div>
    </div>
  )
}
